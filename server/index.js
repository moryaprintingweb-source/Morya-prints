import "dotenv/config";
import bcrypt from "bcryptjs";
import cors from "cors";
import express from "express";
import jwt from "jsonwebtoken";
import { ensureDatabase, pool, query } from "./db.js";
import { seedIfEmpty } from "./seed.js";

const app = express();
const PORT = Number(process.env.API_PORT ?? 4000);
const JWT_SECRET = process.env.JWT_SECRET ?? "replace-this-secret";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@moryaprints.local";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "change-me-now";
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
let databaseReady = false;
let databaseError = "";

async function initializeDatabase() {
  try {
    await ensureDatabase();
    await seedIfEmpty();
    databaseReady = true;
    databaseError = "";
    console.log("MySQL database is ready.");
  } catch (error) {
    databaseReady = false;
    databaseError = error instanceof Error ? error.message : "Database initialization failed";
    console.error("MySQL database is not ready:", databaseError);
  }
}

app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(",") ?? true }));
app.use(express.json({ limit: "1mb" }));

function toBool(value) {
  return value === true || value === 1 || value === "1";
}

function requireAdmin(req, res, next) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) {
    res.status(401).json({ message: "Missing admin token" });
    return;
  }

  try {
    req.admin = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired admin token" });
  }
}

function requireDatabase(_req, res, next) {
  if (databaseReady) {
    next();
    return;
  }

  res.status(503).json({
    message: "Database is not connected",
    detail: databaseError || "Check DB_PASSWORD in .env and restart npm run server.",
  });
}

function normalizeProduct(row) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    imageUrl: row.image_url,
    startingAt: Number(row.starting_at),
    mrp: row.mrp === null || row.mrp === undefined ? null : Number(row.mrp),
    quantity: row.quantity,
    singleSidePrice: row.single_side_price,
    bothSidePrice: row.both_side_price,
    offerLabel: row.offer_label,
    offerPercent: Number(row.offer_percent ?? 0),
    offerActive: toBool(row.offer_active),
    offerStartsAt: row.offer_starts_at,
    offerEndsAt: row.offer_ends_at,
    isActive: toBool(row.is_active),
    category: {
      id: row.category_id,
      slug: row.category_slug,
      name: row.category_name,
      eyebrow: row.category_eyebrow,
    },
  };
}

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "morya-prints-api",
    databaseReady,
    databaseError: databaseReady ? "" : databaseError,
  });
});

app.get("/api/products", requireDatabase, async (_req, res, next) => {
  try {
    const rows = await query(`
      SELECT
        p.*,
        c.id AS category_id,
        c.slug AS category_slug,
        c.name AS category_name,
        c.eyebrow AS category_eyebrow
      FROM products p
      JOIN categories c ON c.id = p.category_id
      WHERE p.is_active = 1 AND c.is_active = 1
      ORDER BY c.sort_order, p.name
    `);
    res.json({ products: rows.map(normalizeProduct) });
  } catch (error) {
    next(error);
  }
});

app.get("/api/categories", requireDatabase, async (_req, res, next) => {
  try {
    const categories = await query(`
      SELECT
        c.*,
        COUNT(p.id) AS product_count
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id AND p.is_active = 1
      WHERE c.is_active = 1
      GROUP BY c.id
      ORDER BY c.sort_order, c.name
    `);
    res.json({ categories });
  } catch (error) {
    next(error);
  }
});

app.get("/api/site-settings", requireDatabase, async (_req, res, next) => {
  try {
    const settings = await query("SELECT setting_key, setting_value, label FROM site_settings");
    res.json({
      settings: settings.reduce((acc, setting) => {
        acc[setting.setting_key] = {
          value: setting.setting_value,
          label: setting.label,
        };
        return acc;
      }, {}),
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/gallery", requireDatabase, async (_req, res, next) => {
  try {
    const items = await query(
      "SELECT * FROM gallery_items WHERE is_active = 1 ORDER BY sort_order, id DESC",
    );
    res.json({ items });
  } catch (error) {
    next(error);
  }
});

app.get("/api/blog-posts", requireDatabase, async (_req, res, next) => {
  try {
    const posts = await query(
      "SELECT * FROM blog_posts WHERE is_active = 1 ORDER BY created_at DESC, id DESC",
    );
    res.json({ posts });
  } catch (error) {
    next(error);
  }
});

app.post("/api/inquiries", requireDatabase, async (req, res, next) => {
  try {
    const { name, phone, email, service, message } = req.body;
    if (!name || !phone || !email || !service || !message) {
      res.status(400).json({ message: "All inquiry fields are required" });
      return;
    }

    const [result] = await pool.execute(
      `INSERT INTO inquiries (name, phone, email, service, message)
       VALUES (?, ?, ?, ?, ?)`,
      [name, phone, email, service, message],
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    next(error);
  }
});

app.post("/api/orders", requireDatabase, async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    const { customer = {}, items = [], total = 0, notes = "" } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ message: "Order requires at least one item" });
      return;
    }

    await connection.beginTransaction();
    const [orderResult] = await connection.execute(
      `INSERT INTO orders (customer_name, customer_phone, customer_email, total, notes)
       VALUES (?, ?, ?, ?, ?)`,
      [
        customer.name ?? null,
        customer.phone ?? null,
        customer.email ?? null,
        Number(total) || 0,
        notes || null,
      ],
    );

    for (const item of items) {
      await connection.execute(
        `INSERT INTO order_items
          (order_id, product_slug, product_name, category_name, price, quantity, selected_options, artwork_name)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderResult.insertId,
          item.slug,
          item.name,
          item.category,
          Number(item.price) || 0,
          Number(item.quantity) || 1,
          JSON.stringify(item.selectedOptions ?? []),
          item.artworkName ?? null,
        ],
      );
    }

    await connection.commit();
    res.status(201).json({ id: orderResult.insertId });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
});

app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body;
  const passwordMatches = ADMIN_PASSWORD_HASH
    ? await bcrypt.compare(password ?? "", ADMIN_PASSWORD_HASH)
    : password === ADMIN_PASSWORD;

  if (email !== ADMIN_EMAIL || !passwordMatches) {
    res.status(401).json({ message: "Invalid admin credentials" });
    return;
  }

  const token = jwt.sign({ email, role: "admin" }, JWT_SECRET, { expiresIn: "8h" });
  res.json({ token, admin: { email } });
});

app.use("/api/admin", requireAdmin);
app.use("/api/admin", requireDatabase);

app.get("/api/admin/summary", async (_req, res, next) => {
  try {
    const [[products], [orders], [inquiries], [revenue]] = await Promise.all([
      query("SELECT COUNT(*) AS value FROM products"),
      query("SELECT COUNT(*) AS value FROM orders"),
      query("SELECT COUNT(*) AS value FROM inquiries WHERE status = 'new'"),
      query("SELECT COALESCE(SUM(total), 0) AS value FROM orders"),
    ]);
    res.json({
      products: products.value,
      orders: orders.value,
      newInquiries: inquiries.value,
      quotedValue: Number(revenue.value),
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/admin/categories", async (_req, res, next) => {
  try {
    const categories = await query("SELECT * FROM categories ORDER BY sort_order, name");
    res.json({ categories });
  } catch (error) {
    next(error);
  }
});

app.post("/api/admin/categories", async (req, res, next) => {
  try {
    const { slug, name, eyebrow = "", sortOrder = 0, isActive = true } = req.body;
    const [result] = await pool.execute(
      `INSERT INTO categories (slug, name, eyebrow, sort_order, is_active)
       VALUES (?, ?, ?, ?, ?)`,
      [slug, name, eyebrow, Number(sortOrder) || 0, isActive ? 1 : 0],
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    next(error);
  }
});

app.put("/api/admin/categories/:id", async (req, res, next) => {
  try {
    const { slug, name, eyebrow = "", sortOrder = 0, isActive = true } = req.body;
    await pool.execute(
      `UPDATE categories
       SET slug = ?, name = ?, eyebrow = ?, sort_order = ?, is_active = ?
       WHERE id = ?`,
      [slug, name, eyebrow, Number(sortOrder) || 0, isActive ? 1 : 0, req.params.id],
    );
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.delete("/api/admin/categories/:id", async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [productResult] = await connection.execute("DELETE FROM products WHERE category_id = ?", [
      req.params.id,
    ]);
    const [result] = await connection.execute("DELETE FROM categories WHERE id = ?", [
      req.params.id,
    ]);
    await connection.commit();

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    res.json({ ok: true, deletedProducts: productResult.affectedRows });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
});

app.get("/api/admin/products", async (_req, res, next) => {
  try {
    const rows = await query(`
      SELECT
        p.*,
        c.id AS category_id,
        c.slug AS category_slug,
        c.name AS category_name,
        c.eyebrow AS category_eyebrow
      FROM products p
      JOIN categories c ON c.id = p.category_id
      ORDER BY p.updated_at DESC
    `);
    res.json({ products: rows.map(normalizeProduct) });
  } catch (error) {
    next(error);
  }
});

app.get("/api/admin/site-settings", async (_req, res, next) => {
  try {
    const settings = await query(
      "SELECT setting_key, setting_value, label FROM site_settings ORDER BY setting_key",
    );
    res.json({ settings });
  } catch (error) {
    next(error);
  }
});

app.put("/api/admin/site-settings", async (req, res, next) => {
  try {
    const settings = Array.isArray(req.body.settings) ? req.body.settings : [];
    for (const setting of settings) {
      await pool.execute(
        `UPDATE site_settings
         SET setting_value = ?
         WHERE setting_key = ?`,
        [setting.setting_value ?? "", setting.setting_key],
      );
    }
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.post("/api/admin/products", async (req, res, next) => {
  try {
    const {
      categoryId,
      slug,
      name,
      description,
      imageUrl = "",
      startingAt = 0,
      mrp = null,
      quantity = "",
      singleSidePrice = "",
      bothSidePrice = "",
      offerLabel = "",
      offerPercent = 0,
      offerActive = false,
      offerStartsAt = null,
      offerEndsAt = null,
      isActive = true,
    } = req.body;
    const [result] = await pool.execute(
      `INSERT INTO products
        (category_id, slug, name, description, image_url, starting_at, mrp, quantity, single_side_price, both_side_price, offer_label, offer_percent, offer_active, offer_starts_at, offer_ends_at, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        categoryId,
        slug,
        name,
        description,
        imageUrl,
        Number(startingAt) || 0,
        mrp === "" || mrp === null ? null : Number(mrp) || null,
        quantity,
        singleSidePrice,
        bothSidePrice,
        offerLabel,
        Number(offerPercent) || 0,
        offerActive ? 1 : 0,
        offerStartsAt || null,
        offerEndsAt || null,
        isActive ? 1 : 0,
      ],
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    next(error);
  }
});

app.put("/api/admin/products/:id", async (req, res, next) => {
  try {
    const {
      categoryId,
      slug,
      name,
      description,
      imageUrl = "",
      startingAt = 0,
      mrp = null,
      quantity = "",
      singleSidePrice = "",
      bothSidePrice = "",
      offerLabel = "",
      offerPercent = 0,
      offerActive = false,
      offerStartsAt = null,
      offerEndsAt = null,
      isActive = true,
    } = req.body;
    await pool.execute(
      `UPDATE products
       SET category_id = ?, slug = ?, name = ?, description = ?, image_url = ?,
           starting_at = ?, mrp = ?, quantity = ?, single_side_price = ?, both_side_price = ?,
           offer_label = ?, offer_percent = ?, offer_active = ?, offer_starts_at = ?, offer_ends_at = ?,
           is_active = ?
       WHERE id = ?`,
      [
        categoryId,
        slug,
        name,
        description,
        imageUrl,
        Number(startingAt) || 0,
        mrp === "" || mrp === null ? null : Number(mrp) || null,
        quantity,
        singleSidePrice,
        bothSidePrice,
        offerLabel,
        Number(offerPercent) || 0,
        offerActive ? 1 : 0,
        offerStartsAt || null,
        offerEndsAt || null,
        isActive ? 1 : 0,
        req.params.id,
      ],
    );
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.delete("/api/admin/products/:id", async (req, res, next) => {
  try {
    await pool.execute("DELETE FROM products WHERE id = ?", [req.params.id]);
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.get("/api/admin/gallery", async (_req, res, next) => {
  try {
    const items = await query("SELECT * FROM gallery_items ORDER BY sort_order, id DESC");
    res.json({ items });
  } catch (error) {
    next(error);
  }
});

app.post("/api/admin/gallery", async (req, res, next) => {
  try {
    const { title, imageUrl, height = 420, sortOrder = 0, isActive = true } = req.body;
    const [result] = await pool.execute(
      `INSERT INTO gallery_items (title, image_url, height, sort_order, is_active)
       VALUES (?, ?, ?, ?, ?)`,
      [title, imageUrl, Number(height) || 420, Number(sortOrder) || 0, isActive ? 1 : 0],
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    next(error);
  }
});

app.put("/api/admin/gallery/:id", async (req, res, next) => {
  try {
    const { title, imageUrl, height = 420, sortOrder = 0, isActive = true } = req.body;
    await pool.execute(
      `UPDATE gallery_items
       SET title = ?, image_url = ?, height = ?, sort_order = ?, is_active = ?
       WHERE id = ?`,
      [
        title,
        imageUrl,
        Number(height) || 420,
        Number(sortOrder) || 0,
        isActive ? 1 : 0,
        req.params.id,
      ],
    );
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.delete("/api/admin/gallery/:id", async (req, res, next) => {
  try {
    await pool.execute("DELETE FROM gallery_items WHERE id = ?", [req.params.id]);
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.get("/api/admin/blog-posts", async (_req, res, next) => {
  try {
    const posts = await query("SELECT * FROM blog_posts ORDER BY created_at DESC, id DESC");
    res.json({ posts });
  } catch (error) {
    next(error);
  }
});

app.post("/api/admin/blog-posts", async (req, res, next) => {
  try {
    const {
      title,
      slug,
      excerpt,
      imageUrl,
      tag = "",
      publishedAt = "",
      isActive = true,
    } = req.body;
    const [result] = await pool.execute(
      `INSERT INTO blog_posts (title, slug, excerpt, image_url, tag, published_at, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, slug, excerpt, imageUrl, tag, publishedAt, isActive ? 1 : 0],
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    next(error);
  }
});

app.put("/api/admin/blog-posts/:id", async (req, res, next) => {
  try {
    const {
      title,
      slug,
      excerpt,
      imageUrl,
      tag = "",
      publishedAt = "",
      isActive = true,
    } = req.body;
    await pool.execute(
      `UPDATE blog_posts
       SET title = ?, slug = ?, excerpt = ?, image_url = ?, tag = ?, published_at = ?, is_active = ?
       WHERE id = ?`,
      [title, slug, excerpt, imageUrl, tag, publishedAt, isActive ? 1 : 0, req.params.id],
    );
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.delete("/api/admin/blog-posts/:id", async (req, res, next) => {
  try {
    await pool.execute("DELETE FROM blog_posts WHERE id = ?", [req.params.id]);
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.get("/api/admin/inquiries", async (_req, res, next) => {
  try {
    const inquiries = await query("SELECT * FROM inquiries ORDER BY created_at DESC LIMIT 100");
    res.json({ inquiries });
  } catch (error) {
    next(error);
  }
});

app.patch("/api/admin/inquiries/:id/status", async (req, res, next) => {
  try {
    await pool.execute("UPDATE inquiries SET status = ? WHERE id = ?", [
      req.body.status,
      req.params.id,
    ]);
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.get("/api/admin/orders", async (_req, res, next) => {
  try {
    const orders = await query("SELECT * FROM orders ORDER BY created_at DESC LIMIT 100");
    const items = await query("SELECT * FROM order_items ORDER BY id");
    const groupedItems = items.reduce((acc, item) => {
      acc[item.order_id] = acc[item.order_id] ?? [];
      acc[item.order_id].push(item);
      return acc;
    }, {});
    res.json({
      orders: orders.map((order) => ({
        ...order,
        total: Number(order.total),
        items: groupedItems[order.id] ?? [],
      })),
    });
  } catch (error) {
    next(error);
  }
});

app.patch("/api/admin/orders/:id/status", async (req, res, next) => {
  try {
    await pool.execute("UPDATE orders SET status = ? WHERE id = ?", [
      req.body.status,
      req.params.id,
    ]);
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: "Server error", detail: error.message });
});

app.listen(PORT, () => {
  console.log(`Morya Prints API running on http://localhost:${PORT}`);
  void initializeDatabase();
});
