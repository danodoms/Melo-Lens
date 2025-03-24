import axios from "axios";
import { fromByteArray } from "base64-js";

export const fetchXaiAnalysis = async ({
  imageUri,
  apiUrl,
  onSuccess,
  onError,
}: {
  imageUri: string;
  apiUrl: string;
  onSuccess: (confidence: string, label: string, heatmapUri: string) => void;
  onError: (error: any) => void;
}) => {
  try {
    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      name: "image.jpg",
      type: "image/jpeg",
    });

    const { data, headers } = await axios.post(apiUrl, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      params: { enable_gradcam: true },
      responseType: "arraybuffer",
    });

    const confidence = (
      parseFloat(headers["prediction-confidence"]) * 100
    ).toFixed(2);
    const label = headers["prediction-label"];
    const heatmapUri = `data:image/jpeg;base64,${fromByteArray(
      new Uint8Array(data)
    )}`;

    onSuccess(confidence, label, heatmapUri);
  } catch (error) {
    onError(error);
  }
};
