import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { useToast } from '../components/common/Toast';
import Button from '../components/common/Button';

export function AdminLayout({ onLogout }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Set noindex meta tag dynamically for admin area
  useEffect(() => {
    let metaRobots = document.querySelector('meta[name="robots"]');
    let created = false;
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
      created = true;
    }
    metaRobots.setAttribute('content', 'noindex, nofollow');

    return () => {
      if (created && metaRobots.parentNode) {
        metaRobots.parentNode.removeChild(metaRobots);
      } else if (metaRobots) {
        metaRobots.setAttribute('content', 'index, follow');
      }
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch {}
    showToast('Đã đăng xuất khỏi quản trị shop.', 'info');
    onLogout();
    navigate('/');
  };

  const navLinks = [
    { to: '/admin/dashboard', label: 'Tổng Quan', icon: LayoutDashboard },
    { to: '/admin/products', label: 'Sản Phẩm', icon: Package },
    { to: '/admin/categories', label: 'Danh Mục', icon: FolderTree },
    { to: '/admin/orders', label: 'Đơn Hàng', icon: ShoppingCart },
    { to: '/admin/customers', label: 'Khách Hàng', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-pastel-cream/70 text-pastel-text flex flex-col md:flex-row">
      {/* ═══ MOBILE HEADER & HAMBURGER ═══ */}
      <header className="md:hidden sticky top-0 z-40 bg-white border-b border-pastel-border px-4 h-16 flex items-center justify-between shadow-soft">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl text-pastel-text hover:bg-pastel-cream"
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-display font-bold text-base text-brand-pink-deep">
            Nga Pijama • Admin
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/"
            target="_blank"
            className="p-2 text-pastel-muted hover:text-pastel-text"
            title="Xem shop"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
          <button
            onClick={handleLogout}
            className="p-2 text-pastel-muted hover:text-brand-danger"
            title="Đăng xuất"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ═══ MOBILE COLLAPSIBLE DRAWER MENU ═══ */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-pastel-text/30 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="relative w-72 bg-white h-full shadow-2xl p-5 flex flex-col justify-between z-10 animate-in slide-in-from-left duration-200">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-pastel-border/60">
                <span className="font-display font-bold text-lg text-pastel-text">
                  Quản Trị Shop
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-full text-pastel-muted hover:text-pastel-text"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex flex-col gap-1.5 font-display font-semibold text-sm">
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all ${
                          isActive
                            ? 'bg-brand-pink text-white shadow-soft'
                            : 'text-pastel-text hover:bg-pastel-cream'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-pastel-border/60 space-y-2">
              <Link
                to="/"
                target="_blank"
                className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-pastel-text hover:bg-pastel-cream rounded-xl"
              >
                <ExternalLink className="w-4 h-4 text-pastel-muted" />
                <span>Xem trang bán hàng</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-brand-danger hover:bg-brand-danger-light rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Đăng xuất</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ═══ PC FIXED LEFT SIDEBAR (>=768px) ═══ */}
      <aside className="hidden md:flex flex-col justify-between w-64 bg-white border-r border-pastel-border/80 p-5 shrink-0 min-h-screen sticky top-0 h-screen">
        <div className="space-y-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5 pb-4 border-b border-pastel-border/60">
            <div className="w-10 h-10 rounded-2xl bg-pastel-pink flex items-center justify-center font-display font-black text-brand-pink-deep text-lg shadow-soft">
              🧸
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-pastel-text leading-tight">
                Nga Pijama
              </h2>
              <span className="text-[11px] text-pastel-muted">Khu vực quản trị</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5 font-display font-semibold text-sm">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all ${
                      isActive
                        ? 'bg-brand-pink text-white shadow-soft scale-[1.02]'
                        : 'text-pastel-text hover:bg-pastel-cream hover:text-brand-pink-deep'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar Actions */}
        <div className="pt-4 border-t border-pastel-border/60 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-pastel-text hover:bg-pastel-cream rounded-2xl transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-pastel-muted" />
            <span>Xem trang khách hàng</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-brand-danger hover:bg-brand-danger-light rounded-2xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* ═══ MAIN CONTENT AREA ═══ */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
