---
updateTime: "2023-02-11 10:12"
date: "2023-02-11"
title: "React 中常用 TS 类型"
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

## 组合 Props 的方式

```ts
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};
```

`ButtonHTMLAttributes` 帮你继承了原生 `<button>` 的所有事件、属性；自己再扩展业务字段即可。

## 函数组件默认 children

```ts
type CardProps = React.PropsWithChildren<{
  title: string;
}>;

const Card = ({ title, children }: CardProps) => (
  <section>
    <h2>{title}</h2>
    {children}
  </section>
);
```

`PropsWithChildren` 只是在原类型上额外补了一个可选的 `children?: ReactNode`，不强制要求一定传 children。

## 推断另一个组件的 Props

```ts
type InputProps = React.ComponentProps<'input'>; // HTMLInputElement 属性
type ModalProps = React.ComponentProps<typeof Modal>; // 复用已有组件的 Props
```

这在封装二次组件时非常有用，可以保持被包装组件的类型一致。

## Dispatch 类型签名

```ts
const [state, setState] = useState(0);
// setState 的类型是 React.Dispatch<React.SetStateAction<number>>
```

如果需要把 `setState` 透传到子组件，可以显式声明：

```ts
type CounterProps = {
  value: number;
  onChange: React.Dispatch<React.SetStateAction<number>>;
};
```

这样既能接受值，也能接受函数式更新，避免误用 `number => void`。
