const postcss = require('rollup-plugin-postcss');
const autoprefixer = require('autoprefixer');
const tailwindcss = require('tailwindcss');
const postcssPrefix = require('postcss-prefix-selector');
const tailwindcssConfig = require('./tailwind.config');

module.exports = {
  rollup(config, options) {
    config.plugins.push(
      postcss({
        minimize: true,
        inject: {
          insertAt: 'top',
        },
        plugins: [
          tailwindcss(tailwindcssConfig),
          autoprefixer(),
          postcssPrefix({ prefix: '.oneai-analytics-namespace' }),
        ],
        inject: true,
        // only write out CSS for the first bundle (avoids pointless extra files):
        extract: !!options.writeMeta,
      })
    );

    return config;
  },
};
