# BOLDDEE RENTALS — PRE-LAUNCH GO-LIVE CHECKLIST
**Target Launch Window:** October 2026  
**Auditor / Launch Lead:** Senior Full-Stack Engineer & Operations Team  
**Governing Standard:** Production Readiness Verification  

---

## 1. Security & Credentials Rotation
- [ ] **Rotate JWT Secret Key:** Replace default secret in `.env` with a 64-character cryptographically random hex string (`openssl rand -hex 32`).
- [ ] **Change Super Admin Password:** Log into the management portal using default `bolddee2026` and change password to a strong 14+ character passphrase.
- [ ] **Rotate Admin Master Secret:** Update `ADMIN_SECRET_KEY` in production `.env` to prevent unauthorized admin access.
- [ ] **Verify CORS Whitelist:** Confirm `FRONTEND_URL` in `.env` is set strictly to `https://bolddeerentals.com` and wildcard `*` is disabled in production.
- [ ] **Verify Hidden Fields:** Ensure catalog endpoints do not output `cost_price` to customer requests (verified in Test Suite 5.2).

---

## 2. Payment Gateway Transition (Paystack Ghana)
- [ ] **Switch to Live Keys:** Replace sandbox test credentials with Paystack Ghana live API keys (`PAYSTACK_SECRET_KEY` and `PAYSTACK_PUBLIC_KEY`) in production `.env`.
- [ ] **Configure Live Webhook URL:** In the Paystack Dashboard (Settings -> API Keys & Webhooks), set the webhook endpoint URL to:
  `https://bolddeerentals.com/api/payments/webhook`
- [ ] **Set Webhook Secret:** Copy the secret key from Paystack into `PAYSTACK_WEBHOOK_SECRET` in `.env` for HMAC-SHA512 verification.
- [ ] **Perform End-to-End Test Transaction:** Process a GH₵ 1.00 live Mobile Money transaction on MTN and Telecel Cash to confirm deposit recording and timeline status updates.

---

## 3. Communication & Operational Channels
- [ ] **Verify WhatsApp Floating Hotline:** Confirm that clicks on the floating WhatsApp widget route to active business phone `+233 546 996 210`.
- [ ] **Verify Field Dispatch Number:** Confirm dispatch communications route to `+233 24 416 3901`.
- [ ] **Confirm VIP Community WhatsApp Group:** Ensure link `https://chat.whatsapp.com/DjhZ8zyDvHt3ut6E1fhTH0` is active and moderated.
- [ ] **Test Email Delivery:** Verify inquiries and order confirmations are delivered to `bolddeerentals@gmail.com`.

---

## 4. Legal & Regulatory Compliance (Act 843)
- [ ] **Terms of Service Active:** Accessible at `https://bolddeerentals.com/terms`.
- [ ] **Rental Agreement & Buffer Terms Active:** Accessible at `https://bolddeerentals.com/rental-terms`.
- [ ] **Privacy Notice (Act 843) Active:** Accessible at `https://bolddeerentals.com/privacy-policy`.
- [ ] **Refund Policy Active:** Accessible at `https://bolddeerentals.com/refund-policy`.
- [ ] **Checkout Terms Checkbox:** Mandatory checkout checkbox must be ticked before payment session initializes.

---

## 5. Reliability & Disaster Recovery
- [ ] **Automated Daily Backups:** Crontab entry active to execute `node server/db/backup.js backup` every night at 02:00 AM UTC.
- [ ] **Hot Backup Directory Exists:** `data/backups/` exists and is included in offsite backup routines (AWS S3, rsync, or Google Cloud Storage).
- [ ] **Process Monitoring:** PM2 or Docker health checks configured to automatically restart upon container crash.
- [ ] **Health Endpoint Operational:** `GET https://bolddeerentals.com/api/health` returns `{"status":"healthy"}`.

---

## 6. Day 1 Operational Smoke Test Script
1. Open Storefront (`/`) -> Click **Shop Catalog** -> Verify all products render with photos and GH₵ prices.
2. Select **High-Peak Marquee Tent (20x20 ft)** -> Click **Check Rental Dates** -> Verify 1-day setup and pickup buffer notices.
3. Add to Cart -> Select **Delivery Zone A (Ho Central / HTU)** -> Verify 60% deposit split and refundable security deposit calculation.
4. Proceed to Checkout -> Enter customer details -> Tick terms acceptance -> Click **Pay 60% Deposit**.
5. Log into Admin Console (`/admin-login`) -> Open **Live Orders** -> Confirm new order appears with `BD-2026-XXXXX` reference.
6. Open **Track Order** modal -> Search reference number -> Confirm milestone timeline displays real order details.
