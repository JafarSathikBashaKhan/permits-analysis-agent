# Detailed Architecture Document

> **Confluence ID:** 1134985265 · **Version:** 31 · **Last updated:** 2025-08-20T11:35:25.443Z
> **Path:** (root)
> **URL:** https://marston.atlassian.net/wiki/spaces/FF/pages/1134985265/Detailed+Architecture+Document

---

**Document Name**

Detailed Architecture Document

**Template Version**

1.0

**Application Name**

Permissions

**Client**

MNPS

**Recent Document Author**

Vinoth Thangaraj

**Team**

1 1 incomplete 2 2 incomplete

**Informed**

3 3 complete 4 4 complete 5 fa0f9880-9701-414a-8900-b1ca00da1c8e incomplete 6 2cc4b813-8aeb-4cc2-a35f-a3408f6a390f incomplete 7 c0744d7e-bc21-480a-9924-197d79ebfb1a incomplete

**Status**

approvedGreen

**Last date updated**

e.g.,

**On this page**

**Version** 

**Date** 

**Additions/Modifications** 

**Prepared/Revised By** 

V.3

 14-07-2025

 Initial draft

Vinoth Thangaraj

V.23

 14-08-2025

 Addressed comments received during ARB

 Vinoth Thangaraj

V.28

20-08-2025

Data classification updated.

Vinoth Thanagaraj

**Document Approval**

This section confirms that this document will serve as the Detailed Architecture Document for the product/application as of the latest associated project.

**Role** 

**Name(s)** 

**Approval / Date** 

Chief Architect

approver in author’s channel 

ARB Board 

 14-08-2025

Most Recent Project Manager 

Product Owner 

16truenonelisttrue

## **Introduction and Guidance** 

 The Detailed Architecture Document (DAD) is intended to be the primary knowledge document regarding the architecture of products or applications built by ITS teams.  **Guidance for using the DAD is as follows:**  

**DAD Submission** 

When submitting a Proposed Architecture Review (PAR) slide deck, the associated DAD should also be submitted and have at minimum, the sections marked with a completed.  While an expected document, unlike the PAR it does not require approval. 

**PAR Content** 

The information required to support the PAR deck should be derived from and match the DAD. 

**Living Document** 

As per Agile development, this will be a living document that should be updated to reflect the product/application that is being deployed to production. 

**PAR Tables** 

Tables with are tables that are used by the PAR.   

**Completing the Document** 

Not every section will be relevant to every product or application. 

**Red Text and Sample Diagrams** 

Replace red guidance text and sample images with your content and for text, set font to black.  If you are not filling out that section, replace that placeholder with **Not Applicable**. 

**Very Large Diagrams** 

If an image is too large for this word doc and thus unreadable, please provide a smaller representative image in this doc and a link to the Visio that allows full viewing of the diagram. 

**Visio Template** 

There is an accompanying DAD 2.0 Template diagrams Visio file that can be used for the diagrams in this document. 

**Table of Contents** 

Please ensure that you refresh the table of contents before saving to get accurate page numbers. 

**Browser for Opening Links** 

Many of the links in this document are only accessible via **Chrome** based browsers.  Other browsers may return errors. 

###  **Executive Summary**  

The Permissions initiative is a strategic project to build an in-house, centralized system for managing permits, suspensions, and licences, replacing the existing third-party solution. This modern platform will streamline and automate the full permit and licence lifecycle, reducing inefficiencies and manual workloads.

The Permission system transforms permit and licence management, driving efficiency through automation and reducing manual work and costs. It enhances customer experience with an intuitive self-service portal, clear guidance, and real-time updates, which also lowers support demands. The system’s flexibility supports diverse client needs and future growth, while automated reminders and transparent workflows ensure compliance and accountability. Integrated communications keep users informed, further improving engagement. Overall, this modern, scalable solution positions the organization for better service delivery, rapid adaptation to change, and sustained operational value.

### **Business Value**     

### **Scope**     

The scope of this project includes the end-to-end design and implementation of a modern Permissions System, replacing the current third-party solution with a scalable, secure, and enterprise-aligned architecture. This initiative seeks to eliminate existing system limitations and support the strategic objectives detailed in the project charter. The new system will streamline the management of permits, licences, suspensions, and related applications for both customers and back-office users.

### In-Scope Features

-   **Customer Portal – Responsive Web Application:**  
    A web-based portal accessible on any device (desktop, tablet, or mobile), providing an optimal and consistent user experience for all customers.
    
-   **Native Mobile Application:**  
    A dedicated mobile app for iOS and Android platforms, delivering a mobile-first experience with features tailored for on-the-go usage.
    
-   **Third-Party Service Integrations:**  
    Seamless, configurable integrations with external service providers (e.g., payment gateways, notification services), enabling enhanced functionality and process optimization.
    
-   **Intelligent ChatBot and FAQ :**  
    Integrated chatbot and comprehensive FAQ within the customer portal, offering immediate, context-aware support and reducing reliance on customer contact centers.
    
-   **Diagnostic Q&A:**  
    The Diagnostic Q&A is an interactive, dynamic questionnaire that guides users to the correct permits or licenses. Configured in the Back Office and rendered in the customer portal, it adapts questions based on user responses and provides tailored recommendations with descriptions, requirements, and direct application links.
    
-   **Configurability Based on Client Requirements:**  
    Robust customization options, enabling adaptation of workflows, permit types, business rules, and notifications to meet diverse client needs.
    
-   **Back Office Portal – Permissions Management:**  
    A centralized portal for business operators to efficiently manage and process permits, licenses, suspensions, and regulatory compliance activities.
    
-   **Enhanced Customer Communication Channels:**  
    Multi-channel notifications (SMS, email, postal mail) informing users about application status, expiries, renewals, and other key events.
    
-   **User-Friendly and Accessible Interface:**  
    Intuitive, accessible UI/UX design suitable for users of all technical backgrounds, compliant with accessibility standards.
    
-   **Streamlined Back Office Operations:**  
    Tools and workflows designed to simplify and automate tasks for back office users, improving efficiency and reducing manual intervention.
    
-   **Easy Renewals Workflow:**  
    Guided, user-friendly processes for renewing permits and licences, minimizing friction for customers.
    
-   **Guest User Access for Car Park Permits:**  
    Ability for users to purchase certain permits (e.g., short-stay car park) without creating an account, supporting quick and easy transactions.
    
-   **Automated Approval Processes:**  
    Configurable automation of approval workflows based on defined rules, reducing administrative workload and accelerating service delivery.
    
-   **Security and Compliance:**  
    Implementation of robust security measures to protect user data and ensure regulatory compliance (e.g., GDPR, PCI DSS as applicable from standards defined. SSDLC).
    
-   **Reporting and Audit Trails:**  
    Generation of detailed reports and audit logs to support transparency, accountability, and data-driven decision making.
    

### Out-of-Scope Items

-   **Migration of Historical Data Beyond Agreed Scope:**  
    Only the migration of specific, agreed-upon data sets from the legacy system will be included. Extensive or full historical data migration is excluded.
    
-   **Custom Development for Unspecified Permit Types or Use Cases:**  
    Permit types or workflows not explicitly defined in the current requirements or contract will not be delivered as part of this release.
    
-   **Support for Deprecated or Obsolete Technologies:**  
    The system will not support outdated browsers, operating systems, or technologies not aligned with modern standards.
    
-   **Third-Party System Upgrades or Maintenance:**  
    Any upgrades, maintenance, or changes to third-party services outside the scope of integration (e.g., payment processor infrastructure) are excluded.
    
-   **On-Premise Deployment:**  
    The solution will be delivered as a cloud-hosted platform; on-premise installation or support is not included.
    

### **Definitions, Acronyms and Abbreviations** 

The definitions of any terms, acronyms, and abbreviations required to properly interpret the Detailed Architecture Document.  

**Definition** 

**Description** 

 MNPS

Marston Notice Processing System

 BO

Back Office Portal

CP

Customer Portal

**Acronym** 

**Description** 

**Abbreviation** 

**Description** 

### **References** 

 Relevant additional documentation and links.  Please add others that may be relevant to this product/application.  

**Document or site name** 

**Link or location** 

1.1 Detailed Architecture Document Template 2.1.docx 

1.1 Detailed Architecture Diagrams Template 2.1.vsdx 

 1.

1.1 Proposed Architecture Review Template 2.1.pptx 

1.1 Proposed Architecture Diagrams Template 2.1.vsdx 

Privacy Impact Assessment (PIA) 

Cyber Design Review (CDR) 

Application Standards Site 

## **Architectural Goals** 

 **Usage Statistics**

 This table, used by the ARB, describes who will use this product or application, how they are going to use it and information about the data storage. This provides important insights into how systems and infrastructure are impacted by this solution.  

**Category** 

**Information Requested** 

**Response** 

 _**Targets**_ 

 Target business

MNPS, Councils(16 Councils).

**Council List**: Wandsworth, Dudley, Warrington, Hammersmith & Fulham, Bracknell Forest, Wirral, Warwickshire , Wokingham, Surrey, Waltham Forest, Welwyn Garden City, ESCC, Highlands, Edinburgh, Barnet, Lewisham

 Who are the users? 

Individuals or organizations applying for permits or licences

 _**Users**_ 

 Initial # of users (Internal / External) 

Internal: 20 (Business and BPO Team)

External Users: 28,000 (5 Contracts) - Customers 

 Peak concurrent # of users 

700 Users(2.5% of 28000)

 Yearly growth estimate, # of users 

200%, 1st Year - 4,50,000 Users (When all contracts migrated)

 _**Usage**_ 

 Usage cycle 

Daily

 Is expat usage expected? 

Yes

 Will this be globally deployed?

No

 _**Data Storage**_ 

 Storage type, technology or platform 

Azure SQL

Azure Blob storage for files

 Initial data storage space required  

Azure SQL - 100GB

Blob storage for file - 600GB (28000 Users X 20 files X 1MB each file)

The above storage space mentioned is for Go-live with 5 Contracts migrated.

 Yearly growth estimate, data volume 

50% for the first year

20%-30% from the second year for the existing users

 _**Data Retention**_ 

 Retention period in data storage 

MNPS - 6 Years / Inherited from client

 Purge methodology 

Using the MNPS Purge MicroService, which works based on the contract purge configuration.[https://marston.atlassian.net/wiki/x/BwCJD](https://marston.atlassian.net/wiki/x/BwCJD)

### **Planned Technology Stack \[** **For New Projects\]**

**Category** 

**Technology Focus Area** 

**Proposed State {timelines}** 

_**Cloud**_ 

Azure IAAS 

Azure PAAS 

 App Services,

Azure Function App,

Azure Blob Storage,

Azure Service Bus,

Azure Key Vault,

Application Insights

Azure SAAS 

 Azure Entra

_**OS**_ 

Linux / SUSE / AIX 

Linux

_**Database**_ 

SQL Server 

Azure SQL Database

_**Data Visualization**_ 

PowerBI

_**Integration Services**_ 

Azure Storage Queue

**Presentation Layer** 

React JS

18

DPS

1

**Languages and frameworks** 

C# 

12

.Net

8

React Js  

18

NextJS

14.2.23

TypeScript 

5

**Mobile Framework** 

Android SDK 

34

React Native

0.80

## **Architectural Views (4+1 Framework)** 

The 4+1 architecture views framework is used to describe the solution from the viewpoint of different stakeholders, such as end-users, developers, system engineers and project managers.  

Use Case (Scenario)

### **Use Cases and Scenarios \[If available for small projects\]**   

**Use Case #**

**Scenario**

**Use Case**

**Actor**

### Application Architecture

**React Web application architecture**

Modern frontend apps use a layered architecture to achieve scalability, maintainability, and testability. This approach separates the Presentation (UI), Application (core logic and state), Data (API and storage), and External Services (third-party integrations) layers, with dedicated Test Infrastructure for reliable testing. Each layer has a clear responsibility: UI handles rendering, Application manages business rules, Data abstracts API/storage, and External Services connect to outside systems. This structure supports separation of concerns, improves code organization, enables easier team collaboration, and allows for isolated testing and upgrades, resulting in robust, efficient, and maintainable React applications.

[https://marston.atlassian.net/wiki/x/AgAARw](https://marston.atlassian.net/wiki/x/AgAARw)

### Logical View

#### Conceptual Model

#### Class Diagram

note

Should be added while implementation happens

Should be added while implementation happens

Include Class Diagrams Here

#### Physical Data Flow Diagram

#### Logical Data Model

note

Should be added while implementation happens

Should be added while implementation happens

A Logical Data Model (LDM) provides a visual representation which describes the data in as much detail as possible, without regard to how it will be implemented physically in a database

note-   Includes all entities and their relationships along with their cardinality.  
    
-   All attributes for each entity are specified.  
    
-   The primary key for each entity is specified.  
    
-   Foreign keys are specified. -   Includes all entities and their relationships along with their cardinality.  
    
-   All attributes for each entity are specified.  
    
-   The primary key for each entity is specified.  
    
-   Foreign keys are specified. 

Include Logical Data Model Here

### Development View

The development view illustrates a system from a programmer’s perspective and is concerned with software management. This view is also known as the implementation view. It uses the UML Component diagram to describe system components.

#### Component Diagram

Component diagrams are essentially class diagrams that focus on a system's components that often used to model the static implementation view of a system.

note

A component diagram breaks down the actual system under development into various high levels of functionality. Each component is responsible for one clear aim within the entire system and only interacts with other essential elements on a need-to-know basis.  Said another way, the components diagram:  

-   Does not describe the functionality, but describes the components used to make those functionalities.  
    
-   Is used to visualize the physical components in a system.  
    

Components of a class diagram include Interface, Subsystem, Port, Relationships, etc

A component diagram breaks down the actual system under development into various high levels of functionality. Each component is responsible for one clear aim within the entire system and only interacts with other essential elements on a need-to-know basis.  Said another way, the components diagram:  

-   Does not describe the functionality, but describes the components used to make those functionalities.  
    
-   Is used to visualize the physical components in a system.  
    

Components of a class diagram include Interface, Subsystem, Port, Relationships, etc

noteReference Information: [https://bit.ly/2vtYkZy](https://bit.ly/2vtYkZy)  Reference Information: [https://bit.ly/2vtYkZy](https://bit.ly/2vtYkZy)  

Include Component Diagram Here

#### API Modelling

API Modeling is a technical content deliverable, containing instructions about how to effectively use and integrate with an API. It’s a reference manual containing all the information required to work with the API, with details about the functions, classes, return types, arguments and more, supported by tutorials and examples.

noteDefinition: [https://bit.ly/36cMpNw](https://bit.ly/36cMpNw)  

Reference Information: [https://bit.ly/2XaOgOW](https://bit.ly/2XaOgOW)  Definition: [https://bit.ly/36cMpNw](https://bit.ly/36cMpNw)  

Reference Information: [https://bit.ly/2XaOgOW](https://bit.ly/2XaOgOW)  

If available, please provide a link to your API Contract documentation: Link to API Contract document

#### Physical Data Model

A Physical Data Model (PDM) represents how the model will be physically built in a database. A PDM shows all table structures, column names, data types, column constraints, primary key, foreign key, and relationships between tables.

noteReference Information: [https://bit.ly/2AKK151](https://bit.ly/2AKK151)   Reference Information: [https://bit.ly/2AKK151](https://bit.ly/2AKK151)   

Include Physical Data Model

### Process View

The process view deals with the dynamic aspects of the system. It explains the system processes and how they communicate with a focus on the run time behavior of the system. This view addresses concurrency, distribution, integrator, performance, and scalability.

#### Activity Diagram

The Activity diagram will be used to describe dynamic aspects of the system. It is essentially an advanced version of flow chart that models the flow from one activity to another activity. This will be represented in Business Process Model Notation (BPMN)

noteReference Information: [https://bit.ly/2ZiqzXk](https://bit.ly/2ZiqzXk)   Reference Information: [https://bit.ly/2ZiqzXk](https://bit.ly/2ZiqzXk)   

 Include Activity Diagram Here

#### Sequences Diagram

BackOffice Portal

Customer Portal

#### Data Lineage

### Physical View

#### Deployment Diagram

#### Cloud Infrastructure View \[ For Azure\]

### Infrastructure Digram

### Cloud Architecture

## Data Management

Data management explains how data is classified, stored, secured and processed.

### Data Classification

**Data** 

**Source** 

**Destination** 

**Transfer Method** 

**Retention/Purge Approach** 

**Data Classification** 

 User Profile Data (PII)

 Customer Portal, Mobile

 Azure SQL Database

 HTTPS/REST API

 6 years / Inherited from client, purged via MNPS Purge MicroService

Highly Confidential

Application Data (Permits, Licences, Suspensions)

Customer Portal, Back Office

Azure SQL Database

HTTPS/REST API

Customer Portal - 6 years / Inherited from client, purged via MNPS Purge MicroService

Confidential

Uploaded Documents

Customer Portal, Mobile

Azure Blob Storage

HTTPS/REST API

6 years / Inherited from client, purged via MNPS Purge MicroService

Highly Confidential

Audit Logs

Applications, Services

Azure SQL / Log Analytics

Internal logging/API

6 years / Inherited from client, purged via MNPS Purge MicroService

Confidential

Master Data (Zones, Streets)

Admin Import, BO Portal

Azure SQL Database

HTTPS/REST API

Versioned, as per update policy

Internal

Notification Data (Email/SMS)

Notification Service

External Providers

HTTPS/API, SendGrid, SMS

30 days, auto-delete after send

Confidential

Q&A/ FAQ/Help Content

Admin BO Portal

Customer Portal, Mobile

HTTPS/REST API

Until updated/replaced

Public

Session/Cache Data

Application Frontends

Azure Redis Cache

Encrypted TCP

Expire after session/logout

\--

**Legend for Data Classification:**

-   **Public:** Safe for public disclosure.
    
-   **Internal:** For internal use only, not for external distribution.
    
-   **Confidential:** Sensitive business or personal data, restricted access.
    
-   **Highly Confidential:** Regulated data (e.g., PII, sensitive documents), strictest controls.
    

### Data Ownership

**Data Domain** 

**Source** 

**Data Owner** 

User Profile Data (PII)

Customer Portal, Mobile App

Data Protection Officer

Permit & Licence Data

Customer Portal, Back Office

Permit Operations Lead

Master Data (Zones, Streets, Codes)

Admin Import, System Integrations

Master Data Steward

Application Documents

Customer Portal, Mobile App

Document Management Lead

Audit Logs

Application Services, APIs

IT Security/Compliance Lead

Notification Data

Notification Service

Communications Manager

Q&A, FAQ/Help Content

Admin - BO Portal

Knowledge Management Lead

### Data Storage

**Storage Type, Technology or Platform** 

**Initial data storage space required (GB)** 

**Estimated yearly growth of data volume (GB)** 

Relational Database - Azure SQL Database

100

50 (Year 1), 20–30% annually thereafter

File/Object Storage - Azure Blob Storage

600

300 (Year 1), 20–30% annually thereafter

Cache - Azure Redis Cache

1

<1

Backup/Archive - Azure Backup, Blob GRS

100 (separate from live data)

50–100 (depends on retention policy)

Monitoring/Logging - Azure Log Analytics

5

2–5

**Note:**

-   **Relational Database:** For transactional data (permits, users, audit logs, etc.).
    
-   **Blob Storage:** For uploaded documents, images, and attachments.
    
-   **Redis Cache:** For session data and temporary caching needs.
    
-   **Backup:** Retention and archival space is managed per policy.
    
-   **Monitoring/Logging:** For storing system and audit logs, subject to retention settings.
    

### Data Security

**Security**  

**Security Strategy** 

**Additional Info** 

Authentication

Azure Active Directory (Azure AD), Multi-Factor Authentication (MFA)

Centralized identity management; supports SSO, conditional access

Authorization

Role-Based Access Control (RBAC)

Granular access by user role (Admin, BO, Customer, Guest)

Secret Management

Azure Key Vault

Secure storage for API keys, connection strings, certificates

Data Encryption

Encryption at rest (TDE for SQL, Azure Storage Encryption); Encryption in transit (TLS 1.2+)

All sensitive data encrypted in storage and during transfer

Access Monitoring

Azure Monitor, Log Analytics, and Audit Logs

Real-time monitoring, anomaly detection, comprehensive audit trail

Data Masking

Dynamic data masking in database and UI

Protects sensitive fields in query results and exports

Data Loss Prevention

Restricted data exports, regular security reviews

Export controls, regular penetration and vulnerability testing

Network Security

Azure VNETs, Subnets, NSGs, Private Endpoints, Firewalls

Segmented network, restricted public access, IP allowlists

Compliance

GDPR, Data Protection Act, internal policies

Regular audits and compliance checks

Backup Security

Encrypted backups, restricted access

Backups stored in secure, access-controlled locations

### Data Encryption

**Data Classification**

**Encrypted In-Transit (TLS 1.2)**

**Encrypted at Rest (System/File/Disk Level)**

**Encrypted at Rest (DB Level, e.g. TDE)**

**Encrypted at Rest (DB Column / Application Level)**

Highly Confidential

Yes

Yes (Azure Storage Encryption, AES-256)

Yes (Transparent Data Encryption - TDE)

Yes (Application/Column-level encryption for PII, payment data, etc.)

Confidential

Yes

Yes

Yes

Optional (for sensitive business fields, as needed)

Internal

Yes

Yes

Yes

Not typically required

Public

Yes

Yes

Yes

Not required

### Master Data Usage or Creation

Master data represents agreed-upon shared business information used to describe common business data objects and related reference data. For information about the nature of master data at, please refer to Appendix A.

Master Data Domain

Description

Usage in System

Source / Creation Process

Locations, Zones, Streets

Reference data for geographical/permit boundaries

Used in application forms, eligibility, rule checks

Imported from authoritative datasets, periodically updated by admin or via API

Contravention Codes

Standard codes for violations or infractions

Selectable in permit processing, reporting, workflows

Maintained by compliance or policy team, updated via admin portal or integration

Permit/Licence Types

List of all available permit or licence categories

Used to drive application flows, validations, pricing

Defined by business, managed in admin portal

Correspondence Templates

Standardized letters, emails, SMS formats

Auto-generated notifications and customer comms

Created and versioned by business/communications team

Fee Schedules

Pricing rules for various permits and services

Auto-calculation of charges during applications

Managed by finance/admin, updated as needed

User Roles & Permissions

Roles for BO, customers, admin, guest, etc.

Access control within portals and API

Managed by system admin; mapped to Azure AD roles

Document Types

Types of files that can be uploaded (proof, ID)

Validation and document management workflows

Managed in admin portal

**Key Points:**

-   Master data is centrally managed, versioned, and synchronized across all system components.
    
-   Updates are subject to approval by designated data stewards or business/data owners.
    
-   Data quality and consistency are enforced with validation rules and periodic reviews.
    
-   Integration with external authoritative sources (e.g., council databases) is supported for critical master data (like locations, zones).
    

## Secure SDLC

The Secure Software Development Lifecycle (SSDLC) is used to integrate security into development. Consistent use of the seven phases of SSDLC and appropriate reviews at defined checkpoints strengthens application security and minimizes risks related to solution implementation.

### Cyber Requirements

There are several items required by the cyber review team as per the below table.

**Cyber requirement** 

**Score or Number** 

**Additional information** 

Most recent Cyber Design Review  

Date approved and by whom plus any additional findings of note 

Most recent PIA 

(from [OneTrust](https://app.onetrust.com/app/#/pia/ssp)) 

PIA number goes here 

Date approved and by whom plus any additional findings of note 

Key Testing findings (PEN, SAST, DAST) 

Any scores of note 

Anything that should be noted about Veracode or other scans 

### Software Quality Attributes

**Quality Attributes** 

**Target SLAs** 

Availability 

≥ 99.9% uptime for Web & APIs (equivalent to < 9 hours/year downtime)

Performance Expectations 

Mobile 

API response time ≤ 1.5 seconds for 95% of requests

API

API response time ≤ 1.5 seconds for 95% of requests

Web 

Page load time ≤ 2 seconds for 95% of sessions

Reports 

< 3 Seconds

Disaster Recovery / BCP 

Tier 

Tier 2 (Critical application with regional impact)

Recovery Time Objective (RTO) 

≤ 4 hours

Recovery Point Objective (RPO) 

≤ 15 minutes

Recovery Method 

Azure Site Recovery (Geo-redundant infrastructure, automated failover)

Last BCP App / Platform test date(s) 

Next Compliance due date(s) 

Unit test / code coverage  

Minimum 80% unit test code coverage across all services and UI.

#### Software Quality Strategies

**Strategy / Pattern**

**Layers**

**Description**

**Software Quality Attributes**

Cache-Aside

API, Data Access

Frequently accessed data is cached. On cache miss, data is loaded from DB and added to cache.

Performance, Scalability

Throttling

API

Limits the number of requests in a time window to prevent abuse and ensure fair usage.

Availability, Reliability

Geodes (Traffic Manager)

Web, API, DB

Distributes traffic or workloads across multiple regions or nodes for high availability and load balancing.

Availability, Reliability, Scalability

Gatekeeper

API, Security

Centralized entry point validates and filters incoming requests to protect against unauthorized or malicious access.

Security, Availability

Sharding

Data Layer / DB

Splits large datasets into smaller, more manageable pieces ("shards") to enable horizontal scaling.

Performance, Scalability

Circuit Breaker

API, Service Layer

Automatically detects failures and temporarily blocks requests to failing services to prevent cascading failures.

Resiliency, Availability

Asynchronous Request-Reply

Messaging, Background Jobs

Decouples components to handle requests asynchronously, increasing throughput and fault tolerance.

Scalability, Reliability, Performance

Automated Testing (Unit, API, UI)

All

Automated tests at multiple layers ensure code quality, catch regressions, and support CI/CD.

Maintainability, Reliability, Testability

Monitoring & Alerting

All

Real-time monitoring and alerting on key metrics and errors for rapid incident response.

Availability, Reliability, Supportability

Blue-Green Deployment

Deployment/Release

Maintains two identical production environments to enable zero-downtime releases and quick rollback.

Availability, Reliability

Logging & Audit Trails

All

Centralized logging and traceability for all actions and changes in the system.

Accountability, Traceability, Security

**Key Points:**

-   Strategies and patterns are applied at appropriate layers to maximize system robustness, maintainability, and user experience.
    
-   Software quality attributes include: performance, scalability, reliability, availability, security, maintainability, testability, supportability, accountability, and traceability.
    

#### Business Continuity Plan 

**Tier**

**Recovery Description**

**RPO**

**RTO**

**Recovery Method**

Core

Base services required for support of other applications, communications, restoration of files, etc.  
(WAN, LAN, Identity, Email)

< 6 hours

< 6 hours

Self-healing / Redundant

Tier 1

Extremely high levels of service availability required to support a critical business process. High operational, financial, or reputational risk if failed.

< 6 hours

< 12 hours

Self-healing / Redundant

Tier 2

High availability required to support important business process. Medium to high operational, financial, or reputational risk if failed.

< 24 hours

< 24 hours

Replicated

Tier 3

Service is important, but risk of failure is medium to low.

< 72 hours

< 72 hours

Restored

Tier 4

Non-mission critical; risk of failure is low to none.

< 72 hours

< 20 days

Restored

##### Data Layer

-   **Tier:** Tier 1
    
-   **Recovery Description:** Frequent incremental backups (every 30 min), daily full backup, 7-day retention; stored in secure Azure Blob Storage.
    
-   **RPO:** < 6 hours
    
-   **RTO:** < 12 hours
    
-   **Recovery Method:** Automated restore via Azure Pipelines; health checks and monitoring enabled.
    

##### API & Web Applications

-   **Tier:** Tier 2
    
-   **Recovery Description:** Replicated services, failover in alternate Azure region (e.g., UK West if UK South not available).
    
-   **RPO:** < 24 hours
    
-   **RTO:** < 24 hours
    
-   **Recovery Method:** Geo-replication and manual/automated failover.
    

##### Mobile Application

-   **Tier:** Tier 1
    
-   **Recovery Description:** Offline mode for continued use during outages; data syncs on restoration.
    
-   **RPO:** < 6 hours
    
-   **RTO:** < 12 hours
    
-   **Recovery Method:** Offline-first design, sync on reconnect.
    

#### Disaster Recovery

**Attribute**

**Details**

Scope

Permissions System: Core services for access control, user/role management, audit logging, and authorization APIs

Criticality

Tier 1 (Critical system – high business, operational, and compliance impact)

Recovery Point Objective (RPO)

< 6 hours (maximum acceptable data loss)

Recovery Time Objective (RTO)

< 12 hours (maximum acceptable downtime)

Primary Data Center/Region

Azure UK South (or current main region)

Secondary/DR Data Center/Region

Azure UK West (geo-redundant)

Backup Strategy

-   Incremental backups every 30 minutes
    
-   Daily full backups
    
-   Backups stored securely in Azure Blob Storage
    
-   7-day retention policy
    

Replication

Real-time or near-real-time geo-replication of databases and critical storage to DR region

Failover Mechanism

Automated failover using Azure Site Recovery and Traffic Manager; manual intervention as fallback

Testing

Regular DR drills (at least annually); validation of restore and failover procedures

Monitoring & Alerting

Azure Monitor and Alerts trigger notifications for outages, backup failures, or DR events

Access Control

DR environments protected by same RBAC, network, and encryption policies as production

Documentation

Up-to-date procedures for backup, restore, and regional failover; accessible to key IT and business continuity staff

Compliance

DR plan reviewed regularly for GDPR and regulatory compliance

Communication Plan

Stakeholder notification procedures in place for DR events

#### Security

**Security Domain**

**Security Strategy**

**Additional Info**

Authentication

Azure Active Directory (Azure AD), Multi-Factor Authentication (MFA)

Centralized identity management, supports SSO and conditional access

Authorization

Role-Based Access Control (RBAC)

Fine-grained access by user role (Admin, Back Office, Customer, Guest)

Data Protection

Encryption In-Transit (TLS 1.2+), Encryption At Rest (TDE, AES-256)

All sensitive data encrypted during transfer and storage

Secret Management

Azure Key Vault

Secure storage for secrets, API keys, and certificates

Access Monitoring

Azure Monitor, Audit Logs, Log Analytics

Real-time monitoring, alerting, and comprehensive audit trail

Data Loss Prevention

Export controls, regular security reviews, endpoint protection

Data exports restricted, periodic penetration testing

Network Security

Azure VNETs, Network Security Groups (NSG), Firewalls, Private Endpoints

Segmented network, restricted public access, IP allowlisting

Compliance

GDPR, Data Protection Act, internal security policies

Regular audits and compliance checks

Backup Security

Encrypted, access-controlled backups

Backups stored securely, access limited to authorized personnel

#### Usability

Usability is the degree to which a software can be used by specified consumers to achieve quantified objectives with effectiveness, efficiency, and satisfaction in a quantified context of use. Please provide links for the below artifacts as applicable to your product or application.

 **Prototype:** High-fidelity representation of the final product which is meant to simulate user interaction. Unlike the previous two, a prototype is clickable and thus allows the user to experience content and interactions in the interface. 

Link: [https://marston.atlassian.net/wiki/x/BwAUPw](https://marston.atlassian.net/wiki/x/BwAUPw)

#### Maintainability / Supportability 

Maintainability is the ability of the system to support changes and Supportability is the ability of the system to provide useful information for identifying and solving problems.

**Technology/framework** 

**Layer** 

**Strategy** 

Azure monitoring 

Web/API

Instrumentation

Log Analytics 

Azure Function Apps

Logging

App Insights 

Web/API

Diagnosis

Azure Monitoring 

Web/API

Alerts / Notification

App Insights 

Web/API

Web Analytics

## DevSecOps

### Continuous Integration / Continuous Deployment

**Setting Up CI/CD Pipelines for iOS and Android** -

[https://marston.atlassian.net/wiki/x/AQCYHw](https://marston.atlassian.net/wiki/x/AQCYHw)

### Green Architecture (Reusability)

**Green Architecture Component**

**Description**

Cloud Resource Optimization

Utilize auto-scaling, serverless, and right-sized virtual machines to minimize idle resources and reduce energy usage.

Efficient Data Storage

Employ data tiering, archiving, and deduplication to lower storage footprint and power consumption.

Sustainable Coding Practices

Optimize algorithms and code for performance, reducing compute cycles and energy demand.

Serverless & Event-Driven Design

Use serverless functions and event-driven workflows to process workloads only when needed, minimizing resource use.

Renewable Energy Data Centers

Select cloud providers (e.g., Azure) with commitments to renewable energy and carbon-neutral operations.

Resource Scheduling

Schedule batch jobs and intensive processing for off-peak hours to leverage green grid availability and lower impact.

Monitoring & Reporting

Implement tools to monitor resource usage and carbon footprint, providing transparency and opportunities for tuning.

Paperless Operations

Digitalize forms, approvals, and documentation to eliminate paper waste and reduce environmental impact.

Lifecycle Management

Automate cleanup and lifecycle policies for obsolete data, resources, and backups to avoid unnecessary energy use.

Remote Collaboration Tools

Use digital collaboration platforms to reduce travel, supporting remote work and virtual meetings.

**Key Points:**

-   The permissions system is architected with sustainability in mind, leveraging cloud-native and digital-first strategies to minimize environmental impact.
    
-   Continuous review and optimization ensure alignment with evolving green IT standards.
    

### Performance Engineering Load Model 

**Metric**

**Description**

**Typical Values / Targets**

Transaction Response Time

Time taken to complete a business transaction (e.g., user login, permission grant)

< 2 seconds for 95th percentile

Concurrent User Loads Supported

Maximum number of simultaneous active users without performance degradation

500-2,000 users (based on sizing and scaling)

Server Throughput

Number of requests or transactions processed per second

100-500 requests/sec (under peak load)

Browser Performance

End-user perceived load and render time for web application

Page load < 3 seconds (95th percentile)

Code Performance

Efficiency of core functions, algorithms, and database queries

No individual function > 200ms

Server Resource Utilization

CPU, memory, disk, and network usage during load testing

CPU < 70%, Memory < 75%, Disk/Network < 70%

**Notes:**

-   Load and stress tests are executed using realistic scenarios and test data.
    
-   Monitoring tools (e.g., Azure Monitor, Application Insights, JMeter, or k6) are used to gather metrics.
    
-   Test results inform tuning of database, code, and infrastructure.
    
-   Performance tests are repeated regularly and after major changes to ensure continued scalability and responsiveness.
    

**Reference Document**

1.  [Marston Detailed Architecture Document Template 1.0.docx](https://nsl365.sharepoint.com/:w:/r/sites/LV-Tech/Shared%20Documents/LV-%20Tech/Marston%20Detailed%20Architecture%20Document%20Template%201.0.docx?d=w8af92e5623264d7983f2202bf31ddefe&csf=1&web=1&e=1auXQF)