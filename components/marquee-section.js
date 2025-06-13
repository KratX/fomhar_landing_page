import React from 'react';

const items = [
  "🚚 FREE SHIPPING",
  "🔄 EASY RETURN",
  "💬 SUPPORT 24/7",
  "⏳ LIMITED TIME OFFER",
  "🌟 TRUSTED BY THOUSANDS"
];

export default function MarqueeBar() {
  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-[#fdd6de] via-white to-[#9a9eeb] min-h-[3.5rem]">

      {/* Top Line */}
      <div className="absolute top-2 left-0 w-full h-[2px] bg-blue-400 z-10" />

      {/* Bottom Line */}
      <div className="absolute bottom-2 left-0 w-full h-[2px] bg-blue-400 z-10" />

      {/* Marquee Container */}
      <div className="flex items-center h-full py-2">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 flex animate-marquee" style={{ minWidth: '300%' }}>
          {[...Array(3)].map((_, i) => (
            <div className="flex" key={i}>
              {items.map((item, idx) => (
                <span
                  key={idx + i * items.length}
                  className="mx-8 font-semibold text-[#744e4e] tracking-widest text-lg md:text-xl whitespace-nowrap"
                >
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.3333%); }
        }
        .animate-marquee {
          animation: marquee 18s linear infinite;
        }
      `}</style>
    </div>
  );
}
