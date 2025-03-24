import { useState, useEffect } from "react";
import * as Network from "expo-network";

export const useIsOffline = () => {
  const [isOffline, setIsOffline] = useState<boolean | null>(null);

  const checkNetwork = async () => {
    const status = await Network.getNetworkStateAsync();
    setIsOffline(!status.isConnected);
  };

  useEffect(() => {
    checkNetwork(); // Only runs once when the component mounts
  }, []);

  return isOffline;
};
