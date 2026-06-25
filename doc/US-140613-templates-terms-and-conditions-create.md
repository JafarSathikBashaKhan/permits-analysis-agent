# User Story 140613: Templates | Terms and Conditions | Create

## Metadata
| Field | Value |
|-------|-------|
| ID | 140613 |
| Type | User Story |
| Title | Templates | Terms and Conditions | Create |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Figma to be added; Fully Complete; LV |
| Module | Templates |

---

## Acceptance Criteria

Given a super admin/contract admin 
When in the Templates list screen  
Then should invoke the 'NEW TERMS AND CONDITIONS' button 
** 
When invoke the button 
Then should have the below mandatory** fields  

- Template Name - Alphanumeric text field should allow maximum 100 characters, including special characters (Eg: Carer Permit T&C) 
- Permission Type - Drop down should display all the permission types created in the contract settings 
- Text Editor - Free text field 
 
 
**Text Editor** 
When in the text editor 
Then should write/copy paste the template 
 
** 
Text Formatting** 
When the user selects text and applies formatting options,** 
Then the text should reflect the chosen style (bold, italic, underline, font size/style, alignment, lists, hyperlinks). 
 
 
 
Content Editing** 
When the user performs editing actions (cut, copy, paste, undo, redo),** 
Then the editor should update the content accordingly and maintain formatting. 
 
 

 
Note: Inserting image is not required in terms and conditions 

 
Create Button** 
When invoke the button to create  
Then toaster message appear as "Terms and condition created successfully" 
**
** 
When the template is created 
Then should available in the terms and conditions drop down in **Permission setup > Builder > Permission Tab > General Settings > Terms and Conditions** ** [#135717](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/135717/)** 
** 
Error** 
When the user create a template name against the permission type that already exists in the system,** 
Then the system should display an error message: "Template name already exist" 
 
 
When not able to create terms and conditions due to technical issue or network issue 
Then should see the indication as "Something went wrong Please try again" 
 

 
Audit/Event**  
**Success** 
Event Type / Name: Terms and Condition Created 
Event Description:  Terms and Condition for "Permission type" created successfully  
Date and Time: Current $timestamp 
User Role: Role of the user 
User Name: First Name and Last Name of the Back office user
