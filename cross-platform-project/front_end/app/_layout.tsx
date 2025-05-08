import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { router } from 'expo-router';
import FloatingRobot from '../components/FloatingRobot';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  useEffect(() => {
    // Đảm bảo luôn bắt đầu từ trang chủ
    router.replace('/(tabs)/(home)');
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{
        headerShown: false, // Ẩn tiêu đề trên góc trái
      }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
      </Stack>
      <FloatingRobot />
    </GestureHandlerRootView>
  );
}
