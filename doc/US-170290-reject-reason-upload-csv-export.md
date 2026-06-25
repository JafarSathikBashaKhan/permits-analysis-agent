# US-170290: Reject Reason | Upload CSV & Export

| Field | Value |
|-------|-------|
| **ID** | 170290 |
| **Type** | User Story |
| **Module** | MNPS Contract Settings |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

Given a super admin 
When in the "Rejection reason" list screen, 
Then should see the button "Upload CSV". 

 
When in the Upload CSV pop up, 
Then the user should see "Browse, Download Sample, Upload CSV and Cancel" buttons. 
 
 
 
 
When invoked on the "Upload CSV" button, 
Then should see "upload CSV" pop up. 

 
When invoked browse in the upload CSV pop up, 
Then should see a menu that allows to upload only CSV from the local storage. 

 
When invoked the "Download Sample" button, 
Then a sample CSV file with fields "Organization, Contract, Rejection Reasons" should be downloaded**(Note: All these 3 Mandatory**** column values should be empty)** 
 
 
When downloaded the sample CSV, 
Then must be able to edit and upload the same. 

 
 
When a CSV is uploaded, 
Then should see to that it contains fields "Organization, Contract, Rejection Reasons" with its relevant data 
 
 
When no file are selected to upload in the pop up, 
Then should see to that the 'Upload' button is in disable mode. 
 
 
When a file are selected to upload in the pop up, 
Then should see to that the 'Upload' button is in enable mode. 

 
When invoked the 'Upload' button in the pop-up post selecting a CSV from local storage, 
Then should see a loading pop-up with message that states "Please wait while we are validating CSV..." 
 

 
When in the error summary grid, 
Then should see a confirmation asking for "Do you wish to skip the error data and upload the CSV?" followed by the "Yes" and "No" buttons. 
And  
Then should see error data listed  
And 
The should see Error record count. 
  
When invoked "Yes" in the confirmation pop-up, 
Then the error items should be skipped, and the proper ones should be uploaded. 

 
When the proper ones are being uploaded, 
Then should see a loading screen with **"**Please wait while we are validating CSV...**"****.** 

 
When uploaded the CSV, 
Then should see the upload summary pop up with a "Total data, Uploaded data, skipped data" with a "skipped data report" button. 

 
When invoked the "skipped data report" button, 
Then should download the skipped data report(the CSV with skipped ones should be downloaded). 
AND 
When nothing is skipped, summary page should not be visible. 
  
When the CSV file is uploaded 
Then the "Rejection Reasons" in the CSV should be added to the NPS against the contract and org followed by a "Success indication" with toaster message "CSV Uploaded Successfully". 
  
When the "Rejection Reasons" are added to the contract, 
Then should be able to see them in the list screen. 

 
 
When invoked the cancel button, 
Then should see a prompt "Are you sure you want to cancel?" with "yes" and "no" button. 

 
When invoked "yes", 
Then should get redirected back to the list page. 

 
When invoked "no", 
Then should get redirected back to the pop up.  
 
 
 
**Error Scenarios**: 
When try to upload a CSV that doesn't match the format(both file format and column header mismatch), 
Then should see an alert that states "CSV format does not match". 
 
 
 
Common Error Message for All Scenarios: 
When tries to upload the CSV with an empty Contract/org/Rejection Reason, 
When tries to upload the CSV with an Contract/org that does not exist, 
When tries to upload the CSV with an Contract/org mismatch 
 
 
 
 
When tries to upload duplicates 
When try to upload the CSV with above mentioned error scenarios,  
Then should show a generic item against the line item as "Data error". 

 
When tries to add the Rejection reason which exceeds the character limit and other validations as per the story [#170283](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/170283/) 
 
**** 
** System Behavior ** 

- No file size upload limit 
- Format validation & data validation should happen in API 
- UI should only allow selecting CSV files 
 
 
**Export** 
When the user clicks the Export button on the list screen
 
Then all data currently displayed in the list should be downloaded to the system local in CSV format
