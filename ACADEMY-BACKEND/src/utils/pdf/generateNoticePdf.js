const PDFDocument = require("pdfkit");

/* ══════════════════════════════════════════════════════════
   COLOUR PALETTE  (Navy + Gold scheme — formal / institutional)
   ══════════════════════════════════════════════════════════ */
const C = {
  navy:       "#1B2A6B",   // deep institutional navy
  navyLight:  "#2C3E8C",
  gold:       "#B8860B",   // dark-gold accent
  goldLight:  "#D4A017",
  black:      "#0D0D0D",
  darkGray:   "#2D2D2D",
  midGray:    "#555555",
  lightGray:  "#E8E8E8",
  white:      "#FFFFFF",
  rule:       "#C8C8C8",
};

/* ── Fonts (Times-Roman family built into PDFKit) ───────── */
const F = {
  regular:    "Times-Roman",
  bold:       "Times-Bold",
  italic:     "Times-Italic",
  boldItalic: "Times-BoldItalic",
};

const PAGE_W   = 595.28;  // A4 width  in pts
const PAGE_H   = 841.89;  // A4 height in pts
const MARGIN   = 55;
const CONTENT_W = PAGE_W - MARGIN * 2;

/* ══════════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════════ */

const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

/* ── Draw outer page border ─────────────────────────────── */
const drawPageBorder = (doc) => {
  const pad = 18;
  // Outer thick border
  doc
    .rect(pad, pad, PAGE_W - pad * 2, PAGE_H - pad * 2)
    .lineWidth(2.5)
    .strokeColor(C.navy)
    .stroke();

  // Inner thin gold border
  const pad2 = pad + 5;
  doc
    .rect(pad2, pad2, PAGE_W - pad2 * 2, PAGE_H - pad2 * 2)
    .lineWidth(0.8)
    .strokeColor(C.gold)
    .stroke();
};

/* ── Draw diagonal watermark ────────────────────────────── */
const drawWatermark = (doc) => {
  doc.save();

  // Translate to page center, rotate 45°
  doc.translate(PAGE_W / 2, PAGE_H / 2).rotate(-45);

  doc
    .font(F.bold)
    .fontSize(52)
    .fillColor(C.navy)
    .opacity(0.06)
    .text("FUSION CODE ACADEMY", -230, -30, {
      width: 460,
      align: "center",
      lineBreak: false,
    });

  doc.restore();
  doc.opacity(1); // reset opacity
};

/* ── Header block ───────────────────────────────────────── */
const drawHeader = (doc) => {
  // Navy top band
  doc.rect(MARGIN - 10, MARGIN - 5, CONTENT_W + 20, 72).fill(C.navy);

  // Academy name
  doc
    .font(F.bold)
    .fontSize(22)
    .fillColor(C.white)
    .text("FUSION CODE ACADEMY", MARGIN, MARGIN + 10, {
      width: CONTENT_W,
      align: "center",
    });

  // Subtitle line
  doc
    .font(F.italic)
    .fontSize(10)
    .fillColor(C.goldLight)
    .text("Official Notice  ·  Srinagar, Kashmir", MARGIN, MARGIN + 36, {
      width: CONTENT_W,
      align: "center",
    });

  // Gold rule below header
  doc
    .rect(MARGIN - 10, MARGIN + 67, CONTENT_W + 20, 3)
    .fill(C.gold);

  doc.y = MARGIN + 82; // advance cursor past header
};

/* ── Horizontal rule ────────────────────────────────────── */
const drawRule = (doc, { yOffset = 6, color = C.rule, thickness = 0.75 } = {}) => {
  doc.moveDown(yOffset / 12);
  const y = doc.y;
  doc
    .strokeColor(color)
    .lineWidth(thickness)
    .moveTo(MARGIN, y)
    .lineTo(PAGE_W - MARGIN, y)
    .stroke();
  doc.moveDown(0.5);
};

/* ── Double rule ────────────────────────────────────────── */
const drawDoubleRule = (doc) => {
  const y = doc.y + 4;
  doc.strokeColor(C.navy).lineWidth(1.5).moveTo(MARGIN, y).lineTo(PAGE_W - MARGIN, y).stroke();
  doc.strokeColor(C.gold).lineWidth(0.5).moveTo(MARGIN, y + 3.5).lineTo(PAGE_W - MARGIN, y + 3.5).stroke();
  doc.y = y + 10;
};

/* ── Section heading ────────────────────────────────────── */
const drawSectionTitle = (doc, title) => {
  checkPage(doc);
  doc.moveDown(0.6);

  const y = doc.y;

  // Left accent bar
  doc.rect(MARGIN, y, 3, 16).fill(C.gold);

  doc
    .font(F.bold)
    .fontSize(12)
    .fillColor(C.navy)
    .text(title.toUpperCase(), MARGIN + 10, y + 1, {
      width: CONTENT_W - 10,
    });

  doc.moveDown(0.5);
  doc
    .strokeColor(C.rule)
    .lineWidth(0.4)
    .moveTo(MARGIN, doc.y)
    .lineTo(PAGE_W - MARGIN, doc.y)
    .stroke();
  doc.moveDown(0.5);
};

/* ── Meta info row (label + value) ─────────────────────── */
const drawMetaRow = (doc, label, value) => {
  const labelW = 115;
  const valueX = MARGIN + labelW;
  const valueW = CONTENT_W - labelW;
  const y = doc.y;

  doc.font(F.bold).fontSize(10).fillColor(C.midGray).text(label, MARGIN, y, {
    width: labelW,
    continued: false,
  });
  doc.font(F.regular).fontSize(10).fillColor(C.darkGray).text(value, valueX, y, {
    width: valueW,
  });
  doc.moveDown(0.15);
};

/* ── Meta info shaded box ───────────────────────────────── */
const drawMetaBox = (doc, notice) => {
  const boxY  = doc.y;
  const rows  = [
    ["Notice Type",  notice.type],
    ["Priority",     notice.priority],
    ["Published On", formatDate(notice.publishDate)],
    ["Published By", notice.publishedBy?.name || "Administrator"],
    ...(notice.expiryDate ? [["Expiry Date", formatDate(notice.expiryDate)]] : []),
  ];
  const rowH = 18;
  const boxH = rows.length * rowH + 16;

  // Shaded background
  doc.rect(MARGIN, boxY, CONTENT_W, boxH).fill("#F3F4F8");

  // Left accent
  doc.rect(MARGIN, boxY, 3, boxH).fill(C.navy);

  // Border
  doc.rect(MARGIN, boxY, CONTENT_W, boxH).lineWidth(0.5).strokeColor(C.rule).stroke();

  doc.y = boxY + 10;
  rows.forEach(([label, value]) => {
    drawMetaRow(doc, `${label} :`, String(value));
  });
  doc.y = boxY + boxH + 8;
};

/* ── Render HTML description with styled chunks ─────────── */
const renderHtmlToPdfKit = (doc, html) => {
  if (!html) return;

  let processedHtml = html
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  processedHtml = processedHtml
    .replace(/<\/p>|<br\s*\/?>/gi, "\n")
    .replace(/<p[^>]*>/gi, "");

  const tokens = processedHtml.split(/(<\/?b>|<\/?strong>|<\/?i>|<\/?em>)/i);

  let isBold = false;
  let isItalic = false;
  const textChunks = [];

  tokens.forEach((token) => {
    if (!token) return;
    const lowerToken = token.toLowerCase();

    if (lowerToken === "<b>" || lowerToken === "<strong>") { isBold = true; return; }
    else if (lowerToken === "</b>" || lowerToken === "</strong>") { isBold = false; return; }
    else if (lowerToken === "<i>" || lowerToken === "<em>") { isItalic = true; return; }
    else if (lowerToken === "</i>" || lowerToken === "</em>") { isItalic = false; return; }

    let font = F.regular;
    if (isBold && isItalic) font = F.boldItalic;
    else if (isBold)         font = F.bold;
    else if (isItalic)       font = F.italic;

    const cleanText = token.replace(/<[^>]*>/g, "");
    if (cleanText) textChunks.push({ text: cleanText, font });
  });

  doc.fontSize(11.5).fillColor(C.darkGray);

  textChunks.forEach((chunk, index) => {
    doc.font(chunk.font).text(chunk.text, {
      continued: index < textChunks.length - 1,
      align: "justify",
      lineGap: 4,
    });
  });
};

/* ── Page overflow guard ────────────────────────────────── */
const checkPage = (doc) => {
  if (doc.y > 740) {
    doc.addPage();
    drawPageBorder(doc);
    drawWatermark(doc);
    doc.y = MARGIN + 20;
  }
};

/* ── Footer ─────────────────────────────────────────────── */
const drawFooter = (doc) => {
  const footerY = PAGE_H - MARGIN - 28;

  // Gold top rule
  doc
    .strokeColor(C.gold)
    .lineWidth(0.8)
    .moveTo(MARGIN, footerY - 6)
    .lineTo(PAGE_W - MARGIN, footerY - 6)
    .stroke();

  // Navy thin rule just below
  doc
    .strokeColor(C.navy)
    .lineWidth(0.3)
    .moveTo(MARGIN, footerY - 2)
    .lineTo(PAGE_W - MARGIN, footerY - 2)
    .stroke();

  doc
    .font(F.italic)
    .fontSize(8.5)
    .fillColor(C.midGray)
    .text(
      `Generated on: ${new Date().toLocaleString("en-IN")}`,
      MARGIN,
      footerY + 2,
      { width: CONTENT_W / 2 }
    );

  doc
    .font(F.bold)
    .fontSize(8.5)
    .fillColor(C.navy)
    .text("Fusion Code Academy — Official Document", MARGIN + CONTENT_W / 2, footerY + 2, {
      width: CONTENT_W / 2,
      align: "right",
    });
};

/* ══════════════════════════════════════════════════════════
   MAIN GENERATOR
   ══════════════════════════════════════════════════════════ */

const generateNoticePdf = (notice, res) => {
  const doc = new PDFDocument({
    size: "A4",
    margin: MARGIN,
    info: {
      Title: notice.title,
      Author: "Fusion Code Academy",
      Subject: "Official Notice",
    },
  });

  const fileName = `${notice.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

  doc.pipe(res);

  /* ── BACKGROUND LAYERS (first page) ── */
  drawPageBorder(doc);
  drawWatermark(doc);

  /* ── HEADER ── */
  drawHeader(doc);
  doc.moveDown(0.8);

  /* ── NOTICE TITLE ── */
  doc
    .font(F.bold)
    .fontSize(18)
    .fillColor(C.navy)
    .text(notice.title, MARGIN, doc.y, {
      width: CONTENT_W,
      align: "center",
    });

  // Decorative gold underline under title
  const afterTitle = doc.y + 2;
  const titleText  = notice.title;
  const approxTitleW = Math.min(titleText.length * 9, CONTENT_W);
  const titleLineX  = MARGIN + (CONTENT_W - approxTitleW) / 2;
  doc.strokeColor(C.gold).lineWidth(1.2).moveTo(titleLineX, afterTitle).lineTo(titleLineX + approxTitleW, afterTitle).stroke();

  doc.moveDown(1.2);
  drawDoubleRule(doc);

  /* ── NOTICE META BOX ── */
  drawSectionTitle(doc, "Notice Details");
  drawMetaBox(doc, notice);

  /* ── DESCRIPTION ── */
  drawDoubleRule(doc);
  drawSectionTitle(doc, "Notice Description");
  checkPage(doc);

  renderHtmlToPdfKit(doc, notice.description);
  doc.moveDown(1);

  /* ── ATTACHMENTS ── */
  if (notice.attachments && notice.attachments.length > 0) {
    drawDoubleRule(doc);
    drawSectionTitle(doc, "Attachments");

    notice.attachments.forEach((file, index) => {
      checkPage(doc);

      const y = doc.y;
      // Small bullet square
      doc.rect(MARGIN, y + 3, 5, 5).fill(C.gold);

      doc
        .font(F.regular)
        .fontSize(10.5)
        .fillColor(C.darkGray)
        .text(`${index + 1}.  ${file.fileName}`, MARGIN + 12, y, {
          width: CONTENT_W - 12,
        });

      doc.moveDown(0.25);
    });
  }

  /* ── OFFICIAL SEAL / CLOSING NOTE ── */
  doc.moveDown(1.5);
  checkPage(doc);
  drawRule(doc, { color: C.rule });

  doc
    .font(F.italic)
    .fontSize(9.5)
    .fillColor(C.midGray)
    .text(
      "This is an officially generated document from Fusion Code Academy. " +
      "For queries, contact the administration.",
      MARGIN,
      doc.y,
      { width: CONTENT_W, align: "center" }
    );

  /* ── FOOTER (positioned at bottom) ── */
  drawFooter(doc);

  doc.end();
};

module.exports = generateNoticePdf;