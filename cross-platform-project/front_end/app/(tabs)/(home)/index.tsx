import { Link, router } from 'expo-router';
import { View, Text, Image, TextInput, ScrollView, TouchableOpacity, ImageBackground, Dimensions, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useRef, useEffect } from 'react';
import { Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserInfo } from '@/lib/api/userAPI';
import { User } from '@/lib/types/User';
import AddToFavorites from '@/components/AddToFavorites';


export default function HomeScreen() {
    const windowWidth = Dimensions.get('window').width;
    const bannerImages = [
        require("../../../assets/images/bana.jpg"),
        require("../../../assets/images/caurong.jpg"),
        require("../../../assets/images/cauvang.jpg"),
        require("../../../assets/images/bienmykhe.jpg"),
        require("../../../assets/images/hoguom.jpg")
    ];

    // State cho loading và tìm kiếm
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Cho banner lướt tự động
    const [activeIndex, setActiveIndex] = useState(0);
    const [autoplay, setAutoplay] = useState(true);
    const flatListRef = useRef<FlatList | null>(null);

    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;
        if (autoplay) {
            interval = setInterval(() => {
                if (flatListRef.current) {
                    const nextIndex = (activeIndex + 1) % bannerImages.length;
                    try {
                        flatListRef.current.scrollToIndex({
                            index: nextIndex,
                            animated: true
                        });
                        setActiveIndex(nextIndex);
                    } catch (error) {
                        console.log("Lỗi khi cuộn:", error);
                    }
                }
            }, 3000); // Lướt mỗi 3 giây
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [activeIndex, autoplay]);

    const handleScroll = (event: any) => {
        if (!event || !event.nativeEvent) return;

        // Dừng autoplay khi người dùng đang lướt
        setAutoplay(false);

        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const itemWidth = windowWidth - 32;
        const index = Math.round(contentOffsetX / itemWidth);
        if (index >= 0 && index < bannerImages.length) {
            setActiveIndex(index);
        }

        // Khởi động lại autoplay sau 5 giây
        setTimeout(() => {
            setAutoplay(true);
        }, 5000);
    };

    // Chỉ số dots
    const renderDots = () => {
        return bannerImages.map((_, index) => (
            <View
                key={index}
                className={`h-1.5 w-1.5 rounded-full mx-0.5 ${index === activeIndex ? 'bg-white' : 'bg-white/50'}`}
            />
        ));
    };

    // Dữ liệu các địa điểm tham quan
    const destinations = [
        {
            id: "1",
            name: "Cầu Rồng",
            image: "https://cdn-icons-png.flaticon.com/512/25/25231.png",
            address: "Đà Nẵng, Việt Nam",
            isLarge: true
        },
        {
            id: "2",
            name: "Bà Nà Hills",
            image: "https://cdn-icons-png.flaticon.com/512/25/25231.png",
            address: "Đà Nẵng, Việt Nam",
            isLarge: false
        },
        {
            id: "3",
            name: "Cầu Vàng",
            image: "https://cdn-icons-png.flaticon.com/512/25/25231.png",
            address: "Đà Nẵng, Việt Nam",
            isLarge: false
        }
    ];

    // Hàm xử lý đi đến trang chi tiết
    const navigateToDetail = (locationName: string) => {
        setIsLoading(true);
        router.push({
            pathname: '/(tabs)/(locations)/location_details',
            params: { name: locationName }
        });
        // Sử dụng setTimeout thay vì finally
        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    };

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) {
                    console.log("No token");
                    return router.replace("/welcome");
                }
                const user = await getUserInfo();
                setUser(user);
            } catch (err) {
                console.error("Lỗi khi lấy thông tin user:", err);
            }
        };

        fetchUser();
    }, []);

    const handleLogout = async () => {
        await AsyncStorage.removeItem("token");
        router.replace("/login");
    };

    return (
        <SafeAreaView className="flex-1 bg-blue-100 mb-10">
            <ScrollView className="flex-1">

                {/* Header với menu icon */}
                <View className="flex-row justify-between items-center p-4">
                    <View className="flex-row items-center">
                        <Text className="text-red-500 text-2xl font-bold mr-1">•</Text>
                        <Text className="text-blue-500 font-bold">Travel App</Text>
                    </View>
                </View>

                {/* Banner thông báo */}
                <View className="px-4 py-3">
                    <Text className="text-gray-600 text-xs text-center">Du lịch là cách tốt nhất để học hỏi và khám phá chính mình</Text>
                </View>

                {/* Ảnh banner chính */}
                <View className="px-4 relative">
                    <View className="rounded-xl overflow-hidden">
                        <FlatList
                            ref={flatListRef}
                            data={bannerImages}
                            renderItem={({ item, index }) => (
                                <View>
                                    <Image
                                        source={item}
                                        style={{
                                            width: windowWidth - 32,
                                            height: 180
                                        }}
                                        resizeMode="cover"
                                    />
                                </View>
                            )}
                            horizontal
                            pagingEnabled
                            decelerationRate="fast"
                            snapToInterval={windowWidth - 32}
                            snapToAlignment="start"
                            showsHorizontalScrollIndicator={false}
                            onScroll={handleScroll}
                            onMomentumScrollEnd={handleScroll}
                            keyExtractor={(_, index) => index.toString()}
                            getItemLayout={(_, index) => ({
                                length: windowWidth - 32,
                                offset: (windowWidth - 32) * index,
                                index,
                            })}
                            scrollEventThrottle={16}
                        />
                    </View>

                    {/* Dots indicator */}
                    <View className="absolute bottom-2 left-0 right-0 flex-row justify-center">
                        {renderDots()}
                    </View>
                </View>
                {/* Quy trình tạo lịch trình */}
                <View className="px-4 py-6 mx-4 my-4 bg-white rounded-2xl shadow-md">
                    <Text className="text-xl font-bold text-gray-800 mb-2">Quy trình tạo lịch trình</Text>
                    <Text className="text-xs text-gray-500 mb-6">Trải nghiệm du lịch thông minh với 4 bước đơn giản</Text>

                    {/* Timeline container */}
                    <View className="relative">
                        {/* Đường timeline */}
                        <View className="absolute left-3 top-3 bottom-3 w-0.5 bg-gradient-to-b from-blue-400 to-blue-600" />

                        {/* Bước 1 */}
                        <View className="flex-row mb-8">
                            <View className="relative">
                                <View className="w-7 h-7 rounded-full bg-blue-500 items-center justify-center shadow-sm">
                                    <Text className="text-white font-bold text-sm">1</Text>
                                </View>
                                <View className="absolute w-12 h-12 rounded-full border-2 border-blue-200 -top-2.5 -left-2.5 animate-pulse" />
                            </View>
                            <View className="flex-1 ml-4 bg-blue-50 rounded-xl p-3">
                                <Text className="text-blue-800 font-semibold mb-2">Tạo lịch trình cá nhân</Text>
                                <Text className="text-gray-600 text-xs leading-5 mb-2">
                                    Tùy chỉnh lịch trình theo sở thích và thời gian của bạn
                                </Text>
                                <Image
                                    source={require("../../../assets/images/hoian.jpg")}
                                    className="w-full h-24 rounded-lg"
                                    resizeMode="cover"
                                />
                            </View>
                        </View>

                        {/* Bước 2 */}
                        <View className="flex-row mb-8">
                            <View className="relative">
                                <View className="w-7 h-7 rounded-full bg-blue-500 items-center justify-center shadow-sm">
                                    <Text className="text-white font-bold text-sm">2</Text>
                                </View>
                                <View className="absolute w-12 h-12 rounded-full border-2 border-blue-200 -top-2.5 -left-2.5" />
                            </View>
                            <View className="flex-1 ml-4 bg-purple-50 rounded-xl p-3">
                                <Text className="text-purple-800 font-semibold mb-2">Gợi ý thông minh</Text>
                                <Text className="text-gray-600 text-xs leading-5 mb-2">
                                    AI đề xuất địa điểm phù hợp với sở thích của bạn
                                </Text>
                                <Image
                                    source={require("../../../assets/images/bana.jpg")}
                                    className="w-full h-24 rounded-lg"
                                    resizeMode="cover"
                                />
                            </View>
                        </View>

                        {/* Bước 3 */}
                        <View className="flex-row mb-8">
                            <View className="relative">
                                <View className="w-7 h-7 rounded-full bg-blue-500 items-center justify-center shadow-sm">
                                    <Text className="text-white font-bold text-sm">3</Text>
                                </View>
                                <View className="absolute w-12 h-12 rounded-full border-2 border-blue-200 -top-2.5 -left-2.5" />
                            </View>
                            <View className="flex-1 ml-4 bg-green-50 rounded-xl p-3">
                                <Text className="text-green-800 font-semibold mb-2">Tối ưu hóa lộ trình</Text>
                                <Text className="text-gray-600 text-xs leading-5 mb-2">
                                    Tự động sắp xếp lộ trình tiết kiệm thời gian nhất
                                </Text>
                                <Image
                                    source={require("../../../assets/images/cauvang.jpg")}
                                    className="w-full h-24 rounded-lg"
                                    resizeMode="cover"
                                />
                            </View>
                        </View>

                        {/* Bước 4 */}
                        <View className="flex-row">
                            <View className="relative">
                                <View className="w-7 h-7 rounded-full bg-blue-500 items-center justify-center shadow-sm">
                                    <Text className="text-white font-bold text-sm">4</Text>
                                </View>
                                <View className="absolute w-12 h-12 rounded-full border-2 border-blue-200 -top-2.5 -left-2.5" />
                            </View>
                            <View className="flex-1 ml-4 bg-orange-50 rounded-xl p-3">
                                <Text className="text-orange-800 font-semibold mb-2">Dẫn đường chi tiết</Text>
                                <Text className="text-gray-600 text-xs leading-5 mb-2">
                                    Chỉ dẫn đường đi và thông tin chi tiết cho từng điểm đến
                                </Text>
                                <Image
                                    source={require("../../../assets/images/bienmykhe.jpg")}
                                    className="w-full h-24 rounded-lg"
                                    resizeMode="cover"
                                />
                            </View>
                        </View>

                        {/* Nút Bắt đầu */}
                        <Pressable
                            className="mt-8 bg-blue-500 rounded-full py-4 px-6 items-center flex-row justify-center shadow-md"

                            onPress={() => router.push("/(tabs)/(trips)/trip")}
                            style={({ pressed }) => [
                                {
                                    transform: [{ scale: pressed ? 0.98 : 1 }],
                                    backgroundColor: pressed ? '#3b82f6' : '#2563eb'
                                }
                            ]}
                        >
                            <Ionicons name="add-circle-outline" size={20} color="white" />
                            <Text className="text-white font-semibold ml-2">Tạo lịch trình ngay</Text>
                        </Pressable>
                    </View>
                </View>

                {/* Địa điểm tham quan */}
                <View className="px-4 py-6">
                    <Text className="text-xl font-bold text-gray-800 mb-4">Địa điểm tham quan</Text>
                    <View className="flex-row flex-wrap justify-between">
                        {destinations.map((destination) => (
                            <Pressable
                                key={destination.id}
                                className={`mb-4 ${destination.isLarge ? 'w-full' : 'w-[48%]'}`}
                                onPress={() => navigateToDetail(destination.name)}
                            >
                                <View className="relative">
                                    <Image
                                        source={{ uri: destination.image }}
                                        className={`${destination.isLarge ? 'h-48' : 'h-32'} w-full rounded-xl`}
                                        resizeMode="cover"
                                    />
                                    <View className="absolute top-2 right-2">
                                        <AddToFavorites location={destination} />
                                    </View>
                                    <View className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent rounded-b-xl">
                                        <Text className="text-white font-bold text-lg">{destination.name}</Text>
                                        <Text className="text-white/80 text-sm">{destination.address}</Text>
                                    </View>
                                </View>
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* TÌM KIẾM ĐỊA ĐIỂM YÊU THÍCH */}
                <View className="mt-4 bg-blue-50 px-5 py-4">
                    <Text className="font-bold text-base text-gray-800 mb-2">TÌM KIẾM ĐỊA ĐIỂM YÊU THÍCH</Text>

                    <View className="flex-row">
                        {/* Ảnh bên trái */}
                        <View>
                            <Image
                                source={require("../../../assets/images/hoian.jpg")}
                                style={{ width: 110, height: 70, borderRadius: 6 }}
                                resizeMode="cover"
                            />
                        </View>

                        {/* Chữ và nút bên phải */}
                        <View className="flex-1 ml-3 justify-between">
                            <Text className="text-xs text-gray-600 leading-4 mb-2">
                                "Tìm kiếm nhanh chóng các địa điểm du lịch hấp dẫn, nhà hàng, quán ăn và nhiều hơn nữa"
                            </Text>

                            <View className="items-end">
                                <Pressable
                                    className="flex-row items-center"
                                    onPress={() => router.push('/(tabs)/(locations)/locations')}
                                    style={({ pressed }) => [
                                        { opacity: pressed ? 0.7 : 1 }
                                    ]}
                                >
                                    <Ionicons name="search-outline" size={18} color="#666" />
                                    <Text className="ml-1 text-gray-700 italic text-sm">Trải nghiệm ngay</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </View>

                {/* ĐỊA ĐIỂM XUNG QUANH */}
                <View className="mt-6 bg-blue-50 px-5 py-4">
                    <Text className="font-bold text-base text-gray-800 mb-2">ĐỊA ĐIỂM XUNG QUANH</Text>

                    <View className="flex-row">
                        {/* Chữ và nút bên trái */}
                        <View className="flex-1 justify-between">
                            <Text className="text-xs text-gray-700 italic leading-4 mb-6">
                                Khám phá địa điểm gần bạn ngay bây giờ?
                            </Text>

                            <View>
                                <Pressable
                                    className="flex-row items-center"
                                    onPress={() => router.push('/(tabs)/(locations)/locations')}
                                    style={({ pressed }) => [
                                        { opacity: pressed ? 0.7 : 1 }
                                    ]}
                                >
                                    <Ionicons name="search-outline" size={18} color="#666" />
                                    <Text className="ml-1 text-gray-700 italic text-sm">Trải nghiệm ngay</Text>
                                </Pressable>
                            </View>
                        </View>

                        {/* Ảnh bên phải */}
                        <View>
                            <Image
                                source={require("../../../assets/images/hoian.jpg")}
                                style={{ width: 140, height: 110, borderRadius: 6 }}
                                resizeMode="cover"
                            />
                        </View>
                    </View>
                </View>

                {/* GỢI Ý CHO BẠN */}
                <View className="mt-6 bg-green-50 px-5 py-4 rounded-xl mx-4">
                    <Text className="font-bold text-base text-gray-800 mb-2">GỢI Ý CHO BẠN</Text>
                    <Text className="text-xs text-gray-600 mb-3">Dựa trên lịch sử tìm kiếm của bạn</Text>

                    <Pressable
                        className="flex-row items-center bg-white p-3 rounded-lg mb-2"
                        onPress={() => navigateToDetail('Cầu Vàng')}
                        style={({ pressed }) => [
                            { opacity: pressed ? 0.9 : 1 }
                        ]}
                    >
                        <Image
                            source={require("../../../assets/images/cauvang.jpg")}
                            style={{ width: 60, height: 60, borderRadius: 8 }}
                        />
                        <View className="ml-3 flex-1">
                            <Text className="font-bold text-gray-800">Cầu Vàng</Text>
                            <Text className="text-xs text-gray-600">Đà Nẵng</Text>
                            <View className="flex-row mt-1">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <FontAwesome key={star} name="star" size={12} color="#FFD700" style={{ marginRight: 2 }} />
                                ))}
                            </View>
                        </View>
                        <FontAwesome name="chevron-right" size={16} color="#666" />
                    </Pressable>

                    <Pressable
                        className="flex-row items-center bg-white p-3 rounded-lg"
                        onPress={() => navigateToDetail('Hồ Gươm')}
                        style={({ pressed }) => [
                            { opacity: pressed ? 0.9 : 1 }
                        ]}
                    >
                        <Image
                            source={require("../../../assets/images/hoguom.jpg")}
                            style={{ width: 60, height: 60, borderRadius: 8 }}
                        />
                        <View className="ml-3 flex-1">
                            <Text className="font-bold text-gray-800">Hồ Gươm</Text>
                            <Text className="text-xs text-gray-600">Hà Nội</Text>
                            <View className="flex-row mt-1">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <FontAwesome key={star} name="star" size={12} color="#FFD700" style={{ marginRight: 2 }} />
                                ))}
                            </View>
                        </View>
                        <FontAwesome name="chevron-right" size={16} color="#666" />
                    </Pressable>
                </View>

                {/* Bottom spacing */}
                <View className="h-8" />
            </ScrollView>
        </SafeAreaView>
    );
}