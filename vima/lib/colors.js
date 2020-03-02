"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paper = require("paper");
const writeablevariable_1 = require("./writeablevariable");
exports.mainColor = new writeablevariable_1.default(new paper.Color('black'));
exports.backgroundColor = new writeablevariable_1.default(new paper.Color('black'));
exports.redColor = new writeablevariable_1.default(new paper.Color('salmon'));
exports.blueColor = new writeablevariable_1.default(new paper.Color('dodgerblue'));
function activateDarkMode() {
    exports.mainColor.value = new paper.Color('#FAFAFA');
    exports.backgroundColor.value = new paper.Color('#121212');
}
function activateLightMode() {
    exports.mainColor.value = new paper.Color('black');
    exports.backgroundColor.value = new paper.Color('white');
}
function setColorScheme() {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isLightMode = window.matchMedia('(prefers-color-scheme: light)').matches;
    const isNotSpecified = window.matchMedia('(prefers-color-scheme: no-preference)').matches;
    const hasNoSupport = !isDarkMode && !isLightMode && !isNotSpecified;
    window.matchMedia('(prefers-color-scheme: dark)').addListener((event) => {
        if (event.matches)
            activateDarkMode();
    });
    window.matchMedia('(prefers-color-scheme: light)').addListener((event) => {
        if (event.matches)
            activateLightMode();
    });
    if (isDarkMode)
        activateDarkMode();
    if (isLightMode)
        activateLightMode();
    if (isNotSpecified || hasNoSupport) {
        const now = new Date();
        const hour = now.getHours();
        if (hour < 4 || hour >= 16) {
            activateDarkMode();
        }
    }
}
setColorScheme();
//# sourceMappingURL=colors.js.map