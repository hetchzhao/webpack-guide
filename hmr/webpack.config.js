const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: './src/index',
  devServer: {
    contentBase: './dist',
    port: 8080,
    hot: true 
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './public/index.html')
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
}