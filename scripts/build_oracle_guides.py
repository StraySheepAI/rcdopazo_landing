from pathlib import Path
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "guias"
OUT.mkdir(parents=True, exist_ok=True)

GOLD = HexColor("#967B45")
INK = HexColor("#241923")
PINK = HexColor("#A93F82")
PALE = HexColor("#F7F2EA")

guides = {
    "custos": {
        "title": "Casa de Custos",
        "subtitle": "Observar, delimitar y sostener",
        "opening": "Custos no nombra una identidad fija. Nombra una capacidad: reconocer qué sostiene una forma, distinguir sus límites y cuidar aquello que no debería perderse antes de intervenir.",
        "find": ["Prácticas de observación y discernimiento.", "Construcción de marco, encuadre y límites fértiles.", "Lectura de dominios, responsabilidades y condiciones.", "Formas de sostener sin inmovilizar."],
        "power": "Custos puede volver precisa tu capacidad de observar, cuidar y delimitar.",
        "excess": "Cuando se excede, la observación puede convertirse en demora, control o conservación de una forma que ya necesita movimiento.",
        "relation": "Reconfiguradores amplía este camino enseñando cuándo y cómo intervenir. Architectus puede abrirse después, cuando la custodia se articula con el diseño.",
    },
    "reconfiguradores": {
        "title": "Casa de Reconfiguradores",
        "subtitle": "Intervenir, relacionar y transformar",
        "opening": "Reconfigurar no es cambiar por cambiar. Es reconocer una configuración activa, intervenir sobre sus relaciones y abrir una alternativa con mayor capacidad de acción.",
        "find": ["Prácticas de relación, espejado y redirección.", "Lectura de tensiones, repeticiones y puntos de intervención.", "Laboratorios para ensayar movimientos y observar efectos.", "Construcción de alternativas junto a otros, sin imponer respuestas."],
        "power": "Reconfiguradores puede volver consciente tu capacidad de mover, transformar y abrir posibilidades.",
        "excess": "Cuando se excede, el movimiento puede adelantarse a aquello que todavía necesitaba ser visto o cuidado.",
        "relation": "Custos amplía este camino aportando marco y delimitación. Architectus puede abrirse después, cuando la intervención se articula con una arquitectura coherente.",
    },
    "architectus": {
        "title": "Especialización Architectus",
        "subtitle": "Integrar, corresponder y construir",
        "opening": "Architectus reconoce relaciones, funciones y recorridos para diseñar configuraciones coherentes. No es un rango superior: es una contribución diferente dentro del sistema.",
        "find": ["Diseño de experiencias, Ludus y Pasajes.", "Lectura de sistemas completos y correspondencias.", "Integración de observación e intervención.", "Construcción de estructuras donde cada parte conserve su función."],
        "power": "La potencia Architectus aparece cuando pensás el conjunto sin borrar la diferencia entre sus partes.",
        "excess": "Cuando se excede, el diseño puede volverse abstracción, sobrearquitectura o una respuesta construida antes de habitar la experiencia.",
        "relation": "Architectus es una especialización. Para acceder es necesario haber atravesado al menos Custos o Reconfiguradores; recorrer ambas casas permite conocer más profundamente el sistema.",
    },
}

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="Kicker", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=8, leading=11, textColor=PINK, spaceAfter=8, alignment=TA_CENTER, tracking=2))
styles.add(ParagraphStyle(name="TitleGold", parent=styles["Title"], fontName="Times-Roman", fontSize=31, leading=34, textColor=GOLD, alignment=TA_CENTER, spaceAfter=8))
styles.add(ParagraphStyle(name="Subtitle", parent=styles["Normal"], fontName="Times-Italic", fontSize=14, leading=19, textColor=INK, alignment=TA_CENTER, spaceAfter=22))
styles.add(ParagraphStyle(name="HeadingGold", parent=styles["Heading2"], fontName="Times-Roman", fontSize=19, leading=23, textColor=GOLD, spaceBefore=13, spaceAfter=7))
styles.add(ParagraphStyle(name="BodyClean", parent=styles["BodyText"], fontName="Helvetica", fontSize=10.5, leading=16, textColor=INK, spaceAfter=9))
styles.add(ParagraphStyle(name="QuoteGold", parent=styles["BodyText"], fontName="Times-Italic", fontSize=14, leading=20, textColor=GOLD, leftIndent=12, rightIndent=12, spaceBefore=10, spaceAfter=15))

def decorate(canvas, doc):
    canvas.saveState()
    w, h = A4
    canvas.setStrokeColor(GOLD); canvas.setLineWidth(.6); canvas.rect(13*mm, 13*mm, w-26*mm, h-26*mm)
    canvas.setFont("Helvetica", 7); canvas.setFillColor(GOLD)
    canvas.drawString(18*mm, 9*mm, "ESCUELA DE METALKIMIA - PULSUS FRACTUM")
    canvas.drawRightString(w-18*mm, 9*mm, str(doc.page))
    canvas.restoreState()

for slug, data in guides.items():
    path = OUT / f"oraculo-pasajes-{slug}.pdf"
    doc = SimpleDocTemplate(str(path), pagesize=A4, rightMargin=23*mm, leftMargin=23*mm, topMargin=25*mm, bottomMargin=22*mm, title=data["title"], author="Escuela de Metalkimia - MPA")
    story = [Spacer(1, 8*mm), Paragraph("ORACULO DE LOS PASAJES", styles["Kicker"]), Paragraph(data["title"], styles["TitleGold"]), Paragraph(data["subtitle"], styles["Subtitle"]), Paragraph(data["opening"], styles["QuoteGold"]), Spacer(1, 5*mm)]
    cards = [[Paragraph("LO QUE MULTIPLICA", styles["Kicker"]), Paragraph("LO QUE EXPANDE", styles["Kicker"])], [Paragraph(data["power"], styles["BodyClean"]), Paragraph(data["excess"], styles["BodyClean"])]]
    table = Table(cards, colWidths=[75*mm,75*mm], hAlign="CENTER")
    table.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1),PALE),("BOX",(0,0),(-1,-1),.6,GOLD),("INNERGRID",(0,0),(-1,-1),.3,GOLD),("VALIGN",(0,0),(-1,-1),"TOP"),("LEFTPADDING",(0,0),(-1,-1),10),("RIGHTPADDING",(0,0),(-1,-1),10),("TOPPADDING",(0,0),(-1,-1),10),("BOTTOMPADDING",(0,0),(-1,-1),10)]))
    story += [table, Paragraph("Qué podés encontrar", styles["HeadingGold"])]
    for item in data["find"]: story.append(Paragraph(f"• {item}", styles["BodyClean"]))
    story += [Paragraph("Relación con las otras puertas", styles["HeadingGold"]), Paragraph(data["relation"], styles["BodyClean"]), Spacer(1,8*mm), Paragraph("El Oráculo orienta. La decisión siempre es tuya.", styles["QuoteGold"]), Paragraph("Esta guía describe un recorrido formativo; no diagnostica ni determina quién sos. Una vez que ves, ya no podés desver.", styles["BodyClean"])]
    doc.build(story, onFirstPage=decorate, onLaterPages=decorate)
