# US-167835: Print | White Mail Reminder | Grid

| Field | Value |
|-------|-------|
| **ID** | 167835 |
| **Type** | User Story |
| **Module** | Print |
| **State** | Done |
| **Assigned To** | Natarajan Arumugam  |
| **Tags** |  |

## Acceptance Criteria

**Prerequisite:** Applicant accounts created by the BO (Back Office) user using a generic email are flagged as **'Paper Reminder'** when their applications are due for renewal, based on the settings configured in the **Permission Builder**. Reminder letters are sent to these applicants by post. 
The **Paper Reminder** process applies to both **physical** and **virtual** permissions. 
When these applications are up for renewal and have an **Active** status, they should appear in the **White Mail Reminder** grid. 
 
Given a Super Admin or Contract Admin, 
When they navigate to the Print Parent Menu, 
Then the ‘White Mail Reminder’ sub menu must be visible. 
 
When selecting the ‘White Mail Reminder’ sub menu, 
Then display a grid screen with the following fields: 

- Reference Number  (clickable for preview) - A unique identifier automatically assigned to each application for tracking and reference purposes. And this should be invokable. Application number generation logic is covered in USER STORY 137749 
- Permission Group - The category or group under which the permission type falls (e.g., Transport, Licensing, Parking). 
- Permission Name - 
- VRM - Vehicle Registration Mark, the vehicle’s license plate number provided by the applicant. (Not applicable for Permission type = License, So not displaying the same & Not for visitor permission) 
- Work Queue Status -  **O****nly applications with status = Active** appear in the grid, and that actions (Send to Partner / Local Print) update the status appropriately. 
- Applicant Name - The full name of the individual or organization that submitted the application. 
- Address - The Address field represents the address of the applicant, which can be either their residential or business address as provided in the application form. 

- If the address is a zonal address. Combine the following components to form the full address: 

- Property Name 
- Street Name 
 
- If the address is a non-zonal address. Combine the following components instead: 

- Address Line 1 
- Address Line 2 
- Town 
 
 
- Postcode - The postal code corresponding to the applicant’s address for location identification. 
- Applied On - The date on which the application was submitted in the customer portal. 
- Start date - Start date of the permit 
- Expiry date - Expiry date of the permit 
- Action - Should have three dots on each line items 
 
 
Given the user is on the list screen, 
When the list contains multiple columns including 'Reference Number', 'Status', 'Action', and others, 
Then the columns 'Reference Number', 'Status', and 'Action' should remain fixed and always visible on the screen, 
And the remaining columns should be horizontally scrollable. 
Note: 
The fixed columns should not move or disappear when the user scrolls horizontally. 
The horizontal scroll bar should allow users to scroll through all other columns except the fixed ones. 
 
Given an application is in the **White Mail Reminder list** with status = Active
**And** the application **has not been printed** through either Local or Print Partner
**When** the application reaches the **Expired** status
**Then** it should be **removed automatically** from the White Mail Reminder list screen
**And** it should appear in the **Application menu** based on its permission type. 

- If the application is for a **permission**, it should be shown under **Application menu > Permission sub-menu** in an **Expired** state 
 
 
 
When invoke the  three dots in the action column 
Then should have the below options 

- Download 
- Preview 
- Send to print - If Print Partner toggle is enable in the contract settings for apply [MNPS] 
 
 

 
 
**Note: **Download, Preview and Send to print functionality covered in seperate story 

 
**Search Functionality** 
The search bar must allow searching by: 
- Reference Number 
- Applicant Name 
 
 
**Behavior:** 
When searching by Reference Number → Related data must be retrieved and displayed. 
When searching by Applicant Name → Related data must be retrieved and displayed. 

Column Filter, **Sorting** & **Paging** 
 
 
 
**** 
 
 
Default column filter, sorting & pagination is applied.
