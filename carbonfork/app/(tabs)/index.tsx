import { useState } from "react";
import { FoodWasteDisplay } from "../../components/home/FoodWasteDisplay";
import { AnalyticsSection } from "../../components/home/AnalyticsSection";
import { CalendarWidget } from "../../components/home/CalendarWidget";
import { AnimalChart } from "../../components/home/AnimalChart";
import { CameraWidget } from "../../components/home/CameraWidget";

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
    { day: "Sun", waste: 0.6 }
  ];

  // Calculate waste percentage for food waste bubble gradient
  const wastePercentage = Math.min(todayWaste / maxDailyWaste, 1);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleCloseChart = () => {
    setSelectedDate(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 dark">
      {/* Subtle background pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(148,163,184,0.05),transparent_50%)]"></div>
      
      <div className="relative z-10 p-6 pb-32">
        {/* Header with sophisticated font */}
        <div className="text-center mb-12 pt-16">
          <h1 className="text-4xl text-white mb-3 carbonfork-font tracking-wide">
            carbonfork
          </h1>
          <p className="text-white/70">Your sophisticated companion for a greener planet</p>
        </div>

        {/* Main Food Waste Display - dynamic gradient bubble */}
        <div className="mb-12">
          <FoodWasteDisplay 
            wasteAmount={todayWaste} 
            maxWaste={maxDailyWaste} 
          />
        </div>

        {/* Calendar Widget */}
        <div className="mb-8">
          <CalendarWidget onDateClick={handleDateClick} />
        </div>

        {/* Analytics Section */}
        <div className="mb-8">
          <AnalyticsSection />
        </div>

        {/* Motivational Tips - softer design */}
        <div className="p-6 bg-white/8 rounded-2xl border border-white/15 backdrop-blur-sm">
          <div className="flex items-start space-x-4">
            <div className="text-2xl animate-bounce">🌱</div>
            <div>
              <h4 className="text-white mb-2">Today's Green Tip</h4>
              <p className="text-white/70">
                Store fruits and vegetables separately to extend their freshness and reduce waste! 
                Your future self (and the planet) will thank you! 💚
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Camera Widget */}
      <CameraWidget />
      
      {/* Animal Chart Modal */}
      <AnimalChart 
        data={weeklyData}
        selectedDate={selectedDate}
        onClose={handleCloseChart}
      />
    </div>
  );
}