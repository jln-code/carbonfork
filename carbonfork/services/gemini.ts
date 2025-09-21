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
export async function sendImageToGemini(imageUri: string): Promise<GeminiResponse> {
  try {
    // Fetch the URI (works for http(s) and data: URIs; for RN see note below)
    const res = await fetch(imageUri, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`Failed to fetch imageUri (${res.status})`);
    }

    let blob = await res.blob();

    // Guard: sometimes blob.type is empty or text/html if you fetched a page
    if (!blob.size) throw new Error("Fetched image is empty (0 bytes)");
    if (!/^image\//i.test(blob.type)) {
      // Force to jpeg if type is missing/incorrect
      const buf = await blob.arrayBuffer();
      blob = new Blob([buf], { type: "image/jpeg" });
    }

    const formData = new FormData();
    // filename is important so Flask puts it in request.files
    formData.append("image", blob, "upload.jpg");
    // optionally pass finger length, etc.
    // formData.append("finger_length", "3");

    const result = await fetch("http://127.0.0.1:5001/api/analyze-image", {
      method: "POST",
      body: formData, // DO NOT set Content-Type manually; browser will set boundary.
    });

    if (!result.ok) throw new Error(`HTTP ${result.status}: ${await result.text()}`);

    const data: GeminiResponse = await result.json();
    return data;
  } catch (error) {
    console.error("Error sending image:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
