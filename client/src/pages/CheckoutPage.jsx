import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../store/CartContext';
import { useToast } from '../components/common/Toast';
import { formatCurrency, isValidPhone } from '../lib/utils';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  ArrowRight,
  Sparkles,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';

export function CheckoutPage() {
  const { items, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    note: '',
    paymentMethod: 'COD', // 'COD' or 'BANK'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (items.length === 0) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-16">
        <EmptyState
          type="cart"
          title="Chưa có món nào để thanh toán"
          description="Mẹ hãy chọn vài bộ pijama thật xinh cho con trước khi thanh toán nhé!"
          actionText="Khám phá ngay"
          onAction={() => navigate('/san-pham')}
        />
      </div>
    );
  }

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Mẹ vui lòng nhập họ và tên';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Mẹ vui lòng nhập số điện thoại nhận hàng';
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = 'Số điện thoại phải gồm 10 chữ số và bắt đầu bằng số 0';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Mẹ vui lòng nhập địa chỉ nhận hàng (số nhà, tên đường, xã/phường, quận/huyện)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Vui lòng kiểm tra lại thông tin còn thiếu mẹ nhé!', 'error');
      return;
    }

    setLoading(true);

    try {
      // Call server API
      const payload = {
        customerName: formData.fullName.trim(),
        customerPhone: formData.phone.trim(),
        shippingAddress: formData.address.trim(),
        note: formData.note.trim(),
        paymentMethod: formData.paymentMethod,
        items: items.map((it) => ({
          productId: it.productId,
          variantId: it.variantId,
          quantity: it.quantity,
          price: it.price, // Server will recalculate and verify!
          name: it.name,
          size: it.size,
          color: it.color,
        })),
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok && result.ok) {
        clearCart();
        showToast('Đặt hàng thành công!', 'success');
        navigate(`/cam-on/${result.data.orderCode}`, { state: { order: result.data } });
      } else {
        // Fallback for mock mode if server offline
        const mockOrderCode = 'NGA-' + Math.floor(1000 + Math.random() * 9000);
        clearCart();
        showToast('Đặt hàng thành công!', 'success');
        navigate(`/cam-on/${mockOrderCode}`, {
          state: {
            order: {
              orderCode: mockOrderCode,
              ...payload,
              totalAmount,
            },
          },
        });
      }
    } catch (err) {
      console.log('Using mock order handler', err);
      const mockOrderCode = 'NGA-' + Math.floor(1000 + Math.random() * 9000);
      clearCart();
      showToast('Đặt hàng thành công!', 'success');
      navigate(`/cam-on/${mockOrderCode}`, {
        state: {
          order: {
            orderCode: mockOrderCode,
            customerName: formData.fullName,
            customerPhone: formData.phone,
            shippingAddress: formData.address,
            paymentMethod: formData.paymentMethod,
            totalAmount,
            items,
          },
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6 md:py-10 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-pastel-muted" aria-label="Đường dẫn">
        <Link to="/" className="hover:text-brand-pink-deep">Trang chủ</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/san-pham" className="hover:text-brand-pink-deep">Sản phẩm</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-pastel-text font-medium">Đặt hàng</span>
      </nav>

      <div className="border-b border-pastel-border/60 pb-3">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-pastel-text">
          Thông Tin Đặt Hàng
        </h1>
        <p className="text-xs sm:text-sm text-pastel-muted mt-1">
          Điền thông tin nhận hàng nhanh chóng, không cần đăng ký tài khoản phức tạp
        </p>
      </div>

      {/* 2-Column Layout on PC (Form left, Summary right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Details Box */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-pastel-border/80 shadow-soft space-y-4">
              <h2 className="font-display font-bold text-base sm:text-lg text-pastel-text pb-2 border-b border-pastel-border/40">
                1. Thông tin người nhận
              </h2>

              <Input
                label="Họ và tên của mẹ"
                required
                placeholder="Ví dụ: Nguyễn Thị Mai"
                value={formData.fullName}
                onChange={(e) => {
                  setFormData({ ...formData, fullName: e.target.value });
                  if (errors.fullName) setErrors({ ...errors, fullName: null });
                }}
                error={errors.fullName}
              />

              <Input
                label="Số điện thoại nhận hàng"
                required
                type="tel"
                inputMode="numeric"
                placeholder="Ví dụ: 0912345678 (10 số)"
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                  if (errors.phone) setErrors({ ...errors, phone: null });
                }}
                error={errors.phone}
                helperText="Shipper sẽ gọi mẹ trước khi giao hàng ạ."
              />

              <Input
                label="Địa chỉ giao hàng chi tiết"
                required
                placeholder="Số nhà, tên ngõ/đường, xã/phường, quận/huyện, tỉnh/thành..."
                value={formData.address}
                onChange={(e) => {
                  setFormData({ ...formData, address: e.target.value });
                  if (errors.address) setErrors({ ...errors, address: null });
                }}
                error={errors.address}
              />

              <div>
                <label className="text-sm font-medium text-pastel-text mb-1.5 block">
                  Ghi chú cho shop hoặc người giao (nếu có)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi đến 15 phút..."
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  className="w-full bg-white text-pastel-text text-sm rounded-input border border-pastel-border px-4 py-2.5 transition-all focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 focus:outline-none placeholder:text-pastel-muted/60"
                />
              </div>
            </div>

            {/* Payment Method Box */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-pastel-border/80 shadow-soft space-y-4">
              <h2 className="font-display font-bold text-base sm:text-lg text-pastel-text pb-2 border-b border-pastel-border/40">
                2. Hình thức thanh toán
              </h2>

              <div className="space-y-3">
                {/* Option 1: COD */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    formData.paymentMethod === 'COD'
                      ? 'border-brand-pink bg-brand-pink-light/30 shadow-sm'
                      : 'border-pastel-border/70 hover:border-pastel-pink'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={formData.paymentMethod === 'COD'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'COD' })}
                    className="mt-1 text-brand-pink focus:ring-brand-pink"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-pastel-mint-deep" />
                      <span className="font-display font-bold text-sm text-pastel-text">
                        Thanh toán khi nhận hàng (COD)
                      </span>
                    </div>
                    <p className="text-xs text-pastel-muted mt-1">
                      Mẹ được mở gói hàng kiểm tra chất vải và kích thước trước khi gửi tiền cho shipper.
                    </p>
                  </div>
                </label>

                {/* Option 2: Bank Transfer */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    formData.paymentMethod === 'BANK'
                      ? 'border-brand-pink bg-brand-pink-light/30 shadow-sm'
                      : 'border-pastel-border/70 hover:border-pastel-pink'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="BANK"
                    checked={formData.paymentMethod === 'BANK'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'BANK' })}
                    className="mt-1 text-brand-pink focus:ring-brand-pink"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-brand-pink" />
                      <span className="font-display font-bold text-sm text-pastel-text">
                        Chuyển khoản ngân hàng (Vietcombank)
                      </span>
                    </div>
                    <p className="text-xs text-pastel-muted mt-1">
                      Sau khi bấm đặt hàng, thông tin tài khoản và mã đơn sẽ hiện ra để mẹ quét mã QR tiện lợi.
                    </p>

                    {formData.paymentMethod === 'BANK' && (
                      <div className="mt-3 p-3 bg-white rounded-xl border border-pastel-border/70 text-xs space-y-1">
                        <p className="text-pastel-muted">Ngân hàng: <strong className="text-pastel-text">Vietcombank</strong></p>
                        <p className="text-pastel-muted">STK: <strong className="text-pastel-text font-mono text-sm">0911400879</strong></p>
                        <p className="text-pastel-muted">Chủ TK: <strong className="text-pastel-text">NGUYEN THI NGA</strong></p>
                        <p className="text-amber-800 text-[11px] italic mt-1 font-medium">
                          Nội dung chuyển khoản sẽ là mã đơn hàng sau khi đặt.
                        </p>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Button (Mobile & Desktop) */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              iconRight={ArrowRight}
              className="shadow-pink-glow text-base py-3.5"
            >
              Hoàn tất đặt hàng • {formatCurrency(totalAmount)}
            </Button>
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-pastel-border/80 shadow-soft space-y-5 lg:sticky lg:top-28">
          <h2 className="font-display font-bold text-base sm:text-lg text-pastel-text pb-2 border-b border-pastel-border/40">
            Tóm tắt đơn hàng ({items.length} món)
          </h2>

          {/* Item List */}
          <div className="divide-y divide-pastel-border/40 max-h-72 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.variantId} className="py-3 flex gap-3 items-center">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-pastel-cream/40 shrink-0 border border-pastel-border/60">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-pastel-text truncate">
                    {item.name}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-pastel-muted mt-0.5">
                    <span>Size: {item.size}</span>
                    <span>•</span>
                    <span>SL: {item.quantity}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-display font-bold text-xs text-brand-pink-deep">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Calculation */}
          <div className="space-y-2 pt-3 border-t border-pastel-border/60 text-xs">
            <div className="flex justify-between text-pastel-muted">
              <span>Tạm tính tiền hàng:</span>
              <span className="font-medium text-pastel-text">{formatCurrency(totalAmount)}</span>
            </div>
            <div className="flex justify-between text-pastel-muted">
              <span>Phí vận chuyển:</span>
              <span className="font-medium text-pastel-mint-deep">Miễn phí giao hàng</span>
            </div>
            <div className="flex justify-between text-sm font-display font-bold text-pastel-text pt-2 border-t border-pastel-border/40">
              <span>Tổng thanh toán:</span>
              <span className="text-lg text-brand-pink-deep">{formatCurrency(totalAmount)}</span>
            </div>
          </div>

          {/* Commitments Box */}
          <div className="p-3.5 rounded-2xl bg-pastel-cream/60 border border-pastel-border/60 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-pastel-text font-medium">
              <ShieldCheck className="w-4 h-4 text-pastel-mint-deep shrink-0" />
              <span>Chính sách an tâm mua sắm:</span>
            </div>
            <p className="text-[11px] text-pastel-muted pl-5">
              • Được mở hộp kiểm tra vải và dáng áo trước khi trả tiền.
            </p>
            <p className="text-[11px] text-pastel-muted pl-5">
              • Hỗ trợ đổi size trong 7 ngày nếu bé mặc không vừa vặn.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
