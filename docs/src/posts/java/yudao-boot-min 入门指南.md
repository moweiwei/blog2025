---
updateTime: "2025-12-01 14:19"
date: "2025-12-01"
desc: "yudao-boot-min 入门指南"
tags: "java, yudao-boot-min"
outline: deep
---

# yudao-boot-min 入门指南

> TODO: 简要描述这篇文章
> 学习路径建议

1. 先从框架层开始 (yudao-framework)
   首先理解项目的整体架构和技术栈：
   yudao-common - 包含通用工具类、异常处理、枚举等基础组件
   yudao-spring-boot-starter-web - Web 层配置，包括 Spring MVC、Swagger 等
   yudao-spring-boot-starter-security - 安全框架配置，了解认证授权机制
   yudao-spring-boot-starter-mybatis - 数据库访问层配置
   这些 starter 组件构成了整个项目的基础，先理解它们有助于后续模块的学习。

2. 学习核心业务模块 (yudao-module-system)
   系统模块是业务逻辑的核心部分，包含：
   用户管理、角色管理、菜单管理等 RBAC 权限系统
   部门管理、岗位管理等组织架构功能
   字典管理、通知公告等基础功能
   租户管理（支持 SaaS 场景）

3. 了解启动模块 (yudao-server)

4. 深入其他专业模块
   根据你的兴趣或工作需要，进一步学习：
   yudao-module-infra - 基础设施模块，包含定时任务、代码生成、文件管理等功能
   工作流、支付、商城等相关模块（如果项目中存在）

## yudao-common
