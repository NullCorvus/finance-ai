# HU-005 REVIEW PACK — Income Sources (paste this whole file into a web chat)

> **How to use:** copy EVERYTHING from `--- INSTRUCTIONS TO THE REVIEWER ---` to the END of this file, paste it into any web chat (ChatGPT, Claude, Gemini...), and let the chat AI quiz you. The code is included, so the AI can check your answers against it. Answer in your own words — one question at a time comes to you.

---

## INSTRUCTIONS TO THE REVIEWER (AI)

You are reviewing a student's understanding of a feature they built with AI assistance. Follow these rules STRICTLY:

1. **You are a tester, not a teacher.** Never explain code unless the student has already tried twice and failed or is clearly frustrated.
2. **Ask ONE question at a time.** Never multiple questions in one message.
3. **Reject vague answers.** If the student says "the logic" or repeats the file name, say "Too vague — which specific responsibility? Where exactly?" and push for detail.
4. **Correct specifically** after each answer: state (a) what they got RIGHT, (b) what they MIXED UP, (c) what they MISSED.
5. **Memory test after each file:** ask the student to close/forget the file and explain it entirely from memory.
6. **Spot-checks:** if the student says "I know this" or wants to skip, fire one quick verification question about that topic. Wrong = keep it in rotation.
7. **Behavioral-decision markers** (easy to get wrong): deletion behavior, duplicate names, user isolation, error handling, state transitions. If the student's answer touches one, ask a deeper question about the edge case.
8. At the end, deliver a **Knowledge Risk Map**: per module, mark Mastered / Proficient / Familiar / Novice / Unknown, and list Suggested Focus.
9. The student may be shaky on HTTP/API basics — that is fine; quiz the API table as its own module.

---

## USER STORY BEING REVIEWED

- **ID:** HU-005 (Product Backlog Item PB-003, 2 story points, status In progress)
- **Story:** "As a user, I want to manage my income sources so that income entries use terms that match my finances."
- **Implementation scope:** owned income-source CRUD; editable Salary/Other defaults; migration away from archive flags; validate trimmed case-insensitive unique names; confirm permanent deletion; clear future optional historical references before deletion; refresh selectors; test ownership and rollback.
- **Acceptance (short):** editable defaults; add/rename/permanently delete; deleted values disappear from new forms while future historical transactions remain (show "Source deleted"); another user's data is unaffected.
- **Important context:** payment methods are OUT of this story (product model uses accounts). The old Trello card title "Payment Methods and Income Sources" is stale.

---

## PROJECT STRUCTURE (relevant subset)

```
/home/d3ad/codigos/finance-ai/
├── finance-ai-backend/                        # FastAPI + PostgreSQL + Alembic
│   ├── src/finance_ai/
│   │   ├── db/
│   │   │   ├── models/catalogs.py             # IncomeSource, Category, PaymentMethod, OwnedCatalogMixin
│   │   │   ├── repositories/income_sources.py # SQL queries (list/add/rename/delete/name_exists)
│   │   │   ├── uow.py                          # SQLAlchemyIncomeSourceUnitOfWork
│   │   │   └── session.py                      # session factory
│   │   └── income_sources/
│   │       ├── repositories.py                 # Protocol + IncomeSourceRecord dataclass (contracts)
│   │       ├── uow.py                          # IncomeSourceUnitOfWork Protocol
│   │       ├── schemas.py                      # Pydantic request/response models
│   │       ├── service.py                      # ★ BUSINESS RULES (create/rename/delete)
│   │       ├── dependencies.py                 # get_current_user_id, get_income_source_service
│   │       └── router.py                       # ★ API endpoints (GET/POST/PATCH/DELETE)
│   ├── migrations/versions/0004_uow03_income_source.py  # unique index per user, lower(name)
│   └── tests/ (unit: test_income_source_service.py, api: test_income_sources_api.py, ...)
│
└── finance-ai-frontend/                       # Flutter (Android + Windows)
    └── lib/features/income_sources/
        ├── domain/income_source_models.dart    # IncomeSource + failure hierarchy
        ├── data/income_sources_repository.dart # HTTP calls to /api/v1/income-sources
        └── presentation/
            ├── income_sources_state.dart       # status/items/busy/fieldErrors/diagnostic
            ├── income_sources_controller.dart  # ★ load/add/rename/delete + selector provider
            └── income_sources_screen.dart      # ★ UI: add field, tiles, rename/delete dialogs
    └── lib/core/router/app_router.dart         # route /income-sources
```

**Tier legend:** ★ = OWN IT (read every line). Others = KNOW IT EXISTS (know what + where) or TRUST THE AI (config).

---

## API CHEAT SHEET (the whole API in one table)

| Method | URL | Purpose | Success status | Body sent | Response |
|---|---|---|---|---|---|
| GET | `/api/v1/income-sources` | List my sources | 200 | none | `{"items":[{"id":1,"name":"Salary"}]}` |
| POST | `/api/v1/income-sources` | Create one | 201 | `{"name":"Salary"}` | the created object |
| PATCH | `/api/v1/income-sources/{id}` | Rename one | 200 | `{"name":"Sueldo"}` | the renamed object |
| DELETE | `/api/v1/income-sources/{id}` | Permanently delete | 204 | none | empty |

Error statuses used: 401 (not authenticated) · 404 (not found / not yours) · 409 (duplicate name) · 422 (invalid input) · 500/503 (server). JSON = `{"key": value}` text for exchanging data.

---

## SOURCE CODE (complete, for the reviewer to verify answers)

### backend/src/finance_ai/db/models/catalogs.py

```python
from datetime import datetime
from sqlalchemy import (BigInteger, Boolean, DateTime, ForeignKey, Identity, Index, String, func, text)
from sqlalchemy.orm import Mapped, mapped_column
from finance_ai.db.base import Base

class OwnedCatalogMixin:
    id: Mapped[int] = mapped_column(BigInteger, Identity(), primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("app_user.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default=text("true"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

class Category(OwnedCatalogMixin, Base):
    __tablename__ = "category"

class PaymentMethod(OwnedCatalogMixin, Base):
    __tablename__ = "payment_method"

class IncomeSource(OwnedCatalogMixin, Base):
    __tablename__ = "income_source"

Index("uq_category_active_name", Category.user_id, func.lower(Category.name), unique=True, postgresql_where=Category.is_active.is_(True))
Index("uq_payment_method_active_name", PaymentMethod.user_id, func.lower(PaymentMethod.name), unique=True, postgresql_where=PaymentMethod.is_active.is_(True))
Index("uq_income_source_user_name", IncomeSource.user_id, func.lower(IncomeSource.name), unique=True)
```

### backend/migrations/versions/0004_uow03_income_source.py

```python
"""Make income_source names unique per user without archive filtering.
Revision ID: 0004_uow03_income_source   Revises: 0003_uow02_constraint_names   Create Date: 2026-09-12"""

from collections.abc import Sequence
import sqlalchemy as sa
from alembic import op

revision: str = "0004_uow03_income_source"
down_revision: str | Sequence[str] | None = "0003_uow02_constraint_names"
branch_labels = None
depends_on = None

def upgrade() -> None:
    op.drop_index("uq_income_source_active_name", table_name="income_source")
    op.create_index("uq_income_source_user_name", "income_source", ["user_id", sa.text("lower(name)")], unique=True)

def downgrade() -> None:
    op.drop_index("uq_income_source_user_name", table_name="income_source")
    op.create_index("uq_income_source_active_name", "income_source", ["user_id", sa.text("lower(name)")], unique=True, postgresql_where=sa.text("is_active = true"))
```

### backend/src/finance_ai/income_sources/repositories.py (contract)

```python
from dataclasses import dataclass
from typing import Protocol

@dataclass(frozen=True)
class IncomeSourceRecord:
    id: int
    name: str

class IncomeSourceRepository(Protocol):
    def list_for_user(self, *, user_id: int) -> list[IncomeSourceRecord]: ...
    def find_by_id_for_user(self, *, user_id: int, income_source_id: int) -> IncomeSourceRecord | None: ...
    def name_exists(self, *, user_id: int, normalized_name: str, exclude_id: int | None = None) -> bool: ...
    def add(self, *, user_id: int, name: str) -> IncomeSourceRecord: ...
    def rename(self, *, income_source_id: int, name: str) -> IncomeSourceRecord: ...
    def delete(self, *, income_source_id: int) -> None: ...
    def clear_historical_references(self, *, user_id: int, income_source_id: int) -> None: ...
```

### backend/src/finance_ai/income_sources/uow.py (protocol)

```python
from types import TracebackType
from typing import Protocol, Self
from finance_ai.income_sources.repositories import IncomeSourceRepository

class IncomeSourceUnitOfWork(Protocol):
    income_sources: IncomeSourceRepository
    def __enter__(self) -> Self: ...
    def __exit__(self, exc_type, exc_value, traceback) -> None: ...
    def flush(self) -> None: ...
    def commit(self) -> None: ...
    def rollback(self) -> None: ...
```

### backend/src/finance_ai/income_sources/schemas.py

```python
from pydantic import BaseModel, ConfigDict
from finance_ai.income_sources.repositories import IncomeSourceRecord

class IncomeSourceResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")
    id: int
    name: str
    @classmethod
    def from_record(cls, record: IncomeSourceRecord) -> "IncomeSourceResponse":
        return cls(id=record.id, name=record.name)

class IncomeSourceListResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")
    items: list[IncomeSourceResponse]

class CreateIncomeSourceRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: str

class RenameIncomeSourceRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: str
```

### backend/src/finance_ai/income_sources/dependencies.py

```python
from typing import Annotated
from fastapi import Depends
from finance_ai.auth.dependencies import get_session_service, require_bearer_access
from finance_ai.auth.session_service import SessionService
from finance_ai.db.session import get_session_factory
from finance_ai.db.uow import SQLAlchemyIncomeSourceUnitOfWork
from finance_ai.income_sources.service import IncomeSourceService
from finance_ai.income_sources.uow import IncomeSourceUnitOfWork

def get_current_user_id(authorization: Annotated[..., Depends(require_bearer_access)], service: Annotated[SessionService, Depends(get_session_service)]) -> int:
    return service.current_user(authorization).user_id

def get_income_source_service() -> IncomeSourceService:
    def uow_factory() -> IncomeSourceUnitOfWork:
        return SQLAlchemyIncomeSourceUnitOfWork(get_session_factory())
    return IncomeSourceService(uow_factory=uow_factory)
```

### backend/src/finance_ai/income_sources/service.py ★

```python
from collections.abc import Callable
from sqlalchemy.exc import IntegrityError
from finance_ai.core.errors import (IncomeSourceNameTakenError, IncomeSourceNotFoundError, IncomeSourceValidationError)
from finance_ai.income_sources.repositories import IncomeSourceRecord
from finance_ai.income_sources.uow import IncomeSourceUnitOfWork

MAX_NAME_LENGTH = 100
UnitOfWorkFactory = Callable[[], IncomeSourceUnitOfWork]

class IncomeSourceService:
    def __init__(self, *, uow_factory: UnitOfWorkFactory) -> None:
        self.uow_factory = uow_factory

    def list(self, *, user_id: int) -> list[IncomeSourceRecord]:
        with self.uow_factory() as uow:
            return uow.income_sources.list_for_user(user_id=user_id)

    def create(self, *, user_id: int, name: str) -> IncomeSourceRecord:
        normalized = _normalize_name(name)
        try:
            with self.uow_factory() as uow:
                if uow.income_sources.name_exists(user_id=user_id, normalized_name=normalized.lower()):
                    raise IncomeSourceNameTakenError
                record = uow.income_sources.add(user_id=user_id, name=normalized)
                uow.commit()
                return record
        except IntegrityError as exc:
            if _is_income_source_unique_violation(exc):
                raise IncomeSourceNameTakenError from exc
            raise

    def rename(self, *, user_id: int, income_source_id: int, name: str) -> IncomeSourceRecord:
        normalized = _normalize_name(name)
        try:
            with self.uow_factory() as uow:
                if uow.income_sources.find_by_id_for_user(user_id=user_id, income_source_id=income_source_id) is None:
                    raise IncomeSourceNotFoundError
                if uow.income_sources.name_exists(user_id=user_id, normalized_name=normalized.lower(), exclude_id=income_source_id):
                    raise IncomeSourceNameTakenError
                record = uow.income_sources.rename(income_source_id=income_source_id, name=normalized)
                uow.commit()
                return record
        except IntegrityError as exc:
            if _is_income_source_unique_violation(exc):
                raise IncomeSourceNameTakenError from exc
            raise

    def delete(self, *, user_id: int, income_source_id: int) -> None:
        with self.uow_factory() as uow:
            if uow.income_sources.find_by_id_for_user(user_id=user_id, income_source_id=income_source_id) is None:
                raise IncomeSourceNotFoundError
            uow.income_sources.clear_historical_references(user_id=user_id, income_source_id=income_source_id)
            uow.income_sources.delete(income_source_id=income_source_id)
            uow.commit()

def _normalize_name(raw_name: str) -> str:
    normalized = raw_name.strip()
    if not normalized:
        raise IncomeSourceValidationError("Enter an income source name.")
    if len(normalized) > MAX_NAME_LENGTH:
        raise IncomeSourceValidationError(f"Income source names must be {MAX_NAME_LENGTH} characters or fewer.")
    return normalized

def _is_income_source_unique_violation(exc: IntegrityError) -> bool:
    diagnostic = getattr(exc.orig, "diag", None)
    constraint_name = getattr(diagnostic, "constraint_name", None)
    return constraint_name == "uq_income_source_user_name"
```

### backend/src/finance_ai/income_sources/router.py ★

```python
from typing import Annotated, Any
from fastapi import APIRouter, Depends, Path, Response, status
from finance_ai.core.errors import ProblemResponse
from finance_ai.income_sources.dependencies import (get_current_user_id, get_income_source_service)
from finance_ai.income_sources.schemas import (CreateIncomeSourceRequest, IncomeSourceListResponse, IncomeSourceResponse, RenameIncomeSourceRequest)
from finance_ai.income_sources.service import IncomeSourceService

router = APIRouter(prefix="/income-sources", tags=["Income Sources"])

ERROR_RESPONSES: dict[int | str, dict[str, Any]] = {401: {"model": ProblemResponse}, 404: {"model": ProblemResponse}, 409: {"model": ProblemResponse}, 422: {"model": ProblemResponse}, 500: {"model": ProblemResponse}, 503: {"model": ProblemResponse}}

@router.get("", response_model=IncomeSourceListResponse, responses=ERROR_RESPONSES)
def list_income_sources(user_id: Annotated[int, Depends(get_current_user_id)], service: Annotated[IncomeSourceService, Depends(get_income_source_service)]) -> IncomeSourceListResponse:
    return IncomeSourceListResponse(items=[IncomeSourceResponse.from_record(record) for record in service.list(user_id=user_id)])

@router.post("", status_code=status.HTTP_201_CREATED, response_model=IncomeSourceResponse, responses=ERROR_RESPONSES)
def create_income_source(payload: CreateIncomeSourceRequest, user_id: Annotated[int, Depends(get_current_user_id)], service: Annotated[IncomeSourceService, Depends(get_income_source_service)]) -> IncomeSourceResponse:
    return IncomeSourceResponse.from_record(service.create(user_id=user_id, name=payload.name))

@router.patch("/{income_source_id}", response_model=IncomeSourceResponse, responses=ERROR_RESPONSES)
def rename_income_source(income_source_id: Annotated[int, Path(ge=1)], payload: RenameIncomeSourceRequest, user_id: Annotated[int, Depends(get_current_user_id)], service: Annotated[IncomeSourceService, Depends(get_income_source_service)]) -> IncomeSourceResponse:
    return IncomeSourceResponse.from_record(service.rename(user_id=user_id, income_source_id=income_source_id, name=payload.name))

@router.delete("/{income_source_id}", status_code=status.HTTP_204_NO_CONTENT, response_class=Response, responses=ERROR_RESPONSES)
def delete_income_source(income_source_id: Annotated[int, Path(ge=1)], user_id: Annotated[int, Depends(get_current_user_id)], service: Annotated[IncomeSourceService, Depends(get_income_source_service)]) -> Response:
    service.delete(user_id=user_id, income_source_id=income_source_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
```

### backend/src/finance_ai/db/repositories/income_sources.py (SQL impl)

```python
from sqlalchemy import func, select
from sqlalchemy.orm import Session
from finance_ai.db.models.catalogs import IncomeSource
from finance_ai.income_sources.repositories import IncomeSourceRecord

class SQLAlchemyIncomeSourceRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def list_for_user(self, *, user_id: int) -> list[IncomeSourceRecord]:
        rows = self.session.scalars(select(IncomeSource).where(IncomeSource.user_id == user_id).order_by(func.lower(IncomeSource.name), IncomeSource.id)).all()
        return [IncomeSourceRecord(id=row.id, name=row.name) for row in rows]

    def find_by_id_for_user(self, *, user_id: int, income_source_id: int) -> IncomeSourceRecord | None:
        row = self.session.scalar(select(IncomeSource).where(IncomeSource.id == income_source_id, IncomeSource.user_id == user_id))
        if row is None:
            return None
        return IncomeSourceRecord(id=row.id, name=row.name)

    def name_exists(self, *, user_id: int, normalized_name: str, exclude_id: int | None = None) -> bool:
        statement = select(IncomeSource.id).where(IncomeSource.user_id == user_id, func.lower(IncomeSource.name) == normalized_name)
        if exclude_id is not None:
            statement = statement.where(IncomeSource.id != exclude_id)
        return self.session.scalar(statement.limit(1)) is not None

    def add(self, *, user_id: int, name: str) -> IncomeSourceRecord:
        row = IncomeSource(user_id=user_id, name=name, is_active=True)
        self.session.add(row)
        self.session.flush()
        return IncomeSourceRecord(id=row.id, name=row.name)

    def rename(self, *, income_source_id: int, name: str) -> IncomeSourceRecord:
        row = self.session.get(IncomeSource, income_source_id)
        if row is None:
            raise LookupError("Income source disappeared during rename")
        row.name = name
        self.session.flush()
        return IncomeSourceRecord(id=row.id, name=row.name)

    def delete(self, *, income_source_id: int) -> None:
        row = self.session.get(IncomeSource, income_source_id)
        if row is not None:
            self.session.delete(row)
            self.session.flush()

    def clear_historical_references(self, *, user_id: int, income_source_id: int) -> None:
        # No referencing table exists yet. The future financial_transaction.income_source_id
        # FK is ON DELETE SET NULL; this is the documented extension point for that cleanup.
        return None
```

### frontend/lib/features/income_sources/domain/income_source_models.dart

```dart
class IncomeSource {
  const IncomeSource({required this.id, required this.name});

  factory IncomeSource.fromJson(Map<String, Object?> json) {
    final id = json['id'];
    final name = json['name'];
    if (id is! int || name is! String) {
      throw const FormatException('Invalid income source response');
    }
    return IncomeSource(id: id, name: name);
  }

  final int id;
  final String name;
}

sealed class IncomeSourcesFailure implements Exception {
  const IncomeSourcesFailure({
    required this.code,
    required this.userMessage,
    this.fieldErrors = const {},
    this.correlationId = 'unavailable',
    this.technicalReason = 'application_failure',
  });

  final String code;
  final String userMessage;
  final Map<String, List<String>> fieldErrors;
  final String correlationId;
  final String technicalReason;
}

class IncomeSourcesValidationFailure extends IncomeSourcesFailure {
  const IncomeSourcesValidationFailure({
    required super.userMessage,
    required super.fieldErrors,
    super.correlationId,
    super.technicalReason = 'validation_failure',
  }) : super(code: 'income_source_invalid');
}

class IncomeSourcesConflictFailure extends IncomeSourcesFailure {
  const IncomeSourcesConflictFailure({
    required super.userMessage,
    super.correlationId,
    super.technicalReason = 'duplicate_conflict',
  }) : super(code: 'income_source_name_taken');
}

class IncomeSourcesNotFoundFailure extends IncomeSourcesFailure {
  const IncomeSourcesNotFoundFailure({
    required super.userMessage,
    super.correlationId,
    super.technicalReason = 'missing_resource',
  }) : super(code: 'income_source_not_found');
}

class IncomeSourcesRetryableFailure extends IncomeSourcesFailure {
  const IncomeSourcesRetryableFailure({
    required super.code,
    required super.userMessage,
    super.correlationId,
    super.technicalReason = 'retryable_failure',
  });
}
```

### frontend/lib/features/income_sources/data/income_sources_repository.dart (HTTP calls)

```dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/api/api_client.dart';
import '../../../core/api/api_problem.dart';
import '../domain/income_source_models.dart';

final incomeSourcesRepositoryProvider = Provider<IncomeSourcesRepository>((ref) {
  return HttpIncomeSourcesRepository(ref.watch(financeApiClientProvider));
});

abstract interface class IncomeSourcesRepository {
  Future<List<IncomeSource>> list({required String accessCredential});
  Future<IncomeSource> create({required String accessCredential, required String name});
  Future<IncomeSource> rename({required String accessCredential, required int id, required String name});
  Future<void> delete({required String accessCredential, required int id});
}

class HttpIncomeSourcesRepository implements IncomeSourcesRepository {
  const HttpIncomeSourcesRepository(this._apiClient);

  final FinanceApiClient _apiClient;
  static const _basePath = '/api/v1/income-sources';

  @override
  Future<List<IncomeSource>> list({required String accessCredential}) async {
    final response = await _send(() => _apiClient.getJson(_basePath, bearerCredential: accessCredential));
    if (response.statusCode == 200) {
      final items = _requireBody(response)['items'];
      if (items is! List<Object?>) throw _unexpected(response);
      try {
        return items.whereType<Map<String, Object?>>().map(IncomeSource.fromJson).toList(growable: false);
      } on FormatException {
        throw _unexpected(response);
      }
    }
    throw _failureFrom(response);
  }

  @override
  Future<IncomeSource> create({required String accessCredential, required String name}) async {
    final response = await _send(() => _apiClient.postJson(_basePath, {'name': name}, bearerCredential: accessCredential));
    if (response.statusCode == 201) return _parseSource(response);
    throw _failureFrom(response);
  }

  @override
  Future<IncomeSource> rename({required String accessCredential, required int id, required String name}) async {
    final response = await _send(() => _apiClient.patchJson('$_basePath/$id', {'name': name}, bearerCredential: accessCredential));
    if (response.statusCode == 200) return _parseSource(response);
    throw _failureFrom(response);
  }

  @override
  Future<void> delete({required String accessCredential, required int id}) async {
    final response = await _send(() => _apiClient.deleteJson('$_basePath/$id', bearerCredential: accessCredential));
    if (response.statusCode == 204) return;
    throw _failureFrom(response);
  }

  // Error mapping: income_source_invalid -> ValidationFailure,
  // income_source_name_taken -> ConflictFailure,
  // income_source_not_found -> NotFoundFailure, otherwise RetryableFailure.
  // All failures carry code, safe userMessage, correlationId, technicalReason.
}
```

### frontend/lib/features/income_sources/presentation/income_sources_state.dart

```dart
import '../../../../core/diagnostics/error_diagnostic.dart';
import '../domain/income_source_models.dart';

enum IncomeSourcesStatus { loading, ready, failure }

class IncomeSourcesState {
  const IncomeSourcesState({
    this.status = IncomeSourcesStatus.loading,
    this.items = const [],
    this.busy = false,
    this.fieldErrors = const {},
    this.diagnostic,
  });

  final IncomeSourcesStatus status;
  final List<IncomeSource> items;
  final bool busy;
  final Map<String, List<String>> fieldErrors;
  final ErrorDiagnostic? diagnostic;

  IncomeSourcesState copyWith({...}) { /* status/items/busy/fieldErrors/diagnostic, clearDiagnostic, clearFieldErrors */ }
}
```

### frontend/lib/features/income_sources/presentation/income_sources_controller.dart ★

```dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/diagnostics/error_diagnostic.dart';
import '../../auth/session/application/auth_session_controller.dart';
import '../data/income_sources_repository.dart';
import '../domain/income_source_models.dart';
import 'income_sources_state.dart';

final incomeSourcesControllerProvider = NotifierProvider<IncomeSourcesController, IncomeSourcesState>(IncomeSourcesController.new);

/// Selector feed for new-entry forms: rebuilds whenever the catalog changes.
final incomeSourceSelectorProvider = Provider<List<IncomeSource>>((ref) => ref.watch(incomeSourcesControllerProvider).items);

/// The in-memory access credential used for income-source requests.
final accessCredentialProvider = Provider<String?>((ref) => ref.watch(authSessionControllerProvider).accessCredential);

class IncomeSourcesController extends Notifier<IncomeSourcesState> {
  @override
  IncomeSourcesState build() {
    Future<void>.microtask(load);
    return const IncomeSourcesState();
  }

  String? _credential() => ref.read(accessCredentialProvider);

  Future<void> load() async {
    final credential = _credential();
    if (credential == null) {
      state = IncomeSourcesState(status: IncomeSourcesStatus.failure, diagnostic: ...('authentication_required', ...));
      return;
    }
    state = state.copyWith(status: IncomeSourcesStatus.loading, clearDiagnostic: true);
    try {
      final items = await ref.read(incomeSourcesRepositoryProvider).list(accessCredential: credential);
      state = IncomeSourcesState(status: IncomeSourcesStatus.ready, items: items);
    } on IncomeSourcesFailure catch (failure) {
      state = IncomeSourcesState(status: IncomeSourcesStatus.failure, diagnostic: _diagnosticFor(failure, operation: 'list_income_sources'));
    } on Object {
      state = IncomeSourcesState(status: IncomeSourcesStatus.failure, diagnostic: ...('unexpected_client_error', ...));
    }
  }

  Future<bool> add(String name) => _mutate(operation: 'create_income_source', action: (credential) => ref.read(incomeSourcesRepositoryProvider).create(accessCredential: credential, name: name));
  Future<bool> rename(int id, String name) => _mutate(operation: 'rename_income_source', action: (credential) => ref.read(incomeSourcesRepositoryProvider).rename(accessCredential: credential, id: id, name: name));

  Future<bool> delete(int id) async {
    final credential = _credential();
    if (credential == null) return false;
    state = state.copyWith(busy: true, clearDiagnostic: true);
    try {
      await ref.read(incomeSourcesRepositoryProvider).delete(accessCredential: credential, id: id);
      await load();
      return true;
    } on IncomeSourcesFailure catch (failure) {
      state = state.copyWith(busy: false, diagnostic: _diagnosticFor(failure, operation: 'delete_income_source'));
      return false;
    } on Object { ... return false; }
  }

  Future<bool> _mutate({required String operation, required Future<IncomeSource> Function(String credential) action}) async {
    final credential = _credential();
    if (credential == null) return false;
    state = state.copyWith(busy: true, clearDiagnostic: true, clearFieldErrors: true);
    try {
      await action(credential);
      await load();
      return true;
    } on IncomeSourcesValidationFailure catch (failure) {
      state = state.copyWith(busy: false, fieldErrors: failure.fieldErrors, diagnostic: _diagnosticFor(failure, operation: operation));
      return false;
    } on IncomeSourcesFailure catch (failure) { ... return false; }
    on Object { ... return false; }
  }
  // _diagnosticFor / _diagnostic build ErrorDiagnostic with code, operation, userMessage, correlationId, technicalReason.
}
```

### frontend/lib/features/income_sources/presentation/income_sources_screen.dart ★

```dart
// Stateful widget watching incomeSourcesControllerProvider.
// Structure: AppBar "Income Sources" -> Column:
//   - ErrorDiagnosticPanel if state.diagnostic != null
//   - Row: TextField (Key income-source-name-field, label "New income source",
//     errorText from state.fieldErrors['name']?.first, onSubmitted -> _add)
//     + FilledButton "Add" (disabled while busy)
//   - Body:
//       loading -> CircularProgressIndicator
//       failure -> "Income sources are unavailable." + Retry button
//       empty  -> "No income sources yet. Add one above."
//       else   -> ListView.separated of ListTile per source:
//           title = name
//           trailing = rename IconButton (opens _RenameIncomeSourceDialog with initialName)
//                    + delete IconButton (opens AlertDialog "Permanently delete \"name\"?
//                        Historical transactions keep the source cleared." with Cancel/Delete)
// _add: controller.add(text); if created, clear field.
// _rename: showDialog<String> -> controller.rename(source.id, newName).
// _confirmDelete: showDialog<bool> -> if confirmed true -> controller.delete(source.id).
// Widget keys: income-source-name-field, income-source-add-button, income-source-retry-button,
//   income-source-tile-{id}, income-source-rename-{id}, income-source-delete-{id},
//   income-source-delete-confirm, income-source-rename-field, income-source-rename-confirm.
```

---

## QUIZ PROTOCOL (follow after reading the code)

### Module A — Structure (3 quick questions)
1. Which folder holds the business rules and which holds the SQL queries?
2. What does the frontend controller do that the frontend screen never does?
3. Where would you go to change the REST routes? Where to change the HTTP paths on the client?

### Module B — API (5 questions)
4. Which method+URL adds a new income source? Which status code does the client expect?
5. What is the difference between POST and PATCH here?
6. What does DELETE return on success? Why might it return 404?
7. Rename "Salary" to "Sueldo": which request does the app send (method, URL, body)?
8. If the response body has a field the client didn't expect, what happens (extra="forbid" / FormatException)?

### Module C — Service business rules (behavioral)
9. What happens if you try to create an income source named "   " (spaces only)?
10. What happens if you create "Salary" as user A and then again as user B? What about user A a second time?
11. Why is `normalized.lower()` passed to `name_exists`? What rule does that enforce?
12. During rename, why check `find_by_id_for_user` FIRST? What would happen without it?
13. What does delete do BEFORE deleting the row? What would change if that step were skipped?
14. What happens if two users try to create "salary" at the exact same time? Where is that caught?

### Module D — Frontend behavior
15. If the user is not logged in, what happens when the screen loads?
16. After a successful add, why does the controller call `load()` again?
17. What does the selector provider (`incomeSourceSelectorProvider`) exist for?
18. Where is the delete confirmation? What does its message promise about history?

### Module E — Memory tests (close-file style)
19. Without looking: describe `service.create` step by step.
20. Without looking: list the 4 API endpoints with their status codes.
21. Without looking: describe what `clear_historical_references` does today — and what it is designed to do later.

### Final — Success criteria
- Student can draw the request flow from button click to database and back.
- Student can explain why each business rule exists.
- Student can predict which endpoint/status a given UI action triggers.
- Student understands the two known gaps (stub clear_historical_references; unused is_active).
- Deliver the Knowledge Risk Map + Suggested Focus list.

---

END OF REVIEW PACK
