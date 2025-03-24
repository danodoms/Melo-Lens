import { Toast, ToastDescription, ToastTitle, useToast, } from '@/src/components/ui/toast';
import { Pressable } from "react-native"
import { X } from "lucide-react-native";
import { HStack } from '../components/ui/hstack';
import { ButtonText, Button } from '../components/ui/button';
import { VStack } from '../components/ui/vstack';
import { Icon } from '../components/ui/icon';

type ToastOptions = {
    id?: string;
    message: string;
    title?: string;
    icon?: any;
    actionLabel?: string;
    onActionPress?: () => void;
    duration?: number;
    type?: "success" | "error" | "warning" | "info"; // Customize based on design
};

export const useCustomToast = () => {
    const toast = useToast();

    function showToast({
        id = "customToast",
        title = "Notification",
        message,
        icon,
        actionLabel,
        onActionPress,
        duration = 5000,
        type = "info",
    }: ToastOptions) {
        toast.show({
            id,
            duration,
            placement: "top",
            avoidKeyboard: true,
            render: () => (
                <Toast
                    action={type}
                    variant="outline"
                    nativeID={id}
                    className={`p-4 gap-6 border-${type}-500 w-full shadow-hard-5 max-w-[443px] flex-row justify-between`}
                >
                    <HStack space="md">
                        {icon && <Icon as={icon} className={`stroke-${type}-500 mt-0.5`} />}
                        <VStack space="xs">
                            <ToastTitle className={`font-semibold text-${type}-500`}>
                                {title}
                            </ToastTitle>
                            <ToastDescription size="sm">{message}</ToastDescription>
                        </VStack>
                    </HStack>
                    <HStack className="min-[450px]:gap-3 gap-1">
                        {actionLabel && (
                            <Button variant="link" size="sm" className="px-3.5 self-center" onPress={onActionPress}>
                                <ButtonText>{actionLabel}</ButtonText>
                            </Button>
                        )}
                        <Pressable onPress={() => toast.close(id)}>
                            <Icon as={X} />
                        </Pressable>
                    </HStack>
                </Toast>
            ),
        });
    }

    return { showToast };
};
