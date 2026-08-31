-- Finance AI — PostgreSQL design/reference snapshot
--
-- STATUS: NON-AUTHORITATIVE DOCUMENTATION.
-- During construction, SQLAlchemy models + Alembic migrations are the executable
-- source of truth. This file exists for design review and diagram import.
--
-- Manual-first model: accounts, expenses, income, transfers, budgets, optional
-- receipt detail, and user-owned catalogs. Product AI requires no schema table.

BEGIN;

CREATE TABLE currency (
    id         BIGSERIAL PRIMARY KEY,
    code       VARCHAR(10) NOT NULL UNIQUE,
    name       VARCHAR(100) NOT NULL,
    decimals   SMALLINT NOT NULL DEFAULT 2 CHECK (decimals >= 0),
    is_active  BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE app_user (
    id                    BIGSERIAL PRIMARY KEY,
    email                 VARCHAR(320) NOT NULL UNIQUE,
    password_hash         VARCHAR(255) NOT NULL,
    preferred_currency_id BIGINT NOT NULL REFERENCES currency(id),
    is_active             BOOLEAN NOT NULL DEFAULT TRUE,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE account (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL REFERENCES app_user(id),
    name            VARCHAR(100) NOT NULL,
    account_type    VARCHAR(30) NOT NULL CHECK (
        account_type IN ('cash', 'bank', 'digital_wallet', 'savings', 'other')
    ),
    currency_id     BIGINT NOT NULL REFERENCES currency(id),
    opening_balance NUMERIC(14, 2) NOT NULL DEFAULT 0,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (id, user_id)
);

CREATE UNIQUE INDEX uq_account_active_name
    ON account (user_id, LOWER(name))
    WHERE is_active = TRUE;

CREATE TABLE category (
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT NOT NULL REFERENCES app_user(id),
    name       VARCHAR(100) NOT NULL,
    is_active  BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (id, user_id)
);

CREATE UNIQUE INDEX uq_category_active_name
    ON category (user_id, LOWER(name))
    WHERE is_active = TRUE;

CREATE TABLE subcategory (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT NOT NULL REFERENCES app_user(id),
    category_id BIGINT NOT NULL,
    name        VARCHAR(100) NOT NULL,
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id, user_id) REFERENCES category(id, user_id),
    UNIQUE (id, user_id),
    UNIQUE (id, category_id, user_id)
);

CREATE UNIQUE INDEX uq_subcategory_active_name
    ON subcategory (user_id, category_id, LOWER(name))
    WHERE is_active = TRUE;

CREATE TABLE payment_method (
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT NOT NULL REFERENCES app_user(id),
    name       VARCHAR(100) NOT NULL,
    is_active  BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (id, user_id)
);

CREATE UNIQUE INDEX uq_payment_method_active_name
    ON payment_method (user_id, LOWER(name))
    WHERE is_active = TRUE;

CREATE TABLE income_source (
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT NOT NULL REFERENCES app_user(id),
    name       VARCHAR(100) NOT NULL,
    is_active  BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (id, user_id)
);

CREATE UNIQUE INDEX uq_income_source_active_name
    ON income_source (user_id, LOWER(name))
    WHERE is_active = TRUE;

CREATE TABLE expense (
    id                BIGSERIAL PRIMARY KEY,
    user_id           BIGINT NOT NULL REFERENCES app_user(id),
    account_id        BIGINT NOT NULL,
    category_id       BIGINT NOT NULL,
    subcategory_id    BIGINT,
    payment_method_id BIGINT,
    amount            NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
    date              DATE NOT NULL,
    merchant          VARCHAR(150),
    description       VARCHAR(200) NOT NULL,
    reason            TEXT,
    is_archived       BOOLEAN NOT NULL DEFAULT FALSE,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id, user_id) REFERENCES account(id, user_id),
    FOREIGN KEY (category_id, user_id) REFERENCES category(id, user_id),
    FOREIGN KEY (subcategory_id, category_id, user_id)
        REFERENCES subcategory(id, category_id, user_id),
    FOREIGN KEY (payment_method_id, user_id)
        REFERENCES payment_method(id, user_id),
    UNIQUE (id, user_id)
);

CREATE TABLE expense_item (
    id         BIGSERIAL PRIMARY KEY,
    expense_id BIGINT NOT NULL REFERENCES expense(id),
    name       VARCHAR(200) NOT NULL,
    quantity   NUMERIC(12, 3) NOT NULL DEFAULT 1 CHECK (quantity > 0),
    amount     NUMERIC(14, 2) NOT NULL CHECK (amount >= 0),
    reason     TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE receipt_attachment (
    id           BIGSERIAL PRIMARY KEY,
    expense_id   BIGINT NOT NULL UNIQUE REFERENCES expense(id),
    file_path    TEXT NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE income (
    id               BIGSERIAL PRIMARY KEY,
    user_id          BIGINT NOT NULL REFERENCES app_user(id),
    account_id       BIGINT NOT NULL,
    income_source_id BIGINT NOT NULL,
    amount           NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
    date             DATE NOT NULL,
    description      TEXT,
    is_archived      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id, user_id) REFERENCES account(id, user_id),
    FOREIGN KEY (income_source_id, user_id)
        REFERENCES income_source(id, user_id),
    UNIQUE (id, user_id)
);

CREATE TABLE transfer (
    id                     BIGSERIAL PRIMARY KEY,
    user_id                BIGINT NOT NULL REFERENCES app_user(id),
    source_account_id      BIGINT NOT NULL,
    destination_account_id BIGINT NOT NULL,
    source_amount          NUMERIC(14, 2) NOT NULL CHECK (source_amount > 0),
    destination_amount     NUMERIC(14, 2) NOT NULL CHECK (destination_amount > 0),
    date                   DATE NOT NULL,
    description            TEXT,
    is_archived            BOOLEAN NOT NULL DEFAULT FALSE,
    created_at             TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at             TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (source_account_id <> destination_account_id),
    FOREIGN KEY (source_account_id, user_id)
        REFERENCES account(id, user_id),
    FOREIGN KEY (destination_account_id, user_id)
        REFERENCES account(id, user_id),
    UNIQUE (id, user_id)
);

CREATE TABLE budget (
    id             BIGSERIAL PRIMARY KEY,
    user_id        BIGINT NOT NULL REFERENCES app_user(id),
    currency_id    BIGINT NOT NULL REFERENCES currency(id),
    amount         NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
    period         VARCHAR(10) NOT NULL CHECK (period IN ('weekly', 'monthly')),
    category_id    BIGINT,
    subcategory_id BIGINT,
    is_active      BOOLEAN NOT NULL DEFAULT TRUE,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id, user_id) REFERENCES category(id, user_id),
    FOREIGN KEY (subcategory_id, user_id)
        REFERENCES subcategory(id, user_id),
    CONSTRAINT budget_xor_target CHECK (
        (category_id IS NOT NULL AND subcategory_id IS NULL)
        OR (category_id IS NULL AND subcategory_id IS NOT NULL)
    ),
    UNIQUE (id, user_id)
);

CREATE INDEX idx_account_user_active
    ON account (user_id, is_active);

CREATE INDEX idx_expense_user_date
    ON expense (user_id, date);

CREATE INDEX idx_expense_account_date
    ON expense (account_id, date);

CREATE INDEX idx_expense_category_date
    ON expense (category_id, date);

CREATE INDEX idx_income_user_date
    ON income (user_id, date);

CREATE INDEX idx_income_account_date
    ON income (account_id, date);

CREATE INDEX idx_transfer_user_date
    ON transfer (user_id, date);

CREATE INDEX idx_transfer_source_date
    ON transfer (source_account_id, date);

CREATE INDEX idx_transfer_destination_date
    ON transfer (destination_account_id, date);

CREATE INDEX idx_budget_user_active
    ON budget (user_id, is_active);

INSERT INTO currency (code, name, decimals)
VALUES
    ('COP', 'Colombian Peso', 2),
    ('USD', 'United States Dollar', 2)
ON CONFLICT (code) DO NOTHING;

COMMIT;
