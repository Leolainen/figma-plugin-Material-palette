module.exports = function (api) {
  api.cache(true);

  return {
    plugins: [
      "babel-plugin-react-compiler",
      "@babel/plugin-syntax-jsx",
      ["@babel/plugin-syntax-typescript", { isTSX: true }],
    ],
  };
};
