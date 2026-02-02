/**
 * 模拟服务使用示例
 * 展示如何使用各个模拟服务
 */

import MockUserService, { RegisterData, LoginData, WechatLoginData } from './MockUserService';
import MockProjectService, { CreateProjectData, UpdateProjectData } from './MockProjectService';
import MockTaskService, { CreateTaskData, ConversationMessage } from './MockTaskService';
import MockSubscriptionService from './MockSubscriptionService';

// ==================== 用户服务示例 ====================

/**
 * 用户注册示例
 */
async function userRegisterExample() {
  const registerData: RegisterData = {
    username: 'newuser',
    password: 'password123',
    phone: '13800138999',
    email: 'newuser@example.com',
    nickname: '新用户'
  };

  const result = await MockUserService.register(registerData);
  console.log('用户注册结果:', result);
}

/**
 * 用户登录示例
 */
async function userLoginExample() {
  const loginData: LoginData = {
    username: 'user1',
    password: 'user123'
  };

  const result = await MockUserService.login(loginData, '192.168.1.1');
  console.log('用户登录结果:', result);
}

/**
 * 微信登录示例
 */
async function wechatLoginExample() {
  const wechatLoginData: WechatLoginData = {
    openid: 'wx_openid_123456',
    unionid: 'wx_unionid_789012',
    nickname: '微信用户',
    avatar: 'https://example.com/avatar.jpg'
  };

  const result = await MockUserService.wechatLogin(wechatLoginData);
  console.log('微信登录结果:', result);
}

/**
 * 获取用户信息示例
 */
async function getUserInfoExample() {
  const userId = 'user_002';
  const user = await MockUserService.getUserById(userId);
  console.log('用户信息:', user);
}

/**
 * 更新用户信息示例
 */
async function updateUserExample() {
  const userId = 'user_002';
  const result = await MockUserService.updateUser(userId, {
    nickname: '新昵称',
    avatar: 'https://example.com/new-avatar.jpg'
  });
  console.log('更新用户信息结果:', result);
}

// ==================== 项目服务示例 ====================

/**
 * 创建项目示例
 */
async function createProjectExample() {
  const projectData: CreateProjectData = {
    userId: 'user_002',
    categoryId: '1',
    name: '新项目',
    description: '这是一个新项目',
    tags: 'AI,测试'
  };

  const result = await MockProjectService.createProject(projectData);
  console.log('创建项目结果:', result);
}

/**
 * 获取用户项目列表示例
 */
async function getUserProjectsExample() {
  const userId = 'user_002';
  const result = await MockProjectService.getProjectsByUserId(userId, {
    status: 1,
    page: 1,
    pageSize: 10
  });
  console.log('用户项目列表:', result);
}

/**
 * 更新项目示例
 */
async function updateProjectExample() {
  const projectId = 'project_001';
  const updateData: UpdateProjectData = {
    name: '更新后的项目名称',
    description: '更新后的项目描述',
    status: 1
  };

  const result = await MockProjectService.updateProject(projectId, updateData);
  console.log('更新项目结果:', result);
}

/**
 * 增加项目浏览次数示例
 */
async function incrementViewCountExample() {
  const projectId = 'project_001';
  const result = await MockProjectService.incrementViewCount(projectId);
  console.log('增加浏览次数结果:', result);
}

/**
 * 搜索项目示例
 */
async function searchProjectsExample() {
  const keyword = 'AI';
  const result = await MockProjectService.searchProjects(keyword, {
    status: 1,
    page: 1,
    pageSize: 10
  });
  console.log('搜索项目结果:', result);
}

// ==================== 任务服务示例 ====================

/**
 * 创建任务示例
 */
async function createTaskExample() {
  const taskData: CreateTaskData = {
    userId: 'user_002',
    projectId: 'project_001',
    title: '新任务',
    description: '这是一个新任务',
    taskType: 'chat'
  };

  const result = await MockTaskService.createTask(taskData);
  console.log('创建任务结果:', result);
}

/**
 * 获取用户任务列表示例
 */
async function getUserTasksExample() {
  const userId = 'user_002';
  const result = await MockTaskService.getTasksByUserId(userId, {
    status: 1,
    page: 1,
    pageSize: 10
  });
  console.log('用户任务列表:', result);
}

/**
 * 添加对话记录示例
 */
async function addConversationExample() {
  const taskId = 'task_001';
  const message: ConversationMessage = {
    role: 'user',
    content: '这是一个新的问题',
    timestamp: new Date()
  };

  const result = await MockTaskService.addConversation(taskId, message);
  console.log('添加对话记录结果:', result);
}

/**
 * 获取对话历史示例
 */
async function getConversationHistoryExample() {
  const taskId = 'task_001';
  const history = await MockTaskService.getConversationHistory(taskId);
  console.log('对话历史:', history);
}

/**
 * 标记任务为完成示例
 */
async function markTaskAsCompletedExample() {
  const taskId = 'task_004';
  const result = await MockTaskService.markAsCompleted(taskId, '任务已完成');
  console.log('标记任务为完成结果:', result);
}

// ==================== 订阅服务示例 ====================

/**
 * 获取所有有效订阅套餐示例
 */
async function getAllActiveSubscriptionsExample() {
  const subscriptions = await MockSubscriptionService.getAllActiveSubscriptions();
  console.log('所有有效订阅套餐:', subscriptions);
}

/**
 * 创建订阅记录示例
 */
async function createSubscriptionRecordExample() {
  const result = await MockSubscriptionService.createSubscriptionRecord({
    userId: 'user_003',
    subscriptionId: 'subscription_002',
    paymentMethod: 'wechat'
  });
  console.log('创建订阅记录结果:', result);
}

/**
 * 获取用户当前有效订阅示例
 */
async function getActiveSubscriptionExample() {
  const userId = 'user_002';
  const activeSubscription = await MockSubscriptionService.getActiveSubscriptionByUserId(userId);
  console.log('用户当前有效订阅:', activeSubscription);
}

/**
 * 更新订阅记录支付状态示例
 */
async function updatePaymentStatusExample() {
  const recordId = 'record_001';
  const result = await MockSubscriptionService.updatePaymentStatus(recordId, 1);
  console.log('更新支付状态结果:', result);
}

/**
 * 检查用户是否有有效订阅示例
 */
async function hasActiveSubscriptionExample() {
  const userId = 'user_002';
  const hasSubscription = await MockSubscriptionService.hasActiveSubscription(userId);
  console.log('用户是否有有效订阅:', hasSubscription);
}

/**
 * 获取订阅套餐功能特性示例
 */
async function getSubscriptionFeaturesExample() {
  const subscriptionId = 'subscription_002';
  const features = await MockSubscriptionService.getSubscriptionFeatures(subscriptionId);
  console.log('订阅套餐功能特性:', features);
}

/**
 * 检查订阅套餐是否包含某项功能示例
 */
async function hasFeatureExample() {
  const subscriptionId = 'subscription_002';
  const hasChat = await MockSubscriptionService.hasFeature(subscriptionId, 'chat');
  const hasReport = await MockSubscriptionService.hasFeature(subscriptionId, 'report');
  console.log('订阅套餐是否包含聊天功能:', hasChat);
  console.log('订阅套餐是否包含报告功能:', hasReport);
}

// ==================== 运行所有示例 ====================

/**
 * 运行所有示例
 */
async function runAllExamples() {
  console.log('===== 用户服务示例 =====');
  await userRegisterExample();
  await userLoginExample();
  await wechatLoginExample();
  await getUserInfoExample();
  await updateUserExample();

  console.log('===== 项目服务示例 =====');
  await createProjectExample();
  await getUserProjectsExample();
  await updateProjectExample();
  await incrementViewCountExample();
  await searchProjectsExample();

  console.log('===== 任务服务示例 =====');
  await createTaskExample();
  await getUserTasksExample();
  await addConversationExample();
  await getConversationHistoryExample();
  await markTaskAsCompletedExample();

  console.log('===== 订阅服务示例 =====');
  await getAllActiveSubscriptionsExample();
  await createSubscriptionRecordExample();
  await getActiveSubscriptionExample();
  await updatePaymentStatusExample();
  await hasActiveSubscriptionExample();
  await getSubscriptionFeaturesExample();
  await hasFeatureExample();
}

// 导出函数以便在其他地方调用
export { runAllExamples };

// 取消注释以运行所有示例
// runAllExamples();
