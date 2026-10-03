/**
 * Utility สำหรับบีบอัดและปรับขนาดรูปภาพฝั่ง Client ก่อนเก็บลง LocalStorage
 */

interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 ถึง 1.0
  mimeType?: 'image/webp' | 'image/jpeg';
}

export const compressImage = (
  file: File,
  options: CompressionOptions = {}
): Promise<string> => {
  const {
    maxWidth = 800,
    maxHeight = 800,
    quality = 0.75,
    mimeType = 'image/webp',
  } = options;

  return new Promise((resolve, reject) => {
    // 1. ตรวจสอบเบื้องต้นว่าเป็นไฟล์รูปภาพหรือไม่
    if (!file.type.startsWith('image/')) {
      return reject(new Error('ไฟล์ที่เลือกไม่ใช่รูปภาพ'));
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        // 2. คำนวณขนาดภาพใหม่โดยคงสัดส่วนเดิม (Aspect Ratio)
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        // 3. วาดรูปลง HTML5 Canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('ไม่สามารถประมวลผล Canvas ได้'));
        }

        // ปรับแต่งให้ภาพคมชัดขึ้นขณะ Render
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // 4. แปลงภาพเป็น Base64 URL ตาม Quality และ Format ที่กำหนด
        try {
          const compressedDataUrl = canvas.toDataURL(mimeType, quality);
          resolve(compressedDataUrl);
        } catch (error) {
          // กรณีเบราว์เซอร์บางรุ่นไม่รองรับ webp ให้ Fallback เป็น jpeg
          const fallbackDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(fallbackDataUrl);
        }
      };

      img.onerror = () => {
        reject(new Error('เกิดข้อผิดพลาดในการโหลดรูปภาพ'));
      };
    };

    reader.onerror = () => {
      reject(new Error('ไม่สามารถอ่านไฟล์ภาพได้'));
    };
  });
};