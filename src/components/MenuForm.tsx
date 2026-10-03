import React, { useState, useEffect, useRef } from 'react';
import type { MenuItem, MenuItemInput } from '../types';
import { compressImage } from '../utils/imageCompressor';

interface MenuFormProps {
  onSubmit: (data: MenuItemInput) => void;
  editingItem?: MenuItem | null;
  onCancelEdit?: () => void;
}

export const MenuForm: React.FC<MenuFormProps> = ({
  onSubmit,
  editingItem,
  onCancelEdit,
}) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // เติมข้อมูลลงฟอร์มอัตโนมัติเมื่ออยู่ในโหมดแก้ไข (Edit Mode)
  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setPrice(editingItem.price.toString());
      setImagePreview(editingItem.image);
      setErrorMessage(null);
    } else {
      resetForm();
    }
  }, [editingItem]);

  const resetForm = () => {
    setName('');
    setPrice('');
    setImagePreview(undefined);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // จัดการการเลือกรูปภาพและนำไปบีบอัด
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      setErrorMessage(null);
      // ปรับขนาดและบีบอัดให้ไม่เกิน 800px คุณภาพ 75%
      const compressedBase64 = await compressImage(file, {
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.75,
      });
      setImagePreview(compressedBase64);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการประมวลผลรูปภาพ';
      setErrorMessage(msg);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedName = name.trim();
    const parsedPrice = parseFloat(price);

    // Validation เบื้องต้น
    if (!trimmedName) {
      setErrorMessage('กรุณาระบุชื่อเมนูอาหารหรือเครื่องดื่ม');
      return;
    }

    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setErrorMessage('กรุณาระบุราคาที่ถูกต้อง (ต้องไม่ติดลบ)');
      return;
    }

    try {
      onSubmit({
        name: trimmedName,
        price: parsedPrice,
        image: imagePreview,
      });

      // ถ้าเป็นการเพิ่มใหม่ ให้ล้างฟอร์ม
      if (!editingItem) {
        resetForm();
      }
    } catch (err: unknown) {
      // ดักจับ Error ชื่อซ้ำที่โยนมาจาก Hook
      const msg = err instanceof Error ? err.message : 'ไม่สามารถบันทึกเมนูได้';
      setErrorMessage(msg);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          {editingItem ? '✏️ แก้ไขเมนูอาหาร' : '➕ เพิ่มเมนูใหม่'}
        </h3>
        {editingItem && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline"
          >
            ยกเลิกการแก้ไข
          </button>
        )}
      </div>

      {/* กล่องแสดงข้อความแจ้งเตือน / Error */}
      {errorMessage && (
        <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-300 text-sm flex items-center gap-2">
          <span>⚠️</span>
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="space-y-4">
        {/* ช่องใส่ชื่อเมนู */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            ชื่อเมนู <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder="เช่น ข้าวกะเพราหมูกรอบ, ชาเขียวปั่น"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-colors text-sm"
          />
        </div>

        {/* ช่องใส่ราคา */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            ราคา (บาท) <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0"
            min="0"
            step="any"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-colors text-sm"
          />
        </div>

        {/* ช่องอัปโหลดรูปภาพ */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            รูปภาพประกอบ (ไม่บังคับ)
          </label>

          {imagePreview ? (
            <div className="relative inline-block mt-1">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-rose-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-md hover:bg-rose-600 transition-colors"
                title="ลบรูปภาพ"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="mt-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isCompressing}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 dark:file:bg-slate-800 dark:file:text-amber-400 cursor-pointer"
              />
              {isCompressing && (
                <p className="text-xs text-amber-600 mt-1">กำลังบีบอัดรูปภาพ...</p>
              )}
            </div>
          )}
        </div>

        {/* ปุ่ม Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isCompressing}
            className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-medium text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/40 disabled:opacity-50"
          >
            {editingItem ? 'บันทึกการแก้ไข' : 'เพิ่มเมนูนี้'}
          </button>
        </div>
      </div>
    </form>
  );
};