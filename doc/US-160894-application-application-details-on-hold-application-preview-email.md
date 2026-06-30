# US-160894: Application | Application Details | On-Hold Application (Preview Email)

| Field | Value |
|-------|-------|
| **ID** | 160894 |
| **Type** | User Story |
| **Module** | Applications |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Partial Complete |

## Acceptance Criteria

**On-Hold Application**

****Pre-Condition****

1.  ****Work Queue status : In-Progress****

**Visibility of Applications**

    Given applications submitted via the portal appear under respective permissions

    And applications are routed to the relevant work queue

    And the BO user is authorized to process applications

  **On-hold option availability**

    Given an application is in "**In-Progress**" status

    When the BO user views the application in the Overview section and selects "More action" button

    Then a "**On-hold**" option must be available

 **On-hold requires reason and duration**

    When the BO user selects "On-hold"

    Then a pop-up should display a list of predefined On-hold reasons(Confirgured from MNPS)

    And the BO user must select a reason

    And the BO user must select a On-hold duration (Label: "On-hold to date")

    And On-hold cannot proceed without both values

**Display text field when 'Others' is selected as reason**

    Given the BO user is on the reason selection screen

    When the BO user selects "Others" from the list of reasons

    Then a text field should be displayed

    And the BO user should be able to type a custom reason in the text field

  **No text field displayed when a predefined reason is selected**

    Given the BO user is on the reason selection screen

    When the BO user selects any predefined reason other than "Others"

    Then no text field should be displayed

**Preview On-hold email content and delivery**

    Given the BO user selects a reason and duration

    When the system generates the On-hold email

    Then it must pre-populate with:

  

*   Email Template (Defaulted to "On-hold " template)
*   Email Body    (Includes merge fields + reason + duration )
 Merge Fields : Merge fields should be included in the Email template and BO user can edit , On-Hold reasons are included as a part of merge field and upon choosing it, it should populate the selected reason from the dropdown

    And the BO user must be able to edit the email body

    When the BO user Selects "Preview & On hold" 

    Then the Preview Email should display

 **Preview Email** 

When the BO user confirms and selects the "Preview &  On-hold "

Then the Preview email should be displayed 

Preview details contains,

-Email type and Application / reference number at top with close button

- Sent to (email id)

- Subject

- Email Body with Merge fields selected

   - Attachments added if any

With "Cancel" and "On-Hold & Send Email"  

And Clicking on cancel should return back to previous window for user edit

Send On-hold application Email is covered in : #172045
