import * as paper from 'paper';

import { WritableVariable } from './writablevariable';

/**
 * To be used as the main color, say for unimportant / unremarkable objects.
 */
export const mainColor: WritableVariable<paper.Color> =
  new WritableVariable(new paper.Color('black'));

/**
 * To be used as a background color.
 */
export const backgroundColor: WritableVariable<paper.Color> =
  new WritableVariable(new paper.Color('black'));

/**
 * A red shade to be used for highlighting various objects.
 */
export const redColor: WritableVariable<paper.Color> = new WritableVariable(
  new paper.Color('salmon'));

/**
 * A blue shade to be used for highlighting various objects.
 */
export const blueColor: WritableVariable<paper.Color> = new WritableVariable(
  new paper.Color('dodgerblue'));

/**
 * Changes all colors to dark their dark mode.
 */
function activateDarkMode(): void {
  mainColor.value = new paper.Color('#FAFAFA');
  backgroundColor.value = new paper.Color('#121212');
}

/**
 * Changes all colors to their light mode.
 */
function activateLightMode(): void {
  mainColor.value = new paper.Color('black');
  backgroundColor.value = new paper.Color('white');
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
