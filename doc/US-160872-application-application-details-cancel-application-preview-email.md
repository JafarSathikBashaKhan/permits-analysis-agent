# US-160872: Application | Application Details | Cancel Application (Preview Email)

| Field | Value |
|-------|-------|
| **ID** | 160872 |
| **Type** | User Story |
| **Module** | Applications |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete |

## Acceptance Criteria

**Cancel Permit Process (Back Office) Functional flow**

 **Pre-Condition**

**  
Work Queue status : ACTIVE  
  
**

**1.Cancel Option Availability**

Given the application is in **Active** status

When the BO user wants to cancel the application

Then a "Cancel Application" option must be available for selection 

  

**.Cancel reason selection from list**

When the BO user selects "Cancel Application"

Then a pop-up should display a drop-down list of predefined cancel reasons that are configured

And the BO user must select one reason from the list to proceed cancellation of the application

  
**Note:**
Cancellation Reasons configured in settings(**MNPS configuration settings)**

  

If others is selected from the dropdown:

  

**Display text field when 'Other Reasons' is selected as reason**  

  

    Given the BO user is on the reason selection screen  

  

    When the BO user selects "Other Reasons" from the list of reasons  

  

    Then a text field should be displayed  

  

    And the BO user should be able to type a custom reason in the text field  

  

  **No text field displayed when a predefined reason is selected**  

  

    Given the BO user is on the reason selection screen  

  

    When the BO user selects any predefined reason other than "Other Reasons"  

  

    Then no text field should be displayed  

 ** Cancel Application Email Pop-up**

When the BO user selects the Cancel option

Then a Cancel Application Email pop-up must appear with:

*   Email Template: defaulted to the “Cancel” template (retrieved from contract settings, non-editable).
*   Email Body: pre-populated with Merge Fields and cancellation content (from template) and editable using a Text Editor.
*   User should be able to add any attachment if required using attachment icon, and once attached will be included in email
*   Merge Fields : Merge fields should be included in the Email template and BO user can edit , Reject reasons are included as a part of merge field and upon choosing it, it should populate the selected reason from the dropdown
*   "Cancel" and "Preview & Cancel " button is available for User selection

**Note** : Cancel Email Template is pre-defined in the settings. So respective Email content will be displayed automatically
                 Merge fields insert already covered in #148624 

 **Preview Email** 

When the BO user confirms and selects the "Preview & Cancel "

Then the Preview email should be displayed 

Preview details contains,

-Email type and Application / reference number at top with close button

- Sent to (email id)

- Subject

- Email Body with Merge fields selected

   - Attachments added if any

With "Cancel" and "Send Cancel Application Via Email"  

And Clicking on cancel should return back to previous window for user edit

Send Cancellation Email is covered in : #172046
