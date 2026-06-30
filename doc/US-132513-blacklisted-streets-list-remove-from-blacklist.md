# User Story 132513: Blacklisted Streets: List, Remove from blacklist

## Metadata
| Field | Value |
|-------|-------|
| ID | 132513 |
| Type | User Story |
| Title | Blacklisted Streets: List, Remove from blacklist |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete |
| Module | Area |

---

## Acceptance Criteria

**Grid Screen of Blacklist:
**







**
Given a Super admin or contract admin****
When the street is blacklisted

Then the entry of the same should be available in blacklist tab.



When the street is blacklist tab

A search **box should be available in this screen to search for the backlisted street name.**


When in the blacklist grid screen
Then the Grid screen should have following columns,

Street name** [Blacklisted street name] **
No. Of Properties** - Count of properties associated to the blacklisted street
**Start Date- **street blacklisted date**
End Date - **Expiry date for the blacklist / to be mentioned as **Indefinite **if the street is marked to be indefinite**


The below audit fields to be available in the column picker:
Created by
**
**Created On
**
**Updated By
**
**Updated On
**
**Action
**
**- View **[In View screen, Edit should be available]**
- Remove from Blacklist****

**
The grid should have default filtering, sorting and pagination applied.
**
Action - Remove from Blacklist:
**
**
**
When in the blacklist grid screen,
Then should see an option to **Remove from blacklist** in the action column.**


when selecting Remove from Blacklist option from Action column.

Then a confirmation prompt should be enabled to state "Are you sure to remove the {street name} from blacklist?" with Cancel and Confirm.

Confirm - should save the changes and get the street removed from blacklist and logged into whitelist

Cancel  - should close the pop up [Figma to be corrected [ok button to be replaced with yes or no prompt]



Toaster message should be available whenever the successful updates [Addition, updated, deletion] happen against the street.


When selecting multiple entries from blacklist grid screen
Then should see a button as "Whitelist" **
AND
Should be able to multiselect and move the blacklisted entries to whitelist screen with confirmation prompt defined in the figma.
**

A user should be able to move a street from the blacklist to the whitelist even if the expiry date has not yet been reached.

Event **Name: "Street name" removed from Blacklist.
Event Description: "Street name" removed from Blacklist.
Date and Time Stamp: Current date and time
User Role: The role of the user who made the change
User Name: First Name and Last Name of the user who made the change.


Note: Delete is not applicable for blacklist screen.
