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
import Maskot       from "../../assets/maskot/03_gembira.svg";
import IconGoogle   from "../../assets/login/google-icon-logo-svgrepo-com.svg";
import IconFacebook from "../../assets/login/facebook-fill.svg";
import { supabase }  from "../../services/supabase";

// ── Warna konsisten ───────────────────────────────────────────────
const GREEN = "#2F7D46";

export default function RegisterScreen() {
  const navigation = useNavigation();
  const { width }  = useWindowDimensions();

  const [nama,        setNama]        = useState("");
  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [konfirmasi,  setKonfirmasi]  = useState("");
  const [showPass,    setShowPass]    = useState(false);
  const [showKonfirm, setShowKonfirm] = useState(false);
  const [errors,      setErrors]      = useState({});
  const [loading,     setLoading]     = useState(false);

  // ── Validasi inline ───────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!nama.trim())            e.nama       = "Nama tidak boleh kosong";
    if (!email.includes("@"))    e.email      = "Email tidak valid";
    if (password.length < 8)     e.password   = "Password minimal 8 karakter";
    if (password !== konfirmasi) e.konfirmasi = "Password tidak cocok";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleDaftar = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      // Buat akun + kirim full_name via metadata → trigger DB yang insert ke profiles
      const { data, error: authErr } = await supabase.auth.signUp({
        email:    email.trim().toLowerCase(),
        password: password,
        options: {
          data: { full_name: nama.trim() },
        },
      });
      if (authErr) throw authErr;

      // Navigasi ke Dashboard (trigger DB otomatis buat row profiles)
      navigation.replace("Dashboard");
    } catch (err) {
      Alert.alert("Gagal Daftar", err.message ?? "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  const clearErr = (key) => setErrors(prev => ({ ...prev, [key]: null }));

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar backgroundColor={GREEN} barStyle="light-content" />

      {/* ── Header hijau: maskot 03_gembira di-crop muka+tangan ──── */}
      <View style={styles.header}>
        <Maskot
          width={width * 0.48}
          height={width * 0.48 * (280 / 340)}
          viewBox="30 40 340 280"
        />
      </View>

      {/* ── Card putih dengan radius atas ────────────────────────── */}
      <ScrollView
        style={styles.card}
        contentContainerStyle={styles.cardContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>Buat Akun Baru</Text>
        <Text style={styles.subtitle}>Bergabung dan mulai belajar coding!</Text>

        {/* ── Nama ──────────────────────────────────────────────── */}
        <Text style={styles.label}>Nama Lengkap</Text>
        <TextInput
          style={[styles.input, errors.nama && styles.inputError]}
          placeholder="Nama kamu"
          placeholderTextColor="#AAAAAA"
          autoCapitalize="words"
          value={nama}
          onChangeText={t => { setNama(t); clearErr("nama"); }}
        />
        {errors.nama ? <Text style={styles.errorText}>{errors.nama}</Text> : null}

        {/* ── Email ─────────────────────────────────────────────── */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          placeholder="contoh@email.com"
          placeholderTextColor="#AAAAAA"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={t => { setEmail(t); clearErr("email"); }}
        />
        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

        {/* ── Password ──────────────────────────────────────────── */}
        <Text style={styles.label}>Password</Text>
        <View style={[styles.passRow, errors.password && styles.inputError]}>
          <TextInput
            style={styles.passInput}
            placeholder="Minimal 8 karakter"
            placeholderTextColor="#AAAAAA"
            secureTextEntry={!showPass}
            value={password}
            onChangeText={t => { setPassword(t); clearErr("password"); }}
          />
          <Pressable style={styles.eyeBtn} onPress={() => setShowPass(v => !v)}>
            <Text style={styles.eyeText}>{showPass ? "🙈" : "👁️"}</Text>
          </Pressable>
        </View>
        {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

        {/* ── Konfirmasi Password ───────────────────────────────── */}
        <Text style={[styles.label, { marginTop: 8 }]}>Konfirmasi Password</Text>
        <View style={[styles.passRow, errors.konfirmasi && styles.inputError]}>
          <TextInput
            style={styles.passInput}
            placeholder="Ulangi password"
            placeholderTextColor="#AAAAAA"
            secureTextEntry={!showKonfirm}
            value={konfirmasi}
            onChangeText={t => { setKonfirmasi(t); clearErr("konfirmasi"); }}
          />
          <Pressable style={styles.eyeBtn} onPress={() => setShowKonfirm(v => !v)}>
            <Text style={styles.eyeText}>{showKonfirm ? "🙈" : "👁️"}</Text>
          </Pressable>
        </View>
        {errors.konfirmasi ? <Text style={styles.errorText}>{errors.konfirmasi}</Text> : null}

        {/* ── Syarat & Ketentuan ────────────────────────────────── */}
        <Text style={styles.tos}>
          Dengan mendaftar, kamu menyetujui{" "}
          <Text style={styles.tosLink}>Syarat & Ketentuan</Text>
          {" "}dan{" "}
          <Text style={styles.tosLink}>Kebijakan Privasi</Text>
          {" "}MangKiCode.
        </Text>

        {/* ── Tombol Daftar Sekarang ────────────────────────────── */}
        <TouchableOpacity
          style={[styles.btnDaftar, loading && { opacity: 0.7 }]}
          onPress={handleDaftar}
          activeOpacity={0.85}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.btnDaftarText}>Daftar Sekarang</Text>
          }
        </TouchableOpacity>

        {/* ── Separator ─────────────────────────────────────────── */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>atau daftar dengan</Text>
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

        {/* ── Sudah punya akun? ─────────────────────────────────── */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Sudah punya akun? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.footerLink}>Masuk</Text>
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
    paddingTop: 36,
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
  heading: {
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
    marginBottom: 4,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  inputError: {
    borderColor: "#E53935",
    borderWidth: 1.5,
  },
  errorText: {
    fontSize: 12,
    color: "#E53935",
    marginBottom: 8,
    marginLeft: 4,
  },

  // ── Password row ─────────────────────────────────────────────
  passRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    marginBottom: 4,
  },
  passInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: "#1A1A1A",
  },
  eyeBtn:  { paddingHorizontal: 12, paddingVertical: 13 },
  eyeText: { fontSize: 18 },

  // ── ToS ──────────────────────────────────────────────────────
  tos: {
    fontSize: 12,
    color: "#888888",
    lineHeight: 18,
    marginTop: 12,
    marginBottom: 20,
  },
  tosLink: { color: GREEN, fontWeight: "600" },

  // ── Tombol Daftar ────────────────────────────────────────────
  btnDaftar: {
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
  btnDaftarText: {
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
  dividerText: { marginHorizontal: 10, fontSize: 12, color: "#AAAAAA" },

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
  btnFacebook:   { backgroundColor: "#1877F2" },
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

