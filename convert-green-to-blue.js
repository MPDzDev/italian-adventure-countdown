const fs = require('fs/promises');
const { glob } = require('glob');
const tinycolor = require('tinycolor2');

// Define thresholds for green hues and the target blue hue.
// Adjust these values if your project uses a different range for green.
const greenHueMin = 80;
const greenHueMax = 150;
const targetBlueHue = 240;

/**
 * Normalizes rgb/rgba strings.
 * Converts space-separated formats (e.g. "rgb(9 43 30 / 70%)" or "rgba(9 43 30 / 70%)")
 * to a standard comma-separated format ("rgba(9, 43, 30, 0.7)").
 * If the string already uses commas, it is returned unchanged.
 */
function normalizeRgb(input) {
  const lower = input.toLowerCase();
  if (lower.startsWith('rgb(') || lower.startsWith('rgba(')) {
    const inner = input.slice(input.indexOf('(') + 1, input.lastIndexOf(')'));
    if (inner.includes('/')) {
      const [colorPart, alphaPart] = inner.split('/');
      const colorNums = colorPart.trim().split(/\s+/);
      let alpha = alphaPart.trim();
      if (alpha.endsWith('%')) {
        alpha = parseFloat(alpha) / 100;
      } else {
        alpha = parseFloat(alpha);
      }
      return `rgba(${colorNums.join(', ')}, ${alpha})`;
    }
    // If there are no commas but multiple space-separated numbers, convert them.
    if (!inner.includes(',') && inner.trim().split(/\s+/).length > 1) {
      const colorNums = inner.trim().split(/\s+/);
      // Check if this is intended as rgb or rgba based on count.
      if (colorNums.length === 4) {
        return `rgba(${colorNums.join(', ')})`;
      } else {
        return `rgb(${colorNums.join(', ')})`;
      }
    }
  }
  return input;
}

/**
 * Normalizes hsl/hsla strings.
 * Converts space-separated formats (e.g. "hsl(120 100% 50% / 0.5)" or "hsla(120 100% 50% / 50%)")
 * to a standard comma-separated format ("hsla(120, 100%, 50%, 0.5)").
 * If the string already uses commas, it is returned unchanged.
 */
function normalizeHsl(input) {
  const lower = input.toLowerCase();
  if (lower.startsWith('hsl(') || lower.startsWith('hsla(')) {
    const inner = input.slice(input.indexOf('(') + 1, input.lastIndexOf(')'));
    if (inner.includes('/')) {
      const [colorPart, alphaPart] = inner.split('/');
      const colorNums = colorPart.trim().split(/\s+/);
      let alpha = alphaPart.trim();
      if (alpha.endsWith('%')) {
        alpha = parseFloat(alpha) / 100;
      } else {
        alpha = parseFloat(alpha);
      }
      return `hsla(${colorNums.join(', ')}, ${alpha})`;
    }
    if (!inner.includes(',') && inner.trim().split(/\s+/).length > 1) {
      const parts = inner.trim().split(/\s+/);
      if (parts.length === 4) {
        return `hsla(${parts.join(', ')})`;
      } else {
        return `hsl(${parts.join(', ')})`;
      }
    }
  }
  return input;
}

/**
 * Converts the given color string if it falls within the green hue range.
 * Attempts to preserve the original format (hex, rgb/rgba, hsl/hsla).
 */
function convertColor(match) {
  let processed = match;
  const lower = match.toLowerCase();
  
  if (lower.startsWith('rgb')) {
    processed = normalizeRgb(match);
  } else if (lower.startsWith('hsl')) {
    processed = normalizeHsl(match);
  }
  
  const color = tinycolor(processed);
  if (!color.isValid()) return match;
  
  const hslVal = color.toHsl();
  if (hslVal.h >= greenHueMin && hslVal.h <= greenHueMax) {
    hslVal.h = targetBlueHue;
    const newColor = tinycolor(hslVal);
    
    if (lower.startsWith('hsl')) {
      // Produce an hsl/hsla string.
      const { h, s, l, a } = newColor.toHsl();
      const hRound = Math.round(h);
      const sRound = Math.round(s * 100);
      const lRound = Math.round(l * 100);
      if (a === 1) {
        return `hsl(${hRound}, ${sRound}%, ${lRound}%)`;
      } else {
        return `hsla(${hRound}, ${sRound}%, ${lRound}%, ${a})`;
      }
    } else if (lower.startsWith('rgb')) {
      // Produce an rgb/rgba string.
      const { r, g, b, a } = newColor.toRgb();
      if (a === 1) {
        return `rgb(${r}, ${g}, ${b})`;
      } else {
        return `rgba(${r}, ${g}, ${b}, ${a})`;
      }
    } else {
      return newColor.toHexString();
    }
  }
  return match;
}

/**
 * Reads a file, replaces any green color values with the shifted blue, then writes back the file.
 */
async function processFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    // Regex captures:
    // - Hex colors (3 to 8 hexadecimal digits to cover shorthand and modern alpha variants)
    // - rgb/rgba function calls
    // - hsl/hsla function calls
    const regex = /(#(?:[0-9a-fA-F]{3,8})|rgba?\([^)]*\)|hsla?\([^)]*\))/g;
    const updatedContent = data.replace(regex, convertColor);
    await fs.writeFile(filePath, updatedContent, 'utf8');
    console.log(`Updated ${filePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}: ${error}`);
  }
}

/**
 * Finds all CSS files recursively and processes them.
 */
async function main() {
  try {
    const files = await glob("**/*.css");
    if (files.length === 0) {
      console.log("No CSS files found.");
      return;
    }
    for (const file of files) {
      await processFile(file);
    }
  } catch (error) {
    console.error(`Error finding files: ${error}`);
  }
}

main();
