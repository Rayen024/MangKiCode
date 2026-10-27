import { useEffect, useRef } from "react";
import { Animated, Easing, StatusBar, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import MaskotAnimated from "../../components/MaskotAnimated";

const BG = "#2F7D46";

export default function SplashScreen() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const size = width * 0.55;

  const appear = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Muncul pelan-pelan
    Animated.timing(appear, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.back(1.5)),
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => navigation.replace("Login"), 4000);
    return () => clearTimeout(timer);
  }, [appear, navigation]);

  const scale = appear.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] });

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={BG} barStyle="light-content" />

      <Animated.View style={{ opacity: appear, transform: [{ scale }] }}>
        <MaskotAnimated size={size} />
      </Animated.View>

      <Text style={styles.title}>MangKiCode</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG, alignItems: "center", justifyContent: "center" },
  title: {
    position: "absolute",
    bottom: 48,
    fontSize: 32,
    fontFamily: "FeatherBold",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
});
