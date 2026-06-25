# User Story 130662: Ability to blacklist the street

## Metadata
| Field | Value |
|-------|-------|
| ID | 130662 |
| Type | User Story |
| Title | Ability to blacklist the street |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete |
| Module | Area |

---

## Acceptance Criteria

**Blacklist**:**





Given I'm a super admin or Contract admin

When in street grid screen,

Then should see a action column with option for "Add to Blacklist**"**


When the "Add to black list" option is invoked against the active or inactive **street entry**
Should see a pop up which state,
"How long you wanted to make the street blacklisted?"  **
with options in drop down as,
**One Week**
**One Month**
**Six Month**
**One Year**
**Custom Date range**
**Mark Indefinite **
AND
When one of the option is selected, the appropriate period End date should be visible based on the selection for the user. [Refer figma]

AND
When user selects, either of the below one, then the street should be blacklisted until the end date of the selected option.
One Week
One Month
Six Month
One Year

AND
When the "Custom Date Range" is selected, Show a **calendar picker** to set the Start and End date,
AND

When the "Mark Indefinite" option is selected, the street will remain blacklisted indefinitely—until the user manually removes it from the blacklist.AND
After selecting any of the above options, a button to save the changes and cancel the pop up should be available.
AND
When the street is selected to be blacklisted,
Then the selected street should be available in the blacklist grid screen
[Ref story: [User Story 132513](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/132513): Listing, Editing and remove street from Blacklist]
**
Multiple selection - Black list:**
**
When user selects multiple entries** from whitelist grid screen**
Then enable Blacklist button in the grid screen.



When invoking "Blacklist**" button after selecting multiple street ** active or inactive ** entries**
Then should see a pop up which state,"How long you wanted to make the selected  streets to be blacklisted?" **
with options in drop down as,
**One Week**
**One Month**
**Six Month**
**One Year**
**Custom Date range**
**Mark Indefinite **
AND
When one of the option is selected, the appropriate period End date should be visible based on the selection for the user. [Refer figma]

AND
When user selects, either of the below one, then the street should be blacklisted until the end date of the selected option.
One Week
One Month
Six Month
One Year

AND
When the "Custom Date Range" is selected, Show a **calendar picker** to set the Start and End date,
AND

When the "Mark Indefinite" option is selected, the street will remain blacklisted indefinitely—until the user manually removes it from the blacklist.AND
After selecting any of the above options, a button to save the changes and cancel the pop up should be available.
AND
When the street is selected to be blacklisted,
Then the selected street should be available in the blacklist grid screen
[Ref story: [User Story 132513](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/132513): Listing, Editing and remove street from Blacklist]


**
While selecting multiple of streets to blacklist and if one or many is associated to active permission

Then should still be allowed to blacklist.

AND
The blacklisted streets should not be available to select while applying for a permission in customer portal. [Only whitelisted street should be considered for availing a permission]

AND

When blacklisting a street, only the street and the associated property should be blacklisted not the associated town, postcode.



Toaster **message:
When a single street gets blacklisted,
Then should show message as "The street has been blacklisted successfully."
**
When a multiple selected streets are blacklisted
Then show toasted message as "The selected  streets are all blacklisted successfully."


The below event **should be captured while blacklisting the street[s];

Event name: Street "Street name" blacklisted.

Event Description: The Street and properties blacklisted

Date and Time stamp: Current date and time

User Role: $Role of the user who made the change

User Name: First Name and Last Name of the user who done the change.
