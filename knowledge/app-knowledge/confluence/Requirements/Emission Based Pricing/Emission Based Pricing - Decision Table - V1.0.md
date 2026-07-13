# Emission Based Pricing - Decision Table - V1.0

> **Confluence ID:** 2010742794 · **Version:** 4 · **Last updated:** 2026-06-16T06:47:01.666Z
> **Path:** Requirements / Emission Based Pricing
> **URL:** https://marston.atlassian.net/wiki/spaces/FF/pages/2010742794/Emission+Based+Pricing+-+Decision+Table+-+V1.0

---

## 1\. Core Pricing Decision Table

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

✅ Apply

3

\> 0

Electric

No

NA

Use CO₂ band

❌ No

4

\= 0

Electric

No

NA

Use **1st band** if the CO2 band is not configured for 0

❌ No

5

\= 0

Petrol

No

NA

**band** if the CO2 band is not configured for 0

❌ No

6 ⚠️

\= 0

Diesel

No

Yes

Use **engine size** and apply the **diesel surcharge**

✅ Apply

7

NULL

Any (non-diesel)

No

Yes

Use **engine size**

❌ No

8

NULL

Diesel

No

Yes

Use **engine size**

✅ Apply

9

NA

Any

✅ Yes

Yes

Use **engine size ONLY**

Based on fuel

10

NA

Electric

Yes

Yes

Band 1

❌ No

* * *

## 2\. Hybrid Vehicle Decision Table

Scenario

Fuel Type

CO₂ Value

Diesel Component

Surcharge Toggle

Expected Logic

Diesel Surcharge

H1

Hybrid

\> 0

No

NA

Use CO₂ band

❌ No

H2

Hybrid

NULL

No

NA

Use engine size

❌ No

H3

Hybrid

\= 0

No

NA

Treat as electric → 1 band

❌ No

H4

Hybrid Diesel

\> 0

Yes

OFF

Use CO₂ band

❌ No

H5

Hybrid Diesel

\> 0

Yes

ON

Use CO₂ band

✅ Apply

H6

Hybrid Diesel

NULL

Yes

ON

Use engine size

✅ Apply

H7 ⚠️

Hybrid Diesel

\= 0

Yes

ON

Use engine size

✅ Apply

* * *

## 3\. Special Vehicle Conditions

Scenario

Vehicle Type

CO₂ Available

Expected Logic

S1

Van / Motorhome

0/NULL/NA

Use engine size

S2

Vehicle without CO₂

❌ No

Use engine size

* * *

## 4\. Diesel Surcharge Rules

Scenario

Fuel Type

Euro 6

Surcharge

D1

Diesel

No

✅ Apply

D2

Diesel

Yes

❌ Do NOT apply

D3

Hybrid Diesel

No

✅ Apply (if toggle ON)

D4

Hybrid Diesel

Yes

❌ Do NOT apply

* * *

## 5\. Critical Edge Cases

Edge Case ID

Scenario

Expected Outcome

E1

CO₂ = 0 + Diesel

Use engine size (NOT lowest band)

E2

CO₂ NULL + Engine size missing

❗ Pricing cannot be calculated

E3

Vehicle before Mar 2001

Always engine size

E4

Electric vehicle

Always lowest band

E5

Hybrid logic not configured

❗ Should follow default rule or fail config

E6

Diesel surcharge disabled

No surcharge applied

E7

Hybrid diesel + toggle OFF

No surcharge

* * *

## 6\. Simplified Validation Flow

wide1800 0 → CO₂ band → If = 0: - Diesel → engine size - Others → 1st default band → If NULL → engine size 3. Apply fuel rules → Diesel → surcharge (if applicable) → Electric → lowest band → Hybrid → follow config 4. Apply hybrid diesel surcharge condition (toggle-based)\]\]>