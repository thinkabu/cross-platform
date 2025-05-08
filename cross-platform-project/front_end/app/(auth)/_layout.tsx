import { Stack } from "expo-router";

export default function AuthLayout() {
    return (
        <Stack>
            <Stack.Screen name="login" options={{ title: "" }} />
            <Stack.Screen name="register" options={{ title: "" }} />
            <Stack.Screen name="welcome" options={{ title: "" }} />
            <Stack.Screen name="forgot_password" options={{ title: "" }} />
            <Stack.Screen name="otp_verification" options={{ title: "" }} />
        </Stack>

        
    );
}
