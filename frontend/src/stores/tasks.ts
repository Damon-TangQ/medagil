import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Task {
  id: number
  question: string
  createdAt: Date
  status: 'completed' | 'processing' | 'pending'
  answer?: string
}

export const useTasksStore = defineStore('tasks', () => {
  // 任务列表
  const tasks = ref<Task[]>([])

  // 添加任务
  const addTask = (question: string) => {
    const newTask: Task = {
      id: Date.now(),
      question,
      createdAt: new Date(),
      status: 'processing'
    }
    tasks.value.unshift(newTask)

    // 保存到 localStorage
    saveToLocalStorage()

    return newTask
  }

  // 更新任务状态
  const updateTaskStatus = (taskId: number, status: Task['status'], answer?: string) => {
    const task = tasks.value.find(t => t.id === taskId)
    if (task) {
      task.status = status
      if (answer) {
        task.answer = answer
      }
      // 保存到 localStorage
      saveToLocalStorage()
    }
  }

  // 删除任务
  const deleteTask = (taskId: number) => {
    const index = tasks.value.findIndex(t => t.id === taskId)
    if (index > -1) {
      tasks.value.splice(index, 1)
      // 保存到 localStorage
      saveToLocalStorage()
    }
  }

  // 获取任务
  const getTask = (taskId: number) => {
    return tasks.value.find(t => t.id === taskId)
  }

  // 清空所有任务
  const clearTasks = () => {
    tasks.value = []
    // 保存到 localStorage
    saveToLocalStorage()
  }

  // 从 localStorage 加载任务
  const loadFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem('medagil_tasks')
      if (stored) {
        const parsed = JSON.parse(stored)
        tasks.value = parsed.map((t: any) => ({
          ...t,
          createdAt: new Date(t.createdAt)
        }))
      }
    } catch (error) {
      console.error('Failed to load tasks from localStorage:', error)
    }
  }

  // 保存到 localStorage
  const saveToLocalStorage = () => {
    try {
      localStorage.setItem('medagil_tasks', JSON.stringify(tasks.value))
    } catch (error) {
      console.error('Failed to save tasks to localStorage:', error)
    }
  }

  // 初始化时从 localStorage 加载
  loadFromLocalStorage()

  return {
    tasks,
    addTask,
    updateTaskStatus,
    deleteTask,
    getTask,
    clearTasks
  }
})
