/**
 * Represents the confidence remark levels.
 */
export type ConfidenceRemark = "Weak" | "Moderate" | "Strong";

/**
 * Renders a confidence remark based on the given confidence value.
 *
 * @param confidence - The confidence value as a number.
 * @returns The corresponding confidence remark as a string.
 */
export function renderConfidenceRemark(confidence: number): ConfidenceRemark {
  if (confidence >= 90) return "Strong";
  if (confidence >= 70) return "Moderate";
  return "Weak";
}
