# 🍽️ Food Vote - อะไรก็ได้ ไม่มีในโลก (What to Eat?)

โปรเจกต์เว็บไซต์สำหรับโหวตเมนูอาหาร สร้างขึ้นมาเพื่อแก้ปัญหายอดฮิตระดับชาติอย่าง "วันนี้กินอะไรดี?"
โดยให้ผู้ใช้สามารถเสนอและโหวตเมนูอาหารร่วมกันได้ เพื่อให้การตัดสินใจมื้อต่อไปง่ายและรวดเร็วขึ้น

## 🚀 Tech Stack

- **Frontend Build Tool:** [Vite](https://vitejs.dev/) - สำหรับการพัฒนาที่รวดเร็ว
- **Language:** TypeScript
- **Linter:** [Oxlint](https://oxc-project.github.io/docs/guide/usage/linter.html) - ตัว Linter ที่ทำงานได้รวดเร็วมาก

## ⚙️ การติดตั้งและรันโปรเจกต์ (Getting Started)

1. **โคลนโปรเจกต์**

   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. **ติดตั้ง Dependencies** (คุณสามารถใช้ `npm`, `yarn` หรือ `pnpm` ได้ตามที่ถนัด)

   ```bash
   npm install
   ```

3. **รันเซิร์ฟเวอร์จำลองสำหรับพัฒนา**
   ```bash
   npm run dev
   ```
   จากนั้นเปิดเว็บบราวเซอร์ไปที่ `http://localhost:5173` (หรือพอร์ตที่ Vite กำหนด)

## 📜 คำสั่ง Scripts ที่มีให้ใช้งาน

คำสั่งต่าง ๆ ถูกตั้งค่าไว้ใน `package.json` คุณสามารถรันคำสั่งเหล่านี้ผ่าน npm, yarn หรือ pnpm ได้:

- `npm run dev`: เริ่มต้น Development Server ด้วย Vite สำหรับการเขียนโค้ดและทดสอบแบบ Real-time
- `npm run build`: ทำการตรวจสอบ Type ด้วย TypeScript (`tsc -b`) และ Build โปรเจกต์สำหรับการนำไปใช้งานจริง (Production)
- `npm run lint`: ตรวจสอบความถูกต้องและคุณภาพของโค้ดด้วย `oxlint`
- `npm run preview`: รันเซิร์ฟเวอร์จำลองเพื่อทดสอบไฟล์ที่ได้จากการ Build (โฟลเดอร์ `dist`) ว่าทำงานได้ปกติหรือไม่ก่อนนำไป Deploy จริง

## 📌 แผนการพัฒนาในอนาคต (To-Do / Roadmap)

_(ส่วนนี้สามารถลบหรือแก้ไขได้ตามจริง)_

- [ ] ระบบเพิ่มเมนูอาหารใหม่
- [ ] ระบบนับคะแนนโหวตแบบเรียลไทม์
- [ ] ฟังก์ชันสุ่มเมนูอาหาร (Randomizer) สำหรับคนที่ขี้เกียจโหวต

## 🤝 การมีส่วนร่วม (Contributing)

หากพบปัญหาในการใช้งานหรือมีข้อเสนอแนะเพิ่มเติม สามารถเปิด [Issues](https://github.com/your-username/your-repo-name/issues) หรือสร้าง Pull Request เข้ามาได้เลยครับ!
