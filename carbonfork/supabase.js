// src/supabase.js
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto'; // Required for React Native

// Replace these with your actual Supabase URL and public key.
// In a real app, you would use environment variables.
const supabaseUrl = 'https://spaldilbpbxpwqnuugcb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwYWxkaWxicGJ4cHdxbnV1Z2NiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzOTM2MTIsImV4cCI6MjA3Mzk2OTYxMn0.HsZi-VoBjY_XeDI3bdrJtq58zy14NAd_oMhBYuNWdkw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
