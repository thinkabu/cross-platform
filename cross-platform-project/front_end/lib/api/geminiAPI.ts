import axiosClient from "./axiosClient";

// Tạo danh sách địa điểm du lịch bằng Gemini
export const createLocation = async (data: {
  place: string;
  travelTime: number;
  travelType: string[];
}) => {
  try {
    const response = await axiosClient.post("travel_ai/create_location", data);
    return response.data;
  } catch (error) {
    console.error("Error creating location:", error);
    throw error;
  }
};

// Lấy danh sách địa điểm theo batchId
export const getLocations = async (batchId: string) => {
  try {
    const response = await axiosClient.get("travel_ai/locations", {
      params: { batchId }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching locations:", error);
    throw error;
  }
};

// Thêm địa điểm tự chọn
export const addLocation = async (data: {
  name: string;
  coordinates: { lat: number; lon: number };
  open_hours: string;
  rating: number;
  description: string;
  type: string;
  batchId: string;
}) => {
  try {
    const response = await axiosClient.post("travel_ai/add_location", data);
    return response.data;
  } catch (error) {
    console.error("Error adding location:", error);
    throw error;
  }
};

// Xóa địa điểm theo ID
export const deleteLocation = async (id: string) => {
  try {
    const response = await axiosClient.delete(
      `travel_ai/delete_location/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting location:", error);
    throw error;
  }
};

// Tạo lịch trình du lịch bằng Gemini
// export const createItinerary = async (data: {
//   userId: string;
//   travelTime: number;
//   batchId: string;
// }) => {
//   try {
//     const response = await axiosClient.post("travel_ai/create_itinerary", data);
//     return response.data;
//   } catch (error) {
//     console.error("Error creating itinerary:", error);
//     throw error;
//   }
// };

// Lấy danh sách lịch trình theo id lịch trình
export const getItinerary = async (id: string) => {
  try {
    const response = await axiosClient.get(`travel_ai/itinerary/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching itinerary:", error);
    throw error;
  }
};

// test locations
export const testLocations = async (locations: string) => {
  try {
    const response = await axiosClient.post(
      "travel_ai/test_locations",
      locations
    );
    return response.data;
  } catch (error) {
    console.error("Error creating itinerary:", error);
    throw error;
  }
};

export const createItinerary = async (data: {
  userId: string;
  travelTime: string;
  locations: any[];
}) => {
  try {
    console.log("Dữ liệu gửi lên server:", data);
    const response = await axiosClient.post("travel_ai/create_itinerary", data);
    return response.data;
  } catch (error) {
    console.error("Error creating itinerary:", error);
    throw error;
  }
};
