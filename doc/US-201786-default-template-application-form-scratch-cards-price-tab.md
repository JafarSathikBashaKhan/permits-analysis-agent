# US-201786: Default template | Application form | Scratch cards | Price tab

| Field | Value |
|-------|-------|
| **ID** | 201786 |
| **Type** | User Story |
| **Module** | Buy Now |
| **State** | Done |
| **Assigned To** | Prathiba K  |
| **Tags** | southend |

## Acceptance Criteria

This story is a continuation of [User Story 194957](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/194957): Default template | Application form | Scratch cards 

 
**Tab 3 | Price** 
**** 
No start date selection should be available as the stat date method will be configured as "issue now" for scratch cards and visitor permits. 
 
Pricing part as defined in "[User Story 180803](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/180803): Default template | Application form | Visitor Permission | Price&Checkout" tab   **EXCEPT below changes,** 
**** 
**Duration ** 
**Price** 
Diesel surcharge (if configured should be included in pricing summary) 
**Quantity of Books **- should allow user to purchase half the quantity of book i.e., 0.5, Max quantity should be between 1 to 10 per duration 
**Sub Total** 
**** 
**Example: Pricing calculation for 2 durations,** 
**Duration = 5 hour** 
**Quantity of books = 2 * 40 = 80 (Configuration in pricing: 1 book contains 20 pages = 40 pound)** 
**Sub total = 80 pound** 
**** 
**Duration = 1 hour** 
**Quantity of books= 5 * 10 = 50 (Configuration in pricing: 1 book contains 10 pages = 10 pound)****Sub total = 50 pound** 
**** 
**Total value = 145 pound** 
**[Sub total = 130 pound** 
**VAT = 5 pound (if enabled in permission)** 
**Admin fee = 10 pound] (if enabled in permission)** 
 
****For scratch cards in price tab, works almost similar to visitor permit's price tab except instead of just Quantity, for scratch cards it will be Quantity of books. 
For scratch cards the increment for number of books need to go up in 0.5 ie 0.5, 1, 1.5, 2, 2.5 etc  while setting up the quantity of books. 
 
Discounts on state pension and blue badge: Discounts if configured against the permissions or the contract should be applicable in price tab. refer discount related functionality in [#180803](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/180803/)
