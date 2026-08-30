# Sprint Planning — Finance AI Tracker

## Setup de infraestructura (Sprint 1 — ANTES de Auth)

### Repositorios Git
- [ ] Crear repo backend (FastAPI)
- [ ] Crear repo frontend (Flutter)
- [ ] Opcional: monorepo con carpetas `backend/` y `frontend/`

### Backend (FastAPI)
- [ ] Crear proyecto FastAPI
- [ ] Virtual environment + dependencias
  - fastapi, uvicorn, sqlalchemy, psycopg2, python-jose, passlib, bcrypt
- [ ] Estructura de carpetas:
  ```
  backend/
  ├── app/
  │   ├── main.py
  │   ├── routes/
  │   ├── models/
  │   ├── schemas/
  │   ├── services/
  │   └── config.py
  ├── requirements.txt
  ├── Dockerfile
  └── .env.example
  ```
- [ ] Archivo `.env` con variables de entorno

### Frontend (Flutter)
- [ ] Crear proyecto Flutter
- [ ] Dependencias: http, provider, camera, image_picker
- [ ] Estructura de carpetas:
  ```
  frontend/
  ├── lib/
  │   ├── main.dart
  │   ├── screens/
  │   ├── widgets/
  │   ├── services/
  │   └── models/
  ├── pubspec.yaml
  └── Dockerfile (opcional)
  ```

### Base de datos (PostgreSQL)
- [ ] Instalar PostgreSQL (Docker)
- [ ] Crear base de datos `finance_ai`
- [ ] Ejecutar `docs/schema.sql` para crear tablas
- [ ] Configurar usuario y contraseña

### Docker Compose
- [ ] Crear `docker-compose.yml`:
  ```yaml
  services:
    backend:
      build: ./backend
      ports:
        - "8000:8000"
      env_file:
        - ./backend/.env
      depends_on:
        - db
    db:
      image: postgres:16
      environment:
        POSTGRES_DB: finance_ai
        POSTGRES_USER: postgres
        POSTGRES_PASSWORD: postgres
      ports:
        - "5432:5432"
      volumes:
        - pgdata:/var/lib/postgresql/data
        - ./docs/schema.sql:/docker-entrypoint-initdb.d/schema.sql
  volumes:
    pgdata:
  ```

### API Key (free tier)
- [ ] Obtener API key de Google AI Studio (Gemini Flash)
- [ ] Guardar en `.env` como `GEMINI_API_KEY`
- [ ] **NUNCA** subir `.env` a Git

### Variables de entorno
```bash
# .env
DATABASE_URL=postgresql://postgres:postgres@db:5432/finance_ai
GEMINI_API_KEY=tu_api_key_aqui
SECRET_KEY=tu_secret_key_aqui
```

---

## Sprints

> This schedule is synchronized with `docs/BACKLOG-AND-STORIES.md` as of 2026-08-30.
> Infrastructure setup is pre-Sprint 1 work, not a user story.

### Sprint 1 — Authentication
| Tarea/HU | Prioridad |
|----------|-----------|
| HU-001: Register | Alta |
| HU-002: Login | Alta |

### Sprint 2 — Manual expense foundation
| Tarea/HU | Prioridad |
|----------|-----------|
| HU-003: Create expense manually | Media |
| HU-004: Edit & delete my expenses | Media |
| HU-005: Find my expenses | Media |

### Sprint 3 — AI-assisted capture
| Tarea/HU | Prioridad |
|----------|-----------|
| HU-006: Photo receipt happy path | Alta |
| HU-007: Photo capture failure paths | Alta |
| HU-008: Natural-language text → AI parse | Media |

### Sprint 4 — Future scope (definitions pending)
| Tarea/HU | Prioridad |
|----------|-----------|
| HU-009: Audio → AI parsing + categorization | Media — pendiente de definición |
| HU-010: Dashboard by category + date filter | Media — pendiente de definición |
| Pruebas funcionales | Tarea |
| Encuesta de usabilidad | Tarea |
