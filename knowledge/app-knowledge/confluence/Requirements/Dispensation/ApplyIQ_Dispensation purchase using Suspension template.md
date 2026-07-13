# ApplyIQ_Dispensation purchase using Suspension template

> **Confluence ID:** 1986723874 · **Version:** 1 · **Last updated:** 2026-05-22T07:52:32.526Z
> **Path:** Requirements / Dispensation
> **URL:** https://marston.atlassian.net/wiki/spaces/FF/pages/1986723874/ApplyIQ_Dispensation+purchase+using+Suspension+template

---

# Dispensation Permission Purchase Flow – Using Bay Details (Dispensation Template)

The following table presents the step-by-step purchase flow for a Dispensation Permission using Bay Details under the Dispensation template in ApplyIQ. This flow applies to both Back Office and Customer Portal.

**Step No.**

**Tab/Stage**

**Action/Details**

**Field Details**

**Validation/Rules**

1

Address Tab

Select or enter the applicant's address. Dispensation is non-zonal. System street selection is optional.

-   Use saved address OR search and select from system-configured address search field.
    
-   If address is selected from dropdown, address details auto-populate.
    
-   User can also manually enter address in respective fields.
    
-   Street selection is optional (dropdown of configured streets).
    
-   If "Display Town" toggle is enabled, the Town field appears after street selection.
    

-   If system street is selected, it must exist in council configuration.
    
-   Town field is mandatory if the Display Town toggle is enabled (East Sussex, not Southend).
    

2

Purchase Reason

Select the reason for the dispensation from a predefined list.

-   Purchase Reason options (Southend): Building works, Domestic move, Events, Filming, Skip placement, Telecoms works, Utility works, Other (Free Text).
    
-   If "Skip Placement" is selected, the License Number field becomes optional.
    
-   For all other reasons, the License Number field is not displayed.
    

-   A purchase reason must be selected.
    
-   If "Other" is chosen, free-text input is required.
    

3

Vehicle Tab

Enter vehicle details as configured in Form Builder.

-   Vehicle Registration Mark (VRM) – mandatory if VRM-based enforcement is required.
    
-   Vehicle type (optional).
    
-   Number of vehicles based on configured purchase limit.
    
-   Pre-populated from account if returning user.
    

-   Configurable via Form Builder – same as current flow.
    
-   Based on the number of vehicles purchased configuration, vehicles can be listed.
    

4

Document Tab

Upload any required documents as configured in Form Builder.

-   Documents configured via Form Builder.
    
-   If no documents are configured in Form Builder, the Documents tab is not visible.
    

Documents are mandatory only if configured in Form Builder.

5

Bay Details

Enter the number of bay spaces required for the dispensation.

-   Numeric input field for number of bay spaces.
    
-   Minimum: 1 bay space.
    
-   Maximum: No validation limit on number of bay spaces (any number as required).
    
-   Bay spaces represent the number of parking spaces needed for the dispensation.
    

-   Must be greater than zero.
    
-   Upper limit is configurable by council.
    
-   Requested vs. approved spaces are captured in the audit trail.
    

6

Start / End Date

Select the start and end dates and times for the dispensation.

-   Start date/time (mandatory).
    
-   End date/time (mandatory).
    
-   End date is auto-calculated based on duration and start date policy.
    

-   Start date must be a forward date.
    
-   Start date must be before End date.
    
-   Duration must not exceed the permission type's maximum duration.
    

7

Pricing Duration

Select the pricing duration as configured in the permission.

-   User selects one pricing duration: Hour, Day, Week, or Month.
    
-   Pricing applies to the required bay spaces for the selected duration.
    

-   Only one pricing duration can be selected at a time.
    
-   Duration options are as configured in the Permission Builder.
    

8

Pricing Summary

System calculates and displays the total price based on bay spaces, duration, and configured pricing.

-   Price breakdown displayed: Base Price (per bay for selected duration), Admin Fee (if configured), Short Notice Fee (if applicable), VAT (if configured), Total Amount Payable.
    
-   Example: 2 bay spaces × Weekly pricing £250 = £250 + Admin Fee £20 + VAT 0% = Total.
    

-   Pricing is irrespective of number of bay spaces (price applies to the duration, not per bay).
    
-   If tier pricing is enabled, applicable tier is evaluated.
    
-   If pricing configuration is missing, submission is blocked with an error.
    

9

Checkout

Review terms and conditions, and select payment method.

-   Terms & Conditions displayed for acceptance.
    
-   Payment methods shown (as configured in Builder).
    
-   Summary of all details before submission.
    

-   Terms & Conditions must be accepted.
    
-   Payment method must be selected.
    

10

Application Submission

Application is submitted and enters the approval workflow.

-   Application is assigned a unique Dispensation Application ID.
    
-   Initial status: Pending Approval.
    
-   BO Status Flow: Pending Approval → Being Reviewed → Approved → Waiting for Payment → Print → ACTIVE → Expired/Renewal.
    

-   Only applications with valid data and computed pricing can be submitted.
    
-   Payment must be marked as Paid/Not Required before approval.
    
-   On approval, dispensation data is synced to Illumin8.
    

### Key Notes

-   Dispensation is non-zonal – no map integration for Southend.
    
-   No Blue Badge or Pension discounts apply.
    
-   CEO task flow is not applicable for Dispensation at Back Office.
    
-   Renewal is available for Car Park and Dispensation templates; Extension is available only for Suspension template.
    
-   Short Notice and Extend Dispensation are not in scope for Southend.