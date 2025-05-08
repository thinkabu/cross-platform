import axiosClient from "./axiosClient";

export const getDirection = async (
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number
) => {
  try {
    const response = await axiosClient.get("/direction/distance-time", {
      params: {
        origin_lat: originLat,
        origin_lng: originLng,
        dest_lat: destLat,
        dest_lng: destLng,
      },
    });
    return response.data; // Trả về dữ liệu đường đi
  } catch (error) {
    console.error("Lỗi khi gọi API Direction:", error);
    throw error;
  }
};