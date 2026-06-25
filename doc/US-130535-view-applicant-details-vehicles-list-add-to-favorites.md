# US-130535: View Applicant Details | Vehicles - List, Add to Favorites

| Field | Value |
|-------|-------|
| **ID** | 130535 |
| **Type** | User Story |
| **Module** | Users |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Figma dependency; Fully Complete; LV |

## Acceptance Criteria

Access Vehicles Tab
 
 
 
 
Given a Super Admin / Contract Admin / BO Manager / BO User, 
When clicks on the “Vehicles” tab in an applicant's profile,
 
Then should see a list of vehicles associated with the applicant account. 

 
**View Vehicle Details**
 
When viewing the vehicle information, 
Then should see the vehicles listed in the grid view 

 
When viewing the grid, 
Then should see the data categorized in columns, 

- Vehicle number (VRM) 
- Type (Personal/Visitor) 
- Nickname (If visitor vehicle)
 
- Color, Make, Model (Partially visible if long)- NOT APPLICABLE FOR VISITORS VEHICLE 
- Last added date/time 
- Actions menu (three-dot icon) 
 
**Add Favorites**** **(Multiple visitors vehicle can be added to favorites) 
_Note_: Add to favorites is applicable only for **VISITORS **vehicle 

 
When multiple vehicles are listed,   
 &
If any one is marked as favorite by applicant in the customer portal,   
Then favorite indication should be shown in the UI.   

   
When a vehicle is marked as favorite,   
Then should see the provision to remove that from favorite.   

   
When want to mark multiple visitors vehicle as favorites, 
Then should be able to add multiple visitors vehicle as favorites. 

 
**Vehicle Type (Icon)** 
When vehicle type is enabled for a contract, (In 'Permissions' application contract settings level) 
Then the appropriate vehicle type icon should be shown. 

 
When vehicle type is not enabled for a contract, 
Then vehicle type icon is not required to be shown in the grid. 

 
**Last Added Column**  
When a vehicle is added or updated, 
Then the “Last added” date and time should be shown in the last added column.  

 
_Note_: 
Add, Edit and Add temporary vehicle flows are covered in story [#132412](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/132412/)
