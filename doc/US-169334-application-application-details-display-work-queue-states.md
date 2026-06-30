# US-169334: Application | Application Details | Display Work Queue States

| Field | Value |
|-------|-------|
| **ID** | 169334 |
| **Type** | User Story |
| **Module** | Work Queue / Status |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

**BO User views current work queue state in Permission Details page**

  Given the BO User is logged into the system  

  And the BO User navigates to the "Permission Details" page of a submitted application  

  When the page is displayed  

  Then the current work queue state must be displayed under the label "Work Queue Status"  

  And the displayed status must reflect the actual state of the application (e.g., Pending Approval, Active, Suspended, Postponed, Cancelled, etc.)  

  

**BO User views current work queue state in the Overview section of a permission**  

  

  Given the BO User is logged into the system  

  And the BO User opens the Overview section by invoking the Reference Number of a permission  

  Then the current work queue state must be displayed near the Reference Number/Application Number

  And the current work queue state must also be displayed under "Permission Details" in the Overview section, labelled as "Status"

  And the displayed status must accurately reflect the current state of the application (e.g., Pending Approval, Active, Suspended, Postponed, Cancelled, etc.)
