# UOW-01 Foundation and Registration — Domain Entities

## Domain Boundary

The registration domain contains a small identity aggregate plus owned starter catalogs. Currency is shared reference data. Secrets and API problems are transient domain/application values, not business records.

## Persisted Entities

### Currency

| Field | Rule in UOW-01 |
|---|---|
| id | Stable primary identifier |
| code | Required unique ISO-style code; COP and USD are initially seeded |
| name | Required English display name in the seed |
| decimals | Non-negative display precision |
| is_active | COP must be active and available for registration preference |

Currency is shared, read-only reference data from the registration use case's perspective. Registration links the user to COP; it never creates or edits a currency.

### AppUser

| Field | Rule in UOW-01 |
|---|---|
| id | Primary identifier generated during persistence |
| email | Required normalized lowercase email; globally unique |
| password_hash | Required adaptive hash; never public or logged |
| preferred_currency_id | Required reference to seeded COP |
| is_active | True at registration |
| created_at, updated_at | Server-managed audit timestamps |

AppUser has no role in the MVP. It becomes the owner of the copied catalog entities but does not own the shared Currency.

### Category

| Field | Rule in UOW-01 |
|---|---|
| id | Primary identifier |
| user_id | Required new-user owner |
| name | One of Needs, Wants, Other |
| is_active | True at registration |
| created_at, updated_at | Server-managed audit timestamps |

The active name is unique case-insensitively within the owner. UOW-01 creates no Subcategory.

### PaymentMethod

| Field | Rule in UOW-01 |
|---|---|
| id | Primary identifier |
| user_id | Required new-user owner |
| name | One of Cash, Card, Transfer |
| is_active | True at registration |
| created_at, updated_at | Server-managed audit timestamps |

The active name is unique case-insensitively within the owner.

### IncomeSource

| Field | Rule in UOW-01 |
|---|---|
| id | Primary identifier |
| user_id | Required new-user owner |
| name | One of Salary, Other |
| is_active | True at registration |
| created_at, updated_at | Server-managed audit timestamps |

The active name is unique case-insensitively within the owner.

## Relationships and Cardinality

| Source | Relationship | Target | UOW-01 cardinality after success |
|---|---|---|---|
| Currency COP | Preferred by | AppUser | One COP reference per new user |
| AppUser | Owns | Category | Exactly three newly copied rows |
| AppUser | Owns | PaymentMethod | Exactly three newly copied rows |
| AppUser | Owns | IncomeSource | Exactly two newly copied rows |

The registration aggregate is persisted atomically even though the catalog entities later have independent edit/archive lifecycles in HU-005 and HU-006.

## Transient Values

### RegisterCommand

Carries email, password, and password_confirmation from the transport boundary. It is request-scoped and must not be logged or persisted as a whole.

### NormalizedEmail

A validated value produced by trimming surrounding whitespace and lowercasing. Its invariants are valid representation and canonical comparison/storage form. Normalization is idempotent.

### PasswordCandidate

A request-scoped secret value with an inclusive length of 8–128. It may be compared to confirmation and passed to the hasher, then must become unreachable from business state. It is never part of a result, problem, log field, or persisted client state.

### CatalogTemplate

An immutable, versioned application definition containing the exact English default names. It is not a shared editable catalog. The initialization behavior copies its entries into user-owned entities.

### RegistrationResult

Contains only public user id, normalized email, preferred currency code, and a safe confirmation message. It proves the transaction committed; it does not prove or create authentication.

### ApiProblem

Represents a safe public failure with type, title, status, stable code, detail, and optional field_errors. It never carries a secret, hash, internal exception, SQL detail, or stack trace.

## Aggregate Invariants

1. AppUser.email is normalized and globally unique.
2. AppUser.password_hash is present and plaintext password is absent from persistence.
3. AppUser.preferred_currency is the existing shared active COP entity.
4. Every starter catalog belongs to the same new AppUser.
5. A successful aggregate contains exactly 3 Categories, 3 Payment Methods, and 2 Income Sources.
6. All starter catalog rows are active and their names are unique within their entity type and owner.
7. The aggregate either persists completely or not at all.
8. The aggregate contains no Account, Subcategory, session, role, financial movement, budget, attachment, or AI data.

## Lifecycle

| Moment | Allowed domain state |
|---|---|
| Before validation | No entity exists; only request-scoped raw values |
| After validation | NormalizedEmail and valid PasswordCandidate exist transiently |
| After hashing | New AppUser and catalog entities may be constructed; plaintext is no longer needed |
| Before commit | Complete aggregate is staged but not publicly successful |
| After commit | Public RegistrationResult may be created; owned catalogs can later be customized by their own stories |
| On any failure | No partial registration aggregate is observable |

## Explicitly Deferred Entities

Account, Subcategory, Expense, ExpenseItem, ReceiptAttachment, Income, Transfer, Budget, session/renewable credentials, and any AI proposal are not created or modified by HU-001. Their presence in the wider conceptual schema does not expand this unit's behavior.
