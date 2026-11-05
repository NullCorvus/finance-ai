# Republica la presentación en https://maicol2363.github.io/finance-ai-fusagasuga/
# Uso (desde esta carpeta):  powershell -File publish-public.ps1 [-Message "texto del commit"]
#
# Copia interactive/ y los dos PDF a una carpeta temporal, QUITA las notas de estudio
# (<template class="notes">, que contienen avisos internos), clona el repositorio público
# Maicol2363/finance-ai-fusagasuga, reemplaza su contenido y sube el cambio.
# Si cambió algo visible, regenere antes los PDF con:  node export-pdf.mjs
# Requiere `gh` con sesión iniciada. GitHub Pages tarda 1-2 minutos en reflejar el cambio.
param([string]$Message = "Update the interactive Finance AI presentation")

$ErrorActionPreference = 'Stop'
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$tmp = Join-Path ([IO.Path]::GetTempPath()) ("fai-publish-" + [guid]::NewGuid().ToString('N').Substring(0, 8))
New-Item -ItemType Directory -Path $tmp | Out-Null
try {
  $repo = Join-Path $tmp 'repo'
  gh repo clone Maicol2363/finance-ai-fusagasuga $repo
  Get-ChildItem $repo -Force | Where-Object { $_.Name -ne '.git' } | Remove-Item -Recurse -Force

  Copy-Item (Join-Path $here 'interactive\*') $repo -Recurse -Force
  Copy-Item (Join-Path $here 'Finance-AI-Fusagasuga.pdf'), (Join-Path $here 'Finance-AI-Fusagasuga-principal.pdf') $repo -Force
  Remove-Item (Join-Path $repo 'assets\degradado-dorado.png') -Force -ErrorAction SilentlyContinue

  $index = Join-Path $repo 'index.html'
  $html = [IO.File]::ReadAllText($index)
  $html = [regex]::Replace($html, '(?s)\s*<template class="notes".*?</template>', '')
  if ($html -cmatch 'PENDIENTE|NO decir|NO afirmar|TODO') { throw 'Quedó texto interno en index.html; no se publica.' }
  [IO.File]::WriteAllText($index, $html, (New-Object Text.UTF8Encoding($false)))

  New-Item -ItemType File -Path (Join-Path $repo '.nojekyll') -Force | Out-Null
  $readme = @'
# Finance AI · Sustentación de Gestión del Conocimiento

Presentación interactiva del proyecto **Finance AI** (Universidad de Cundinamarca, Ingeniería de Sistemas y Computación).

- **Ver la presentación:** https://maicol2363.github.io/finance-ai-fusagasuga/
- PDF completo (13 escenas y 6 de respaldo): [Finance-AI-Fusagasuga.pdf](Finance-AI-Fusagasuga.pdf)
- PDF de las 13 escenas principales: [Finance-AI-Fusagasuga-principal.pdf](Finance-AI-Fusagasuga-principal.pdf)

Teclas: `→` avanza, `←` retrocede, `A`–`F` abren el respaldo técnico (`Esc` vuelve), `Mayús+F` pantalla completa, `V` reduce o activa el movimiento.
'@
  [IO.File]::WriteAllText((Join-Path $repo 'README.md'), $readme, (New-Object Text.UTF8Encoding($false)))

  Push-Location $repo
  git add -A
  if (-not (git status --porcelain)) { Write-Host 'Sin cambios que publicar.'; return }
  git commit -q -m $Message
  $ok = $false
  foreach ($try in 1..4) {
    git push -q origin main
    if ($LASTEXITCODE -eq 0) { $ok = $true; break }
    Write-Host "El push falló (intento $try de 4); reintentando en 10 s..."
    Start-Sleep -Seconds 10
  }
  if (-not $ok) { throw 'GitHub rechazó el push cuatro veces; no se publicó nada. Vuelva a intentarlo en unos minutos.' }
  $head = gh api repos/Maicol2363/finance-ai-fusagasuga/commits --jq '.[0].commit.message'
  if ($head -ne $Message) { throw "El último commit remoto no es el nuevo ($head); revise antes de dar por publicado." }
  Write-Host 'Publicado y verificado en GitHub. Disponible en 1-2 minutos: https://maicol2363.github.io/finance-ai-fusagasuga/'
  Pop-Location
}
finally {
  Set-Location $here
  Remove-Item $tmp -Recurse -Force -ErrorAction SilentlyContinue
}
