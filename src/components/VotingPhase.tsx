import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MenuItem } from '../types';
import { VoteCard } from './VoteCard';

interface VotingPhaseProps {
  items: MenuItem[];
  votes: Record<string, number>;
  userVotedId: string | null;
  onVote: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onBackToSetup: () => void;
  onResetVotes: () => void;
  onClearAll: () => void;
}

export const VotingPhase: React.FC<VotingPhaseProps> = ({
  items,
  votes,
  userVotedId,
  onVote,
  onDeleteItem,
  onBackToSetup,
  onResetVotes,
  onClearAll,
}) => {
  // คำนวณหาคะแนนรวม และเมนูที่นำเป็นอันดับหนึ่ง (Leader)
  const { totalVotes, leadingItem, maxVotes } = useMemo<{
    totalVotes: number;
    leadingItem: MenuItem | null;
    maxVotes: number;
  }>(() => {
    let total = 0;
    let max = 0;
    let leader: MenuItem | null = null;

    items.forEach((item) => {
      const count = votes[item.id] || 0;
      total += count;
      if (count > max) {
        max = count;
        leader = item;
      }
    });

    return {
      totalVotes: total,
      leadingItem: max > 0 ? leader : null,
      maxVotes: max,
    };
  }, [items, votes]);
  
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header และ Action Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">
            🗳️ ห้องโหวตเมนูประจำวัน
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            โหวตได้ 1 เมนูต่อคน (สามารถคลิกเปลี่ยนใจหรือกดยกเลิกได้ตลอดเวลา)
          </p>
        </div>

        {/* ปุ่มควบคุมรอบการโหวต */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={onBackToSetup}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          >
            ✏️ จัดการ/เพิ่มเมนู
          </button>
          <button
            type="button"
            onClick={onResetVotes}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 transition-colors"
          >
            🔄 ล้างคะแนนเริ่มใหม่
          </button>
          <button
            type="button"
            onClick={onClearAll}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 transition-colors"
          >
            🗑️ ลบทั้งหมด
          </button>
        </div>
      </div>

      {/* แถบประกาศเมนูอันดับ 1 (Leaderboard Banner) */}
      <AnimatePresence>
        {leadingItem ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/20 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl sm:text-4xl">👑</span>
              <div>
                <span className="text-xs uppercase font-bold tracking-wider opacity-90 block">
                  เมนูคะแนนนำอันดับ 1
                </span>
                <h3 className="text-lg sm:text-xl font-black">
                  {leadingItem.name}
                </h3>
              </div>
            </div>
            <div className="text-right sm:border-l sm:border-white/20 sm:pl-6">
              <div className="text-2xl font-black">{maxVotes} คะแนน</div>
              <div className="text-xs opacity-80">
                จากทั้งหมด {totalVotes} โหวต
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500">
            ยังไม่มีคะแนนโหวตในรอบนี้ ร่วมเป็นคนแรกที่เปิดโหวตได้เลย!
          </div>
        )}
      </AnimatePresence>

      {/* Grid แสดงการ์ดเมนูทั้งหมด */}
      {items.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <p className="text-slate-500">ไม่มีเมนูในระบบแล้ว</p>
          <button
            type="button"
            onClick={onBackToSetup}
            className="mt-3 px-4 py-2 bg-amber-500 text-white text-xs font-semibold rounded-xl"
          >
            กลับไปเพิ่มเมนู
          </button>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {items.map((item) => (
            <VoteCard
              key={item.id}
              item={item}
              voteCount={votes[item.id] || 0}
              isSelected={userVotedId === item.id}
              onVote={onVote}
              onDelete={onDeleteItem}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};