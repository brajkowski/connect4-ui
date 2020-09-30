const merge = require('webpack-merge');
const dev = require('./dev.config');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge.merge(dev, {
  mode: 'production',
  devtool: false,
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false,
          },
        },
      }),
    ],
  },
});
