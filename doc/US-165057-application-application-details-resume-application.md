# US-165057: Application | Application Details | Resume Application

| Field | Value |
|-------|-------|
| **ID** | 165057 |
| **Type** | User Story |
| **Module** | Applications |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete |

## Acceptance Criteria

**Resume Application**

****Pre-Condition****

****Current Work Queue status : On-Hold****

**BO User successfully resumes a postponed application and performs next action**

    Given an application is in "On-Hold" status
    When the BO User wants to Resume Application
    And selects "Resume " button
    Then a confirmation pop-up message displayed as " Are you sure want to Resume this permit? Once resumed it will move back to Previous state." with   "Cancel" and "Resume "

    When BO user chooses Resume , application is resumed
    Then the application status must change **from "On-Hold" to "Pending Approval"**
    And the application should be available for next actions by the BO User

    And the BO User must be able to perform any of the following actions:
*   Approve
*   Reject
*   Request Evidence
*   Internal Referral

    When BO User selects "Cancel"
    Then the Resume application should not be done
    And application remains in the same state. (On-Hold)

****Updated Work Queue status (Once Resumed): In-Progress****

**Audit log entry is created when application is resumed**

    Given the BO User resumes a On-Hold application
    Then an audit log entry must be created with:

*   **Event Name**                On-Hold Application Resumed
*   **Event Description**       Resuming the application for further processing
*   **Event Category**          Work Queue
*   **Date and Time**           Current $timestamp
*   **User Role**                     Role of the User
*   **User Name**                 First name and Last name of the user
