# US-176354: Show 'Favorites' Marking in Change Vehicle Screen

| Field | Value |
|-------|-------|
| **ID** | 176354 |
| **Type** | User Story |
| **Module** | Applications |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

Favourite Icon Display in Popup
 
Given a vehicle is marked as favourite in the Vehicles tab,
 
When the user opens the Change Vehicle popup,
 
Then the favourite icon should be displayed next to that vehicle.
 

 
**Sync Between Tab and Popup**
 
Given a vehicle is marked or unmarked as favourite in the Vehicles tab,
 
When the user reopens the Change Vehicle popup,
 
Then the favourite icon should reflect the latest status from the Vehicles tab. 

 
**Favorites to be in top**: 
Given there are favorites vehicle, 
When views the change vehicle screen, 
Then the favorites should be in the top. 

 
**Multiple Favourite Behaviour**
 
Given multiple favourites are allowed,
 
When more than one vehicle is marked as favourite in the Vehicles tab,
 
Then all those vehicles should display the favourite icon in both the Vehicles tab and the Change Vehicle popup. 

 
No Favourite Marked
Given no vehicles are marked as favourite in the Vehicles tab,
 
When the user opens the Change Vehicle popup,
 
Then no favourite icon should appear. 

 
Favourite Unmarked
Given a vehicle is unmarked as favourite in the Vehicles tab,
 
When the user opens the Change Vehicle popup,
 
Then the favourite icon should not appear for that vehicle.
