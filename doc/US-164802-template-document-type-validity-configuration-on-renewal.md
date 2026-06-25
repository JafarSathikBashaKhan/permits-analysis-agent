# User Story 164802: Template | Document type validity configuration on renewal

## Metadata
| Field | Value |
|-------|-------|
| ID | 164802 |
| Type | User Story |
| Title | Template | Document type validity configuration on renewal |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags |  |
| Module | Templates |

---

## Acceptance Criteria

Given a super admin or contract admin 
When in the template menu - > Document type create screen 
Then should have a provision to configure the document expiry duration.  
This setting is optional to create a document type. 
** 
When in the create, Edit and View screen of document type  
Then should see a field as Expiration duration  
And 
Then should see fields for frequency and period to be selectable, 

- Frequency - It defines **how long a document uploaded during the application process remains valid in the system. Value ranges from (1 - 1000) 
- Period -  It defines the time unit (hour, day, week, month, or year) that determines how long a support document remains valid. 
 
When in the frequency field 
 
Then the system should: 

- Accept only positive whole numbers 
- Accept values from 0 to 999 (a maximum of 3 digits). 
- Should not accept decimal values 
 
 
When in the period field 
Then should have the drop down values as  

- Hour 
- Day 
- Week 
- Month 
- Year 
 
Expiry document settings can be configured at both the contract level and the individual document type level.**If expiry settings are defined for a specific document type, those settings should take precedence over the contract-level configuration.For any document types where expiry settings are not specified, the system should apply the expiry duration defined at the contract level.
 

 
 
Example scenario:** 
 
 
 
When the "Frequency" field is set to 1 and the "Period" is set to Year,**If the user initiates a renewal of the permission after one year,
Then the system should display a message in the Customer Portal indicating that the previously uploaded document has expired,
And the system should prompt the user to upload a new document as part of the renewal process. 

 
Event ** 
Event Type / Name: Document Expiration Settings Updated. 
Event Description: **Document Expiration Settings Updated for the "{Document type}"** 
Date and Time: $CurrentTimestamp 
User Role: $UserRole 
User Name: $FirstName $LastName 
Event Category/Type: Configuration
