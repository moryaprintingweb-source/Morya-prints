import "dotenv/config";
import bcrypt from "bcryptjs";
import cors from "cors";
import express from "express";
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { z } from "zod";
import { ensureDatabase, pool, query } from "./db.js";
import { seedIfEmpty } from "./seed.js";

const app = express();
const PORT = Number(process.env.PORT ?? process.env.API_PORT ?? 4000);
const isProduction = process.env.NODE_ENV === "production";
const JWT_SECRET = process.env.JWT_SECRET ?? (isProduction ? "" : "dev-only-secret");
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@moryaprints.local";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? (isProduction ? "" : "change-me-now");
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
const clientOrigins =
  process.env.CLIENT_ORIGIN?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean) ?? [];
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const distDir = path.join(projectRoot, "dist");
const uploadDir = path.join(projectRoot, "public", "uploads");
const uploadsPublicBaseUrl = (process.env.UPLOADS_PUBLIC_BASE_URL ?? "").replace(/\/+$/, "");
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT ?? 587);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const SMTP_FROM = process.env.SMTP_FROM ?? SMTP_USER;
const INQUIRY_NOTIFY_EMAIL = process.env.INQUIRY_NOTIFY_EMAIL ?? ADMIN_EMAIL;
const WEB3FORMS_ACCESS_KEY = process.env.WEB3FORMS_ACCESS_KEY;
let databaseReady = false;
let databaseError = "";

const inquirySchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(180),
  phone: z
    .string()
    .trim()
    .min(7, "Phone number is too short")
    .max(60)
    .regex(/^[+()\-\s0-9]+$/, "Phone number can only contain digits, spaces, +, - and brackets"),
  email: z.string().trim().email("Enter a valid email address").max(180),
  service: z.string().trim().min(1, "Select a service").max(180),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(5000),
});

function validateProductionConfig() {
  if (!isProduction) return;

  const missing = [];
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    missing.push("JWT_SECRET with at least 32 characters");
  }
  if (
    !ADMIN_PASSWORD_HASH &&
    (!process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD.length < 12)
  ) {
    missing.push("ADMIN_PASSWORD_HASH or ADMIN_PASSWORD with at least 12 characters");
  }
  if (clientOrigins.length === 0) {
    missing.push("CLIENT_ORIGIN");
  }

  if (missing.length) {
    throw new Error(`Missing secure production configuration: ${missing.join(", ")}`);
  }
}

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

validateProductionConfig();

app.use(cors({ origin: clientOrigins.length ? clientOrigins : !isProduction }));
app.use(express.json({ limit: "12mb" }));
app.use("/uploads", express.static(uploadDir));

function toBool(value) {
  return value === true || value === 1 || value === "1";
}

function getUploadUrl(savedName) {
  const uploadPath = `/uploads/${savedName}`;
  return uploadsPublicBaseUrl ? `${uploadsPublicBaseUrl}${uploadPath}` : uploadPath;
}

function getInquiryMailer() {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD || !SMTP_FROM || !INQUIRY_NOTIFY_EMAIL) {
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
  });
}

async function notifyInquiry(inquiry) {
  if (WEB3FORMS_ACCESS_KEY) {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: `New enquiry from ${inquiry.name} - ${inquiry.service}`,
        from_name: "Morya Printing Website",
        name: inquiry.name,
        phone: inquiry.phone,
        email: inquiry.email,
        service: inquiry.service,
        message: inquiry.message,
      }),
    });

    if (!response.ok) {
      throw new Error(`Web3Forms notification failed with status ${response.status}`);
    }

    const result = await response.json().catch(() => ({}));
    if (result.success === false) {
      throw new Error(result.message ?? "Web3Forms notification failed");
    }

    return true;
  }

  const mailer = getInquiryMailer();
  if (!mailer) return false;

  await mailer.sendMail({
    from: SMTP_FROM,
    to: INQUIRY_NOTIFY_EMAIL,
    replyTo: inquiry.email,
    subject: `New enquiry from ${inquiry.name} - ${inquiry.service}`,
    text: [
      "New website enquiry",
      "",
      `Name: ${inquiry.name}`,
      `Phone: ${inquiry.phone}`,
      `Email: ${inquiry.email}`,
      `Service: ${inquiry.service}`,
      "",
      "Message:",
      inquiry.message,
    ].join("\n"),
  });

  return true;
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

app.post("/api/uploads", async (req, res, next) => {
  try {
    const { fileName = "artwork", mimeType = "", dataUrl = "" } = req.body;
    const allowedTypes = new Set([
      "application/pdf",
      "application/postscript",
      "image/jpeg",
      "image/png",
      "image/vnd.adobe.photoshop",
      "application/octet-stream",
    ]);
    const extension = path.extname(fileName).toLowerCase();
    const allowedExtensions = new Set([
      ".pdf",
      ".ai",
      ".cdr",
      ".psd",
      ".jpg",
      ".jpeg",
      ".png",
      ".webp",
    ]);
    if (!allowedExtensions.has(extension)) {
      res.status(400).json({ message: "Unsupported artwork file type" });
      return;
    }
    if (mimeType && !allowedTypes.has(mimeType) && !mimeType.startsWith("image/")) {
      res.status(400).json({ message: "Unsupported artwork MIME type" });
      return;
    }

    const match = String(dataUrl).match(/^data:[^;]+;base64,(.+)$/);
    if (!match) {
      res.status(400).json({ message: "Artwork upload data is invalid" });
      return;
    }

    const buffer = Buffer.from(match[1], "base64");
    if (!buffer.length || buffer.length > 10 * 1024 * 1024) {
      res.status(400).json({ message: "Artwork must be 10 MB or smaller" });
      return;
    }

    await mkdir(uploadDir, { recursive: true });
    const safeBase = path
      .basename(fileName, extension)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80);
    const savedName = `${Date.now()}-${safeBase || "artwork"}${extension}`;
    await writeFile(path.join(uploadDir, savedName), buffer);
    res.status(201).json({ url: getUploadUrl(savedName) });
  } catch (error) {
    next(error);
  }
});

app.post("/api/inquiries", requireDatabase, async (req, res, next) => {
  try {
    const parsed = inquirySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        message: parsed.error.issues[0]?.message ?? "Please check the inquiry details",
      });
      return;
    }

    const { name, phone, email, service, message } = parsed.data;

    const [result] = await pool.execute(
      `INSERT INTO inquiries (name, phone, email, service, message)
       VALUES (?, ?, ?, ?, ?)`,
      [name, phone, email, service, message],
    );

    let emailSent = false;
    try {
      emailSent = await notifyInquiry({ name, phone, email, service, message });
    } catch (mailError) {
      console.error(
        "Inquiry email notification failed:",
        mailError instanceof Error ? mailError.message : mailError,
      );
    }

    res.status(201).json({ id: result.insertId, emailSent });
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
      content = "",
      imageUrl,
      tag = "",
      publishedAt = "",
      isActive = true,
    } = req.body;
    const [result] = await pool.execute(
      `INSERT INTO blog_posts (title, slug, excerpt, content, image_url, tag, published_at, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, slug, excerpt, content, imageUrl, tag, publishedAt, isActive ? 1 : 0],
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
      content = "",
      imageUrl,
      tag = "",
      publishedAt = "",
      isActive = true,
    } = req.body;
    await pool.execute(
      `UPDATE blog_posts
       SET title = ?, slug = ?, excerpt = ?, content = ?, image_url = ?, tag = ?, published_at = ?, is_active = ?
       WHERE id = ?`,
      [title, slug, excerpt, content, imageUrl, tag, publishedAt, isActive ? 1 : 0, req.params.id],
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

if (existsSync(distDir)) {
  app.use(express.static(distDir));

  app.use((req, res, next) => {
    if (req.method !== "GET" || req.path.startsWith("/api")) {
      next();
      return;
    }

    res.sendFile(path.join(distDir, "index.html"));
  });
}

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: "Server error", detail: error.message });
});

app.listen(PORT, () => {
  console.log(`Morya Prints API running on port ${PORT}`);
  void initializeDatabase();
});
