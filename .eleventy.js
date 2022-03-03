const now = String(Date.now());
const htmlmin = require('html-minifier');

module.exports = function(eleventyConfig) {
	eleventyConfig.addWatchTarget('./styles/tailwind.config.js');
	eleventyConfig.addWatchTarget('./styles/tailwind.css');
	eleventyConfig.addPassthroughCopy({ './_tmp/style.css': './style.css' });
	eleventyConfig.addShortcode('version', function () {
		return now
	});
	eleventyConfig.addTransform('htmlmin', function (content, outpath) {
		if (process.env.ELEVENTY_PRODUCTION && outpath && outpath.endsWith('.html')) {
			let minified = htmlmin.minify(content, {
				useShortDoctype: true,
				removeComments: true,
				collapseWhitespace: true,
			});
			return minified;
		}
		return content;
	});
	eleventyConfig.addPassthroughCopy({
		'./node_modules/alpinejs/dist/cdn.js': './js/alpine.js',
	})
	return {
		dir: {
			input: "site",
			output: "dist"
		}
	}
}