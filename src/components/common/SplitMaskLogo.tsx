import React from 'react';

export const SplitMaskLogo: React.FC<{ size?: number }> = ({ size = 38 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
      aria-hidden="true"
    >
      <defs>
        <clipPath id="leftLogoHalf">
          <rect x="0" y="0" width="32" height="64" />
        </clipPath>
        <clipPath id="rightLogoHalf">
          <rect x="32" y="0" width="32" height="64" />
        </clipPath>
      </defs>

      {/* Left Half: Pure White */}
      <g clipPath="url(#leftLogoHalf)">
        <path
          d="M12 24C12 17 18 12 32 12C46 12 52 17 52 24C52 38 42 50 32 54C22 50 12 38 12 24Z"
          fill="#FFFFFF"
        />
        <path
          d="M20 26C21 21 27 21 28 26"
          stroke="#090D1E"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M25 40C27 42 29.5 43 32 43"
          stroke="#090D1E"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* Right Half: Vibrant Pink/Red */}
      <g clipPath="url(#rightLogoHalf)">
        <path
          d="M12 24C12 17 18 12 32 12C46 12 52 17 52 24C52 38 42 50 32 54C22 50 12 38 12 24Z"
          fill="#F43F5E"
        />
        <path
          d="M36 26C37 21 43 21 44 26"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M32 43C34.5 43 37 42 39 40"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    </svg>
  );
};
