import * as paper from 'paper';

import { WritableVariable } from './writablevariable';


export const mainColor: WritableVariable<paper.Color> =
  new WritableVariable(new paper.Color('black'));
export const backgroundColor: WritableVariable<paper.Color> =
  new WritableVariable(new paper.Color('black'));
export const redColor: WritableVariable<paper.Color> = new WritableVariable(
  new paper.Color('salmon'));
export const blueColor: WritableVariable<paper.Color> = new WritableVariable(
  new paper.Color('dodgerblue'));

function activateDarkMode(): void {
  mainColor.value = new paper.Color('#FAFAFA');
  backgroundColor.value = new paper.Color('#121212');
}

function activateLightMode(): void {
  mainColor.value = new paper.Color('black');
  backgroundColor.value = new paper.Color('white');
}

function setColorScheme(): void {
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isLightMode = window.matchMedia('(prefers-color-scheme: light)').matches;
  const isNotSpecified = window.matchMedia('(prefers-color-scheme: no-preference)').matches;
  const hasNoSupport = !isDarkMode && !isLightMode && !isNotSpecified;

  window.matchMedia('(prefers-color-scheme: dark)').addListener(
    (event: MediaQueryListEvent): void => {
      if (event.matches) activateDarkMode();
    });
  window.matchMedia('(prefers-color-scheme: light)').addListener(
    (event: MediaQueryListEvent): void => {
      if (event.matches) activateLightMode();
    });

  if(isDarkMode) activateDarkMode();
  if(isLightMode) activateLightMode();
  if(isNotSpecified || hasNoSupport) {
    const now: Date = new Date();
    const hour: number = now.getHours();
    if (hour < 4 || hour >= 16) {
      activateDarkMode();
    }
  }
}

setColorScheme();
