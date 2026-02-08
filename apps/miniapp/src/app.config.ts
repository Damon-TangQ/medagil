export default defineAppConfig({
  pages: ["pages/index/index", "pages/user/index"],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "Medagil",
    navigationBarTextStyle: "black",
  },
  tabBar: {
    list: [
      { pagePath: "pages/index/index", text: "首页" },
      { pagePath: "pages/user/index", text: "我的" },
    ],
  },
});
