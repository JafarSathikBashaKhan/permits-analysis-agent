# US-128870: Applicant Details - Applications | Documents

| Field | Value |
|-------|-------|
| **ID** | 128870 |
| **Type** | User Story |
| **Module** | Users |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Figma dependency; Fully Complete; LV |

## Acceptance Criteria

**'Documents Tab' Navigation**: 
Given a Super admin / Contract admin / BO Manager / BO User, 
When in the 'Applications' tab of the applicant account, 
& 
When invoked 'View' option for an application, 
Then should be taken to the applications details screen with multiple tabs. 

 
When in the applications details screen, 
Then should be able to switch to the 'Documents' tab. 

 
** View Documents** 
When in the documents tab, 
Then should see the documents that was uploaded at the time of applying permissions applications. 
 

 
When in the documents tab, 
Then should see the documents categorized based on the availability. Eg: Proof of Residence, Proof of Vehicle Ownership 
_Note_: 
 
If any of the document category doesn't have the document, then still the applicable categories should be shown. (So the user can upload new document) 
The category shown here should be based on the categories that are applicable for that permission type in the permission builder. 

 
When views those documents,Then each document should have the following information, 

- File format icon 
- File size and upload date/time (e.g., "23 KB, Uploaded on 07/05/2024 @ 17:21") 
- A tag indicating the document type (e.g., “Utilities Bill”, “Driving Licence”) 
 
 
**Document Action Menu**When viewing the documents, 
Then each document should have a dedicated document action menu. 

 
When selected the document action menu, 
Then should have the dedicated buttons to perform '**Download **& **Replace document & ****_Delete_**' actions. 
_Note_: **'****Delete****' **option is only applicable for the applications in '**Inactive**' status. 

 
Document Type 
 
When the viewing documents, 
Then each document should be shown along with its document type based on what is uploaded and categorized. (E.g., Bank statement) 

 
No Documents Scenario
When no documents are uploaded,
 
Then show a indication “No documents to show". 
 
(Tab should be enabled, as the user need to use the "Add document" option)
