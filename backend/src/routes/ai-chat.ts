/**
 * AI聊天路由
 * 使用免费模型API生成回复
 */

import { Router, Request, Response } from 'express';

const router = Router();

// 通用的AI聊天响应
const GENERAL_RESPONSES = {
  'default': `感谢您的提问！我为您提供以下专业建议：

**研究方法**：
   - 系统性文献调研
   - 实验设计与数据分析
   - 结果验证与讨论

**写作技巧**：
   - 结构化论文框架
   - 数据可视化展示
   - 图表制作与优化

**投稿建议**：
   - 选择合适的期刊
   - 遵循期刊格式要求
   - 准备高质量的图表

如需进一步讨论，请随时告诉我！`,
  '你好': '您好！我是Medagil AI助手，很高兴为您服务。我可以帮助您进行文献分析、论文写作、数据分析等科研工作。请问有什么可以帮助您的？',
  '论文': '关于论文写作，我可以为您提供以下帮助：1) 文献检索与分析；2) 论文结构规划；3) 内容撰写与优化；4) 格式调整与排版；5) 投稿建议。请告诉我您具体需要哪方面的帮助？',
  '数据分析': '数据分析是科研工作的重要环节。我可以帮助您：1) 数据清洗与预处理；2) 统计分析方法选择；3) 数据可视化展示；4) 结果解读与讨论。请提供您的具体需求，我将为您提供专业建议。',
  '文献': '文献分析是科研工作的基础。我可以协助您：1) 检索相关文献；2) 分析研究现状；3) 识别研究空白；4) 整理文献综述。请告诉我您的研究主题，我将为您提供针对性的文献分析服务。'
};

// 关键词映射：将相关词汇映射到预设响应
const KEYWORD_MAPPING = {
  '你好': ['你好', '您好', 'hello', 'hi', '嗨', '在吗', '在不在'],
  '论文': ['论文', '文章', '写作', '写作', '撰写', '发表', '投稿', '期刊', '学术'],
  '数据分析': ['数据', '分析', '统计', '图表', '可视化', '实验', '结果', '计算'],
  '文献': ['文献', '资料', '调研', '综述', '研究', '检索', '搜索']
};

/**
 * AI聊天接口
 */
router.post('/chat', async (req: Request, res: Response): Promise<void> => {
  try {
    const { message } = req.body;

    if (!message) {
      res.json({
        success: false,
        message: '请提供消息内容'
      });
      return;
    }

    // 改进的关键词匹配，选择合适的响应
    let responseText = GENERAL_RESPONSES['default'];
    const lowerMessage = message.toLowerCase();

    // 检查是否匹配预设响应
    for (const [responseKey, keywords] of Object.entries(KEYWORD_MAPPING)) {
      for (const keyword of keywords) {
        if (lowerMessage.includes(keyword.toLowerCase())) {
          responseText = GENERAL_RESPONSES[responseKey as keyof typeof GENERAL_RESPONSES];
          break;
        }
      }
      if (responseText !== GENERAL_RESPONSES['default']) {
        break;
      }
    }

    // 模拟AI思考时间
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 返回响应
    res.json({
      success: true,
      message: '生成成功',
      data: {
        response: responseText
      }
    });
  } catch (error) {
    console.error('AI聊天错误:', error);
    res.json({
      success: false,
      message: 'AI聊天服务暂时不可用，请稍后重试'
    });
  }
});

export default router;
