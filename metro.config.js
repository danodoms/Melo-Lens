const path = require("path"); // ✅ Import 'path' to resolve file paths
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Add '.bin' and '.tflite' support for assets
config.resolver.assetExts.push("bin", "tflite", "lottie");

// // Explicitly add watch folder for 'scan-result-drawer'
// config.watchFolders = [
//   path.resolve(__dirname, "src/components/scan-result-drawer"),
// ];

module.exports = withNativeWind(config, {
  input: "./global.css",
  resolver: {
    useProxies: false, // 🔥 Speeds up network requests
  },
});
