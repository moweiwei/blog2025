---
updateTime: "2022-04-10 11:55"
date: "2022-04-10"
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
