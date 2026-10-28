import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import Button from '../components/common/Button';
// Three.js hero tải lười (lazy) để bundle chính nhẹ cho mobile —
// chunk 3D chỉ tải khi tới khu vực hero.
const BabyClothesHero = lazy(() =>
  import('../components/hero/BabyClothesHero').then((m) => ({ default: m.BabyClothesHero }))
);
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from '../lib/mockData';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Truck,
  MessageCircle,
  Star,
  Heart,
  ChevronRight,
} from 'lucide-react';

export function HomePage() {
  const [categories, setCategories] = useState(MOCK_CATEGORIES);
  const [products, setProducts] = useState(MOCK_PRODUCTS);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && data.data && data.data.length > 0 && isMounted) {
          setCategories(data.data);
        }
      })
      .catch(() => {});

    fetch('/api/products?limit=20')
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && data.data && data.data.products && isMounted) {
          setProducts(data.data.products);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const newProducts = products.filter((p) => p.isNew).slice(0, 4);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);

  return (
    <div className="space-y-12 md:space-y-16 pb-12">
      {/* ═══ HERO SECTION ═══ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-pink-light/40 via-pastel-cream to-pastel-cream/30 py-10 md:py-16 border-b border-pastel-border/50">
        {/* Decorative Floating SVGs (Clouds & Stars) */}
        <div className="absolute top-6 left-6 text-pastel-pink/70 pointer-events-none animate-float-slow hidden sm:block">
          <svg width="48" height="32" viewBox="0 0 48 32" fill="currentColor">
            <path d="M12 24 A 10 10 0 0 1 24 16 A 14 14 0 0 1 40 20 A 8 8 0 0 1 40 28 L 10 28 A 6 6 0 0 1 12 24 Z" />
          </svg>
        </div>
        <div className="absolute top-12 right-12 text-pastel-yellow pointer-events-none animate-bounce-short hidden md:block">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>

        <div className="max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column (Text & CTAs) */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-brand-pink/30 shadow-soft text-xs md:text-sm font-semibold text-brand-pink-deep">
                <Sparkles className="w-4 h-4 text-brand-pink animate-spin" />
                <span>BST Pijama Thô Cotton Hàn Quốc 2026</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-display font-black text-pastel-text leading-[1.18] tracking-tight">
                Đồ xinh cho <span className="text-brand-pink-deep underline decoration-pastel-pink decoration-wavy decoration-4">bé yêu</span>, giấc ngủ thêm trọn vẹn
              </h1>

              <p className="text-sm md:text-base text-pastel-muted max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Nga Pijama chuyên cung cấp đồ bộ, pijama thô boi cotton 100% tự nhiên êm ái cho bé từ 0 đến 10 tuổi và set pijama đôi cho Mẹ & Bé. Đẹp dáng, mát da, bền đẹp sau từng lần giặt.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link to="/san-pham" className="w-full sm:w-auto">
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    iconRight={ArrowRight}
                    className="shadow-pink-glow text-base px-8 py-3.5"
                  >
                    Khám phá đồ xinh ngay
                  </Button>
                </Link>

                <a
                  href="https://zalo.me/0911400879"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button
                    variant="secondary"
                    size="lg"
                    fullWidth
                    icon={MessageCircle}
                    className="text-base px-6 py-3.5"
                  >
                    Tư vấn size qua Zalo
                  </Button>
                </a>
              </div>

              {/* Trust badges */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-4 text-xs text-pastel-muted flex-wrap">
                <span className="flex items-center gap-1.5 bg-white/80 px-3 py-1 rounded-full border border-pastel-border/60">
                  <span className="text-brand-pink font-bold">✓</span> 100% Cotton an toàn
                </span>
                <span className="flex items-center gap-1.5 bg-white/80 px-3 py-1 rounded-full border border-pastel-border/60">
                  <span className="text-brand-pink font-bold">✓</span> Đổi size tận nhà 7 ngày
                </span>
                <span className="flex items-center gap-1.5 bg-white/80 px-3 py-1 rounded-full border border-pastel-border/60">
                  <span className="text-brand-pink font-bold">✓</span> Đồng kiểm khi nhận
                </span>
              </div>
            </div>

            {/* Right Column: Handcrafted Cute SVG Pajama Bear Art */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-72 h-72 sm:w-88 sm:h-88 md:w-96 md:h-96">
                {/* Background Glow Circles */}
                <div className="absolute inset-0 bg-pastel-pink/50 rounded-full blur-2xl transform scale-95" />
                <div className="absolute inset-4 bg-pastel-yellow/40 rounded-full blur-xl" />

                {/* SVG Illustration Container */}
                <div className="relative w-full h-full bg-white rounded-3xl p-6 shadow-card border-4 border-pastel-pink/60 flex flex-col items-center justify-center transform hover:rotate-1 transition-transform duration-500">
                  {/* Floating Badges */}
                  <div className="absolute -top-3 -right-3 bg-pastel-yellow border-2 border-amber-300 text-amber-900 font-display font-bold text-xs px-3 py-1 rounded-full shadow-sm">
                    ⭐ Hàng loại 1
                  </div>
                  <div className="absolute -bottom-3 -left-3 bg-pastel-mint border-2 border-emerald-300 text-pastel-mint-deep font-display font-bold text-xs px-3 py-1 rounded-full shadow-sm">
                    🌿 Vải thô Hàn Quốc
                  </div>

                  <Suspense fallback={null}>
                    <BabyClothesHero />
                  </Suspense>

                  <div className="text-center mt-2">
                    <p className="font-display font-bold text-sm text-pastel-text">
                      Nga Pijama • Ngủ ngon bé yêu
                    </p>
                    <p className="text-[11px] text-pastel-muted">Mềm mát dịu dàng từng giấc mơ</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CIRCULAR CATEGORIES (DANH MỤC NỔI BẬT) ═══ */}
      <section className="max-w-[1200px] mx-auto px-4">
        <div className="text-center max-w-md mx-auto mb-8">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-pastel-text">
            Danh Mục Nổi Bật
          </h2>
          <p className="text-xs md:text-sm text-pastel-muted mt-1">
            Chọn đúng kiểu đồ bộ xinh xắn cho độ tuổi và sở thích của con
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat, idx) => {
            const bgGradients = [
              'bg-gradient-to-b from-[#FFE4EB] to-[#FFD6E0]',
              'bg-gradient-to-b from-[#E2F7ED] to-[#C5F0DC]',
              'bg-gradient-to-b from-[#FFF5DA] to-[#FFEFC7]',
              'bg-gradient-to-b from-[#F5E6FF] to-[#EBD4FC]',
            ];

            return (
              <Link
                key={cat.id}
                to={`/san-pham?cat=${cat.slug}`}
                className="group flex flex-col items-center p-5 rounded-3xl bg-white border border-pastel-border/70 shadow-soft hover:shadow-card-hover hover:-translate-y-2 transition-all duration-300 text-center"
              >
                {/* Circular Icon Container */}
                <div
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full ${bgGradients[idx % 4]} flex items-center justify-center text-3xl sm:text-4xl shadow-inner mb-3.5 group-hover:scale-110 transition-transform duration-300`}
                >
                  <span className="select-none">{cat.icon}</span>
                </div>
                <h3 className="font-display font-bold text-sm sm:text-base text-pastel-text group-hover:text-brand-pink-deep transition-colors">
                  {cat.name}
                </h3>
                <span className="text-xs text-pastel-muted mt-0.5">
                  {cat.count} mẫu đồ xinh
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-pink mt-2 group-hover:translate-x-1 transition-transform">
                  Xem ngay <ChevronRight className="w-3 h-3" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ═══ SẢN PHẨM MỚI VỀ (NEW ARRIVALS) ═══ */}
      <section className="max-w-[1200px] mx-auto px-4">
        <div className="flex items-end justify-between mb-6 pb-2 border-b border-pastel-border/60">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-pink uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Vừa Cập Bến Hôm Nay</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-pastel-text">
              Sản Phẩm Mới Về
            </h2>
          </div>
          <Link
            to="/san-pham?sort=newest"
            className="text-xs sm:text-sm font-display font-semibold text-brand-pink-deep hover:underline flex items-center gap-1"
          >
            <span>Xem tất cả</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Product Grid: 2 cols on mobile, 3 on tablet, 4 on PC */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {newProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ═══ PROMO MID BANNER ═══ */}
      <section className="max-w-[1200px] mx-auto px-4">
        <div className="rounded-3xl bg-gradient-to-r from-pastel-pink/60 via-pastel-yellow/50 to-pastel-mint/60 p-6 md:p-10 border border-pastel-border/70 shadow-soft flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="bg-white/90 text-brand-pink-deep font-display font-bold text-xs px-3 py-1 rounded-full shadow-sm">
              Ưu đãi đặc biệt trong tuần
            </span>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-black text-pastel-text">
              Mua 2 bộ pijama bất kỳ - Giảm ngay 10%
            </h3>
            <p className="text-xs sm:text-sm text-pastel-text/80 max-w-lg">
              Áp dụng cho tất cả đồ bộ bé trai, bé gái và sơ sinh. Số lượng có hạn theo size của bé!
            </p>
          </div>
          <Link to="/san-pham" className="shrink-0">
            <Button variant="primary" size="lg" className="shadow-pink-glow">
              Săn ưu đãi ngay
            </Button>
          </Link>
        </div>
      </section>

      {/* ═══ BÁN CHẠY NHẤT (BEST SELLERS) ═══ */}
      <section className="max-w-[1200px] mx-auto px-4">
        <div className="flex items-end justify-between mb-6 pb-2 border-b border-pastel-border/60">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>Được Các Mẹ Mua Nhiều Nhất</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-pastel-text">
              Bán Chạy Nhất Tuần
            </h2>
          </div>
          <Link
            to="/san-pham?sort=bestseller"
            className="text-xs sm:text-sm font-display font-semibold text-brand-pink-deep hover:underline flex items-center gap-1"
          >
            <span>Xem tất cả</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ═══ KHỐI CAM KẾT VÀ TẠI SAO CHỌN NGA PIJAMA ═══ */}
      <section className="max-w-[1200px] mx-auto px-4">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-pastel-border/80 shadow-soft">
          <div className="text-center max-w-lg mx-auto mb-8">
            <span className="text-xs font-bold text-brand-pink uppercase tracking-widest">
              An Tâm Mua Sắm Cho Bé
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-pastel-text mt-1">
              Tại Sao Mẹ Chọn Nga Pijama?
            </h2>
            <p className="text-xs sm:text-sm text-pastel-muted mt-2">
              Chúng mình chăm chút từng đường kim mũi chỉ và chọn lọc chất vải tốt nhất để bé có những giấc ngủ ngon.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-pastel-cream/50 border border-pastel-border/60 hover:bg-pastel-cream transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-pastel-mint flex items-center justify-center text-pastel-mint-deep mb-3.5 shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-base text-pastel-text mb-1">
                Cotton Hàn 100%
              </h4>
              <p className="text-xs text-pastel-muted leading-relaxed">
                Vải thô boi, sợi bông thiên nhiên thoáng khí, không kích ứng da nhạy cảm của bé sơ sinh.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-pastel-cream/50 border border-pastel-border/60 hover:bg-pastel-cream transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-brand-pink-light flex items-center justify-center text-brand-pink mb-3.5 shadow-sm">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-base text-pastel-text mb-1">
                Đổi Size 7 Ngày
              </h4>
              <p className="text-xs text-pastel-muted leading-relaxed">
                Nếu bé mặc bị chật hoặc rộng, shop hỗ trợ đổi size tận nhà nhanh gọn trong vòng 7 ngày.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-pastel-cream/50 border border-pastel-border/60 hover:bg-pastel-cream transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-pastel-yellow flex items-center justify-center text-amber-800 mb-3.5 shadow-sm">
                <Truck className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-base text-pastel-text mb-1">
                Kiểm Tra Khi Nhận
              </h4>
              <p className="text-xs text-pastel-muted leading-relaxed">
                Được mở hàng kiểm tra vải và đường may chuẩn mới thanh toán COD cho bạn giao hàng.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-pastel-cream/50 border border-pastel-border/60 hover:bg-pastel-cream transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-700 mb-3.5 shadow-sm">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-base text-pastel-text mb-1">
                Tư Vấn Zalo 24/7
              </h4>
              <p className="text-xs text-pastel-muted leading-relaxed">
                Hotline/Zalo 0911400879 luôn sẵn sàng tư vấn chọn đúng kích thước theo chiều cao, cân nặng của bé.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ MOMS FEEDBACK (ĐÁNH GIÁ TỪ CÁC MẸ) ═══ */}
      <section className="max-w-[1200px] mx-auto px-4">
        <div className="text-center max-w-md mx-auto mb-8">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-pastel-text">
            Yêu Thương Từ Các Mẹ
          </h2>
          <p className="text-xs md:text-sm text-pastel-muted mt-1">
            Niềm vui của shop là thấy các bé ngủ ngon và mặc đồ xinh xắn mỗi ngày
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-3xl border border-pastel-border/70 shadow-soft">
            <div className="flex items-center gap-1 text-amber-400 mb-2.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-pastel-text leading-relaxed italic mb-4">
              "Chất vải thô cotton nhà Nga đỉnh thực sự, bé nhà mình hay bị đổ mồ hôi trộm trộm mà mặc pijama này mát rượi, ngủ một mạch tới sáng luôn!"
            </p>
            <div className="flex items-center gap-3 pt-3 border-t border-pastel-border/40">
              <div className="w-9 h-9 rounded-full bg-pastel-pink flex items-center justify-center font-bold text-xs text-brand-pink-deep">
                MH
              </div>
              <div>
                <h5 className="font-display font-bold text-xs text-pastel-text">Mẹ Mai Hương</h5>
                <span className="text-[11px] text-pastel-muted">Bé Sóc 2 tuổi (Hà Nội)</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-pastel-border/70 shadow-soft">
            <div className="flex items-center gap-1 text-amber-400 mb-2.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-pastel-text leading-relaxed italic mb-4">
              "Mua set đôi mẹ và bé mặc cưng xỉu, chụp hình ai cũng khen. Form áo rộng rãi thoải mái, giặt máy thoải mái không bị co rút hay xù lông."
            </p>
            <div className="flex items-center gap-3 pt-3 border-t border-pastel-border/40">
              <div className="w-9 h-9 rounded-full bg-pastel-mint flex items-center justify-center font-bold text-xs text-pastel-mint-deep">
                TL
              </div>
              <div>
                <h5 className="font-display font-bold text-xs text-pastel-text">Mẹ Thùy Linh</h5>
                <span className="text-[11px] text-pastel-muted">Bé Dâu Tây 4 tuổi (Đà Nẵng)</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-pastel-border/70 shadow-soft">
            <div className="flex items-center gap-1 text-amber-400 mb-2.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-pastel-text leading-relaxed italic mb-4">
              "Shop tư vấn size siêu có tâm qua Zalo, nhận hàng bé mặc vừa in. Đóng gói hộp rất cẩn thận và thơm tho, sẽ ủng hộ shop dài dài!"
            </p>
            <div className="flex items-center gap-3 pt-3 border-t border-pastel-border/40">
              <div className="w-9 h-9 rounded-full bg-pastel-yellow flex items-center justify-center font-bold text-xs text-amber-800">
                PT
              </div>
              <div>
                <h5 className="font-display font-bold text-xs text-pastel-text">Mẹ Phương Thảo</h5>
                <span className="text-[11px] text-pastel-muted">Bé Bon 18 tháng (TP.HCM)</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
