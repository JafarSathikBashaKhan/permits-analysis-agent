# US-195824: Scratch card application expiry

| Field | Value |
|-------|-------|
| **ID** | 195824 |
| **Type** | User Story |
| **Module** | Buy Now |
| **State** | Done |
| **Assigned To** | Sureshkumar M  |
| **Tags** | southend |

## Acceptance Criteria

Prerequisite: Permission that has scratch card toggle enabled
Automatic expiry after one year
 

 
Given a scratch card application has been submitted and approved
 
When one year has passed from the application’s approval date
 
Then the system should automatically update the application status to Expired in the work queue.
 

 
No premature expiry
 

 
Given a scratch card application is less than one year old since approval
 
When the system checks the application status
 
Then the application should in a appropriate WQ status based on its progression other than expired.
