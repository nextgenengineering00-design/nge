# NGE Build — Next.js

เว็บไซต์จริงอยู่ในโปรเจกต์นี้แล้ว ห้ามดับเบิลคลิก `index.html` เพราะเว็บนี้ไม่ใช่เว็บ HTML แบบลากโฟลเดอร์ขึ้นโฮสต์อีกต่อไป

## เปิดเว็บบนเครื่อง

ดับเบิลคลิก `OPEN_NEXTJS_WEBSITE.cmd` แล้วเปิด <http://localhost:3000>

หรือใช้คำสั่ง:

```powershell
npm install
npm run dev
```

## โฟลเดอร์ที่ต้องรู้

- `app` — หน้าเว็บและ API ของ Next.js
- `components` — ชิ้นส่วน React ที่ใช้ซ้ำ
- `lib` — ข้อมูลและฟังก์ชันกลาง
- `legacy-source` — เนื้อหาหน้าเว็บเดิมที่ Next.js ยังอ่านอยู่ ห้ามลบ
- `public` — รูป, CSS และ JavaScript ที่เบราว์เซอร์โหลด
- `supabase` — migration ของฐานข้อมูล
- `tests` — ไฟล์ตรวจคุณภาพเว็บ

โฟลเดอร์ `.next`, `dist` และ `node_modules` เป็นไฟล์ที่เครื่องสร้างอัตโนมัติ ไม่ต้องอัปโหลดเอง และ GitHub จะไม่เก็บ

## ตรวจเว็บก่อนส่งขึ้นจริง

```powershell
npm run check
npm run build:vinext
```

## Deploy

อ่านขั้นตอนสั้น ๆ ที่ `DEPLOY_GITHUB_CLOUDFLARE_TH.md`
