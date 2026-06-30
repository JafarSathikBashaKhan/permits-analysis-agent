# US-167911: Print | White Mail Reminder | Preview

| Field | Value |
|-------|-------|
| **ID** | 167911 |
| **Type** | User Story |
| **Module** | Print |
| **State** | Done |
| **Assigned To** | Natarajan Arumugam  |
| **Tags** |  |

## Acceptance Criteria

Given a Super Admin or Contract Admin is on the grid screen 
 
When they click the three dots in the action column 
Then should have the preview option. 
 
**Preview White Mail Reminder Letter** 
When the invoke the preview option 
Then it should open a preview of the template configured for that permission with actual data. 
 
 
**Template for White Mail Reminder is added in the template settings against each permission [#142384](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/142384/) ** 
 
**Using Template in Print Queue** 
Given a White Mail Reminder has a template configured in Template Settings 
When the application status as Active  
Then the system should use the specific template added in the Print White Mail Reminder Template tab for that permission. 
 
**Example:** 
When applicant apply for 'Resident Permission'  
And the applicant is flagged as 'Paper Reminder' 
And  the application with active status is up for renewal based on the 'Paper reminder settings' in Renewal & Reminder settings 
Then should use the template added for 'Resident permission' in the permission builder > Template settings > Print White Mail Reminder 
 
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
 
 
**Download Option Availability** 
Given the preview screen is shown 
Then the user should see a Download button. 
Download functionality covered in seperate story [#169331](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/169331/)
