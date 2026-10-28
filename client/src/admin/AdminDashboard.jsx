import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../lib/utils';
import Button from '../components/common/Button';
import {
  ShoppingCart,
  DollarSign,
  Package,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

export function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = () => {
    setLoading(true);
    fetch('/api/admin/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && data.data) {
          setStats(data.data);
        }
      })
      .catch((err) => console.error('Lỗi tải thống kê:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading && !stats) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-pastel-border/60 rounded-xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-3xl border border-pastel-border" />
          ))}
        </div>
      </div>
    );
  }

  // Calculate SVG bar chart dimensions
  const sevenDays = stats?.sevenDaysRevenue || [];
  const maxRevenue = Math.max(...sevenDays.map((d) => d.revenue), 100000);
  const chartHeight = 160;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-pastel-border/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-pastel-text">
            Tổng Quan Cửa Hàng
          </h1>
          <p className="text-xs sm:text-sm text-pastel-muted mt-0.5">
            Theo dõi đơn hàng, doanh thu và tồn kho của shop Nga Pijama
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchStats}
            icon={RefreshCw}
            className="text-xs"
          >
            Làm mới
          </Button>
          <Link to="/admin/orders">
            <Button variant="primary" size="sm" icon={ShoppingCart} className="text-xs">
              Quản lý đơn
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {/* 1. Today's Orders */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-pastel-border/80 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-pastel-muted">Đơn hôm nay</span>
            <div className="w-8 h-8 rounded-xl bg-pastel-pink/60 flex items-center justify-center text-brand-pink-deep">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-display font-black text-pastel-text">
              {stats?.todayOrders || 0}
            </span>
            <span className="text-[11px] text-pastel-muted block mt-0.5">đơn hàng mới</span>
          </div>
        </div>

        {/* 2. Today's Revenue */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-pastel-border/80 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-pastel-muted">Doanh thu hôm nay</span>
            <div className="w-8 h-8 rounded-xl bg-pastel-mint flex items-center justify-center text-pastel-mint-deep">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-lg sm:text-2xl font-display font-black text-emerald-700 truncate block">
              {formatCurrency(stats?.todayRevenue || 0)}
            </span>
            <span className="text-[11px] text-pastel-muted block mt-0.5">
              không tính đơn hủy
            </span>
          </div>
        </div>

        {/* 3. Total Products */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-pastel-border/80 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-pastel-muted">Tổng sản phẩm</span>
            <div className="w-8 h-8 rounded-xl bg-pastel-yellow flex items-center justify-center text-amber-800">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-display font-black text-pastel-text">
              {stats?.totalProducts || 0}
            </span>
            <span className="text-[11px] text-pastel-muted block mt-0.5">đang kinh doanh</span>
          </div>
        </div>

        {/* 4. Low Stock Alert */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-pastel-border/80 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-pastel-muted">Sắp hết hàng (≤5)</span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-display font-black text-rose-600">
              {stats?.lowStockCount || 0}
            </span>
            <span className="text-[11px] text-pastel-muted block mt-0.5">mẫu cần nhập thêm</span>
          </div>
        </div>
      </div>

      {/* ═══ 7-DAY REVENUE BAR CHART (PURE SVG) ═══ */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-pastel-border/80 shadow-soft space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-pastel-border/40">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-pink" />
            <h3 className="font-display font-bold text-base sm:text-lg text-pastel-text">
              Doanh Thu 7 Ngày Gần Nhất
            </h3>
          </div>
          <span className="text-xs font-semibold text-pastel-muted">
            Đơn vị: VNĐ (chỉ tính đơn hợp lệ)
          </span>
        </div>

        {/* Pure SVG Bar Chart Container */}
        <div className="w-full pt-4 overflow-x-auto">
          <div className="min-w-[480px]">
            <svg
              viewBox="0 0 600 220"
              className="w-full h-56"
              style={{ overflow: 'visible' }}
            >
              {/* Horizontal Grid lines */}
              <line x1="30" y1="20" x2="580" y2="20" stroke="#F0E2D6" strokeDasharray="3 3" />
              <line x1="30" y1="80" x2="580" y2="80" stroke="#F0E2D6" strokeDasharray="3 3" />
              <line x1="30" y1="140" x2="580" y2="140" stroke="#F0E2D6" strokeDasharray="3 3" />
              <line x1="30" y1="180" x2="580" y2="180" stroke="#EADFD5" strokeWidth="1.5" />

              {/* Bars */}
              {sevenDays.map((item, index) => {
                const barWidth = 38;
                const gap = (550 - sevenDays.length * barWidth) / (sevenDays.length + 1);
                const x = 30 + gap + index * (barWidth + gap);
                const barHeight = Math.max(8, (item.revenue / maxRevenue) * chartHeight);
                const y = 180 - barHeight;

                return (
                  <g key={item.date} className="transition-all hover:opacity-90 cursor-pointer group">
                    {/* Value on top of bar */}
                    <text
                      x={x + barWidth / 2}
                      y={y - 8}
                      textAnchor="middle"
                      fill="#5B4A4A"
                      fontSize="10"
                      fontWeight="bold"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {formatCurrency(item.revenue)}
                    </text>

                    {/* Gradient Bar */}
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      rx="8"
                      fill={index === sevenDays.length - 1 ? '#FF8FAB' : '#C5F0DC'}
                      stroke={index === sevenDays.length - 1 ? '#FB6F92' : '#7BC9A6'}
                      strokeWidth="1"
                    />

                    {/* Day label below line */}
                    <text
                      x={x + barWidth / 2}
                      y="198"
                      textAnchor="middle"
                      fill="#8C7A7A"
                      fontSize="11"
                      fontWeight="600"
                    >
                      {item.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* Two Columns: Top 5 Best Sellers & Low Stock Warning */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Best Sellers */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-pastel-border/80 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-pastel-border/40">
            <h3 className="font-display font-bold text-base sm:text-lg text-pastel-text">
              Top 5 Sản Phẩm Bán Chạy
            </h3>
            <span className="text-xs text-brand-pink font-semibold">Tích lũy</span>
          </div>

          <div className="divide-y divide-pastel-border/40">
            {stats?.topProducts?.length === 0 ? (
              <p className="text-xs text-pastel-muted py-4 text-center">Chưa có dữ liệu bán hàng</p>
            ) : (
              stats?.topProducts?.map((p, idx) => (
                <div key={p.productId || idx} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-pastel-yellow flex items-center justify-center font-display font-bold text-xs text-amber-900 shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-pastel-text truncate">
                      {p.name}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-display font-bold text-xs sm:text-sm text-brand-pink-deep block">
                      {p.totalSold} bộ
                    </span>
                    <span className="text-[10px] text-pastel-muted">
                      {formatCurrency(p.totalRevenue)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Low Stock Warning List */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-pastel-border/80 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-pastel-border/40">
            <h3 className="font-display font-bold text-base sm:text-lg text-rose-600 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Cảnh Báo Tồn Kho Thấp</span>
            </h3>
            <span className="text-xs text-pastel-muted">Tồn ≤ 5</span>
          </div>

          <div className="divide-y divide-pastel-border/40 max-h-64 overflow-y-auto pr-1">
            {stats?.lowStockProducts?.length === 0 ? (
              <p className="text-xs text-pastel-muted py-4 text-center">
                Tất cả sản phẩm đều đang đủ tồn kho an toàn!
              </p>
            ) : (
              stats?.lowStockProducts?.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                  <span className="text-xs sm:text-sm font-semibold text-pastel-text truncate">
                    {item.name}
                  </span>
                  <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2.5 py-1 rounded-full border border-rose-200 shrink-0">
                    Còn {item.totalStock} bộ
                  </span>
                </div>
              ))
            )}
          </div>

          <Link to="/admin/products" className="block pt-2">
            <Button variant="outline" size="sm" fullWidth iconRight={ArrowRight}>
              Xem chi tiết kho sản phẩm
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
