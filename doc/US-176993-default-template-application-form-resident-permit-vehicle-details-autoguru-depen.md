# US-176993: Default template | Application Form | Resident permit | Vehicle details - AutoGuru Dependency

| Field | Value |
|-------|-------|
| **ID** | 176993 |
| **Type** | User Story |
| **Module** | Buy Now |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | southend |

## Acceptance Criteria

**Pre-requisite - Tab 1 | [User Story 168818](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/168818): Default template | Application Form | Resident permit | Address section** 

 
 
**Tab 2 | Vehicle Details** 
**** 
Given a permissioned user 
When in the address tab 
Then the Permission Label should be displayed as configured in the Permission Builder [#181519](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/181519/) 

 
**Vehicle Details ** 
Select Vehicle - When invoked, Vehicles configured in the Vehicle settings (profile section) should be listed here. 
Should be able to select a vehicle from the list and add here as a primary vehicle. 
A** check box **to mark the selected vehicle as Primary should be available, the vehicles entered will be the one to which the permit is purchased for. 
 

 
**Add New Vehicle:  ** 

 
When clicks the button to add new vehicle 
Then a pop up should be displayed, prompting to enter the VRM number. 
 
When want to enter the VRM number, 
Then should be able enter after choosing between "Personal and Visitors". 

 
VRM Validation: Maximum 14 digits alpha numeric should be allowed. Spaces should be auto trimmed. 
 
**Personal Vehicle** 
When selected Personal and on entering the VRM 
Then should be able to fetch the vehicle details from Auto guru api through "Show details" button. 
 
When invoked the button (show details) to trigger Autoguru api, 
Then should see the details fetched. 
& 
Then the following fields should be auto-populated: 
Fuel TypeMake 
Model 
Color 
CO₂ Emission (g/km) 
Euro Standard 
(The above fields should be listed based on the configuration set against contract settings - > Vehicle setting fields, only enabled fields should be available in permission and application form) 
[Field values defined in [#142348](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/142348/) refer comment section as well as ACs. 
for Euro standard 6 covered - [User Story 177545](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/177545): Implement field and label updates across modules] 
When AutoGuru fetched only the partial details, 
And a message should appear: "Only partial vehicle details returned. Please select the values for missing ones.” 
 
When all the details are fetched, 
Then **SHOULD NOT BE** allowed to edit the populated data using drop-down.  
 
 
When the Autoguru API call fails or returns incomplete data, 
Then should see an error message as "Unable to fetch vehicle details. Please enter manually.” 
 
When details not fetched, 
Then should be able to manually select from the respective drop-down fields. 
 
**Mark Registered Keeper:** 
When adds a personal vehicle, 
Then should be able to mark the same as 'Registered keeper' by selecting the radio button. (Mandatory) 

 
**Upload Documents for Personal Vehicle** 
When adds personal vehicle, 
Then uploading a document of proof becomes mandatory. 
 
When want to upload document proof, 
Then should see the provision to upload the evidence document. for the newly added vehicle. 
An info message should be seen as "*Please upload a document that serves as proof of your vehicle, such as your V5C Vehicle Registration Certificate (logbook), vehicle lease or hire agreement, insurance certificate, or purchase invoice/receipt."* 
Note: All the documents submitted here will be treated as proof of vehicle ownership. 

 
When uploads document, 
Then should be able to upload the document in .png, .pdf, .jpg, .bmp, .tif, .heic and max size 10 mb. (The same indication should be shown in UI) 
Note: Maximum 10 documents should be allowed per vehicle. (Same should be indicated in UI for users as info text) 
 
When uploaded the document, 
Then should also have the provision to delete or remove the document. 
 
When want to add a new personal vehicle, 
Then all fields are mandatory fields. 
 
When filled all the mandatory fields, 
Then should be able to add the vehicle with appropriate button click. 
 
**Success Indication** 
When selected the button to add vehicle, 
Then should see the success indication as "Vehicle added successfully" 
 
**Mandatory Field Validation** 
When any of the mandatory field is empty and tries to add, 
Then should see the error message as "This field is required". 
 
**Duplicate Validation:** 
When tries to add a VRM which is already linked to this account, 
Then should see an error message as "This VRM already linked with this account" 
**** 
**Add to List** 
When a vehicle is added, 
Then it should be added to the list screen of the vehicle tab. 
 
**Button Validations** 
**Add Vehicle Button:** 
**ENABLED **state - Should be in enabled state all the time. So that, error can be shown when selected without filling mandatory fields. 
 
When any of the mandatory field is not filled, 
Then should see the field level error message as "This field is required" 
 
When the vehicle type is selected as 'Personal Vehicle', 
& 
When the documents are not uploaded, 
Then should see a message as "This field is required. (Allowed .png, .pdf, .jpg, .bmp, .tif, .heic and max size 10 mb)". 
 
**Show Details Button: Enabled state** 
When the VRM field is filled  
 
**Show Details Button: Disabled state** 
When the VRM field is not filled 
 
When the VRM is entered, 'Show details' is triggered, & the vehicle details values are populated, 
But, the previously entered VRM is not edited, 
Then disable the 'Show Details Button'. 
(Because for the same VRM, invoking 'Show Details' button twice is not necessary) 
**Cancel & X(close) Button:** 
Should be in enabled state all the time. 
 
Note: These data should be synced with Applicant BO. These vehicles should be available there and vice versa. 

 
 
 
 
 
**Add New Vehicle - ****_Visitors Vehicle:_** 

 
When entered the VRM number, 
& 
Selected 'Visitors' instead of personal in add new vehicle pop up 
Then should be able to enter the VRM number and Nick name for the same. 
Note: Details fetching via Autoguru api is not required for visitors vehicle. 
 
**** 
When enters the nick name, 
Then nickname field should be a text field that allow maximum 50 character (mandatory). 
 
When adds a visitor's vehicle, 
Then should be able to mark the same as favorite as optional. 
When want to change or edit the VRM number entered, 
Then should be able to edit the same. 
When fill the detail 
Then should able to invoke the button to add the vehicle. 
 
**Success Indication** 
When selected the button to add vehicle, 
Then should see the success indication as "Vehicle added successfully" 
 
**Mandatory Field Validation** 
When any of the mandatory field is empty and tries to add, 
Then should see the error message as "This field is required". 
 
**Duplicate Validation:** 
When tries to add a VRM which is already linked to this account, 
Then should see an error message as "This VRM already linked with this account" 
**** 
**Add to List** 
When a vehicle is added, 
Then it should be added to the list screen in vehicle tab 
 
**Button Validations** 
**Add Vehicle Button:** 
**ENABLED **state - Enabled all the time. 
 
When any of the mandatory field is not filled, 
Then should see the field level error message as "This field is required" 
 
**Cancel & X(close) Button:** 
Should be in enabled state all the time. 
**** 
**Vehicle tab grid view (Post adding required vehicles):** 
Upon adding the vehicles through either personal or visitor or by selecting existing vehicles from the vehicle settings 
Then should have these vehicles listed in the grid view 
And 
The grid view against each vehicle entry should have, vehicle type, VRM, tag (as personal, visitor), make, model and color should be displayed. 
And 
An option to mark the vehicle as primary should be available against each vehicle entered. 
And 
User should have provision to remove the vehicles from this grid view. 

 
**Multiple Vehicle inclusion:** 

 
If the permission has the settings enabled for Multiple vehicles inclusion [Permission builder - > Rules - > Vehicle settings - > Multiple Vehicles Allowed {Enabled} & Count of vehicles allowed] 
Then in the customer portal, while purchase of that permission, should see option to enter multiple vehicles as per the limit set. 
And 
When attempted to enter vehicles more than the allowed limit  
Then should see an error stating "You have reached the maximum number of vehicles that can be added." 
~~And  ~~ 
~~Based on the no. of vehicles added ~~ 
~~The cost of the permit should be incremented accordingly in checkout. ~~ 
Note: Users should be able to add multiple vehicles, with only one designated as the primary vehicle at any given time. Pricing must be calculated based solely on the primary vehicle, not all vehicles listed.Additional vehicles serve as spare options the customer can switch to when needed, using the same purchased permit. Only one vehicle can be set as primary at a time, and users may switch the primary designation between vehicles. 

 
**Eligible vehicles for permission:** 

 
Based on the configuration's settings available in [Permission builder - > Rules - > Vehicle settings - > Eligible vehicles for permissions], 
Only that vehicle categories should be allowed for permission purchase. 

 
Eg: If the vehicle type is set as car against that permission, then this permission can be only purchase for car and not any other vehicle type. 
**Scenario**: 
If the permission is set for fuel type: Petrol and vehicle type: Car, the resident permit can only be purchased for vehicles matching these criteria. When a new vehicle is added, and after entering the VRM, the AutoGuro service retrieves the vehicle details as vehicle type: Car and fuel type: Diesel, the user should be notified with the following message: 
 
Then the user should be indicated stating "The selected vehicle is not eligible for this application." 

 
**Save and Continue:**Post entering the required data, a button to "Save and Continue" should be available. 
When invoking this button, should have these entries saved against the selected application and proceeds to next tab. 
**** 
When the user clicks the “Back” button in address tab, 
Then the should navigate to the explore page in the customer portal 
 
 
Note: 

- In this story, fields marked as optional will be specifically mentioned. 
- All other fields are mandatory. 
 
When the user leaves any mandatory field empty 
Then the system should display the following error message “This field is required.” 

 
Additional logic included: 
When a look up to auto guru returns the fuel type of the primary vehicle as Diesel and Euro standard value less than 6,  
Then include the diesel surcharge charges in the checkout else diesel surcharge charges should not be included in the checkout even if it's configured against the permission's pricing.
