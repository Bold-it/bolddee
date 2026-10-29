import express from 'express';
import { db } from '../db/database.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/products (FR-007, FR-047)
 * Public catalogue. Never exposes cost_price!
 */
router.get('/', (req, res) => {
  const { pillar, category, search, featured, in_stock } = req.query;

  let sql = `
    SELECT id, sku, name, description, price, original_price, cost_price, category, pillar, unit,
           stock_quantity, min_order_qty, featured, in_stock, image, image_urls,
           is_customizable, is_rental, is_service, deposit, asset_prefix, badge, inclusions, variants,
           rating, reviews_count
    FROM products
    WHERE status = 'active'
  `;
  const params = [];

  if (pillar && pillar !== 'all') {
    sql += ' AND pillar = ?';
    params.push(pillar);
  }

  if (category && category !== 'all') {
    sql += ' AND (category = ? OR pillar = ?)';
    params.push(category, category);
  }

  if (featured === 'true' || featured === '1') {
    sql += ' AND featured = 1';
  }

  if (in_stock === 'true' || in_stock === '1') {
    sql += ' AND in_stock = 1';
  }

  if (search) {
    sql += ' AND (LOWER(name) LIKE ? OR LOWER(description) LIKE ? OR LOWER(category) LIKE ?)';
    const term = `%${search.toLowerCase()}%`;
    params.push(term, term, term);
  }

  sql += ' ORDER BY featured DESC, created_at DESC';

  const rows = db.prepare(sql).all(...params);
  const products = rows.map((r) => ({
    ...r,
    featured: Boolean(r.featured),
    in_stock: Boolean(r.in_stock),
    isCustomizable: Boolean(r.is_customizable),
    isRental: Boolean(r.is_rental),
    isService: Boolean(r.is_service),
    image_urls: JSON.parse(r.image_urls || '[]')
  }));

  res.json({ count: products.length, products });
});

/**
 * GET /api/products/:id
 */
router.get('/:id', (req, res) => {
  const r = db.prepare(`
    SELECT id, sku, name, description, price, original_price, cost_price, category, pillar, unit,
           stock_quantity, min_order_qty, featured, in_stock, image, image_urls,
           is_customizable, is_rental, is_service, deposit, asset_prefix, badge, inclusions, variants,
           rating, reviews_count
    FROM products
    WHERE id = ?
  `).get(req.params.id);

  if (!r) return res.status(404).json({ error: 'Product not found' });

  const product = {
    ...r,
    featured: Boolean(r.featured),
    in_stock: Boolean(r.in_stock),
    isCustomizable: Boolean(r.is_customizable),
    isRental: Boolean(r.is_rental),
    isService: Boolean(r.is_service),
    image_urls: JSON.parse(r.image_urls || '[]')
  };

  res.json({ product });
});

/**
 * POST /api/products (FR-031 - Staff only)
 */
router.post('/', authenticate, requireRole(['super_admin', 'admin', 'inventory_officer']), (req, res) => {
  const {
    name, description, price, original_price, cost_price, category, pillar, unit,
    stock_quantity, min_order_qty, featured, in_stock, image, image_urls,
    is_customizable, is_rental, is_service, deposit, asset_prefix, badge, inclusions, variants
  } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: 'Product name and price are required.' });
  }

  const id = `p-${Date.now()}`;
  const sku = `BD-${(name.substring(0, 3) || 'ITM').toUpperCase()}-${Date.now().toString().slice(-4)}`;
  const finalImage = image || (image_urls && image_urls[0]) || '/images/custom_sash.jpg';
  const urlsJson = JSON.stringify(image_urls || [finalImage]);

  db.prepare(`
    INSERT INTO products (
      id, sku, name, description, price, original_price, cost_price, category, pillar, unit,
      stock_quantity, min_order_qty, featured, in_stock, image, image_urls,
      is_customizable, is_rental, is_service, deposit, asset_prefix, badge, inclusions, variants
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id, sku, name, description || '', parseFloat(price) || 0,
    parseFloat(original_price) || 0, parseFloat(cost_price) || 0,
    category || 'General', pillar || 'BOLDDEE GRAD',
    unit || 'piece', parseInt(stock_quantity) || 100, parseInt(min_order_qty) || 1,
    featured ? 1 : 0, in_stock !== false ? 1 : 0,
    finalImage, urlsJson,
    is_customizable ? 1 : 0, is_rental ? 1 : 0, is_service ? 1 : 0,
    parseFloat(deposit) || 0, asset_prefix || null,
    badge || null, inclusions || null, typeof variants === 'object' ? JSON.stringify(variants) : (variants || null)
  );

  // If this is a rental with an asset prefix, auto-register warehouse tracking units
  if (is_rental && asset_prefix) {
    const qtyToSeed = Math.min(parseInt(stock_quantity) || 10, 20);
    const insertAsset = db.prepare(`
      INSERT OR IGNORE INTO rental_assets (id, asset_code, product_id, name, category, status)
      VALUES (?, ?, ?, ?, ?, 'Available')
    `);
    for (let i = 1; i <= qtyToSeed; i++) {
      const code = `${asset_prefix.toUpperCase()}-${String(i).padStart(3, '0')}`;
      insertAsset.run(`ra-${id}-${i}`, code, id, `${name} (Unit ${i})`, category || 'Rental');
    }
  }

  res.status(201).json({ message: 'Product created successfully', id, sku });
});

/**
 * PUT /api/products/:id (Staff only)
 */
router.put('/:id', authenticate, requireRole(['super_admin', 'admin', 'inventory_officer']), (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Product not found' });

  const finalImage = updates.image || (updates.image_urls && updates.image_urls[0]) || existing.image;
  const urlsJson = updates.image_urls ? JSON.stringify(updates.image_urls) : existing.image_urls;

  db.prepare(`
    UPDATE products SET
      name = COALESCE(?, name),
      description = COALESCE(?, description),
      price = COALESCE(?, price),
      original_price = COALESCE(?, original_price),
      cost_price = COALESCE(?, cost_price),
      category = COALESCE(?, category),
      pillar = COALESCE(?, pillar),
      unit = COALESCE(?, unit),
      stock_quantity = COALESCE(?, stock_quantity),
      min_order_qty = COALESCE(?, min_order_qty),
      featured = COALESCE(?, featured),
      in_stock = COALESCE(?, in_stock),
      image = COALESCE(?, image),
      image_urls = COALESCE(?, image_urls),
      is_customizable = COALESCE(?, is_customizable),
      is_rental = COALESCE(?, is_rental),
      is_service = COALESCE(?, is_service),
      deposit = COALESCE(?, deposit),
      asset_prefix = COALESCE(?, asset_prefix),
      badge = COALESCE(?, badge),
      inclusions = COALESCE(?, inclusions),
      variants = COALESCE(?, variants),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    updates.name, updates.description, updates.price, updates.original_price, updates.cost_price,
    updates.category, updates.pillar, updates.unit, updates.stock_quantity, updates.min_order_qty,
    updates.featured !== undefined ? (updates.featured ? 1 : 0) : null,
    updates.in_stock !== undefined ? (updates.in_stock ? 1 : 0) : null,
    finalImage, urlsJson,
    updates.is_customizable !== undefined ? (updates.is_customizable ? 1 : 0) : null,
    updates.is_rental !== undefined ? (updates.is_rental ? 1 : 0) : null,
    updates.is_service !== undefined ? (updates.is_service ? 1 : 0) : null,
    updates.deposit, updates.asset_prefix, updates.badge, updates.inclusions,
    typeof updates.variants === 'object' ? JSON.stringify(updates.variants) : updates.variants,
    id
  );

  res.json({ message: 'Product updated successfully' });
});

/**
 * DELETE /api/products/:id (Staff only)
 */
router.delete('/:id', authenticate, requireRole(['super_admin', 'admin']), (req, res) => {
  db.prepare("UPDATE products SET status = 'archived' WHERE id = ?").run(req.params.id);
  res.json({ message: 'Product archived successfully' });
});

export default router;
