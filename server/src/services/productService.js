import db, { runTransaction } from '../db/database.js';

// Vietnamese accent removal helper
export function removeAccents(str) {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

// Generate URL slug from title, appending -2, -3 if duplicate
export function generateUniqueSlug(title, currentId = null) {
  let baseSlug = removeAccents(title)
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  let slug = baseSlug;
  let counter = 2;

  while (true) {
    let query = 'SELECT id FROM products WHERE slug = ?';
    let params = [slug];
    if (currentId) {
      query += ' AND id != ?';
      params.push(currentId);
    }
    const existing = db.prepare(query).get(...params);
    if (!existing) break;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

/**
 * Fetch products list with filtering, searching, sorting, and pagination
 */
export function getProducts({
  cat = '',
  age = '',
  price = '',
  q = '',
  sort = 'newest',
  page = 1,
  limit = 12,
  includeInactive = false,
}) {
  let whereClauses = [];
  let params = [];

  if (!includeInactive) {
    whereClauses.push('p.is_active = 1');
  }

  if (cat) {
    whereClauses.push('(c.slug = ? OR p.category_id = ?)');
    params.push(cat, Number(cat) || 0);
  }

  if (age) {
    whereClauses.push('p.age_range = ?');
    params.push(age);
  }

  if (price === 'under-150') {
    whereClauses.push('p.price < 150000');
  } else if (price === '150-250') {
    whereClauses.push('p.price >= 150000 AND p.price <= 250000');
  } else if (price === 'above-250') {
    whereClauses.push('p.price > 250000');
  }

  const whereSql = whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(' AND ') : '';

  // Order by
  let orderSql = 'ORDER BY p.is_new DESC, p.created_at DESC';
  if (sort === 'price-asc') {
    orderSql = 'ORDER BY p.price ASC';
  } else if (sort === 'price-desc') {
    orderSql = 'ORDER BY p.price DESC';
  } else if (sort === 'bestseller') {
    orderSql = 'ORDER BY p.is_bestseller DESC, p.created_at DESC';
  } else if (sort === 'newest') {
    orderSql = 'ORDER BY p.is_new DESC, p.created_at DESC';
  }

  const baseQuery = `
    SELECT 
      p.*,
      c.name as category_name,
      c.slug as category_slug
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    ${whereSql}
    ${orderSql}
  `;

  let rows = db.prepare(baseQuery).all(...params);

  // If search query provided, apply accent-insensitive filter in memory
  if (q && q.trim()) {
    const normQ = removeAccents(q.trim());
    rows = rows.filter((p) => {
      const normName = removeAccents(p.name);
      const normCat = removeAccents(p.category_name || '');
      const normDesc = removeAccents(p.description || '');
      return normName.includes(normQ) || normCat.includes(normQ) || normDesc.includes(normQ);
    });
  }

  const total = rows.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const offset = (page - 1) * limit;
  const paginatedRows = rows.slice(offset, offset + limit);

  // Attach images & variants for each product
  const getImagesStmt = db.prepare(
    'SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order ASC'
  );
  const getVariantsStmt = db.prepare(
    'SELECT * FROM product_variants WHERE product_id = ? ORDER BY id ASC'
  );

  const products = paginatedRows.map((p) => {
    const images = getImagesStmt.all(p.id);
    const variants = getVariantsStmt.all(p.id);
    const totalStock = variants.reduce((sum, v) => sum + (v.stock || 0), 0);

    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      categoryId: p.category_id,
      categoryName: p.category_name,
      categorySlug: p.category_slug,
      description: p.description,
      ageRange: p.age_range,
      gender: p.gender,
      price: p.price,
      originalPrice: p.original_price,
      isNew: Boolean(p.is_new),
      isBestSeller: Boolean(p.is_bestseller),
      isActive: Boolean(p.is_active),
      totalStock,
      images: images.map((img) => ({
        id: img.id,
        url: img.image_url,
        thumbnailUrl: img.thumbnail_url || img.image_url,
        isPrimary: Boolean(img.is_primary),
      })),
      variants: variants.map((v) => ({
        id: v.id,
        size: v.size,
        color: v.color,
        stock: v.stock,
      })),
    };
  });

  return {
    products,
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
  };
}

/**
 * Fetch a single product by slug or id
 */
export function getProductBySlug(slugOrId) {
  let product;
  if (!isNaN(slugOrId)) {
    product = db
      .prepare(
        `SELECT p.*, c.name as category_name, c.slug as category_slug
         FROM products p
         LEFT JOIN categories c ON p.category_id = c.id
         WHERE p.id = ?`
      )
      .get(Number(slugOrId));
  } else {
    product = db
      .prepare(
        `SELECT p.*, c.name as category_name, c.slug as category_slug
         FROM products p
         LEFT JOIN categories c ON p.category_id = c.id
         WHERE p.slug = ?`
      )
      .get(slugOrId);
  }

  if (!product) return null;

  const images = db
    .prepare('SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order ASC')
    .all(product.id);
  const variants = db
    .prepare('SELECT * FROM product_variants WHERE product_id = ? ORDER BY id ASC')
    .all(product.id);

  const totalStock = variants.reduce((sum, v) => sum + (v.stock || 0), 0);

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    categoryId: product.category_id,
    categoryName: product.category_name,
    categorySlug: product.category_slug,
    description: product.description,
    ageRange: product.age_range,
    gender: product.gender,
    price: product.price,
    originalPrice: product.original_price,
    isNew: Boolean(product.is_new),
    isBestSeller: Boolean(product.is_bestseller),
    isActive: Boolean(product.is_active),
    totalStock,
    images: images.map((img) => ({
      id: img.id,
      url: img.image_url,
      thumbnailUrl: img.thumbnail_url || img.image_url,
      isPrimary: Boolean(img.is_primary),
    })),
    variants: variants.map((v) => ({
      id: v.id,
      size: v.size,
      color: v.color,
      stock: v.stock,
    })),
  };
}

/**
 * Validate Cart Items against latest Database prices and stocks
 */
export function validateCart(clientItems) {
  if (!Array.isArray(clientItems)) return { updatedItems: [], hasChanges: false };

  let hasChanges = false;
  const messages = [];

  const updatedItems = clientItems.map((item) => {
    const variant = db.prepare('SELECT * FROM product_variants WHERE id = ?').get(item.variantId);
    const product = item.productId
      ? db.prepare('SELECT * FROM products WHERE id = ?').get(item.productId)
      : null;

    if (!variant || !product || !product.is_active) {
      hasChanges = true;
      messages.push(`Sản phẩm "${item.name}" hiện không còn kinh doanh.`);
      return null; // Item will be filtered out
    }

    let updatedQuantity = item.quantity;
    if (variant.stock <= 0) {
      hasChanges = true;
      messages.push(`"${product.name} (${variant.size})" đã hết hàng trong kho.`);
      return null;
    } else if (item.quantity > variant.stock) {
      hasChanges = true;
      updatedQuantity = variant.stock;
      messages.push(`"${product.name} (${variant.size})" chỉ còn ${variant.stock} bộ trong kho.`);
    }

    if (item.price !== product.price) {
      hasChanges = true;
      messages.push(`Giá "${product.name}" đã cập nhật thành ${new Intl.NumberFormat('vi-VN').format(product.price)}đ.`);
    }

    return {
      ...item,
      price: product.price,
      originalPrice: product.original_price || product.price,
      quantity: updatedQuantity,
      stock: variant.stock,
    };
  }).filter(Boolean);

  return {
    updatedItems,
    hasChanges,
    message: messages.join(' ') || undefined,
  };
}

/**
 * Create Product with variants and images (Admin)
 */
export function createProduct(data) {
  const {
    name,
    categoryId,
    description,
    ageRange,
    gender = 'unisex',
    price,
    originalPrice,
    isNew = 1,
    isBestSeller = 0,
    isActive = 1,
    variants = [],
    images = [],
  } = data;

  if (!name || !price) {
    throw new Error('Tên sản phẩm và giá không được để trống.');
  }

  if (originalPrice && Number(originalPrice) <= Number(price)) {
    throw new Error('Giá khuyến mãi phải nhỏ hơn giá gốc.');
  }

  const slug = generateUniqueSlug(name);

  return runTransaction((tx) => {
    const insertProd = tx.prepare(`
      INSERT INTO products (
        name, slug, category_id, description, age_range, gender,
        price, original_price, is_new, is_bestseller, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertProd.run(
      name.trim(),
      slug,
      categoryId || null,
      description || '',
      ageRange || '',
      gender,
      Math.round(price),
      originalPrice ? Math.round(originalPrice) : null,
      isNew ? 1 : 0,
      isBestSeller ? 1 : 0,
      isActive ? 1 : 0
    );

    // Get inserted ID
    const newProd = tx.prepare('SELECT id FROM products WHERE slug = ?').get(slug);
    const productId = newProd.id;

    // Insert variants
    const insertVar = tx.prepare(
      'INSERT INTO product_variants (product_id, size, color, stock) VALUES (?, ?, ?, ?)'
    );

    if (Array.isArray(variants) && variants.length > 0) {
      for (const v of variants) {
        insertVar.run(productId, v.size || 'Freesize', v.color || '', Number(v.stock) || 0);
      }
    } else {
      // Default variant
      insertVar.run(productId, 'Freesize', 'Mặc định', 10);
    }

    // Insert images
    const insertImg = tx.prepare(
      'INSERT INTO product_images (product_id, image_url, thumbnail_url, sort_order, is_primary) VALUES (?, ?, ?, ?, ?)'
    );

    if (Array.isArray(images) && images.length > 0) {
      images.forEach((img, idx) => {
        const url = typeof img === 'string' ? img : img.url;
        const thumb = typeof img === 'object' ? img.thumbnailUrl : url;
        insertImg.run(productId, url, thumb, idx, idx === 0 ? 1 : 0);
      });
    }

    return getProductBySlug(productId);
  });
}

/**
 * Update Product with variants and images (Admin)
 */
export function updateProduct(id, data) {
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  if (!existing) throw new Error('Không tìm thấy sản phẩm cần cập nhật.');

  const {
    name = existing.name,
    categoryId = existing.category_id,
    description = existing.description,
    ageRange = existing.age_range,
    gender = existing.gender,
    price = existing.price,
    originalPrice = existing.original_price,
    isNew = existing.is_new,
    isBestSeller = existing.is_bestseller,
    isActive = existing.is_active,
    variants,
    images,
  } = data;

  if (originalPrice && Number(originalPrice) <= Number(price)) {
    throw new Error('Giá khuyến mãi phải nhỏ hơn giá gốc.');
  }

  const slug = name !== existing.name ? generateUniqueSlug(name, id) : existing.slug;

  return runTransaction((tx) => {
    tx.prepare(`
      UPDATE products SET
        name = ?, slug = ?, category_id = ?, description = ?, age_range = ?,
        gender = ?, price = ?, original_price = ?, is_new = ?, is_bestseller = ?,
        is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      name.trim(),
      slug,
      categoryId || null,
      description,
      ageRange,
      gender,
      Math.round(price),
      originalPrice ? Math.round(originalPrice) : null,
      isNew ? 1 : 0,
      isBestSeller ? 1 : 0,
      isActive ? 1 : 0,
      id
    );

    // Update variants if provided
    if (Array.isArray(variants)) {
      tx.prepare('DELETE FROM product_variants WHERE product_id = ?').run(id);
      const insertVar = tx.prepare(
        'INSERT INTO product_variants (product_id, size, color, stock) VALUES (?, ?, ?, ?)'
      );
      for (const v of variants) {
        insertVar.run(id, v.size || 'Freesize', v.color || '', Number(v.stock) || 0);
      }
    }

    // Update images if provided
    if (Array.isArray(images)) {
      tx.prepare('DELETE FROM product_images WHERE product_id = ?').run(id);
      const insertImg = tx.prepare(
        'INSERT INTO product_images (product_id, image_url, thumbnail_url, sort_order, is_primary) VALUES (?, ?, ?, ?, ?)'
      );
      images.forEach((img, idx) => {
        const url = typeof img === 'string' ? img : img.url;
        const thumb = typeof img === 'object' ? img.thumbnailUrl : url;
        insertImg.run(id, url, thumb, idx, idx === 0 ? 1 : 0);
      });
    }

    return getProductBySlug(id);
  });
}

/**
 * Delete Product
 */
export function deleteProduct(id) {
  const existing = db.prepare('SELECT id, name FROM products WHERE id = ?').get(id);
  if (!existing) throw new Error('Không tìm thấy sản phẩm để xóa.');

  db.prepare('DELETE FROM products WHERE id = ?').run(id);
  return { success: true, message: `Đã xóa sản phẩm "${existing.name}".` };
}
