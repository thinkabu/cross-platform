import { Text, TouchableOpacity } from "react-native";

type MyButtonProps = {
    title: string;
    className?: string;
    onPress: () => void;
};

export default function HobbyButton({ title, onPress, className }: MyButtonProps) {
    return (
        <TouchableOpacity
            className={`bg-blue-500 rounded-full px-4 py-2 ${className}`}
            onPress={onPress}
        >
            <Text className="text-white text-xs">{title}</Text>
        </TouchableOpacity>
    );
}
