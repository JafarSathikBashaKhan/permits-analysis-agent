# US-193198: Application | Application Details | On-Hold Application if not resumed

| Field | Value |
|-------|-------|
| **ID** | 193198 |
| **Type** | User Story |
| **Module** | Applications |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

**Pre-Condition : On-hold** 
Given an application is in "On-hold" status 
And the elapsed time since it entered "On-hold" is greater than the configured Duration 
When the Duration set is crossed 
Then the system should automatically move the application to earlier state of the application 
And notification to the BO user  
**Current Work queue state : in-Progress** 
**Event Name:** **Application Auto-RevertedEvent Description: System automatically reverted an application from On-hold to its previous state because the On-hold TTL expired without resumption.Event Category: Workflow / System ActionApplication ID: $ApplicationIDUser Role:** BO User**User Name:** $UserName**Date & Time:** $Timestamp
