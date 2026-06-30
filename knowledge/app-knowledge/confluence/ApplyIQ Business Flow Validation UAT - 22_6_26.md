# ApplyIQ Business Flow Validation UAT - 22/6/26

> **Confluence ID:** 2065858682 · **Version:** 5 · **Last updated:** 2026-06-22T14:06:24.708Z
> **Path:** (root)
> **URL:** https://marston.atlassian.net/wiki/spaces/FF/pages/2065858682/ApplyIQ+Business+Flow+Validation+UAT+-+22+6+26

---

# Business Flow Validation

## Executive Summary

The business validation confirms that the majority of core permit journeys are operating as expected across Resident Permission, Visitor Permission, Suspension, Dispensation, Exemption Permission, and Receipt flows. Key customer and back-office scenarios, including purchases, renewals, voucher activation, suspension, dispensation, and standard receipt generation, have been successfully validated.

A small number of issues remain in specific change-request, pricing, address, and display scenarios. These are documented below with the relevant defect references and should be monitored through resolution. The pending Send Voucher Email capability is outside the currently implemented scope and remains dependent on future prioritisation.

Area / Flow

Validation scope

Outcome

Open defects / Notes

CP - Permit: Resident Permission Flow — Resident Zonal Permission

Purchase, Request Further Evidence, renewal, and Change Address flows.

Purchase, Request Further Evidence, and renewal were validated successfully. Change Address was partially validated because customers can submit the request, but the status is not updated as expected.

**Open defect:** [Bug 313591](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/313591) — When a change of address is submitted in the Customer Portal, the address and respective zone are not updated in the Customer Portal.

CP - Permit: Resident Permission Flow — Temporary Permission

Temporary Permission flow.

Validated successfully.

No open defects noted.

CP - Permit: Visitor Permission Flow — Visitor Voucher Permission 01

Purchase, voucher number generation after approval, voucher activation, and Buy Again flows.

Validated successfully.

**Not implemented:** Send voucher email functionality is not implemented because the related stories are not included in the current prioritized work packet.

Suspension Flow - BO

Purchase flow with three different pricing options and HHD Flow CEO task assignment.

Validated successfully.

**Open defect:** [Bug 314632](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/314632) — When the task is assigned and completed, "CEO ID" is not captured in the MNPS Task List screen.

Dispensation Flow - BO

Purchase flows using car park, suspension, and dispensation templates.

Validated successfully.

**Open defect:** [Bug 314686](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/314686) — Dispensation using the Suspension Template: the Overview tab does not display the Bay Price, Town, Total Price, and Duration.

CP - Exemption Permission Flow

Exemption Permission purchase flow, template behavior, Find Address option, and Pricing tab behavior.

Validated with issues. Templates are not displaying the **Find Address** option, and the car park template Pricing tab incorrectly displays the voucher quantity field.

**Open defects:** [Bug 313588](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/313588) — Pricing tab shows visitor pricing with quantity input instead of car park template radio button selection. [Bug 314687](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/314687) — Address is not auto-populated correctly in the Car Park Exemption Template.

Receipt

Permission purchase receipt after completing a permission purchase.

Validated successfully for permission purchase.

**Open defect:** [Bug 309743](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/309743) — For cancellation, address change, zone change, and other change requests, the same purchase receipt and fields are displayed.