import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useToast } from '../components/common/Toast';
import { Lock, ArrowLeft, KeyRound, Sparkles } from 'lucide-react';

export function AdminLogin({ onLoginSuccess }) {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { showToast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!pin.trim()) {
      setError('Vui lòng nhập mã PIN quản trị');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pin.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        showToast('Đăng nhập quản trị thành công!', 'success');
        onLoginSuccess();
      } else {
        setError(data.error || 'Mã PIN không đúng.');
      }
    } catch (err) {
      setError('Không thể kết nối đến máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pastel-cream text-pastel-text flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white p-7 sm:p-9 rounded-3xl border border-pastel-border shadow-card space-y-6 text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 rounded-2xl bg-brand-pink-light flex items-center justify-center text-brand-pink-deep mx-auto shadow-soft">
          <KeyRound className="w-8 h-8" />
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pastel-cream text-pastel-text text-xs font-semibold mb-2">
            <Lock className="w-3.5 h-3.5 text-brand-pink" />
            <span>Khu Vực Quản Trị Shop</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-pastel-text">
            Nga Pijama Mẹ & Bé
          </h1>
          <p className="text-xs text-pastel-muted mt-1">
            Nhập mã PIN quản trị bảo mật để quản lý sản phẩm và đơn hàng
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <Input
            label="Mã PIN quản trị"
            type="password"
            inputMode="numeric"
            placeholder="Nhập mã PIN..."
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              if (error) setError('');
            }}
            error={error}
            required
            autoFocus
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            className="shadow-pink-glow py-3 font-bold"
          >
            Đăng nhập hệ thống
          </Button>
        </form>

        <div className="pt-2 border-t border-pastel-border/60">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-brand-pink font-semibold hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại trang bán hàng</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
