# UML Diagrams — Finance AI Tracker

> **Status:** GENERATED — auto-inferred from existing repository data (2026-08-25).
> **Sources:** `docs/schema.sql` · `docs/SCHEMA.md` · `docs/ARCHITECTURE.md` · `docs/ALCANCE.md` ·
> `docs/FEATURES.md` · `docs/BACKLOG-AND-STORIES.md` · `docs/STACK.md` · `docs/step5-plan.md`.
> **Historical design snapshot:** these diagrams were generated from documents on 2026-08-25,
> before the current frontend/backend implementation. They are not the source for the PGC component
> diagram. The existing editable component source is the locally untracked
> `docs/diagrams/architecture-components.puml` (see `docs/diagrams/README.md` for its evidence
> and validation limits). Mermaid flowcharts,
> the DFDs in `ARCHITECTURE.md`, and the ERD in `SCHEMA.md` are not formal UML component diagrams.
> **Original validation:** the 2026-08-25 diagrams were rendered with `mmdc` 11.16.0 and Chrome.
> The revised sequences below require separate render validation before academic submission.
> **Roles caveat:** Admin appears here per `docs/ALCANCE.md` ("Roles & Permissions"). Note that
> `docs/step5-plan.md` Q1 deliberately **excludes Admin from the architecture diagrams** (project
> decision) — the use case diagram below keeps both actors until that decision is revisited.

## Inventory (text alternative)

| # | Diagram | Shows | Source data |
|---|---------|-------|-------------|
| 1 | Use Case | 2 actors (User, Admin) + 12 use cases, Phase 2/3 marked | ALCANCE roles · FEATURES phases · backlog |
| 2 | Class (historical data model) | 11 classes from the original design, not the Alembic schema | schema.sql |
| 3 | Activity | Expense capture: input → AI parsing → preview → Confirm/Edit/Discard | ALCANCE processing flow · DFD 1 |
| 4 | State machine | Expense lifecycle: received → parsing → preview → saved / discarded → edited / deleted | ALCANCE pre/post-save |
| 5 | Deployment (historical VM proposal) | Android phone ↔ VM (API + PostgreSQL + local disk) + external LLM | STACK.md · step5 Q2–Q3 |
| 6 | Sequence ×3 | (a) receipt proposal and confirmation, (b) renewable session login, (c) proposed Phase 3 AI chat | Implemented API · historical Phase 3 proposal |

> The ER diagram already lives in `docs/SCHEMA.md` (Mermaid `erDiagram`) — not duplicated here.
> Re-render it anytime by importing `docs/schema.sql` into dbdiagram.io (Import → PostgreSQL).

---

## 1. Use Case Diagram

```mermaid
flowchart TD
    subgraph System["Finance AI Tracker — system boundary"]
        UC1(("Registrarse"))
        UC2(("Iniciar sesión"))
        UC3(("Registrar gasto<br/>foto / audio / texto"))
        UC4(("Confirmar / Editar /<br/>Descartar captura"))
        UC5(("Registrar ingreso"))
        UC6(("Ver dashboard y análisis"))
        UC7(("Exportar datos"))
        UC8(("Establecer límites de gasto"))
        UC9(("Chat con la IA"))
        UC10(("Gestionar usuarios"))
        UC11(("Ver estadísticas del sistema"))
        UC12(("Configurar API key"))
    end
    User["«actor» User"]
    Admin["«actor» Admin"]

    User --> UC1
    User --> UC2
    User --> UC3
    User --> UC4
    User --> UC5
    User --> UC6
    User --> UC7
    User --> UC8
    User --> UC9
    Admin --> UC10
    Admin --> UC11
    Admin --> UC12
    UC3 -.->|"«include»"| UC4
```

Legend: ellipses = use cases · rectangles = actors · UC8 = Phase 2 · UC9 = Phase 3 (optional) ·
UC10–UC12 = Admin only (per `ALCANCE.md`, Admin does not view individual user data).

## 2. Class Diagram (historical data model, from schema.sql)

The effective database structure must be checked against backend SQLAlchemy models and Alembic
migrations. This diagram preserves the earlier `schema.sql` design and should not be used as a
current table inventory.

```mermaid
classDiagram
    class Role {
        +int id
        +String name
    }
    class User {
        +int id
        +String email
        +String password_hash
        +int role_id
        +int preferred_currency_id
    }
    class Category {
        +int id
        +String name
    }
    class Subcategory {
        +int id
        +int category_id
        +String name
    }
    class Currency {
        +int id
        +String code
    }
    class PaymentMethod {
        +int id
        +String name
    }
    class Receipt {
        +int id
        +int user_id
        +String store
        +Date date
        +int currency_id
        +String purchase_reason
        +Decimal total
        +int payment_method_id
        +String image
    }
    class Expense {
        +int id
        +int user_id
        +int receipt_id
        +int subcategory_id
        +String name
        +Decimal amount
        +String item_reason
    }
    class SpendingLimit {
        +int id
        +int user_id
        +String name
        +Decimal amount
        +String period
        +int subcategory_id
        +int category_id
    }
    class IncomeSource {
        +int id
        +String name
    }
    class Income {
        +int id
        +int user_id
        +int income_source_id
        +int currency_id
        +Decimal amount
        +Date date
        +String description
    }

    User "1" --> "0..*" Expense : registra
    User "1" --> "0..*" Receipt : registra
    User "1" --> "0..*" Income : registra
    User "1" --> "0..*" SpendingLimit : establece
    User "1" --> "1" Role : tiene
    User "0..1" --> "1" Currency : prefiere
    Expense "0..*" --> "1" Subcategory : pertenece a
    Subcategory "0..*" --> "1" Category : tiene
    Expense "0..*" --> "1" Receipt : pertenece a
    Receipt "1" --> "0..*" Expense : contiene
    Receipt "0..*" --> "1" Currency : usa
    Receipt "0..*" --> "1" PaymentMethod : usa
    Income "0..*" --> "1" IncomeSource : pertenece a
    Income "0..*" --> "1" Currency : usa
    SpendingLimit "0..*" --> "0..1" Subcategory : apunta a (XOR)
    SpendingLimit "0..*" --> "0..1" Category : apunta a (XOR)

    note for User "PK: id · UK: email · FK: role_id, preferred_currency_id"
    note for Receipt "FK: user_id, currency_id, payment_method_id · total CHECK > 0"
    note for Expense "FK: user_id, receipt_id, subcategory_id · amount CHECK > 0"
    note for SpendingLimit "XOR (DB CHECK): exactly one of subcategory_id / category_id"
    note for Income "FK: user_id, income_source_id, currency_id · amount CHECK > 0"
```

## 3. Activity Diagram — capture an expense

```mermaid
flowchart TD
    Start([Inicio]) --> Pick{¿Método de entrada?}
    Pick -->|"foto del recibo"| AI[AI parsing<br/>imagen → JSON]
    Pick -->|"audio / nota de voz"| AI
    Pick -->|"texto manual"| Preview[Vista previa editable]
    AI --> Preview
    Preview --> Action{¿Acción del usuario?}
    Action -->|"Confirmar"| Save[Guardar en DB<br/>recibo + gastos + imagen]
    Action -->|"Editar"| Preview
    Action -->|"Descartar"| Fin([Fin — nada se guarda])
    Save --> Fin
```

## 4. State Machine — expense lifecycle

```mermaid
stateDiagram-v2
    [*] --> Recibido : input (foto / audio / texto)
    Recibido --> Procesando : AI parsing (foto / audio)
    Recibido --> Preview : entrada manual
    Procesando --> Preview : JSON estructurado
    Preview --> Preview : Editar
    Preview --> Guardado : Confirmar
    Preview --> Descartado : Descartar
    Guardado --> Editado : editar post-guardado
    Guardado --> Eliminado : eliminar
    Editado --> Guardado : guardar cambios
    Descartado --> [*]
    Eliminado --> [*]
```

## 5. Deployment Diagram (historical VM proposal from STACK.md)

This diagram retains the original VM and server-file-storage design. In the implemented flow,
confirmed receipt photos are cached encrypted on the device, local development uses Compose with
PostgreSQL, and the backend repository has a separate Cloud Run deployment workflow. Do not use
this older diagram to claim the current production topology.

```mermaid
flowchart TD
    subgraph DevicePhone["Dispositivo: teléfono Android"]
        App["Flutter App<br/>thin client — necesita internet"]
    end

    subgraph NodeVM["Nodo: VM (Docker Compose)"]
        API["Contenedor: API — FastAPI (Python)<br/>auth · gastos · ingresos · AI parsing"]
        DB[("Contenedor: PostgreSQL<br/>main DB")]
        FS[("Volumen: disco local<br/>imágenes de recibos")]
    end

    LLM["Externo: LLM Provider<br/>Gemini flash (default)"]

    App -->|"HTTPS / JSON (REST + opaque Bearer)"| API
    API -->|"SQL / CRUD"| DB
    API -->|"upload / read media"| FS
    API -->|"provider API — prompt + input"| LLM
```

## 6. Sequence Diagrams

### 6a — Receipt photo proposal and confirmation (implemented API)

```mermaid
sequenceDiagram
    actor U as User
    participant App as Flutter App
    participant API as Backend (FastAPI)
    participant LLM as LLM Provider
    participant DB as PostgreSQL

    U->>App: toma foto del recibo
    App->>API: POST /api/v1/receipts/proposal (imagen)
    API->>LLM: prompt + imagen
    LLM-->>API: JSON estructurado (items, tienda, total, fecha, método)
    API->>DB: guardar propuesta temporal estructurada
    API-->>App: propuesta estructurada con campos editables
    App-->>U: mostrar Confirmar / Editar / Descartar
    U->>App: Confirmar
    App->>API: POST /api/v1/receipts/proposal/{id}/confirm
    API->>DB: guardar operación financiera confirmada
    DB-->>API: ok
    API-->>App: guardado confirmado
    App->>App: guardar foto confirmada cifrada en el dispositivo
    App-->>U: confirmación
```

### 6b — Login with renewable opaque session (implemented API)

```mermaid
sequenceDiagram
    actor U as User
    participant App as Flutter App
    participant API as Backend (FastAPI)
    participant DB as PostgreSQL

    U->>App: email + contraseña
    App->>API: POST /api/v1/auth/login
    API->>DB: SELECT usuario por email
    DB-->>API: usuario y hash de contraseña
    API->>API: verificar hash
    API->>DB: guardar hashes de credenciales y sesión
    API-->>App: acceso opaco + credencial renovable
    App->>App: acceso en memoria y renovable en secure storage
    App-->>U: sesión iniciada
```

### 6c — Ask the AI (OPTIONAL Phase 3)

```mermaid
sequenceDiagram
    actor U as User
    participant App as Flutter App
    participant API as Backend (FastAPI)
    participant Agent as AI Agent / Tools (Phase 3)
    participant LLM as LLM Provider
    participant DB as PostgreSQL

    U->>App: pregunta en lenguaje natural
    App->>API: POST /chat
    API->>Agent: envía la pregunta
    Agent->>LLM: prompt + contexto
    LLM-->>Agent: entendimiento / decisión de herramienta
    Agent->>DB: tool call — consulta read-only
    DB-->>Agent: filas de resultado
    Agent-->>API: respuesta / datos para gráfico
    API-->>App: respuesta
    App-->>U: respuesta (texto / gráfico)
```

---

## Notes

- **Original generation:** these diagrams were derived from repository documents in 2026-08-25.
  The historical class diagram mirrors the earlier `docs/schema.sql`; the use cases mirror
  `ALCANCE.md` roles + `FEATURES.md` phases; the flows mirror `ALCANCE.md` + the DFDs in
  `docs/ARCHITECTURE.md`.
- **Current code exists:** backend `openapi.json`, routers, models and migrations provide the
  implementation evidence. `docs/CONTEXT.md` records the pre-code planning period, not current
  workspace status. The PGC component source and evidence are under `docs/diagrams/`.
- **ER diagram:** already present in `docs/SCHEMA.md` — regenerate via dbdiagram.io with
  `docs/schema.sql`.
- **Render:** paste any block into mermaid.live, or preview in Zed / GitHub (flowchart-based
  diagrams render everywhere; see `docs/guides/architecture-diagrams-guide.md` §6 for the C4 gotcha).
