# User Story 142348: Permission Setup | Builder | Rules Tab | Vehicle Settings

## Metadata
| Field | Value |
|-------|-------|
| ID | 142348 |
| Type | User Story |
| Title | Permission Setup | Builder | Rules Tab | Vehicle Settings |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Figma Added; Fully Complete; LV |
| Module | Permission Setup > Permission Builder |

---

## Acceptance Criteria

**Permission Setup > Builder > [Permission Name] > Rules Tab > Vehicle Settings** 
Given a super admin and contract admin 
 
When in the vehicle settings  
Then the following default fields should be available **Maximum Limit** section: 

- VRN Limit – Numeric field (maximum value: 1000 ) 
- Number Plate Change Limit – Numeric field (maximum value: 100000) 
 
 
And other vehicle-related fields should be linked from contract settings appear in **Eligible Vehicles for Permission **section 
 
** 
VRN Limit - It defines
     how many numbers of VRN can be added to permit. 
Number Plate Change Limit - It define maximum times the number plate can change in a year
 

 
 
When accessing the contract settings 
Then under 'Mandatory fields for Vehicles**', a predefined list of vehicle fields should be displayed with toggle options 
** 
When a field is enabled for a contract 
Then that field should appear in the vehicle settings 
And all vehicle fields (e.g., Vehicle types, CO₂ emission(g/km)) linked from the contract should be multi-select dropdowns 
Note:** Excluding the **'Make', 'Model', 'Color'** fields even if it enabled in the contract setting. 
  
**REFERENCE: Predefined Vehicle fields in contract settings** (**Mandatory fields for Vehicles)** 
Vehicle Type 
Fuel Type 
Co2 emission (g/km) 
Euro Standard 
Type of engine 
Age of the vehicle 
Number plate tax band 
Number of seats 
** 
Drop down Value**  
Vehicle Type - Bus, Car, Heavy Goods Vehicle, Light Goods Vehicle, Motorcycle, Scooter, Van 
** 
 
Example:** 
When in the vehicle settings 
If select the vehicle type as 'Motorcycle' for the selected permission 
** 
When in the customer portal  
Then user tries to purchase the permission with the vehicle type as 'Car'  
And it should not allow you to purchase prompting you an error. 

 
When set the ****Number Plate Change Limit **as 10 for an year 
And if the user exceeding the limit  
Then should prompting an error in the customer portal.
