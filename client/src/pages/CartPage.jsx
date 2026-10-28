import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../store/CartContext';
import { formatCurrency } from '../lib/utils';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';

export function CartPage() {
  const { items, updateQuantity, removeFromCart, totalItems, totalAmount } = useCart();
  const navigate = useNavigate();
  const [deleteTarget, setDeleteTarget] = useState(null);

  if (items.length === 0) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-16">
        <EmptyState
          type="cart"
          title="Giỏ hàng đang trống trơn nè!"
          description="Mẹ hãy ghé xem những bộ pijama siêu đáng yêu cho bé nhé!"
          actionText="Khám phá ngay"
          onAction={() => navigate('/san-pham')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6 md:py-10 space-y-8">
      <div className="border-b border-pastel-border/60 pb-3">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-pastel-text">
          Giỏ Hàng Của Mẹ ({totalItems} sản phẩm)
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Item List */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-5 sm:p-7 border border-pastel-border/80 shadow-soft divide-y divide-pastel-border/60">
          {items.map((item) => (
            <div key={item.variantId} className="py-4 first:pt-0 last:pb-0 flex gap-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-pastel-cream/50 shrink-0 border border-pastel-border/60">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      to={`/san-pham/${item.slug}`}
                      className="font-display font-bold text-sm sm:text-base text-pastel-text hover:text-brand-pink-deep transition-colors line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <button
                      onClick={() => setDeleteTarget(item)}
                      className="text-pastel-muted hover:text-brand-danger p-1 transition-colors"
                      aria-label="Xóa món này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-pastel-muted mt-1">
                    <span className="bg-pastel-cream px-2 py-0.5 rounded-full border border-pastel-border">
                      Size: {item.size}
                    </span>
                    {item.color && (
                      <span className="bg-pastel-cream px-2 py-0.5 rounded-full border border-pastel-border">
                        {item.color}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2">
                  <span className="font-display font-bold text-base text-brand-pink-deep">
                    {formatCurrency(item.price)}
                  </span>

                  <div className="flex items-center gap-2 bg-pastel-cream rounded-full border border-pastel-border px-2 py-1">
                    <button
                      onClick={() => {
                        if (item.quantity === 1) setDeleteTarget(item);
                        else updateQuantity(item.variantId, item.quantity - 1);
                      }}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-pastel-text hover:bg-white"
                      aria-label="Giảm"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-pastel-text">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-pastel-text hover:bg-white"
                      aria-label="Tăng"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-pastel-border/80 shadow-soft space-y-5 lg:sticky lg:top-28">
          <h2 className="font-display font-bold text-lg text-pastel-text pb-2 border-b border-pastel-border/40">
            Tóm Tắt Đơn Hàng
          </h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-pastel-muted">
              <span>Tạm tính tiền hàng:</span>
              <strong className="text-pastel-text font-semibold">{formatCurrency(totalAmount)}</strong>
            </div>
            <div className="flex justify-between text-pastel-muted">
              <span>Phí vận chuyển:</span>
              <span className="font-semibold text-pastel-mint-deep">Miễn phí toàn quốc</span>
            </div>
            <div className="flex justify-between text-base font-display font-bold text-pastel-text pt-3 border-t border-pastel-border/60">
              <span>Tổng thanh toán:</span>
              <span className="text-xl text-brand-pink-deep">{formatCurrency(totalAmount)}</span>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => navigate('/dat-hang')}
            iconRight={ArrowRight}
            className="shadow-pink-glow text-base py-3.5"
          >
            Tiến hành đặt hàng
          </Button>

          <div className="p-3 bg-pastel-cream/60 rounded-2xl border border-pastel-border/60 text-xs text-pastel-muted space-y-1">
            <div className="flex items-center gap-1.5 text-pastel-text font-medium">
              <ShieldCheck className="w-4 h-4 text-pastel-mint-deep shrink-0" />
              <span>Bảo vệ quyền lợi của mẹ:</span>
            </div>
            <p>• Nhận hàng xem thử chất vải rồi mới trả tiền.</p>
            <p>• Không vừa đổi size tận nhà trong 7 ngày.</p>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            removeFromCart(deleteTarget.variantId);
            setDeleteTarget(null);
          }
        }}
        title="Xóa khỏi giỏ hàng?"
        message={`Mẹ có chắc chắn muốn bỏ "${deleteTarget?.name} (${deleteTarget?.size})" không ạ?`}
        confirmText="Xóa bỏ"
        cancelText="Giữ lại"
      />
    </div>
  );
}

export default CartPage;
