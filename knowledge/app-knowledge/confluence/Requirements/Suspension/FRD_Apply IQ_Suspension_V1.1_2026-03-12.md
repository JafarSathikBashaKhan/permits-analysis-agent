# FRD_Apply IQ_Suspension_V1.1_2026-03-12

> **Confluence ID:** 1772224523 · **Version:** 17 · **Last updated:** 2026-04-02T05:52:55.690Z
> **Path:** Requirements / Suspension
> **URL:** https://marston.atlassian.net/wiki/spaces/FF/pages/1772224523/FRD_Apply+IQ_Suspension_V1.1_2026-03-12

---

# FUNCTIONAL REQUIREMENT DOCUMENT (FRD) – Suspension Permission

## 1\. Document Control

Version

Date

Author

Description

1.0

2026-03-12

Initial FRD created from BRD v1.1

* * *

## 2\. Project Overview

This FRD describes the functional requirements for the **Suspension Permission** feature within the Apply permits system.

The feature enables councils to temporarily reserve on-street parking bays (or areas) and prohibit normal parking for works, domestic moves, events and similar activities. It supports day/week-based suspensions, configurable pricing per bay, non‑zonal address-based selection, multi‑bay selection on a street, and integration to enforcement (NPS PCN) and Illumin8.

The initial implementation is for **Southend**, with some configuration options not required for this contract (e.g. map integration, P2 pricing, short notice, extend suspension).

* * *

## 3\. Purpose

The purpose of this FRD is to define the detailed functional, data, integration, and UI/UX requirements for implementing the Suspension Permission in Apply, ensuring that:

-   Back Office users can configure a Suspension permission in Permission Builder and Pricing Builder.
    
-   Customers (where enabled) and Back Office can create and manage suspension applications.
    
-   CEO tasks are created and synchronised with NPS PCN and CEO handhelds.
    
-   Illumin8 receives suspension details for enforcement/visibility.
    
-   Contract-specific behaviour (e.g. Southend) can be controlled via configuration.
    

* * *

## 4\. Scope

### 4.1 In Scope

-   **Suspension Permission configuration in Builder**
    
    -   New category: **Suspension**
        
    -   Physical permit mode only
        
    -   Start date policy defaults and include-time behaviour
        
    -   Multiple bay selection enablement
        
    -   Comment - option to enable or disable, select or unselect
        
-   **Pricing configuration**
    
    -   Pricing rules at permission level:
        
        -   **P1 – Standard Pricing** (per bay, Hour/Day/Week/Month)
            
        -   **P2 – Minimum + Incremental Pricing** (defined but not used for Southend)
            
        -   **P3 – Fixed Pricing for Bay (Fixed Duration / Fixed Price)**
            
    -   Different Bay Price toggle (P1, P2)
        
    -   Minimum / Maximum suspension duration and minimum charge
        
    -   Admin fee, VAT, short notice fee (where configured)
        
-   **Contract Settings – Suspension**
    
    -   Street selection toggle:
        
        -   Use System Streets (dropdown)
            
        -   Free text if disabled
            
    -   Map toggle and Town field toggle (defined but not required for Southend)
        
-   **Customer Portal / BO Application Flow**
    
    -   Non-zonal address-based suspension
        
    -   Address tab with search and manual entry
        
    -   Suspension Details, Document Tab (where configured), and VRM capture
        
    -   Application lifecycle statuses in CP and BO, including extend/cancel (extend not used for Southend)
        
-   **Validation rules**
    
    -   Minimum / maximum duration
        
    -   Minimum fee logic
        
    -   Short notice logic (not applicable for Southend)
        
    -   Permission limit for non-zonal permissions
        
-   **Bay selection**
    
    -   Contract-specific bay types
        
    -   Multi-bay selection per street
        
    -   Number of bay spaces logic
        
-   **Pricing calculation**
    
    -   Per bay / per duration logic for P1 and P2
        
    -   Fixed duration and fixed price behaviour for P3
        
    -   Additional fees (short notice, admin fee, VAT)
        
-   **Back Office views**
    
    -   Overview, Suspension Details, Pricing & Payment, Vehicle tab, Payment History tab
        
    -   CEO tab for task history, evidence
        
-   **CEO Task Management & NPS PCN Integration**
    
    -   Apply ↔ NPS PCN integration for suspension tasks
        
    -   Contract toggles in Apply and PCN
        
    -   Suspension tab in PCN with assignment configuration
        
    -   Task creation popup, status sync, evidence handling, notifications, access and error handling
        
-   **Illumin8 Integration**
    
    -   Sending suspension details: type, name, reference, dates, VRMs
        
-   **Reporting and merge fields**
    
    -   Static Suspension report
        
    -   Merge fields for suspension templates
        

### 4.2 Out of Scope

-   Blue Badge discount
    
-   Pensioner discount
    
-   Renewal
    
-   Extension of suspension for **Southend** (feature defined but not used)
    
-   P3 pricing rule usage for Southend (configured but not used)
    
-   Map-based bay selection for Southend
    
-   Town field display for Southend
    
-   Customer Portal purchase for Southend (initially BO-only)
    

* * *

## 5\. Stakeholders

Name

Role

Department

Contact Info

Joanne Archer

Product Owner – Apply

Product / Permits

\[TBC\]

Prathiba

Business Analyst

Product / Permits

\[TBC\]

* * *

## 6\. Functional Requirements

### 6.1 Permission Builder – Suspension Category

Req ID

Requirement Description

Priority

Acceptance Criteria

FR-001

The system shall provide a **Suspension** category in Permission Builder.

High

When category = Suspension, all suspension-related configuration sections (suspension settings, pricing, bay settings) are displayed.

FR-002

When category = Suspension, **Start Date Policy** shall default to “Forward to Set Date” and **Include Time** shall be enabled by default.

High

On creating a new Suspension permission, Start Date Policy shows “Forward to Set Date” and Include Time checkbox is ticked.

FR-003

When category = Suspension, **Permit Mode** shall default to **Physical**, and **Permit Days** selection field shall be hidden.

High

New Suspension permission pre-fills Permit Mode = Physical, hides Permit Days; user can adjust if config allows.

FR-004

The system shall provide a configuration option **Enable Multiple Bay** to allow multiple bay selection in a single application for a single street.

High

When toggle is ON, user can add more than one bay type for the same street in the application; when OFF, only one bay type per street permitted.

FR-005

The system shall provide a configuration option **Enable Comment Box** to allow adding an optional Comment field to the Suspension application form.

Medium

When toggle is ON, a Comment field is displayed on the Suspension application form (CP and BO) as an optional free‑text field; when OFF, the Comment field is not shown on the form.

### 6.2 Suspension Settings

Req ID

Requirement Description

Priority

Acceptance Criteria

FR-006

The system shall provide a **Short Notice** toggle in Suspension Settings (not used for Southend).

Medium

If Short Notice = ON, Short Notice lead time and Short Notice fee fields are mandatory and accept values 0–1000; if OFF, fields are hidden/ignored.

FR-007

The system shall validate that if Short Notice is enabled, both **lead time** and **fee** values are provided.

Medium

Attempt to save config with Short Notice ON but missing values shows validation error.

FR-008

The system shall provide an **Extend Suspension** configuration option (not used for Southend) that, when enabled, shows an Extend Suspension button for Active applications.

Medium

For permissions with Extend enabled, Active applications in CP and BO show Extend Suspension as primary action.

FR-009

When Extend Suspension is disabled in Builder, the Extend action shall not appear, and Cancel becomes primary action in CP.

High

For Suspension permissions with Extend disabled, Active status only shows Cancel (and Receipt, View T&C under secondary).

### 6.3 Pricing Configuration – General

Req ID

Requirement Description

Priority

Acceptance Criteria

FR-010

Pricing configuration shall adapt when the permission category is Suspension, and all suspension pricing shall be configured in the Pricing section.

High

When creating pricing for a Suspension permission, UI shows P1/P2/P3 options and related fields.

FR-011

Pricing rules shall be **permission-specific**, allowing each Suspension permission to have independent pricing configuration support three pricing rules.

High

Creating pricing for one Suspension permission does not affect pricing of another.

### 6.4 Pricing Rule P1 – Standard Pricing

Req ID

Requirement Description

Priority

Acceptance Criteria

FR-012

Under P1, the system shall allow admin to select one or more of the period types: **Hour, Day, Week, Month**, each only once.

High

Admin can add each period type at most once; trying to add duplicate type is blocked.

FR-013

For each selected period type, the system shall allow configuration of a price per bay (with optional **Different Bay Price** toggle).

High

For a selected period (e.g. Day), if Different Bay Price = ON, per-bay-type prices are configurable; if OFF, one common price is set.

FR-014

During application, the total price under P1 shall be calculated as: **Price per period per bay × Number of bay spaces × Number of periods (duration)**.

High

Example: price £5/day/bay, 2 bay spaces, 3 days → system calculates £30.

### 6.5 Pricing Rule P2 – Minimum + Incremental (Defined, not required for Southend)

Req ID

Requirement Description

Priority

Acceptance Criteria

FR-015

For P2, the system shall allow configuration for each period type (Hour/Day/Week/Month) of: Minimum Suspension, Maximum Suspension, Minimum Suspension Charge.

Medium

UI shows optional fields Min Suspension, Max Suspension, Min Charge per period type; values stored and used in pricing.

FR-016

Under P2, the system shall apply the **Minimum Suspension Charge** for the minimum duration, and charge additional duration incrementally per bay.

Medium

Example: min 2 days, min charge £15, incremental £5/day/bay, 2 bays for 5 days → system charges £45 as per worked example.

FR-017

P2 shall offer the same “Different Bay Price” behaviour as P1.

Medium

Toggling Different Bay Price under P2 allows per-bay-type pricing same as P1.

FR-018

P2 pricing rule shall be configurable but **not used** for Southend contract.

Low

Southend configuration will not select P2 for live usage.

### 6.6 Pricing Rule P3 – Standard Pricing for Bay

Req ID

Requirement Description

Priority

Acceptance Criteria

FR-019

When **Standard Pricing for Bay** toggle is **enabled**, the system shall support **Fixed Duration Pricing**, allowing configuration of predefined durations (Hour/Day/Week/Month) with fixed prices (same across bay types).

High

Admin can define e.g. 10 Days = £20, 20 Days = £40; application UI shows these as selectable options, with no “number of days” input.

FR-020

Under P3 Fixed Duration, the total price per bay type shall be the configured fixed price for the chosen duration, irrespective of number of bay spaces.

High

Example from doc: Resident Bay 10 Days (5 spaces) → £20; Disabled Bay 10 Days (5 spaces) → £20; total £40.

FR-021

When the Standard Pricing for Bay toggle is **disabled**, the system shall support **Fixed Price**: user chooses start and end date/time and a single fixed price applies regardless of duration or number of bays/bay spaces.

High

For a suspension under Fixed Price, changing duration or bay spaces does not change the price; only one configured fixed price is applied.

### 6.7 Contract Settings – Suspension

Req ID

Requirement Description

Priority

Acceptance Criteria

FR-022

Contract Settings shall include a **Suspension** section.

High

For contracts, a Suspension section is visible showing suspension-related toggles.

FR-023

Within Suspension, a **Street Selection** setting shall exist with two mutually exclusive options: **Use System Streets** (dropdown) or free-text address entry.

High

Only one of Use System Streets or free text can be active; if Use System Streets is disabled, CP/BO show free text street field.

FR-024

A **Use Map Integration** toggle shall exist (not required for Southend) that, when enabled, hides street dropdown/free text and bay type dropdown, and shows map-based street/bay selection.

Medium

Enabling Map hides street/bay fields, shows interactive map; disabling Map restores standard fields.

FR - 25

Maximum Suspensions per Street

Medium

Limits how many overlapping suspension bookings can exist on the same street at the same time.

FR-026

A **Display Town Field** toggle shall exist (for other contracts such as East Sussex) that, when enabled, shows a mandatory Town field after street selection.

Medium

When Display Town = ON, user must enter Town; when OFF, Town is hidden.

FR-027

Contract setting in MNPS - toggle “PCN CEO Mapping“

Enable a toggle to show a mandatory PCN Contract dropdown, route Suspension tasks to CEOs of the selected contract. If disabled, hide dropdown and use default routing.

**Mapping OFF**: No PCN Contract dropdown; Suspension tasks follow existing routing.

**Mapping ON (Config)**: PCN Contract dropdown is visible and mandatory; save is blocked if not selected.

**Mapping ON (Runtime)**: New Suspension tasks are routed to CEOs linked to the selected PCN contract.

### 6.8 Application Flow – Customer Portal

#### 6.8.1 Address Tab

Req ID

Requirement Description

Priority

Acceptance Criteria

FR-028

Suspension shall be **non-zonal**; users can search and select an address via using Path integration.

High

Selecting an address auto-populates address fields.

FR-029

Users shall be able to manually enter an address without choosing from the search list.

High

If user bypasses dropdown and fills fields manually, submission is accepted.

#### 6.8.2 Document Tab

Req ID

Requirement Description

Priority

Acceptance Criteria

FR-030

Where configured via Form Builder, the application shall show a **Document Tab** and allow upload of supporting documents.

Medium

For permissions referencing form templates with document fields, CP shows Document Tab; uploaded docs stored and later visible in BO.

#### 6.8.3 Suspension Details

Mandatory fields in CP:

1.  Purchase Reason
    
2.  Street Name (dropdown or free text per contract settings)
    
3.  Bay Type (contract specific; multi-select)
    
4.  Bay Spaces (numeric)
    
5.  Start Date Time (forward to set date only)
    
6.  Duration Type (Day/Week – based on pricing config)
    
7.  Number of Days/Weeks (numeric)
    
8.  End Date Time (auto-calculated, with editable end time)
    
9.  VRM (optional, multiple if configured)
    

Req ID

Requirement Description

Priority

Acceptance Criteria

FR-031

The Suspension Details tab shall capture fields 1–9 as described above, with validation of mandatory fields.

High

Submitting with missing mandatory fields shows validation errors.

FR-032

End Date & Time shall be auto-calculated based on Start Date/Time, Duration Type and Number of days/weeks/months, and its time portion shall be editable by user.

High

Modifying duration updates End Date/Time; user can adjust time and system recalculates prices appropriately.

#### 6.8.4 Purchase Reason Logic

Req ID

Requirement Description

Priority

Acceptance Criteria

FR-033

For Southend, the system shall support the following Purchase Reasons: Building works, Domestic move, Events, Filming, Skip placement, Telecoms works, Utility works, Other (free text).

High

Dropdown shows exactly the configured reasons; selecting Other shows a free-text input.

FR-034

When Purchase Reason = **Skip placement**, License Number field shall be optional; for all other reasons, License Number is hidden.

Medium

Purchase Reason change hides/shows License Number per rule.

FR-035

When Purchase Reason = **Utility works**, the system shall show a mandatory yes/no question “Is this suspension required for street works or works requiring a highway permit/license?”.

High

Selecting Utility works immediately shows first question; user must answer Yes/No.

FR-036

If the first Utility Works question answer is **Yes**, show a second mandatory yes/no question “Has your street works permit been granted?”.

High

First question = Yes → second appears and requires an answer.

FR-037

If second Utility Works question answer is **Yes**, **Street Works Permit Number** becomes mandatory; if **No**, no extra fields are shown.

High

Submission requires Street Works Permit Number when both questions are Yes.

FR-038

Purchase reason options shall be contract-specific and configurable.

High

Administrators can configure reasons list per contract; Southend config reflects list above.

### 6.9 Validation Rules

Req ID

Requirement Description

Priority

Acceptance Criteria

FR-039

Builder shall allow configuration of **Minimum Suspension** duration by period (days/weeks/months); the application shall reject entries below the configured minimum.

High

If minimum = 2 days and user enters 1 day, system shows error and prevents submission.

FR-040

Builder shall allow configuration of **Maximum Suspension** duration; the application shall reject entries above the configured maximum.

High

If maximum = 2 days and user enters 3 days, system shows error and prevents submission.

FR-041

For pricing rules P1 and P2, the **Minimum Suspension Charge** shall be applied for the first X period units, and remaining duration charged at incremental rate.

Medium

Example from doc is reproduced exactly in system calculation.

FR-042

Validation rules 5.1–5.3 (minimum duration, maximum duration, minimum fee logic) shall **not apply** when pricing rule = P3.

High

Under P3, user can select any of the predefined durations or dates within normal bounds; min/max suspension logic is not enforced.

FR-043

If Short Notice is configured and Start Date is within or below short notice lead threshold, the Short Notice Fee shall be automatically added.

Medium

Changing start date to fall within short notice window increases price by configured fee. (Not used for Southend.)

FR-044

For non-zonal permissions, if a **permission limit** is configured, users shall only be able to purchase suspension within that limit.

High

Attempting to exceed configured limit surfaces clear validation error and blocks purchase.

FR -045

Enforce a per‑user limit on overlapping suspensions for the same street (Submitted/Active only), including during Extend Suspension

High

Attempting to exceed configured limit surfaces clear validation error and blocks purchase.

### 6.10 Duration Behavior

Req ID

Requirement Description

Priority

Acceptance Criteria

FR-046

If only one duration type (e.g. Day only) is configured in pricing, the application shall auto-select that type and show only the **Number of \[period\]** field.

High

User is not asked to choose between Day/Week if only Day is configured.

FR-047

If multiple duration types (e.g. Day and Week) are configured, user must select exactly one duration type; system shall show appropriate “Number of days/weeks/months” field and apply matching pricing/validation.

High

Selecting Day shows Number of days; selecting Week shows Number of weeks; only one can be selected.

FR-048

If user selects Day under P1, price is **Per Bay Per Day**; if user selects Week, price is **Per Bay Per Week**; system must calculate accordingly.

High

Day: DayPrice × BaySpaces × Days; Week: WeekPrice × BaySpaces × Weeks.

### 6.11 Bay Selection

Req ID

Requirement Description

Priority

Acceptance Criteria

FR-049

The system shall support contract-specific bay type lists. For Southend, bay types include: Paid bay, Resident parking bay, Permit-only parking bay, Limited waiting bay, Loading bay, Electric vehicle charging bay, Disabled parking bay, Free parking bay.

High

Southend configuration shows exactly these options; other contracts can define different sets.

FR-050

User must enter **Number of Bay Spaces** for each selected bay type; this field is numeric and has no hard upper limit validation.

High

Field accepts any positive integer; 0 or negative values show validation error if required.

FR-051

When multiple bay types are enabled in builder, users may add multiple bay types under the **same street** within one application; each bay type is added as a separate entry, and the same bay type cannot be selected more than once per street.

High

Attempting to add same bay type again for same street is prevented with a message.

FR-052

When Map Integration is enabled (not for Southend), streets containing bays shall be highlighted on the map, and selection of bays shall auto-populate Street Name and Bay Type; Street/Bay dropdowns are hidden.

Medium

Selecting a bay on map fills Street and Bay Type; manual fields are hidden.

FR - 53

When Map Integration (TRO/TMI/GIS) is enabled, users must select streets and bays from the map, with system‑driven validation for bay availability, overlap, and configuration rules.

High

1.  **Given** Map Integration is enabled, **when** the user opens the suspension form, **then** the map is shown and only valid mapped streets/bays are selectable.
    
2.  **Given** a bay is selected, **then** Street Name and Bay Type are auto‑populated as read‑only, and the user must enter a valid number of bay spaces (>0).
    
3.  **Given** overlapping suspensions, limited bay availability, or configuration restrictions (multiple bay types), **then** the system must validate and either allow booking within limits or block with the appropriate error message.
    

### 6.12 Pricing Calculation

Req ID

Requirement Description

Priority

Acceptance Criteria

FR-054

Under P1, per bay type subtotal shall be: **BayPrice × Number of Bay Spaces × Duration (Number of hours/days/weeks/months)** based on the pricing configuration of the permission.

High

For each bay type, UI shows calculated subtotal; regression tests match expected values.

FR-055

Under P2, per bay type subtotal shall first apply **Minimum Suspension Charge** for minimum duration, then charge extra duration incrementally per bay.

Medium

Example scenarios in the document produce identical totals in system.

FR-056

The system shall add, per application, additional charges after bay subtotals: **Short Notice Fee (if applicable)**, **Admin Fee**, and **VAT** (if enabled).

High

Final price breakdown shows each fee as a separate line item.

FR-057

The system shall display: per-bay-type subtotals, each additional fee separately, and final total payable.

High

UI in CP and BO shows transparent fee breakdown.

### 6.13 Application Submitted – Back Office Views

Req ID

Requirement Description

Priority

Acceptance Criteria

FR-058

After submission, BO and CP “My Applications” Overview tab shall display: Applicant Details (name, reference, permission name/type, address), Suspension Details, Pricing & Payment, Vehicle Tab, CEO Tab (BO only), Payment History (BO only).

High

Inspecting a submitted suspension shows these sections.

FR-059

In Suspension Details, where multiple bay types exist, each bay type and its Bay Spaces shall be listed separately (e.g. “Paid Bay – 3 Bay Spaces; Resident Parking Bay – 2 Bay Spaces”).

High

Overview clearly lists items as described.

FR-060

BO can edit **Start Date & Time** only **before Active**.

**Duration stays fixed**; system recalculates **End = Start + Duration**.

**End Date & Time is never editable**.

On Start change, **Short Notice Fee** is re-evaluated and **added/removed** based on the new Start.

High

Editing Start (pre‑Active) keeps Duration the same and recalculates End.

End is always system-calculated; BO cannot edit End directly.

Start becomes read-only once status is Active.

Short Notice Fee is added/removed/adjusted in line with the new Start date/time and configured rules.

FR-061

Conditional purchase reason fields (License Number for Skip placement, Utility Works permit questions and number) shall be displayed only when applicable and populated.

Medium

When Purchase Reason != Skip Placement, License Number hidden; Utility Works fields shown only when questions answered Yes.

FR-062

Vehicle Tab shall allow BO users to Add, Edit, and Delete VRMs in any status where configuration allows.

Medium

Changes to VRMs persist and are reflected in integration messages (e.g. with Illumin8).

If PCN lookup is enable, then the button should be available

FR-063

Document Tab (if configured) shall show uploaded documents, with **Download** option and **Replace** option for expired documents.

Medium

Clicking document opens or downloads file; Replace flow uploads a new document.

FR - 064

When multiple streets and bay combinations are selected through the map, the **Overview tab** must continue to show the same fields as defined in **#249734**, but the **location display must be grouped by Street**, with **separate rows per unique Bay Type + Bay Spaces** combination and **no mixing across streets**.

1.  **Keep Overview fields same** as **#249734**.
    
2.  **Group locations by Street** when multiple streets are selected.
    
3.  **Show a Street header** for each group (at least **Street Name**).
    
4.  **Under each Street**, show **one row per unique Bay Type + Bay Spaces** selection.
    
5.  **No mixing across streets** — rows must appear only under their respective Street.
    

### 6.14 CEO Tab & Task Management

Req ID

Requirement Description

Priority

Acceptance Criteria

FR-065

CEO Tab (BO only) shall maintain a full audit trail of CEO task activities: task creation, cancellation, completion, evidence (PDF, photos, notes).

High

For a given suspension, CEO Tab lists each task with status and evidence links.

FR-066

BO status flows shall support transitions described in Section 11, including: Pending Approval → Being Reviewed → Approved → Waiting for Payment (based on the payment) → Print → Assign Task → Task Assigned → Task Completed → Active; plus, Expired and Cancelled flows.

High

Status changes follow allowed transitions only; any restricted transitions are blocked.

FR-067

From Active, BO/CP can **Cancel**, leading to Cancel Assign Task → Cancelled Task Assigned → Cancelled after CEO completes task.

High

Cancellation flow and associated actions behave as described.

FR-068

When application is in **Expired Assign Task**, Back Office users can click **Assign Task to CEO**, leading to **Expired Task Assigned** and then **Expired** after the CEO completes the task.

Medium

Expired flow behaves as described, with status transitions: **Expired Assign Task → Expired Task Assigned → Expired** on CEO task completion.

### 6.15 CEO Task Integration – Apply ↔ NPS PCN

Req ID

Requirement Description

Priority

Acceptance Criteria

FR-069

Apply contract settings shall include toggle **Enable Suspension Integration with PCN**. If disabled, Assign Task to CEO action is not available.

High

With toggle OFF, Assign Task button is hidden/disabled; with ON, button appears.

FR-070

PCN contracts shall include **Enable Suspension Management** toggle. If enabled, a **Suspensions** tab appears for roles: BO Manager, CEO Manager, Super Admin, Simple Admin.

High

For these roles, Suspensions tab visible only when toggle is ON.

FR-071

Within PCN Suspensions tab, admins shall configure assignment type: **Assign to Specific Officer** or **Assign to Any Available Officer**.

High

Changing assignment type changes how tasks are distributed in PCN.

FR-072

When BO user in Apply clicks **Assign Task to CEO**, the system shall show a **Task Creation Popup** with pre-populated Title, Category=Suspension, Location, hidden CEO ID, and editable Comments.

High

Popup fields match the specification; CEO ID is never editable.

FR-073

Title shall be automatically derived from application status: Assign Task → “Put Up Suspension”; Expired Assign Task → “Take Down Suspension”; Cancel Assign Task (Active to Cancel) → “Take Down Suspension”.

High

Title text matches rules for each trigger status.

FR-074

On confirming Assign, Apply shall send a task creation request to PCN; PCN creates task and assigns it according to assignment configuration; Apply records task reference for sync.

High

New tasks appear in PCN with correct details (title, location, reference).

FR-075

Task status updates (Assigned, Completed, Cancelled) shall be sent from PCN back to Apply using application reference number, and reflected in the CEO Tab and application status.

High

Completing a PCN task updates Apply status to Task Completed / Active / Expired / Cancelled as specified.

FR-076

When a CEO cancels a task, Apply shall mark the task as **Task Cancelled**, revert application status to **Assign Task**, and notify BO Manager & user.

High

CEO cancellation triggers status rollback and notification.

FR-077

When BO cancels an assigned task, task status shall become Cancelled and application status updated to appropriate “Task Cancelled” state per system rules.

Medium

BO cancellations are reflected both in PCN and Apply.

FR-078

When application is in **Expired Assign Task** and Assign Task to CEO is clicked, status transitions to **Expired Task Assigned**, and on CEO completion status becomes **Expired**.

Medium

Flow behaves as described for expired tasks.

FR-079

When application is **cancelled from Active** and Assign Task is triggered, status becomes **Cancelled Task Assigned**; on CEO completion, status becomes **Cancelled**.

Medium

Cancel-related flows behave as per design.

FR-080

Cancel Action in Apply

when the task is assigned then have the cancel button to cancel the task in apply IQ BO

High

Cancel button is visible only when task status = **Task** **Assigned, Expired Task Assigned, cancelled Assign Task**.

Confirming cancellation updates status to **Cancelled** and removes task from active queues.

Cancellation action is recorded in CEO Tab audit log (user, timestamp, previous status = Assigned, new status = Cancelled).

FR-081

Suspension Task Actions in MNPS PCN Contract

Medium

When a **Suspension** task is **Assigned** in Apply IQ, the corresponding task must appear in the **MNPS PCN Contract** task screen, where the user can **Reassign** or **Cancel** the Suspension task.

FR - 082

`The CEO handheld device shall support` **\*\*Accept\*\*** `/` **\*\*Reject\*\*** `options for Suspension tasks, consistent with the existing C&R behaviour. When a Suspension task is` **\*\*accepted\*\*** `by one CEO, it shall be automatically removed from all other CEOs’ handheld devices to prevent duplicate or overlapping activity.`

Medium

`On receiving a Suspension task in multiple CEOs’ handhelds, any CEO can tap` **\*\*Accept\*\*** `or` **\*\*Reject\*\***`. If one CEO taps` **\*\*Accept\*\***`, the task remains only on that CEO’s device and is removed (or clearly marked as no longer available) from other CEOs’ handhelds. |`

FR-083

`Before assigning a Suspension task to a specific CEO, the system shall validate that the CEO is currently logged in to the handheld device (HHD). If the selected CEO is not logged in, ApplyIQ shall display a notification:` **\*\*"Selected Suspensions Officer is not logged in to the HHD."\*\*** `The system shall then automatically assign the task to all available HHDs, allowing any logged-in CEO to accept the task.`

High

`When a user attempts to assign a Suspension task to a CEO who is not logged in, the specified notification is shown and the task is broadcast to all HHDs for acceptance. If the CEO is logged in, the task is assigned directly.`

### 6.16 Notifications & Access Control

Req ID

Requirement Description

Priority

Acceptance Criteria

FR-084

When a suspension task is created in Apply, PCN shall send a notification (notification bell) to CEO Manager users in PCN.

Medium

Creating a task results in visible notification.

FR-085

Access to suspension functions shall follow roles: Permits Admin (create suspension and assign tasks), PCN Contract Admin (configure suspension assignment), CEO (execute tasks), CEO Manager (monitor tasks).

High

Permissions and UI elements are restricted/enabled as per roles.

FR-086

Notifications to BO User & BO Manager for Assign Task Statuses

High

When an application in Apply IQ reaches any of the following statuses:

-   **Assign Task**
    
-   **Expired – Assign Task**
    
-   **Cancelled – Assign Task**
    

the system must:

Send a **notification to the relevant BO user**.

Send a **notification to the BO Manager**.

### 6.17 Illumin8 Integration

Req ID

Requirement Description

Priority

Acceptance Criteria

FR-087

The system shall send the following to Illumin8 for each Suspension: Permission Type, Permission Name, Application Reference Number, Start Date & Time, End Date & Time, VRM(s) (as array if multiple).

High

Integration payload contains all these fields; VRM list matches Vehicle Tab.

FR-088

Remove Suspension Details in Illumin8 on Expired Assign Task

High

**Remove/clear the Suspension details** for that application from **Illumin8**.

Ensure no active or historical **Suspension** data for this expired application is shown as current in Illumin8

FR-089

Remove Suspension Details in Illumin8 on “Cancelled Assign Task”

High

**Remove/clear the Suspension details** for that application from **Illumin8**.

Ensure the application is **no longer shown with any active Suspension** in Illumin8.

FR-090

When extension of a suspension is applied and approved (where extension is enabled), updated end date and duration shall be sent to Illumin8.

Medium

Illumin8 receives updated end date and other changed fields on extension.

### 6.18 Reporting – Suspension Static Report

Req ID

Requirement Description

Priority

Acceptance Criteria

FR-091

The Suspension Static Report shall support filters: Permission Type, Permission Name, Application Status (suspension-related), Date Range.

Medium

Users can filter on each of these dimensions; report output respects filters.

FR-092

Report results shall include fields: Application Reference Number, First Name, Last Name, Permission Name, Street Name, Purchase Reason, Start Date & Time, End Date & Time, Total Price, VRM(s), Number of Bay Types, email, address

Medium

Running the report shows all fields as columns.

FR-093

Report shall support drill-through on Bay Type to show: Bay Type, Number of Bay Spaces, Bay Price calculated per bay type; if multiple bay spaces / bay types exist, multiple entries are displayed.

Medium

Clicking Bay Type cell opens detailed view listing each bay type and associated metrics.

### 6.19 Merge Field for Suspension

1.  **Bay Type** – Populate the name(s) of the selected bay type(s). If multiple are selected, list all selected bay types.
    
2.  **Bay Spaces** – Populate the number of bay spaces entered for each selected bay type, displayed against its corresponding bay type.
    
3.  **Street Name** – Populate the street selected for the suspension application.
    
4.  **Purchase Reason** – Populate the selected suspension reason.
    
5.  **Skip License Number** – If provided, populate the value; if not provided, leave blank (no value displayed).
    
6.  **Street Works Permit Number** – If entered, populate the value; if not entered, leave blank (no value displayed).
    
7.  **Start Date & Time** – Populate the selected start date and time.
    
8.  **End Date & Time** – Populate the calculated end date and time.
    
9.  **Bay Price** – Populate the calculated price per selected bay type; if multiple bay types are selected, display a separate price for each bay type.
    
10.  **Total Price** – Populate the total payable amount for the suspension application.
     
11.  **Admin Fee** – Populate the admin fee amount if applicable.
     
12.  **Short Notice Suspension Fee** – Populate the short notice fee if applicable.
     
13.  **Minimum Charge Suspension** – Populate the minimum suspension charge if applicable.
     
14.  **VRM** – Populate all VRMs added to the suspension application; if multiple VRMs are added, display all.
     

### 6.20 Action Buttons by Status – Customer Portal

Status

Primary Action

Secondary Actions (Three dots / overflow)

Notes

Pending Approval

Cancel

—

On Hold

Cancel

—

Internal Referral

Cancel

—

Waiting For Customer Information

Submit Document

Cancel, View T&C

Same behaviour as “Request Support Evidence” / “Due to be Closed” (when previous status = Request Support Evidence).

Request Support Evidence

Submit Document

Cancel, View T&C

Due to be Closed _(previous status = Request Support Evidence)_

Submit Document

Cancel, View T&C

Waiting for Payment

Pay

Cancel, View T&C

Payment Failed

Pay

Cancel, View T&C

Due to be Closed _(previous status = Payment Failed)_

Pay

Cancel, View T&C

Active _(Extend Suspension enabled in Builder)_

Extend Suspension

Receipt, Cancel, View T&C

Extend Suspension is primary when enabled.

Active _(Extend Suspension not enabled in Builder)_

Cancel

Receipt, View T&C

No Extend action; Cancel becomes primary.

Rejected

Reapply

— (no three-dots menu)

Cancelled

—

—

No actions.

Expired

—

—

No renewal/extension allowed for suspension.

Print

—

—

No actions.

In Progress

—

—

No actions.

### 6.21 Rule for Free Suspension

Req ID

Requirement Description

Priority

Acceptance Criteria

FR - 094

 Define checkout and payment visibility for £0 bay pricing with Admin Fee and VAT logic.

High

Checkout handles free/paid bays, Admin Fee, and VAT as configured

### 6.22 Extend Suspension – Action Button & Flow

#### 6.22.1 Visibility & Entry Conditions

Req ID

Requirement Description

Priority

Acceptance Criteria

FR-095

The system shall display an **Extend Suspension** action button only when the application status is **Active** and **Extend Suspension** is enabled in Permission Builder for that permission. |

Medium |

or Suspension permissions with Extend enabled, Active applications in CP and BO show Extend Suspension as the primary action (per Section 6.20); if Extend is disabled, the button is not shown.  

#### 6.22.2 Customer Portal – On Click Behaviour

Req ID

Requirement Description

Priority

Acceptance Criteria

FR-096

When the user clicks **Extend Suspension**, the system shall prompt the user to enter the **extension duration** in days/weeks/months, consistent with the duration types configured for the permission.

High

CP shows a form where user selects duration type (if multiple configured) and enters number of days/weeks/months for the extension.  

FR-097

The system shall apply the **same pricing logic** as the original suspension for the extension period, including: per-duration pricing, **Admin Fee** (if configured), and **VAT** (if enabled). |

High

For a given extension duration and bay configuration, the calculated extension price uses the same pricing rule (P1/P2/P3) and fee settings as the original application.  

FR-098

If multiple bay types exist in the original suspension, the system shall apply the pricing logic **separately per bay type** for the extension period, calculate a **subtotal per bay type**, and then calculate the **total extension price** as the sum of all bay subtotals plus Admin Fee and VAT (if applicable).

High

Example: 2 bay types with separate prices each produce their own extension subtotals; UI shows per-bay subtotals and a combined total.  

FR-099

After pricing is calculated, the user shall select a **payment method** (from the payment methods configured for the permission) and submit the **extension request**.

High

CP enforces selection of a valid payment method and successfully submits the extension request when all mandatory fields are completed.  

#### 6.22.3 Back Office Behaviour

Req ID

Requirement Description

Priority

Acceptance Criteria

FR-100

Then an **Extend Suspension** request is submitted (from CP or BO), a new extension workflow instance for the suspension shall move to status **Extension approval** in Back Office.

High

After submission, BO shows the extension instance with status = Extension approval.  

FR-101

For status **Extension approval** in BO, the available button(s)/actions shall be the same as those configured for **Pending Approval** status in the standard BO flow.

Medium

BO users see the same primary and secondary actions on Extension approval as on Pending Approval (e.g. Begin Review, Approve, Reject, Request Customer Information, etc.).  

#### 6.22.4 Customer Portal Behaviour

Req ID

Requirement Description

Priority

Acceptance Criteria

FR-101

When an **Extend Suspension** request is submitted, the Customer Portal shall show the application status as **Extension approval** until it progresses further in the BO flow.

High

After submission, CP displays Extension approval as the current status for the extension request.  

FR-102

The CP user shall be able to **cancel the extension request** while it remains in Extension approval (and any pre–In Progress state), and shall **not** be able to cancel it once the extension moves to **In Progress**.

High

Cancel action is visible and works correctly before In Progress; once status ≥ In Progress, Cancel is not available for the extension request.  

#### 6.22.5 Back Office Status Flow – Extend Suspension

Req ID

Requirement Description

Priority

Acceptance Criteria

FR-103

Once an Extend Suspension application is submitted, the Back Office status flow for the extension shall follow: **Pending Approval → Being Reviewed → Approved → Waiting for Payment (based on payment method) → Print (once printed) → Assign Task → Task Assigned → Task Completed → Active**.

High

BO status transitions for the extension instance follow exactly this sequence; invalid transitions are blocked.  

#### 6.22.6 After Completion (Active) – Overview & Integration

Req ID

Requirement Description

Priority

Acceptance Criteria

FR- 104

When the extension task is completed and the suspension returns to **Active**, the **Overview** tab in both BO and CP shall display the **extension duration** and update the **End Date & Time** accordingly.

High

After completion, Overview shows the new total or additional extension duration, and End Date & Time reflects the extended end date.  

FR-105

After the suspension becomes Active with the updated end date, the system shall send the updated suspension details to **Illumin8** in the agreed **FRD format**, including the new **End Date & Time** and any related extension data as required.

Medium

llumin8 receives an updated payload with the changed End Date & Time and other relevant fields; this aligns with Section 6.17 (FR-075, FR-076).

6.22.7. **Auto‑Reject Extension on Parent Expiry** flow in BO & CP.

Req ID

Requirement Description

Priority

Acceptance Criteria

FR - 106

`The system shall automatically` **\*\*reject\*\*** `any pending extension applications when the` **\*\*parent suspension\*\*** `expires.`

High

`Given a parent suspension application is` **\*\*Active\*\*** `with an End Date & Time, and an associated Extension Application is in status` **\*\*Extension Approval\*\*** `or` **\*\*Being Reviewed\*\***`, when the parent suspension reaches its End Date & Time and transitions to` **\*\*Expired\*\***`, then the Extension Application automatically moves to status` **\*\*Rejected\*\***`.`

FR - 107

`When an extension is auto‑rejected because the parent suspension expired, the` **\*\*parent application\*\*** `shall remain in status` **\*\*Expired\*\*** `and no extension changes shall be applied.`

High

`After the parent reaches` **\*\*Expired\*\***`, the parent status remains` **\*\*Expired\*\***`, and there are` **\*\*no updates\*\*** `to the parent’s End Date & Time or duration; the Overview tab reflects the original expiry with no extension applied.`

FR - 108

`When an Extension Application is auto‑rejected because the` **\*\*parent suspension expired before extension approval\*\***`, the Customer Portal shall show an information message on the` **\*\*parent suspension\*\*** `application.`

High

`When an Extension Application is auto‑rejected because the` **\*\*parent suspension expired before extension approval\*\***`, the Customer Portal shall show an information message on the` **\*\*parent suspension\*\*** `application.`

FR - 109

CP Behavior After Auto‑Rejected Extension

High

After an extension has been auto‑rejected with reason **"Parent suspension expired before extension approval"**, when the applicant views the **parent suspension** in CP, the system shall display the extension‑rejected information message and shall **not** show any **"Cancel Request"** action for that extension; for parents without such an auto‑rejected extension, this message and restriction shall not apply.

### 6.23 Refund Processing – Suspension Cancellation (Customer Portal)

#### 6.23.1 Cancellation Confirmation & Mandatory Reason

Req ID

Requirement Description

Priority

Acceptance Criteria

FR-110

When a Customer Portal user initiates cancellation of a **Suspension** application that is eligible for refund, the system shall first require a **cancellation reason** and then show a confirmation pop‑up before starting refund processing.

High

Given the refund calculation is displayed and a mandatory cancellation reason is selected, when the user clicks **Confirm Cancel Application**, the system shows a confirmation dialog with the message **"Are you sure wish to cancel the application?"** and two buttons: **"No"** and **"Yes"**.  

FR - 111

Refund Summary screen for suspension

High

-   **Application Context (read‑only):** Application Ref, Permission = Suspension, Status, Suspension Period
    
-   **Location Summary (read‑only):** Streets (grouped), Bay Types, Bay Spaces per Bay Type
    
-   **Pricing Summary:** **Total Suspension Amount Paid** (£X.XX) + optional bay breakdown + duration unit (Hour/Day/Week/Month)
    
-   **Refund Breakdown (read‑only):** Remaining Duration (configured unit), Eligible Refund, Cancellation Charge (if any), **Final Refundable Amount**
    

> Refund values must use **Suspension‑specific P1/P2/P3 logic**, not generic permit logic.

FR - 112

Refund Logic – Suspension

High

1.  **Reuse standard refund screen & flow** as per **#25136** and **#198739**; only the calculation differs for Suspensions.
    
2.  **Use the same pricing unit** configured in Permission Builder (Hour / Day / Week / Month); remaining duration is calculated in that unit (fractional weeks/months supported).
    
3.  **P1 (Standard):** `Refund = Bay Spaces × Remaining Duration × Unit Price` (calculated per bay type and summed).
    
4.  **P2 (Minimum + Incremental):**
    
    -   If Remaining ≤ Minimum → pro‑rate minimum charge
        
    -   If Remaining > Minimum → minimum charge + incremental for remaining beyond minimum  
        (calculated per bay type and summed).
        
5.  **P3 (Fixed Price):** `Refund = Fixed Price × (Unused Duration ÷ Total Duration)` per bay type; bay spaces ignored; apply cancellation charge once.
    

FR-113

If the user selects **Yes** in the confirmation pop‑up, the system shall begin the **refund processing** for the suspension; if the user selects **No**, the system shall **not** proceed with cancellation and shall **not** start any refund process.

High

Selecting **Yes** moves to refund logic; selecting **No** closes the confirmation pop‑up, leaves the application status unchanged, and no refund attempt is made.  

FR-114

Cancellation reason shall be **mandatory**. If no reason is selected when the user attempts to confirm cancellation, the system shall show the validation message: **"Please select a cancellation reason to proceed"**.

High

Attempting to confirm cancellation without a reason blocks progression and shows the specified error.  

FR-115

The user shall be able to **back out / quit** the cancellation flow (e.g. via Back or Cancel/Close) at any point **before** confirming, and in this case the system shall not change the application status and shall not attempt a refund.

Medium

Using Back/Quit/Close exits the cancellation flow cleanly without status change or refund attempt.  

#### 6.23.2 Validate Transaction Window

Req ID

Requirement Description

Priority

Acceptance Criteria

FR-116

For Suspension applications where the original purchase was made using a **payment card**, when the refund process starts the system shall validate that: (a) the card used is still **active**, and (b) the original transaction is **not older than 180 days**.

High

On starting refund, system checks card status and transaction age. Refund only proceeds automatically if card is active and transaction age ≤ 180 days.  

#### 6.23.3 Successful Refund Flow

Req ID

Requirement Description

Priority

Acceptance Criteria

FR-118

If the payment card is valid and the transaction is within **180 days**, the system shall automatically issue the **refund**, update the Suspension application status to **Cancelled**, and display to the user: **“Your permit has been cancelled and refund of £X has been processed.”** |

High

On successful refund: (1) status becomes Cancelled, (2) message is shown with actual refund amount £X, (3) underlying payment partner refund behaviour follows work item [#227856](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/227856/).  

#### 6.23.4 Refund Failure Messaging

Req ID

Requirement Description

Priority

Acceptance Criteria

FR-119

If refund processing fails because the card is expired, the transaction is older than **180 days**, or a payment gateway technical error occurs, the system shall display: **“Refund failed. Please contact support.”** and create a **Refund Failed** work queue entry for Back Office follow‑up.

High

In any of the above failure conditions, user sees the specified failure message, a **Refund Failed** work queue item is created, and the Suspension application is not incorrectly marked as refunded.

## 7\. User Stories List

User Story Id

User Story

171288

Default template | Application form | Address| Document | Suspension Details Tab

181921

Builder | Suspension specific pricing configuration - P2 Minimum Duration + Incremental Pricing

182100

Apply | Contract Settings | Use System Street

182101

Suspension specific pricing configuration - P1 Standard Pricing

198903

Application Form | Suspension template | Integrate with TRO/TMO API with azure map | Post migration

208963

Permission builder | Suspension | Category Type

249725

Default Template | Application Form | Summary

249727

Application Menu | Suspension Application | Overview Tab (Back office)

249729

Application Menu | Suspension Application | Vehicle Tab (Back Office)

249731

Application Menu | Suspension | List Screen

249732

Application Menu | Suspension Application | Application Flow For Suspension

249734

CP | My application | Suspension Application | Overview Tab

249735

CP | My application | Suspension Application | Vehicle Tab

249736

PCN Contract – Home Screen | Suspensions Tab | Configure CEO Assignment for Suspension Tasks

249737

Apply | Contact Settings | Use Map Integration

249738

Application Menu | Overview Tab | Edit Start Date & Time

249740

CP | My Application | Suspension | Primary and Secondary Button Based on the Application Status

249741

Application Menu | Suspension | Task Assignment to CEO

249743

MNPS | Enable Suspension Management Configuration for PCN Contracts

249746

Application Menu | Suspension Application | CEO Task Tab (BO)

249786

Application Menu | Suspension Application | Task Completion by CEO on Handheld (Sync to Apply IQ)

249788

CP | My application | Suspension Application | Action Button | Extend Suspension

249937

Apply | Contract settings | Town Field

249938

Builder | Short Notice & Extend Suspension Toggle

249939

Default Template | Suspension Details | Validation Based on Builder Settings

249940

Send Suspension Data to Illumin8

249941

CP | My application | Extend Suspension | Overview Tab changes

249943

Suspension Task | CEO Assignment as per MNPS PCN Contract Configuration & Accept/Reject Flow for Suspension Tasks in Handheld

250057

Merge Field For Suspension

250058

Static Report for Suspension

250103

Application Menu | Suspension | Task Assignment to CEO on Expired Assign Task Application Status

250111

Application Menu | Action Button Based on the Application Status – Back Office Flow

250268

BO | Suspension | Notification to Apply BO Manager & BO user | CEO Task Completed

250270

BO | Suspension | Task Cancelled by CEO | Notification to BO User Who Assign The Task & BO Manager - Back Office

250274

Application Menu | Suspension | Task Assignment to CEO on Cancelled Assign Task Application Status

250286

Free Permission Rule for Suspension

250287

Application Menu | Action Button | Suspension Task Cancellation by Apply Users

250288

Update Suspension End Date in Illumin8 Upon Suspension Extension

250291

Configuration Setting for PCN CEO-to-Contract Mapping

250392

Refund Calculation for Suspension

250422

CP | My application | Suspension Application | View Details

250890

Default Template | Suspension | Pricing Calculation for P1 & P2 rules

250891

Permission Builder | Suspension | Option to Enable Allow Multiple Bay Selection

250897

Application Menu | Suspension Application | Action Button | Extend Suspension

250905

Suspension Task Status Updated in MNPS Task Screen

252851

Default template | Application form | Suspension Details Tab | Bay Selection and VRM

254350

Builder | Default values prepopulated for suspension category | Comment box option

254356

Builder | Pricing Tab | Pricing Screen for Suspension

254386

Builder | Suspension specific pricing configuration - P3 Fixed Price

254781

Default Template | Suspension | Pricing Calculation for P3 & Form View for P3 Price Rule

255078

Default Template | Suspension | Price Summary & Check Out

258121

Auto‑Reject Extension When Parent Suspension Expires (BO)

258124

CP: Show Rejection Message When Extension Auto‑Rejected Due to Parent Expiry (CP)

258125

BO/CP – Extension Suspension Submission | Child Application Lifecycle & Parent Update Logic

258128

BO | Suspension | Notification to MNPS (PCN) CEO Manager When Suspension Task is Created/Assigned in APPLY

258129

BO | Suspension | Notifications to Apply BO User & BO Manager for Assign Task Statuses

261248

Suspension Settings | Maximum Suspension Per Street

261249

Application Form | Suspension Template | Maximum Suspension Per Street Validation

261254

Application menu | Suspension application | Overview tab changes when street and bays selected through map

261259

CP | My application | Suspension application | Overview tab changes when street and bays selected through map

* * *

## 8\. Data Requirements

-   **Data Inputs**
    
    -   Applicant details: first name, last name, contact details, address
        
    -   Permission details: permission type/name, category (Suspension)
        
    -   Suspension details: street name, town (if enabled), purchase reason, conditional fields (license number, permit questions), bay types, bay spaces, start date/time, duration type, duration quantity, VRMs
        
    -   Pricing configuration: pricing rule (P1/P2/P3), per-period price, min/max suspension, min charge, different bay price settings, admin fee, VAT, short notice settings
        
    -   Contract settings: street selection mode, map toggle, display town toggle, integration toggles
        
    -   CEO task data: task title, category, location, comments, status, evidence links
        
-   **Data Outputs**
    
    -   Suspension application records with full history
        
    -   Task records in PCN with reference to Apply application reference
        
    -   Illumin8 integration payload data
        
    -   Static report data for Suspension
        
    -   Merge field outputs for documents/letters
        
-   **Data Validation Rules**
    
    -   Numeric ranges for days/weeks/months, bay spaces, fees (0–1000 where specified)
        
    -   Mandatory vs optional fields per purchase reason and configuration
        
    -   Date/time validations (start date must be a forward date, end date >= start date)
        
    -   Permission limit checks
        

* * *

## 9\. Integration Requirements

-   **Apply ↔ NPS PCN**
    
    -   Outbound task creation from Apply to PCN including title, category, location, application reference, comments.
        
    -   Inbound task status updates from PCN to Apply keyed by application reference.
        
    -   Role-based visibility and configuration in PCN for Suspensions tab.
        
-   **Apply ↔ Illumin8**
    
    -   Outbound messages with suspension details (permission type/name, reference, start/end, VRMs).
        
    -   Updates on extension/change to end date.
        
-   **External Dependencies**
    
    -   CEO handheld integration via PCN for task delivery and evidence upload.
        
    -   Address search provider used in Address tab (existing Apply integration).
        

* * *

## 10\. UI/UX Requirements

-   **General**
    
    -   Suspension configuration and application flows should align with existing Apply UI patterns.
        
    -   Error messages must clearly indicate which field and rule failed (e.g. “Minimum duration for this suspension is 2 days”).
        
-   **Customer Portal**
    
    -   Step-based flow with tabs: Address → Suspension Details → Documents (if configured) → Checkout.
        
    -   Pricing breakdown panel clearly shows per-bay calculations, additional fees, and total.
        
    -   Action buttons must follow status/action rules (Section 14 of your doc), including dynamic primary/secondary actions.
        
-   **Back Office**
    
    -   Overview tab shows logically grouped sections (Applicant, Suspension Details, Pricing & Payment, Vehicle, CEO, Payment History).
        
    -   CEO Tab must show a chronological list of task events with status badges and evidence links.
        

* * *

## 11\. Non-Functional Requirements

-   **Performance**
    
    -   Pricing calculations must happen in real time on change of duration, bay spaces, bay types, or fees, with no noticeable delay to user.
        
    -   Task creation and status updates must persist within normal API SLAs (e.g. < 5 seconds).
        
-   **Security**
    
    -   Only authorized roles can configure suspension settings and create/approve suspensions.
        
    -   Integration endpoints secured with existing authentication mechanisms between Apply and NPS PCN / Illumin8.
        
-   **Compliance**
    
    -   Audit logs maintained for status changes, CEO tasks, and payment events.
        
-   **Scalability**
    
    -   System must support multiple contracts each with unique suspension configuration and pricing.
        
-   **Availability**
    
    -   Suspension application and BO management must be available in line with Apply’s existing uptime SLAs.
        

* * *

## 12\. Assumptions

-   Users have internet access and can access the Apply portal and BO as today.
    
-   Customers provide valid and accurate address and permit information.
    
-   NPS PCN and Illumin8 APIs are available and stable for integrations.
    

* * *

## 13\. Constraints

-   The solution must be delivered within the existing Apply and NPS PCN tech stacks.
    
-   Some features (P2, Map Integration, Display Town, Extend Suspension, Short Notice) are defined generically but must be disabled for Southend per contract configuration.
    

* * *

## 14\. Dependencies

-   Availability and configuration of NPS PCN for suspension integration.
    
-   Illumin8 integration readiness for receiving new suspension payload.
    
-   Apply Form Builder configuration for documents, VRMs, and custom fields.
    
-   Contract-level configuration completion (street selection mode, pricing rules, toggles).
    

* * *

## 15\. Risks & Mitigations

-   **Risk**: Misconfiguration of pricing rules leading to incorrect charges.  
    **Mitigation**: Validation in Builder, test scenarios for P1/P2/P3, clear admin guidance.
    
-   **Risk**: Integration downtime between Apply and PCN/Illumin8 causing unsynchronised tasks/data.  
    **Mitigation**: Error handling and retry strategy; surface integration status to admins.
    
-   **Risk**: Complex status flows causing user confusion.  
    **Mitigation**: UI/UX consistency with existing Apply flows, training materials, concise labels.
    

* * *

## 16\. Approval

Name

Role

Signature

Date

Joanne Archer

Product Owner

Prathiba

BA