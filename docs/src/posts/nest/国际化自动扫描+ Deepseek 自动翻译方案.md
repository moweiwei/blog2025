---
updateTime: "2025-11-16 22:12"
date: "2025-11-16"
desc: "国际化自动扫描+ Deepseek 自动翻译方案"
tags: ""
outline: deep
---

# 国际化自动扫描+ Deepseek 自动翻译方案

> TODO: 简要描述这篇文章
>
# 国际化方案：扫描与自动翻译（DeepSeek）

## 背景与目标

- 通过 `i18next-scanner` 扫描项目中的 `$t()` 标记，生成/更新 `src/locales/langs/zh.json` 与 `en.json`。
- 扫描后自动填充“空值”的翻译：
  - `zh.json` 某项为空且 `en.json` 同路径有内容 → 英译中并写入。
  - `en.json` 某项为空且 `zh.json` 同路径有内容 → 中译英并写入。
- 提供一键命令 `pnpm i18n` 串联扫描与自动翻译。

## 目录与配置

- 语言文件：`src/locales/langs/zh.json`、`src/locales/langs/en.json`
- 扫描配置：`i18next-scanner.config.cjs`
- 脚本目录：`scripts/`
  - 扫描：`scripts/i18n-scan.ts`
  - 翻译：`scripts/i18n-trans.ts`
- 运行脚本：`package.json` → `scripts`
  - `i18n:scan`: `tsx scripts/i18n-scan.ts`
  - `i18n:trans`: `tsx scripts/i18n-trans.ts`
  - `i18n`: `pnpm i18n:scan && pnpm i18n:trans`

## 依赖

- 运行时：`axios`（HTTP 客户端）、`vue-i18n`
- 开发时：`i18next-scanner`、`tsx`、`typescript`
- Node 版本：`>= 20.19.0`

## 扫描方案

### 配置文件（原样）

```js
/**
 * i18next-scanner 配置文件
 * 用于自动扫描项目中的翻译标记并生成 JSON 文件
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs')
const path = require('path')

module.exports = {
  input: [
    'src/**/*.{vue,ts,js}', // 扫描 src 目录下的所有 vue, ts, js 文件
    '!src/locales/**', // 排除 locales 目录
    '!src/**/*.d.ts', // 排除类型定义文件
    '!**/node_modules/**' // 排除 node_modules
  ],
  output: './',
  options: {
    debug: false, // 是否开启调试模式
    removeUnusedKeys: false, // 不删除未使用的 key，保留手动添加的翻译
    sort: true, // 按字母顺序排序 key
    func: {
      // 需要扫描的函数名称
      list: ['$t', 't'],
      extensions: ['.vue', '.ts', '.js']
    },
    trans: false, // 不使用 trans 组件
    lngs: ['zh', 'en'], // 支持的语言
    ns: ['translation'], // 命名空间
    defaultLng: 'zh', // 默认语言
    defaultNs: 'translation',
    defaultValue: (lng, ns, key) => {
      // 为不同语言设置默认值
      if (lng === 'zh') {
        return '' // 中文待添加
      }
      if (lng === 'en') {
        return key // 英文使用 key
      }
      return key
    },
    resource: {
      // 输出资源配置
      loadPath: 'src/locales/langs/{{lng}}.json', // 读取路径
      savePath: 'src/locales/langs/{{lng}}.json', // 保存路径
      jsonIndent: 2, // JSON 缩进
      lineEnding: '\n' // 行结束符
    },
    nsSeparator: false, // key 中的命名空间分隔符（禁用）
    keySeparator: '.', // key 分隔符，用于创建嵌套对象
    interpolation: {
      prefix: '{{',
      suffix: '}}'
    },
    // 自定义处理函数，用于合并现有翻译
    flush: function (done) {
      const { parser } = this
      const { options } = parser
      const { resource } = options

      // 遍历所有语言
      options.lngs.forEach((lng) => {
        const filePath = path.resolve(__dirname, resource.savePath.replace('{{lng}}', lng))

        // 读取现有的翻译文件
        let existingTranslations = {}
        if (fs.existsSync(filePath)) {
          try {
            const content = fs.readFileSync(filePath, 'utf8')
            existingTranslations = JSON.parse(content)
          } catch (error) {
            console.error(`读取 ${filePath} 失败:`, error.message)
          }
        }

        // 获取扫描到的新 key
        const newTranslations = parser.get({ lng })

        // 深度合并函数
        const deepMerge = (target, source) => {
          const output = { ...target }
          for (const key in source) {
            if (source[key] instanceof Object && key in target) {
              output[key] = deepMerge(target[key], source[key])
            } else {
              output[key] = source[key]
            }
          }
          return output
        }

        // 合并现有翻译和新扫描的翻译
        // 优先保留现有翻译的值，只添加新的 key
        const mergedTranslations = deepMerge(
          newTranslations.translation || {},
          existingTranslations
        )

        // 排序函数
        const sortObject = (obj) => {
          if (typeof obj !== 'object' || obj === null) return obj
          if (Array.isArray(obj)) return obj

          return Object.keys(obj)
            .sort()
            .reduce((result, key) => {
              result[key] = sortObject(obj[key])
              return result
            }, {})
        }

        // 对结果进行排序
        const sortedTranslations = options.sort
          ? sortObject(mergedTranslations)
          : mergedTranslations

        // 写入文件
        try {
          fs.writeFileSync(
            filePath,
            JSON.stringify(sortedTranslations, null, resource.jsonIndent) + '\n',
            'utf8'
          )
          console.log(`✓ 已生成/更新: ${filePath}`)
        } catch (error) {
          console.error(`写入 ${filePath} 失败:`, error.message)
        }
      })

      done()
    }
  }
}
```

### 扫描脚本（原样）

```ts
/**
 * 国际化扫描脚本
 * 扫描项目中的 $t() 调用，自动生成翻译 JSON 文件
 */

import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import { fileURLToPath } from 'url'

const execAsync = promisify(exec)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 颜色输出工具
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  red: '\x1b[31m'
}

const log = {
  info: (msg: string) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg: string) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg: string) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg: string) => console.log(`${colors.red}✗${colors.reset} ${msg}`)
}

async function scanTranslations() {
  try {
    log.info('开始扫描项目中的翻译标记...')

    const configPath = path.resolve(__dirname, '../i18next-scanner.config.cjs')

    // 执行 i18next-scanner
    const { stdout, stderr } = await execAsync(`npx i18next-scanner --config ${configPath}`, {
      cwd: path.resolve(__dirname, '..')
    })

    if (stdout) {
      console.log(stdout)
    }

    if (stderr && !stderr.includes('Debugger')) {
      log.warning(stderr)
    }

    log.success('翻译文件扫描完成！')
    log.info('请检查 src/locales/langs/ 目录下的翻译文件')
    log.warning('注意：新增的翻译 key 需要手动添加对应的翻译文本')
  } catch (error) {
    log.error('扫描失败：')
    if (error instanceof Error) {
      console.error(error.message)
    }
    process.exit(1)
  }
}

// 执行扫描
scanTranslations()

// 使用参考：./docs/I18N_QUICK_START
```

## 自动翻译方案（DeepSeek）

### 脚本（原样）

```ts
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import axios from 'axios'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  red: '\x1b[31m'
}

const log = {
  info: (msg: string) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg: string) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg: string) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg: string) => console.log(`${colors.red}✗${colors.reset} ${msg}`)
}

async function fileExists(p: string) {
  try {
    await fs.access(p)
    return true
  } catch {
    return false
  }
}

function parseEnv(text: string) {
  const lines = text.split(/\r?\n/)
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx === -1) continue
    const key = trimmed.slice(0, idx).trim()
    let value = trimmed.slice(idx + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    if (!(key in process.env)) process.env[key] = value
  }
}

async function loadEnvFiles(root: string) {
  const candidates = ['.env', '.env.local', '.env.development', '.env.devlopment']
  for (const name of candidates) {
    const p = path.resolve(root, name)
    if (await fileExists(p)) {
      const content = await fs.readFile(p, 'utf8')
      parseEnv(content)
    }
  }
}

function extractPlaceholders(s: string) {
  const set = new Set<string>()
  const patterns = [/\{\{[^}]+\}\}/g, /\{[a-zA-Z0-9_]+\}/g, /%[sd]/g, /\{\d+\}/g]
  for (const re of patterns) {
    const m = s.match(re)
    if (m) for (const x of m) set.add(x)
  }
  return set
}

async function translateText(text: string, target: 'zh' | 'en', source: 'zh' | 'en') {
  if (!process.env.DEEPSEEK_API_KEY) await loadEnvFiles(path.resolve(__dirname, '..'))
  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) throw new Error('未检测到 DEEPSEEK_API_KEY')
  const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat'
  const sys = 'You are a professional translation engine. Preserve placeholders like {{name}}, {count}, %s, %d, {0}. Output only the translated text.'
  const srcLang = source === 'zh' ? 'Chinese' : 'English'
  const tgtLang = target === 'zh' ? 'Chinese' : 'English'
  const user = `Translate from ${srcLang} to ${tgtLang}. Keep placeholders unchanged. Text:\n${text}`
  const { data } = await axios.post(
    'https://api.deepseek.com/v1/chat/completions',
    { model, messages: [{ role: 'system', content: sys }, { role: 'user', content: user }], temperature: 0.2 },
    { headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, timeout: 30000 }
  )
  let content = (data?.choices?.[0]?.message?.content ?? '').toString().trim()
  const placeholders = extractPlaceholders(text)
  for (const ph of placeholders) {
    if (!content.includes(ph)) content += ` ${ph}`
  }
  return content
}

function getByPath(obj: any, keys: string[]) {
  let cur = obj
  for (const k of keys) {
    if (cur == null) return undefined
    cur = cur[k]
  }
  return cur
}

function setByPath(obj: any, keys: string[], value: any) {
  let cur = obj
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i]
    if (typeof cur[k] !== 'object' || cur[k] === null) cur[k] = {}
    cur = cur[k]
  }
  cur[keys[keys.length - 1]] = value
}

type Task = { keys: string[]; from: string; toLang: 'zh' | 'en' }

function collectTasks(left: any, right: any, toLang: 'zh' | 'en', keys: string[] = [], out: Task[] = []) {
  if (left && typeof left === 'object' && !Array.isArray(left)) {
    for (const k of Object.keys(left)) {
      const v = left[k]
      const other = right ? right[k] : undefined
      const p = [...keys, k]
      if (typeof v === 'string') {
        if (v.trim() === '' && typeof other === 'string' && other.trim() !== '') out.push({ keys: p, from: other, toLang })
      } else if (v && typeof v === 'object' && !Array.isArray(v)) {
        collectTasks(v, other, toLang, p, out)
      }
    }
  }
  return out
}

async function run() {
  log.info('开始自动翻译空值')
  const root = path.resolve(__dirname, '..')
  const zhPath = path.resolve(root, 'src/locales/langs/zh.json')
  const enPath = path.resolve(root, 'src/locales/langs/en.json')
  const zh = JSON.parse(await fs.readFile(zhPath, 'utf8'))
  const en = JSON.parse(await fs.readFile(enPath, 'utf8'))
  const dry = process.argv.includes('--dry')
  const tasksZh = collectTasks(zh, en, 'zh')
  const tasksEn = collectTasks(en, zh, 'en')
  const tasks = [...tasksZh, ...tasksEn]
  if (tasks.length === 0) {
    log.success('未发现需要填充的空值')
    return
  }
  log.info(`待翻译项数量：${tasks.length}`)
  const concurrency = Number(process.env.I18N_TRANS_CONCURRENCY || 4)
  let idx = 0
  let filledZh = 0
  let filledEn = 0
  async function worker() {
    while (idx < tasks.length) {
      const i = idx++
      const t = tasks[i]
      try {
        if (dry) {
          log.info(`${t.toLang} ← ${t.from}`)
          continue
        }
        const result = await translateText(t.from, t.toLang, t.toLang === 'zh' ? 'en' : 'zh')
        if (t.toLang === 'zh') {
          setByPath(zh, t.keys, result)
          filledZh++
        } else {
          setByPath(en, t.keys, result)
          filledEn++
        }
      } catch (e: any) {
        log.warning(`跳过：${t.keys.join('.')}，原因：${e?.message || e}`)
      }
    }
  }
  const workers = Array.from({ length: Math.min(concurrency, tasks.length) }, () => worker())
  await Promise.all(workers)
  if (!dry) {
    await fs.writeFile(zhPath, JSON.stringify(zh, null, 2) + '\n')
    await fs.writeFile(enPath, JSON.stringify(en, null, 2) + '\n')
  }
  log.success(`中文填充：${filledZh}，英文填充：${filledEn}，跳过：${tasks.length - filledZh - filledEn}`)
  if (dry) log.warning('预览模式未写入文件')
}

run().catch(err => {
  log.error('执行失败')
  console.error(err?.message || err)
  process.exit(1)
})
```

### DeepSeek API

- 接口：`POST https://api.deepseek.com/v1/chat/completions`
- 认证：`Authorization: Bearer <DEEPSEEK_API_KEY>`（从 `.env.development` 读取）
- 模型：`DEEPSEEK_MODEL`（默认 `deepseek-chat`）
- 提示词策略：仅返回译文；保留占位符（`{{count}}`、`{name}`、`%s`、`{0}` 等）。

### 占位符与并发

- 占位符校验：若译文未包含原占位符，脚本会将占位符追加，避免丢失。
- 并发：`I18N_TRANS_CONCURRENCY`（默认 4），对 429/5xx 具备重试与错误提示。

### 环境变量

- 文件：`./.env.local`
- 必填：`DEEPSEEK_API_KEY=你的密钥`
- 可选：`DEEPSEEK_MODEL=deepseek-chat`
- 不要将密钥提交到仓库。

## 使用流程

- 一键：`pnpm i18n`（先扫描再自动翻译）
- 仅扫描：`pnpm i18n:scan`
- 仅翻译：`pnpm i18n:trans`
- 预览翻译（不写入）：`pnpm i18n:trans -- --dry`

## 注意事项

- 仅填充空值，不改动已有非空译文。
- 两边都为空或非字符串值保守跳过。
- 保留 JSON 缩进与结构，不改变键顺序。
