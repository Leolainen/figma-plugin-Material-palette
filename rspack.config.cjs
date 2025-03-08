// const HtmlInlineScriptPlugin = require("html-inline-script-webpack-plugin");
// const HtmlWebpackPlugin = require("html-webpack-plugin");
const { defineConfig } = require("@rspack/cli");
const rspack = require("@rspack/core");
const path = require("path");

module.exports = defineConfig((env, argv) => ({
  mode: argv.mode === "production" ? "production" : "development",

  // This is necessary because Figma's 'eval' works differently than normal eval
  devtool: argv.mode === "production" ? false : "inline-source-map",

  entry: {
    ui: "./src/ui.tsx", // The entry point for your UI code
    code: "./src/code.ts", // The entry point for your plugin code
  },

  module: {
    rules: [
      // Converts TypeScript code to JavaScript
      // { test: /\.(ts|tsx)?$/, use: "ts-loader", exclude: /node_modules/ },
      {
        test: /\.(ts|tsx)?$/,
        use: "builtin:swc-loader",
        exclude: /node_modules/,

        options: {
          jsc: {
            parser: {
              syntax: "typescript",
            },
          },
        },
        type: "javascript/auto",
      },

      // Allows you to use "<%= require('./file.svg') %>" in your HTML code to get a data URI
      {
        test: /\.(png|jpg|gif|webp|svg|zip)$/,
        loader: "url-loader",
      },
    ],
  },

  // rspack tries these extensions for you if you omit the extension like "import './file'"
  resolve: { extensions: [".tsx", ".ts", ".jsx", ".js"] },

  output: {
    filename: "[name].js",
    publicPath: "/dist",
    path: path.resolve(__dirname, "dist"), // Compile into a folder called "dist"
  },

  // Tells rspack to generate "ui.html" and to inline "ui.ts" into it
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: "./src/ui.html",
      filename: "ui.html",
      inlineSource: ".(js)$",
      chunks: ["ui"],
      inject: "body",
    }),
    // new HtmlInlineScriptPlugin(),
  ],
}));
