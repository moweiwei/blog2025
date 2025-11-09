---
updateTime: "2023-05-16 08:36"
date: "2023-05-16"
title: "VS Code 配置"
desc: "记录个人 VS Code 插件、代码片段与效率配置。"
tags: "interview/tools"
outline: deep
---

## console.log 快捷输入

打开 `文件 --> 首选项 --> 用户片段`

在输入框中输入markdown，可以找到markdown.json的代码片段配置 放开 example 注释

```js
"Print to console": {
  "prefix": "log",
  "body": [
   "console.log('$1');",
   "$2"
  ],
  "description": "Log output to console"
 },
```

## markdown 代码段快捷输入

同上 在 markdown.json 中继续配置如下

````js
"Print to ```js": {
  "prefix": "```js",
  "body": [
   "```js",
   "$1",
   "```",
  ],
  "description": "js代码片段"
 },
 "Print to ```jsx": {
  "prefix": "```jsx",
  "body": [
   "```jsx",
   "$1",
   "```",
  ],
  "description": "jsx代码片段"
 },
````

配置添加后，markdown 中输入 ```js 并没有快捷提示 还需要在 setting.json 中添加如下配置

setting.json 打开位置：打开vs code的设置，文件 --> 首选项 --> 设置 --> 打开设置（在设置的右上角）

```js
"[markdown]":{
    "editor.quickSuggestions": true
}
```

## 常用效率提升设置

- `\"editor.formatOnSave\": true` + 配套格式化插件（如 Prettier）可以减少手动格式化。
- `\"files.associations\"` 里把特定后缀映射到想要的语言模式，例如 `"*.api": "typescript"`，可以获得更好的高亮与补全。
- 善用 Settings Sync：在命令面板执行 `Settings Sync: Turn On`，即可把扩展、设置、代码片段同步到 GitHub/Microsoft 账号，换机也不怕。

## 多光标技巧

- `⌘ + D`（Win: `Ctrl + D`）逐个选中同名文本，适合批量改变量名。
- `⌥ + 点击`（Win: `Alt + Click`）自定义多光标；`⌥ + Shift + I` 可以在每一行末尾创建光标，批量添加语句。
- 结合内置宏 `Insert Numbers`，能在多光标场景下自动递增数字，编辑 mock 数据更轻松。
