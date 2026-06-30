# User Story 163010: Permission | Rules | Map Pricing

## Metadata
| Field | Value |
|-------|-------|
| ID | 163010 |
| Type | User Story |
| Title | Permission | Rules | Map Pricing |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete |
| Module | Permission Setup > Permission Builder |

---

## Acceptance Criteria

Given a Super Admin or Contract Admin,

When in the Zone Mapping section and when zone sets have been created,

Then an action button labelled "Create Pricing" should be visible for the available zone sets,

And this button should only be displayed if pricing configurations have not yet been defined for the corresponding permissions. 
And the "Create Pricing" button to be enabled only if at least one zone set to be available. 
When "Create Pricing" is clicked,

Then the user should be navigated to the Create Pricing screen,

Where the following fields should be pre-populated: 

- Permission Type 
 
- Permission Sub-Type 
 
- Zone Sets 
 
 
If pricing configurations are partially or fully defined for the available zone sets,

Then an "Edit Pricing" button should be displayed instead of the "Create Pricing" button. 
When "Edit Pricing" is clicked,

Then the user should be navigated to the Edit Pricing screen,

And the relevant data should be pre-populated accordingly. 
If no zone sets have been configured,

Then  button to access the pricing configuration screen should be disabled.
