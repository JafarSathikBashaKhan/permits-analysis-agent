# Overview of Illumin8 GetByCoordinates Flow for Vehicle Parking Eligibility

> **Confluence ID:** 2021785713 · **Version:** 2 · **Last updated:** 2026-06-05T13:19:44.824Z
> **Path:** MOM - Apply IQ
> **URL:** https://marston.atlassian.net/wiki/spaces/FF/pages/2021785713/Overview+of+Illumin8+GetByCoordinates+Flow+for+Vehicle+Parking+Eligibility

---

FOR feature MEV

## **Overview of Illumin8 GetByCoordinates Flow**

1.  **Input**
    
    -   The API receives:
        
        -   **VRN (Vehicle Registration Number)**
            
        -   **GPS coordinates (X/Y)**
            
2.  **Eligibility Check**
    
    -   These inputs are passed to the stored procedure:
        
        -   `ParkMap.CheckEligibility`
            
3.  **Bay Identification**
    
    -   `CheckEligibility` calls:
        
        -   `ParkMap.FindBayByGPS_Polygon`
            
    -   This procedure:
        
        -   Uses `ParkMap.ParkingBayCoordinates` to construct bay polygons
            
        -   Applies padding around polygons
            
        -   Determines which **parking bay contains the GPS point**
            
        -   Returns the **Bay ID**
            
4.  **Validation Logic**
    
    -   `CheckEligibility`:
        
        -   Uses the Bay ID to trace mappings through:
            
            -   **Bays → Streets → Zones**
                
            -   **Zones → Permit types → Parking schedules/sessions**
                
        -   Verifies whether the **VRN is eligible to park**
            

* * *

## **Key Data Sources**

### **Spatial Mapping**

-   `ParkMap.ParkingBayCoordinates` – Defines bay polygons
    
-   `ParkMap.ParkingBays`, `ParkMap.Streets`, `ParkMap.Zones`, `ParkMap.StreetZones`
    

### **Parking Rules & Schedules**

-   `ParkMap.ParkingSchedules`
    
-   `ParkMap.ParkingSchedulePermitTypeGroup`
    
-   `ParkMap.PermitTypeGroups`
    
-   `ParkMap.PermitTypes`
    

### **Special Events Handling**

-   `ParkMap.SpecialEventGroups`
    
-   `ParkMap.SpecialEventGroupSpecialEvent`
    
-   `ParkMap.SpecialEventSchedules`
    

### **Parking Sessions (Dynamic Data)**

-   `tblPermits` – Sessions from Apply
    
-   `tblParking` – Sessions from third parties (e.g., RingGo)
    

### **System Metadata**

-   `tblInstance` – List of councils
    

* * *

## **Key Note**

-   All mapping tables are **manually configured**
    
-   Only `tblPermits` **and** `tblParking` are dynamically populated from external systems
    

* * *

## **In One Line**

The system determines a vehicle’s parking eligibility by mapping GPS coordinates to a parking bay polygon, then validating the VRN against configured rules, permits, and active parking sessions.

### Quick reading of the flow

-   **Input:** VRN + GPS coordinates
    
-   **Main procedure:** `ParkMap.CheckEligibility`
    
-   **Bay lookup:** `ParkMap.FindBayByGPS_Polygon`
    
-   **Polygon source:** `ParkMap.ParkingBayCoordinates`
    
-   **Validation path:** Bay → Street → Zone → Permit Type / Parking Schedule
    
-   **Session checks:** `tblPermits` and `tblParking`
    
-   **Output:** **Eligible / Not Eligible**