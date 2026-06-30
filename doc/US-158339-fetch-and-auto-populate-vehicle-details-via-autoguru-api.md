# US-158339: Fetch and Auto-populate Vehicle Details via Autoguru API

| Field | Value |
|-------|-------|
| **ID** | 158339 |
| **Type** | User Story |
| **Module** | Buy Now |
| **State** | Ready for UAT |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete; Technical |

## Acceptance Criteria

**** 
**Given** a user is viewing the vehicle information screen,**When** the user clicks the "Show Details" button,**Then** the system sends a request to the Autoguru API, including the access token in the request header for authentication. 
**Given** a successful response is received from the Autoguru API,**When** the system processes the response,**Then** the following fields are auto-populated with the corresponding data from the API: 

- Fuel Type 
- Make 
- Model 
- Color 
- CO₂ Emission (g/km) 
- Euro Standard 
 
**Given** a network or API failure occurs while fetching vehicle details,**When** the system detects the failure,**Then** the user receives a clear notification about the issue and is provided with an option to retry the API call. 
**Given** any API call is made to the Autoguru service,**When** the request is sent and a response is received (or fails),**Then** the system logs all requests and responses, including timestamps and relevant metadata, for monitoring and compliance purposes. 
And 
**Then** the system sends a request to the Auto Guru API microservice, including the contract information, VRM, request payload and response payload are recorded in the audit table for future reference and compliance.
 

 
 
To create a new function for getting Auto Guru vehicle details via a GET call. This function should be common and reusable, so it can be integrated wherever needed.
 
Note : If it does not exist in our database, we will capture the response in the database for showing the dropdown in vehicle screen

Function name : Func-AutoGuru-LiveLookup 
Database name : AutoGuru-LiveLookupDB  
Table Schema : [AutoGuru_Schema.sql](https://dev.azure.com/MHPortfolio/13c4b98a-5b83-4cbe-b995-d1cf15a63011/_apis/wit/attachments/b284d5c6-565d-4d80-986c-8a706efbefbf?fileName=AutoGuru_Schema.sql&download=true)
