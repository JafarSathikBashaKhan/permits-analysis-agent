# User Story 140463: Templates | Document Types | Single/Multi Select Delete

## Metadata
| Field | Value |
|-------|-------|
| ID | 140463 |
| Type | User Story |
| Title | Templates | Document Types | Single/Multi Select Delete |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Figma Added; Fully Complete; LV |
| Module | Templates |

---

## Acceptance Criteria

**Single Delete** 
When in the action column  
Then should see the delete icon  
** 
Om invoking the delete icon 
Then should see the pop up "Deleted selected type Are you sure you want to delete the selected 'Document type' " with Delete and Cancel button 

 
 
Delete** 
When invoke delete,  
Then toaster message should appear: "Document type deleted successfully." 
And it should no longer appear in the customer portal for applying new permissions and document type settings. 
** 
Cancel** 
When the cancel action is invoked, the system should revert back to the list screen without making any changes. 
** 
Multi Select Delete** 
When two or more document types are selected using checkboxes,** 

Then the Delete button should appear in the list screen toolbar. 

 
On clicking the Delete button, 
Then should see the pop up "Deleted selected type Are you sure you want to delete all the selected  Document types " with Delete All and Cancel button
 

 
Delete All** 
**When invoke delete all,  
Then toaster message should appear: "Document types deleted successfully." 
And it should no longer appear in the customer portal for applying new permission and document type settings. 

** 
**Cancel** 
When the cancel action is invoked, the system should revert back to the list screen without making any changes. 
** 
Audit/Event**  
 
 
**Single Delete** 
 
 
**Event Type / Name: Document type deleted 
Event Description:  "Document type" deleted successfully 
Date and Time: Current $timestamp 
User Role: Role of the user 
User Name: First Name and Last Name of the Back office user 
 
 
 

 
** 
**Multi Select Delete** 
 
**Event Type / Name: Document type deleted 
Event Description: Document type deleted successfully 
Date and Time: Current $timestamp 
User Role: Role of the user 
User Name: First Name and Last Name of the Back office user 
 
 

**
