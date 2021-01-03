const purgecss = require('@fullhuman/postcss-purgecss')({
  content: [
    './src/**/*.html',
    './src/**/*.vue',
    './src/**/*.jsx',
  ],

  defaultExtractor: (content) => {
    const contentWithoutStyle = content.replace(/<style[^]+?<\/style>/gi, '')
    return contentWithoutStyle.match(/[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]+/g) || []
  },
  safelist: [ /-(leave|enter|appear)(|-(to|from|active))$/, /^(?!(|.*?:)cursor-move).+-move$/, /^router-link(|-exact)-active$/, /data-v-.*/ ],
});

const cssnano = require('cssnano')({
  preset: 'default',
});

const postcsspresetenv = require('postcss-preset-env');

module.exports = ({file, options, env}) => ({
  plugins: [
    postcsspresetenv,
    ...(env === 'production' ? [purgecss, cssnano] : []),
  ]
})
