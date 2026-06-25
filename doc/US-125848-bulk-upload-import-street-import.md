# User Story 125848: Bulk Upload & Import | street import

## Metadata
| Field | Value |
|-------|-------|
| ID | 125848 |
| Type | User Story |
| Title | Bulk Upload & Import | street import |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags | Fully Complete |
| Module | Area |

---

## Acceptance Criteria

**Navigation - Area - > Street - > Import** ****** **File Upload** **File Upload Support**

- **Given** a user has a .xlsx /.csv file containing data on streets, zones, or locations,

- **When** the user uploads the file,

- **Then** the system should accept the upload and begin processing.


AND

- Maximum file size should be 5MB, more than which the system should not accept and show message as "File size exceeds 5MB".


** Display Upload Status**

- **Given** a file is successfully uploaded,

- **When** the file finishes uploading,

- **Then** the file name, size, and status of completion should be displayed.


**File Format Validation**

- **Given** a user uploads a file,

- **When** the file format is unsupported,

- **Then** the system should reject the file and display an appropriate error message.

- For file format validation show error as: "File format does not match"

- For Column mismatches show error as: "The columns in your file do not match the required format. Please download the sample template and try again."


**Upload Success Indicator**

- **Given** a file is successfully uploaded,

- **When** the upload is complete,

- **Then** a success indication should be shown next to the file.



Validation Report – No Errors (Success Scenario)**

- **Given** the system has validated the uploaded data,

- **When** all rows are valid,

- **Then** it should display: "[250] rows detected. [0] rows contain errors."


AND

- **Then** the system should display: “You’re ready to proceed to import.”


**
**Import Process – All Data Valid**
- **Given** the file contains no errors,

- **When** the user proceeds to import,

- **Then** the system should allow the import to begin.


AND

- **When** import is complete,

- **Then** display: “Data import completed successfully. All records have been processed without issues.”


AND

- **When** results are shown,

- **Then** show a breakdown of:


- Total Rows

- Imported Rows

- Skipped Rows (should be 0)





- **Given** the import process is complete,

- **When** the final report is displayed,

- **Then** the user must see a clearly labelled **Close** button.

- Close button, When invoked should close the  import slider




**After upload when found with errors** **Validation Report (Error Scenario)**
- **Given** the system is after completing the upload and on validating the file,

- **When** any of the following are found:

Invalid data format

- Exceeded character limits

- Missing required fields

- Duplicate entries


 - **Then** each issue should be flagged as errors.




- **Given** errors are found during validation,

- **When** validation completes,

- **Then** the system should show the total number of rows and how many contain errors (e.g., “250 rows detected. 30 rows contain errors.”)




- **Given** the file has validation errors,

- **When** results are shown, [Show error]

- **Then** the system must list:


- Row number

- column name the error encountered

- Specific error reason





- **Given** an error is shown in the validation table,

- **When** reviewing each row,

- **Then** the system must display error types like:


- "Invalid Data Format"

- "Exceeded Character Limit"

- "Missing Required Fields"

- "Duplicate Entry"

- "Empty mandatory fields"

- "Special character restricted"





- **Given** error details are displayed,

- **When** the user clicks “HIDE ERRORS”,

- **Then** the error list should collapsed.



- **Given** errors are detected,

- **When** the validation report is shown,

- **Then** the user should see:

Cancel

- Skip Errors and Import




- **Given** some rows have validation errors,

- **When** the user clicks **"Skip Errors and Import"**,

- **Then**:


- Only valid rows should be imported

- Error rows must be skipped

- The final import summary should show:


- Total Rows

- Imported Rows

- Skipped Rows (matching the number of error rows)






- **Given** validation errors are found,

- **When** the user invokes CLOSE button

- **Then** the system import slider should be closed without importing any data.


**
- **Given** a single row has multiple issues,

- **When** the error list is generated,

- **Then** the row number can appear multiple times with different error reasons.


**

- **Given** errors are shown,

- **When** the user reaches the error report screen,

- **Then** the system must display a message:*“You can choose to skip these errors and Continue Importing.”*


*
*
*Mandatory Fields:***
***Street [Without having street in the row, the entire row is invalid]***
~~***Zone [street and property available but zone unavailable, still go ahead and create street and property]*** ~~
***Property [street and zone available but property unavailable, still create street and zone]***
***Town [If the does not have town, consider the entire row invalid]***
***Post code [If the does not have post code, consider the entire row invalid]***
*
*
*Note:*
Mandate fields and validation as defined in the story,  [User Story 148746](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/148746): Bulk Import | Area config | Creation and Mapping of street, Zone, locations etc.,
USRN and UPRN import logic defined in [User Story 148746](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/148746): Bulk Import | Area config | Creation and Mapping of street, Zone, locations etc.,
