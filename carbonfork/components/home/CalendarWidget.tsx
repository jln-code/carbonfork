import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Card } from "../ui/card";

interface CalendarWidgetProps {
  onDateClick: (date: Date) => void;
}

export function CalendarWidget({ onDateClick }: CalendarWidgetProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isExpanded, setIsExpanded] = useState(false);

  // Mock data for waste levels throughout the year
  const getWasteLevelForDate = (date: Date) => {
    const day = date.getDate();
    const month = date.getMonth();
    // Create some variation in waste levels
    return ((day * month * 17) % 100) / 100;
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    onDateClick(clickedDate);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
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
    
    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const wasteLevel = getWasteLevelForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();
      
      let bgColor = "bg-green-500/20";
      if (wasteLevel > 0.7) bgColor = "bg-red-500/20";
      else if (wasteLevel > 0.3) bgColor = "bg-orange-500/20";
      
      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={`h-8 w-8 rounded-lg text-xs text-white/80 hover:text-white transition-all ${bgColor} ${
            isToday ? 'ring-2 ring-white/40' : ''
          } hover:scale-110`}
        >
          {day}
        </button>
      );
    }
    
    return days;
  };

  if (!isExpanded) {
    return (
      <Card 
        className="p-4 bg-white/8 border-white/15 backdrop-blur-sm cursor-pointer hover:bg-white/12 transition-all"
        onClick={() => setIsExpanded(true)}
      >
        <div className="flex items-center space-x-3">
          <Calendar className="h-5 w-5 text-white/70" />
          <div>
            <div className="text-white/90">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
            <div className="text-xs text-white/60">Tap to explore your year</div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-white/8 border-white/15 backdrop-blur-sm">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 text-white/70" />
          </button>
          <div className="text-white">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </div>
          <button
            onClick={() => navigateMonth('next')}
            className="p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ChevronRight className="h-4 w-4 text-white/70" />
          </button>
        </div>
        
        {/* Week days header */}
        <div className="grid grid-cols-7 gap-1 text-xs text-white/60 text-center">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="h-6 flex items-center justify-center">{day}</div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {renderCalendar()}
        </div>
        
        <div className="flex justify-between items-center text-xs text-white/60">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500/20 rounded"></div>
            <span>Low waste</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500/20 rounded"></div>
            <span>Medium</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500/20 rounded"></div>
            <span>High waste</span>
          </div>
        </div>
        
        <button
          onClick={() => setIsExpanded(false)}
          className="w-full text-xs text-white/60 hover:text-white/80 transition-colors"
        >
          Collapse
        </button>
      </div>
    </Card>
  );
}