from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageEnhance

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
BACKGROUNDS = PUBLIC / "assets" / "og-backgrounds"
FONT = Path(r"C:\Windows\Fonts\LeelawUI.ttf")
FONT_BOLD = Path(r"C:\Windows\Fonts\LeelaUIb.ttf")

PAGES = [
    {"slug": "about", "kicker": "ABOUT NGE  /  EST. 1985", "title": "ประวัติบริษัท", "subtitle": "40 ปีของประสบการณ์ก่อสร้าง\nที่ตรวจสอบได้จากผลงานจริง"},
    {"slug": "services", "kicker": "DESIGN  /  BUILD  /  MANAGE", "title": "บริการรับเหมา\nก่อสร้าง", "subtitle": "สร้างบ้าน • อาคาร • ต่อเติม • รีโนเวท\nวางแผน ควบคุม และส่งมอบครบ"},
    {"slug": "projects", "kicker": "SELECTED WORKS", "title": "ผลงานที่ผ่านมา", "subtitle": "รวมผลงานก่อสร้างและปรับปรุง\nจากหน้างานจริงของทีม"},
    {"slug": "knowledge", "kicker": "CONSTRUCTION KNOWLEDGE", "title": "ความรู้ก่อสร้าง", "subtitle": "เรื่องแบบ BOQ สัญญา และหน้างาน\nอ่านง่าย ใช้ตัดสินใจก่อนเริ่มงาน"},
    {"slug": "contact", "kicker": "START YOUR PROJECT", "title": "ติดต่อทีม NGE", "subtitle": "ส่งแบบ รูปหน้างาน และพื้นที่ก่อสร้าง\nให้ทีมช่วยดูขอบเขตเบื้องต้น"},
]


def cover(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    image = image.convert("RGB")
    ratio = max(size[0] / image.width, size[1] / image.height)
    resized = image.resize((round(image.width * ratio), round(image.height * ratio)), Image.Resampling.LANCZOS)
    left = max(0, (resized.width - size[0]) // 2)
    top = max(0, (resized.height - size[1]) // 2)
    return resized.crop((left, top, left + size[0], top + size[1]))


def add_readability_gradient(canvas: Image.Image) -> Image.Image:
    overlay = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    for x in range(650):
        alpha = int(80 * (1 - x / 650))
        draw.line((x, 0, x, canvas.height), fill=(1, 7, 14, alpha))
    return Image.alpha_composite(canvas.convert("RGBA"), overlay).convert("RGB")


def draw_letter_spaced(draw: ImageDraw.ImageDraw, xy, text, font, fill, spacing=3):
    x, y = xy
    for char in text:
        draw.text((x, y), char, font=font, fill=fill)
        x += draw.textlength(char, font=font) + spacing


def draw_preview(page: dict) -> None:
    canvas = cover(Image.open(BACKGROUNDS / f"{page['slug']}-v2.png"), (1200, 630))
    canvas = ImageEnhance.Contrast(canvas).enhance(1.04)
    canvas = ImageEnhance.Color(canvas).enhance(0.94)
    canvas = add_readability_gradient(canvas)
    draw = ImageDraw.Draw(canvas)

    brand_font = ImageFont.truetype(str(FONT_BOLD), 21)
    kicker_font = ImageFont.truetype(str(FONT_BOLD), 18)
    title_font = ImageFont.truetype(str(FONT_BOLD), 68)
    subtitle_font = ImageFont.truetype(str(FONT), 27)
    url_font = ImageFont.truetype(str(FONT_BOLD), 20)

    draw_letter_spaced(draw, (68, 46), "NEXT GEN ENGINEERING", brand_font, "#F7F1E7", spacing=2)
    draw.rounded_rectangle((68, 96, 164, 102), radius=3, fill="#F5A400")
    draw.text((68, 132), page["kicker"], font=kicker_font, fill="#F5A400")

    title_y = 171
    draw.multiline_text((65, title_y), page["title"], font=title_font, fill="#FFF9EF", spacing=2, stroke_width=1, stroke_fill="#FFF9EF")
    title_box = draw.multiline_textbbox((65, title_y), page["title"], font=title_font, spacing=2)
    draw.multiline_text((68, title_box[3] + 25), page["subtitle"], font=subtitle_font, fill="#E6E1D8", spacing=10)

    draw.line((68, 548, 502, 548), fill="#6A7075", width=1)
    draw.text((68, 565), f"ngebuild.com/{page['slug']}", font=url_font, fill="#FFF9EF")
    draw.rounded_rectangle((1137, 548, 1145, 590), radius=4, fill="#F5A400")

    out = PUBLIC / f"og-{page['slug']}-2026-v2.jpg"
    canvas.save(out, "JPEG", quality=92, optimize=True, progressive=True)
    print(out)


for item in PAGES:
    draw_preview(item)
