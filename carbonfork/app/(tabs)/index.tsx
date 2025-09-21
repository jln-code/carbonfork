import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FoodWasteDisplay } from "@/components/home/FoodWasteDisplay";
import { AnalyticsSection } from "@/components/home/AnalyticsSection";
import { CalendarWidget } from "@/components/home/CalendarWidget";
import { AnimalChart } from "@/components/home/AnimalChart";
import { CameraWidget } from "@/components/home/CameraWidget";
import { useSession } from "@/lib/SessionContext";
import { getMealsForUser } from "@/services/meals";

function getDayAbbreviation(dateString: string) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const date = new Date(dateString);
  return days[date.getDay()];
}

export default function App() {
  const { session } = useSession();
  const [meals, setMeals] = useState<any[]>([]);
  const [todayWaste, setTodayWaste] = useState(0);
  const [maxDailyWaste, setMaxDailyWaste] = useState(0);
  const [weeklyData, setWeeklyData] = useState<
    { day: string; waste: number }[]
  >([]);

  useEffect(() => {
    const fetchMeals = async () => {
      if (!session?.user?.id) return;

      const { data, error } = await getMealsForUser(session.user.id);

      if (error) {
        console.error("Error fetching meals:", error.message);
        return;
      }

      const mealsData = data ?? [];
      setMeals(mealsData);

      // Process the data immediately after fetching
      const today = new Date().toISOString().split("T")[0];
      const todayMeals = mealsData.filter((meal) => meal.meal_date === today);
      const todayWasteCalories = todayMeals.reduce(
        (sum, meal) => sum + meal.carbon_footprint,
        0
      );
      setTodayWaste(todayWasteCalories);

      const dailyWaste = mealsData.reduce((acc, meal) => {
        const date = meal.meal_date;
        if (!acc[date]) {
          acc[date] = 0;
        }
        acc[date] += meal.carbon_footprint;
        return acc;
      }, {});

      const weeklyDataNew: { day: string; waste: number }[] = [];
      const currentDate = new Date();

      for (let i = 6; i >= 0; i--) {
        const date = new Date(currentDate);
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split("T")[0];
        const dayAbbr = getDayAbbreviation(dateString);

        const carbonFootprint = dailyWaste[dateString] || 0;

        weeklyDataNew.push({
          day: dayAbbr,
          waste: carbonFootprint,
        });
      }

      setWeeklyData(weeklyDataNew);
      setMaxDailyWaste(Math.max(...weeklyDataNew.map((d) => d.waste)));
    };

    fetchMeals();
  }, [session?.user?.id]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleCloseChart = () => {
    setSelectedDate(null);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      <LinearGradient
        colors={["#0f172a", "#1e293b", "#1e3a8a"]}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        {/* Subtle background pattern overlay */}
        <View style={styles.backgroundPattern} />

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Header with sophisticated font */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>carbonfork</Text>
            <Text style={styles.headerSubtitle}>
              Your sophisticated companion for a greener planet
            </Text>
          </View>

          {/* Main Food Waste Display - dynamic gradient bubble */}
          <View style={styles.foodWasteContainer}>
            <FoodWasteDisplay
              wasteAmount={todayWaste}
              maxWaste={maxDailyWaste}
            />
          </View>

          {/* Calendar Widget */}
          <View style={styles.calendarContainer}>
            <CalendarWidget onDateClick={handleDateClick} />
          </View>

          {/* Analytics Section */}
          <View style={styles.analyticsContainer}>
            <AnalyticsSection weeklyData={weeklyData} />
          </View>

          {/* Motivational Tips - softer design */}
          <View style={styles.tipContainer}>
            <View style={styles.tipContent}>
              <Text style={styles.tipEmoji}>🌱</Text>
              <View style={styles.tipTextContainer}>
                <Text style={styles.tipTitle}>Today's Green Tip</Text>
                <Text style={styles.tipText}>
                  Store fruits and vegetables separately to extend their
                  freshness and reduce waste! Your future self (and the planet)
                  will thank you! 💚
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Camera Widget */}
        <CameraWidget />

        {/* Animal Chart Modal */}
        <AnimalChart
          data={weeklyData}
          selectedDate={selectedDate}
          onClose={handleCloseChart}
        />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  backgroundPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 140, // Space for floating camera widget
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
    paddingTop: 64,
  },
  headerTitle: {
    fontSize: 32,
    color: "#ffffff",
    fontFamily: "Times New Roman",
    fontWeight: "300",
    letterSpacing: -0.32,
    marginBottom: 12,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
  },
  foodWasteContainer: {
    marginBottom: 48,
  },
  calendarContainer: {
    marginBottom: 32,
  },
  analyticsContainer: {
    marginBottom: 32,
  },
  tipContainer: {
    padding: 24,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  tipContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  tipEmoji: {
    fontSize: 24,
    marginRight: 16,
  },
  tipTextContainer: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "500",
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    lineHeight: 20,
  },
});
