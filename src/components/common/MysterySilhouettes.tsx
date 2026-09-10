import React from 'react';

export const MysterySilhouetteLeft: React.FC = () => {
  return (
    <div className="silhouette-side silhouette-left" aria-hidden="true">
      <svg
        viewBox="0 0 200 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 0 25px rgba(56, 189, 248, 0.25))' }}
      >
        <defs>
          <linearGradient id="cloakLeftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e294b" />
            <stop offset="60%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#060914" />
          </linearGradient>
          <linearGradient id="auraLeftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Outer Aura */}
        <ellipse cx="100" cy="180" rx="90" ry="160" fill="url(#auraLeftGrad)" />

        {/* Hood & Shoulders */}
        <path
          d="M100 50C60 50 40 90 35 150C30 210 10 320 0 380H190C180 320 160 210 155 150C150 90 140 50 100 50Z"
          fill="url(#cloakLeftGrad)"
          stroke="rgba(56, 189, 248, 0.2)"
          strokeWidth="1.5"
        />

        {/* Deep hood shadow cavity */}
        <path
          d="M100 70C75 70 60 95 58 135C56 175 70 210 100 210C130 210 144 175 142 135C140 95 125 70 100 70Z"
          fill="#070a14"
        />

        {/* Smiling Cyan Mask */}
        <ellipse cx="100" cy="138" rx="32" ry="42" fill="#e0f2fe" />
        <ellipse cx="100" cy="138" rx="30" ry="40" fill="#38bdf8" />
        <ellipse cx="100" cy="138" rx="27" ry="37" fill="#bae6fd" />

        {/* Smiling Eyes */}
        <path d="M88 130C90 125 94 125 96 130" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M104 130C106 125 110 125 112 130" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none" />

        {/* Happy Smirk */}
        <path d="M92 152C96 157 104 157 108 152" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none" />
      </svg>
      <span className="silhouette-tag tag-blend-in">BLEND IN</span>
    </div>
  );
};

export const MysterySilhouetteRight: React.FC = () => {
  return (
    <div className="silhouette-side silhouette-right" aria-hidden="true">
      <svg
        viewBox="0 0 200 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 0 25px rgba(244, 63, 94, 0.25))' }}
      >
        <defs>
          <linearGradient id="cloakRightGrad" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38192a" />
            <stop offset="60%" stopColor="#1f0d18" />
            <stop offset="100%" stopColor="#090408" />
          </linearGradient>
          <linearGradient id="auraRightGrad" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#be123c" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Outer Aura */}
        <ellipse cx="100" cy="180" rx="90" ry="160" fill="url(#auraRightGrad)" />

        {/* Hood & Shoulders */}
        <path
          d="M100 50C60 50 40 90 35 150C30 210 10 320 0 380H190C180 320 160 210 155 150C150 90 140 50 100 50Z"
          fill="url(#cloakRightGrad)"
          stroke="rgba(244, 63, 94, 0.2)"
          strokeWidth="1.5"
        />

        {/* Deep hood shadow cavity */}
        <path
          d="M100 70C75 70 60 95 58 135C56 175 70 210 100 210C130 210 144 175 142 135C140 95 125 70 100 70Z"
          fill="#070a14"
        />

        {/* Mysterious Red/White Mask */}
        <ellipse cx="100" cy="138" rx="32" ry="42" fill="#ffe4e6" />
        <ellipse cx="100" cy="138" rx="30" ry="40" fill="#fb7185" />
        <ellipse cx="100" cy="138" rx="27" ry="37" fill="#fecdd3" />

        {/* Mysterious Slanted Eyes */}
        <ellipse cx="91" cy="130" rx="4.5" ry="3" fill="#1e1b4b" />
        <ellipse cx="109" cy="130" rx="4.5" ry="3" fill="#1e1b4b" />

        {/* Neutral Line Mouth */}
        <line x1="94" y1="154" x2="106" y2="154" stroke="#1e1b4b" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <span className="silhouette-tag tag-find-them">FIND THEM</span>
    </div>
  );
};
