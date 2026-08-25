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

### Sprint 1
| Tarea/HU | Prioridad |
|----------|-----------|
| Setup infraestructura | Técnica |
| HU-001: Auth multi-usuario | Alta |

### Sprint 2
| Tarea/HU | Prioridad |
|----------|-----------|
| HU-002: Photo → AI extraction + categorization | Alta |

### Sprint 3
| Tarea/HU | Prioridad |
|----------|-----------|
| HU-003: Audio → AI parsing + categorization | Media |
| HU-004: Text/Manual input | Media |

### Sprint 4
| Tarea/HU | Prioridad |
|----------|-----------|
| HU-005: Dashboard por categoría + filtro período | Media |
| Pruebas funcionales | Tarea |
| Encuesta de usabilidad | Tarea |
