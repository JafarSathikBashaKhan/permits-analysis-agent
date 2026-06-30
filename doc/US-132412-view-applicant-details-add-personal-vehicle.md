# US-132412: View Applicant Details | Add Personal Vehicle

| Field | Value |
|-------|-------|
| **ID** | 132412 |
| **Type** | User Story |
| **Module** | Users |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete; LV |

## Acceptance Criteria

Add New Vehicle
 
 
 
 
 
 
 
 
 
 
 
Given a Super Admin / Contract Admin / BO Manager / BO User,
 
When clicks the appropriate button to add a new vehicle, (in the list screen) 
Then should be prompted to enter the VRM number. 

 
When want to enter the VRM number, 
Then should be able enter after choosing between "Personal and Visitors". 
VRM Validation: Maximum 14 digits alpha numeric should be allowed. Spaces should be auto trimmed. 

 
**_Personal Vehicle_** 
When selected Personal, 
Then should be able to fetch the vehicle details from Autoguru api. 

 
When invoked the appropriate button (show details) to trigger Autoguru api, 
Then should see the details fetched. 
& 
Then the following fields should be auto-populated:
 
Fuel Type
Make
 
Model
 
Color
 
CO₂ Emission (g/km)
 
Euro Standard

 
And a message should appear: "Please, check vehicle details to make sure they match.” 

 
When details are fetched, 
Then should be allowed to edit the populated data using drop-down. 
 

 
When the Autoguru API call fails or returns incomplete data,
 
Then should see an error message as "Unable to fetch vehicle details. Please enter manually.” 

 
When details not fetched, 
Then should be able to manually select from the respective drop-down fields. 

 
**Mark Registered Keeper ** 
When adds a personal vehicle, 
Then should be able to mark the same as 'Registered keeper'. (Mandatory) 
 

 
**Success Indication** 
When selected the button to add vehicle, 
Then should see the success indication as "Vehicle added successfully"
 

 
**Mandatory Field Validation** 
When any of the mandatory field is empty and tries to add, 
Then should see the error message as "This field is required". 

 
**Duplicate Validation:** 
When tries to add a VRM which is already linked to this account, 
Then should see an error message as "This VRM already linked with this account" 

 
**Add to List** 
When a vehicle is added, 
Then it should be added to the list screen. 

 
**_Button Validations_** 
**Add Vehicle Button:** 
**ENABLED **state - When all the mandatory fields are filled. (All the fields in this screen are mandatory fields) 

 
When any of the mandatory field is not filled, 
Then should see the field level error message as "This field is required" 

 
When the vehicle type is selected as 'Personal Vehicle', 
& 
When the documents are not uploaded, 
Then should see a message as "This field is required. (Allowed .png, .pdf, .jpg, .bmp, .tif, .heic and max size 10 mb)". 

 
**_Upload Document is mandatory_** for adding personal vehicle - Covered in [#143610](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/143610/)  

 
**Show Details Button: Enabled state** 
When the VRM field is filled  

 
**Show Details Button: Disabled state** 
When the VRM field is not filled 

 
When the VRM is entered, 'Show details' is triggered, & the vehicle details values are populated, 
But, the previously entered VRM is not edited, 
Then disable the 'Show Details Button'. 
(Because for the same VRM, invoking 'Show Details' button twice is not necessary) 

 
 
When the VRM is entered, 'Show details' is triggered, & the vehicle details values are populated, 
& Then, the previously entered VRM is edited, 
But, 'Show Details' is not triggered, 
Then should be restricted from adding the new vehicle with toast "Triggering 'Show Details' is mandatory for adding personal vehicle." 
 

**Cancel & X(close) Button:** 
Should be in enabled state all the time. 

 
**Audit/Event**
 
**Personal Vehicle** 
Event Type / Name: Personal Vehicle Added
 
Event Description:  Personal Vehicle Added  
Date and Time: 
 
User Role: User role of the user who added 
User Name: First Name and Last Name of the user who added.
