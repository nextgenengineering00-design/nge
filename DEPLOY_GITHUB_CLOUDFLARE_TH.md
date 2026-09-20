# GitHub + Cloudflare Auto Deploy แบบเด็ก 10 ขวบ

## ภาพจำง่าย ๆ

- โฟลเดอร์ในคอม = สมุดต้นฉบับ
- GitHub = ตู้เซฟเก็บสมุดและประวัติทุกครั้งที่แก้
- Cloudflare Worker = ร้านที่เอาสมุดไปประกอบเป็นเว็บให้คนเข้า
- Auto Deploy = ทุกครั้งที่ส่งสมุดเวอร์ชันใหม่เข้า GitHub ร้านจะสร้างเว็บใหม่ให้อัตโนมัติ

เว็บ HTML เดิมเหมือนของเล่นสำเร็จรูป จึงลากโฟลเดอร์ขึ้นได้เลย แต่ Next.js เหมือนชุด LEGO ที่ต้องมีเครื่องประกอบ จึงต้องให้ Cloudflare รันคำสั่ง build ก่อน

## ครั้งแรก ทำตามนี้ครั้งเดียว

1. สร้าง repository ชื่อ `ngebuild-next` ใน GitHub และตั้งเป็น Private
2. ส่งไฟล์ขึ้น branch `main`
3. เข้า Cloudflare > Workers & Pages > Create application > Import a repository
4. เลือก GitHub และ repository `ngebuild-next`
5. ตั้งค่า:
   - Worker name: `ngebuild-next`
   - Production branch: `main`
   - Build command: `npm run build:vinext`
   - Deploy command: `npm run deploy:vinext`
   - Root directory: `/`
6. เพิ่ม Runtime variables/secrets ใน Worker ตามชื่อจาก `.env.example` โดยใช้ค่าจริงจาก `.env.local` ห้ามอัปโหลด `.env.local` เข้า GitHub
7. กด Save and Deploy
8. ที่ Worker > Settings > Domains & Routes เพิ่ม Custom domain `ngebuild.com` และ `www.ngebuild.com`

## หลังจากตั้งเสร็จ

ทุกครั้งที่แก้เว็บ ใช้เพียง:

```powershell
git add .
git commit -m "อัปเดตเว็บไซต์"
git push
```

เมื่อ `git push` สำเร็จ Cloudflare จะ build และ deploy ให้เอง

## Backend ของเว็บนี้

- Framework ฝั่งหน้าเว็บและ API: **Next.js 16 App Router**
- UI: **React 19 + Tailwind CSS 4**
- API หลังบ้าน: **Next.js Route Handlers** ใน `app/api`
- ฐานข้อมูล/CRM: **Supabase (PostgreSQL)**
- AI endpoint ที่มีอยู่: **OpenAI SDK**
- ที่รันเว็บจริง: **Cloudflare Workers ผ่าน Vinext**

จึงไม่มี Express, Laravel หรือ PHP แยกอีกตัว เพราะ Next.js ทำหน้าที่ทั้งหน้าเว็บและ API ในโปรเจกต์เดียว
