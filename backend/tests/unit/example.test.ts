
/**
 * 示例测试文件
 * 用于验证测试框架是否正常工作
 */

describe('示例测试', () => {
  test('应该能够运行简单的测试', () => {
    const sum = 1 + 2;
    expect(sum).toBe(3);
  });

  test('应该能够测试异步代码', async () => {
    const promise = Promise.resolve(42);
    const result = await promise;
    expect(result).toBe(42);
  });

  test('应该能够测试对象', () => {
    const obj = {
      name: 'test',
      value: 123
    };
    expect(obj).toHaveProperty('name');
    expect(obj.name).toBe('test');
    expect(obj.value).toBe(123);
  });

  test('应该能够测试数组', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(arr).toHaveLength(5);
    expect(arr).toContain(3);
  });

  test('应该能够测试错误', () => {
    expect(() => {
      throw new Error('测试错误');
    }).toThrow('测试错误');
  });
});
