import { useState, useEffect, useCallback } from 'react';
import type { MenuItem, MenuItemInput, VotingSessionState, AppPhase } from '../types';
const STORAGE_KEY = 'office_lunch_voting_session';

const initialSessionState: VotingSessionState = {
  phase: 'SETUP',
  items: [],
  votes: {},
  userVotedId: null,
};

export const useVotingSession = () => {
  // 1. โหลดข้อมูลเริ่มต้นจาก LocalStorage (Lazy initialization)
  const [session, setSession] = useState<VotingSessionState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('ไม่สามารถอ่านข้อมูลจาก LocalStorage ได้:', error);
    }
    return initialSessionState;
  });

  // 2. Sync ข้อมูลลง LocalStorage ทุกครั้งที่ State มีการเปลี่ยนแปลง
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch (error) {
      console.error('ไม่สามารถบันทึกลง LocalStorage ได้ (พื้นที่อาจเต็ม):', error);
    }
  }, [session]);

  // ฟังก์ชันช่วยเช็คชื่อซ้ำ (Case-insensitive & ตัดช่องว่างหัวท้าย)
  const isDuplicateName = useCallback(
    (name: string, excludeId?: string): boolean => {
      const target = name.trim().toLowerCase();
      return session.items.some(
        (item) => item.id !== excludeId && item.name.trim().toLowerCase() === target
      );
    },
    [session.items]
  );

  // 3. จัดการเมนู: เพิ่มเมนูใหม่
  const addMenuItem = useCallback(
    (input: MenuItemInput) => {
      if (isDuplicateName(input.name)) {
        throw new Error(`ชื่อเมนู "${input.name.trim()}" มีอยู่ในรายการแล้ว`);
      }

      const newItem: MenuItem = {
        id: crypto.randomUUID(),
        name: input.name.trim(),
        price: Number(input.price),
        image: input.image,
        createdAt: Date.now(),
      };

      setSession((prev) => ({
        ...prev,
        items: [...prev.items, newItem],
        votes: { ...prev.votes, [newItem.id]: 0 },
      }));
    },
    [isDuplicateName]
  );

  // 4. จัดการเมนู: แก้ไขเมนูเดิม
  const updateMenuItem = useCallback(
    (id: string, input: MenuItemInput) => {
      if (isDuplicateName(input.name, id)) {
        throw new Error(`ชื่อเมนู "${input.name.trim()}" มีอยู่ในรายการแล้ว`);
      }

      setSession((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.id === id
            ? {
                ...item,
                name: input.name.trim(),
                price: Number(input.price),
                image: input.image !== undefined ? input.image : item.image,
              }
            : item
        ),
      }));
    },
    [isDuplicateName]
  );

  // 5. จัดการเมนู: ลบเมนู (ถ้าลบเมนูที่เคยโหวตไว้ ให้เคลียร์สิทธิ์ด้วย)
  const deleteMenuItem = useCallback((id: string) => {
    setSession((prev) => {
      const remainingItems = prev.items.filter((item) => item.id !== id);
      const updatedVotes = { ...prev.votes };
      delete updatedVotes[id];

      return {
        ...prev,
        items: remainingItems,
        votes: updatedVotes,
        userVotedId: prev.userVotedId === id ? null : prev.userVotedId,
      };
    });
  }, []);

  // 6. ตรรกะการโหวต: โหวต 1 เสียง / ย้ายเมนู / กดยกเลิกโหวต
  const castVote = useCallback((targetMenuId: string) => {
    setSession((prev) => {
      const currentVotedId = prev.userVotedId;
      const newVotes = { ...prev.votes };

      // Ensure key มีอยู่จริง
      if (typeof newVotes[targetMenuId] !== 'number') {
        newVotes[targetMenuId] = 0;
      }

      // กรณีที่ 1: กดซ้ำเมนูเดิมที่เคยโหวตไว้ -> ยกเลิกการโหวต
      if (currentVotedId === targetMenuId) {
        newVotes[targetMenuId] = Math.max(0, newVotes[targetMenuId] - 1);
        return {
          ...prev,
          votes: newVotes,
          userVotedId: null,
        };
      }

      // กรณีที่ 2: เคยโหวตเมนูอื่นมาก่อน -> หักคะแนนเดิมออก 1 แล้วบวกให้เมนูใหม่
      if (currentVotedId && newVotes[currentVotedId]) {
        newVotes[currentVotedId] = Math.max(0, newVotes[currentVotedId] - 1);
      }

      // บวกคะแนนให้เมนูที่เลือกใหม่
      newVotes[targetMenuId] += 1;

      return {
        ...prev,
        votes: newVotes,
        userVotedId: targetMenuId,
      };
    });
  }, []);

  // 7. ควบคุม Step ของหน้าจอ
  const setPhase = useCallback((phase: AppPhase) => {
    setSession((prev) => ({ ...prev, phase }));
  }, []);

  // 8. รีเซ็ตคะแนนโหวตทั้งหมด (เก็บเมนูไว้ เริ่มโหวตรอบใหม่)
  const resetVotesOnly = useCallback(() => {
    setSession((prev) => {
      const clearedVotes: Record<string, number> = {};
      prev.items.forEach((item) => {
        clearedVotes[item.id] = 0;
      });
      return {
        ...prev,
        votes: clearedVotes,
        userVotedId: null,
      };
    });
  }, []);

  // 9. เคลียร์ข้อมูลทิ้งทั้งหมด
  const clearAllSession = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSession(initialSessionState);
  }, []);

  return {
    phase: session.phase,
    items: session.items,
    votes: session.votes,
    userVotedId: session.userVotedId,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    castVote,
    setPhase,
    resetVotesOnly,
    clearAllSession,
  };
};