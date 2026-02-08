const config = {
  projectName: "medagil-miniapp",
  date: "2026-2-8",
  designWidth: 375,
  deviceRatio: { 640: 2.34, 750: 2, 375: 2, 828: 1.81 },
  sourceRoot: "src",
  outputRoot: "dist",
  plugins: ["@tarojs/plugin-framework-react"],
  defineConstants: {},
  copy: { options: {} },
  framework: "react",
  compiler: "webpack5",
  cache: { enable: false },
  mini: {
    postcss: {
      pxtransform: { enable: true, config: {} },
      url: { enable: true, config: { limit: 1024 } },
      cssModules: { enable: false, config: { namingPattern: "module", generateScopedName: "[name]__[local]___[hash:base64:5]" } },
    },
  },
  h5: {
    publicPath: "/",
    staticDirectory: "static",
    postcss: {
      autoprefixer: { enable: true },
      cssModules: { enable: false, config: { namingPattern: "module", generateScopedName: "[name]__[local]___[hash:base64:5]" } },
    },
  },
};

export default function (merge: (a: object, b: object) => object) {
  if (process.env.NODE_ENV === "development") {
    return merge({}, config, require("./dev").default);
  }
  return merge({}, config, require("./prod").default);
}
