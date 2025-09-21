import { Image } from "expo-image";
import { Platform, StyleSheet } from "react-native";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Link } from "expo-router";
import { getMealsForUser } from "@/services/meals";
import { useSession } from "@/lib/SessionContext";
import { useEffect, useState } from "react";

const userName = "James";

export default function HomeScreen() {
  const { session } = useSession();
  const [meals, setMeals] = useState<any[]>([]);

  useEffect(() => {
    const fetchMeals = async () => {
      if (!session?.user?.id) return;

      const { data, error } = await getMealsForUser(session.user.id);
      if (error) {
        console.error("Error fetching meals:", error.message);
      } else {
        setMeals(data ?? []);
      }
    };

    fetchMeals();
  }, [session?.user?.id]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome {userName}!</ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
