interface DetectedFood {
  food_item: string;
  estimated_weight_grams: number;
  volume_food: string;
}

interface FoodDetail {
  food_item: string;
  weight_grams: number;
  weight_kg: number;
  carbon_per_kg: number;
  carbon_footprint_kg: number;
  note?: string; // For when carbon data isn't found
  error?: string; // For processing errors
}

export interface CarbonAnalysis {
  food_details: FoodDetail[];
  individual_carbon_footprints: number[];
  total_carbon_footprint_kg: number;
  total_carbon_footprint_g: number;
}

interface GeminiResponse {
  success: boolean;
  detected_foods?: DetectedFood[];
  carbon_analysis?: CarbonAnalysis;
  summary?: string;
  error?: string;
  raw_response?: string;
}

export async function sendImageToGemini(
  imageUri: string
): Promise<GeminiResponse> {
  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();

    const formData = new FormData();
    formData.append("image", blob, "image.jpg");

    const result = await fetch("http://100.69.204.123:5001/api/analyze-image", {
      method: "POST",
      body: formData,
    });

    if (!result.ok) {
      throw new Error(`HTTP error! status: ${result.status}`);
    }

    const data: GeminiResponse = await result.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error sending image:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
