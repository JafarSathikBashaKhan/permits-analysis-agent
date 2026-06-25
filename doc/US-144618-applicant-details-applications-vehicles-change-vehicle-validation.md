# US-144618: Applicant Details - Applications | Vehicles | Change Vehicle Validation

| Field | Value |
|-------|-------|
| **ID** | 144618 |
| **Type** | User Story |
| **Module** | Users |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete |

## Acceptance Criteria

Given a Super admin / Contract Admin / BO Manager / BO user,
 
When in the 'Vehicles' Tab of permission application, (Users -> Applicants -> Applications Tab -> View Application -> Vehicles (Tab). 
 
And the "Maximum Vehicle Changes Allowed" is set to 0 in the Contract settings ([#135408](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/135408/)) 
Then the "Change Vehicle" button should not be shown for any vehicle entry. 

 
When the limit is reached,
 
Then the following banner message should be displayed "Vehicle change limit reached. No further changes are allowed" 
And the "Change" button should be disabled.
