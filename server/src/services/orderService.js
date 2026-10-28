import db, { runTransaction, getNextOrderCode } from '../db/database.js';

// Phone validator: 10 digits starting with 0
function isValidPhone(phone) {
  if (!phone) return false;
  const clean = phone.replace(/[\s.-]/g, '');
  return /^0\d{9}$/.test(clean);
}

// Status transitions state machine
const VALID_TRANSITIONS = {
  pending: ['confirmed', 'canceled'],
  confirmed: ['shipping', 'canceled'],
  shipping: ['completed', 'canceled'],
  completed: [], // Terminal state, cannot transition back
  canceled: [], // Terminal state
};

/**
 * Place a new customer order
 * - Server recalculates exact prices from database
 * - Validates stock availability
 * - Generates auto-increment order code NGA-xxxx
 * - Saves snapshot of name, price, size, color
 */
export function createOrder({
  customerName,
  customerPhone,
  shippingAddress,
  note = '',
  paymentMethod = 'COD',
  items = [],
}) {
  // Validate inputs
  if (!customerName || !customerName.trim()) {
    throw new Error('Họ và tên người nhận không được để trống.');
  }

  const cleanPhone = (customerPhone || '').replace(/[\s.-]/g, '');
  if (!isValidPhone(cleanPhone)) {
    throw new Error('Số điện thoại phải gồm 10 chữ số và bắt đầu bằng số 0.');
  }

  if (!shippingAddress || !shippingAddress.trim()) {
    throw new Error('Địa chỉ giao hàng không được để trống.');
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Đơn hàng không có sản phẩm nào.');
  }

  return runTransaction((tx) => {
    let calculatedTotal = 0;
    const validatedItems = [];

    // Verify each item from DB
    for (const item of items) {
      const quantity = parseInt(item.quantity, 10);
      if (isNaN(quantity) || quantity <= 0) {
        throw new Error('Số lượng sản phẩm phải là số nguyên lớn hơn 0.');
      }

      const variant = tx.prepare('SELECT * FROM product_variants WHERE id = ?').get(item.variantId);
      if (!variant) {
        throw new Error(`Biến thể sản phẩm (Mã ${item.variantId}) không tồn tại.`);
      }

      const product = tx.prepare('SELECT * FROM products WHERE id = ?').get(variant.product_id);
      if (!product || !product.is_active) {
        throw new Error(`Sản phẩm "${item.name || 'đã chọn'}" hiện không còn kinh doanh.`);
      }

      // Check stock
      if (quantity > variant.stock) {
        throw new Error(
          `Sản phẩm "${product.name} (Size: ${variant.size})" chỉ còn ${variant.stock} bộ trong kho, không đủ số lượng ${quantity} bạn đặt.`
        );
      }

      // STRICT RULE: Use product price from database, NEVER from client
      const dbPrice = product.price;
      const subtotal = dbPrice * quantity;
      calculatedTotal += subtotal;

      validatedItems.push({
        productId: product.id,
        variantId: variant.id,
        productName: product.name,
        size: variant.size,
        color: variant.color || '',
        price: dbPrice,
        quantity,
        subtotal,
      });
    }

    // Generate Order Code (NGA-0001)
    const orderCode = getNextOrderCode(tx);

    // Insert Order
    const insertOrderStmt = tx.prepare(`
      INSERT INTO orders (
        order_code, customer_name, customer_phone, shipping_address,
        note, payment_method, status, stock_deducted, total_amount
      ) VALUES (?, ?, ?, ?, ?, ?, 'pending', 0, ?)
    `);

    insertOrderStmt.run(
      orderCode,
      customerName.trim(),
      cleanPhone,
      shippingAddress.trim(),
      (note || '').trim(),
      paymentMethod === 'BANK' ? 'BANK' : 'COD',
      calculatedTotal
    );

    const insertedOrder = tx.prepare('SELECT id FROM orders WHERE order_code = ?').get(orderCode);
    const orderId = insertedOrder.id;

    // Insert order items
    const insertItemStmt = tx.prepare(`
      INSERT INTO order_items (
        order_id, product_id, variant_id, product_name, size, color, price, quantity, subtotal
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const it of validatedItems) {
      insertItemStmt.run(
        orderId,
        it.productId,
        it.variantId,
        it.productName,
        it.size,
        it.color,
        it.price,
        it.quantity,
        it.subtotal
      );
    }

    return getOrderByCode(orderCode);
  });
}

/**
 * Fetch Order by code
 */
export function getOrderByCode(orderCode) {
  const order = db.prepare('SELECT * FROM orders WHERE order_code = ?').get(orderCode);
  if (!order) return null;

  const items = db
    .prepare('SELECT * FROM order_items WHERE order_id = ?')
    .all(order.id);

  return {
    id: order.id,
    orderCode: order.order_code,
    customerName: order.customer_name,
    customerPhone: order.customer_phone,
    shippingAddress: order.shipping_address,
    note: order.note,
    paymentMethod: order.payment_method,
    status: order.status,
    stockDeducted: Boolean(order.stock_deducted),
    totalAmount: order.total_amount,
    createdAt: order.created_at,
    updatedAt: order.updated_at,
    items: items.map((it) => ({
      id: it.id,
      productId: it.product_id,
      variantId: it.variant_id,
      productName: it.product_name,
      size: it.size,
      color: it.color,
      price: it.price,
      quantity: it.quantity,
      subtotal: it.subtotal,
    })),
  };
}

/**
 * Fetch Orders List (for Admin) with filter by status & search by phone / code
 */
export function getOrders({ status = '', search = '', limit = 50, page = 1 }) {
  let whereClauses = [];
  let params = [];

  if (status) {
    whereClauses.push('status = ?');
    params.push(status);
  }

  if (search && search.trim()) {
    const s = `%${search.trim()}%`;
    whereClauses.push('(order_code LIKE ? OR customer_phone LIKE ? OR customer_name LIKE ?)');
    params.push(s, s, s);
  }

  const whereSql = whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(' AND ') : '';
  const countRow = db.prepare(`SELECT COUNT(*) as count FROM orders ${whereSql}`).get(...params);
  const total = countRow.count;

  const offset = (page - 1) * limit;
  const orders = db
    .prepare(
      `SELECT * FROM orders ${whereSql} ORDER BY created_at DESC LIMIT ? OFFSET ?`
    )
    .all(...params, limit, offset);

  const getItemsStmt = db.prepare('SELECT * FROM order_items WHERE order_id = ?');

  const detailedOrders = orders.map((o) => {
    const items = getItemsStmt.all(o.id);
    return {
      id: o.id,
      orderCode: o.order_code,
      customerName: o.customer_name,
      customerPhone: o.customer_phone,
      shippingAddress: o.shipping_address,
      note: o.note,
      paymentMethod: o.payment_method,
      status: o.status,
      stockDeducted: Boolean(o.stock_deducted),
      totalAmount: o.total_amount,
      createdAt: o.created_at,
      updatedAt: o.updated_at,
      items: items.map((it) => ({
        id: it.id,
        productId: it.product_id,
        variantId: it.variant_id,
        productName: it.product_name,
        size: it.size,
        color: it.color,
        price: it.price,
        quantity: it.quantity,
        subtotal: it.subtotal,
      })),
    };
  });

  return {
    orders: detailedOrders,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

/**
 * Update Order Status with INVENTORY DEDUCTION & RESTORATION TRANSACTION
 *
 * Rules:
 * - Inventory deducted when moving to 'confirmed' (and stock_deducted == 0)
 * - Inventory restored when canceled (and stock_deducted == 1)
 * - Each order deducted/restored exactly once
 * - Validates allowed status transitions
 */
export function updateOrderStatus(orderId, newStatus) {
  const allowed = ['pending', 'confirmed', 'shipping', 'completed', 'canceled'];
  if (!allowed.includes(newStatus)) {
    throw new Error(`Trạng thái "${newStatus}" không hợp lệ.`);
  }

  return runTransaction((tx) => {
    const order = tx.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
    if (!order) {
      throw new Error('Không tìm thấy đơn hàng cần cập nhật.');
    }

    if (order.status === newStatus) {
      return getOrderByCode(order.order_code);
    }

    // Check transition validity
    const legalNextStates = VALID_TRANSITIONS[order.status] || [];
    if (!legalNextStates.includes(newStatus)) {
      throw new Error(
        `Không thể chuyển trạng thái từ "${order.status}" sang "${newStatus}". Chỉ cho phép: ${legalNextStates.join(', ') || 'không còn trạng thái nào'}.`
      );
    }

    const items = tx.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
    let newStockDeducted = order.stock_deducted;

    // RULE 1: Deduct inventory when order is moved to 'confirmed' (or subsequent active states) if not yet deducted
    if (newStatus === 'confirmed' && order.stock_deducted === 0) {
      for (const item of items) {
        if (!item.variant_id) continue;
        const variant = tx.prepare('SELECT * FROM product_variants WHERE id = ?').get(item.variant_id);
        if (variant) {
          if (variant.stock < item.quantity) {
            throw new Error(
              `Không thể xác nhận đơn! Tồn kho biến thể "${item.product_name} (${variant.size})" chỉ còn ${variant.stock}, không đủ trừ ${item.quantity}.`
            );
          }
          tx.prepare('UPDATE product_variants SET stock = stock - ? WHERE id = ?').run(
            item.quantity,
            item.variant_id
          );
        }
      }
      newStockDeducted = 1;
    }

    // RULE 2: Restore inventory when order is canceled after having been deducted
    if (newStatus === 'canceled' && order.stock_deducted === 1) {
      for (const item of items) {
        if (!item.variant_id) continue;
        tx.prepare('UPDATE product_variants SET stock = stock + ? WHERE id = ?').run(
          item.quantity,
          item.variant_id
        );
      }
      newStockDeducted = 0;
    }

    // Update status in orders table
    tx.prepare(
      'UPDATE orders SET status = ?, stock_deducted = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).run(newStatus, newStockDeducted, order.id);

    return getOrderByCode(order.order_code);
  });
}
