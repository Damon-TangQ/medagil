import { View, Text } from "@tarojs/components";

export default function User() {
  return (
    <View className="p-6">
      <Text className="text-lg font-bold">个人中心</Text>
      <Text className="mt-2 block text-gray-600">登录、设置、订阅等（与 Web 用户端对齐）</Text>
    </View>
  );
}
