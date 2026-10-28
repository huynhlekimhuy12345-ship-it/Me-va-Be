import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { formatCurrency } from '../lib/utils';
import Button from '../components/common/Button';
import {
  CheckCircle2,
  MessageCircle,
  Copy,
  ShoppingBag,
  CreditCard,
  Truck,
  Heart,
  Sparkles,
} from 'lucide-react';
import { useToast } from '../components/common/Toast';

export function ThankYouPage() {
  const { orderCode } = useParams();
  const location = useLocation();
  const { showToast } = useToast();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  // If no state passed (e.g. page refresh), fetch order from API
  useEffect(() => {
    if (!order && orderCode) {
      let isMounted = true;
      fetch(`/api/orders/${orderCode}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.ok && data.data && isMounted) {
            setOrder(data.data);
          }
        })
        .catch((err) => console.log('Order fetch fallback', err))
        .finally(() => {
          if (isMounted) setLoading(false);
        });
      return () => {
        isMounted = false;
      };
    }
  }, [orderCode, order]);

  const copyToClipboard = (text, label = 'mã') => {
    navigator.clipboard.writeText(text);
    showToast(`Đã sao chép ${label}!`, 'success');
  };

  const isBankTransfer = order?.paymentMethod === 'BANK';

  // Pre-filled Zalo message link with order code
  const zaloMessage = `Chào shop Nga Pijama, mình vừa đặt đơn hàng mã ${orderCode}. Nhờ shop kiểm tra và xác nhận giúp mình nhé!`;
  const zaloUrl = `https://zalo.me/0911400879?text=${encodeURIComponent(zaloMessage)}`;

  return (
    <div className="max-w-[800px] mx-auto px-4 py-8 md:py-14 space-y-8">
      {/* Success Celebration Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-pastel-border/80 shadow-card text-center space-y-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-pastel-mint flex items-center justify-center text-pastel-mint-deep mx-auto shadow-soft animate-bounce-short">
          <CheckCircle2 className="w-9 h-9 sm:w-11 sm:h-11" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-pink-light text-brand-pink-deep text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-brand-pink" />
          <span>Shop đã nhận được đơn của mẹ rồi nè!</span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-pastel-text">
          Cảm Ơn Mẹ Đã Tin Tưởng Shop!
        </h1>

        <p className="text-xs sm:text-sm text-pastel-muted max-w-md mx-auto leading-relaxed">
          Đơn hàng của mẹ đã được chuyển vào hệ thống. Shop sẽ chuẩn bị những bộ đồ xinh xắn nhất cho bé yêu ngay nhé!
        </p>

        {/* Order Code Highlight Box */}
        <div className="inline-flex items-center gap-3 bg-pastel-cream px-5 py-3 rounded-2xl border border-pastel-border/80 text-sm">
          <span className="text-pastel-muted">Mã đơn hàng:</span>
          <span className="font-display font-black text-lg text-brand-pink-deep tracking-wider">
            {orderCode}
          </span>
          <button
            onClick={() => copyToClipboard(orderCode, 'mã đơn')}
            className="p-1 rounded-lg text-pastel-muted hover:text-pastel-text hover:bg-white transition-colors"
            title="Sao chép mã đơn"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>

        {/* Zalo Direct Action CTA */}
        <div className="pt-2">
          <a
            href={zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full sm:w-auto"
          >
            <Button
              variant="mint"
              size="lg"
              icon={MessageCircle}
              className="w-full sm:w-auto shadow-soft font-bold border border-pastel-mint-dark/50"
            >
              Gửi mã đơn qua Zalo (0911 400 879) để xác nhận ngay
            </Button>
          </a>
        </div>
      </div>

      {/* Bank Transfer Instructions Box (If Payment Method is BANK) */}
      {isBankTransfer && (
        <div className="bg-gradient-to-br from-white to-pastel-yellow/30 rounded-3xl p-6 sm:p-8 border-2 border-amber-300 shadow-soft space-y-4">
          <div className="flex items-center gap-2 text-amber-900 font-display font-bold text-base sm:text-lg">
            <CreditCard className="w-5 h-5 text-amber-700" />
            <span>Thông Tin Chuyển Khoản Ngân Hàng</span>
          </div>

          <p className="text-xs text-pastel-muted leading-relaxed">
            Mẹ vui lòng chuyển khoản đúng số tiền và ghi đúng nội dung là <strong>{orderCode}</strong> để shop tự động xác nhận đơn nhé:
          </p>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200/80 space-y-2.5 text-xs sm:text-sm">
            <div className="flex justify-between items-center py-1 border-b border-pastel-border/40">
              <span className="text-pastel-muted">Ngân hàng:</span>
              <strong className="text-pastel-text font-semibold">Vietcombank</strong>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-pastel-border/40">
              <span className="text-pastel-muted">Số tài khoản:</span>
              <div className="flex items-center gap-2">
                <strong className="text-brand-pink-deep font-mono text-base font-bold">
                  0911400879
                </strong>
                <button
                  onClick={() => copyToClipboard('0911400879', 'số tài khoản')}
                  className="p-1 text-pastel-muted hover:text-pastel-text"
                  title="Sao chép số tài khoản"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-pastel-border/40">
              <span className="text-pastel-muted">Chủ tài khoản:</span>
              <strong className="text-pastel-text uppercase">NGUYEN THI NGA</strong>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-pastel-border/40">
              <span className="text-pastel-muted">Số tiền:</span>
              <strong className="text-brand-pink-deep font-display font-bold text-base">
                {formatCurrency(order?.totalAmount || 0)}
              </strong>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-pastel-muted">Nội dung chuyển khoản:</span>
              <div className="flex items-center gap-2">
                <strong className="text-amber-900 font-mono font-bold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-300">
                  {orderCode}
                </strong>
                <button
                  onClick={() => copyToClipboard(orderCode, 'nội dung chuyển khoản')}
                  className="p-1 text-pastel-muted hover:text-pastel-text"
                  title="Sao chép nội dung CK"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Summary Details */}
      {order && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pastel-border/80 shadow-soft space-y-4">
          <h3 className="font-display font-bold text-base sm:text-lg text-pastel-text pb-2 border-b border-pastel-border/40">
            Thông tin người nhận
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            <div>
              <span className="text-pastel-muted block">Người nhận:</span>
              <strong className="text-pastel-text">{order.customerName}</strong>
            </div>
            <div>
              <span className="text-pastel-muted block">Số điện thoại:</span>
              <strong className="text-pastel-text">{order.customerPhone}</strong>
            </div>
            <div className="sm:col-span-2">
              <span className="text-pastel-muted block">Địa chỉ nhận hàng:</span>
              <strong className="text-pastel-text">{order.shippingAddress}</strong>
            </div>
            <div>
              <span className="text-pastel-muted block">Hình thức thanh toán:</span>
              <strong className="text-pastel-text">
                {order.paymentMethod === 'COD'
                  ? 'Thanh toán tiền mặt khi nhận hàng (COD)'
                  : 'Chuyển khoản Vietcombank'}
              </strong>
            </div>
            <div>
              <span className="text-pastel-muted block">Tổng thanh toán:</span>
              <strong className="text-brand-pink-deep font-display font-bold text-base">
                {formatCurrency(order.totalAmount)}
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* Return to home button */}
      <div className="text-center pt-2">
        <Link to="/san-pham">
          <Button variant="secondary" size="lg" icon={ShoppingBag}>
            Tiếp tục xem thêm đồ xinh cho bé
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default ThankYouPage;
