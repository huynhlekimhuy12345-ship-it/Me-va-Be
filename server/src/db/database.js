import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, '../../data');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'shop.db');
console.log(`[Database] Connecting to SQLite database at: ${dbPath}`);

const db = new DatabaseSync(dbPath);

// Enable WAL mode and foreign keys for performance and integrity
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

/**
 * Initialize all database tables matching requirement specifications
 */
export function initSchema() {
  db.exec(`
    -- Categories table
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      icon TEXT DEFAULT '🧸',
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Products table
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER REFERENCES categories(id) ON DELETE RESTRICT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      age_range TEXT,
      gender TEXT DEFAULT 'unisex',
      price INTEGER NOT NULL CHECK (price >= 0),
      original_price INTEGER CHECK (original_price >= 0),
      is_new INTEGER DEFAULT 1,
      is_bestseller INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Product Images table
    CREATE TABLE IF NOT EXISTS product_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      image_url TEXT NOT NULL,
      thumbnail_url TEXT,
      sort_order INTEGER DEFAULT 0,
      is_primary INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Product Variants (Size, Color, Stock)
    CREATE TABLE IF NOT EXISTS product_variants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      size TEXT NOT NULL,
      color TEXT DEFAULT '',
      stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Order counter for auto-incrementing order code NGA-0001
    CREATE TABLE IF NOT EXISTS counters (
      name TEXT PRIMARY KEY,
      current_value INTEGER NOT NULL DEFAULT 0
    );

    -- Orders table
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_code TEXT NOT NULL UNIQUE,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      shipping_address TEXT NOT NULL,
      note TEXT,
      payment_method TEXT NOT NULL DEFAULT 'COD',
      status TEXT NOT NULL DEFAULT 'pending', -- pending, confirmed, shipping, completed, canceled
      stock_deducted INTEGER NOT NULL DEFAULT 0, -- 0 or 1
      total_amount INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Order items (snapshot at purchase time)
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id INTEGER,
      variant_id INTEGER,
      product_name TEXT NOT NULL,
      size TEXT,
      color TEXT,
      price INTEGER NOT NULL,
      quantity INTEGER NOT NULL CHECK (quantity > 0),
      subtotal INTEGER NOT NULL
    );

    -- Initialize counter if not exists
    INSERT OR IGNORE INTO counters (name, current_value) VALUES ('order_code', 0);
  `);

  console.log('[Database] Schema verified and ready.');
}

/**
 * Helper to run a transaction
 */
export function runTransaction(callback) {
  db.exec('BEGIN IMMEDIATE TRANSACTION;');
  try {
    const result = callback(db);
    db.exec('COMMIT;');
    return result;
  } catch (error) {
    db.exec('ROLLBACK;');
    throw error;
  }
}

/**
 * Generate next order code e.g. NGA-0001
 */
export function getNextOrderCode(existingTx = null) {
  const runner = (dbInstance) => {
    const selectStmt = dbInstance.prepare("SELECT current_value FROM counters WHERE name = 'order_code'");
    const row = selectStmt.get();
    const nextVal = (row ? row.current_value : 0) + 1;

    const updateStmt = dbInstance.prepare("UPDATE counters SET current_value = ? WHERE name = 'order_code'");
    updateStmt.run(nextVal);

    const padded = String(nextVal).padStart(4, '0');
    return `NGA-${padded}`;
  };

  if (existingTx) {
    return runner(existingTx);
  }
  return runTransaction(runner);
}

export default db;
