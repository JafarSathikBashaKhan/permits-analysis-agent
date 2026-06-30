# User Story 140407: Templates | Document types | View & Edit

## Metadata
| Field | Value |
|-------|-------|
| ID | 140407 |
| Type | User Story |
| Title | Templates | Document types | View & Edit |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Figma Added; Fully Complete; LV |
| Module | Templates |

---

## Acceptance Criteria

When in the document type name 
Then should be invokable 
** 
On invoking the respective document type name in the grid screen 
Then should open the slide to view and edit the document type 

 
When in the view screen  
Then should the below existing data 

- Document Type 
- Sub Type 
 
And Should have the edit button to edit the document type 

 
Edit** 
When invoke the button to edit 
Then the following fields should be editable: 
 

- Document Type 
- Sub type 
 
When in the document name  
Then should have the provision to remove the sub type 
  
When the document name is remove  
Then the instruction added against that document should also be removed 
** 
When the remove the document name and invoke save  
Then should reflected in the customer portal in all upload document sections while applying permissions. 

 
Error** 
When not able to edit document type due to technical issue or network issue 
Then should see the indication as "Something went wrong Please try again" 
** 
 
Save** 
When necessary changes are made, 
Then the Save button should become enabled. 
** 
On saving the details, 
Then toaster message appear as 'Document type updated successfully' 
And then the changes should be reflected in all document upload sections while applying permission in the customer portal**. 
** 
Cancel** 
**When invoke the cancel button 
Then should see the pop up 'refer figma' with Confirm and Discard 
 
Confirm - Should revert back to list screen 
Discard - Should stay on the edit screen 

 
Audit/Event**  
**Success** 
Event Type / Name: Document type updated 
Event Description:  Document type updated successfully 
Date and Time: Current $timestamp** 
User Role: Role of the user 
User Name: First Name and Last Name of the Back office user 
 
 
 

 

** 
** 
**
