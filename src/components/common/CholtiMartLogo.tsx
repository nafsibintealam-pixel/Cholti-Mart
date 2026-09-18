import React from 'react';
import { useShop } from '../../context/ShopContext';

interface CholtiMartLogoProps {
  className?: string;
  variant?: 'header' | 'footer' | 'drawer';
  showTagline?: boolean;
}

export const CholtiMartLogo: React.FC<CholtiMartLogoProps> = ({
  className = '',
  variant = 'header',
  showTagline = true,
}) => {
  const { navigateTo } = useShop();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigateTo('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (variant === 'footer') {
    return (
      <a
        href="/"
        onClick={handleClick}
        className={`group inline-flex items-center gap-3 focus:outline-none ${className}`}
        aria-label="Cholti Mart - Return to Homepage"
      >
        <div className="bg-white rounded-2xl p-1.5 shadow-sm group-hover:shadow-md transition-all duration-200 border border-neutral-200 flex items-center justify-center">
          <img
            src="/cholti-mart-logo.svg"
            alt="Cholti Mart - Official Logo"
            className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
            loading="lazy"
          />
        </div>
        <div>
          <span className="text-xl sm:text-2xl font-black tracking-tight text-white block leading-none">
            CHOLTI<span className="text-emerald-400 font-extrabold ml-1">MART</span>
          </span>
          {showTagline && (
            <span className="text-[11px] text-neutral-400 tracking-wide font-medium mt-0.5 block">
              Shop Smart, Shop Cholti Mart
            </span>
          )}
        </div>
      </a>
    );
  }

  // Header / Default variant
  return (
    <a
      href="/"
      onClick={handleClick}
      className={`group flex items-center gap-2.5 sm:gap-3 select-none focus:outline-none ${className}`}
      aria-label="Cholti Mart - Return to Homepage"
    >
      {/* Official Logo Graphic */}
      <div className="relative flex-shrink-0 flex items-center justify-center">
        <img
          src="/cholti-mart-logo.svg"
          alt="Cholti Mart - Official Logo"
          className="h-10 sm:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
        />
      </div>

      {/* Brand Name & Slogan (Adjusted layout around logo) */}
      <div className="flex flex-col justify-center">
        <span className="text-lg sm:text-xl md:text-2xl font-black tracking-tight text-neutral-900 leading-none group-hover:text-emerald-700 transition-colors">
          CHOLTI<span className="text-[#4CA338] font-extrabold ml-1">MART</span>
        </span>
        {showTagline && (
          <span className="text-[10px] sm:text-[11px] text-neutral-500 font-medium tracking-tight mt-0.5 hidden xs:block">
            Shop Smart, Shop Cholti Mart
          </span>
        )}
      </div>
    </a>
  );
};
