import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Maskot       from "../../assets/maskot/02_bersemangat.svg";
import IconGoogle   from "../../assets/login/google-icon-logo-svgrepo-com.svg";
import IconFacebook from "../../assets/login/facebook-fill.svg";
import { supabase }  from "../../services/supabase";

const GREEN = "#2F7D46";

export default function LoginScreen() {
  const navigation = useNavigation();
  const { width }  = useWindowDimensions();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);

  const handleLogin = async () => {
    if (!email.includes("@")) { Alert.alert("Email tidak valid"); return; }
    if (!password)             { Alert.alert("Password tidak boleh kosong"); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email:    email.trim().toLowerCase(),
        password: password,
      });
      if (error) throw error;
      navigation.replace("Dashboard");
    } catch (err) {
      Alert.alert("Gagal Masuk", err.message ?? "Email atau password salah.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar backgroundColor={GREEN} barStyle="light-content" />

      {}
      <View style={[styles.header, { paddingTop: 48 }]}>
        <Maskot
          width={width * 0.52}
          height={width * 0.52 * (280 / 340)}
          viewBox="30 40 340 280"
        />
      </View>

      {/* ── Card putih ───────────────────────────────────────────── */}
      <ScrollView
        style={styles.card}
        contentContainerStyle={styles.cardContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.greeting}>Halo, Selamat Datang!</Text>
        <Text style={styles.subtitle}>Masuk dan lanjutkan belajarmu</Text>

        {/* ── Email ─────────────────────────────────────────────── */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="contoh@email.com"
          placeholderTextColor="#AAAAAA"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        {/* ── Password ──────────────────────────────────────────── */}
        <Text style={styles.label}>Password</Text>
        <View style={styles.passRow}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder="Masukkan password"
            placeholderTextColor="#AAAAAA"
            secureTextEntry={!showPass}
            value={password}
            onChangeText={setPassword}
          />
          <Pressable style={styles.eyeBtn} onPress={() => setShowPass(v => !v)}>
            <Text style={styles.eyeText}>{showPass ? "🙈" : "👁️"}</Text>
          </Pressable>
        </View>

        <TouchableOpacity style={styles.forgotWrap}>
          <Text style={styles.forgot}>Lupa password?</Text>
        </TouchableOpacity>

        {/* ── Tombol Masuk ──────────────────────────────────────── */}
        <TouchableOpacity
          style={[styles.btnLogin, loading && { opacity: 0.7 }]}
          onPress={handleLogin}
          activeOpacity={0.85}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.btnLoginText}>Masuk</Text>
          }
        </TouchableOpacity>

        {/* ── Separator ─────────────────────────────────────────── */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>atau</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* ── Social buttons ────────────────────────────────────── */}
        <View style={styles.socialRow}>
          <TouchableOpacity style={[styles.btnSocial, styles.btnGoogle]} activeOpacity={0.85}>
            <IconGoogle width={20} height={20} />
            <Text style={styles.btnSocialText}>  Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btnSocial, styles.btnFacebook]} activeOpacity={0.85}>
            <IconFacebook width={20} height={20} color="#fff" />
            <Text style={[styles.btnSocialText, { color: "#fff" }]}>  Facebook</Text>
          </TouchableOpacity>
        </View>

        {/* ── Footer daftar ─────────────────────────────────────── */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Belum punya akun? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.footerLink}>Daftar Sekarang</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: GREEN },

  // ── Header ───────────────────────────────────────────────────
  header: {
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 0,
    backgroundColor: GREEN,
  },

  // ── Card ─────────────────────────────────────────────────────
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  cardContent: {
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 40,
  },

  // ── Teks ─────────────────────────────────────────────────────
  greeting: {
    fontFamily: "FeatherBold",
    fontSize: 26,
    color: "#1A1A1A",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 6,
  },

  // ── Input ────────────────────────────────────────────────────
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: "#1A1A1A",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  passRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  eyeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 13,
  },
  eyeText: { fontSize: 18 },

  forgotWrap: { alignSelf: "flex-end", marginBottom: 24 },
  forgot: { fontSize: 13, color: GREEN, fontWeight: "600" },

  // ── Tombol Login ─────────────────────────────────────────────
  btnLogin: {
    backgroundColor: GREEN,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  btnLoginText: {
    fontFamily: "FeatherBold",
    fontSize: 17,
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },

  // ── Separator ────────────────────────────────────────────────
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#E8E8E8" },
  dividerText: { marginHorizontal: 12, fontSize: 13, color: "#AAAAAA" },

  // ── Social ───────────────────────────────────────────────────
  socialRow: { flexDirection: "row", gap: 12, marginBottom: 28 },
  btnSocial: {
    flex: 1,
    flexDirection: "row",
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  btnGoogle: {
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  btnFacebook: { backgroundColor: "#1877F2" },
  btnSocialText: { fontSize: 14, fontWeight: "600", color: "#333333" },

  // ── Footer ───────────────────────────────────────────────────
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: { fontSize: 14, color: "#666666" },
  footerLink: { fontSize: 14, color: GREEN, fontWeight: "700" },
});