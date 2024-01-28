const { menubar } = require("menubar");

const mb = menubar({
	browserWindow: {
		width: 420,
		height: 480,
	},
	icon: "./icon.png",
	tooltip: "W-9 Crafter",
});

mb.on("ready", () => {
	console.log("time to generate w-9s");
});
