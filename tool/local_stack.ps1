param(
    [ValidateSet("start", "status", "stop", "viewer-start", "viewer-stop")]
    [string]$Action = "start"
)

$ErrorActionPreference = "Stop"

function Resolve-DockerCli {
    $installedCommand = Get-Command docker.exe -ErrorAction SilentlyContinue
    if ($null -ne $installedCommand) {
        return $installedCommand.Source
    }

    $candidates = @(
        (Join-Path $env:LOCALAPPDATA "Programs\DockerDesktop\resources\bin\docker.exe"),
        "C:\Program Files\Docker\Docker\resources\bin\docker.exe"
    )
    foreach ($candidate in $candidates) {
        if (Test-Path -LiteralPath $candidate) {
            return $candidate
        }
    }

    throw "[LOCAL_STACK_DOCKER_NOT_FOUND] Docker Desktop is required but docker.exe could not be found."
}

function Test-LoopbackPort([int]$Port) {
    $client = [System.Net.Sockets.TcpClient]::new()
    try {
        $connection = $client.ConnectAsync("127.0.0.1", $Port)
        return $connection.Wait(1000) -and $client.Connected
    }
    catch {
        return $false
    }
    finally {
        $client.Dispose()
    }
}

function Resolve-LocalPort(
    [string]$WorkspaceRoot,
    [string]$SettingName,
    [int]$DefaultPort
) {
    $configuredPort = [Environment]::GetEnvironmentVariable($SettingName)
    $environmentFile = Join-Path $WorkspaceRoot ".env"
    if ([string]::IsNullOrWhiteSpace($configuredPort) -and (Test-Path -LiteralPath $environmentFile)) {
        foreach ($line in Get-Content -LiteralPath $environmentFile) {
            $settingPattern = '^\s*' + [regex]::Escape($SettingName) + '\s*=\s*["'']?(\d+)["'']?\s*(?:#.*)?$'
            if ($line -match $settingPattern) {
                $configuredPort = $Matches[1]
                break
            }
        }
    }

    if ([string]::IsNullOrWhiteSpace($configuredPort)) {
        return $DefaultPort
    }

    $port = 0
    if (-not [int]::TryParse($configuredPort, [ref]$port) -or $port -lt 1 -or $port -gt 65535) {
        throw "[LOCAL_STACK_INVALID_PORT] $SettingName must be a number from 1 through 65535."
    }
    return $port
}

function Test-DatabasePortPublished([string]$DockerCli) {
    $serviceLines = & $DockerCli compose ps --format json database
    if ($LASTEXITCODE -ne 0) {
        throw "[LOCAL_STACK_STATUS_FAILED] Docker Compose could not inspect the database network boundary."
    }

    foreach ($line in @($serviceLines)) {
        if ([string]::IsNullOrWhiteSpace($line)) {
            continue
        }
        $service = $line | ConvertFrom-Json
        foreach ($publisher in @($service.Publishers)) {
            if ($publisher.PublishedPort -gt 0) {
                return $true
            }
        }
    }
    return $false
}

$workspaceRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$docker = Resolve-DockerCli
$apiPort = Resolve-LocalPort $workspaceRoot "API_PORT" 8000
$viewerPort = Resolve-LocalPort $workspaceRoot "POSTGRES_VIEWER_PORT" 55432
$apiBaseUrl = "http://127.0.0.1:$apiPort"

Push-Location $workspaceRoot
try {
    switch ($Action) {
        "start" {
            & $docker compose up --build --detach --wait --wait-timeout 180
            if ($LASTEXITCODE -ne 0) {
                throw "[LOCAL_STACK_START_FAILED] Docker Compose did not start successfully (exit $LASTEXITCODE)."
            }

            if (-not (Test-LoopbackPort $apiPort)) {
                throw "[LOCAL_STACK_API_UNREACHABLE] The API is not accepting loopback connections on 127.0.0.1:$apiPort."
            }
            if (Test-DatabasePortPublished $docker) {
                throw "[LOCAL_STACK_DATABASE_EXPOSED] PostgreSQL unexpectedly has a published host port."
            }

            try {
                $response = Invoke-WebRequest -UseBasicParsing -Uri "$apiBaseUrl/health/ready" -TimeoutSec 10
            }
            catch {
                throw "[LOCAL_STACK_API_NOT_READY] The API port is open but readiness did not succeed. Run '.\tool\local_stack.ps1 status' and copy its output."
            }
            if ($response.StatusCode -ne 200) {
                throw "[LOCAL_STACK_API_NOT_READY] Readiness returned HTTP $($response.StatusCode)."
            }

            Write-Host "Finance AI local stack is ready."
            Write-Host "API: $apiBaseUrl"
            Write-Host "API documentation: $apiBaseUrl/docs"
            Write-Host "PostgreSQL: private inside Docker (not exposed to Windows)"
        }
        "status" {
            & $docker compose ps
            if ($LASTEXITCODE -ne 0) {
                throw "[LOCAL_STACK_STATUS_FAILED] Docker Compose status failed (exit $LASTEXITCODE)."
            }
            Write-Host "API loopback reachable on port ${apiPort}: $(Test-LoopbackPort $apiPort)"
            Write-Host "PostgreSQL DBeaver port published: $(Test-DatabasePortPublished $docker)"
            Write-Host "DBeaver loopback reachable on port ${viewerPort}: $(Test-LoopbackPort $viewerPort)"
        }
        "viewer-start" {
            $databaseAlreadyPublished = Test-DatabasePortPublished $docker
            if ((Test-LoopbackPort $viewerPort) -and -not $databaseAlreadyPublished) {
                throw "[LOCAL_STACK_VIEWER_PORT_IN_USE] Port $viewerPort is already used by another local program."
            }

            & $docker compose -f compose.yaml -f compose.dbeaver.yaml up --detach --wait --wait-timeout 180
            if ($LASTEXITCODE -ne 0) {
                throw "[LOCAL_STACK_VIEWER_START_FAILED] The DBeaver access mode did not start successfully (exit $LASTEXITCODE)."
            }

            $viewerSql = Get-Content -LiteralPath (Join-Path $workspaceRoot "infrastructure\postgres\dbeaver-readonly.sql") -Raw
            $viewerSql | & $docker compose exec -T database sh -c 'psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" -v viewer_password="$POSTGRES_VIEWER_PASSWORD"'
            if ($LASTEXITCODE -ne 0) {
                throw "[LOCAL_STACK_VIEWER_ROLE_FAILED] The read-only DBeaver account could not be prepared (exit $LASTEXITCODE)."
            }

            $privilegeSql = "SELECT has_table_privilege('finance_ai_viewer', 'finance_ai_view.app_user', 'SELECT'), has_table_privilege('finance_ai_viewer', 'public.app_user', 'SELECT'), has_table_privilege('finance_ai_viewer', 'finance_ai_view.app_user', 'INSERT');"
            $privileges = $privilegeSql | & $docker compose exec -T database sh -c 'psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" -tA'
            if ($LASTEXITCODE -ne 0 -or ($privileges | Out-String).Trim() -ne "t|f|f") {
                throw "[LOCAL_STACK_VIEWER_PRIVILEGES_FAILED] Expected safe-view-only permissions were not verified."
            }

            $viewerIdentitySql = "SELECT current_user, current_setting('transaction_read_only');"
            $viewerIdentity = $viewerIdentitySql | & $docker compose exec -T database sh -c 'PGPASSWORD="$POSTGRES_VIEWER_PASSWORD" psql -v ON_ERROR_STOP=1 -h 127.0.0.1 -U finance_ai_viewer -d "$POSTGRES_DB" -tA'
            if ($LASTEXITCODE -ne 0 -or ($viewerIdentity | Out-String).Trim() -ne "finance_ai_viewer|on") {
                throw "[LOCAL_STACK_VIEWER_LOGIN_FAILED] The read-only DBeaver account could not authenticate safely."
            }
            if (-not (Test-LoopbackPort $viewerPort)) {
                throw "[LOCAL_STACK_VIEWER_UNREACHABLE] DBeaver cannot reach PostgreSQL at 127.0.0.1:$viewerPort."
            }

            try {
                $response = Invoke-WebRequest -UseBasicParsing -Uri "$apiBaseUrl/health/ready" -TimeoutSec 10
            }
            catch {
                throw "[LOCAL_STACK_API_NOT_READY] DBeaver access started, but the Finance AI API is not ready."
            }
            if ($response.StatusCode -ne 200) {
                throw "[LOCAL_STACK_API_NOT_READY] Readiness returned HTTP $($response.StatusCode)."
            }

            Write-Host "Finance AI read-only DBeaver access is ready."
            Write-Host "Host: 127.0.0.1"
            Write-Host "Port: $viewerPort"
            Write-Host "Database: finance_ai"
            Write-Host "Username: finance_ai_viewer"
            Write-Host "Password: use POSTGRES_VIEWER_PASSWORD from .env (or the local default in .env.example)"
        }
        "viewer-stop" {
            if (-not (Test-DatabasePortPublished $docker)) {
                Write-Host "DBeaver access is already closed. The Finance AI stack was not restarted."
                break
            }

            & $docker compose up --detach --force-recreate --wait --wait-timeout 180 database api
            if ($LASTEXITCODE -ne 0) {
                throw "[LOCAL_STACK_VIEWER_STOP_FAILED] DBeaver access could not be closed cleanly (exit $LASTEXITCODE)."
            }
            if (Test-DatabasePortPublished $docker) {
                throw "[LOCAL_STACK_DATABASE_EXPOSED] PostgreSQL still has a published host port after viewer-stop."
            }
            Write-Host "DBeaver access is closed. The database volume and Finance AI API remain available."
        }
        "stop" {
            & $docker compose down
            if ($LASTEXITCODE -ne 0) {
                throw "[LOCAL_STACK_STOP_FAILED] Docker Compose did not stop cleanly (exit $LASTEXITCODE)."
            }
            Write-Host "Finance AI local stack stopped. The PostgreSQL volume was preserved."
        }
    }
}
finally {
    Pop-Location
}
