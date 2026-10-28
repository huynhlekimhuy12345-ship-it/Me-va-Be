import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import AdminLayout from './AdminLayout';
import AdminDashboard from './AdminDashboard';
import AdminProducts from './AdminProducts';
import AdminProductForm from './AdminProductForm';
import AdminCategories from './AdminCategories';
import AdminOrders from './AdminOrders';
import AdminCustomers from './AdminCustomers';

export function AdminApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check existing session on load
  useEffect(() => {
    fetch('/api/admin/me')
      .then((res) => {
        if (res.ok) setIsAuthenticated(true);
        else setIsAuthenticated(false);
      })
      .catch(() => setIsAuthenticated(false))
      .finally(() => setCheckingAuth(false));
  }, []);

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-pastel-cream flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-pastel-pink border-t-brand-pink rounded-full animate-spin" />
          <span className="text-xs font-semibold text-pastel-muted">Đang kiểm tra quyền quản trị...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <Routes>
      <Route element={<AdminLayout onLogout={() => setIsAuthenticated(false)} />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/new" element={<AdminProductForm />} />
        <Route path="products/edit/:id" element={<AdminProductForm />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
}

export default AdminApp;
