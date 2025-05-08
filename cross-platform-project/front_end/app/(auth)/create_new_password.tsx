import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { resetPassword } from "@/lib/api/userAPI"; // Import resetPassword function

const CreateNewPasswordScreen = () => {
  const { email, otp } = useLocalSearchParams(); // Retrieve email and OTP from navigation params
  const [newPassword, setNewPassword] = useState("");
  const router = useRouter(); // Initialize router for navigation

  const handleCreateNewPassword = async () => {
    try {
      if (!newPassword) {
        Alert.alert("Lỗi", "Vui lòng nhập mật khẩu mới");
        return;
      }

      // Call the resetPassword API
      const response = await resetPassword(email as string, otp as string, newPassword);
      console.log("Password reset successfully:", response);

      Alert.alert("Thành công", "Mật khẩu đã được đặt lại thành công");
      router.replace("/login"); // Navigate to the login screen
    } catch (error: any) {
      console.error("Error resetting password:", error.message);
      Alert.alert("Lỗi", error.message || "Đặt lại mật khẩu thất bại");
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-blue-50 px-6">
      <Text className="text-3xl font-bold text-blue-600 mb-4">Tạo mật khẩu mới</Text>
      <Text className="text-gray-600 text-center mb-6">
        Nhập mật khẩu mới cho tài khoản của bạn.
      </Text>

      <TextInput
        placeholder="Nhập mật khẩu mới"
        className="border border-gray-300 rounded-lg py-3 px-4 w-full text-lg bg-white shadow-sm"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />

      <TouchableOpacity
        className="bg-blue-500 py-3 px-6 rounded-lg mt-6 w-full items-center shadow-md"
        onPress={handleCreateNewPassword}
      >
        <Text className="text-white text-lg font-semibold">Đặt lại mật khẩu</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateNewPasswordScreen;