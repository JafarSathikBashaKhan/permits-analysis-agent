# US-188818: Time Zone Implementation

| Field | Value |
|-------|-------|
| **ID** | 188818 |
| **Type** | User Story |
| **Module** | MNPS Contract Settings |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

Retrieve Contract Time Zone
Given the Time Zone is configured in the MNPS Contract Settings,
 
When the Permissions system loads for a specific contract,
 
Then it should retrieve and apply the corresponding time zone setting for all date/time operations.
 

 
**Display of Date and Time**
 
Given a contract has a configured time zone,
 
When any date/time value is displayed in the Permissions system, 
Then the time should be displayed in the configured contract time zone.
 

 
**Storage of Date and Time**
 

 
Given a user creates or updates a record in the Permissions system,
 
When the record is saved,
 
Then the system should store all date/time values in UTC format,
 
And convert them to the configured contract time zone only during display.
 

 
**Consistency Across All Modules**
 
Given time zone handling is enabled for the contract,
 
When viewing any Permission-related module (e.g., Permissions Summary, Pricing, Settings, Renewals, etc.),
 
Then all displayed time values should remain consistent with the contract’s configured time zone.
 

 
**Multi-Contract Context Handling**
 
Given a user has access to multiple contracts, each with different time zones,
 
When the user switches between contracts in the Permissions system,
 
Then all time values should automatically adjust based on the active contract’s time zone.
 

 
**Audit and History Views**
 
Given actions (e.g., create, modify, publish, expire) are recorded with timestamps,
 
When the audit or version history is viewed,
 
Then timestamps should reflect the time zone configured in MNPS Contract Settings.
