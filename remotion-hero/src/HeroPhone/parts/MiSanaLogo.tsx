import React from "react";

// MiSana logo: a blue speech bubble with a white medical cross.

export const MiSanaLogo: React.FC<{ size?: number }> = ({ size = 56 }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* Speech bubble */}
      <path
        d="M12 8 H52 C54.2 8 56 9.8 56 12 V44 C56 46.2 54.2 48 52 48 H26 L16 58 V48 H12 C9.8 48 8 46.2 8 44 V12 C8 9.8 9.8 8 12 8 Z"
        fill="#1169a0"
      />
      {/* Cross */}
      <rect x="26" y="14" width="12" height="32" rx="2.4" fill="#ffffff" />
      <rect x="16" y="24" width="32" height="12" rx="2.4" fill="#ffffff" />
    </svg>
  );
};
