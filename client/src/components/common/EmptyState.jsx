import React from 'react';
import Button from './Button';
import { cn } from '../../lib/utils';

export function EmptyState({
  type = 'cart', // 'cart' | 'search' | 'orders' | 'products'
  title,
  description,
  actionText,
  onAction,
  className = '',
}) {
  // SVGs designed specifically for cute Korean pastel style
  const renderIllustration = () => {
    switch (type) {
      case 'cart':
        return (
          <svg className="w-32 h-32 mx-auto" viewBox="0 0 140 140" fill="none">
            <circle cx="70" cy="70" r="60" fill="#FFF2E2" />
            <circle cx="70" cy="70" r="50" fill="#FFD6E0" opacity="0.6" />
            {/* Basket */}
            <path
              d="M38 60 L102 60 L92 100 Q90 108 80 108 L60 108 Q50 108 48 100 Z"
              fill="#FFFFFF"
              stroke="#5B4A4A"
              strokeWidth="3"
            />
            {/* Basket Handle */}
            <path
              d="M48 60 C48 35, 92 35, 92 60"
              stroke="#FF8FAB"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            {/* Cute Little Sleepy Star in basket */}
            <path
              d="M70 65 L73 75 L84 75 L75 82 L78 92 L70 86 L62 92 L65 82 L56 75 L67 75 Z"
              fill="#FFEFC7"
              stroke="#5B4A4A"
              strokeWidth="2"
            />
            <circle cx="67" cy="79" r="1.5" fill="#5B4A4A" />
            <circle cx="73" cy="79" r="1.5" fill="#5B4A4A" />
            <path d="M 68 83 Q 70 85 72 83" stroke="#5B4A4A" strokeWidth="1" fill="none" />
          </svg>
        );

      case 'search':
        return (
          <svg className="w-32 h-32 mx-auto" viewBox="0 0 140 140" fill="none">
            <circle cx="70" cy="70" r="60" fill="#FFF8F0" />
            <circle cx="70" cy="70" r="48" fill="#C5F0DC" opacity="0.5" />
            {/* Cute Magnifying glass */}
            <circle cx="62" cy="62" r="28" fill="#FFFFFF" stroke="#5B4A4A" strokeWidth="3.5" />
            <path d="M83 83 L106 106" stroke="#5B4A4A" strokeWidth="6" strokeLinecap="round" />
            <circle cx="106" cy="106" r="4" fill="#FF8FAB" />
            {/* Cute eyes inside glass */}
            <ellipse cx="54" cy="60" rx="3" ry="3.5" fill="#5B4A4A" />
            <ellipse cx="70" cy="60" rx="3" ry="3.5" fill="#5B4A4A" />
            <circle cx="48" cy="68" r="3" fill="#FF8FAB" opacity="0.8" />
            <circle cx="76" cy="68" r="3" fill="#FF8FAB" opacity="0.8" />
            <path d="M 59 66 Q 62 69 65 66" stroke="#5B4A4A" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        );

      case 'orders':
        return (
          <svg className="w-32 h-32 mx-auto" viewBox="0 0 140 140" fill="none">
            <circle cx="70" cy="70" r="60" fill="#FFF2E2" />
            <rect x="42" y="38" width="56" height="74" rx="10" fill="#FFFFFF" stroke="#5B4A4A" strokeWidth="3" />
            <line x1="54" y1="56" x2="86" y2="56" stroke="#FF8FAB" strokeWidth="3" strokeLinecap="round" />
            <line x1="54" y1="68" x2="80" y2="68" stroke="#EADFD5" strokeWidth="3" strokeLinecap="round" />
            <line x1="54" y1="80" x2="74" y2="80" stroke="#EADFD5" strokeWidth="3" strokeLinecap="round" />
            <circle cx="82" cy="94" r="8" fill="#C5F0DC" stroke="#5B4A4A" strokeWidth="2" />
            <path d="M78 94 L81 97 L87 91" stroke="#247952" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );

      default:
        return (
          <svg className="w-32 h-32 mx-auto" viewBox="0 0 140 140" fill="none">
            <circle cx="70" cy="70" r="60" fill="#FFEFC7" opacity="0.6" />
            {/* Cute Sleepy Pajama Bear */}
            <circle cx="70" cy="70" r="32" fill="#FFFFFF" stroke="#5B4A4A" strokeWidth="3" />
            <circle cx="48" cy="46" r="10" fill="#5B4A4A" />
            <circle cx="48" cy="46" r="5" fill="#FF8FAB" />
            <circle cx="92" cy="46" r="10" fill="#5B4A4A" />
            <circle cx="92" cy="46" r="5" fill="#FF8FAB" />
            {/* Sleeping eyes */}
            <path d="M58 68 Q 63 64 68 68" stroke="#5B4A4A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M72 68 Q 77 64 82 68" stroke="#5B4A4A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <ellipse cx="70" cy="76" rx="3" ry="2" fill="#FF8FAB" />
          </svg>
        );
    }
  };

  const defaultTitles = {
    cart: 'Giỏ hàng đang trống trơn nè!',
    search: 'Không tìm thấy sản phẩm nào rồi',
    orders: 'Chưa có đơn hàng nào',
    products: 'Hiện chưa có sản phẩm trong mục này',
  };

  const defaultDescriptions = {
    cart: 'Mẹ hãy ghé xem những bộ pijama siêu đáng yêu cho bé nhé!',
    search: 'Mẹ thử tìm bằng từ khóa khác hoặc bấm chọn theo danh mục xem sao nhé!',
    orders: 'Đơn hàng mới của mẹ sẽ được lưu giữ và cập nhật tại đây.',
    products: 'Shop đang cập nhật thêm mẫu mới, mẹ quay lại sau nhé!',
  };

  return (
    <div className={cn('text-center py-12 px-4 max-w-sm mx-auto flex flex-col items-center', className)}>
      <div className="mb-4 transform transition-transform hover:scale-105 duration-300">
        {renderIllustration()}
      </div>
      <h3 className="text-lg font-display font-bold text-pastel-text mb-1.5">
        {title || defaultTitles[type] || 'Chưa có dữ liệu'}
      </h3>
      <p className="text-sm text-pastel-muted mb-6 leading-relaxed">
        {description || defaultDescriptions[type] || 'Vui lòng quay lại sau.'}
      </p>
      {actionText && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
