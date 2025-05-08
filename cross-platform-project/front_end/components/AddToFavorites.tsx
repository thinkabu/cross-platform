import React, { useState, useEffect } from 'react';
import { 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  View,
  Text,
  Image,
  Modal,
  ScrollView,
  FlatList,
  RefreshControl,
  Pressable
} from 'react-native';
import { Ionicons, FontAwesome5, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

interface Location {
  id: string;
  name: string;
  address: string;
  image: string;
  description?: string;
  rating?: number;
  openingHours?: string;
  phone?: string;
  website?: string;
  weather?: {
    condition: string;
    temperature_c: number;
    icon: string;
  };
  latitude?: number;
  longitude?: number;
}

interface AddToFavoritesProps {
  location?: Location;
  isList?: boolean;
}

export default function AddToFavorites({ location, isList = false }: AddToFavoritesProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [favoriteLocations, setFavoriteLocations] = useState<Location[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  useEffect(() => {
    if (location) {
      checkIfFavorite();
    }
    loadFavorites();
  }, [location]);

  const loadFavorites = async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem('favoriteLocations');
      if (savedFavorites) {
        const favorites = JSON.parse(savedFavorites);
        setFavoriteLocations(favorites);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const checkIfFavorite = async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem('favoriteLocations');
      if (savedFavorites && location) {
        const favorites = JSON.parse(savedFavorites);
        setIsFavorite(favorites.some((item: Location) => item.id === location.id));
      }
    } catch (error) {
      console.error('Error checking favorite:', error);
    }
  };

  const toggleFavorite = async (item?: Location) => {
    const targetLocation = item || location;
    if (!targetLocation) return;
    
    try {
      const savedFavorites = await AsyncStorage.getItem('favoriteLocations');
      let favorites = savedFavorites ? JSON.parse(savedFavorites) : [];

      if (favorites.some((f: Location) => f.id === targetLocation.id)) {
        favorites = favorites.filter((f: Location) => f.id !== targetLocation.id);
        Alert.alert('Thông báo', 'Đã xóa khỏi danh sách yêu thích');
      } else {
        favorites.push(targetLocation);
        Alert.alert('Thông báo', 'Đã thêm vào danh sách yêu thích');
      }

      await AsyncStorage.setItem('favoriteLocations', JSON.stringify(favorites));
      setFavoriteLocations(favorites);
      if (location && location.id === targetLocation.id) {
        setIsFavorite(!isFavorite);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleLocationPress = (item: Location) => {
    router.push({
      pathname: "/(tabs)/(locations)/location_details",
      params: {
        name: item.name,
        image: item.image,
        address: item.address,
        location_latitude: item.latitude,
        location_longitude: item.longitude,
        condition: item.weather?.condition,
        temperature_c: item.weather?.temperature_c,
        icon: item.weather?.icon,
      }
    });
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadFavorites().then(() => setRefreshing(false));
  }, []);

  const renderLocationItem = ({ item }: { item: Location }) => (
    <Pressable
      style={({ pressed }) => [
        { opacity: pressed ? 0.9 : 1 },
        { transform: [{ scale: pressed ? 0.98 : 1 }] }
      ]}
      android_ripple={{ color: '#E5E7EB' }}
      onPress={() => handleLocationPress(item)}
      className="bg-white mb-4 rounded-2xl overflow-hidden shadow-sm border border-gray-100"
    >
      <Image
        source={{ uri: item.image }}
        className="w-full h-40"
        resizeMode="cover"
      />
      <View className="p-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-lg font-bold text-gray-800">{item.name}</Text>
          <View className="flex-row items-center bg-yellow-50 px-2 py-1 rounded-lg">
            <Ionicons name="star" size={14} color="#F59E0B" />
            <Text className="text-yellow-600 font-medium text-xs ml-1">
              {item.rating || 1}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center mt-1">
          <Feather name="map-pin" size={14} color="#3B82F6" />
          <Text className="text-blue-500 text-xs ml-1">{item.address}</Text>
        </View>

        {item.weather && (
          <View className="flex-row justify-between items-center mt-3">
            <View className="flex-row items-center">
              <Image
                source={{ uri: `https:${item.weather.icon}` }}
                style={{ width: 24, height: 24 }}
                resizeMode="contain"
              />
              <Text className="text-gray-500 text-xs ml-1">{item.weather.condition}</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-blue-600 text-sm font-medium">Xem chi tiết</Text>
            </View>
          </View>
        )}
      </View>
    </Pressable>
  );

  if (isList) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Địa điểm yêu thích</Text>
        </View>
        
        {favoriteLocations.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="heart" size={60} color="#E5E7EB" />
            <Text style={styles.emptyStateText}>Chưa có địa điểm yêu thích</Text>
            <Text style={styles.emptyStateSubtext}>
              Nhấn vào biểu tượng trái tim để thêm địa điểm vào danh sách yêu thích
            </Text>
          </View>
        ) : (
          <FlatList
            data={favoriteLocations}
            renderItem={renderLocationItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#4086D5']}
                tintColor="#4086D5"
              />
            }
          />
        )}
      </View>
    );
  }

  if (!location) return null;

  return (
    <TouchableOpacity 
      style={styles.heartButton}
      onPress={() => toggleFavorite()}
    >
      <Ionicons 
        name={isFavorite ? "heart" : "heart-outline"} 
        size={24} 
        color={isFavorite ? "#FF4444" : "#9CA3AF"} 
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4086D5',
    padding: 15,
    paddingTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  heartButton: {
    padding: 8,
    borderRadius: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6B7280',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
}); 