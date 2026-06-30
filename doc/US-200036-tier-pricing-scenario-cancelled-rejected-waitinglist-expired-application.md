# US-200036: Tier Pricing scenario | Cancelled/Rejected/WaitingList/Expired application

| Field | Value |
|-------|-------|
| **ID** | 200036 |
| **Type** | User Story |
| **Module** | Buy Now |
| **State** | Done |
| **Assigned To** | Natarajan Arumugam  |
| **Tags** | southend |

## Acceptance Criteria

Tier pricing based on permission type
 

 
Given a permission request is submitted
 
When the permission is Zonal
 
Then tier pricing must be calculated at the property level.
 

 
Given a permission request is submitted
 
When the permission  is Non-Zonal
 
Then tier pricing must be calculated at the user level. 

 
Rejected/Cancelled/WaitingList/Expired first request resets tier
 

 
Given the first permission request for a property (Zone) or user (non-Zone) has a status of Cancelled, Rejected, WaitingList, or Expired or suspended
 
When the user submits a second permission request for the same property (Zone) or user (non-Zone)
 
Then the system must apply Tier 1 pricing for the second request.
 

 
Second request submitted before first request reaches final status
 

 
Given a first permission request is not in any of the non-progressive state like Cancelled, Rejected, WaitingList, or Expired or suspended
 
When the user submits a second permission request for the same property (Zone) or user (non-Zone)
 
Then the system must apply Tier 2 pricing for the second request.
 

 
Tier progression only occurs for active, non-final requests
 

 
Given multiple permission requests exist for the same property (Zone) or user (Non-Zone)
 
When a new request is submitted
 
And there is at least one previous request that is still active (not Cancelled, Rejected, WaitingList, or Expired or suspended)
 
Then the system must apply the next tier in sequence (Tier 2, Tier 3, etc.). 

 
Tier applied during purchase stage
 

 
Given the user has submitted multiple permission requests
 
When the user reaches the purchase step for any request
 
Then the system must apply the correct tier based on the rules:
 

 
Tier stay to 1 if all previous requests are in not progressive state
 

 
Zonal - Tier increments if there is an earlier request still active for the same property application purchase
 
And
 
Non zonal - Tier increments if there is an earlier request still active for the same user's purchase history.
