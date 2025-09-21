import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Feather";

interface CalendarWidgetProps {
  onDateClick: (date: Date) => void;
  meals: any[];
  maxDailyWaste: number;
}

export function CalendarWidget({
  onDateClick,
  meals,
  maxDailyWaste,
}: CalendarWidgetProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isExpanded, setIsExpanded] = useState(false);

  // Get waste level for a specific date from the real meals data
  const getWasteLevelForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    const dailyWaste = meals.reduce((sum, meal) => {
      if (meal.meal_date === dateString) {
        return sum + meal.carbon_footprint;
      }
      return sum;
    }, 0);
    return dailyWaste;
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    onDateClick(clickedDate);
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    const today = new Date();

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.calendarDay} />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      const isToday = date.toDateString() === today.toDateString();

      // Check if the date is in the future
      let backgroundColor;
      if (date.setHours(0, 0, 0, 0) > today.setHours(0, 0, 0, 0)) {
        backgroundColor = "rgba(100, 149, 237, 0.1)";
      } else {
        const dailyWaste = getWasteLevelForDate(date);
        // Determine background color based on actual waste data
        backgroundColor = "rgba(16, 185, 129, 0.2)"; // Low waste (default)
        if (maxDailyWaste > 0) {
          const wastePercentage = dailyWaste / maxDailyWaste;
          if (wastePercentage > 0.7) {
            backgroundColor = "rgba(239, 68, 68, 0.2)"; // High waste
          } else if (wastePercentage > 0.3) {
            backgroundColor = "rgba(249, 115, 22, 0.2)"; // Medium waste
          }
        }
      }

      days.push(
        <TouchableOpacity
          key={day}
          onPress={() => handleDateClick(day)}
          style={[
            styles.calendarDay,
            styles.calendarDayButton,
            { backgroundColor },
            isToday && styles.todayBorder,
          ]}>
          <Text style={styles.calendarDayText}>{day}</Text>
        </TouchableOpacity>
      );
    }

    return days;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  if (!isExpanded) {
    return (
      <TouchableOpacity
        style={styles.collapsedContainer}
        onPress={() => setIsExpanded(true)}>
        <View style={styles.collapsedContent}>
          <Icon name="calendar" size={20} color="rgba(255, 255, 255, 0.7)" />
          <View>
            <Text style={styles.collapsedTitle}>{formatDate(currentDate)}</Text>
            <Text style={styles.collapsedSubtitle}>
              Tap to explore your year
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.expandedContainer}>
      <View style={styles.calendarHeader}>
        <TouchableOpacity
          onPress={() => navigateMonth("prev")}
          style={styles.navButton}>
          <Icon
            name="chevron-left"
            size={16}
            color="rgba(255, 255, 255, 0.7)"
          />
        </TouchableOpacity>
        <Text style={styles.monthTitle}>{formatDate(currentDate)}</Text>
        <TouchableOpacity
          onPress={() => navigateMonth("next")}
          style={styles.navButton}>
          <Icon
            name="chevron-right"
            size={16}
            color="rgba(255, 255, 255, 0.7)"
          />
        </TouchableOpacity>
      </View>

      {/* Week days header */}
      <View style={styles.weekHeader}>
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <View key={day} style={styles.weekDay}>
            <Text style={styles.weekDayText}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={styles.calendarGrid}>{renderCalendar()}</View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendColor,
              { backgroundColor: "rgba(16, 185, 129, 0.2)" },
            ]}
          />
          <Text style={styles.legendText}>Low waste</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendColor,
              { backgroundColor: "rgba(249, 115, 22, 0.2)" },
            ]}
          />
          <Text style={styles.legendText}>Medium</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendColor,
              { backgroundColor: "rgba(239, 68, 68, 0.2)" },
            ]}
          />
          <Text style={styles.legendText}>High waste</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => setIsExpanded(false)}
        style={styles.collapseButton}>
        <Text style={styles.collapseButtonText}>Collapse</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  collapsedContainer: {
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  collapsedContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  collapsedTitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
  },
  collapsedSubtitle: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
  },
  expandedContainer: {
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    gap: 16,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navButton: {
    padding: 4,
    borderRadius: 8,
  },
  monthTitle: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "500",
  },
  weekHeader: {
    flexDirection: "row",
    gap: 4,
  },
  weekDay: {
    flex: 1,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  weekDayText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: 'flex-start',
    gap: 4,
  },
  calendarDay: {
    width: "13.28%", // Roughly 1/7 minus gaps
    height: 32,
  },
  calendarDayButton: {
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  calendarDayText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
  },
  todayBorder: {
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  legend: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
  },
  collapseButton: {
    alignItems: "center",
    padding: 8,
  },
  collapseButtonText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
  },
});
