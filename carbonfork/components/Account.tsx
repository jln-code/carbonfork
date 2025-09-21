import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  TextInput,
} from "react-native";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function Account({ session }: { session: Session }) {
  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [website, setWebsite] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const isDark = colorScheme === "dark";

  useEffect(() => {
    getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url`)
        .eq("id", session.user.id)
        .single();

      if (error && status !== 406) throw error;
      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile() {
    try {
      setLoading(true);
      const updates = {
        id: session.user.id,
        username,
        website,
        avatar_url: avatarUrl,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);
      if (error) throw error;
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  const styles = createStyles(isDark);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={[styles.input, styles.disabled]}
        value={session.user.email}
        editable={false}
        placeholderTextColor={isDark ? "#666" : "#999"}
      />

      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholderTextColor={isDark ? "#666" : "#999"}
      />

      <Text style={styles.label}>Website</Text>
      <TextInput
        style={styles.input}
        value={website}
        onChangeText={setWebsite}
        placeholderTextColor={isDark ? "#666" : "#999"}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.disabledButton]}
        onPress={updateProfile}
        disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? "Loading ..." : "Update"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.signOutButton}
        onPress={() => supabase.auth.signOut()}>
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 20,
      padding: 20,
      backgroundColor: isDark ? "#000" : "#fff",
    },
    label: {
      fontSize: 16,
      fontWeight: "500",
      marginBottom: 6,
      color: isDark ? "#fff" : "#000",
    },
    input: {
      borderWidth: 1,
      borderColor: isDark ? "#333" : "#ccc",
      borderRadius: 6,
      padding: 10,
      marginBottom: 12,
      backgroundColor: isDark ? "#1a1a1a" : "#fff",
      color: isDark ? "#fff" : "#000",
    },
    disabled: {
      backgroundColor: isDark ? "#2a2a2a" : "#f0f0f0",
      color: isDark ? "#666" : "#666",
    },
    button: {
      backgroundColor: "#007AFF",
      padding: 12,
      borderRadius: 6,
      alignItems: "center",
      marginVertical: 6,
    },
    disabledButton: {
      backgroundColor: isDark ? "#444" : "#ccc",
    },
    buttonText: {
      color: "#fff",
      fontWeight: "600",
    },
    signOutButton: {
      backgroundColor: isDark ? "#ff453a" : "#ff3b30",
      padding: 12,
      borderRadius: 6,
      alignItems: "center",
      marginVertical: 6,
    },
    signOutButtonText: {
      color: "#fff",
      fontWeight: "600",
    },
  });
