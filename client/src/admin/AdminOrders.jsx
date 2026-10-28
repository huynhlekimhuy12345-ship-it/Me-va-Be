import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../lib/utils';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import { useToast } from '../components/common/Toast';
import {
  Search,
  Printer,
  ChevronRight,
  Eye,
  CheckCircle,
  Truck,
  XCircle,
  RefreshCw,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
} from 'lucide-react';

const STATUS_MAP = {
  pending: { label: 'Chờ xác nhận', badge: 'pending', next: ['confirmed', 'canceled'] },
  confirmed: { label: 'Đã xác nhận', badge: 'confirmed', next: ['shipping', 'canceled'] },
  shipping: { label: 'Đang giao', badge: 'shipping', next: ['completed', 'canceled'] },
  completed: { label: 'Đã giao', badge: 'completed', next: [] },
  canceled: { label: 'Đã hủy', badge: 'canceled', next: [] },
};

export function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [search, setSearch] = useState('');
  const [activeOrder, setActiveOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  const { showToast } = useToast();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      let query = '/api/admin/orders?limit=100';
      if (selectedStatus) query += `&status=${selectedStatus}`;
      if (search) query += `&search=${encodeURIComponent(search.trim())}`;

      const res = await fetch(query);
      const data = await res.json();
      if (data.ok && data.data) {
        setOrders(data.data.orders);
        if (activeOrder) {
          const updated = data.data.orders.find((o) => o.id === activeOrder.id);
          if (updated) setActiveOrder(updated);
        }
      }
    } catch {
      showToast('Lỗi khi tải danh sách đơn hàng', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();

      if (res.ok && data.ok) {
        showToast(`Đã chuyển đơn sang trạng thái "${STATUS_MAP[newStatus]?.label}"!`, 'success');
        fetchOrders();
        if (activeOrder && activeOrder.id === orderId) {
          setActiveOrder(data.data);
        }
      } else {
        showToast(data.error || 'Lỗi khi cập nhật trạng thái đơn hàng', 'error');
      }
    } catch {
      showToast('Lỗi kết nối máy chủ', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-pastel-border/60 no-print">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-pastel-text">
            Quản Lý Đơn Hàng
          </h1>
          <p className="text-xs sm:text-sm text-pastel-muted mt-0.5">
            Xác nhận đơn, cập nhật giao hàng và in phiếu xuất kho
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchOrders}
          icon={RefreshCw}
          className="text-xs self-start sm:self-auto"
        >
          Làm mới
        </Button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-3xl border border-pastel-border/80 shadow-soft space-y-3 no-print">
        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs font-semibold">
          <button
            onClick={() => setSelectedStatus('')}
            className={`px-3.5 py-1.5 rounded-full transition-all shrink-0 ${
              selectedStatus === ''
                ? 'bg-brand-pink text-white shadow-soft'
                : 'bg-pastel-cream text-pastel-text hover:bg-pastel-cream-warm'
            }`}
          >
            Tất cả đơn ({orders.length})
          </button>
          {Object.entries(STATUS_MAP).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setSelectedStatus(key)}
              className={`px-3.5 py-1.5 rounded-full transition-all shrink-0 ${
                selectedStatus === key
                  ? 'bg-brand-pink text-white shadow-soft'
                  : 'bg-pastel-cream text-pastel-text hover:bg-pastel-cream-warm'
              }`}
            >
              {val.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Tìm theo Mã đơn (NGA-xxxx), SĐT hoặc tên khách hàng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-pastel-cream/60 rounded-xl pl-10 pr-20 py-2.5 text-xs sm:text-sm border border-pastel-border focus:bg-white focus:border-brand-pink focus:outline-none"
          />
          <Search className="w-4 h-4 text-pastel-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-pink hover:bg-brand-pink-hover text-white text-xs px-3 py-1 rounded-lg font-semibold"
          >
            Tìm kiếm
          </button>
        </form>
      </div>

      {/* ═══ ORDERS DISPLAY: PC TABLE (>=1024px) ═══ */}
      <div className="hidden lg:block bg-white rounded-3xl border border-pastel-border/80 shadow-soft overflow-hidden no-print">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-pastel-cream/80 text-pastel-text font-display font-bold border-b border-pastel-border">
              <th className="py-3 px-4">Mã Đơn</th>
              <th className="py-3 px-4">Khách Hàng</th>
              <th className="py-3 px-4">Số Điện Thoại</th>
              <th className="py-3 px-4">Ngày Đặt</th>
              <th className="py-3 px-4">Thanh Toán</th>
              <th className="py-3 px-4">Tổng Tiền</th>
              <th className="py-3 px-4">Trạng Thái</th>
              <th className="py-3 px-4 text-right">Chi Tiết</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pastel-border/50">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-pastel-muted">
                  Không tìm thấy đơn hàng nào trong mục này.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="hover:bg-pastel-cream/30 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-brand-pink-deep">
                    {o.orderCode}
                  </td>
                  <td className="py-3 px-4 font-semibold text-pastel-text">{o.customerName}</td>
                  <td className="py-3 px-4 font-mono">{o.customerPhone}</td>
                  <td className="py-3 px-4 text-pastel-muted">
                    {new Date(o.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-pastel-cream px-2 py-0.5 rounded-full border border-pastel-border text-[11px]">
                      {o.paymentMethod === 'BANK' ? 'Chuyển khoản' : 'COD'}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-display font-bold text-sm text-brand-pink-deep">
                    {formatCurrency(o.totalAmount)}
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={STATUS_MAP[o.status]?.badge || 'default'}>
                      {STATUS_MAP[o.status]?.label || o.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setActiveOrder(o)}
                      className="p-1.5 rounded-xl bg-pastel-cream hover:bg-pastel-pink text-pastel-text transition-colors"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ═══ ORDERS DISPLAY: MOBILE CARDS (<1024px) ═══ */}
      <div className="lg:hidden space-y-3 no-print">
        {orders.length === 0 ? (
          <div className="bg-white p-6 rounded-3xl text-center text-pastel-muted text-sm border border-pastel-border">
            Chưa có đơn hàng nào phù hợp.
          </div>
        ) : (
          orders.map((o) => (
            <div
              key={o.id}
              onClick={() => setActiveOrder(o)}
              className="bg-white p-4 rounded-3xl border border-pastel-border/80 shadow-soft space-y-3 cursor-pointer hover:border-brand-pink transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-sm text-brand-pink-deep">
                  {o.orderCode}
                </span>
                <Badge variant={STATUS_MAP[o.status]?.badge || 'default'}>
                  {STATUS_MAP[o.status]?.label || o.status}
                </Badge>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-pastel-muted">Khách hàng:</span>
                  <strong className="text-pastel-text">{o.customerName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-pastel-muted">SĐT:</span>
                  <span className="font-mono">{o.customerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-pastel-muted">Ngày đặt:</span>
                  <span>{new Date(o.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-pastel-border/50 text-xs">
                <div>
                  <span className="text-[11px] text-pastel-muted block">Tổng tiền</span>
                  <span className="font-display font-bold text-sm text-brand-pink-deep">
                    {formatCurrency(o.totalAmount)}
                  </span>
                </div>
                <Button variant="secondary" size="sm" className="text-xs py-1.5 h-auto">
                  Xem chi tiết
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ═══ ORDER DETAIL & PRINTABLE INVOICE MODAL ═══ */}
      {activeOrder && (
        <Modal
          isOpen={Boolean(activeOrder)}
          onClose={() => setActiveOrder(null)}
          title={`Chi Tiết Đơn Hàng ${activeOrder.orderCode}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6 text-xs sm:text-sm">
            {/* Printable Order Slip Template */}
            <div id="printable-order" className="space-y-4">
              {/* Slip Header (Shows shop name for print) */}
              <div className="pb-3 border-b border-pastel-border/80 flex justify-between items-start">
                <div>
                  <h3 className="font-display font-bold text-lg text-pastel-text">
                    Nga Pijama Mẹ & Bé
                  </h3>
                  <p className="text-xs text-pastel-muted">
                    Hotline/Zalo: 0911 400 879 • 128 Nguyễn Trãi, Thanh Xuân, Hà Nội
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-base text-brand-pink-deep block">
                    {activeOrder.orderCode}
                  </span>
                  <span className="text-[11px] text-pastel-muted">
                    {new Date(activeOrder.createdAt).toLocaleString('vi-VN')}
                  </span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-pastel-cream/60 rounded-2xl border border-pastel-border/60">
                <div>
                  <span className="text-pastel-muted block text-xs">Người nhận:</span>
                  <strong className="text-pastel-text text-sm">{activeOrder.customerName}</strong>
                </div>
                <div>
                  <span className="text-pastel-muted block text-xs">Số điện thoại:</span>
                  <strong className="text-pastel-text font-mono text-sm">
                    {activeOrder.customerPhone}
                  </strong>
                </div>
                <div className="col-span-2">
                  <span className="text-pastel-muted block text-xs">Địa chỉ giao hàng:</span>
                  <strong className="text-pastel-text">{activeOrder.shippingAddress}</strong>
                </div>
                {activeOrder.note && (
                  <div className="col-span-2">
                    <span className="text-pastel-muted block text-xs">Ghi chú của khách:</span>
                    <span className="italic text-pastel-text">{activeOrder.note}</span>
                  </div>
                )}
              </div>

              {/* Items List */}
              <div className="border border-pastel-border/80 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-pastel-cream/80 font-bold border-b border-pastel-border">
                      <th className="py-2.5 px-3">Sản phẩm</th>
                      <th className="py-2.5 px-3">Size / Màu</th>
                      <th className="py-2.5 px-3 text-center">SL</th>
                      <th className="py-2.5 px-3 text-right">Đơn giá</th>
                      <th className="py-2.5 px-3 text-right">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-pastel-border/50">
                    {activeOrder.items?.map((it, idx) => (
                      <tr key={it.id || idx}>
                        <td className="py-2.5 px-3 font-medium">{it.productName}</td>
                        <td className="py-2.5 px-3 text-pastel-muted">
                          {it.size} {it.color ? `- ${it.color}` : ''}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold">{it.quantity}</td>
                        <td className="py-2.5 px-3 text-right">{formatCurrency(it.price)}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-brand-pink-deep">
                          {formatCurrency(it.subtotal || it.price * it.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total Calculation */}
              <div className="space-y-1.5 text-right pt-2 border-t border-pastel-border/60">
                <div className="flex justify-between text-xs text-pastel-muted">
                  <span>Hình thức thanh toán:</span>
                  <span className="font-semibold text-pastel-text">
                    {activeOrder.paymentMethod === 'BANK' ? 'Chuyển khoản Vietcombank' : 'Thanh toán COD'}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-display font-bold pt-1">
                  <span>Tổng tiền thanh toán:</span>
                  <span className="text-base text-brand-pink-deep">
                    {formatCurrency(activeOrder.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Change Action Buttons (No Print) */}
            <div className="no-print pt-4 border-t border-pastel-border/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-pastel-text">
                  Trạng thái hiện tại:
                </span>
                <Badge variant={STATUS_MAP[activeOrder.status]?.badge || 'default'}>
                  {STATUS_MAP[activeOrder.status]?.label}
                </Badge>
              </div>

              {/* Next Allowed Transitions */}
              <div className="flex flex-wrap gap-2 pt-1">
                {activeOrder.status === 'pending' && (
                  <Button
                    variant="primary"
                    size="sm"
                    loading={updating}
                    onClick={() => handleStatusChange(activeOrder.id, 'confirmed')}
                    icon={CheckCircle}
                    className="bg-emerald-600 hover:bg-emerald-700 font-bold"
                  >
                    Xác nhận đơn (Trừ kho)
                  </Button>
                )}

                {activeOrder.status === 'confirmed' && (
                  <Button
                    variant="primary"
                    size="sm"
                    loading={updating}
                    onClick={() => handleStatusChange(activeOrder.id, 'shipping')}
                    icon={Truck}
                    className="bg-sky-600 hover:bg-sky-700 font-bold"
                  >
                    Bắt đầu giao hàng
                  </Button>
                )}

                {activeOrder.status === 'shipping' && (
                  <Button
                    variant="primary"
                    size="sm"
                    loading={updating}
                    onClick={() => handleStatusChange(activeOrder.id, 'completed')}
                    icon={CheckCircle}
                    className="bg-emerald-600 hover:bg-emerald-700 font-bold"
                  >
                    Đã giao thành công
                  </Button>
                )}

                {!['completed', 'canceled'].includes(activeOrder.status) && (
                  <Button
                    variant="danger"
                    size="sm"
                    loading={updating}
                    onClick={() => handleStatusChange(activeOrder.id, 'canceled')}
                    icon={XCircle}
                  >
                    Hủy đơn {activeOrder.stockDeducted ? '(Hoàn lại kho)' : ''}
                  </Button>
                )}
              </div>

              {/* Print Slip Button */}
              <div className="pt-2 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                  icon={Printer}
                  className="text-xs"
                >
                  In phiếu giao hàng (CSS Print)
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default AdminOrders;
