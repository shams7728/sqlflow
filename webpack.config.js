const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js', // Your main entry file
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    hot: true, // Enable Hot Module Replacement (HMR)
    liveReload: false,
    headers: {
      'Accept-Ranges': 'none', // Fixes Range Not Satisfiable error
    },
    compress: true,
    port: 3000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // Your HTML template
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'], // For React/JS
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'], // For CSS
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'], // Auto-resolve these extensions
  },
};