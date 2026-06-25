# US-165894: Application | Application Details | Overview | Email tab | Preview Email

| Field | Value |
|-------|-------|
| **ID** | 165894 |
| **Type** | User Story |
| **Module** | Applications |
| **State** | Done |
| **Assigned To** | Sudha Selvaraj  |
| **Tags** | Fully Complete |

## Acceptance Criteria

**Preview Sent/received email**

  Given the Application View screen is open

  When the Emails section is displayed

  And when user clicks on an email either sent/received

  Then it should display the details (preview) of the email with

   -Email subject at top

   - Sent to (email id)

   - CC 

   - Sent on (Date and time of email sent)

   - Subject

   - Email Body

   - Attachments added if any

  

**Lines and Breaks**

When viewing the email,

Then line breaks, paragraph formatting, and basic HTML formatting (bold, links, etc.) must be preserved.

**Emails with Attachments**

When the user opens the email with attachments,

Then the attachments should be downloadable.

  

Each attachment must be listed below the email body with:  

*   Filename
*   File type icon (e.g., PDF, Image)
*   Download button or link
