import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "@/src/components/ui/toast";
import { Pressable } from "react-native";
import { X } from "lucide-react-native";
import { HStack } from "../components/ui/hstack";
import { ButtonText, Button } from "../components/ui/button";
import { VStack } from "../components/ui/vstack";
import { Icon } from "../components/ui/icon";
import { ToastPlacement } from "@gluestack-ui/toast/lib/types";
import { Box } from "../components/ui/box";

type ToastOptions = {
  id: string;
  message: string;
  title?: string;
  icon?: any;
  actionLabel?: string;
  onActionPress?: () => void;
  duration?: number;
  type?: "success" | "error" | "warning" | "info"; // Customize based on design
  placement?: ToastPlacement;
};

export const useCustomToast = () => {
  const toast = useToast();

  function showToast({
    id,
    title = "Notification",
    message,
    icon,
    actionLabel,
    onActionPress,
    duration = 5000,
    type = "info",
    placement = "top",
  }: ToastOptions) {
    toast.show({
      id,
      duration,
      placement,
      avoidKeyboard: true,
      render: () => (
        <VStack space="2xl">
          {/* The boxes below acts as spacer */}
          <Box />
          <Box />
          <Box />

          <Toast
            action={type}
            variant="outline"
            nativeID={id}
            className={`p-4 gap-6 border-${type}-500 shadow-hard-5 flex-row flex justify-between rounded-lg`}
          >
            <HStack space="lg" className="items-center">
              {icon && <Icon as={icon} className={`stroke-${type}-500`} />}
              <VStack space="xs">
                <ToastTitle className={`font-semibold text-${type}-500`}>
                  {title}
                </ToastTitle>
                <ToastDescription size="sm">{message}</ToastDescription>
              </VStack>
            </HStack>
            <HStack className="items-center gap-1">
              <Button
                size="sm"
                variant="solid"
                className="self-center rounded-full"
                onPress={() => {
                  onActionPress?.();
                  toast.close(id);
                }}
              >
                {actionLabel && <ButtonText>{actionLabel}</ButtonText>}
                <Icon as={X} className="text-background-0" />
              </Button>

              {/* <Pressable onPress={() => toast.close(id)}>
                <Icon as={X} />
              </Pressable> */}
            </HStack>
          </Toast>
        </VStack>
      ),
    });
  }

  return { showToast };
};
