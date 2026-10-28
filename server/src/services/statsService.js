import db from '../db/database.js';

export function getDashboardStats() {
  // 1. Total products
  const totalProducts = db.prepare('SELECT COUNT(*) as count FROM products WHERE is_active = 1').get().count;

  // 2. Low stock count (products where total variant stock <= 5)
  const lowStockRows = db.prepare(`
    SELECT p.id, p.name, SUM(v.stock) as total_stock
    FROM products p
    JOIN product_variants v ON p.id = v.product_id
    WHERE p.is_active = 1
    GROUP BY p.id
    HAVING total_stock <= 5
  `).all();
  const lowStockCount = lowStockRows.length;

  // 3. Today's orders & revenue (excluding canceled)
  // Get date in YYYY-MM-DD
  const todayStr = new Date().toISOString().slice(0, 10);

  const todayStats = db.prepare(`
    SELECT 
      COUNT(*) as count,
      COALESCE(SUM(CASE WHEN status != 'canceled' THEN total_amount ELSE 0 END), 0) as revenue
    FROM orders
    WHERE DATE(created_at) = DATE(?)
  `).get(todayStr);

  const todayOrders = todayStats.count;
  const todayRevenue = todayStats.revenue;

  // 4. Last 7 Days Revenue (for SVG bar chart)
  const sevenDaysRevenue = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const dayLabel = `${d.getDate()}/${d.getMonth() + 1}`;

    const dayStat = db.prepare(`
      SELECT COALESCE(SUM(total_amount), 0) as rev
      FROM orders
      WHERE DATE(created_at) = DATE(?) AND status != 'canceled'
    `).get(dateStr);

    sevenDaysRevenue.push({
      date: dateStr,
      label: dayLabel,
      revenue: dayStat.rev || 0,
    });
  }

  // 5. Top 5 Best Sellers
  const topProducts = db.prepare(`
    SELECT 
      oi.product_id,
      oi.product_name,
      SUM(oi.quantity) as total_sold,
      SUM(oi.subtotal) as total_revenue
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.id
    WHERE o.status != 'canceled'
    GROUP BY oi.product_id
    ORDER BY total_sold DESC
    LIMIT 5
  `).all();

  return {
    todayOrders,
    todayRevenue,
    totalProducts,
    lowStockCount,
    lowStockProducts: lowStockRows.map((r) => ({
      id: r.id,
      name: r.name,
      totalStock: r.total_stock,
    })),
    sevenDaysRevenue,
    topProducts: topProducts.map((p) => ({
      productId: p.product_id,
      name: p.product_name,
      totalSold: p.total_sold,
      totalRevenue: p.total_revenue,
    })),
  };
}
