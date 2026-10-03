import React from 'react';

export interface ImagePlaceholderProps {
  className?: string;
  label?: string;
}

export const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  className = 'w-full h-full min-h-[160px]',
  label = 'ไม่มีรูปภาพ',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400 select-none ${className}`}
      role="img"
      aria-label={label}
    >
      {/* SVG ช้อนส้อม */}
      <svg
        className="w-10 h-10 mb-2 stroke-current opacity-70"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2" />
        <path d="M15 2v10" />
        <path d="M15 14v8" />
        <path d="M6 2v10a3 3 0 0 0 3 3v7" />
        <path d="M6 2a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3" />
      </svg>
      <span className="text-xs font-medium tracking-wide text-slate-400 dark:text-slate-500">
        {label}
      </span>
    </div>
  );
};

export default ImagePlaceholder;