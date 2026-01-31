# Medagil AI平台小程序开发指南

## 技术栈

- 微信小程序原生框架
- WXML (标记语言)
- WXSS (样式语言)
- JavaScript/TypeScript

## 项目结构

```
miniprogram/
├── pages/             # 页面
│   ├── index/         # 首页
│   ├── user/          # 用户中心
│   └── detail/        # 详情页
├── utils/             # 工具函数
├── images/            # 图片资源
├── app.js             # 小程序逻辑
├── app.json           # 小程序配置
├── app.wxss           # 小程序样式
└── sitemap.json       # 站点地图配置
```

## 开发指南

### 安装微信开发者工具

下载并安装[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)

### 导入项目

1. 打开微信开发者工具
2. 选择"导入项目"
3. 选择项目目录
4. 填写AppID（测试阶段可以使用测试号）
5. 点击"导入"

### 开发模式

在微信开发者工具中进行开发和调试。

## 代码规范

- 页面命名采用小写字母
- 组件命名采用大驼峰
- 样式使用rpx单位
- 使用小程序API进行网络请求

## 页面开发

每个页面由四个文件组成：
- .wxml: 页面结构
- .wxss: 页面样式
- .js: 页面逻辑
- .json: 页面配置

## API请求

使用wx.request进行网络请求，建议封装在utils/util.js中。

## 状态管理

使用小程序的全局变量或本地存储进行状态管理。

## 路由

使用小程序的页面栈进行页面跳转，支持以下方法：
- wx.navigateTo: 保留当前页面，跳转到应用内的某个页面
- wx.redirectTo: 关闭当前页面，跳转到应用内的某个页面
- wx.switchTab: 跳转到tabBar页面，并关闭其他所有非tabBar页面
- wx.navigateBack: 关闭当前页面，返回上一页面或多级页面

## 发布流程

1. 在微信开发者工具中点击"上传"
2. 登录微信公众平台
3. 提交审核
4. 审核通过后发布
