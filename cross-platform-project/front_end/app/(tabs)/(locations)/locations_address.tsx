import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, Image, ScrollView, TouchableOpacity, Dimensions, FlatList } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRef, useState, useEffect } from "react";


export default function LocationDetails() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);
    const screenWidth = Dimensions.get('window').width;
    const {
        name,
        image,
        address,
        condition,
        temperature_c,
        icon,z
    } = params;


    // Tự động lướt ảnh

    // Xử lý khi ảnh được lướt
    const handleScroll = (event: any) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollPosition / screenWidth);
        if (index !== activeIndex) {
            setActiveIndex(index);
        }
    };

    return (
        <ScrollView className="flex-1 bg-gray-50 mb-10">
            {/* Header với ảnh banner trượt */}
            <View className="relative h-72">
                <FlatList
                    ref={flatListRef}
                    data={image}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    renderItem={({ item }) => (
                        <Image
                            source={item}
                            style={{ width: screenWidth, height: 288 }}
                            resizeMode="cover"
                        />
                    )}
                    keyExtractor={(_, index) => index.toString()}
                />

                <View className="absolute w-full h-full bg-black/30" />

                {/* Nút back và tên thành phố */}
                <View className="absolute w-full p-4 mt-8">
                    <TouchableOpacity
                        className="bg-white/80 p-2 rounded-full w-10 h-10 items-center justify-center mb-4"
                        onPress={() => router.back()}
                    >
                        <FontAwesome5 name="arrow-left" size={20} color="black" />
                    </TouchableOpacity>

                    <Text className="text-white text-4xl font-bold shadow-lg">
                        {name || "Không có dữ liệu"}
                    </Text>
                </View>

                {/* Chỉ báo ảnh */}
                <View className="absolute bottom-4 w-full flex-row justify-center">
                    {/* {data.images.map((_, index) => (
                        <View
                            key={index}
                            className={`h-2 mx-1 rounded-full ${index === activeIndex ? 'w-8 bg-white' : 'w-2 bg-white/50'
                                }`}
                        />
                    ))} */}
                </View>
            </View>

            {/* Thông tin chính */}
            <View className="bg-white -mt-6 rounded-t-3xl p-6">
                {/* Thời tiết và thời gian di chuyển */}
                <View className="flex-row justify-between mb-6">
                    <View className="bg-blue-50 p-4 rounded-2xl flex-1 mr-2">
                        <View className="flex-row items-center mb-2">
                            <Image
                                source={{ uri: `https:${icon}` }}
                                style={{ width: 30, height: 30 }}
                                resizeMode="contain"
                            />
                            <Text className="ml-2 text-blue-600 font-semibold">Thời tiết</Text>
                        </View>
                        <Text className="text-2xl font-bold text-gray-800">{temperature_c}°C</Text>
                    </View>

                    <View className="bg-green-50 p-4 rounded-2xl flex-1 ml-2">
                        <View className="flex-row items-center mb-2">
                            <FontAwesome5 name="car" size={20} color="#10B981" />
                            <Text className="ml-2 text-green-600 font-semibold">Thời gian</Text>
                        </View>
                        <Text className="text-2xl font-bold text-gray-800">test</Text>
                    </View>
                </View>

                {/* Bản đồ */}
                <View className="mb-6">
                    <Text className="text-xl font-bold mb-3 text-gray-800">Bản đồ khu vực</Text>
                    <View className="rounded-2xl overflow-hidden shadow-lg">
                        <Image
                            className="w-full h-48"
                            resizeMode="cover"
                        />
                    </View>
                </View>

                {/* Tổng quan */}
                <View className="bg-gray-50 p-4 rounded-2xl mb-6">
                    <Text className="text-xl font-bold mb-2 text-gray-800">Tổng quan</Text>
                    <Text className="text-gray-600 leading-6">Mo ta</Text>
                </View>

                {/* Địa điểm nổi bật */}
                <View>
                    <Text className="text-xl font-bold mb-4 text-gray-800">Địa điểm nổi bật</Text>
                    {/* {data.highlights.map((highlight, index) => (
                        <TouchableOpacity
                            key={index}
                            className="flex-row items-center bg-white mb-3 rounded-2xl overflow-hidden shadow-md"
                            onPress={() => router.push({
                                pathname: "/location_details",
                                params: { name: highlight.name }
                            })}
                        >
                            <Image
                                source={highlight.image}
                                className="w-24 h-24"
                                resizeMode="cover"
                            />
                            <View className="flex-1 p-4">
                                <Text className="text-lg font-semibold text-gray-800">
                                    {highlight.name}
                                </Text>
                                <View className="flex-row items-center mt-2">
                                    <FontAwesome5
                                        name="arrow-right"
                                        size={14}
                                        color="#6B7280"
                                    />
                                    <Text className="text-gray-500 ml-2">
                                        Xem chi tiết
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))} */}
                </View>
            </View>
        </ScrollView>
    );
}