<template>
  <div class="project-categories">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>项目分类</span>
          <el-button type="primary" :icon="Plus" size="small" @click="handleAdd">
            添加分类
          </el-button>
        </div>
      </template>

      <el-tree
        ref="treeRef"
        :data="categories"
        :props="defaultProps"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
        :highlight-current="true"
        @node-click="handleNodeClick"
      >
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <span class="node-label">{{ node.label }}</span>
            <span class="node-actions">
              <el-button
                link
                type="primary"
                :icon="Edit"
                size="small"
                @click="handleEdit(data)"
              />
              <el-button
                link
                type="danger"
                :icon="Delete"
                size="small"
                @click="handleDelete(data)"
              />
            </span>
          </span>
        </template>
      </el-tree>
    </el-card>

    <!-- 添加/编辑分类对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称" />
        </el-form-item>

        <el-form-item label="上级分类" prop="parentId">
          <el-tree-select
            v-model="form.parentId"
            :data="categoryTreeOptions"
            :props="{ value: 'id', label: 'name', children: 'children' }"
            placeholder="请选择上级分类（可选）"
            clearable
            check-strictly
          />
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" :max="999" />
        </el-form-item>

        <el-form-item label="图标" prop="icon">
          <el-input v-model="form.icon" placeholder="请输入图标类名" />
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入分类描述"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import type { FormInstance, FormRules, ElTree } from 'element-plus'

// 树形组件引用
const treeRef = ref<InstanceType<typeof ElTree>>()

// 表单引用
const formRef = ref<FormInstance>()

// 对话框显示状态
const dialogVisible = ref(false)

// 对话框标题
const dialogTitle = computed(() => {
  return isEdit.value ? '编辑分类' : '添加分类'
})

// 是否编辑模式
const isEdit = ref(false)

// 提交状态
const submitting = ref(false)

// 默认属性
const defaultProps = {
  children: 'children',
  label: 'name'
}

// 分类数据
const categories = ref([
  {
    id: '1',
    name: '数据分析',
    children: [
      { id: '1-1', name: '数据可视化' },
      { id: '1-2', name: '统计分析' }
    ]
  },
  {
    id: '2',
    name: '报告生成',
    children: [
      { id: '2-1', name: '商业报告' },
      { id: '2-2', name: '技术报告' }
    ]
  },
  {
    id: '3',
    name: '智能对话',
    children: [
      { id: '3-1', name: '客服机器人' },
      { id: '3-2', name: '智能问答' }
    ]
  },
  {
    id: '4',
    name: '其他'
  }
])

// 表单数据
const form = reactive({
  id: '',
  name: '',
  parentId: '',
  sort: 0,
  icon: '',
  description: ''
})

// 表单验证规则
const rules: FormRules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ]
}

// 分类树选项（排除当前节点及其子节点）
const categoryTreeOptions = computed(() => {
  if (!isEdit.value) {
    return categories.value
  }

  // 递归过滤掉当前节点及其子节点
  const filterNodes = (nodes: any[], targetId: string): any[] => {
    return nodes
      .filter(node => node.id !== targetId)
      .map(node => ({
        ...node,
        children: node.children ? filterNodes(node.children, targetId) : undefined
      }))
  }

  return filterNodes(categories.value, form.id)
})

// 节点点击处理
const handleNodeClick = (data: any) => {
  // 可以在这里处理节点点击事件，例如筛选项目
  console.log('点击分类:', data)
}

// 添加分类
const handleAdd = () => {
  isEdit.value = false
  resetForm()
  dialogVisible.value = true
}

// 编辑分类
const handleEdit = (data: any) => {
  isEdit.value = true
  form.id = data.id
  form.name = data.name
  form.parentId = data.parentId || ''
  form.sort = data.sort || 0
  form.icon = data.icon || ''
  form.description = data.description || ''
  dialogVisible.value = true
}

// 删除分类
const handleDelete = async (data: any) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除分类"${data.name}"吗？删除后该分类下的项目将移至"其他"分类。`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    // TODO: 调用删除分类的API
    // const result = await categoryStore.deleteCategory(data.id)
    // if (result.success) {
    //   ElMessage.success('删除成功')
    //   loadCategories()
    // } else {
    //   ElMessage.error(result.message || '删除失败')
    // }

    // 模拟删除
    ElMessage.success('删除成功')
    loadCategories()
  } catch (error) {
    // 用户取消操作
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        // TODO: 调用添加/编辑分类的API
        // const result = isEdit.value
        //   ? await categoryStore.updateCategory(form.id, form)
        //   : await categoryStore.createCategory(form)
        // 
        // if (result.success) {
        //   ElMessage.success(isEdit.value ? '编辑成功' : '添加成功')
        //   dialogVisible.value = false
        //   loadCategories()
        // } else {
        //   ElMessage.error(result.message || (isEdit.value ? '编辑失败' : '添加失败'))
        // }

        // 模拟提交
        await new Promise(resolve => setTimeout(resolve, 500))
        ElMessage.success(isEdit.value ? '编辑成功' : '添加成功')
        dialogVisible.value = false
        loadCategories()
      } catch (error) {
        console.error('提交错误:', error)
        ElMessage.error(isEdit.value ? '编辑失败' : '添加失败')
      } finally {
        submitting.value = false
      }
    }
  })
}

// 对话框关闭处理
const handleDialogClose = () => {
  resetForm()
}

// 重置表单
const resetForm = () => {
  form.id = ''
  form.name = ''
  form.parentId = ''
  form.sort = 0
  form.icon = ''
  form.description = ''
  formRef.value?.clearValidate()
}

// 加载分类列表
const loadCategories = () => {
  // TODO: 调用获取分类列表的API
  // const result = await categoryStore.getAllCategories()
  // if (result.success) {
  //   categories.value = result.data
  // }

  // 模拟数据已在上面定义
}

// 初始化
onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
.project-categories {
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 8px;
}

.node-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.node-actions {
  display: none;
  gap: 4px;
}

.custom-tree-node:hover .node-actions {
  display: flex;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .node-actions {
    display: flex;
  }
}
</style>
