import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Feather";

interface AnalyticsSectionProps {
  weeklyData: { day: string; waste: number }[];
}

export function AnalyticsSection({ weeklyData }: AnalyticsSectionProps) {
  // --- Analytics Logic ---
  const calculateWeeklyTrend = () => {
    if (weeklyData.length < 7) {
      return { value: "--", color: "#60a5fa" };
    }

    const currentWeekWaste = weeklyData.reduce((sum, d) => sum + d.waste, 0);

    // This is a mock calculation, for a real app you'd get the previous week's data from the DB
    const lastWeekWaste = currentWeekWaste * 1.3; // Simulating a 30% reduction

    if (currentWeekWaste === 0 || lastWeekWaste === 0) {
      return { value: "N/A", color: "#eab308" };
    }

    const change = ((lastWeekWaste - currentWeekWaste) / lastWeekWaste) * 100;
    const trendIcon = change > 0 ? "trending-down" : "trending-up";
    const color = change > 0 ? "#4ade80" : "#ef4444";
    const formattedValue = `↓ ${Math.abs(change).toFixed(0)}%`;

    return { icon: trendIcon, value: formattedValue, color };
  };

  const findBestDay = () => {
    if (weeklyData.length === 0) {
      return { value: "--", description: "-- lbs waste" };
    }

    const bestDay = weeklyData.reduce((prev, current) =>
      prev.waste < current.waste ? prev : current
    );

    return {
      value: bestDay.day,
      description: `${bestDay.waste.toFixed(1)} lbs waste`,
    };
  };

  const getMonthlyGoal = () => {
    // Mocking a goal for demonstration. In a real app, this would be user-defined.
    const monthlyGoal = 50; // 50 lbs of waste per month
    const totalWeeklyWaste = weeklyData.reduce((sum, d) => sum + d.waste, 0);
    const progress = (totalWeeklyWaste / (monthlyGoal / 4)) * 100; // Assuming 4 weeks in a month
    const progressText = `${Math.min(progress, 100).toFixed(0)}%`;
    const color = progress <= 70 ? "#4ade80" : progress <= 90 ? "#eab308" : "#ef4444";
    
    return { value: progressText, description: "progress", color };
  };

  const weeklyTrend = calculateWeeklyTrend();
  const bestDay = findBestDay();
  const monthlyGoal = getMonthlyGoal();

  const insights = [
    {
      icon: weeklyTrend.icon || "trending-down",
      title: "Weekly Trend",
      value: weeklyTrend.value,
      description: "vs last week",
      color: weeklyTrend.color,
    },
    {
      icon: "calendar",
      title: "Best Day",
      value: bestDay.value,
      description: bestDay.description,
      color: "#60a5fa",
    },
    {
      icon: "target",
      title: "Monthly Goal",
      value: monthlyGoal.value,
      description: monthlyGoal.description,
      color: monthlyGoal.color,
    },
  ];
  // --- End Analytics Logic ---

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
