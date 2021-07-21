const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  mode: 'development',
  entry: {
    app: ['./src/main.ts']
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    contentBase: false,
    hot: true,
    port: 8080,
    compress: true,
    overlay: true
  },
  resolve: {
    extensions:['.tsx', '.ts', '.mjs', '.js', '.jsx', '.vue', '.json', '.wasm'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  module: {
    rules: [{
      test: /.vue$/,
      use: [{ loader: 'vue-loader' }]
    },{
      test: /\.ts$/,
      use: [{
        loader: 'babel-loader'
      },{
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
          appendTsSuffixTo: [ '\\.vue$' ],
          happyPackMode: false
        }
      }]
    },{
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader'
      ]
    },{
      test: /\.scss$/,
      use: [
        {
          loader: "style-loader" // creates style nodes from JS strings
        },
        {
          loader: "css-loader" // translates CSS into CommonJS
        },
        {
          loader: "sass-loader" // compiles Sass to CSS
        }
      ]
    },{
      test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 4096,
          fallback: {
            loader: 'file-loader',
            options: { name: 'img/[name].[hash:8].[ext]' }
          }
        }
      }]
    },{
      test: /\.(svg)(\?.*)?$/,
      use: [{
        loader: 'file-loader',
        options: { name: 'img/[name].[hash:8].[ext]' }
      }]
    },{
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 4096,
          fallback: {
            loader: 'file-loader',
            options: { name: 'media/[name].[hash:8].[ext]' }
          }
        }
      }]
    },{
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 4096,
          fallback: {
            loader: 'file-loader',
            options: { name: 'fonts/[name].[hash:8].[ext]' }
          }
        }
      }]
    }]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './public/index.html')
    })
  ]
}