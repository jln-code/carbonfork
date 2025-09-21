interface AnimalChartProps {
  data: { day: string; waste: number }[];
  selectedDate: Date | null;
  onClose: () => void;
}

export function AnimalChart({ data, selectedDate, onClose }: AnimalChartProps) {
  if (!selectedDate) return null;

  // Create SVG path for a cute bear shape with the line chart data
  const createBearPath = () => {
    const maxWaste = Math.max(...data.map(d => d.waste));
    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * 200 + 50; // Bear body width
      const y = 200 - ((d.waste / maxWaste) * 80) + 40; // Adjust for bear shape
      return `${x},${y}`;
    }).join(' ');
    
    return points;
  };

  const points = createBearPath();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-3xl p-6 max-w-sm w-full border border-white/10">
        <div className="text-center space-y-4">
          <h3 className="text-white">
            Your Week in Bear Form! 🐻
          </h3>
          <p className="text-sm text-white/70">
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          
          {/* Cute bear-shaped chart */}
          <div className="relative">
            <svg width="300" height="250" viewBox="0 0 300 250" className="w-full h-auto">
              {/* Bear ears */}
              <circle cx="80" cy="60" r="25" fill="rgba(139, 69, 19, 0.6)" />
              <circle cx="220" cy="60" r="25" fill="rgba(139, 69, 19, 0.6)" />
              
              {/* Bear head */}
              <circle cx="150" cy="80" r="45" fill="rgba(139, 69, 19, 0.4)" />
              
              {/* Bear body (where our line chart goes) */}
              <ellipse cx="150" cy="160" rx="80" ry="60" fill="rgba(139, 69, 19, 0.3)" />
              
              {/* Chart line following bear's belly */}
              <polyline
                points={points}
                fill="none"
                stroke="rgba(34, 197, 94, 0.8)"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              
              {/* Data points */}
              {data.map((d, i) => {
                const maxWaste = Math.max(...data.map(d => d.waste));
                const x = (i / (data.length - 1)) * 200 + 50;
                const y = 200 - ((d.waste / maxWaste) * 80) + 40;
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="rgba(34, 197, 94, 1)"
                    className="animate-pulse"
                  />
                );
              })}
              
              {/* Bear face */}
              <circle cx="135" cy="75" r="3" fill="#000" /> {/* Left eye */}
              <circle cx="165" cy="75" r="3" fill="#000" /> {/* Right eye */}
              <ellipse cx="150" cy="90" rx="4" ry="3" fill="#000" /> {/* Nose */}
              
              {/* Bear paws */}
              <circle cx="100" cy="200" r="15" fill="rgba(139, 69, 19, 0.5)" />
              <circle cx="200" cy="200" r="15" fill="rgba(139, 69, 19, 0.5)" />
            </svg>
          </div>
          
          {/* Week summary */}
          <div className="grid grid-cols-7 gap-2 text-xs">
            {data.map((d, i) => (
              <div key={i} className="text-center">
                <div className="text-white/60">{d.day}</div>
                <div className="text-white">{d.waste.toFixed(1)}</div>
              </div>
            ))}
          </div>
          
          <div className="space-y-3">
            <p className="text-sm text-white/80">
              This bear shows your daily waste flowing through the week! 
              Lower curves mean you're doing great! 🌱
            </p>
            
            <button
              onClick={onClose}
              className="w-full py-2 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl text-white hover:from-green-500/30 hover:to-blue-500/30 transition-all"
            >
              Thanks, Bear! 🐻
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}