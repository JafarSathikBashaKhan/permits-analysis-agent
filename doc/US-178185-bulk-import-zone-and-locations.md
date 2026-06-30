# User Story 178185: Bulk Import | Zone and locations

## Metadata
| Field | Value |
|-------|-------|
| ID | 178185 |
| Type | User Story |
| Title | Bulk Import | Zone and locations |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags |  |
| Module | Area |

---

## Acceptance Criteria

**Navigation - Area - > Street - > Import**
** **
File Upload
File Upload Support

 - Given a
     user has a .xlsx /.csv file containing data on streets, zones,
     or locations,

 - When the
     user uploads the file,

 - Then the
     system should accept the upload and begin processing.

AND

 - Maximum
     file size should be 5MB, more than which the system should not accept and
     show message as "File size exceeds 5MB".

 Display Upload Status

 - Given a
     file is successfully uploaded,

 - When the
     file finishes uploading,

 - Then the
     file name, size, and status of completion should be displayed.

File Format Validation

 - Given a
     user uploads a file,

 - When the
     file format is unsupported,

 - Then the
     system should reject the file and display an appropriate error message.

 - For
     file format validation show error as: "File format does not
     match"

 - For
     Column mismatches show error as: "The columns in your file do not
     match the required format. Please download the sample template and try
     again."

Upload Success Indicator

 - Given a
     file is successfully uploaded,

 - When the
     upload is complete,

 - Then a
     success indication should be shown next to the file.


Validation Report – No Errors (Success Scenario)

 - Given the
     system has validated the uploaded data,

 - When all
     rows are valid,

 - Then it
     should display: "[250] rows detected. [0] rows contain errors."

AND

 - Then the
     system should display: “You’re ready to proceed to import.”


Import Process – All Data Valid

 - Given the
     file contains no errors,

 - When the
     user proceeds to import,

 - Then the
     system should allow the import to begin.

AND

 - When import
     is complete,

 - Then display:
     “Data import completed successfully. All records have been processed
     without issues.”

AND

 - When results
     are shown,

 - Then show
     a breakdown of:



  - Total
      Rows

  - Imported
      Rows

  - Skipped
      Rows (should be 0)





 - Given the
     import process is complete,

 - When the
     final report is displayed,

 - Then the
     user must see a clearly labelled Close button.

 - Close
     button, When invoked should close the  import slider


After upload when found with errors
Validation Report (Error Scenario)

 - Given the
     system is after completing the upload and on validating the file,

 - When any
     of the following are found:



  - Invalid
      data format

  - Exceeded
      character limits

  - Missing
      required fields

  - Duplicate
      entries



 - Then each
     issue should be flagged as errors.



 - Given errors
     are found during validation,

 - When validation
     completes,

 - Then the
     system should show the total number of rows and how many contain errors
     (e.g., “250 rows detected. 30 rows contain errors.”)



 - Given the
     file has validation errors,

 - When results
     are shown, [Show error]

 - Then the
     system must list:



  - Row
      number

  - column
      name the error encountered

  - Specific
      error reason





 - Given an
     error is shown in the validation table,

 - When reviewing
     each row,

 - Then the
     system must display error types like:



  - "Invalid
      Data Format"

  - "Exceeded
      Character Limit"

  - "Missing
      Required Fields"

  - "Duplicate
      Entry"

  - "Empty
      mandatory fields"

  - "Special
      character restricted"





 - Given error
     details are displayed,

 - When the
     user clicks “HIDE ERRORS”,

 - Then the
     error list should collapsed.

**


 - Given errors
     are detected,

 - When the
     validation report is shown,

 - Then the
     user should see:



  - Cancel

  - Skip
      Errors and Import




 - Given some
     rows have validation errors,

 - When the
     user clicks "Skip Errors and Import",

 - Then:



  - Only
      valid rows should be imported

  - Error
      rows must be skipped

  - The
      final import summary should show:



   - Total
       Rows

   - Imported
       Rows

   - Skipped
       Rows (matching the number of error rows)







 - Given validation
     errors are found,

 - When the
     user invokes CLOSE button

 - Then the
     system import slider should be closed without importing any data.




 - Given a
     single row has multiple issues,

 - When the
     error list is generated,

 - Then the
     row number can appear multiple times with different error reasons.



 - Given errors
     are shown,

 - When the
     user reaches the error report screen,

 - Then the
     system must display a message:

     *“You can choose to skip these errors and Continue Importing.”*


*Mandatory Fields:*
*Street [Without having street in the row, the entire
row is invalid]*
*Zone [street and property available but zone
unavailable, still go ahead and create street and property]*
*Property [street and zone available but property
unavailable, still go ahead and create street and zone]*
*Town [If the does not have town, consider the entire
row invalid]*
*Post code [If the does not have post code,
consider the entire row invalid]*

*Note:*
Mandate fields and validation as defined in the
story,  [User
Story 148746](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/148746): Bulk Import | Area config | Creation and Mapping of street,
Zone, locations etc.,
USRN and UPRN import logic defined in [User
Story 148746](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/148746): Bulk Import | Area config | Creation and Mapping of street,
Zone, locations etc.,

Bulk Import | Area config | Creation and Mapping of street,
Zone, locations.

 **~~Street [Mandatory field]~~

 - ~~Given a
     street name is present in the import row,~~

 - ~~When the
     street does not already exist in the system,~~

 - ~~Then the
     system should create a new street record.~~

~~ ~~

 - ~~Given the
     street already exists in the system,~~

 - ~~When importing,~~

 - ~~Then map
     the property, zone, USRN, and town from that row to the existing street.~~

~~ ~~

 - ~~Given the
     import row does not contain a street name,~~

 - ~~When processing
     the row,~~

 - ~~Then the
     row should be flagged as invalid and not imported. Error
     reason: Street unavailable~~

 - ~~Should
     not have duplicate validation for street.~~

~~ ~~
Zone: [Mandatory field]

 - Given a
     zone name is present in the import row,

 - When the
     zone does not exist,

 - Then the
     system should create a new zone.




 - Given a
     zone exists and a street is present in the row,

 - When importing,

 - Then map
     the street to the zone.




 - Given the
     import row is missing the zone field,

 - When processing,

 - Then the
     street and other data (properties etc.,) available in the row should be imported without zone
     association to it.

 - If
     street and zone missing in the row, then skip the record. Error
     reason: Zone & Street unavailable / Zone unavailable / Street unavailable.




 - Given a
     zone is present but street is missing in the row,

 - When importing,

 - Then only
     create the zone (if not existing), but do not map it to any street.


Property ID / Name: [Mandatory field]

 - Given the
     property name or ID or Number is new,

 - When importing,

 - Then create
     the property and associate it with the street in the same line.



 - Given a
     valid property and street are present in a row,

 - When importing,

 - Then link
     the property to that street.



 - Given a
     property is present but street is missing in the same row,

 - When importing,

 - Then flag
     the row as invalid and skip import. Error reason: Street
     is unavailable

Location:

- Given a location data is present in the row,
- When the property is created or updated,
- Then associate the property and street to the location of the same row. (If the row does not have location data, do rest of the mapping on zone, street, property etc., Location is optional)




USRN (Unique Street Reference Number)

 - Given a
     USRN is provided in a row,

 - When importing,

 - Then associate
     the USRN to the corresponding street in that row. [Only if the contract
     toggle for USRN is off, if toggle ON, then skip the USRN from the import
     sheet and auto generate when street is created or use the existing USRN of
     the street]


UPRN (Unique Property Reference Number)


 - Given a
     UPRN is provided,

 - When importing,

 - Then link
     the UPRN to the property in the same row. [Only if the contract
     toggle for UPRN is off, if toggle ON, then skip the UPRN from the import
     sheet and auto generate when property is created or use the existing
     UPRN of the street]


Town:

 - Given a
     town is provided in a row,

 - When importing,

 - Then associate
     the town to the street in the same line.


Permission Limit:

 - Given permission
     limits are provided,

 - When importing,

 - Then map
     them to the property on the same row. [If Permission limit is not
     available in import sheet, no mapping required as this field is optional]



 - Given permission
     limits exceed acceptable range,

 - When importing,

 - Then the
     data should be skipped from import.


Postcode:

 - Given a
     postcode is provided,

 - When importing,

 - Then associate
     the postcode with the property in the same row.



 - Given a
     postcode does not match required format [defined in creation of postcode]

 - When importing,

 - Then the
     data should be skipped from import.


 Generic:

 - Given multiple
     rows with a mix of valid and invalid data,

 - When user
     clicks “Skip Errors and Import”,

 - Then all
     valid rows should be imported, and invalid rows skipped with a detailed
     error report.



 - Given a (example., property) already exists,

 - When duplicate
     entries are found in the import file,

 - Then prevent
     re-creation and associate to existing entity. Error message:
     Property already exists. ["field name" already exist.]



 - Given multiple
     data entities are tied in a single row (e.g., street, zone, property),

 - When one
     of them fails validation,

 - Then the
     entire row should be skipped. Error reason: "Field name"
     incorrect.



 - Given a
     critical field (street ) is missing,

 - When validation
     runs,

 - Then skip
     the row and flag it in the error report. Error
     message: Street is unavailable

 - [If
     street missing, skip the row]

 - [if
     zone missing, create street and property and do the mapping]

 - [if
     property missing, skip the row]



 - Given an
     error is shown in the validation table,

 - When reviewing
     each row,

 - Then the
     system must display error types against each column name:



  - "Invalid
      Data Format"

  - "Exceeded
      Character Limit"

  - "Missing
      Required Fields" / "{Field name} unavailable"

  - "Duplicate
      Entry"

  - "Special
      character restricted"



*Mandatory Fields:*
*Street [Without having street in the row, the entire
row is invalid]*
*Zone [street and property available but zone
unavailable, still go ahead and create street and property]*
*Property [street and zone available but property
unavailable, skip the row]*
*Town [If the does not have town, consider the entire
row invalid]*
*Post code [If the does not have post code,
consider the entire row invalid]*
*Same street and same zone mapping should not be
duplicated. eg: S1 and Z1, should not see another entry *

Note:
1.Same street can be mapped to multiple zone but
properties should be different.
2. If any of the field value does not meet the format its
has been defined with then show error as "Invalid format for [Field
Name]."
