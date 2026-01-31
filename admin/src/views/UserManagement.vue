<template>
  <div class="user-management-container">
    <div class="page-header">
      <h1 class="page-title">用户管理</h1>
      <el-button type="primary" :icon="Plus" @click="handleAddUser">新增用户</el-button>
    </div>

    <!-- 搜索和筛选区域 -->
    <el-card class="filter-card" shadow="never">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="用户名">
          <el-input
            v-model="filterForm.username"
            placeholder="请输入用户名"
            clearable
            @clear="handleSearch"
          />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input
            v-model="filterForm.phone"
            placeholder="请输入手机号"
            clearable
            @clear="handleSearch"
          />
        </el-form-item>
        <el-form-item label="用户状态">
          <el-select
            v-model="filterForm.status"
            placeholder="请选择状态"
            clearable
            @change="handleSearch"
          >
            <el-option label="正常" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="订阅等级">
          <el-select
            v-model="filterForm.subscriptionLevel"
            placeholder="请选择订阅等级"
            clearable
            @change="handleSearch"
          >
            <el-option label="免费版" :value="0" />
            <el-option label="基础版" :value="1" />
            <el-option label="高级版" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 用户列表表格 -->
    <el-card class="table-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>用户列表</span>
          <div class="header-actions">
            <el-button
              type="danger"
              :icon="Delete"
              :disabled="selectedUsers.length === 0"
              @click="handleBatchDelete"
            >
              批量删除
            </el-button>
            <el-button
              type="warning"
              :icon="Lock"
              :disabled="selectedUsers.length === 0"
              @click="handleBatchDisable"
            >
              批量禁用
            </el-button>
          </div>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="userList"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" min-width="120" />
        <el-table-column prop="nickname" label="昵称" min-width="120" />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="email" label="邮箱" min-width="150" />
        <el-table-column label="订阅等级" width="100">
          <template #default="{ row }">
            <el-tag :type="getSubscriptionType(row.subscriptionLevel)">
              {{ getSubscriptionText(row.subscriptionLevel) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="lastLoginTime" label="最后登录时间" width="160">
          <template #default="{ row }">
            {{ formatDate(row.lastLoginTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleViewDetail(row)">详情</el-button>
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 30, 50]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 用户详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="用户详情"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="用户ID">{{ currentUser.id }}</el-descriptions-item>
        <el-descriptions-item label="用户名">{{ currentUser.username }}</el-descriptions-item>
        <el-descriptions-item label="昵称">{{ currentUser.nickname || '-' }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ currentUser.phone || '-' }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ currentUser.email || '-' }}</el-descriptions-item>
        <el-descriptions-item label="头像">
          <el-avatar :size="40" :src="currentUser.avatar" v-if="currentUser.avatar" />
          <span v-else>-</span>
        </el-descriptions-item>
        <el-descriptions-item label="订阅等级">
          <el-tag :type="getSubscriptionType(currentUser.subscriptionLevel)">
            {{ getSubscriptionText(currentUser.subscriptionLevel) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="currentUser.status === 1 ? 'success' : 'danger'">
            {{ currentUser.status === 1 ? '正常' : '禁用' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="最后登录时间">
          {{ formatDate(currentUser.lastLoginTime) }}
        </el-descriptions-item>
        <el-descriptions-item label="注册时间">
          {{ formatDate(currentUser.createdAt) }}
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 用户编辑对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      :title="isEditMode ? '编辑用户' : '新增用户'"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="userFormRef"
        :model="userForm"
        :rules="userFormRules"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="userForm.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="订阅等级" prop="subscriptionLevel">
          <el-select v-model="userForm.subscriptionLevel" placeholder="请选择订阅等级">
            <el-option label="免费版" :value="0" />
            <el-option label="基础版" :value="1" />
            <el-option label="高级版" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="userForm.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!isEditMode">
          <el-input v-model="userForm.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveUser">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import {
  Plus,
  Search,
  Refresh,
  Delete,
  Lock,
  View,
  Edit
} from '@element-plus/icons-vue'

// 加载状态
const loading = ref(false)

// 用户列表
const userList = ref<any[]>([])

// 选中的用户
const selectedUsers = ref<any[]>([])

// 当前用户
const currentUser = ref<any>({})

// 对话框显示状态
const detailDialogVisible = ref(false)
const editDialogVisible = ref(false)

// 是否为编辑模式
const isEditMode = ref(false)

// 表单引用
const userFormRef = ref<FormInstance>()

// 筛选表单
const filterForm = reactive({
  username: '',
  phone: '',
  status: undefined as number | undefined,
  subscriptionLevel: undefined as number | undefined
})

// 用户表单
const userForm = reactive({
  id: '',
  username: '',
  nickname: '',
  phone: '',
  email: '',
  subscriptionLevel: 0,
  status: 1,
  password: ''
})

// 表单验证规则
const userFormRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' }
  ],
  nickname: [
    { max: 20, message: '长度不能超过 20 个字符', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 获取订阅等级类型
const getSubscriptionType = (level: number) => {
  const typeMap: Record<number, any> = {
    0: 'info',
    1: 'warning',
    2: 'success'
  }
  return typeMap[level] || 'info'
}

// 获取订阅等级文本
const getSubscriptionText = (level: number) => {
  const textMap: Record<number, string> = {
    0: '免费版',
    1: '基础版',
    2: '高级版'
  }
  return textMap[level] || '未知'
}

// 格式化日期
const formatDate = (date: string) => {
  if (!date) return '-'
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 获取用户列表
const getUserList = async () => {
  loading.value = true
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 500))

    // 模拟数据
    const mockData = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      username: `user${i + 1}`,
      nickname: `用户${i + 1}`,
      phone: `138${String(i).padStart(8, '0')}`,
      email: `user${i + 1}@example.com`,
      avatar: `https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png`,
      subscriptionLevel: i % 3,
      status: i % 5 === 0 ? 0 : 1,
      lastLoginTime: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - (i + 10) * 24 * 60 * 60 * 1000).toISOString()
    }))

    // 应用筛选
    let filteredData = mockData.filter(user => {
      if (filterForm.username && !user.username.includes(filterForm.username)) return false
      if (filterForm.phone && !user.phone.includes(filterForm.phone)) return false
      if (filterForm.status !== undefined && user.status !== filterForm.status) return false
      if (filterForm.subscriptionLevel !== undefined && user.subscriptionLevel !== filterForm.subscriptionLevel) return false
      return true
    })

    // 更新分页
    pagination.total = filteredData.length

    // 应用分页
    const start = (pagination.page - 1) * pagination.pageSize
    const end = start + pagination.pageSize
    userList.value = filteredData.slice(start, end)
  } catch (error) {
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  getUserList()
}

// 重置
const handleReset = () => {
  filterForm.username = ''
  filterForm.phone = ''
  filterForm.status = undefined
  filterForm.subscriptionLevel = undefined
  pagination.page = 1
  getUserList()
}

// 表格选择变化
const handleSelectionChange = (selection: any[]) => {
  selectedUsers.value = selection
}

// 查看详情
const handleViewDetail = (row: any) => {
  currentUser.value = { ...row }
  detailDialogVisible.value = true
}

// 编辑用户
const handleEdit = (row: any) => {
  isEditMode.value = true
  Object.assign(userForm, {
    id: row.id,
    username: row.username,
    nickname: row.nickname,
    phone: row.phone,
    email: row.email,
    subscriptionLevel: row.subscriptionLevel,
    status: row.status,
    password: ''
  })
  editDialogVisible.value = true
}

// 新增用户
const handleAddUser = () => {
  isEditMode.value = false
  userFormRef.value?.resetFields()
  Object.assign(userForm, {
    id: '',
    username: '',
    nickname: '',
    phone: '',
    email: '',
    subscriptionLevel: 0,
    status: 1,
    password: ''
  })
  editDialogVisible.value = true
}

// 保存用户
const handleSaveUser = async () => {
  if (!userFormRef.value) return

  await userFormRef.value.validate((valid) => {
    if (valid) {
      // 模拟API请求
      ElMessage.success(isEditMode.value ? '用户更新成功' : '用户创建成功')
      editDialogVisible.value = false
      getUserList()
    }
  })
}

// 删除用户
const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    `确定要删除用户"${row.username}"吗？此操作不可恢复。`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 模拟API请求
    ElMessage.success('用户删除成功')
    getUserList()
  }).catch(() => {
    // 取消删除
  })
}

// 批量删除
const handleBatchDelete = () => {
  if (selectedUsers.value.length === 0) {
    ElMessage.warning('请先选择要删除的用户')
    return
  }

  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedUsers.value.length} 个用户吗？此操作不可恢复。`,
    '批量删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 模拟API请求
    ElMessage.success(`成功删除 ${selectedUsers.value.length} 个用户`)
    selectedUsers.value = []
    getUserList()
  }).catch(() => {
    // 取消删除
  })
}

// 批量禁用
const handleBatchDisable = () => {
  if (selectedUsers.value.length === 0) {
    ElMessage.warning('请先选择要禁用的用户')
    return
  }

  ElMessageBox.confirm(
    `确定要禁用选中的 ${selectedUsers.value.length} 个用户吗？`,
    '批量禁用确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 模拟API请求
    ElMessage.success(`成功禁用 ${selectedUsers.value.length} 个用户`)
    selectedUsers.value = []
    getUserList()
  }).catch(() => {
    // 取消禁用
  })
}

// 状态变更
const handleStatusChange = (row: any) => {
  ElMessage.success(`用户"${row.username}"状态已更新为${row.status === 1 ? '正常' : '禁用'}`)
}

// 分页大小变化
const handleSizeChange = () => {
  pagination.page = 1
  getUserList()
}

// 当前页变化
const handleCurrentChange = () => {
  getUserList()
}

// 组件挂载
onMounted(() => {
  getUserList()
})
</script>

<style scoped lang="scss">
.user-management-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 4px;

  .page-title {
    margin: 0;
    font-size: 24px;
    font-weight: 500;
    color: #303133;
  }
}

.filter-card {
  margin-bottom: 20px;

  :deep(.el-card__body) {
    padding: 20px;
  }
}

.filter-form {
  margin: 0;
}

.table-card {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .header-actions {
      display: flex;
      gap: 12px;
    }
  }
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
