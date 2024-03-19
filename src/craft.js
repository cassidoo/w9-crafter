const { invoke } = window.__TAURI__.core;
const { open } = window.__TAURI__.dialog;
const { readFile } = window.__TAURI__.fs;
const { degrees, PDFDocument, rgb } = PDFLib;

let pathUrl = "";
let pathButton = document.getElementById("updatepathbutton");
let makeButton = document.getElementById("makebutton");

(function () {
	checkForPath();
	document.getElementById("pick-me").addEventListener("click", openDialog);
})();

async function openDialog() {
	const file = await open({
		title: "Select your filled Form W-9",
		multiple: false,
		directory: false,
		filters: [
			{
				name: "PDF",
				extensions: ["pdf"],
			},
		],
	});
	pathUrl = file.path;
	savePath();
}

function checkForPath() {
	if (localStorage.getItem("path")) {
		pathUrl = localStorage.getItem("path");
		document.getElementById("path").innerHTML = prependPathUrl();
	} else {
		document.getElementById("currentpath").style.display = "none";
		pathButton.click();
		pathButton.innerText = "Pick W-9 path";
		makeButton.disabled = true;
	}
}

function savePath() {
	localStorage.setItem("path", pathUrl);

	document.getElementById("path").innerHTML = prependPathUrl();
	document.getElementById("currentpath").style.display = "block";
	pathButton.innerText = "Update W-9 path";
	makeButton.disabled = false;
}

function prependPathUrl() {
	let prependedPathUrl = pathUrl;
	if (pathUrl.length > 36) {
		prependedPathUrl = `...${pathUrl.slice(-36)}`;
	}
	return prependedPathUrl;
}

async function modifyPdf() {
	const url = pathUrl;
	const existingPdfBytes = await readFile(url);

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
	let container = document.getElementsByClassName("tabs")[0];
	let element = event.currentTarget;
	let currentTabIndex = [...element.parentElement.children].indexOf(element);

	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].classList.remove("active");
	}

	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
		tablinks[i].classList.remove("active");
	}

	if (currentTabIndex === 0) {
		container.classList.remove(`right`);
	} else {
		container.classList.add(`right`);
	}

	document.getElementById(tabName).classList.add("active");
	event.currentTarget.classList.add("active");
}
