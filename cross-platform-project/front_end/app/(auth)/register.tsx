import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { addUser } from "@/lib/api/userAPI";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu không khớp");
      return;
    }

    try {
      await addUser({ name, email, password });
      Alert.alert("Thành công", "Đăng ký thành công!");
      router.replace("/login");
    } catch (error) {
      Alert.alert("Lỗi", "Đăng ký thất bại: " + (error as Error).message);
    }
  };

  return (
    <View className="flex-1 bg-blue-100 items-center justify-center">
      <View className="w-4/5 p-5 bg-white rounded-lg shadow-lg">
        <TouchableOpacity >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold my-2">Đăng ký</Text>
        <View className="my-2">
          <Ionicons name="person-outline" size={20} color="gray" />
          <TextInput
            placeholder="Tài khoản"
            className="border-b border-gray-400 py-1"
            value={name}
            onChangeText={setName}
          />
        </View>
        <View className="my-2">
          <Ionicons name="person-outline" size={20} color="gray" />
          <TextInput
            placeholder="Email"
            className="border-b border-gray-400 py-1"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View className="my-2">
          <Ionicons name="lock-closed-outline" size={20} color="gray" />
          <TextInput
            placeholder="Mật khẩu"
            secureTextEntry
            className="border-b border-gray-400 py-1"
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <View className="my-2">
          <Ionicons name="lock-closed-outline" size={20} color="gray" />
          <TextInput
            placeholder="Nhập lại mật khẩu"
            secureTextEntry
            className="border-b border-gray-400 py-1"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>
        <TouchableOpacity
          className="bg-gray-400 p-3 rounded-md items-center mt-3"
          onPress={handleRegister}
        >
          <Text className="text-white text-lg">Đăng ký</Text>
        </TouchableOpacity>
        <Link href={"/login"} className="text-center mt-3">
          Bạn đã có tài khoản?
          <Text className="text-blue-500"> Đăng nhập ngay</Text>
        </Link>
      </View>
    </View>
  );
}
