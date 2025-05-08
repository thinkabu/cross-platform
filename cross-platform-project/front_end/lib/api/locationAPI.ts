// locationApi.ts
import axiosClient from "./axiosClient";

export const getAddressFromCoords = async (
  latitude: number,
  longitude: number
) => {
  const response = await axiosClient.post("/location", {
    latitude,
    longitude
  });
  return response.data.address;
};

export const getLocationAround = async (
  latitude: number,
  longitude: number,
  radius: number,
  category: string
) => {
  const response = await axiosClient.get("/location/around", {
    params: {
      lat: latitude,
      lon: longitude,
      radius,
      category
    }
  });
  return response.data;
};

export const getAutocompletePlace = async (
  text: string,
  latitude?: number,
  longitude?: number
) => {
  const response = await axiosClient.get("/location/autocomplete-place", {
    params: {
      text
    }
  });
  return response.data;
};

export const getStaticMap = async (latitude: number, longitude: number) => {
  try {
    const response = await axiosClient.get("/location/static-map", {
      params: {
        latitude,
        longitude
      }
    });
    return response.data.mapUrl; // Trả về URL bản đồ tĩnh
  } catch (error) {
    console.error("Lỗi khi gọi API Static Map:", error);
  }
};

// location_v2
export const getLocationV2 = async (category: string[], time: string) => {
  const response = await axiosClient.get("/location/location_v2", {
    params: { category: category, time: time }
  });
  return response;
};
