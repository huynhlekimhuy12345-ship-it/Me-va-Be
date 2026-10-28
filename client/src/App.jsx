import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/common/Toast';
import { CartProvider } from './store/CartContext';
import RootLayout from './components/layout/RootLayout';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ThankYouPage from './pages/ThankYouPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminApp from './admin/AdminApp';

export function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Customer Facing Routes with RootLayout */}
            <Route path="/" element={<RootLayout />}>
              <Route index element={<HomePage />} />
              <Route path="san-pham" element={<CatalogPage />} />
              <Route path="san-pham/:slug" element={<ProductDetailPage />} />
              <Route path="gio-hang" element={<CartPage />} />
              <Route path="dat-hang" element={<CheckoutPage />} />
              <Route path="cam-on/:orderCode" element={<ThankYouPage />} />
              <Route path="lien-he" element={<ContactPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Admin Backoffice Route */}
            <Route path="/admin/*" element={<AdminApp />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </ToastProvider>
  );
}

export default App;
