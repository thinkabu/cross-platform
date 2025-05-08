import { useRouter } from "expo-router";
import { View, Text, Image, TouchableOpacity, ScrollView, TextInput, SafeAreaView, StatusBar, Pressable, RefreshControl, ActivityIndicator, Alert } from "react-native";
import { FontAwesome5, Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { useState, useCallback, useEffect, SetStateAction } from "react";
import * as Location from 'expo-location';
import axios from "axios";
import axiosClient from "@/lib/api/axiosClient";
import { getAddressFromCoords } from "@/lib/api/locationAPI";
import { getLocationAround } from "@/lib/api/locationAPI";
import { getLocationbyCategory, getLocationbySearch } from "@/lib/api/locationAPI2";
import AsyncStorage from '@react-native-async-storage/async-storage';


const categories = [
    // { name: "Tất cả", icon: "layers", apiValue: "" },
    { name: "Tham quan", icon: "location-outline", apiValue: "Địa điểm tham quan" },
    { name: "Ẩm thực", icon: "restaurant-outline", apiValue: "Ẩm thực" },
    { name: "Cafe", icon: "cafe-outline", apiValue: "Quán cafe" },
    { name: "Mua sắm", icon: "cart-outline", apiValue: "Mua sắm" },
    { name: "Ngoài trời", icon: "sunny-outline", apiValue: "Hoạt động ngoài trời" },
    { name: "Vui chơi giải trí", icon: "bed-outline", apiValue: "Khu vui chơi giải trí" },
];


export default function LocationsScreen() {
    const [submit, setSubmit] = useState(false);
    const [search, setSearch] = useState("");
    const [resultsSearch, setResultsSearch] = useState<any[]>([]);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [activeCategory, setActiveCategory] = useState("Địa điểm tham quan");
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [apiLocations, setApiLocations] = useState<any[]>([]);
    const [current_location, setLocation] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // const fetchLocations = async (latitude: number, longitude: number) => {
    //     setIsLoading(true);
    //     try {
    //         const radius = 20000; // Bán kính tìm kiếm (mét)
    //         const locations = await getLocationAround(latitude, longitude, radius, activeCategory);
    //         setApiLocations(locations); // Lưu kết quả vào state
    //     } catch (error) {
    //         console.error("Lỗi khi gọi API:", error);
    //         alert("Không thể tải dữ liệu từ server.");
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    const fetchLocations = async (category: string) => {
        setIsLoading(true);
        try {
            const locations = await getLocationbyCategory(category);
            setApiLocations(locations); // Lưu kết quả vào state
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
            alert("Không thể tải dữ liệu từ server.");
        } finally {
            setIsLoading(false);
        }
    }


    const fetchAutocompleteResults = async (text: string) => {
        console.log(text)
        setSearch(text);
        try {
            const results = await getLocationbySearch(text)
            setResultsSearch(results)
            console.log(" results:", results);
        } catch (error) {
            console.error("Lỗi khi gọi API autocomplete:", error);
        }
    }


    useEffect(() => {
        console.log(resultsSearch)
    }, [resultsSearch])

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        try {
            const savedFavorites = await AsyncStorage.getItem('favoriteLocations');
            if (savedFavorites) {
                const parsedFavorites = JSON.parse(savedFavorites);
                setFavorites(parsedFavorites.map((item: any) => item.name));
            }
        } catch (error) {
            console.error('Error loading favorites:', error);
        }
    };

    const handleFavorite = async (locationName: string) => {
        try {
            const savedFavorites = await AsyncStorage.getItem('favoriteLocations');
            let favorites = savedFavorites ? JSON.parse(savedFavorites) : [];

            if (favorites.some((item: any) => item.name === locationName)) {
                // Xóa khỏi danh sách yêu thích
                favorites = favorites.filter((item: any) => item.name !== locationName);
                setFavorites(prev => prev.filter(name => name !== locationName));
                Alert.alert('Thông báo', 'Đã xóa khỏi danh sách yêu thích');
            } else {
                // Thêm vào danh sách yêu thích
                const locationToAdd = apiLocations.find(loc => loc.name === locationName);
                if (locationToAdd) {
                    favorites.push(locationToAdd);
                    setFavorites(prev => [...prev, locationName]);
                    Alert.alert('Thông báo', 'Đã thêm vào danh sách yêu thích');
                }
            }

            await AsyncStorage.setItem('favoriteLocations', JSON.stringify(favorites));
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    // Hàm xử lý refresh
    const onRefresh = useCallback(() => {
        if (current_location) {
            setRefreshing(true);
            // fetchLocations(current_location.coords.latitude, current_location.coords.longitude).finally(() => {
            //     setRefreshing(false);
            // });
            fetchLocations(activeCategory).finally(() => {
                setRefreshing(false);
            });
        }
    }, [current_location, activeCategory]);

    // Lấy vị trí hiện tại
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                alert('Permission to access location was denied');
                setLoading(false);
                return;
            }

            let loc = await Location.getCurrentPositionAsync({});
            setLocation(loc);
            console.log("Latitude:", loc.coords.latitude, "Longitude:", loc.coords.longitude);

            try {
                // const addr = await getAddressFromCoords(loc.coords.latitude, loc.coords.longitude);

                fetchLocations(activeCategory); // Gọi API để lấy địa điểm xung quanh
            } catch (error) {
                console.error('Lỗi khi gọi API location:', error);
                alert('Không thể lấy địa chỉ từ server.');
            }

            setLoading(false);
        })();
    }, [activeCategory]);


    if (loading) return <ActivityIndicator />;

    return (
        <SafeAreaView className="flex-1 bg-white mb-10">
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

            {/* Header */}
            <View className="pt-12 pb-6 px-6 bg-white">
                <Text className="text-3xl font-bold text-gray-800">Khám phá</Text>
                <Text className="text-gray-500 text-lg">Tìm điểm đến du lịch tiếp theo của bạn</Text>
            </View>

            {/* Thanh tìm kiếm */}
            <View className="px-6 mb-2 relative">
                <View className="flex-row items-center bg-gray-100 px-4 py-3 rounded-full">
                    <Ionicons name="search" size={20} color="#6B7280" />
                    <TextInput
                        className="flex-1 ml-2 text-gray-800"
                        placeholder="Tìm kiếm địa điểm..."
                        placeholderTextColor="#9CA3AF"
                        value={search}
                        onChangeText={fetchAutocompleteResults}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                        onSubmitEditing={() => {
                            setActiveCategory('')
                            setSubmit(true)
                        }
                        }
                    />
                    {search.length > 0 && (
                        <TouchableOpacity onPress={() => setSearch("")}>
                            <Ionicons name="close-circle" size={20} color="#6B7280" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Lịch sử tìm kiếm */}
                {isSearchFocused && (
                    <View className="bg-white absolute top-16 left-0 right-0 z-10 mx-6 rounded-xl shadow-md">
                        <Text className="text-gray-500 text-xs p-3 border-b border-gray-100">Tìm kiếm gần đây</Text>
                        {resultsSearch.length > 0 && resultsSearch.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                className="flex-row items-center p-3 border-b border-gray-50"
                                onPress={() => setSearch(item.name)}
                            >
                                <Ionicons name="time-outline" size={16} color="#9CA3AF" />
                                <Text className="ml-2 text-gray-700">{item.name}</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity className="p-3 items-center">
                            <Text className="text-blue-500 font-medium">Xóa lịch sử tìm kiếm</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* Bộ lọc danh mục - SIÊU NHỎ GỌN */}
            <View className="flex-row justify-center mb-4">
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 24 }}
                >
                    {categories.map((category, index) => (
                        <TouchableOpacity
                            key={index}
                            className={`mx-2 items-center`}
                            onPress={() => {
                                setSearch(""); // Xóa ô tìm kiếm
                                setResultsSearch([]); // Xóa kết quả tìm kiếm gần đây
                                setSubmit(false); // ← Chuyển về chế độ category
                                setActiveCategory(category.apiValue);
                            }}
                        >
                            <View
                                className={`w-10 h-10 rounded-full items-center justify-center ${activeCategory === category.apiValue ? 'bg-blue-500' : 'bg-gray-100'
                                    }`}
                            >
                                <Ionicons
                                    name={category.icon as any}
                                    size={18}
                                    color={activeCategory === category.apiValue ? "white" : "#6B7280"}
                                />
                            </View>
                            <Text
                                className={`text-xs mt-1 ${activeCategory === category.apiValue ? 'text-blue-600 font-medium' : 'text-gray-500'
                                    }`}
                            >
                                {category.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={["#3B82F6"]}
                    />
                }
            >
                {/* Banner quảng cáo */}
                {search.length === 0 && activeCategory === "Tất cả" && (
                    <View className="mx-6 mb-8">
                        <View className="rounded-3xl overflow-hidden relative">
                            <Image
                                source={require("../../../assets/images/danang.jpg")}
                                className="w-full h-48"
                                resizeMode="cover"
                            />
                            <View className="absolute inset-0 bg-black opacity-30 rounded-3xl" />
                            <View className="absolute bottom-6 left-6 right-6">
                                <Text className="text-white text-2xl font-bold mb-1">Khám phá Việt Nam</Text>
                                <Text className="text-white opacity-90">Những điểm đến nổi tiếng và hấp dẫn</Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* Danh sách địa điểm */}
                <View className="px-6 pb-6">
                    <Text className="text-xl font-bold text-gray-800 mb-4">
                        {search.length > 0 ? "Kết quả tìm kiếm" : "Địa điểm phổ biến"}
                    </Text>
                    {isLoading ? (
                        <View className="py-10 items-center">
                            <ActivityIndicator size="large" color="#3B82F6" />
                            <Text className="mt-4 text-gray-500">Đang tải dữ liệu...</Text>
                        </View>
                    ) : apiLocations.length > 0 && !submit ? (
                        apiLocations.map((location, index) => (
                            <Pressable
                                key={index}
                                style={({ pressed }) => [
                                    { opacity: pressed ? 0.9 : 1 },
                                    { transform: [{ scale: pressed ? 0.98 : 1 }] }
                                ]}
                                android_ripple={{ color: '#E5E7EB' }}
                                onPress={() => router.push({
                                    pathname: "/location_details",
                                    params: {
                                        current_latitude: current_location?.coords?.latitude, // Tọa độ hiện tại
                                        current_longitude: current_location?.coords?.longitude, // Tọa độ hiện tại
                                        name: location.name,
                                        image: location.image,
                                        location_latitude: location.latitude,
                                        location_longitude: location.longitude,
                                        address: location.address,
                                        condition: location.weather.condition,
                                        temperature_c: location.weather.temperature_c,
                                        icon: location.weather.icon,
                                        rating: location.rating,
                                        open_time: location.open_time,
                                        close_time: location.close_time,
                                        description: location.description,
                                    }
                                })}
                                className="bg-white mb-4 rounded-2xl overflow-hidden shadow-sm border border-gray-100"
                            >
                                {/* Badge cho địa điểm mới */}
                                {location.isNew && (
                                    <View className="absolute top-2 left-2 z-10 bg-red-500 px-2 py-1 rounded-lg">
                                        <Text className="text-white text-xs font-bold">Mới</Text>
                                    </View>
                                )}

                                {/* Nút yêu thích */}
                                <TouchableOpacity
                                    className="absolute top-2 right-2 z-10 bg-white/80 p-2 rounded-full shadow-sm"
                                    onPress={() => handleFavorite(location.name)}
                                >
                                    <Ionicons
                                        name={favorites.includes(location.name) ? "heart" : "heart-outline"}
                                        size={20}
                                        color={favorites.includes(location.name) ? "#EF4444" : "#9CA3AF"}
                                    />
                                </TouchableOpacity>

                                <Image
                                    source={location.image
                                        ? { uri: location.image }
                                        : require("../../../assets/images/bana.jpg")
                                    }

                                    className="w-full h-40"
                                    resizeMode="cover"
                                />
                                <View className="p-4">
                                    <View className="flex-row justify-between items-center">
                                        <Text className="text-lg font-bold text-gray-800">{location.name}</Text>
                                        <View className="flex-row items-center bg-yellow-50 px-2 py-1 rounded-lg">
                                            <Ionicons name="star" size={14} color="#F59E0B" />
                                            <Text className="text-yellow-600 font-medium text-xs ml-1">
                                                {location.rating}
                                            </Text>
                                        </View>
                                    </View>

                                    <View className="flex-row items-center mt-1">
                                        <Feather name="map-pin" size={14} color="#3B82F6" />
                                        <Text className="text-blue-500 text-xs ml-1">Việt Nam</Text>
                                        <View className="bg-gray-200 h-1 w-1 rounded-full mx-2" />
                                        <Text className="text-gray-500 text-xs">
                                            {categories.find(c => c.apiValue === activeCategory)?.name || 'Danh mục không xác định'}
                                        </Text>
                                    </View>

                                    <Text className="text-gray-600 mt-1">
                                        {categories.find(c => c.apiValue === activeCategory)?.name || 'Danh mục không xác định'}
                                    </Text>

                                    <View className="flex-row justify-between items-center mt-3">
                                        <View className="flex-row items-center">
                                            <Image
                                                source={{ uri: `https:${location.weather.icon}` }}
                                                style={{ width: 24, height: 24 }}
                                                resizeMode="contain"
                                            />
                                            <Text className="text-gray-500 text-xs ml-1">{location.weather.condition}</Text>
                                        </View>
                                        <View className="flex-row items-center">
                                            <Text className="text-blue-600 text-sm font-medium">Xem chi tiết</Text>
                                        </View>
                                    </View>
                                </View>
                            </Pressable>
                        ))
                    ) : (
                        resultsSearch.map((location, index) => (
                            <Pressable
                                key={index}
                                style={({ pressed }) => [
                                    { opacity: pressed ? 0.9 : 1 },
                                    { transform: [{ scale: pressed ? 0.98 : 1 }] }
                                ]}
                                android_ripple={{ color: '#E5E7EB' }}
                                onPress={() => router.push({
                                    pathname: "/location_details",
                                    params: {
                                        current_latitude: current_location?.coords?.latitude, // Tọa độ hiện tại
                                        current_longitude: current_location?.coords?.longitude, // Tọa độ hiện tại
                                        name: location.name,
                                        image: location.image,
                                        location_latitude: location.latitude,
                                        location_longitude: location.longitude,
                                        address: location.address,
                                        condition: location.weather.condition,
                                        temperature_c: location.weather.temperature_c,
                                        icon: location.weather.icon,
                                        rating: location.rating,
                                        open_time: location.open_time,
                                        close_time: location.close_time,
                                        description: location.description,
                                    }
                                })}
                                className="bg-white mb-4 rounded-2xl overflow-hidden shadow-sm border border-gray-100"
                            >
                                {/* Badge cho địa điểm mới */}
                                {location.isNew && (
                                    <View className="absolute top-2 left-2 z-10 bg-red-500 px-2 py-1 rounded-lg">
                                        <Text className="text-white text-xs font-bold">Mới</Text>
                                    </View>
                                )}

                                {/* Nút yêu thích */}
                                <TouchableOpacity
                                    className="absolute top-2 right-2 z-10 bg-white/80 p-2 rounded-full shadow-sm"
                                    onPress={() => handleFavorite(location.name)}
                                >
                                    <Ionicons
                                        name={favorites.includes(location.name) ? "heart" : "heart-outline"}
                                        size={20}
                                        color={favorites.includes(location.name) ? "#EF4444" : "#9CA3AF"}
                                    />
                                </TouchableOpacity>

                                <Image
                                    source={location.image
                                        ? { uri: location.image }
                                        : require("../../../assets/images/bana.jpg")
                                    }

                                    className="w-full h-40"
                                    resizeMode="cover"
                                />
                                <View className="p-4">
                                    <View className="flex-row justify-between items-center">
                                        <Text className="text-lg font-bold text-gray-800">{location.name}</Text>
                                        <View className="flex-row items-center bg-yellow-50 px-2 py-1 rounded-lg">
                                            <Ionicons name="star" size={14} color="#F59E0B" />
                                            <Text className="text-yellow-600 font-medium text-xs ml-1">
                                                {location.rating}
                                            </Text>
                                        </View>
                                    </View>

                                    <View className="flex-row items-center mt-1">
                                        <Feather name="map-pin" size={14} color="#3B82F6" />
                                        <Text className="text-blue-500 text-xs ml-1">Việt Nam</Text>
                                        <View className="bg-gray-200 h-1 w-1 rounded-full mx-2" />
                                        <Text className="text-gray-500 text-xs">
                                            {categories.find(c => c.apiValue === activeCategory)?.name || 'Danh mục không xác định'}
                                        </Text>
                                    </View>

                                    <Text className="text-gray-600 mt-1">
                                        {categories.find(c => c.apiValue === activeCategory)?.name || 'Danh mục không xác định'}
                                    </Text>

                                    <View className="flex-row justify-between items-center mt-3">
                                        <View className="flex-row items-center">
                                            <Image
                                                source={{ uri: `https:${location.weather.icon}` }}
                                                style={{ width: 24, height: 24 }}
                                                resizeMode="contain"
                                            />
                                            <Text className="text-gray-500 text-xs ml-1">{location.weather.condition}</Text>
                                        </View>
                                        <View className="flex-row items-center">
                                            <Text className="text-blue-600 text-sm font-medium">Xem chi tiết</Text>
                                        </View>
                                    </View>
                                </View>
                            </Pressable>
                        ))
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}