/**
 * Frontend-only API shim.
 *
 * Intercepts every fetch() to /api/* and answers it from the localStorage
 * demo store (demoStore.js), so the existing pages and /admin keep working
 * unchanged on a static Cloudflare Workers deployment (no Express backend).
 * Any non-/api request passes through to the real window.fetch untouched.
 */
import {
  getCategories,
  getProducts,
  getProductBySlug,
  getProductById,
  getOrders,
  getOrderByCode,
  getCustomers,
  getStats,
  validateCart,
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
  updateCategory,
  deleteCategory,
  createOrder,
  updateOrderStatus,
} from './demoStore';

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

const ok = (data) => json({ ok: true, data });
const fail = (message, status = 400) => json({ ok: false, error: message }, status);

async function readJsonBody(input, init) {
  const body = init?.body ?? (typeof input !== 'string' ? input?.body : undefined);
  if (!body) return {};
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return {};
}

// Uploaded images become downscaled JPEG data URLs so they fit localStorage
// (no server, no Sharp/Multer here). Max 1200px wide, quality 0.82.
async function fileToDataUrl(file) {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1200 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.82));
    bitmap.close();
    if (blob) {
      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }
  } catch {
    /* fall through to raw data URL */
  }
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function handleUpload(input, init) {
  let form = init?.body;
  if (!form && typeof input !== 'string' && input?.formData) {
    form = await input.formData();
  }
  if (!form || typeof form.getAll !== 'function') return fail('Không nhận được file ảnh', 400);
  const files = form.getAll('images');
  if (!files.length) return fail('Không nhận được file ảnh', 400);
  const images = [];
  for (const file of files) {
    if (file.size > 5 * 1024 * 1024) {
      return fail(`File ${file.name} vượt quá 5MB.`, 400);
    }
    const url = await fileToDataUrl(file);
    images.push({ url, thumbnailUrl: url });
  }
  return ok(images);
}

async function route(path, method, query, body, rawInput, rawInit) {
  // ---- public shop API ----
  if (path === '/api/categories' && method === 'GET') {
    return ok(getCategories());
  }
  if (path === '/api/products' && method === 'GET') {
    const limit = parseInt(query.get('limit') || '50', 10);
    const products = getProducts(true).slice(0, Number.isNaN(limit) ? 50 : limit);
    return ok({ products, total: getProducts(true).length });
  }
  if (path.startsWith('/api/products/') && method === 'GET') {
    const slug = decodeURIComponent(path.replace('/api/products/', ''));
    const product = getProductBySlug(slug);
    return product ? ok(product) : fail('Không tìm thấy sản phẩm', 404);
  }
  if (path === '/api/orders' && method === 'POST') {
    const result = createOrder(body);
    if (result.error) return fail(result.error, 400);
    return ok(result.order);
  }
  if (path.startsWith('/api/orders/') && method === 'GET') {
    const code = decodeURIComponent(path.replace('/api/orders/', ''));
    const order = getOrderByCode(code);
    return order ? ok(order) : fail('Không tìm thấy đơn hàng', 404);
  }
  if (path === '/api/cart/validate' && method === 'POST') {
    return ok(validateCart(body.items));
  }

  // ---- admin API (no login in demo mode) ----
  if (path === '/api/admin/me' && method === 'GET') {
    return ok({ name: 'Quản trị viên demo' });
  }
  if (path === '/api/admin/login' && method === 'POST') {
    return ok({ name: 'Quản trị viên demo' });
  }
  if (path === '/api/admin/logout' && method === 'POST') {
    return ok({ message: 'Đã đăng xuất' });
  }
  if (path === '/api/admin/stats' && method === 'GET') {
    return ok(getStats());
  }
  if (path === '/api/admin/categories' && method === 'GET') {
    return ok(getCategories());
  }
  if (path === '/api/admin/categories' && method === 'POST') {
    if (!body.name?.trim()) return fail('Vui lòng nhập tên danh mục', 400);
    return ok(createCategory(body));
  }
  if (path.startsWith('/api/admin/categories/') && method === 'PUT') {
    const updated = updateCategory(path.replace('/api/admin/categories/', ''), body);
    return updated ? ok(updated) : fail('Không tìm thấy danh mục', 404);
  }
  if (path.startsWith('/api/admin/categories/') && method === 'DELETE') {
    const result = deleteCategory(path.replace('/api/admin/categories/', ''));
    if (result.error) return fail(result.error, 400);
    return ok({ message: 'Đã xóa danh mục' });
  }
  if (path === '/api/admin/products' && method === 'GET') {
    const limit = parseInt(query.get('limit') || '100', 10);
    const products = getProducts(false).slice(0, Number.isNaN(limit) ? 100 : limit);
    return ok({ products, total: getProducts(false).length });
  }
  if (path === '/api/admin/products' && method === 'POST') {
    if (!body.name?.trim()) return fail('Vui lòng nhập tên sản phẩm', 400);
    if (!body.price || Number(body.price) <= 0) return fail('Giá bán phải lớn hơn 0', 400);
    return ok(createProduct(body));
  }
  if (path.startsWith('/api/admin/products/') && method === 'PUT') {
    const updated = updateProduct(path.replace('/api/admin/products/', ''), body);
    return updated ? ok(updated) : fail('Không tìm thấy sản phẩm', 404);
  }
  if (path.startsWith('/api/admin/products/') && method === 'DELETE') {
    const done = deleteProduct(path.replace('/api/admin/products/', ''));
    return done
      ? ok({ message: 'Đã xóa sản phẩm thành công' })
      : fail('Không tìm thấy sản phẩm', 404);
  }
  if (path.startsWith('/api/admin/products/') && method === 'GET') {
    const product = getProductById(path.replace('/api/admin/products/', ''));
    return product ? ok(product) : fail('Không tìm thấy sản phẩm', 404);
  }
  if (path === '/api/admin/customers' && method === 'GET') {
    return ok(getCustomers());
  }
  if (path === '/api/admin/orders' && method === 'GET') {
    return ok({
      orders: getOrders({ status: query.get('status') || '', search: query.get('search') || '' }),
    });
  }
  if (path.startsWith('/api/admin/orders/') && path.endsWith('/status') && method === 'PUT') {
    const id = path.replace('/api/admin/orders/', '').replace('/status', '');
    const updated = updateOrderStatus(id, body.status);
    return updated ? ok(updated) : fail('Không tìm thấy đơn hàng', 404);
  }
  if (path === '/api/admin/upload' && method === 'POST') {
    return handleUpload(rawInput, rawInit);
  }

  return fail('API demo chưa hỗ trợ đường dẫn này', 404);
}

export function installDemoApi() {
  if (window.__mevabeDemoApiInstalled) return;
  window.__mevabeDemoApiInstalled = true;
  const nativeFetch = window.fetch.bind(window);

  window.fetch = async (input, init) => {
    const url = typeof input === 'string' ? input : input?.url || '';
    let path = '';
    try {
      path = new URL(url, window.location.origin).pathname;
    } catch {
      path = url.split('?')[0];
    }
    if (!path.startsWith('/api/')) {
      return nativeFetch(input, init);
    }
    const method = (init?.method || (typeof input !== 'string' && input?.method) || 'GET').toUpperCase();
    let query;
    try {
      query = new URL(url, window.location.origin).searchParams;
    } catch {
      query = new URLSearchParams();
    }
    const body = method === 'GET' ? {} : await readJsonBody(input, init);
    try {
      return await route(path, method, query, body, input, init);
    } catch (err) {
      console.error('Demo API error:', err);
      return fail('Lỗi xử lý demo API', 500);
    }
  };
}
