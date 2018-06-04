const webpack = require('webpack');
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: './app/js/app.js',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'awesome-typescript-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: './app/js/bundle.js',
  },
  plugins: [
    new webpack.ProvidePlugin({
        'jQuery': 'jquery',
    }),
    // new UglifyJSPlugin()
  ],
};
