import { getUserInfo } from "@/lib/api/userAPI";
import { User } from "@/lib/types/User";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";
import axiosClient from "@/lib/api/axiosClient";

const EditProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getUserInfo();
        setUser(user);
        setName(user.name);
        setEmail(user.email);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
  
      const res = await axiosClient.put(
        "users/update",
        { name, email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const data = res.data;
      console.log("Update response:", data);
  
      setUser(data);
      alert("Cập nhật thành công!");
    } catch (err: any) {
      console.error("Update error:", err.message);
      alert("Cập nhật thất bại!");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-6  mb-10">
      <ScrollView>
        <TouchableOpacity className="mb-4" onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>

        <View className="my-3">
          <Text className="text-2xl font-semibold">Hồ Sơ Chi Tiết</Text>
          <Text className="text-gray-500">Xem và chỉnh sửa hồ sơ.</Text>
        </View>

        <View className="items-center my-4">
          <Image
            source={require("@/assets/images/bana.jpg")}
            className="w-24 h-24 rounded-full"
          />
        </View>

        <View className="gap-y-4">
          <View className="border border-gray-300 p-3 rounded-lg flex-row items-center">
            <TextInput
              placeholder="Full name"
              className="flex-1"
              value={name}
              onChangeText={setName}
            />
            <Ionicons name="person-outline" size={20} color="gray" />
          </View>

          <View className="border border-gray-300 p-3 rounded-lg flex-row items-center">
            <TextInput
              placeholder="Email"
              className="flex-1"
              value={email}
              onChangeText={setEmail}
            />
            <Ionicons name="mail-outline" size={20} color="gray" />
          </View>

          <View className="border border-gray-300 p-3 rounded-lg flex-row items-center">
            <TextInput
              placeholder="Phone number"
              className="flex-1"
              defaultValue="08103461256"
              editable={false}
            />
            <Ionicons name="call-outline" size={20} color="gray" />
          </View>
        </View>

        <Text className="mt-6 text-lg font-semibold">Trip taken</Text>
        <View className="flex-row gap-2 mt-2">
          {["DaNang", "HoiAn", "Sapa"].map((course, index) => (
            <View key={index} className="bg-gray-200 px-4 py-2 rounded-full">
              <Text className="text-gray-700">{course}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          onPress={handleUpdateProfile}
          className="bg-green-500 py-3 rounded-full mt-6"
        >
          <Text className="text-white text-center font-semibold">Cập Nhật</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
