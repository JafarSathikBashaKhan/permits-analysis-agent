# User Story 140263: Templates | Document types | Create

## Metadata
| Field | Value |
|-------|-------|
| ID | 140263 |
| Type | User Story |
| Title | Templates | Document types | Create |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Figma Added; Fully Complete; LV |
| Module | Templates |

---

## Acceptance Criteria

When in the document types list screen 
Then should have the button to create document type 
** 
When invoke button to create document type 
Then the slider opens with the following fields 

- Document Type - Text field should accept 100 characters 
- Sub Type (Optional) - Alphanumeric field should accept 100 characters 
 
When in the sub type   
Then should be able to create the list of sub type under the document type by invoking the appropriate button. 

 
When the sub type added 
Then the instruction box should be available to add the rules or instruction to upload document in each line item.  

 
Create Button** 
When invoke the button to create the document type 
Then toaster message should appear as 'Document type created successfully' 
&  
Should reflect in the list screen 
** 
Cancel Button** 
When invoke the cancel button 
Then should see the pop up '' with Yes and No 
** 
Yes - Should revert back to list screen 
No - Should stay on the creation screen 

 
Error** 
When the user enters a document type name that already exists in the system,** 
Then the system should display an error message: "The Document type already exist" 
 

 
When left any of the required fields as empty 
Then should see the error message 'This field is required' under the fields 
 
When not able to create document type due to technical issue or network issue 
Then should see the indication as "Something went wrong Please try again" 
 

** 
**Audit/Event**  
**Success** 
Event Type / Name: Document type Created 
Event Description:  Document type created successfully 
Date and Time: Current $timestamp** 
User Role: Role of the user 
User Name: First Name and Last Name of the Back office user 
 
 

 

**
