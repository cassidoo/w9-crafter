module.exports = {
	packagerConfig: {
		asar: true,
		icon: "./extraResources/appicon",
	},
	rebuildConfig: {},
	makers: [
		{
			name: "@electron-forge/maker-squirrel",
			config: {
				iconUrl: "https://cassidoo.co/img/w9.ico",
				setupIcon: "./extraResources/appicon.ico",
			},
		},
		{
			name: "@electron-forge/maker-zip",
			platforms: ["darwin"],
			config: {
				icon: "./extraResources/appicon.icns",
			},
		},
		{
			name: "@electron-forge/maker-deb",
			config: {
				options: {
					icon: "./extraResources/appicon.png",
				},
			},
		},
		{
			name: "@electron-forge/maker-rpm",
			config: {
				icon: "./extraResources/appicon.png",
			},
		},
	],
	plugins: [
		{
			name: "@electron-forge/plugin-auto-unpack-natives",
			config: {},
		},
	],
};
