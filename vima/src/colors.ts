import { Color } from './color';

/**
 * To be used as the main color, say for unimportant / unremarkable objects.
 */
export let mainColor: Color = new Color(0, 0, 0);

/**
 * To be used as a background color.
 */
export let backgroundColor: Color = new Color(255, 255, 255);

/**
 * A red shade to be used for highlighting various objects.
 */
export let redColor: Color = new Color(250, 128, 114);

/**
 * A blue shade to be used for highlighting various objects.
 */
export let blueColor: Color = new Color(30, 144, 255);

/**
 * A green shade to be used for highlighting various objects.
 */
export let greenColor: Color = new Color(95, 173, 86);

/**
 * A green shade to be used for highlighting various objects.
 */
export let yellowColor: Color = new Color(255, 186, 8);

/**
 * Changes all colors to dark their dark mode.
 */
function activateDarkMode(): void {
  mainColor = new Color(250, 250, 250);
  backgroundColor = new Color(18, 18, 18);
}

/**
 * Changes all colors to their light mode.
 */
function activateLightMode(): void {
  mainColor = new Color(0, 0, 0);
  backgroundColor = new Color(255, 255, 255);
}

/**
 * Setup the dark / light modes and watch for preference changes.
 */
function setupColorModes(): void {
  const isDarkMode: boolean =
    window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isLightMode: boolean =
    window.matchMedia('(prefers-color-scheme: light)').matches;
  const isNotSpecified: boolean =
    window.matchMedia('(prefers-color-scheme: no-preference)').matches;
  const hasNoSupport: boolean = !isDarkMode && !isLightMode && !isNotSpecified;

  // Watch for preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addListener(
    (event: MediaQueryListEvent): void => {
      if (event.matches) activateDarkMode();
    });
  window.matchMedia('(prefers-color-scheme: light)').addListener(
    (event: MediaQueryListEvent): void => {
      if (event.matches) activateLightMode();
    });

  // Activate modes based on preference, or hours if no preferences exist
  if (isDarkMode) activateDarkMode();
  else if (isLightMode) activateLightMode();
  else if (isNotSpecified || hasNoSupport) {
    const now: Date = new Date();
    const hour: number = now.getHours();
    // No preference detected, activate dark outside 4 and 16 and light
    // otherwise
    if (4 < hour && hour <= 16) {
      activateLightMode();
    } else {
      activateLightMode();
    }
  }
}

setupColorModes();
