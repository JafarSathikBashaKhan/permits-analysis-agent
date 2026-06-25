# User Story 163644: Area | Zone | Publish & Delete Pop up validation

## Metadata
| Field | Value |
|-------|-------|
| ID | 163644 |
| Type | User Story |
| Title | Area | Zone | Publish & Delete Pop up validation |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags |  |
| Module | Area |

---

## Acceptance Criteria

Since street mapping in a zone is now a mandatory field,**

The following pop-up messages should be removed:
Publish**
“This zone is not mapped to any streets. Please map streets before publishing.”
“You have selected 6 zones. Only 4 are mapped to streets and will be published. 2 will be skipped.”
“None of the selected zones are mapped to streets. Please map them before publishing.”
“You have selected 7 zones. Only 4 Draft zones are mapped to streets and will be published. Published zones will remain unchanged.”
“You have selected 7 zones. Selected 4 zones are not mapped to streets. Please map them before publishing.”
**
Multi-Select Publish**
**
**
**Single Zone Selected**
When a single zone is selected in multi-select mode
And the publish option is invoked from the grid screen
Then a pop-up message should be displayed:**
“Publish Zone? Are you sure you want to publish ‘$Zonename’?” with Publish and Cancel buttons.


When Publish is confirmed
Then a toaster message should appear: “Zone published successfully.”
And the status should update to Published.


Draft & Published Zones Selected**
When both Draft and Published zones are selected in multi-select mode
Then a pop-up message should be displayed:**
“3 out of 5 zones cannot be published. Do you want to proceed with publishing the remaining Z zone(s)?” with Publish All and Cancel options.


When multi select the zones in draft status
Then a pop up message should be displayed: "Publish Zone? Are you sure you want to publish  zones?" with Publish All and Cancel options.


When Publish All is confirmed
Then a toaster message should appear: “4 zones published successfully.”
And the status of Draft zones mapped to streets should update to Published in the list screen.


Multi-Select Delete**
**
**
**Single Zone Selected**
When a single zone is selected in multi-select mode
And the delete option is invoked from the grid screen
Then a pop-up should be displayed:**
“Are you sure you want to delete the selected zone: {Zone Name}?” with Delete and Cancel buttons.


When Delete is confirmed
Then a toaster message should appear: “Zone deleted successfully.”


When both Draft and Published zones are selected in multi-select mode
Then a pop-up message should be displayed "3 out of 5 zones are published and cannot be deleted. Do you want to proceed with deleting the remaining Z zone(s)?" with Delete All and Cancel


When multi select the zones in draft status
Then a pop up message should be displayed: "Delete Zone? Are you sure you want to delete  zones?" with Delete All and Cancel options.



Multi - Select Unpublish**
When both Draft and Published zones are selected in multi-select mode
Then a pop-up message should be displayed "3 out of 5 are in draft and cannot be unpublished. Do you want to proceed with unpublishing the remaining 2 zone(s)?" with Unpublish All and Cancel
**
When multi select the zones in publish status
Then a pop up message should be displayed: "Unpublish Zone? Are you sure you want to unpublish  zones?" with Unpublish All and Cancel options.




Restriction**
When a zone with the status Published is selected
Then the Delete option should not be available.
**
Event:**
**Publish **
Event Type/Name: Zone published
Event Description: "Zone name" published successfully
Date and Time: $CurrentTimestamp
User Role: $UserRole
User Name: $FirstName $LastName
Event Category/Type: Configuration
**
Delete **
Event Type/Name: Zone deleted
Event Description: "Zone name" deleted successfully
Date and Time: $CurrentTimestamp
User Role: $UserRole
User Name: $FirstName $LastName
Event Category/Type: Configuration
