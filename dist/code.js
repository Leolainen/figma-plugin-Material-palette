/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/code.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/code.ts":
/*!*********************!*\
  !*** ./src/code.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
figma.showUI(__html__, {
    height: 300
});
figma.ui.onmessage = (msg) => __awaiter(this, void 0, void 0, function* () {
    if (msg.type === 'create-palette') {
        const nodes = [];
        let selectedColor = msg.value;
        const paletteName = msg.name;
        const baseColor = {
            rgb: hexToRGB(selectedColor, true),
            hsl: hexToHSL(selectedColor),
            hex: selectedColor,
        };
        const brighterColors = createBrighterColors(baseColor).reverse();
        const darkerColors = createDarkerColors(baseColor);
        const completeColorPalette = [
            ...brighterColors,
            baseColor,
            ...darkerColors,
        ];
        yield figma.loadFontAsync({ family: "Roboto", style: "Regular" });
        // Create header rectangle
        const headerRect = figma.createRectangle();
        const headerName = figma.createText();
        const headerNumber = figma.createText();
        const headerHex = figma.createText();
        headerRect.resize(360, 122);
        headerName.fontSize = 14;
        headerName.x = 20;
        headerName.y = 20;
        headerNumber.fontSize = 14;
        headerNumber.x = 20;
        headerNumber.y = headerRect.height - 30;
        headerHex.fontSize = 14;
        headerHex.x = headerRect.width - 80;
        headerHex.y = headerRect.height - 30;
        const headerRectFills = clone(headerRect.fills);
        headerRectFills[0].color.r = baseColor.rgb.r / 100;
        headerRectFills[0].color.g = baseColor.rgb.g / 100;
        headerRectFills[0].color.b = baseColor.rgb.b / 100;
        headerRect.fills = headerRectFills;
        headerName.fills = handleTextNodeContrast(headerName, baseColor.hex);
        headerNumber.fills = handleTextNodeContrast(headerNumber, baseColor.hex);
        headerHex.fills = handleTextNodeContrast(headerHex, baseColor.hex);
        headerName.characters = paletteName;
        headerNumber.characters = "500";
        headerHex.characters = baseColor.hex.toUpperCase();
        const headerGroup = figma.group([headerRect, headerName, headerNumber, headerHex], figma.currentPage);
        nodes.push(headerGroup);
        for (let i = 0; i < completeColorPalette.length; i++) {
            const rect = figma.createRectangle();
            const paletteHex = figma.createText();
            const paletteNumber = figma.createText();
            paletteHex.fontSize = 14;
            paletteNumber.fontSize = 14;
            rect.resize(360, 34);
            rect.y = headerRect.height + (i * rect.height);
            paletteHex.x = rect.width - 80;
            paletteHex.y = rect.y + (rect.height / 2) - (paletteHex.height / 2);
            paletteNumber.x = 20;
            paletteNumber.y = rect.y + (rect.height / 2) - (paletteNumber.height / 2);
            const fills = clone(rect.fills);
            fills[0].color.r = completeColorPalette[i].rgb.r / 100;
            fills[0].color.g = completeColorPalette[i].rgb.g / 100;
            fills[0].color.b = completeColorPalette[i].rgb.b / 100;
            // Get contrast ratio to set paletteHex color
            paletteHex.fills = handleTextNodeContrast(paletteHex, completeColorPalette[i].hex);
            paletteNumber.fills = handleTextNodeContrast(paletteHex, completeColorPalette[i].hex);
            rect.fills = fills;
            paletteHex.characters = completeColorPalette[i].hex.toUpperCase();
            paletteNumber.characters = i > 0 ? (i * 100).toString() : "50";
            const group = figma.group([rect, paletteHex, paletteNumber], figma.currentPage);
            nodes.push(group);
        }
        figma.group([...nodes], figma.currentPage);
        figma.currentPage.selection = nodes;
        figma.viewport.scrollAndZoomIntoView(nodes);
    }
    figma.closePlugin();
});
/**
 *
 * @param {object} text – Figma textNode object
 * @param {string} backgroundColor – CSS Hex color. Ex: #440044
 *
 * returns Figma textNode
 */
function handleTextNodeContrast(text, backgroundColor) {
    // Get contrast ratio to set text color
    const textRGB = text.fills[0].color;
    const textHex = RGBToHex(textRGB);
    const contrastRatio = getContrastRatio(textHex, backgroundColor);
    const textFills = clone(text.fills);
    // Sets text color if contrast is too low
    if (contrastRatio < 6) {
        textFills[0].color.r = 1;
        textFills[0].color.g = 1;
        textFills[0].color.b = 1;
    }
    return textFills;
}
function clone(val) {
    return JSON.parse(JSON.stringify(val));
}
function createBrighterColors(baseColor, length = 5) {
    const maxSaturation = 100;
    const maxLightness = 100;
    let sModHolder = 0;
    let lModHolder = 0;
    // let hModHolder = 0;
    return Array.from(new Array(length), () => {
        const { h, s, l } = baseColor.hsl;
        if (sModHolder === 0 && lModHolder === 0) {
            const sDiff = maxSaturation - s;
            const lDiff = maxLightness - l;
            sModHolder = s + (sDiff * 0.05);
            lModHolder = l + (lDiff * 0.25);
            // hModHolder = h + (h * 0.01) > 360 ? 0 : h + (h * 0.01);
            // hModHolder = h + 1 > 360 ? 0 : h + 1;
        }
        else {
            const sDiff = maxSaturation - sModHolder;
            const lDiff = maxLightness - lModHolder;
            sModHolder = sModHolder + (sDiff * 0.05);
            lModHolder = lModHolder + (lDiff * 0.25);
            // hModHolder = hModHolder + (hModHolder * 0.01) > 360 ? 0 : hModHolder + (hModHolder * 0.01)
            // hModHolder = hModHolder + 1 > 360 ? 0 : hModHolder + 1
        }
        // const hMod = h + h * 0.01;
        const hex = HSLToHex(h, s, lModHolder);
        // const hex = HSLToHex(h, sModHolder, lModHolder);
        // const hex = HSLToHex(hModHolder, sModHolder, lModHolder);
        return {
            rgb: hexToRGB(hex, true),
            hsl: hexToHSL(hex),
            hex,
        };
    });
}
function createDarkerColors(baseColor, length = 4) {
    let sModHolder = 0;
    let lModHolder = 0;
    let hModHolder = 0;
    return Array.from(new Array(length), () => {
        const { h, s, l } = baseColor.hsl;
        if (sModHolder === 0 && lModHolder === 0) {
            sModHolder = s - (s * 0.2);
            lModHolder = l - (l * 0.15);
            hModHolder = h - (h * 0.02) < 0 ? 360 : h - (h * 0.02);
            // hModHolder = h - 1 < 0 ? 360 : h - 1;
        }
        else {
            sModHolder = sModHolder - (sModHolder * 0.1);
            // sModHolder = sModHolder - (sModHolder * 0.15);
            // lModHolder = lModHolder - (lModHolder * 0.1);
            lModHolder = lModHolder - (lModHolder * 0.15);
            hModHolder = hModHolder - (hModHolder * 0.02) < 0 ? 360 : hModHolder - (hModHolder * 0.02);
            // hModHolder = hModHolder - 1 < 0 ? 360 : hModHolder - 1;
        }
        // const hMod = h - 1;
        // const hMod = h - h * 0.01;
        const hex = HSLToHex(hModHolder, sModHolder, lModHolder);
        return {
            rgb: hexToRGB(hex, true),
            hsl: hexToHSL(hex),
            hex,
        };
    });
}
// https://css-tricks.com/converting-color-spaces-in-javascript/
function hexToRGB(H, isPct = false) {
    let r = 0, g = 0, b = 0;
    if (H.length == 4) {
        r = "0x" + H[1] + H[1];
        g = "0x" + H[2] + H[2];
        b = "0x" + H[3] + H[3];
    }
    else if (H.length == 7) {
        r = "0x" + H[1] + H[2];
        g = "0x" + H[3] + H[4];
        b = "0x" + H[5] + H[6];
    }
    if (isPct) {
        r = +(r / 255 * 100).toFixed(1);
        g = +(g / 255 * 100).toFixed(1);
        b = +(b / 255 * 100).toFixed(1);
    }
    return { r, g, b, string: "rgb(" + (isPct ? r + "%," + g + "%," + b + "%" : +r + "," + +g + "," + +b) + ")" };
}
function hexToHSL(H) {
    // Convert hex to RGB first
    const RGB = hexToRGB(H);
    let { r, g, b } = RGB;
    // Then to HSL
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r, g, b), cmax = Math.max(r, g, b), delta = cmax - cmin, h = 0, s = 0, l = 0;
    if (delta == 0)
        h = 0;
    else if (cmax == r)
        h = ((g - b) / delta) % 6;
    else if (cmax == g)
        h = (b - r) / delta + 2;
    else
        h = (r - g) / delta + 4;
    h = Math.round(h * 60);
    if (h < 0)
        h += 360;
    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
    return { h, s, l, string: "hsl(" + h + "," + s + "%," + l + "%)" };
}
function HSLToHex(h, s, l) {
    s /= 100;
    l /= 100;
    let c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c / 2, r = 0, g = 0, b = 0;
    if (0 <= h && h < 60) {
        r = c;
        g = x;
        b = 0;
    }
    else if (60 <= h && h < 120) {
        r = x;
        g = c;
        b = 0;
    }
    else if (120 <= h && h < 180) {
        r = 0;
        g = c;
        b = x;
    }
    else if (180 <= h && h < 240) {
        r = 0;
        g = x;
        b = c;
    }
    else if (240 <= h && h < 300) {
        r = x;
        g = 0;
        b = c;
    }
    else if (300 <= h && h < 360) {
        r = c;
        g = 0;
        b = x;
    }
    // Having obtained RGB, convert channels to hex
    r = Math.round((r + m) * 255).toString(16);
    g = Math.round((g + m) * 255).toString(16);
    b = Math.round((b + m) * 255).toString(16);
    // Prepend 0s, if necessary
    if (r.length == 1)
        r = "0" + r;
    if (g.length == 1)
        g = "0" + g;
    if (b.length == 1)
        b = "0" + b;
    return "#" + r + g + b;
}
/**
 *
 * @param {object} RGB Expects an object of r, g, b
 * ex: {
 *  r: 20,
 *  g: 177,
 *  b: 161
 * }
 */
function RGBToHex(RGB) {
    let { r, g, b } = RGB;
    r = r.toString(16);
    g = g.toString(16);
    b = b.toString(16);
    if (r.length == 1)
        r = "0" + r;
    if (g.length == 1)
        g = "0" + g;
    if (b.length == 1)
        b = "0" + b;
    return "#" + r + g + b;
}
// Functions picked and adjusted from 
// https://github.com/mui-org/material-ui/blob/master/packages/material-ui/src/styles/colorManipulator.js
/**
 * The relative brightness of any point in a color space,
 * normalized to 0 for darkest black and 1 for lightest white.
 * @param {string} hex – ex: #F0463C
 */
function getLuminance(hex) {
    const rgb = hexToRGB(hex);
    const rgbVal = [rgb.r, rgb.g, rgb.b].map(val => {
        val /= 255; // normalized
        return val <= 0.03928 ? val / 12.92 : Math.pow(((val + 0.055) / 1.055), 2.4);
    });
    // Truncate at 3 digits
    return Number((0.2126 * rgbVal[0] + 0.7152 * rgbVal[1] + 0.0722 * rgbVal[2]).toFixed(3));
}
/**
 * Calculates the contrast ratio between two colors.
 * Formula: https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-tests
 *
 * @param {string} foreground - ex: #F0463C
 * @param {string} background - ex: #212126
 * @returns {number} A contrast ratio value in the range 0 - 21.
 */
function getContrastRatio(foreground, background) {
    const lumA = getLuminance(foreground);
    const lumB = getLuminance(background);
    return (Math.max(lumA, lumB) + 0.05) / (Math.min(lumA, lumB) + 0.05);
}


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0RBQTBDLGdDQUFnQztBQUMxRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdFQUF3RCxrQkFBa0I7QUFDMUU7QUFDQSx5REFBaUQsY0FBYztBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQXlDLGlDQUFpQztBQUMxRSx3SEFBZ0gsbUJBQW1CLEVBQUU7QUFDckk7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7O0FBR0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQSxtQ0FBbUMsTUFBTSw2QkFBNkIsRUFBRSxZQUFZLFdBQVcsRUFBRTtBQUNqRyxrQ0FBa0MsTUFBTSxpQ0FBaUMsRUFBRSxZQUFZLFdBQVcsRUFBRTtBQUNwRywrQkFBK0IsaUVBQWlFLHVCQUF1QixFQUFFLDRCQUE0QjtBQUNySjtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxxQ0FBcUM7QUFDeEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsaUNBQWlDO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixXQUFXLE9BQU87QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxVQUFVO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsVUFBVTtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsVUFBVTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLFVBQVU7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUI7QUFDbkI7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsV0FBVyxPQUFPO0FBQ2xCLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiY29kZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2NvZGUudHNcIik7XG4iLCJ2YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbmZpZ21hLnNob3dVSShfX2h0bWxfXywge1xuICAgIGhlaWdodDogMzAwXG59KTtcbmZpZ21hLnVpLm9ubWVzc2FnZSA9IChtc2cpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICBpZiAobXNnLnR5cGUgPT09ICdjcmVhdGUtcGFsZXR0ZScpIHtcbiAgICAgICAgY29uc3Qgbm9kZXMgPSBbXTtcbiAgICAgICAgbGV0IHNlbGVjdGVkQ29sb3IgPSBtc2cudmFsdWU7XG4gICAgICAgIGNvbnN0IHBhbGV0dGVOYW1lID0gbXNnLm5hbWU7XG4gICAgICAgIGNvbnN0IGJhc2VDb2xvciA9IHtcbiAgICAgICAgICAgIHJnYjogaGV4VG9SR0Ioc2VsZWN0ZWRDb2xvciwgdHJ1ZSksXG4gICAgICAgICAgICBoc2w6IGhleFRvSFNMKHNlbGVjdGVkQ29sb3IpLFxuICAgICAgICAgICAgaGV4OiBzZWxlY3RlZENvbG9yLFxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBicmlnaHRlckNvbG9ycyA9IGNyZWF0ZUJyaWdodGVyQ29sb3JzKGJhc2VDb2xvcikucmV2ZXJzZSgpO1xuICAgICAgICBjb25zdCBkYXJrZXJDb2xvcnMgPSBjcmVhdGVEYXJrZXJDb2xvcnMoYmFzZUNvbG9yKTtcbiAgICAgICAgY29uc3QgY29tcGxldGVDb2xvclBhbGV0dGUgPSBbXG4gICAgICAgICAgICAuLi5icmlnaHRlckNvbG9ycyxcbiAgICAgICAgICAgIGJhc2VDb2xvcixcbiAgICAgICAgICAgIC4uLmRhcmtlckNvbG9ycyxcbiAgICAgICAgXTtcbiAgICAgICAgeWllbGQgZmlnbWEubG9hZEZvbnRBc3luYyh7IGZhbWlseTogXCJSb2JvdG9cIiwgc3R5bGU6IFwiUmVndWxhclwiIH0pO1xuICAgICAgICAvLyBDcmVhdGUgaGVhZGVyIHJlY3RhbmdsZVxuICAgICAgICBjb25zdCBoZWFkZXJSZWN0ID0gZmlnbWEuY3JlYXRlUmVjdGFuZ2xlKCk7XG4gICAgICAgIGNvbnN0IGhlYWRlck5hbWUgPSBmaWdtYS5jcmVhdGVUZXh0KCk7XG4gICAgICAgIGNvbnN0IGhlYWRlck51bWJlciA9IGZpZ21hLmNyZWF0ZVRleHQoKTtcbiAgICAgICAgY29uc3QgaGVhZGVySGV4ID0gZmlnbWEuY3JlYXRlVGV4dCgpO1xuICAgICAgICBoZWFkZXJSZWN0LnJlc2l6ZSgzNjAsIDEyMik7XG4gICAgICAgIGhlYWRlck5hbWUuZm9udFNpemUgPSAxNDtcbiAgICAgICAgaGVhZGVyTmFtZS54ID0gMjA7XG4gICAgICAgIGhlYWRlck5hbWUueSA9IDIwO1xuICAgICAgICBoZWFkZXJOdW1iZXIuZm9udFNpemUgPSAxNDtcbiAgICAgICAgaGVhZGVyTnVtYmVyLnggPSAyMDtcbiAgICAgICAgaGVhZGVyTnVtYmVyLnkgPSBoZWFkZXJSZWN0LmhlaWdodCAtIDMwO1xuICAgICAgICBoZWFkZXJIZXguZm9udFNpemUgPSAxNDtcbiAgICAgICAgaGVhZGVySGV4LnggPSBoZWFkZXJSZWN0LndpZHRoIC0gODA7XG4gICAgICAgIGhlYWRlckhleC55ID0gaGVhZGVyUmVjdC5oZWlnaHQgLSAzMDtcbiAgICAgICAgY29uc3QgaGVhZGVyUmVjdEZpbGxzID0gY2xvbmUoaGVhZGVyUmVjdC5maWxscyk7XG4gICAgICAgIGhlYWRlclJlY3RGaWxsc1swXS5jb2xvci5yID0gYmFzZUNvbG9yLnJnYi5yIC8gMTAwO1xuICAgICAgICBoZWFkZXJSZWN0RmlsbHNbMF0uY29sb3IuZyA9IGJhc2VDb2xvci5yZ2IuZyAvIDEwMDtcbiAgICAgICAgaGVhZGVyUmVjdEZpbGxzWzBdLmNvbG9yLmIgPSBiYXNlQ29sb3IucmdiLmIgLyAxMDA7XG4gICAgICAgIGhlYWRlclJlY3QuZmlsbHMgPSBoZWFkZXJSZWN0RmlsbHM7XG4gICAgICAgIGhlYWRlck5hbWUuZmlsbHMgPSBoYW5kbGVUZXh0Tm9kZUNvbnRyYXN0KGhlYWRlck5hbWUsIGJhc2VDb2xvci5oZXgpO1xuICAgICAgICBoZWFkZXJOdW1iZXIuZmlsbHMgPSBoYW5kbGVUZXh0Tm9kZUNvbnRyYXN0KGhlYWRlck51bWJlciwgYmFzZUNvbG9yLmhleCk7XG4gICAgICAgIGhlYWRlckhleC5maWxscyA9IGhhbmRsZVRleHROb2RlQ29udHJhc3QoaGVhZGVySGV4LCBiYXNlQ29sb3IuaGV4KTtcbiAgICAgICAgaGVhZGVyTmFtZS5jaGFyYWN0ZXJzID0gcGFsZXR0ZU5hbWU7XG4gICAgICAgIGhlYWRlck51bWJlci5jaGFyYWN0ZXJzID0gXCI1MDBcIjtcbiAgICAgICAgaGVhZGVySGV4LmNoYXJhY3RlcnMgPSBiYXNlQ29sb3IuaGV4LnRvVXBwZXJDYXNlKCk7XG4gICAgICAgIGNvbnN0IGhlYWRlckdyb3VwID0gZmlnbWEuZ3JvdXAoW2hlYWRlclJlY3QsIGhlYWRlck5hbWUsIGhlYWRlck51bWJlciwgaGVhZGVySGV4XSwgZmlnbWEuY3VycmVudFBhZ2UpO1xuICAgICAgICBub2Rlcy5wdXNoKGhlYWRlckdyb3VwKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb21wbGV0ZUNvbG9yUGFsZXR0ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgcmVjdCA9IGZpZ21hLmNyZWF0ZVJlY3RhbmdsZSgpO1xuICAgICAgICAgICAgY29uc3QgcGFsZXR0ZUhleCA9IGZpZ21hLmNyZWF0ZVRleHQoKTtcbiAgICAgICAgICAgIGNvbnN0IHBhbGV0dGVOdW1iZXIgPSBmaWdtYS5jcmVhdGVUZXh0KCk7XG4gICAgICAgICAgICBwYWxldHRlSGV4LmZvbnRTaXplID0gMTQ7XG4gICAgICAgICAgICBwYWxldHRlTnVtYmVyLmZvbnRTaXplID0gMTQ7XG4gICAgICAgICAgICByZWN0LnJlc2l6ZSgzNjAsIDM0KTtcbiAgICAgICAgICAgIHJlY3QueSA9IGhlYWRlclJlY3QuaGVpZ2h0ICsgKGkgKiByZWN0LmhlaWdodCk7XG4gICAgICAgICAgICBwYWxldHRlSGV4LnggPSByZWN0LndpZHRoIC0gODA7XG4gICAgICAgICAgICBwYWxldHRlSGV4LnkgPSByZWN0LnkgKyAocmVjdC5oZWlnaHQgLyAyKSAtIChwYWxldHRlSGV4LmhlaWdodCAvIDIpO1xuICAgICAgICAgICAgcGFsZXR0ZU51bWJlci54ID0gMjA7XG4gICAgICAgICAgICBwYWxldHRlTnVtYmVyLnkgPSByZWN0LnkgKyAocmVjdC5oZWlnaHQgLyAyKSAtIChwYWxldHRlTnVtYmVyLmhlaWdodCAvIDIpO1xuICAgICAgICAgICAgY29uc3QgZmlsbHMgPSBjbG9uZShyZWN0LmZpbGxzKTtcbiAgICAgICAgICAgIGZpbGxzWzBdLmNvbG9yLnIgPSBjb21wbGV0ZUNvbG9yUGFsZXR0ZVtpXS5yZ2IuciAvIDEwMDtcbiAgICAgICAgICAgIGZpbGxzWzBdLmNvbG9yLmcgPSBjb21wbGV0ZUNvbG9yUGFsZXR0ZVtpXS5yZ2IuZyAvIDEwMDtcbiAgICAgICAgICAgIGZpbGxzWzBdLmNvbG9yLmIgPSBjb21wbGV0ZUNvbG9yUGFsZXR0ZVtpXS5yZ2IuYiAvIDEwMDtcbiAgICAgICAgICAgIC8vIEdldCBjb250cmFzdCByYXRpbyB0byBzZXQgcGFsZXR0ZUhleCBjb2xvclxuICAgICAgICAgICAgcGFsZXR0ZUhleC5maWxscyA9IGhhbmRsZVRleHROb2RlQ29udHJhc3QocGFsZXR0ZUhleCwgY29tcGxldGVDb2xvclBhbGV0dGVbaV0uaGV4KTtcbiAgICAgICAgICAgIHBhbGV0dGVOdW1iZXIuZmlsbHMgPSBoYW5kbGVUZXh0Tm9kZUNvbnRyYXN0KHBhbGV0dGVIZXgsIGNvbXBsZXRlQ29sb3JQYWxldHRlW2ldLmhleCk7XG4gICAgICAgICAgICByZWN0LmZpbGxzID0gZmlsbHM7XG4gICAgICAgICAgICBwYWxldHRlSGV4LmNoYXJhY3RlcnMgPSBjb21wbGV0ZUNvbG9yUGFsZXR0ZVtpXS5oZXgudG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgIHBhbGV0dGVOdW1iZXIuY2hhcmFjdGVycyA9IGkgPiAwID8gKGkgKiAxMDApLnRvU3RyaW5nKCkgOiBcIjUwXCI7XG4gICAgICAgICAgICBjb25zdCBncm91cCA9IGZpZ21hLmdyb3VwKFtyZWN0LCBwYWxldHRlSGV4LCBwYWxldHRlTnVtYmVyXSwgZmlnbWEuY3VycmVudFBhZ2UpO1xuICAgICAgICAgICAgbm9kZXMucHVzaChncm91cCk7XG4gICAgICAgIH1cbiAgICAgICAgZmlnbWEuZ3JvdXAoWy4uLm5vZGVzXSwgZmlnbWEuY3VycmVudFBhZ2UpO1xuICAgICAgICBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24gPSBub2RlcztcbiAgICAgICAgZmlnbWEudmlld3BvcnQuc2Nyb2xsQW5kWm9vbUludG9WaWV3KG5vZGVzKTtcbiAgICB9XG4gICAgZmlnbWEuY2xvc2VQbHVnaW4oKTtcbn0pO1xuLyoqXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IHRleHQg4oCTIEZpZ21hIHRleHROb2RlIG9iamVjdFxuICogQHBhcmFtIHtzdHJpbmd9IGJhY2tncm91bmRDb2xvciDigJMgQ1NTIEhleCBjb2xvci4gRXg6ICM0NDAwNDRcbiAqXG4gKiByZXR1cm5zIEZpZ21hIHRleHROb2RlXG4gKi9cbmZ1bmN0aW9uIGhhbmRsZVRleHROb2RlQ29udHJhc3QodGV4dCwgYmFja2dyb3VuZENvbG9yKSB7XG4gICAgLy8gR2V0IGNvbnRyYXN0IHJhdGlvIHRvIHNldCB0ZXh0IGNvbG9yXG4gICAgY29uc3QgdGV4dFJHQiA9IHRleHQuZmlsbHNbMF0uY29sb3I7XG4gICAgY29uc3QgdGV4dEhleCA9IFJHQlRvSGV4KHRleHRSR0IpO1xuICAgIGNvbnN0IGNvbnRyYXN0UmF0aW8gPSBnZXRDb250cmFzdFJhdGlvKHRleHRIZXgsIGJhY2tncm91bmRDb2xvcik7XG4gICAgY29uc3QgdGV4dEZpbGxzID0gY2xvbmUodGV4dC5maWxscyk7XG4gICAgLy8gU2V0cyB0ZXh0IGNvbG9yIGlmIGNvbnRyYXN0IGlzIHRvbyBsb3dcbiAgICBpZiAoY29udHJhc3RSYXRpbyA8IDYpIHtcbiAgICAgICAgdGV4dEZpbGxzWzBdLmNvbG9yLnIgPSAxO1xuICAgICAgICB0ZXh0RmlsbHNbMF0uY29sb3IuZyA9IDE7XG4gICAgICAgIHRleHRGaWxsc1swXS5jb2xvci5iID0gMTtcbiAgICB9XG4gICAgcmV0dXJuIHRleHRGaWxscztcbn1cbmZ1bmN0aW9uIGNsb25lKHZhbCkge1xuICAgIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHZhbCkpO1xufVxuZnVuY3Rpb24gY3JlYXRlQnJpZ2h0ZXJDb2xvcnMoYmFzZUNvbG9yLCBsZW5ndGggPSA1KSB7XG4gICAgY29uc3QgbWF4U2F0dXJhdGlvbiA9IDEwMDtcbiAgICBjb25zdCBtYXhMaWdodG5lc3MgPSAxMDA7XG4gICAgbGV0IHNNb2RIb2xkZXIgPSAwO1xuICAgIGxldCBsTW9kSG9sZGVyID0gMDtcbiAgICAvLyBsZXQgaE1vZEhvbGRlciA9IDA7XG4gICAgcmV0dXJuIEFycmF5LmZyb20obmV3IEFycmF5KGxlbmd0aCksICgpID0+IHtcbiAgICAgICAgY29uc3QgeyBoLCBzLCBsIH0gPSBiYXNlQ29sb3IuaHNsO1xuICAgICAgICBpZiAoc01vZEhvbGRlciA9PT0gMCAmJiBsTW9kSG9sZGVyID09PSAwKSB7XG4gICAgICAgICAgICBjb25zdCBzRGlmZiA9IG1heFNhdHVyYXRpb24gLSBzO1xuICAgICAgICAgICAgY29uc3QgbERpZmYgPSBtYXhMaWdodG5lc3MgLSBsO1xuICAgICAgICAgICAgc01vZEhvbGRlciA9IHMgKyAoc0RpZmYgKiAwLjA1KTtcbiAgICAgICAgICAgIGxNb2RIb2xkZXIgPSBsICsgKGxEaWZmICogMC4yNSk7XG4gICAgICAgICAgICAvLyBoTW9kSG9sZGVyID0gaCArIChoICogMC4wMSkgPiAzNjAgPyAwIDogaCArIChoICogMC4wMSk7XG4gICAgICAgICAgICAvLyBoTW9kSG9sZGVyID0gaCArIDEgPiAzNjAgPyAwIDogaCArIDE7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBzRGlmZiA9IG1heFNhdHVyYXRpb24gLSBzTW9kSG9sZGVyO1xuICAgICAgICAgICAgY29uc3QgbERpZmYgPSBtYXhMaWdodG5lc3MgLSBsTW9kSG9sZGVyO1xuICAgICAgICAgICAgc01vZEhvbGRlciA9IHNNb2RIb2xkZXIgKyAoc0RpZmYgKiAwLjA1KTtcbiAgICAgICAgICAgIGxNb2RIb2xkZXIgPSBsTW9kSG9sZGVyICsgKGxEaWZmICogMC4yNSk7XG4gICAgICAgICAgICAvLyBoTW9kSG9sZGVyID0gaE1vZEhvbGRlciArIChoTW9kSG9sZGVyICogMC4wMSkgPiAzNjAgPyAwIDogaE1vZEhvbGRlciArIChoTW9kSG9sZGVyICogMC4wMSlcbiAgICAgICAgICAgIC8vIGhNb2RIb2xkZXIgPSBoTW9kSG9sZGVyICsgMSA+IDM2MCA/IDAgOiBoTW9kSG9sZGVyICsgMVxuICAgICAgICB9XG4gICAgICAgIC8vIGNvbnN0IGhNb2QgPSBoICsgaCAqIDAuMDE7XG4gICAgICAgIGNvbnN0IGhleCA9IEhTTFRvSGV4KGgsIHMsIGxNb2RIb2xkZXIpO1xuICAgICAgICAvLyBjb25zdCBoZXggPSBIU0xUb0hleChoLCBzTW9kSG9sZGVyLCBsTW9kSG9sZGVyKTtcbiAgICAgICAgLy8gY29uc3QgaGV4ID0gSFNMVG9IZXgoaE1vZEhvbGRlciwgc01vZEhvbGRlciwgbE1vZEhvbGRlcik7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZ2I6IGhleFRvUkdCKGhleCwgdHJ1ZSksXG4gICAgICAgICAgICBoc2w6IGhleFRvSFNMKGhleCksXG4gICAgICAgICAgICBoZXgsXG4gICAgICAgIH07XG4gICAgfSk7XG59XG5mdW5jdGlvbiBjcmVhdGVEYXJrZXJDb2xvcnMoYmFzZUNvbG9yLCBsZW5ndGggPSA0KSB7XG4gICAgbGV0IHNNb2RIb2xkZXIgPSAwO1xuICAgIGxldCBsTW9kSG9sZGVyID0gMDtcbiAgICBsZXQgaE1vZEhvbGRlciA9IDA7XG4gICAgcmV0dXJuIEFycmF5LmZyb20obmV3IEFycmF5KGxlbmd0aCksICgpID0+IHtcbiAgICAgICAgY29uc3QgeyBoLCBzLCBsIH0gPSBiYXNlQ29sb3IuaHNsO1xuICAgICAgICBpZiAoc01vZEhvbGRlciA9PT0gMCAmJiBsTW9kSG9sZGVyID09PSAwKSB7XG4gICAgICAgICAgICBzTW9kSG9sZGVyID0gcyAtIChzICogMC4yKTtcbiAgICAgICAgICAgIGxNb2RIb2xkZXIgPSBsIC0gKGwgKiAwLjE1KTtcbiAgICAgICAgICAgIGhNb2RIb2xkZXIgPSBoIC0gKGggKiAwLjAyKSA8IDAgPyAzNjAgOiBoIC0gKGggKiAwLjAyKTtcbiAgICAgICAgICAgIC8vIGhNb2RIb2xkZXIgPSBoIC0gMSA8IDAgPyAzNjAgOiBoIC0gMTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHNNb2RIb2xkZXIgPSBzTW9kSG9sZGVyIC0gKHNNb2RIb2xkZXIgKiAwLjEpO1xuICAgICAgICAgICAgLy8gc01vZEhvbGRlciA9IHNNb2RIb2xkZXIgLSAoc01vZEhvbGRlciAqIDAuMTUpO1xuICAgICAgICAgICAgLy8gbE1vZEhvbGRlciA9IGxNb2RIb2xkZXIgLSAobE1vZEhvbGRlciAqIDAuMSk7XG4gICAgICAgICAgICBsTW9kSG9sZGVyID0gbE1vZEhvbGRlciAtIChsTW9kSG9sZGVyICogMC4xNSk7XG4gICAgICAgICAgICBoTW9kSG9sZGVyID0gaE1vZEhvbGRlciAtIChoTW9kSG9sZGVyICogMC4wMikgPCAwID8gMzYwIDogaE1vZEhvbGRlciAtIChoTW9kSG9sZGVyICogMC4wMik7XG4gICAgICAgICAgICAvLyBoTW9kSG9sZGVyID0gaE1vZEhvbGRlciAtIDEgPCAwID8gMzYwIDogaE1vZEhvbGRlciAtIDE7XG4gICAgICAgIH1cbiAgICAgICAgLy8gY29uc3QgaE1vZCA9IGggLSAxO1xuICAgICAgICAvLyBjb25zdCBoTW9kID0gaCAtIGggKiAwLjAxO1xuICAgICAgICBjb25zdCBoZXggPSBIU0xUb0hleChoTW9kSG9sZGVyLCBzTW9kSG9sZGVyLCBsTW9kSG9sZGVyKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJnYjogaGV4VG9SR0IoaGV4LCB0cnVlKSxcbiAgICAgICAgICAgIGhzbDogaGV4VG9IU0woaGV4KSxcbiAgICAgICAgICAgIGhleCxcbiAgICAgICAgfTtcbiAgICB9KTtcbn1cbi8vIGh0dHBzOi8vY3NzLXRyaWNrcy5jb20vY29udmVydGluZy1jb2xvci1zcGFjZXMtaW4tamF2YXNjcmlwdC9cbmZ1bmN0aW9uIGhleFRvUkdCKEgsIGlzUGN0ID0gZmFsc2UpIHtcbiAgICBsZXQgciA9IDAsIGcgPSAwLCBiID0gMDtcbiAgICBpZiAoSC5sZW5ndGggPT0gNCkge1xuICAgICAgICByID0gXCIweFwiICsgSFsxXSArIEhbMV07XG4gICAgICAgIGcgPSBcIjB4XCIgKyBIWzJdICsgSFsyXTtcbiAgICAgICAgYiA9IFwiMHhcIiArIEhbM10gKyBIWzNdO1xuICAgIH1cbiAgICBlbHNlIGlmIChILmxlbmd0aCA9PSA3KSB7XG4gICAgICAgIHIgPSBcIjB4XCIgKyBIWzFdICsgSFsyXTtcbiAgICAgICAgZyA9IFwiMHhcIiArIEhbM10gKyBIWzRdO1xuICAgICAgICBiID0gXCIweFwiICsgSFs1XSArIEhbNl07XG4gICAgfVxuICAgIGlmIChpc1BjdCkge1xuICAgICAgICByID0gKyhyIC8gMjU1ICogMTAwKS50b0ZpeGVkKDEpO1xuICAgICAgICBnID0gKyhnIC8gMjU1ICogMTAwKS50b0ZpeGVkKDEpO1xuICAgICAgICBiID0gKyhiIC8gMjU1ICogMTAwKS50b0ZpeGVkKDEpO1xuICAgIH1cbiAgICByZXR1cm4geyByLCBnLCBiLCBzdHJpbmc6IFwicmdiKFwiICsgKGlzUGN0ID8gciArIFwiJSxcIiArIGcgKyBcIiUsXCIgKyBiICsgXCIlXCIgOiArciArIFwiLFwiICsgK2cgKyBcIixcIiArICtiKSArIFwiKVwiIH07XG59XG5mdW5jdGlvbiBoZXhUb0hTTChIKSB7XG4gICAgLy8gQ29udmVydCBoZXggdG8gUkdCIGZpcnN0XG4gICAgY29uc3QgUkdCID0gaGV4VG9SR0IoSCk7XG4gICAgbGV0IHsgciwgZywgYiB9ID0gUkdCO1xuICAgIC8vIFRoZW4gdG8gSFNMXG4gICAgciAvPSAyNTU7XG4gICAgZyAvPSAyNTU7XG4gICAgYiAvPSAyNTU7XG4gICAgbGV0IGNtaW4gPSBNYXRoLm1pbihyLCBnLCBiKSwgY21heCA9IE1hdGgubWF4KHIsIGcsIGIpLCBkZWx0YSA9IGNtYXggLSBjbWluLCBoID0gMCwgcyA9IDAsIGwgPSAwO1xuICAgIGlmIChkZWx0YSA9PSAwKVxuICAgICAgICBoID0gMDtcbiAgICBlbHNlIGlmIChjbWF4ID09IHIpXG4gICAgICAgIGggPSAoKGcgLSBiKSAvIGRlbHRhKSAlIDY7XG4gICAgZWxzZSBpZiAoY21heCA9PSBnKVxuICAgICAgICBoID0gKGIgLSByKSAvIGRlbHRhICsgMjtcbiAgICBlbHNlXG4gICAgICAgIGggPSAociAtIGcpIC8gZGVsdGEgKyA0O1xuICAgIGggPSBNYXRoLnJvdW5kKGggKiA2MCk7XG4gICAgaWYgKGggPCAwKVxuICAgICAgICBoICs9IDM2MDtcbiAgICBsID0gKGNtYXggKyBjbWluKSAvIDI7XG4gICAgcyA9IGRlbHRhID09IDAgPyAwIDogZGVsdGEgLyAoMSAtIE1hdGguYWJzKDIgKiBsIC0gMSkpO1xuICAgIHMgPSArKHMgKiAxMDApLnRvRml4ZWQoMSk7XG4gICAgbCA9ICsobCAqIDEwMCkudG9GaXhlZCgxKTtcbiAgICByZXR1cm4geyBoLCBzLCBsLCBzdHJpbmc6IFwiaHNsKFwiICsgaCArIFwiLFwiICsgcyArIFwiJSxcIiArIGwgKyBcIiUpXCIgfTtcbn1cbmZ1bmN0aW9uIEhTTFRvSGV4KGgsIHMsIGwpIHtcbiAgICBzIC89IDEwMDtcbiAgICBsIC89IDEwMDtcbiAgICBsZXQgYyA9ICgxIC0gTWF0aC5hYnMoMiAqIGwgLSAxKSkgKiBzLCB4ID0gYyAqICgxIC0gTWF0aC5hYnMoKGggLyA2MCkgJSAyIC0gMSkpLCBtID0gbCAtIGMgLyAyLCByID0gMCwgZyA9IDAsIGIgPSAwO1xuICAgIGlmICgwIDw9IGggJiYgaCA8IDYwKSB7XG4gICAgICAgIHIgPSBjO1xuICAgICAgICBnID0geDtcbiAgICAgICAgYiA9IDA7XG4gICAgfVxuICAgIGVsc2UgaWYgKDYwIDw9IGggJiYgaCA8IDEyMCkge1xuICAgICAgICByID0geDtcbiAgICAgICAgZyA9IGM7XG4gICAgICAgIGIgPSAwO1xuICAgIH1cbiAgICBlbHNlIGlmICgxMjAgPD0gaCAmJiBoIDwgMTgwKSB7XG4gICAgICAgIHIgPSAwO1xuICAgICAgICBnID0gYztcbiAgICAgICAgYiA9IHg7XG4gICAgfVxuICAgIGVsc2UgaWYgKDE4MCA8PSBoICYmIGggPCAyNDApIHtcbiAgICAgICAgciA9IDA7XG4gICAgICAgIGcgPSB4O1xuICAgICAgICBiID0gYztcbiAgICB9XG4gICAgZWxzZSBpZiAoMjQwIDw9IGggJiYgaCA8IDMwMCkge1xuICAgICAgICByID0geDtcbiAgICAgICAgZyA9IDA7XG4gICAgICAgIGIgPSBjO1xuICAgIH1cbiAgICBlbHNlIGlmICgzMDAgPD0gaCAmJiBoIDwgMzYwKSB7XG4gICAgICAgIHIgPSBjO1xuICAgICAgICBnID0gMDtcbiAgICAgICAgYiA9IHg7XG4gICAgfVxuICAgIC8vIEhhdmluZyBvYnRhaW5lZCBSR0IsIGNvbnZlcnQgY2hhbm5lbHMgdG8gaGV4XG4gICAgciA9IE1hdGgucm91bmQoKHIgKyBtKSAqIDI1NSkudG9TdHJpbmcoMTYpO1xuICAgIGcgPSBNYXRoLnJvdW5kKChnICsgbSkgKiAyNTUpLnRvU3RyaW5nKDE2KTtcbiAgICBiID0gTWF0aC5yb3VuZCgoYiArIG0pICogMjU1KS50b1N0cmluZygxNik7XG4gICAgLy8gUHJlcGVuZCAwcywgaWYgbmVjZXNzYXJ5XG4gICAgaWYgKHIubGVuZ3RoID09IDEpXG4gICAgICAgIHIgPSBcIjBcIiArIHI7XG4gICAgaWYgKGcubGVuZ3RoID09IDEpXG4gICAgICAgIGcgPSBcIjBcIiArIGc7XG4gICAgaWYgKGIubGVuZ3RoID09IDEpXG4gICAgICAgIGIgPSBcIjBcIiArIGI7XG4gICAgcmV0dXJuIFwiI1wiICsgciArIGcgKyBiO1xufVxuLyoqXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IFJHQiBFeHBlY3RzIGFuIG9iamVjdCBvZiByLCBnLCBiXG4gKiBleDoge1xuICogIHI6IDIwLFxuICogIGc6IDE3NyxcbiAqICBiOiAxNjFcbiAqIH1cbiAqL1xuZnVuY3Rpb24gUkdCVG9IZXgoUkdCKSB7XG4gICAgbGV0IHsgciwgZywgYiB9ID0gUkdCO1xuICAgIHIgPSByLnRvU3RyaW5nKDE2KTtcbiAgICBnID0gZy50b1N0cmluZygxNik7XG4gICAgYiA9IGIudG9TdHJpbmcoMTYpO1xuICAgIGlmIChyLmxlbmd0aCA9PSAxKVxuICAgICAgICByID0gXCIwXCIgKyByO1xuICAgIGlmIChnLmxlbmd0aCA9PSAxKVxuICAgICAgICBnID0gXCIwXCIgKyBnO1xuICAgIGlmIChiLmxlbmd0aCA9PSAxKVxuICAgICAgICBiID0gXCIwXCIgKyBiO1xuICAgIHJldHVybiBcIiNcIiArIHIgKyBnICsgYjtcbn1cbi8vIEZ1bmN0aW9ucyBwaWNrZWQgYW5kIGFkanVzdGVkIGZyb20gXG4vLyBodHRwczovL2dpdGh1Yi5jb20vbXVpLW9yZy9tYXRlcmlhbC11aS9ibG9iL21hc3Rlci9wYWNrYWdlcy9tYXRlcmlhbC11aS9zcmMvc3R5bGVzL2NvbG9yTWFuaXB1bGF0b3IuanNcbi8qKlxuICogVGhlIHJlbGF0aXZlIGJyaWdodG5lc3Mgb2YgYW55IHBvaW50IGluIGEgY29sb3Igc3BhY2UsXG4gKiBub3JtYWxpemVkIHRvIDAgZm9yIGRhcmtlc3QgYmxhY2sgYW5kIDEgZm9yIGxpZ2h0ZXN0IHdoaXRlLlxuICogQHBhcmFtIHtzdHJpbmd9IGhleCDigJMgZXg6ICNGMDQ2M0NcbiAqL1xuZnVuY3Rpb24gZ2V0THVtaW5hbmNlKGhleCkge1xuICAgIGNvbnN0IHJnYiA9IGhleFRvUkdCKGhleCk7XG4gICAgY29uc3QgcmdiVmFsID0gW3JnYi5yLCByZ2IuZywgcmdiLmJdLm1hcCh2YWwgPT4ge1xuICAgICAgICB2YWwgLz0gMjU1OyAvLyBub3JtYWxpemVkXG4gICAgICAgIHJldHVybiB2YWwgPD0gMC4wMzkyOCA/IHZhbCAvIDEyLjkyIDogTWF0aC5wb3coKCh2YWwgKyAwLjA1NSkgLyAxLjA1NSksIDIuNCk7XG4gICAgfSk7XG4gICAgLy8gVHJ1bmNhdGUgYXQgMyBkaWdpdHNcbiAgICByZXR1cm4gTnVtYmVyKCgwLjIxMjYgKiByZ2JWYWxbMF0gKyAwLjcxNTIgKiByZ2JWYWxbMV0gKyAwLjA3MjIgKiByZ2JWYWxbMl0pLnRvRml4ZWQoMykpO1xufVxuLyoqXG4gKiBDYWxjdWxhdGVzIHRoZSBjb250cmFzdCByYXRpbyBiZXR3ZWVuIHR3byBjb2xvcnMuXG4gKiBGb3JtdWxhOiBodHRwczovL3d3dy53My5vcmcvVFIvV0NBRzIwLVRFQ0hTL0cxNy5odG1sI0cxNy10ZXN0c1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBmb3JlZ3JvdW5kIC0gZXg6ICNGMDQ2M0NcbiAqIEBwYXJhbSB7c3RyaW5nfSBiYWNrZ3JvdW5kIC0gZXg6ICMyMTIxMjZcbiAqIEByZXR1cm5zIHtudW1iZXJ9IEEgY29udHJhc3QgcmF0aW8gdmFsdWUgaW4gdGhlIHJhbmdlIDAgLSAyMS5cbiAqL1xuZnVuY3Rpb24gZ2V0Q29udHJhc3RSYXRpbyhmb3JlZ3JvdW5kLCBiYWNrZ3JvdW5kKSB7XG4gICAgY29uc3QgbHVtQSA9IGdldEx1bWluYW5jZShmb3JlZ3JvdW5kKTtcbiAgICBjb25zdCBsdW1CID0gZ2V0THVtaW5hbmNlKGJhY2tncm91bmQpO1xuICAgIHJldHVybiAoTWF0aC5tYXgobHVtQSwgbHVtQikgKyAwLjA1KSAvIChNYXRoLm1pbihsdW1BLCBsdW1CKSArIDAuMDUpO1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==