# US-130536: View Applicant Details | Document

| Field | Value |
|-------|-------|
| **ID** | 130536 |
| **Type** | User Story |
| **Module** | Users |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete; LV |

## Acceptance Criteria

**Display of Documents Tab**
 
 
 
 
 
Given a Super admin / Contract admin / BO Manager / BO User,
 
When selected a Application account from list screen, 
Then should see a dedicated tab the holds documents. 

 
**Category Based Documents **(Based on permission setup) 
When in the documents tab, 
Then should see the documents that are tied against that applicant account. 
& 
Then should see the document categorized based on types that are available for that permission type. (Proof of Residence, Proof of Identity, etc.) 
(Document type is configurable in the permission setup for each permission type. Based on the available document types, the tab will be shown) 

 
**List of Documents** 
When viewing the documents,Then should see the document with details "File name, File size, Upload timestamp and Document type badge (e.g., Driving Licence)". 

 
No Documents Scenario
When no documents are uploaded,
 
Then show a indication “No records found". 
(Tab should be enabled, as the user need to use the "Add document" option) 
 

 
**Actions** 
When viewing the documents, 
Then should have the following actions. 
 

- Replace document (Label name as in Figma) 
- Download (Label name as in Figma)
 
- Delete (Label name as in Figma) 
 
 
 
**Search (For respective tabs only)** 
 
When in the search field, 
Then should be able to search based on the file name. 

 
When searched for file name with full keyword, 
Then the results should be filtered. (Contains is not applicable for now) 

 
**Filter** 
When in the filters field, 
Then should be able to filter. (Default filter) 

 
**Column Picker** 
When in the list screen, 
Then should have default column picker.
