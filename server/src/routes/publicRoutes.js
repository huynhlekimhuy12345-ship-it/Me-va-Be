import express from 'express';
import * as productService from '../services/productService.js';
import * as orderService from '../services/orderService.js';
import * as categoryService from '../services/categoryService.js';

const router = express.Router();

// GET /api/config: Public shop configuration
router.get('/config', (req, res) => {
  res.json({
    ok: true,
    data: {
      shopName: process.env.SHOP_NAME || 'Nga Pijama Mẹ & Bé',
      hotline: process.env.SHOP_HOTLINE || '0911400879',
      zaloPhone: process.env.ZALO_PHONE || '0911400879',
      address: process.env.SHOP_ADDRESS || '128 Nguyễn Trãi, Thanh Xuân, Hà Nội',
      bankInfo: {
        bankName: process.env.BANK_NAME || 'Vietcombank',
        bankAccount: process.env.BANK_ACCOUNT || '0911400879',
        bankHolder: process.env.BANK_HOLDER || 'NGUYEN THI NGA',
      },
    },
  });
});

// GET /api/categories
router.get('/categories', (req, res, next) => {
  try {
    const data = categoryService.getCategories();
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
});

// GET /api/products
router.get('/products', (req, res, next) => {
  try {
    const { cat, age, price, q, sort, page, limit } = req.query;
    const data = productService.getProducts({
      cat,
      age,
      price,
      q,
      sort,
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 12,
      includeInactive: false,
    });
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:slug
router.get('/products/:slug', (req, res, next) => {
  try {
    const data = productService.getProductBySlug(req.params.slug);
    if (!data) {
      return res.status(404).json({ ok: false, error: 'Không tìm thấy sản phẩm.' });
    }
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
});

// POST /api/cart/validate: Re-verify prices and stock when reopening cart
router.post('/cart/validate', (req, res, next) => {
  try {
    const { items } = req.body;
    const data = productService.validateCart(items);
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
});

// POST /api/orders: Place order
router.post('/orders', (req, res, next) => {
  try {
    const order = orderService.createOrder(req.body);
    res.status(201).json({ ok: true, data: order });
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/:code
router.get('/orders/:code', (req, res, next) => {
  try {
    const order = orderService.getOrderByCode(req.params.code);
    if (!order) {
      return res.status(404).json({ ok: false, error: 'Không tìm thấy đơn hàng.' });
    }
    res.json({ ok: true, data: order });
  } catch (err) {
    next(err);
  }
});

export default router;
