import { TrendingDown, Calendar, Target } from "lucide-react";

export function AnalyticsSection() {
  const weeklyData = [
    { day: "Mon", waste: 0.8 },
    { day: "Tue", waste: 1.2 },
    { day: "Wed", waste: 0.5 },
    { day: "Thu", waste: 0.9 },
    { day: "Fri", waste: 1.5 },
    { day: "Sat", waste: 0.7 },
    { day: "Sun", waste: 0.6 }
  ];

  const insights = [
    {
      icon: TrendingDown,
      title: "Weekly Trend",
      value: "↓ 45%",
      description: "vs last week",
      color: "text-green-400"
    },
    {
      icon: Calendar,
      title: "Best Day",
      value: "Wednesday",
      description: "0.5 lbs waste",
      color: "text-blue-400"
    },
    {
      icon: Target,
      title: "Monthly Goal",
      value: "78%",
      description: "progress",
      color: "text-purple-400"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white">Your Journey</h3>
        <button className="text-blue-400 text-sm hover:text-blue-300 transition-colors">
          Learn more about your eating habits ✨
        </button>
      </div>

      {/* Weekly Chart - more seamless */}
      <div className="space-y-4 p-6 bg-white/8 rounded-2xl backdrop-blur-sm border border-white/15">
        <h4 className="text-white/80">This Week's Adventure</h4>
        <div className="flex items-end justify-between h-24 space-x-2">
          {weeklyData.map((data, index) => (
            <div key={index} className="flex flex-col items-center space-y-2 flex-1 group">
              <div 
                className="w-full bg-gradient-to-t from-emerald-500/40 via-emerald-400/30 to-emerald-300/20 rounded-t-lg min-h-[4px] group-hover:from-emerald-400/60 group-hover:via-emerald-300/50 group-hover:to-emerald-200/30 transition-all duration-300"
                style={{ height: `${(data.waste / 2) * 100}%` }}
              />
              <span className="text-xs text-white/60 group-hover:text-white/80 transition-colors">{data.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Insights Grid - flowing design */}
      <div className="grid grid-cols-3 gap-4">
        {insights.map((insight, index) => (
          <div key={index} className="p-4 bg-white/8 rounded-2xl backdrop-blur-sm border border-white/15 hover:bg-white/12 transition-all duration-300 group">
            <div className="space-y-3">
              <insight.icon className={`h-5 w-5 ${insight.color} group-hover:scale-110 transition-transform`} />
              <div className="space-y-1">
                <div className={`text-lg ${insight.color}`}>{insight.value}</div>
                <div className="text-sm text-white/70">{insight.title}</div>
                <div className="text-xs text-white/50">{insight.description}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}