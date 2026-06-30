# FRD_Apply IQ SMS Functionality_V1.0_08-06-26

> **Confluence ID:** 2029617163 · **Version:** 6 · **Last updated:** 2026-06-15T10:42:39.649Z
> **Path:** Requirements / SMS
> **URL:** https://marston.atlassian.net/wiki/spaces/FF/pages/2029617163/FRD_Apply+IQ+SMS+Functionality_V1.0_08-06-26

---

## **Document Control**

Version

Date

Author

Description

1.0

04-Jun-2026

Prathiba K

Initial FRD for SMS functionality

1.1

15-Jun-2026

Prathiba K

FRD updated to include contract charging configuration, permission builder behavior, applicant opt-in, template management, purchase/checkout charging, voucher activation/send via SMS, reminder scheduling, reporting, and communication history

* * *

## **1\. Purpose**

This document defines the functional requirements for SMS functionality in Apply IQ and Notice IQ, including contract-level SMS charging configuration, permission-level override behavior, applicant SMS opt-in and verification, SMS template management, purchase and checkout charging rules, visitor voucher activation and send-via-SMS flows, reminder scheduling, reporting, and communication history visibility.

* * *

## **2\. Background**

The current system supports email-based communication and reminder functionality. SMS support is required as an additional communication channel for reminder notifications, visitor voucher activation, voucher sending, and reporting. The solution must support both council-paid and applicant-paid charging models, contract-level defaults, permission-level overrides, applicant opt-in management, payment integration where required, and unified audit/reporting visibility.

The FRD also includes administrative configuration in Apply IQ / MNPS and template management in Notice IQ for SMS-based communication.

* * *

## **3\. Scope**

### **3.1 In Scope**

-   Contract-level SMS reminder enablement and charge responsibility configuration
    
-   SMS pricing setup for reminders and visitor voucher activation/sending
    
-   Same amount synchronization option for reminder and voucher SMS pricing
    
-   Currency display driven by MNPS contract settings
    
-   Permission Builder SMS reminder visibility and charge configuration
    
-   Visitor-specific SMS charge configuration in Visitor Portal Settings
    
-   Template creation for SMS in Notice IQ
    
-   Checkout-time SMS charge application for reminder-eligible purchases
    
-   Applicant SMS opt-in popup, profile preference management, and verification flow
    
-   Voucher activation communication preference flow (email / SMS)
    
-   Send Voucher via SMS flow, including payment and revoke behavior
    
-   Reminder SMS scheduling, template usage, and opt-out handling
    
-   Applicant-level and organization-level SMS reports
    
-   Communication tab update to show both Email and SMS history
    
-   SMS audit/event logging
    

### **3.2 Out of Scope**

-   Final SMS provider selection
    
-   SMS gateway implementation details
    
-   Advanced analytics dashboards outside defined Power BI reports
    
-   Refund logic for SMS charges unless explicitly specified
    
-   Changes to existing send voucher flow outside SMS extension behavior
    
-   Deployment pipeline changes for Power BI reports
    

* * *

## **4\. Stakeholders**

-   Joanne Archer – Product / Business Stakeholder
    
-   Super Admin / Contract Admin / BO Manager / BO User – Administrative/report users
    
-   CP / BO Applicants – End users receiving SMS communications
    

* * *

## **5\. Functional Overview**

The system shall support SMS as an additional communication channel where contract-level SMS is enabled. Council administrators shall be able to define whether SMS costs are borne by the council or passed to applicants. Where applicant charging is enabled, the system shall support contract-level SMS charges and permission-level overrides for reminder SMS and voucher activation/sending SMS.

Applicants shall be able to opt in to SMS through first-login popup and My Profile preference management. SMS reminders shall only be scheduled and sent to opted-in and verified users where contract-level and permission-level reminder eligibility conditions are satisfied.

Notice IQ shall support SMS templates for Apply IQ contracts. Communication history and reporting shall provide visibility of SMS activity alongside existing email functionality.

* * *

# **6\. Detailed Functional Requirements**

* * *

## **6.1 Contract-Level SMS Configuration**

FR ID

Requirement Description

FR-001

System shall display SMS charge responsibility options only when SMS Reminder toggle is enabled at contract level.

FR-002

System shall provide two SMS charge responsibility options: **Charge Council** and **Charge Applicant**.

FR-003

System shall prevent saving the configuration when neither **Charge Council** nor **Charge Applicant** is selected.

FR-004

System shall display validation message **“Please select who will be charged for SMS reminders.”** when no charge responsibility option is selected.

FR-005

When **Charge Council** is selected and saved, system shall treat all reminder SMS cost as council-borne.

FR-006

When **Charge Council** is selected, applicant-facing SMS charge configuration fields shall not be displayed.

FR-007

When **Charge Applicant** is selected, system shall display contract-level charge fields for **Reminder SMS charge amount** and **Voucher activation/sending SMS charge amount**.

FR-008

System shall provide a **Same Amount** option when **Charge Applicant** is selected.

FR-009

When **Same Amount** option is enabled, editing one SMS amount field shall automatically update the other field.

FR-010

When **Same Amount** option is enabled, system shall prevent mismatch between reminder and voucher SMS charge values.

FR-011

SMS charge fields shall display the currency symbol configured in MNPS contract settings.

FR-012

When contract currency setting is updated in MNPS, the latest currency symbol shall be reflected automatically when configuration is reopened.

FR-013

When SMS Reminder toggle is disabled, SMS charge responsibility options and related configuration fields shall not be visible.

FR-014

When user switches from **Charge Applicant** to **Charge Council**, applicant charge fields shall be hidden and previously entered values shall be retained but treated as inactive.

FR-015

When user switches from **Charge Council** to **Charge Applicant**, charge fields shall be displayed and shall either show last saved values or remain empty where no saved values exist.

* * *

## **6.2 Contract-Level SMS Charge Validation**

FR ID

Requirement Description

FR-016

System shall accept SMS charge values less than or equal to 10,000.

FR-017

System shall reject SMS charge values greater than 10,000 and display **“Amount cannot exceed 10,000.”**

FR-018

System shall reject SMS charge values that are 0 or negative and display **“Amount must be greater than 0.”**

FR-019

System shall reject non-numeric values and display **“Please enter a valid numeric amount.”**

FR-020

Where decimal precision is supported, system shall accept decimal values up to system-defined precision.

FR-021

Where invalid precision is entered, system shall display **“Only valid currency amounts are allowed.”** or **“Enter a valid currency amount.”** based on the context of the field.

* * *

## **6.3 Permission Builder and Visitor Portal SMS Configuration**

FR ID

Requirement Description

FR-022

System shall display SMS Reminder option in **Permission Builder → Renewals and Reminder** only when contract-level SMS Reminder is enabled and charge responsibility is configured.

FR-023

SMS Reminder option in Permission Builder shall behave consistently with existing EMS reminder configuration, except for SMS-specific charge settings.

FR-024

When contract-level SMS Reminder is disabled, SMS Reminder option shall not be shown in Permission Builder.

FR-025

When contract is configured as **Charge Applicant**, Permission Builder shall display configuration option to charge for SMS Reminder.

FR-026

When contract is configured as **Charge Council**, Permission Builder shall display SMS reminder setup but shall not display applicant charge configuration.

FR-027

Permission Builder SMS charge availability shall dynamically follow the latest contract-level charge responsibility selection.

FR-028

For permissions in **Visitor** category, system shall display **Voucher activation/sending SMS charge amount** in Visitor Portal Settings only when contract is configured as **Charge Applicant**.

FR-029

For **Visitor** category permissions, system shall not display voucher activation/sending charge fields when contract is configured as **Charge Council**.

FR-030

When permission category changes from **Non-Visitor** to **Visitor**, visitor-specific SMS charge fields shall appear.

FR-031

When permission category changes from **Visitor** to **Non-Visitor**, visitor-specific SMS charge fields shall be hidden.

FR-032

When contract charge responsibility changes from **Charge Applicant** to **Charge Council**, SMS charge fields in Permission Builder and Visitor Portal Settings shall be hidden and existing values retained.

FR-033

When contract charge responsibility changes from **Charge Council** to **Charge Applicant**, SMS charge fields shall reappear and previously saved values shall be restored where available.

* * *

## **6.4 Permission-Level SMS Charge Validation**

FR ID

Requirement Description

FR-034

When **Charge Applicant** is selected and SMS charge option is enabled at permission level, SMS charge field shall be mandatory.

FR-035

System shall prevent saving permission-level SMS charge configuration when charge value is blank and display **“SMS charge is required.”**

FR-036

System shall reject non-numeric values in permission-level SMS charge fields and display **“Please enter a valid numeric amount.”**

FR-037

System shall reject values that are 0 or negative and display **“Amount must be greater than 0.”**

FR-038

System shall reject values greater than 10,000 and display **“Amount cannot exceed 10,000.”**

FR-039

System shall accept decimal amounts within allowed precision.

FR-040

System shall display **“Enter a valid currency amount.”** when invalid decimal precision is entered.

* * *

## **6.5 SMS Template Management in Notice IQ**

FR ID

Requirement Description

FR-041

System shall display **\+ Design Template** button to Super Admin / Contract Admin in Notice IQ template list screen.

FR-042

When **\+ Design Template** is invoked, system shall require the user to select **Organization** and **Contract**.

FR-043

When an Apply IQ contract is selected, system shall enable mandatory fields: **Permission Type**, **Template Type**, **Template Name**, and **Notification Template (Linked Events)**.

FR-044

**Permission Type** dropdown shall display all permission types created for the selected contract.

FR-045

**Template Type** shall default to **E-mail** and shall also provide **SMS** as an available option.

FR-046

When **Template Type = SMS**, system shall not display **Sender Email** field.

FR-047

When **Template Type = SMS**, system shall not display **E-mail Subject** field.

FR-048

System shall support entering or pasting SMS content in the text editor.

FR-049

Text editor shall support formatting actions including bold, italic, underline, font size/style, alignment, lists, and hyperlinks.

FR-050

Text editor shall support cut, copy, paste, undo, and redo while maintaining formatting.

FR-051

Save, Cancel, and toaster message behavior shall follow the existing MNPS template flow.

FR-052

When a template name already exists for the same permission type, system shall display **“Template name already exist”**.

FR-053

When the template creation fails due to technical or network issue, system shall display **“Something went wrong Please try again”**.

FR-054

On successful template creation, system shall capture event **Template Created** in Apply with template type, template name, date/time, user role, and user name.

* * *

## **6.6 Purchase and Checkout – Reminder SMS Charge Application**

FR ID

Requirement Description

FR-055

When contract is configured as **Charge Council**, applicant checkout shall not display any SMS reminder charge even when SMS reminders are enabled for the selected permission and applicant is opted in.

FR-056

When contract is configured as **Charge Applicant** and a permission-level reminder SMS charge is configured, checkout shall display the permission-level SMS charge in the purchase summary.

FR-057

When both contract-level and permission-level reminder charges exist, permission-level charge shall override contract-level charge.

FR-058

When permission-level reminder charge is not configured, system shall apply contract-level reminder charge.

FR-059

When applicant has not opted in for SMS reminders, system shall not apply SMS reminder charge and shall not schedule reminder SMS.

FR-060

When permission-level SMS Reminder is disabled, system shall not apply SMS reminder charge and shall not schedule reminder SMS.

FR-061

When contract-level SMS Reminder is disabled, system shall not apply any SMS reminder charge.

FR-062

Where SMS reminder charge is applicable, purchase summary shall display the SMS charge only once.

FR-063

Checkout shall not display both contract-level and permission-level SMS reminder charges together.

FR-064

SMS reminder charge in purchase summary shall use currency symbol from MNPS contract settings.

FR-065

If purchase is not completed successfully, system shall not finalize SMS reminder charge and shall not schedule reminders.

FR-066

If applicant changes SMS opt-in preference before completing purchase, system shall use the latest saved preference when recalculating summary and charge.

FR-067

If contract configuration changes from **Charge Applicant** to **Charge Council**, future purchases shall not display SMS reminder charges to applicant.

FR-068

If permission-level SMS charge is removed, system shall fall back to contract-level charge for future purchases where applicable.

* * *

## **6.7 Applicant SMS Opt-In and Verification**

FR ID

Requirement Description

FR-069

On applicant first login, system shall display popup **“Would you like to opt in for SMS notifications?”** only when contract-level SMS Reminder is enabled.

FR-070

First-login popup shall provide **Yes** and **No** options.

FR-071

When applicant selects **Yes**, system shall record applicant as opted in and proceed to verification step where required.

FR-072

When applicant selects **No**, system shall record applicant as opted out and no SMS notifications shall be triggered.

FR-073

When contract-level SMS Reminder is disabled, first-login SMS opt-in popup shall not be displayed.

FR-074

System shall provide **SMS Notifications** toggle in **My Profile** when SMS Reminder is enabled for the contract.

FR-075

When applicant enables SMS Notifications toggle, system shall mark the applicant as opted in and trigger verification where required.

FR-076

When applicant disables SMS Notifications toggle, system shall mark the applicant as opted out and stop all future SMS notifications.

FR-077

System shall always respect the applicant’s latest saved SMS preference.

FR-078

Where SMS verification is required, system shall send a verification code to the registered mobile number.

FR-079

When applicant enters the correct verification code, system shall confirm SMS opt-in and activate SMS notifications.

FR-080

When incorrect verification code is entered, system shall display **“Invalid verification code. Please try again.”** and shall not activate SMS notifications.

FR-081

When verification code expires, system shall display **“Code expired. Please resend.”**

FR-082

When mobile number is missing or invalid, system shall prevent SMS opt-in and display **“Please provide a valid mobile number to enable SMS notifications.”**

FR-083

SMS notifications shall be sent only to opted-in and verified users where verification is applicable.

FR-084

System shall maintain audit/log records for SMS opt-in status changes within the existing audit framework where supported.

* * *

## **6.8 Voucher Activation Communication Preference and SMS Charging**

FR ID

Requirement Description

FR-085

During voucher activation confirmation, system shall display communication preference message based on configured communication channels.

FR-086

When only Email is enabled, system shall ask whether user wants communication through email and provide **Yes** / **No** options.

FR-087

When only SMS is enabled, system shall ask whether user wants communication through SMS and provide **Yes** / **No** options.

FR-088

When both Email and SMS are enabled, system shall provide optional communication choice between **Email** and **SMS**, with no default selection.

FR-089

If communication popup is closed without selection, voucher activation shall still complete successfully and no communication shall be triggered.

FR-090

When **Email** is chosen during activation, system shall send template **“Visitor voucher activation (Applicant)”** via email.

FR-091

When **SMS** is chosen during activation, system shall send template **“Visitor voucher activation (Applicant)”** to applicant’s registered mobile number.

FR-092

When contract is configured as **Charge Council** and SMS is selected for activation, no charge shall be shown and payment flow shall not be triggered.

FR-093

When contract is configured as **Charge Applicant** and SMS is selected for activation, system shall calculate SMS charge using permission-level visitor SMS charge where configured, otherwise contract-level voucher SMS charge.

FR-094

For voucher activation, permission-level SMS charge shall override contract-level SMS charge.

FR-095

When payment is required for voucher activation SMS, system shall allow payment by saved card or new card.

FR-096

When saved-card / new-card payment functionality is disabled in permission builder, SMS option for voucher activation shall be blocked or hidden.

FR-097

On successful payment, full SMS charge shall be deducted immediately, recorded in BO payment history, and SMS shall be sent to the registered mobile number.

FR-098

On successful payment and SMS send, system shall display toaster **“Payment success. \[Voucher Duration\] sent successfully. You can revoke the voucher if it was sent to the wrong mobile number.”**

FR-099

On payment failure, SMS shall not be sent, no charge shall be recorded, and user shall be allowed to retry.

FR-100

On payment failure, system shall display **“Payment could not be completed. Your voucher was not sent via SMS. Please retry or use a different payment method.”**

* * *

## **6.9 Send Voucher via SMS**

FR ID

Requirement Description

FR-101

When **Send Voucher** toggle is enabled for the permission and SMS is enabled at contract level, system shall display SMS option in CP / BO Send Voucher flow where eligible.

FR-102

When SMS is disabled at contract level, system shall not display SMS option in Send Voucher flow.

FR-103

When user selects **Send via SMS**, system shall validate whether applicant has opted in for SMS.

FR-104

If applicant has not opted in, system shall display **“SMS notifications are not enabled for this account. Please enable SMS in your profile to send vouchers via SMS.”** and shall prevent sending until opt-in is completed.

FR-105

If applicant is opted in and SMS is selected, system shall allow entry of **Mobile Number** and **Confirm Mobile Number**.

FR-106

Mobile Number and Confirm Mobile Number fields shall accept only numeric input up to 15 digits.

FR-107

When entered mobile numbers do not match, system shall display **“Mobile number does not match”**.

FR-108

When SMS is selected and contract is configured as **Charge Applicant**, system shall display SMS charge before confirmation.

FR-109

For Send Voucher SMS, system shall use permission-level visitor SMS charge where configured, otherwise contract-level voucher SMS charge.

FR-110

For Send Voucher SMS, permission-level charge shall override contract-level charge.

FR-111

When contract is configured as **Charge Council**, no SMS charge shall be displayed and payment flow shall not be triggered.

FR-112

One SMS charge shall apply per voucher sent by SMS.

FR-113

When multiple voucher quantity is selected, total SMS charge shall equal **per SMS charge × quantity**.

FR-114

When SMS is chargeable to applicant, system shall display payment screen before sending voucher.

FR-115

Payment screen shall show **Per SMS charge** and **Total charge**.

FR-116

Payment screen shall support payment by saved card and new card where enabled.

FR-117

On successful payment, full SMS charge shall be deducted immediately, recorded in BO payment history, and SMS shall be sent to the entered mobile number.

FR-118

On successful Send Voucher SMS, system shall display toaster **“\[Voucher Duration\] sent successfully. You can revoke the voucher if it was sent to the wrong mobile number.”**

FR-119

On payment failure, SMS shall not be sent, no charge shall be recorded, and retry shall be allowed.

FR-120

When user switches from SMS to Email before submission, payment flow shall not be triggered and no SMS charge shall be applied.

FR-121

If mobile number is missing or invalid, system shall block sending and show **“This field is required”** or appropriate field validation.

FR-122

When contract is configured as council charge, payment screen shall not be shown and SMS shall follow existing send flow.

FR-123

Where multiple SMS sends are triggered and partial failures occur, system shall charge only for successful sends.

FR-124

When voucher sent by SMS is revoked, voucher shall return to available pool as per existing flow and SMS charge shall not be refunded.

* * *

## **6.10 Reminder SMS Scheduling and Delivery**

FR ID

Requirement Description

FR-125

System shall schedule SMS reminders only when contract-level SMS Reminder is enabled, permission-level SMS Reminder is enabled, and applicant has opted in for SMS reminders.

FR-126

SMS reminder shall be scheduled only after successful permission purchase.

FR-127

SMS reminder shall use the configured SMS template for the relevant contract and permission type.

FR-128

Expiration reminder SMS shall use notification template **“Expiration Reminder”** where configured.

FR-129

SMS reminder shall be sent to the registered mobile number saved in CP / BO Applicant profile.

FR-130

When permission-level SMS Reminder is disabled, system shall neither apply reminder charge nor schedule/send reminder SMS.

FR-131

If applicant opts out before a future reminder is sent, system shall stop all future reminder SMS from the opt-out point onward.

FR-132

System shall not trigger SMS at scheduled reminder time if applicant has opted out before trigger time.

FR-133

Previously paid reminder SMS charge shall not force future reminders to continue after applicant opts out.

FR-134

System shall always use the applicant’s latest SMS preference when evaluating reminder eligibility.

FR-135

When both Email communication and SMS Reminder are enabled at contract level, email communication shall continue to be triggered by default irrespective of SMS opt-in.

* * *

## **6.11 SMS Reporting – Applicant Level**

FR ID

Requirement Description

FR-136

System shall provide SMS report under **Reports → Financial → SMS** for Super Admin / Contract Admin / BO Manager / BO User.

FR-137

Report filters shall include **Date Range**, **SMS Send On**, and **SMS Type**.

FR-138

Filters shall support multi-select, **All** option, and contains-based search.

FR-139

Where a filter is not selected, system shall include all values for that filter.

FR-140

Report output shall aggregate SMS data at applicant level.

FR-141

Summary view shall display **First Name**, **Last Name**, **Email Address**, **Mobile Number**, **Total SMS Send**, and **Total Cost**.

FR-142

When contract is configured as **Charge Council**, **Total Cost** shall not show applicant-paid value.

FR-143

Applicant-level report shall group multiple SMS transactions by applicant.

FR-144

Clicking **Total SMS Send** shall open drill-down view of SMS transaction details.

FR-145

Drill-down view shall display one row per SMS sent.

FR-146

Drill-down shall show **Application Reference Number**, **First Name**, **Last Name**, **Email Address**, **SMS Cost**, **SMS Send Date**, **Mobile Number**, and **SMS Type**.

FR-147

Drill-down data shall respect selected filter context.

FR-148

Report export shall support standard Power BI export options in line with MNPS reporting standards.

* * *

## **6.12 SMS Reporting – Organization Level (Notice IQ / PBI)**

FR ID

Requirement Description

FR-149

Super Admin users in Notice IQ shall see a new **Reports** menu before contract selection.

FR-150

Reports menu shall display report **“SMS (Organization)”**.

FR-151

SMS (Organization) report shall display only **Apply** contract types; PCN, FPN, and AIRA contract types shall not be shown.

FR-152

Organization report shall provide filters: **Organization**, **Contract**, **Permission Type**, **SMS Type**, and **Date Range**.

FR-153

All organization report filters shall support multi-select, **All** option, contains-based search, and include all values when left unselected.

FR-154

Contract filter shall cascade from selected Organization.

FR-155

Permission Type filter shall cascade from selected Contract.

FR-156

Report shall aggregate SMS data at **Organization + Contract** level.

FR-157

Summary view shall display **Organization Name**, **Contract Name**, **Total SMS Send**, and **Total SMS Cost**.

FR-158

When contract is configured as **Charge Council**, total SMS cost shall not show applicant-paid fee value.

FR-159

When no data exists for selected filters, report shall display **“No data available”**.

FR-160

Clicking **Total SMS Send** shall open drill-through view.

FR-161

Drill-through shall display one row per SMS record without aggregation.

FR-162

Drill-through shall show **Organization Name**, **Contract Name**, **Permission Type**, **Application Reference Number**, **First Name**, **Last Name**, **Email Address**, **Mobile Number**, **SMS Type**, **SMS Send Date**, and **SMS Cost**.

FR-163

Drill-through shall retain summary filter context and shall not display unrelated data.

FR-164

Power BI report shall be made available in the Permit Reports module immediately upon publish/update and shall not be part of the application deployment pipeline.

* * *

## **6.13 Communication Tab and SMS Communication History**

FR ID

Requirement Description

FR-165

Existing **Email** tab in application details shall be renamed to **Communication** tab.

FR-166

Communication tab shall display both email communication details and SMS communication details.

FR-167

SMS communication details shall be shown only when SMS Reminder is enabled.

FR-168

SMS entries shall be displayed in a list/timeline format similar to the existing email UI.

FR-169

Each SMS shall be displayed as a separate card or row.

FR-170

Each SMS entry shall display direction indicator, mobile number, template name or SMS content preview, date/time, and status.

FR-171

Direction indicator shall display **Sent** for Reminder / Activation / Send Voucher SMS and **Received** where applicable for Bulk SMS received by applicant.

FR-172

System shall identify SMS type using label, badge, or equivalent indicator for Reminder SMS, Activation SMS, Send Voucher SMS, and Bulk SMS.

FR-173

Reminder SMS entry shall display registered mobile number, template name, status, and date/time.

FR-174

Activation SMS entry shall display registered mobile number, template **Visitor voucher activation (Applicant)**, status, and date/time.

FR-175

Send Voucher SMS entry shall display entered mobile number, template name, voucher reference or duration, status, and date/time.

FR-176

Bulk SMS communication shall create an entry for each recipient.

FR-177

System shall display SMS status indicators for **Sent** and **Failed**.

FR-178

Failed SMS entries shall remain visible in communication history and may show failure reason where available.

FR-179

SMS communication entries shall be displayed in descending chronological order (latest first).

FR-180

When no SMS records exist, Communication tab shall show **“No SMS communication available”**.

* * *

# **7\. Business Rules**

Rule ID

Rule Description

BR-01

SMS functionality shall be available only when contract-level SMS Reminder is enabled.

BR-02

Email remains the default communication channel unless SMS is explicitly selected or triggered by configuration.

BR-03

SMS reminders shall be sent only to opted-in users and verified users where verification is required.

BR-04

When **Charge Council** is selected, no SMS charge shall be shown to the applicant.

BR-05

When **Charge Applicant** is selected and permission-level charge exists, permission-level charge shall override contract-level charge.

BR-06

When **Charge Applicant** is selected and permission-level charge does not exist, contract-level charge shall apply.

BR-07

When applicant has not opted in, no SMS charge shall be applied and no reminder SMS shall be sent.

BR-08

When contract-level SMS Reminder is disabled, no SMS charge and no SMS reminder shall apply.

BR-09

Reminder SMS charge shall be shown only once in purchase summary.

BR-10

Voucher activation/sending SMS shall follow per-usage charging where applicant charge model is enabled.

BR-11

Each voucher sent by SMS shall be treated as a separate SMS for charging purposes.

BR-12

Partial fail scenarios shall charge only for successful SMS sends where technically supported.

BR-13

Revoking a voucher sent by SMS shall not refund the SMS charge.

BR-14

Existing applicant reminder charge paid at purchase shall not override future opt-out decisions.

BR-15

Latest saved applicant SMS preference shall always take precedence over earlier selections.

* * *

# **8\. Validation Rules**

Validation ID

Rule Description

VR-001

User must select SMS charge responsibility when contract-level SMS Reminder is enabled.

VR-002

SMS charge responsibility and pricing fields shall not be visible when SMS Reminder toggle is disabled.

VR-003

SMS charge amount shall be mandatory when applicant charging is enabled and related SMS charge option is selected.

VR-004

SMS charge value must be numeric.

VR-005

SMS charge value must be greater than 0.

VR-006

SMS charge value must not exceed 10,000.

VR-007

SMS charge amount shall support valid currency precision only.

VR-008

When **Same Amount** option is enabled, reminder and voucher SMS charge fields must remain synchronized.

VR-009

For Send Voucher SMS, Mobile Number and Confirm Mobile Number must match.

VR-010

Mobile Number fields shall accept numeric input only and be limited to 15 digits.

VR-011

SMS send or reminder scheduling shall not proceed where applicant is not opted in.

VR-012

SMS opt-in shall not be activated where registered mobile number is missing or invalid.

VR-013

SMS option shall be blocked or hidden where payment method required for applicant-paid flow is not enabled.

* * *

# **9\. Assumptions**

ID

Description

A-01

Contract currency is maintained in MNPS and available to Apply IQ for display.

A-02

Existing email-based reminder and communication flows can be extended for SMS where referenced.

A-03

Saved card / new card payment functionality already exists and can be reused where SMS is applicant-paid.

A-04

SMS history can be logged within existing communication/audit framework.

A-05

Notification templates can be mapped by contract and permission type for SMS use.

* * *

# **10\. Constraints**

ID

Description

C-01

Applicant-paid SMS flows are dependent on payment functionality being enabled for the relevant permission / contract flow.

C-02

SMS functionality is dependent on contract-level enablement and applicable permission-level configuration.

C-03

Organization-level and applicant-level SMS reports are implemented through Power BI behavior and available data structures.

C-04

Final SMS provider integration details are outside this FRD.

C-05

Verification mechanism details are pending confirmation and may affect final SMS opt-in implementation.

* * *

# **11\. Open Points**

ID

Description

OP-01

SMS verification mechanism (OTP/code send, expiry, resend, validation logic) to be confirmed with Savit.

OP-02

Final behavior when applicant closes first-login SMS opt-in popup without selecting Yes/No to be confirmed: treat as opt-out or re-prompt on next login.

OP-03

Final reuse/availability of bulk SMS received-direction behavior in Communication tab to be confirmed.

OP-04

Technical feasibility of charging only successful records in partial multi-send SMS failures to be confirmed.

OP-05

Final field naming and exact Power BI drill-through layout to be confirmed during report design.

## **12\. Approval**

Name

Role

Signature

Date

Joanne Archer

Product Owner

—

—

Prathiba K

Business Analyst

—

—