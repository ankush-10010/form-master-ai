import axios from "axios";

// Separate URLs for different Modal functions
const ANALYZE_MOVEMENT_URL = import.meta.env.VITE_ANALYZE_MOVEMENT_URL || "https://independently-unapplauded-azzie.ngrok-free.dev/analyze_movement";
const GENERATE_IMAGE_URL = import.meta.env.VITE_GENERATE_IMAGE_URL || "";

const api = axios.create({
  timeout: 300000, // 5 min for large video uploads
});

export interface AnalysisFrame {
  frame_id: number;
  error_score: number;
  feedback: string;
  technical_observation: string;
  user_image: string; // base64
  trainer_image: string; // base64
}

export interface AnalysisResponse {
  analysis: AnalysisFrame[];
  feedback_summary: string;
  technical_details: { title: string; description: string }[];
}

export interface GenerateImageResponse {
  corrected_image: string; // base64
}

export async function analyzeMovement(
  trainerVideo: File,
  userVideo: File,
  exerciseName: string,
  email: string,
  onProgress?: (progress: number) => void
): Promise<AnalysisResponse> {
  const formData = new FormData();
  formData.append("trainer_video", trainerVideo);
  formData.append("user_video", userVideo);
  formData.append("exercise_name", exerciseName);
  formData.append("email", email);

  // Post directly to the function URL, no path appending
  const response = await api.post<AnalysisResponse>(ANALYZE_MOVEMENT_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (e) => {
      if (e.total && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    },
  });

  return response.data;
}

export async function generateImage(
  userImage: File,
  exerciseName: string,
  errorDescription?: string
): Promise<GenerateImageResponse> {
  const formData = new FormData();
  formData.append("user_image", userImage);
  formData.append("exercise_name", exerciseName);
  if (errorDescription) {
    formData.append("error_description", errorDescription);
  }

  if (!GENERATE_IMAGE_URL) {
    throw new Error("Generate Image URL is not configured");
  }

  // Post directly to the function URL
  const response = await api.post<GenerateImageResponse>(GENERATE_IMAGE_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
}

export default api;
