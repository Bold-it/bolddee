# BOLDDEE RENTALS — PRIVACY & DATA PROTECTION NOTES
**Governing Statute:** Data Protection Act, 2012 (Act 843), Republic of Ghana  
**Data Controller:** Bold-Services & Bull-Dee Enterprises (Trading as BOLDDEE RENTALS)  
**Registered Operations:** Ho, Volta Region & Greater Accra, Ghana  
**Target Auditing Date:** October 2026  

---

## 1. Executive Summary & Statutory Alignment
The BOLDDEE RENTALS platform processes personal information for customers, graduating students, university class representatives, institutional clients, and administrative staff. In strict compliance with the **Data Protection Act, 2012 (Act 843)** of the Parliament of Ghana, this document outlines the lawful bases, collection practices, storage parameters, security controls, and subject rights enforced within our production web application.

---

## 2. Personal Data Categories Processed
| Data Category | Specific Data Elements | Applicable Source | Purpose & Justification |
| :--- | :--- | :--- | :--- |
| **Customer Contact** | Full Name, WhatsApp Number, Voice Phone, Email Address | Checkout Modal, Contact Form, User Registration | Order fulfillment, dispatch logistics, 48h balance deadline reminders |
| **Delivery & Logistics** | Destination Address, Landmark, Event Venue, Region/Zone | Checkout Modal, Rental Booking | Routing field delivery crews and heavy-duty marquee installation |
| **Academic & Customization** | University, Faculty/Department, Degree/Programme, Graduation Year, Student Index Number, Nicknames | Sash Customizer Modal, Bulk Student Order Modal | Precision machine-embroidery of custom graduation stoles and medals |
| **Financial & Transactional** | Paystack Reference, Mobile Money Network, Transaction Amount (integer Pesewas), Deposit vs Balance | Payment Gateway Webhook | Accounting compliance, fraud prevention, security deposit settlement |
| **Staff & Operations** | Staff Email, Role (`admin`, `operations_manager`), Password Hash (bcrypt), Audit Action Log | Admin Portal | Access governance, audit tracking, equipment condition attribution |

> [!IMPORTANT]
> **No Financial Secret Storage:** BOLDDEE RENTALS **never** records, stores, or transmits full debit/credit card PANs, CVVs, or Mobile Money PINs. Payment authorizations execute directly within Paystack’s PCI-DSS compliant iframe/redirect gateway.

---

## 3. Lawful Bases for Processing (Act 843, Section 20)
Under Section 20 of Act 843, BOLDDEE RENTALS processes personal data under the following legitimate grounds:
1. **Contractual Necessity (Section 20(1)(b)):** Processing is mandatory to perform the rental agreement, fabricate custom sashes, deliver equipment to the venue, and refund security deposits.
2. **Legal Obligation (Section 20(1)(c)):** Maintenance of transaction records, invoices, and audit logs required under Ghana Revenue Authority (GRA) fiscal regulations.
3. **Explicit Consent (Section 20(1)(a)):** Freely given consent obtained via the mandatory checkout agreement checkbox prior to order finalization.

---

## 4. Data Retention & Erasure Schedule (Act 843, Section 24)
- **Active Orders & Bookings:** Retained indefinitely until event conclusion, post-event return inspection, and deposit refund.
- **Completed Order Records:** Retained for **6 years** to comply with commercial accounting standards and tax verification audits.
- **Bulk Student Rosters:** Student index numbers provided by Class Reps for sash sizing are retained for **12 months** post-graduation ceremony to resolve batch inquiries, then securely anonymized.
- **Abandoned Checkout Holds:** Customer contact drafts from unfinalized checkouts expire and purge automatically after **30 minutes**.
- **Audit Logs:** System and security event logs are archived for **24 months** to ensure forensic traceability.

---

## 5. Security Safeguards & Technical Measures (Act 843, Section 28)
- **Encryption in Transit:** All client-to-server traffic is enforced over TLS 1.3 with HSTS headers enabled.
- **Password Hashing:** Administrative and customer passwords are salted and hashed using **bcrypt (10 rounds)**; cleartext passwords are never logged or stored.
- **Role-Based Access Control (RBAC):** Internal staff endpoints require cryptographic JWT tokens signed by HMAC-SHA256 with granular privilege checks (`super_admin`, `admin`, `operations_manager`, `finance_officer`). Non-administrative staff cannot view cost prices or customer credentials.
- **Row-Level & Database Security:** Synchronous transaction execution via `better-sqlite3` with Write-Ahead Logging (WAL) and foreign key enforcement prevents orphan data records.

---

## 6. Data Subject Rights (Act 843, Sections 35–43)
Every resident of Ghana whose data is processed by BOLDDEE RENTALS maintains statutory rights:
1. **Right of Access (Section 35):** Customers may query their complete booking history and personal profile by contacting the Data Officer.
2. **Right to Rectification (Section 39):** Customers may correct misspelled names, degrees, or contact details prior to the artwork approval gate.
3. **Right to Erasure (Section 40):** Customers without active equipment obligations may request account termination and marketing suppression.
4. **Right to Object to Direct Marketing (Section 42):** Customers may opt out of promotional WhatsApp broadcasts with immediate effect.

### Official Inquiries & Compliance Contact:
**Data Protection Officer (DPO):** Management Team, Bold-Services & Bull-Dee Enterprises  
**Address:** Ho Technical University Campus / Main Hub, Ho, Volta Region, Ghana  
**Email:** `bolddeerentals@gmail.com`  
**Hotline:** `+233 546 996 210`
