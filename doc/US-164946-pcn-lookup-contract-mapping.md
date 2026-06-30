# US-164946: PCN Lookup | Contract Mapping

| Field | Value |
|-------|-------|
| **ID** | 164946 |
| **Type** | User Story |
| **Module** | MNPS Contract Settings |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Placeholder story |

## Acceptance Criteria

Given a Super Admin user, 
When the PCN Lookup toggle is enabled, 
Then a PCN contract name selection dropdown should be displayed. 

 
**Dropdown List** 
Then the dropdown should list all available contracts that have been created with contract type = 'PCN' within the selected organization. 

 
When the PCN lookup toggle is disabled 
Then the PCN contract field should be hidden 

 
**Mapping Responsibility** 
_Note:_ The PCN contract selected must logically match the applied contract. 
**Example:**  
If the applied contract is Lewisham, the selected PCN contract should also correspond to Lewisham. 
The system does not perform automatic validation for this mapping. 
Users are responsible for ensuring that the correct PCN contract is selected. 

 
**Audit/Event:** 
Event Type / Name: PCN contract name mapped 
Event Description: PCN contract name mapped "contract name" 
Date and Time: $CurrentTimestamp 
User Role: $UserRole 
User Name: $FirstName $LastName 
Event Category/Type: Configuration
