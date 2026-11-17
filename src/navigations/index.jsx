import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Layar Auth
import SplashScreen from '../screens/auth/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Layar Utama buatan temanmu (sudah punya bottom bar sendiri)
import Dashboard from '../screens/main/Dashboard';

// Layar Permainan buatanmu
import LevelMapScreen from '../screens/game/LevelMapScreen';
import GameplayScreen from '../screens/game/GameplayScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Dashboard" component={Dashboard} />

        {/* Layar Peta Level & Gameplay buatanmu */}
        <Stack.Screen name="LevelMap" component={LevelMapScreen} />
        <Stack.Screen name="Gameplay" component={GameplayScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}