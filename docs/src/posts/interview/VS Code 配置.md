---
updateTime: "2023-05-16 08:36"
date: "2023-05-16"
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
