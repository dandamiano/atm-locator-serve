const PDFDocument = require('pdfkit');

function createPDFStream(res, title) {
  const doc = new PDFDocument({ margin: 50 });

  // Set headers for download
  res.setHeader('Content-disposition', `attachment; filename="${title}.pdf"`);
  res.setHeader('Content-type', 'application/pdf');

  doc.pipe(res);
  return doc;
}

module.exports = createPDFStream;
