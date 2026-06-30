# User Story 148740: Bulk Import | Download Sample

## Metadata
| Field | Value |
|-------|-------|
| ID | 148740 |
| Type | User Story |
| Title | Bulk Import | Download Sample |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete |
| Module | Area |

---

## Acceptance Criteria

**Given** I am logged in as a user with the **Super Admin** and **Contract Admin** roles
**When** I access the **Import Data** section
**Then** I should see an option to **Download Sample**
**When** I click the **Download** button**Then** a sample **.xlsx file** should be downloaded**And** the file should include the following columns:

- **Street Name** (Mandatory)

- **Zone Name** (Mandatory)

- **Property Name / Number** (Mandatory)

- **UPRN** (Optional)

- **Postcode** (Mandatory)

- **USRN** (Optional)

- **Town** (Mandatory)

- **Permission Limits** (Optional – subject to confirmation)


**When** I open the downloaded .xlsx file**Then** I should be able to **edit the fields** as needed**And** save it in the **same .xlsx format**
**When** I upload the edited .xlsx via the Import feature**Then** the system should **validate the data** based on mandatory and optional fields**And** allow successful upload if validation passes**And** display relevant error messages for any missing or incorrectly formatted **mandatory fields**
