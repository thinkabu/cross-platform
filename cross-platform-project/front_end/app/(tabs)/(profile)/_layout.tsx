import { Stack } from 'expo-router';

export default function ProfileLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="profile" options={{ title: "" }} />
            <Stack.Screen name="edit_profile" options={{ title: "" }} />
        </Stack>
    );
}

// screenOptions = {{
//     headerShown: false, // Ẩn tiêu đề trên góc trái
//         }}