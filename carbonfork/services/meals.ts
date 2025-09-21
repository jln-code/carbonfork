import { supabase } from "../lib/supabase";

// fetch meals
export async function getMealsForUser(userId: string) {
  return supabase
    .from("meals")
    .select("*")
    .eq("user_id", userId)
    .order("meal_date", { ascending: false });
}

// call your Postgres function (RPC)
export async function addMeal(params: {
  user_id: string;
  before_image_url: string;
  after_image_url: string;
  meal_name: string;
  meal_date?: string;
  wasted_calories: number;
  carbon_footprint: number;
  recommendation: string;
}) {
  return supabase.rpc("add_meal", params);
}
