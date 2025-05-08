import { Stack } from 'expo-router';

export default function LocationsLayout() {
    return (
        <Stack>
            <Stack.Screen name="locations" options={{ title: "" }} />
            <Stack.Screen name="location_details" options={{ title: "" }} />
        </Stack>
    );
}
