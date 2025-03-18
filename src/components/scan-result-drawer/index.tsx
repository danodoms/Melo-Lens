import { Drawer, DrawerBackdrop, DrawerContent } from "@/src/components/ui/drawer";
import React, { useState } from "react";
import { AiSessionView } from "./views/ai-session-view";
import { ScanResultView } from "./views/scan-result-view";
import { AiSession, DrawerState } from "./types";

type ScanResultDrawerProps = {
    drawerState: DrawerState;
}

const ScanResultDrawer: React.FC<ScanResultDrawerProps> = ({ drawerState }) => {
    const [aiSession, setAiSession] = useState<AiSession>({ prompt: "", response: "" });
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
                    <AiSessionView drawerState={drawerState} aiSession={aiSession} onBack={() => setIsAiPageShown(false)} />
                ) : (
                    <ScanResultView drawerState={drawerState} setAiSession={setAiSession} setIsAiPageShown={setIsAiPageShown} />
                )}
            </DrawerContent >
        </Drawer >
    );
};

export default ScanResultDrawer;
