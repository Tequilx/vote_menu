import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVotingSession } from './hooks/useVotingSession';
import { SetupPhase } from './components/SetupPhase';
import { VotingPhase } from './components/VotingPhase';

export const App: React.FC = () => {
  const {
    phase,
    items,
    votes,
    userVotedId,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    castVote,
    setPhase,
    resetVotesOnly,
    clearAllSession,
  } = useVotingSession();

  const handleClearAllWithConfirm = () => {
    const confirmed = window.confirm(
      'คุณแน่ใจหรือไม่ที่จะลบข้อมูลเมนูและคะแนนโหวตทั้งหมด?'
    );
    if (confirmed) {
      clearAllSession();
    }
  };

  const handleResetVotesWithConfirm = () => {
    const confirmed = window.confirm(
      'คุณแน่ใจหรือไม่ที่จะล้างคะแนนโหวตทั้งหมดเพื่อเริ่มรอบใหม่?'
    );
    if (confirmed) {
      resetVotesOnly();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🍜</span>
            <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              เที่ยงนี้กินอะไรดี?
            </span>
          </div>

          {/* Phase Indicator / Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setPhase('SETUP')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                phase === 'SETUP'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
              }`}
            >
              1. จัดการเมนู
            </button>
            <button
              type="button"
              onClick={() => items.length > 0 && setPhase('VOTING')}
              disabled={items.length === 0}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                phase === 'VOTING'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
              }`}
            >
              2. ห้องโหวต
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {phase === 'SETUP' ? (
            <motion.div
              key="setup"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.2 }}
            >
              <SetupPhase
                items={items}
                onAddItem={addMenuItem}
                onUpdateItem={updateMenuItem}
                onDeleteItem={deleteMenuItem}
                onStartVoting={() => setPhase('VOTING')}
              />
            </motion.div>
          ) : (
            <motion.div
              key="voting"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2 }}
            >
              <VotingPhase
                items={items}
                votes={votes}
                userVotedId={userVotedId}
                onVote={castVote}
                onDeleteItem={deleteMenuItem}
                onBackToSetup={() => setPhase('SETUP')}
                onResetVotes={handleResetVotesWithConfirm}
                onClearAll={handleClearAllWithConfirm}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Simple Footer */}
      <footer className="py-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
        Local-First Voting Web App • บันทึกข้อมูลเฉพาะในเบราว์เซอร์เครื่องนี้
      </footer>
    </div>
  );
};

export default App;