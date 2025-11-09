---
updateTime: "2023-02-11 10:12"
date: "2023-02-11"
desc: "汇总 React 项目中常用的 TypeScript 类型工具与模式。"
tags: "interview/react/typescript"
outline: deep
---

## 函数组件注解

```ts
const Test = React.FC<Props>
```

## 类组件注解

```ts
class Test extends React.Component<Props,States>
```

## 泛型 class 组件

```ts
interface SelectProps<T> {
  items: T[]
}

class Select<T> extends React.Component<SelectProps<T>, {}> {
  // ...
}

const Form = () => <Select<string> items={['a', 'b']} />
```
