import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../store/CartContext';
import { useToast } from '../common/Toast';
import Drawer from '../common/Drawer';
import Button from '../common/Button';
import ConfirmDialog from '../common/ConfirmDialog';
import EmptyState from '../common/EmptyState';
import { formatCurrency } from '../../lib/utils';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck } from 'lucide-react';

export function CartDrawer() {
  const {
    items,
    setItems,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    totalItems,
    totalAmount,
  } = useCart();

  const navigate = useNavigate();
  const { showToast } = useToast();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [validating, setValidating] = useState(false);

  // Validate cart against server on drawer open
  useEffect(() => {
    if (!isCartOpen || items.length === 0) return;

    let isMounted = true;
    const validate = async () => {
      try {
        setValidating(true);
        const res = await fetch('/api/cart/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items }),
        });

        if (!res.ok) return;
        const data = await res.json();
        if (data.ok && data.data && isMounted) {
          const { updatedItems, hasChanges, message } = data.data;
          if (hasChanges) {
            setItems(updatedItems);
            showToast(message || 'Giỏ hàng đã cập nhật lại giá hoặc số lượng tồn kho mới nhất!', 'info');
          }
        }
      } catch (err) {
        // Silently catch if server is in offline/demo mode
        console.log('Cart validation skipped or server offline', err);
      } finally {
        if (isMounted) setValidating(false);
      }
    };

    validate();
    return () => {
      isMounted = false;
    };
  }, [isCartOpen]);

  const handleCheckout = () => {
    closeCart();
    navigate('/dat-hang');
  };

  return (
    <>
      <Drawer
        isOpen={isCartOpen}
        onClose={closeCart}
        title={`Giỏ hàng của mẹ (${totalItems})`}
        width="max-w-md w-full"
        footer={
          items.length > 0 ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-pastel-muted">Tạm tính:</span>
                <span className="text-lg font-display font-bold text-brand-pink-deep">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
              <p className="text-xs text-pastel-muted flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-pastel-mint-deep shrink-0" />
                Kiểm tra hàng trước khi thanh toán • Đổi trả 7 ngày
              </p>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleCheckout}
                iconRight={ArrowRight}
                className="shadow-pink-glow"
              >
                Tiến hành đặt hàng
              </Button>
            </div>
          ) : null
        }
      >
        {items.length === 0 ? (
          <EmptyState
            type="cart"
            title="Giỏ hàng đang trống trơn nè!"
            description="Mẹ hãy ghé xem các bộ pijama xinh xắn cho bé nhé!"
            actionText="Khám phá sản phẩm ngay"
            onAction={() => {
              closeCart();
              navigate('/san-pham');
            }}
          />
        ) : (
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <div
                key={item.variantId}
                className="flex gap-3 p-3.5 rounded-2xl bg-pastel-cream/50 border border-pastel-border/60 hover:bg-pastel-cream transition-colors"
              >
                {/* Image */}
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-white shrink-0 border border-pastel-border/60">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-semibold text-pastel-text line-clamp-1">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => setDeleteTarget(item)}
                        className="text-pastel-muted hover:text-brand-danger p-1 -mr-1 transition-colors"
                        aria-label="Xóa món này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-pastel-muted mt-1">
                      <span className="bg-white px-2 py-0.5 rounded-full border border-pastel-border/60">
                        Size: {item.size}
                      </span>
                      {item.color && (
                        <span className="bg-white px-2 py-0.5 rounded-full border border-pastel-border/60">
                          {item.color}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-1">
                    <span className="font-display font-bold text-sm text-brand-pink-deep">
                      {formatCurrency(item.price)}
                    </span>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-1 bg-white rounded-full border border-pastel-border px-1.5 py-0.5">
                      <button
                        onClick={() => {
                          if (item.quantity === 1) {
                            setDeleteTarget(item);
                          } else {
                            updateQuantity(item.variantId, item.quantity - 1);
                          }
                        }}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-pastel-text hover:bg-pastel-pink/40"
                        aria-label="Giảm số lượng"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-pastel-text w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-pastel-text hover:bg-pastel-pink/40"
                        aria-label="Tăng số lượng"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Drawer>

      {/* Confirmation Dialog on Delete Item */}
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
        message={`Mẹ có chắc chắn muốn bỏ "${deleteTarget?.name} (${deleteTarget?.size})" ra khỏi giỏ không ạ?`}
        confirmText="Xóa bỏ"
        cancelText="Giữ lại"
      />
    </>
  );
}

export default CartDrawer;
