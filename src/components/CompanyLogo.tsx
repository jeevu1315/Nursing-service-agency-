import React, { useState } from 'react';

interface CompanyLogoProps {
  logoDataUrl: string | null;
  companyName: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({
  logoDataUrl,
  companyName,
  size = 'md',
}) => {
  const [imgError, setImgError] = useState(false);

  const dimensionClasses =
    size === 'sm'
      ? 'w-11 h-11 rounded-xl'
      : size === 'lg'
        ? 'w-20 h-20 rounded-2xl'
        : 'w-14 h-14 rounded-2xl';

  if (logoDataUrl && !imgError) {
    return (
      <div
        className={`${dimensionClasses} overflow-hidden bg-white border border-[#72DDAA]/50 shadow-sm flex items-center justify-center shrink-0`}
      >
        <img
          src={logoDataUrl}
          alt={`${companyName} logo`}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-contain p-1"
        />
      </div>
    );
  }

  return (
    <div
      className={`${dimensionClasses} bg-[#087443] shadow-sm flex items-center justify-center shrink-0`}
      aria-label={`${companyName} emblem`}
    >
      <svg
        viewBox="0 0 64 64"
        fill="none"
        className={size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-12 h-12' : 'w-9 h-9'}
        aria-hidden="true"
      >
        <path
          d="M26 12C26 9.79086 27.7909 8 30 8H34C36.2091 8 38 9.79086 38 12V26H52C54.2091 26 56 27.7909 56 30V34C56 36.2091 54.2091 38 52 38H38V52C38 54.2091 36.2091 56 34 56H30C27.7909 56 26 54.2091 26 52V38H12C9.79086 38 8 36.2091 8 34V30C8 27.7909 9.79086 26 12 26H26V12Z"
          fill="#FFFFFF"
        />
        <circle cx="32" cy="32" r="5.5" fill="#72DDAA" />
      </svg>
    </div>
  );
};
