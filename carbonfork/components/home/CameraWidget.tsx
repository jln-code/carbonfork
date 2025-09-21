import { Camera, Plus, Home, BarChart3 } from "lucide-react";

export function CameraWidget() {
  const handleTakePhoto = () => {
    // Mock function - in a real app this would open camera
    console.log("Opening camera to scan food...");
  };

  const handleHome = () => {
    console.log("Navigate to home");
  };

  const handleStats = () => {
    console.log("Navigate to stats");
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[9999]">
      {/* Nav bar container */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-2">
        <div className="flex items-center space-x-2">
          {/* Home button */}
          <button
            onClick={handleHome}
            className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 group"
          >
            <Home className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
          </button>

          {/* Main camera button - larger and prominent */}
          <button
            onClick={handleTakePhoto}
            className="relative group mx-2"
          >
            {/* Outer ring with pulse animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full animate-pulse opacity-75 group-hover:opacity-100 transition-opacity"></div>
            
            {/* Main button */}
            <div className="relative bg-gradient-to-r from-green-600 to-emerald-700 p-4 rounded-full shadow-2xl transform group-hover:scale-105 transition-transform duration-200">
              <Camera className="h-6 w-6 text-white" />
            </div>
            
            {/* Plus indicator */}
            <div className="absolute -top-1 -right-1 bg-white p-1 rounded-full">
              <Plus className="h-3 w-3 text-green-600" />
            </div>
          </button>

          {/* Stats button */}
          <button
            onClick={handleStats}
            className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 group"
          >
            <BarChart3 className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
      
      {/* Label */}
      <div className="text-center mt-2">
        <span className="text-xs text-white/60">Scan Food</span>
      </div>
    </div>
  );
}