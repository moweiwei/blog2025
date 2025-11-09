---
updateTime: "2024-08-30 13:54"
date: "2024-08-30"
title: "如何在 class 组件中使用 hooks"
desc: "介绍在类组件体系中复用 Hooks 能力的方案。"
tags: "interview/react/hooks"
outline: deep
---

解决办法

以一个简单的 `useScreenWidth` Hook 为例，它的目的是获取全屏的宽度，并且去监听浏览器窗口的变化，更新宽度：

```jsx
import { useEffect, useState } from "react";

export function useScreenWidth(): number {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handler = (event: any) => {
      setWidth(event.target.innerWidth);
    };
    // 监听浏览器窗口变化
    window.addEventListener("resize", handler);
    // 组件unmount时要解除监听
    return () => {
      window.removeEventListener("resize", handler);
    };
  }, []);

  return width;
}
```

## 方法 1：将 Hook 包装成 HOC

HOC 是 React 中复用组件的高级用法，它的本质是一个函数，它的输入参数是一个组件，返回相同的组件以及一些额外的 props。在我们的例子里，可以让 hook 函数作为 props
传递到目标组件中:

```jsx
import React from "react";
import { useScreenWidth } from "../hooks/useScreenWidth";

export const withHooksHOC = (Component: any) => {
  return (props: any) => {
    const screenWidth = useScreenWidth();

    return <Component width={screenWidth} {...props} />;
  };
};
```

将我们的目标组件用上述的 withHooksHOC 包装起来

```jsx
import React from "react";
import { withHooksHOC } from "./withHooksHOC";

interface IHooksHOCProps {
  width: number;
}

class HooksHOC extends React.Component<IHooksHOCProps> {
  render() {
    return <p>width: {this.props.width}</p>;
  }
}

export default withHooksHOC(HooksHOC);
```

## 方法 2：将 Hook 包装成函数组件

将 hook 变成函数组件，它接收一个参数为 width 的 children 函数，然后将 width 作为 render prop 传递：

```jsx
import { FunctionComponent } from "react";
import { useScreenWidth } from "../hooks/useScreenWidth";

type ScreenWidthChildren = (screenWidth: number) => React.ReactNode;

interface IScreenWidthProps {
  children: ScreenWidthChildren;
}

export const ScreenWidth: FunctionComponent<IScreenWidthProps> = ({ children }) => {
  const screenWidth: number = useScreenWidth();

  return children(screenWidth);
};
```

使用：

```jsx
import React from "react";
import { ScreenWidth } from "./ScreenWidth";

export class HooksRenderProps extends React.Component {
  render() {
    return <ScreenWidth>{(width) => <p style={{ fontSize: "48px" }}>width: {width}</p>}</ScreenWidth>;
  }
}
```

## 方法 3：借助外部 store + useSyncExternalStore

当 Hook 内部持有的是某个可以被多个组件共享的状态（窗口尺寸、网络状态等）时，可以把这份状态抽到一个轻量 store 中，用函数组件负责订阅，再在 class 组件里通过 `subscribe` 读取：

```ts
// screenStore.ts
type Listener = () => void;
const listeners = new Set<Listener>();
let width = window.innerWidth;

window.addEventListener('resize', () => {
  width = window.innerWidth;
  listeners.forEach((l) => l());
});

export function useScreenStore() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => width
  );
}
```

```ts
const ScreenWidthConsumer = React.forwardRef<HTMLDivElement>((props, ref) => {
  const width = useScreenStore();
  return <div ref={ref}>{width}</div>;
});

export class ScreenDashboard extends React.Component {
  render() {
    return <ScreenWidthConsumer />;
  }
}
```

`useSyncExternalStore` 能确保在并发模式下订阅与读取是原子的，避免 render props/HOC 多包一层带来的嵌套地狱。
