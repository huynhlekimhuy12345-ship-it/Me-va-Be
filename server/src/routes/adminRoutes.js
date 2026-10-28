import express from 'express';
import { requireAdmin, VALID_ADMIN_TOKEN } from '../middleware/auth.js';
import { uploadMiddleware, processUploadedImage } from '../middleware/upload.js';
import * as statsService from '../services/statsService.js';
import * as productService from '../services/productService.js';
import * as categoryService from '../services/categoryService.js';
import * as orderService from '../services/orderService.js';
import * as customerService from '../services/customerService.js';

const router = express.Router();

// POST /api/admin/login
router.post('/login', (req, res) => {
  const { pin } = req.body;
  const configuredPin = process.env.ADMIN_PIN || '202688';

  if (!pin || String(pin).trim() !== String(configuredPin).trim()) {
    return res.status(401).json({
      ok: false,
      error: 'Mã PIN không chính xác. Vui lòng thử lại!',
    });
  }

  // Set httpOnly cookie valid for 7 days
  res.cookie('admin_token', VALID_ADMIN_TOKEN, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  res.json({
    ok: true,
    data: { authenticated: true, token: VALID_ADMIN_TOKEN },
  });
});

// POST /api/admin/logout
router.post('/logout', (req, res) => {
  res.clearCookie('admin_token');
  res.json({ ok: true, message: 'Đã đăng xuất.' });
});

// GET /api/admin/me
router.get('/me', (req, res) => {
  const token = req.cookies?.admin_token || req.headers['x-admin-token'];
  if (token === VALID_ADMIN_TOKEN) {
    return res.json({ ok: true, data: { authenticated: true } });
  }
  res.status(401).json({ ok: false, error: 'Chưa đăng nhập.' });
});

// ═══ ALL ROUTES BELOW ARE PROTECTED ═══
router.use(requireAdmin);

// GET /api/admin/stats
router.get('/stats', (req, res, next) => {
  try {
    const data = statsService.getDashboardStats();
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
});

// Products CRUD
router.get('/products', (req, res, next) => {
  try {
    const data = productService.getProducts({
      includeInactive: true,
      limit: 100,
      q: req.query.q || '',
      cat: req.query.cat || '',
      page: parseInt(req.query.page, 10) || 1,
    });
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
});

router.post('/products', (req, res, next) => {
  try {
    const data = productService.createProduct(req.body);
    res.status(201).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
});

router.put('/products/:id', (req, res, next) => {
  try {
    const data = productService.updateProduct(Number(req.params.id), req.body);
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
});

router.delete('/products/:id', (req, res, next) => {
  try {
    const data = productService.deleteProduct(Number(req.params.id));
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
});

// Categories CRUD
router.get('/categories', (req, res, next) => {
  try {
    const data = categoryService.getCategories();
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
});

router.post('/categories', (req, res, next) => {
  try {
    const data = categoryService.createCategory(req.body);
    res.status(201).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
});

router.put('/categories/:id', (req, res, next) => {
  try {
    const data = categoryService.updateCategory(Number(req.params.id), req.body);
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
});

router.delete('/categories/:id', (req, res, next) => {
  try {
    const data = categoryService.deleteCategory(Number(req.params.id));
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
});

// Orders Management
router.get('/orders', (req, res, next) => {
  try {
    const { status, search, limit, page } = req.query;
    const data = orderService.getOrders({
      status,
      search,
      limit: parseInt(limit, 10) || 50,
      page: parseInt(page, 10) || 1,
    });
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
});

router.put('/orders/:id/status', (req, res, next) => {
  try {
    const { status } = req.body;
    const data = orderService.updateOrderStatus(Number(req.params.id), status);
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
});

// Customers
router.get('/customers', (req, res, next) => {
  try {
    const data = customerService.getCustomers();
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
});

// Image Upload
router.post('/upload', uploadMiddleware.array('images', 5), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ ok: false, error: 'Chưa có file ảnh nào được tải lên.' });
    }

    const uploaded = [];
    for (const file of req.files) {
      const processed = await processUploadedImage(file.buffer);
      uploaded.push(processed);
    }

    res.json({ ok: true, data: uploaded });
  } catch (err) {
    next(err);
  }
});

export default router;
