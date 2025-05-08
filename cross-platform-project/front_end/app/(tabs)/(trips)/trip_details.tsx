import { AntDesign, Entypo, Fontisto } from "@expo/vector-icons";
import { ActivityIndicator, Alert, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import MapView, { Marker } from "react-native-maps";
import { useRouter, useLocalSearchParams } from "expo-router";
import Attraction from "@/components/trips/Attraction";
import { useEffect, useState } from "react";
import { createItinerary, getLocations, testLocations } from "@/lib/api/geminiAPI";
import { useSearchParams } from "expo-router/build/hooks";
import { getUserInfo } from "@/lib/api/userAPI";
import { Location } from "@/lib/types/Location";

export default function TripDetailsScreen() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const [locations, setLocations] = useState<any[]>([]);
    const [breakfasts, setBreakfasts] = useState<any[]>([]);
    const [dinners, setDinners] = useState<any[]>([]);
    const [showAll, setShowAll] = useState(false);
    const [activeTab, setActiveTab] = useState("list");
    const [userId, setUserId] = useState<string | null>(null);
    const [itiId, setItiId] = useState<string | null>(null);

    // params
    const params = useLocalSearchParams();
    const time = params.time;

    useEffect(() => {
        if (typeof params.locations === "string") {
            try {
                const parsed = JSON.parse(params.locations);
                setLocations(parsed);
            } catch (err) {
                console.error("Lỗi khi parse locations:", err);
            }
        }
        if (typeof params.breakfasts === "string") {
            try {
                const parsed = JSON.parse(params.breakfasts);
                setBreakfasts(parsed);
            } catch (err) {
                console.error("Lỗi khi parse breakfasts:", err);
            }
        }

        if (typeof params.dinners === "string") {
            try {
                const parsed = JSON.parse(params.dinners);
                setDinners(parsed);
            } catch (err) {
                console.error("Lỗi khi parse dinners:", err);
            }
        }
    }, [params.locations, params.breakfasts, params.dinners]);

    // Lấy thông tin người dùng
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userInfo = await getUserInfo(); // Gọi API để lấy thông tin người dùng
                setUserId(userInfo._id); // Lưu userId vào state
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };

        fetchUserInfo();
    }, []);



    // Hàm lên lịch trình
    // const handleCreateItinerary = async () => {
    //     try {
    //         if (!batchId) {
    //             Alert.alert("Lỗi", "Không tìm thấy batchId.");
    //             return;
    //         }

    //         if (!userId) {
    //             Alert.alert("Lỗi", "Không tìm thấy userId.");
    //             return;
    //         }

    //         if (!travelTime) {
    //             Alert.alert("Lỗi", "Không tìm thấy thời gian du lịch.");
    //             return;
    //         }

    //         setIsLoading(true);

    //         const response = await createItinerary({ userId, travelTime, batchId });
    //         const iti_id = response.itineraryId.toString();
    //         setItiId(iti_id);
    //         Alert.alert("Thành công", "Lịch trình đã được tạo thành công!");

    //         router.push(`/(tabs)/(trips)/itinerary?batchId=${batchId}&travelTime=${travelTime}&place=${place}&itineraryId=${iti_id}`);
    //     } catch (error) {
    //         console.error("Error creating itinerary:", error);
    //         Alert.alert("Lỗi", "Đã xảy ra lỗi khi tạo lịch trình.");
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    const handleNavigateToItinerary = () => {
        if (!itiId) {
            Alert.alert("Thông báo", "Bạn chưa tạo lịch trình. Vui lòng tạo lịch trình trước khi xem.");
            return;
        }

        // Điều hướng đến màn hình itinerary nếu đã có itiId
        router.push({
            pathname: `/(tabs)/(trips)/itinerary`,
            params: {
                iti_id: itiId,
                time: time,
            }
        })
    };

    const handleCreateItinerary = async () => {
        try {
            if (!userId) {
                Alert.alert("Lỗi", "Không tìm thấy userId.");
                return;
            }

            if (!params.time) {
                Alert.alert("Lỗi", "Không tìm thấy thời gian du lịch.");
                return;
            }

            setIsLoading(true);
            const travelTime = Array.isArray(time) ? time[0] : time;
            const minimalLocations = locations.map(loc => ({
                _id: loc._id,
                name: loc.name,
                image: loc.image,
                open_time: loc.open_time,
                longitude: loc.longitude,
                latitude: loc.latitude,
                address: loc.address

            }));
            const minimalBreakfasts = breakfasts.map(loc => ({
                _id: loc._id,
                name: loc.name,
                image: loc.image,
                open_time: loc.open_time,
                longitude: loc.longitude,
                latitude: loc.latitude,
                address: loc.address

            }));
            const minimalDinners = dinners.map(loc => ({
                _id: loc._id,
                name: loc.name,
                image: loc.image,
                open_time: loc.open_time,
                longitude: loc.longitude,
                latitude: loc.latitude,
                address: loc.address

            }));

            const mergedList = [...minimalBreakfasts, ...minimalLocations, ...minimalDinners];
            const response = await createItinerary({
                userId, travelTime, locations: mergedList
            });
            const iti_id = response.itineraryId.toString();
            setItiId(iti_id);
            Alert.alert("Thành công", "Lịch trình đã được tạo thành công!");
            router.push({
                pathname: `/(tabs)/(trips)/itinerary`,
                params: {
                    iti_id: iti_id,
                    time: time,
                    locations: JSON.stringify(response.itinerary, null, 2),
                }
            })
        } catch (error) {
            console.error("Error creating itinerary:", error);
            Alert.alert("Lỗi", "Đã xảy ra lỗi khi tạo lịch trình.");
        } finally {
            setIsLoading(false);
        }
    };

    // const handleNavigateToItinerary = () => {
    //     if (!itiId) {
    //         Alert.alert("Thông báo", "Bạn chưa tạo lịch trình. Vui lòng tạo lịch trình trước khi xem.");
    //         return;
    //     }

    //     // Điều hướng đến màn hình itinerary nếu đã có itiId
    //     router.push(`/(tabs)/(trips)/itinerary?batchId=${batchId}&travelTime=${travelTime}&place=${place}&itineraryId=${itiId}`);
    // };

    return (
        <SafeAreaProvider className="">
            <SafeAreaView>
                <ScrollView contentContainerStyle={{ alignItems: "center", padding: 10, backgroundColor: "#f9f9f9", paddingBottom: 100 }}>
                    {/* Tiêu đề */}
                    <Text className="text-3xl font-bold text-center text-blue-600 mt-5 ">Lịch trình chi tiết</Text>

                    {/* Tên địa điểm - thời gian */}
                    <View className="flex flex-row justify-between items-center w-full mt-5 px-4">
                        <View className="flex-row items-center gap-2">
                            <Entypo name="location" size={20} color="blue" />
                            <Text className="text-lg font-medium text-gray-700">Đà Nẵng</Text>
                        </View>

                        <View className="flex-row items-center gap-2">
                            <Fontisto name="clock" size={20} color="blue" />
                            <Text className="text-lg font-medium text-gray-700">{params.time} ngày</Text>
                        </View>
                    </View>

                    {/* Danh sách - Lịch trình */}
                    <View className="flex flex-row justify-around w-full mt-5 px-4">
                        {/* Nút Danh sách */}
                        <TouchableOpacity
                            onPress={() => setActiveTab("list")} // Đặt tab hiện tại là "list"
                            className={`px-6 py-3 rounded-full shadow-md ${activeTab === "list" ? "bg-blue-500" : "bg-gray-300"
                                }`}
                        >
                            <Text className={`text-sm font-semibold ${activeTab === "list" ? "text-white" : "text-black"}`}>
                                Danh sách
                            </Text>
                        </TouchableOpacity>

                        {/* Nút Lịch trình */}
                        <TouchableOpacity
                            onPress={() => setActiveTab("itinerary")} // Đặt tab hiện tại là "itinerary"
                            className={`px-6 py-3 rounded-full shadow-md ${activeTab === "itinerary" ? "bg-blue-500" : "bg-gray-300"
                                }`}
                        >
                            <Text className={`text-sm font-semibold ${activeTab === "itinerary" ? "text-white" : "text-black"}`}>
                                Lịch trình
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Các điểm tham quan */}
                    <View className="bg-white rounded-lg mt-5 p-4 shadow-md w-full">
                        <View className="flex-row justify-between items-center">
                            <Text className="text-lg font-semibold">Các điểm tham quan ({locations.length})</Text>
                            <TouchableOpacity onPress={() => setShowAll(!showAll)}>
                                <AntDesign name={showAll ? "caretup" : "caretdown"} size={20} color={"black"} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView className="mt-3" showsVerticalScrollIndicator={false}>
                            {/* Điểm tham quan */}
                            <Text className="text-base font-medium mb-2">Điểm tham quan</Text>
                            {(showAll ? locations : locations.slice(0, 2)).map((item: Location) => (
                                <Attraction
                                    key={item._id}
                                    name={item.name}
                                    description={item.description}
                                    rating={item.rating}
                                    image={item.image}
                                    open_time={item.open_time}
                                    onPress={() => { }}
                                />
                            ))}

                            {/* Ẩm thực */}
                            <Text className="text-base font-medium mt-4 mb-2">Ẩm thực</Text>
                            {[...breakfasts, ...dinners].map((item: Location) => (
                                <Attraction
                                    key={item._id}
                                    name={item.name}
                                    description={item.description}
                                    rating={item.rating}
                                    image={item.image}
                                    open_time={item.open_time}
                                    onPress={() => { }}
                                />
                            ))}

                            {/* Thêm địa điểm */}
                            <TouchableOpacity
                                className="justify-center mt-5 bg-green-500 py-3 px-5 rounded-full shadow-lg"
                                onPress={() => Alert.alert("Thêm địa điểm", "Chức năng đang được phát triển.")}
                            >
                                <Text className="text-center text-white font-medium">Thêm địa điểm</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>

                    {/* Lên lịch trình chi tiết */}
                    <TouchableOpacity
                        className={`mt-5 rounded-full px-6 py-3 shadow-lg ${isLoading ? "bg-gray-400" : "bg-blue-500"}`}
                        onPress={handleCreateItinerary}
                        disabled={isLoading} // Vô hiệu hóa nút khi đang loading
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {isLoading ? (
                            <ActivityIndicator size="small" color="#ffffff" /> // Hiển thị spinner khi đang tải
                        ) : (
                            <>
                                <AntDesign name="calendar" size={20} color="#ffffff" style={{ marginRight: 8 }} />
                                <Text className="text-lg font-semibold text-white">Lên lịch trình chi tiết</Text>
                            </>
                        )}
                    </TouchableOpacity>

                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
