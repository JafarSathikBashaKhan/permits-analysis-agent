# US-165549: Print | Physical Permission | list Screen

| Field | Value |
|-------|-------|
| **ID** | 165549 |
| **Type** | User Story |
| **Module** | Print |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

**** 
**Prerequisite** 
When applying for a Physical Permission, based on the selected payment method, the application status changes to Print at the appropriate stage of the workflow.
 

Once the status is Print, the application becomes visible in the Print Menu → Physical Permissions. 

 
 
 
Given a Super Admin or Contract Admin, 
When they navigate to the Print Parent Menu, 
Then the ‘Physical Permission’ sub menu must be visible. 

 
When selecting the ‘Printed Permission’ sub menu, 
Then display a list screen with the following fields: 

- Reference Number  (clickable for preview) - A unique identifier automatically assigned to each application for tracking and reference purposes. And this should be invokable. Application number generation logic is covered in USER STORY 137749 
- Permission Group - The category or group under which the permission type falls (e.g., Transport, Licensing, Parking). 
- Permission Name  
- VRM - Vehicle Registration Mark, the vehicle’s license plate number provided by the applicant. (Not applicable for Permission type = License, So not displaying the same & not applicable for visitor permission) 
- Work Queue Status -  **O****nly applications with status = Print** appear in the list. 
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
_Note:_ 
The fixed columns should not move or disappear when the user scrolls horizontally. 
The horizontal scroll bar should allow users to scroll through all other columns except the fixed ones. 

 
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
 
 
Column Filter, **Sorting** & **Paging** 
 
 
 
**** 
 
 
Default column filter, sorting & pagination is applied.
