import { View, StyleSheet } from "react-native";
import Account from "@/components/Account";
import { useSession } from "@/lib/SessionContext";

export default function AccountScreen() {
  const { session } = useSession();

  if (!session) return null;

  return (
    <View style={styles.container}>
      <Account session={session} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
});
