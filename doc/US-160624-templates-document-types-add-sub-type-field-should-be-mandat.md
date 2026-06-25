# User Story 160624: Templates | Document Types | Add Sub Type Field Should Be Mandatory - Create & Edit

## Metadata
| Field | Value |
|-------|-------|
| ID | 160624 |
| Type | User Story |
| Title | Templates | Document Types | Add Sub Type Field Should Be Mandatory - Create & Edit |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete |
| Module | Templates |

---

## Acceptance Criteria

Given a Super Admin or Contract Admin,** 
When the user is on the Document Type create screen,
 
Then the Add Sub Type field should be mandatory. 

 
When the Add Sub Type field is left empty,
 
Then the system should display the error message: "This field is required,"
 
And the user should not be allowed to create the document type. 

 
Edit Document Type** 
When the user is on the Edit Document Type screen,** 
Then the Add Sub Type field should be mandatory. 

 
When the user updates the document type,
 
Then the changes should be reflected in all document sections, including both the Customer Portal and Back Office. 

 
When the user removes any subtype,
 
Then that subtype should be removed from all document sections, including both the Customer Portal and Back Office. 

 
When the Add Sub Type field is left empty during editing,
 
Then the system should display the error message: "This field is required,"
 
And the user should not be allowed to save the changes. 

 
When tries to add duplicate subtypes,
 
Then the system should display the error message: "Duplicate subtypes are not allowed,"
 
And the user should not be allowed to save until unique subtypes are provided. 

 
Audit** 
Create: [#140263](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/140263/) 
Edit:  [#140407](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/140407/)
