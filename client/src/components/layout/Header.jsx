import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../store/CartContext';
import { formatCurrency } from '../../lib/utils';
import {
  Search,
  ShoppingBag,
  Phone,
  MessageCircle,
  Menu,
  Heart,
  Sparkles,
} from 'lucide-react';

export function Header() {
  const { totalItems, totalAmount, openCart, badgeBounced } = useCart();
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/san-pham?q=${encodeURIComponent(keyword.trim())}`);
    } else {
      navigate('/san-pham');
    }
  };

  const categories = [
    { name: 'Tất cả đồ xinh', slug: '' },
    { name: 'Pijama Bé Gái', slug: 'be-gai' },
    { name: 'Pijama Bé Trai', slug: 'be-trai' },
    { name: 'Đồ Bộ Sơ Sinh', slug: 'so-sinh' },
    { name: 'Set Mẹ & Bé', slug: 'me-va-be' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-pastel-border/70 shadow-soft">
      {/* Top Banner Note */}
      <div className="bg-brand-pink-light/70 text-brand-pink-deep text-xs font-medium py-1 px-4 text-center flex items-center justify-center gap-1.5 border-b border-brand-pink/20">
        <Sparkles className="w-3.5 h-3.5 text-brand-pink shrink-0 animate-pulse" />
        <span>🎉 Giảm 10% cho đơn hàng từ 2 bộ pijama • Miễn phí đổi trả 7 ngày</span>
      </div>

      <div className="max-w-[1200px] mx-auto px-4">
        {/* Tier 1 / Main Bar */}
        <div className="h-16 md:h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-pastel-pink/80 flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform">
              <svg className="w-7 h-7 md:w-8 md:h-8" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="30" fill="#FFD6E0" />
                <circle cx="18" cy="18" r="7" fill="#5B4A4A" />
                <circle cx="18" cy="18" r="3.5" fill="#FF8FAB" />
                <circle cx="46" cy="18" r="7" fill="#5B4A4A" />
                <circle cx="46" cy="18" r="3.5" fill="#FF8FAB" />
                <circle cx="32" cy="34" r="18" fill="#5B4A4A" />
                <ellipse cx="32" cy="38" rx="8" ry="6" fill="#FFF8F0" />
                <polygon points="32,35 29,39 35,39" fill="#5B4A4A" />
                <circle cx="26" cy="32" r="1.5" fill="#FFF8F0" />
                <circle cx="38" cy="32" r="1.5" fill="#FFF8F0" />
                <circle cx="23" cy="37" r="2.5" fill="#FF8FAB" opacity="0.8" />
                <circle cx="41" cy="37" r="2.5" fill="#FF8FAB" opacity="0.8" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg md:text-2xl text-pastel-text tracking-tight group-hover:text-brand-pink-deep transition-colors">
                Nga Pijama
              </span>
              <span className="text-[10px] md:text-xs text-pastel-muted -mt-1 font-medium">
                Mẹ & Bé • Đồ xinh cho con
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar (>=768px) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Tìm pijama bé gái, bé trai, cotton Hàn Quốc..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full bg-pastel-cream/70 text-pastel-text text-sm rounded-full pl-11 pr-4 py-2.5 border border-pastel-border/80 focus:bg-white focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 transition-all placeholder:text-pastel-muted/70"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-pastel-muted" />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-brand-pink hover:bg-brand-pink-hover text-white text-xs font-semibold px-3.5 py-1.5 rounded-full transition-colors"
              >
                Tìm
              </button>
            </form>
          </div>

          {/* Right Actions: Hotline, Zalo, Cart */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Hotline (Desktop) */}
            <a
              href="tel:0911400879"
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-pastel-cream hover:bg-pastel-cream-warm border border-pastel-border/60 text-xs font-medium text-pastel-text transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-pastel-mint flex items-center justify-center text-pastel-mint-deep">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-pastel-muted leading-tight">Hotline 24/7</span>
                <span className="font-bold text-xs text-pastel-text">0911 400 879</span>
              </div>
            </a>

            {/* Direct Zalo Link */}
            <a
              href="https://zalo.me/0911400879"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-pastel-mint/60 hover:bg-pastel-mint border border-pastel-mint-dark/40 text-xs font-semibold text-pastel-mint-deep transition-all hover:scale-105"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Tư vấn Zalo</span>
            </a>

            {/* Cart Button */}
            <button
              onClick={openCart}
              id="header-cart-button"
              className="flex items-center gap-2.5 px-3 py-2 md:px-4 md:py-2 rounded-full bg-brand-pink-light/60 hover:bg-brand-pink-light border border-brand-pink/40 text-pastel-text transition-all min-h-[44px]"
              aria-label={`Giỏ hàng, hiện có ${totalItems} món`}
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-brand-pink-deep" />
                {totalItems > 0 && (
                  <span
                    className={`absolute -top-2 -right-2 bg-brand-pink text-white text-[11px] font-display font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm ${
                      badgeBounced ? 'animate-bounce-short scale-125' : ''
                    }`}
                  >
                    {totalItems}
                  </span>
                )}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-[10px] text-pastel-muted leading-tight">Giỏ hàng</span>
                <span className="text-xs font-display font-bold text-brand-pink-deep">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar (<768px) */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Tìm pijama, đồ bộ cho bé..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full bg-pastel-cream/70 text-pastel-text text-sm rounded-full pl-10 pr-14 py-2 border border-pastel-border/80 focus:bg-white focus:border-brand-pink focus:outline-none min-h-[44px]"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pastel-muted" />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-brand-pink text-white text-xs font-semibold px-3 py-1.5 rounded-full"
            >
              Tìm
            </button>
          </form>
        </div>

        {/* Category Navigation Bar (Chips scroll on mobile, flex bar on PC) */}
        <nav
          className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 -mx-4 px-4 md:mx-0 md:px-0 md:justify-center border-t border-pastel-border/40 text-xs md:text-sm font-display font-semibold"
          aria-label="Danh mục sản phẩm"
        >
          {categories.map((cat) => {
            const path = cat.slug ? `/san-pham?cat=${cat.slug}` : '/san-pham';
            const isActive =
              cat.slug === ''
                ? location.pathname === '/san-pham' && !location.search.includes('cat=')
                : location.search.includes(`cat=${cat.slug}`);

            return (
              <Link
                key={cat.slug || 'all'}
                to={path}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full transition-all shrink-0 min-h-[36px] flex items-center justify-center ${
                  isActive
                    ? 'bg-brand-pink text-white shadow-soft scale-105'
                    : 'bg-pastel-cream/80 text-pastel-text hover:bg-pastel-cream-warm hover:text-brand-pink-deep border border-pastel-border/50'
                }`}
              >
                {cat.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

export default Header;
