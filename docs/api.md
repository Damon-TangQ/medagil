# Medagil AI平台API接口文档

## 基础信息

- 基础URL: `https://api.medagil.com`
- 数据格式: JSON
- 字符编码: UTF-8

## 认证方式

使用JWT Token进行身份验证，在请求头中添加：

```
Authorization: Bearer {token}
```

## 通用响应格式

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

## 错误响应格式

```json
{
  "code": 400,
  "message": "错误信息",
  "data": null
}
```

## API接口列表

### 用户模块

#### 用户登录

- 接口地址: `/api/auth/login`
- 请求方式: POST
- 请求参数:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- 响应数据:
  ```json
  {
    "code": 200,
    "message": "登录成功",
    "data": {
      "token": "string",
      "userInfo": {
        "id": "string",
        "username": "string",
        "nickname": "string",
        "avatar": "string"
      }
    }
  }
  ```

#### 用户注册

- 接口地址: `/api/auth/register`
- 请求方式: POST
- 请求参数:
  ```json
  {
    "username": "string",
    "password": "string",
    "nickname": "string"
  }
  ```
- 响应数据:
  ```json
  {
    "code": 200,
    "message": "注册成功",
    "data": {
      "id": "string",
      "username": "string",
      "nickname": "string"
    }
  }
  ```

#### 获取用户信息

- 接口地址: `/api/user/info`
- 请求方式: GET
- 请求参数: 无
- 响应数据:
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "id": "string",
      "username": "string",
      "nickname": "string",
      "avatar": "string",
      "email": "string",
      "phone": "string"
    }
  }
  ```

### AI模块

#### AI问答

- 接口地址: `/api/ai/chat`
- 请求方式: POST
- 请求参数:
  ```json
  {
    "question": "string"
  }
  ```
- 响应数据:
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "answer": "string"
    }
  }
  ```

#### 数据分析

- 接口地址: `/api/ai/analyze`
- 请求方式: POST
- 请求参数:
  ```json
  {
    "data": "array",
    "type": "string"
  }
  ```
- 响应数据:
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "result": "object"
    }
  }
  ```

### 内容模块

#### 获取内容列表

- 接口地址: `/api/content/list`
- 请求方式: GET
- 请求参数:
  - page: 页码
  - pageSize: 每页数量
- 响应数据:
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "list": "array",
      "total": "number",
      "page": "number",
      "pageSize": "number"
    }
  }
  ```

#### 获取内容详情

- 接口地址: `/api/content/detail/:id`
- 请求方式: GET
- 请求参数: 无
- 响应数据:
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "id": "string",
      "title": "string",
      "content": "string",
      "author": "string",
      "createTime": "string",
      "updateTime": "string"
    }
  }
  ```
