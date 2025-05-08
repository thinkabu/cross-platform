import axiosClient from "./axiosClient";

// Lấy danh sách sở thích
export const getInterests = async () => {
  try {
    const response = await axiosClient.get("/interests");
    return response.data;
  } catch (error) {
    console.error("Error fetching interests:", error);
    throw error;
  }
};

// Thêm một sở thích mới
export const addInterest = async (data: { name: string; description: string }) => {
  try {
    const response = await axiosClient.post("/", data);
    return response.data;
  } catch (error) {
    console.error("Error adding interest:", error);
    throw error;
  }
};