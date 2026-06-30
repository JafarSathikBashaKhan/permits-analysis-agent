# Test Scenarios — US-125471: Street and Property Creation

## Test Suite: Street Creation

### TC-001: Verify New Street form opens
- **Precondition:** Logged in as Super Admin / Contract Admin
- **Steps:** Navigate to Area → Streets → Click "+ NEW STREET"
- **Expected:** New Street form modal appears with all fields

### TC-002: Create street with all valid fields
- **Precondition:** New Street form is open
- **Steps:**
  1. Enter Street Name: "TestStreet_001"
  2. Enter USRN: "USR12345"
  3. Select Town from dropdown
  4. Add Property: "Property_A" (type + Enter)
  5. Fill Postcode: "RG40 1BJ"
  6. Fill UPRN: "UPR67890"
  7. Set Permission Limit: 2
  8. Click "ADD STREET"
- **Expected:** Street added to grid, success confirmation

### TC-003: Validate Street Name max length (100 chars)
- **Steps:** Enter 101 characters in Street Name
- **Expected:** Field does not accept more than 100 characters

### TC-004: Validate USRN uniqueness
- **Steps:** Enter an already existing USRN value
- **Expected:** Error message "Duplicate USRN."

### TC-005: Validate UPRN uniqueness
- **Steps:** Enter an already existing UPRN value
- **Expected:** Error message "Duplicate UPRN."

### TC-006: USRN auto-generate (toggle ON)
- **Precondition:** USRN toggle enabled in Contract Settings
- **Steps:** Open New Street form
- **Expected:** USRN field is auto-populated and read-only

### TC-007: USRN manual entry (toggle OFF)
- **Precondition:** USRN toggle disabled in Contract Settings
- **Steps:** Open New Street form
- **Expected:** USRN field is editable, max 15 chars, alphanumeric

### TC-008: UPRN auto-generate (toggle ON)
- **Precondition:** UPRN toggle enabled in Contract Settings
- **Steps:** Add a property
- **Expected:** UPRN field is auto-populated and read-only

### TC-009: UPRN manual entry (toggle OFF)
- **Precondition:** UPRN toggle disabled in Contract Settings
- **Steps:** Add a property
- **Expected:** UPRN field is editable, max 15 chars, alphanumeric

### TC-010: Mandatory field validation — empty fields
- **Steps:** Leave all fields empty, try to submit
- **Expected:** "This field is required." error on each mandatory field

### TC-011: Town is mandatory dropdown
- **Steps:** Type a town name that exists → Select it
- **Expected:** Town is associated with the street

### TC-012: Add multiple properties to a street
- **Steps:** Add "PropA", "PropB", "PropC" via the property input
- **Expected:** All 3 appear in property list, count shows "3 Properties"

### TC-013: Remove a property
- **Steps:** Add a property → Click the remove (❌) button
- **Expected:** Property removed from the list, count decrements

### TC-014: Duplicate property within same street
- **Steps:** Add "PropA" → Try adding "PropA" again
- **Expected:** Validation error for duplicate property

### TC-015: Cancel button — confirmation dialog
- **Steps:** Fill some fields → Click "CANCEL"
- **Expected:** Prompt: "Are you sure you want to cancel, as this will reset the data on the screen and close it?" with Yes/No

### TC-016: Cancel → Yes
- **Steps:** Click Cancel → Click "Yes"
- **Expected:** Form closes, data cleared, returns to street grid

### TC-017: Cancel → No
- **Steps:** Click Cancel → Click "No"
- **Expected:** Stays on form, data retained

### TC-018: Postcode suggestion dropdown
- **Steps:** Type an existing postcode (e.g., "RG40")
- **Expected:** Matching postcodes appear as suggestions

### TC-019: Permission Limit range validation
- **Steps:** Try setting value > 99 or < 0
- **Expected:** Value clamped between 0–99

### TC-020: Permission Limit increment/decrement
- **Steps:** Use +/- buttons on Permission Limit field
- **Expected:** Value increments/decrements by 1

### TC-021: System Audit event logged
- **Steps:** Create a street successfully
- **Expected:** System Audits shows event:
  - Event Name: "Street creation"
  - Event Description: "Street, Property, Town and Postcode created and associated"
  - Correct user name, role, and timestamp

### TC-022: Property scroller when exceeding space
- **Steps:** Add 10+ properties
- **Expected:** Scroller appears in the properties section

### TC-023: Property cannot map to multiple streets
- **Steps:** Create Street A with "PropX" → Create Street B with "PropX"
- **Expected:** Validation prevents duplicate property mapping

---

## Automation Coverage

| Test Case | Automated | Script |
|-----------|-----------|--------|
| TC-002 | ✅ | `create_street.js` |
| TC-004 | 🔲 | Planned |
| TC-005 | 🔲 | Planned |
| TC-010 | 🔲 | Planned |
| TC-015 | 🔲 | Planned |
