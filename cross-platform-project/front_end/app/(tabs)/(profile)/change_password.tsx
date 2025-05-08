import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { changePassword } from "@/lib/api/userAPI";
import { Feather } from "@expo/vector-icons";

const ChangePasswordScreen = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); 


  const handleChangePassword = async () => {
    const token = await AsyncStorage.getItem("token");
    console.log("[DEBUG] Retrieved token:", token);
    if (!token) {
      return Alert.alert(
        "Lỗi",
        "Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn"
      );
    }

    if (!oldPassword || !newPassword || !confirmPassword) {
      return Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
    }
    if (newPassword !== confirmPassword) {
      return Alert.alert("Lỗi", "Mật khẩu mới không khớp");
    }

    try {
      setIsLoading(true);
      const data = await changePassword({ oldPassword, newPassword, token });
      Alert.alert("Thành công", data.message || "Đổi mật khẩu thành công");
      router.back();
    } catch (err: any) {
      Alert.alert("Lỗi", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("@/assets/images/bana.jpg")}
      resizeMode="cover"
      className="flex-1"
      blurRadius={2}
    >
      <SafeAreaView className="flex-1 px-6 py-8 bg-[rgba(255,255,255,0.85)]  mb-10">
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="absolute top-20 left-6 z-10"
        >
          <Feather name="arrow-left" size={28} color="#4086D5" />
        </TouchableOpacity>
        
        <Text className="text-3xl font-bold text-center text-[#4086D5] mb-4">
          Đổi Mật Khẩu
        </Text>

        <Text className="text-lg font-semibold mb-1">Mật khẩu cũ</Text>
        <View className="relative mb-4">
          <TextInput
            placeholder="Nhập mật khẩu cũ"
            secureTextEntry={!showOldPassword}
            value={oldPassword}
            onChangeText={setOldPassword}
            className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-base"
          />
          <TouchableOpacity
            onPress={() => setShowOldPassword(!showOldPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
          >
            <Feather
              name={showOldPassword ? "eye-off" : "eye"}
              size={24}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        <Text className="text-lg font-semibold mb-1">Mật khẩu mới</Text>
        <View className="relative mb-4">
          <TextInput
            placeholder="Nhập mật khẩu mới"
            secureTextEntry={!showNewPassword}
            value={newPassword}
            onChangeText={setNewPassword}
            className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-base"
          />
          <TouchableOpacity
            onPress={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
          >
            <Feather
              name={showNewPassword ? "eye-off" : "eye"}
              size={24}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        <Text className="text-lg font-semibold mb-1">Xác nhận mật khẩu</Text>
        <View className="relative mb-8">
          <TextInput
            placeholder="Nhập lại mật khẩu"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-base"
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
          >
            <Feather
              name={showConfirmPassword ? "eye-off" : "eye"}
              size={24}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleChangePassword}
          disabled={isLoading}
          className="bg-[#4086D5] py-4 rounded-xl"
        >
          <Text className="text-white text-center text-lg font-semibold">
            {isLoading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default ChangePasswordScreen;
