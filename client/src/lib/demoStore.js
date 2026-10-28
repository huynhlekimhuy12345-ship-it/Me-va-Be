/**
 * Frontend-only demo store for Nga Pijama Mẹ & Bé.
 *
 * Replaces the Express + SQLite backend when the site is deployed as static
 * files on Cloudflare Workers (which cannot run Node/Express/SQLite).
 * Shop pages and /admin read and write THE SAME store, so a product added
 * or an order status changed in /admin shows up on the shop immediately,
 * and an order placed on the shop shows up in /admin.
 *
 * Everything is persisted in the browser's localStorage. No login: the admin
 * area is open, exactly like the small internal management site requested.
 * NOTE: data lives only in this browser. Clearing site data resets the demo
 * to the 12 seed products + 4 seed orders below.
 */
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from './mockData';
import { generateSlug } from './utils';

const STORAGE_KEY = 'mevabe_demo_store_v1';

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function todayKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`;
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function seedState() {
  const categories = MOCK_CATEGORIES.map((c) => ({ ...c }));
  const products = MOCK_PRODUCTS.map((p) => ({
    ...clone(p),
    isActive: 1,
  }));

  const priceOf = (productId) => products.find((p) => p.id === productId)?.price || 0;
  const mkOrder = (id, orderCode, createdAt, status, customer, items, paymentMethod) => {
    const fullItems = items.map((it, i) => {
      const product = products.find((p) => p.id === it.productId);
      const price = priceOf(it.productId);
      return {
        id: id * 100 + i + 1,
        productId: it.productId,
        variantId: it.variantId,
        productName: product?.name || it.productName || 'Sản phẩm',
        name: product?.name || it.productName || 'Sản phẩm',
        size: it.size,
        color: it.color,
        quantity: it.quantity,
        price,
        subtotal: price * it.quantity,
      };
    });
    return {
      id,
      orderCode,
      customerName: customer.name,
      customerPhone: customer.phone,
      shippingAddress: customer.address,
      note: customer.note || '',
      paymentMethod,
      status,
      stockDeducted: false,
      totalAmount: fullItems.reduce((sum, it) => sum + it.subtotal, 0),
      items: fullItems,
      createdAt,
    };
  };

  const orders = [
    mkOrder(
      1,
      'NGA-1001',
      new Date().toISOString(),
      'pending',
      { name: 'Chị Lan Anh', phone: '0903123456', address: '12 Nguyễn Trãi, Hà Nội' },
      [
        { productId: 1, variantId: 11, size: 'Size 1 (8-10kg)', color: 'Hồng Phấn', quantity: 2 },
        { productId: 5, variantId: 51, size: 'Size 1 (9-11kg)', color: 'Hồng Đào', quantity: 1 },
      ],
      'COD'
    ),
    mkOrder(
      2,
      'NGA-1002',
      daysAgo(1),
      'shipping',
      { name: 'Anh Minh Tuấn', phone: '0912345678', address: '45 Lê Lợi, TP.HCM' },
      [{ productId: 2, variantId: 21, size: 'Size 3 (13-15kg)', color: 'Xanh Mint', quantity: 1 }],
      'BANK'
    ),
    mkOrder(
      3,
      'NGA-1003',
      daysAgo(3),
      'completed',
      { name: 'Chị Thu Hằng', phone: '0987654321', address: '8 Trần Phú, Đà Nẵng' },
      [
        { productId: 4, variantId: 42, size: 'Mẹ (Freesize) + Bé 4-5T (14-17kg)', color: 'Hồng Hoa Nhí', quantity: 1 },
        { productId: 3, variantId: 31, size: '0-3 tháng (3-5kg)', color: 'Vàng Kem', quantity: 2 },
      ],
      'COD'
    ),
    mkOrder(
      4,
      'NGA-1004',
      daysAgo(5),
      'canceled',
      { name: 'Chị Phương Thảo', phone: '0934567890', address: '22 Hai Bà Trưng, Hà Nội' },
      [{ productId: 9, variantId: 91, size: 'Size 3 (13-16kg)', color: 'Hồng Pastel', quantity: 1 }],
      'COD'
    ),
  ];

  return { version: 1, categories, products, orders, nextOrderSeq: 1005, nextId: 100 };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = seedState();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.products) || !Array.isArray(parsed.orders)) {
      throw new Error('bad store');
    }
    return parsed;
  } catch {
    const seeded = seedState();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    } catch {
      /* storage unavailable: keep in-memory seed */
    }
    return seeded;
  }
}

let memoryFallback = null;
function getState() {
  try {
    return loadState();
  } catch {
    if (!memoryFallback) memoryFallback = seedState();
    return memoryFallback;
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    memoryFallback = state; // e.g. quota exceeded (large uploaded images)
  }
}

function categoryById(state, id) {
  return state.categories.find((c) => c.id === Number(id)) || null;
}

function withDerived(state, product) {
  const cat = categoryById(state, product.categoryId);
  const variants = product.variants || [];
  return {
    ...product,
    categoryName: cat ? cat.name : product.categoryName || 'Chưa phân loại',
    categorySlug: cat ? cat.slug : product.categorySlug || '',
    totalStock: variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0),
    isActive: product.isActive === 0 || product.isActive === false ? 0 : 1,
    images: (product.images || []).map((img) =>
      typeof img === 'string' ? { url: img, thumbnailUrl: img } : img
    ),
  };
}

function withCounts(state, category) {
  const count = state.products.filter((p) => Number(p.categoryId) === Number(category.id)).length;
  return { ...category, count, productCount: count };
}

function uniqueSlug(state, base, excludeId = null) {
  let slug = base || 'san-pham';
  let n = 2;
  const taken = (s) => state.products.some((p) => p.slug === s && p.id !== excludeId);
  while (taken(slug)) {
    slug = `${base}-${n}`;
    n += 1;
  }
  return slug;
}

/* ------------------------------- reads ------------------------------- */

export function getCategories() {
  const state = getState();
  return state.categories.map((c) => withCounts(state, c));
}

export function getProducts(activeOnly = true) {
  const state = getState();
  return state.products
    .filter((p) => !activeOnly || (p.isActive !== 0 && p.isActive !== false))
    .map((p) => withDerived(state, p));
}

export function getProductBySlug(slug) {
  const state = getState();
  const found = state.products.find((p) => p.slug === slug);
  return found ? withDerived(state, found) : null;
}

export function getProductById(id) {
  const state = getState();
  const found = state.products.find((p) => p.id === Number(id));
  return found ? withDerived(state, found) : null;
}

export function getOrders({ status = '', search = '' } = {}) {
  const state = getState();
  let list = [...state.orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (status) list = list.filter((o) => o.status === status);
  if (search) {
    const q = search.trim().toLowerCase();
    list = list.filter(
      (o) =>
        o.orderCode.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q)
    );
  }
  return list;
}

export function getOrderByCode(orderCode) {
  const state = getState();
  return state.orders.find((o) => o.orderCode === orderCode) || null;
}

export function getCustomers() {
  const state = getState();
  const map = new Map();
  for (const order of state.orders) {
    const key = order.customerPhone;
    if (!map.has(key)) {
      map.set(key, {
        name: order.customerName,
        phone: order.customerPhone,
        latestAddress: order.shippingAddress,
        totalOrders: 0,
        totalSpent: 0,
        orders: [],
      });
    }
    const c = map.get(key);
    c.totalOrders += 1;
    if (order.status !== 'canceled') c.totalSpent += order.totalAmount;
    c.orders.push(order);
    c.latestAddress = order.shippingAddress;
  }
  return [...map.values()].sort((a, b) => b.totalSpent - a.totalSpent);
}

export function getStats() {
  const state = getState();
  const today = todayKey();
  const isToday = (iso) => todayKey(new Date(iso)) === today;
  const valid = (o) => o.status !== 'canceled';

  const todayOrders = state.orders.filter((o) => isToday(o.createdAt) && valid(o)).length;
  const todayRevenue = state.orders
    .filter((o) => isToday(o.createdAt) && valid(o))
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const sevenDaysRevenue = [];
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = todayKey(d);
    const revenue = state.orders
      .filter((o) => todayKey(new Date(o.createdAt)) === key && valid(o))
      .reduce((sum, o) => sum + o.totalAmount, 0);
    sevenDaysRevenue.push({
      date: key,
      label: d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
      revenue,
    });
  }

  const sold = new Map();
  for (const order of state.orders.filter(valid)) {
    for (const it of order.items || []) {
      const cur = sold.get(it.productId) || { productId: it.productId, name: it.productName, totalSold: 0, totalRevenue: 0 };
      cur.totalSold += it.quantity;
      cur.totalRevenue += it.price * it.quantity;
      sold.set(it.productId, cur);
    }
  }
  const topProducts = [...sold.values()].sort((a, b) => b.totalSold - a.totalSold).slice(0, 5);

  const all = getProducts(false);
  const lowStockProducts = all
    .filter((p) => p.totalStock <= 5)
    .map((p) => ({ id: p.id, name: p.name, totalStock: p.totalStock }));

  return {
    todayOrders,
    todayRevenue,
    totalProducts: all.filter((p) => p.isActive === 1).length,
    lowStockCount: lowStockProducts.length,
    sevenDaysRevenue,
    topProducts,
    lowStockProducts,
  };
}

export function validateCart(items) {
  const state = getState();
  let hasChanges = false;
  const updatedItems = [];
  for (const it of items || []) {
    const product = state.products.find((p) => p.id === Number(it.productId));
    const variant = product?.variants?.find((v) => v.id === Number(it.variantId));
    if (!product || !variant || product.isActive === 0 || product.isActive === false) {
      hasChanges = true;
      continue;
    }
    const next = { ...it, price: product.price, stock: variant.stock };
    if (next.price !== it.price || next.stock !== it.stock) hasChanges = true;
    if (next.quantity > variant.stock) {
      next.quantity = Math.max(variant.stock, 0);
      hasChanges = true;
    }
    if (next.quantity <= 0) {
      hasChanges = true;
      continue;
    }
    updatedItems.push(next);
  }
  return { updatedItems, hasChanges, message: hasChanges ? 'Giỏ hàng đã cập nhật lại giá và tồn kho mới nhất!' : '' };
}

/* ------------------------------ writes ------------------------------- */

export function createProduct(payload) {
  const state = getState();
  const id = Math.max(0, ...state.products.map((p) => p.id)) + 1;
  const slug = uniqueSlug(state, payload.slug || generateSlug(payload.name || 'san-pham'));
  const maxVariantId = Math.max(0, ...state.products.flatMap((p) => (p.variants || []).map((v) => v.id || 0)));
  const variants = (payload.variants || []).map((v, i) => ({
    id: maxVariantId + i + 1,
    size: v.size,
    color: v.color || '',
    stock: Number(v.stock) || 0,
  }));
  const product = {
    id,
    name: payload.name,
    slug,
    categoryId: payload.categoryId ? Number(payload.categoryId) : null,
    categoryName: '',
    categorySlug: '',
    ageRange: payload.ageRange || '1-3',
    gender: payload.gender || 'unisex',
    price: Number(payload.price) || 0,
    originalPrice: payload.originalPrice ? Number(payload.originalPrice) : null,
    isNew: !!payload.isNew,
    isBestSeller: !!payload.isBestSeller,
    isActive: payload.isActive === 0 || payload.isActive === false ? 0 : 1,
    description: payload.description || '',
    images: (payload.images || []).map((img, i) => ({
      id: id * 100 + i + 1,
      url: img.url,
      thumbnailUrl: img.thumbnailUrl || img.url,
    })),
    variants,
  };
  state.products.push(product);
  saveState(state);
  return withDerived(state, product);
}

export function updateProduct(id, payload) {
  const state = getState();
  const product = state.products.find((p) => p.id === Number(id));
  if (!product) return null;
  const maxVariantId = Math.max(0, ...state.products.flatMap((p) => (p.variants || []).map((v) => v.id || 0)));
  Object.assign(product, {
    name: payload.name ?? product.name,
    slug: payload.slug
      ? uniqueSlug(state, payload.slug, product.id)
      : product.slug,
    categoryId: payload.categoryId ? Number(payload.categoryId) : product.categoryId,
    ageRange: payload.ageRange ?? product.ageRange,
    gender: payload.gender ?? product.gender,
    price: payload.price !== undefined ? Number(payload.price) : product.price,
    originalPrice:
      payload.originalPrice !== undefined
        ? payload.originalPrice
          ? Number(payload.originalPrice)
          : null
        : product.originalPrice,
    isNew: payload.isNew !== undefined ? !!payload.isNew : product.isNew,
    isBestSeller: payload.isBestSeller !== undefined ? !!payload.isBestSeller : product.isBestSeller,
    isActive:
      payload.isActive !== undefined
        ? payload.isActive === 0 || payload.isActive === false
          ? 0
          : 1
        : product.isActive,
    description: payload.description ?? product.description,
  });
  if (Array.isArray(payload.variants)) {
    product.variants = payload.variants.map((v, i) => ({
      id: maxVariantId + i + 1,
      size: v.size,
      color: v.color || '',
      stock: Number(v.stock) || 0,
    }));
  }
  if (Array.isArray(payload.images)) {
    product.images = payload.images.map((img, i) => ({
      id: product.id * 100 + i + 1,
      url: img.url,
      thumbnailUrl: img.thumbnailUrl || img.url,
    }));
  }
  saveState(state);
  return withDerived(state, product);
}

export function deleteProduct(id) {
  const state = getState();
  const idx = state.products.findIndex((p) => p.id === Number(id));
  if (idx === -1) return false;
  state.products.splice(idx, 1);
  saveState(state);
  return true;
}

export function createCategory({ name, icon }) {
  const state = getState();
  const id = Math.max(0, ...state.categories.map((c) => c.id)) + 1;
  let slug = generateSlug(name || 'danh-muc');
  let n = 2;
  while (state.categories.some((c) => c.slug === slug)) {
    slug = `${generateSlug(name || 'danh-muc')}-${n}`;
    n += 1;
  }
  const cat = { id, name, slug, icon: icon || '🧸' };
  state.categories.push(cat);
  saveState(state);
  return withCounts(state, cat);
}

export function updateCategory(id, { name, icon }) {
  const state = getState();
  const cat = state.categories.find((c) => c.id === Number(id));
  if (!cat) return null;
  if (name) cat.name = name;
  if (icon) cat.icon = icon;
  saveState(state);
  return withCounts(state, cat);
}

export function deleteCategory(id) {
  const state = getState();
  const used = state.products.some((p) => Number(p.categoryId) === Number(id));
  if (used) return { error: 'Danh mục đang có sản phẩm liên kết, không thể xóa!' };
  const idx = state.categories.findIndex((c) => c.id === Number(id));
  if (idx === -1) return { error: 'Không tìm thấy danh mục' };
  state.categories.splice(idx, 1);
  saveState(state);
  return { ok: true };
}

export function createOrder(payload) {
  const state = getState();
  // Server-side price verification: always use current demo prices.
  const items = [];
  for (const it of payload.items || []) {
    const product = state.products.find((p) => p.id === Number(it.productId));
    const variant = product?.variants?.find((v) => v.id === Number(it.variantId));
    if (!product || !variant) return { error: `Sản phẩm không còn tồn tại (ID ${it.productId})` };
    if (variant.stock < Number(it.quantity)) {
      return { error: `Sản phẩm "${product.name}" chỉ còn ${variant.stock} bộ trong kho!` };
    }
    items.push({
      id: Date.now() + Math.floor(Math.random() * 1000),
      productId: product.id,
      variantId: variant.id,
      productName: product.name,
      name: product.name,
      size: it.size || variant.size,
      color: it.color || variant.color,
      quantity: Number(it.quantity),
      price: product.price,
      subtotal: product.price * Number(it.quantity),
    });
  }
  if (items.length === 0) return { error: 'Giỏ hàng trống, không thể đặt hàng!' };
  const id = Math.max(0, ...state.orders.map((o) => o.id)) + 1;
  const orderCode = `NGA-${state.nextOrderSeq}`;
  state.nextOrderSeq += 1;
  const order = {
    id,
    orderCode,
    customerName: payload.customerName,
    customerPhone: payload.customerPhone,
    shippingAddress: payload.shippingAddress,
    note: payload.note || '',
    paymentMethod: payload.paymentMethod || 'COD',
    status: 'pending',
    stockDeducted: false,
    totalAmount: items.reduce((sum, it) => sum + it.subtotal, 0),
    items,
    createdAt: new Date().toISOString(),
  };
  state.orders.push(order);
  saveState(state);
  return { order };
}

export function updateOrderStatus(id, newStatus) {
  const state = getState();
  const order = state.orders.find((o) => o.id === Number(id));
  if (!order) return null;
  // Stock lifecycle (same rule as the original backend):
  // deduct once when the order becomes confirmed, restore if later canceled.
  if (newStatus === 'confirmed' && !order.stockDeducted) {
    for (const it of order.items || []) {
      const product = state.products.find((p) => p.id === Number(it.productId));
      const variant = product?.variants?.find((v) => v.id === Number(it.variantId));
      if (variant) variant.stock = Math.max(0, variant.stock - it.quantity);
    }
    order.stockDeducted = true;
  }
  if (newStatus === 'canceled' && order.stockDeducted) {
    for (const it of order.items || []) {
      const product = state.products.find((p) => p.id === Number(it.productId));
      const variant = product?.variants?.find((v) => v.id === Number(it.variantId));
      if (variant) variant.stock += it.quantity;
    }
    order.stockDeducted = false;
  }
  order.status = newStatus;
  saveState(state);
  return order;
}
