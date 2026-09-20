/*
 * NGE production configuration
 * ใส่ข้อมูลจริงก่อนเผยแพร่ เว็บไซต์จะทำงานได้แม้เว้นว่าง แต่ฟอร์ม Supabase
 * และลิงก์ติดต่อจะยังไม่ถูกเปิดใช้งานจนกว่าจะกำหนดค่า
 */
window.NGE_CONFIG = Object.freeze({
  phone: "0982799145",
  phoneDisplay: "098-279-9145",
  phoneSecondary: "0968814033",
  phoneSecondaryDisplay: "096-881-4033",
  lineUrl: "https://lin.ee/u45yvnc",
  lineDisplay: "@522magc",
  facebookUrl: "https://www.facebook.com/nextgenength/",
  facebookReviewsUrl: "https://www.facebook.com/nextgenength/reviews/",
  googleBusinessUrl: "https://maps.app.goo.gl/jKKSr42Ax6v7HqWRA",

  // Project Settings > API ใน Supabase (ใช้เฉพาะ Project URL และ Publishable key)
  supabaseUrl: "https://yryfrpooocpwnfilfsho.supabase.co",
  supabasePublishableKey: "sb_publishable_qP9UqdOsy-2rUN7ek4DrzQ_19sBGZIx",
  // รองรับโปรเจกต์เก่าที่ยังใช้ anon public key
  supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlyeWZycG9vb2Nwd25maWxmc2hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwMTEzNzYsImV4cCI6MjEwMzU4NzM3Nn0.Z7nuGOlPmM0muiaSNKA7IhbaHdv7FQFFP4e4J5mV4nc",

  // ไม่บังคับ: สคริปต์จะโหลดต่อเมื่อผู้ใช้ยินยอมคุกกี้ประเภทนั้นแล้วเท่านั้น
  googleAnalyticsId: "G-QV4QE05VM1",
  metaPixelId: ""
});
