const { invoke } = window.__TAURI__.core;
const { open } = window.__TAURI__.dialog;
const { readFile, writeFile, BaseDirectory, exists } = window.__TAURI__.fs;
const { degrees, PDFDocument, rgb } = PDFLib;

let pathUrl = "";
let pathButton = document.getElementById("updatepathbutton");
let makeButton = document.getElementById("makebutton");
let craftButton = document.getElementById("craft");
let pickButton = document.getElementById("pick");
let craftText = `Craft today's W-9`;
let pickText = `Where is your W-9?`;

(function () {
	checkForPath();
	pickButton.addEventListener("click", openDialog);
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

	pickButton.classList.add("pulse");
	pickButton.innerText = "Saved!";
	setTimeout(() => {
		pickButton.classList.remove("pulse");
		pickButton.innerText = pickText;
	}, 2000);

	setTimeout(() => {
		openTab({ currentTarget: makeButton }, "make");
	}, 2000);
}

function checkForPath() {
	if (localStorage.getItem("path")) {
		pathUrl = localStorage.getItem("path");
		document.getElementById("path").innerHTML = prependPathUrl();
	} else {
		document.getElementById("currentpath").style.display = "none";
		pathButton.click();
		pathButton.innerText = "Locate a W-9";
		makeButton.disabled = true;
	}
}

function savePath() {
	localStorage.setItem("path", pathUrl);

	document.getElementById("path").innerHTML = prependPathUrl();
	document.getElementById("currentpath").style.display = "block";
	pathButton.innerText = "Locate a W-9";
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
		y: 195,
		size: 12,
	});

	const pdfBytes = await pdfDoc.save();

	let fileName = `w9-${localDate.replaceAll("/", "-")}`;

	try {
		fileName = await doesFileExist(fileName);

		await writeFile(fileName + ".pdf", pdfBytes, {
			baseDir: BaseDirectory.Download,
		});

		craftButton.classList.add("pulse");
		craftButton.innerText = "Saved!";
		setTimeout(() => {
			craftButton.classList.remove("pulse");
			craftButton.innerText = craftText;
		}, 2000);
	} catch (error) {
		console.error(error);
	}
}
async function doesFileExist(fileName) {
	let fileExists = await exists(fileName + ".pdf", {
		baseDir: BaseDirectory.Download,
	});

	let fileCounter = 0;
	while (fileExists) {
		fileCounter++;
		fileExists = await exists(fileName + `-${fileCounter}.pdf`, {
			baseDir: BaseDirectory.Download,
		});
	}

	return fileCounter > 0 ? fileName + `-${fileCounter}` : fileName;
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
	element.classList.add("active");
}
