import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../store/CartContext';
import { useToast } from '../components/common/Toast';
import { MOCK_PRODUCTS } from '../lib/mockData';
import { getProducts, getProductBySlug } from '../lib/demoStore';
import { formatCurrency } from '../lib/utils';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import ProductCard from '../components/product/ProductCard';
import EmptyState from '../components/common/EmptyState';
import {
  ShoppingBag,
  Zap,
  MessageCircle,
  ShieldCheck,
  RefreshCw,
  Truck,
  Plus,
  Minus,
  Check,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [product, setProduct] = useState(() => {
    return getProductBySlug(slug) || MOCK_PRODUCTS.find((p) => p.slug === slug) || null;
  });
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // Fetch latest product details from backend
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetch(`/api/products/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && data.data && isMounted) {
          setProduct(data.data);
          const firstAvailable = data.data.variants?.find((v) => v.stock > 0);
          setSelectedVariantId(firstAvailable ? firstAvailable.id : data.data.variants?.[0]?.id);
          // Set page title for SEO
          document.title = `${data.data.name} | Nga Pijama Mẹ & Bé`;
        }
      })
      .catch((err) => {
        console.log('Using local fallback product', err);
        const fallback = MOCK_PRODUCTS.find((p) => p.slug === slug);
        if (fallback && isMounted) {
          setProduct(fallback);
          const firstAvailable = fallback.variants?.find((v) => v.stock > 0);
          setSelectedVariantId(firstAvailable ? firstAvailable.id : fallback.variants?.[0]?.id);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (!product) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-16">
        <EmptyState
          type="products"
          title="Không tìm thấy sản phẩm"
          description="Sản phẩm mẹ đang tìm có thể đã hết hoặc đã đổi tên."
          actionText="Quay lại danh mục sản phẩm"
          onAction={() => navigate('/san-pham')}
        />
      </div>
    );
  }

  const selectedVariant = product.variants?.find((v) => v.id === selectedVariantId);
  const isOutOfStock = selectedVariant ? selectedVariant.stock <= 0 : false;
  const isLowStock = selectedVariant ? selectedVariant.stock > 0 && selectedVariant.stock <= 5 : false;

  const images = product.images && product.images.length > 0
    ? product.images
    : [{ id: 1, url: product.image }];

  const currentImageUrl = images[selectedImageIndex]?.url || images[0]?.url;

  // Unique colors and sizes
  const uniqueSizes = [...new Set(product.variants?.map((v) => v.size) || [])];
  const uniqueColors = [...new Set(product.variants?.map((v) => v.color).filter(Boolean) || [])];

  // Related products (same category) — read from the shared demo store so
  // products added/edited in /admin show up here too.
  const relatedProducts = getProducts().filter(
    (p) => p.categoryId === product.categoryId && p.id !== product.id
  ).slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addToCart(product, selectedVariant, quantity);
  };

  const handleBuyNow = () => {
    if (!selectedVariant) return;
    const success = addToCart(product, selectedVariant, quantity);
    if (success) {
      navigate('/dat-hang');
    }
  };

  // Pre-filled Zalo message link
  const zaloUrl = `https://zalo.me/0911400879?text=${encodeURIComponent(
    `Chào shop, mình muốn tư vấn chọn size cho bé mẫu "${product.name}" (${selectedVariant?.size || ''})`
  )}`;

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6 md:py-10 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-pastel-muted" aria-label="Đường dẫn">
        <Link to="/" className="hover:text-brand-pink-deep">Trang chủ</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/san-pham?cat=${product.categorySlug}`} className="hover:text-brand-pink-deep">
          {product.categoryName}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-pastel-text font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Section: 2 Columns on PC */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Gallery (PC: thumbnails left + big image right; Mobile: swipeable/stacked) */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          {/* Thumbnails (Vertical on PC) */}
          <div className="flex md:flex-col gap-3 overflow-x-auto no-scrollbar py-1 shrink-0">
            {images.map((img, idx) => (
              <button
                key={img.id || idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 bg-white ${
                  selectedImageIndex === idx
                    ? 'border-brand-pink shadow-md scale-105'
                    : 'border-pastel-border/70 hover:border-brand-pink/50 opacity-80'
                }`}
                aria-label={`Xem ảnh ${idx + 1}`}
              >
                <img
                  src={img.url}
                  alt={`${product.name} thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Main Large Image */}
          <div className="relative flex-1 aspect-square rounded-3xl overflow-hidden bg-white border border-pastel-border/80 shadow-soft">
            <img
              src={currentImageUrl}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
              {product.isNew && <Badge variant="new">Mới về</Badge>}
              {product.isBestSeller && <Badge variant="hot">Bán chạy nhất</Badge>}
              {product.originalPrice > product.price && (
                <Badge variant="sale">
                  Tiết kiệm {formatCurrency(product.originalPrice - product.price)}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Purchase Details Box on PC */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-pastel-border/80 shadow-soft space-y-6 lg:sticky lg:top-28">
          <div>
            <div className="flex items-center gap-2 text-xs text-pastel-muted mb-1.5">
              <span className="bg-pastel-cream px-2.5 py-0.5 rounded-full border border-pastel-border font-medium">
                {product.categoryName}
              </span>
              <span>•</span>
              <span>Dành cho bé {product.ageRange} tuổi</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-display font-bold text-pastel-text leading-snug">
              {product.name}
            </h1>

            {/* Price Box */}
            <div className="flex items-baseline gap-3 mt-3 pt-3 border-t border-pastel-border/40">
              <span className="text-2xl sm:text-3xl font-display font-black text-brand-pink-deep">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-pastel-muted line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Size Pills */}
          <div>
            <div className="flex items-center justify-between text-xs mb-2.5">
              <span className="font-semibold text-pastel-text">Chọn kích thước (Size):</span>
              <a
                href={zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-pink font-semibold hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Bảng chuẩn size</span>
              </a>
            </div>

            <div className="flex flex-wrap gap-2">
              {product.variants?.map((v) => {
                const isSelected = v.id === selectedVariantId;
                const isVariantOut = v.stock <= 0;

                return (
                  <button
                    key={v.id}
                    onClick={() => {
                      if (!isVariantOut) setSelectedVariantId(v.id);
                    }}
                    disabled={isVariantOut}
                    className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-semibold border transition-all min-h-[44px] flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-brand-pink text-white border-brand-pink shadow-soft scale-105'
                        : isVariantOut
                        ? 'bg-gray-100 text-gray-400 border-gray-200 line-through opacity-50 cursor-not-allowed'
                        : 'bg-white text-pastel-text border-pastel-border hover:border-brand-pink hover:bg-pastel-cream'
                    }`}
                  >
                    <span>{v.size}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stock Notification */}
          <div className="text-xs">
            {isOutOfStock ? (
              <span className="text-brand-danger font-bold flex items-center gap-1">
                ✕ Size này tạm hết hàng, mẹ nhắn Zalo shop giữ hàng đợt mới nhé!
              </span>
            ) : isLowStock ? (
              <span className="text-amber-800 font-bold bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 inline-block">
                ⚡ Sắp hết hàng: Chỉ còn {selectedVariant.stock} bộ cuối cùng!
              </span>
            ) : (
              <span className="text-emerald-700 font-medium">
                ✓ Còn hàng trong kho (sẵn sàng giao ngay)
              </span>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 pt-2 border-t border-pastel-border/40">
            <span className="text-xs font-semibold text-pastel-text">Số lượng:</span>
            <div className="flex items-center gap-2 bg-pastel-cream rounded-full border border-pastel-border px-2 py-1">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1 || isOutOfStock}
                className="w-7 h-7 rounded-full flex items-center justify-center text-pastel-text hover:bg-white disabled:opacity-40"
                aria-label="Giảm số lượng"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center text-sm font-bold text-pastel-text">
                {quantity}
              </span>
              <button
                onClick={() => {
                  if (selectedVariant && quantity < selectedVariant.stock) {
                    setQuantity((q) => q + 1);
                  } else {
                    showToast(`Kho chỉ còn ${selectedVariant?.stock} bộ!`, 'error');
                  }
                }}
                disabled={isOutOfStock || (selectedVariant && quantity >= selectedVariant.stock)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-pastel-text hover:bg-white disabled:opacity-40"
                aria-label="Tăng số lượng"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Action Buttons (Desktop) */}
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="secondary"
                size="lg"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                icon={ShoppingBag}
              >
                Thêm vào giỏ
              </Button>
              <Button
                variant="primary"
                size="lg"
                disabled={isOutOfStock}
                onClick={handleBuyNow}
                icon={Zap}
                className="shadow-pink-glow"
              >
                Mua ngay
              </Button>
            </div>

            {/* Hỏi size qua Zalo */}
            <a
              href={zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button
                variant="mint"
                size="md"
                fullWidth
                icon={MessageCircle}
                className="border border-pastel-mint-dark/40 font-semibold"
              >
                Hỏi size cho bé qua Zalo (0911 400 879)
              </Button>
            </a>
          </div>

          {/* Commitments mini */}
          <div className="pt-4 border-t border-pastel-border/60 grid grid-cols-3 gap-2 text-center text-[11px] text-pastel-muted">
            <div className="flex flex-col items-center">
              <ShieldCheck className="w-4 h-4 text-pastel-mint-deep mb-1" />
              <span>100% Cotton</span>
            </div>
            <div className="flex flex-col items-center">
              <RefreshCw className="w-4 h-4 text-brand-pink mb-1" />
              <span>Đổi size 7 ngày</span>
            </div>
            <div className="flex flex-col items-center">
              <Truck className="w-4 h-4 text-amber-700 mb-1" />
              <span>Đồng kiểm khi nhận</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Detailed Features */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pastel-border/80 shadow-soft space-y-4">
        <h3 className="font-display font-bold text-lg sm:text-xl text-pastel-text pb-3 border-b border-pastel-border/60">
          Mô Tả Sản Phẩm
        </h3>
        <div className="text-sm text-pastel-text leading-relaxed space-y-3">
          <p>{product.description}</p>
          <ul className="list-disc list-inside space-y-1 text-pastel-muted">
            <li>Xuất xứ: Hàng thiết kế cao cấp phong cách Hàn Quốc.</li>
            <li>Chất liệu: 100% Cotton tự nhiên, mềm xốp, thông thoáng, thấm hút mồ hôi.</li>
            <li>Đặc tính: Không xù lông, không co rút sau nhiều lần giặt, an toàn cho da nhạy cảm.</li>
            <li>Đường may: Cuộn mép tỉ mỉ, cúc bọc vải không làm xước da con.</li>
          </ul>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-4">
          <div className="flex items-center justify-between pb-2 border-b border-pastel-border/60">
            <h3 className="text-xl sm:text-2xl font-display font-bold text-pastel-text">
              Sản Phẩm Cùng Loại Mẹ Sẽ Thích
            </h3>
            <Link
              to={`/san-pham?cat=${product.categorySlug}`}
              className="text-xs sm:text-sm font-semibold text-brand-pink-deep hover:underline"
            >
              Xem thêm
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ═══ MOBILE STICKY BOTTOM BUY BAR (<768px) ═══ */}
      <div className="md:hidden fixed bottom-16 inset-x-0 bg-white/95 backdrop-blur-md border-t border-pastel-border/80 p-3 z-30 shadow-bottom-nav flex items-center gap-2">
        <a
          href={zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-full bg-pastel-mint text-pastel-mint-deep min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0 border border-pastel-mint-dark/40"
          aria-label="Tư vấn Zalo"
        >
          <MessageCircle className="w-5 h-5" />
        </a>

        <Button
          variant="secondary"
          size="md"
          disabled={isOutOfStock}
          onClick={handleAddToCart}
          icon={ShoppingBag}
          className="flex-1 text-xs py-2"
        >
          Thêm giỏ
        </Button>

        <Button
          variant="primary"
          size="md"
          disabled={isOutOfStock}
          onClick={handleBuyNow}
          icon={Zap}
          className="flex-1 text-xs py-2 shadow-pink-glow"
        >
          Mua ngay
        </Button>
      </div>
    </div>
  );
}

export default ProductDetailPage;
