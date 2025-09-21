import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://spaldilbpbxpwqnuugcb.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwYWxkaWxicGJ4cHdxbnV1Z2NiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzOTM2MTIsImV4cCI6MjA3Mzk2OTYxMn0.HsZi-VoBjY_XeDI3bdrJtq58zy14NAd_oMhBYuNWdkw";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
