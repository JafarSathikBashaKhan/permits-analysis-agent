# User Story 142478: Area | Location - Create

## Metadata
| Field | Value |
|-------|-------|
| ID | 142478 |
| Type | User Story |
| Title | Area | Location - Create |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete |
| Module | Area |

---

## Acceptance Criteria

Given a permissioned user (Super Admin or Contract Admin),**





When in Location grid screen

Then should see an action button to New Location.****


When Create Location is invoked

then should see a provision to add,



Location name** - Free text field, alpha numeric, exclude special characters, character limitation up to 100. [Mandatory]**
Streets **- drop down field selection of streets associated against the contract, multi select, no limitation on selection [Optional]**
Properties **- drop down field selection of properties associated against selected street and the contract, multi select, no limitation on selection. [If a street is selected, then associating a property is mandatory, otherwise optional]**
When property is mapped its respective UPRN and permission limit should be auto populated based on the mapping.
Status **- defaulted to inactive initially, once associated to active permission the status should be set to active.**


A street should be selected and then the associated properties should be selected against the location.

Provision to add multiple streets and properties should be available.

Represent the count of streets and properties added against the location.


Add and delete location:**
Option to add and remove the streets should be available against each street entry.
Option to undo the removed entry should also be available. [since delete is a soft delete, undo should be possible.]
**
Search**:
Search option against property should be available to search through the properties name or id.
**
Once the required fields are populated
Then option to Create and Cancel** should be available
Create - should able to create the location and associate the streets and properties selected.
A success toaster should be available on creation "Location created successfully."
**
Cancel - when invoked should see a prompt "Are you sure you want to cancel? This will reset all data. Do you wish to continue? with yes and No button"
The above message should appear when the create screen has data populated and attempted to cancel, if on no data entry then cancel when invoked should chose the slider for creation and land in grid screen of location.


Property mapping: **
Property mapping to the street should be unique against location. [When mapping a property to a location, the same property for the selected street should not be mapped to another location.]
Show validation message when the above scenario is attempted. "The selected property has already been assigned to another location."

**

Events**:

When a street is created, capture event as,

Event Type / Name: Location created.

Event Description: "Location name" created Successfully.

Date and Time: $CurrentTimestamp

User Role: $Role of the user who made the change (e.g., Super Admin / Contract Admin)

User Name: $FirstName $LastName of the user who performed the action.
