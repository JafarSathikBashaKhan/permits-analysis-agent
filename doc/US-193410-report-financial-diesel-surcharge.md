# US-193410: Report | Financial | Diesel Surcharge

| Field | Value |
|-------|-------|
| **ID** | 193410 |
| **Type** | User Story |
| **Module** | Reports |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

**Diesel Surcharge** 

 
**Purpose: **To provide visibility into all applications where a diesel surcharge has been applied, showing key applicant, permission, payment, and surcharge details for audit, financial reconciliation, and contract monitoring. 
This report is generated using applications where the diesel surcharge has been applied. 
 

 
Given the user is a super admin, contract admin, Bo manager, Bo user, 
When the user navigates to Reports > Financial > Diesel Surcharge,
 
Then the system should display the following filters: 

- **Date Range (From and To – Calendar Picker)** – Filters results based on the payment date of the application. The user should not be allowed to select a date range longer than 1 year from the current calendar date. 
- **Permission Type** – Dropdown displaying all permission types for the contract 
- **Permission Name** – Dropdown displaying all permission names for the contract 
 
 
And all filters should support multi-select and include an All option. 

 
If a filter is not selected, the system should include all values for that filter and generate the report based on the remaining selected filters.
 

 
Given the user has selected any filter options,
 
When the user runs the Diesel Surcharge Report,
 
Then the system should generate and display the following fields: 

- Application Reference Number - Displays the reference number of the application. 
- First Name - First name of the applicant. 
- Last Name - Last name of the applicant. 
- Permission Type - Displays the permission type associated with the application. 
- Permission Name - Displays the specific permission name associated with the application. 
- Diesel Surcharge Amount - The amount of diesel surcharge applied to the application based on the vehicle type. 
- Band Price / Tier Price - The pricing band or tier applicable to the permission (Used to determine how much surcharge is added.) 
- Duration - Displays the valid duration of the permission (e.g., 1 month, 6 months, 12 months). 
- Payment Method - Indicates how the payment was made (e.g., Pay Monthly, Registered Card, Wallet, Budget Code, etc.). 
- Transaction Date - The exact date and time payment for the permission was successfully completed. 
- Amount - The total amount paid for the permission, including the diesel surcharge and any additional applicable charges. 
- Payment Status (Paid) - Indicates that the payment for the permission, including the diesel surcharge, has been successfully completed and recorded. 
 
 
**Export:**When the user chooses to export the report,Then the system should follow the standard Power BI export options, which include: 

- **Data with current layout** 
 
- **Summarized data** 
 
- **Underlying data** 
 
 
The export functionality should comply with the **MNPS reporting standards**. 
Note: The report is built using Power BI 
These static PBI reports for Permit should not be part of the application deployment pipeline.Once a report is published or updated in Power BI, it must become immediately available in the Permit Reports module
