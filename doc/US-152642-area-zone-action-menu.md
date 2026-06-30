# User Story 152642: Area | Zone | Action menu

## Metadata
| Field | Value |
|-------|-------|
| ID | 152642 |
| Type | User Story |
| Title | Area | Zone | Action menu |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete; QA tasks |
| Module | Area |

---

## Acceptance Criteria

Given a super admin/contract admin
When in the zone list
Then should have the action column


When in the action column
if the status is in draft
Then should have the following options

- Publish
- Delete

If the zone is published
Then should have the Unpublish option alone


Note: Previously, the zone creation happened in MNPS, and Apply only consumed it. Now that the creation is implemented directly in Apply, a 'Delete' option is required under the Actions column. Earlier, we had 'Publish' and 'Unpublish' buttons shown directly in the Actions column this now needs to be replaced with a three-dot (ellipsis) menu containing all actions.
