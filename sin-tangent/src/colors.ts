import * as paper from 'paper';

import Variable from './variable';
import WritableVariable from "./writeablevariable";

const _mainColor: WritableVariable<paper.Color> =
  new WritableVariable(new paper.Color('black'));
const _backgroundColor: WritableVariable<paper.Color> =
  new WritableVariable(new paper.Color('black'));

function activateDarkMode() {
  _mainColor.value = new paper.Color('#FAFAFA');
  _backgroundColor.value = new paper.Color('#121212');
}

function activateLightMode() {
  _mainColor.value = new paper.Color('black');
  _backgroundColor.value = new paper.Color('white');
}

function setColorScheme() {
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
  const isLightMode = window.matchMedia('(prefers-color-scheme: light)').matches
  const isNotSpecified = window.matchMedia('(prefers-color-scheme: no-preference)').matches
  const hasNoSupport = !isDarkMode && !isLightMode && !isNotSpecified;

  window.matchMedia("(prefers-color-scheme: dark)").addListener(
    (event: MediaQueryListEvent) => {event.matches && activateDarkMode()});
  window.matchMedia("(prefers-color-scheme: light)").addListener(
    (event: MediaQueryListEvent) => {event.matches && activateLightMode()});

  if(isDarkMode) activateDarkMode()
  if(isLightMode) activateLightMode()
  if(isNotSpecified || hasNoSupport) {
    const now: Date = new Date();
    const hour: number = now.getHours();
    if (hour < 4 || hour >= 16) {
      activateDarkMode();
    }
  }
}

setColorScheme();

export default class Colors {
  static get backgroundColor(): Variable<paper.Color> {
    return _backgroundColor;
  }
  static get mainColor(): Variable<paper.Color> {
    return _mainColor;
  }
}
