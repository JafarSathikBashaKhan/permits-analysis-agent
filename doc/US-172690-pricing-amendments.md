# User Story 172690: Pricing | Amendments

## Metadata
| Field | Value |
|-------|-------|
| ID | 172690 |
| Type | User Story |
| Title | Pricing | Amendments |
| Assigned To | Natarajan Arumugam |
| State | Done |
| Tags | southend |
| Module | Permission Setup > Permission Builder |

---

## Acceptance Criteria

**Pricing creation:**** 
 
 
 
Given pricing configurations exist for a specific permission type, subtype, and zone set, 
When the user creates a new pricing configuration with the same permission type, subtype, and zone set but with a different start and/or end date,
 
Then the system should allow the new configuration to be created and saved successfully. 
 
 

 
Pricing new changes inside permission:** 
 
 Given a permissioned user (users are defined dynamic)** When in permission builder of a permission
 
 Then should see following inclusion in pricing,
 
 
 
 Pricing shall be available as a Tab
 
 And 
 The existing pricing creation functionality should now happen within permission with all required attributes
 
 And 
 Creation, edit and delete of pricing entries should be within the builder of the permission.
 
 
 
 When a new permission is getting published, 
 
 Then the relevant pricing configured shall also be published along with permission.
 

 
When the permission referred as zonal 
Then in the pricing tab - > grid screen should see "No of Zones" 
And  
When Permission is non - zonal 
Then no of zones column should not be available. 

 
Note: Validation around pricing name etc should be as similar to teh validation involved in creating pricing through pricing menu. 

 
For zonal permission, if zone sets are not configured yet, 
Then disable pricing create button. 

 
When Publishing,  
Validate one of the pricing entries are within current date range without which publishing should be restricted for the permission. 
  
 
 Published permission and pricing:
** 
 When a permission and pricing entries of the permission is already in published state, 
 When an edit has to be made for the published version,** 
 Then the pricing & permission are to be set in draft mode. [Earlier, pricing does not have draft mode]
 
 
 
 Post the changes are saved in draft mode of permission and pricing
 
 Then the entries should be saved and republished together.
 

 
 If the user switches to Draft Mode for a published permission where draft changes are available, 
Then a message will appear stating: 
"There are changes available in both draft and published modes. The data displayed here reflects the draft mode." 
 
 
 
 Zone sets:
** 
 Zone sets created in zone mapping shall be available in the pricing section as similar behavior of pricing menu.** 

 
 When in the permission builder, 
 
 Then pricing with new zone sets shall be added, configure the pricing for new zone sets added, modify existing zones or new ones, 
 
 create futuristic pricing entries are all should be possible.
 
  
 
 
Pricing menu Grid and Permission pricing tab grid:** 
Published pricing entries should be available in both of these grids.
