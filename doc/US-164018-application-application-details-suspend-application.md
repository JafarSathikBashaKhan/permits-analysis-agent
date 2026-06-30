# US-164018: Application | Application Details | Suspend Application

| Field | Value |
|-------|-------|
| **ID** | 164018 |
| **Type** | User Story |
| **Module** | Applications |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

**Pre-Condition of the Application**

**Current Work Queue Status : ACTIVE**

**BO User sees "Suspend Application" option**

    Given the application is in ACTIVE state

    When the BO User invokes the Application (reference number)

    Then the system must display the "Suspend Application" button

  **BO User selects "Suspend Application"**

    Given the application is in ACTIVE state

    When the BO User selects "Suspend Application"

    Then a pop-up must be displayed with a list of suspension reason 

**Suspend reason selection from list**

When the BO user selects "Suspend Application"

Then a pop-up should display a drop-down list of predefined suspend reasons ( that are configured in MNPS settings)

And the BO user must select one reason from the list to proceed cancellation of the application

  
**Note:**
Suspend Reasons configured in settings(**MNPS configuration settings)**

  
If others is selected from the dropdown:

  
**Display text field when 'Others' is selected as reason**  

    Given the BO user is on the reason selection screen  

     When the BO user selects "Others" from the list of reasons  

     Then a text field should be displayed  

     And the BO user should be able to type a custom reason in the text field  

  
  **No text field displayed when a predefined reason is selected**  

  
    Given the BO user is on the reason selection screen  

     When the BO user selects any predefined reason other than "Others"  

    Then no text field should be displayed  

**Application status changes to "SUSPENDED"**

    Given the BO User provides a valid suspension reason

    When the BO User confirms the suspension

    Then the application status must change from "ACTIVE" to "SUSPENDED"

**Updated Work QUEUE : SUSPENDED**

 ** Suspend Application Email Pop-up**

When the BO user selects the Suspend option

Then a Suspend Application Email pop-up must appear with:

*   Email Template: defaulted to the “Suspend” template (retrieved from contract settings, non-editable).
*   Email Body: pre-populated with Merge Fields and Suspension content (from template) and editable using a Text Editor.
*   User should be able to add any attachment if required using attachment icon, and once attached will be included in email
*   Merge Fields : Merge fields should be included in the Email template and BO user can edit , Suspend reasons are included as a part of merge field and upon choosing it, it should populate the selected reason from the dropdown
*   "Cancel" and "Preview & Suspend" button is available for User selection

 **Preview Email** 

When the BO user confirms and selects the "Preview & Suspend"

Then the Preview email should be displayed 

Preview details contains,

-Email type and Application / reference number at top with close button

- Sent to (email id)

- Subject

- Email Body with Merge fields selected

   - Attachments added if any

With "Cancel" and "Send Suspend Application Via Email"  

And Clicking on cancel should return back to previous window for user edit

**Send Suspend Application Email Pop-up**

When the BO user selects the "Send Suspend application via Email" button

Then a Suspend Application Email should be triggered to the applicant.

And Cancel should stop sending Email and returns back to Edit screen email template.

**Visibility of Suspend Action**

**If the application is about to reach the expiry and when the configuration enables the renew button , suspend , cancel , change zone should not be visible for user selection.**

  **Audit log entry is created upon suspension**

    Given the application status is changed to "SUSPENDED"

    Then the system must create an audit log entry with:

**Event : Permit application Suspension **

*   Event Name: Application Suspended
*   Event Description: BO User initiated the suspension of an active application, due to (reason selected)
*   Event Category: Application Processing
*   Date and Time           Current $timestamp
*   User Role                     Role of the User
*   User Name                 First name and Last name of the user
