const PDFDocument = require("pdfkit");

const formatDate = (date) => {

  if (!date) return "N/A";

  return new Date(date).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "long",
      year: "numeric"
    }
  );

};

const drawSectionTitle = (doc, title) => {

  doc
    .moveDown()
    .fontSize(14)
    .fillColor("#2563EB")
    .font("Helvetica-Bold")
    .text(title);

  doc
    .moveDown(0.4);

};

const drawDivider = (doc) => {

  const y = doc.y;

  doc
    .strokeColor("#D1D5DB")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(545, y)
    .stroke();

  doc.moveDown();

};

const checkPage = (doc) => {

  if (doc.y > 730) {
    doc.addPage();
  }

};

const generateNoticePdf = (notice, res) => {

  const doc = new PDFDocument({

    size: "A4",

    margin: 50

  });

  const fileName =
    `${notice.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;

  res.setHeader(
    "Content-Type",
    "application/pdf"
  );

  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${fileName}"`
  );

  doc.pipe(res);

  /*
  =====================================================
                  HEADER
  =====================================================
  */

  doc

    .fontSize(24)
    .font("Helvetica-Bold")
    .fillColor("#1E3A8A")
    .text("Fusion Code Academy", {
      align: "center"
    });

  doc

    .fontSize(10)
    .fillColor("#6B7280")
    .font("Helvetica")
    .text("Official Notice", {
      align: "center"
    });

  doc.moveDown();

  drawDivider(doc);

  /*
  =====================================================
                  TITLE
  =====================================================
  */

  doc

    .fontSize(20)
    .fillColor("#111827")
    .font("Helvetica-Bold")
    .text(notice.title);

  doc.moveDown();

  /*
  =====================================================
                  DETAILS
  =====================================================
  */

  doc
    .fontSize(12)
    .font("Helvetica");

  doc.fillColor("#374151");

  doc.text(
    `Type : ${notice.type}`
  );

  doc.text(
    `Priority : ${notice.priority}`
  );

  doc.text(
    `Published On : ${formatDate(notice.publishDate)}`
  );

  doc.text(
    `Published By : ${
      notice.publishedBy?.name || "Administrator"
    }`
  );

  if (notice.expiryDate) {

    doc.text(
      `Expiry Date : ${formatDate(notice.expiryDate)}`
    );

  }

  drawDivider(doc);

  /*
  =====================================================
              DESCRIPTION
  =====================================================
  */

  drawSectionTitle(
    doc,
    "Notice Description"
  );

  checkPage(doc);

  doc

    .font("Helvetica")
    .fontSize(12)
    .fillColor("#111827")
    .text(
      notice.description,
      {
        align: "justify",
        lineGap: 5
      }
    );

  /*
  =====================================================
              ATTACHMENTS
  =====================================================
  */

  if (
    notice.attachments &&
    notice.attachments.length > 0
  ) {

    drawDivider(doc);

    drawSectionTitle(
      doc,
      "Attachments"
    );

    notice.attachments.forEach(
      (file, index) => {

        checkPage(doc);

        doc

          .font("Helvetica")

          .fontSize(11)

          .fillColor("#374151")

          .text(
            `${index + 1}. ${file.fileName}`
          );

      }
    );

  }

  /*
  =====================================================
              FOOTER
  =====================================================
  */

  drawDivider(doc);

  doc

    .moveDown(2)

    .fontSize(10)

    .fillColor("#6B7280")

    .text(
      `Generated on : ${new Date().toLocaleString()}`,
      {
        align: "center"
      }
    );

  doc

    .fontSize(9)

    .text(
      "Fusion Code Academy",
      {
        align: "center"
      }
    );

  doc.end();

};

module.exports =
  generateNoticePdf;