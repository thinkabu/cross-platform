import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from "@expo/vector-icons";
import { router } from 'expo-router';

const AboutUsScreen = () => {
  return (
    <ImageBackground
      source={require("@/assets/images/bana.jpg")}
      resizeMode="cover"
      className="flex-1"
      blurRadius={2}
    >
      <SafeAreaView className="flex-1 bg-[rgba(255,255,255,0.85)] mb-10">
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="absolute top-20 left-6 z-10"
        >
          <Feather name="arrow-left" size={28} color="#4086D5" />
        </TouchableOpacity>
        
        <View className="px-6 pt-20">
          <Text className="text-3xl font-bold text-center text-[#4086D5] mb-4">
            Về Chúng Tôi
          </Text>
        </View>
        
        <ScrollView className="px-6">
          <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <Text className="text-2xl font-bold text-[#4086D5] mb-3">Ứng Dụng TravelAI</Text>
            <Text className="text-base mb-4">
              TravelAI là ứng dụng du lịch thông minh giúp bạn khám phá những địa điểm tuyệt vời với sự hỗ trợ của trí tuệ nhân tạo. Chúng tôi cung cấp thông tin chi tiết về các điểm du lịch, gợi ý lịch trình và tạo trải nghiệm cá nhân hóa cho mỗi người dùng.
            </Text>
            <Image 
              source={require("@/assets/images/bana.jpg")} 
              className="w-full h-40 rounded-lg mb-4"
              resizeMode="cover"
            />
            <Text className="text-base">
              Ra mắt vào năm 2025, TravelAI không ngừng cải tiến để mang đến trải nghiệm du lịch tốt nhất cho người dùng Việt Nam và quốc tế.
            </Text>
          </View>
          
          <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <Text className="text-2xl font-bold text-[#4086D5] mb-3">Sứ Mệnh Của Chúng Tôi</Text>
            <Text className="text-base">
              Chúng tôi tin rằng việc du lịch có thể mở rộng tầm nhìn và làm phong phú cuộc sống của mỗi người. Sứ mệnh của chúng tôi là giúp mọi người khám phá thế giới một cách dễ dàng, thú vị và có ý nghĩa thông qua công nghệ hiện đại.
            </Text>
          </View>
          
          <View className="bg-white rounded-xl p-6 mb-10 shadow-sm">
            <Text className="text-2xl font-bold text-[#4086D5] mb-3">Đội Ngũ Phát Triển</Text>
            <Text className="text-base mb-2">
              Đội ngũ phát triển TravelAI bao gồm các chuyên gia công nghệ với niềm đam mê du lịch và khám phá văn hóa. Chúng tôi luôn nỗ lực không ngừng để cải thiện ứng dụng và mang đến trải nghiệm tốt nhất cho người dùng.
            </Text>
            <Text className="text-base font-semibold mt-2">
              Liên hệ: quyhv.22ite@vku.udn.vn
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default AboutUsScreen; 