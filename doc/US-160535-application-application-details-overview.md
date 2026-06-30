# US-160535: Application | Application Details | Overview

| Field | Value |
|-------|-------|
| **ID** | 160535 |
| **Type** | User Story |
| **Module** | Applications |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete |

## Acceptance Criteria

**** 
**** 
**** 
**** 
Permissions
Based on Role 
Given
the user is logged in as either a Super Admin or Contract User, 
When
they access the Applications menu, 
Then
they should be able so permissions and its details 
  
1.
Navigation 
 Given
the Permissions details page 
When
the user selects a Reference Number 
Then
the system must open the Application View screen for that reference number 
And
display all the defined sections (Overview, Applicant, Vehicles, Documents,
Notes, Emails, Audit Log, Payment History). 
 Note:
Vehicles tab will not be displayed for License permission, if License is
selected 

 
2.
Overview Section 
 Given
the Application View screen is open 
Then
the Overview section must display: 

 
**Display of Location details** 
  
  Given the
Application View screen is open 
  When the Overview
section is displayed 
  Then the system
must show Zonal location if applicable 
  And the system must
show Non-Zonal location if applicable 

 
  Fields for location: 
  Address  
  Postcode : 
  Zone :  
  UPRN :  
  
**Display of Permit details** 
  
  Given the
Application View screen is open 
  When the Overview
section is displayed 
  Then the system
must display  

- Permit
Type 
- Application
Date 
- Application
Status 
- Permit
Duration 
- Start
Date 
- End
Date 
- Payment
method 
- Paid
on 
- Price 
 
  
**BO user can edit Start and End dates** 
  
  Given the
Application View screen is open 
  And the logged-in
user is a BO user 
  When the Overview
section is displayed 
  Then system must
display 

- Start
Date  
- End
Date             
 
 And Start Date field
must be editable 
  And the End Date
field must be editable 
  
**Display of Payment details** 
  
  Given the
Application View screen is open 
  When the Overview
section is displayed 
  Then the system
must show the Payment Method 
  And the system must
show the Paid On date if payment is made 
  And the system must
show the Price amount 
  
**Display of additional details** 
  
  Given the
Application View screen is open 
  When the Overview
section is displayed 
  Then the system
must show the Work Queue Type 
  And the system must
show the Experian Authentication Index 

 
**Audit Log ** 

 
And Audit log is maintained if start date and end date are changed by BO user 

 
 
Event:
Permit Start Date Updated 

 - **Event Name:** Permit Start Date Updated 

 - **Event Description:** The permit start date was
     modified by the BO user. 

 - **Event Category:** Permit Management 

 - **Date and Time:** Current $timestamp 

 - **User Role:** Role of the User 

 - **User Name:** First name and Last name of the
     user 
 
  
Event:
Permit End Date Updated 

 - **Event Name:** Permit End Date Updated 

 - **Event Description:** The permit end date was
     modified by the BO user. 

 - **Event Category:** Permit Management 

 - **Date and Time:** Current $timestamp 

 - **User Role:** Role of the User 

 - **User Name:** First name and Last name of the
     user
