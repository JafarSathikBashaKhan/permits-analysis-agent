# User Story 157592: Configure Version History Retention Period

## Metadata
| Field | Value |
|-------|-------|
| ID | 157592 |
| Type | User Story |
| Title | Configure Version History Retention Period |
| Assigned To | Nivetha Mohan |
| State | Done |
| Tags | Fully Complete |
| Module | Contract Settings |

---

## Acceptance Criteria

Given a super admin/contract admin 
When in the contract setting (Apply) 
Then should have the 'Version History Retention Period' drop down should have the following values  

- 1 week (7 days) 
- 1 month (30 days) 
- 3 months (90 days) 
- 6 months (180 days) 
- 1 year (365 days ) 
 
The default value should be set to 1 month (30 days). 

 
 
When the retention period is set for version history,  
Then system should automatically delete archived versions based on the selected retention period. [#153148](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/153148/)
