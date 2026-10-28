# BOLDDEE RENTALS — ADMINISTRATIVE OPERATIONS MANUAL
**Audience:** BOLDDEE Store Managers, Operations Officers, Logistics Leads, Finance Staff  
**Platform Version:** 1.0.0-PROD  
**Console URL:** `https://bolddeerentals.com/admin` (or `http://localhost:3000/admin`)  

---

## 1. Accessing the Management Console
1. Navigate to `/admin-login` (or click **Staff Portal** in the website footer).
2. Enter your authorized admin master key or email credentials.
3. Upon authentication, you will be redirected to the secure Management Console with full Role-Based Access Control (RBAC).

---

## 2. Navigating the Management Console Tabs

### Tab 1: Operational KPI Overview
- **Today's Cash Collected:** Real-time verified deposit payments received today via MTN MoMo / Telecel Cash.
- **Total Revenue:** Cumulative lifetime gross bookings.
- **Active Rental Bookings:** Number of physical units currently deployed in the field or reserved for upcoming dates.
- **Outstanding Balances:** Cumulative 40% balance payments due 48 hours before scheduled events.
- **Recent Orders Table:** Quick snapshot of the latest 5 storefront transactions.

### Tab 2: Store Products & Inventory Catalog
- **Add New Product:**
  1. Fill in Title, Price (GH₵), Unit (e.g. piece, day, event), Pillar, and Category.
  2. Drag and drop photographs into the upload box. Images are compressed client-side into lightweight high-res JPEGs.
  3. Mark **Feature on Homepage** or **Available / In Stock** as needed.
  4. Click **Create Product** to publish instantly to the storefront.
- **Editing & Removing Products:**
  - Click the **Edit (Pencil)** icon to modify prices, descriptions, or imagery.
  - Click the **Trash** icon to delete discontinued inventory.
  - Click the **Star** icon to toggle homepage spotlight.

### Tab 3: Live Orders & State Machine Progression
- View incoming orders with sequential references formatted as `BD-YYYY-XXXXX`.
- Check financial statuses: `Deposit Paid`, `Paid`, or `Awaiting Payment`.
- **Progressing Order Status (State Machine Enforcement):**
  - Use the status dropdown on any order to advance its operational milestone:
    - `Pending` -> `Approved`
    - `Approved` -> `In Production` *(Blocked if personalized sashes lack approved proofs - BR-003)*
    - `In Production` -> `Dispatched`
    - `Dispatched` -> `Delivered`
    - `Delivered` -> `Completed` *(Blocked until rented equipment is returned - BR-007)*
  - Customer order tracking pages update automatically in real time!

### Tab 4: Warehouse Asset Tracker & Maintenance Toggles
- Monitor individualized inventory barcode units (e.g. `CHR-0001`, `TENT-001`, `SPK-001`).
- Check physical location (`Warehouse A`, `Warehouse B`, or on-site client venue).
- **Maintenance Toggle (FR-035):**
  - If a marquee tent or chair requires fabric cleaning or frame repair, click **Set to Maintenance**.
  - **Effect:** The availability engine immediately excludes this unit from customer booking calendars to prevent field failures.
  - Once repaired, click **Mark Available** to restore the unit to active booking rotation.

### Tab 5: Quotations & CRM Inquiries
- **Quotation Requests:**
  - Review bespoke client requests for university matriculations, weddings, and marquee setups.
  - Review event venue, proposed date, guest count, and client budget.
  - Advance status from `Pending` -> `Sent` -> `Accepted`.
- **Contact Page Inquiries:**
  - Review general inquiries sent through the website contact form.

### Tab 6: Customer CRM & Account Moderation
- View registered customer records, affiliated universities (e.g. *Ho Technical University*, *UHAS*, *UG Legon*), and total spend.
- **Account Suspension (FR-045):**
  - Click **Suspend Account** to prevent a malicious or abusive user from initiating new rentals or checkouts.
  - Suspended users are immediately denied access at login.
  - Click **Reactivate** to restore normal customer privileges.

---

## 3. Post-Event Return Inspection & Security Deposit Settlement
When rental equipment is retrieved following an event:
1. Conduct an on-site physical count with the client.
2. In the Admin API or Operations Form, record:
   - `returnedQty`, `missingQty`, `damagedQty`
   - Overall cleanliness and condition (`Good`, `Fair`, `Damaged`)
   - Suggested deduction fee (GH₵) for damaged chair frames or torn canopies.
3. The system automatically calculates the refundable amount:
   $$\text{Refund Amount} = \max(0, \text{Total Deposit} - \text{Deduction Fee})$$
4. The security deposit status updates to `Refunded` or `Partially Deducted`, and the refund is transmitted to the client's Mobile Money account within 24 hours.
5. The rental reservation status advances to `Returned`, enabling the order to transition to `Completed`.
