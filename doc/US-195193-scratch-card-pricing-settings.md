# User Story 195193: Scratch card pricing settings

## Metadata
| Field | Value |
|-------|-------|
| ID | 195193 |
| Type | User Story |
| Title | Scratch card pricing settings |
| Assigned To | Natarajan Arumugam |
| State | Done |
| Tags | southend |
| Module | Permission Setup > Permission Builder |

---

## Acceptance Criteria

Visibility & Enablement

 
Given a permissioned user with “Manage Permission and Pricing” access
 
When they open the builder - > General settings, 
Then should see an option to enable and disable scratch cards. 

 
When the scratch card enabled against the Permission 
Then in pricing section (both pricing tab within builder and pricing menu), should see an option to enter number of pages per book. 

 
 
Configuration
 

 
Given Scratch Card Pricing is enabled against that permission 
 
Then in pricing section, against duration, user must be able to configure: 

- ~~Number of books ~~ 
- Number of pages per book 
- Band price for that tier 
 
 

 
When entering the number of pages,
 
Then only even numbers should be allowed.
 

 
Example Tiers
 

 
Duration: 1 hr
 

 
Tier 1: 10 pages per book → 50 pence [band price]
 

 
Tier 2: 10 pages per book → 40 pence [band price]
 

 
Duration: 5 hr
 

 
Tier 1: 10 pages per book → 100 pence [band price]
 

 
Diesel Surcharge
 

 
Given Scratch Card Pricing is enabled
 
Then the Diesel Surcharge must always be set to 0, even if the diesel surcharge toggle is turned on.
 

 
Pricing Import: 

 
When in pricing import sheet (within permission's pricing section and pricing menu) 
Then should see additional column as "No of pages per book" 
Note: User can fill in the data against the scratch card permits. PFA reference. 

 
 
Customer Portal Purchase 
 

 
In the Customer Portal, users must be able to purchase scratch card pricing in fractional quantities, including half-book increments (e.g., 0.5 books).
 
For scratch cards the increment for number of books need to go up in 0.5 ie 0.5, 1, 1.5, 2, 2.5 etc  while setting up the quantity of books. 
**
