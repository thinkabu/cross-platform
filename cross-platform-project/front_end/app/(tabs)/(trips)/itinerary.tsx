import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { Fontisto, Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import { useLocalSearchParams, useSearchParams } from "expo-router/build/hooks";
import { getItinerary } from "@/lib/api/geminiAPI";
import MapView, { Marker, Polyline } from "react-native-maps";

export default function ItineraryScreen() {
    const [activeTab, setActiveTab] = useState("itinerary");
    const [activeDay, setActiveDay] = useState("day1");
    const [coorList, setCoorList] = useState<any[]>([]);
    const searchParams = useSearchParams();
    const place = searchParams.get("place");
    // const [locations, setLocations] = useState<any>({}); // Sửa lại object {} nè

    const params = useLocalSearchParams();
    let locationList = [];

    if (typeof params.locations === "string") {
        try {
            locationList = JSON.parse(params.locations);
        } catch (err) {
            console.error("Lỗi khi parse locations:", err);
        }
    }
    locationList.itineraryData[activeDay].map((location: any, index: number) => {

        console.log(location.location.name + location.location.coordinates.lon + "---" + location.location.coordinates.lat + "\n");

    })
    return (
        <ScrollView contentContainerStyle={{ padding: 10 }} className="p-4 mb-20">
            {/* Tiêu đề */}
            <Text className="text-2xl font-bold text-center">Lịch trình Việt Nam</Text>

            {/* Thông tin chung */}
            <View className="flex-row justify-between mt-4">
                <View className="flex-row items-center">
                    <Entypo name="location" size={20} color="blue" />
                    <Text className="ml-2">Đà Nẵng</Text>
                </View>
                <View className="flex-row items-center">
                    <Fontisto name="clock" size={20} color="blue" />
                    <Text className="ml-2">{params.time} ngày</Text>
                </View>
            </View>

            {/* Tabs */}
            <View className="flex-row justify-around mt-5">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className={`px-4 py-2 rounded-lg ${activeTab === "list" ? "bg-blue-500" : "bg-gray-300"
                        }`}
                >
                    <Text className={`${activeTab === "list" ? "text-white" : "text-black"}`}>

                        Danh sách
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setActiveTab("itinerary")}
                    className={`px-4 py-2 rounded-lg ${activeTab === "itinerary" ? "bg-blue-500" : "bg-gray-300"
                        }`}
                >
                    <Text className={`${activeTab === "itinerary" ? "text-white" : "text-black"}`}>
                        Lịch trình
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Ngày */}
            <View className="mt-5 flex-row justify-between">
                {Array.from({ length: Number(params.time) }, (_, index) => index + 1).map((day) => {
                    const dayKey = `day${day}`; // chuyển số -> string: day1, day2, day3
                    const widthPercentage = 100 / Number(params.time); // Tính toán chiều rộng mỗi thẻ
                    return (
                        <TouchableOpacity
                            key={dayKey}
                            onPress={() => setActiveDay(dayKey)}
                            style={{ width: `${widthPercentage}%` }} // Đặt chiều rộng động
                            className={`px-4 py-2 rounded-lg mr-2 ${activeDay === dayKey ? "bg-blue-500" : "bg-gray-300"}`}
                        >
                            <Text className={`text-center ${activeDay === dayKey ? "text-white" : "text-black"}`}>
                                Ngày {day}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Bản đồ */}
            <View className="h-52 bg-gray-200 mt-5 rounded-lg flex justify-center items-center">
                <MapView
                    style={{ width: "100%", height: "100%" }}
                    initialRegion={{
                        latitude: 16.047079,
                        longitude: 108.206230,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                >
                    {locationList.itineraryData[activeDay].map((location: any, index: number) => (
                        <Marker
                            key={index}
                            coordinate={{ latitude: location.location.coordinates.lat, longitude: location.location.coordinates.lon }}
                            title={location.location.name}
                        />
                    ))}
                    <Polyline
                        coordinates={locationList.itineraryData[activeDay].map((location: any) => ({
                            latitude: location.location.coordinates.lat,
                            longitude: location.location.coordinates.lon,
                        }))}
                        strokeColor="blue" // Đỏ cam
                        strokeWidth={4}
                    />
                </MapView>
            </View>

            {/* Danh sách địa điểm */}
            <View className="mt-5">
                {locationList.itineraryData[activeDay]?.length > 0 ? (
                    locationList.itineraryData[activeDay].map((location: any, index: number) => (
                        <View
                            key={index}
                            className="bg-white shadow-md p-4 my-2 rounded-lg flex-row items-center gap-x-2 gap-y-0"
                        >
                            <Image
                                className="w-24 h-24 rounded-md"
                                source={{ uri: `${location.location.image}` }}
                                resizeMode="cover"
                            />
                            <View className="ml-4 flex-1">
                                <Text className="text-lg font-bold text-gray-800">{location.location.name}</Text>
                                <Text className="text-sm text-gray-600 mt-1">Địa chỉ: {location.location.address}</Text>
                                <Text className="text-sm text-yellow-500 mt-1">Đánh giá: {location.location.rating} ★</Text>
                            </View>
                            <Text className="text-sm text-green-500">{location.time}</Text>
                        </View>
                    ))
                ) : (
                    <Text className="text-center text-gray-500">Không có địa điểm nào.</Text>
                )}
            </View>
        </ScrollView>
    );
}