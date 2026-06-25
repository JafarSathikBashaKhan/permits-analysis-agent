# US-126138: Applicant Details - Applications | View Option & Overview (Zonal)

| Field | Value |
|-------|-------|
| **ID** | 126138 |
| **Type** | User Story |
| **Module** | Users |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete; LV |

## Acceptance Criteria

**Navigation to Permit Details**:
 
 
 
 
Given a Super admin / Contract admin / **BO Manager / Bo User, ** 
When in the applications tab of the applicant account, 
Then should see 'View' button next to a permit record. 

 
When invoked 'View, 
Then should be navigated to a detailed overview of that specific permit.
 

 
**Show Permit Details: (Overview Information)** 
When on the permit details page,
 
Then I should see the following information in the Overview tab:
 

- Permissions Group (e.g., Residential, Visitor, Student) 
- Permit Duration (e.g., 12 Months) 
- Zone - zone of that specific permit 
- Property Name 
- Street 
- Post Code 
- Reference Number 
- Application Date 
- Start Date 
- End Date 
- Payment Method 
- Price 
 
Note: The above fields are specific to 'Zonal' permissions. The non zonal fields will be covered in different story. 

 
**Status:**
 
When the permit is active,
 
Then the status should be displayed with a 'Active' label.
 

 
When the permit is cancelled,
 
Then the status should be displayed with a 'Cancelled' label.
 

 
**Matching the Permit Data** 
When viewing a permit,
 
Then the details seen should accurately match the data from the permit record.
 

 
**Back Button** 
When selected the back arrow ' tab,
 
Then should be redirected to the permit list view screen of 'Applications' tab. 

 
**Payment Information**:
 
When viewing the permit details,
 
Then should see the payment method used (e.g., Online with Card). 

 
When viewing the payment information, 
Then should also view the total amount paid along with pound symbol. 

 
**Close** 
When want to close the slider, 
Then should have 'Close' option to close the same.
