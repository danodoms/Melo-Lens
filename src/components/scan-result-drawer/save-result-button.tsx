import React from "react";
import { Button, ButtonText } from "@/src/components/ui/button";

/**
 * Renders a save result button component.
 *
 * This component displays a button that either shows "Result Saved" if the result is already saved,
 * or a "Save and close" button that triggers the provided callback function when pressed.
 *
 * @param saveResultCallback - A callback function to be called when the save button is pressed.
 * @param isResultSaved - A boolean indicating whether the result has been saved or not.
 * @returns A JSX element representing the save result button.
 *
 * @example
 * ```tsx
 * import { renderSaveResultComponent } from './save-result-button';
 *
 * const handleSaveResult = () => {
 *     console.log('Result saved!');
 * };
 *
 * const isSaved = true;
 *
 * const SaveResultButton = () => {
 *     return renderSaveResultComponent(handleSaveResult, isSaved);
 * };
 * ```
 */
export const renderSaveResultComponent = (saveResultCallback: () => void, isResultSaved: boolean) => {
    return isResultSaved ? (
        <Button className="flex-1" variant="outline">
            <ButtonText>Result Saved</ButtonText>
        </Button>
    ) : (
        <Button onPress={saveResultCallback} className="flex-1">
            <ButtonText>Save and close</ButtonText>
        </Button>
    );
};
