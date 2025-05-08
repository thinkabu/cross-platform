import { Stack } from 'expo-router';

export default function TripLayout() {
    return (
        <Stack>
            <Stack.Screen name="trip" options={{ title: "" }} />
            <Stack.Screen name="add_trip" options={{ title: "" }} />
            <Stack.Screen name="trip_details" options={{ title: "" }} />
            <Stack.Screen name="itinerary" options={{ title: "" }} />
        </Stack>
    );
}
