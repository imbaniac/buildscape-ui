/**
 * Check if a color is light based on its luminance
 */
export function isLightColor(color: string): boolean {
  // Handle different color formats
  let r: number, g: number, b: number;

  if (color.startsWith("#")) {
    // Hex color
    const hex = color.replace("#", "");
    if (hex.length === 3) {
      // Short hex format (#RGB)
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else {
      // Full hex format (#RRGGBB)
      r = parseInt(hex.substr(0, 2), 16);
      g = parseInt(hex.substr(2, 2), 16);
      b = parseInt(hex.substr(4, 2), 16);
    }
  } else if (color.startsWith("rgb")) {
    // RGB/RGBA color
    const values = color.match(/\d+/g);
    if (values && values.length >= 3) {
      r = parseInt(values[0]);
      g = parseInt(values[1]);
      b = parseInt(values[2]);
    } else {
      return false;
    }
  } else {
    // Default to dark for unknown formats
    return false;
  }

  // Calculate relative luminance using WCAG formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Threshold for determining if color is light
  // 0.6 works well for most cases, ensuring good contrast with white text
  return luminance > 0.6;
}

/**
 * Get an adjusted color that ensures good contrast with white text
 */
export function getAccessibleBrandColor(color: string): string {
  // Handle edge cases
  if (!color || color === "transparent") {
    return "#3b82f6"; // Default blue
  }

  if (isLightColor(color)) {
    // Darken light colors by mixing with black
    // Use 65% original color for very light colors, 75% for moderately light
    const luminance = getLuminance(color);
    const mixPercent = luminance > 0.8 ? 65 : 75;
    return `color-mix(in srgb, ${color} ${mixPercent}%, black)`;
  }
  // Dark colors are already good for white text
  return color;
}

/**
 * Get luminance value for a color
 */
function getLuminance(color: string): number {
  let r: number, g: number, b: number;

  if (color.startsWith("#")) {
    const hex = color.replace("#", "");
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else {
      r = parseInt(hex.substr(0, 2), 16);
      g = parseInt(hex.substr(2, 2), 16);
      b = parseInt(hex.substr(4, 2), 16);
    }
  } else {
    return 0;
  }

  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}
