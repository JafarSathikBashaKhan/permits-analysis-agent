# US-135101: View Applicant Details | Vehicles - Edit

| Field | Value |
|-------|-------|
| **ID** | 135101 |
| **Type** | User Story |
| **Module** | Users |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete; LV |

## Acceptance Criteria

**Edit Vehicle** 
Given a Super Admin / Contract Admin / BO Manager / BO User, 
When wants to edit a vehicle, 
Then should have the provision to edit. 

 
When selected the option to “Edit”, 
Then the user should be able to taken to the screen with vehicle details. 

 
When wants to edit personal vehicle, 
Then can change VRM and mark / unmark the vehicle as registered keeper. 

 
When edits the VRM for personal vehicle, 
Then again autoguru fetch should happen. 

 
When edited the VRM, fetched the details via Autoguru, 
Then still should be allowed to edit the vehicles details. 

 
When auto guru didn't fetch, 
Then should be able to manually edit or change the drop-down values. 

 
When wants to edit a visitors vehicle, 
Then should be able to edit the VRM and Nick Name & favorites setting. 

 
When completely removed VRM and Nick Name for visitors vehicle, 
& Invoked 'Save Changes', 
Then should see 'This field is required' message in the field level. 

 
**Delete Document:** 
When wants to delete the documents, 
Then should be allowed to delete. 

 
When all the documents are deleted for personal vehicle, 
& Invoked 'Save Changes',
 
Then should see an error message as "This field is required. (Allowed .png, .pdf, .jpg, .bmp, .tif, .heic and max size 10 mb)". (Ref Add Figma) 

 
When edits any vehicle,  
Then that change should not affect the vehicle in any application.  

 
**Button Validation**: 
**Show Details Button:** 
**Disabled **State - When the already saved VRM is not edited 
**Enabled** State - When the already entered VRM is edited 

 
**Save Changes Button:** 
**Disabled **State - Should be in disabled state by default. 
**Enabled **State - Only when any of the fields or any data is updated. 

**Add Document Button:** 
**Enabled **State - Should be in enabled state all the time. 

 
**Cancel and X(close) Button:** 
Should be in enabled state all the time.
 

 
**Note: **Also consider mandatory fields, button validation, and field level error messages mentioned in [#132412](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/132412/) 
 
 
 
 

 
**Audit / Events Capturing** 
Event Type / Name: Vehicle Edited 
Event Description:  Vehicle edited 
Date and Time: 
 
User Role: Applicant User
 
User Name: First Name and Last Name of the applicant user
