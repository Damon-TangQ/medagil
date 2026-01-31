/**
 * 模拟订阅数据服务
 * 用于开发和测试阶段的订阅数据操作
 */

// 订阅套餐接口
export interface Subscription {
  id: string;
  name: string;
  level: number;
  price: number;
  duration: number;
  features: {
    chat: boolean;
    analysis: boolean;
    report: boolean;
    [key: string]: any;
  };
  maxProjects: number;
  maxTasksPerMonth: number;
  maxAiCallsPerMonth: number;
  status: number;
  createdAt: Date;
  updatedAt: Date;
}

// 订阅记录接口
export interface SubscriptionRecord {
  id: string;
  userId: string;
  subscriptionId: string;
  startTime: Date;
  endTime: Date;
  amount: number;
  paymentMethod: 'wechat' | 'alipay';
  paymentStatus: number; // 0-待支付, 1-已支付, 2-已取消
  createdAt: Date;
}

class MockSubscriptionService {
  // 内存中存储的订阅数据
  private subscriptions: Map<string, Subscription> = new Map();
  private subscriptionRecords: Map<string, SubscriptionRecord> = new Map();
  private subscriptionIdCounter: number = 1;
  private recordIdCounter: number = 1;

  constructor() {
    // 初始化测试订阅数据
    this.initMockSubscriptions();
  }

  /**
   * 初始化测试订阅数据
   */
  private initMockSubscriptions(): void {
    const testSubscriptions: Subscription[] = [
      {
        id: 'subscription_001',
        name: '免费套餐',
        level: 0,
        price: 0,
        duration: 0,
        features: {
          chat: true,
          analysis: false,
          report: false
        },
        maxProjects: 1,
        maxTasksPerMonth: 10,
        maxAiCallsPerMonth: 50,
        status: 1,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01')
      },
      {
        id: 'subscription_002',
        name: '基础套餐',
        level: 1,
        price: 9.90,
        duration: 30,
        features: {
          chat: true,
          analysis: true,
          report: false
        },
        maxProjects: 5,
        maxTasksPerMonth: 50,
        maxAiCallsPerMonth: 100,
        status: 1,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01')
      },
      {
        id: 'subscription_003',
        name: '高级套餐',
        level: 2,
        price: 29.90,
        duration: 30,
        features: {
          chat: true,
          analysis: true,
          report: true
        },
        maxProjects: 20,
        maxTasksPerMonth: 200,
        maxAiCallsPerMonth: 500,
        status: 1,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01')
      },
      {
        id: 'subscription_004',
        name: '企业套餐',
        level: 3,
        price: 99.90,
        duration: 30,
        features: {
          chat: true,
          analysis: true,
          report: true,
          api: true,
          custom: true
        },
        maxProjects: 100,
        maxTasksPerMonth: 1000,
        maxAiCallsPerMonth: 5000,
        status: 1,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01')
      }
    ];

    // 将测试订阅添加到内存存储
    testSubscriptions.forEach(subscription => {
      this.subscriptions.set(subscription.id, subscription);
      // 更新ID计数器
      const idNum = parseInt(subscription.id.split('_')[1]);
      if (idNum >= this.subscriptionIdCounter) {
        this.subscriptionIdCounter = idNum + 1;
      }
    });

    // 添加一些测试订阅记录
    const testRecords: SubscriptionRecord[] = [
      {
        id: 'record_001',
        userId: 'user_002',
        subscriptionId: 'subscription_002',
        startTime: new Date('2023-08-01'),
        endTime: new Date('2023-08-31'),
        amount: 9.90,
        paymentMethod: 'wechat',
        paymentStatus: 1,
        createdAt: new Date('2023-08-01')
      },
      {
        id: 'record_002',
        userId: 'user_004',
        subscriptionId: 'subscription_002',
        startTime: new Date('2023-08-15'),
        endTime: new Date('2023-09-14'),
        amount: 9.90,
        paymentMethod: 'alipay',
        paymentStatus: 1,
        createdAt: new Date('2023-08-15')
      }
    ];

    // 将测试订阅记录添加到内存存储
    testRecords.forEach(record => {
      this.subscriptionRecords.set(record.id, record);
      // 更新ID计数器
      const idNum = parseInt(record.id.split('_')[1]);
      if (idNum >= this.recordIdCounter) {
        this.recordIdCounter = idNum + 1;
      }
    });
  }

  /**
   * 根据ID获取订阅套餐
   */
  async getSubscriptionById(subscriptionId: string): Promise<Subscription | null> {
    const subscription = this.subscriptions.get(subscriptionId);
    return subscription || null;
  }

  /**
   * 根据等级获取订阅套餐
   */
  async getSubscriptionByLevel(level: number): Promise<Subscription | null> {
    const subscription = Array.from(this.subscriptions.values())
      .find(s => s.level === level && s.status === 1);
    return subscription || null;
  }

  /**
   * 获取所有有效的订阅套餐
   */
  async getAllActiveSubscriptions(): Promise<Subscription[]> {
    return Array.from(this.subscriptions.values())
      .filter(subscription => subscription.status === 1)
      .sort((a, b) => a.level - b.level);
  }

  /**
   * 创建订阅记录
   */
  async createSubscriptionRecord(data: {
    userId: string;
    subscriptionId: string;
    paymentMethod: 'wechat' | 'alipay';
  }): Promise<{ success: boolean; message: string; record?: SubscriptionRecord }> {
    const subscription = this.subscriptions.get(data.subscriptionId);
    if (!subscription) {
      return {
        success: false,
        message: '订阅套餐不存在'
      };
    }

    const newRecord: SubscriptionRecord = {
      id: `record_${this.recordIdCounter++}`,
      userId: data.userId,
      subscriptionId: data.subscriptionId,
      startTime: new Date(),
      endTime: new Date(Date.now() + subscription.duration * 24 * 60 * 60 * 1000),
      amount: subscription.price,
      paymentMethod: data.paymentMethod,
      paymentStatus: 0, // 默认为待支付状态
      createdAt: new Date()
    };

    // 保存订阅记录
    this.subscriptionRecords.set(newRecord.id, newRecord);

    return {
      success: true,
      message: '创建成功',
      record: newRecord
    };
  }

  /**
   * 根据ID获取订阅记录
   */
  async getSubscriptionRecordById(recordId: string): Promise<SubscriptionRecord | null> {
    const record = this.subscriptionRecords.get(recordId);
    return record || null;
  }

  /**
   * 根据用户ID获取订阅记录
   */
  async getSubscriptionRecordsByUserId(userId: string, options?: {
    page?: number;
    pageSize?: number;
  }): Promise<{ records: SubscriptionRecord[]; total: number; page: number; pageSize: number; totalPages: number }> {
    const { page = 1, pageSize = 10 } = options || {};

    let records = Array.from(this.subscriptionRecords.values())
      .filter(record => record.userId === userId);

    // 按创建时间倒序排序
    records.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const total = records.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedRecords = records.slice(startIndex, endIndex);

    return {
      records: paginatedRecords,
      total,
      page,
      pageSize,
      totalPages
    };
  }

  /**
   * 获取用户当前有效的订阅
   */
  async getActiveSubscriptionByUserId(userId: string): Promise<{ record: SubscriptionRecord; subscription: Subscription } | null> {
    const now = new Date();
    const record = Array.from(this.subscriptionRecords.values())
      .find(r => r.userId === userId && r.paymentStatus === 1 && r.endTime > now);

    if (!record) {
      return null;
    }

    const subscription = this.subscriptions.get(record.subscriptionId);
    if (!subscription) {
      return null;
    }

    return { record, subscription };
  }

  /**
   * 更新订阅记录支付状态
   */
  async updatePaymentStatus(recordId: string, status: number): Promise<{ success: boolean; message: string; record?: SubscriptionRecord }> {
    const record = this.subscriptionRecords.get(recordId);
    if (!record) {
      return {
        success: false,
        message: '订阅记录不存在'
      };
    }

    // 更新支付状态
    const updatedRecord = {
      ...record,
      paymentStatus: status
    };

    this.subscriptionRecords.set(recordId, updatedRecord);

    return {
      success: true,
      message: '更新成功',
      record: updatedRecord
    };
  }

  /**
   * 检查用户是否有有效的订阅
   */
  async hasActiveSubscription(userId: string): Promise<boolean> {
    const activeSubscription = await this.getActiveSubscriptionByUserId(userId);
    return !!activeSubscription;
  }

  /**
   * 获取订阅套餐的功能特性
   */
  async getSubscriptionFeatures(subscriptionId: string): Promise<Subscription['features'] | null> {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) {
      return null;
    }

    return subscription.features;
  }

  /**
   * 检查订阅套餐是否包含某项功能
   */
  async hasFeature(subscriptionId: string, feature: string): Promise<boolean> {
    const features = await this.getSubscriptionFeatures(subscriptionId);
    if (!features) {
      return false;
    }

    return features[feature] === true;
  }

  /**
   * 获取订阅套餐的限制
   */
  async getSubscriptionLimits(subscriptionId: string): Promise<{
    maxProjects: number;
    maxTasksPerMonth: number;
    maxAiCallsPerMonth: number;
  } | null> {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) {
      return null;
    }

    return {
      maxProjects: subscription.maxProjects,
      maxTasksPerMonth: subscription.maxTasksPerMonth,
      maxAiCallsPerMonth: subscription.maxAiCallsPerMonth
    };
  }
}

// 导出单例
export default new MockSubscriptionService();
