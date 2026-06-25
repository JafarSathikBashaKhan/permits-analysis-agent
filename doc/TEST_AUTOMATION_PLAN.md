# Feature-Wise Test Automation Plan
## NPS Backoffice — 339 Stories → 18 Modules → ~45 Test Files

> **Principle:** Tests organized by **feature/page**, not by user story.  
> Stories are requirements checklist; tests live in feature files.

---

## 1. Area Module (35 stories → 5 test files)

| Test File | Stories Covered | Scenarios |
|-----------|----------------|-----------|
| `WhiteListStreetTests.cs` | US-125471, US-125847, US-125848, US-140145, US-140146, US-149117, US-151336, US-157253 | Create street, edit, delete, search, pagination, bulk import CSV |
| `BlackListStreetTests.cs` | US-130655, US-130662, US-130663, US-132973 | Blacklist street, remove from blacklist, edit expiry, time-bound expiry |
| `BlackListPropertyTests.cs` | US-134012, US-135490, US-136159 | Blacklist property, remove, edit expiry |
| `ZoneTests.cs` | US-132513, US-140166, US-140170, US-140180, US-142478, US-143508, US-143529, US-148740, US-148746 | Create zone, edit, delete, publish/unpublish, map streets, map permissions |
| `LocationTests.cs` | US-144829, US-144850, US-151343, US-152642, US-163636, US-163644, US-171259, US-177655, US-178185, US-181541 | Create location, edit, delete, map properties, special events |

---

## 2. Applications Module (60 stories → 8 test files)

| Test File | Stories Covered | Scenarios |
|-----------|----------------|-----------|
| `ApplicationGridTests.cs` | ~8 stories | List view, sort, filter, search, pagination, column visibility |
| `ApplicationDetailTests.cs` | ~6 stories | Overview panel, status display, applicant info, side panel |
| `WorkflowActionTests.cs` | ~18 stories | Approve, reject, cancel, suspend, resume, on hold, off hold, in progress, under review, pending approval, mark active/closed/expired, awaiting payment, payment failed |
| `BulkActionTests.cs` | ~4 stories | Bulk approve, bulk reject, bulk cancel, bulk status change |
| `VehicleTabTests.cs` | ~6 stories | Add vehicle, edit, remove, temporary vehicle, Autoguru VRM lookup |
| `DocumentTabTests.cs` | ~5 stories | Upload, view, download, delete document |
| `NotesEmailTabTests.cs` | ~6 stories | Internal notes, applicant-visible notes, compose email, template, merge fields |
| `RenewalTests.cs` | ~4 stories | Renew, extend, cancel renewal, auto-renew |

---

## 3. Work Queue / Status (24 stories → 2 test files)

| Test File | Stories Covered | Scenarios |
|-----------|----------------|-----------|
| `WorkQueueTransitionTests.cs` | ~18 stories | All state transitions: Pending→Approved, Pending→Rejected, InProgress→UnderReview, Active→Suspended, Suspended→Resumed, OnHold→OffHold, AwaitingPayment→Paid/Failed, Cancelled, Expired, NFI |
| `WorkQueueFilterTests.cs` | ~6 stories | Queue filtering, assignment, status filter, date filter |

---

## 4. Users Module (57 stories → 5 test files)

| Test File | Stories Covered | Scenarios |
|-----------|----------------|-----------|
| `RolesPermissionsTests.cs` | ~18 stories | Create role, edit, delete, module-level toggles (view/create/edit/delete), permission types per role, role assignment |
| `SystemUsersCrudTests.cs` | ~10 stories | Create user, edit, delete, search, filter, pagination |
| `SystemUsersLifecycleTests.cs` | ~10 stories | Invite, activate, deactivate, reactivate, role assignment, bulk actions |
| `ApplicantProfileTests.cs` | ~10 stories | View profile, contact details, address, blue badge, email history |
| `ApplicantVehicleDocTests.cs` | ~9 stories | Add/edit/remove vehicle, Autoguru lookup, upload/view/manage documents |

---

## 5. Permission Setup — Groups (4 stories → 1 test file)

| Test File | Stories Covered | Scenarios |
|-----------|----------------|-----------|
| `PermissionGroupTests.cs` | US-132514, US-132523, US-132545, US-135883 | List groups, create, edit, delete, group-permission association |

---

## 6. Permission Setup — Builder (53 stories → 7 test files)

| Test File | Stories Covered | Scenarios |
|-----------|----------------|-----------|
| `BuilderOverviewTests.cs` | ~6 stories | Create permission, name, type, description, status, clone |
| `BuilderRulesTests.cs` | ~8 stories | Max vehicles, min/max duration, permit limits, household limits |
| `BuilderPricingTests.cs` | ~8 stories | Standard pricing, tiered pricing, diesel surcharge, admin fee |
| `BuilderVehicleTests.cs` | ~6 stories | Vehicle type requirements, Autoguru field configuration |
| `BuilderZoneTemplateTests.cs` | ~8 stories | Map zones, link document templates, renewal config |
| `BuilderCustomFieldTests.cs` | ~8 stories | Single select create/edit/delete, multi select create/edit/delete |
| `BuilderPublishTests.cs` | ~6 stories | Publish, unpublish, validation (zone mapping required), special events |

---

## 7. Templates (16 stories → 3 test files)

| Test File | Stories Covered | Scenarios |
|-----------|----------------|-----------|
| `DocumentTypeTests.cs` | ~6 stories | Create, edit, delete document types, assign to permissions |
| `TermsConditionsTests.cs` | ~5 stories | Create, edit, version, assign T&C |
| `AlertTooltipTests.cs` | ~5 stories | Create, edit, delete alerts/tooltips, assign to pages |

---

## 8. MNPS Template Settings (8 stories → 1 test file)

| Test File | Stories Covered | Scenarios |
|-----------|----------------|-----------|
| `MnpsEmailTemplateTests.cs` | 8 stories | Create, edit, delete email templates, merge fields, default toggle, notification templates |

---

## 9. Print (10 stories → 2 test files)

| Test File | Stories Covered | Scenarios |
|-----------|----------------|-----------|
| `PhysicalPermissionTests.cs` | ~6 stories | List, filter, sort, preview, download, send to print, bulk print, print partner |
| `WhiteMailTests.cs` | ~4 stories | Reminder list, send white mail, download |

---

## 10. Reports (3 stories → 1 test file)

| Test File | Stories Covered | Scenarios |
|-----------|----------------|-----------|
| `ReportsTests.cs` | 3 stories | Application NFI report, financial income report, diesel surcharge report |

---

## 11. System Audit (3 stories → 1 test file)

| Test File | Stories Covered | Scenarios |
|-----------|----------------|-----------|
| `SystemAuditTests.cs` | 3 stories | View audit log, filter by date/user/event, event categories |

---

## 12. Contract Settings (21 stories → 3 test files)

| Test File | Stories Covered | Scenarios |
|-----------|----------------|-----------|
| `ContractSettingsToggleTests.cs` | ~10 stories | USRN/UPRN, DOB, Diesel, Tier Pricing, Blue Badge, SMS, Experian, Visitor Portal, Redact |
| `ContractSettingsConfigTests.cs` | ~8 stories | Vehicle fields, temp vehicle limits, closure periods, document expiry, price alerts, version retention, admin fee, merchant settings |
| `ContractSettingsPolicyTests.cs` | ~3 stories | Data sharing policy URL, cookie policy URL, auto-activate |

---

## 13. MNPS Contract Settings (14 stories → 2 test files)

| Test File | Stories Covered | Scenarios |
|-----------|----------------|-----------|
| `MnpsSettingsToggleTests.cs` | ~8 stories | Apply settings, toggles (PCN, Experian, Agent Assist, Autoguru, Illumin8, Print, FPN) |
| `MnpsRejectReasonTests.cs` | ~6 stories | Create, edit, delete, assign reject reasons, timezone |

---

## 14. Email (5 stories → 1 test file)

| Test File | Stories Covered | Scenarios |
|-----------|----------------|-----------|
| `EmailBroadcastTests.cs` | 5 stories | Select recipients, compose, merge fields, save draft, send |

---

## 15. Pricing (2 stories → 1 test file)

| Test File | Stories Covered | Scenarios |
|-----------|----------------|-----------|
| `PricingMenuTests.cs` | 2 stories | Permission setup menu, pricing menu |

---

## 16. Buy Now (18 stories → 4 test files)

| Test File | Stories Covered | Scenarios |
|-----------|----------------|-----------|
| `BuyNowSelectionTests.cs` | ~4 stories | Dynamic permission types grid, non-zonal permissions, scratch cards |
| `BuyNowAddressDocTests.cs` | ~5 stories | Address search, zone validation, required documents upload |
| `BuyNowVehiclePriceTests.cs` | ~5 stories | Add vehicles, Autoguru lookup, price calculation, tier pricing, diesel surcharge |
| `BuyNowCheckoutTests.cs` | ~4 stories | Payment methods, confirmation, default template form |

---

## 17. Home Screen (3 stories → 1 test file)

| Test File | Stories Covered | Scenarios |
|-----------|----------------|-----------|
| `HomeScreenTests.cs` | 3 stories | Dashboard view, header & menu visibility, sign out |

---

## 18. Dashboard (2 stories → 1 test file)

| Test File | Stories Covered | Scenarios |
|-----------|----------------|-----------|
| `DashboardTests.cs` | 2 stories | Active permissions projection cards, upcoming renewals |

---

## Summary

| Module | Stories | Test Files | Priority |
|--------|---------|-----------|----------|
| Applications | 60 | 8 | 🔴 High |
| Users | 57 | 5 | 🔴 High |
| Permission Builder | 53 | 7 | 🟡 Medium |
| Area | 35 | 5 | 🟡 Medium |
| Work Queue | 24 | 2 | 🔴 High |
| Contract Settings | 21 | 3 | 🟡 Medium |
| Buy Now | 18 | 4 | 🟡 Medium |
| Templates | 16 | 3 | 🟢 Low |
| MNPS Contract Settings | 14 | 2 | 🟢 Low |
| Print | 10 | 2 | 🟢 Low |
| MNPS Template Settings | 8 | 1 | 🟢 Low |
| Email | 5 | 1 | 🟢 Low |
| Groups | 4 | 1 | 🟢 Low |
| Home Screen | 3 | 1 | 🟢 Low |
| System Audit | 3 | 1 | 🟢 Low |
| Reports | 3 | 1 | 🟢 Low |
| Dashboard | 2 | 1 | 🟢 Low |
| Pricing | 2 | 1 | 🟢 Low |
| **TOTAL** | **339** | **~48** | |

---

## Recommended Execution Order

1. ⚡ **Contract Settings** (foundation — toggles affect everything)
2. ⚡ **Area → Streets** (core data — needed for zones → permissions)
3. ⚡ **Area → Zones** (needed for permissions to work)
4. ⚡ **Permission Setup → Groups** (needed for builder)
5. ⚡ **Permission Setup → Builder** (creates permission types)
6. 🔄 **Users → Roles & Permissions** (access control)
7. 🔄 **Users → System Users** (team management)
8. 🔄 **Applications** (core workflow)
9. 🔄 **Work Queue** (state management)
10. 🔄 **Buy Now** (purchase flow)
11. 📋 Everything else (Templates, Print, Reports, Audit, Email)

---

## When a Story Gets Enhanced (Next Sprint)

1. Check which **module/feature** it belongs to
2. Open the corresponding test file
3. **Add/update** test methods
4. Add new story ID in the comment header
5. Run → verify → commit

No new files needed. No duplicates. Clean maintenance. ✅
