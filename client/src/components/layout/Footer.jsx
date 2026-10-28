import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageCircle, MapPin, Heart, ShieldCheck, Truck, RefreshCw, Clock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-pastel-border/80 pt-12 pb-24 md:pb-12 text-pastel-text text-sm">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Commitments Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-10 border-b border-pastel-border/60">
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-pastel-cream/60">
            <div className="w-10 h-10 rounded-full bg-pastel-mint flex items-center justify-center text-pastel-mint-deep shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-display font-bold text-xs md:text-sm text-pastel-text">100% Cotton Mềm</h5>
              <p className="text-[11px] text-pastel-muted mt-0.5">Vải tự nhiên an toàn tuyệt đối cho da bé</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-pastel-cream/60">
            <div className="w-10 h-10 rounded-full bg-brand-pink-light flex items-center justify-center text-brand-pink shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-display font-bold text-xs md:text-sm text-pastel-text">Đổi Size 7 Ngày</h5>
              <p className="text-[11px] text-pastel-muted mt-0.5">Bé mặc chật hoặc rộng đổi thoải mái</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-pastel-cream/60">
            <div className="w-10 h-10 rounded-full bg-pastel-yellow flex items-center justify-center text-amber-800 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-display font-bold text-xs md:text-sm text-pastel-text">Giao Toàn Quốc</h5>
              <p className="text-[11px] text-pastel-muted mt-0.5">Được kiểm tra hàng trước khi thanh toán</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-pastel-cream/60">
            <div className="w-10 h-10 rounded-full bg-pastel-pink/60 flex items-center justify-center text-brand-pink-deep shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-display font-bold text-xs md:text-sm text-pastel-text">Tư Vấn Tận Tâm</h5>
              <p className="text-[11px] text-pastel-muted mt-0.5">Zalo 0911400879 hỗ trợ mẹ 24/7</p>
            </div>
          </div>
        </div>

        {/* Links & Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10 border-b border-pastel-border/60">
          {/* Col 1: Shop details */}
          <div className="md:col-span-1.5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-xl text-brand-pink-deep">
                Nga Pijama Mẹ & Bé
              </span>
            </div>
            <p className="text-xs text-pastel-muted leading-relaxed">
              Thương hiệu pijama, đồ bộ cotton và lụa cao cấp phong cách Hàn Quốc cho trẻ em từ sơ sinh đến 10 tuổi và set đồ đôi cho Mẹ & Bé.
            </p>
            <div className="space-y-1.5 text-xs text-pastel-text">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-pink shrink-0" />
                <span>Hotline / Zalo: <strong className="text-pastel-text">0911 400 879</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-pink shrink-0" />
                <span>128 Nguyễn Trãi, Thanh Xuân, Hà Nội</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-pink shrink-0" />
                <span>Mở cửa: 8:00 - 21:30 hàng ngày</span>
              </div>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="font-display font-bold text-sm text-pastel-text mb-3">Danh Mục Yêu Thích</h4>
            <ul className="space-y-2 text-xs text-pastel-muted">
              <li>
                <Link to="/san-pham?cat=be-gai" className="hover:text-brand-pink-deep transition-colors">
                  Pijama Bé Gái Dễ Thương
                </Link>
              </li>
              <li>
                <Link to="/san-pham?cat=be-trai" className="hover:text-brand-pink-deep transition-colors">
                  Đồ Bộ Bé Trai Năng Động
                </Link>
              </li>
              <li>
                <Link to="/san-pham?cat=so-sinh" className="hover:text-brand-pink-deep transition-colors">
                  Set Quần Áo Sơ Sinh
                </Link>
              </li>
              <li>
                <Link to="/san-pham?cat=me-va-be" className="hover:text-brand-pink-deep transition-colors">
                  Set Pijama Đôi Mẹ & Bé
                </Link>
              </li>
              <li>
                <Link to="/san-pham?sort=bestseller" className="hover:text-brand-pink-deep transition-colors">
                  Bộ Sưu Tập Bán Chạy Nhất
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div>
            <h4 className="font-display font-bold text-sm text-pastel-text mb-3">Chính Sách & Hỗ Trợ</h4>
            <ul className="space-y-2 text-xs text-pastel-muted">
              <li>
                <Link to="/lien-he" className="hover:text-brand-pink-deep transition-colors">
                  Hướng Dẫn Chọn Size Cho Bé
                </Link>
              </li>
              <li>
                <Link to="/lien-he" className="hover:text-brand-pink-deep transition-colors">
                  Chính Sách Đổi Trả 7 Ngày
                </Link>
              </li>
              <li>
                <Link to="/lien-he" className="hover:text-brand-pink-deep transition-colors">
                  Phương Thức Thanh Toán (COD / CK)
                </Link>
              </li>
              <li>
                <Link to="/lien-he" className="hover:text-brand-pink-deep transition-colors">
                  Liên Hệ & Góp Ý
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Bank transfer summary */}
          <div>
            <h4 className="font-display font-bold text-sm text-pastel-text mb-3">Thông Tin Chuyển Khoản</h4>
            <div className="p-3 rounded-2xl bg-pastel-cream/70 border border-pastel-border/60 text-xs space-y-1">
              <p className="text-pastel-muted">Ngân hàng: <strong className="text-pastel-text">Vietcombank</strong></p>
              <p className="text-pastel-muted">Số tài khoản: <strong className="text-pastel-text tracking-wide">0911400879</strong></p>
              <p className="text-pastel-muted">Chủ tài khoản: <strong className="text-pastel-text">NGUYEN THI NGA</strong></p>
              <p className="text-[11px] text-pastel-muted mt-1 italic">Nội dung CK: Mã đơn hàng (VD: NGA-0001)</p>
            </div>
            <div className="mt-3">
              <Link
                to="/admin"
                className="text-[11px] text-pastel-muted/60 hover:text-pastel-muted underline"
              >
                Khu vực quản lý (Admin)
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-pastel-muted text-center">
          <p>© 2026 Nga Pijama Mẹ & Bé. Đồ xinh - Ngủ ngoan - Lớn khỏe.</p>
          <div className="flex items-center gap-1 text-[11px]">
            <span>Được thiết kế với</span>
            <Heart className="w-3.5 h-3.5 text-brand-pink fill-brand-pink" />
            <span>dành riêng cho các thiên thần nhỏ</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
