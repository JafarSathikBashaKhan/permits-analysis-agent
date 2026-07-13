# Permissions : Technical Approach Document

> **Confluence ID:** 1049493536 · **Version:** 11 · **Last updated:** 2025-07-16T08:44:06.310Z
> **Path:** (root)
> **URL:** https://marston.atlassian.net/wiki/spaces/FF/pages/1049493536/Permissions+Technical+Approach+Document

---

**Design Name**

Permisssions: Technical Approach Document

**Design owner**

**Team**

1 1 incomplete @ Team member 2 2 incomplete @ Team member

**Informed**

3 3 incomplete 4 4 incomplete @ Stakeholder

**Status**

approvedGreen

**Last date updated**

e.g.,

**On this page**

25falsedefaultlisttrue

:jigsaw:1f9e9🧩#EAE6FF

## Purpose

The purpose of this document is to outline the technical approach for implementing **Dynamic Forms** with **Form Builder Integration**. This solution is intended to enable non-technical users to create, manage, and render customized forms dynamically within the application, without requiring code-level changes.

Design and implement a system that supports:

-   Saving dynamic form structures (as JSON) in a database.
    
-   Mapping predefined fields to SQL columns for structured queries.
    
-   Storing user-input values for predefined fields.
    
-   Rendering and editing dynamic + predefined data in UI.
    
-   Indexing combined data in Azure Cognitive Search for full-text search and reporting.
    
-   Ensure updates are reflected in both the SQL DB and Azure Cognitive Search.
    

:goal:1f945🥅#EAE6FF

## Goals

-   The primary goals of this technical approach document are to:
    
    1.  **Define the Solution Architecture**  
        Present a high-level and detailed technical blueprint for implementing dynamic forms and integrating a form builder tool.
        
    2.  **Enable Dynamic Form Creation and Rendering**  
        Ensure that forms can be created, modified, and rendered dynamically based on configuration or metadata, without requiring code changes.
        
    3.  **Support Form Builder Integration**  
        Seamlessly integrate a user-friendly form builder (Form.io) to empower non-technical users to build and manage forms via a UI.
        
    4.  **Ensure Reusability and Scalability**  
        Design a modular and extensible system that supports reusable components and can scale with increasing form complexity or volume.
        
    5.  **Establish Data Handling and Validation Rules**  
        Define how form data is stored, submitted, validated (client and server side), and integrated with backend services or databases.
        
    6.  **Provide Flexibility for Conditional Logic and Layouts**  
        Accommodate advanced features like conditional fields, dynamic sections, custom validations, and various UI layouts.
        
    7.  **Promote Maintainability and Collaboration**  
        Enable easier maintenance by separating concerns (e.g., form logic from UI) and facilitating collaboration between developers, designers, and business users.
        
    8.  **Align with Security and Compliance Requirements**  
        Ensure that form data handling complies with applicable security standards and privacy regulations.
        

Azure Well-Architected Framework

[https://learn.microsoft.com/en-us/azure/architecture/framework/](https://learn.microsoft.com/en-us/azure/architecture/framework/)

##   Approach and Steps

* * *

### **Saving Dynamic Forms JSON (Form Builder) in Database**

#### **Objective**

Enable users (e.g., admins) to clone the predefined forms and customize them in Back Office using a visual **Form Builder** (Form.io) and save the form definition as JSON into a SQL database. This JSON defines field types, layout, validation rules, and metadata.

#### **Process Flow**

1.  The admin user creates a form in Back Office using a drag-and-drop form builder UI.
    
2.  The admin can set rules and validations on those form fields that are added dynamically.
    
3.  The form builder generates a structured JSON representing the form schema.
    
4.  JSON is sent to the backend API for persistence.
    
5.  This JSON and metadata are saved to the backend (SQL DB).
    

#### **Data Schema**

**Table Name:** form\_definitions

**Field**

**Type**

**Description**

id

UUID/INT

Primary key

form\_name

VARCHAR

Human-readable name of the form

form\_json

JSON/Text

JSON from form builder (structure/schema)

version

INT

(Optional) Form version

created\_by

UUID

The user/admin who created the form

created\_at

TIMESTAMP

Timestamp of creation

updated\_at

TIMESTAMP

Timestamp of last update

#### **Example Form Builder JSON**

#### **API**

-   **Endpoint** `POST /api/forms/templates` – Save or update form definition
    
-   Input: `{ Id,form_name, form_json }`
    
-   Description: Save form JSON to database
    

##### Sample Response

### **Configure and Save Predefined Form Fields in SQL Database as a separate Table for each Form Type**

#### **Objective**

Predefined fields (e.g., name, email, submission date) are stored as explicit columns in a normalized SQL schema to support querying, reporting, and indexing. Each form type will have a separate table with predefined columns and dynamic fields as an additional property column.

#### **Process Flow**

1.  Form design includes a set of predefined fields.
    
2.  The backend maps these fields to columns in a table (e.g., `Form_Permits`).
    
3.  On form design finalization, the backend ensures these fields are mapped or updated in the schema.
    
4.  Optionally, we can use Entity Framework/Dapper migrations to adjust the schema dynamically if needed.
    

#### DB Schema

`Form_permits`

Column

Type

Id

UNIQUEIDENTIFIER

FormId

bigint

FullName

VARCHAR(100)

Email

VARCHAR(100)

National\_Id

VARCHAR(50)

Additional\_Property

VARCHAR(max)

Created\_On

DATETIME

### Retrieve JSON and Render in UI using Form Builder along with predefined fields from the Database (customer portal).

#### **Objective**

Render a full form in the frontend UI by combining both dynamic (JSON-based) and predefined fields (static). Render stored dynamic form definitions dynamically in the frontend using the same **Form Builder engine** (in render/view mode).

#### **Process Flow**

-   The user navigates to a form submission page. (Customer Portal)
    
-   Frontend requests:
    
    -   JSON schema from `FormTemplates`
        
-   Backend returns JSON schema + field metadata.
    
-   The UI renderer parses JSON and creates dynamic input fields.
    
-   Predefined fields are rendered using mapped components.
    
-   Final Form UI presents both dynamic and static fields to the user.
    

#### API

-   **Endpoint:** `GET /api/forms/templates/{formId}`
    

##### Sample Response

##### Frontend Rendering for Dynamic Form Fields

\]\]>

Libraries:

-   Form.io Renderer
    

##### **Optional**

UI Rendering Strategy

\]\]>

### Save Predefined Form Field Data in predefined columns and dynamic form data in the Additional Property Column in SQL DB based on the form Type

#### **Objective**

Persist user inputs for predefined fields into dedicated columns and store dynamic field values in the additional property column in the SQL table.

#### **Process Flow**

1.  On submission, predefined field data is extracted and saved in SQL.
    
2.  Store predefined values in `FormSubmissions_[FormType]` tables.
    

#### API

-   **Endpoint:** `POST /api/forms/submissions`
    

##### Sample Request

### Add Predefined and Dynamic Form Data to Azure Cognitive Search

#### **Objective**

Index both predefined and dynamic form fields for search and submit them automatically to Azure Cognitive Search by Azure function app

#### **Process Flow**

1.  On submission, save predefined data in the respective columns and dynamic data as JSON in the Additional Property column in the SQL table.
    
2.  Merge predefined and dynamic data in the backend.
    
3.  Push the complete record to Azure Cognitive Search via API.
    
4.  Each form type will have its own indexes in the Azure Congnitive search.
    

#### API

-   **Endpoint:** `POST /api/forms/index`
    

##### Sample Request

### Retrieve/Search/Report on Submitted Forms via Azure Cognitive Search

#### **Objective**

Allow users/admins to filter, search, and report on form submissions using Azure Search.

#### **Process Flow**

1.  The user applies filters or search queries.
    
2.  The frontend calls the backend search endpoint.
    
3.  The backend queries Azure Search and returns results.
    

#### Azure Search Sample Query

#### **API**

-   **Endpoint:** `POST /api/forms/search`
    

##### Sample Request

##### Sample Response

### Notes

-   **Azure Search Index** should be schema-flexible (using `Edm.String`, `Edm.DateTimeOffset`, etc.) for dynamic fields.
    
-   Implement background jobs or triggers to sync edits to Azure Search.
    
-   Use **Soft Deletes** for submissions, enabling full audit/reporting.
    

### Data Flow

* * *

## **Conclusion**

This technical approach ensures a modular, scalable, and highly searchable dynamic form platform with full integration into **Azure Cognitive Search** for modern reporting and querying needs.

##  Action Items

**Action**

**Description**

**Owner**

**Due date**

**ADO WorkItem**

1

5 5 incomplete

2

##  References and documentation