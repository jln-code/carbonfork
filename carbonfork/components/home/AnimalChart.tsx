import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Svg, { Circle, Ellipse, Polyline } from "react-native-svg";

interface AnimalChartProps {
  data: { day: string; waste: number }[];
  selectedDate: Date | null;
  onClose: () => void;
}

export function AnimalChart({ data, selectedDate, onClose }: AnimalChartProps) {
  if (!selectedDate) return null;

  // Create SVG path for a cute bear shape with the line chart data
  const createBearPath = () => {
    const maxWaste = Math.max(...data.map((d) => d.waste));
    const points = data
      .map((d, i) => {
        const x = (i / (data.length - 1)) * 200 + 50; // Bear body width
        const y = 200 - (d.waste / maxWaste) * 80 + 40; // Adjust for bear shape
        return `${x},${y}`;
      })
      .join(" ");

    return points;
  };

  const points = createBearPath();
  const maxWaste = Math.max(...data.map((d) => d.waste));

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <LinearGradient
              colors={["rgba(30, 41, 59, 0.9)", "rgba(15, 23, 42, 0.9)"]}
              style={styles.modalContainer}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}>
              <View style={styles.modalContent}>
                <Text style={styles.title}>Your Week in Bear Form! 🐻</Text>
                <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>

                {/* Cute bear-shaped chart */}
                <View style={styles.chartContainer}>
                  <Svg
                    width="300"
                    height="250"
                    viewBox="0 0 300 250"
                    style={styles.svg}>
                    {/* Bear ears */}
                    <Circle
                      cx="80"
                      cy="60"
                      r="25"
                      fill="rgba(139, 69, 19, 0.6)"
                    />
                    <Circle
                      cx="220"
                      cy="60"
                      r="25"
                      fill="rgba(139, 69, 19, 0.6)"
                    />

                    {/* Bear head */}
                    <Circle
                      cx="150"
                      cy="80"
                      r="45"
                      fill="rgba(139, 69, 19, 0.4)"
                    />

                    {/* Bear body (where our line chart goes) */}
                    <Ellipse
                      cx="150"
                      cy="160"
                      rx="80"
                      ry="60"
                      fill="rgba(139, 69, 19, 0.3)"
                    />

                    {/* Chart line following bear's belly */}
                    <Polyline
                      points={points}
                      fill="none"
                      stroke="rgba(34, 197, 94, 0.8)"
                      strokeWidth="3"
                      strokeLinejoin="round"
                    />

                    {/* Data points */}
                    {data.map((d, i) => {
                      const x = (i / (data.length - 1)) * 200 + 50;
                      const y = 200 - (d.waste / maxWaste) * 80 + 40;
                      return (
                        <Circle
                          key={i}
                          cx={x}
                          cy={y}
                          r="4"
                          fill="rgba(34, 197, 94, 1)"
                        />
                      );
                    })}

                    {/* Bear face */}
                    <Circle cx="135" cy="75" r="3" fill="#000" />
                    <Circle cx="165" cy="75" r="3" fill="#000" />
                    <Ellipse cx="150" cy="90" rx="4" ry="3" fill="#000" />

                    {/* Bear paws */}
                    <Circle
                      cx="100"
                      cy="200"
                      r="15"
                      fill="rgba(139, 69, 19, 0.5)"
                    />
                    <Circle
                      cx="200"
                      cy="200"
                      r="15"
                      fill="rgba(139, 69, 19, 0.5)"
                    />
                  </Svg>
                </View>

                {/* Week summary */}
                <View style={styles.weekSummary}>
                  {data.map((d, i) => (
                    <View key={i} style={styles.dayColumn}>
                      <Text style={styles.dayLabel}>{d.day}</Text>
                      <Text style={styles.dayValue}>{d.waste.toFixed(1)}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.descriptionContainer}>
                  <Text style={styles.description}>
                    This bear shows your daily waste flowing through the week!
                    Lower curves mean you're doing great! 🌱
                  </Text>

                  <TouchableOpacity
                    onPress={onClose}
                    style={styles.closeButton}>
                    <LinearGradient
                      colors={[
                        "rgba(16, 185, 129, 0.2)",
                        "rgba(59, 130, 246, 0.2)",
                      ]}
                      style={styles.closeButtonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}>
                      <Text style={styles.closeButtonText}>
                        Thanks, Bear! 🐻
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContainer: {
    borderRadius: 24,
    padding: 24,
    maxWidth: 360,
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  modalContent: {
    alignItems: "center",
    gap: 16,
  },
  title: {
    fontSize: 18,
    color: "#ffffff",
    fontWeight: "600",
    textAlign: "center",
  },
  dateText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
  },
  chartContainer: {
    alignItems: "center",
  },
  svg: {
    width: "100%",
    height: 200,
  },
  weekSummary: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
  },
  dayColumn: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  dayLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
  },
  dayValue: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "500",
  },
  descriptionContainer: {
    gap: 12,
    alignItems: "center",
  },
  description: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    lineHeight: 20,
  },
  closeButton: {
    width: "100%",
  },
  closeButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "500",
  },
});
