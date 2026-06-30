# User Story 181541: Street | Property blacklist

## Metadata
| Field | Value |
|-------|-------|
| ID | 181541 |
| Type | User Story |
| Title | Street | Property blacklist |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | new |
| Module | Area |

---

## Acceptance Criteria

Given a super admin/contract admin
When in the street screen
Then should see a list of streets show in the grid screen
**
When invoke the street name
Then should open a view screen and show the property linked to the selected street


When in the view screen
Then should have the action column with the option to Add to Blacklist on each properties line items


When the "Add to blacklist" option is invoked against the property****
Should see a pop up which state, "How long you wanted to make the property blacklisted?" **
with options in drop down as,

- One Week
- One Month
- Six Month
- One Year
- Custom Date range
- Mark Indefinite


AND
When one of the options is selected, the appropriate period End date should be visible based on the selection for the user. [Refer figma]

AND
When user selects, either of the below one, then the property should be blacklisted until the end date of the selected option.

- One Week
- One Month
- Six Month
- One Year



AND
When the "Custom Date Range" is selected, show a **calendar picker** to set the Start and End date,
AND

When the "Mark Indefinite" option is selected, the property will remain blacklisted indefinitely—until the user manually removes it from the blacklist.AND
After selecting any of the above options, a button to save the changes and cancel the pop up should be available.
AND
When the property is selected to be blacklisted,
Then the selected property should be available in the blacklist property tab
**
When in the street screen

Then the blacklist tab is renamed as Black List Street
And should have the new tab as Black List Property



When a property is blacklisted,

Then it should not be displayed under the Whitelist tab for the corresponding street.


When in the  Black List Property tab
Then should have the following fields

- Property name/number
- Postcode
- Street Name
- UPRN
- Permission Limit
- Start date - **street blacklisted date
- End date - Expiry date for the blacklist / to be mentioned as **Indefinite **if the property is marked to be indefinite

The below audit fields to be available in the column picker:

- Created by
- Created On
- Updated By
- Updated On


**Action**
**- ****Remove from Blacklist**
**- Edit**
**
When the black list property end date is reached
Then it should moved to the Whitelist tab


Remove from Blacklist:**
****
When in the blacklist grid screen,
Then should see an option to **Remove from blacklist** in the action column.**

when selecting Remove from Blacklist option from Action column.
Then a confirmation prompt should be enabled to state "Are you sure to remove the {property name} from blacklist?" with Cancel and Confirm.
Confirm - should save the changes and get the property removed from blacklist and logged into whitelist
Cancel  - should close the pop up



Edit blacklisted property:**
Edit screen of blacklisted property should be as similar to the blacklisted street edit capabilities.
Additionally,
There should be an option to set the toggles on and off for Indefinite and Date range [start and End date should be editable].
**
When in edit blacklist screen,
Then should see toggles as below,
Indefinite **- Can be enabled on and off,**
Date Range** - When indefinite is toggled off, then the End date should be made visible to configure and if the indefinite is toggled ON, then End date should not be available.
End date should be editable to future date and start date should not be editable and should not be visible across the edit screen.



**Events**:
When editing any field, the following **events **should be captured:
Example 1:
Event Name: Blacklist property updated
Event Description: "[Field Name] updated" (e.g., "Postcode updated")
Date and Time Stamp: Current date and time
User Role: The role of the user who made the change
User Name: First Name and Last Name of the user who made the change.

Example 2:
Event Name: "Indefinite toggled on" for the property
Event Description: "Indefinite toggled on" for the property "property name/number"
Date and Time Stamp: Current date and time
User Role: The role of the user who made the change
User Name: First Name and Last Name of the user who made the change.

Event Name: Date range set for the property
Event Description: Date range set for the property "property name/number" updated
Date and Time Stamp: Current date and time
User Role: The role of the user who made the change
User Name: First Name and Last Name of the user who made the change.

We do not have delete for blacklisted property.
