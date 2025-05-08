import { Entypo } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";

type MyButtonProps = {
    name: string;
    image: string;
    open_time: string;
    description: string;
    rating: number
    
    onPress: () => void;
};

export default function Attraction({ name, description, rating, open_time, image, onPress }: MyButtonProps) {
    return (
        <View className="bg-blue-50 p-4 my-2 rounded-lg flex-row">
            {/* Placeholder for image */}
            <View className="w-20 h-20">
                <Image className="w-full h-full rounded-md" source={{ uri: `${image}` }} />
            </View>


            {/* Info */}
            <View className="ml-4 flex-1">
                <Text className="font-semibold">{name}</Text>
                <Text className="text-gray-500">{description}</Text>
                <Text className="text-yellow-500 mt-1">{rating} ★</Text>
                <Text className="text-green-500 mt-1">Giờ mở cửa: {open_time}</Text>
            </View>

            {/* Delete button */}
            {/* <TouchableOpacity onPress={onPress} className="p-2 absolute bottom-0 right-0">
                <Entypo name="trash" size={20} color="gray" />
            </TouchableOpacity> */}
        </View>
    );
}
