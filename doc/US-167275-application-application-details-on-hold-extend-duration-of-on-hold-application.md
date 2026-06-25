# US-167275: Application | Application Details | On Hold| Extend duration of On Hold application

| Field | Value |
|-------|-------|
| **ID** | 167275 |
| **Type** | User Story |
| **Module** | Applications |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

**Scenario:**

Once the application has been moved to postpone status, 
Upon invoking More Action , user should have pop-up option to “Extend Duration “ and "Resume" Application
Upon Choosing Extended Duration option user should be able to extend the postpone duration

      
****Extend postponement duration****

    Given an application is in "On Hold" status

    When the BO user wants to "Extend Duration" 

    And chooses  "Extend duration"

    Then the BO user must be able to select a new duration

    And the postponement period must be updated in the system

    And the customer must be notified with an updated duration in email

****BO user tries to extend postponement duration without selecting a valid new duration****

    Given an application is in "On Hold" status

    When the BO user selects "Extend duration" from More Actions

    And does not select a new postponement duration

    Then the system must display a validation error message: "Please select a valid postponement duration"

    And the postponement period must not be updated in the system

    And no email notification must be sent to the customer

**Note**
   1. BO user can trigger "Extend Duration" only twice, and if that is completed twice , then Extend duration should not be visible.

****Audit Log Events****

****Event Name:**** On Hold Duration Extended
****Event Description:**** The On Hold duration for the application was extended by the Back Office (BO) user to allow additional time for resolution. New postpone expiry date set to [new date].
****Event Category:**** Work Queue / Process Management
****Date and Time:**** Current $timestamp
****User Role:**** Role of the User
****User Name:**** First name and Last name of the user
