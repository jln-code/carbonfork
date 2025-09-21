import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import { supabase } from "@/lib/supabase";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    else Alert.alert("Check your email for the login link!");
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>carbonfork</Text>

      <TextInput
        style={styles.input}
        onChangeText={(text) => setEmail(text)}
        value={email}
        placeholder="Email"
        placeholderTextColor="#666"
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry={true}
        placeholder="Password"
        placeholderTextColor="#666"
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={[
          styles.button,
          styles.signInButton,
          loading && styles.disabledButton,
        ]}
        disabled={loading}
        onPress={() => signInWithEmail()}>
        <Text style={styles.buttonText}>
          {loading ? "Signing In..." : "Sign In"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          styles.signUpButton,
          loading && styles.disabledButton,
        ]}
        disabled={loading}
        onPress={() => signUpWithEmail()}>
        <Text style={styles.buttonText}>
          {loading ? "Signing Up..." : "Sign Up"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#000",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
    color: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#333",
    backgroundColor: "#1a1a1a",
    color: "#fff",
    padding: 15,
    fontSize: 16,
    borderRadius: 8,
    marginVertical: 10,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
  },
  signInButton: {
    backgroundColor: "#007AFF",
  },
  signUpButton: {
    backgroundColor: "#34C759",
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});
