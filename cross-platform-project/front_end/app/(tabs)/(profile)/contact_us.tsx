import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ImageBackground, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from 'expo-router';

const ContactUsScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    // Kiểm tra các trường thông tin
    if (!name.trim() || !email.trim() || !message.trim()) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    // Kiểm tra email hợp lệ
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Lỗi', 'Email không hợp lệ');
      return;
    }

    // Xử lý gửi form liên hệ (ở đây chỉ hiển thị thông báo)
    Alert.alert(
      'Thành công',
      'Tin nhắn của bạn đã được gửi. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <ImageBackground
      source={require("@/assets/images/bana.jpg")}
      resizeMode="cover"
      className="flex-1"
      blurRadius={2}
    >
      <SafeAreaView className="flex-1 bg-[rgba(255,255,255,0.85)]  mb-10">
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="absolute top-20 left-6 z-10"
        >
          <Feather name="arrow-left" size={28} color="#4086D5" />
        </TouchableOpacity>
        
        <View className="px-6 pt-20">
          <Text className="text-3xl font-bold text-center text-[#4086D5] mb-4">
            Liên Hệ Chúng Tôi
          </Text>
        </View>
        
        <ScrollView className="px-6">
          <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <Text className="text-xl font-bold text-[#4086D5] mb-4">Gửi Tin Nhắn Cho Chúng Tôi</Text>
            
            <Text className="text-base font-semibold mb-1">Họ và tên</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Nhập họ và tên của bạn"
              className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-base mb-4"
            />
            
            <Text className="text-base font-semibold mb-1">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Nhập địa chỉ email của bạn"
              keyboardType="email-address"
              className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-base mb-4"
            />
            
            <Text className="text-base font-semibold mb-1">Tin nhắn</Text>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Nhập nội dung tin nhắn"
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-base mb-6"
            />
            
            <TouchableOpacity
              onPress={handleSubmit}
              className="bg-[#4086D5] py-4 rounded-xl"
            >
              <Text className="text-white text-center text-lg font-semibold">
                Gửi Tin Nhắn
              </Text>
            </TouchableOpacity>
          </View>
          
          <View className="bg-white rounded-xl p-6 mb-10 shadow-sm">
            <Text className="text-xl font-bold text-[#4086D5] mb-4">Thông Tin Liên Hệ</Text>
            
            <View className="flex-row items-center mb-4">
              <Ionicons name="mail-outline" size={24} color="#4086D5" />
              <Text className="ml-3 text-base">quyhv.22ite@vku.udn.vn</Text>
            </View>
            
            <View className="flex-row items-center mb-4">
              <Ionicons name="call-outline" size={24} color="#4086D5" />
              <Text className="ml-3 text-base">+84 766 532 398</Text>
            </View>
            
            <View className="flex-row items-center mb-4">
              <Ionicons name="location-outline" size={24} color="#4086D5" />
              <Text className="ml-3 text-base">10 Hoàng Công Chất, Ngũ Hành Sơn, Đà Nẵng</Text>
            </View>
            
            <View className="flex-row items-center">
              <MaterialIcons name="access-time" size={24} color="#4086D5" />
              <Text className="ml-3 text-base">Thứ Hai - Thứ Sáu: 9:00 - 18:00</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default ContactUsScreen; 