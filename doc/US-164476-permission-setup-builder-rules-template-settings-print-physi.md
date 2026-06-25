# User Story 164476: Permission Setup | Builder | Rules | Template Settings | Print Physical Permission

## Metadata
| Field | Value |
|-------|-------|
| ID | 164476 |
| Type | User Story |
| Title | Permission Setup | Builder | Rules | Template Settings | Print Physical Permission |
| Assigned To | Prathiba K |
| State | Done |
| Tags |  |
| Module | Permission Setup > Permission Builder |

---

## Acceptance Criteria

**Permission Setup > Builder > [Permission name] > Rules Tab > Template Settings** 
Given a super admin and contract admin 
When in the template settings 
Then should have the tabs  

- Physical Permission Print - Used generate a physical permission sent by post for display in the car when permit mode is Physical or Both. 
 
 
**General Setting**  
 
When the permit mode in general settings is set to **Physical** or **Both**, 
Then the Print Permission Template and white mail reminder option should be enabled. 
**Note: **If both **Virtual** and **Physical** are set then should select the permit mode while applying the permission in the customer portal. 
** 
When the permit mode in general settings is set to Physical **or** Both** 
Then 'Physical Permission Print' and 'White mail reminder' is **mandatory** to select the template 
** 
Note:** When a new permission is created in the Permission Builder and the permission type is Physical, the council must provide a new template for each permission. 
The system must provide an option to upload the template when the council provides the document.** 

 
** 
**Template Upload** 
When in the Print Permission Template section, 
Then there should be an option to upload a template. 
** 
Validation for Uploading Template:** 
File must be in .docx (MS Word) format. 
Only one template can be uploaded at a time. 
** 
When one file is uploaded  
Then should the error indication 'File limit reached. Remove a file to upload new one' 

 
Editing & Merge Fields** 
When a template is uploaded, 
Then that content should populated in the text editor to edit the content. 
And the edited content should be saved in the uploaded document while clicking save as draft and publish 
The text editor should support merge fields. 
(Note: Inserting merge fields in the text editor is covered in story [#158023](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/158023/) 
** 
Preview** 
When content is updated in the text editor, 
Then the system should provide a Preview option. 
** 
When the preview option is invoked, 
Then the user should be able to view the template and verify that the alignment and formatting are correct. 

 
When in the preview screen  
Then should have the download 

 
When invoke download  
Then should downloaded to the system local   

 
Zoom In and Zoom Out in Preview** 
Given the preview screen is shown 
Then the user should be able to: 

- **Zoom In** the preview content for better visibility. 
- **Zoom Out** the preview content to see more of the template at once. 
 
 
 
**Text editor** - Free text editor 
** 
Text Formatting** 
When the user selects text and applies formatting options,** 
Then the text should reflect the chosen style (bold, italic, underline, font size/style, alignment, lists, hyperlinks). 
 
 
 
Content Editing** 
When the user performs editing actions (cut, copy, paste, undo, redo),** 
Then the editor should update the content accordingly and maintain formatting. 

 
When in the uploaded document 
Then should have the three dot option 

 
When invoke the three dot 
Then should have the  

- Replace  
- Remove 
 
 
 
 
 
** 
 
**Remove Document ** 
When the user invokes the Remove option,** 
Then a confirmation pop-up should appear with the message:
 
'Are you sure you wish to delete the document "Document Name"? This will remove the content in the text editor.' with the options 'Delete' and 'Cancel' 

 
When the user confirms the action (select delete),
 
Then the uploaded document and the content in the text editor should be removed. 

 
When the user cancels the action (select cancel),
 
Then the uploaded document and the content in the text editor should remain unchanged. 

** 
**Replace Document (Limit 1)** 
When the user invokes the Replace option,
 
Then a confirmation pop-up should appear with the message 'Are you sure you wish to replace the document?' and options Yes and No. 

 
When the user confirms the action (selects Yes),
 
Then the file upload screen should appear to upload a new document. 

 
When the user uploads the new document,
 
Then the existing document & the content in the text editor should be replaced by the newly uploaded document,
 
And newly uploaded document content should render in the text editor. 

 
When the user cancels the action (selects No),
 
Then the existing document and content should remain unchanged. 

 
Note: Sample '*Physical Permission*' template attached in the attachment section
