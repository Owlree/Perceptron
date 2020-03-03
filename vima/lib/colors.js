"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var paper = require("paper");
var writablevariable_1 = require("./writablevariable");
exports.mainColor = new writablevariable_1.WritableVariable(new paper.Color('black'));
exports.backgroundColor = new writablevariable_1.WritableVariable(new paper.Color('black'));
exports.redColor = new writablevariable_1.WritableVariable(new paper.Color('salmon'));
exports.blueColor = new writablevariable_1.WritableVariable(new paper.Color('dodgerblue'));
function activateDarkMode() {
    exports.mainColor.value = new paper.Color('#FAFAFA');
    exports.backgroundColor.value = new paper.Color('#121212');
}
function activateLightMode() {
    exports.mainColor.value = new paper.Color('black');
    exports.backgroundColor.value = new paper.Color('white');
}
function setColorScheme() {
    var isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isLightMode = window.matchMedia('(prefers-color-scheme: light)').matches;
    var isNotSpecified = window.matchMedia('(prefers-color-scheme: no-preference)').matches;
    var hasNoSupport = !isDarkMode && !isLightMode && !isNotSpecified;
    window.matchMedia('(prefers-color-scheme: dark)').addListener(function (event) {
        if (event.matches)
            activateDarkMode();
    });
    window.matchMedia('(prefers-color-scheme: light)').addListener(function (event) {
        if (event.matches)
            activateLightMode();
    });
    if (isDarkMode)
        activateDarkMode();
    if (isLightMode)
        activateLightMode();
    if (isNotSpecified || hasNoSupport) {
        var now = new Date();
        var hour = now.getHours();
        if (hour < 4 || hour >= 16) {
            activateDarkMode();
        }
    }
}
setColorScheme();
//# sourceMappingURL=colors.js.map