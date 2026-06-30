# User Story 148746: Bulk Import | Area config | Creation and Mapping of street and properties.

## Metadata
| Field | Value |
|-------|-------|
| ID | 148746 |
| Type | User Story |
| Title | Bulk Import | Area config | Creation and Mapping of street and properties. |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete |
| Module | Area |

---

## Acceptance Criteria

**Street **[Mandatory field]****
- **Given** a street name is present in the import row,

- **When** the street does not already exist in the system,

- **Then** the system should create a new street record.


**

- **Given** the street already exists in the system,

- **When** importing,

- **Then** map the property, ~~zone~~, USRN, and town from that row to the existing street.





- **Given** the import row does not contain a street name,

- **When** processing the row,

- **Then** the row should be flagged as **invalid** and not imported. Error reason: Street unavailable**

- Should not have duplicate validation for street.


**
~~Zone**: **[Mandatory field]** ~~

- ~~**Given** a zone name is present in the import row, ~~

- ~~**When** the zone does not exist, ~~

- ~~**Then** the system should create a new zone. ~~


**~~
~~**
- ~~**Given** a zone exists and a street is present in the row, ~~

- ~~**When** importing, ~~

- ~~**Then** map the street to the zone. ~~


**
**
- ~~**Given** the import row is missing the zone field, ~~

- ~~**When** processing, ~~

- ~~**Then** the street and other data available in the row should be imported with zone association to it. ~~

- ~~If street and zone missing in the row, then skip the record. **Error reason: Zone & Street unavailable.** ~~


**
- ~~**Given** a zone is present but street is missing in the row, ~~

- ~~**When** importing, ~~

- ~~**Then** only create the zone (if not existing), but do not map it to any street. ~~




Property ID / Name: [Mandatory field]**

- **Given** the property name or ID is new,

- **When** importing,

- **Then** create the property and associate it with the street in the same line.


**

- **Given** a valid property and street are present in a row,

- **When** importing,

- **Then** link the property to that street.





- **Given** a location data is present in the row,

- **When** the property is created or updated,

- **Then** associate the property and street to the location of the same row.





- **Given** a property is present but street is missing in the same row,

- **When** importing,

- **Then** flag the row as invalid and skip import. Error reason: Street is unavailable**


**
**USRN (Unique Street Reference Number)**


- **Given** a USRN is provided in a row,

- **When** importing,

- **Then** associate the USRN to the corresponding street in that row. [Only if the contract toggle for USRN is off, if toggle ON, then skip the USRN from the import sheet and auto generate when street is created or use the existing USRN of the street]




**UPRN (Unique Property Reference Number)**
**
**


- **Given** a UPRN is provided,

- **When** importing,

- **Then** link the UPRN to the property in the same row. [Only if the contract toggle for UPRN is off, if toggle ON, then skip the UPRN from the import sheet and auto generate when property is created or use the existing UPRN of the street]




Town**:

- **Given** a town is provided in a row,

- **When** importing,

- **Then** associate the town to the street in the same line.


**
Permission Limit:**

- **Given** permission limits are provided,

- **When** importing,

- **Then** map them to the property on the same row. [If Permission limit is not available in import sheet, no mapping required as this field is optional]


**

- **Given** permission limits exceed acceptable range,

- **When** importing,

- **Then** the data should be skipped from import.




Postcode:**

- **Given** a postcode is provided,

- **When** importing,

- **Then** associate the postcode with the property in the same row.


**

- **Given** a postcode does not match required format [defined in creation of postcode]

- **When** importing,

- **Then** the data should be skipped from import.







- **Given** multiple rows with a mix of valid and invalid data,

- **When** user clicks **“Skip Errors and Import”**,

- **Then** all valid rows should be imported, and invalid rows skipped with a detailed error report.





- **Given** a property already exists,

- **When** duplicate entries are found in the import file,

- **Then** prevent re-creation and associate to existing entity. Error message: Property already exists. ["field name" already exist.]**


**

- **Given** multiple data entities are tied in a single row (e.g., street, zone, property),

- **When** one of them fails validation,

- **Then** the entire row should be skipped. Error reason: "Field name" incorrect.**



**

- **Given** a critical field (street ) is missing,

- **When** validation runs,

- **Then** skip the row and flag it in the error report. Error message: Street is unavailable **

- [If street missing, skip the row]

- [if zone missing, create street and property and do the mapping]

- [if property missing, create zone and street and do the mapping]


**

- **Given** an error is shown in the validation table,

- **When** reviewing each row,

- **Then** the system must display error types against each column name:


- "Invalid Data Format"

- "Exceeded Character Limit"

- "Missing Required Fields"

- "Duplicate Entry"

- "Empty mandatory fields"

- "Special character restricted"



*Mandatory Fields:***
***Street [Without having street in the row, the entire row is invalid]***
~~***Zone [street and property available but zone unavailable, still go ahead and create street and property]*** ~~
***Property [street and zone available but property unavailable, skip the row]***
***Town [If the does not have town, consider the entire row invalid]***
***Post code [If the does not have post code, consider the entire row invalid]***
***Same street and same zone mapping should not be duplicated. eg: S1 and Z1, should not see another entry ***

**
Note**:
**1.Same street can be mapped to multiple zone but properties should be different. **
**2. If any of the field value does not meet the format its has been defined with then show error as "Invalid format for [Field Name]." **
