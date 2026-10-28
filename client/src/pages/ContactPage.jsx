import React from 'react';
import { Phone, MessageCircle, MapPin, Clock, ShieldCheck, RefreshCw, Sparkles } from 'lucide-react';
import Button from '../components/common/Button';

export function ContactPage() {
  const sizeChart = [
    { size: 'Size 1 (0-1 tuổi)', weight: '8 - 10 kg', height: '70 - 80 cm', age: '9 - 18 tháng' },
    { size: 'Size 2 (1-2 tuổi)', weight: '11 - 13 kg', height: '80 - 90 cm', age: '1.5 - 2.5 tuổi' },
    { size: 'Size 3 (2-4 tuổi)', weight: '14 - 16 kg', height: '90 - 100 cm', age: '3 - 4 tuổi' },
    { size: 'Size 4 (4-6 tuổi)', weight: '17 - 20 kg', height: '100 - 110 cm', age: '4 - 5.5 tuổi' },
    { size: 'Size 5 (6-8 tuổi)', weight: '21 - 25 kg', height: '110 - 122 cm', age: '6 - 7 tuổi' },
    { size: 'Size 6 (8-10 tuổi)', weight: '26 - 32 kg', height: '122 - 135 cm', age: '8 - 10 tuổi' },
  ];

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-8 md:py-12 space-y-10">
      <div className="text-center max-w-lg mx-auto space-y-2">
        <span className="text-xs font-bold text-brand-pink uppercase tracking-widest">
          Hỗ Trợ Mẹ 24/7
        </span>
        <h1 className="text-3xl md:text-4xl font-display font-black text-pastel-text">
          Liên Hệ & Tư Vấn Chọn Size
        </h1>
        <p className="text-xs sm:text-sm text-pastel-muted">
          Nếu mẹ đang phân vân bé mặc size nào cho thoải mái nhất, đừng ngần ngại nhắn tin cho shop nhé!
        </p>
      </div>

      {/* Contact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-pastel-border/70 shadow-soft text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-pastel-mint flex items-center justify-center text-pastel-mint-deep mx-auto">
            <MessageCircle className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-base text-pastel-text">Tư Vấn Zalo</h3>
          <p className="text-xs text-pastel-muted">Nhắn tin nhận hình ảnh mẫu thật và tư vấn size chuẩn</p>
          <a
            href="https://zalo.me/0911400879"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button variant="mint" size="sm" className="font-bold">
              Chat Zalo: 0911 400 879
            </Button>
          </a>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-pastel-border/70 shadow-soft text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-pink-light flex items-center justify-center text-brand-pink mx-auto">
            <Phone className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-base text-pastel-text">Hotline Đặt Hàng</h3>
          <p className="text-xs text-pastel-muted">Hỗ trợ kiểm tra đơn hàng, giao gấp trong ngày</p>
          <a href="tel:0911400879" className="inline-block">
            <Button variant="primary" size="sm" className="font-bold shadow-soft">
              Gọi ngay: 0911 400 879
            </Button>
          </a>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-pastel-border/70 shadow-soft text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-pastel-yellow flex items-center justify-center text-amber-800 mx-auto">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-base text-pastel-text">Cửa Hàng Trực Tiếp</h3>
          <p className="text-xs text-pastel-muted">128 Nguyễn Trãi, Thanh Xuân, Hà Nội</p>
          <span className="inline-block text-xs font-semibold text-pastel-text bg-pastel-cream px-3 py-1.5 rounded-full border border-pastel-border">
            Mở cửa: 8:00 - 21:30
          </span>
        </div>
      </div>

      {/* Bảng Hướng Dẫn Chọn Size */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pastel-border/80 shadow-soft space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-pastel-border/60">
          <Sparkles className="w-5 h-5 text-brand-pink" />
          <h2 className="text-lg sm:text-xl font-display font-bold text-pastel-text">
            Bảng Kích Cỡ Chuẩn Cho Bé (Size Chart)
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-pastel-muted leading-relaxed">
          * Đồ bộ pijama ngủ cho bé nhà Nga được thiết kế form rộng rãi vừa vặn thoải mái. Nếu bé trộm vía bụ bẫm hoặc có bụng tròn, mẹ có thể tăng lên 1 size nhé!
        </p>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-pastel-cream/70 text-pastel-text font-display font-bold border-b border-pastel-border/80">
                <th className="py-3 px-4 rounded-l-xl">Kích thước (Size)</th>
                <th className="py-3 px-4">Cân nặng bé</th>
                <th className="py-3 px-4">Chiều cao khuyến nghị</th>
                <th className="py-3 px-4 rounded-r-xl">Độ tuổi ước tính</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pastel-border/50 text-pastel-text">
              {sizeChart.map((row, idx) => (
                <tr key={idx} className="hover:bg-pastel-cream/30 transition-colors">
                  <td className="py-3 px-4 font-bold text-brand-pink-deep">{row.size}</td>
                  <td className="py-3 px-4 font-semibold">{row.weight}</td>
                  <td className="py-3 px-4 text-pastel-muted">{row.height}</td>
                  <td className="py-3 px-4 text-pastel-muted">{row.age}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chính Sách Đổi Trả */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pastel-border/80 shadow-soft space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-pastel-border/60">
          <RefreshCw className="w-5 h-5 text-brand-pink" />
          <h2 className="text-lg sm:text-xl font-display font-bold text-pastel-text">
            Chính Sách Đổi Size Dễ Dàng Trong 7 Ngày
          </h2>
        </div>

        <div className="text-xs sm:text-sm text-pastel-text space-y-3 leading-relaxed">
          <p>
            1. <strong>Thời gian:</strong> Trong vòng 7 ngày kể từ lúc mẹ nhận được hàng.
          </p>
          <p>
            2. <strong>Điều kiện:</strong> Sản phẩm còn nguyên tem mác, chưa qua giặt tẩy hoặc sử dụng.
          </p>
          <p>
            3. <strong>Cách thức đổi:</strong> Mẹ chỉ cần nhắn tin vào Zalo <strong>0911400879</strong> báo mã đơn hàng và số cân nặng của bé. Shipper sẽ mang bộ mới đến tận nhà đổi và thu lại bộ cũ cho mẹ cực kỳ tiện lợi!
          </p>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
