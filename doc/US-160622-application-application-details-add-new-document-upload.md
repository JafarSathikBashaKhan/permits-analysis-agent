# US-160622: Application | Application Details | Add New document (Upload)

| Field | Value |
|-------|-------|
| **ID** | 160622 |
| **Type** | User Story |
| **Module** | Applications |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete |

## Acceptance Criteria

**** 
**** 
**** 
**** 
Permissions
Based on Role 
Given
the user is logged in as BO User 
When
they access the Applications menu, 
Then
they should be able so permissions and its details 
  
1.
Navigation 
 Given
the Permissions details page 
When
the user selects a Reference Number 
Then
the system must open the Application View screen for that reference number 
And
display all the defined sections (Overview, Applicant, Vehicles, Documents,
Notes, Emails, Audit Log, Payment History). 
  
For
document section functionality Refer  [#160535](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/160535/)   
  
 Add
New Document to Application 
  
  
 Given the user is logged in with sufficient permissions 
    When
the user views the application details 
    Then
the "+ UPLOAD" button should be visible in Document section  

 
**Note**: This provision is available for uploading a document on behalf of customer on request  
  
2.Open
Upload Document  

    Given the user is on the application details page 
    When
the user clicks on the "+UPLOAD" button 
    Then
the system should display a dropdown with the list of documents for user
selection 
 
   List of documents will be retrieved from document settings. 

 
 
  
Note:
Document List are configured in Permission settings 

 
  
Initiate
document upload 
  
Given
the BO user selects a document and clicks "Upload" 
When
the system validates the file successfully 
Then
an upload progress appears below the  
And
it must display the file name, file type, and progress details 
And a
Cancel button must be available 
  
Upload
in progress 
  
Given
the document upload is in progress 
When
the BO user views the upload window 
Then
the progress details must update dynamically (e.g., progress bar) 
And
the pop-up window displays the count of files uploaded (like 3 items added) with cancel and Add documents button 
  
Cancel
upload 
  
Given
the document upload is in progress 
When
the BO user clicks the Cancel button 
Then
the upload process must stop immediately 
And
the document must not be stored in the application 
  
Successful
upload 
  
Given
the document upload completes successfully 
When
the BO user views the upload pop-up 
Then
the system must display green tick upon upload progress completed successfully along with document type name that was uploaded 

 
 **** 
Close
upload window 
Given
the document upload window is open 
When
the BO user clicks the Close button 
Then
the upload window must close 
And
the application must refresh the document list to reflect the latest status 
 **** 
**3.Add document ** 
  
    Given
the user has selected a valid file and filled mandatory details 
    When
the user clicks "Add documents" 
    Then
the documents that are successfully uploaded should be attached to the application 
    And
the document should appear in the application’s documents list 
     
** ** 
4.Invalid
document upload 
    Given
the user attempts to upload an invalid file type  
    When
the user clicks "Add documents" 
    Then
the system should reject the upload 
    And
display an appropriate error message "File type not supported" 

 

 
6. File
Exceeds Size Limit 
 
   Given the Add Document form is open

     When the user selects a file larger than the maximum
allowed size

     Then the system should reject the upload and show an
error message "File Size Exceeded" 

 
 
**     Validation** 
     When upload the document 
     Then file format should be in ".png, .pdf, .jpg, .bmp, .tif, .heic" and max size 10 mb 

**7. ****Network/Server Error During Upload** 
 
   Given the user uploads a valid file 
 
   When there is a network or server failure 
 
  Then the system should show an error message "Something went
Wrong"
