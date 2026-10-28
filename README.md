# BOLDDEE RENTALS & BRANDING PLATFORM

> Production-ready event rental and custom print management system built for the Ghanaian market.

[![Node.js CI](https://github.com/bold-it/bolddee/actions/workflows/ci.yml/badge.svg)](.github/workflows/ci.yml)
[![Tests Passing](https://img.shields.io/badge/tests-12%20passed%2C%20100%25-brightgreen)](tests/testSuite.js)
[![Ghana Compliance](https://img.shields.io/badge/compliance-Act%20843%20(Ghana)-blue)](docs/PRIVACY_NOTES.md)

---

## 🌟 Overview

BOLDDEE RENTALS is a dual-vertical enterprise platform catering to:
1. **Event Equipment Rentals:** Tents, canopies, luxury chairs, banquet tables, sound/lighting gear, generators, and decor items.
2. **Custom Print & Fabrication:** Large-format vinyl banners, backdrops, pull-up banners, and corporate event keepsakes.

The application features full Ghanaian localization, integer pesewas pricing math, automated rental availability buffers, Paystack Mobile Money integration, sequential order tracking (`BD-YYYY-XXXXX`), and role-based staff administration.

---

## 🚀 Key Architectural Features

- **ACID Concurrency Locking (BR-009):** Synchronous transaction execution via `better-sqlite3` prevents overbooking under high concurrent checkout traffic (verified under 20 parallel threads).
- **Integer Pesewas Arithmetic:** Zero floating-point drift. All prices, deposits (60%), balances (40%), and delivery fees are calculated in pesewas.
- **Logistical Buffer Management:** Automatically enforces a 1-day setup buffer before customer events and a 1-day tear-down/cleaning buffer after return dates, excluding assets under maintenance.
- **State Machine Gates:**
  - **BR-003:** Print orders cannot enter production without customer artwork approval.
  - **BR-007:** Rental orders cannot transition to completed without signed warehouse inspection.
- **Granular RBAC:** 8 distinct roles (`super_admin`, `admin`, `inventory_manager`, `logistics_officer`, `production_manager`, `finance_officer`, `customer_service`, `customer`).
- **Regulatory Compliance:** Adheres to the Ghana Data Protection Act, 2012 (Act 843).

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Lucide Icons, Vanilla CSS Design System.
- **Backend:** Node.js, Express.js.
- **Database:** SQLite with Write-Ahead Logging (WAL mode) and synchronous transactions.
- **Payments:** Paystack Ghana (MTN MoMo, Telecel Cash, AT Money, Visa, Mastercard).
- **Testing:** Custom zero-dependency automated integration and authorization test suites.

---

## ⚡ Quickstart

### Prerequisites
- Node.js 18.0.0 or higher
- npm 9.0.0 or higher

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/bold-it/bolddee.git
cd bolddee

# Install dependencies
npm install
```

### 2. Environment Setup
```bash
# Copy example configuration
cp .env.example .env
```
Edit `.env` to configure your `JWT_SECRET`, `PAYSTACK_SECRET_KEY`, and notification credentials.

### 3. Database Initialization
```bash
# Seed initial categories, demo products, serialized barcode assets, and promo coupons
npm run db:seed
```

### 4. Running the Development Servers
```bash
# Terminal 1: Start Express API server (Port 5000)
npm run server:dev

# Terminal 2: Start Vite Frontend (Port 3000)
npm run dev
```

Visit `http://localhost:3000` to browse the store or `http://localhost:3000/admin-login` for staff access.

---

## 🧪 Testing & Verification

Run the full suite of automated tests:

```bash
# Run Core Business Rules & Concurrency Test Suite (12 tests)
node tests/testSuite.js

# Run Role-Based Access Control (RBAC) Matrix Test Suite (17 tests)
node tests/authMatrix.test.js

# Run SQLite Online Backup & Scratch Restore Integrity Test
node tests/restoreTest.js
```

---

## 📁 Project Structure

```
bolddee/
├── .github/workflows/ci.yml       # GitHub Actions CI pipeline
├── docs/                          # Comprehensive technical and operational documentation
│   ├── ACCEPTANCE_CHECKLIST.md   # Functional verification sign-off
│   ├── ADMIN_GUIDE.md             # Operational procedures and staff handbook
│   ├── API.md                     # Complete REST API specification
│   ├── ARCHITECTURE.md            # System architecture and ER diagrams
│   ├── ASSUMPTIONS.md             # Documented business rules and defaults
│   ├── DEPLOYMENT.md              # Production deployment runbook
│   ├── GO_LIVE_CHECKLIST.md       # Pre-launch operational checklist
│   ├── PRIVACY_NOTES.md           # Act 843 compliance notes
│   ├── SRS_GAP_REPORT.md          # Traceability matrix and audit log
│   └── TEST_REPORT.md             # Automated test execution evidence
├── public/                        # Static assets, robots.txt, and sitemap.xml
├── server/
│   ├── db/                        # SQLite schema, database wrapper, seed data, and backup utility
│   ├── middleware/                # JWT authentication, RBAC authorization, and upload handlers
│   ├── routes/                    # REST endpoints (auth, products, rentals, orders, payments, admin)
│   ├── services/                  # Pricing engine, availability engine, state machine, scheduler
│   └── server.js                  # Main Express application entry point
├── src/                           # React frontend components, contexts, modals, and views
├── tests/                         # Integration test suites and database restore verification
├── docker-compose.yml             # Container orchestration
├── Dockerfile                     # Multi-stage production container build
└── package.json                   # Project scripts and dependencies
```

---

## 🚢 Production Deployment

### Docker Deployment
```bash
# Build and run containers in detached mode
docker compose up -d --build
```

### Production Build
```bash
# Compile and optimize frontend assets into dist/
npm run build
```

---

## 🔐 Default Administrative Credentials (Development)

| Role | Email | Password |
|:---|:---|:---|
| **Super Admin** | `admin@bolddee.com` | `AdminSecurePassword123!` |
| **Inventory Manager** | `inventory@bolddee.com` | `InventorySecure123!` |
| **Customer Service** | `support@bolddee.com` | `SupportSecure123!` |

*(Always change default passwords in production via the Admin portal or environment variables).*

---

## 📄 License
Proprietary - All rights reserved by BOLD-IT / BOLDDEE RENTALS, Ghana.
