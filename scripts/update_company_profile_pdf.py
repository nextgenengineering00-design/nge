from pathlib import Path
import os
import shutil

from pypdf import PdfReader, PdfWriter
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public" / "assets" / "NGE-Company-Profile.pdf"
TMP_DIR = ROOT / "tmp" / "pdfs"
PAGE_PDF = TMP_DIR / "why-choose-nge.pdf"
OUTPUT_TMP = TMP_DIR / "NGE-Company-Profile.updated.pdf"

WIDTH = 960
HEIGHT = 540
NAVY = colors.HexColor("#111827")
NAVY_2 = colors.HexColor("#1F2937")
YELLOW = colors.HexColor("#F5A400")
WHITE = colors.white
MUTED = colors.HexColor("#D1D5DB")
LINE = colors.HexColor("#374151")


def paragraph(c, text, x, y_top, width, style):
    block = Paragraph(text, style)
    _, height = block.wrap(width, HEIGHT)
    block.drawOn(c, x, y_top - height)
    return height


def build_page():
    TMP_DIR.mkdir(parents=True, exist_ok=True)
    pdfmetrics.registerFont(TTFont("Tahoma", r"C:\Windows\Fonts\tahoma.ttf"))
    pdfmetrics.registerFont(TTFont("Tahoma-Bold", r"C:\Windows\Fonts\tahomabd.ttf"))

    c = canvas.Canvas(str(PAGE_PDF), pagesize=(WIDTH, HEIGHT))
    c.setFillColor(NAVY)
    c.rect(0, 0, WIDTH, HEIGHT, stroke=0, fill=1)
    c.setFillColor(YELLOW)
    c.rect(0, 0, 12, HEIGHT, stroke=0, fill=1)

    c.setFont("Tahoma-Bold", 12)
    c.setFillColor(YELLOW)
    c.drawString(54, 495, "WHY CHOOSE NGE")
    c.setFont("Tahoma-Bold", 31)
    c.setFillColor(WHITE)
    c.drawString(54, 454, "ทำไมต้องเลือก NGE")
    c.setFont("Tahoma", 13)
    c.setFillColor(MUTED)
    c.drawString(54, 426, "ประสบการณ์ มาตรฐาน และความรับผิดชอบที่พิสูจน์จากงานจริง")

    metrics = [
        ("40+ ปี", "ประสบการณ์โครงการภาครัฐ"),
        ("300+ ผลงาน", "ผ่านงานหลายประเภทและหลายขนาด"),
        ("หลายร้อยล้านบาท", "มูลค่าผลงานก่อสร้างรวม"),
    ]
    card_y = 306
    card_h = 92
    card_w = 266
    gap = 18
    for index, (big, label) in enumerate(metrics):
        x = 54 + index * (card_w + gap)
        c.setFillColor(NAVY_2)
        c.roundRect(x, card_y, card_w, card_h, 14, stroke=0, fill=1)
        c.setStrokeColor(LINE)
        c.roundRect(x, card_y, card_w, card_h, 14, stroke=1, fill=0)
        c.setFillColor(YELLOW)
        c.setFont("Tahoma-Bold", 22 if index < 2 else 19)
        c.drawString(x + 18, card_y + 52, big)
        c.setFillColor(MUTED)
        c.setFont("Tahoma", 10.5)
        c.drawString(x + 18, card_y + 24, label)

    title_style = ParagraphStyle(
        "title",
        fontName="Tahoma-Bold",
        fontSize=15,
        leading=20,
        textColor=WHITE,
        alignment=TA_LEFT,
    )
    body_style = ParagraphStyle(
        "body",
        fontName="Tahoma",
        fontSize=10.5,
        leading=17,
        textColor=MUTED,
        alignment=TA_LEFT,
    )

    col_y = 266
    left_x = 54
    right_x = 500
    col_w = 405

    paragraph(c, "มาตรฐานงานเทียบเท่าโครงการภาครัฐ", left_x, col_y, col_w, title_style)
    paragraph(
        c,
        "ควบคุมแบบ ข้อกำหนด วัสดุ ระยะเวลา และการตรวจรับอย่างเป็นขั้นตอน ตรวจสอบคุณภาพหน้างานก่อนส่งมอบ พร้อมรายงานความคืบหน้าที่เจ้าของงานติดตามได้",
        left_x,
        col_y - 31,
        col_w,
        body_style,
    )

    paragraph(c, "รับผิดชอบทั้งก่อนและหลังส่งมอบ", right_x, col_y, col_w, title_style)
    paragraph(
        c,
        "ตรวจเก็บรายละเอียดก่อนส่งมอบ รับประกันคุณภาพตามขอบเขตสัญญา และมีทีมดูแลเมื่อพบข้อบกพร่องจากงานก่อสร้าง เพื่อลดความเสี่ยงปัญหาในระยะยาว",
        right_x,
        col_y - 31,
        col_w,
        body_style,
    )

    c.setStrokeColor(LINE)
    c.line(54, 102, 906, 102)
    c.setFillColor(YELLOW)
    c.setFont("Tahoma-Bold", 12)
    c.drawString(54, 73, "NGE | NEXT GEN ENGINEERING")
    c.setFillColor(MUTED)
    c.setFont("Tahoma", 10)
    c.drawRightString(906, 73, "ngebuild.com  |  098-279-9145")
    c.save()


def replace_page():
    original = PdfReader(str(SOURCE))
    replacement = PdfReader(str(PAGE_PDF))
    writer = PdfWriter()
    for index, page in enumerate(original.pages):
        writer.add_page(replacement.pages[0] if index == 2 else page)
    metadata = dict(original.metadata or {})
    metadata["/Title"] = "NGE Company Profile - Next Gen Engineering"
    metadata["/Author"] = "Next Gen Engineering"
    writer.add_metadata({str(k): str(v) for k, v in metadata.items() if v is not None})
    with OUTPUT_TMP.open("wb") as stream:
        writer.write(stream)
    os.replace(OUTPUT_TMP, SOURCE)

    mirrors = [
        ROOT / "public" / "legacy" / "assets" / SOURCE.name,
        ROOT / "supabase" / "public" / "assets" / SOURCE.name,
        ROOT / "supabase" / "public" / "legacy" / "assets" / SOURCE.name,
    ]
    for target in mirrors:
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(SOURCE, target)


if __name__ == "__main__":
    build_page()
    replace_page()
    print(SOURCE)
