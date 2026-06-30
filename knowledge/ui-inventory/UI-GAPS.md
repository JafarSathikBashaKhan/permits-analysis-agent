# UI Selector Gap Report

Elements where a `data-testid`, `id`, or `name` is reused across multiple components.
These cause locator collisions in automation tests — UI team should make each value unique per component.

**33 unique colliding values across 91 occurrences.**

| Value | Kind | Occurrences | Files |
|---|---|---:|---|
| `vehicle-logo` | data-testid | 17 | applicants/AddBlueBadge:191 · applicants/AddVehicle:1192 · applicants/ApplicantEmailBroadcasting:943 · applicants/ApplicantSendEmail:691 · applicants/DocumentList:402 · applicants/EditVehicle:289 · applicants/FileCard:62 · applicants/PermitDocument:546 · applicants/PermitVehicle:284 · applicants/VehiclesList:301 · applications/ApplicationActionSendEmail:4169 · applications/ApplicationDocument:542 · applications/ApplicationPaymentHistory:981 · applications/ApplicationSendEmail:815 · applications/ApplicationVehicle:1461 · applications/ApplicationVehicleDetail:269 · applications/RenewalDocumentUpload:725 |
| `search` | id | 7 | applicants/ApplicantEmailBroadcasting:717 · applicants/PermitVehicle:401 · applications/AddAddressAssign:209 · applications/ApplicationActionSendEmail:2550 · applications/ApplicationSendEmail:648 · applications/ApplicationVehicle:1438 · applications/VoucherPermitHistory:289 |
| `subject` | id | 5 | applicants/ApplicantEmailBroadcasting:897 · applicants/ApplicantSendEmail:649 · applications/AddAddressAssign:630 · applications/ApplicationActionSendEmail:4094 · applications/ApplicationSendEmail:769 |
| `current-active-panel` | id | 4 | locations/AddAndEditLocation:395 · locations/ViewLocationsList:192 · SpecialEvents/AddSpecialEvent:474 · SpecialEvents/page:999 |
| `registrationNumber` | id | 2 | applicants/AddVehicle:829 · applicants/TemporaryVehiclePanel:123 |
| `star-icon` | data-testid | 2 | applicants/PermitVehicle:463 · applicants/VehiclesList:316 |
| `postcode` | id | 2 | applications/AddAddressAssign:551 · applications/ApplicationActionSendEmail:4002 |
| `property` | id | 2 | applications/AddAddressAssign:563 · applications/ApplicationActionSendEmail:4019 |
| `street` | id | 2 | applications/AddAddressAssign:573 · applications/ApplicationActionSendEmail:4031 |
| `uprn` | id | 2 | applications/AddAddressAssign:584 · applications/ApplicationActionSendEmail:4044 |
| `usrn` | id | 2 | applications/AddAddressAssign:591 · applications/ApplicationActionSendEmail:4054 |
| `paymentSettings-container` | data-testid | 2 | builder/AutoApprovalSettings:120 · builder/PaymentSettings:203 |
| `generalSettings-container` | data-testid | 2 | builder/BasicInformation:431 · builder/GeneralSettings:868 |
| `permissionName` | id | 2 | builder/BasicInformation:445 · builder/PermissionBuilderForm:329 |
| `description` | id | 2 | builder/BasicInformation:544 · builder/PermissionBuilderForm:416 |
| `paymentSettingsHelperText` | id | 2 | builder/DiscountSettings:624 · builder/PaymentSettings:276 |
| `edit-permission-builder-form-container` | data-testid | 2 | builder/EditPermissionBuilderForm:124 · builder/EditPermissionsBuilderForm:1326 |
| `fixedPrice` | id | 2 | builder/FixedDurationPricing:312 · builder/FixedDurationPricing:295 |
| `flat-hourly-rate` | data-testid | 2 | builder/MinIncrementalPricing:679 · builder/MinIncrementalPricing:666 |
| `flat-daily-rate` | data-testid | 2 | builder/MinIncrementalPricing:700 · builder/MinIncrementalPricing:688 |
| `flat-weekly-rate` | data-testid | 2 | builder/MinIncrementalPricing:721 · builder/MinIncrementalPricing:709 |
| `flat-monthly-rate` | data-testid | 2 | builder/MinIncrementalPricing:743 · builder/MinIncrementalPricing:730 |
| `physicalDocumentEditorSearchField` | id | 2 | builder/PhysicalPermissionPrint:870 · builder/WhiteMailReminderEditor:396 |
| `standard-flat-hourly-rate` | data-testid | 2 | builder/StandardPricing:508 · builder/StandardPricing:496 |
| `standard-flat-daily-rate` | data-testid | 2 | builder/StandardPricing:530 · builder/StandardPricing:517 |
| `standard-flat-weekly-rate` | data-testid | 2 | builder/StandardPricing:551 · builder/StandardPricing:538 |
| `standard-flat-monthly-rate` | data-testid | 2 | builder/StandardPricing:573 · builder/StandardPricing:560 |
| `numberPlateChangeLimit` | data-testid | 2 | builder/VehicleSettings:434 · builder/VehicleSettings:430 |
| `allowedVehicleCount` | data-testid | 2 | builder/VehicleSettings:561 · builder/VehicleSettings:558 |
| `numberOfSeats` | data-testid | 2 | builder/VehicleSettings:689 · builder/VehicleSettings:681 |
| `euroStandard` | data-testid | 2 | builder/VehicleSettings:792 · builder/VehicleSettings:792 |
| `DeleteIcon` | data-testid | 2 | locations/AddAndEditLocation:550 · locations/ViewLocationsList:319 |
| `CloseIcon` | data-testid | 2 | locations/AddAndEditLocation:568 · locations/ViewLocationsList:337 |
