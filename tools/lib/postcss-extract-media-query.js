const path = require('path');
const fs = require('fs');
const mediaQuery = require('css-mediaquery');
const postcss = require('postcss');
const chalk = require('chalk');
const _ = require('lodash');

/**
 * PostCSS Extract media-query into different files
 *
 * | option        | default                    |
 * | ------------- | -------------------------- |
 * | output.path   | path.join(__dirname, '..') |
 * | output.name   | '[name]-[query].[ext]'     |
 * | queries       | {}                         |
 * | combine       | true                       |
 * | stats         | true                       |
 *
 * Example:
 *
 * ```js
 * 'lib-extract-media-query': {
 *     path: path.join(__dirname, 'dist'), // emit to 'dist' folder in root
 *     name: '[name]-[query].[ext]', // pattern of emited files
 *     queries: {
 *         'screen and (min-width: 1024px)': 'desktop'
 *     },
 *     / By default all media queries are extracted into separate files.
 *     / To only extract defined ones in `queries` option, set this to `true`. Everything else will be ignored.
 *     whitelist: true,
 *     / Combine all rules under one media rule. Disable if you don't want that for each file.
 *     combine: true,
 *     stats: true
 * }
 * ```
 *
 * Heavily inspired by:
 * https://github.com/SassNinja/postcss-extract-media-query (last commit ebd2a13f17a43196ff24a8c695c126b714b26015)
 * https://github.com/hail2u/node-css-mqpacker (last commit 7ddf3524b1184dbb315795f7340e4b0226ce0d8e)
 *
 * Known issues:
 * https://github.com/SassNinja/postcss-extract-media-query/issues/2#issuecomment-416509309
 */
module.exports = postcss.plugin('lib-extract-media-query', (opts) => {
	opts = _.merge({
		output: {
			path: path.join(__dirname, '..'),
			name: '[name]-[query].[ext]'
		},
		queries: {},
		whitelist: false,
		combine: true,
		stats: true
	}, opts);

	function addToAtRules(atRules, key, atRule) {
		// init array for target key if undefined
		if (!atRules[key]) {
			atRules[key] = [];
		}

		// create new atRule if none existing or combine false
		if (atRules[key].length === 0 || opts.combine === false) {
			atRules[key].push(postcss.atRule({ name: atRule.name, params: atRule.params }));
		}

		// pointer to last item in array
		const lastAtRule = atRules[key][atRules[key].length - 1];

		// append all rules
		atRule.walkRules(rule => {
			lastAtRule.append(rule);
		});

		// remove atRule from original chunk
		// atRule.remove();
	}

	function isSourceMapAnnotation(rule) {
		if (!rule) { return false; }
		if (rule.type !== 'comment') { return false; }
		if (rule.text.toLowerCase().indexOf('# sourcemappingurl=') !== 0) { return false; }

		return true;
	}

	return (root, result) => {
		const from = result.opts.from;
		// TODO: Check if it works
		let sourceMap = root.last;

		if (!isSourceMapAnnotation(sourceMap)) {
			sourceMap = null;
		}

		// TODO: How we handle file names here is stupid, fix it
		let file;

		if (from) {
			file = from.match(/[^/\\]+\.\w+$/)[0].split('.');
		} else {
			file = 'output.css'.match(/[^/\\]+\.\w+$/)[0].split('.');
		}

		const name = file[0];
		const ext = file[1];

		const newAtRules = {};

		root.walkAtRules('media', atRule => {
			Object.keys(opts.queries).forEach((breakpoint) => {
				const config = opts.queries[breakpoint];

				const matches = mediaQuery.match(atRule.params, {
					type: 'screen',
					width: config.from || 0.01,
				}) || mediaQuery.match(atRule.params, {
					type: 'screen',
					width: config.to - 1 || Number.MAX_SAFE_INTEGER,
				});

				if (matches) {
					addToAtRules(newAtRules, breakpoint, atRule);
				}
			});
		});

		// root.walkAtRules('media', atRule => {
		// 	// use custom query name if available (e.g. tablet)
		// 	// or otherwise the query key (converted to kebab case)
		// 	const hasCustomName = typeof opts.queries[atRule.params] === 'string';
		// 	const key = hasCustomName === true ? opts.queries[atRule.params] : _.kebabCase(atRule.params);

		// 	// extract media atRule and concatenate with existing atRule (same key)
		// 	// if no whitelist set or if whitelist and atRule has custom query name match
		// 	if (opts.whitelist === false || hasCustomName === true) {
		// 		addToAtRules(newAtRules, key, atRule);
		// 	}
		// });

		Object.keys(newAtRules).forEach(key => {
			// emit extracted css file
			if (opts.output.path) {
				const newFile = opts.output.name
					.replace('[query]', key)
					.replace('[name]', name)
					.replace('[ext]', ext);
				const newFilePath = path.join(opts.output.path, newFile);

				// create new root
				// and append all extracted atRules with current key
				const newRoot = postcss.root();

				newAtRules[key].forEach(newAtRule => {
					newRoot.append(newAtRule);
				});

				// TODO: Check if it works
				if (sourceMap) {
					newRoot.append(sourceMap);
				}

				fs.writeFileSync(newFilePath, newRoot.toString(), 'utf8');

				if (opts.stats === true) {
					console.log(chalk.green('[extracted media query]'), newFile);
				}
			}
			// if no output path defined (mostly testing purpose) merge back to root
			else {
				newAtRules[key].forEach(newAtRule => {
					root.append(newAtRule);
				});
			}
		});
	};
});
