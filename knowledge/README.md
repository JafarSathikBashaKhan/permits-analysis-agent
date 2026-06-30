# Permits QA Knowledge Base

This folder contains the **single source of truth** for automated test development. Files here are auto-generated from dev source code + test cases.

## Files

### `knowledge-indexer.js`
Scans `C:\Users\jafar.s\Automation_Codes\ApplyIQ\Developers_Source_Code\MNPS-Permission-UI` and extracts:
- All pages (293 files)
- Form fields with data-testid, id, placeholder, max_length, required
- API endpoints (URL, method)
- Toast/error messages

**Run to refresh:**
```powershell
cd ..\..\session-state\<session-id>\files
node knowledge-indexer.js
```

Loads into session SQLite DB tables:
- `knowledge_pages` — 293 rows
- `knowledge_fields` — 1,176 rows (63 with data-testid)
- `knowledge_apis` — 382 endpoints
- `knowledge_messages` — 594 toast/error strings

### `load-test-cases.js`
Loads 882 test cases / 7,517 steps from the QA test case CSVs (Azure DevOps export).

### `permission-builder-TRUTH.md`
Hand-curated reference for the Permission Builder module:
- Form structure (Basic Information, tabs)
- Cascading dependencies (Type → Group → Category)
- API contracts
- Required vs nullable fields
- Toast messages

### `permission-builder-knowledge.md`
Original compilation from 53 user stories.

## How to Use (for automation engineers)

Query the session DB to find the right selectors:

```sql
-- "What's the data-testid for the Type dropdown on Builder?"
SELECT data_testid, placeholder, label
FROM knowledge_fields
WHERE page_file LIKE '%BasicInformation%' AND label = 'Type';

-- "What's the create Permission API URL?"
SELECT method, url FROM knowledge_apis WHERE key = 'createPermissionBuilder';

-- "What success message does Permission Builder show?"
SELECT message FROM knowledge_messages
WHERE page_file LIKE '%builder%' AND message LIKE '%uccess%';
```

## Source Locations

- Dev source code: `C:\Users\jafar.s\Automation_Codes\ApplyIQ\Developers_Source_Code\`
  - `MNPS-Permission-UI` — React frontend
  - `MNPS-Permission-RestAPI` — .NET backend
  - `Schema-MNPS-Permission` — DB schema (currently README only)
- Test cases (CSV): `C:\Users\jafar.s\Downloads\Permission Builder_Test_cases_Happypath\`
- Automation tests: `C:\Users\jafar.s\Automation_Codes\ApplyIQ\Task_306911\MNPS-Automation-Permission\`
