# US-193405: Report | Financial | Income

| Field | Value |
|-------|-------|
| **ID** | 193405 |
| **Type** | User Story |
| **Module** | Reports |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

**Purpose: **To provide a detailed summary of all payments received within a selected period, categorized by payment method, permission type, and transaction details for financial tracking and reconciliation. 
 
 
 
 
 
 
 
 
  
**Given** a super admin, contract admin, Bo manager, Bo user,**When** the user navigates to the Reports menu and selects Income,**Then** the system should display the following filters: 

- Date Range (From and To) – Calendar Picker - Filters records based on the transaction date. The user should not be allowed to select a date range longer than 1 year from the current calendar date. 
 
- Payment Method – Dropdown should display the Registered cards, Pay by new card, Online after approval, Wallet, Agent assist, Pay on collection, Postal payment, Cost center and Budget code, pay monthly, pay quaterly 
 
- Permission Type - Drop down should display the permission types created of that contract 
 
- Permission Name - Drop down should display the permission name created for that contract 
 
 
**** 
**** 
**All filters** should support **multi-select options** and include an **“All”** option for comprehensive selection.

 
If a filter is not selected, the system should include all values for that filter and generate the report based on the remaining selected filters.
 
**When** the user applies the selected filters and runs the report,
**Then** the system should generate and display the following fields: 
 

- Application Reference Number - Displays the reference number of the application. 
- First Name - First name of the applicant. 
- Last Name - Last name of the applicant. 
- Permission Type - Displays the permission type associated with the application. 
- Permission Name - Displays the specific permission name associated with the application. 
- Start Date - The start date of the permission. 
- End Date - The date when the permission will expire. 
- Payment Method - Shows the method used to complete the payment (e.g., registered Card, Budget Code). 
- Amount Paid - The total amount successfully paid for the application or transaction. 
- Transaction ID -  
- Transaction Date - The exact date and time when the payment or refund transaction was processed. 
- Transaction Type (Sale or Refund) - Indicates whether the transaction was a Sale (payment made) or a Refund (amount returned). 
- Status (Paid) - Shows only the paid application. Paid means the payment was successfully completed and recorded in the system. 
 
 
**Export:**When the user chooses to export the report,Then the system should follow the standard Power BI export options, which include: 

- **Data with current layout** 
 
- **Summarized data** 
 
- **Underlying data** 
 
 
The export functionality should comply with the **MNPS reporting standards**. 
Note: The report is built using Power BI
 
These static PBI reports for Permit should not be part of the application deployment pipeline.

Once a report is published or updated in Power BI, it must become immediately available in the Permit Reports module
