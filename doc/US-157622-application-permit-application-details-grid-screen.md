# US-157622: Application | Permit Application details |Grid Screen

| Field | Value |
|-------|-------|
| **ID** | 157622 |
| **Type** | User Story |
| **Module** | Applications |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete |

## Acceptance Criteria

**** 
****  
Permissions
Based on Role 
Given** **the
user is logged in as either a Super Admin or Contract User,**** 
When they access the
Applications menu, 
Then they should only see
permission types that are relevant to the contract they're managing. 
  
Given** **the
user is logged in as either a Super Admin or Contract User,**** 
When a permission
type is selected 
Then the system
displays application details submitted by customers in the customer portal,

And the applications shown are only those related to the selected
permission type. 
  
**Example:**

If **Suspension** is selected, the list should only include
suspension-related applications submitted by customers. 
Display
required table columns 
Given the permissions list page is loaded 
When on
the grid screen

Then the following fields are displayed: 

 - **Reference Number **- A unique identifier
     automatically assigned to each application for tracking and reference
     purposes. And this should be invokable. 

- Application number generation logic is covered in USER STORY 137749 
 
 
 
 

 - **Permission Group** - The category or
     group under which the permission type falls (e.g., Transport, Licensing,
     Parking). 

 - **VRM** - Vehicle
     Registration Mark, the vehicle’s license plate number provided by the
     applicant. **(Not applicable for Permit type = License, So not displaying the same)** 

 - **Work Queue Status** -  The current
     processing status of the application within the back-office workflow. Below are the work queue status- Pending Approval 
- Pending Renew 
- Waiting for payment 
- Change Address 
- Change vehicle 
- Waiting list 
- Expired 
- Request supporting evidence 
- Evidence Provided* 
- Reactivate* 
- Active 
- Rejected 
- Cancelled 
- Postpone 
- Internal Referral 
 
 

 - **Applicant Name** - The full name of the
     individual or organization that submitted the application. 

 - **Address** - The address of the
     applicant, typically their residential or business address as provided in
     the application form. 

 - **Postcode** - The postal code
     corresponding to the applicant’s address for location identification. 

 - **Applied On** - The date on which
     the application was submitted in the customer portal. 
- **Start date - **Start date of the permit 
- **Expiry date - **Expiry date of the permit 
 
**Note****:**
 

- ** Field VRM Should not be displayed for License permit type. ** 
- ** And Search doesn't allow search using VRM field in-case permit type = Licence** 
- ** Work queue status- may include more based on  requirement. ** 
 
 
**SEARCH ** 

 
BO user has option to search using the search option available below the permission type. 

 
Search by
Applicant Name 
    Given the permissions list page is displayed 
    When the user enters an applicant name in the
search bar 
    Then the system should display matching results
regardless of case 

 
Search by
Reference Number 
    Given the permissions list page is displayed 
    When the user enters a reference number in the
search bar 
    Then the system should display matching results
regardless of case 

 

 
Scenario:
Default column filtering is available 
  Given the table of
permissions is displayed 
  When the user enters
a filter value in any column filter input 
  Then only rows
matching the filter value should be displayed 
  And the filter should
use the system’s default filtering behaviour 

 
Scenario:
Default column sorting is available 
  Given the table of
permissions is displayed 
  When the user clicks
a column header 
  Then the table should
be sorted by that column in ascending order 
  And when the user
clicks the same column header again 
  Then the table should
be sorted by that column in descending order 
  And the sorting
should use the system’s default sorting behaviour 

 
Scenario:
Default pagination is available 
  Given the table of
permissions contains more rows than the default page size 
  When the page loads 
  Then the table should
display only the default number of rows per page 
  And pagination
controls should be visible 

 
  When the user
navigates to another page using pagination controls 
  Then the relevant set of rows should be
displayed 
  And pagination should use the system’s
default page size and navigation behaviour
