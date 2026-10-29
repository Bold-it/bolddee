-- ============================================================================
-- BOLDDEE RENTALS — PRODUCTION SQL SCHEMA
-- Engine: SQLite (better-sqlite3) / PostgreSQL Compatible
-- Conforms to: SRS v1.0 (§14, §15, §19, §46, BR-001 - BR-009)
-- ============================================================================

PRAGMA foreign_keys = ON;

-- ----------------------------------------------------------------------------
-- 1. USERS & ROLES (§7, §8, FR-003, FR-004)
-- Roles: 'super_admin', 'admin', 'operations_manager', 'sales_officer',
--        'finance_officer', 'inventory_officer', 'content_manager', 'vendor', 'customer'
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer',
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'suspended', 'inactive'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  university TEXT,
  programme TEXT,
  graduation_year TEXT,
  student_id TEXT,
  preferred_contact TEXT DEFAULT 'phone',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS addresses (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  region TEXT NOT NULL,
  city TEXT NOT NULL,
  area TEXT NOT NULL,
  address_line TEXT NOT NULL,
  landmark TEXT,
  is_default INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 2. PRODUCTS & INVENTORY (FR-007, FR-031, FR-032)
-- Pillars: 'BOLDDEE GRAD', 'BOLDDEE RENTALS', 'BOLDDEE MOMENTS', 'BOLDDEE EVENTS'
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,               -- Retail unit price (GH₵)
  cost_price REAL DEFAULT 0,         -- Internal cost price (Admin only, never exposed to public)
  category TEXT NOT NULL,
  pillar TEXT NOT NULL,
  unit TEXT NOT NULL DEFAULT 'piece',
  stock_quantity INTEGER NOT NULL DEFAULT 100,
  min_order_qty INTEGER DEFAULT 1,
  featured INTEGER DEFAULT 0,
  in_stock INTEGER DEFAULT 1,
  image TEXT NOT NULL,
  image_urls TEXT NOT NULL,          -- JSON array of image URLs
  is_customizable INTEGER DEFAULT 0,
  is_rental INTEGER DEFAULT 0,
  is_service INTEGER DEFAULT 0,
  deposit REAL DEFAULT 0,            -- Security deposit per unit for rentals
  asset_prefix TEXT,                 -- e.g. 'TENT', 'CHR', 'TBL'
  badge TEXT,                        -- e.g. 'BEST SELLER', 'POPULAR', 'NEW 2026'
  original_price REAL DEFAULT 0,     -- Strikethrough comparison price
  inclusions TEXT,                   -- JSON or newline string of package inclusions
  variants TEXT,                     -- JSON array of size/color options
  rating REAL DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_variants (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  size TEXT,
  color TEXT,
  material TEXT,
  price_adjustment REAL DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Individual Reusable Equipment Asset Units (FR-034, FR-035)
CREATE TABLE IF NOT EXISTS rental_assets (
  id TEXT PRIMARY KEY,
  asset_code TEXT UNIQUE NOT NULL,   -- e.g. 'CHR-0001', 'TENT-001'
  product_id TEXT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT DEFAULT 'Warehouse A',
  status TEXT NOT NULL DEFAULT 'Available', -- 'Available', 'Reserved', 'In Use', 'Maintenance', 'Damaged', 'Retired'
  maintenance_reason TEXT,
  last_inspected DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- Inventory Movement Audit Log (FR-033)
CREATE TABLE IF NOT EXISTS inventory_movements (
  id TEXT PRIMARY KEY,
  product_id TEXT,
  asset_id TEXT,
  movement_type TEXT NOT NULL,       -- 'Stock In', 'Reserved', 'Dispatched', 'Returned', 'Damaged', 'Adjusted'
  quantity INTEGER NOT NULL,
  reference TEXT,                   -- Order ID or Booking ID
  actor_name TEXT,
  reason TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 3. ORDERS, RENTALS & CHECKOUT (§25, FR-021, FR-023, FR-024, BR-004, BR-006)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL, -- e.g. 'BD-2027-00125'
  user_id TEXT,
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  subtotal REAL NOT NULL,
  discount REAL DEFAULT 0,
  delivery_fee REAL DEFAULT 0,
  setup_fee REAL DEFAULT 0,
  security_deposit REAL DEFAULT 0,
  total_amount REAL NOT NULL,
  deposit_paid REAL DEFAULT 0,
  balance_due REAL DEFAULT 0,
  balance_deadline DATETIME,
  payment_status TEXT NOT NULL DEFAULT 'Awaiting Payment', -- 'Pending', 'Deposit Paid', 'Paid Full', 'Failed', 'Refunded'
  order_status TEXT NOT NULL DEFAULT 'Pending',            -- 'Pending', 'Payment Confirmed', 'Awaiting Design', 'In Production', 'Ready', 'Dispatched', 'Delivered', 'Completed', 'Cancelled'
  event_date TEXT,
  delivery_date TEXT,
  delivery_location TEXT NOT NULL,
  delivery_zone TEXT DEFAULT 'ZONE_A',
  ambassador_code TEXT,
  notes TEXT,
  terms_accepted_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  product_id TEXT,
  item_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price REAL NOT NULL,
  customization_data TEXT,           -- JSON of custom options (names, embroidery, degree)
  is_rental INTEGER DEFAULT 0,
  rental_details TEXT,               -- JSON of rental parameters (dates, days, deposit)
  design_status TEXT DEFAULT 'None', -- 'None', 'Pending Draft', 'Under Review', 'Approved', 'Rejected'
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- Order Activity History Timeline (§21, FR-027)
CREATE TABLE IF NOT EXISTS order_events (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  event_type TEXT NOT NULL,          -- 'order_created', 'payment_confirmed', 'design_uploaded', 'design_approved', 'dispatched', 'delivered', 'completed'
  description TEXT NOT NULL,
  actor_name TEXT DEFAULT 'System',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Rental Reservation Schedule (Engine for FR-012, BR-001, BR-009)
CREATE TABLE IF NOT EXISTS rental_reservations (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  asset_code TEXT,
  quantity INTEGER NOT NULL,
  start_date TEXT NOT NULL,          -- YYYY-MM-DD
  end_date TEXT NOT NULL,            -- YYYY-MM-DD
  status TEXT NOT NULL DEFAULT 'Reserved', -- 'Hold', 'Reserved', 'Active', 'Returned', 'Cancelled'
  hold_expires_at DATETIME,          -- For 30-min unpaid checkout holds
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 4. PAYMENTS & SECURITY DEPOSITS (FR-022, FR-024, BR-002, BR-006, §28)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  user_id TEXT,
  reference TEXT UNIQUE NOT NULL,
  idempotency_key TEXT UNIQUE,
  amount REAL NOT NULL,
  method TEXT NOT NULL,              -- 'MTN Mobile Money', 'Telecel Cash', 'Card', 'Bank Transfer'
  channel TEXT DEFAULT 'momo',
  status TEXT NOT NULL DEFAULT 'Pending', -- 'Pending', 'Paid', 'Failed', 'Refunded'
  provider TEXT DEFAULT 'Paystack-Ghana',
  paid_at DATETIME,
  metadata TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS security_deposits (
  id TEXT PRIMARY KEY,
  order_id TEXT UNIQUE NOT NULL,
  total_deposit REAL NOT NULL,
  deducted_amount REAL DEFAULT 0,
  refunded_amount REAL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Held', -- 'Held', 'Inspection Passed', 'Partially Deducted', 'Refunded'
  deduction_reasons TEXT,
  inspected_by TEXT,
  settled_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 5. DESIGN APPROVAL WORKFLOW (FR-009, BR-003)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS design_proofs (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  order_item_id TEXT NOT NULL,
  proof_image_url TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'Awaiting Approval', -- 'Awaiting Approval', 'Approved', 'Rejected'
  customer_comments TEXT,
  uploaded_by TEXT,
  reviewed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 6. DELIVERIES & RETURN INSPECTIONS (FR-036, FR-037, FR-038)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS deliveries (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  scheduled_date TEXT NOT NULL,
  driver_name TEXT,
  status TEXT NOT NULL DEFAULT 'Pending', -- 'Pending', 'Assigned', 'In Transit', 'Delivered', 'Returned'
  proof_photo TEXT,
  signature TEXT,
  delivered_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS return_inspections (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  inspected_by TEXT NOT NULL,
  returned_qty INTEGER NOT NULL,
  missing_qty INTEGER DEFAULT 0,
  damaged_qty INTEGER DEFAULT 0,
  condition TEXT NOT NULL DEFAULT 'Good',
  cleanliness TEXT NOT NULL DEFAULT 'Clean',
  notes TEXT,
  photo_urls TEXT,
  suggested_deduction REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------------------------
-- 7. QUOTES, BULK ORDERS & INQUIRIES (FR-018, FR-019, FR-020, FR-049)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS quotes (
  id TEXT PRIMARY KEY,
  quote_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  organization TEXT,
  event_date TEXT,
  budget REAL,
  requirements TEXT,
  equipment_list TEXT,
  subtotal REAL DEFAULT 0,
  discount REAL DEFAULT 0,
  total REAL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Pending', -- 'Pending', 'Sent', 'Accepted', 'Rejected', 'Converted'
  valid_until TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bulk_orders (
  id TEXT PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  institution TEXT NOT NULL,
  department TEXT NOT NULL,
  class_year TEXT NOT NULL,
  student_count INTEGER NOT NULL,
  class_rep_name TEXT NOT NULL,
  class_rep_phone TEXT NOT NULL,
  class_rep_email TEXT NOT NULL,
  graduation_date TEXT,
  students_list TEXT,                -- JSON array of student names, index numbers, sizes
  total_price REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'Draft',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  event_date TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  attachment_url TEXT,
  status TEXT NOT NULL DEFAULT 'New', -- 'New', 'Contacted', 'Resolved'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 8. PROMOTIONS, REVIEWS & SETTINGS (FR-039, FR-040, §46, NFR-008)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS promotions (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL,       -- 'percent', 'fixed'
  discount_value REAL NOT NULL,
  min_spend REAL DEFAULT 0,
  max_discount REAL,
  usage_limit INTEGER DEFAULT 100,
  times_used INTEGER DEFAULT 0,
  active INTEGER DEFAULT 1,
  start_date TEXT,
  expiry_date TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  customer_id TEXT,
  customer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
  comment TEXT,
  service_type TEXT,
  is_approved INTEGER DEFAULT 0,     -- Requires admin moderation (FR-039)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  user_email TEXT,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT,
  old_value TEXT,
  new_value TEXT,
  ip_address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 9. PERFORMANCE INDEXES (NFR-001)
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_pillar ON products(pillar);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(email, phone);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status, payment_status);
CREATE INDEX IF NOT EXISTS idx_rental_dates ON rental_reservations(product_id, start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_rental_assets ON rental_assets(status, category);
CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id);
