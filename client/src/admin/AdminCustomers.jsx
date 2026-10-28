import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../lib/utils';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Badge from '../components/common/Badge';
import { useToast } from '../components/common/Toast';
import { Users, Phone, MapPin, ShoppingBag, Eye, RefreshCw, Calendar } from 'lucide-react';

export function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const { showToast } = useToast();

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/customers');
      const data = await res.json();
      if (data.ok && data.data) {
        setCustomers(data.data);
      }
    } catch {
      showToast('Lỗi khi tải danh sách khách hàng', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-pastel-border/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-pastel-text">
            Khách Hàng Thân Thiết
          </h1>
          <p className="text-xs sm:text-sm text-pastel-muted mt-0.5">
            Dữ liệu gom theo Số điện thoại: tổng đơn hàng và tổng chi tiêu
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchCustomers}
          icon={RefreshCw}
          className="text-xs self-start sm:self-auto"
        >
          Làm mới
        </Button>
      </div>

      {/* Customers Display: PC Table & Mobile Cards */}
      <div className="bg-white rounded-3xl border border-pastel-border/80 shadow-soft overflow-hidden">
        {/* Table on PC */}
        <div className="hidden sm:block">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-pastel-cream/80 text-pastel-text font-display font-bold border-b border-pastel-border">
                <th className="py-3 px-4">Tên Khách Hàng</th>
                <th className="py-3 px-4">Số Điện Thoại</th>
                <th className="py-3 px-4">Địa Chỉ Gần Nhất</th>
                <th className="py-3 px-4 text-center">Tổng Đơn</th>
                <th className="py-3 px-4">Tổng Chi Tiêu</th>
                <th className="py-3 px-4 text-right">Lịch Sử</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pastel-border/50">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-pastel-muted">
                    Chưa có khách hàng nào.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.phone} className="hover:bg-pastel-cream/30 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-pastel-text text-sm">
                      {c.name}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium">{c.phone}</td>
                    <td className="py-3.5 px-4 text-pastel-muted max-w-xs truncate">
                      {c.latestAddress}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="bg-pastel-cream px-2.5 py-1 rounded-full border border-pastel-border font-bold">
                        {c.totalOrders} đơn
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-display font-bold text-sm text-brand-pink-deep">
                      {formatCurrency(c.totalSpent)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedCustomer(c)}
                        className="px-3 py-1.5 rounded-xl bg-pastel-cream hover:bg-pastel-pink text-pastel-text font-semibold transition-colors inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Xem đơn ({c.orders?.length || 0})</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="sm:hidden divide-y divide-pastel-border/60">
          {customers.map((c) => (
            <div
              key={c.phone}
              onClick={() => setSelectedCustomer(c)}
              className="p-4 space-y-2 cursor-pointer hover:bg-pastel-cream/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-display font-bold text-sm text-pastel-text">{c.name}</h4>
                <span className="font-mono text-xs font-semibold text-brand-pink-deep">
                  {c.phone}
                </span>
              </div>
              <p className="text-xs text-pastel-muted truncate">{c.latestAddress}</p>
              <div className="flex items-center justify-between pt-1 border-t border-pastel-border/40 text-xs">
                <span className="text-pastel-muted">Tổng: {c.totalOrders} đơn</span>
                <strong className="text-brand-pink-deep font-display font-bold">
                  {formatCurrency(c.totalSpent)}
                </strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Order History Modal */}
      {selectedCustomer && (
        <Modal
          isOpen={Boolean(selectedCustomer)}
          onClose={() => setSelectedCustomer(null)}
          title={`Lịch Sử Mua Hàng Của ${selectedCustomer.name}`}
          maxWidth="max-w-lg"
        >
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-3 bg-pastel-cream/60 rounded-2xl border border-pastel-border space-y-1">
              <p>
                Số điện thoại: <strong className="font-mono">{selectedCustomer.phone}</strong>
              </p>
              <p>
                Địa chỉ gần nhất: <strong>{selectedCustomer.latestAddress}</strong>
              </p>
              <p>
                Tổng đơn: <strong>{selectedCustomer.totalOrders} đơn</strong> • Tổng chi tiêu:{' '}
                <strong className="text-brand-pink-deep font-bold">
                  {formatCurrency(selectedCustomer.totalSpent)}
                </strong>
              </p>
            </div>

            <h4 className="font-display font-bold text-pastel-text text-sm pt-2">
              Danh Sách Đơn Đã Đặt:
            </h4>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {selectedCustomer.orders?.map((o) => (
                <div
                  key={o.id}
                  className="p-3 rounded-2xl bg-white border border-pastel-border flex items-center justify-between"
                >
                  <div>
                    <span className="font-mono font-bold text-brand-pink-deep block">
                      {o.orderCode}
                    </span>
                    <span className="text-[11px] text-pastel-muted block">
                      {new Date(o.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <div className="text-right">
                    <strong className="font-display font-bold block">
                      {formatCurrency(o.totalAmount)}
                    </strong>
                    <Badge variant={o.status === 'canceled' ? 'canceled' : 'confirmed'}>
                      {o.status === 'canceled' ? 'Đã hủy' : 'Đơn thành công'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default AdminCustomers;
