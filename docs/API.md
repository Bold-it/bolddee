# BOLDDEE RENTALS - REST API Reference

## Base URL
- Development: `http://localhost:5000/api`
- Production: `https://rentals.bolddee.com/api`

## Authentication & Headers
Protected endpoints require a JSON Web Token (JWT) passed in the `Authorization` header:
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

## Error Format
All errors return consistent JSON responses with appropriate HTTP status codes:
```json
{
  "error": "Error description message"
}
```

---

## 1. Authentication Endpoints

### `POST /api/auth/register`
Register a new customer account.
- **Request Body:**
  ```json
  {
    "full_name": "Kofi Mensah",
    "email": "kofi@example.com",
    "phone": "0241234567",
    "password": "Password123!"
  }
  ```
- **Response (201):**
  ```json
  {
    "token": "eyJhbGciOi...",
    "user": { "id": 5, "full_name": "Kofi Mensah", "email": "kofi@example.com", "role": "customer" }
  }
  ```

### `POST /api/auth/login`
Authenticate a customer.
- **Request Body:**
  ```json
  {
    "email": "kofi@example.com",
    "password": "Password123!"
  }
  ```
- **Response (200):** Same structure as register.

### `POST /api/auth/admin-login`
Authenticate an administrative or operational team member.
- **Request Body:**
  ```json
  {
    "email": "admin@bolddee.com",
    "password": "AdminSecurePassword123!"
  }
  ```
- **Response (200):** Same structure as register.

### `GET /api/auth/me`
Retrieve the authenticated user's current session profile.
- **Headers:** `Authorization: Bearer <token>`
- **Response (200):** User object.

---

## 2. Product Catalog Endpoints

### `GET /api/products`
Fetch active catalog items. Internal `cost_price` is omitted for public access.
- **Query Params:** `category`, `type` (`rental` | `print`), `search`
- **Response (200):** Array of product objects.

### `POST /api/products`
Create a new product. (Requires `admin` or `inventory_manager` role).
- **Request Body:**
  ```json
  {
    "name": "Luxury Chiavari Chair (Gold)",
    "category": "Furniture",
    "type": "rental",
    "rental_rate_pesewas": 1500,
    "replacement_value_pesewas": 12000,
    "total_stock": 100,
    "image_urls": ["/images/chiavari.jpg"],
    "description": "High-durability gold resin chair."
  }
  ```
- **Response (201):** Created product object.

### `PUT /api/products/:id`
Update an existing product. (Requires `admin` or `inventory_manager` role).

### `DELETE /api/products/:id`
Soft-delete / deactivate a product. (Requires `admin` role; `finance_officer` is rejected with 403).

---

## 3. Rental & Availability Endpoints

### `GET /api/rentals/availability`
Query live warehouse stock for a product across specified dates, factoring in 1-day setup and cleaning buffers.
- **Query Params:** `productId` (required), `startDate` (YYYY-MM-DD), `endDate` (YYYY-MM-DD)
- **Response (200):**
  ```json
  {
    "available": 45,
    "totalStock": 50,
    "underMaintenance": 2,
    "bookedUnits": 3,
    "startDate": "2026-11-10",
    "endDate": "2026-11-12",
    "buffersApplied": { "setupBufferDays": 1, "tearDownBufferDays": 1 }
  }
  ```

### `GET /api/rentals/assets`
List individual serialized barcode assets. (Requires staff role).
- **Query Params:** `productId`, `status` (`available`, `rented`, `maintenance`, `damaged`)

### `PUT /api/rentals/maintenance`
Toggle asset maintenance state (FR-035).
- **Request Body:**
  ```json
  {
    "assetId": 12,
    "status": "maintenance",
    "notes": "Bent frame repaired, waiting for inspection."
  }
  ```

---

## 4. Orders & Checkout Endpoints

### `POST /api/orders`
Create an order and initiate reservation hold.
- **Request Body:**
  ```json
  {
    "customer": {
      "full_name": "Ama Serwaa",
      "email": "ama@example.com",
      "phone": "+233240000000"
    },
    "deliveryZone": "zone_a",
    "deliveryAddress": "12 Ring Road, Ho, Ghana",
    "items": [
      {
        "productId": 1,
        "quantity": 10,
        "rentalDetails": {
          "startDate": "2026-11-15",
          "endDate": "2026-11-16",
          "duration": 2
        }
      }
    ],
    "couponCode": "BOLD50"
  }
  ```
- **Response (201):**
  ```json
  {
    "orderNumber": "BD-2026-00042",
    "orderStatus": "pending_payment",
    "totalAmountPesewas": 30000,
    "depositRequiredPesewas": 18000,
    "balanceDuePesewas": 12000,
    "paymentReference": "BD-PAY-9812345678"
  }
  ```

### `GET /api/orders/track/:query`
Public tracking endpoint using order number or customer phone number.
- **Response (200):**
  ```json
  {
    "orderNumber": "BD-2026-00042",
    "status": "confirmed",
    "timeline": [
      { "status": "pending_payment", "timestamp": "2026-10-28T00:00:00Z" },
      { "status": "confirmed", "timestamp": "2026-10-28T00:05:00Z" }
    ],
    "depositPaid": 180.00,
    "balanceDue": 120.00
  }
  ```

### `PATCH /api/orders/:id/status`
Transition order state with business rule gates (BR-003 artwork gate, BR-007 inspection gate). (Requires staff role).

---

## 5. Payments Endpoints

### `POST /api/payments/verify`
Verify transaction completed via Paystack Checkout.
- **Request Body:**
  ```json
  {
    "reference": "BD-PAY-9812345678",
    "orderNumber": "BD-2026-00042"
  }
  ```
- **Response (200):**
  ```json
  {
    "verified": true,
    "amountPaidPesewas": 18000,
    "orderStatus": "confirmed"
  }
  ```

### `POST /api/payments/webhook`
Webhook receiver for asynchronous Paystack events (MTN MoMo, Telecel, Card). Authenticated via `x-paystack-signature` HMAC-SHA512.

---

## 6. Quotes & Inquiries Endpoints

### `POST /api/quotes`
Submit custom quote request for bulk corporate events or custom print fabrication.
- **Request Body:**
  ```json
  {
    "fullName": "Esi Mensah",
    "phone": "0201112233",
    "email": "esi@corporate.gh",
    "eventType": "Corporate Conference",
    "estimatedGuests": 350,
    "eventDate": "2026-12-05",
    "notes": "Need 3 100-seater canopies and stage backdrop."
  }
  ```

### `POST /api/inquiries`
Submit general contact inquiry.

---

## 7. Admin & Management Endpoints

### `GET /api/admin/dashboard`
Live KPIs including Total Revenue, Active Rentals, Pending Print Approvals, and Inventory Utilization.

### `GET /api/admin/customers`
List registered customer records with order count and total spend.

### `PATCH /api/admin/customers/:id/status`
Suspend or restore customer account (FR-045).

### `POST /api/admin/inspections`
Submit post-event warehouse inspection report with damages breakdown and deposit settlement (BR-007).
