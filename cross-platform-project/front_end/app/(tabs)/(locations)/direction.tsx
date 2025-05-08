import { View, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import * as Location from "expo-location";
import MapView, { Marker, Polyline } from "react-native-maps";
import { StatusBar } from "expo-status-bar";
import axios from "axios";

type LatLng = {
  latitude: number;
  longitude: number;
};

const directionPage = () => {
  const { location_latitude, location_longitude } = useLocalSearchParams();

  // Ép kiểu chuỗi thành số
  const destination: LatLng = {
    latitude: parseFloat(location_latitude as string),
    longitude: parseFloat(location_longitude as string),
  };

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [routeCoords, setRouteCoords] = useState<LatLng[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Lấy vị trí hiện tại
  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Không được cấp quyền truy cập vị trí");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    }
    getCurrentLocation();
  }, []);

  // Lấy tuyến đường
  useEffect(() => {
    const fetchRouting = async (startLocation: LatLng, endLocation: LatLng) => {
      const url = `https://api.geoapify.com/v1/routing?waypoints=${startLocation.latitude},${startLocation.longitude}|${endLocation.latitude},${endLocation.longitude}&mode=drive&apiKey=5bc79942863c4b7eb2d7136014c50c20`;

      try {
        const response = await axios.get(url);
        const features = response.data.features;
        if (features.length > 0) {
          const geometry = features[0].geometry;
          const coordinates = geometry.coordinates[0].map((coord: any) => ({
            latitude: coord[1],
            longitude: coord[0],
          }));
          setRouteCoords(coordinates);
        }
      } catch (error) {
        console.error("Lỗi khi lấy tuyến đường:", error);
      }
    };

    if (location) {
      fetchRouting(
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        destination
      );
    }
  }, [location]);

  return (
    <>
      <StatusBar style="dark" />
      <View style={styles.container}>
        {location && (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            {/* Tuyến đường */}
            {routeCoords.length > 0 && (
              <Polyline coordinates={routeCoords} strokeColor="#1E90FF" strokeWidth={4} />
            )}

            {/* Marker vị trí hiện tại */}
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Vị trí của bạn"
              pinColor="blue"
            />

            {/* Marker điểm đến */}
            <Marker
              coordinate={destination}
              title="Điểm đến"
              pinColor="red"
            />
          </MapView>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

export default directionPage;
