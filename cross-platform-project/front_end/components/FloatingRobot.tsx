import React, { useRef } from 'react';
import { 
  Animated, 
  Dimensions, 
  PanResponder, 
  TouchableOpacity, 
  View, 
  StyleSheet,
  Image,
  Text
} from 'react-native';
import { router } from 'expo-router';

const PRIMARY_COLOR = '#4086D5';
const ROBOT_SIZE = 60;

const FloatingRobot = () => {
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const scale = useRef(new Animated.Value(1)).current;
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.9,
      useNativeDriver: false,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: false,
    }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: 0,
          y: 0
        });
      },
      onPanResponderMove: Animated.event(
        [
          null,
          { 
            dx: pan.x,
            dy: pan.y
          }
        ],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (e, gestureState) => {
        pan.flattenOffset();
        
        // Giới hạn vị trí trong màn hình
        const newX = Math.max(0, Math.min(gestureState.dx, windowWidth - ROBOT_SIZE));
        const newY = Math.max(0, Math.min(gestureState.dy, windowHeight - ROBOT_SIZE));
        
        Animated.spring(pan, {
          toValue: { x: newX, y: newY },
          useNativeDriver: false,
        }).start();
      }
    })
  ).current;

  const handlePress = () => {
    router.push('/(chatbot)');
  };

  return (
    <Animated.View
      style={[
        styles.robotContainer,
        {
          transform: [
            { translateX: pan.x },
            { translateY: pan.y },
            { scale: scale }
          ]
        }
      ]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity 
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.7}
      >
        <View style={styles.robot}>
          <Image
            source={{ uri: 'https://png.pngtree.com/background/20231030/original/pngtree-d-render-of-a-cute-cartoon-robot-chatbot-with-copy-space-picture-image_5810576.jpg' }}
            style={styles.robotImage}
            resizeMode="cover"
          />
          <View style={styles.chatBubble}>
            <Text style={styles.chatText}>Chat</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  robotContainer: {
    position: 'absolute',
    width: ROBOT_SIZE,
    height: ROBOT_SIZE,
    zIndex: 1000,
    right: 20,
    bottom: 100,
  },
  robot: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: ROBOT_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  robotImage: {
    width: '100%',
    height: '100%',
    borderRadius: ROBOT_SIZE / 2,
  },
  chatBubble: {
    position: 'absolute',
    top: -20,
    right: -20,
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default FloatingRobot; 