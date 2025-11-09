---
updateTime: "2022-02-27 15:08"
date: "2022-02-27"
title: "Antd 源码分析之 useMergedState"
desc: "解析 Ant Design useMergedState 的受控与非受控合并策略与常见用法。"
tags: "interview/antd"
outline: deep
---

用法与 useState 类似，区别是 如果 props 提供 value 值，将会用 value 值来初始化 state 状态。

## 用法

```ts
const [innerChecked, setInnerChecked] = useMergedState<boolean>(false, {
      value: checked,
      defaultValue: defaultChecked,
    });
```

## 源码分析

```ts
import * as React, { useState } from 'react';

/**
* Similar to `useState` but will use props value if provided.
 */
export default function useMergedState<T, R = T>(
  defaultStateValue: T | (() => T),
  option?: {
    defaultValue?: T | (() => T);
    value?: T;
    onChange?: (value: T, prevValue: T) => void;
    postState?: (value: T) => T;
  },
): [R, (value: T, ignoreDestroy?: boolean) => void] {
  const { defaultValue, value, onChange, postState } = option || {};
  // 声明内部 value 值
  const [innerValue, setInnerValue] = useState<T>(() => {
    // value 存在，用 value 初始化 innerValue 的值
    if (value !== undefined) {
      return value;
    }
    // 同上
    if (defaultValue !== undefined) {
      return typeof defaultValue === 'function'
        ? (defaultValue as any)()
        : defaultValue;
    }
    // defaultStateValue 优先级最低
    return typeof defaultStateValue === 'function'
      ? (defaultStateValue as any)()
      : defaultStateValue;
  });

  let mergedValue = value !== undefined ? value : innerValue;
  if (postState) {
    // 数据处理
    mergedValue = postState(mergedValue);
  }

  // 封装内部的 setState
  const onChangeRef = React.useRef(onChange);
  onChangeRef.current = onChange;

  const triggerChange = React.useCallback(
    (newValue: T, ignoreDestroy?: boolean) => {
      setInnerValue(newValue, ignoreDestroy);
      if (mergedValue !== newValue && onChangeRef.current) {
        onChangeRef.current(newValue, mergedValue);
      }
    },
    [mergedValue, onChangeRef],
  );

  // Effect of reset value to `undefined`
  const prevValueRef = React.useRef(value);
  React.useEffect(() => {
    if (value === undefined && value !== prevValueRef.current) {
      setInnerValue(value);
    }

    prevValueRef.current = value;
  }, [value]);

  return [mergedValue as unknown as R, triggerChange];
}
```

## 纠错与补充

- `useMergedState` 不是简单的「受控 + 非受控」合并器，它的 `value`、`defaultValue`、`defaultStateValue` 优先级依次降低；如果你传入了 `value` 却忘记配合 `onChange`，组件将永远保持受控值，看似「失效」实则设计如此。
- `postState` 只在读阶段运行，不能在里面产生副作用；常见做法是把日期、布尔等做一次格式化，这样外部 `onChange` 拿到的是处理后的值。
- 由于内部用 `useState` 保存 `innerValue`，在 React 18 并发模式下引用比较依旧安全；不过如果 `value` 可能短时间内频繁变动，请确保依赖它的副作用使用稳定引用，必要时结合 `useMemo`。
