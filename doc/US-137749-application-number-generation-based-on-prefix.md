# User Story 137749: Application Number Generation Based on Prefix

## Metadata
| Field | Value |
|-------|-------|
| ID | 137749 |
| Type | User Story |
| Title | Application Number Generation Based on Prefix |
| Assigned To | Karthikeyan RR |
| State | Done |
| Tags | Customer_Portal |
| Module | Permission Setup > Permission Builder |

---

## Acceptance Criteria

Prefix should be generated based on what is configured in permission level [#135721](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/135721/) & [#188673](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/188673/) 
** 
Application Number Generation Format**** 
 
 
Given a valid prefix is configured (e.g., MX3),
 
When an application is submitted,
 
Then the system should generate the application number as MX3-XXXXXXXX (where XXXXXXXX is a unique alphanumeric string of 8 characters).
 

 
System Adds Hyphen Automatically**** 
Given a prefix value exists,
 
When an application is created,
 
Then the system must add the hyphen (-) after the prefix automatically without user input.
 

 
Fixed Structure and Length**** 
Given the prefix is up to 10 characters,
 
Then the total length of the application number should not exceed 19 characters. (with hyphen 19 characters) 

 
Suffix can be duplicated across permissions and contracts
**Given the system auto-generates an 8-character suffix for each application,** 
When a suffix happens to be the same as another suffix generated for a different application,
 
Then it is acceptable as long as the prefix is different, ensuring the final application number remains unique. (Different Prefix - Same Suffix) 

 
Application number must always be unique
**Given an application number follows the format [PREFIX]-[SUFFIX],** 
When a new application number is generated,
 
Then the system must verify that the complete application number (prefix + suffix) does not already exist in the system.
 
And if a duplicate combination is found, the system should regenerate a new unique suffix automatically before saving.
 

 
Unique ID Generation**
 
Given multiple applications are submitted under the same permission type or same permission group, 
Then each application should receive a unique application number with the same prefix and different 8-character suffix.
