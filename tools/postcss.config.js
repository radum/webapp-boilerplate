/* eslint import/no-extraneous-dependencies: ["error", {"peerDependencies": true, "devDependencies": true}] */

module.exports = {
	// The list of plugins for PostCSS
	// https://github.com/postcss/postcss
	plugins: [
		// W3C variables, e.g. :root { --color: red; } div { background: var(--color); }
		// https://github.com/postcss/postcss-custom-properties
		require('postcss-custom-properties')(),

		// Postcss flexbox bug fixer
		// https://github.com/luisrudge/postcss-flexbugs-fixes
		require('postcss-flexbugs-fixes')(),

		// Log PostCSS messages in the console
		// https://github.com/postcss/postcss-reporter
		require('postcss-reporter')()
	]
};
