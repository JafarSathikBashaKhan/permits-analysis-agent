# FRD_Apply IQ_User Guide Setup_V1.1_2026-03-23

> **Confluence ID:** 1812496470 · **Version:** 6 · **Last updated:** 2026-04-02T05:50:32.800Z
> **Path:** Requirements / User Guide
> **URL:** https://marston.atlassian.net/wiki/spaces/FF/pages/1812496470/FRD_Apply+IQ_User+Guide+Setup_V1.1_2026-03-23

---

## Functional Requirements Document for User Guide Setup in Apply v1.1

## 1\. Document Control — add new row

**Version**

**Date**

**Author**

**Description**

1.0

Mar23, 2026

Prathiba K

Initial FRD created from BRD v1.0

1.1

Prathiba K

Updated FRD based on BRD v1.1 review comments

## 2\. Project Overview — replace paragraph

This FRD defines the functional, data, UI/UX, validation, and NFR specifications for User Guide Setup in Apply. Back Office (BO) administrators manage permission-specific and account-level User Guides via an “Account Settings” category (create, edit, delete, draft/publish/unpublish, preview, and drag-and-drop ordering). The Customer Portal (CP) exposes only Published guides under a dedicated User Guide menu, supporting Grouped View (by Permission Type and Account Settings) and an optional Flat List View.

## 4\. Scope — update In Scope

### 4.1 In Scope

-   BO User Guide panel to manage permission-specific and account-level (Account Settings) guides.
    
-   Create, Edit, Delete; Draft / Publish / Unpublish lifecycle.
    
-   Preview Panel (DOC/DOCX/PDF/PPT/PPTX/Video/URL).
    
-   Drag-and-drop ordering; persisted and reflected in CP.
    
-   CP User Guide menu; Published-only rendering.
    
-   CP Grouped View; optional Flat List View.
    
-   Supported file types: DOC, DOCX, PDF, PPT, PPTX, Video, URL.
    
-   Max upload size:
    
    -   20 MB for DOC/DOCX/PDF/PPT/PPTX
        
    -   40 MB for Video
        
-   Role-based access: Super/Contract Admin = full; BO Manager/User = view; CP = Published-only.
    

## 6\. High-Level Flows — BO flow

### 6.1 BO — Manage Guides (per Permission Type or Account Settings)

1.  Admin opens BO → User Guide.
    
2.  Selects a Permission Type or Account Settings.
    
3.  Adds/Edits a guide → fills Name, optional Description, File Type, File/URL → Save as Draft or Publish.
    
4.  Uses Preview Panel to verify content.
    
5.  Uses Drag-and-drop to adjust order; order auto-saves.
    
6.  Unpublish or Delete when needed (Delete allowed only when Unpublished).
    

## 7\. Functional Requirements — replace specific rows

### 7.1 Back Office — User Guide Panel

**ID**

**Requirement**

**Priority**

FR-002

Admin must select a Permission Type or Account Settings and see only guides for that category in the list.

High

FR-003

System shall allow Create and Edit of guides (Name, optional Description, File Type, File/URL). Delete shall be allowed only when the guide is Unpublished (Published guides must be Unpublished first).

High

FR-004

System shall enforce file type (DOC/DOCX/PDF/PPT/PPTX/Video/URL) and upload size limits (≤ 20 MB for document files; ≤ 40 MB for video files) at upload time.

High

### 7.2 Customer Portal — User Guide

**ID**

**Requirement**

**Priority**

FR-013

CP shall support Grouped View by Permission Type and Account Settings; show groups only if they contain Published guides.

High

## 8\. UI/UX Requirements — targeted tweaks

### 8.1 BO — User Guide Panel

-   Filters: Permission Type / Account Settings (required).
    
-   Actions: Create, Edit, Delete, Publish, Unpublish, Save as Draft, Reorder (drag-handle), Preview.
    
-   List/Grid: Columns per FR-008; paging ≥ 25; default sort by Updated Date desc.
    

### 8.2 CP — User Guide

-   Grouped View: Permission Type and Account Settings headings; items show Name, Description, and action (Open/Preview/Download).
    
-   Flat List View (optional): Table per FR-014; responsive on mobile.
    

## 9\. Validation Rules

**Rule ID**

**Context**

**Rule**

VR-01

Create/Edit

Title required; up to 500 chars; unique within selected Permission Type / Account Settings category (case-insensitive).

VR-02

Create/Edit

Category selection is required: Permission Type or Account Settings.

VR-04

Upload

File size must be ≤ 20 MB for DOC/DOCX/PDF/PPT/PPTX and ≤ 40 MB for Video; larger files are rejected with clear error.

VR-05

Upload

Allowed extensions: doc, docx, pdf, ppt, pptx, mp4; reject others.

VR-08

Reorder

Order index must be contiguous within the selected Permission Type / Account Settings category after drag-drop.

VR-09

Delete

Delete is allowed only when the guide status is Unpublished.

## 11\. Error Messages

**Code**

**Case**

**Message (BO)**

E-UG-001

Missing title

This is required.

E-UG-002

Invalid file type

Unsupported file type. Allowed: DOC, DOCX, PDF, PPT, PPTX, MP4, URL.

E-UG-003

Oversized file

File size exceeds the allowed limit (20 MB for documents, 40 MB for videos). Please upload a smaller file.

## 12\. NFRs — file sizes reference

-   Performance: CP list render ≤ 2s for typical volumes; preview open ≤ 3s.
    
-   Security & Access: Role enforcement; only Published visible to CP; secure storage.
    
-   Max upload size: 20 MB for documents (DOC/DOCX/PDF/PPT/PPTX); 40 MB for video.
    

## 14\. Constraints — replace limits and formats

-   Max upload size: 20 MB for DOC/DOCX/PDF/PPT/PPTX; 40 MB for Video.
    
-   Supported formats: DOC, DOCX, PDF, PPT, PPTX, Video (MP4), URL only.
    
-   URLs must be HTTPS.
    
-   Guides are assigned per category: a specific Permission Type or Account Settings; visibility in CP is Published-only.
    

## 15\. Risks & Mitigations — update large-file item

**Risk**

**Mitigation**

Large files slow CP loading

Enforce 20 MB / 40 MB limits and recommend optimized files.

Unsupported or corrupt files

Strict validation of type and size; preview fallback to download.

## 16\. Approval

Name

Role

Signature

Date

Joanne Archer

Product Owner

Prathiba

BA