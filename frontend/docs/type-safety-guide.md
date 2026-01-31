# TypeScript类型安全增强指南

## 概述

本文档提供了增强TypeScript类型安全的完整指南，包括避免使用any类型、为回调参数添加类型注解、使用接口定义数据结构、使用类型守卫确保类型安全等内容。

## 目录

- [避免使用any类型](#避免使用any类型)
- [为回调参数添加类型注解](#为回调参数添加类型注解)
- [使用接口定义数据结构](#使用接口定义数据结构)
- [使用类型守卫确保类型安全](#使用类型守卫确保类型安全)
- [类型断言](#类型断言)
- [泛型类型](#泛型类型)
- [最佳实践](#最佳实践)

## 避免使用any类型

### 问题示例

```typescript
// ❌ 不推荐：使用any类型
interface Props {
  data?: any
}

const processData = (data: any) => {
  // 无法进行类型检查
  console.log(data.name)  // 可能运行时错误
}
```

### 正确做法

```typescript
// ✅ 推荐：定义明确的接口
interface UserData {
  id: string
  name: string
  email: string
}

interface Props {
  data?: UserData
}

const processData = (data: UserData) => {
  // 类型安全，有类型提示
  console.log(data.name)  // TypeScript会检查
}
```

### 使用unknown替代any

```typescript
// ✅ 推荐：使用unknown
const processData = (data: unknown) => {
  if (typeof data === 'object' && data !== null) {
    // 使用类型守卫确保类型安全
    console.log((data as UserData).name)
  }
}
```

## 为回调参数添加类型注解

### 问题示例

```typescript
// ❌ 不推荐：回调参数没有类型
watch(() => props.data, (newData) => {
  // newData隐式为any类型
  console.log(newData.name)  // 可能运行时错误
})

const handleClick = (event) => {
  // event隐式为any类型
  console.log(event.target)  // 可能运行时错误
}
```

### 正确做法

```typescript
// ✅ 推荐：为回调参数添加类型
interface Data {
  id: string
  name: string
}

watch(() => props.data, (newData: Data | undefined) => {
  // newData有明确类型
  console.log(newData?.name)  // 类型安全
})

const handleClick = (event: MouseEvent) => {
  // event有明确类型
  console.log(event.target)  // 类型安全
}
```

### Vue事件处理

```typescript
// ✅ 推荐：定义事件类型
interface Emits {
  (e: 'update', value: string): void
  (e: 'delete', id: string): void
}

const emit = defineEmits<Emits>()

const handleUpdate = (value: string) => {
  emit('update', value)  // 类型安全
}
```

## 使用接口定义数据结构

### 基础接口定义

```typescript
// ✅ 推荐：定义明确的接口
interface User {
  id: string
  username: string
  nickname?: string
  email?: string
  phone?: string
  avatar?: string
  subscriptionLevel: number
  subscriptionExpireTime?: string
  status: number
  createdAt: string
  updatedAt: string
}
```

### 嵌套接口

```typescript
// ✅ 推荐：使用嵌套接口
interface Address {
  street: string
  city: string
  country: string
}

interface UserProfile {
  id: string
  name: string
  address: Address  // 嵌套接口
}
```

### 继承接口

```typescript
// ✅ 推荐：使用接口继承
interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

interface User extends BaseEntity {
  username: string
  email: string
}

interface Project extends BaseEntity {
  name: string
  description: string
}
```

### 可选属性

```typescript
// ✅ 推荐：明确标记可选属性
interface FormData {
  id?: string
  name: string
  description?: string
  tags?: string[]
}

const data: FormData = {
  name: '项目1'
  // description和tags是可选的
}
```

### 只读属性

```typescript
// ✅ 推荐：使用readonly
interface Config {
  readonly id: string
  readonly version: string
  apiUrl: string
}

const config: Config = {
  id: '1',
  version: '1.0.0',
  apiUrl: 'https://api.example.com'
}

// config.id = '2'  // TypeScript错误：不能修改只读属性
```

## 使用类型守卫确保类型安全

### typeof类型守卫

```typescript
// ✅ 推荐：使用typeof
function processValue(value: string | number) {
  if (typeof value === 'string') {
    // value是string类型
    console.log(value.toUpperCase())
  } else {
    // value是number类型
    console.log(value.toFixed(2))
  }
}
```

### instanceof类型守卫

```typescript
// ✅ 推荐：使用instanceof
function processDate(value: Date | string) {
  if (value instanceof Date) {
    // value是Date类型
    console.log(value.toISOString())
  } else {
    // value是string类型
    console.log(new Date(value))
  }
}
```

### 自定义类型守卫

```typescript
// ✅ 推荐：自定义类型守卫
interface User {
  id: string
  name: string
  email?: string
}

function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value
  )
}

function processData(data: unknown) {
  if (isUser(data)) {
    // data是User类型
    console.log(data.name)
  }
}
```

### in操作符类型守卫

```typescript
// ✅ 推荐：使用in操作符
function processObject(value: unknown) {
  if (typeof value === 'object' && value !== null) {
    if ('name' in value) {
      // value有name属性
      console.log(value.name)
    }
  }
}
```

## 类型断言

### as类型断言

```typescript
// ✅ 推荐：使用as断言
const element = document.getElementById('app') as HTMLDivElement
element.style.display = 'none'
```

### 非空断言

```typescript
// ✅ 推荐：使用非空断言
const name: string | undefined = user?.name
const displayName = name!  // 断言name不为undefined
```

### 类型谓词断言

```typescript
// ✅ 推荐：使用类型谓词
function isString(value: unknown): value is string {
  return typeof value === 'string'
}

if (isString(value)) {
  // value是string类型
  console.log(value.toUpperCase())
}
```

## 泛型类型

### 基础泛型

```typescript
// ✅ 推荐：使用泛型
function identity<T>(value: T): T {
  return value
}

const num = identity<number>(42)  // num是number类型
const str = identity<string>('hello')  // str是string类型
```

### 泛型约束

```typescript
// ✅ 推荐：使用泛型约束
interface Lengthwise {
  length: number
}

function getLength<T extends Lengthwise>(arg: T): number {
  return arg.length
}

const len = getLength('hello')  // len是number类型
```

### 泛型接口

```typescript
// ✅ 推荐：使用泛型接口
interface Response<T> {
  success: boolean
  message: string
  data?: T
}

interface User {
  id: string
  name: string
}

const response: Response<User> = {
  success: true,
  message: '成功',
  data: {
    id: '1',
    name: 'John'
  }
}
```

## 最佳实践

### 1. 严格模式

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

### 2. 类型优先

```typescript
// ✅ 推荐：先定义类型，再使用
interface User {
  id: string
  name: string
}

const user: User = {
  id: '1',
  name: 'John'
}

// ❌ 不推荐：先使用，再推断类型
const user = {
  id: '1',
  name: 'John'
}
```

### 3. 避免类型断言

```typescript
// ❌ 不推荐：过度使用类型断言
const data = response.data as User

// ✅ 推荐：使用类型守卫
if (isUser(response.data)) {
  const data = response.data
}
```

### 4. 使用联合类型

```typescript
// ✅ 推荐：使用联合类型
type Status = 'pending' | 'success' | 'error'

const status: Status = 'success'

// ❌ 不推荐：使用字符串字面量
const status: string = 'success'
```

### 5. 使用字面量类型

```typescript
// ✅ 推荐：使用字面量类型
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

const method: HttpMethod = 'GET'

// ❌ 不推荐：使用枚举
enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE'
}
```

### 6. 使用映射类型

```typescript
// ✅ 推荐：使用映射类型
type Partial<T> = {
  [P in keyof T]?: T[P]
}

type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}

interface User {
  id: string
  name: string
}

const partialUser: Partial<User> = {
  name: 'John'
}
```

### 7. 使用条件类型

```typescript
// ✅ 推荐：使用条件类型
type NonNullable<T> = T extends null | undefined ? never : T

type Result<T> = T extends string
  ? 'string'
  : T extends number
  ? 'number'
  : 'unknown'

const result: Result<string> = 'string'
```

## 工具类型

### Partial

```typescript
// ✅ 推荐：使用Partial
interface User {
  id: string
  name: string
  email: string
}

const partialUser: Partial<User> = {
  name: 'John'
}
```

### Required

```typescript
// ✅ 推荐：使用Required
interface User {
  id: string
  name?: string
  email?: string
}

const requiredUser: Required<User> = {
  id: '1',
  name: 'John',
  email: 'john@example.com'
}
```

### Readonly

```typescript
// ✅ 推荐：使用Readonly
interface Config {
  apiUrl: string
  timeout: number
}

const config: Readonly<Config> = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
}

// config.apiUrl = 'new-url'  // TypeScript错误
```

### Pick

```typescript
// ✅ 推荐：使用Pick
interface User {
  id: string
  name: string
  email: string
  phone: string
}

type UserBasicInfo = Pick<User, 'id' | 'name'>

const basicInfo: UserBasicInfo = {
  id: '1',
  name: 'John'
}
```

### Omit

```typescript
// ✅ 推荐：使用Omit
interface User {
  id: string
  name: string
  password: string
}

type PublicUser = Omit<User, 'password'>

const publicUser: PublicUser = {
  id: '1',
  name: 'John'
}
```

## Vue 3 类型安全

### Props类型

```typescript
// ✅ 推荐：定义Props接口
interface Props {
  title: string
  count?: number
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
  disabled: false
})
```

### Emits类型

```typescript
// ✅ 推荐：定义Emits接口
interface Emits {
  (e: 'update', value: number): void
  (e: 'delete', id: string): void
}

const emit = defineEmits<Emits>()
```

### Ref类型

```typescript
// ✅ 推荐：为Ref添加类型
const count = ref<number>(0)
const user = ref<User | null>(null)
const list = ref<User[]>([])
```

### Computed类型

```typescript
// ✅ 推荐：为Computed添加类型
const doubled = computed<number>(() => count.value * 2)
const fullName = computed<string>(() => `${firstName.value} ${lastName.value}`)
```

### Watch类型

```typescript
// ✅ 推荐：为watch添加类型
watch(
  () => props.data,
  (newData: Data | undefined, oldData: Data | undefined) => {
    console.log(newData, oldData)
  }
)
```

## 常见问题

### Q1: 什么时候使用any？
**A:** 尽量避免使用any。如果必须使用，优先考虑unknown，然后使用类型守卫确保类型安全。

### Q2: 如何处理API响应类型？
**A:** 定义明确的Response接口，使用泛型处理不同的数据类型：
```typescript
interface Response<T> {
  success: boolean
  message: string
  data?: T
}

const response: Response<User> = await api.getUser()
```

### Q3: 如何处理动态属性？
**A:** 使用索引签名：
```typescript
interface DynamicObject {
  [key: string]: unknown
}

const obj: DynamicObject = {
  name: 'John',
  age: 30
}
```

### Q4: 如何处理可选链？
**A:** 使用可选链操作符和空值合并：
```typescript
const name = user?.profile?.name ?? 'Unknown'
```

## 总结

### 核心原则
1. ✅ 避免使用any类型
2. ✅ 为回调参数添加类型注解
3. ✅ 使用接口定义数据结构
4. ✅ 使用类型守卫确保类型安全
5. ✅ 使用泛型提高代码复用性
6. ✅ 使用工具类型简化类型定义

### 最佳实践
1. ✅ 启用严格模式
2. ✅ 类型优先，先定义后使用
3. ✅ 避免过度类型断言
4. ✅ 使用联合类型和字面量类型
5. ✅ 使用映射类型和条件类型

### 持续改进
1. 定期检查代码中的any类型
2. 为所有函数添加类型注解
3. 完善接口定义
4. 使用类型守卫确保类型安全
5. 保持代码的类型一致性

## 相关文档

- [代码规范文档](./code-standards.md)
- [代码质量文档](./code-quality.md)
- [类型修复报告](./type-fix-report.md)
- [API使用文档](./api-usage.md)
