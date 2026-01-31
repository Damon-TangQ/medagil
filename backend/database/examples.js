/**
 * 数据库模型使用示例
 */

const { User, Project, Task, Subscription, SubscriptionRecord, ProjectCategory } = require('./models');

// 示例1: 创建用户
async function createUserExample() {
  try {
    const userData = {
      id: 'user_001',
      username: 'testuser',
      password: 'hashed_password_here',
      phone: '13800138000',
      nickname: '测试用户',
      subscription_level: 1
    };

    const user = await User.createUser(userData);
    console.log('创建用户成功:', user);
  } catch (error) {
    console.error('创建用户失败:', error);
  }
}

// 示例2: 创建项目
async function createProjectExample() {
  try {
    const projectData = {
      id: 'project_001',
      user_id: 'user_001',
      category_id: '1',
      name: 'AI对话项目',
      description: '这是一个AI对话项目',
      tags: 'AI,对话,智能',
      status: 1
    };

    const project = await Project.createProject(projectData);
    console.log('创建项目成功:', project);
  } catch (error) {
    console.error('创建项目失败:', error);
  }
}

// 示例3: 创建任务并添加对话记录
async function createTaskWithConversationExample() {
  try {
    // 创建任务
    const taskData = {
      id: 'task_001',
      user_id: 'user_001',
      project_id: 'project_001',
      title: 'AI对话任务',
      description: '与AI进行对话',
      task_type: 'chat'
    };

    const task = await Task.createTask(taskData);
    console.log('创建任务成功:', task);

    // 添加对话记录
    const message1 = {
      role: 'user',
      content: '你好',
      timestamp: new Date().toISOString()
    };

    await Task.addConversation(task.id, message1);

    const message2 = {
      role: 'assistant',
      content: '你好！有什么可以帮助你的吗？',
      timestamp: new Date().toISOString()
    };

    await Task.addConversation(task.id, message2);

    // 获取对话历史
    const conversation = await Task.getConversation(task.id);
    console.log('对话历史:', conversation);
  } catch (error) {
    console.error('创建任务或添加对话记录失败:', error);
  }
}

// 示例4: 创建订阅记录
async function createSubscriptionRecordExample() {
  try {
    const recordData = {
      id: 'record_001',
      user_id: 'user_001',
      subscription_id: '1',
      start_time: new Date(),
      end_time: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30天后
      amount: 9.90,
      payment_method: 'wechat',
      payment_status: 1
    };

    const record = await SubscriptionRecord.createRecord(recordData);
    console.log('创建订阅记录成功:', record);
  } catch (error) {
    console.error('创建订阅记录失败:', error);
  }
}

// 示例5: 获取分类树
async function getCategoryTreeExample() {
  try {
    const tree = await ProjectCategory.getTree();
    console.log('分类树:', JSON.stringify(tree, null, 2));
  } catch (error) {
    console.error('获取分类树失败:', error);
  }
}

// 示例6: 分页查询用户项目
async function paginateUserProjectsExample() {
  try {
    const result = await Project.findByUserId('user_001', {
      page: 1,
      pageSize: 10,
      status: 1
    });

    console.log('用户项目列表:', result);
  } catch (error) {
    console.error('查询用户项目失败:', error);
  }
}

// 运行所有示例
async function runAllExamples() {
  console.log('开始运行数据库模型使用示例...');

  await createUserExample();
  await createProjectExample();
  await createTaskWithConversationExample();
  await createSubscriptionRecordExample();
  await getCategoryTreeExample();
  await paginateUserProjectsExample();

  console.log('所有示例运行完成');
}

// 取消注释以运行示例
// runAllExamples();
