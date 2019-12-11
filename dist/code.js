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

figma.showUI(__html__);
figma.ui.onmessage = msg => {
    if (msg.type === 'create-palette') {
        const nodes = [];
        // const parent = figma.createComponent()
        let selectedColor = msg.value;
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
        console.log("brighterColors", brighterColors);
        console.log("darkerColors", darkerColors);
        console.log("completeColorPalette", completeColorPalette);
        for (let i = 0; i < completeColorPalette.length; i++) {
            const rect = figma.createRectangle();
            rect.resize(360, 34);
            rect.y = i * rect.height;
            const fills = clone(rect.fills);
            fills[0].color.r = completeColorPalette[i].rgb.r / 100;
            fills[0].color.g = completeColorPalette[i].rgb.g / 100;
            fills[0].color.b = completeColorPalette[i].rgb.b / 100;
            rect.fills = fills;
            figma.currentPage.appendChild(rect);
            nodes.push(rect);
        }
        figma.currentPage.selection = nodes;
        figma.viewport.scrollAndZoomIntoView(nodes);
    }
    figma.closePlugin();
};
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
            lModHolder = l + (lDiff * 0.2);
            // hModHolder = h + (h * 0.01) > 360 ? 0 : h + (h * 0.01);
            // hModHolder = h + 1 > 360 ? 0 : h + 1;
        }
        else {
            const sDiff = maxSaturation - sModHolder;
            const lDiff = maxLightness - lModHolder;
            sModHolder = sModHolder + (sDiff * 0.05);
            lModHolder = lModHolder + (lDiff * 0.2);
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


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0RBQTBDLGdDQUFnQztBQUMxRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdFQUF3RCxrQkFBa0I7QUFDMUU7QUFDQSx5REFBaUQsY0FBYztBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQXlDLGlDQUFpQztBQUMxRSx3SEFBZ0gsbUJBQW1CLEVBQUU7QUFDckk7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7O0FBR0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixpQ0FBaUM7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsVUFBVTtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFVBQVU7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLFVBQVU7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiY29kZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2NvZGUudHNcIik7XG4iLCJmaWdtYS5zaG93VUkoX19odG1sX18pO1xuZmlnbWEudWkub25tZXNzYWdlID0gbXNnID0+IHtcbiAgICBpZiAobXNnLnR5cGUgPT09ICdjcmVhdGUtcGFsZXR0ZScpIHtcbiAgICAgICAgY29uc3Qgbm9kZXMgPSBbXTtcbiAgICAgICAgLy8gY29uc3QgcGFyZW50ID0gZmlnbWEuY3JlYXRlQ29tcG9uZW50KClcbiAgICAgICAgbGV0IHNlbGVjdGVkQ29sb3IgPSBtc2cudmFsdWU7XG4gICAgICAgIGNvbnN0IGJhc2VDb2xvciA9IHtcbiAgICAgICAgICAgIHJnYjogaGV4VG9SR0Ioc2VsZWN0ZWRDb2xvciwgdHJ1ZSksXG4gICAgICAgICAgICBoc2w6IGhleFRvSFNMKHNlbGVjdGVkQ29sb3IpLFxuICAgICAgICAgICAgaGV4OiBzZWxlY3RlZENvbG9yLFxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBicmlnaHRlckNvbG9ycyA9IGNyZWF0ZUJyaWdodGVyQ29sb3JzKGJhc2VDb2xvcikucmV2ZXJzZSgpO1xuICAgICAgICBjb25zdCBkYXJrZXJDb2xvcnMgPSBjcmVhdGVEYXJrZXJDb2xvcnMoYmFzZUNvbG9yKTtcbiAgICAgICAgY29uc3QgY29tcGxldGVDb2xvclBhbGV0dGUgPSBbXG4gICAgICAgICAgICAuLi5icmlnaHRlckNvbG9ycyxcbiAgICAgICAgICAgIGJhc2VDb2xvcixcbiAgICAgICAgICAgIC4uLmRhcmtlckNvbG9ycyxcbiAgICAgICAgXTtcbiAgICAgICAgY29uc29sZS5sb2coXCJicmlnaHRlckNvbG9yc1wiLCBicmlnaHRlckNvbG9ycyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiZGFya2VyQ29sb3JzXCIsIGRhcmtlckNvbG9ycyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiY29tcGxldGVDb2xvclBhbGV0dGVcIiwgY29tcGxldGVDb2xvclBhbGV0dGUpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbXBsZXRlQ29sb3JQYWxldHRlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCByZWN0ID0gZmlnbWEuY3JlYXRlUmVjdGFuZ2xlKCk7XG4gICAgICAgICAgICByZWN0LnJlc2l6ZSgzNjAsIDM0KTtcbiAgICAgICAgICAgIHJlY3QueSA9IGkgKiByZWN0LmhlaWdodDtcbiAgICAgICAgICAgIGNvbnN0IGZpbGxzID0gY2xvbmUocmVjdC5maWxscyk7XG4gICAgICAgICAgICBmaWxsc1swXS5jb2xvci5yID0gY29tcGxldGVDb2xvclBhbGV0dGVbaV0ucmdiLnIgLyAxMDA7XG4gICAgICAgICAgICBmaWxsc1swXS5jb2xvci5nID0gY29tcGxldGVDb2xvclBhbGV0dGVbaV0ucmdiLmcgLyAxMDA7XG4gICAgICAgICAgICBmaWxsc1swXS5jb2xvci5iID0gY29tcGxldGVDb2xvclBhbGV0dGVbaV0ucmdiLmIgLyAxMDA7XG4gICAgICAgICAgICByZWN0LmZpbGxzID0gZmlsbHM7XG4gICAgICAgICAgICBmaWdtYS5jdXJyZW50UGFnZS5hcHBlbmRDaGlsZChyZWN0KTtcbiAgICAgICAgICAgIG5vZGVzLnB1c2gocmVjdCk7XG4gICAgICAgIH1cbiAgICAgICAgZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uID0gbm9kZXM7XG4gICAgICAgIGZpZ21hLnZpZXdwb3J0LnNjcm9sbEFuZFpvb21JbnRvVmlldyhub2Rlcyk7XG4gICAgfVxuICAgIGZpZ21hLmNsb3NlUGx1Z2luKCk7XG59O1xuZnVuY3Rpb24gY2xvbmUodmFsKSB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodmFsKSk7XG59XG5mdW5jdGlvbiBjcmVhdGVCcmlnaHRlckNvbG9ycyhiYXNlQ29sb3IsIGxlbmd0aCA9IDUpIHtcbiAgICBjb25zdCBtYXhTYXR1cmF0aW9uID0gMTAwO1xuICAgIGNvbnN0IG1heExpZ2h0bmVzcyA9IDEwMDtcbiAgICBsZXQgc01vZEhvbGRlciA9IDA7XG4gICAgbGV0IGxNb2RIb2xkZXIgPSAwO1xuICAgIC8vIGxldCBoTW9kSG9sZGVyID0gMDtcbiAgICByZXR1cm4gQXJyYXkuZnJvbShuZXcgQXJyYXkobGVuZ3RoKSwgKCkgPT4ge1xuICAgICAgICBjb25zdCB7IGgsIHMsIGwgfSA9IGJhc2VDb2xvci5oc2w7XG4gICAgICAgIGlmIChzTW9kSG9sZGVyID09PSAwICYmIGxNb2RIb2xkZXIgPT09IDApIHtcbiAgICAgICAgICAgIGNvbnN0IHNEaWZmID0gbWF4U2F0dXJhdGlvbiAtIHM7XG4gICAgICAgICAgICBjb25zdCBsRGlmZiA9IG1heExpZ2h0bmVzcyAtIGw7XG4gICAgICAgICAgICBzTW9kSG9sZGVyID0gcyArIChzRGlmZiAqIDAuMDUpO1xuICAgICAgICAgICAgbE1vZEhvbGRlciA9IGwgKyAobERpZmYgKiAwLjIpO1xuICAgICAgICAgICAgLy8gaE1vZEhvbGRlciA9IGggKyAoaCAqIDAuMDEpID4gMzYwID8gMCA6IGggKyAoaCAqIDAuMDEpO1xuICAgICAgICAgICAgLy8gaE1vZEhvbGRlciA9IGggKyAxID4gMzYwID8gMCA6IGggKyAxO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3Qgc0RpZmYgPSBtYXhTYXR1cmF0aW9uIC0gc01vZEhvbGRlcjtcbiAgICAgICAgICAgIGNvbnN0IGxEaWZmID0gbWF4TGlnaHRuZXNzIC0gbE1vZEhvbGRlcjtcbiAgICAgICAgICAgIHNNb2RIb2xkZXIgPSBzTW9kSG9sZGVyICsgKHNEaWZmICogMC4wNSk7XG4gICAgICAgICAgICBsTW9kSG9sZGVyID0gbE1vZEhvbGRlciArIChsRGlmZiAqIDAuMik7XG4gICAgICAgICAgICAvLyBoTW9kSG9sZGVyID0gaE1vZEhvbGRlciArIChoTW9kSG9sZGVyICogMC4wMSkgPiAzNjAgPyAwIDogaE1vZEhvbGRlciArIChoTW9kSG9sZGVyICogMC4wMSlcbiAgICAgICAgICAgIC8vIGhNb2RIb2xkZXIgPSBoTW9kSG9sZGVyICsgMSA+IDM2MCA/IDAgOiBoTW9kSG9sZGVyICsgMVxuICAgICAgICB9XG4gICAgICAgIC8vIGNvbnN0IGhNb2QgPSBoICsgaCAqIDAuMDE7XG4gICAgICAgIGNvbnN0IGhleCA9IEhTTFRvSGV4KGgsIHMsIGxNb2RIb2xkZXIpO1xuICAgICAgICAvLyBjb25zdCBoZXggPSBIU0xUb0hleChoLCBzTW9kSG9sZGVyLCBsTW9kSG9sZGVyKTtcbiAgICAgICAgLy8gY29uc3QgaGV4ID0gSFNMVG9IZXgoaE1vZEhvbGRlciwgc01vZEhvbGRlciwgbE1vZEhvbGRlcik7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZ2I6IGhleFRvUkdCKGhleCwgdHJ1ZSksXG4gICAgICAgICAgICBoc2w6IGhleFRvSFNMKGhleCksXG4gICAgICAgICAgICBoZXgsXG4gICAgICAgIH07XG4gICAgfSk7XG59XG5mdW5jdGlvbiBjcmVhdGVEYXJrZXJDb2xvcnMoYmFzZUNvbG9yLCBsZW5ndGggPSA0KSB7XG4gICAgbGV0IHNNb2RIb2xkZXIgPSAwO1xuICAgIGxldCBsTW9kSG9sZGVyID0gMDtcbiAgICBsZXQgaE1vZEhvbGRlciA9IDA7XG4gICAgcmV0dXJuIEFycmF5LmZyb20obmV3IEFycmF5KGxlbmd0aCksICgpID0+IHtcbiAgICAgICAgY29uc3QgeyBoLCBzLCBsIH0gPSBiYXNlQ29sb3IuaHNsO1xuICAgICAgICBpZiAoc01vZEhvbGRlciA9PT0gMCAmJiBsTW9kSG9sZGVyID09PSAwKSB7XG4gICAgICAgICAgICBzTW9kSG9sZGVyID0gcyAtIChzICogMC4yKTtcbiAgICAgICAgICAgIGxNb2RIb2xkZXIgPSBsIC0gKGwgKiAwLjE1KTtcbiAgICAgICAgICAgIGhNb2RIb2xkZXIgPSBoIC0gKGggKiAwLjAyKSA8IDAgPyAzNjAgOiBoIC0gKGggKiAwLjAyKTtcbiAgICAgICAgICAgIC8vIGhNb2RIb2xkZXIgPSBoIC0gMSA8IDAgPyAzNjAgOiBoIC0gMTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHNNb2RIb2xkZXIgPSBzTW9kSG9sZGVyIC0gKHNNb2RIb2xkZXIgKiAwLjEpO1xuICAgICAgICAgICAgLy8gc01vZEhvbGRlciA9IHNNb2RIb2xkZXIgLSAoc01vZEhvbGRlciAqIDAuMTUpO1xuICAgICAgICAgICAgLy8gbE1vZEhvbGRlciA9IGxNb2RIb2xkZXIgLSAobE1vZEhvbGRlciAqIDAuMSk7XG4gICAgICAgICAgICBsTW9kSG9sZGVyID0gbE1vZEhvbGRlciAtIChsTW9kSG9sZGVyICogMC4xNSk7XG4gICAgICAgICAgICBoTW9kSG9sZGVyID0gaE1vZEhvbGRlciAtIChoTW9kSG9sZGVyICogMC4wMikgPCAwID8gMzYwIDogaE1vZEhvbGRlciAtIChoTW9kSG9sZGVyICogMC4wMik7XG4gICAgICAgICAgICAvLyBoTW9kSG9sZGVyID0gaE1vZEhvbGRlciAtIDEgPCAwID8gMzYwIDogaE1vZEhvbGRlciAtIDE7XG4gICAgICAgIH1cbiAgICAgICAgLy8gY29uc3QgaE1vZCA9IGggLSAxO1xuICAgICAgICAvLyBjb25zdCBoTW9kID0gaCAtIGggKiAwLjAxO1xuICAgICAgICBjb25zdCBoZXggPSBIU0xUb0hleChoTW9kSG9sZGVyLCBzTW9kSG9sZGVyLCBsTW9kSG9sZGVyKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJnYjogaGV4VG9SR0IoaGV4LCB0cnVlKSxcbiAgICAgICAgICAgIGhzbDogaGV4VG9IU0woaGV4KSxcbiAgICAgICAgICAgIGhleCxcbiAgICAgICAgfTtcbiAgICB9KTtcbn1cbi8vIGh0dHBzOi8vY3NzLXRyaWNrcy5jb20vY29udmVydGluZy1jb2xvci1zcGFjZXMtaW4tamF2YXNjcmlwdC9cbmZ1bmN0aW9uIGhleFRvUkdCKEgsIGlzUGN0ID0gZmFsc2UpIHtcbiAgICBsZXQgciA9IDAsIGcgPSAwLCBiID0gMDtcbiAgICBpZiAoSC5sZW5ndGggPT0gNCkge1xuICAgICAgICByID0gXCIweFwiICsgSFsxXSArIEhbMV07XG4gICAgICAgIGcgPSBcIjB4XCIgKyBIWzJdICsgSFsyXTtcbiAgICAgICAgYiA9IFwiMHhcIiArIEhbM10gKyBIWzNdO1xuICAgIH1cbiAgICBlbHNlIGlmIChILmxlbmd0aCA9PSA3KSB7XG4gICAgICAgIHIgPSBcIjB4XCIgKyBIWzFdICsgSFsyXTtcbiAgICAgICAgZyA9IFwiMHhcIiArIEhbM10gKyBIWzRdO1xuICAgICAgICBiID0gXCIweFwiICsgSFs1XSArIEhbNl07XG4gICAgfVxuICAgIGlmIChpc1BjdCkge1xuICAgICAgICByID0gKyhyIC8gMjU1ICogMTAwKS50b0ZpeGVkKDEpO1xuICAgICAgICBnID0gKyhnIC8gMjU1ICogMTAwKS50b0ZpeGVkKDEpO1xuICAgICAgICBiID0gKyhiIC8gMjU1ICogMTAwKS50b0ZpeGVkKDEpO1xuICAgIH1cbiAgICByZXR1cm4geyByLCBnLCBiLCBzdHJpbmc6IFwicmdiKFwiICsgKGlzUGN0ID8gciArIFwiJSxcIiArIGcgKyBcIiUsXCIgKyBiICsgXCIlXCIgOiArciArIFwiLFwiICsgK2cgKyBcIixcIiArICtiKSArIFwiKVwiIH07XG59XG5mdW5jdGlvbiBoZXhUb0hTTChIKSB7XG4gICAgLy8gQ29udmVydCBoZXggdG8gUkdCIGZpcnN0XG4gICAgY29uc3QgUkdCID0gaGV4VG9SR0IoSCk7XG4gICAgbGV0IHsgciwgZywgYiB9ID0gUkdCO1xuICAgIC8vIFRoZW4gdG8gSFNMXG4gICAgciAvPSAyNTU7XG4gICAgZyAvPSAyNTU7XG4gICAgYiAvPSAyNTU7XG4gICAgbGV0IGNtaW4gPSBNYXRoLm1pbihyLCBnLCBiKSwgY21heCA9IE1hdGgubWF4KHIsIGcsIGIpLCBkZWx0YSA9IGNtYXggLSBjbWluLCBoID0gMCwgcyA9IDAsIGwgPSAwO1xuICAgIGlmIChkZWx0YSA9PSAwKVxuICAgICAgICBoID0gMDtcbiAgICBlbHNlIGlmIChjbWF4ID09IHIpXG4gICAgICAgIGggPSAoKGcgLSBiKSAvIGRlbHRhKSAlIDY7XG4gICAgZWxzZSBpZiAoY21heCA9PSBnKVxuICAgICAgICBoID0gKGIgLSByKSAvIGRlbHRhICsgMjtcbiAgICBlbHNlXG4gICAgICAgIGggPSAociAtIGcpIC8gZGVsdGEgKyA0O1xuICAgIGggPSBNYXRoLnJvdW5kKGggKiA2MCk7XG4gICAgaWYgKGggPCAwKVxuICAgICAgICBoICs9IDM2MDtcbiAgICBsID0gKGNtYXggKyBjbWluKSAvIDI7XG4gICAgcyA9IGRlbHRhID09IDAgPyAwIDogZGVsdGEgLyAoMSAtIE1hdGguYWJzKDIgKiBsIC0gMSkpO1xuICAgIHMgPSArKHMgKiAxMDApLnRvRml4ZWQoMSk7XG4gICAgbCA9ICsobCAqIDEwMCkudG9GaXhlZCgxKTtcbiAgICByZXR1cm4geyBoLCBzLCBsLCBzdHJpbmc6IFwiaHNsKFwiICsgaCArIFwiLFwiICsgcyArIFwiJSxcIiArIGwgKyBcIiUpXCIgfTtcbn1cbmZ1bmN0aW9uIEhTTFRvSGV4KGgsIHMsIGwpIHtcbiAgICBzIC89IDEwMDtcbiAgICBsIC89IDEwMDtcbiAgICBsZXQgYyA9ICgxIC0gTWF0aC5hYnMoMiAqIGwgLSAxKSkgKiBzLCB4ID0gYyAqICgxIC0gTWF0aC5hYnMoKGggLyA2MCkgJSAyIC0gMSkpLCBtID0gbCAtIGMgLyAyLCByID0gMCwgZyA9IDAsIGIgPSAwO1xuICAgIGlmICgwIDw9IGggJiYgaCA8IDYwKSB7XG4gICAgICAgIHIgPSBjO1xuICAgICAgICBnID0geDtcbiAgICAgICAgYiA9IDA7XG4gICAgfVxuICAgIGVsc2UgaWYgKDYwIDw9IGggJiYgaCA8IDEyMCkge1xuICAgICAgICByID0geDtcbiAgICAgICAgZyA9IGM7XG4gICAgICAgIGIgPSAwO1xuICAgIH1cbiAgICBlbHNlIGlmICgxMjAgPD0gaCAmJiBoIDwgMTgwKSB7XG4gICAgICAgIHIgPSAwO1xuICAgICAgICBnID0gYztcbiAgICAgICAgYiA9IHg7XG4gICAgfVxuICAgIGVsc2UgaWYgKDE4MCA8PSBoICYmIGggPCAyNDApIHtcbiAgICAgICAgciA9IDA7XG4gICAgICAgIGcgPSB4O1xuICAgICAgICBiID0gYztcbiAgICB9XG4gICAgZWxzZSBpZiAoMjQwIDw9IGggJiYgaCA8IDMwMCkge1xuICAgICAgICByID0geDtcbiAgICAgICAgZyA9IDA7XG4gICAgICAgIGIgPSBjO1xuICAgIH1cbiAgICBlbHNlIGlmICgzMDAgPD0gaCAmJiBoIDwgMzYwKSB7XG4gICAgICAgIHIgPSBjO1xuICAgICAgICBnID0gMDtcbiAgICAgICAgYiA9IHg7XG4gICAgfVxuICAgIC8vIEhhdmluZyBvYnRhaW5lZCBSR0IsIGNvbnZlcnQgY2hhbm5lbHMgdG8gaGV4XG4gICAgciA9IE1hdGgucm91bmQoKHIgKyBtKSAqIDI1NSkudG9TdHJpbmcoMTYpO1xuICAgIGcgPSBNYXRoLnJvdW5kKChnICsgbSkgKiAyNTUpLnRvU3RyaW5nKDE2KTtcbiAgICBiID0gTWF0aC5yb3VuZCgoYiArIG0pICogMjU1KS50b1N0cmluZygxNik7XG4gICAgLy8gUHJlcGVuZCAwcywgaWYgbmVjZXNzYXJ5XG4gICAgaWYgKHIubGVuZ3RoID09IDEpXG4gICAgICAgIHIgPSBcIjBcIiArIHI7XG4gICAgaWYgKGcubGVuZ3RoID09IDEpXG4gICAgICAgIGcgPSBcIjBcIiArIGc7XG4gICAgaWYgKGIubGVuZ3RoID09IDEpXG4gICAgICAgIGIgPSBcIjBcIiArIGI7XG4gICAgcmV0dXJuIFwiI1wiICsgciArIGcgKyBiO1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==