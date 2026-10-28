import bcrypt from 'bcryptjs';
import { db, initDatabase } from './database.js';

export function seedData() {
  initDatabase();

  // 1. Seed Roles & Default Super Admin / Admin (§7, §8, NFR-004)
  const existingUsers = db.prepare('SELECT COUNT(*) as count FROM users').get();
  if (existingUsers.count === 0) {
    const passwordHash = bcrypt.hashSync('bolddee2026', 10);

    const insertUser = db.prepare(`
      INSERT INTO users (id, name, email, phone, password_hash, role, status)
      VALUES (?, ?, ?, ?, ?, ?, 'active')
    `);

    insertUser.run(
      'usr-superadmin',
      'Bolddee Super Admin',
      'superadmin@bolddee.com',
      '+233546996210',
      passwordHash,
      'super_admin'
    );

    insertUser.run(
      'usr-admin',
      'Bull-Dee Operations',
      'admin@bolddee.com',
      '+233244163901',
      passwordHash,
      'admin'
    );

    insertUser.run(
      'usr-ops',
      'Logistics Officer',
      'ops@bolddee.com',
      '+233595308678',
      passwordHash,
      'operations_manager'
    );

    insertUser.run(
      'usr-customer',
      'Kwame Mensah',
      'kwame.mensah@gmail.com',
      '+233249876543',
      passwordHash,
      'customer'
    );

    db.prepare(`
      INSERT INTO customers (id, user_id, university, programme, graduation_year, student_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run('cust-1', 'usr-customer', 'Ho Technical University', 'BSc Computer Science', '2027', '042027001');

    db.prepare(`
      INSERT INTO addresses (id, user_id, region, city, area, address_line, landmark, is_default)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    `).run('addr-1', 'usr-customer', 'Volta Region', 'Ho', 'HTU Campus', 'SRC Hostel Block B Room 14', 'Near Great Hall');
  }

  // 2. Seed Default Settings (§46, ASSUMPTIONS.md)
  const existingSettings = db.prepare('SELECT COUNT(*) as count FROM settings').get();
  if (existingSettings.count === 0) {
    const insertSetting = db.prepare('INSERT INTO settings (key, value, description) VALUES (?, ?, ?)');

    insertSetting.run('business_name', 'BOLDDEE RENTALS', 'Official brand name');
    insertSetting.run('tagline', 'We Make Your Moments Worthwhile.', 'Brand tagline');
    insertSetting.run('currency', 'GH₵', 'Default display currency');
    insertSetting.run('contact_phone', '+233 546 996 210', 'Primary phone channel');
    insertSetting.run('contact_whatsapp', '+233 546 996 210', 'Primary WhatsApp channel');
    insertSetting.run('contact_email', 'bolddeerentals@gmail.com', 'Official support email');
    insertSetting.run('deposit_percentage', '60', 'Default booking deposit percentage (60%)');
    insertSetting.run('unpaid_hold_ttl_minutes', '30', 'Inventory hold duration during checkout');
    insertSetting.run('delivery_zones', JSON.stringify([
      { id: 'ZONE_A', name: 'Ho Central / HTU Campus', fee: 50 },
      { id: 'ZONE_B', name: 'Greater Ho Suburbs & Environs', fee: 100 },
      { id: 'ZONE_C', name: 'Inter-District & Accra Outstation', fee: 150 }
    ]), 'Admin-configurable delivery zones');
    insertSetting.run('reminder_offsets_days', JSON.stringify([14, 7, 2, 0]), 'Event reminder schedule');
  }

  // 3. Seed Products (conforms to mockData baseline & SRS pillars)
  const existingProducts = db.prepare('SELECT COUNT(*) as count FROM products').get();
  if (existingProducts.count === 0) {
    const insertProduct = db.prepare(`
      INSERT INTO products (
        id, sku, name, description, price, cost_price, category, pillar, unit,
        stock_quantity, min_order_qty, featured, in_stock, image, image_urls,
        is_customizable, is_rental, is_service, deposit, asset_prefix, rating, reviews_count
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const products = [
      {
        id: 'g1',
        sku: 'BD-SASH-001',
        name: 'Personalized Graduation Sash / Stole',
        pillar: 'BOLDDEE GRAD',
        category: 'Graduation Accessories',
        price: 120,
        cost_price: 65,
        unit: 'piece',
        stock: 500,
        featured: 1,
        image: '/images/custom_sash.jpg',
        description: 'Custom woven and gold embroidered stole tailored with your university crest, course, name, and graduation year.',
        is_customizable: 1,
        is_rental: 0,
        is_service: 0,
        deposit: 0,
        prefix: null
      },
      {
        id: 'g2',
        sku: 'BD-MEDAL-001',
        name: 'BOLDDEE Premium Class Medal',
        pillar: 'BOLDDEE GRAD',
        category: 'Graduation Keepsakes',
        price: 85,
        cost_price: 40,
        unit: 'piece',
        stock: 250,
        featured: 1,
        image: '/images/custom_sash.jpg',
        description: 'Heavyweight polished gold alloy medallion on high-density satin ribbon with custom engraving.',
        is_customizable: 1,
        is_rental: 0,
        is_service: 0,
        deposit: 0,
        prefix: null
      },
      {
        id: 'g3',
        sku: 'BD-FRAME-001',
        name: 'Engraved Certificate Frame & Wooden Plaque',
        pillar: 'BOLDDEE GRAD',
        category: 'Graduation Keepsakes',
        price: 180,
        cost_price: 90,
        unit: 'piece',
        stock: 120,
        featured: 0,
        image: '/images/custom_sash.jpg',
        description: 'Mahogany finished frame with anti-glare glass and custom metal plaque for your degree certificate.',
        is_customizable: 1,
        is_rental: 0,
        is_service: 0,
        deposit: 0,
        prefix: null
      },
      {
        id: 'g4',
        sku: 'BD-VIP-PACK',
        name: 'VIP Graduate Celebration Pack',
        pillar: 'BOLDDEE GRAD',
        category: 'Graduation Packages',
        price: 350,
        cost_price: 180,
        unit: 'pack',
        stock: 80,
        featured: 1,
        image: '/images/hero_graduation.jpg',
        description: 'All-in-one pack including Custom Sash, Engraved Medal, Wooden Certificate Frame, and Photo Props.',
        is_customizable: 1,
        is_rental: 0,
        is_service: 0,
        deposit: 0,
        prefix: null
      },
      {
        id: 'r1',
        sku: 'BD-TENT-20X20',
        name: 'High-Peak Marquee Tent (20x20 ft)',
        pillar: 'BOLDDEE RENTALS',
        category: 'Tents & Canopies',
        price: 450,
        cost_price: 150,
        unit: 'day',
        stock: 15,
        featured: 1,
        image: '/images/rental_equipment.jpg',
        description: 'Waterproof white high-peak marquee tent suitable for 50-70 seated guests. Includes professional installation.',
        is_customizable: 0,
        is_rental: 1,
        is_service: 0,
        deposit: 150,
        prefix: 'TENT'
      },
      {
        id: 'r2',
        sku: 'BD-CHR-CHIAVARI',
        name: 'Gold Chiavari Chair',
        pillar: 'BOLDDEE RENTALS',
        category: 'Chairs & Tables',
        price: 12,
        cost_price: 4,
        unit: 'chair/day',
        stock: 600,
        featured: 1,
        image: '/images/rental_equipment.jpg',
        description: 'Elegant golden hardwood Chiavari chair with white padded cushion. Minimum order 20 units.',
        is_customizable: 0,
        is_rental: 1,
        is_service: 0,
        deposit: 3,
        prefix: 'CHR'
      },
      {
        id: 'r3',
        sku: 'BD-TBL-ROUND8',
        name: 'Banquet Round Table (8-Seater)',
        pillar: 'BOLDDEE RENTALS',
        category: 'Chairs & Tables',
        price: 40,
        cost_price: 15,
        unit: 'table/day',
        stock: 40,
        featured: 0,
        image: '/images/rental_equipment.jpg',
        description: 'Heavy duty folding 6ft round banquet table. Fits up to 8 Chiavari or plastic chairs. White linen available.',
        is_customizable: 0,
        is_rental: 1,
        is_service: 0,
        deposit: 10,
        prefix: 'TBL'
      },
      {
        id: 'r4',
        sku: 'BD-STG-RED',
        name: 'Outdoor Stage Setup (12x16 ft) + Red Carpet',
        pillar: 'BOLDDEE RENTALS',
        category: 'Staging & Structures',
        price: 800,
        cost_price: 300,
        unit: 'day',
        stock: 5,
        featured: 0,
        image: '/images/rental_equipment.jpg',
        description: 'Modular non-slip stage platform with skirting, steps, and plush red carpet overlay.',
        is_customizable: 0,
        is_rental: 1,
        is_service: 0,
        deposit: 250,
        prefix: 'STG'
      },
      {
        id: 'r5',
        sku: 'BD-SPK-PA2',
        name: 'Pro PA Sound System & Wireless Mics',
        pillar: 'BOLDDEE RENTALS',
        category: 'Audio & Lighting',
        price: 600,
        cost_price: 200,
        unit: 'day',
        stock: 8,
        featured: 1,
        image: '/images/rental_equipment.jpg',
        description: '2x 15-inch Powered Active Speakers, 8-Channel Mixer, 2 UHF Wireless Microphones, and Sound Tech support.',
        is_customizable: 0,
        is_rental: 1,
        is_service: 0,
        deposit: 200,
        prefix: 'SPK'
      },
      {
        id: 'm1',
        sku: 'BD-MOM-PORTRAIT',
        name: 'Studio & Outdoor Graduate Portrait Shoot',
        pillar: 'BOLDDEE MOMENTS',
        category: 'Photography',
        price: 300,
        cost_price: 100,
        unit: 'session',
        stock: 50,
        featured: 1,
        image: '/images/bolddee_moments.jpg',
        description: '1-Hour photoshoot with studio lighting, props, 10 retouched digital copies + 2 A4 Framed Prints.',
        is_customizable: 0,
        is_rental: 0,
        is_service: 1,
        deposit: 0,
        prefix: null
      },
      {
        id: 'm2',
        sku: 'BD-MOM-VIDEO4K',
        name: '4K Cinema Videography & Event Coverage',
        pillar: 'BOLDDEE MOMENTS',
        category: 'Videography',
        price: 1200,
        cost_price: 500,
        unit: 'event',
        stock: 20,
        featured: 0,
        image: '/images/bolddee_moments.jpg',
        description: 'Full ceremony & party coverage, drone footage highlights, professionally edited 3-minute highlight video.',
        is_customizable: 0,
        is_rental: 0,
        is_service: 1,
        deposit: 0,
        prefix: null
      },
      {
        id: 'm3',
        sku: 'BD-MOM-360BOOTH',
        name: '360 Spin Photo Booth Rental',
        pillar: 'BOLDDEE MOMENTS',
        category: 'Interactive Booths',
        price: 950,
        cost_price: 400,
        unit: '4 hours',
        stock: 6,
        featured: 1,
        image: '/images/bolddee_moments.jpg',
        description: 'Automatic 360 platform, ring lights, custom video overlay logo, instant QR code phone video downloads.',
        is_customizable: 0,
        is_rental: 0,
        is_service: 1,
        deposit: 0,
        prefix: null
      },
      {
        id: 'e1',
        sku: 'BD-EVT-ROYAL',
        name: 'Royal Graduation Party Décor Package',
        pillar: 'BOLDDEE EVENTS',
        category: 'Full Event Setup',
        price: 2500,
        cost_price: 1200,
        unit: 'setup',
        stock: 10,
        featured: 1,
        image: '/images/rental_equipment.jpg',
        description: 'Complete backdrop photo wall, balloon arch, LED sign, floral arrangements, centerpiece tables & lighting.',
        is_customizable: 0,
        is_rental: 0,
        is_service: 1,
        deposit: 0,
        prefix: null
      }
    ];

    for (const p of products) {
      insertProduct.run(
        p.id,
        p.sku,
        p.name,
        p.description,
        p.price,
        p.cost_price,
        p.category,
        p.pillar,
        p.unit,
        p.stock,
        1,
        p.featured,
        1,
        p.image,
        JSON.stringify([p.image]),
        p.is_customizable,
        p.is_rental,
        p.is_service,
        p.deposit,
        p.prefix,
        5.0,
        24
      );
    }
  }

  // 4. Seed Individual Asset Units (FR-034)
  const existingAssets = db.prepare('SELECT COUNT(*) as count FROM rental_assets').get();
  if (existingAssets.count === 0) {
    const insertAsset = db.prepare(`
      INSERT INTO rental_assets (id, asset_code, product_id, name, category, location, status, last_inspected)
      VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);

    insertAsset.run('ast-1', 'CHR-0001', 'r2', 'Gold Chiavari Chair #001', 'Chairs & Tables', 'Warehouse A', 'Available');
    insertAsset.run('ast-2', 'CHR-0002', 'r2', 'Gold Chiavari Chair #002', 'Chairs & Tables', 'Warehouse A', 'Available');
    insertAsset.run('ast-3', 'CHR-0003', 'r2', 'Gold Chiavari Chair #003', 'Chairs & Tables', 'Warehouse A', 'Maintenance');
    insertAsset.run('ast-4', 'TENT-001', 'r1', 'Marquee Tent 20x20 #001', 'Tents & Canopies', 'Warehouse A', 'Available');
    insertAsset.run('ast-5', 'SPK-001', 'r5', 'PA Speaker Unit A', 'Audio & Lighting', 'Warehouse B', 'Available');
  }

  // 5. Seed Promotion Codes (FR-040)
  const existingPromos = db.prepare('SELECT COUNT(*) as count FROM promotions').get();
  if (existingPromos.count === 0) {
    const insertPromo = db.prepare(`
      INSERT INTO promotions (id, code, description, discount_type, discount_value, min_spend, active, expiry_date)
      VALUES (?, ?, ?, ?, ?, ?, 1, '2028-12-31')
    `);

    insertPromo.run('prm-1', 'GRAD2027', '10% Off Graduation Orders', 'percent', 10, 100);
    insertPromo.run('prm-2', 'BOLD50', 'GH₵ 50 Off First Booking', 'fixed', 50, 200);
  }
}
