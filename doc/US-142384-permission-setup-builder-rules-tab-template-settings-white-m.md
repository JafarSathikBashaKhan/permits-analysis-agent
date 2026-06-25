# User Story 142384: Permission Setup | Builder | Rules Tab| Template Settings | White Mail Reminder

## Metadata
| Field | Value |
|-------|-------|
| ID | 142384 |
| Type | User Story |
| Title | Permission Setup | Builder | Rules Tab| Template Settings | White Mail Reminder |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Figma Added; LV; Partial Complete |
| Module | Permission Setup > Permission Builder |

---

## Acceptance Criteria

**Permission Setup > Builder > [Permission name] > Rules Tab > Template Settings** 
Given a super admin and contract admin 
When in the template settings 
Then should have the tab 

- White Mail Reminder - Used to send postal reminders to users unfamiliar with technology.   
 
**General Setting**  
 
When the permit mode in general settings is set to **Physical **or** Both** 
Then 'Physical Permission Print' and 'White mail reminder' is **mandatory** to select the template 
** 
When the permit mode is set to Virtual**, 
Then the White mail remainder selection should be enabled. 
** 
Template Selection** 
When in the white mail reminder template 
Then should have drop down to select the template 
** 
White mail reminder template - The template should be retrieved from the email templates configuration. story to be covered "[#141488](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/141488/)"  
The templates created against the permission type & 'white mail reminder' notification template in the email template creation in MNPS should listed in the drop down & adding "White Mail Reminder" notification template in email template creation story covered here [#164253](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/164253/) 

 
Note: Sample Physical permission Template has attached in the attachment section 

 
White mail reminder template ** 
When a reminder template is selected event is triggered for a user without an email address, 
Then should have a text editor with merge fields to edit the template 
And send it by **post**. 
 
**Note:** 
For now the 'Insert Merge Fields' option in the text editor is UI only. List of Merge fields & functionality covered in seperate story 
** 
Text editor** - Free text editor 
** 
Text Formatting** 
 
 
 
When the user selects text and applies formatting options** 
 
Then the text should reflect the chosen style (bold, italic, underline, font size/style, alignment, lists, hyperlinks). 
 
 
 
Content Editing** 
When the user performs editing actions (cut, copy, paste, undo, redo), 
Then the editor should update the content accordingly and maintain formatting.
