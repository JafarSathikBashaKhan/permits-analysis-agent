# US-181869: Application | Application Details | Temporary Permission Application

| Field | Value |
|-------|-------|
| **ID** | 181869 |
| **Type** | User Story |
| **Module** | Applications |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

**Pre-condition : Active** 

 
**Application assigned to BO which are in "Change Address Challenge " Work queue state** 
** ** 
Scenario :
Application Moves to “Change Address Challenge” State 

 
Given
the application is created with a temporary address flag 
When
the Back Office user starts reviewing the application which are in "Change Address
Challenge" state 
And
has verified the address and supporting documents 
When
the address is validated as a legitimate and valid address 
Then
the Back Office user can include the address in the respective zone list and approve address challenge 
And
the application status should move to "Address Challenge Approved" 

 
**Updated work queue : Address challenge Approved ----> Active** 

 
 
Given the
BO user has permission to manage addresses 
And the
permit is in an Change Address Challenge state 
When the BO
user adds a new temporary address into the portal 
Then
provides valid property, street, town, and postcode details 
And save
the address into the portal 
And allow
the user to proceed to map the correct zone with respect to the property,
street added 
  
Given a
temporary address is added and zone mapping is completed 
When the BO
user triggers “assign” address action 
Then the newly
added address should be assigned to the respective permit  
And the
permit should move to the "Address Challenge Approved" state 
And
subsequently move to the "Active" state 
And an Email notification will be triggered automatically to the applicant about the address mapped to zone 
  
Given the
permit has been assigned with a new address and zone 
When the
system updates the address and zone details 
Then the
updated zone information should be sent automatically to Illumin8 
And the
system should log a communication event indicating successful data sync 
  
 

 

- **Event Name: Change address challenge initiated** 
- **Event Description: <Bo user> **initiated Change address challenge  
- **Event Category: Workflow Transition** 
- **Application ID: $ApplicationID** 
- **Date & Time: $timestamp** 
- **User Role: Back Office (BO) User** 
- **User Name: $UserName** 
 

 
   
**Temporary Address Assigned to Permit** 

 - Event
     Name: Temporary Address added and Assigned to Permit 

 - Event
     Description:  <BO user> assigned the temporary address in the system and mapped zone to the permit. 

 - Event
     Category: Workflow Transition 

 - Application
     ID: $ApplicationID 

 - Date
     & Time: $timestamp 

 - User
     Role: Back Office (BO) User 

 - User
     Name: $UserName 
 
  
  
**Zone Details Sent to Illumin8** 

 - Event
     Name: Zone Details Sent to Illumin8 

 - Event
     Description: Captures the system’s automated event of
     transmitting the updated address and zone information to the external
     Illumin8 system for synchronization. 

 - Event
     Category: Communication / Integration 

 - Application
     ID: $ApplicationID 

 - Date
     & Time: $timestamp 

 - User
     Role: System 

 - User
     Name: System
