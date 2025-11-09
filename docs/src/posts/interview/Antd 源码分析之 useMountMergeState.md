---
updateTime: "2022-04-10 11:55"
date: "2022-04-10"
title: "Antd 源码分析之 useMountMergeState"
desc: "记录 useMountMergeState 初始化逻辑及和 useMergedState 的差异。"
tags: "interview/antd"
outline: deep
---

接上篇 `useMergeState`, `useMountMergeState` 是组件挂载后再声明 state。

## 用法

```ts
const [list, setList] = useMountMergeState<any[] | undefined>(defaultData, {
    value: options?.dataSource,
    onChange: options?.onDataSourceChange,
  });
```

## 源码分析

```ts
import useMergedState from './useMergedState';
import { useEffect, useRef } from 'react';

type Dispatch<A> = (value: A) => void;

export default function useMountMergeState<S>(
  initialState: S | (() => S),
  option?: {
    defaultValue?: S;
    value?: S;
    onChange?: (value: S, prevValue: S) => void;
    postState?: (value: S) => S;
  },
): [S, Dispatch<S>] {
  const mountRef = useRef<boolean>(false);
  const frame = useRef<number | undefined>(undefined);

  useEffect(() => {
    mountRef.current = true;
    return () => {
      clearTimeout(frame.current);
      mountRef.current = false;
    };
  }, []);

  const [state, setState] = useMergedState<S>(initialState, option);
  const mountSetState: Dispatch<S> = (prevState: S) => {
    clearTimeout(frame.current);
    frame.current = window.setTimeout(() => {
      if (mountRef.current) {
        setState(prevState);
      }
    }, 16);
  };
  return [state, mountSetState];
}
```

## 纠错与补充

- 该 Hook 通过 `setTimeout(..., 16)` 延迟更新以模拟浏览器下一帧写入，因此一定要在浏览器环境使用；若在 SSR 或 Node 中使用记得加 `typeof window !== 'undefined'` 防护。
- `mountSetState` 里使用的是 `clearTimeout` 而不是 `cancelAnimationFrame`，主要为了兼容 React Native；如果依赖帧率一致性可以手动改成 `requestAnimationFrame`。
- 和 `useMergedState` 一样，它仍然支持 `value`、`defaultValue` 这种受控模式，常见的误用是：外部传了 `value` 却期待内部 `setState` 生效，此时应该改成 `onChange` 通知父组件。
