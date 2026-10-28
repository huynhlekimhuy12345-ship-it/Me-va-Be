import db from '../db/database.js';

export function getCustomers() {
  const customers = db.prepare(`
    SELECT 
      customer_phone,
      MAX(customer_name) as customer_name,
      MAX(shipping_address) as latest_address,
      COUNT(id) as total_orders,
      COALESCE(SUM(CASE WHEN status != 'canceled' THEN total_amount ELSE 0 END), 0) as total_spent,
      MAX(created_at) as last_order_date
    FROM orders
    GROUP BY customer_phone
    ORDER BY total_spent DESC, total_orders DESC
  `).all();

  const getOrdersStmt = db.prepare(
    'SELECT * FROM orders WHERE customer_phone = ? ORDER BY created_at DESC'
  );

  return customers.map((c) => ({
    phone: c.customer_phone,
    name: c.customer_name,
    latestAddress: c.latest_address,
    totalOrders: c.total_orders,
    totalSpent: c.total_spent,
    lastOrderDate: c.last_order_date,
    orders: getOrdersStmt.all(c.customer_phone).map((o) => ({
      id: o.id,
      orderCode: o.order_code,
      status: o.status,
      totalAmount: o.total_amount,
      createdAt: o.created_at,
    })),
  }));
}
