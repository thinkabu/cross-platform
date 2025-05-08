import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, Image, ScrollView, TouchableOpacity, Share, Linking, Dimensions, FlatList, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { FontAwesome5, MaterialIcons, Entypo, FontAwesome } from "@expo/vector-icons";
import { useState, useRef, useEffect } from "react";
import { getStaticMap } from "@/lib/api/locationAPI";
import { getDirection } from "@/lib/api/direction";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
export default function LocationDetailsScreen() {
    const params = useLocalSearchParams();
    const {
        current_latitude,
        current_longitude,
        name,
        image,
        location_latitude,
        location_longitude,
        address,
        condition,
        temperature_c,
        icon,
        open_time,
        close_time,
        rating,
        description,
    } = params;
    const [mapUrl, setMapUrl] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (location_latitude && location_longitude) {
            getStaticMap(Number(location_latitude), Number(location_longitude))
                .then((url) => {
                    setMapUrl(url);
                })
                .catch((error) => {
                    console.error("Không lấy được bản đồ tĩnh:", error);
                });
        }
    }, [location_latitude, location_longitude]);
    // const handleShare = async () => {
    //     try {
    //         await Share.share({
    //             message: `Khám phá ${locationName}\n🏠 Địa chỉ: ${data.address}\n🌤️ Thời tiết: ${data.weather}\n⭐ Đánh giá: ${data.rating}\n🌐 Website: ${data.website}`,
    //             url: data.website, // iOS only
    //             title: `Chia sẻ thông tin về ${locationName}`,
    //         });
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    // const handleOpenWebsite = () => {
    //     if (data.website) {
    //         Linking.openURL(data.website);
    //     }
    // };

    return (
        <ScrollView className="flex-1 bg-white mb-10">
            {/* Header với ảnh nền - đã sửa để hiển thị full màn hình */}
            <View className="relative ">
                <Image source={image
                    ? { uri: image }
                    : require("../../../assets/images/bana.jpg")
                }
                    style={{height:windowHeight /4}}
                    className="w-full h-40"
                    resizeMode="cover">

                </Image>

                {/* Nút back và share */}
                <View className="absolute flex-row justify-between items-center p-4 mt-8 w-full">
                    <TouchableOpacity
                        className="bg-white/80 p-2 rounded-full"
                        onPress={() => router.back()}
                    >
                        <FontAwesome5 name="arrow-left" size={20} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="bg-white/80 p-2 rounded-full"
                    // onPress={handleShare}
                    >
                        <FontAwesome name="share-alt" size={20} color="black" />
                    </TouchableOpacity>
                </View>

                {/* Tên địa điểm và đánh giá - thêm shadow để văn bản hiển thị rõ hơn */}
                <View className="">
                    <Text className="text-4xl px-6 mt-4 font-bold text-white "
                        style={ { color:"rgba(0,0,0,0.8)" ,  }}>
                        {name}
                    </Text>
                    {/* <View className="flex-row items-center">
                        <View className="bg-yellow-400 rounded-lg px-2 py-1 flex-row items-center">
                            <Text className="text-lg font-bold mr-1">rating</Text>
                            <FontAwesome name="star" size={16} color="black" />
                        </View>
                        <Text className="text-white ml-2"
                            style={{ textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 3 }}>
                            (đánh giá)
                        </Text>
                    </View> */}
                </View>
            </View>

            {/* Thông tin chi tiết */}
            <View className="bg-white  rounded-t-3xl  px-4 py-2">
                {/* Quick Actions */}
                <View className="flex-row justify-between mb-6 mt-2">
                    <TouchableOpacity
                        className="bg-blue-500 flex-1 mx-2 p-4 rounded-2xl flex-row items-center justify-center"
                        onPress={() => router.push({
                            pathname: "/direction",
                            params: { location_latitude, location_longitude },

                        })}
                    >
                        <FontAwesome5 name="directions" size={20} color="white" />
                        <Text className="text-white font-semibold ml-2">Chỉ đường</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="bg-green-500 flex-1 mx-2 p-4 rounded-2xl flex-row items-center justify-center"
                    // onPress={handleOpenWebsite}
                    >
                        <FontAwesome name="globe" size={20} color="white" />
                        <Text className="text-white font-semibold ml-2">Website</Text>
                    </TouchableOpacity>
                </View>

                {/* Thời tiết và Đánh giá */}
                <View className="flex-row justify-between mb-6">
                    <View className="bg-white p-4 rounded-2xl flex-1 mr-2 shadow-md">
                        <View className="flex-row items-center mb-2">
                            <Image
                                source={{ uri: `https:${icon}` }}
                                style={{ width: 24, height: 24 }}
                                resizeMode="contain"
                            />
                            <Text className="font-bold text-lg ml-2 text-gray-700">Thời tiết</Text>
                        </View>
                        <Text className="text-3xl font-bold text-gray-800">{temperature_c}°C</Text>
                        <Text className="text-gray-600">{condition}</Text>
                    </View>

                    <View className="bg-white p-4 rounded-2xl flex-1 ml-2 shadow-md">
                        <View className="flex-row items-center mb-2">
                            <FontAwesome name="star" size={20} color="#4B5563" />
                            <Text className="font-bold text-lg ml-2 text-gray-700">Đánh giá</Text>
                        </View>
                        <View className="flex-row items-center">
                            {(() => {
                                const roundedRating = Math.round(Number(rating) * 2) / 2; // làm tròn 0.5
                                const fullStars = Math.floor(roundedRating);
                                const hasHalfStar = roundedRating - fullStars === 0.5;
                                const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

                                return (
                                    <>
                                        {Array.from({ length: fullStars }).map((_, index) => (
                                            <FontAwesome
                                                key={`full-${index}`}
                                                name="star"
                                                size={24}
                                                color="#facc15"
                                                style={{ marginRight: 4 }}
                                            />
                                        ))}
                                        {hasHalfStar && (
                                            <FontAwesome
                                                name="star-half-full"
                                                size={24}
                                                color="#facc15"
                                                style={{ marginRight: 4 }}
                                            />
                                        )}
                                        {Array.from({ length: emptyStars }).map((_, index) => (
                                            <FontAwesome
                                                key={`empty-${index}`}
                                                name="star-o"
                                                size={24}
                                                color="#facc15"
                                                style={{ marginRight: 4 }}
                                            />
                                        ))}
                                    </>
                                );
                            })()}
                        </View>
                        <Text className="text-gray-600 mt-1">{rating} / 5</Text>
                    </View>


                </View>

                {/* Bản đồ */}
                <View className="mb-6">
                    <Text className="font-bold text-lg mb-3 text-gray-700">Bản đồ khu vực</Text>
                    {mapUrl ? (
                        <Image
                            source={{ uri: mapUrl }}
                            className="w-full h-48 rounded-2xl"
                            resizeMode="cover"
                        />
                    ) : (
                        <View className="w-full h-48 rounded-2xl bg-gray-300 items-center justify-center">
                            <Text>Đang tải bản đồ...</Text>
                        </View>
                    )}
                </View>

                {/* Địa chỉ */}
                <View className="bg-white rounded-2xl p-4 mb-6 shadow-md">
                    <View className="flex-row items-center">
                        <MaterialIcons name="location-on" size={24} color="#4B5563" />
                        <Text className="ml-2 text-lg font-semibold text-gray-700">Địa chỉ</Text>
                    </View>
                    <Text className="mt-2 text-gray-600">{address}</Text>
                </View>

                {/* Mô tả địa điểm */}
                <View className="bg-white rounded-2xl p-4 mb-6 shadow-md">
                    <View className="flex-row items-center mb-2">
                        <Entypo name="text" size={20} color="#4B5563" />
                        <Text className="ml-2 text-lg font-semibold text-gray-700">Giới thiệu</Text>
                    </View>
                    <Text className="text-gray-600 mt-1 leading-relaxed">
                        {description || "Chưa có mô tả cho địa điểm này."}
                    </Text>
                </View>

                {/* Giờ mở cửa */}
                <View className="bg-white rounded-2xl p-4 mb-6 shadow-md">
                    <View className="flex-row items-center">
                        <Entypo name="clock" size={20} color="#4B5563" />
                        <Text className="ml-2 text-lg font-semibold text-gray-700">Giờ mở cửa</Text>
                    </View>
                    <View className="mt-2">
                        <Text className="text-green-600 font-semibold">{open_time}</Text>
                        <Text className="text-gray-600">Đóng cửa lúc </Text>
                    </View>
                </View>

                {/* Nút thêm lịch trình */}
                <TouchableOpacity
                    className="bg-blue-500 p-4 rounded-2xl mb-6"
                    onPress={() => router.push('/(tabs)/(trips)/trip_details')}
                >
                    <Text className="text-white text-center font-bold text-lg">
                        Thêm vào lịch trình
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}