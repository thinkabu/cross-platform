import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router"; // Import useRouter for navigation
import { verifyOtp } from "@/lib/api/userAPI";

const OtpVerificationScreen = () => {
  const { email } = useLocalSearchParams(); // Retrieve email from navigation params
  const [otp, setOtp] = useState("");
  const router = useRouter(); // Initialize router for navigation

  const handleVerifyOtp = async () => {
    try {
      const response = await verifyOtp(email as string, otp); // Call /verify-otp
      console.log("OTP verified successfully:", response);
  
      // Navigate to the new password creation screen
      router.push({
        pathname: "/create_new_password",
        params: { email, otp }, // Pass email and OTP to the new screen
      });
    } catch (error: any) {
      console.error("Error verifying OTP:", error.message);
      Alert.alert("Lỗi", error.message || "Xác minh OTP thất bại");
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-blue-50 px-6">
      <Text className="text-3xl font-bold text-blue-600 mb-4">Xác minh OTP</Text>
      <Text className="text-gray-600 text-center mb-6">
        Nhập mã OTP đã được gửi đến email: {email}
      </Text>

      <TextInput
        placeholder="Nhập mã OTP"
        className="border border-gray-300 rounded-lg py-3 px-4 w-full text-lg bg-white shadow-sm"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
        maxLength={6}
      />

      <TouchableOpacity
        className="bg-blue-500 py-3 px-6 rounded-lg mt-6 w-full items-center shadow-md"
        onPress={handleVerifyOtp}
      >
        <Text className="text-white text-lg font-semibold">Xác minh</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OtpVerificationScreen;