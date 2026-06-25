# User Story 143508: Automatically Add Street to Whitelist After Expiry

## Metadata
| Field | Value |
|-------|-------|
| ID | 143508 |
| Type | User Story |
| Title | Automatically Add Street to Whitelist After Expiry |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete |
| Module | Area |

---

## Acceptance Criteria

Given a street is blacklisted with a defined expiry period
And the expiry time has passed

When the Super Admin or Contract Admin views the Whitelist screen

Then the expired street should be automatically populated in the Whitelist screen

And should no longer appear in the Blacklist screen



Given a street is blacklisted and its expiry period has not yet passed

When the admin checks the Whitelist screen

Then the street should not appear in the Whitelist screen

And should still be visible in the Blacklist screen



Events:

When this change occurs

Event Type / Name: Street moved from Blacklist to Whitelist after expiry period.

Event Description: "" automatically moved from Blacklist to Whitelist after expiry period.

Date and Time: $CurrentTimestamp

User Role: $Role of the user who made the change (e.g., System)

User Name: $FirstName $LastName of the user who performed the action.
