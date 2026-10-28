import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import BottomNav from './BottomNav';
import ZaloFloatingButton from './ZaloFloatingButton';
import CartDrawer from '../cart/CartDrawer';

export function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-pastel-cream text-pastel-text">
      {/* Top Header */}
      <Header />

      {/* Main Page Content */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Fixed Bottom Navigation Bar (<768px) */}
      <BottomNav />

      {/* Floating Zalo Button */}
      <ZaloFloatingButton />

      {/* Global Slide-out Shopping Cart Drawer */}
      <CartDrawer />
    </div>
  );
}

export default RootLayout;
