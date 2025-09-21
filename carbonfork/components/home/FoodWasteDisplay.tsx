import { Leaf } from "lucide-react";

interface FoodWasteDisplayProps {
  wasteAmount: number;
  maxWaste: number;
}

export function FoodWasteDisplay({ wasteAmount, maxWaste }: FoodWasteDisplayProps) {
  // Calculate waste percentage (0-1)
  const wastePercentage = Math.min(wasteAmount / maxWaste, 1);
  
  // Dynamic solid gradient based on waste level - green to yellow to orange to red
  const getWasteGradient = () => {
    if (wastePercentage < 0.25) {
      // Excellent - Pure green gradient
      return "bg-gradient-to-br from-green-500 via-green-600 to-emerald-700";
    } else if (wastePercentage < 0.5) {
      // Good - Green to yellow gradient  
      return "bg-gradient-to-br from-green-500 via-yellow-500 to-yellow-600";
    } else if (wastePercentage < 0.75) {
      // Moderate - Yellow to orange gradient
      return "bg-gradient-to-br from-yellow-500 via-orange-500 to-orange-600";
    } else {
      // High waste - Orange to red gradient
      return "bg-gradient-to-br from-orange-500 via-red-500 to-red-600";
    }
  };
  
  const getWasteLevel = () => {
    if (wastePercentage < 0.25) return "Excellent";
    if (wastePercentage < 0.5) return "Good";
    if (wastePercentage < 0.75) return "Okay";
    return "Needs Improvement";
  };

  const getWasteLevelColor = () => {
    if (wastePercentage < 0.25) return "text-green-400";
    if (wastePercentage < 0.5) return "text-yellow-400";
    if (wastePercentage < 0.75) return "text-orange-400";
    return "text-red-400";
  };

  // Generate cute carbon facts
  const getCuteFact = () => {
    const carbonSaved = ((maxWaste - wasteAmount) * 2.1);
    const koalaNaps = Math.round(carbonSaved * 12.8); // Koalas sleep 18-22 hours
    const butterflyFlights = Math.round(carbonSaved * 156); // A butterfly's daily flight
    const catPurrs = Math.round(carbonSaved * 840); // A cat's hourly purrs
    
    const facts = [
      `${koalaNaps} koala naps 🐨`,
      `${butterflyFlights} butterfly flights 🦋`,
      `${catPurrs} kitty purrs 🐱`,
      `${Math.round(carbonSaved * 24)} puppy tail wags 🐶`,
      `${Math.round(carbonSaved * 3.6)} bunny hops 🐰`
    ];
    
    return facts[Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % facts.length]; // Daily rotation
  };

  return (
    <div className={`p-8 ${getWasteGradient()} backdrop-blur-sm rounded-[2rem] border border-white/20 shadow-2xl`}>
      <div className="space-y-6">
        {/* Main waste display */}
        <div className="text-center space-y-4">
          <h2 className="text-white/80">Food Waste Today</h2>
          <div className="space-y-2">
            <div className="text-6xl font-bold text-white">
              {wasteAmount.toFixed(1)}
              <span className="text-2xl text-white/60 ml-2">lbs</span>
            </div>
            <div className={`text-lg ${getWasteLevelColor()}`}>
              {getWasteLevel()}
            </div>
          </div>
        </div>
        
        {/* Carbon Impact with cute fact */}
        <div className="text-center space-y-3 p-6 bg-black/20 rounded-3xl backdrop-blur-sm border border-white/30">
          <div className="flex items-center justify-center space-x-2">
            <Leaf className="h-5 w-5 text-white" />
            <span className="text-white/80">Carbon Saved</span>
          </div>
          <div className="text-2xl text-white">
            {((maxWaste - wasteAmount) * 2.1).toFixed(1)} kg CO₂
          </div>
          <div className="text-sm text-white/80">
            That's like {getCuteFact()}!
          </div>
        </div>
      </div>
    </div>
  );
}