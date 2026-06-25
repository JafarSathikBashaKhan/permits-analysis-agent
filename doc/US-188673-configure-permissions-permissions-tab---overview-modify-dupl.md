# User Story 188673: Configure Permissions | Permissions Tab - Overview | Modify Duplicate Validation for Prefix Configuration

## Metadata
| Field | Value |
|-------|-------|
| ID | 188673 |
| Type | User Story |
| Title | Configure Permissions | Permissions Tab - Overview | Modify Duplicate Validation for Prefix Configuration |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | new |
| Module | Permission Setup > Permission Builder |

---

## Acceptance Criteria

**Permission Type = **Permits, Licensing, Suspension etc. 
**
** 
**Allow duplicate prefix within the same permission type** 
Given a Super Admin / Contract Admin is configuring a permission under a permission type,** 
When the user enters a prefix that already exists for another permission type within the same permission type of same contract,
 
Then the system should allow saving the prefix without triggering a duplicate validation message.
 

 
Restrict duplicate prefix across different contracts
** 
Given a prefix is already configured in Contract A,** 
When the user tries to configure the same prefix under Contract B,
 
Then the system should restrict. 

 
Restrict duplicate prefix across different permission type (within same contract)**** 
Given a prefix exists in one permission type,
 
When the user attempts to use the same prefix for a different permission type under the same contract,
 
Then the system should restrict. 

 
Remove outdated duplicate validation**** 
Given the user is configuring a prefix under a permission type,
 
When the prefix matches an existing one in the same type,
 
Then the previous restriction developed in [#135721](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/135721/)  should be removed. 

 
Edit scenario
** 
Given a user edits an existing prefix under a permission type,** 
When the updated prefix is the same as another permission under the same type,
 
Then it should be allowed.
 

 
When the updated prefix matches one from a different contract or different type,
 
Then the system should restrict and show the corresponding error message. 

 
Permission Type Change:** 
When switches the permission type, 
Then again the prefix validation should be done at the time of publishing. 
** 
Restricting Type and Prefix Change after Publishing**  
When the permission is published,  
Then type and prefix edit should not be allowed.
