# User Story 187108: Configure Permissions | Permissions Tab | Special Events Properties Mapping

## Metadata
| Field | Value |
|-------|-------|
| ID | 187108 |
| Type | User Story |
| Title | Configure Permissions | Permissions Tab | Special Events Properties Mapping |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | new |
| Module | Permission Setup > Permission Builder |

---

## Acceptance Criteria

**Menu Availability
** 
 
Given a Super Admin or Contract Admin,  
When enabled the Special Event toggle is enabled in the permission’s General Settings,** 
Then the “Special Event Properties Mapping” menu should be displayed below general settings. 

 
Given the Special Event toggle is not enabled,
 
Then the Special Event Properties Mapping menu should not be visible. 
& 
And 'Zone Mapping' should be visible as usual. 
Note: Zone mapping is applicable only for the non-special event permission. 

 
Street and Property Display**** 
Given a Super Admin or Contract Admin,  
When in the Special Event Properties Mapping, 
Then should be able to map the properties to that special event permission. (Properties applicable for that special event should be mapped )  

 
Given a Super Admin or Contract Admin,  
 
When wants to map the properties, 
Then should be able to select streets as filter in order to select properties. 

 
When selected streets, 
Then all properties under that street should be displayed in a grouped section beneath it.
 

 
Given properties are displayed under a street,
 
Then the grid should include the following columns:
 
o	Property Name
 
o	UPRN
 
o	Permission Limit
 

 
When a selected street has no properties,
 
Then the UI should indicate this with a message:
 
“No properties available for the selected street.”
 

Property Selection and Management**** 
Given properties are displayed,
 
Then the user should be able to:
 
o	Select or unselect individual properties.
 
o	Select or unselect all properties within a street.
 
o	Remove an entire street (and its associated properties).
 

 
Given multiple streets are added,
 
Then they should be shown as collapsible/expandable sections for better organization. 

 
When properties are selected or deselected and mapped,
 
Then the changes should update the existing mapping for that Special Event (not create a new mapping set).
 

 
Given a mapping already exists,
 
When the user opens the mapping menu again,
 
Then previously selected streets and properties should be pre-populated, allowing incremental updates (add/remove).
 

Search and Filter**** 
Given the property list is long,
 
When the user searches by property name,
 
Then the results should be filtered using “equals” logic (exact match).
 

 
Given multiple streets exist,
 
When the user searches by street name,
 
Then search should also work on “equals” logic.
 

Validation ** 
When no street or property is selected and the user attempts to save,** 
Then show a validation message:
 
“Please select at least one street and one property to map.” 

 
Mapping same properties to different special event**: 
When a set of properties are already mapped with another special event, 
Then still the same can be mapped with multiple special events. 
** 
Publishing**: For Publishing at least one property should have been mapped for special event.
