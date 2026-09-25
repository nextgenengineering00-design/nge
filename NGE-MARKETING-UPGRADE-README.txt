NGE Marketing / Conversion Upgrade — 25 Sep 2026

สิ่งที่ทำแล้ว
1) Positioning หน้าแรก
   - รับเหมาก่อสร้างโดยทีมวิศวกร
   - ต่อยอดประสบการณ์งานภาครัฐกว่า 40 ปี
   - จดทะเบียน พ.ศ. 2528 / วิศวกรโยธา ภย. 60575 / ภาครัฐ + เอกชน

2) Conversion หลัก: ขอประเมินเบื้องต้นจากรูปหน้างาน
   - CTA หลัง Hero
   - CTA หลัง Services
   - CTA หลัง Projects
   - CTA ก่อน Footer
   - Contact Form รองรับรูปสูงสุด 5 รูป
   - หน้า Landing Page ยิงแอด 3 หน้า
     /construction-quote
     /renovation-quote
     /home-extension-quote
   - Landing Page ทั้ง 3 เป็น noindex,follow เพื่อไม่แย่ง SEO กับหน้าบริการหลัก

3) Review
   - เอาเมนูรีวิวออกจาก Desktop / Mobile / Footer
   - /reviews redirect ถาวรไป /projects#reviews
   - ย้าย Google Business / Facebook Reviews ไปอยู่ในหน้าผลงาน
   - เอา reviews ออกจาก sitemap

4) Lead Tracking
   GA4 Event:
   - click_phone
   - click_line
   - generate_lead
   - company_profile_download
   - project_click
   - photo_estimate_cta
   - meta_landing_view
   - click_google_business
   - click_facebook_reviews

   GA4 ID ปัจจุบัน: G-QV4QE05VM1
   GTM: รองรับแล้ว แต่ต้องใส่ GTM-XXXXXXX ใน public/legacy/site-config.js
   Meta Pixel: รองรับแล้ว แต่ต้องใส่ Pixel ID ใน public/legacy/site-config.js

5) UTM / Meta Ads
   ใช้ URL Parameters นี้ใน Meta Ads:
   utm_source=meta&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{adset.name}}

6) ระบบรูปหน้างานใน CRM
   - รัน Supabase migration:
     supabase/migrations/20260925093000_lead_photo_estimates.sql
   - ต้องมี SUPABASE_SECRET_KEY ในฝั่ง Server จึงจะอัปโหลดรูปเข้า private bucket ได้
   - ถ้ายังไม่ได้รัน migration / ไม่มี secret key ระบบยังรับ Lead ได้ แต่หน้าเว็บจะแจ้งให้ลูกค้าส่งรูปทาง LINE แทน
   - CRM แสดงรูปด้วย signed URL อายุ 30 นาที

ขั้นตอนก่อน Deploy
A. นำไฟล์ Patch ไปทับโปรเจกต์
B. รัน Supabase migration ใหม่
C. ตรวจ NEXT_PUBLIC_SUPABASE_URL และ SUPABASE_SECRET_KEY
D. ถ้ามี GTM / Meta Pixel ให้ใส่ ID ใน public/legacy/site-config.js
E. Deploy
F. ทดสอบ:
   - โทร / LINE
   - ดาวน์โหลด Company Profile
   - คลิกผลงาน
   - ส่ง Lead แบบไม่มีรูป
   - ส่ง Lead พร้อมรูป 1–5 รูป
   - เปิด Lead ใน /crm แล้วเช็กรูป
   - เปิด Landing Page พร้อม UTM แล้วเช็ก GA4 DebugView / Tag Assistant

หมายเหตุ
- ไม่ได้ใส่ Landing Page ยิงแอดลง sitemap
- ไม่ได้ลบไฟล์ reviews.html เดิม เพื่อเก็บไว้เป็น source/archive แต่ route /reviews จะ redirect ไปหน้า Projects
- Full source ZIP ที่ส่งกลับไม่รวม node_modules และ dist เพื่อลดขนาดไฟล์และไม่พา cache/build เก่ากลับไป

7) Merge v19 (ready for GitHub / Cloudflare)
   - รวม root config ของโปรเจกต์จริงแล้ว: package.json, package-lock.json, Next/Vite/Wrangler/TypeScript/ESLint/PostCSS
   - ไม่รวม .env.local, node_modules, .next, dist หรือ tsconfig.tsbuildinfo
   - /reviews.html redirect ตรงไป /projects#reviews ลด redirect chain
   - ก่อนเปิด photo upload จริง ต้องเพิ่ม SUPABASE_SECRET_KEY เป็น Cloudflare Worker Secret และรัน migration ที่ระบุด้านบน
