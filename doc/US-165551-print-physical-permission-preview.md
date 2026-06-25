# US-165551: Print | Physical Permission | Preview

| Field | Value |
|-------|-------|
| **ID** | 165551 |
| **Type** | User Story |
| **Module** | Print |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

Given a Super Admin or Contract Admin is on the grid screen 
When they click the three dots in the action column 
Then should have the preview option. 

 
**Preview Physical Permission Letter** 
When the invoke the preview option 
Then it should open a preview of the template configured for that permission with actual data. 

 
**Template for Physical Permission ****is added in the template settings against each permission when permission mode is set as 'Physical or Both'** [User Story 164476](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/164476): Permission Setup | Builder | Rules | Template Settings | Print Physical Permission 

 
**Using Template in Print Queue** 
Given a Physical Permission has a template configured in Template Settings 
When the application status as **print** 
Then the system should use the specific template added in the Print Physical Permission Template tab for that permission. 
**Example:** 
When applicant apply for 'Resident Permission'  
And the application status for that applicant as 'Print' 
Then should use the template added for 'Resident permission' in the permission builder > Template settings > Print Physical Permission 
 

 
**Actual Data Displayed in Preview** 
Given the preview screen is shown 
Then the template should display actual data instead of merge fields 
**Example** 

- Applicant Name - **John Danny** 
- Reference Number - **RFE34354544** 
- Application Date - **24/09/2025** 
- Any other relevant application-specific fields. 
 
 
**Zoom In and Zoom Out in Preview** 
Given the preview screen is shown 
Then the user should be able to: 

- **Zoom In** the preview content for better visibility. 
- **Zoom Out** the preview content to see more of the template at once. 
 
 
When in the preview screen 
Then should have the download option 
Note: Download functionality covered in separate story [#165553](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/165553/)
