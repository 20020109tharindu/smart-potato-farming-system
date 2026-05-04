from pathlib import Path
import re
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.units import cm
from reportlab.lib import colors

ROOT = Path(__file__).resolve().parents[1]
source_md = ROOT / "docs" / "Disease_Predictor_Report.md"
out_pdf = ROOT / "docs" / "Disease_Predictor_Report.pdf"

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="TitleCustom", parent=styles["Title"], fontName="Helvetica-Bold", fontSize=18, leading=22, spaceAfter=12))
styles.add(ParagraphStyle(name="H2Custom", parent=styles["Heading2"], fontName="Helvetica-Bold", fontSize=13, leading=17, textColor=colors.HexColor("#0f172a"), spaceBefore=8, spaceAfter=6))
styles.add(ParagraphStyle(name="BodyCustom", parent=styles["BodyText"], fontName="Helvetica", fontSize=10.5, leading=15, spaceAfter=4))
styles.add(ParagraphStyle(name="BulletCustom", parent=styles["BodyText"], fontName="Helvetica", fontSize=10.5, leading=15, leftIndent=12, bulletIndent=2, spaceAfter=2))
styles.add(ParagraphStyle(name="NumberCustom", parent=styles["BodyText"], fontName="Helvetica", fontSize=10.5, leading=15, leftIndent=12, spaceAfter=2))


def esc(t: str) -> str:
    return t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def build_story(md_text: str):
    story = []
    lines = md_text.splitlines()

    for line in lines:
        s = line.strip()
        if not s:
            story.append(Spacer(1, 0.15 * cm))
            continue

        if s.startswith("# "):
            story.append(Paragraph(esc(s[2:].strip()), styles["TitleCustom"]))
            continue

        if s.startswith("## "):
            story.append(Paragraph(esc(s[3:].strip()), styles["H2Custom"]))
            continue

        if s.startswith("### "):
            story.append(Paragraph(f"<b>{esc(s[4:].strip())}</b>", styles["BodyCustom"]))
            continue

        if s.startswith("- "):
            story.append(Paragraph(esc(s[2:].strip()), styles["BulletCustom"], bulletText="•"))
            continue

        m = re.match(r"^(\d+)\.\s+(.*)$", s)
        if m:
            idx, body = m.groups()
            story.append(Paragraph(esc(body), styles["NumberCustom"], bulletText=f"{idx}."))
            continue

        story.append(Paragraph(esc(s), styles["BodyCustom"]))

    return story


def main():
    md_text = source_md.read_text(encoding="utf-8")
    doc = SimpleDocTemplate(
        str(out_pdf),
        pagesize=A4,
        leftMargin=2 * cm,
        rightMargin=2 * cm,
        topMargin=2 * cm,
        bottomMargin=2 * cm,
        title="Disease Predictor Module Report",
        author="Smart Potato Farming System",
    )
    story = build_story(md_text)
    doc.build(story)
    print(out_pdf)


if __name__ == "__main__":
    main()
