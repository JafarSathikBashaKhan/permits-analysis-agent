# User Story 171259: Unsaved Changes Warning on Navigation | Menus

## Metadata
| Field | Value |
|-------|-------|
| ID | 171259 |
| Type | User Story |
| Title | Unsaved Changes Warning on Navigation | Menus |
| Assigned To | Sudha Selvaraj |
| State | Done |
| Tags |  |
| Module | Area |

---

## Acceptance Criteria

**Display warning when navigating away with unsaved changes
**


Given the system user has made changes on a form that are not yet saved,**
When the user attempts to navigate to another menu, tab, or page,

Then the system should display a warning message
"You have unsaved changes. Do you wish to leave?" with "Stay" and "Leave" options should be shown.


Cancel**:
When invoked Cancel or close for those slider pop-ups,
Then "You have unsaved changes. Do you wish to leave?" with "Stay" and "Leave" options should be shown.
**
Stay on page when user selects “Stay”****
Given the unsaved changes warning is displayed,

When the user selects Stay On Page,

Then the pop-up should close,

And the user should remain on the current form with all unsaved data retained.


Save data and navigate when user selects “Leave”****
Given the unsaved changes warning is displayed,

When the user selects Leave,

Then the system should let the user to leave the page.


No warning when there are no unsaved changes
**
Given the user has not modified any data on the form,**
When the user navigates to another menu or page,

Then the system should not display any warning message,

And should directly navigate to the selected page.



Consistent behavior across all navigation types****
Given there are unsaved changes on the current page,

When the user tries to navigate away through any type of action — such as menu click, tab change, breadcrumb, or in-app back button,

Then the unsaved changes warning pop-up should appear consistently.



Pop-up modality****
Given the unsaved changes warning is displayed,

When the pop-up is active,

Then the user should not be able to interact with the underlying page until one of the three options is chosen.


Note: Except Permission builder, this needs to be implemented for all other screens where the data are saved. Because for Permission builder, it is already implemented.


The following are the menus**
Permission Setup -> Group
Permission Setup -> Pricing (May not be required)
Templates -> Document Type
Templates -> Terms and Conditions
Templates -> Alerts and Tool tips (Cookie, Experian, Property, Customer Notification)
Area -> Street

Area -> Zone
Area -> Location
Area -> Special Event
Contract Settings
**
Note**:
For some menus, where slider pop-up is used, already the background or other options are disabled. So by default, user cannot click on other items.
For those menus, this can be skipped.
