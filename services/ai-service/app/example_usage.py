# example_usage.py
# AIController使用示例
# 展示如何实例化AIController并调用其方法

import sys
import os

# 添加项目根目录到Python路径
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from app.adapters.controllers import AIController
from app.use_cases import AIService
from app.domain.value_objects import AIRequest


def example_ai_controller_usage():
    """
    示例：使用AIController处理AI请求

    流程：
    1. 创建AIService实例
    2. 创建AIController实例，注入AIService
    3. 调用AIController的process方法处理请求
    """
    print("=" * 60)
    print("AIController使用示例")
    print("=" * 60)

    # 步骤1：创建AI服务实例
    print("
1. 创建AI服务实例...")
    ai_service = AIService()
    print("   ✓ AI服务创建成功")

    # 步骤2：创建AI控制器实例
    print("
2. 创建AI控制器实例...")
    ai_controller = AIController(ai_service=ai_service)
    print("   ✓ AI控制器创建成功")

    # 步骤3：测试获取可用模型列表
    print("
3. 获取可用的AI模型列表...")
    models = ai_service.get_ai_models()
    print(f"   可用模型: {', '.join(models)}")

    # 步骤4：测试处理不同类型的AI请求
    test_cases = [
        {
            "name": "论文大纲生成",
            "input_text": "人工智能在医疗诊断中的应用研究",
            "agent_type": "paper-outline"
        },
        {
            "name": "论文润色",
            "input_text": "本研究探讨了AI技术在医疗诊断领域的应用，通过深度学习算法分析医学影像数据。",
            "agent_type": "paper-polish"
        },
        {
            "name": "通用AI处理",
            "input_text": "请解释什么是机器学习",
            "agent_type": "general"
        }
    ]

    print("
4. 测试处理不同类型的AI请求...")
    for i, test_case in enumerate(test_cases, 1):
        print(f"
   测试用例 {i}: {test_case['name']}")
        print(f"   输入: {test_case['input_text'][:50]}...")

        # 创建AI请求
        ai_request = AIRequest(
            model=test_case['agent_type'],
            prompt=test_case['input_text'],
            parameters={}
        )

        # 处理请求
        try:
            response = ai_service.process_ai_request(ai_request)
            print(f"   输出预览: {response.content[:100]}...")
            print(f"   ✓ 处理成功")
        except Exception as e:
            print(f"   ✗ 处理失败: {str(e)}")

    print("
" + "=" * 60)
    print("示例执行完成")
    print("=" * 60)


if __name__ == "__main__":
    example_ai_controller_usage()
