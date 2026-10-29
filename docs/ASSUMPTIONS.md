# BOLDDEE RENTALS — SYSTEM ASSUMPTIONS & DEFAULT CONFIGURATIONS
**Document Version:** 1.0  
**Status:** Working Baseline  
**Governing SRS:** `extracted_srs.txt`  

This document tracks all business rules and parameters where the SRS is ambiguous, flexible, or silent. To adhere to strict enterprise principles, every assumption below is implemented behind **system configuration settings** with clearly-labelled, sensible defaults that administrators can adjust at any time via the Admin Settings portal.

---

## 1. Financial & Payment Settings

| Parameter | Default Value | Rationale & SRS Reference |
| :--- | :--- | :--- |
| **Default Currency** | `GH₵` (Ghana Cedi) | Standard currency of Ghana; conforms to SRS §46 & §47. |
| **Default Booking Deposit** | `60%` | Specified in SRS FR-023 and checkout mock baseline. |
| **Balance Payment Deadline** | `48 Hours before Event Delivery` | SRS BR-004 requires a clear deadline for balance completion. 48 hours allows operations staff to dispatch inventory with zero payment risk. |
| **Security Deposit Rule** | Item-specific (e.g. GH₵150/tent, GH₵3/chair) | Conforms to SRS FR-024; tracked in separate escrow balance until post-event return inspection. |
| **Currency Minor Units** | Integer Pesewas (1 GH₵ = 100 Pesewas) | Prevents JavaScript floating-point rounding errors on financial transactions. |

---

## 2. Rental Availability & Buffer Rules

| Parameter | Default Value | Rationale & SRS Reference |
| :--- | :--- | :--- |
| **Delivery / Setup Buffer** | `1 Day prior to event` | SRS FR-012 requires accounting for delivery and setup buffer periods so equipment is prepared ahead of time. |
| **Pickup / Cleaning Buffer** | `1 Day following event return` | Allows inventory inspection, washing, and restacking before the next reservation. |
| **Unpaid Booking Hold TTL** | `30 Minutes` | SRS BR-009 double-booking prevention. Holds placed on inventory during checkout expire after 30 minutes if payment is not initiated. |
| **Maintenance Lockout** | Immediate upon status change | Assets marked `Under Maintenance` are immediately deducted from available inventory (FR-035). |

---

## 3. Delivery Zones & Logistics

| Zone Code | Label & Description | Default Fee | Rationale |
| :--- | :--- | :--- | :--- |
| **ZONE_A** | Local Hub (e.g. Ho Central / HTU Campus) | `GH₵ 50.00` | Aligns with SRS FR-016 example. |
| **ZONE_B** | Regional Urban (e.g. Greater Ho / Nearby Townships) | `GH₵ 100.00` | Aligns with SRS FR-016 example. |
| **ZONE_C** | Inter-District / Greater Accra Outstations | `GH₵ 150.00` | Aligns with SRS FR-016 example. |
| **CUSTOM** | Large Cargo / Long Distance (>100km) | `Custom Quote` | Handled via quotation builder (FR-018). |

---

## 4. Cancellation & Refund Policy Rules (SRS BR-005, §28)

| Scenario | Default Cancellation Fee | Customer Refund |
| :--- | :--- | :--- |
| **Standard Rentals: > 14 days before event** | `10% administrative fee` | `90% refund` |
| **Standard Rentals: 7 – 14 days before event** | `30% cancellation fee` | `70% refund` |
| **Standard Rentals: < 7 days before event** | `50% cancellation fee` | `50% refund (deposit forfeit)` |
| **Custom Woven Sashes / Personalized Apparel** | `100% of custom item fee if in production` | `0% once embroidery/printing started` (per BR-005) |

---

## 5. Security & Session Rules

| Parameter | Default Value | Rationale |
| :--- | :--- | :--- |
| **Password Hashing** | bcrypt (12 rounds) or Argon2id | Conforms to NFR-004 & §19. |
| **Customer Session TTL** | 30 days with rolling refresh | Balances mobile user convenience with security. |
| **Admin Session TTL** | 8 hours with idle timeout | Heightened security for back-office operations. |
| **Login Rate Limiting** | Max 5 attempts per 15 minutes per IP | Protects against brute-force attacks (NFR-004). |
