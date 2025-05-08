import HobbyButton from "@/components/trips/HobbyButton";
import { createLocation } from "@/lib/api/geminiAPI";
import { getInterests } from "@/lib/api/interestAPI";
import { getLocationV2 } from "@/lib/api/locationAPI";
import { Entypo, Fontisto } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function TripScreen() {
    const [location, setLocation] = useState('Đà Nẵng');
    const [time, setTime] = useState('');
    const timeNumber = parseInt(time) || 0;
    const [count, setCount] = useState(timeNumber);
    const [travelType, setTravelType] = useState<string[]>([]);
    const [interests, setInterests] = useState<{ name: string; description: string }[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchInterests = async () => {
            try {
                const data = await getInterests();
                setInterests(data);
            } catch (error) {
                console.error("Error fetching interests:", error);
            }
        };
        fetchInterests();
    }, []);

    const toggleTravelType = (type: string) => {
        setTravelType((prev) =>
            prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type]
        );
    };

    const createLocationList = async () => {
        if (!location || !time || travelType.length === 0) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        setLoading(true);
        try {
            const data = {
                place: location,
                travelTime: parseInt(time),
                travelType: travelType,
            };
            const respone = await createLocation(data);
            const batchId = respone.batchId;
            const travelTime = respone.travelTime;
            const place = respone.place;
            alert("Tạo lịch trình thành công!");
            router.push(`/trip_details?batchId=${batchId}&travelTime=${travelTime}&place=${place}`);
        } catch (error) {
            console.error("Error creating trip:", error);
            alert("Đã xảy ra lỗi khi tạo lịch trình!");
        } finally {
            setLoading(false);
        }
    };

    const getLocationListByHobby = async () => {
        if (!location || !time || travelType.length === 0) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        try {
            const response = await getLocationV2(travelType, time);
            router.push({
                pathname: "/trip_details",
                params: {
                    locations: JSON.stringify(response.data.locations),
                    breakfasts: JSON.stringify(response.data.breakfasts),
                    dinners: JSON.stringify(response.data.dinners),
                    time: time,
                }
            });
            return response;
        } catch (error) {
            console.error("Error fetching location list by hobby:", error);
            return [];
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1 bg-white  mb-14">
                <ScrollView contentContainerStyle={{ padding: 20 }}>
                    <Text className="text-4xl font-bold text-center text-blue-600 mb-8">Tạo Lịch Trình</Text>

                    <View className="mb-6">
                        <View className="relative">
                            <TextInput
                                placeholder="Bạn muốn đi đâu?"
                                value={location}
                                onChangeText={setLocation}
                                className="border border-gray-300 rounded-lg px-4 py-3 text-lg pl-12 shadow-sm"
                            />
                            <Entypo name="location-pin" size={24} color="blue" style={{ position: "absolute", top: 12, left: 10 }} />
                        </View>
                    </View>

                    <View className="mb-6">
                        <View className="relative">
                            <TextInput
                                placeholder="Bạn đi trong bao lâu?"
                                value={time}
                                onChangeText={(text) => {
                                    setTime(text);
                                    const num = parseInt(text) || 0;
                                    setCount(num);
                                }}
                                keyboardType="numeric"
                                className="border border-gray-300 rounded-lg px-4 py-3 text-lg pl-12 shadow-sm"
                            />
                            <Fontisto name="clock" size={24} color="blue" style={{ position: "absolute", top: 12, left: 10 }} />
                        </View>
                    </View>

                    <View className="mb-6 bg-gray-100 rounded-lg p-5 shadow-sm">
                        <Text className="text-center text-gray-600 mb-4">Thời gian</Text>
                        <View className="flex flex-row justify-between items-center">
                            <TouchableOpacity
                                onPress={() => {
                                    setCount(prev => {
                                        const newCount = Math.max(prev - 1, 0);
                                        setTime(newCount.toString());
                                        return newCount;
                                    });
                                }}
                                className="bg-gray-300 px-4 py-2 rounded-md"
                            >
                                <Text className="text-lg">-</Text>
                            </TouchableOpacity>
                            <Text className="text-2xl font-bold">{count} Ngày</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    setCount(prev => {
                                        const newCount = prev + 1;
                                        setTime(newCount.toString());
                                        return newCount;
                                    });
                                }}
                                className="bg-gray-300 px-4 py-2 rounded-md"
                            >
                                <Text className="text-lg">+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className="mb-6">
                        <Text className="text-2xl font-semibold mb-4">Sở thích du lịch</Text>
                        <View className="flex flex-wrap flex-row gap-3">
                            {interests.map((interest) => (
                                <HobbyButton
                                    key={interest.name}
                                    title={interest.description}
                                    onPress={() => toggleTravelType(interest.description)}
                                    className={`px-4 py-2 rounded-lg ${travelType.includes(interest.description) ? "bg-blue-500 text-white" : "bg-gray-300 text-black"}`}
                                />
                            ))}
                        </View>
                    </View>

                    <TouchableOpacity
                        className={`bg-blue-500 px-6 py-4 rounded-lg ${loading ? "opacity-50" : ""}`}
                        onPress={getLocationListByHobby}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#ffffff" />
                        ) : (
                            <Text className="text-xl text-white text-center">Tạo danh sách địa điểm</Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
