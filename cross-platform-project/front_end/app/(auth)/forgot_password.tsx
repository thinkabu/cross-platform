import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from "react-native";
import { useRouter } from "expo-router"; // For navigation
import { forgotPassword } from "@/lib/api/userAPI"; // Import the forgotPassword function

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const router = useRouter(); // Initialize router for navigation

  const handleSendOtp = async () => {
    if (!email) {
        Alert.alert("Lỗi", "Vui lòng nhập email của bạn");
        return;
      }
    try {
      // Use the forgotPassword function
      const res = await forgotPassword(email);
      Alert.alert("Thành công", res.message);

      // Navigate to OTP Verification Screen and pass the email
      router.push({
        pathname: "/otp_verification",
        params: { email },
      });
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Đã xảy ra lỗi");
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-blue-50 px-6">
      {/* Header Section */}
      <View className="items-center mb-6">
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/3064/3064197.png", // Icon for forgot password
          }}
          className="w-24 h-24 mb-4"
        />
        <Text className="text-3xl font-bold text-blue-600">Quên mật khẩu</Text>
        <Text className="text-gray-600 text-center mt-2">
          Nhập email của bạn để nhận mã OTP đặt lại mật khẩu.
        </Text>
      </View>

      {/* Input Section */}
      <TextInput
        placeholder="Nhập email của bạn"
        className="border border-gray-300 rounded-lg py-3 px-4 w-full text-lg bg-white shadow-sm"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Send OTP Button */}
      <TouchableOpacity
        className="bg-blue-500 py-3 px-6 rounded-lg mt-6 w-full items-center shadow-md"
        onPress={handleSendOtp}
      >
        <Text className="text-white text-lg font-semibold">Gửi OTP</Text>
      </TouchableOpacity>

      {/* Footer Section */}
      <Text className="text-gray-500 text-center mt-6">
        Chúng tôi sẽ gửi mã OTP đến email của bạn.
      </Text>
    </View>
  );
};

export default ForgotPasswordScreen;