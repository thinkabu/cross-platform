import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/lib/types/User';
import { getUserInfo } from '@/lib/api/userAPI';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';


const ProfileScreen = () => {
  // State to store user information
  const [user, setUser] = useState<User | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data when the component mounts
  useFocusEffect(
    useCallback(() => {
      const fetchUserData = async () => {
        try {
          const user = await getUserInfo();
          setUser(user);
        } catch (error) {
          console.error('Lỗi khi lấy thông tin người dùng:', error);
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchUserData();
    }, [])
  );

  const handleLogout = async () => {
    Alert.alert(
      "Đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất?",
      [
        {
          text: "Hủy",
          style: "cancel"
        },
        {
          text: "Đăng xuất",
          style: "destructive",
          onPress: async () => {
            try {
              // Xóa token và user data từ AsyncStorage
              await AsyncStorage.removeItem('userToken');
              await AsyncStorage.removeItem('userData');
              await AsyncStorage.removeItem('token');

              // Chuyển hướng đến màn hình đăng nhập
              router.replace('/(auth)/login');
            } catch (error) {
              console.error('Lỗi khi đăng xuất:', error);
              Alert.alert("Lỗi", "Đã có lỗi xảy ra khi đăng xuất");
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView className='bg-white flex-1 py-4 px-5 mb-10'>
      <ScrollView >
        <View >
          <Text className='text-2xl font-bold'>Hồ Sơ</Text>
          <Text className='text-xl text-[rgba(0,0,0,0.6)]'>Xem và quản lý hồ sơ của bạn bên dưới.</Text>
        </View>
        <View className=' flex-row items-center justify-center mt-4 border border-[rgba(0,0,0,0.2)] rounded-xl px-4 py-10'>
          <View className='bg-[#4086D5] absolute h-[115%] top-0 right-0 left-0 rounded-t-xl'></View>
          <Image className='size-14 rounded-full' source={require("@/assets/images/bana.jpg")} />
          <View className='flex-1 ml-4'>
            <Text className='font-bold text-2xl text-white'>
              {/* {isLoading ? 'Đang tải...' : userData.name} */}
              {isLoading ? 'Đang tải...' : user?.name || 'Tên không xác định'}
            </Text>
            <Text className='mt-1 text-xl text-[rgba(0,0,0,0.6)]'>
              {/* {isLoading ? 'Đang tải...' : userData.email} */}
              {isLoading ? 'Đang tải...' : user?.email || 'Email không xác định'}
            </Text>
          </View>
          <TouchableOpacity className='p-3 rounded-full border border-[rgba(0,0,0,0.1)] bg-white' onPress={() => { router.push("/(tabs)/(profile)/edit_profile") }}>
            <MaterialIcons color={"#4086D5"} size={28} name='edit' />
          </TouchableOpacity>
        </View>
        <View className='mt-4 '>
          <TouchableOpacity className='flex-row border-b-2 border-b-[rgba(0,0,0,0.1)] py-7 items-center' onPress={() => { router.push("/(tabs)/(profile)/change_password" as any) }}>
            <MaterialIcons className='px-3' name='lock' size={28} color="#4086D5" />
            <Text className='text-xl px-2'>Quản Lý Mật Khẩu</Text>
            <MaterialIcons className='ml-auto' name='keyboard-arrow-right' size={30} color="#4086D5" />
          </TouchableOpacity>

          <TouchableOpacity className='flex-row border-b-2 border-b-[rgba(0,0,0,0.1)] py-7 items-center' onPress={() => { router.push("/(tabs)/(profile)/contact_us" as any) }}>
            <AntDesign className='px-3' name='message1' size={28} color="#4086D5" />
            <Text className='text-xl px-2'>Liên Hệ Chúng Tôi</Text>
            <MaterialIcons className='ml-auto' name='keyboard-arrow-right' size={30} color="#4086D5" />
          </TouchableOpacity>

          <TouchableOpacity className='flex-row border-b-2 border-b-[rgba(0,0,0,0.1)] py-7 items-center' onPress={() => { router.push("/(tabs)/(profile)/about_us" as any) }}>
            <AntDesign className='px-3' name='questioncircle' size={28} color="#4086D5" />
            <Text className='text-xl px-2 '>Về Chúng Tôi</Text>
            <MaterialIcons className='ml-auto' name='keyboard-arrow-right' size={30} color="#4086D5" />
          </TouchableOpacity>

          <TouchableOpacity className='flex-row border-b-2 border-b-[rgba(0,0,0,0.1)] py-7 items-center'>
            <MaterialIcons className='px-3' name='notifications' size={28} color="#4086D5" />
            <Text className='text-xl px-2 '>Thông Báo</Text>
            <MaterialIcons className='ml-auto' name='keyboard-arrow-right' size={30} color="#4086D5" />
          </TouchableOpacity>
        </View>
        <View className='flex-1 justify-end'>
          <TouchableOpacity
            className='flex-row py-7 items-center justify-center pb-10'
            onPress={handleLogout}
          >
            <MaterialIcons className='px-3' name='logout' size={28} color="#E5386D" />
            <Text className='text-2xl px-2 text-red-600 '>Đăng Xuất</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;