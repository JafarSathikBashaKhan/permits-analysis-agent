# User Story 160551: Configure Permissions | Permission Tab | Visitor Portal Settings

## Metadata
| Field | Value |
|-------|-------|
| ID | 160551 |
| Type | User Story |
| Title | Configure Permissions | Permission Tab | Visitor Portal Settings |
| Assigned To | Sureshsankar |
| State | Done |
| Tags | Fully Complete |
| Module | Permission Setup > Permission Builder |

---

## Acceptance Criteria

**Note:** The **Visitor Portal Settings** section is visible only for the **Visitor permission group**.  
** 
Given a Super Admin or Contract Admin,
 
 
 
 
When they are in the Permission Tab,
 
Then they should see the 'Visitor Portal Settings**' section. 
** 
Radio button Settings in the 'Visitor Portal Settings' Section** 
 
When in the "Visitor Portal Settings" section,**Then the following settings should be displayed as radio buttons with "Enable" and "Disable" options for each: 

- Visitor Portal access via VRN only 
 
- Allow Back Dates 
 
- End Session at the End of the Day 
 
 
And by default, all three settings should be set to "Disabled**". 
**Allow Back Dates Behavior** 
When the '**Allow Back Dates**' is enabled,** 
Then a numeric field labeled 'Back Days Limit**' should be enabled. 
The '**Back Days Limit**' field: 

- Should accept a maximum value of 90 days 
- Should have a default value of 1 when enabled 
 
 
**Visitor Portal Access via VRN Only** 
When the 'Visitor Portal access via VRN only' is enabled: 
The visitor should be required to provide only the VRN in the Visitor Portal. 
If the is not enabled: 
The visitor should be required to provide both the VRN and the Voucher ID. 
** 
Allow Back Dates Functionality** 
When the 'Allow Back Dates' is enabled,** 
Then the system should allow visitors to apply a voucher for previous dates. 

 
End Session at the End of the Day** 
When the 'End Session at the End of the Day' is enabled,** 
Then all visitor sessions should automatically end at 11:59 PM (23.59) on the same day applied in the Visitor Portal, regardless of the session start time. 

 
Publish (Not covered in this story)** 
When the permission is published,
 
Then the Visitor Portal VRN Only Settings section is not mandatory to configure.
