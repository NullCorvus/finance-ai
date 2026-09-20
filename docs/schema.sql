-- ============================================================================
-- Finance AI — PostgreSQL Database Schema
-- Collaborative MVP Database Vision (Target Architecture)
-- Source: docs/schema.dbml (dbdiagram.io)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- ENUMS
-- ----------------------------------------------------------------------------

CREATE TYPE account_type AS ENUM (
    'cash',
    'bank',
    'digital_wallet',
    'savings',
    'credit_card',
    'other'
);

CREATE TYPE transaction_type AS ENUM (
    'expense',
    'income',
    'transfer',
    'adjustment'
);

CREATE TYPE transaction_status AS ENUM (
    'confirmed',
    'pending',
    'voided'
);

CREATE TYPE capture_source AS ENUM (
    'manual',
    'text_ai',
    'audio_ai',
    'receipt_photo_ai',
    'import'
);

CREATE TYPE budget_schedule_type AS ENUM (
    'recurring',
    'one_time'
);

CREATE TYPE frequency_unit AS ENUM (
    'day',
    'week',
    'month',
    'year'
);

-- ----------------------------------------------------------------------------
-- 1. IDENTITY & REFERENCE
-- ----------------------------------------------------------------------------

CREATE TABLE currency (
    id        BIGSERIAL PRIMARY KEY,
    code      VARCHAR(10) NOT NULL UNIQUE, -- 'COP', 'USD', 'EUR'
    name      VARCHAR(100) NOT NULL,
    decimals  SMALLINT NOT NULL DEFAULT 2,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE app_user (
    id                    BIGSERIAL PRIMARY KEY,
    email                 VARCHAR(320) NOT NULL UNIQUE,
    password_hash         VARCHAR(255) NOT NULL,
    preferred_currency_id BIGINT NOT NULL REFERENCES currency(id) ON DELETE RESTRICT,
    is_active             BOOLEAN NOT NULL DEFAULT TRUE,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE user_session (
    id                   BIGSERIAL PRIMARY KEY,
    user_id              BIGINT NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    access_token_hash    VARCHAR(64) NOT NULL UNIQUE,
    platform             VARCHAR(16) NOT NULL,
    access_expires_at    TIMESTAMPTZ NOT NULL,
    idle_expires_at      TIMESTAMPTZ NOT NULL,
    absolute_expires_at  TIMESTAMPTZ NOT NULL,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_renewed_at      TIMESTAMPTZ NOT NULL,
    revoked_at           TIMESTAMPTZ,
    revocation_reason    VARCHAR(32)
);

CREATE INDEX idx_user_session_user_revoked_created 
    ON user_session (user_id, revoked_at, created_at);

CREATE TABLE renewable_credential (
    id             BIGSERIAL PRIMARY KEY,
    session_id     BIGINT NOT NULL REFERENCES user_session(id) ON DELETE CASCADE,
    token_hash     VARCHAR(64) NOT NULL UNIQUE,
    issued_at      TIMESTAMPTZ NOT NULL,
    expires_at     TIMESTAMPTZ NOT NULL,
    consumed_at    TIMESTAMPTZ,
    replaced_by_id BIGINT REFERENCES renewable_credential(id) ON DELETE SET NULL
);

CREATE INDEX idx_renewable_credential_session_issued 
    ON renewable_credential (session_id, issued_at);

-- ----------------------------------------------------------------------------
-- 2. ACCOUNTS & MOVEMENTS (LEDGER ENGINE)
-- ----------------------------------------------------------------------------

CREATE TABLE account (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    currency_id     BIGINT NOT NULL REFERENCES currency(id) ON DELETE RESTRICT,
    name            VARCHAR(100) NOT NULL, -- e.g. 'Cash', 'Nequi', 'Bancolombia'
    type            account_type NOT NULL,
    opening_balance NUMERIC(18, 2) NOT NULL DEFAULT 0,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_account_user_name UNIQUE (user_id, name)
);

CREATE INDEX idx_account_user_active ON account (user_id, is_active);

CREATE TABLE income_source (
    id        BIGSERIAL PRIMARY KEY,
    user_id   BIGINT NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    name      VARCHAR(100) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT uq_income_source_user_name UNIQUE (user_id, name)
);

CREATE TABLE financial_transaction (
    id               BIGSERIAL PRIMARY KEY,
    user_id          BIGINT NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    income_source_id BIGINT REFERENCES income_source(id) ON DELETE SET NULL,
    type             transaction_type NOT NULL,
    status           transaction_status NOT NULL DEFAULT 'confirmed',
    occurred_at      TIMESTAMPTZ NOT NULL,
    description      VARCHAR(250),
    source           capture_source NOT NULL DEFAULT 'manual',
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT income_source_only_for_income CHECK (
        type = 'income' OR income_source_id IS NULL
    )
);

CREATE INDEX idx_fin_tx_user_occurred 
    ON financial_transaction (user_id, occurred_at);
CREATE INDEX idx_fin_tx_user_type_occurred 
    ON financial_transaction (user_id, type, occurred_at);
CREATE INDEX idx_fin_tx_source_occurred 
    ON financial_transaction (income_source_id, occurred_at);

CREATE TABLE account_movement (
    id             BIGSERIAL PRIMARY KEY,
    transaction_id BIGINT NOT NULL REFERENCES financial_transaction(id) ON DELETE CASCADE,
    account_id     BIGINT NOT NULL REFERENCES account(id) ON DELETE RESTRICT,
    amount         NUMERIC(18, 2) NOT NULL, -- signed: negative leaves, positive enters
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT movement_amount_not_zero CHECK (amount <> 0)
);

CREATE INDEX idx_acc_mov_account_tx ON account_movement (account_id, transaction_id);
CREATE INDEX idx_acc_mov_tx ON account_movement (transaction_id);

-- ----------------------------------------------------------------------------
-- 3. CLASSIFICATION & STORES
-- ----------------------------------------------------------------------------

CREATE TABLE category (
    id        BIGSERIAL PRIMARY KEY,
    user_id   BIGINT NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    name      VARCHAR(100) NOT NULL,
    color     VARCHAR(20),
    icon      VARCHAR(50),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT uq_category_user_name UNIQUE (user_id, name)
);

CREATE TABLE store (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    name            VARCHAR(150) NOT NULL,
    normalized_name VARCHAR(150) NOT NULL,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT uq_store_user_normalized UNIQUE (user_id, normalized_name)
);

-- ----------------------------------------------------------------------------
-- 4. RECEIPTS & EXPENSES (PURCHASE GROUPS)
-- ----------------------------------------------------------------------------

CREATE TABLE receipt (
    id             BIGSERIAL PRIMARY KEY,
    transaction_id BIGINT NOT NULL UNIQUE REFERENCES financial_transaction(id) ON DELETE CASCADE,
    store_id       BIGINT REFERENCES store(id) ON DELETE SET NULL,
    category_id    BIGINT REFERENCES category(id) ON DELETE SET NULL,
    currency_id    BIGINT NOT NULL REFERENCES currency(id) ON DELETE RESTRICT,
    name           VARCHAR(200) NOT NULL,
    purchased_at   TIMESTAMPTZ NOT NULL,
    total_amount   NUMERIC(18, 2) NOT NULL,
    note           TEXT,
    image_path     TEXT,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT receipt_total_positive CHECK (total_amount > 0)
);

CREATE INDEX idx_receipt_store_purchased ON receipt (store_id, purchased_at);
CREATE INDEX idx_receipt_cat_purchased ON receipt (category_id, purchased_at);

CREATE TABLE expense (
    id          BIGSERIAL PRIMARY KEY,
    receipt_id  BIGINT NOT NULL REFERENCES receipt(id) ON DELETE CASCADE,
    category_id BIGINT REFERENCES category(id) ON DELETE SET NULL,
    position    SMALLINT NOT NULL DEFAULT 1,
    name        VARCHAR(200) NOT NULL,
    quantity    NUMERIC(12, 3) NOT NULL DEFAULT 1,
    unit_price  NUMERIC(18, 2),
    amount      NUMERIC(18, 2) NOT NULL,
    note        TEXT,
    image_path  TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_expense_receipt_pos UNIQUE (receipt_id, position),
    CONSTRAINT expense_quantity_positive CHECK (quantity > 0),
    CONSTRAINT expense_unit_price_non_negative CHECK (unit_price IS NULL OR unit_price >= 0),
    CONSTRAINT expense_amount_non_negative CHECK (amount >= 0)
);

CREATE INDEX idx_expense_category ON expense (category_id);

-- ----------------------------------------------------------------------------
-- 5. PLANNING & BUDGETS
-- ----------------------------------------------------------------------------

CREATE TABLE budget (
    id                 BIGSERIAL PRIMARY KEY,
    user_id            BIGINT NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    currency_id        BIGINT NOT NULL REFERENCES currency(id) ON DELETE RESTRICT,
    category_id        BIGINT REFERENCES category(id) ON DELETE SET NULL,
    name               VARCHAR(120) NOT NULL,
    amount             NUMERIC(18, 2) NOT NULL,
    schedule_type      budget_schedule_type NOT NULL,
    frequency_unit     frequency_unit,
    frequency_interval SMALLINT,
    starts_on          DATE NOT NULL,
    ends_on            DATE,
    is_active          BOOLEAN NOT NULL DEFAULT TRUE,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT budget_amount_positive CHECK (amount > 0),
    CONSTRAINT budget_date_order CHECK (ends_on IS NULL OR ends_on >= starts_on),
    CONSTRAINT budget_interval_positive CHECK (frequency_interval IS NULL OR frequency_interval > 0),
    CONSTRAINT budget_schedule_fields CHECK (
        (schedule_type = 'recurring' AND frequency_unit IS NOT NULL AND frequency_interval IS NOT NULL)
        OR (schedule_type = 'one_time' AND frequency_unit IS NULL AND frequency_interval IS NULL)
    )
);

CREATE INDEX idx_budget_user_active ON budget (user_id, is_active);
CREATE INDEX idx_budget_user_dates ON budget (user_id, starts_on, ends_on);
CREATE INDEX idx_budget_category_active ON budget (category_id, is_active);
