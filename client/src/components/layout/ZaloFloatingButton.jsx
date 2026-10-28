import React from 'react';
import { MessageCircle } from 'lucide-react';

export function ZaloFloatingButton() {
  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-30 group">
      {/* Tooltip on PC */}
      <div className="hidden md:block absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white text-pastel-text text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg border border-pastel-border whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        Nhắn Zalo chọn size chuẩn cho bé 💕
      </div>

      <a
        href="https://zalo.me/0911400879"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Tư vấn size qua Zalo: 0911400879"
        className="relative flex items-center justify-center w-13 h-13 md:w-14 md:h-14 rounded-full bg-[#0088FF] text-white shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-300"
      >
        {/* Pulsing ring */}
        <span className="absolute inset-0 rounded-full bg-[#0088FF]/30 animate-ping -z-10" />

        {/* Zalo Icon with custom SVG styling */}
        <div className="flex flex-col items-center justify-center">
          <span className="font-display font-extrabold text-[15px] md:text-[17px] tracking-tighter leading-none">
            Zalo
          </span>
          <span className="text-[9px] font-medium leading-none opacity-90 mt-0.5">Tư vấn</span>
        </div>
      </a>
    </div>
  );
}

export default ZaloFloatingButton;
