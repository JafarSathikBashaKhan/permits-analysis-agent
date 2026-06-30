# US-170286: Reject Reason | Edit&Delete

| Field | Value |
|-------|-------|
| **ID** | 170286 |
| **Type** | User Story |
| **Module** | MNPS Contract Settings |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

Given a Super Admin
 
 
 
When on the Rejection Reason list screen
 
Then each line item should display a three dots (⋮) menu 

 
**Three Dots Menu Options:** 
When the user clicks the three dots
 
Then options should include: Edit and Delete 

 
**Edit Rejection Reason:** 
When the user selects Edit
 
Then the Edit Rejection Reason pop-up should open 

- Organization and Contract fields should be non-editable 
- Rejection Reason field should be editable  
 
 

 
**Update Button** 
Enabled only if the Rejection Reason field is updated 
Disabled if no changes are made 

 
When the user updates the Rejection Reason and clicks Update
 
Then the edited entry should be reflected in the list screen 

 
**When** a Rejection Reason is updated for a specific **Contract**
**Then** the updated value should be reflected in the **Apply BO > Application menu > Reject action** drop-down list **only for that Contract** 

 
**Cancel Action:**
 
When the user clicks Cancel in the pop-up
 
Then a prompt should appear "Are you sure you want to cancel?" With options: Yes and No 

 
Yes → Close the pop-up without saving changes 
No → Close the pop-up and remain on the Rejection Reason list screen 

 
**Delete Rejection Reason:** 
When the user selects Delete
 
Then a confirmation pop-up should appear "Once this data is deleted, it cannot be retrieved. Are you sure to delete?" With options: Yes and No 

 
Yes → Remove from list (Soft delete the entry)  
No → Close the pop-up and remain on the Rejection Reason list screen 

 
******When** a Rejection Reason is deleted for a specific **Contract**
**Then** the deleted value should be removed from the **Apply BO > Application menu > Reject action** drop-down list **only for that Contract******
 

  
**Audit/Event** 
**Edit** 
Event Type / Name: Reject reason updated 
Event Description:  "Reject Reason" updated successfully 
Date and Time: Current $timestamp 
User Role: Role of the user 
User Name: First Name and Last Name of the Back office user 
 
 

  
~~**Delete** ~~ 
~~Event Type / Name: Reject reason deleted ~~ 
~~Event Description:  "Reject Reason" deleted successfully ~~ 
~~Date and Time: Current $timestamp ~~ 
~~User Role: Role of the user ~~ 
~~User Name: First Name and Last Name of the Back office user ~~
