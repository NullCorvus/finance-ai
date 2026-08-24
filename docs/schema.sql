-- Finance AI Tracker — Database Schema (PostgreSQL)
-- Source of truth for the ER diagram in docs/SCHEMA.md
-- Paste into dbdiagram.io (Import → PostgreSQL) to generate a clean diagram

-- 1. ROLE
CREATE TABLE role (
    id   SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE  -- 'user', 'admin'
);

-- 2. USER (quoted: 'user' is a reserved word in PostgreSQL)
CREATE TABLE "user" (
    id            SERIAL PRIMARY KEY,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id       INTEGER NOT NULL REFERENCES role(id),
    preferred_currency_id INTEGER REFERENCES currency(id)  -- display preference only; fallback 'COP'
);

-- 3. CATEGORY
CREATE TABLE category (
    id   SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE  -- 'Food', 'Transport', 'Entertainment'
);

-- 4. SUBCATEGORY
CREATE TABLE subcategory (
    id          SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL REFERENCES category(id),
    name        VARCHAR(100) NOT NULL  -- 'Groceries', 'Eating out', 'No subcategory'
);

-- 5. CURRENCY
CREATE TABLE currency (
    id   SERIAL PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE  -- 'USD', 'COP', 'EUR'
);

-- 6. PAYMENTMETHOD
CREATE TABLE paymentmethod (
    id   SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE  -- 'Cash', 'Card', 'Transfer', 'Nequi'
);

-- 7. RECEIPT
CREATE TABLE receipt (
    id               SERIAL PRIMARY KEY,
    user_id          INTEGER NOT NULL REFERENCES "user"(id),
    store            VARCHAR(150) NOT NULL,
    date             DATE NOT NULL,
    currency_id      INTEGER NOT NULL REFERENCES currency(id),
    purchase_reason  TEXT,
    total            NUMERIC(12, 2) NOT NULL CHECK (total > 0),
    payment_method_id INTEGER NOT NULL REFERENCES paymentmethod(id),
    image            TEXT  -- file path/URL; NULL when no photo
);

-- 8. EXPENSE
CREATE TABLE expense (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER NOT NULL REFERENCES "user"(id),
    receipt_id      INTEGER NOT NULL REFERENCES receipt(id),
    subcategory_id  INTEGER NOT NULL REFERENCES subcategory(id),
    name            VARCHAR(200) NOT NULL,
    amount          NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    item_reason     TEXT
);

-- Ownership consistency rule: expense.user_id must always match receipt.user_id.
-- Enforced by the application (and checked in review); not a DB constraint by design.

-- 9. SPENDINGLIMIT
CREATE TABLE spendinglimit (
    id             SERIAL PRIMARY KEY,
    user_id        INTEGER NOT NULL REFERENCES "user"(id),
    name           VARCHAR(100) NOT NULL,
    amount         NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    period         VARCHAR(10) NOT NULL CHECK (period IN ('weekly', 'monthly')),
    subcategory_id INTEGER REFERENCES subcategory(id),
    category_id    INTEGER REFERENCES category(id),
    -- XOR rule: exactly one target — never both, never neither
    CONSTRAINT spendinglimit_xor_target CHECK (
        (subcategory_id IS NOT NULL AND category_id IS NULL)
        OR (subcategory_id IS NULL AND category_id IS NOT NULL)
    )
);

-- 10. INCOMESOURCE
CREATE TABLE incomesource (
    id   SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE  -- 'Work', 'Freelance', 'Gift'
);

-- 11. INCOME
CREATE TABLE income (
    id               SERIAL PRIMARY KEY,
    user_id          INTEGER NOT NULL REFERENCES "user"(id),
    income_source_id INTEGER NOT NULL REFERENCES incomesource(id),
    currency_id      INTEGER NOT NULL REFERENCES currency(id),
    amount           NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    date             DATE NOT NULL,
    description      TEXT
);

-- INDEXES (quick-reference sheets for fast lookups)
CREATE INDEX idx_user_email        ON "user" (email);          -- automatic via UNIQUE; listed for clarity
CREATE INDEX idx_expense_user_id   ON expense (user_id);
CREATE INDEX idx_expense_receipt   ON expense (receipt_id);
CREATE INDEX idx_expense_subcat    ON expense (subcategory_id);
CREATE INDEX idx_receipt_user_id   ON receipt (user_id);
CREATE INDEX idx_receipt_date      ON receipt (date);
CREATE INDEX idx_receipt_payment   ON receipt (payment_method_id);
CREATE INDEX idx_income_user_id    ON income (user_id);
CREATE INDEX idx_income_date       ON income (date);
CREATE INDEX idx_income_source     ON income (income_source_id);
CREATE INDEX idx_limit_user_id     ON spendinglimit (user_id);
