# Permit Application System — User Stories Index

## Project Overview
**Application:** NPS Backoffice (Wokingham Borough Council - Permit Management)  
**URL:** `nps-backoffice-test-c9bxa6bgg0a7htfn.z01.azurefd.net`  
**Contract:** AutomationApplyIQ

## Module Map

```
Dashboard
├── Applications
│   ├── Permits
│   ├── Suspensions
│   └── Dispensations
├── Users
├── Permission Setup
├── Templates
├── Print
├── Area
│   ├── Streets (White List / Black List)
│   ├── Zones
│   ├── Locations
│   └── Special Events
├── Reports
├── System Audits
├── Contract Settings
├── Vehicles
└── Notifications
```

## User Stories

| Story ID | Title | State | Tags |
|----------|-------|-------|------|
| 125471 | [Street and Property Creation](./US-125471-street-and-property-creation.md) | Done | Fully Complete; LV |
| 125847 | [Grid View of Street - White List](./US-125847-grid-view-of-street--white-list.md) | Done | Fully Complete; LV |
| 125848 | [Bulk Upload & Import - Street Import](./US-125848-bulk-upload--import--street-import.md) | Done | Fully Complete; LV |
| 126513 | [Edit Street](./US-126513-edit-street.md) | Done | Fully Complete; LV |
| 130655 | [Enable Zone Selection for the Street](./US-130655-enable-zone-selection-for-the-street.md) | Done | Fully Complete; LV |
| 130662 | [Ability to Blacklist the Street](./US-130662-ability-to-blacklist-the-street.md) | Done | Fully Complete; LV |
| 130663 | [Delete Street (Bulk Delete)](./US-130663-delete-street-bulk-delete.md) | Done | Fully Complete; LV |
| 132513 | [Blacklisted Streets: List, Remove](./US-132513-blacklisted-streets-list-remove-from-blacklist.md) | Done | Fully Complete; LV |
| 132973 | [Area - Zone List Screen](./US-132973-area--zone---list-screen.md) | Done | Fully Complete |
| 134012 | [Area - Location List Screen](./US-134012-area--location---list-screen.md) | Done | Fully Complete |
| 135490 | [Area - Location Edit & Map Properties](./US-135490-area--location---edit--map-properties.md) | Done | Fully Complete |
| 136159 | [Blacklist - View & Edit](./US-136159-blacklist--view--edit.md) | Done | Fully Complete |
| 140145 | [Area - Zone Publish](./US-140145-area--zone--singlemulti-select-publish.md) | Done | Fully Complete |
| 140146 | [Area - Zone Unpublish](./US-140146-area--zone--singlemultiselect-unpublish.md) | Done | Fully Complete |
| 140166 | [Area - View & Manage Zone Streets](./US-140166-area--view--manage-zone--streets-tab.md) | Done | Fully Complete |
| 140170 | [Area - View & Manage Zone Permissions](./US-140170-area--view--manage-zone--permissions-tab.md) | Done | Fully Complete |
| 140180 | [Area - Edit Zone Permissions](./US-140180-area--view--manage-zone--edit-permissions-tab.md) | Done | Fully Complete |
| 142478 | [Area - Location Create](./US-142478-area--location---create.md) | Done | Fully Complete |
| 143508 | [Auto Add Street to Whitelist After Expiry](./US-143508-automatically-add-street-to-whitelist-after-expiry.md) | Done | Fully Complete |
| 143529 | [Street View - Search, Filter, Pagination](./US-143529-street-view-screen--search-filter-column-picker-pagi.md) | Done | Fully Complete |
| 144829 | [Area - Location View Screen](./US-144829-area--location---view-screen.md) | Done | Fully Complete |
| 144850 | [Delete Location](./US-144850-delete-location.md) | Done | Fully Complete |
| 148740 | [Bulk Import - Download Sample](./US-148740-bulk-import--download-sample.md) | Done | Fully Complete |
| 148746 | [Bulk Import - Area Config](./US-148746-bulk-import--area-config--creation-and-mapping-of-str.md) | Done | Fully Complete |
| 149117 | [Area - Zone Creation in Apply](./US-149117-area-configurations--zone-creation-in-apply.md) | Done | Fully Complete |
| 151336 | [Area - Zone Edit & Mapped Streets](./US-151336-area--zone--edit-zone--mapped-streets.md) | Done | Fully Complete |
| 151343 | [Area - Zone Delete](./US-151343-area--zone--singlemulti-select-delete.md) | Done | Fully Complete |
| 152642 | [Area - Zone Action Menu](./US-152642-area--zone--action-menu.md) | Done | Fully Complete |
| 157253 | [Area - Zone Mapping Street](./US-157253-area--zone--mapping-street-in-zone-creation.md) | Done | Fully Complete |
| 163636 | [Area - Zone Non Enforceable Time](./US-163636-area--zone--configure-non-enforceable-time.md) | Done | Fully Complete |
| 163644 | [Area - Zone Publish & Delete Validation](./US-163644-area--zone--publish--delete-pop-up-validation.md) | Done | Fully Complete |
| 171259 | [Unsaved Changes Warning on Navigation](./US-171259-unsaved-changes-warning-on-navigation--menus.md) | Done | Fully Complete |
| 177655 | [Enable Address Challenge Permission](./US-177655-enable-address-challenge-permission.md) | Done | Fully Complete |
| 178185 | [Bulk Import - Zone and Locations](./US-178185-bulk-import--zone-and-locations.md) | Done | Fully Complete |
| 181541 | [Street - Property Blacklist](./US-181541-street--property-blacklist.md) | Done | new |

## Automation Scripts

| Script | Purpose | Story Reference |
|--------|---------|-----------------|
| `create_street.js` | Creates a street with properties | US-125471 |
| `permit_agent_master.js` | Full system analysis/audit | All modules |

## Key Business Concepts

| Concept | Description |
|---------|-------------|
| **Street** | A road/area containing properties, identified by USRN |
| **Property** | A building/address within a street, identified by UPRN |
| **USRN** | Unique Street Reference Number |
| **UPRN** | Unique Property Reference Number |
| **Zone** | A grouping of streets for permit management |
| **Permission** | A permit/suspension/dispensation applied by a resident |
| **Permission Limit** | Max permits allowed per property |
| **White List** | Approved streets where permits can be applied |
| **Black List** | Restricted streets/properties |

## Roles

| Role | Access Level |
|------|-------------|
| Super Admin | Full CRUD on all modules |
| Contract Admin | CRUD on streets, properties, and contract-level settings |
