const postcss = require('rollup-plugin-postcss');
const autoprefixer = require('autoprefixer');
const tailwindcss = require('tailwindcss');

module.exports = {
  rollup(config, options) {
    config.plugins.push(
      postcss({
        minimize: true,
        inject: {
          insertAt: 'top',
        },
        plugins: [
          tailwindcss({
            content: ['./src/**/*.{js,jsx,ts,tsx}'],
            theme: {
              extend: {},
            },
            plugins: [],
          }),
          autoprefixer(),
        ],
        inject: true,
        // only write out CSS for the first bundle (avoids pointless extra files):
        extract: !!options.writeMeta,
      })
    );
    return config;
  },
};
