from pathlib import Path
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import Image, KeepTogether, PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "guias"
OUT.mkdir(parents=True, exist_ok=True)
GOLD, GOLD_LIGHT, INK = HexColor("#967B45"), HexColor("#C8AF72"), HexColor("#211720")
MUTED, PINK, PALE, BLUSH, WHITE = HexColor("#655863"), HexColor("#A93F82"), HexColor("#F8F4ED"), HexColor("#F3E9EF"), HexColor("#FFFFFF")

guides = {
 "custos": {"title":"Casa de Custos","subtitle":"Observar, delimitar y sostener","symbol":"custos-medallon-v2.png","opening":"Custos no define quién sos. Nombra una capacidad que ya puede estar presente: observar antes de intervenir, reconocer los límites de una situación y cuidar aquello que no debería perderse.","perceives":"Los bordes, los silencios, las condiciones y aquello que sostiene una situación aunque casi nadie lo nombre.","moves":"Se detiene, distingue y marca un límite antes de actuar. Su pregunta es qué necesita ser cuidado para que algo pueda continuar.","gifts":["Observación precisa y discernimiento.","Construcción de límites fértiles.","Lectura de responsabilidades y condiciones.","Capacidad de sostener sin invadir."],"shadow":"La observación puede convertirse en espera; el cuidado, en control; y el límite, en una frontera que ya no deja crecer.","expansion":"Reconfiguradores puede enseñarte cuándo mover aquello que ya viste. Architectus puede aparecer después, cuando el cuidado también aprende a diseñar.","practice":"Elegí una situación que te preocupe. Antes de buscar una solución, escribí tres cosas: qué está sucediendo, qué estás suponiendo y qué necesita cuidado. No intervengas todavía. Primero mirá la diferencia.","questions":["¿Qué suelo notar antes que los demás?","¿Qué estoy cuidando realmente?","¿Cuándo mi cuidado abre posibilidades y cuándo las cierra?"],"phrase":"Ver con precisión también es una manera de actuar."},
 "reconfiguradores": {"title":"Casa de Reconfiguradores","subtitle":"Intervenir, relacionar y transformar","symbol":"reconfiguradores-medallon-v2.png","opening":"Reconfigurar no es cambiar por cambiar. Es percibir dónde una relación se repite, introducir un movimiento y observar qué nueva posibilidad aparece.","perceives":"Las tensiones, las repeticiones, los puntos de bloqueo y los lugares donde un pequeño movimiento podría cambiar el recorrido.","moves":"Pregunta, prueba y pone elementos en relación. No impone una respuesta: abre una alternativa para que algo detenido pueda volver a moverse.","gifts":["Lectura de tensiones y repeticiones.","Creación de preguntas que abren.","Ensayo de movimientos y observación de efectos.","Construcción de alternativas junto a otros."],"shadow":"El impulso de cambiar puede adelantarse a lo que todavía necesitaba ser comprendido, cuidado o simplemente escuchado.","expansion":"Custos puede aportar el límite y la pausa que vuelven precisa una intervención. Architectus puede aparecer después, cuando el movimiento aprende a construir un sistema.","practice":"Elegí una situación que se repite. Cambiá una sola relación: una pregunta, un orden, una distancia o un momento. Observá el efecto sin obligarlo a convertirse en resultado.","questions":["¿Dónde aparece siempre la misma respuesta?","¿Qué pequeño movimiento podría abrir una alternativa?","¿Estoy transformando o solamente evitando la quietud?"],"phrase":"Una posibilidad nueva comienza cuando algo puede relacionarse de otra manera."},
 "architectus": {"title":"Especialización Architectus","subtitle":"Integrar, corresponder y construir","symbol":"architectus-medallon-v2.png","opening":"Architectus percibe el conjunto: cómo se conectan las partes, qué función cumple cada una y qué arquitectura puede permitirles trabajar sin borrar sus diferencias.","perceives":"Las correspondencias entre partes, funciones y recorridos. Aquello que aparece cuando se mira el sistema completo.","moves":"Organiza, integra y diseña. Busca una construcción donde observar e intervenir puedan sostener una experiencia completa.","gifts":["Diseño de experiencias, Ludus y Pasajes.","Lectura de sistemas y correspondencias.","Integración de observación e intervención.","Construcción de recorridos con sentido."],"shadow":"El diseño puede convertirse en exceso de estructura, abstracción o una respuesta terminada antes de haber vivido la experiencia.","expansion":"Architectus es una especialización. Para acceder necesitás atravesar Custos o Reconfiguradores. Recorrer ambas casas permite conocer el sistema con mayor profundidad.","practice":"Tomá una experiencia que quieras crear. Dibujá sus partes y uní solamente las que realmente se afectan entre sí. Luego preguntá: ¿qué falta para que esto pueda ser vivido y no solo explicado?","questions":["¿Qué relación todavía no estoy viendo?","¿Cada parte tiene una función necesaria?","¿Mi diseño nace de la experiencia o intenta reemplazarla?"],"phrase":"Construir no es reunir partes: es descubrir la correspondencia que puede volverlas mundo."}
}

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="Kicker",fontName="Helvetica-Bold",fontSize=8,leading=11,textColor=PINK,alignment=TA_CENTER,spaceAfter=8,tracking=2.2))
styles.add(ParagraphStyle(name="KickerLeft",parent=styles["Kicker"],alignment=TA_LEFT))
styles.add(ParagraphStyle(name="TitleGold",fontName="Times-Roman",fontSize=34,leading=38,textColor=GOLD,alignment=TA_CENTER,spaceAfter=8))
styles.add(ParagraphStyle(name="PageTitle",fontName="Times-Roman",fontSize=25,leading=29,textColor=GOLD,spaceAfter=13))
styles.add(ParagraphStyle(name="Subtitle",fontName="Times-Italic",fontSize=15,leading=21,textColor=INK,alignment=TA_CENTER,spaceAfter=20))
styles.add(ParagraphStyle(name="Heading",fontName="Times-Roman",fontSize=18,leading=22,textColor=GOLD,spaceBefore=12,spaceAfter=7))
styles.add(ParagraphStyle(name="Body",fontName="Helvetica",fontSize=10.3,leading=16,textColor=INK,spaceAfter=9))
styles.add(ParagraphStyle(name="BodyMuted",parent=styles["Body"],textColor=MUTED))
styles.add(ParagraphStyle(name="Quote",fontName="Times-Italic",fontSize=16,leading=22,textColor=GOLD,alignment=TA_CENTER,leftIndent=12,rightIndent=12,spaceBefore=12,spaceAfter=15))
styles.add(ParagraphStyle(name="CardTitle",fontName="Helvetica-Bold",fontSize=8,leading=11,textColor=PINK,tracking=1.5,spaceAfter=7))
styles.add(ParagraphStyle(name="CardBody",fontName="Times-Roman",fontSize=12,leading=17,textColor=INK))
styles.add(ParagraphStyle(name="Question",fontName="Times-Italic",fontSize=13,leading=18,textColor=INK,leftIndent=8,spaceAfter=10))

def decorate(canvas, doc):
    canvas.saveState(); w,h=A4
    canvas.setFillColor(WHITE); canvas.rect(0,0,w,h,fill=1,stroke=0)
    canvas.setStrokeColor(GOLD_LIGHT); canvas.setLineWidth(.7); canvas.rect(13*mm,13*mm,w-26*mm,h-26*mm)
    canvas.setStrokeColor(BLUSH); canvas.circle(w/2,h-29*mm,15*mm,fill=0,stroke=1)
    canvas.setFillColor(PINK); canvas.circle(18*mm,h-18*mm,1.2*mm,fill=1,stroke=0); canvas.circle(w-18*mm,18*mm,1.2*mm,fill=1,stroke=0)
    canvas.setFont("Helvetica",7); canvas.setFillColor(GOLD); canvas.drawString(18*mm,9*mm,"ESCUELA DE METALKIMIA - PULSUS FRACTUM"); canvas.drawRightString(w-18*mm,9*mm,f"{doc.page:02d}")
    canvas.restoreState()

def card(title,text,width=75*mm):
    table=Table([[Paragraph(title.upper(),styles["CardTitle"])],[Paragraph(text,styles["CardBody"])]],colWidths=[width])
    table.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1),PALE),("BOX",(0,0),(-1,-1),.6,GOLD_LIGHT),("LINEBELOW",(0,0),(-1,0),.35,GOLD_LIGHT),("LEFTPADDING",(0,0),(-1,-1),12),("RIGHTPADDING",(0,0),(-1,-1),12),("TOPPADDING",(0,0),(-1,-1),11),("BOTTOMPADDING",(0,0),(-1,-1),11),("VALIGN",(0,0),(-1,-1),"TOP")]))
    return table

for slug,data in guides.items():
    path=OUT/f"oraculo-pasajes-{slug}.pdf"
    doc=SimpleDocTemplate(str(path),pagesize=A4,rightMargin=23*mm,leftMargin=23*mm,topMargin=25*mm,bottomMargin=22*mm,title=data["title"],author="Escuela de Metalkimia - MPA")
    symbol=Image(str(ROOT/"public"/"simbolos-casas"/data["symbol"]),width=39*mm,height=39*mm); symbol.hAlign="CENTER"
    story=[Spacer(1,10*mm),Paragraph("ORACULO DE LOS PASAJES",styles["Kicker"]),symbol,Spacer(1,6*mm),Paragraph(data["title"],styles["TitleGold"]),Paragraph(data["subtitle"],styles["Subtitle"]),Spacer(1,4*mm),Paragraph(data["opening"],styles["Quote"]),Spacer(1,8*mm),Paragraph("Una puerta no te encierra en un perfil. Te muestra un lugar posible para comenzar.",styles["BodyMuted"]),PageBreak(),Paragraph("LECTURA DE LA PUERTA",styles["KickerLeft"]),Paragraph("Lo que este pasaje reconoce",styles["PageTitle"])]
    pair=Table([[card("Lo que percibe",data["perceives"]),card("Cómo se mueve",data["moves"])]],colWidths=[77*mm,77*mm],hAlign="CENTER")
    pair.setStyle(TableStyle([("VALIGN",(0,0),(-1,-1),"TOP"),("LEFTPADDING",(0,0),(-1,-1),3),("RIGHTPADDING",(0,0),(-1,-1),3)]))
    story += [pair,Spacer(1,8*mm),Paragraph("Capacidades que puede multiplicar",styles["Heading"])]
    for item in data["gifts"]: story.append(Paragraph(item,styles["Body"],bulletText="◆"))
    story += [Spacer(1,4*mm),card("Cuando la potencia se excede",data["shadow"],154*mm),PageBreak(),Paragraph("UN PRIMER GESTO",styles["KickerLeft"]),Paragraph("Llevar la lectura a la experiencia",styles["PageTitle"]),Paragraph(data["practice"],styles["Quote"]),Spacer(1,7*mm),Paragraph("Preguntas para tu cuaderno",styles["Heading"])]
    for index,question in enumerate(data["questions"],1):
        story += [Paragraph(f"{index:02d}  {question}",styles["Question"]),Spacer(1,8*mm),Table([[""]],colWidths=[154*mm],rowHeights=[.3*mm],style=[("BACKGROUND",(0,0),(-1,-1),BLUSH)])]
    story += [PageBreak(),Paragraph("EL RECORRIDO CONTINUA",styles["KickerLeft"]),Paragraph("Tu puerta y las otras casas",styles["PageTitle"]),Paragraph(data["expansion"],styles["Body"]),Spacer(1,13*mm),Paragraph(data["phrase"],styles["Quote"]),Spacer(1,13*mm),KeepTogether([card("Recordatorio","El Oráculo orienta. La decisión siempre es tuya. Esta guía no determina quién sos: ofrece una lectura para que puedas observar desde dónde estás entrando hoy.",154*mm)]),Spacer(1,15*mm),Paragraph("Una vez que ves, ya no podés desver.",styles["Kicker"])]
    doc.build(story,onFirstPage=decorate,onLaterPages=decorate)
