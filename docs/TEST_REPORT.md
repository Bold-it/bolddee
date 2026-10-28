# BOLDDEE RENTALS — AUTOMATED TEST REPORT
**Execution Date:** October 28, 2026  
**Test Harness:** Native Node.js Test Suite (`tests/testSuite.js`)  
**Database Engine:** `better-sqlite3` v12.6.2 (ACID Transactional Mode, WAL Enabled)  
**Overall Status:** **100% PASSED (12 of 12 Test Cases)**  

---

## 1. Test Suite Summary Table

| Suite # | Target Component / SRS Clause | Test Description | Business Rule Verified | Status |
| :---: | :--- | :--- | :---: | :---: |
| **1.1** | Pricing Engine (§25, BR-002) | 60% booking deposit & 40% balance calculation | BR-002 | **PASS** |
| **1.2** | Pricing Engine (Bug Fix §25) | Prevents cart quantity double-multiplication bug | §25 | **PASS** |
| **1.3** | Pricing Engine (FR-040) | Percentage coupon discount (`GRAD2027` 10%) with min spend | FR-040 | **PASS** |
| **1.4** | Pricing Engine (FR-016, FR-040) | Fixed coupon discount (`BOLD50` GH₵50) with Zone B fee | FR-016 | **PASS** |
| **2.1** | Availability Engine (FR-012) | Clean date stock query returns available units | FR-012 | **PASS** |
| **2.2** | Availability Engine (FR-035) | Assets marked 'Maintenance' excluded from available stock | FR-035 | **PASS** |
| **2.3** | Availability Engine (BR-001) | 1-day setup and 1-day return buffer overlap detection | BR-001 | **PASS** |
| **3.1** | State Machine (BR-003, FR-025) | Blocks 'In Production' until artwork proof is approved | BR-003 | **PASS** |
| **3.2** | State Machine (BR-007, FR-026) | Blocks 'Completed' status until rental returned | BR-007 | **PASS** |
| **4.1** | Concurrency Lock (BR-009) | 20 parallel requests on stock=2: 2 succeed, 18 rejected | BR-009 | **PASS** |
| **5.1** | Security / Auth (FR-004, FR-045) | Bcrypt hash verification & blocked suspended accounts | FR-045 | **PASS** |
| **5.2** | RBAC / Privacy (FR-007, NFR-004) | Cost price strictly suppressed from public catalog queries | NFR-004 | **PASS** |

---

## 2. Detailed Suite Findings

### Suite 1: Pricing & Financial Engine
- **Test 1.1:** Verified that an order subtotaling GH₵ 200 with GH₵ 50 Zone A delivery results in GH₵ 250 total, requiring exactly GH₵ 150 (60%) deposit and GH₵ 100 (40%) balance. Total equals deposit + balance with zero rounding drift.
- **Test 1.2 (Double-Multiplication Bug):** Verified that a 2-unit tent rental for 2 days @ GH₵ 450/day results in exactly GH₵ 1,800 rental subtotal + GH₵ 300 security deposit + GH₵ 50 delivery fee = GH₵ 2,150. Confirmed that the client-side cart multiplication bug (multiplying duration-expanded subtotals by quantity a second time) is completely eliminated.
- **Tests 1.3 & 1.4:** Validated promotion code calculations against database truth. Coupon code `GRAD2027` accurately applies 10% discount on orders meeting the GH₵ 100 threshold, while `BOLD50` applies a fixed GH₵ 50 discount across delivery zones.

### Suite 2: Rental Availability & Buffer Engine
- **Test 2.1:** Clean future dates for Gold Chiavari Chairs (`r2`) returned `available: true` with real warehouse stock.
- **Test 2.2 (FR-035 Maintenance Exclusion):** The database contains 3 individual Chiavari chair assets (`ast-1`, `ast-2`, `ast-3`), with `ast-3` flagged in `'Maintenance'`. The availability engine correctly excluded the maintenance unit from the rentable stock.
- **Test 2.3 (BR-001 Buffers):** For an event booked from Nov 15 to Nov 17, reservations were dynamically detected as clashing on Nov 14 (setup buffer) and Nov 18 (cleaning/return buffer), ensuring setup safety windows.

### Suite 3: State Machine Workflows & Gates
- **Test 3.1 (BR-003 Artwork Approval Gate):** An order containing a personalized sash item (`g1`) with `design_status: 'Draft'` threw an error when attempting transition to `'In Production'`:
  `BR-003 Artwork Approval Gate: Cannot start production until customer approves design proofs.`
  Once updated to `'Approved'`, the transition succeeded immediately.
- **Test 3.2 (BR-007 Rental Return Check):** An active rental reservation prevented premature transition to `'Completed'`:
  `BR-007 Rental Return Requirement: Cannot complete order until rented equipment is returned and inspected.`
  Once the return inspection was registered, the order transitioned to `'Completed'`.

### Suite 4: Concurrency & Atomicity (BR-009 Double-Booking Prevention)
- **Test 4.1:** Created a temporary limited inventory asset with `stock_quantity = 2`. Dispatched **20 parallel reservation requests** simultaneously using SQLite ACID transactional locking (`runTransaction`).
- **Result:** Exactly **2 requests succeeded** and **18 requests were rejected** with inventory exhausted errors. Zero double-booking occurred.

### Suite 5: Security, RBAC & Privacy
- **Test 5.1:** Confirmed passwords stored in the database use `bcrypt` salts (`$2a$10$...`). Customer accounts flagged as `'suspended'` are blocked from authenticating.
- **Test 5.2:** Confirmed that public catalog queries never expose internal `cost_price` to non-administrative users.

---

## 3. How to Run Test Suite
```bash
# Run complete test suite:
node tests/testSuite.js

# Run hot backup verification:
node server/db/backup.js backup
node server/db/backup.js list
```
