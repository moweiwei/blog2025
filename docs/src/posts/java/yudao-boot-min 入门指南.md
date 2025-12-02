---
updateTime: "2025-12-01 14:19"
date: "2025-12-01"
desc: "yudao-boot-min 入门指南"
tags: "java, yudao-boot-min"
outline: deep
---

# yudao-boot-min 入门指南

## 🧭 阶段 1：Java 基础（1–3 周）

**目标**：掌握语法、OOP，能看懂大部分 Java 业务代码。

### 1.1 Java 基础语法

**学习项**：

- Java 是什么（JVM、JRE、JDK）
- 关键字：public、static、void、return
- 数据类型：int、double、boolean、char、String
- 运算符：+ - \* / % && ||
- 流程控制：
  - if / else
  - switch
  - for / enhanced-for
  - while / do-while

**✔ 练习**：
写一个简单计算器（加减乘除），使用 if/switch。

### 1.2 面向对象（OOP）

**概念**：

- 类与对象（class / new）
- 构造方法（Constructor）
- 成员变量 / 成员方法（Field / Method）

**三大特性**：

- 封装（private + getter/setter）
- 继承（extends）
- 多态（父类引用指向子类对象）
- 抽象类（abstract）
- 接口（interface）

**✔ 练习**：

- 写一个 Animal / Dog / Cat 的继承体系
- 定义一个接口 Shape，写 Circle、Rectangle 实现它

### 1.3 Java 常用类 & 工具

**必会**：

- String、StringBuilder
- List、ArrayList
- Map、HashMap
- Arrays 工具类
- Collections 工具类

**✔ 练习**：
写一个学生管理系统（添加、删除、查询），数据存在 ArrayList 中。

### 1.4 Java 基础 IO 与异常（简单了解）

- try/catch/finally
- throws 与 throw
- RuntimeException
- File、InputStream、OutputStream（简单知道）

**✔ 练习**：
读写一个简单文本文件（可选）。

## 🧭 阶段 2：Java 进阶（1–2 周）

**目标**：能理解企业代码中的典型写法，准备进入 Spring。

### 2.1 集合框架（重点）

**掌握每个集合的特点**：

- List：ArrayList / LinkedList
- Set：HashSet / TreeSet
- Map：HashMap / LinkedHashMap

**理解**：

- 为什么 HashMap 查找很快？
- ArrayList 扩容机制简介

**✔ 练习**：
模拟实现 HashMap（简化版，数组 + 链表）。

### 2.2 泛型

- 什么是泛型 <T>
- 泛型类、泛型方法
- <?>、<? extends X>、<? super X>

**✔ 练习**：
写一个 GenericBox<T> 用来存储任意对象。

### 2.3 异常机制进阶

- 多 catch
- 自定义异常（class BizException extends RuntimeException）
- 全局异常思想（后面做 Spring 时需要）

**✔ 练习**：
自定义一个 AgeException，当年龄 < 0 时抛出。

### 2.4 Maven（必须掌握）

- 什么是 pom.xml
- dependency、plugin
- package、clean、install
- maven 仓库（中央仓库、本地仓库）

**✔ 练习**：
自己新建一个 Maven 项目，添加 fastjson 依赖并使用。

### 2.5 Lombok（yudao 里大量用）

**常用注解**：

- @Data
- @Builder
- @AllArgsConstructor
- @NoArgsConstructor
- @Slf4j

**✔ 练习**：
写一个 User 实体类，使用 Lombok 减少代码。

## 🧭 阶段 3：Web 后端基础（1–2 周）

**目标**：理解 HTTP → JSON → RESTful → 三层架构，为 Spring Boot 奠基。

### 3.1 HTTP 基础

**必须理解**：

- URL、Header、Body
- GET vs POST
- Content-Type: application/json
- Cookies & Session（后面做登录要用）

**✔ 练习**：
用 Postman 发 GET/POST 请求，查看请求结构。

### 3.2 JSON

- 什么是 JSON
- JSON ↔ Java 对象的转换（Gson/Jackon）

**✔ 练习**：
写一个 java 对象 → JSON → java 对象 的序列化代码。

### 3.3 RESTful API

- 资源（Resource）
- 路径规范：/api/user/{id}
- 状态码：200、400、401、500
- 接口返回规范（统一返回对象 CommonResult）

**✔ 练习**：
设计用户模块的几个 REST 接口：

- GET /user/{id}
- POST /user
- PUT /user/{id}

### 3.4 三层架构（yudao 的核心结构）

**三个层级的职责**：

- Controller：处理请求、参数
- Service：业务逻辑
- Mapper/DAO：数据库操作（MyBatis）

**✔ 练习**：
把刚才的用户 CRUD 逻辑用三层架构拆开（还不使用 Spring）。

## 🧭 阶段 4：Spring Boot 入门（2–3 周）

**目标**：掌握 Spring 常用注解、IOC、配置、MVC，看懂大部分 yudao 的代码。

### 4.1 Spring 基础：IOC/DI

**理解**：

- Bean 是什么？
- 如何管理对象？
- @Component / @Service / @Controller / @RestController
- @Autowired / @Resource 注入

**✔ 练习**：
写一个简单用户服务 UserService → Controller 调用它。

### 4.2 Spring MVC

**必须掌握注解**：

- @GetMapping
- @PostMapping
- @RequestParam
- @PathVariable
- @RequestBody

**✔ 练习**：
实现 UserController：注册、登录、查询。

### 4.3 配置文件

- application.yml
- 环境切换：application-dev.yml、application-prod.yml
- server.port
- 数据库连接配置

### 4.4 Spring Boot 自动装配（简单理解）

- @SpringBootApplication 本质
- Spring Boot Starter 机制
- （yudao 很多 starter，用来做自动配置）

### 4.5 Swagger / Knife4j

- 接口文档自动生成
- 注解：@Api、@ApiModel 等

**✔ 练习**：
为你的 UserController 生成文档。

## 🧭 阶段 5：Spring + MyBatis（2–3 周）

**目标**：能实现数据库 CRUD，能看懂 yudao 数据层。

### 5.1 MySQL 基础

**必掌握**：

- create database / create table
- insert、update、delete、select
- where、order by、limit
- 索引（了解）

**✔ 练习**：
创建 user 表。

### 5.2 MyBatis 基础

- @Mapper
- Mapper 接口
- XML 定义 SQL
- #{} vs ${}

**✔ 练习**：
写一个 UserMapper.xml + 接口，查询 user。

### 5.3 MyBatis Plus（MP）

- BaseMapper
- QueryWrapper
- LambdaQueryWrapper
- 自动 CRUD（insert，selectById）

**✔ 练习**：
用 MP 完成一个查询分页接口。

## 🧭 阶段 6：理解并改造 yudao-boot-mini（3–4 周）

**目标**：掌握 yudao-mini 整个后端体系，从源码开始拆。

### 6.1 项目结构（必须搞懂）

```
controller/
service/
mapper/
entity/
config/
common/
```

你要搞清楚每个目录的作用。

### 6.2 用户登录模块（强烈推荐第一个学习）

**重点**：

- UserController 登录逻辑
- Token 生成
- Session/Redis 保存用户信息（若使用）
- 拦截器校验登录（HandlerInterceptor）
- 统一异常（GlobalExceptionHandler）
- 统一返回（CommonResult）

**✔ 练习**：

- 新增一个 修改密码 接口
- 新增一个 退出登录 接口

### 6.3 对象转换

- DTO → Entity → VO
- MapStruct 的使用方式

**✔ 练习**：
给用户新增一个 "角色 role" 字段，并在 DTO/VO 中同步修改。

### 6.4 新增业务模块（自己练习）

**例如**：

- 菜单管理
- 部门管理
- 文章管理
- 文件上传模块
- 简单权限控制

**✔ 练习**：
新增一个 Menu 模块，可以 CRUD。

### 6.5 项目高级功能（可选）

- AOP（用于日志、审计）
- 全局异常扩展
- 拦截器扩展
- Validator 参数校验（@Valid）

## 🧭 阶段 7：部署与线上化思维（1–2 周）

yudao 官方推荐 Docker 部署，要会。

### 7.1 Maven 打包

- mvn clean package
- target/\*.jar 运行

### 7.2 Docker

- Dockerfile
- docker build / run
- docker-compose（启动 MySQL + yudao 后端）

### 7.3 Nginx（反向代理）

- upstream
- location /api/
- 前后端分离部署

### 7.4 小型上线（本地版）

**✔ 练习**：
用 docker-compose 启动「MySQL + yudao-mini 后端」。

## 配套视频 & 书籍（最推荐）

### 视频（免费且体系最佳）

- 尚硅谷 Java 基础 + 进阶
- 黑马程序员 JavaWeb
- 尚硅谷 Spring Boot 2 教程
- 狂神说 MyBatis + MyBatis Plus
- 韩顺平 MySQL
