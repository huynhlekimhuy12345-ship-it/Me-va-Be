import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useCart } from '../../store/CartContext';
import { Home, Grid, Search, ShoppingBag, MessageCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export function BottomNav() {
  const { totalItems, openCart, badgeBounced } = useCart();
  const location = useLocation();

  const isCartPage = location.pathname === '/gio-hang';

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-lg border-t border-pastel-border/80 shadow-bottom-nav z-40 pb-safe"
      aria-label="Thanh điều hướng dưới"
    >
      <div className="grid grid-cols-5 h-16 items-center px-1">
        {/* 1. Trang chủ */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center h-full text-[11px] font-medium transition-colors min-h-[44px]',
              isActive ? 'text-brand-pink-deep font-bold' : 'text-pastel-muted hover:text-pastel-text'
            )
          }
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>Trang chủ</span>
        </NavLink>

        {/* 2. Danh mục */}
        <NavLink
          to="/san-pham"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center h-full text-[11px] font-medium transition-colors min-h-[44px]',
              isActive && !location.search.includes('q=')
                ? 'text-brand-pink-deep font-bold'
                : 'text-pastel-muted hover:text-pastel-text'
            )
          }
        >
          <Grid className="w-5 h-5 mb-0.5" />
          <span>Danh mục</span>
        </NavLink>

        {/* 3. Tìm kiếm */}
        <NavLink
          to="/san-pham?focusSearch=1"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center h-full text-[11px] font-medium transition-colors min-h-[44px]',
              location.search.includes('focusSearch=') || location.search.includes('q=')
                ? 'text-brand-pink-deep font-bold'
                : 'text-pastel-muted hover:text-pastel-text'
            )
          }
        >
          <Search className="w-5 h-5 mb-0.5" />
          <span>Tìm kiếm</span>
        </NavLink>

        {/* 4. Giỏ hàng (Mở drawer hoặc đi đến trang giỏ hàng) */}
        <button
          onClick={openCart}
          className={cn(
            'flex flex-col items-center justify-center h-full text-[11px] font-medium transition-colors relative min-h-[44px]',
            isCartPage ? 'text-brand-pink-deep font-bold' : 'text-pastel-muted hover:text-pastel-text'
          )}
          aria-label={`Giỏ hàng có ${totalItems} món`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 mb-0.5" />
            {totalItems > 0 && (
              <span
                className={`absolute -top-1.5 -right-2.5 bg-brand-pink text-white text-[10px] font-display font-bold w-4.5 h-4.5 min-w-[18px] rounded-full flex items-center justify-center px-1 shadow-sm ${
                  badgeBounced ? 'animate-bounce-short scale-125' : ''
                }`}
              >
                {totalItems}
              </span>
            )}
          </div>
          <span>Giỏ hàng</span>
        </button>

        {/* 5. Zalo */}
        <a
          href="https://zalo.me/0911400879"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center h-full text-[11px] font-medium text-pastel-mint-deep hover:text-emerald-700 transition-colors min-h-[44px]"
        >
          <div className="w-5 h-5 rounded-full bg-pastel-mint flex items-center justify-center text-pastel-mint-deep mb-0.5">
            <MessageCircle className="w-3.5 h-3.5" />
          </div>
          <span>Zalo</span>
        </a>
      </div>
    </nav>
  );
}

export default BottomNav;
