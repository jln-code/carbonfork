import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FoodWasteDisplay } from "@/components/home/FoodWasteDisplay";
import { AnalyticsSection } from "@/components/home/AnalyticsSection";
import { CalendarWidget } from "@/components/home/CalendarWidget";
import { AnimalChart } from "@/components/home/AnimalChart";
import { CameraWidget } from "@/components/home/CameraWidget";

export default function App() {
  // Mock data - in a real app this would come from a database
  const todayWaste = 0.8; // lbs
  const maxDailyWaste = 3.0; // lbs
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Mock weekly data for the animal chart
  const weeklyData = [
    { day: "Mon", waste: 0.8 },
    { day: "Tue", waste: 1.2 },
    { day: "Wed", waste: 0.5 },
    { day: "Thu", waste: 0.9 },
    { day: "Fri", waste: 1.5 },
    { day: "Sat", waste: 0.7 },
    { day: "Sun", waste: 0.6 },
  ];

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
            <AnalyticsSection />
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
    paddingBottom: 120, // Space for floating camera widget
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
