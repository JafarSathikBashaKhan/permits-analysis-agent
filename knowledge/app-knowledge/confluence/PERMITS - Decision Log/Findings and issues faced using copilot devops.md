# Findings and issues faced using copilot devops

> **Confluence ID:** 1831010312 · **Version:** 4 · **Last updated:** 2026-04-02T06:31:18.887Z
> **Path:** PERMITS - Decision Log
> **URL:** https://marston.atlassian.net/wiki/spaces/FF/pages/1831010312/Findings+and+issues+faced+using+copilot+devops

---

**#**

**Observation**

**Capability/Issue**

**Observed by**

1

For a new requirement, I shared the MoM discussion in the Copilot DevOps chat and requested the generation of a Business Requirements Document (BRD). Copilot DevOps successfully generated the BRD.

Capability

Natarajan

2

By uploading an existing document template, we were able to generate the required format and structure consistently.

Capability

Natarajan

3

Using the generated BRD, we were able to derive and generate the Functional Requirements Document (FRD).

Capability

Natarajan

4

Based on existing work items, Copilot DevOps was able to fetch relevant details and generate a meaningful impact analysis.

Capability

Natarajan

5

Copilot DevOps was useful for comparing content and updating documents by uploading and referencing multiple files simultaneously.

Capability

Natarajan

6

When Copilot DevOps is opened in a dedicated individual tab, it retains the context, uploaded files, and search references used during the active session.

Capability

Natarajan

7

Using existing work items, we were able to generate a BRD for already implemented or in‑progress requirements.

Capability

Natarajan

8

Once the session refreshes or expires, Copilot DevOps does not retain previous chat context. For example, if an FRD was generated earlier and the session expires, the user must re‑provide the FRD details when requesting follow‑up outputs such as generating child work items.

Issue

Session-expiry limitation

9

The Copilot DevOps session expires if left idle for a period of time.

Issue

Session-expiry limitation

10

Occasionally, we encountered a “No server found” error while using Copilot DevOps.

Issue

Intermittent error

11

We were able to directly paste the generated findings and outputs into the relevant work item tabs without additional rework.

Capability

Natarajan

12

Chat feature did not generate functionality‑aligned popup messages for a toggle, even after explicit prompting.

Issue

Prathiba

13

Manual rework was required, whereas M365 Copilot returned correct messages using the same prompt.

Issue

Prathiba

14

Stuck During detail generation of the BRD by providing the information need and it was keep on loading for more than 30 min. and shown error

Issue

Gowtham

15

Work items failed to load error - while i was selecting the Copilot from the work item needed to refresh many time in 5 min interval to get it loaded

Issue

Gowtham

16

When tried to update the existing story which was created by CopilotforDevops via chat feature got the below error. Happened twice while creating six stories

Issue

Gowtham

17

While analyzing the CR, some user stories are in the old ADO board, and Copilot is unable to access them

Issue

Dineshraj

18

**Copilot4DevOps – QA Analysis**

**Test Case Creation:**

-   Although test cases are added to the user story, they are not automatically reflected in the Test Plan. Manual addition to the Requirement Suite is required.
    

[Change Request 223054](https://dev.azure.com/MHPortfolio/Notice%20Processing/_workitems/edit/223054): BO | Payment Plan Customer Alerts - Broken

**Defect Handling:**

**Chat:**

-   Bug severity and priority are set to default values (Priority 2, Severity 3 – Medium).
    
-   These should be reviewed and updated based on the actual impact and criticality of the issue.
    

**Elicit:**

-   Elicit requires input in the form of test cases; however, there is no dropdown option available for selecting test cases—only acceptance criteria are available.
    

[Bug 262737](https://dev.azure.com/MHPortfolio/Notice%20Processing/_workitems/edit/262737): Fix missing 'Email' template type in template CRUD for payment plan alerts

**Common Issues (Chat & Elicit):**

-   Bugs are being linked as “Related” instead of “Child,” which impacts proper traceability.
    
-   Test cases are not being linked correctly as “Tests”; instead, they are being linked as “Related.”
    

**Test Case Review:**

-   Review comments were added, but testers are unable to clearly indicate or tag QA within the comments. (Need Assist For this)
    

[Task 264263](https://dev.azure.com/MHPortfolio/Permits/_workitems/edit/264263): QA | Test Case Review for My Application | Action Button | Renew Before expiry

-   Default tags are been added to the respective QA task while creating task using copilot4devops
    

[Task 265525 QA||Test case Review||School Enforcement Report update](https://dev.azure.com/MHPortfolio/Notice%20Processing/_workitems/edit/265525/?view=edit)

Issue

Jayakumar/ Sree Vidya Ravindran