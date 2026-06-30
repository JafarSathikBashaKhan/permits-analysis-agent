# User Story 138832: Configure Permissions | Permissions Tab - Overview | Display Description

## Metadata
| Field | Value |
|-------|-------|
| ID | 138832 |
| Type | User Story |
| Title | Configure Permissions | Permissions Tab - Overview | Display Description |
| Assigned To | Sudha Selvaraj |
| State | Ready for UAT |
| Tags | LV |
| Module | Permission Setup > Permission Builder |

---

## Acceptance Criteria

**Field Visibility and Access
** 
 
 
Given I am a Super Admin or Contract Admin,** 
When in the display description field of a permission, 
Then I should see an editable description field.
 

 
Character Limit Validation**** 
Given I enter a description in the field,
 
When the input exceeds 1000 characters,
 
Then the system should prevent from entering. (Maximum characters indication should be there in the UI) 

 
Allowed Character and Format Validation**** 
Given I enter content in the description field,
 
Then the following should be allowed: "Alphabets, numbers, punctuation, special characters" 

 
Empty Field Handling**** 
Given I leave the description field empty,
 
Then the system should restrict from Publishing as the entry as the field is mandatory. 

 
Default Value** 
When in the field, 
Then should see the default value as "Purchase your permission with ease" (Dummy content for now. Formal content will  be defined later) 
& 
Then the default values should be allowed to edit. 
** 
Description Display in Portal**
 
Given a display description is saved, 
When a customer views that permission in the customer portal, 
Then the description must be displayed exactly as saved.
