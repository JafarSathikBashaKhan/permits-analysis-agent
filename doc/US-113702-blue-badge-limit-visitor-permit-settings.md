# User Story 113702: Blue Badge Limit & Visitor Permit Settings

## Metadata
| Field | Value |
|-------|-------|
| ID | 113702 |
| Type | User Story |
| Title | Blue Badge Limit & Visitor Permit Settings |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete; LV |
| Module | Contract Settings |

---

## Acceptance Criteria

**Blue Badge Limit**** 
 
 
**Given** a Super admin or Contract admin
**When** on the Contract Settings screen
**Then** they should see a section titled **“Blue Badge Limit”**
**And** a field to set the **maximum allowed count** for Blue Badge IDs
**And** the field should accept values between **0 and 200**
 
And If the value here is set as 100 for example, then that means the contract can accept up to 100 blue badge concessions requestion through citizen user while applying for the permit. 

 
**Given** the Blue Badge Limit field is available
**When** the admin enters a value less than 0 or more than 200
**Then** the system should display a validation error (values less than 0 it will show error message "The Blue Badge Limit cannot be less than 0." and "The Blue Badge Limit cannot exceed 200.")
**And** prevent saving the configuration 

 
**Visitor Permit**
 
**When** on the Contract Settings screen
**Then** they should see a section titled “Minimum number & Maximum number”
**And** fields to configure minimum and maximum limits
**And** values should be within 0 to 1000 

 
**Given** Visitor Permit settings are visible
**When** the admin enters a min value greater than max( less than 0 it will show error message "The minimum  Limit cannot be less than 0." and more than 1000 it will show error message  "The maximum  Limit cannot exceed 1000.")
**Then** the system should show a validation error
**And** prevent saving
 

 
**Then** they should see a section titled “Minimum number of scratch card books & Maximum number of scratch card books”**And** values should be within **0 to 1000**
 
And **the admin enters a min value greater than max( less than 0 it will show error message "The minimum  Limit cannot be less than 0." and more than 1000 it will show error message  "The maximum  Limit cannot exceed 1000.")
