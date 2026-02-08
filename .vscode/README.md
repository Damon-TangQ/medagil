# VS Code 工作区配置

本目录包含 Medagil 项目的 VS Code 推荐插件与工作区设置。

## 必须安装的插件（维护代码规范与格式）

以下插件与项目规范强绑定，**必须安装**以保证代码风格一致、提交前通过 lint/format：

| 插件 | 用途 |
|------|------|
| EditorConfig | 统一缩进、换行、编码（`.editorconfig`） |
| Prettier | TS/JS/JSON/CSS 格式化（`.prettierrc`） |
| ESLint | JS/TS 代码检查（Next.js 项目） |
| markdownlint | Markdown 语法检查（`.markdownlint.yaml`） |

## 推荐安装的插件（按技术栈）

| 技术栈 | 插件 | 用途 |
|--------|------|------|
| 前端 | Tailwind CSS IntelliSense | Tailwind 类名补全与提示 |
| 小程序 | Taro Pages | Taro 页面/路由自动生成 |
| 小程序 | 微信小程序开发工具 | 小程序预览、打包、代码补全 |
| Python | Python | 语言支持 |
| Python | Pylance | 类型检查与智能补全 |
| Python | Ruff | Lint + Format（替代 Black） |
| Go | Go | 语言支持、gofmt |

## 不推荐的插件

- **Black**、**autopep8**：项目统一使用 Ruff 做 Python 格式化与检查。
