# US-137191: View Applicant Details | Add Vehicle - Select Vehicle Type / Category

| Field | Value |
|-------|-------|
| **ID** | 137191 |
| **Type** | User Story |
| **Module** | Users |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

Pre-requisite: When the contract has 'Vehicle Type' enabled in the apply contract screen, then field to select the 'Vehicle Type' will be enabled in the screens where vehicle is added or updated. 

 
**Vehicle Type for Vehicle Adding:** 
Given the BO user, 
When adding or editing vehicle to the applicant or application, (Eg: Applicants -> Vehicle) 
When want to select 'Vehicle Type' (Car, Bike etc) 
Then should be able to select the Vehicle type from the drop-down. 

**Vehicle Type from Autoguru**
 
Given the BO user,
 
When in the vehicle type selecting field, 
Then should see the vehicle types listed in the drop-down that are fetched from "Autoguru API". 

 
**Manual selection if Autoguru is empty**
 
Given Autoguru API does not return a Vehicle Type,
 
When a user adds a vehicle,
 
Then the user should be required to select the Vehicle Type from the drop-down list fetched from **MNPS**. 

 
Sync with MNPS Vehicle Type list
 
Given the Vehicle Type list is managed in MNPS,
 
When a user is required to select Vehicle Type manually,
 
Then the drop-down should display Vehicle Types consumed from MNPS.
 

 
**Handling new Vehicle Type from Autoguru**
 
Given Autoguru API returns a Vehicle Type not present in MNPS,
 
When the system processes the vehicle data,
 
Then the new Vehicle Type should be stored in the DB, ~~(_Apply DB, not MNPS DB_) ~~ 
And it should be available in the drop-down for future vehicle selections. 

 
**Availability in BO & Customer Portal**: 
Given the Vehicle type field, 
When enabled for a contract and available in both Customer portal and BO, 
Then the ability to select the vehicle type via Autoguru and MNPS should be available in both customer portal and BO. 

 
**Vehicles List Screen**: (Tool Tip) 
When in the Vehicle list screen and mouse hovered over the vehicle icon, 
Then should see the tool tip as "Car, Bike, Van etc". 

 
Given new vehicle type is fetched from Autoguru, 
Then the **common icon** will be used for that new vehicle type. 
& 
When mouse hovered, 
Then the name of vehicle type returned from the Autoguru will be set in the tool tip.
