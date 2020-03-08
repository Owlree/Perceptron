"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var paper = require("paper");
var writablevariable_1 = require("./writablevariable");
/**
 * To be used as the main color, say for unimportant / unremarkable objects.
 */
exports.mainColor = new writablevariable_1.WritableVariable(new paper.Color('black'));
/**
 * To be used as a background color.
 */
exports.backgroundColor = new writablevariable_1.WritableVariable(new paper.Color('black'));
/**
 * A red shade to be used for highlighting various objects.
 */
exports.redColor = new writablevariable_1.WritableVariable(new paper.Color('salmon'));
/**
 * A blue shade to be used for highlighting various objects.
 */
exports.blueColor = new writablevariable_1.WritableVariable(new paper.Color('dodgerblue'));
/**
 * Changes all colors to dark their dark mode.
 */
function activateDarkMode() {
    exports.mainColor.value = new paper.Color('#FAFAFA');
    exports.backgroundColor.value = new paper.Color('#121212');
}
/**
 * Changes all colors to their light mode.
 */
function activateLightMode() {
    exports.mainColor.value = new paper.Color('black');
    exports.backgroundColor.value = new paper.Color('white');
}
/**
 * Setup the dark / light modes and watch for preference changes.
 */
function setupColorModes() {
    var isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isLightMode = window.matchMedia('(prefers-color-scheme: light)').matches;
    var isNotSpecified = window.matchMedia('(prefers-color-scheme: no-preference)').matches;
    var hasNoSupport = !isDarkMode && !isLightMode && !isNotSpecified;
    // Watch for preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addListener(function (event) {
        if (event.matches)
            activateDarkMode();
    });
    window.matchMedia('(prefers-color-scheme: light)').addListener(function (event) {
        if (event.matches)
            activateLightMode();
    });
    // Activate modes based on preference, or hours if no preferences exist
    if (isDarkMode)
        activateDarkMode();
    else if (isLightMode)
        activateLightMode();
    else if (isNotSpecified || hasNoSupport) {
        var now = new Date();
        var hour = now.getHours();
        // No preference detected, activate dark outside 4 and 16 and light
        // otherwise
        if (4 < hour && hour <= 16) {
            activateLightMode();
        }
        else {
            activateLightMode();
        }
    }
}
setupColorModes();
//# sourceMappingURL=colors.js.map