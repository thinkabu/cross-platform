import { loginUser } from "@/lib/api/userAPI";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const LoginScreen = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await loginUser({ name, password });

      // Lưu token
      await AsyncStorage.setItem("token", res.data.token);

      // Lưu thông tin người dùng
      await AsyncStorage.setItem(
        "userData",
        JSON.stringify({
          name: res.data.user.name,
          email: res.data.user.email,
          id: res.data.user.id,
        })
      );

      Alert.alert("Thành công", "Đăng nhập thành công!");
      router.replace("/(tabs)/(home)");
      console.log(res.data.token);
    } catch (error) {
      Alert.alert("Lỗi", "Đăng nhập thất bại: " + (error as Error).message);
    }
  };
  return (
    <View className={`flex-1 justify-center items-center bg-blue-100 px-6`}>
      {/* Icon */}
      <View className={`bg-white p-2 rounded-lg mb-4`}>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/25/25231.png",
          }}
          className={`w-8 h-8`}
        />
      </View>

      {/* Login Form */}
      <Text className={`text-xl font-semibold mb-4`}>Đăng nhập</Text>

      <View className={`w-full max-w-xs`}>
        {/* Username Input */}
        <View className={`flex-row items-center border-b border-gray-400 mb-4`}>
          <Text className={`text-lg mr-2`}>👤</Text>
          <TextInput
            placeholder="Tài khoản"
            className={`flex-1 py-2 text-lg`}
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Password Input */}
        <View className={`flex-row items-center border-b border-gray-400 mb-4`}>
          <Text className={`text-lg mr-2`}>🔒</Text>
          <TextInput
            placeholder="Mật khẩu"
            secureTextEntry
            className={`flex-1 py-2 text-lg`}
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Login Button */}
        <TouchableOpacity
          className={`bg-gray-300 py-3 rounded-lg items-center`}
          onPress={handleLogin}
        >
          <Text className={`text-lg font-semibold`}>Đăng nhập</Text>
        </TouchableOpacity>

        {/* Register Link */}
        <Link href={"/register"} className={`text-center mt-4`}>
          Tạo tài khoản mới{" "}
          <Text className={`text-blue-600 font-semibold`}>tại đây</Text>
        </Link>

        <TouchableOpacity
          className="mt-4 flex-row justify-center items-center"
          onPress={() => router.push("/forgot_password")}
        >
          <Text className="text-blue-500 text-lg font-semibold">
            Quên mật khẩu?
          </Text>
          
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
