---
updateTime: "2024-10-17 18:06"
date: "2024-10-17"
title: "常用 hooks 分析"
desc: "对常用自定义 hooks 的设计与场景做集中拆解。"
tags: "interview/react/hooks"
outline: deep
---

## usePrevious

上一步更新状态值

```ts
import { useEffect, useRef } from 'react';

const usePrevious = <T>(state: T): T | undefined => {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = state;
  });

  return ref.current;
};

export default usePrevious;
```

## useEventCallback

保持事件类型函数引用

你可能会需要用 useCallback 记住一个回调，但由于内部函数必须经常重新创建，记忆效果不是很好。如果你想要记住的函数是一个事件处理器并且在渲染期间没有被用到.

```ts
function useEventCallback(fn, dependencies) {
  const ref = useRef(() => {
    throw new Error('Cannot call an event handler while rendering.');
  });

  // 根据依赖去更新 ref ，保证最终调用的函数是最新的
  useEffect(() => {
    ref.current = fn;
  }, [fn, ...dependencies]);

  return useCallback(() => {
    const fn = ref.current;
    return fn();
  }, [ref]);
}
```

## useDebounceFn

调用函数防抖

```ts
function useDebounceFn<T extends any[], U = any>(fn: (...args: T) => Promise<any>, wait?: number) {
  const callback = useRefFunction(fn);

  const timer = useRef<any>();

  const cancel = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const run = useCallback(
    async (...args: any): Promise<U | undefined> => {
      if (wait === 0 || wait === undefined) {
        return callback(...args);
      }
      cancel();
      return new Promise<U>((resolve) => {
        timer.current = setTimeout(async () => {
          resolve(await callback(...args));
        }, wait);
      });
    },
    [callback, cancel, wait],
  );

  useEffect(() => {
    return cancel;
  }, [cancel]);

  return {
    run,
    cancel,
  };
}
```

## useLatest

用于在异步回调中获取最新的 props 或 state 值。

源码：

```ts
const useLatest = <T>(value: T): { readonly current: T } => {
  const ref = useRef(value);
  ref.current = value;
  return ref;
};
```

用法：

```jsx
import { useLatest } from 'react-use';

const Demo = () => {
  const [count, setCount] = React.useState(0);
  const latestCount = useLatest(count);

  function handleAlertClick() {
    setTimeout(() => {
      alert(`Latest count value: ${latestCount.current}`);
    }, 3000);
  }

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
      <button onClick={handleAlertClick}>Show alert</button>
    </div>
  );
};
```

```ts
const propsRef = useLatest(props);

  const onValueChange = useCallback(() => {
    // ...
  }, [propsRef])
```

## useRefFunction

- 缓存函数
- 方法需要作为其他 hook 依赖时使用 useRefFunction

不是完全理解，记录下，该 hook 在 antd procomponent 中使用较多。

源码：

```ts
const useRefFunction = <T extends (...args: any) => any>(reFunction: T) => {
  const ref = useRef<any>(null);
  // 方法的引用
  ref.current = reFunction;
  // 让返回函数不发生变化
  return useCallback((...rest: Parameters<T>): ReturnType<T> => {
    return ref.current?.(...(rest as any));
  }, []);
};
```

用法：

```ts
const prePage = useRefFunction(() => {
    if (step < 1) return;
    setStep(step - 1);
  });
```

```ts
const fieldSetOnChange = useRefFunction((fileValue: any, index: number) => {
    const newValues = [...value];
    newValues[index] = defaultGetValueFromEvent(valuePropName || 'value', fileValue);

    onChange?.(newValues);
    fieldProps?.onChange?.(newValues);
  });
```

stack overflow 提问后，回答如下：

It returns a memoized function which acts as a proxy for the function you provide as the argument.
You would only need this when you need to update/recreate the function, but also retain a stable
object identity for use elsewhere (e.g. a useEffect dependency array).

## useThrottleFn

```ts
export const useThrottleFn = <T extends (...args: any[]) => any>(fn: T, wait = 200) => {
  const fnRef = useRefFunction(fn);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const cancel = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const run = useCallback(
    (...args: Parameters<T>) => {
      if (timer.current) return;
      timer.current = setTimeout(() => {
        timer.current = null;
      }, wait);
      return fnRef(...args);
    },
    [wait, cancel, fnRef],
  );

  useEffect(() => cancel, [cancel]);

  return { run, cancel };
};
```

节流适合 scroll/resize 等高频事件，和防抖（`useDebounceFn`）互补。

## useWhyDidYouUpdate

```ts
export function useWhyDidYouUpdate<T extends Record<string, any>>(name: string, props: T) {
  const prevProps = useRef<T>();

  useEffect(() => {
    if (prevProps.current) {
      const changedProps: Record<string, { from: any; to: any }> = {};
      Object.keys({ ...prevProps.current, ...props }).forEach((key) => {
        if (prevProps.current?.[key] !== props[key]) {
          changedProps[key] = { from: prevProps.current?.[key], to: props[key] };
        }
      });
      if (Object.keys(changedProps).length) {
        console.log('[why-did-you-update]', name, changedProps);
      }
    }
    prevProps.current = props;
  });
}
```

调试 `memo` 组件时非常实用，可以快速定位是哪个 prop 触发了重新渲染。
