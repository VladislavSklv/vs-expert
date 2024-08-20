const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = {
  mode: process.env.mode ?? "development",
  entry: path.resolve(__dirname, "src", "index.js"),
  output: {
    filename: "main.[contenthash].js",
    path: path.resolve(__dirname, "build"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader", // translates CSS into CommonJS
          "postcss-loader", // Run postcss actions
          "sass-loader", // compiles Sass to CSS, using Node Sass by default
        ],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader", // translates CSS into CommonJS
          "postcss-loader", // Run postcss actions
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        type: "asset/resource",
        generator: {
          filename: "assets/fonts/[name][ext][query]", // This handles fonts
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/images/[name][ext][query]", // This handles images
        },
      },
      {
        test: /\.html$/,
        use: ["html-loader"],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "assets/css/[name].[hash].css",
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public", "index.html"),
      inject: "body",
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src", "pages", "zapchasti.html"),
      filename: "zapchasti.html", // Output file
      inject: "body",
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src", "pages", "tehnika.html"),
      filename: "tehnika.html", // Output file
      inject: "body",
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src", "pages", "oplata.html"),
      filename: "oplata.html", // Output file
      inject: "body",
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src", "pages", "kontakti.html"),
      filename: "kontakti.html", // Output file
      inject: "body",
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src", "pages", "dostavka.html"),
      filename: "dostavka.html", // Output file
      inject: "body",
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src", "pages", "truck-details.html"),
      filename: "truck-details.html", // Output file
      inject: "body",
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src", "pages", "trimble.html"),
      filename: "trimble.html", // Output file
      inject: "body",
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(
        __dirname,
        "src",
        "pages",
        "privacy-politics.html"
      ),
      filename: "privacy-politics.html", // Output file
      inject: "body",
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "public/assets/", to: "assets/images/" },
        { from: "src/fonts/", to: "assets/fonts/" },
      ],
      options: {
        concurrency: 90,
      },
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "build"),
    },
    compress: true,
    port: 3000,
    hot: true,
    open: true,
    historyApiFallback: true,
  },
};
