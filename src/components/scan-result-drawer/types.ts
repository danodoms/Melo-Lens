export type DrawerState = {
  isDrawerOpen: boolean;
  isError: boolean;
  setDrawerOpen: (open: boolean) => void;
  saveResultCallback: () => void;
  isResultSaved: boolean;
  imageUri: string | null;
  xaiHeatmapUri: string | null;
  classification: string | null;
  confidence: number | null;
};

export type AiSession = {
  isGenerating: boolean;
  prompt: string;
  response: string;
};
