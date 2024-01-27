const { degrees, PDFDocument, rgb } = PDFLib;

let pathUrl = "";

(function () {
	checkForPath();
	document.getElementById("file").addEventListener("change", () => {
		pathUrl = document.getElementById("file").files[0].path;
	});
})();

function checkForPath() {
	if (localStorage.getItem("path")) {
		pathUrl = localStorage.getItem("path");
	}
}

function savePath() {
	localStorage.setItem("path", pathUrl);
}

async function modifyPdf() {
	const url = pathUrl;
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

function openTab(event, tabName) {
	let i, tabcontent, tablinks;

	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].classList.remove("active");
	}

	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
		tablinks[i].classList.remove("active");
	}

	document.getElementById(tabName).classList.add("active");
	event.currentTarget.classList.add("active");
}
