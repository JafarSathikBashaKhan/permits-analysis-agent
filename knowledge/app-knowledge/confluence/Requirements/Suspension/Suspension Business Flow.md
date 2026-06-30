# Suspension Business Flow

> **Confluence ID:** 1987018767 · **Version:** 4 · **Last updated:** 2026-05-27T09:26:24.442Z
> **Path:** Requirements / Suspension
> **URL:** https://marston.atlassian.net/wiki/spaces/FF/pages/1987018767/Suspension+Business+Flow

---

**Application submitted**

Pending Approval

Begin Review

Email trigger

In Progress

Waiting for customer information

Being Review

Request support evidence

Evidence Provided

Being Review

Internal Referral

Being Review

On Hold (Within selected duration)

On Hold--> Resume

Resumed moved to In Progress 

in progress

Approve

Waiting for payment  
(once payment completed and recorded) Active 

Reject

Rejected

**Record Offline Payment**

Waiting for Payment

waiting for payment

If the application is (Physical) Print

No Action button

(Once printed) Assign Task

Assign task to CEO (button)

Notification to bo user who assign the task and BO manager

Active

Cancel Application

Cancel Application 

Cancelled Assign task

Notification to bo user who assign the task and BO manager

Cancelled

No Action button

Application reaches it expiry moved to Expired Assign Task

Notification to Bo user who assign the task and BO manager

Assign task to CEO (button)

Expired 

No Action button

Task Assigned

Cancel task (BO or HHD)

Notification to bo user who assign the task and BO manager

Cancelled task assigned

Cancel task (BO or HHD)

Notification to bo user who assign the task and BO manager

Expired Task Assigned

Cancel task (BO or HHD)

Notification to bo user who assign the task and BO manager

**CEO Flow**

Specific CEO (the same should be applicable for Cancelled Assign task & Expired Assign Task status but the tittle is as mentioned below)

When the application is in Assign task status

Invoke 'Assign task to CEO'

Tittle - Put Up Suspension  
Category - Suspension  
Location - Street name (It should be street name enter in the bay details tab, additionally if town field is enabled then populate the town name)  
Comment - should have the bay type and respective bay spaces entered and they can add additional comments 

CEO task details are entered in CEO tab in application menu  
Task status should be 'Assigned'

In MNPS task menu based on PCN CEO Mapping task detail should appear

Task assigned to that specific HHD.  
(The HHD CEO location and the suspension location are not the same.) Regardless of the CEO HHD location, the suspension task can be assigned to any location.

Task appers in CEO HHD in Assigned tab 

If the specific CEO isn't logged in at that time, then should see the message when confirm to that message then it should be assigned to all available who logged in 

**CEO Flow**

Any Available CEO (the same should be applicable for Assign task status but the tittle is as mentioned above)

When the application is in Cancelled Assign Task & Expired Assign Task status

Invoke 'Assign task to CEO'

Tittle - Take Down Suspension  
Category - Suspension  
Location - Street name (It should be street name enter in the bay details tab, additionally if town field is enabled then populate the town name)  
Comment - should have the bay type and respective bay spaces entered and they can add additional comments 

CEO task details are entered in CEO tab in application menu  
Task status should be 'Unassigned'

In MNPS task menu based on PCN CEO Mapping task detail should appear

Task assigned to all CEO HHD on that contract.  
(The HHD CEO location and the suspension location are not the same.) Regardless of the CEO HHD location, the suspension task can be assigned to any location.

Task appers in CEO HHD in Unassigned tab and also in CEO tab in apply and MNPS task screen the task status should be 'Unassigned'

If the CEO is offline then should not accept or reject the task

**CEO Task Cancel Flow**

When the application is in Assign Task, Cancelled Assign Task & Expired Assign Task status

Cancel task Button should show in the MNPS, apply BO and also in HHD ''Cancel"

When the task is cancelled in the MNPS, Apply IQ or HHD 

The task status should be updated to 'Cancelled' in Apply & MNPS

And the application status should be moved to previous status

And should notifiy to the BO user who assign the task and BO manager in apply

And the task details should removed in HHD

**Application purchase Flow**

Different Pricing Rule

Pricing Calculation 

Standard Pricing

Single Bay Type Selected  
Total Price = Number of Bay Spaces × Duration × Configured Price per Bay  
Multiple Bay Type Selected  
Total Price = Σ (Number of Bay Spaces × Duration × Configured Price per Bay Type)

Minimum + incremental

 Total Price = Minimum Suspension Charge + (Additional Duration × Incremental (Bay type) Price × Number of Bay Spaces)  
If Multiple Bay is selected and this calculation should be against each selected bay types

Flexible Duration with Fixed Price

Total Price = Sum of configured duration prices for each selected bay type (bay space count is not applied).

Single Fixed Price (No Duration)

For Fixed Pricing, the total payable amount is always equal to the configured fixed price, regardless of duration, number of bay types selected, or number of bay spaces.

**Configuration Reflect in Application Form**

**Permission Builder**

**Application Form**

Multiple bays is enabled 

Should be able to select the multiple bay type

Short notice fee is enabled

Based on the lead days and the start date they have selected the short notice fee is applied

Multiple Vehicle is enabled

Then should add multiple vehicle (VRM) in the suspension details tab based on the configuration

Contract Setting

Application Form

Manual Street is selected

Should be able to enter the street name in bay details tab

System street is selected

Should be able to select the system configured street name in bay details tab

Town field is enabled & Manual Street is selected

Should be able to enter the town name in bay details tab

Town field is enabled & System Street is selected

Should be able to select the system configured town name in bay details tab

Maximum Suspension Per Street is selected

Then a user should be able to purchase the suspension on the same street based on the configuration

**Purchase Reason Configuration**

**Application Form**

Based on the configuration of the contract and permission type the purchase reason should be available in the application form suspension details tab

**Bay Type Configuration**

Application Form & Permission Builder

Based on the configuration of the contract and permission type the bay type should be available in the application form suspension details tab and pricing tab in permission builder

**Suspension User Guide**

Configure Suspension Specific Settings In Permission Builder & Contract Settings

[https://app.guidde.com/share/playbooks/qdkyf6oPy1Xk3Htu76A2tG?origin=a0l4x2CM5PYM5SJe4Whex3VLBd03&mode=videoAndDoc](https://app.guidde.com/share/playbooks/qdkyf6oPy1Xk3Htu76A2tG?origin=a0l4x2CM5PYM5SJe4Whex3VLBd03&mode=videoAndDoc)

Complete Suspension Purchase Workflow in Apply IQ - Pricing Rule (Standard Pricing)

[https://app.guidde.com/share/playbooks/8Sg7ZDJERe582RS9rKaWoK?origin=a0l4x2CM5PYM5SJe4Whex3VLBd03&mode=videoAndDoc](https://app.guidde.com/share/playbooks/8Sg7ZDJERe582RS9rKaWoK?origin=a0l4x2CM5PYM5SJe4Whex3VLBd03&mode=videoAndDoc)

Complete Suspension Purchase Workflow in Apply IQ - Pricing Rule (Minimum + Incremental)

[https://app.guidde.com/share/playbooks/n1DpdRyZXrvvaqSaLvqteA?origin=a0l4x2CM5PYM5SJe4Whex3VLBd03&mode=videoAndDoc](https://app.guidde.com/share/playbooks/n1DpdRyZXrvvaqSaLvqteA?origin=a0l4x2CM5PYM5SJe4Whex3VLBd03&mode=videoAndDoc)

Application Review Flow

[https://app.guidde.com/share/playbooks/3u4jXajbtSD7UHC9KixqT4?origin=a0l4x2CM5PYM5SJe4Whex3VLBd03&mode=videoAndDoc](https://app.guidde.com/share/playbooks/3u4jXajbtSD7UHC9KixqT4?origin=a0l4x2CM5PYM5SJe4Whex3VLBd03&mode=videoAndDoc)

How to assign a suspension task in Apply IQ and CEO Task Completion Flow And Sync Back To Apply IQ

[https://app.guidde.com/share/playbooks/vxRvijAKgtTJ7X1bKYcS1o?origin=a0l4x2CM5PYM5SJe4Whex3VLBd03&mode=videoAndDoc](https://app.guidde.com/share/playbooks/vxRvijAKgtTJ7X1bKYcS1o?origin=a0l4x2CM5PYM5SJe4Whex3VLBd03&mode=videoAndDoc)

Assign and Manage Tasks Efficiently in Apply IQ Application

[https://app.guidde.com/share/playbooks/1EBwpWtrjxgZuNBGcik2Cn?origin=a0l4x2CM5PYM5SJe4Whex3VLBd03&mode=videoAndDoc](https://app.guidde.com/share/playbooks/1EBwpWtrjxgZuNBGcik2Cn?origin=a0l4x2CM5PYM5SJe4Whex3VLBd03&mode=videoAndDoc)

Cancel Tasks In Apply IQ Application

[https://app.guidde.com/share/playbooks/awJZH14SHRYD2BzXqrwihV?origin=a0l4x2CM5PYM5SJe4Whex3VLBd03&mode=videoAndDoc](https://app.guidde.com/share/playbooks/awJZH14SHRYD2BzXqrwihV?origin=a0l4x2CM5PYM5SJe4Whex3VLBd03&mode=videoAndDoc)

**One Drive Link:**

[Suspension\_userguide.zip](https://nsl365-my.sharepoint.com/:u:/g/personal/natarajan_a_logicvalley_in/IQAUEYoKwYndRpT2FPf3iiUkARsmZ4zVAkRKaO70oJsyIYk?e=DhYRv5)