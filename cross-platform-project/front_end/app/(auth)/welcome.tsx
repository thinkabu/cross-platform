import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import axios from 'axios';
import { ScrollView } from "react-native-gesture-handler";
import { router } from "expo-router";

const WelcomeScreen = () => {
  return (
    <View className="flex-1 justify-center items-center bg-blue-100 px-6">
      {/* Logo */}
      <Image
        source={{ uri: "https://cdn-icons-png.flaticon.com/512/69/69947.png" }} // Icon máy bay
        className="w-12 h-12 mb-2"
        resizeMode="contain"
      />

      {/* App Name */}
      <Text className="text-2xl font-bold">HungLe</Text>
      <Text className="text-sm tracking-widest text-gray-700 mb-4">Travel</Text>

      {/* Welcome Message */}
      <Text className="text-lg font-semibold mb-2">XIN CHÀO !</Text>
      <Text className="text-center text-gray-700 mb-6">
        Bạn muốn đăng nhập ngay bây giờ{"\n"}hay tiếp tục với tư cách khách?
      </Text>

      {/* Buttons */}
      <TouchableOpacity
        className="bg-gray-300 rounded-full w-48 py-3 mb-4 items-center"
        onPress={() => router.push('/login')}
        >
        <Text className="text-base font-semibold">Đăng nhập</Text>
      </TouchableOpacity>

      <TouchableOpacity className="bg-gray-300 rounded-full w-48 py-3 mb-6 items-center"
        onPress={() => router.push('/')}>
        <Text className="text-base font-semibold">Khách</Text>
      </TouchableOpacity>

      {/* Register Link */}
      <Text className="text-sm text-center">
        Tạo tài khoản mới{" "}
        <Text className="text-blue-600 font-semibold underline">tại đây</Text>
      </Text>
    </View>
  );
};

export default WelcomeScreen;
