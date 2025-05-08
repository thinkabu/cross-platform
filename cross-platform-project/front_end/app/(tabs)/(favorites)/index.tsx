  import React from 'react';
  import { View, StyleSheet } from 'react-native';
  import AddToFavorites from '../../../components/AddToFavorites';

  export default function FavoritesScreen() {
    return (
      <View style={styles.container}>
        <AddToFavorites isList={true} />
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
  }); 