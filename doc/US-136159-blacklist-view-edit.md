# User Story 136159: Blacklist | View & Edit

## Metadata
| Field | Value |
|-------|-------|
| ID | 136159 |
| Type | User Story |
| Title | Blacklist | View & Edit |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete |
| Module | Area |

---

## Acceptance Criteria

**View:**
**
**
Given a permissioned user [super admin or contract admin]
When in blacklist grid screen
Then should see the street name invokable.
**
When View is invoked
Should be able to view the fields pertaining to streets and properties as defined below with its appropriate values;


Street, USRN
Town Name,
Zone,
Blacklist expiry period [start & End date or toggle Indefinite]
Properties associated to the street, UPRN
Post code
Permission limit

**
When in View screen
Then should see an option to **Edit**.
**
Edit blacklisted street:**
Edit screen of blacklisted street should be as similar to the whitelist edit capabilities.
Additionally,
There should be an option to set the toggles on and off for Indefinite and Date range [start and End date should be editable].
**
When in edit blacklist screen,
Then should see toggles as below,
Indefinite **- Can be enabled on and off,**
Date Range** - When indefinite is toggled off, then the End date should be made visible to configure and if the indefinite is toggled ON, then End date should not be available.
End date should be editable to future date and start date should not be editable and should not be visible across the edit screen.
**

Except the USRN and UPRN rest of the below fields are open to edit:
Indefinite toggle [if this toggle is disabled, then the end date should be editable]
Street Name
Town Name
Zone
Properties
Post Code
Permission Limit


Events**:
When editing any field, the following **events **should be captured:
Example 1:
Event Name: Blacklist street updated
Event Description: "[Field Name] updated" (e.g., "Postcode updated")
Date and Time Stamp: Current date and time
User Role: The role of the user who made the change
User Name: First Name and Last Name of the user who made the change.

Example 2:
Event Name: "Indefinite toggled on" for the street
Event Description: "Indefinite toggled on" for the street "Street name"
Date and Time Stamp: Current date and time
User Role: The role of the user who made the change
User Name: First Name and Last Name of the user who made the change.

Event Name: Date range set for the street
Event Description: Date range set for the street "Street name" updated
Date and Time Stamp: Current date and time
User Role: The role of the user who made the change
User Name: First Name and Last Name of the user who made the change.


We do not have delete for blacklisted streets.
