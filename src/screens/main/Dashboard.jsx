import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../../services/supabase";

const GREEN = "#2F7D46";

export default function Dashboard() {
  const navigation = useNavigation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigation.replace("Login"); return; }

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, username, xp, streak")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err) {
      console.error("fetchProfile:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigation.replace("Login");
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={GREEN} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={GREEN} barStyle="light-content" />

      <View style={styles.header}>
        <View>
          <Text style={styles.greet}>Halo, {profile?.full_name ?? "Pengguna"} 👋</Text>
          <Text style={styles.sub}>@{profile?.username}</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Keluar</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{profile?.xp ?? 0}</Text>
          <Text style={styles.statLabel}>XP</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{profile?.streak ?? 0} 🔥</Text>
          <Text style={styles.statLabel}>Streak</Text>
        </View>
      </View>

      {/* Placeholder konten */}
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>🚧 Konten dashboard sedang dibangun</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center:    { flex: 1, alignItems: "center", justifyContent: "center" },
  container: { flex: 1, backgroundColor: "#F5F5F5" },

  header: {
    backgroundColor: GREEN,
    paddingTop: 52,
    paddingBottom: 20,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  greet:      { fontFamily: "FeatherBold", fontSize: 22, color: "#fff" },
  sub:        { fontSize: 13, color: "rgba(255,255,255,0.75)", marginTop: 2 },
  logoutBtn:  { backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 7 },
  logoutText: { color: "#fff", fontSize: 13, fontWeight: "600" },

  statsRow: { flexDirection: "row", gap: 12, margin: 20 },
  statCard:  {
    flex: 1, backgroundColor: "#fff", borderRadius: 16,
    paddingVertical: 18, alignItems: "center",
    elevation: 2, shadowColor: "#000", shadowOpacity: 0.07, shadowRadius: 6,
  },
  statValue: { fontFamily: "FeatherBold", fontSize: 28, color: "#1A1A1A" },
  statLabel: { fontSize: 13, color: "#888", marginTop: 4 },

  placeholder: {
    flex: 1, alignItems: "center", justifyContent: "center",
  },
  placeholderText: { fontSize: 15, color: "#AAAAAA" },
});

