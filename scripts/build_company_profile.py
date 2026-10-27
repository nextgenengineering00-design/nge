from pathlib import Path
from io import BytesIO
import cairosvg
from PIL import Image
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor, Color
from reportlab.lib.utils import ImageReader
from reportlab.graphics.barcode.qr import QrCodeWidget
from reportlab.graphics.shapes import Drawing
from reportlab.graphics import renderPDF

ROOT = Path(__file__).parent
A = ROOT / 'profile-assets'
OUT = ROOT.parent / 'public' / 'assets' / 'NGE-Company-Profile.pdf'
OUT.parent.mkdir(exist_ok=True)
W,H = 960,540
NAVY=HexColor('#14283B'); DARK=HexColor('#0C1D2E'); GOLD=HexColor('#D99A22')
CYAN=GOLD; PALE=HexColor('#F5F7F8'); INK=HexColor('#172B3D'); MUTED=HexColor('#596B79')
LINE=HexColor('#DDE4E8'); WHITE=HexColor('#FFFFFF'); BLUE=HexColor('#EAF1F5')
pdfmetrics.registerFont(TTFont('Sarabun',str(A/'Sarabun-Regular.ttf')))
pdfmetrics.registerFont(TTFont('Sarabun-Bold',str(A/'Sarabun-Bold.ttf')))
pdfmetrics.registerFont(TTFont('Kanit-SemiBold',str(ROOT/'assets'/'Kanit-SemiBold.ttf')))
c=canvas.Canvas(str(OUT),pagesize=(W,H),pageCompression=1)
c.setTitle('NGE Company Profile | Next Gen Engineering')
c.setAuthor('Next Gen Engineering')

def rect(x,y,w,h,fill,r=0,stroke=None):
    c.setFillColor(fill)
    if stroke: c.setStrokeColor(stroke)
    if r: c.roundRect(x,y,w,h,r,stroke=bool(stroke),fill=1)
    else: c.rect(x,y,w,h,stroke=bool(stroke),fill=1)

def txt(x,y,s,size=15,bold=False,color=INK):
    c.setFillColor(color); c.setFont('Kanit-SemiBold' if bold else 'Sarabun',size); c.drawString(x,y,s)

def lines(x,y,items,size=15,leading=23,bold=False,color=INK):
    for i,s in enumerate(items): txt(x,y-i*leading,s,size,bold,color)

def icon(name,x,y,size=31,color='#D99A22'):
    raw=(A/(name+'.svg')).read_text(encoding='utf-8').replace('<svg','<svg fill="'+color+'"',1)
    png=cairosvg.svg2png(bytestring=raw.encode(),output_width=128,output_height=128)
    c.drawImage(ImageReader(BytesIO(png)),x,y,size,size,mask='auto')

def fit_image(path,x,y,w,h,crop=True):
    im=path if isinstance(path,Image.Image) else Image.open(path); iw,ih=im.size
    if crop:
        scale=max(w/iw,h/ih); sw,sh=iw*scale,ih*scale
        c.saveState(); p=c.beginPath(); p.rect(x,y,w,h); c.clipPath(p,stroke=0)
        c.drawImage(ImageReader(im),x+(w-sw)/2,y+(h-sh)/2,sw,sh,mask='auto')
        c.restoreState()
    else:
        scale=min(w/iw,h/ih); sw,sh=iw*scale,ih*scale
        c.drawImage(ImageReader(im),x+(w-sw)/2,y+(h-sh)/2,sw,sh,mask='auto')

def grid_pattern(x,y,w,h,step=18,color=HexColor('#E7EFF2')):
    c.saveState(); c.setStrokeColor(color); c.setLineWidth(.35)
    xx=x
    while xx<=x+w: c.line(xx,y,xx,y+h); xx+=step
    yy=y
    while yy<=y+h: c.line(x,yy,x+w,yy); yy+=step
    c.restoreState()

def base(n,kicker,title,sub=None,dark=False):
    bg=DARK if dark else WHITE
    rect(0,0,W,H,bg)
    if not dark: grid_pattern(724,58,188,118,16)
    rect(48,502,56,3,CYAN)
    txt(48,478,kicker.upper(),11,True,CYAN if not dark else GOLD)
    txt(48,437,title,30,True,WHITE if dark else NAVY)
    if sub: txt(48,411,sub,14.5,False,HexColor('#C7D4DE') if dark else MUTED)
    fit_image(A/'page1-fzImg0.png',850,448,58,58,False)
    c.setStrokeColor(HexColor('#29475A') if dark else LINE); c.setLineWidth(.8); c.line(48,47,912,47)
    txt(48,25,'NEXT GEN ENGINEERING',9.5,True,GOLD if dark else NAVY)
    txt(764,25,f'NGEBUILD.COM   {n:02d} / 19',9.5,False,HexColor('#C7D4DE') if dark else MUTED)

def card(x,y,w,h,title,desc,ic=None):
    rect(x,y,w,h,WHITE,8,LINE)
    rect(x,y+h-4,w,4,CYAN)
    if ic: icon(ic,x+18,y+h-51,27,'#D99A22')
    txt(x+18,y+h-80,title,18,True,NAVY)
    lines(x+18,y+h-106,desc,13.5,19,color=MUTED)

def finish(): c.showPage()

# 01 / Cover — light architectural editorial layout.
rect(0,0,W,H,WHITE)
grid_pattern(42,35,315,160,18)
rect(0,0,10,H,CYAN)
rect(58,487,72,3,CYAN)
txt(58,462,'COMPANY PROFILE',16,True,NAVY)
txt(58,413,'NEXT GEN',42,True,NAVY)
txt(58,367,'ENGINEERING',42,True,NAVY)
txt(58,329,'ห้างหุ้นส่วนจำกัด รวมพลชัย เอ็นจิเนียริ่ง',18,True,INK)
txt(58,302,'งานก่อสร้างที่ตรวจสอบได้ ตั้งแต่เริ่มจนส่งมอบ',14.5,False,MUTED)
fit_image(A/'page1-fzImg0.png',813,437,92,82,False)
cover_tiles=[
    ('page8-Image43.jpg',0,133,210,142),
    ('page7-Image40.jpg',210,133,190,142),
    ('page12-Image55.jpg',400,133,190,142),
    ('page9-Image46.jpg',590,133,180,142),
    ('page13-Image58.jpg',770,133,190,142),
]
for photo,x,y,w,h in cover_tiles: fit_image(A/photo,x,y,w,h,True)
c.setStrokeColor(WHITE); c.setLineWidth(2)
for x in (210,400,590,770): c.line(x,133,x,275)
rect(58,75,5,32,CYAN)
txt(78,91,'ENGINEERING & CONSTRUCTION  /  SINCE 1985',12,True,NAVY)
txt(78,69,'NGEBUILD.COM',11,False,MUTED)
fit_image(A/'page1-Image21.png',838,52,67,67,False)
finish()

# 02 / Company
base(2,'01 / Company','ประวัติบริษัท','ข้อมูลนิติบุคคลและแนวทางการทำงาน')
rect(48,88,520,310,PALE,16)
txt(76,352,'หจก. รวมพลชัย เอ็นจิเนียริ่ง',27,True,NAVY)
lines(76,313,['จดทะเบียนเป็นห้างหุ้นส่วนจำกัดเมื่อวันที่ 5 พฤศจิกายน 2528',
              'ดำเนินงานรับเหมาก่อสร้างครบวงจร โดยมี NGE',
              'Next Gen Engineering เป็นชื่อแบรนด์ที่ใช้สื่อสารบริการ'],17,28,color=INK)
c.setStrokeColor(LINE); c.line(76,210,538,210)
icon('verified',76,157,30)
txt(115,168,'ประสบการณ์กว่า 40 ปี',19,True,NAVY)
txt(115,142,'งานภาครัฐและงานก่อสร้างหลายประเภท',14,False,MUTED)
rect(591,88,321,310,NAVY,16)
txt(620,354,'ข้อมูลติดต่อ',21,True,WHITE)
txt(620,317,'สำนักงาน NGE',12,True,GOLD)
lines(620,292,['98/72 หมู่บ้านกฤษดาลากูน','นนทบุรี 11130'],14.5,23,color=WHITE)
c.setStrokeColor(HexColor('#415569')); c.line(620,241,882,241)
txt(620,216,'โทร 098-279-9145',15,True,WHITE)
txt(620,191,'LINE @522magc',15,True,WHITE)
txt(620,165,'nextgenengineering00@gmail.com',13,False,HexColor('#D7E0E7'))
txt(620,139,'ngebuild.com',14,False,HexColor('#D7E0E7'))
c.linkURL('tel:+66982799145',(620,207,882,232),relative=0,thickness=0)
c.linkURL('https://lin.ee/u45yvnc',(620,181,882,206),relative=0,thickness=0)
c.linkURL('mailto:nextgenengineering00@gmail.com',(620,154,882,177),relative=0,thickness=0)
c.linkURL('https://ngebuild.com/contact',(620,128,882,151),relative=0,thickness=0)
finish()

# 03 / Reasons
base(3,'02 / Why NGE','ทำไมต้องเลือก NGE','ประสบการณ์ มาตรฐาน และความรับผิดชอบที่พิสูจน์จากงานจริง')
rect(48,250,416,143,BLUE,8,LINE); rect(480,250,432,143,BLUE,8,LINE)
rect(48,389,416,4,CYAN); rect(480,389,432,4,CYAN)
icon('verified',70,333,34,'#D99A22'); icon('assignment_turned_in',501,333,34,'#D99A22')
txt(70,295,'40+ ปี',31,True,NAVY); txt(501,295,'300+ ผลงาน',31,True,NAVY)
txt(70,270,'ประสบการณ์โครงการภาครัฐ',15,False,MUTED)
txt(501,270,'ผ่านงานหลายประเภทและหลายขนาด',15,False,MUTED)
card(48,83,416,147,'ควบคุมงานอย่างเป็นระบบ',
     ['ควบคุมแบบ ข้อกำหนด วัสดุ ระยะเวลา', 'ตรวจคุณภาพก่อนส่งมอบ และรายงานความคืบหน้า'], 'fact_check')
card(480,83,432,147,'รับผิดชอบหลังส่งมอบ',
     ['ตรวจเก็บรายละเอียดและรับประกันตามสัญญา', 'มีทีมดูแลเมื่อพบข้อบกพร่องจากงานก่อสร้าง'], 'handyman')
finish()

# 04 / Services
base(4,'03 / Services','ขอบเขตงานบริการ','บริการก่อสร้าง ออกแบบ และปรับปรุงแบบครบวงจร')
card(48,215,272,180,'งานก่อสร้าง',
     ['อาคารราชการ โรงเรียน หอพัก', 'บ้านพักอาศัย และอาคารใช้งาน'], 'home_repair_service')
card(344,215,272,180,'งานปรับปรุง',
     ['รีโนเวทบ้านพักอาศัย สำนักงาน', 'ร้านค้า และงานต่อเติมอาคาร'], 'build')
card(640,215,272,180,'ออกแบบและอนุญาต',
     ['ออกแบบบ้านและอาคาร พร้อมยื่นขอ', 'อนุญาต โดยสถาปนิกและวิศวกร'], 'fact_check')
rect(48,91,864,93,BLUE,13)
txt(75,144,'แนวทางดำเนินงาน',17,True,NAVY)
txt(75,111,'รับโจทย์และสำรวจ  →  ออกแบบ/ประมาณราคา  →  ควบคุมก่อสร้าง  →  ตรวจรับและส่งมอบ',16,False,INK)
finish()

references=[
('01','อาคารกองบังคับการกรมสวัสดิการทหารอากาศ','กรมช่างโยธาทหารอากาศ','2558'),
('02','โรงทหาร 150 คน กองพลทหารม้าที่ 2 รักษาพระองค์','กรมยุทธโยธาทหารบก','2561'),
('03','อาคารคอกม้าทรงประจำพระองค์ กองพลทหารม้าที่ 2','กรมยุทธโยธาทหารบก','2561'),
('04','ปรับปรุงอาคารและสิ่งปลูกสร้าง ศูนย์นักศึกษาวิชาทหาร','หน่วยบัญชาการรักษาดินแดน','2562'),
('05','อาคารพักอาศัยรองรับการปรับย้ายหน่วย มทบ.11','กรมยุทธโยธาทหารบก','2563'),
('06','อาคารและสิ่งปลูกสร้าง กรมทหารม้าที่ 1 รักษาพระองค์','กรมยุทธโยธาทหารบก','2563'),
('07','โรงทหาร 150 คน กองพลทหารม้าที่ 2 รักษาพระองค์','กรมยุทธโยธาทหารบก','2564'),
('08','อาคารพร้อมสิ่งอำนวยความสะดวก 5 หลัง','กรมยุทธโยธาทหารบก','2564'),
('09','อาคารกองร้อยสนับสนุนส่วนหน้า พื้นที่สระบุรี','กรมยุทธโยธาทหารบก','2565'),
]
def reference_page(page,heading,rows):
    base(page,'04 / Project references',heading,'ตัวอย่างรายการอ้างอิงจากโครงการภาครัฐ')
    rect(48,367,864,37,CYAN,4)
    txt(66,379,'ลำดับ',14,True,WHITE);txt(138,379,'โครงการ',14,True,WHITE)
    txt(695,379,'หน่วยงาน',14,True,WHITE);txt(861,379,'ปี',14,True,WHITE)
    y=311
    for num,name,agency,year in rows:
        rect(48,y-11,864,57,PALE if int(num)%2 else WHITE,6,LINE)
        txt(67,y+9,num,17,True,GOLD)
        txt(138,y+9,name,14,True,NAVY)
        txt(695,y+9,agency,11.5,False,MUTED)
        txt(861,y+9,year,13,True,NAVY)
        y-=65
    finish()
reference_page(5,'ผลงานอ้างอิง  /  01',references[:5])
reference_page(6,'ผลงานอ้างอิง  /  02',references[5:])

projects=[
(7,'อาคารกองบังคับการ','กรมสวัสดิการทหารอากาศ และกองอาชีวะสงเคราะห์','38,840,000','page7-Image40.jpg'),
(8,'อาคารพักอาศัย มทบ.11','รองรับการปรับย้ายหน่วย เขตหลักสี่ กรุงเทพมหานคร','60,660,000','page8-Image43.jpg'),
(9,'อาคารคลังพลาธิการ','สำนักงานส่งกำลังบำรุง เขตดุสิต กรุงเทพมหานคร','32,390,000','page9-Image46.jpg'),
(10,'โรงทหาร 150 คน','กองพลทหารม้าที่ 2 รักษาพระองค์ กรุงเทพมหานคร','27,440,000','page10-Image49.jpg'),
(11,'อาคารเรียนและโรงนอนทหาร','จุ 90 เตียง พื้นที่ใช้สอย 2,400 ตร.ม. สูง 2 ชั้น','39,500,000','page11-Image52.jpg'),
(12,'สำนักงานและคลังเก็บสิ่งอุปกรณ์','สายยุทธโยธา มณฑลทหารบกที่ 18 จังหวัดสระบุรี','13,120,000','page12-Image55.jpg'),
(13,'อาคารเรียนครบรอบ 25 ปี','โรงเรียนกาญจนาภิเษกฯ','39,500,000','page13-Image58.jpg'),
]
for page,title,sub,price,img in projects:
    base(page,'05 / Selected projects','ผลงานก่อสร้างที่ส่งมอบแล้ว','ภาพโครงการจาก Company Profile ฉบับเดิม')
    rect(48,91,864,310,PALE,8,LINE)
    grid_pattern(48,91,373,310,20)
    rect(48,397,864,4,CYAN)
    if page == 11:
        c.saveState()
        c.translate(2*421+491,2*91+310)
        c.rotate(180)
        fit_image(A/img,421,91,491,310,True)
        c.restoreState()
    else:
        fit_image(A/img,421,91,491,310,True)
    txt(75,350,f'PROJECT {page-6:02d}',13,True,GOLD)
    txt(75,301,title,25,True,NAVY)
    # Keep supporting description in two short lines when needed.
    words=sub.split(' '); desc=[]; current=''
    for word in words:
        if len(current+word)>31 and current: desc.append(current); current=word
        else: current=(current+' '+word).strip()
    if current: desc.append(current)
    lines(75,267,desc[:3],15.5,23,color=MUTED)
    c.setStrokeColor(LINE); c.line(75,177,380,177)
    txt(75,148,'ราคาก่อสร้าง',14,False,MUTED)
    txt(75,113,f'{price} บาท',24,True,NAVY)
    finish()

# 14 / Team: reporting lines follow the original organization chart.
base(14,'06 / People','โครงสร้างทีมโครงการ','เรียงลำดับสายงานตามผังบุคลากรต้นฉบับ')
def org_card(x,y,w,h,name,role,primary=False,small=False):
    rect(x,y,w,h,NAVY if primary else PALE,8,None if primary else LINE)
    txt(x+11,y+h-21,name,13 if small else 16,True,WHITE if primary else NAVY)
    txt(x+11,y+10,role,11.5 if small else 13,False,HexColor('#DCE7EC') if primary else MUTED)
def link(x1,y1,x2,y2):
    c.setStrokeColor(GOLD); c.setLineWidth(1.5); c.line(x1,y1,x2,y2)
link(354,356,318,352); link(480,356,480,308)
link(480,308,480,289); link(195,289,765,289)
for x in (195,480,765): link(x,289,x,269)
link(195,220,195,204); link(132,204,258,204)
for x in (132,258): link(x,204,x,188)
link(480,220,480,205); link(765,220,765,205)
link(480,205,765,205); link(620,205,620,187)
link(620,143,620,129); link(514,129,810,129)
for x in (514,660,810): link(x,129,x,115)
org_card(354,356,252,45,'จำนง โกวิทอิสริยะ','ผู้จัดการ (ตั้งแต่ 2528)',True)
org_card(72,331,246,43,'รัชดาภรณ์ ตั้งภัณฑรักษ์','หุ้นส่วนผู้จัดการ')
org_card(70,220,250,49,'ญาณิภา โกวิทอิสริยะ','ผู้ประสานงานโครงการ',True)
org_card(355,220,250,49,'พหล โกวิทอิสริยะ','วิศวกรโครงการ',True)
org_card(640,220,250,49,'นันทวัฒน์ เพ็ชรน้ำทองวัฒนา','สถาปนิกโครงการ',True)
rect(70,128,122,60,PALE,8,LINE)
txt(79,159,'พลอยไพรินทร์ กลัดภู่',11,True,NAVY)
txt(79,138,'ฝ่ายบัญชี',11.5,False,MUTED)
rect(198,128,122,60,PALE,8,LINE)
txt(207,159,'สุวิมล คล้ายกิ่งโพธิ์',11,True,NAVY)
txt(207,138,'ฝ่ายจัดซื้อ',11.5,False,MUTED)
org_card(495,143,250,44,'สมชาย ยิ้มสบาย','โฟร์แมนก่อสร้าง')
org_card(432,70,164,45,'รวีวรรณ พรมขำม','เสมียนหน้างาน',small=True)
org_card(600,70,132,45,'ประทีป ช่วงโชติ','หัวหน้าช่าง',small=True)
org_card(738,70,169,45,'วิฑูรย์ พรมนะรี','ประสานงานหน้างาน',small=True)
finish()

# 15–16 / Engineer project record
extra=[
('01','อาคารกองบังคับการกรมสวัสดิการทหารอากาศ','2558'),
('02','โรงทหาร 150 คน กองพลทหารม้าที่ 2','2561'),
('03','อาคารคอกม้าทรงประจำพระองค์','2561'),
('04','ปรับปรุงอาคารและสิ่งปลูกสร้าง','2562'),
('05','อาคารพักอาศัยรองรับการปรับย้ายหน่วย มทบ.11','2563'),
('06','อาคารกรมทหารม้าที่ 1 รองรับโครงการสะพานเกียกกาย','2563'),
('07','โรงทหาร 150 คน กองพลทหารม้าที่ 2','2564'),
('08','อาคารพร้อมสิ่งอำนวยความสะดวก 5 หลัง','2564'),
('09','อาคารกองร้อยสนับสนุนส่วนหน้า พื้นที่สระบุรี','2565'),
('10','อาคารกองร้อยสนับสนุนส่วนหน้า พื้นที่สระบุรี','2566'),
('11','สำนักงานและคลังเก็บสิ่งอุปกรณ์ มทบ.18','2567'),
('12','อาคารเรียนครบรอบ 25 ปี โรงเรียนกาญจนาภิเษกฯ','2567'),
('13','อาคารกองร้อยสนับสนุนส่วนหน้า พื้นที่สระบุรี','2568'),
]
for page,rows in ((15,extra[:7]),(16,extra[7:])):
    base(page,'07 / Engineering team','ประวัติผลงานวิศวกรโครงการ',
         'พหล โกวิทอิสริยะ  |  ภย. 60575  |  ภาคีวิศวกรโยธา')
    rect(48,379,864,33,NAVY,5)
    txt(64,389,'ลำดับ',13,True,WHITE)
    txt(135,389,'โครงการ',13,True,WHITE)
    txt(850,389,'ปี',13,True,WHITE)
    top=366
    row_h=38
    gap=4
    for index,(num,name,year) in enumerate(rows):
        row_top=top-index*(row_h+gap)
        bottom=row_top-row_h
        rect(48,bottom,864,row_h,PALE if index%2==0 else WHITE,5,LINE)
        c.setStrokeColor(LINE)
        c.line(119,bottom+5,119,row_top-5)
        c.line(823,bottom+5,823,row_top-5)
        baseline=bottom+14
        c.setFont('Sarabun-Bold',14); c.setFillColor(GOLD)
        c.drawCentredString(84,baseline,num)
        txt(135,baseline,name,14,False,INK)
        c.setFont('Sarabun-Bold',13); c.setFillColor(NAVY)
        c.drawCentredString(868,baseline,year)
    finish()

# 17–18 / Full-page technical drawings with their native orientations.
for page,title,img,pw,ph in [
    (17,'ผังบริเวณและขอบเขตงาน','page17-Image93.png',842,1191),
    (18,'แผนดำเนินงานก่อสร้าง','page18-Image97.png',1200,927)]:
    c.setPageSize((pw,ph))
    rect(0,0,pw,ph,WHITE)
    rect(0,ph-7,pw,7,CYAN)
    txt(22,ph-34,title,20,True,NAVY)
    rect(pw-70,ph-68,54,54,WHITE,7,LINE)
    fit_image(A/'page1-fzImg0.png',pw-64,ph-63,42,44,False)
    if page == 18:
        # Remove the large white margins from the original chart in the page layout.
        chart=Image.open(A/img).crop((190,230,2110,1530))
        fit_image(chart,18,25,pw-36,ph-97,False)
    else:
        fit_image(A/img,18,25,pw-36,ph-97,False)
    txt(20,9,f'NGE  |  NEXT GEN ENGINEERING                                      {page:02d} / 19',9,False,MUTED)
    finish()

# 19 / Clear next step for prospective customers.
c.setPageSize((W,H))
rect(0,0,W,H,WHITE)
grid_pattern(44,48,270,142,18)
rect(0,0,10,H,CYAN)
rect(55,494,60,3,CYAN)
txt(55,468,'CONTACT / NEXT GEN ENGINEERING',12,True,CYAN)
txt(55,421,'ส่งข้อมูลโครงการให้ทีม NGE',31,True,NAVY)
lines(55,382,['มีรูปหน้างานหรือแบบอยู่แล้ว ส่งข้อมูลเบื้องต้นมาได้เลย',
              'ทีมจะดูขอบเขตงานและคุยขั้นตอนที่เหมาะกับโครงการ'],16,24,color=MUTED)
for y,num,label in [
    (292,'01','รูปหน้างานหรือแบบ 3–5 รูป'),
    (238,'02','พิกัดและขนาดพื้นที่'),
    (184,'03','สิ่งที่ต้องการทำ และช่วงงบถ้ามี'),
]:
    rect(55,y,525,44,BLUE,6,LINE)
    txt(72,y+13,num,17,True,CYAN)
    txt(125,y+13,label,16,False,NAVY)
txt(55,126,'โทร 098-279-9145',19,True,NAVY)
txt(55,96,'nextgenengineering00@gmail.com',14.5,False,MUTED)
txt(55,69,'ngebuild.com/contact',14,False,MUTED)
c.linkURL('tel:+66982799145',(55,118,375,150),relative=0,thickness=0)
c.linkURL('mailto:nextgenengineering00@gmail.com',(55,88,438,113),relative=0,thickness=0)
c.linkURL('https://ngebuild.com/contact',(55,59,330,86),relative=0,thickness=0)
rect(630,82,281,332,NAVY,8)
rect(630,410,281,4,CYAN)
txt(658,376,'ส่งรูปหน้างานทาง LINE',18,True,WHITE)
qr=QrCodeWidget('https://lin.ee/u45yvnc')
x0,y0,x1,y1=qr.getBounds()
size=202
d=Drawing(size,size,transform=[size/(x1-x0),0,0,size/(y1-y0),0,0])
d.add(qr)
rect(660,148,220,220,WHITE,4)
renderPDF.draw(d,c,669,155)
txt(695,125,'LINE  @522magc',16,True,WHITE)
c.linkURL('https://lin.ee/u45yvnc',(630,82,911,414),relative=0,thickness=0)
fit_image(A/'page1-fzImg0.png',850,450,58,58,False)
txt(55,27,'NEXT GEN ENGINEERING',10,True,NAVY)
txt(846,27,'19 / 19',10,False,MUTED)
finish()

c.save()
for mirror in (
    ROOT.parent / 'public' / 'legacy' / 'assets' / OUT.name,
    ROOT.parent / 'supabase' / 'public' / 'assets' / OUT.name,
    ROOT.parent / 'supabase' / 'public' / 'legacy' / 'assets' / OUT.name,
):
    mirror.parent.mkdir(parents=True, exist_ok=True)
    mirror.write_bytes(OUT.read_bytes())
print(OUT)
