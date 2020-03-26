"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var color_1 = require("./color");
/**
 * To be used as the main color, say for unimportant / unremarkable objects.
 */
exports.mainColor = new color_1.Color(0, 0, 0);
/**
 * To be used as a background color.
 */
exports.backgroundColor = new color_1.Color(255, 255, 255);
/**
 * A red shade to be used for highlighting various objects.
 */
exports.redColor = new color_1.Color(250, 128, 114);
/**
 * A blue shade to be used for highlighting various objects.
 */
exports.blueColor = new color_1.Color(30, 144, 255);
/**
 * Changes all colors to dark their dark mode.
 */
function activateDarkMode() {
    exports.mainColor = new color_1.Color(250, 250, 250);
    exports.backgroundColor = new color_1.Color(18, 18, 18);
}
/**
 * Changes all colors to their light mode.
 */
function activateLightMode() {
    exports.mainColor = new color_1.Color(0, 0, 0);
    exports.backgroundColor = new color_1.Color(255, 255, 255);
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