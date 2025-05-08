import axiosClient from "./axiosClient";
import { User } from "../types/User";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getUsers = () => axiosClient.get<User[]>("/users");

export const addUser = (data: {
  name: string;
  email: string;
  password: string;
}) => {
  return axiosClient.post<User>("/users", data);
};

export const loginUser = (data: { name: string; password: string }) => {
  return axiosClient.post("/users/login", data);
};

export const getUserInfo = async () => {
  const token = await AsyncStorage.getItem("token");
  const res = await axiosClient.get("/users/info", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.data) {
    console.log("YEsss" + res.data);
  } else {
    console.log("NOOO");
  }
  return res.data;
};

export const changePassword = async (args: {
  oldPassword: string;
  newPassword: string;
  token: string;
}) => {
  const { oldPassword, newPassword, token } = args;
  try {
    const res = await axiosClient.put(
      "/users/change-password",
      { oldPassword, newPassword },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Đổi mật khẩu thất bại");
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const res = await axiosClient.post("/users/forgot-password", { email });
    return res.data;
  } catch (error: any) {
    console.error("Error in forgotPassword:", error.response || error.message);
    throw new Error(error.response?.data?.message || "Quên mật khẩu thất bại");
  }
};

export const verifyOtp = async (email: string, otp: string) => {
  try {
    const res = await axiosClient.post("/users/verify-otp", { email, otp });
    return res.data;
  } catch (error: any) {
    console.error("Error in verifyOtp:", error.response || error.message);
    throw new Error(error.response?.data?.message || "Xác minh OTP thất bại");
  }
};

export const resetPassword = async (email: string, otp: string, newPassword: string) => {
  try {
    const res = await axiosClient.post("/users/reset-password", { email, otp, newPassword });
    return res.data;
  } catch (error: any) {
    console.error("Error in resetPassword:", error.response || error.message);
    throw new Error(error.response?.data?.message || "Đặt lại mật khẩu thất bại");
  }
};
