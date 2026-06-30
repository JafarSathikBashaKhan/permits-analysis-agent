# User Story 198805: Visitor Portal Setting | Permission Builder | Start Session at Start of the Day

## Metadata
| Field | Value |
|-------|-------|
| ID | 198805 |
| Type | User Story |
| Title | Visitor Portal Setting | Permission Builder | Start Session at Start of the Day |
| Assigned To | Prathiba K |
| State | Done |
| Tags |  |
| Module | Permission Setup > Permission Builder |

---

## Acceptance Criteria

Given a super admin/Contract admin 
**Prerequisite: ** 
When the permission type is enabled for visitor portal settings 
Then should see the "Visitor Portal Setting" in the permission builder 
** 
When select the visitor portal setting  
Then should have the field name as  

- Start session at the start of the day - radio button with enable and disable 
 
By default, it is in disable 

 
Given the “Start Sessions at Start of Day” is disabled 
When a visitor activates a voucher at any time during the day 
Then the system must send the voucher to Illuminate with the actual activation time as the start time 
And the end time must follow the normal session duration rules. 

 
Given the “Start Sessions at Start of Day” is enabled 
When a visitor activates a voucher at any time during the day 
Then the system must send the voucher to Illuminate with a start time of 00:01 for that day 
And the session end time must be set to 23:59 of the same day (if it is one day voucher) 
And the actual activation time should be ignored in the data sent to Illuminate. 

 
Multi-day voucher ** 
Given the “Start Sessions at Start of Day” is enabled 
And a visitor selects a voucher type that spans multiple days 
When the voucher is activated at any time of day 
Then the system must set the start date/time to 00:01 on the first day 
And set the end date/time to 23:59 on the last day of the voucher duration 
And the actual activation time must be ignored 
And these forced values must be sent to Illuminate. 
** 
Example (3-day voucher):** 
Visitor activates at **14:30** on 12 March. 
Voucher has a **3-day duration**: 
DayBehaviourDate & TimeStart Forced **12 March 00:01** End Forced **14 March 23:59**  
 
** 
Current behavior of voucher activation:** 

- Voucher start time = actual activation timestamp 
 
- Voucher end time = activation timestamp + session duration 
 
- Data sent to Illuminate. 
 
 
**Voucher Activated Late in the Day** 
Given the toggle is ON 
And the visitor activates a voucher after already driving through a camera 
When the voucher is created 
Then the voucher sent to Illuminate must still have a start time of 00:01 
So that the camera system recognizes the voucher as valid during the earlier camera pass. 
**
** 
**Amendments in Permission builder** 
Given a super admin/contract admin 
When in the permission builder to publish a permission 
Then the following items should be **optional ** 

- Discount Settings 
- Document Type Settings 
- Admin fee for permission in general settings 
 
And the 'Limit for change zone' field should be removed 
And 'VRN' limit in vehicle setting should be removed 
** 
Contract settings in apply** 
'Admin fee for permission' field should be set as **optional****
** 
**
** 
**Unsaved Changes Warning on Navigation | Menus (Feedback from demo on button rename)** #171259 
**When the user attempts to navigate to another menu, tab, or page, 
** 
Then the system should display a warning message "You have unsaved changes. Would you like to save your changes before leaving this page?"   
 
**And should have the option to close the pop up 
And in the pop up close icon should be removed 
And "SAVE AND LEAVE" button should be renamed as "SAVE AND EXIT" 

** 
**
**
