import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { MenuItem } from '../types';
import { ImagePlaceholder } from './ImagePlaceholder';

interface VoteCardProps {
  item: MenuItem;
  voteCount: number;
  isSelected: boolean;
  onVote: (id: string) => void;
  onDelete: (id: string) => void;
}

export const VoteCard: React.FC<VoteCardProps> = ({
  item,
  voteCount,
  isSelected,
  onVote,
  onDelete,
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      layout
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={`relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border transition-all ${
        isSelected
          ? 'border-amber-500 ring-2 ring-amber-500/30 shadow-lg shadow-amber-500/10'
          : 'border-slate-100 dark:border-slate-800 shadow-sm hover:border-slate-200 dark:hover:border-slate-700'
      }`}
    >
      {/* Badge บอกสถานะหากเป็นเมนูที่โหวตอยู่ */}
      {isSelected && (
        <div className="absolute top-3 left-3 z-10 bg-amber-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md tracking-wide">
          ✓ ตัวเลือกของคุณ
        </div>
      )}

      {/* ปุ่มลบเมนูแบบเร่งด่วน */}
      <button
        type="button"
        onClick={() => onDelete(item.id)}
        className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm text-slate-400 hover:text-rose-500 flex items-center justify-center text-xs transition-colors shadow-sm"
        title="ลบเมนูนี้"
      >
        ✕
      </button>

      <div>
        {/* รูปภาพเมนูอาหาร หรือ ImagePlaceholder */}
        <div className="relative w-full h-44 bg-slate-100 dark:bg-slate-800 overflow-hidden">
          {item.image && !imageError ? (
            <img
              src={item.image}
              alt={item.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover select-none transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <ImagePlaceholder className="w-full h-full" label="ไม่มีรูปอาหาร" />
          )}
        </div>

        {/* รายละเอียดชื่อและราคา */}
        <div className="p-4">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 truncate" title={item.name}>
              {item.name}
            </h3>
            <span className="text-sm font-semibold text-amber-600 dark:text-amber-400 flex-shrink-0">
              ฿{item.price.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* ส่วน Action และคะแนนโหวต */}
      <div className="px-4 pb-4 pt-1 flex items-center justify-between gap-3 border-t border-slate-50 dark:border-slate-800/60 mt-auto">
        {/* กล่องแสดงคะแนนโหวต */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-400 font-medium">คะแนน:</span>
          <motion.span
            key={voteCount}
            initial={{ scale: 1.4, color: '#f59e0b' }}
            animate={{ scale: 1, color: isSelected ? '#f59e0b' : '#334155' }}
            transition={{ duration: 0.2 }}
            className="text-lg font-black dark:text-slate-200"
          >
            {voteCount}
          </motion.span>
        </div>

        {/* ปุ่มกดโหวต (Interactive Button) */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onVote(item.id)}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-colors select-none ${
            isSelected
              ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300'
              : 'bg-amber-500 text-white hover:bg-amber-600 shadow-sm'
          }`}
        >
          {isSelected ? 'ยกเลิกโหวต' : '+1 โหวตเมนูนี้'}
        </motion.button>
      </div>
    </motion.div>
  );
};