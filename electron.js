const { menubar } = require("menubar");
const path = require("path");

const mb = menubar({
	browserWindow: {
		width: 420,
		height: 520,
	},
	icon: path.join(__dirname, "extraResources", "icon.png"),
	tooltip: "W-9 Crafter",
});

mb.on("ready", () => {
	console.log("time to generate w-9s");
});
