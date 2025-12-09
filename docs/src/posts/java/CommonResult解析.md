---
updateTime: "2025-12-01 14:19"
date: "2025-12-01"
desc: "CommonResult 解析"
tags: "java, yudao-boot-min"
outline: deep
---

```java
package cn.iocoder.yudao.framework.common.pojo;

import cn.hutool.core.lang.Assert;
import cn.iocoder.yudao.framework.common.exception.ErrorCode;
import cn.iocoder.yudao.framework.common.exception.ServiceException;
import cn.iocoder.yudao.framework.common.exception.enums.GlobalErrorCodeConstants;
import cn.iocoder.yudao.framework.common.exception.util.ServiceExceptionUtil;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import java.io.Serializable;
import java.util.Objects;

/**
 * 通用返回
 *
 * @param <T> 数据泛型
 */
@Data
public class CommonResult<T> implements Serializable {

    /**
     * 错误码
     *
     * @see ErrorCode#getCode()
     */
    private Integer code;
    /**
     * 错误提示，用户可阅读
     *
     * @see ErrorCode#getMsg() ()
     */
    private String msg;
    /**
     * 返回数据
     */
    private T data;

    /**
     * 将传入的 result 对象，转换成另外一个泛型结果的对象
     *
     * 因为 A 方法返回的 CommonResult 对象，不满足调用其的 B 方法的返回，所以需要进行转换。
     *
     * @param result 传入的 result 对象
     * @param <T> 返回的泛型
     * @return 新的 CommonResult 对象
     */
    public static <T> CommonResult<T> error(CommonResult<?> result) {
        return error(result.getCode(), result.getMsg());
    }

    public static <T> CommonResult<T> error(Integer code, String message) {
        Assert.notEquals(GlobalErrorCodeConstants.SUCCESS.getCode(), code, "code 必须是错误的！");
        CommonResult<T> result = new CommonResult<>();
        result.code = code;
        result.msg = message;
        return result;
    }

    public static <T> CommonResult<T> error(ErrorCode errorCode, Object... params) {
        Assert.notEquals(GlobalErrorCodeConstants.SUCCESS.getCode(), errorCode.getCode(), "code 必须是错误的！");
        CommonResult<T> result = new CommonResult<>();
        result.code = errorCode.getCode();
        result.msg = ServiceExceptionUtil.doFormat(errorCode.getCode(), errorCode.getMsg(), params);
        return result;
    }

    public static <T> CommonResult<T> error(ErrorCode errorCode) {
        return error(errorCode.getCode(), errorCode.getMsg());
    }

    public static <T> CommonResult<T> success(T data) {
        CommonResult<T> result = new CommonResult<>();
        result.code = GlobalErrorCodeConstants.SUCCESS.getCode();
        result.data = data;
        result.msg = "";
        return result;
    }

    public static boolean isSuccess(Integer code) {
        return Objects.equals(code, GlobalErrorCodeConstants.SUCCESS.getCode());
    }

    @JsonIgnore // 避免 jackson 序列化
    public boolean isSuccess() {
        return isSuccess(code);
    }

    @JsonIgnore // 避免 jackson 序列化
    public boolean isError() {
        return !isSuccess();
    }

    // ========= 和 Exception 异常体系集成 =========

    /**
     * 判断是否有异常。如果有，则抛出 {@link ServiceException} 异常
     */
    public void checkError() throws ServiceException {
        if (isSuccess()) {
            return;
        }
        // 业务异常
        throw new ServiceException(code, msg);
    }

    /**
     * 判断是否有异常。如果有，则抛出 {@link ServiceException} 异常
     * 如果没有，则返回 {@link #data} 数据
     */
    @JsonIgnore // 避免 jackson 序列化
    public T getCheckedData() {
        checkError();
        return data;
    }

    public static <T> CommonResult<T> error(ServiceException serviceException) {
        return error(serviceException.getCode(), serviceException.getMessage());
    }

}

```

# CommonResult 类详细分析

## 1. 概述

CommonResult 是芋道系统中用于统一 API 接口返回格式的核心类。它通过封装统一的响应结构，使得前后端交互更加规范化和一致化。此类采用泛型设计，可以承载任意类型的业务数据，并提供丰富的工厂方法来创建成功或失败的响应结果。

## 2. 类定义与结构

```java
@Data
public class CommonResult<T> implements Serializable
```

- 使用 Lombok 的 `@Data` 注解自动生成 getter、setter、toString 等方法
- 实现 `Serializable` 接口，支持序列化操作
- 泛型设计 `<T>` 允许携带任意类型的业务数据

## 3. 核心字段

### 3.1 code - 错误码

```java
private Integer code;
```

- 类型：Integer
- 用途：标识请求处理的结果状态
- 成功状态码通常定义为 0（GlobalErrorCodeConstants.SUCCESS.getCode()）
- 不同的错误码代表不同的业务异常或系统错误

### 3.2 msg - 错误提示

```java
private String msg;
```

- 类型：String
- 用途：提供用户可读的错误信息或提示
- 成功状态下通常为空字符串

### 3.3 data - 返回数据

```java
private T data;
```

- 类型：T（泛型）
- 用途：携带具体的业务数据
- 可以为任意类型，如 User 对象、List 集合等

## 4. 静态工厂方法

### 4.1 success 方法

```java
public static <T> CommonResult<T> success(T data)
```

创建成功的返回结果：

- 设置 code 为成功状态码（通常为 0）
- 设置 data 为传入的业务数据
- 设置 msg 为空字符串

**使用示例：**

```java
// 返回用户信息
return CommonResult.success(user);

// 返回列表数据
return CommonResult.success(userList);

// 返回无数据的成功结果
return CommonResult.success(null);
```

### 4.2 error 方法族

#### 4.2.1 error(Integer code, String message)

```java
public static <T> CommonResult<T> error(Integer code, String message)
```

直接指定错误码和错误消息创建错误结果：

- 检查传入的 code 不能是成功状态码
- 设置 code 和 msg 字段

#### 4.2.2 error(ErrorCode errorCode)

```java
public static <T> CommonResult<T> error(ErrorCode errorCode)
```

通过错误码枚举创建错误结果：

- 从 ErrorCode 中提取 code 和 msg

#### 4.2.3 error(ErrorCode errorCode, Object... params)

```java
public static <T> CommonResult<T> error(ErrorCode errorCode, Object... params)
```

支持参数化错误消息：

- 使用 ServiceExceptionUtil.doFormat 格式化错误消息
- 适用于需要动态填充错误信息的场景

#### 4.2.4 error(CommonResult<?> result)

```java
public static <T> CommonResult<T> error(CommonResult<?> result)
```

从另一个结果对象转换创建新的错误结果：

- 复用传入结果的 code 和 msg

#### 4.2.5 error(ServiceException serviceException)

```java
public static <T> CommonResult<T> error(ServiceException serviceException)
```

从业务异常创建错误结果：

- 提取 ServiceException 中的 code 和 message

## 5. 状态判断方法

### 5.1 静态方法 isSuccess

```java
public static boolean isSuccess(Integer code)
```

判断给定的状态码是否表示成功：

- 与 GlobalErrorCodeConstants.SUCCESS.getCode() 进行比较

### 5.2 实例方法 isSuccess

```java
@JsonIgnore
public boolean isSuccess()
```

判断当前实例是否表示成功：

- 基于实例的 code 字段进行判断
- 使用 @JsonIgnore 避免序列化到 JSON

### 5.3 实例方法 isError

```java
@JsonIgnore
public boolean isError()
```

判断当前实例是否表示错误：

- 对 isSuccess() 结果取反

## 6. 异常集成方法

### 6.1 checkError 方法

```java
public void checkError() throws ServiceException
```

检查当前结果是否为错误状态：

- 如果是成功状态，直接返回
- 如果是错误状态，抛出 ServiceException 异常

### 6.2 getCheckedData 方法

```java
@JsonIgnore
public T getCheckedData()
```

获取经过错误检查的数据：

- 先调用 checkError() 进行错误检查
- 如果无错误，返回 data 字段
- 如果有错误，抛出 ServiceException 异常

## 7. 设计亮点

### 7.1 统一返回格式

所有 API 接口都遵循相同的返回结构，便于前端统一处理。

### 7.2 类型安全

通过泛型确保数据类型正确，避免类型转换错误。

### 7.3 丰富的工厂方法

提供多种创建方式适应不同场景，提高使用便利性。

### 7.4 与异常体系集成

方便在业务代码中进行错误处理和异常传递。

### 7.5 合理的序列化控制

使用 @JsonIgnore 注解避免计算属性被序列化到 JSON 中。

### 7.6 良好的文档注释

每个方法都有清晰的说明，便于理解和使用。

## 8. 使用示例

### 8.1 Controller 中的使用

```java
@GetMapping("/user/{id}")
public CommonResult<User> getUser(@PathVariable Long id) {
    User user = userService.getUserById(id);
    if (user != null) {
        return CommonResult.success(user);
    } else {
        return CommonResult.error(ErrorCode.USER_NOT_FOUND);
    }
}
```

### 8.2 Service 中的使用

```java
public CommonResult<List<User>> getAllUsers() {
    try {
        List<User> users = userRepository.findAll();
        return CommonResult.success(users);
    } catch (Exception e) {
        return CommonResult.error(ErrorCode.SYSTEM_ERROR);
    }
}
```

### 8.3 使用 getCheckedData 进行链式调用

```java
// 调用其他服务并直接获取数据
User user = userService.getUserById(userId).getCheckedData();
```

## 9. 注意事项

1. 所有 error 方法都使用 Assert.notEquals 检查传入的错误码不能是成功码，确保错误结果的一致性
2. getCheckedData() 方法结合了数据获取和错误检查，适合在确定结果应该是成功的情况下使用
3. 在需要序列化的场景中，isSuccess() 和 isError() 方法不会被包含在 JSON 输出中
4. 建议在项目中统一使用 CommonResult 作为 API 返回类型，保持接口风格一致性
