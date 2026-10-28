import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../store/CartContext';
import { formatCurrency } from '../../lib/utils';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { ShoppingBag, Sparkles } from 'lucide-react';

export function ProductCard({ product }) {
  const { addToCart } = useCart();

  if (!product) return null;

  // Find primary image
  const primaryImage =
    product.images?.[0]?.url ||
    product.image ||
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%23FFEFC7"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%235B4A4A" font-family="sans-serif">Pijama Bé</text></svg>';

  // Determine badges
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Calculate total stock from variants if available
  const totalStock = product.variants
    ? product.variants.reduce((acc, v) => acc + (v.stock || 0), 0)
    : product.stock ?? 10;

  const isLowStock = totalStock > 0 && totalStock <= 5;
  const isOutOfStock = totalStock <= 0;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    // Pick first in-stock variant or fallback
    const availableVariant = product.variants?.find((v) => v.stock > 0) ||
      product.variants?.[0] || {
        id: product.id,
        size: '1-2T',
        color: 'Pastel',
        stock: totalStock,
      };

    addToCart(product, availableVariant, 1);
  };

  return (
    <div className="group relative bg-white rounded-card p-2.5 sm:p-3.5 border border-pastel-border/70 shadow-soft hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Image Box */}
        <Link
          to={`/san-pham/${product.slug}`}
          className="relative block w-full aspect-square rounded-2xl overflow-hidden bg-pastel-cream/40 mb-3"
        >
          <img
            src={primaryImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          {/* Badges Container */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 items-start z-10 pointer-events-none">
            {product.isNew && <Badge variant="new">Mới</Badge>}
            {product.isBestSeller && <Badge variant="hot">Bán chạy</Badge>}
            {hasDiscount && <Badge variant="sale">-{discountPercent}%</Badge>}
            {isLowStock && <Badge variant="low-stock">Sắp hết</Badge>}
            {isOutOfStock && <Badge variant="out-of-stock">Hết hàng</Badge>}
          </div>
        </Link>

        {/* Category & Age Tag */}
        <div className="flex items-center gap-1.5 text-[11px] text-pastel-muted mb-1 px-1">
          {product.categoryName && <span>{product.categoryName}</span>}
          {product.ageRange && (
            <>
              <span>•</span>
              <span className="bg-pastel-cream px-1.5 py-0.2 rounded-md border border-pastel-border/50">
                {product.ageRange} tuổi
              </span>
            </>
          )}
        </div>

        {/* Title */}
        <Link
          to={`/san-pham/${product.slug}`}
          className="block px-1 font-display font-semibold text-xs sm:text-sm text-pastel-text line-clamp-2 hover:text-brand-pink-deep transition-colors leading-snug"
          title={product.name}
        >
          {product.name}
        </Link>
      </div>

      {/* Price & Action */}
      <div className="pt-2 px-1 mt-2 border-t border-pastel-border/40">
        <div className="flex items-baseline gap-1.5 mb-2.5 flex-wrap">
          <span className="font-display font-extrabold text-sm sm:text-base text-brand-pink-deep">
            {formatCurrency(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-[11px] sm:text-xs text-pastel-muted line-through">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>

        <Button
          variant={isOutOfStock ? 'outline' : 'secondary'}
          size="sm"
          fullWidth
          disabled={isOutOfStock}
          onClick={handleQuickAdd}
          icon={ShoppingBag}
          className="text-xs sm:text-sm py-2 font-display"
        >
          {isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ'}
        </Button>
      </div>
    </div>
  );
}

export default ProductCard;
