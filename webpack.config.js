const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const moduleRules = {
  rules: [
    {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
      }
    },
    {
      test: /\.s?css?/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
          options: {
            hmr: process.env.NODE_ENV === 'development',
          }
        },
        'css-loader',
        'sass-loader',
      ]
    },
    {
      test: /\.(png|svg|jpg|jpeg|gif)$/,
      use: ['file-loader']
    }
  ]
}

const clientConfig = {
  entry: {
    index: './src/client/js/index.js',
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/dist/',
    filename: '[name].js',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
  module: moduleRules,
}

module.exports = [
  clientConfig,
];
