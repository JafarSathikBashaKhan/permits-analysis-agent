# 24-04-26 Discussion on Permission System: Basket Functionality, Payment Methods, and Future Enhancements

> **Confluence ID:** 1997045777 · **Version:** 1 · **Last updated:** 2026-05-27T10:40:21.553Z
> **Path:** MOM - Apply IQ
> **URL:** https://marston.atlassian.net/wiki/spaces/FF/pages/1997045777/24-04-26+Discussion+on+Permission+System+Basket+Functionality+Payment+Methods+and+Future+Enhancements

---

**Meeting:** Permission System – Discussion with Jo  
**Source:** Teams meeting transcript  
**Participants (speakers):** Prathiba K, Joanne Archer, Savit Bowry, Pugazh Vaanan.V [\[Permission...Recording | Video\]](https://nsl365-my.sharepoint.com/personal/gowtham_kandasamy_logicvalley_in/Documents/Recordings/Permission%20System%20-%20Discussion%20with%20Jo-20260424_093433UTC-Meeting%20Recording.mp4)

* * *

### 1\. Basket Function & Multiple Permissions

-   Users can add **multiple permits to a single basket**. [\[Permission...Recording | Video\]](https://nsl365-my.sharepoint.com/personal/gowtham_kandasamy_logicvalley_in/Documents/Recordings/Permission%20System%20-%20Discussion%20with%20Jo-20260424_093433UTC-Meeting%20Recording.mp4)
    
-   Users **cannot partially process items** within the same basket (i.e., cannot submit only some items without removing others first). [\[Permission...Recording | Video\]](https://nsl365-my.sharepoint.com/personal/gowtham_kandasamy_logicvalley_in/Documents/Recordings/Permission%20System%20-%20Discussion%20with%20Jo-20260424_093433UTC-Meeting%20Recording.mp4)
    

* * *

### 2\. Payment Method Compatibility in Basket

-   A permit can be added to the basket **only if it shares at least one common payment method** with existing basket items. [\[Permission...Recording | Video\]](https://nsl365-my.sharepoint.com/personal/gowtham_kandasamy_logicvalley_in/Documents/Recordings/Permission%20System%20-%20Discussion%20with%20Jo-20260424_093433UTC-Meeting%20Recording.mp4)
    
-   If **no common payment method** exists, the system should **prevent adding the permit to the basket** and show appropriate messaging. [\[Permission...Recording | Video\]](https://nsl365-my.sharepoint.com/personal/gowtham_kandasamy_logicvalley_in/Documents/Recordings/Permission%20System%20-%20Discussion%20with%20Jo-20260424_093433UTC-Meeting%20Recording.mp4)
    
-   Mixing **postal payment** permits with **online payment (Pay Now / Registered Card)** in the same payable flow is **not supported**. [\[Permission...Recording | Video\]](https://nsl365-my.sharepoint.com/personal/gowtham_kandasamy_logicvalley_in/Documents/Recordings/Permission%20System%20-%20Discussion%20with%20Jo-20260424_093433UTC-Meeting%20Recording.mp4)
    

* * *

### 3\. Handling Mixed Payment Scenarios

-   Agreement reached that:
    
    -   Applications **can still be submitted together**,
        
    -   But **payments will be split** based on payment method (online vs postal / after‑approval). [\[Permission...Recording | Video\]](https://nsl365-my.sharepoint.com/personal/gowtham_kandasamy_logicvalley_in/Documents/Recordings/Permission%20System%20-%20Discussion%20with%20Jo-20260424_093433UTC-Meeting%20Recording.mp4)
        
-   Messaging is required to clearly inform users:
    
    -   Which permits can be paid online now
        
    -   Which permits require payment via other methods later [\[Permission...Recording | Video\]](https://nsl365-my.sharepoint.com/personal/gowtham_kandasamy_logicvalley_in/Documents/Recordings/Permission%20System%20-%20Discussion%20with%20Jo-20260424_093433UTC-Meeting%20Recording.mp4)
        

* * *

### 4\. After‑Approval & Offline Payments

-   Permits with **after‑approval payment** can be submitted but **paid only after approval**. [\[Permission...Recording | Video\]](https://nsl365-my.sharepoint.com/personal/gowtham_kandasamy_logicvalley_in/Documents/Recordings/Permission%20System%20-%20Discussion%20with%20Jo-20260424_093433UTC-Meeting%20Recording.mp4)
    
-   Such permits are treated similarly to **postal/offline payment** in basket logic. [\[Permission...Recording | Video\]](https://nsl365-my.sharepoint.com/personal/gowtham_kandasamy_logicvalley_in/Documents/Recordings/Permission%20System%20-%20Discussion%20with%20Jo-20260424_093433UTC-Meeting%20Recording.mp4)
    

* * *

### 5\. Payment Plans (Monthly / Quarterly)

-   **Payment plans** (monthly/quarterly) are supported **only with card‑based payments** (Registered Card). [\[Permission...Recording | Video\]](https://nsl365-my.sharepoint.com/personal/gowtham_kandasamy_logicvalley_in/Documents/Recordings/Permission%20System%20-%20Discussion%20with%20Jo-20260424_093433UTC-Meeting%20Recording.mp4)
    
-   Card token is stored via the payment provider for recurring charges. [\[Permission...Recording | Video\]](https://nsl365-my.sharepoint.com/personal/gowtham_kandasamy_logicvalley_in/Documents/Recordings/Permission%20System%20-%20Discussion%20with%20Jo-20260424_093433UTC-Meeting%20Recording.mp4)
    

* * *

### 6\. Future / Out‑of‑Scope Items

-   **Apple Pay & Google Pay**: Not part of the first live release; planned for later. [\[Permission...Recording | Video\]](https://nsl365-my.sharepoint.com/personal/gowtham_kandasamy_logicvalley_in/Documents/Recordings/Permission%20System%20-%20Discussion%20with%20Jo-20260424_093433UTC-Meeting%20Recording.mp4)
    
-   **Taxi Card permits**:
    
    -   No active client demand.
        
    -   Stories to remain in backlog and not prioritised. [\[Permission...Recording | Video\]](https://nsl365-my.sharepoint.com/personal/gowtham_kandasamy_logicvalley_in/Documents/Recordings/Permission%20System%20-%20Discussion%20with%20Jo-20260424_093433UTC-Meeting%20Recording.mp4)
        

* * *

### 7\. Print & Reprint of Physical Permits

-   System must **store a copy of the printed permit** within the application. [\[Permission...Recording | Video\]](https://nsl365-my.sharepoint.com/personal/gowtham_kandasamy_logicvalley_in/Documents/Recordings/Permission%20System%20-%20Discussion%20with%20Jo-20260424_093433UTC-Meeting%20Recording.mp4)
    
-   **Reprint functionality** must be available as standard for physical permits. [\[Permission...Recording | Video\]](https://nsl365-my.sharepoint.com/personal/gowtham_kandasamy_logicvalley_in/Documents/Recordings/Permission%20System%20-%20Discussion%20with%20Jo-20260424_093433UTC-Meeting%20Recording.mp4)
    
-   Reprints should:
    
    -   Go through the print queue
        
    -   Be identifiable as **replacement permits**
        
    -   Charging for reprints should be **configurable**. [\[Permission...Recording | Video\]](https://nsl365-my.sharepoint.com/personal/gowtham_kandasamy_logicvalley_in/Documents/Recordings/Permission%20System%20-%20Discussion%20with%20Jo-20260424_093433UTC-Meeting%20Recording.mp4)
        

* * *

### 8\. Dispensations – Zonal vs Non‑Zonal

-   New requirement identified to support **zonal and non‑zonal dispensations**, driven by bid requirements. [\[Permission...Recording | Video\]](https://nsl365-my.sharepoint.com/personal/gowtham_kandasamy_logicvalley_in/Documents/Recordings/Permission%20System%20-%20Discussion%20with%20Jo-20260424_093433UTC-Meeting%20Recording.mp4)
    
-   For **Southend**:
    
    -   Only **non‑zonal** dispensations are required now.
        
    -   Zonal dispensations to be kept in backlog. [\[Permission...Recording | Video\]](https://nsl365-my.sharepoint.com/personal/gowtham_kandasamy_logicvalley_in/Documents/Recordings/Permission%20System%20-%20Discussion%20with%20Jo-20260424_093433UTC-Meeting%20Recording.mp4)
        

* * *

### 9\. Actions & Next Steps

-   **BA/UX** to update:
    
    -   BRD/user stories for basket and payment method rules
        
    -   User messaging for mixed payment scenarios [\[Permission...Recording | Video\]](https://nsl365-my.sharepoint.com/personal/gowtham_kandasamy_logicvalley_in/Documents/Recordings/Permission%20System%20-%20Discussion%20with%20Jo-20260424_093433UTC-Meeting%20Recording.mp4)
        
-   **Pugazh** to prepare a **basket layout/mock** reflecting grouped/payment‑based flows. [\[Permission...Recording | Video\]](https://nsl365-my.sharepoint.com/personal/gowtham_kandasamy_logicvalley_in/Documents/Recordings/Permission%20System%20-%20Discussion%20with%20Jo-20260424_093433UTC-Meeting%20Recording.mp4)
    
-   **Prathiba** to share a snapshot of **remaining user stories** with Joanne.