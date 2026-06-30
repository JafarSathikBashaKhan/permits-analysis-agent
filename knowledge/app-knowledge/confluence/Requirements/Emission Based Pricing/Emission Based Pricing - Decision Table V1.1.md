# Emission Based Pricing - Decision Table V1.1

> **Confluence ID:** 2053832732 · **Version:** 4 · **Last updated:** 2026-06-16T06:52:34.586Z
> **Path:** Requirements / Emission Based Pricing
> **URL:** https://marston.atlassian.net/wiki/spaces/FF/pages/2053832732/Emission+Based+Pricing+-+Decision+Table+V1.1

---

## 1\. Agreed Core Pricing Principles

-   CO₂ value is the **primary driver** for pricing where available.
    
-   Engine size is the **fallback mechanism** when CO₂ is unavailable or not applicable.
    
-   Fuel type determines **surcharge applicability and special handling**.
    
-   Pre‑March 2001 vehicles must **always use engine size**.
    
-   **First Band and Default Band are NOT the same.**
    

* * *

## 2\. Core Pricing Decision Table

Scenario

CO₂ Value

Fuel Type

Reg Date < Mar 2001

Engine Size Available

Expected Pricing Logic

Diesel Surcharge

1

\> 0

Any

No

NA

Use CO₂ band

Based on fuel

2

\> 0

Diesel

No

NA

Use CO₂ band

✅ Apply (if rule applies)

3

\> 0

Electric

No

NA

❌ Not applicable (electric cannot have >0 CO₂)

❌ No

4 ✅

\= 0

**Electric**

No

NA

✅ **ALWAYS use FIRST BAND**

❌ No

5 ✅

\= 0

**Non-electric (Petrol etc.)**

No (Post 2001)

NA

✅ **Use DEFAULT BAND**

❌ No

6 ⚠️

\= 0

Diesel

No

Yes

Use **engine size (NOT default band)**

✅ Apply

7

NULL

Non-diesel

No

Yes

Use engine size

❌ No

8

NULL

Diesel

No

Yes

Use engine size

✅ Apply

9

NA

Any

✅ Yes

Yes

Use engine size ONLY

Based on fuel

10

NA

Electric

Yes

Yes

✅ **Use FIRST BAND**

❌ No

-   Electric vehicles **always = CO₂ 0 and must use FIRST BAND**
    
-   **Default band is NOT equal to first band**
    
-   Default band applies only when:
    
    -   Not electric
        
    -   CO₂ = 0
        
    -   Registration > 2001
        
-   Diesel with CO₂ = 0 → **engine size only**
    

* * *

## 3\. When to Use FIRST BAND vs DEFAULT BAND (STRICT RULE)

### ✅ FIRST BAND (Band 1)

Used when:

-   Vehicle is **electric** (always CO₂ = 0)
    
-   Hybrid treated as electric (CO₂ = 0)
    
-   Any case where Jo confirmed "it will always be the first band"
    

👉 Key rule:

-   **CO₂ = 0 + Electric → FIRST BAND ONLY**
    

* * *

### ✅ DEFAULT BAND

Used ONLY when:

-   Vehicle is **NOT electric**
    
-   CO₂ = 0
    
-   Vehicle registered **after 2001**
    
-   Default band is configured
    

👉 Key rule from Jo:

-   "Not an electric vehicle + CO₂ = 0 + greater than 2001 → default applies"
    

* * *

### ❌ DO NOT CONFUSE

Scenario

Wrong

Correct

Electric CO₂ = 0

Default band

✅ First band

Petrol CO₂ = 0

First band

✅ Default band

Diesel CO₂ = 0

Default band

✅ Engine size

## 4\. Hybrid Vehicle Decision Table (Verified)

Scenario

Fuel Type

CO₂ Value

Expected Logic

H1

Hybrid

\> 0

Use CO₂ band

H2

Hybrid

NULL

Use engine size

H3 ✅

Hybrid

\= 0

✅ Treat as electric → FIRST BAND

H4

Hybrid Diesel

\> 0

Use CO₂ band (+ surcharge if ON)

H5

Hybrid Diesel

NULL

Use engine size (+ surcharge if ON)

H6 ⚠️

Hybrid Diesel

\= 0

✅ Use engine size (diesel rule)

✅ **Verified from call**:

-   Hybrid CO₂ = 0 → treat as electric → first band
    
-   Hybrid diesel always follows diesel fallback logic
    

* * *

## 5\. Special Vehicle Conditions (Corrected)

Scenario

Condition

Expected Logic

S1

Van / Motorhome + CO₂ 0 or NULL

Use engine size

S2

No CO₂ data

Use engine size

✅ Clarified: Not always engine size — only when CO₂ is 0 or NULL

* * *

## 6\. Diesel Surcharge Rules

Scenario

Condition

Outcome

D1

Diesel + Euro < 6 + toggle ON

✅ Apply surcharge

D2

Diesel + Euro ≥ 6

❌ No surcharge

D3

Diesel present in multi-vehicle

✅ Apply surcharge

✅ From call: surcharge controlled by **Euro + toggle configuration**

* * *

## 7\. Critical Edge Cases (Updated)

Edge Case

Scenario

Correct Outcome

E1

CO₂ = 0 + Electric

✅ First band

E2

CO₂ = 0 + Petrol

✅ Default band

E3

CO₂ = 0 + Diesel

✅ Engine size

E4

CO₂ NULL

✅ Engine size

E5

Pre‑2001 vehicle

✅ Engine size

* * *

## 8\. Simplified Validation Flow (Final Verified Logic)

1.  Check registration date
    

→ If < 2001 → engine size

1.  Check CO₂
    

→ If > 0 → CO₂ band

→ If = 0:

-   Electric → FIRST BAND
    

-   Diesel → engine size
    
-   Non-electric → DEFAULT BAND → If NULL → engine size
    

1.  Apply surcharge rules
    

* * *

## 9\. BA Implementation Notes (Final)

-   MUST separate **First Band ≠ Default Band** in config + UI
    
-   Add validation to block wrong mapping:
    
    -   Electric → cannot use default
        
    -   Petrol → cannot use first band (unless explicitly configured)
        
-   Track **band type used (CO₂ / First / Default / Engine size)** in audit logs
    
-   Ensure test cases cover **CO₂ = 0 split logic** (electric vs non-electric vs diesel)