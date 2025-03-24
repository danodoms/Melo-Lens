import { melonDiseaseClasses } from "@/assets/model/tflite/melon-disease/melon-disease-classes";
import ScanResultDrawer from "@/src/components/scan-result-drawer";
import {
  Button,
  ButtonIcon,
  ButtonText
} from "@/src/components/ui/button";
import { Center } from "@/src/components/ui/center";
import { HStack } from "@/src/components/ui/hstack";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { useCustomToast } from "@/src/hooks/useCustomToast";
import { useIsOffline } from "@/src/hooks/useIsOffline";
import { useTfliteModel } from "@/src/hooks/useTfliteModel";
import { fetchXaiAnalysis } from "@/src/lib/api/fetchXaiAnalysis";
import { globalStore } from "@/src/state/globalState";
import { useSupaLegend } from "@/src/utils/supalegend/useSupaLegend";
import { useSupabase } from "@/src/utils/useSupabase";
import { use$ } from "@legendapp/state/react";
import * as ImageManipulator from "expo-image-manipulator";
import { SaveFormat } from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import {
  Brain,
  BrainCog,
  Check,
  ChevronUp,
  HelpCircle,
  Images,
  RefreshCw
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { Pressable } from "react-native";
import {
  loadTensorflowModel
} from "react-native-fast-tflite";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  type CameraPosition,
} from "react-native-vision-camera";



export default function ScanScreen() {
  const {
    confidence,
    classification,
    setClassification,
    setConfidence,
    resetPrediction,
    isModelPredicting,
    model,
    setModel,
    runModelPrediction,
  } = useTfliteModel();

  const isOffline = useIsOffline();

  const cameraRef = useRef<Camera | null>(null);
  const [capturedImageUri, setCapturedImageUri] = useState<string | null>(null); // To hold the image URI
  const { hasPermission, requestPermission } = useCameraPermission();
  const [cameraFacing, setCameraFacing] = useState<CameraPosition>("back");
  const [xaiHeatmapUri, setXaiHeatmapUri] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [isResultSaved, setIsResultSaved] = useState<boolean>(false);
  const device = useCameraDevice(cameraFacing);
  const [isXaiEnabled, setXaiEnabled] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false)

  const backendAddress = use$(globalStore.backendAddress);

  const API_URL = `https://${backendAddress}/generate-heatmap/`;
  const { showToast } = useCustomToast();
  const { addResult } = useSupaLegend()
  const syncLocalImagesToRemoteDatabase = useSupabase()

  // Ensure TensorFlow is ready before classifying
  useEffect(() => {
    const initializeTf = async () => {
      await loadModel(); // Load the model when TensorFlow is ready
    };
    initializeTf();
  }, []);

  const loadModel = async () => {
    const tfliteModel = await loadTensorflowModel(
      require("@/assets/model/tflite/melon-disease/melon-disease-v2.tflite")
    );
    setModel(tfliteModel);
  };

  if (!hasPermission) {
    return (
      <VStack className="pt-16">
        <Text>We need your permission to show the camera</Text>
        <Button onPress={requestPermission}>
          <ButtonText>grant permission</ButtonText>
        </Button>
      </VStack>
    );
  }

  if (!device) {
    return (
      <VStack>
        <Text>No camera device</Text>
      </VStack>
    );
  }

  function toggleCameraFacing() {
    setCameraFacing((current) => (current === "back" ? "front" : "back"));
  }


  // 🔹 Function for local (offline) inference
  const runLocalInference = (imageUri: string) => {
    runModelPrediction(imageUri, "float32", melonDiseaseClasses);
  };


  // 🔹 Function for online (XAI API) inference
  const runOnlineInference = async (imageUri: string) => {
    await fetchXaiAnalysis({
      imageUri,
      apiUrl: API_URL,
      onSuccess: (confidence, label, heatmapUri) => {
        setConfidence(parseFloat(Number(confidence).toFixed(2)));
        setClassification(label);
        setXaiHeatmapUri(heatmapUri);
      },
      onError: (error) => {
        console.error("XAI API Error:", error);
        showToast({
          title: "XAI Error",
          message: error.message,
          icon: HelpCircle,
          type: "error",
          onActionPress: () => console.log("Retry clicked"),
        });
      },
    });
  };


  const processImageAndClassify = async (imageUri: string) => {
    // Reset predictions and open the result drawer
    setIsResultSaved(false)
    resetPrediction()
    setXaiHeatmapUri(null)
    setDrawerOpen(true);

    // Resize the image to fit the model requirements
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: 128, height: 128 } }],
      { format: SaveFormat.JPEG, base64: true }
    );
    setCapturedImageUri(manipulatedImage.uri);

    // Choose inference method explicitly
    isXaiEnabled
      ? runOnlineInference(manipulatedImage.uri)
      : runLocalInference(manipulatedImage.uri);
  }


  const captureImage = async () => {
    if (!model) {
      console.log("Model is not loaded yet.");
      return;
    }
    if (!cameraRef.current) {
      console.log("No camera ref");
      return;
    }

    const photo = await cameraRef.current.takePhoto();
    if (!photo) {
      throw new Error("Photo is undefined, no image captured");
    }

    console.log("Image Captured");

    setCapturedImageUri(null);
    setDrawerOpen(true);

    await processImageAndClassify("file://" + photo.path); // Process the captured image
  };



  const importImageAndClassify = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const selectedImageUri = result.assets[0].uri;
        await processImageAndClassify(selectedImageUri); // Process the selected image
      } else {
        console.log("Image selection was canceled");
      }
    } else {
      console.log("Permission to access gallery was denied");
    }
  };

  function saveResultToDatabase() {
    if (!capturedImageUri) return console.log("No captured image uri");
    if (!classification) return console.log("No captured classification");
    if (!confidence) return console.log("No confidence");

    addResult(capturedImageUri, classification, confidence);
    setDrawerOpen(false)
    setIsResultSaved(true)

    showToast({
      title: "Success!",
      message: "Result saved",
      icon: Check,
      type: "success",
      // actionLabel: "Close",
      onActionPress: () => console.log("Closed"),
    })

    if (!isOffline) {
      console.log("User is online, attempting to sync results with remote database")
      syncLocalImagesToRemoteDatabase()
    }
  }

  function RenderButtonComponent() {

    return (
      <VStack className="p-4">
        <HStack className="gap-4 mb-8 flex justify-center items-center w-full ">
          <Button
            size="md"
            variant={isXaiEnabled ? "solid" : "outline"}
            className="rounded-full"
            onPress={() => setXaiEnabled(!isXaiEnabled)}
          >
            <ButtonText>{isXaiEnabled ? "Disable XAI" : "Enable XAI"}</ButtonText>
            <ButtonIcon as={isXaiEnabled ? BrainCog : Brain} />
          </Button>

          <Button size="md" variant="solid" className="rounded-full" onPress={() => setDrawerOpen(true)}>
            {/*<ButtonText >Show Drawer</ButtonText>*/}
            <ButtonIcon as={ChevronUp} />
          </Button>
        </HStack>

        <HStack className="mb-4 flex justify-evenly items-center border-red-500">
          <Button size="xl" variant="solid" className="rounded-full p-4" onPress={importImageAndClassify} >
            <ButtonIcon size="xl" as={Images} />
          </Button>

          <Pressable onPress={captureImage}>
            <Center className="size-20 rounded-full border-4 border-white">
              <Center className="size-16 rounded-full bg-white opacity-20" />
            </Center>
          </Pressable>

          <Button size="xl" variant="solid" className="rounded-full p-4" onPress={toggleCameraFacing}>
            <ButtonIcon size="xl" as={RefreshCw} />
          </Button>
        </HStack>
      </VStack>
    );
  }

  return (
    <VStack
      className="bg-green h-full relative justify-between"
    >
      <Camera
        device={device}
        style={{
          position: "absolute", // This makes the component absolutely positioned
          top: 0, // Adjust these values as needed
          left: 0,
          right: 0,
          bottom: 0,
        }}
        isActive={true}
        ref={cameraRef}
        photo={true}
      /*  frameProcessor={frameProcessor}*/
      />

      {/*FOR DEVELOPERS*/}
      <VStack className="w-full justify-center mb-4 opacity-50 pt-20">
        <Text className="font-medium text-xs text-center">XAI is using this API route, modify it in accounts page</Text>
        <Text className="text-xs text-center">{API_URL}</Text>
      </VStack>


      <RenderButtonComponent />

      <ScanResultDrawer
        drawerState={{
          saveResultCallback: saveResultToDatabase,
          isResultSaved,
          isDrawerOpen,
          isError,
          setDrawerOpen,
          imageUri: capturedImageUri,
          xaiHeatmapUri,
          classification,
          confidence,
        }}
      />
    </VStack>
  );
}
