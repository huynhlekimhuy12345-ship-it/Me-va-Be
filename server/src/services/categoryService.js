import db from '../db/database.js';
import { removeAccents } from './productService.js';

export function getCategories() {
  const categories = db
    .prepare('SELECT * FROM categories ORDER BY sort_order ASC, id ASC')
    .all();

  const countStmt = db.prepare(
    'SELECT COUNT(*) as count FROM products WHERE category_id = ? AND is_active = 1'
  );

  return categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    icon: cat.icon,
    sortOrder: cat.sort_order,
    productCount: countStmt.get(cat.id).count,
  }));
}

export function createCategory({ name, icon = '🧸', sortOrder = 0 }) {
  if (!name || !name.trim()) {
    throw new Error('Tên danh mục không được để trống.');
  }

  const slug = removeAccents(name)
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  const existing = db.prepare('SELECT id FROM categories WHERE slug = ?').get(slug);
  if (existing) {
    throw new Error('Danh mục với tên này đã tồn tại.');
  }

  db.prepare(
    'INSERT INTO categories (name, slug, icon, sort_order) VALUES (?, ?, ?, ?)'
  ).run(name.trim(), slug, icon || '🧸', Number(sortOrder) || 0);

  return db.prepare('SELECT * FROM categories WHERE slug = ?').get(slug);
}

export function updateCategory(id, { name, icon, sortOrder }) {
  const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
  if (!existing) throw new Error('Không tìm thấy danh mục cần cập nhật.');

  const newName = name ? name.trim() : existing.name;
  const newIcon = icon !== undefined ? icon : existing.icon;
  const newSort = sortOrder !== undefined ? Number(sortOrder) : existing.sort_order;

  const newSlug = removeAccents(newName)
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  const duplicate = db.prepare('SELECT id FROM categories WHERE slug = ? AND id != ?').get(newSlug, id);
  if (duplicate) {
    throw new Error('Đã có danh mục khác trùng tên này.');
  }

  db.prepare(
    'UPDATE categories SET name = ?, slug = ?, icon = ?, sort_order = ? WHERE id = ?'
  ).run(newName, newSlug, newIcon, newSort, id);

  return db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
}

export function deleteCategory(id) {
  const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
  if (!existing) throw new Error('Không tìm thấy danh mục cần xóa.');

  // Strict check: Cannot delete category if products exist
  const prodCount = db.prepare('SELECT COUNT(*) as count FROM products WHERE category_id = ?').get(id).count;
  if (prodCount > 0) {
    throw new Error(
      `Không thể xóa danh mục "${existing.name}" vì đang có ${prodCount} sản phẩm liên kết. Mẹ vui lòng chuyển danh mục hoặc xóa các sản phẩm đó trước!`
    );
  }

  db.prepare('DELETE FROM categories WHERE id = ?').run(id);
  return { success: true, message: `Đã xóa danh mục "${existing.name}".` };
}
