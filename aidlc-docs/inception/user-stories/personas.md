# Finance AI Personas

## Persona Strategy

The manual MVP serves one primary persona. "New user," "returning user," and "AI-assisted user" are states of the same person rather than separate personas. There is no Admin persona in the approved MVP, and AI is a system capability rather than an actor with independent goals.

## P-001 — Personal Budget User

### Archetype

An individual who wants an understandable record of money held across places such as cash, bank accounts, digital wallets, or savings products. The user may be a student, employee, freelancer, or a combination of these. Financial expertise and budgeting discipline may be limited.

### Goals

- Know how much money is available in each account.
- Record income and spending without excessive effort.
- Move money between accounts without incorrectly treating the movement as income or expense.
- Understand spending by category and period.
- Establish simple recurring or one-time budgets.
- Trust that totals are correct even when accounts use different currencies.
- Use natural-text and audio AI first, followed by receipt-photo AI, to capture transactions quickly without losing control.

### Behaviors and Context

- Uses a phone as the primary interface.
- May alternate frequently between cash and digital accounts.
- Records some transactions immediately and others later from memory or a receipt.
- Expects familiar categories, stores, and income sources but wants to customize them.
- May have COP and another currency but does not necessarily understand exchange-rate accounting.
- Values speed, clarity, and visible confirmation more than advanced financial terminology.

### Frustrations

- Budget applications that assume all money is in one place.
- Transfers that inflate income or spending totals.
- Forms that demand receipt details for simple manual expenses.
- Combined currency totals that look precise but are mathematically misleading.
- AI that saves incorrect data without review.
- Interfaces that require chat or AI when a normal form would be faster.

### Needs

- Clear Add Expense, Add Income, and Transfer actions.
- Account balances and transaction history scoped to the signed-in user.
- Flexible overall/category budgets with visible progress.
- Separate currency totals until trustworthy conversion exists.
- Manual control at every stage, including after AI is added.
- Understandable errors, loading states, and recovery from failed submissions.

### Accessibility and Usability Considerations

- Do not communicate income versus expense using color alone.
- Keep currency code visible beside monetary values.
- Use plain language for account types, transfers, and budget periods.
- Provide sufficiently large touch targets and readable validation messages.
- Preserve entered form data after recoverable validation or network failures.
- Make password visibility an explicit user-controlled action.

### Journey States

| State | User need |
|---|---|
| New user | Register safely and receive understandable defaults |
| Returning user | Resume securely without unnecessary repeated setup |
| Manual recorder | Enter complete financial data without AI |
| Multi-account user | Understand balances and transfers across money locations |
| Budget reviewer | Compare actual spending with recurring or one-time targets |
| AI-assisted user — after foundation | Glance and accept high-confidence proposals, or edit/retry/discard when needed |

## Persona-to-Domain Mapping

P-001 applies to every approved product domain: identity, accounts, catalogs, expenses, income, transfers, transaction history, the basic dashboard, photo/text/audio AI capture, and budgets.
