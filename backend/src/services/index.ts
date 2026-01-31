/**
 * 服务索引文件
 * 统一导出所有服务
 */

import MockUserService from './MockUserService';
import MockProjectService from './MockProjectService';
import MockTaskService from './MockTaskService';
import MockSubscriptionService from './MockSubscriptionService';

export {
  MockUserService,
  MockProjectService,
  MockTaskService,
  MockSubscriptionService
};

export default {
  userService: MockUserService,
  projectService: MockProjectService,
  taskService: MockTaskService,
  subscriptionService: MockSubscriptionService
};
