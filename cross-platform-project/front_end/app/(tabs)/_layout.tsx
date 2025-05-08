import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Animated, StyleSheet } from 'react-native';
import { useRef } from 'react';
import "../../global.css";
import ChatwootWidget from '@/components/chatboot/chatbot';

export default function TabLayout() {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handleTabPress = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 0.8,
                duration: 100,
                useNativeDriver: false,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: false,
            }),
        ]).start();
    };

    return (
        <>
        <Tabs screenOptions={{
            headerShown: false,
            tabBarStyle: {
                height: 65,
                paddingBottom: 10,
                paddingTop: 10,
                backgroundColor: 'white',
                borderTopWidth: 1,
                borderTopColor: '#E5E7EB',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                elevation: 0,
                shadowOpacity: 0,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
            },
            tabBarActiveTintColor: '#4086D5',
            tabBarInactiveTintColor: '#9CA3AF',
            tabBarLabelStyle: {
                fontSize: 12,
                fontWeight: '500',
                marginBottom: 5,
            },
            tabBarIconStyle: {
                marginBottom: -3,
            },
        }}>
            
            {/* Các tab cũ */}
            <Tabs.Screen 
                name="(home)" 
                options={{ 
                    title: "Trang chủ",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Animated.View style={{ transform: [{ scale: focused ? scaleAnim : 1 }] }}>
                            <Ionicons 
                                name={focused ? "home" : "home-outline"} 
                                size={size} 
                                color={color} 
                            />
                        </Animated.View>
                    ),
                }} 
            />
            <Tabs.Screen 
                name="(trips)" 
                options={{ 
                    title: "Lịch trình",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Animated.View style={{ transform: [{ scale: focused ? scaleAnim : 1 }] }}>
                            <Ionicons 
                                name={focused ? "calendar" : "calendar-outline"} 
                                size={size} 
                                color={color} 
                            />
                        </Animated.View>
                    ),
                }} 
            />
            <Tabs.Screen 
                name="(locations)" 
                options={{ 
                    title: "Địa điểm",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Animated.View style={{ transform: [{ scale: focused ? scaleAnim : 1 }] }}>
                            <Ionicons 
                                name={focused ? "location" : "location-outline"} 
                                size={size} 
                                color={color} 
                            />
                        </Animated.View>
                    ),
                }} 
            />
            <Tabs.Screen 
                name="(favorites)" 
                options={{ 
                    title: "Yêu thích",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Animated.View style={[styles.heartContainer, { transform: [{ scale: focused ? scaleAnim : 1 }] }]}>
                            <Ionicons 
                                name={focused ? "heart" : "heart-outline"} 
                                size={size + 2} 
                                color={focused ? '#FF4B4B' : color} 
                            />
                        </Animated.View>
                    ),
                    tabBarLabelStyle: {
                        fontSize: 12,
                        fontWeight: '600',
                        marginBottom: 5,
                        color: '#FF4B4B',
                    },
                }} 
            />
            <Tabs.Screen 
                name="(profile)" 
                options={{ 
                    title: "Hồ sơ",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Animated.View style={{ transform: [{ scale: focused ? scaleAnim : 1 }] }}>
                            <Ionicons 
                                name={focused ? "person" : "person-outline"} 
                                size={size} 
                                color={color} 
                            />
                        </Animated.View>
                    ),
                }} 
            />
        </Tabs>
        {/* <ChatwootWidget /> */}
        </>
    );
}

const styles = StyleSheet.create({
    heartContainer: {
        position: 'relative',
    },
});
