# BRD_Apply IQ_User Guide Setup_V1.1_2026-03-23

> **Confluence ID:** 1805746200 · **Version:** 7 · **Last updated:** 2026-04-02T05:49:58.202Z
> **Path:** Requirements / User Guide
> **URL:** https://marston.atlassian.net/wiki/spaces/FF/pages/1805746200/BRD_Apply+IQ_User+Guide+Setup_V1.1_2026-03-23

---

## 1\. Document Control

Version

Date

Author

Description

1.0

2026-03-23

Prathiba.K

Initial BRD created from FRD v1.0

1.1

2026-04-01

Prathiba.K

Updated BRD based on review comments

# **2\. Purpose**

The purpose of this feature is to allow administrators to create, manage, publish, unpublish, delete, preview, and reorder User Guides in the Back Office (BO), and make them available to end users through the Customer Portal (CP).  
User Guides help explain permission‑specific workflows and common account tasks and improve the overall usability of the Apply system.

# **3\. Business Objectives**

-   Provide a central Back Office area for managing permission‑specific and account‑level User Guides.
    
-   Enable councils to easily create, publish, and maintain user-facing guidance without technical support.
    
-   Improve Customer Portal usability by giving end users clear, relevant, permission‑based and account‑related instructions.
    
-   Reduce support queries by offering accessible self‑service documentation.
    
-   Ensure secure, role‑controlled, consistent guidance across all contracts.
    

# **4\. Background**

The User Guide Setup feature introduces a structured, permission‑specific documentation system in the Back Office and a dedicated User Guide section in the Customer Portal, allowing councils to publish accurate, up‑to‑date instructions for end users.  
It also supports non‑permission‑specific, “Account Settings” guides for common account tasks (e.g., changing password, updating email).

# **5\. In Scope**

-   BO menu for User Guide management
    
-   Upload guides per **Permission Type**, including a generic **“Account Settings”** category
    
-   Support file types: DOC, DOCX, PDF, PPT, PPTX, Video, URL
    
-   Max upload size:
    
    -   **20 MB** for DOC, DOCX, PDF, PPT, PPTX.
        
    -   **40 MB** for Video
        
-   Create, Edit, Delete guides
    
-   Publish, Unpublish, Draft statuses
    
-   Drag‑and‑drop reorder guides (per Permission Type / Account Settings)
    
-   Preview files before publishing
    
-   BO search by Guide Name
    
-   CP User Guide menu available to all users
    
-   CP displays Published guides only
    
-   CP supports Grouped View + Flat List View
    
-   Users can view, preview, download, open links, watch videos
    
-   Full role‑based access control
    

# **6\. Out of Scope**

-   Bulk upload or bulk actions
    
-   Analytics (view count, downloads)
    
-   Rich text editor for creating guides
    
-   Multi‑language user guide support
    

# **7\. High‑Level Overview**

## **7.1 User Roles & Permissions**

Role

Access

Super Admin & Contract Admin

Full access – Create, Edit, Delete, Publish, Unpublish, Save Draft, Reorder, Preview

BO Manager & BO User

View only

CP End User

Can view only Published guides

**User Guide feature is standard across all contracts.**

## **7.2 End‑to‑End Flow**

1.  Administrator navigates to **BO → User Guide**.
    
2.  Selects **Permission Type** (e.g., Permit, Suspension, Dispensation) **or “Account Settings”**.
    
3.  Uploads User Guide(s) for the selected permission type or Account Settings.
    
4.  Saves as **Draft**, **Publish**, or **Unpublish**.
    
5.  Published guides appear in **Customer Portal → User Guide**.
    
6.  CP displays guides:
    
    -   Grouped by Permission Type (Permit, Suspension, Dispensation, etc.) and **Account Settings**, with optional Flat List UX.
        

## 8\. Stakeholders

Name/Role

Organization/Dept

**Super Admin / Contract Admin (BO Admin Users)**

Council Back Office

**BO Manager**

Council Back Office

**BO User**

Council Back Office

**Customer Portal End Users**

Public / Residents / Businesses

# **9\. Business Requirements**

**Req ID**

**Requirement Description (One‑Line)**

**Priority**

**Acceptance Criteria (One‑Line)**

BR‑001

System must provide a User Guide menu in Back Office for managing permission‑specific guides.

High

BO displays a “User Guide” menu accessible to authorized roles.

BR‑002

System must allow admins to create User Guides linked to specific Permission Types or Account Settings.

High

Admin can create a new guide and assign a Permission Type or “Account Settings”.

BR‑003

System must support upload formats: DOC, DOCX, PDF, PPT, PPTX, Video, URL.

High

Upload accepts supported file types; unsupported formats are rejected.

BR‑004

System must enforce a maximum file size of **20 MB for** DOC, DOCX, PDF, PPT, PPTX. and **40 MB for Video** uploads.

High

Upload fails if document files exceed 20 MB or video files exceed 40 MB.

BR‑005

System must allow admins to edit User Guides.

High

Admin can modify name, description, file, or permission type/category.

BR‑006

The system must allow admins to delete User Guides only after the guide is unpublished.

High

Deleted guides are removed from BO and not visible in CP.

BR‑007

System must support Draft, Published, and Unpublished statuses.

High

Guide status determines whether it appears in CP or BO only.

BR‑008

System must allow admins to Publish User Guides.

High

Published guides appear immediately in CP.

BR‑009

System must allow admins to Unpublish User Guides.

High

Unpublished guides disappear from CP while remaining in BO.

BR‑010

System must support drag‑and‑drop reorder for User Guides within each permission type and Account Settings.

High

Admin can reorder guides per category and CP reflects the same order.

BR‑011

System must auto‑save reorder actions.

Medium

System saves new order without requiring manual confirmation.

BR‑012

System must provide a Preview Panel for viewing files/URLs before publishing.

High

Admin can preview any uploaded file or URL.

BR‑013

BO must provide search by Guide Name for quick filtering.

Medium

Searching by title filters visible guides in BO.

BR‑014

Customer Portal must include a User Guide menu for authenticated users.

High

CP displays a “User Guide” menu to logged‑in users.

BR‑015

Customer Portal must show only Published User Guides.

High

Draft/Unpublished guides remain hidden from CP.

BR‑016

CP must display guides in Grouped View organized by Permission Type and Account Settings.

High

Guides appear under each Permission Type (Permit, Suspension, etc.) and under “Account Settings” where applicable.

BR‑017

CP must optionally support a Flat List View depending on UX configuration.

Medium

Guides appear in a table layout when Flat List View is enabled.

BR‑018

CP must allow users to open, preview, download, watch videos, or open URLs.

High

Users can access guides according to file type without errors.

# **10\. Visibility Rules**

-   Only **Published** guides are visible in CP.
    
-   Draft & Unpublished are BO‑only.
    
-   If no published guides exist, CP either:
    
    -   Shows empty state **OR**
        
    -   Hides User Guide menu (UX decision).
        

# **11\. Non‑Functional Requirements (NFR)**

### **File Size**

-   Max upload size:
    
    -   **20 MB** for DOC, DOCX, PDF, PPT, PPTX.
        
    -   **40 MB** for Video
        

### **Security**

-   Strict role‑based access
    
-   Only published guides visible publicly
    

### **Performance**

-   CP guide list loads within **2 seconds**
    
-   Efficient video streaming support
    

### **Audit**

Tracks:

-   Created By
    
-   Created At
    
-   Updated By
    
-   Updated At
    

# **12\. Assumptions**

-   Browser supports all standard file formats
    
-   BO & CP already have secure file hosting
    
-   Admins will upload production‑ready documents
    

# **13\. Constraints**

## **13.1 Technical Constraints**

-   Maximum file size:
    
    -   **20 MB** for DOC, DOCX, PDF, PPT, PPTX.
        
    -   **40 MB** for Video
        
-   Supported formats limited to DOC, DOCX, PDF, PPT, PPTX, Video, URL
    
-   Preview depends on browser capabilities
    
-   Only HTTPS URLs allowed
    
-   Drag‑and‑drop must follow BO UI framework
    
-   CP must load within 2 seconds
    

## **13.2 Functional Constraints**

-   Only Published guides appear in CP
    
-   Guides are permission‑type–specific or Account‑Settings–specific
    
-   No version history
    
-   Feature enabled for all contracts (no toggle)
    

## **13.3 Role Constraints**

-   Only Admin roles can modify guides
    
-   BO Manager and BO User = view only
    
-   CP cannot bypass file restrictions
    

# **14\. Assumptions**

## **14.1 System-Level**

-   Browser can preview DOC, DOCX, PDF, PPT, PPTX.
    
-   Video playback supported by browser
    
-   Secure hosting already available
    
-   Permission Types exist in contract setup
    

## **14.2 Operational**

-   Admins upload final/approved guides
    
-   Councils maintain guides without dev support
    
-   End users have stable internet
    

## **14.3 Data Handling**

-   Uploaded files stored securely
    
-   Audit logs are retained
    
-   No retention policy required
    

# **15\. Risks & Mitigations**

Risk

Impact

Mitigation

Large files slow CP

Poor experience

Enforce 20 MB / 40 MB limits

Unsupported file types

Cannot view in CP

Strict validation

Guide deleted/unpublished

Missing instructions

Show “No guides available” message

Wrong ordering

Confusing CP UI

Drag handle UI + audit

Browser video/doc issues

Users cannot view

Offer download fallback

Too many guides under one permission

Difficult navigation

Search + grouping

Incorrect URL

Dead links

Enforce HTTPS + validate

# **16\. Summary**

This feature allows Back Office administrators to upload and maintain permission‑specific and account‑level user guides, while the Customer Portal displays these guides in a structured, user‑friendly way.  
It improves user experience, reduces confusion, and gives councils full control over documentation.

## 17\. Approval

Name

Role

Signature

Date

Product Owner

Business Analyst