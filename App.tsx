import './global.css';
import React from 'react';
import {Text, View} from 'react-native';

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-3xl font-bold text-pink-500">Halo MangKiCode</Text>
      <Text className="mt-2 text-base text-gray-600">
        Aplikasi belajar coding
      </Text>
    </View>
  );
}