import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MenuItem, MenuItemInput } from '../types';
import { MenuForm } from './MenuForm';
import { ImagePlaceholder } from './ImagePlaceholder';

interface SetupPhaseProps {
  items: MenuItem[];
  onAddItem: (item: MenuItemInput) => void;
  onUpdateItem: (id: string, item: MenuItemInput) => void;
  onDeleteItem: (id: string) => void;
  onStartVoting: () => void;
}

// 📌 คลังเมนูแนะนำทั้งหมด 12 รายการ (ตรวจเช็คและปรับรูปภาพให้ตรงรายการถูกต้อง 100%)
const ALL_SUGGESTED_MENUS: MenuItemInput[] = [
  {
    name: 'ข้าวกะเพราหมูกรอบ ไข่ดาว',
    price: 70,
    image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'ข้าวผัดกุ้งสด',
    price: 65,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'ชาเขียวเย็น',
    price: 40,
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'ก๋วยเตี๋ยวต้มยำหมูเด้ง',
    price: 60,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'ข้าวมันไก่ต้ม',
    price: 55,
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'ส้มตำไทย ไก่ย่าง',
    price: 85,
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'ผัดไทยกุ้งสด',
    price: 70,
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'ข้าวหมูแดง หมูกรอบ',
    price: 60,
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'ชาไทยเย็น (ชาเย็น)',
    price: 40,
    image: 'https://images.unsplash.com/photo-1571934811356-5cc531a6821f?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'อเมริกาโน่เย็น',
    price: 50,
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'ข้าวหน้าเนื้อย่าง',
    price: 89,
    image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'ข้าวคะน้าหมูกรอบ',
    price: 65,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
  },
];

// ฟังก์ชันสุ่มเมนู
const getRandomMenus = (count: number): MenuItemInput[] => {
  const shuffled = [...ALL_SUGGESTED_MENUS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const SetupPhase: React.FC<SetupPhaseProps> = ({
  items,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onStartVoting,
}) => {
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // State สุ่มเมนูแนะนำ 3 รายการ
  const [suggestedMenus, setSuggestedMenus] = useState<MenuItemInput[]>(() =>
    getRandomMenus(3)
  );

  const handleShuffle = () => {
    setSuggestedMenus(getRandomMenus(3));
  };

  const handleFormSubmit = (data: MenuItemInput) => {
    if (editingItem) {
      onUpdateItem(editingItem.id, data);
      setEditingItem(null);
    } else {
      onAddItem(data);
    }
  };

  const handleStartEdit = (item: MenuItem) => {
    setEditingItem(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* ส่วนหัวแนะนำการใช้งาน */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white">
          🍽️ สร้างเมนูอาหาร & เครื่องดื่ม
        </h2>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          ใส่ตัวเลือกเมนูที่คุณและเพื่อนร่วมงานอยากกินในมื้อนี้ เมื่อพร้อมแล้วกดยืนยันเพื่อเปิดห้องโหวตได้ทันที
        </p>
      </div>

      {/* เนื้อหาหลัก: แบ่งฟอร์มกับรายการเมนู */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* คอลัมน์ซ้าย: ฟอร์มกรอกข้อมูล (ขนาด 5 ช่อง) */}
        <div className="lg:col-span-5 sticky top-6">
          <MenuForm
            onSubmit={handleFormSubmit}
            editingItem={editingItem}
            onCancelEdit={handleCancelEdit}
          />
        </div>

        {/* คอลัมน์ขวา: รายการเมนูทั้งหมดที่มีอยู่ (ขนาด 7 ช่อง) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
              รายการที่เพิ่มแล้ว ({items.length})
            </h3>
            {items.length > 0 && (
              <span className="text-xs text-slate-400">
                พร้อมให้ทุกคนโหวต
              </span>
            )}
          </div>

          {items.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
              <span className="text-4xl block mb-3">🍲</span>
              <p className="text-slate-600 dark:text-slate-300 font-medium">ยังไม่มีเมนูในรายการ</p>
              <p className="text-xs text-slate-400 mt-1">
                เริ่มเพิ่มเมนูแรกจากฟอร์มด้านซ้ายได้เลย
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow transition-shadow"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* รูปภาพ Thumbnail หรือ Placeholder */}
                      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImagePlaceholder className="w-full h-full min-h-0 text-[10px]" label="" />
                        )}
                      </div>

                      {/* รายละเอียดชื่อและราคา */}
                      <div className="min-w-0">
                        <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs font-medium text-amber-600 dark:text-amber-400 mt-0.5">
                          ฿{item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* ปุ่มจัดการ (Edit / Delete) */}
                    <div className="flex items-center gap-1 flex-shrink-0 ml-3">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(item)}
                        className="p-2 text-xs font-medium text-slate-600 hover:text-amber-600 hover:bg-amber-50 dark:text-slate-300 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        title="แก้ไขเมนูนี้"
                      >
                        แก้ไข
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteItem(item.id)}
                        className="p-2 text-xs font-medium text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                        title="ลบเมนูนี้"
                      >
                        ลบ
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* ปุ่ม Action เปิดห้องโหวต */}
          <div className="pt-6">
            <button
              type="button"
              onClick={onStartVoting}
              disabled={items.length === 0}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-[0.99] text-white font-bold text-base shadow-lg shadow-amber-500/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
            >
              <span>🚀 ยืนยันและเปิดโหวต</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/20">
                {items.length} เมนู
              </span>
            </button>
            {items.length === 0 && (
              <p className="text-xs text-center text-slate-400 mt-2">
                * ต้องเพิ่มเมนูอย่างน้อย 1 รายการจึงจะเปิดโหวตได้
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 💡 ส่วนกล่องสุ่มเมนูแนะนำยอดฮิต */}
      <div className="p-5 sm:p-6 bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base">
                เมนูแนะนำยอดฮิต
              </h3>
              <p className="text-xs text-slate-400">
                คลิกเพื่อเพิ่มเข้าสู่รายการโหวตได้ทันที
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleShuffle}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-400 bg-slate-100 hover:bg-amber-50 dark:bg-slate-800 dark:hover:bg-slate-700/80 rounded-xl transition-all flex items-center gap-1.5 active:scale-95"
            title="เปลี่ยนชุดเมนูแนะนำ"
          >
            <span>🔀</span>
            <span>สุ่มใหม่</span>
          </button>
        </div>

        {/* Card แสดงเมนูพร้อมรูปภาพที่ตรงปก */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {suggestedMenus.map((suggested, index) => {
            const isAlreadyAdded = items.some(
              (item) => item.name.trim().toLowerCase() === suggested.name.trim().toLowerCase()
            );

            return (
              <div
                key={`${suggested.name}-${index}`}
                className="flex flex-col justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 hover:border-amber-400/50 transition-all shadow-sm group"
              >
                {/* รูปภาพขนาดใหญ่ */}
                <div className="relative w-full h-32 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 flex-shrink-0">
                  {suggested.image ? (
                    <img
                      src={suggested.image}
                      alt={suggested.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">
                      🍲
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-amber-400 font-extrabold text-xs shadow-md">
                    ฿{suggested.price}
                  </div>
                </div>

                {/* ชื่อเมนู & ปุ่มเพิ่มรายการ */}
                <div className="mt-3 flex flex-col justify-between flex-1 gap-2.5">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 line-clamp-1">
                    {suggested.name}
                  </h4>

                  <button
                    type="button"
                    disabled={isAlreadyAdded}
                    onClick={() => onAddItem(suggested)}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                      isAlreadyAdded
                        ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                        : 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm hover:shadow active:scale-95'
                    }`}
                  >
                    {isAlreadyAdded ? '✓ เพิ่มแล้ว' : '+ เพิ่มรายการนี้'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};