module.exports = {
	plugins: [
		"postcss-nested",
		"postcss-flexbugs-fixes",
		"postcss-hover-media-feature",
		[
			"postcss-preset-env",
			{
				stage: 3,
				features: {
					"custom-media-queries": true,
					"custom-properties": false
				}
			}
		]
	]
}
