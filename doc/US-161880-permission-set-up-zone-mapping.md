# User Story 161880: Permission set up | Zone mapping

## Metadata
| Field | Value |
|-------|-------|
| ID | 161880 |
| Type | User Story |
| Title | Permission set up | Zone mapping |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete |
| Module | Permission Setup > Permission Builder |

---

## Acceptance Criteria

Navigation path: 
Permission creation - > Permission set up tab - > **Zone mapping** 
** 
Given a permissioned super admin or contract admin 
When a permission is created using a Zone-based group,
Then a new section titled “Zone Mapping” should appear below the General Settings in the Permission Settings screen.
 
And 
 
this settings is Mandatory as at least one zone set needs to be configured to save the permission created.
 

 
When the user views the Zone Mapping section,
 
Then the following elements should be visible:
 
An info text/description as per the Figma design.
 
An option to add New Zone Set.**** 

 
When the user triggers the “New Zone Set” action,
 
Then the following should occur:
 
A new zone set field labelled Zone Set 1 should appear, allowing selection of zones from a dropdown list.
 
Only zones selected in the General Settings of the permission should be available in the dropdown
 
The user can create multiple zone sets, incrementally labelled as Zone Set 1, Zone Set 2, and so on.
 

 
There should be no limitation on:
 
The number of zone sets that can be created.
 
The number of zones that can be selected within each set.
 

 
When selecting zones 
 
Then ensure Zones selected in one zone set (e.g., Zone Set 1) should not be available for selection in other zone sets (e.g., Zone Set 2) of the permission.
 
[within each individual zone set, selected zones must be unique (i.e., no duplicates within a single set).]
 

 
When viewing a zone set,
 
Then a delete option should be visible next to it.
 
And users should be able to permanently delete (hard delete) any created zone set using this option.
 

 
On creating zones sets with all required zones
 
Then the changes can be saved as Draft
 

 
When user view the zone mapping section in draft mode and if the pricing for the zone sets are not configured yet 
 
Then should see a indication highlighting "Pricing not configured"
 
And  
If the pricing is configured against a zone set 
Then there should an indication stating the "Pricing Configured." 

 
Zone Set Creation Restriction**If all available zones for permissions are already mapped to existing zone sets, and no further zones are available for selection,** 
then the "Create Zone Set" button must be disabled. 
 
Zone Set Deletion Restriction** 
If pricing has been configured for a zone set (in either Draft or Edit mode),** 
then the system must restrict deletion of that zone set by disabling the Delete button on the Zone Mapping screen. 
 
Zone Set Editing Validation** 
While editing a zone set: 
Users must be allowed to check/uncheck zones as needed. 
However, the system must ensure that at least one zone remains mapped to the zone set at all times. 
Removing all zones during editing must be prevented. 
If the user attempts to save changes with no zones selected, display the following error message: 
"At least one zone must be mapped to the zone set. Changes cannot be saved otherwise."** 
 
Zone Set Synchronization with Pricing Configuration** 
Any zone set created or edited in the Permissions module must be automatically synchronized with the corresponding Pricing Configuration of that permission.** 

 
When zone sets are created in the Zone Mapping section,
 
Then the same zone sets should appear as individual tabs within the Pricing Configuration screen of the respective permission. Refer to Story: User Story 157477 **for pricing tab behaviour.
