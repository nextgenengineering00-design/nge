from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
TEXTURE = Path(r"C:\Users\Polly\.codex\generated_images\01a0e659-fe5c-7802-a3fa-74cdadb1dcd7\exec-a9d2cf87-fae8-46c9-b179-7d6b50142984.png")
FONT = Path(r"C:\Windows\Fonts\tahoma.ttf")
FONT_BOLD = Path(r"C:\Windows\Fonts\tahomabd.ttf")
LOGO = PUBLIC / "legacy" / "assets" / "nge-9b58beeb765ab627.png"

PAGES = [
    {
        "slug": "about",
        "label": "ABOUT NGE / EST. 1985",
        "title": "ประวัติบริษัท",
        "subtitle": "จากประสบการณ์กว่า 40 ปี\nสู่ Next Gen Engineering",
        "image": PUBLIC / "legacy" / "assets" / "about" / "nge-meeting-company-profile.webp",
        "position": 0.50,
    },
    {
        "slug": "services",
        "label": "DESIGN • BUILD • MANAGE",
        "title": "บริการรับเหมาก่อสร้าง",
        "subtitle": "สร้างบ้าน • ต่อเติม • รีโนเวท • งานระบบ",
        "image": PUBLIC / "legacy" / "assets" / "services" / "service-hero-house-team.png",
        "position": 0.55,
    },
    {
        "slug": "projects",
        "label": "SELECTED WORKS",
        "title": "ผลงานที่ผ่านมา",
        "subtitle": "ภาพและรายละเอียดจากหน้างานจริง",
        "image": PUBLIC / "legacy" / "assets" / "projects" / "school-25" / "01-p01.webp",
        "position": 0.50,
    },
    {
        "slug": "knowledge",
        "label": "CONSTRUCTION KNOWLEDGE",
        "title": "ความรู้ก่อสร้าง",
        "subtitle": "BOQ • สัญญา • รีโนเวท • ต่อเติมบ้าน",
        "image": PUBLIC / "assets" / "knowledge-covers" / "choose-contractor-nonthaburi-cover.webp",
        "position": 0.50,
    },
    {
        "slug": "contact",
        "label": "LET'S TALK ABOUT YOUR PROJECT",
        "title": "ติดต่อทีมงาน NGE",
        "subtitle": "ปรึกษางานก่อสร้างในนนทบุรี\nและพื้นที่ใกล้เคียง",
        "image": PUBLIC / "legacy" / "assets" / "page-heroes" / "contact-phone-v13.webp",
        "position": 0.55,
    },
]


def cover(image: Image.Image, size: tuple[int, int], focus_x: float = 0.5) -> Image.Image:
    image = image.convert("RGB")
    ratio = max(size[0] / image.width, size[1] / image.height)
    image = image.resize((round(image.width * ratio), round(image.height * ratio)), Image.Resampling.LANCZOS)
    left = max(0, min(image.width - size[0], round((image.width - size[0]) * focus_x)))
    top = max(0, (image.height - size[1]) // 2)
    return image.crop((left, top, left + size[0], top + size[1]))


def draw_preview(page: dict) -> None:
    canvas = cover(Image.open(TEXTURE), (1200, 630))
    photo = cover(Image.open(page["image"]), (640, 630), page["position"])
    photo = ImageEnhance.Contrast(photo).enhance(1.05)
    photo = ImageEnhance.Color(photo).enhance(0.88)

    shade = Image.new("L", (640, 630), 0)
    shade_draw = ImageDraw.Draw(shade)
    for x in range(130):
        shade_draw.line((x, 0, x, 630), fill=round(190 * (1 - x / 130)))
    photo.paste(Image.new("RGB", photo.size, "#16120d"), mask=shade)
    canvas.paste(photo, (560, 0))

    draw = ImageDraw.Draw(canvas)
    draw.rectangle((0, 0, 18, 630), fill="#d9981d")
    draw.rectangle((0, 0, 1200, 18), fill="#171717")
    draw.rectangle((530, 0, 560, 630), fill="#f4efe6")

    logo = Image.open(LOGO).convert("RGBA")
    logo.thumbnail((150, 95), Image.Resampling.LANCZOS)
    canvas.paste(logo, (68, 52), logo)

    label_font = ImageFont.truetype(str(FONT_BOLD), 18)
    title_size = 40 if page["slug"] == "services" else 50
    title_font = ImageFont.truetype(str(FONT_BOLD), title_size)
    subtitle_font = ImageFont.truetype(str(FONT), 25)
    small_font = ImageFont.truetype(str(FONT_BOLD), 17)
    draw.text((68, 178), page["label"], font=label_font, fill="#a86d08")
    draw.text((68, 222), page["title"], font=title_font, fill="#171717")
    draw.multiline_text((68, 312), page["subtitle"], font=subtitle_font, fill="#4f4a43", spacing=12)
    draw.line((68, 465, 290, 465), fill="#c9b99d", width=2)
    draw.rounded_rectangle((68, 505, 304, 558), radius=26, fill="#171717")
    draw.text((94, 519), f"ngebuild.com/{page['slug']}", font=small_font, fill="#f4b12b")
    draw.text((1040, 582), "NGE", font=label_font, fill="#ffffff")

    out = PUBLIC / f"og-{page['slug']}-2026.jpg"
    canvas.save(out, "JPEG", quality=91, optimize=True, progressive=True)
    print(out)


for item in PAGES:
    draw_preview(item)
