const { degrees, PDFDocument, rgb } = PDFLib;

async function modifyPdf() {
	const url = "./fw9-filled.pdf";
	const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());

	const pdfDoc = await PDFDocument.load(existingPdfBytes);
	const pages = pdfDoc.getPages();
	const firstPage = pages[0];

	let now = new Date();
	let localDate = new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate()
	).toLocaleDateString();

	firstPage.drawText(localDate, {
		x: 420,
		y: 232,
		size: 12,
	});

	const pdfBytes = await pdfDoc.save();

	download(pdfBytes, `w9-${localDate.replaceAll("/", "-")}`, "application/pdf");
}
