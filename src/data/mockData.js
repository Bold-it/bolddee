export const PRODUCTS = [
  // BOLDDEE GRAD
  {
    id: 'g1',
    name: 'Personalized Graduation Sash / Stole',
    pillar: 'BOLDDEE GRAD',
    category: 'Graduation Accessories',
    price: 120,
    unit: 'piece',
    rating: 4.9,
    reviewsCount: 142,
    image: '/images/custom_sash.jpg',
    description: 'Custom woven and gold embroidered stole tailored with your university crest, course, name, and graduation year.',
    isCustomizable: true,
    badge: 'Best Seller',
    stock: 500
  },
  {
    id: 'g2',
    name: 'BOLDDEE Premium Class Medal',
    pillar: 'BOLDDEE GRAD',
    category: 'Graduation Keepsakes',
    price: 85,
    unit: 'piece',
    rating: 4.8,
    reviewsCount: 88,
    image: '/images/custom_sash.jpg',
    description: 'Heavyweight polished gold alloy medallion on high-density satin ribbon with custom engraving.',
    isCustomizable: true,
    badge: 'Popular',
    stock: 250
  },
  {
    id: 'g3',
    name: 'Engraved Certificate Frame & Wooden Plaque',
    pillar: 'BOLDDEE GRAD',
    category: 'Graduation Keepsakes',
    price: 180,
    unit: 'piece',
    rating: 5.0,
    reviewsCount: 64,
    image: '/images/custom_sash.jpg',
    description: 'Mahogany finished frame with anti-glare glass and custom metal plaque for your degree certificate.',
    isCustomizable: true,
    stock: 120
  },
  {
    id: 'g4',
    name: 'VIP Graduate Celebration Pack',
    pillar: 'BOLDDEE GRAD',
    category: 'Graduation Packages',
    price: 350,
    unit: 'pack',
    rating: 4.95,
    reviewsCount: 110,
    image: '/images/hero_graduation.jpg',
    description: 'All-in-one pack including Custom Sash, Engraved Medal, Wooden Certificate Frame, and Photo Props.',
    isCustomizable: true,
    badge: 'Value Bundle',
    stock: 80
  },

  // BOLDDEE RENTALS
  {
    id: 'r1',
    name: 'High-Peak Marquee Tent (20x20 ft)',
    pillar: 'BOLDDEE RENTALS',
    category: 'Tents & Canopies',
    price: 450,
    unit: 'day',
    deposit: 150,
    rating: 4.9,
    reviewsCount: 95,
    image: '/images/rental_equipment.jpg',
    description: 'Waterproof white high-peak marquee tent suitable for 50-70 seated guests. Includes professional installation.',
    isRental: true,
    assetPrefix: 'TENT',
    stockAvailable: 15
  },
  {
    id: 'r2',
    name: 'Gold Chiavari Chair',
    pillar: 'BOLDDEE RENTALS',
    category: 'Chairs & Tables',
    price: 12,
    unit: 'chair/day',
    deposit: 3,
    rating: 4.9,
    reviewsCount: 310,
    image: '/images/rental_equipment.jpg',
    description: 'Elegant golden hardwood Chiavari chair with white padded cushion. Minimum order 20 units.',
    isRental: true,
    assetPrefix: 'CHR',
    stockAvailable: 600
  },
  {
    id: 'r3',
    name: 'Banquet Round Table (8-Seater)',
    pillar: 'BOLDDEE RENTALS',
    category: 'Chairs & Tables',
    price: 40,
    unit: 'table/day',
    deposit: 10,
    rating: 4.7,
    reviewsCount: 78,
    image: '/images/rental_equipment.jpg',
    description: 'Heavy duty folding 6ft round banquet table. Fits up to 8 Chiavari or plastic chairs. White linen available.',
    isRental: true,
    assetPrefix: 'TBL',
    stockAvailable: 40
  },
  {
    id: 'r4',
    name: 'Outdoor Stage Setup (12x16 ft) + Red Carpet',
    pillar: 'BOLDDEE RENTALS',
    category: 'Staging & Structures',
    price: 800,
    unit: 'day',
    deposit: 250,
    rating: 4.9,
    reviewsCount: 42,
    image: '/images/rental_equipment.jpg',
    description: 'Modular non-slip stage platform with skirting, steps, and plush red carpet overlay.',
    isRental: true,
    assetPrefix: 'STG',
    stockAvailable: 5
  },
  {
    id: 'r5',
    name: 'Pro PA Sound System & Wireless Mics',
    pillar: 'BOLDDEE RENTALS',
    category: 'Audio & Lighting',
    price: 600,
    unit: 'day',
    deposit: 200,
    rating: 4.85,
    reviewsCount: 66,
    image: '/images/rental_equipment.jpg',
    description: '2x 15-inch Powered Active Speakers, 8-Channel Mixer, 2 UHF Wireless Microphones, and Sound Tech support.',
    isRental: true,
    assetPrefix: 'SPK',
    stockAvailable: 8
  },

  // BOLDDEE MOMENTS
  {
    id: 'm1',
    name: 'Studio & Outdoor Graduate Portrait Shoot',
    pillar: 'BOLDDEE MOMENTS',
    category: 'Photography',
    price: 300,
    unit: 'session',
    rating: 4.9,
    reviewsCount: 156,
    image: '/images/bolddee_moments.jpg',
    description: '1-Hour photoshoot with studio lighting, props, 10 retouched digital copies + 2 A4 Framed Prints.',
    isService: true
  },
  {
    id: 'm2',
    name: '4K Cinema Videography & Event Coverage',
    pillar: 'BOLDDEE MOMENTS',
    category: 'Videography',
    price: 1200,
    unit: 'event',
    rating: 5.0,
    reviewsCount: 38,
    image: '/images/bolddee_moments.jpg',
    description: 'Full ceremony & party coverage, drone footage highlights, professionally edited 3-minute highlight video.',
    isService: true
  },
  {
    id: 'm3',
    name: '360 Spin Photo Booth Rental',
    pillar: 'BOLDDEE MOMENTS',
    category: 'Interactive Booths',
    price: 950,
    unit: '4 hours',
    rating: 4.9,
    reviewsCount: 84,
    image: '/images/bolddee_moments.jpg',
    description: 'Automatic 360 platform, ring lights, custom video overlay logo, instant QR code phone video downloads.',
    isService: true
  },

  // BOLDDEE EVENTS
  {
    id: 'e1',
    name: 'Royal Graduation Party Décor Package',
    pillar: 'BOLDDEE EVENTS',
    category: 'Full Event Setup',
    price: 2500,
    unit: 'setup',
    rating: 4.95,
    reviewsCount: 29,
    image: '/images/rental_equipment.jpg',
    description: 'Complete backdrop photo wall, balloon arch, LED sign, floral arrangements, centerpiece tables & lighting.',
    isService: true
  }
];

export const CAMPAIGNS = [
  {
    id: 'camp-htu',
    name: 'HTU Graduation Drive 2027',
    institution: 'Ho Technical University',
    dateRange: 'Nov 12 - Nov 16, 2027',
    discount: '15% Off Bulk Class Orders',
    ambassadorCode: 'BOLDDEE/HTU2027/MOSES',
    banner: '/images/hero_graduation.jpg',
    activeStudents: 420
  },
  {
    id: 'camp-ug',
    name: 'UG Legon Grad 2027',
    institution: 'University of Ghana',
    dateRange: 'Dec 01 - Dec 05, 2027',
    discount: 'Free Delivery to Legon Campus',
    ambassadorCode: 'BOLDDEE/UG2027/AMA',
    banner: '/images/hero_graduation.jpg',
    activeStudents: 890
  }
];

export const MOCK_ADMIN_ASSETS = [
  { id: 'CHR-0001', name: 'Gold Chiavari Chair #1', category: 'Chairs', status: 'Available', location: 'Warehouse A', lastInspected: '2026-09-20' },
  { id: 'CHR-0002', name: 'Gold Chiavari Chair #2', category: 'Chairs', status: 'Rented (#BD-9402)', location: 'HTU Great Hall', lastInspected: '2026-09-22' },
  { id: 'CHR-0003', name: 'Gold Chiavari Chair #3', category: 'Chairs', status: 'Maintenance', location: 'Repair Shop', lastInspected: '2026-09-18' },
  { id: 'TENT-001', name: 'High-Peak Tent 20x20 #1', category: 'Tents', status: 'Rented (#BD-9402)', location: 'HTU Great Hall', lastInspected: '2026-09-22' },
  { id: 'SPK-001', name: 'PA Sound System Unit A', category: 'Audio', status: 'Available', location: 'Warehouse B', lastInspected: '2026-09-21' }
];

export const MOCK_ORDERS = [
  {
    id: 'BD-9402',
    customerName: 'Kwame Mensah',
    email: 'kwame.mensah@gmail.com',
    phone: '+233 24 987 6543',
    items: 'High-Peak Tent (20x20), 50x Gold Chiavari Chairs, Sound System',
    totalAmount: 1850,
    depositPaid: 1110,
    securityDeposit: 300,
    paymentStatus: '60% Deposit Paid',
    orderStatus: 'Out For Delivery',
    deliveryDate: '2026-10-15',
    deliveryLocation: 'Ho Technical University Campus, Ho',
    designApproved: true
  },
  {
    id: 'BD-9403',
    customerName: 'Abena Osei',
    email: 'abena.osei@legon.edu.gh',
    phone: '+233 50 123 4567',
    items: 'Personalized Custom Graduation Sash (Qty: 25 - Class of 2027)',
    totalAmount: 2550,
    depositPaid: 2550,
    securityDeposit: 0,
    paymentStatus: 'Paid Full',
    orderStatus: 'Design Pending Approval',
    deliveryDate: '2026-11-02',
    deliveryLocation: 'University of Ghana, Legon',
    designApproved: false
  }
];
