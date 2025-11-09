---
updateTime: "2023-11-27 09:48"
date: "2023-11-27"
desc: "通过示例解释 Array.prototype.map 是否会修改原数组。"
tags: "interview/javascript"
outline: deep
---

一般认为 map 不会对原数组进行修改，但事实并不是如此。

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
