# App Knowledge Base

Structured knowledge about how the NPS Backoffice (Apply IQ contract) actually
behaves. The QA agent reads this folder **before** answering questions or
writing tests, so it always has the right vocabulary, navigation paths,
and business rules.

## How it's organised

```
app-knowledge/
├── README.md                          ← this file
└── modules/
    └── <module>/
        ├── README.md                   ← module overview
        └── <tab>/
            └── <page>.md               ← per-page knowledge
```

Each page file follows the same template (see `modules/builder/permissions/basic-information.md`):

- **Location** — where it is in the UI + URL
- **Purpose** — what business job it does
- **Fields** — table of every input with selector + validation
- **Behavioural rules** — create vs edit vs clone mode differences
- **Validation messages** — exact strings the app shows
- **Selectors** — pulled from the UI inventory
- **Related user stories**
- **Open questions** — things still to confirm

## How to use this from chat

- "What fields are on Basic Information?" → I read `basic-information.md`
- "Write a test for Basic Information required-field validation" → I use this file + L-001..L-009 + the POM stubs
- "I noticed X" → I append a note to the relevant page file

## Coverage status

| Module | Pages documented |
| --- | --- |
| Builder → Permissions | 1 of 9 (Basic Information) |
| _Other modules_ | 0 — start as needed |

Built incrementally: when we work on a page, we capture knowledge once and
never re-learn it.
