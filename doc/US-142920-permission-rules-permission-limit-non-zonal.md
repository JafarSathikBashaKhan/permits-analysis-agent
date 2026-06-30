# User Story 142920: Permission Rules | Permission Limit (Non Zonal)

## Metadata
| Field | Value |
|-------|-------|
| ID | 142920 |
| Type | User Story |
| Title | Permission Rules | Permission Limit (Non Zonal) |
| Assigned To | Nivetha Mohan |
| State | Done |
| Tags | Fully Complete |
| Module | Permission Setup > Permission Builder |

---

## Acceptance Criteria

**Permission Limit Field Visibility**:** 
 
 
Given a Super Admin or Contract Admin user,
 
When the permission belongs to permission group 'non-zonal',
 
Then should be able to configure Permission Limit under 'Rules Tab'. 

 
Given a Super Admin or Contract Admin user,
 
When the permission belongs to zonal group, 
Then should be restricted from configuring Permission Limit. 

 
Hide Permission Limit Section:** 
When the permission group belongs to 'Zonal', 
Then hide the 'Permission Limit' section.** 
Default Setting**:** 
Given the Permission Limit field is available, 
When the admin accesses the permission limit section, 
Then 'Unlimited' should be set as default. 

 
Limit Setting**: 
When selects 'Set Limit', 
Then should see the field to configure the limit. 
** 
Given the Permission Limit field is visible,
 
When the admin enters a positive numeric value,
 
Then the system should save the value and enforce it during permit issuance. 
Minimum: 1 - Set '1' as default value. 
Maximum limit allowed: 1000 

 
Validation**:** 
Given the Permission Limit field is visible,
 
When the admin tries to enter the values as a negative or non-numeric value,
 
Then should not be allowed. 

 
Help Text**:
 
Given the Permission Limit section is displayed,
 
When the admin views the section,
 
Then help text "Configure the maximum active permissions allowed per user for this non-zonal permission".
