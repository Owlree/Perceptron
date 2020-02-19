import * as paper from 'paper';

import Variable from './variable';
import WritableVariable from './writeablevariable';


const _mainColor: WritableVariable<paper.Color> =
  new WritableVariable(new paper.Color('black'));
const _backgroundColor: WritableVariable<paper.Color> =
  new WritableVariable(new paper.Color('black'));

function activateDarkMode(): void {
  _mainColor.value = new paper.Color('#FAFAFA');
  _backgroundColor.value = new paper.Color('#121212');
}

function activateLightMode(): void {
  _mainColor.value = new paper.Color('black');
  _backgroundColor.value = new paper.Color('white');
}

function setColorScheme(): void {
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isLightMode = window.matchMedia('(prefers-color-scheme: light)').matches;
  const isNotSpecified = window.matchMedia('(prefers-color-scheme: no-preference)').matches;
  const hasNoSupport = !isDarkMode && !isLightMode && !isNotSpecified;

  window.matchMedia('(prefers-color-scheme: dark)').addListener(
    (event: MediaQueryListEvent): void => {
      event.matches && activateDarkMode();
    });
  window.matchMedia('(prefers-color-scheme: light)').addListener(
    (event: MediaQueryListEvent): void => {
      event.matches && activateLightMode();
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

/**
 * Class containing getters for all theme colors, returned as variables. The
 * value of the variables automatically change based on dark / light mode
 * preferences of the user or time of day, in case there are no preferences.
 */
export default class Colors {
  public static get backgroundColor(): Variable<paper.Color> {
    return _backgroundColor;
  }
  public static get mainColor(): Variable<paper.Color> {
    return _mainColor;
  }
}
