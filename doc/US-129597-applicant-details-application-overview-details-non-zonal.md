# US-129597: Applicant Details - Application Overview Details (Non-Zonal)

| Field | Value |
|-------|-------|
| **ID** | 129597 |
| **Type** | User Story |
| **Module** | Users |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete |

## Acceptance Criteria

**Navigation to Permit Details**:
 
 
 
 
 
Given a Super admin / Contract admin / **BO Manager / Bo User, ** 
When in the applications tab of the applicant account, 
Then should see 'View' button next to a permit record. 

 
When invoked 'View' for a 'NON-ZONAL' application, 
Then should be navigated to a detailed overview of that specific permit.
 

 
**Show Permit Details: (Overview Information)** 
When on the permit details page,
 
Then I should see the following information in the Overview tab:  

- Permissions Group 
- Permission Duration 
- Address Line 1 
- Address Line 2 
- Town 
- Post Code 
- Reference Number 
- Start Date 
- End Date 
- Payment Method 
- Price 
 
Non-zonal and zonal indication is NOT REQUIRED in UI. 

 
_Note_:  
The above fields are specific to 'Non-Zonal' permissions only. 
 
Other things should be same as that of what is implemented in [#126138](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/126138/)
