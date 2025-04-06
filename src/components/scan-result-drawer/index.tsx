import {
  Drawer,
  DrawerBackdrop,
  DrawerContent,
} from "@/src/components/ui/drawer";
import React, { useState } from "react";
import { DrawerState } from "./types";
import { AiSessionView } from "./views/ai-session-view";
import { ScanResultView } from "./views/scan-result-view";

type ScanResultDrawerProps = {
  drawerState: DrawerState;
};

const ScanResultDrawer: React.FC<ScanResultDrawerProps> = ({ drawerState }) => {
  const [isAiPageShown, setIsAiPageShown] = useState(false);

  return (
    <Drawer
      isOpen={drawerState.isDrawerOpen}
      onClose={() => drawerState.setDrawerOpen(false)}
      size="lg"
      anchor="bottom"
    >
      <DrawerBackdrop />
      <DrawerContent>
        {/* Render AI Response Page if it's shown */}
        {isAiPageShown ? (
          <AiSessionView
            drawerState={drawerState}
            onBack={() => setIsAiPageShown(false)}
          />
        ) : (
          <ScanResultView
            drawerState={drawerState}
            onAskAiAction={() => setIsAiPageShown(true)}
          />
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default ScanResultDrawer;
