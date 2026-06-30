# US-164949: Enable Illumin8 Toggle

| Field | Value |
|-------|-------|
| **ID** | 164949 |
| **Type** | User Story |
| **Module** | MNPS Contract Settings |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** |  |

## Acceptance Criteria

Given a super admin or org admin
 
 
 
 
 
 
 
When in the contract settings for apply (MNPS) 
Then should have the Apply illumin8 toggle 

 
**Default Behavior:** 
The Apply Illumin8 toggle is disabled by default. 

 
**Toggle On** 
When the toggle is enabled 
Then should see a confirmation pop-up appears with the message "By enabling this toggle, you are connecting this contract with the Illumin8 system to manage permit data, enforcement activities, and operational workflows. Do you want to enable it?" 
The pop-up contains two buttons: 
Enable — confirms and enables the toggle 
Cancel — closes the pop-up without enabling the toggle. 

 
When the illumin8 toggle is enabled for a contract  
Then should have the 'Apply Illumin8 Contract' as text field should accept alphanumeric including special characters maximum of 20 characters. 

 
Note: When mapping a illumin8 contract with apply contract should be match correct user should ensure to map the same correct. There is no validation for mapping illumin8 contract with apply contract to get a correct session details. 
  
When the Illumin8 toggle is enabled for a contract,
Then a contract selection dropdown should be displayed,
And the dropdown should list all contracts available from the Illumin8 system with the correct values.
  

- ~~Wandsworth ~~ 
- ~~Dudley ~~ 
- ~~Warrington ~~ 
- ~~Hammersmith & Fulham ~~ 
- ~~Bracknell Forest ~~ 
- ~~Wirral ~~ 
- ~~Warwickshire ~~ 
- ~~Wokingham ~~ 
- ~~Surrey ~~ 
- ~~Waltham Forest ~~ 
- ~~Welwyn Garden City ~~ 
- ~~ESCC ~~ 
- ~~Highland ~~ 
- ~~Edinburgh ~~ 
- ~~Lewisham ~~ 
- ~~Barnet ~~ 
 
 
~~When select illumin8 contract in the drop down ~~ 
~~Then contract created for apply and the illumin8 contract should be same ~~ 

  
~~**Example:** ~~ 
~~When contract created in apply as 'Lewisham' ~~ 
~~Then should select the illumin8 contract in the drop down as 'Lewisham'  ~~ 

 
**Toggle Off** 
When the toggle is disabled 
Then should see a confirmation pop-up appears with the message "Disabling this toggle will disconnect this contract from the Illumin8 system. Do you want to enable it?" 
The pop-up contains two buttons: 
Disable — confirms and disables the toggle 
Cancel — closes the pop-up without disabling the toggle 

 
When the toggle is disabled 
Then the Apply illimin8 contract field should be hidden 

 
**Event:** 
Event Type / Name: Apply Illumin8 Toggle enabled  
Event Description: Apply Illumin8 Toggle enabled "contract name" 
Date and Time: $CurrentTimestamp 
User Role: $UserRole 
User Name: $FirstName $LastName 
Event Category/Type: Configuration 
 
Event Type / Name: Apply Illumin8 Toggle disabled  
Event Description: Apply Illumin8 Toggle disabled "contract name" 
Date and Time: $CurrentTimestamp 
User Role: $UserRole 
User Name: $FirstName $LastName 
Event Category/Type: Configuration
