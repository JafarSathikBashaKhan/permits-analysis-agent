# User Story 187217: Configure Permissions | Permissions Tab | Special Events Pricing

## Metadata
| Field | Value |
|-------|-------|
| ID | 187217 |
| Type | User Story |
| Title | Configure Permissions | Permissions Tab | Special Events Pricing |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | new |
| Module | Permission Setup > Permission Builder |

---

## Acceptance Criteria

**Menu Availability
** 
 
 
 
Given Super admin or Contract Admin, 
When in the permission configuration for a permission, 
Then should see a tab named "Pricing". 
** 
When the Special Event is enabled in the permission’s General Settings,
 
Then the Pricing configuration that is done should be considered only for the special event permission. 

 
Pricing Setup** 
**Create Pricing:**Given a Super Admin or Contract Admin is in the Pricing tab,,** 
When the user opens the pricing configuration,
 
Then the screen should allow creation (Create Pricing) and management of pricing within the same permission context (no need for separate pricing name).
 

 
Fields available**: 
Given a Super Admin or Contract Admin is in the Pricing tab,,Then should see the below fields, 
Start Date and End Date Optional  
If both dates are blank, pricing becomes active when the permission is published. 
Selected via date picker.** 

 
Validations for Start and End Date Fields:
 
Start Date cannot be in the past.
 
End Date cannot be earlier than Start Date. 

 
Add Duration**: 
Given the user is on the Pricing screen, 
Then should have the option to add duration. 
** 
When the user selects + Add Duration,
 
Then a new Duration Configuration panel should open with:
 

- Frequency (numeric field: 1–100) 
- Period (dropdown: Minutes, Hours, Days, Weeks, Months, Years) 
- Tier Pricing Section, containing: 

- Default Tier 1 by default. 
- Options to Add, Duplicate, or Remove tiers. 
 
- Each Tier should allow: 
- One or more Band Pricing fields (e.g., Band A, Band B, etc.) 
- A Diesel Surcharge (%) field (visible and mandatory if toggle ON at Contract level). 
- Option to Add Band, Duplicate, or Remove Band entries. 
 

 
Validations:
 
If frequency or period missing → “Please select both frequency and period.”
 
If same frequency and period already exist → “We’ve already got that same duration in the pricing.”
 
Maximum 10 durations can be configured → “A maximum of 10 duration sets can be configured per permission.” 

 
Tier and Band Pricing
****Tier Pricing**** 
Controlled by Tier Pricing toggle at Contract level.
 
If ON, allow multiple tiers (max 20) with associated Band and Diesel Surcharge values.
 
If OFF, display Band Pricing only (no tiers).
 
Users can Duplicate or Remove tiers.
 

 
Band Pricing**** 
Accepts decimal input (0–1000).
 
Validation: “Band price must be between 0 and 1000.”
 

 
Diesel Surcharge**** 
Controlled by Diesel Surcharge toggle at Contract level.
 
If ON, it becomes mandatory.
 
Accepts decimal input (1–100).
 
Validation: “Please enter a valid percentage between 1 and 100.”
 

 
Grid Display**** 
Given one or more durations are configured,
 
Then the pricing details should be displayed in a grid with columns:
 
Duration (e.g., “12 Weeks”)
 
Tier, Band, and Diesel Surcharge details
 
Actions: Edit and Remove
 

 
Expand/Collapse Interaction
**Given multiple durations are configured,** 
When the user expands or collapses a duration section,
 
Then all associated tiers and bands under that duration should toggle visibility accordingly. 

 
Edit and Remove Functionality
**Given one or more durations are configured,** 
When the user selects “Edit” or “Remove,”
 
Then the respective duration data should open for edit or be deleted after confirmation.
 
Message on remove: “Are you sure you want to delete this duration?” 

 
Filter Interaction
**Given the user clicks the filter icon,** 
When filter criteria are applied (e.g., Tier or Duration),
 
Then only the matching rows should display. 

 
Search Logic
**Given the search field above the grid,** 
When the user enters a value,
 
Then the system should perform an “equals” search across Tier and Band columns.
 

 
Pagination and Filters**** 
Given the user is in pricing screen, 
Then Pagination, search, and column picker appear only if more than 5 entries exist. 

 
List Screen** 
Given the user is in the Pricing tab,**Then the list view should display all pricing configurations created under that permission in a grid view. 

 
Given the pricing list is displayed,
 
Then the grid should include the following columns:
 
Pricing Name (hyperlinked to open configuration)
 
No of *Properties*** (number of ***properties ***linked to the pricing) - *In Figma, it is shown as streets, but it should be PROPERTIES.* 
Durations (number of durations configured under pricing)** 
Start Date
 
End Date
 
Actions (Delete option) 

 
Actions
**Given the user is in the pricing list,** 
When the user clicks on the Pricing Name,
 
Then the respective pricing configuration screen should open in edit mode.
 

 
Given a pricing entry exists,
 
When the user clicks the Delete (trash) icon,
 
Then a confirmation prompt should appear:
 
“Are you sure you want to delete this pricing configuration?”
 

 
Given the user confirms the deletion,
 
Then the selected pricing entry should be permanently removed from the list.
 

 
Given the user cancels the deletion,
 
Then no changes should be made to the pricing list. 

** 
**Status Indicator
**Given a pricing configuration is currently active,** 
Then a ‘Live Pricing’ tag should be displayed next to its name.
 
(Live status should be shown based on the start date and end date. If those date range falls between the current date range and the permission is in published state, then it is "Live Pricing") 

 
Given the pricing is inactive or expired,
 
Then the tag should not be shown. 

 
Delete Restriction for Live Pricing**: 
When a pricing is in 'Live', 
Then the delete option should be in disabled state. 

 
Past pricing should also be restricted from deletion.
