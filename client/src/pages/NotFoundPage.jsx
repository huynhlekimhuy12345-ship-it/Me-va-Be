import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { Home, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="max-w-[600px] mx-auto px-4 py-16 md:py-24 text-center space-y-6">
      {/* Cute 404 Bear Graphic */}
      <div className="relative w-48 h-48 mx-auto">
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
          <circle cx="100" cy="100" r="90" fill="#FFEFC7" opacity="0.6" />
          <circle cx="60" cy="65" r="22" fill="#5B4A4A" />
          <circle cx="60" cy="65" r="11" fill="#FF8FAB" />
          <circle cx="140" cy="65" r="22" fill="#5B4A4A" />
          <circle cx="140" cy="65" r="11" fill="#FF8FAB" />
          <circle cx="100" cy="100" r="50" fill="#5B4A4A" />
          {/* Confused / Wondering Face */}
          <ellipse cx="100" cy="112" rx="22" ry="16" fill="#FFF8F0" />
          <polygon points="100,104 93,112 107,112" fill="#5B4A4A" />
          {/* Question eyes */}
          <text x="80" y="98" fill="#FFF8F0" fontSize="18" fontWeight="bold">?</text>
          <text x="110" y="98" fill="#FFF8F0" fontSize="18" fontWeight="bold">?</text>
          <circle cx="75" cy="114" r="5" fill="#FF8FAB" opacity="0.8" />
          <circle cx="125" cy="114" r="5" fill="#FF8FAB" opacity="0.8" />
        </svg>
      </div>

      <div className="space-y-2">
        <span className="font-display font-extrabold text-5xl text-brand-pink-deep tracking-wider">
          404
        </span>
        <h1 className="text-2xl font-display font-bold text-pastel-text">
          Ôi, trang này đi lạc mất rồi!
        </h1>
        <p className="text-xs sm:text-sm text-pastel-muted max-w-sm mx-auto leading-relaxed">
          Đường dẫn mẹ vừa bấm có thể đã đổi hoặc không tồn tại. Mẹ quay về trang chủ để ngắm đồ xinh cho bé nhé!
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 pt-2">
        <Link to="/">
          <Button variant="primary" size="lg" icon={Home} className="shadow-pink-glow">
            Về lại trang chủ
          </Button>
        </Link>
        <Link to="/san-pham">
          <Button variant="outline" size="lg">
            Xem sản phẩm
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
