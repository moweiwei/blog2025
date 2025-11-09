---
updateTime: "2024-02-22 07:51"
date: "2024-02-22"
title: "utils 工具函数"
desc: "收集常用工具函数及其实现思路。"
tags: "interview/utils"
outline: deep
---

## runFunction

是函数就返回调用函数，是值就返回值。

```ts
export function runFunction<T extends any[]>(valueEnum: any, ...rest: T) {
  if (typeof valueEnum === 'function') {
    return valueEnum(...rest);
  }
  return valueEnum;
}
```

## 获取 JS 数据类型

```js
/**
 * 获取 JS 数据类型 返回大写字母开头
 * @param data
 * @returns {string} Function | Array | String | Number | Undefined | Null...
 */
export const getType = (data: any) => {
  return Object.prototype.toString.call(data).slice(8, -1)
}
```

## sleep

```ts
export const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    const timer = setTimeout(() => {
      clearTimeout(timer);
      resolve();
    }, ms);
  });
```

配合 `await sleep(300)` 可以快速做重试、节流等异步节奏控制。

## once

```ts
export function once<T extends (...args: any[]) => any>(fn: T) {
  let called = false;
  let value: ReturnType<T>;
  return (...args: Parameters<T>) => {
    if (!called) {
      called = true;
      value = fn(...args);
    }
    return value;
  };
}
```

`once` 适合初始化开销较大的逻辑，例如创建全局单例、注入脚本等。
