const Image = require('@11ty/eleventy-img');
const htmlmin = require('html-minifier');
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

async function imageShortcode(src, alt, sizes) {
	if (!src) {
		return null;
	}
  let metadata = await Image(src, {
    widths: [
			600,
			800,
			1200,
			1440,
		],
    formats: ["avif", "jpeg"],
		outputDir: './dist/img'
  });

  let imageAttributes = {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async",
  };

  // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
  return Image.generateHTML(metadata, imageAttributes);
}

async function navbarShortCode(elements) {
	return elements.map(element => `<a href="${element.url}"><li>${element.title}</li></a>`).join('');
}

module.exports = function(eleventyConfig) {
	eleventyConfig.addPassthroughCopy('styles')
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

	eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
  eleventyConfig.addLiquidShortcode("image", imageShortcode);
  eleventyConfig.addJavaScriptFunction("image", imageShortcode);

	eleventyConfig.addNunjucksAsyncShortcode("navbar", navbarShortCode);
  eleventyConfig.addLiquidShortcode("navbar", navbarShortCode);
  eleventyConfig.addJavaScriptFunction("navbar", navbarShortCode);

	eleventyConfig.addPlugin(eleventyNavigationPlugin);

	return {
		passthroughFileCopy: true,
		dir: {
			input: "site",
			output: "dist"
		}
	}
}