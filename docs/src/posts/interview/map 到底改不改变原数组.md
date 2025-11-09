---
updateTime: "2023-11-27 09:48"
date: "2023-11-27"
title: "map 到底改不改变原数组"
desc: "通过示例解释 Array.prototype.map 是否会修改原数组。"
tags: "interview/javascript"
outline: deep
---

`Array.prototype.map` **永远不会**直接修改原数组，它只会返回一个新数组。之所以会看到“原数组被改了”，往往是因为回调里去修改了引用类型的成员，从而导致原数组里的对象本身被改变。

## 数组内为基础类型数据时,原数组不变

```js
let array = [1, 2, 3, 4, 5];
let newArray = array.map((item) => item * 2);
console.log(array); // [1,2,3,4,5]
console.log(newArray); //[2, 4, 6, 8, 10]
```

## 数据内是引用类型数据时，注意写法

1. item 上直接修改，改变原数组

   ```js
   let array = [
     { name: "Anna", age: 16 },
     { name: "James", age: 18 }
   ];
   let newArray = array.map((item) => {
     item.like = "eat";
     return item;
   });
   console.log(array); // [{ name: 'Anna', age: 16,like: "eat"},{ name: 'James', age: 18,like: "eat"}]
   console.log(newArray); //[{ name: 'Anna', age: 16,like: "eat"},{ name: 'James', age: 18,like: "eat"}]
   ```

## 结论

- `map` 的职责是**对每一项调用回调，并返回回调的返回值组成的新数组**，它不会为你做深拷贝，也不会保护你避免修改引用。
- 如果希望保持纯函数特性，应当在回调里返回一个全新的对象/数组（使用解构、`structuredClone`、`immer` 等），或者先使用 `map` 生成 ID，再通过 `reduce` 组装结果。
- 对于需要在原数组上就地修改的场景，应该使用 `forEach` 或 `for...of` 循环，明确表达“有副作用”，避免让 `map` 的语义被混淆。

2. 开辟新的引用地址, 不改变原数组

   ```js
   let array = [
     { name: "Anna", age: 16 },
     { name: "James", age: 18 }
   ];
   let newArray = array.map((item) => {
     const obj = { ...item, like: "eat" };
     return obj;
   });
   console.log(array); // [{ name: 'Anna', age: 16},{ name: 'James', age: 18}]
   console.log(newArray); //[{ name: 'Anna', age: 16,like: "eat"},{ name: 'James', age: 18,like: "eat"}]
   ```
