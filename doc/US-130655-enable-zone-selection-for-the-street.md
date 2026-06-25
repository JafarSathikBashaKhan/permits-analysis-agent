# User Story 130655: Enable Zone selection for the street

## Metadata
| Field | Value |
|-------|-------|
| ID | 130655 |
| Type | User Story |
| Title | Enable Zone selection for the street |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete |
| Module | Area |

---

## Acceptance Criteria

The below fields are part of street creation, ref predecessor story [User Story 125471](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/125471): Street and Property creation
**
Given a Super Admin or Contract Admin

When in the Add Street** screen**
Then should see a mandatory dropdown fields to be displayed as:

Zone **– A required dropdown field; one zone must be selected per street.
The Zone values should be populated based on the configurations defined in the MNPS system. These values are created in the MNPS configuration screens and consumed within the Apply.
AND
The Zone should be editable in edit screen as well.
AND
When a street is created without mapping it to a zone,
Then system should throw appropriate validation message.


When a zone assigned to an active permission is deleted from the MNPS front:

- The active permission should remain unaffected.

- The deleted zone should no longer be available for selection in future permissions.






Note: Location should be mapped to properties.
Event is not required for this.
