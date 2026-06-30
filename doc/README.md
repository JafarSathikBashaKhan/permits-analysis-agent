# Permit Application System ? User Stories Master Index

> **Total: 339 user stories across 18 modules**  
> **Application:** NPS Backoffice (Permit Management)  
> **URL:** `nps-backoffice-test-c9bxa6bgg0a7htfn.z01.azurefd.net`  
> **Contract:** AutomationApplyIQ

## Module Map

```
Home Screen
??? Dashboard
??? Applications
?   ??? Permits (Grid, Details, Workflow Actions)
?   ??? Work Queue / Status States
?   ??? Buy Now (Purchase Flow)
??? Users
?   ??? Roles & Permissions
?   ??? System Users
?   ??? Applicants (Vehicles, Documents, Emails, Blue Badge)
??? Permission Setup
?   ??? Groups
?   ??? Builder (Permissions, Rules, Pricing, Zones, Templates)
??? Templates
?   ??? Document Types
?   ??? Terms & Conditions
?   ??? Alerts / Tooltips
??? Print
?   ??? Physical Permissions
?   ??? White Mail Reminders
??? Area
?   ??? Streets (White List / Black List)
?   ??? Zones
?   ??? Locations
?   ??? Bulk Import
??? Reports
??? System Audits
??? Contract Settings
??? Email Broadcasting
??? Pricing
??? MNPS Contract Settings
??? MNPS Template Settings
```

## Summary

| Module | Stories | Description |
|--------|---------|-------------|
| Home Screen | 3 | Dashboard screen, header, menu, sign-out |
| Dashboard | 2 | Active permissions projection, upcoming renewals |
| Applications | 60 | Permit application lifecycle ? grid, details, workflow actions, emails, vehicles, documents, notes, renewals, zone/address changes |
| Work Queue / Status | 24 | Application work queue states and transitions |
| Users | 57 | Roles & Permissions, System Users, Applicants ? CRUD, bulk actions, vehicles, documents, emails, blue badge |
| Permission Setup > Group | 4 | Permission groups ? list, create, edit, delete |
| Permission Setup > Permission Builder | 54 | Permission configuration ? overview, rules, pricing, vehicles, zones, templates, renewals, special events |
| Templates | 16 | Document Types, Terms & Conditions, Alerts/Tooltips |
| MNPS Template Settings | 8 | MNPS-level email/notification templates ? create, edit, merge fields, defaults |
| Print | 10 | Physical permission printing, white mail reminders, print partner integration |
| Area | 35 | Streets (white/black list), Zones, Locations, bulk import, special events |
| Reports | 3 | Application NFI, financial income, diesel surcharge reports |
| System Audit | 3 | System-wide audit log, filtering, event categories |
| Contract Settings | 21 | Toggles and configuration ? USRN/UPRN, DOB, vehicles, pricing, blue badge, diesel, closure, merchant, etc. |
| MNPS Contract Settings | 14 | MNPS-level contract config ? apply settings, toggles (PCN, Experian, Autoguru, Illumin8, Print), reject reasons, timezone |
| Email | 5 | Email broadcasting ? compose, merge fields, save draft, send |
| Pricing | 2 | Permission setup menu, pricing menu |
| Buy Now | 18 | Application purchase flow ? dynamic permission types, form tabs (address, document, vehicle, price, checkout), scratch cards, non-zonal |
| **TOTAL** | **339** | |

---

## Home Screen (3 stories)

Dashboard screen, header, menu, sign-out

| Story ID | Title | State |
|----------|-------|-------|
| 110894 | [Ability to view the created contract in dashboard screen](./US-110894-ability-to-view-the-created-contract-in-dashboard-screen.md) | Done |
| 111155 | [Home Screen Apply BO - Header and Menu Item](./US-111155-home-screen-apply-bo-header-and-menu-item.md) | Done |
| 163653 | [BO \| Sign out](./US-163653-bo-sign-out.md) | Done |

## Dashboard (2 stories)

Active permissions projection, upcoming renewals

| Story ID | Title | State |
|----------|-------|-------|
| 111156 | [Dashboard screen \| Active Permissions Projection](./US-111156-dashboard-screen-active-permissions-projection.md) | Done |
| 165216 | [Dashboard \| Upcoming Renewals Projection](./US-165216-dashboard-upcoming-renewals-projection.md) | Done |

## Applications (60 stories)

Permit application lifecycle ? grid, details, workflow actions, emails, vehicles, documents, notes, renewals, zone/address changes

| Story ID | Title | State |
|----------|-------|-------|
| 157606 | [Application \| Application Menu](./US-157606-application-application-menu.md) | Done |
| 157622 | [Application \| Permit Application details \|Grid Screen](./US-157622-application-permit-application-details-grid-screen.md) | Done |
| 160535 | [Application \| Application Details \| Overview](./US-160535-application-application-details-overview.md) | Done |
| 160554 | [Application \| Application Details \| Vehicles PCN Lookup (Show Active PCN)](./US-160554-application-application-details-vehicles-pcn-lookup-show-active-pcn.md) | Done |
| 160622 | [Application \| Application Details \| Add New document (Upload)](./US-160622-application-application-details-add-new-document-upload.md) | Done |
| 160629 | [Application \| Application Details \| Approve Application \| Pre-Payment (Preview Email)](./US-160629-application-application-details-approve-application-pre-payment-preview-email.md) | Done |
| 160796 | [Application \| Application Details \| Reject Application (Preview Email)](./US-160796-application-application-details-reject-application-preview-email.md) | Done |
| 160872 | [Application \| Application Details \| Cancel Application (Preview Email)](./US-160872-application-application-details-cancel-application-preview-email.md) | Done |
| 160894 | [Application \| Application Details \| On-Hold Application (Preview Email)](./US-160894-application-application-details-on-hold-application-preview-email.md) | Done |
| 160900 | [Application \| Application Details \| Internal Referral](./US-160900-application-application-details-internal-referral.md) | Done |
| 160915 | [Application \| Application Details \| Request for Evidence (Preview Email)](./US-160915-application-application-details-request-for-evidence-preview-email.md) | Done |
| 161845 | [Application \| Application Details \| Vehicles \| Swap/Change Vehicle](./US-161845-application-application-details-vehicles-swap-change-vehicle.md) | Done |
| 162113 | [Application \| Application Details \| Approve Application \| Post-Payment](./US-162113-application-application-details-approve-application-post-payment.md) | Done |
| 162155 | [Application \| Application Details \| Overview \| Add New Note (BO user)](./US-162155-application-application-details-overview-add-new-note-bo-user.md) | Done |
| 163987 | [Application \| Application Details \| Reinstate Cancelled Application](./US-163987-application-application-details-reinstate-cancelled-application.md) | Done |
| 164018 | [Application \| Application Details \| Suspend Application](./US-164018-application-application-details-suspend-application.md) | Done |
| 164436 | [Application \| Application Details \| Overview \| Edit Note (BO user)](./US-164436-application-application-details-overview-edit-note-bo-user.md) | Done |
| 164507 | [Application \| Application Details \| Overview \| Delete Note (BO Manager)](./US-164507-application-application-details-overview-delete-note-bo-manager.md) | Done |
| 164605 | [Application \| Application Details \| Overview \| Notes Section](./US-164605-application-application-details-overview-notes-section.md) | Done |
| 164966 | [Application \| Application Details \| Overview \| Applicant tab](./US-164966-application-application-details-overview-applicant-tab.md) | Done |
| 164967 | [Application \| Application Details \| Overview \| Vehicles tab](./US-164967-application-application-details-overview-vehicles-tab.md) | Done |
| 164968 | [Application \| Application Details \| Overview \| Documents tab](./US-164968-application-application-details-overview-documents-tab.md) | Done |
| 164969 | [Application \| Application Details \| Overview \| Email tab](./US-164969-application-application-details-overview-email-tab.md) | Done |
| 164970 | [Application \| Application Details \| Overview \| Audit log tab](./US-164970-application-application-details-overview-audit-log-tab.md) | Done |
| 164971 | [Application \| Application Details \| Overview \| Payment History tab](./US-164971-application-application-details-overview-payment-history-tab.md) | Done |
| 165045 | [Application \| Application Details \| Overview \| Email tab \| Send Email](./US-165045-application-application-details-overview-email-tab-send-email.md) | Done |
| 165057 | [Application \| Application Details \| Resume Application](./US-165057-application-application-details-resume-application.md) | Done |
| 165891 | [Application \| Application Details \| Overview \| Email tab \| Save Draft (Save and close)](./US-165891-application-application-details-overview-email-tab-save-draft-save-and-close.md) | Done |
| 165894 | [Application \| Application Details \| Overview \| Email tab \| Preview Email](./US-165894-application-application-details-overview-email-tab-preview-email.md) | Done |
| 167275 | [Application \| Application Details \| On Hold\| Extend duration of On Hold application](./US-167275-application-application-details-on-hold-extend-duration-of-on-hold-application.md) | Done |
| 169022 | [Application \| Application Details \| Enable "Renew "Permit Application before Expiry (By BO)](./US-169022-application-application-details-enable-renew-permit-application-before-expiry-by.md) | Done |
| 170243 | [Application \| Application Details \| Change Zone (By BO) without cost](./US-170243-application-application-details-change-zone-by-bo-without-cost.md) | Done |
| 172028 | [Application \| Application Details \| Reject Application (Send Reject Email)](./US-172028-application-application-details-reject-application-send-reject-email.md) | Done |
| 172029 | [Application \| Application Details \| Request for Evidence (Send Email)](./US-172029-application-application-details-request-for-evidence-send-email.md) | Done |
| 172045 | [Application \| Application Details \| On-Hold Application (Send Email)](./US-172045-application-application-details-on-hold-application-send-email.md) | Done |
| 172046 | [Application \| Application Details \| Cancel Application (Send Email)](./US-172046-application-application-details-cancel-application-send-email.md) | Done |
| 174167 | [Application \| Application Details \| Approve Application \| Pre-Payment (Send Email)](./US-174167-application-application-details-approve-application-pre-payment-send-email.md) | Done |
| 174813 | [Application \| Application Details \| Reinstate Rejected Application](./US-174813-application-application-details-reinstate-rejected-application.md) | Done |
| 175711 | [Application \| Application Details \| Request Customer Information](./US-175711-application-application-details-request-customer-information.md) | Done |
| 176354 | [Show 'Favorites' Marking in Change Vehicle Screen](./US-176354-show-favorites-marking-in-change-vehicle-screen.md) | Done |
| 177255 | [Application \| Application Details \| Reactivate & Renew Permit Application(By BO)  \| During Grace Period After Expiry](./US-177255-application-application-details-reactivate-renew-permit-application-by-bo-during.md) | Done |
| 179426 | [Application \| Application Menu \| Suspend Application \| List of suspend reasons](./US-179426-application-application-menu-suspend-application-list-of-suspend-reasons.md) | Done |
| 180625 | [Application \| Application Details \| Activate Suspend Application](./US-180625-application-application-details-activate-suspend-application.md) | Done |
| 181869 | [Application \| Application Details \| Temporary Permission Application](./US-181869-application-application-details-temporary-permission-application.md) | Done |
| 182368 | [Application \| Application Details \| Application ID in Audit log events](./US-182368-application-application-details-application-id-in-audit-log-events.md) | Done |
| 186077 | [Application \| Application Details \| Applicant \| FPN Lookup](./US-186077-application-application-details-applicant-fpn-lookup.md) | Done |
| 193198 | [Application \| Application Details \| On-Hold Application if not resumed](./US-193198-application-application-details-on-hold-application-if-not-resumed.md) | Done |
| 193350 | [Application \| Application Details \| Renewal \| Renew permit initiated by BO](./US-193350-application-application-details-renewal-renew-permit-initiated-by-bo.md) | Done |
| 193567 | [Application \| Application Details \| Renewal \| Expired Documents \| New documents to be uploaded](./US-193567-application-application-details-renewal-expired-documents-new-documents-to-be-up.md) | Done |
| 194295 | [Application \| Application Details \| Change Zone (By BO) with cost](./US-194295-application-application-details-change-zone-by-bo-with-cost.md) | Done |
| 194825 | [Application \| Application Details \| BO to Record payments made offline](./US-194825-application-application-details-bo-to-record-payments-made-offline.md) | Done |
| 195183 | [Application \| Application Details \| Renewal \| Skip Document upload](./US-195183-application-application-details-renewal-skip-document-upload.md) | Done |
| 195186 | [Application \| Application Details \| Limit Reinstate (Rejected / Cancelled) Application](./US-195186-application-application-details-limit-reinstate-rejected-cancelled-application.md) | Done |
| 195616 | [Application \| Application Details \| Internal Referral Email notification](./US-195616-application-application-details-internal-referral-email-notification.md) | Done |
| 195876 | [Application \| Application Details \| Button visibility](./US-195876-application-application-details-button-visibility.md) | Done |
| 199490 | [Application \| Application Details \| Change Address (system address ) By BO - Different zone](./US-199490-application-application-details-change-address-system-address-by-bo-different-zo.md) | Done |
| 199506 | [Application \| Application Details \| Change Address (system address ) By BO - Different zone  - Email notification](./US-199506-application-application-details-change-address-system-address-by-bo-different-zo.md) | Done |
| 199862 | [Application \| Application details \| Manage & Process Waiting List applications by BO User](./US-199862-application-application-details-manage-process-waiting-list-applications-by-bo-u.md) | Done |
| 200211 | [Dynamic Start Date Rendering for Applications](./US-200211-dynamic-start-date-rendering-for-applications.md) | Done |
| 205926 | [Application \| Application Details \|  Record offline payments \| Attachment section](./US-205926-application-application-details-record-offline-payments-attachment-section.md) | Done |

## Work Queue / Status (24 stories)

Application work queue states and transitions

| Story ID | Title | State |
|----------|-------|-------|
| 168840 | [Application \| Application Details \| Expired Application (Permit Expired)](./US-168840-application-application-details-expired-application-permit-expired.md) | Done |
| 169027 | [Application \| Application Details \| Work Queue States \| Pending-approval](./US-169027-application-application-details-work-queue-states-pending-approval.md) | Done |
| 169334 | [Application \| Application Details \| Display Work Queue States](./US-169334-application-application-details-display-work-queue-states.md) | Done |
| 170288 | [Application \| Application Details \| Work Queue States \| Approved](./US-170288-application-application-details-work-queue-states-approved.md) | Done |
| 170307 | [Application \| Application Details \| Work Queue States \| Rejected](./US-170307-application-application-details-work-queue-states-rejected.md) | Done |
| 170324 | [Application \| Application Details \| Work Queue States \| Cancelled](./US-170324-application-application-details-work-queue-states-cancelled.md) | Done |
| 173274 | [Application \| Application Details \| Start/Begin review Button](./US-173274-application-application-details-start-begin-review-button.md) | Done |
| 174199 | [Application \| Application Details \| Work Queue States \| IN PROGRESS](./US-174199-application-application-details-work-queue-states-in-progress.md) | Done |
| 174571 | [Application \| Application Details \| Work Queue States \| Waiting for customer information](./US-174571-application-application-details-work-queue-states-waiting-for-customer-informati.md) | Done |
| 174573 | [Application \| Application Details \| Work Queue States \| Internal referral](./US-174573-application-application-details-work-queue-states-internal-referral.md) | Done |
| 174578 | [Application \| Application Details \| Work Queue States \| Suspended](./US-174578-application-application-details-work-queue-states-suspended.md) | Done |
| 174583 | [Application \| Application Details \| Work Queue States \| Active](./US-174583-application-application-details-work-queue-states-active.md) | Done |
| 174586 | [Application \| Application Details \| Work Queue States \| Request support evidence](./US-174586-application-application-details-work-queue-states-request-support-evidence.md) | Done |
| 174588 | [Application \| Application Details \| Work Queue States \| On-Hold](./US-174588-application-application-details-work-queue-states-on-hold.md) | Done |
| 174590 | [Application \| Application Details \| Work Queue States \| Print](./US-174590-application-application-details-work-queue-states-print.md) | Done |
| 174591 | [Application \| Application Details \| Work Queue States \| Due To Be Closed](./US-174591-application-application-details-work-queue-states-due-to-be-closed.md) | Done |
| 174592 | [Application \| Application Details \| Work Queue States \| Address Challenge Approved](./US-174592-application-application-details-work-queue-states-address-challenge-approved.md) | Done |
| 174594 | [Application \| Application Details \| Work Queue States \| Change Zone](./US-174594-application-application-details-work-queue-states-change-zone.md) | Done |
| 174596 | [Application \| Application Details \| Work Queue States \| Change Address Challenge](./US-174596-application-application-details-work-queue-states-change-address-challenge.md) | Done |
| 174601 | [Application \| Application Details \| Work Queue States \| Payment Failed](./US-174601-application-application-details-work-queue-states-payment-failed.md) | Done |
| 174604 | [Application \| Application Details \| Work Queue States \| Reinstate](./US-174604-application-application-details-work-queue-states-reinstate.md) | Done |
| 174605 | [Application \| Application Details \| Work Queue States \| Activate](./US-174605-application-application-details-work-queue-states-activate.md) | Done |
| 174607 | [Application \| Application Details \| Work Queue States \| Reactivate](./US-174607-application-application-details-work-queue-states-reactivate.md) | Done |
| 193136 | [Application \| Application Details \| Change Address (system) By BO - same zone](./US-193136-application-application-details-change-address-system-by-bo-same-zone.md) | Done |

## Users (57 stories)

Roles & Permissions, System Users, Applicants ? CRUD, bulk actions, vehicles, documents, emails, blue badge

| Story ID | Title | State |
|----------|-------|-------|
| 109916 | [Roles & Permissions - List Screen & Default User Roles](./US-109916-roles-permissions-list-screen-default-user-roles.md) | Done |
| 110230 | [Roles and Permissions List Screen - Search](./US-110230-roles-and-permissions-list-screen-search.md) | Done |
| 110232 | [Roles and Permissions List Screen - Edit / Delete](./US-110232-roles-and-permissions-list-screen-edit-delete.md) | Done |
| 110233 | [Create New User Role](./US-110233-create-new-user-role.md) | Done |
| 110410 | [System Users List](./US-110410-system-users-list.md) | Done |
| 110411 | [Applicants - List Screen](./US-110411-applicants-list-screen.md) | Done |
| 111158 | [Create System User - General Informations](./US-111158-create-system-user-general-informations.md) | Done |
| 111165 | [Create System User - Configurations](./US-111165-create-system-user-configurations.md) | Done |
| 111166 | [System Users -View / Edit \| Configurations](./US-111166-system-users-view-edit-configurations.md) | Done |
| 111167 | [System Users - View Details \| Audit](./US-111167-system-users-view-details-audit.md) | Done |
| 111168 | [Applicant User - Create](./US-111168-applicant-user-create.md) | Done |
| 111170 | [View Applicant Details - Basic Information](./US-111170-view-applicant-details-basic-information.md) | Done |
| 111211 | [Applicants List Screen - Bulk Action Buttons](./US-111211-applicants-list-screen-bulk-action-buttons.md) | Done |
| 111212 | [Applicants \| Bulk Action - Send Confirmation Email](./US-111212-applicants-bulk-action-send-confirmation-email.md) | Done |
| 111214 | [Applicants \| Bulk Action - Reset Password](./US-111214-applicants-bulk-action-reset-password.md) | Done |
| 111325 | [System Users - View / Edit Overview Information](./US-111325-system-users-view-edit-overview-information.md) | Done |
| 111848 | [Create System User - Agent Assist](./US-111848-create-system-user-agent-assist.md) | Done |
| 113759 | [System User List - Search & Filter](./US-113759-system-user-list-search-filter.md) | Done |
| 113760 | [Applicants List - 'Action' Column](./US-113760-applicants-list-action-column.md) | Done |
| 113767 | [Applicant User Creation - Confirmation Email](./US-113767-applicant-user-creation-confirmation-email.md) | Done |
| 113943 | [View Applicant Details - Basic Info / Overview \| Edit](./US-113943-view-applicant-details-basic-info-overview-edit.md) | Done |
| 113974 | [View Applicant Details - Applications](./US-113974-view-applicant-details-applications.md) | Done |
| 125495 | [Applicants \| Bulk Action - Redact](./US-125495-applicants-bulk-action-redact.md) | Done |
| 126138 | [Applicant Details - Applications \| View Option & Overview (Zonal)](./US-126138-applicant-details-applications-view-option-overview-zonal.md) | Done |
| 128870 | [Applicant Details - Applications \| Documents](./US-128870-applicant-details-applications-documents.md) | Done |
| 129597 | [Applicant Details - Application Overview Details (Non-Zonal)](./US-129597-applicant-details-application-overview-details-non-zonal.md) | Done |
| 129844 | [Applicant Details - Applications \| Vehicles](./US-129844-applicant-details-applications-vehicles.md) | Done |
| 130534 | [View Applicant Details \| Audit Log](./US-130534-view-applicant-details-audit-log.md) | Done |
| 130535 | [View Applicant Details \| Vehicles - List, Add to Favorites](./US-130535-view-applicant-details-vehicles-list-add-to-favorites.md) | Done |
| 130536 | [View Applicant Details \| Document](./US-130536-view-applicant-details-document.md) | Done |
| 132412 | [View Applicant Details \| Add Personal Vehicle](./US-132412-view-applicant-details-add-personal-vehicle.md) | Done |
| 132541 | [View Applicant Details \| Document - Download, Delete Actions](./US-132541-view-applicant-details-document-download-delete-actions.md) | Done |
| 133259 | [View Applicant Details \| Vehicles - Delete & Multi Select Delete](./US-133259-view-applicant-details-vehicles-delete-multi-select-delete.md) | Done |
| 133260 | [View Applicant Details \| Vehicles List - Search & Filter](./US-133260-view-applicant-details-vehicles-list-search-filter.md) | Done |
| 133486 | [View Applicant Details - Emails List](./US-133486-view-applicant-details-emails-list.md) | Done |
| 133707 | [View Applicant Details \| Document - Add and Replace](./US-133707-view-applicant-details-document-add-and-replace.md) | Done |
| 134684 | [View Applicant Details - Send Email](./US-134684-view-applicant-details-send-email.md) | Done |
| 135101 | [View Applicant Details \| Vehicles - Edit](./US-135101-view-applicant-details-vehicles-edit.md) | Done |
| 135102 | [View Applicant Details \| Vehicles - Add to Temporary](./US-135102-view-applicant-details-vehicles-add-to-temporary.md) | Done |
| 135646 | [View Applicant Details & Applications Tab \| Document - Clickable Files](./US-135646-view-applicant-details-applications-tab-document-clickable-files.md) | Done |
| 135764 | [Access Control Based on Assigned Roles and Permissions in the System](./US-135764-access-control-based-on-assigned-roles-and-permissions-in-the-system.md) | Done |
| 136311 | [Applicant Details - Applications \| Documents - Download & Delete](./US-136311-applicant-details-applications-documents-download-delete.md) | Done |
| 136314 | [Applicant Details - Applications \| Documents - Replace document](./US-136314-applicant-details-applications-documents-replace-document.md) | Done |
| 136315 | [Applicant Details - Applications \| Documents - Add or Upload Document](./US-136315-applicant-details-applications-documents-add-or-upload-document.md) | Done |
| 137191 | [View Applicant Details \| Add Vehicle - Select Vehicle Type / Category](./US-137191-view-applicant-details-add-vehicle-select-vehicle-type-category.md) | Done |
| 143610 | [View Applicant Details \| Add Personal Vehicles - Upload Document](./US-143610-view-applicant-details-add-personal-vehicles-upload-document.md) | Done |
| 143612 | [View Applicant Details \| Add Visitors Vehicles](./US-143612-view-applicant-details-add-visitors-vehicles.md) | Done |
| 144329 | [View Applicant Details - Open Email from List](./US-144329-view-applicant-details-open-email-from-list.md) | Done |
| 144618 | [Applicant Details - Applications \| Vehicles \| Change Vehicle Validation](./US-144618-applicant-details-applications-vehicles-change-vehicle-validation.md) | Done |
| 148242 | [View Applicant Details - Send Email \| Save as Draft](./US-148242-view-applicant-details-send-email-save-as-draft.md) | Done |
| 157152 | [View Applicant Details \| Overview \| Add Blue Badge](./US-157152-view-applicant-details-overview-add-blue-badge.md) | Done |
| 157221 | [View Applicant Details \| Overview \| Edit Blue Badge](./US-157221-view-applicant-details-overview-edit-blue-badge.md) | Done |
| 164195 | [View Applicant Details - Show CC Email Address in Opened Email](./US-164195-view-applicant-details-show-cc-email-address-in-opened-email.md) | Done |
| 168775 | [Applicant User \| Create \| Option for Paper Reminder](./US-168775-applicant-user-create-option-for-paper-reminder.md) | Done |
| 186125 | [Applicant List - Action Column \| Reset Password Email](./US-186125-applicant-list-action-column-reset-password-email.md) | Done |
| 205542 | [View Applicant Details - Applications - Dynamic Rendering](./US-205542-view-applicant-details-applications-dynamic-rendering.md) | Done |
| 217550 | [Global Search to be implemented with Equal, Contains Operator](./US-217550-global-search-to-be-implemented-with-equal-contains-operator.md) | Done |

## Permission Setup > Group (4 stories)

Permission groups ? list, create, edit, delete

| Story ID | Title | State |
|----------|-------|-------|
| 132514 | [Permission Setup - Groups \| List Screen](./US-132514-permission-setup---groups-list-screen.md) | Done |
| 132523 | [Permission Setup - Create Group](./US-132523-permission-setup---create-group.md) | Done |
| 132545 | [Permission Setup - Edit & View Groups](./US-132545-permission-setup---edit-view-groups.md) | Done |
| 135883 | [Permission Setup - Groups \| Single & Multi Select - Delete](./US-135883-permission-setup---groups-single-multi-select---delete.md) | Done |

## Permission Setup > Permission Builder (54 stories)

Permission configuration ? overview, rules, pricing, vehicles, zones, templates, renewals, special events

| Story ID | Title | State |
|----------|-------|-------|
| 25030 | [Configure Permissions - Permissions Tab \| Merchant Settings](./US-25030-configure-permissions---permissions-tab-merchant-settings.md) | Done |
| 25052 | [Permission Setup \| Rules \| Auto Approval Settings](./US-25052-permission-setup-rules-auto-approval-settings.md) | Done |
| 25058 | [Permission setup \| Builder \| Discount Settings](./US-25058-permission-setup-builder-discount-settings.md) | Done |
| 25067 | [Permission setup \| Builder \| Documents Type Settings](./US-25067-permission-setup-builder-documents-type-settings.md) | Done |
| 132390 | [Configure Permissions \| Permissions Tab – Overview \| Start Date Settings](./US-132390-configure-permissions-permissions-tab-overview-start-date-se.md) | Done |
| 132566 | [Permission Setup - Builder \| List Screen](./US-132566-permission-setup---builder-list-screen.md) | Done |
| 132611 | [Permission Setup \| Builder  - Create Permission](./US-132611-permission-setup-builder---create-permission.md) | Done |
| 135717 | [Configure Permissions \| Permissions Tab - Overview \| Terms & Conditions](./US-135717-configure-permissions-permissions-tab---overview-terms-condi.md) | Ready for UAT |
| 135718 | [Configure Permissions \| Permissions Tab – Sub Menus or Sections](./US-135718-configure-permissions-permissions-tab-sub-menus-or-sections.md) | Done |
| 135720 | [Configure Permissions \| Setup Screen and Tabs](./US-135720-configure-permissions-setup-screen-and-tabs.md) | Done |
| 135721 | [Configure Permissions \| Permissions Tab - Overview \| Prefix](./US-135721-configure-permissions-permissions-tab---overview-prefix.md) | Done |
| 135723 | [Configure Permissions - Permissions Tab \| Payments Settings](./US-135723-configure-permissions---permissions-tab-payments-settings.md) | Done |
| 136288 | [Permission Setup - Builder \| Single/Multi Select - Delete](./US-136288-permission-setup---builder-singlemulti-select---delete.md) | Done |
| 137749 | [Application Number Generation Based on Prefix](./US-137749-application-number-generation-based-on-prefix.md) | Done |
| 137750 | [Configure Permissions \| Permissions Tab - Overview \| Retention Period for Expired Permits](./US-137750-configure-permissions-permissions-tab---overview-retention-p.md) | Done |
| 138267 | [Configure Permissions \| Permissions Tab - Overview \| Set of check boxes](./US-138267-configure-permissions-permissions-tab---overview-set-of-chec.md) | Done |
| 138832 | [Configure Permissions \| Permissions Tab - Overview \| Display Description](./US-138832-configure-permissions-permissions-tab---overview-display-des.md) | Ready for UAT |
| 139062 | [Configure Permissions \| Permissions Tab \| Permission Info in Basic Info Section](./US-139062-configure-permissions-permissions-tab-permission-info-in-bas.md) | Done |
| 142348 | [Permission Setup \| Builder \| Rules Tab \| Vehicle Settings](./US-142348-permission-setup-builder-rules-tab-vehicle-settings.md) | Done |
| 142384 | [Permission Setup \| Builder \| Rules Tab\| Template Settings \| White Mail Reminder](./US-142384-permission-setup-builder-rules-tab-template-settings-white-m.md) | Done |
| 142761 | [Permissions Setup \| Builder \| Rules - Refund Settings](./US-142761-permissions-setup-builder-rules---refund-settings.md) | Done |
| 142840 | [Configure Permissions \| Permissions Tab \| Enable and Configure Permissions Renewal](./US-142840-configure-permissions-permissions-tab-enable-and-configure-p.md) | Done |
| 142854 | [Configure Permissions \| Permissions Tab \| Configure Email Reminders](./US-142854-configure-permissions-permissions-tab-configure-email-remind.md) | Done |
| 142857 | [Configure Permissions \| Permissions Tab \| Configure SMS Reminders](./US-142857-configure-permissions-permissions-tab-configure-sms-reminder.md) | Done |
| 142920 | [Permission Rules \| Permission Limit (Non Zonal)](./US-142920-permission-rules-permission-limit-non-zonal.md) | Done |
| 143256 | [Configure Permissions \| Permissions Tab \| Special Event](./US-143256-configure-permissions-permissions-tab-special-event.md) | Done |
| 143764 | [Configure Permissions \| Permission Tab \| Email Template](./US-143764-configure-permissions-permission-tab-email-template.md) | Done |
| 148756 | [Configure Permissions \| Permission Tab \| Payment Settings \| Help Description](./US-148756-configure-permissions-permission-tab-payment-settings-help-d.md) | Done |
| 148820 | [Configure Permissions \| Permission Tab \| Discount Settings \| Help Description](./US-148820-configure-permissions-permission-tab-discount-settings-help-.md) | Done |
| 155975 | [Permission Setup - Builder \| Publish](./US-155975-permission-setup---builder-publish.md) | Done |
| 156658 | [Permission Setup - Builder \| Clone](./US-156658-permission-setup---builder-clone.md) | Done |
| 157621 | [Permission Setup - Builder \| Unpublish](./US-157621-permission-setup---builder-unpublish.md) | Done |
| 158023 | [Permission Setup \| Builder \| Rules Tab \| Template setting \| Insert merge fields](./US-158023-permission-setup-builder-rules-tab-template-setting-insert-m.md) | Done |
| 160551 | [Configure Permissions \| Permission Tab \| Visitor Portal Settings](./US-160551-configure-permissions-permission-tab-visitor-portal-settings.md) | Done |
| 161880 | [Permission set up \| Zone mapping](./US-161880-permission-set-up-zone-mapping.md) | Done |
| 163010 | [Permission \| Rules \| Map Pricing](./US-163010-permission-rules-map-pricing.md) | Done |
| 164476 | [Permission Setup \| Builder \| Rules \| Template Settings \| Print Physical Permission](./US-164476-permission-setup-builder-rules-template-settings-print-physi.md) | Done |
| 164796 | [Unsaved Changes Warning on Navigation](./US-164796-unsaved-changes-warning-on-navigation.md) | Done |
| 165020 | [Permission setup \| General setting \| Configure admin fees for permission](./US-165020-permission-setup-general-setting-configure-admin-fees-for-pe.md) | Done |
| 165050 | [Permission set up \| Vehicle settings \| Toggle to accommodate one or more vehicles per permission](./US-165050-permission-set-up-vehicle-settings-toggle-to-accommodate-one.md) | Done |
| 168777 | [Permission Tab \| Renewal & Reminder settings \| Configure Paper Reminders](./US-168777-permission-tab-renewal-reminder-settings-configure-paper-rem.md) | Done |
| 172690 | [Pricing \| Amendments](./US-172690-pricing-amendments.md) | Done |
| 177544 | [Grace period for expired permission](./US-177544-grace-period-for-expired-permission.md) | Done |
| 179406 | [Free Permission Option](./US-179406-free-permission-option.md) | Done |
| 179544 | [Permission set up \| Tab - Application Form](./US-179544-permission-set-up-tab---application-form.md) | Done |
| 180626 | [Permission set up \| Zone mapping changes](./US-180626-permission-set-up-zone-mapping-changes.md) | Done |
| 181519 | [Permission label configuration](./US-181519-permission-label-configuration.md) | Done |
| 187108 | [Configure Permissions \| Permissions Tab \| Special Events Properties Mapping](./US-187108-configure-permissions-permissions-tab-special-events-propert.md) | Done |
| 187109 | ["Count of Vehicles allowed" Field inclusion](./US-187109-count-of-vehicles-allowed-field-inclusion.md) | Done |
| 187217 | [Configure Permissions \| Permissions Tab \| Special Events Pricing](./US-187217-configure-permissions-permissions-tab-special-events-pricing.md) | Done |
| 187648 | [Vehicle settings \| Eligible vehicle for permission set as optional](./US-187648-vehicle-settings-eligible-vehicle-for-permission-set-as-opti.md) | Done |
| 188673 | [Configure Permissions \| Permissions Tab - Overview \| Modify Duplicate Validation for Prefix Configuration](./US-188673-configure-permissions-permissions-tab---overview-modify-dupl.md) | Done |
| 195193 | [Scratch card pricing settings](./US-195193-scratch-card-pricing-settings.md) | Done |
| 198805 | [Visitor Portal Setting \| Permission Builder \| Start Session at Start of the Day](./US-198805-visitor-portal-setting-permission-builder-start-session-at-s.md) | Done |

## Templates (16 stories)

Document Types, Terms & Conditions, Alerts/Tooltips

| Story ID | Title | State |
|----------|-------|-------|
| 140192 | [Templates \| Document types \| List](./US-140192-templates-document-types-list.md) | Done |
| 140263 | [Templates \| Document types \| Create](./US-140263-templates-document-types-create.md) | Done |
| 140407 | [Templates \| Document types \| View & Edit](./US-140407-templates-document-types-view-edit.md) | Done |
| 140463 | [Templates \| Document Types \| Single/Multi Select Delete](./US-140463-templates-document-types-singlemulti-select-delete.md) | Done |
| 140613 | [Templates \| Terms and Conditions \| Create](./US-140613-templates-terms-and-conditions-create.md) | Done |
| 140734 | [Templates \| Terms and Conditions \| List](./US-140734-templates-terms-and-conditions-list.md) | Done |
| 140752 | [Templates \| Terms and Conditions \| View \| Edit & Delete](./US-140752-templates-terms-and-conditions-view-edit-delete.md) | Done |
| 142873 | [Templates \| Terms and Condition \| Single/Multi select Delete](./US-142873-templates-terms-and-condition-singlemulti-select-delete.md) | Done |
| 147164 | [Templates \| Alerts & Tooltips \| Customer Notification](./US-147164-templates-alerts-tooltips-customer-notification.md) | Done |
| 148231 | [Templates \| Alerts & Tooltips \| Cookie](./US-148231-templates-alerts-tooltips-cookie.md) | Done |
| 148290 | [Templates \| Alerts & Tooltips \| Property](./US-148290-templates-alerts-tooltips-property.md) | Done |
| 148676 | [Templates \| Alert & Tooltips \| Experian](./US-148676-templates-alert-tooltips-experian.md) | Done |
| 160624 | [Templates \| Document Types \| Add Sub Type Field Should Be Mandatory - Create & Edit](./US-160624-templates-document-types-add-sub-type-field-should-be-mandat.md) | Done |
| 160695 | [Templates \| Terms and Conditions \| Validation of Edit Permission Types Based on Publish Status](./US-160695-templates-terms-and-conditions-validation-of-edit-permission.md) | Done |
| 162891 | [Templates \| Alert & Tooltips \|Toaster Message](./US-162891-templates-alert-tooltips-toaster-message.md) | Done |
| 164802 | [Template \| Document type validity configuration on renewal](./US-164802-template-document-type-validity-configuration-on-renewal.md) | Done |

## MNPS Template Settings (8 stories)

MNPS-level email/notification templates ? create, edit, merge fields, defaults

| Story ID | Title | State |
|----------|-------|-------|
| 141488 | [Templates \| Email \| Create \| MNPS](./US-141488-templates-email-create-mnps.md) | Done |
| 141683 | [Templates \| Email \| Edit \| MNPS](./US-141683-templates-email-edit-mnps.md) | Done |
| 141784 | [Templates \| Email \| List & Preview \| Apply](./US-141784-templates-email-list-preview-apply.md) | Done |
| 148624 | [Template \| Email \| Merge Fields \| MNPS](./US-148624-template-email-merge-fields-mnps.md) | Done |
| 153121 | [Templates \| Email \| Set default toggle for email template (create & edit) \| MNPS](./US-153121-templates-email-set-default-toggle-for-email-template-create-edit-mnps.md) | Done |
| 161872 | [Send Notification Emails from Selected Sender Address](./US-161872-send-notification-emails-from-selected-sender-address.md) | Done |
| 164253 | [Template \| Email \| Add WHITE MAIL REMINDER Notification Template](./US-164253-template-email-add-white-mail-reminder-notification-template.md) | Done |
| 173464 | [Add Additional Notification Template \| MNPS](./US-173464-add-additional-notification-template-mnps.md) | Done |

## Print (10 stories)

Physical permission printing, white mail reminders, print partner integration

| Story ID | Title | State |
|----------|-------|-------|
| 27234 | [Print \| White Mail Reminder \| Send to Print](./US-27234-print-white-mail-reminder-send-to-print.md) | Done |
| 165549 | [Print \| Physical Permission \| list Screen](./US-165549-print-physical-permission-list-screen.md) | Done |
| 165551 | [Print \| Physical Permission \| Preview](./US-165551-print-physical-permission-preview.md) | Done |
| 165553 | [Print \| Physical Permission \| Download](./US-165553-print-physical-permission-download.md) | Done |
| 167242 | [Print \| Physical Permission \| Send to Print](./US-167242-print-physical-permission-send-to-print.md) | Done |
| 167835 | [Print \| White Mail Reminder \| Grid](./US-167835-print-white-mail-reminder-grid.md) | Done |
| 167911 | [Print \| White Mail Reminder \| Preview](./US-167911-print-white-mail-reminder-preview.md) | Done |
| 169331 | [Print \| White Mail Reminder \| Download](./US-169331-print-white-mail-reminder-download.md) | Done |
| 175825 | [Print Partner Implementation - White mail reminder](./US-175825-print-partner-implementation-white-mail-reminder.md) | Done |
| 175827 | [Print Partner Implementation \| Physical Permission](./US-175827-print-partner-implementation-physical-permission.md) | Done |

## Area (35 stories)

Streets (white/black list), Zones, Locations, bulk import, special events

| Story ID | Title | State |
|----------|-------|-------|
| 125471 | [Street and Property creation](./US-125471-street-and-property-creation.md) | Done |
| 125847 | [Grid View of street \| White List](./US-125847-grid-view-of-street-white-list.md) | Done |
| 125848 | [Bulk Upload & Import \| street import](./US-125848-bulk-upload-import-street-import.md) | Done |
| 126513 | [Edit street](./US-126513-edit-street.md) | Done |
| 130655 | [Enable Zone selection for the street](./US-130655-enable-zone-selection-for-the-street.md) | Done |
| 130662 | [Ability to blacklist the street](./US-130662-ability-to-blacklist-the-street.md) | Done |
| 130663 | [Delete street [Bulk Delete]](./US-130663-delete-street-bulk-delete.md) | Done |
| 132513 | [Blacklisted Streets: List, Remove from blacklist](./US-132513-blacklisted-streets-list-remove-from-blacklist.md) | Done |
| 132973 | [Area \| Zone - List Screen](./US-132973-area-zone---list-screen.md) | Done |
| 134012 | [Area \| Location - List Screen](./US-134012-area-location---list-screen.md) | Done |
| 135490 | [Area \| Location - Edit & Map Properties](./US-135490-area-location---edit-map-properties.md) | Done |
| 136159 | [Blacklist \| View & Edit](./US-136159-blacklist-view-edit.md) | Done |
| 140145 | [Area \| Zone \| Single/Multi Select Publish](./US-140145-area-zone-singlemulti-select-publish.md) | Done |
| 140146 | [Area \| Zone \| Single/Multiselect Unpublish](./US-140146-area-zone-singlemultiselect-unpublish.md) | Done |
| 140166 | [Area \| View & Manage Zone \| Streets Tab](./US-140166-area-view-manage-zone-streets-tab.md) | Done |
| 140170 | [Area \| View & Manage Zone \| Permissions Tab](./US-140170-area-view-manage-zone-permissions-tab.md) | Done |
| 140180 | [Area \| View & Manage Zone \| Edit Permissions Tab](./US-140180-area-view-manage-zone-edit-permissions-tab.md) | Done |
| 142478 | [Area \| Location - Create](./US-142478-area-location---create.md) | Done |
| 143508 | [Automatically Add Street to Whitelist After Expiry](./US-143508-automatically-add-street-to-whitelist-after-expiry.md) | Done |
| 143529 | [Street View screen \| Search, filter, column picker, pagination enablement](./US-143529-street-view-screen-search-filter-column-picker-pagination-en.md) | Done |
| 144829 | [Area \| Location - View Screen](./US-144829-area-location---view-screen.md) | Done |
| 144850 | [Delete Location](./US-144850-delete-location.md) | Done |
| 148740 | [Bulk Import \| Download Sample](./US-148740-bulk-import-download-sample.md) | Done |
| 148746 | [Bulk Import \| Area config \| Creation and Mapping of street and properties.](./US-148746-bulk-import-area-config-creation-and-mapping-of-street-and-p.md) | Done |
| 149117 | [Area Configurations \| Zone creation in apply](./US-149117-area-configurations-zone-creation-in-apply.md) | Done |
| 151336 | [Area \| Zone \| Edit Zone & Mapped streets](./US-151336-area-zone-edit-zone-mapped-streets.md) | Done |
| 151343 | [Area \| Zone \| Single/Multi Select Delete](./US-151343-area-zone-singlemulti-select-delete.md) | Done |
| 152642 | [Area \| Zone \| Action menu](./US-152642-area-zone-action-menu.md) | Done |
| 157253 | [Area \| Zone \| Mapping Street in zone creation](./US-157253-area-zone-mapping-street-in-zone-creation.md) | Done |
| 163636 | [Area \| Zone \| Configure Non Enforceable Time](./US-163636-area-zone-configure-non-enforceable-time.md) | Done |
| 163644 | [Area \| Zone \| Publish & Delete Pop up validation](./US-163644-area-zone-publish-delete-pop-up-validation.md) | Done |
| 171259 | [Unsaved Changes Warning on Navigation \| Menus](./US-171259-unsaved-changes-warning-on-navigation-menus.md) | Done |
| 177655 | [Enable Address Challenge Permission](./US-177655-enable-address-challenge-permission.md) | Done |
| 178185 | [Bulk Import \| Zone and locations](./US-178185-bulk-import-zone-and-locations.md) | Done |
| 181541 | [Street \| Property blacklist](./US-181541-street-property-blacklist.md) | Done |

## Reports (3 stories)

Application NFI, financial income, diesel surcharge reports

| Story ID | Title | State |
|----------|-------|-------|
| 193378 | [Report \| Application \| NFI](./US-193378-report-application-nfi.md) | Done |
| 193405 | [Report \| Financial \| Income](./US-193405-report-financial-income.md) | Done |
| 193410 | [Report \| Financial \| Diesel Surcharge](./US-193410-report-financial-diesel-surcharge.md) | Done |

## System Audit (3 stories)

System-wide audit log, filtering, event categories

| Story ID | Title | State |
|----------|-------|-------|
| 161321 | [System Audits](./US-161321-system-audits.md) | Done |
| 165516 | [System Audits List Screen \| Filter Option](./US-165516-system-audits-list-screen-filter-option.md) | Done |
| 177477 | [Events Revisiting - Update Categories, Event Name, Description](./US-177477-events-revisiting-update-categories-event-name-description.md) | Done |

## Contract Settings (21 stories)

Toggles and configuration ? USRN/UPRN, DOB, vehicles, pricing, blue badge, diesel, closure, merchant, etc.

| Story ID | Title | State |
|----------|-------|-------|
| 113702 | [Blue Badge Limit & Visitor Permit Settings](./US-113702-blue-badge-limit-visitor-permit-settings.md) | Done |
| 129426 | [USRN and UPRN toggle settings](./US-129426-usrn-and-uprn-toggle-settings.md) | Done |
| 129427 | [DOB (Date of Birth) toggle settings](./US-129427-dob-date-of-birth-toggle-settings.md) | Done |
| 129428 | [Vehicle fields toggle settings](./US-129428-vehicle-fields-toggle-settings.md) | Done |
| 129756 | [Data Sharing Policy & Cookie Policy Fields - Contract Settings](./US-129756-data-sharing-policy-cookie-policy-fields---contract-settings.md) | Done |
| 142892 | [Diesel Surcharge  toggle](./US-142892-diesel-surcharge-toggle.md) | Done |
| 142905 | [Tier Pricing toggle](./US-142905-tier-pricing-toggle.md) | Done |
| 143071 | [Enable SMS Reminder - Contract Settings](./US-143071-enable-sms-reminder---contract-settings.md) | Done |
| 151215 | [Configure Temporary Vehicle Days](./US-151215-configure-temporary-vehicle-days.md) | Done |
| 151422 | [Contract settings \| Apply \| Price Alert Configuration](./US-151422-contract-settings-apply-price-alert-configuration.md) | Done |
| 157592 | [Configure Version History Retention Period](./US-157592-configure-version-history-retention-period.md) | Done |
| 161638 | [Configure Expiration of Supporting Documentation](./US-161638-configure-expiration-of-supporting-documentation.md) | Done |
| 162363 | [Configure Permission Closure](./US-162363-configure-permission-closure.md) | Done |
| 162923 | [Keep tier pricing at original rate](./US-162923-keep-tier-pricing-at-original-rate.md) | Done |
| 162927 | [Enable Blue Badge Toggle](./US-162927-enable-blue-badge-toggle.md) | Done |
| 163196 | [Admin fee configuration for permission](./US-163196-admin-fee-configuration-for-permission.md) | Done |
| 164270 | [Merchant Settings](./US-164270-merchant-settings.md) | Done |
| 165048 | [Experian \| Pass score set up](./US-165048-experian-pass-score-set-up.md) | Done |
| 173473 | [Configure permission closure for support evidence](./US-173473-configure-permission-closure-for-support-evidence.md) | Done |
| 179095 | [Visitor Portal settings](./US-179095-visitor-portal-settings.md) | Done |
| 179416 | [Redact Retention period](./US-179416-redact-retention-period.md) | Done |

## MNPS Contract Settings (14 stories)

MNPS-level contract config ? apply settings, toggles (PCN, Experian, Autoguru, Illumin8, Print), reject reasons, timezone

| Story ID | Title | State |
|----------|-------|-------|
| 108776 | [Changes required in MNPS BO for including "Apply" settings.](./US-108776-changes-required-in-mnps-bo-for-including-apply-settings.md) | Done |
| 151120 | [Add New Field for Permission Email under MNPS BO 'Apply' Settings.](./US-151120-add-new-field-for-permission-email-under-mnps-bo-apply-settings.md) | Done |
| 162391 | [PCN Lookup Toggle](./US-162391-pcn-lookup-toggle.md) | Done |
| 162928 | [Enable Experian Toggle](./US-162928-enable-experian-toggle.md) | Done |
| 163729 | [Enable Agent Assists Toggle](./US-163729-enable-agent-assists-toggle.md) | Done |
| 164800 | [Enable Auto-guru toggle](./US-164800-enable-auto-guru-toggle.md) | Done |
| 164946 | [PCN Lookup \| Contract Mapping](./US-164946-pcn-lookup-contract-mapping.md) | Done |
| 164949 | [Enable Illumin8 Toggle](./US-164949-enable-illumin8-toggle.md) | Done |
| 170283 | [Reject Reason \| Grid & Create](./US-170283-reject-reason-grid-create.md) | Done |
| 170286 | [Reject Reason \| Edit&Delete](./US-170286-reject-reason-edit-delete.md) | Done |
| 170290 | [Reject Reason \| Upload CSV & Export](./US-170290-reject-reason-upload-csv-export.md) | Done |
| 172571 | [Print Toggle](./US-172571-print-toggle.md) | Done |
| 187360 | [Applications \| Contract setting \| Apply \| FPN Lookup Toggle enable with contract mapping](./US-187360-applications-contract-setting-apply-fpn-lookup-toggle-enable-with-contract-mappi.md) | Done |
| 188818 | [Time Zone Implementation](./US-188818-time-zone-implementation.md) | Done |

## Email (5 stories)

Email broadcasting ? compose, merge fields, save draft, send

| Story ID | Title | State |
|----------|-------|-------|
| 111213 | [Applicants \| Email Broadcasting & Select Applicants Manually](./US-111213-applicants-email-broadcasting-select-applicants-manually.md) | Done |
| 151625 | [Email Broadcasting - Compose Email](./US-151625-email-broadcasting-compose-email.md) | Done |
| 151626 | [Email Broadcasting \| Validate & Send for Manually Selected User Accounts](./US-151626-email-broadcasting-validate-send-for-manually-selected-user-accounts.md) | Done |
| 162333 | [Email Broadcasting - Compose Email \| Select Merge Fields](./US-162333-email-broadcasting-compose-email-select-merge-fields.md) | Done |
| 162334 | [Email Broadcasting - Compose Email \| Save as Draft](./US-162334-email-broadcasting-compose-email-save-as-draft.md) | Done |

## Pricing (2 stories)

Permission setup menu, pricing menu

| Story ID | Title | State |
|----------|-------|-------|
| 132511 | [Permission Setup - Menu](./US-132511-permission-setup-menu.md) | Done |
| 143252 | [Pricing menu](./US-143252-pricing-menu.md) | Done |

## Buy Now (18 stories)

Application purchase flow ? dynamic permission types, form tabs (address, document, vehicle, price, checkout), scratch cards, non-zonal

| Story ID | Title | State |
|----------|-------|-------|
| 132580 | [View Applicant Details - Applications \| Buy Now - Dynamic permission type](./US-132580-view-applicant-details-applications-buy-now-dynamic-permission-type.md) | Done |
| 158339 | [Fetch and Auto-populate Vehicle Details via Autoguru API](./US-158339-fetch-and-auto-populate-vehicle-details-via-autoguru-api.md) | Ready for UAT |
| 168818 | [Default template \| Application Form \| Resident permit \| Address tab](./US-168818-default-template-application-form-resident-permit-address-tab.md) | Done |
| 169081 | [Default template \| Application form \| Visitor Permission \| Address tab](./US-169081-default-template-application-form-visitor-permission-address-tab.md) | Done |
| 176992 | [Default template \| Application Form \| Resident permit \| Document tab](./US-176992-default-template-application-form-resident-permit-document-tab.md) | Done |
| 176993 | [Default template \| Application Form \| Resident permit \| Vehicle details - AutoGuru Dependency](./US-176993-default-template-application-form-resident-permit-vehicle-details-autoguru-depen.md) | Done |
| 180319 | [Temporary permission scenario](./US-180319-temporary-permission-scenario.md) | Done |
| 180799 | [Default template \| Application form \| Visitor Permission \| Document tab](./US-180799-default-template-application-form-visitor-permission-document-tab.md) | Done |
| 180803 | [Default template \| Application form \| Visitor Permission \| Price&Checkout tab](./US-180803-default-template-application-form-visitor-permission-price-checkout-tab.md) | Done |
| 190107 | [Default Template \| Application Form \|Visitor Permission \| Price Tab - Discount](./US-190107-default-template-application-form-visitor-permission-price-tab-discount.md) | Done |
| 193418 | [Default template \| Application Form \| Resident permit \| Price](./US-193418-default-template-application-form-resident-permit-price.md) | Done |
| 193671 | [Default template \| Application Form \| Resident permit \| Checkout](./US-193671-default-template-application-form-resident-permit-checkout.md) | Done |
| 194957 | [Default template \| Application form \| Scratch cards (except price tab)](./US-194957-default-template-application-form-scratch-cards-except-price-tab.md) | Done |
| 195824 | [Scratch card application expiry](./US-195824-scratch-card-application-expiry.md) | Done |
| 195830 | [Default template \| Application form \| Non - Zonal permit (car park permit)](./US-195830-default-template-application-form-non-zonal-permit-car-park-permit.md) | Done |
| 200036 | [Tier Pricing scenario \| Cancelled/Rejected/WaitingList/Expired application](./US-200036-tier-pricing-scenario-cancelled-rejected-waitinglist-expired-application.md) | Done |
| 201786 | [Default template \| Application form \| Scratch cards \| Price tab](./US-201786-default-template-application-form-scratch-cards-price-tab.md) | Done |
| 205913 | [View Applicant Details - Applications \| Buy Now - Application details](./US-205913-view-applicant-details-applications-buy-now-application-details.md) | Done |

---

## Automation Scripts

| Script | Purpose |
|--------|---------|
| `create_street.js` | Creates a street with properties via Playwright |
| `permit_agent_master.js` | Full system analysis/audit across all modules |

## Key Business Concepts

| Concept | Description |
|---------|-------------|
| **Street** | A road/area containing properties, identified by USRN |
| **Property** | A building/address within a street, identified by UPRN |
| **USRN** | Unique Street Reference Number (auto or manual per Contract Settings) |
| **UPRN** | Unique Property Reference Number (auto or manual per Contract Settings) |
| **Zone** | A grouping of streets for permit management (must be published to be active) |
| **Permission** | A permit/licence/suspension/exemption applied by a resident |
| **Permission Builder** | Configures permission types ? pricing, rules, zones, vehicles, templates |
| **Permission Limit** | Max permits allowed per property (0-99) |
| **White List** | Approved streets where permits can be applied |
| **Black List** | Restricted streets/properties (time-bound or indefinite) |
| **Work Queue** | Application processing states (Pending ? In Progress ? Approved/Rejected etc.) |
| **Buy Now** | Application purchase flow from applicant's profile |
| **Tier Pricing** | Multiple pricing tiers based on property count |
| **Diesel Surcharge** | Additional charge for diesel vehicles |
| **Blue Badge** | Disability parking badge with proof of evidence |
| **Autoguru** | Vehicle details API (make, model, colour, CO2, euro standard) |
| **Illumin8** | External enforcement system integration |
| **VRM** | Vehicle Registration Mark |
| **PCN/FPN** | Penalty Charge Notice / Fixed Penalty Notice lookups |

## User Roles

| Role | Access Level |
|------|-------------|
| **Super Admin** | Full CRUD on all modules across MNPS and Apply |
| **Contract Admin** | Full CRUD on contract-level settings and all Apply modules |
| **BO Manager** | Back Office team leader ? manage operations and users |
| **BO User** | Limited Back Office access based on role permissions |
| **CEO** | Limited access to specific BO functionalities |
| **Market Inspector** | Field inspection access |
| **Read Only** | View-only across designated modules |
| **Custom** | Configurable permissions per module/sub-menu |
| **Applicant** | Customer/citizen ? applies for permits via Customer Portal |

## Cross-Module Dependencies

| Setting (Source) | Affects (Target) |
|-----------------|------------------|
| Contract Settings ? USRN/UPRN Toggle | Area ? Street/Property creation (auto-generate or manual) |
| Contract Settings ? Blue Badge Toggle | Users ? Applicant overview (show/hide blue badge) |
| Contract Settings ? Vehicle Fields Toggle | Buy Now ? Vehicle form fields visibility |
| Contract Settings ? Diesel Surcharge | Permission Builder ? Pricing calculations |
| Contract Settings ? Tier Pricing | Buy Now ? Price tab calculations |
| Contract Settings ? Merchant Settings | Buy Now ? Checkout payment methods |
| Permission Builder ? Published | Applications ? Available for purchase |
| Permission Builder ? Zone Mapping | Area ? Zone-permission associations |
| Permission Builder ? Document Types | Buy Now / Applications ? Required documents |
| Permission Builder ? Vehicle Settings | Applications ? Vehicle management rules |
| MNPS Contract Settings ? Permission Types | Users ? Roles & Permissions type checkboxes |
| MNPS Template Settings ? Email Templates | Applications ? Workflow email notifications |
| Users ? Role Permissions | All modules ? Menu visibility and CRUD access |
