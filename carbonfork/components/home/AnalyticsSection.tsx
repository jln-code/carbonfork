import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Feather";

export function AnalyticsSection() {
  const weeklyData = [
    { day: "Mon", waste: 0.8 },
    { day: "Tue", waste: 1.2 },
    { day: "Wed", waste: 0.5 },
    { day: "Thu", waste: 0.9 },
    { day: "Fri", waste: 1.5 },
    { day: "Sat", waste: 0.7 },
    { day: "Sun", waste: 0.6 },
  ];

  const insights = [
    {
      icon: "trending-down",
      title: "Weekly Trend",
      value: "↓ 23%",
      description: "vs last week",
      color: "#4ade80",
    },
    {
      icon: "calendar",
      title: "Best Day",
      value: "Wednesday",
      description: "0.5 lbs waste",
      color: "#60a5fa",
    },
    {
      icon: "target",
      title: "Monthly Goal",
      value: "78%",
      description: "progress",
      color: "#a78bfa",
    },
  ];

  const maxWaste = Math.max(...weeklyData.map((d) => d.waste));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Journey</Text>
        <TouchableOpacity style={styles.learnMoreButton}>
          <Text style={styles.learnMoreText}>
            Learn more about your eating habits ✨
          </Text>
        </TouchableOpacity>
      </View>

      {/* Weekly Chart - more seamless */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>This Week's Adventure</Text>
        <View style={styles.chartContent}>
          {weeklyData.map((data, index) => (
            <View key={index} style={styles.chartBar}>
              <View
                style={[
                  styles.barFill,
                  { height: `${(data.waste / maxWaste) * 100}%` },
                ]}
              />
              <Text style={styles.barLabel}>{data.day}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Insights Grid - flowing design */}
      <View style={styles.insightsGrid}>
        {insights.map((insight, index) => (
          <TouchableOpacity key={index} style={styles.insightCard}>
            <View style={styles.insightContent}>
              <Icon name={insight.icon} size={20} color={insight.color} />
              <View style={styles.insightTextContainer}>
                <Text style={[styles.insightValue, { color: insight.color }]}>
                  {insight.value}
                </Text>
                <Text style={styles.insightTitle}>{insight.title}</Text>
                <Text style={styles.insightDescription}>
                  {insight.description}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    color: "#ffffff",
    fontWeight: "500",
  },
  learnMoreButton: {
    padding: 4,
  },
  learnMoreText: {
    fontSize: 14,
    color: "#60a5fa",
  },
  chartContainer: {
    gap: 16,
    padding: 24,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  chartTitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
  },
  chartContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 96,
    gap: 8,
  },
  chartBar: {
    flex: 1,
    alignItems: "center",
    gap: 8,
    height: "100%",
    justifyContent: "flex-end",
  },
  barFill: {
    width: "100%",
    backgroundColor: "rgba(16, 185, 129, 0.4)",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
  },
  insightsGrid: {
    flexDirection: "row",
    gap: 16,
  },
  insightCard: {
    flex: 1,
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  insightContent: {
    gap: 12,
  },
  insightTextContainer: {
    gap: 4,
  },
  insightValue: {
    fontSize: 18,
    fontWeight: "600",
  },
  insightTitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
  },
  insightDescription: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
  },
});
