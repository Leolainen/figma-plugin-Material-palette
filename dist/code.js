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
    return Array.from(new Array(length), () => {
        const { h, s, l } = baseColor.hsl;
        if (sModHolder === 0 && lModHolder === 0) {
            const sDiff = maxSaturation - s;
            const lDiff = maxLightness - l;
            sModHolder = s + (sDiff * 0.05);
            lModHolder = l + (lDiff * 0.2);
        }
        else {
            const sDiff = maxSaturation - sModHolder;
            const lDiff = maxLightness - lModHolder;
            sModHolder = sModHolder + (sDiff * 0.05);
            lModHolder = lModHolder + (lDiff * 0.2);
        }
        const hex = HSLToHex(h, sModHolder, lModHolder);
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
    return Array.from(new Array(length), () => {
        const { h, s, l } = baseColor.hsl;
        if (sModHolder === 0 && lModHolder === 0) {
            sModHolder = s - (s * 0.15);
            lModHolder = l - (l * 0.15);
        }
        else {
            sModHolder = sModHolder - (sModHolder * 0.15);
            lModHolder = lModHolder - (lModHolder * 0.15);
        }
        const hex = HSLToHex(h, sModHolder, lModHolder);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0RBQTBDLGdDQUFnQztBQUMxRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdFQUF3RCxrQkFBa0I7QUFDMUU7QUFDQSx5REFBaUQsY0FBYztBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQXlDLGlDQUFpQztBQUMxRSx3SEFBZ0gsbUJBQW1CLEVBQUU7QUFDckk7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7O0FBR0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixpQ0FBaUM7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFVBQVU7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFVBQVU7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsVUFBVTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJjb2RlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvY29kZS50c1wiKTtcbiIsImZpZ21hLnNob3dVSShfX2h0bWxfXyk7XG5maWdtYS51aS5vbm1lc3NhZ2UgPSBtc2cgPT4ge1xuICAgIGlmIChtc2cudHlwZSA9PT0gJ2NyZWF0ZS1wYWxldHRlJykge1xuICAgICAgICBjb25zdCBub2RlcyA9IFtdO1xuICAgICAgICAvLyBjb25zdCBwYXJlbnQgPSBmaWdtYS5jcmVhdGVDb21wb25lbnQoKVxuICAgICAgICBsZXQgc2VsZWN0ZWRDb2xvciA9IG1zZy52YWx1ZTtcbiAgICAgICAgY29uc3QgYmFzZUNvbG9yID0ge1xuICAgICAgICAgICAgcmdiOiBoZXhUb1JHQihzZWxlY3RlZENvbG9yLCB0cnVlKSxcbiAgICAgICAgICAgIGhzbDogaGV4VG9IU0woc2VsZWN0ZWRDb2xvciksXG4gICAgICAgICAgICBoZXg6IHNlbGVjdGVkQ29sb3IsXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGJyaWdodGVyQ29sb3JzID0gY3JlYXRlQnJpZ2h0ZXJDb2xvcnMoYmFzZUNvbG9yKS5yZXZlcnNlKCk7XG4gICAgICAgIGNvbnN0IGRhcmtlckNvbG9ycyA9IGNyZWF0ZURhcmtlckNvbG9ycyhiYXNlQ29sb3IpO1xuICAgICAgICBjb25zdCBjb21wbGV0ZUNvbG9yUGFsZXR0ZSA9IFtcbiAgICAgICAgICAgIC4uLmJyaWdodGVyQ29sb3JzLFxuICAgICAgICAgICAgYmFzZUNvbG9yLFxuICAgICAgICAgICAgLi4uZGFya2VyQ29sb3JzLFxuICAgICAgICBdO1xuICAgICAgICBjb25zb2xlLmxvZyhcImJyaWdodGVyQ29sb3JzXCIsIGJyaWdodGVyQ29sb3JzKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJkYXJrZXJDb2xvcnNcIiwgZGFya2VyQ29sb3JzKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJjb21wbGV0ZUNvbG9yUGFsZXR0ZVwiLCBjb21wbGV0ZUNvbG9yUGFsZXR0ZSk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29tcGxldGVDb2xvclBhbGV0dGUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHJlY3QgPSBmaWdtYS5jcmVhdGVSZWN0YW5nbGUoKTtcbiAgICAgICAgICAgIHJlY3QucmVzaXplKDM2MCwgMzQpO1xuICAgICAgICAgICAgcmVjdC55ID0gaSAqIHJlY3QuaGVpZ2h0O1xuICAgICAgICAgICAgY29uc3QgZmlsbHMgPSBjbG9uZShyZWN0LmZpbGxzKTtcbiAgICAgICAgICAgIGZpbGxzWzBdLmNvbG9yLnIgPSBjb21wbGV0ZUNvbG9yUGFsZXR0ZVtpXS5yZ2IuciAvIDEwMDtcbiAgICAgICAgICAgIGZpbGxzWzBdLmNvbG9yLmcgPSBjb21wbGV0ZUNvbG9yUGFsZXR0ZVtpXS5yZ2IuZyAvIDEwMDtcbiAgICAgICAgICAgIGZpbGxzWzBdLmNvbG9yLmIgPSBjb21wbGV0ZUNvbG9yUGFsZXR0ZVtpXS5yZ2IuYiAvIDEwMDtcbiAgICAgICAgICAgIHJlY3QuZmlsbHMgPSBmaWxscztcbiAgICAgICAgICAgIGZpZ21hLmN1cnJlbnRQYWdlLmFwcGVuZENoaWxkKHJlY3QpO1xuICAgICAgICAgICAgbm9kZXMucHVzaChyZWN0KTtcbiAgICAgICAgfVxuICAgICAgICBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24gPSBub2RlcztcbiAgICAgICAgZmlnbWEudmlld3BvcnQuc2Nyb2xsQW5kWm9vbUludG9WaWV3KG5vZGVzKTtcbiAgICB9XG4gICAgZmlnbWEuY2xvc2VQbHVnaW4oKTtcbn07XG5mdW5jdGlvbiBjbG9uZSh2YWwpIHtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh2YWwpKTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZUJyaWdodGVyQ29sb3JzKGJhc2VDb2xvciwgbGVuZ3RoID0gNSkge1xuICAgIGNvbnN0IG1heFNhdHVyYXRpb24gPSAxMDA7XG4gICAgY29uc3QgbWF4TGlnaHRuZXNzID0gMTAwO1xuICAgIGxldCBzTW9kSG9sZGVyID0gMDtcbiAgICBsZXQgbE1vZEhvbGRlciA9IDA7XG4gICAgcmV0dXJuIEFycmF5LmZyb20obmV3IEFycmF5KGxlbmd0aCksICgpID0+IHtcbiAgICAgICAgY29uc3QgeyBoLCBzLCBsIH0gPSBiYXNlQ29sb3IuaHNsO1xuICAgICAgICBpZiAoc01vZEhvbGRlciA9PT0gMCAmJiBsTW9kSG9sZGVyID09PSAwKSB7XG4gICAgICAgICAgICBjb25zdCBzRGlmZiA9IG1heFNhdHVyYXRpb24gLSBzO1xuICAgICAgICAgICAgY29uc3QgbERpZmYgPSBtYXhMaWdodG5lc3MgLSBsO1xuICAgICAgICAgICAgc01vZEhvbGRlciA9IHMgKyAoc0RpZmYgKiAwLjA1KTtcbiAgICAgICAgICAgIGxNb2RIb2xkZXIgPSBsICsgKGxEaWZmICogMC4yKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHNEaWZmID0gbWF4U2F0dXJhdGlvbiAtIHNNb2RIb2xkZXI7XG4gICAgICAgICAgICBjb25zdCBsRGlmZiA9IG1heExpZ2h0bmVzcyAtIGxNb2RIb2xkZXI7XG4gICAgICAgICAgICBzTW9kSG9sZGVyID0gc01vZEhvbGRlciArIChzRGlmZiAqIDAuMDUpO1xuICAgICAgICAgICAgbE1vZEhvbGRlciA9IGxNb2RIb2xkZXIgKyAobERpZmYgKiAwLjIpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGhleCA9IEhTTFRvSGV4KGgsIHNNb2RIb2xkZXIsIGxNb2RIb2xkZXIpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmdiOiBoZXhUb1JHQihoZXgsIHRydWUpLFxuICAgICAgICAgICAgaHNsOiBoZXhUb0hTTChoZXgpLFxuICAgICAgICAgICAgaGV4LFxuICAgICAgICB9O1xuICAgIH0pO1xufVxuZnVuY3Rpb24gY3JlYXRlRGFya2VyQ29sb3JzKGJhc2VDb2xvciwgbGVuZ3RoID0gNCkge1xuICAgIGxldCBzTW9kSG9sZGVyID0gMDtcbiAgICBsZXQgbE1vZEhvbGRlciA9IDA7XG4gICAgcmV0dXJuIEFycmF5LmZyb20obmV3IEFycmF5KGxlbmd0aCksICgpID0+IHtcbiAgICAgICAgY29uc3QgeyBoLCBzLCBsIH0gPSBiYXNlQ29sb3IuaHNsO1xuICAgICAgICBpZiAoc01vZEhvbGRlciA9PT0gMCAmJiBsTW9kSG9sZGVyID09PSAwKSB7XG4gICAgICAgICAgICBzTW9kSG9sZGVyID0gcyAtIChzICogMC4xNSk7XG4gICAgICAgICAgICBsTW9kSG9sZGVyID0gbCAtIChsICogMC4xNSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzTW9kSG9sZGVyID0gc01vZEhvbGRlciAtIChzTW9kSG9sZGVyICogMC4xNSk7XG4gICAgICAgICAgICBsTW9kSG9sZGVyID0gbE1vZEhvbGRlciAtIChsTW9kSG9sZGVyICogMC4xNSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgaGV4ID0gSFNMVG9IZXgoaCwgc01vZEhvbGRlciwgbE1vZEhvbGRlcik7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZ2I6IGhleFRvUkdCKGhleCwgdHJ1ZSksXG4gICAgICAgICAgICBoc2w6IGhleFRvSFNMKGhleCksXG4gICAgICAgICAgICBoZXgsXG4gICAgICAgIH07XG4gICAgfSk7XG59XG4vLyBodHRwczovL2Nzcy10cmlja3MuY29tL2NvbnZlcnRpbmctY29sb3Itc3BhY2VzLWluLWphdmFzY3JpcHQvXG5mdW5jdGlvbiBoZXhUb1JHQihILCBpc1BjdCA9IGZhbHNlKSB7XG4gICAgbGV0IHIgPSAwLCBnID0gMCwgYiA9IDA7XG4gICAgaWYgKEgubGVuZ3RoID09IDQpIHtcbiAgICAgICAgciA9IFwiMHhcIiArIEhbMV0gKyBIWzFdO1xuICAgICAgICBnID0gXCIweFwiICsgSFsyXSArIEhbMl07XG4gICAgICAgIGIgPSBcIjB4XCIgKyBIWzNdICsgSFszXTtcbiAgICB9XG4gICAgZWxzZSBpZiAoSC5sZW5ndGggPT0gNykge1xuICAgICAgICByID0gXCIweFwiICsgSFsxXSArIEhbMl07XG4gICAgICAgIGcgPSBcIjB4XCIgKyBIWzNdICsgSFs0XTtcbiAgICAgICAgYiA9IFwiMHhcIiArIEhbNV0gKyBIWzZdO1xuICAgIH1cbiAgICBpZiAoaXNQY3QpIHtcbiAgICAgICAgciA9ICsociAvIDI1NSAqIDEwMCkudG9GaXhlZCgxKTtcbiAgICAgICAgZyA9ICsoZyAvIDI1NSAqIDEwMCkudG9GaXhlZCgxKTtcbiAgICAgICAgYiA9ICsoYiAvIDI1NSAqIDEwMCkudG9GaXhlZCgxKTtcbiAgICB9XG4gICAgcmV0dXJuIHsgciwgZywgYiwgc3RyaW5nOiBcInJnYihcIiArIChpc1BjdCA/IHIgKyBcIiUsXCIgKyBnICsgXCIlLFwiICsgYiArIFwiJVwiIDogK3IgKyBcIixcIiArICtnICsgXCIsXCIgKyArYikgKyBcIilcIiB9O1xufVxuZnVuY3Rpb24gaGV4VG9IU0woSCkge1xuICAgIC8vIENvbnZlcnQgaGV4IHRvIFJHQiBmaXJzdFxuICAgIGNvbnN0IFJHQiA9IGhleFRvUkdCKEgpO1xuICAgIGxldCB7IHIsIGcsIGIgfSA9IFJHQjtcbiAgICAvLyBUaGVuIHRvIEhTTFxuICAgIHIgLz0gMjU1O1xuICAgIGcgLz0gMjU1O1xuICAgIGIgLz0gMjU1O1xuICAgIGxldCBjbWluID0gTWF0aC5taW4ociwgZywgYiksIGNtYXggPSBNYXRoLm1heChyLCBnLCBiKSwgZGVsdGEgPSBjbWF4IC0gY21pbiwgaCA9IDAsIHMgPSAwLCBsID0gMDtcbiAgICBpZiAoZGVsdGEgPT0gMClcbiAgICAgICAgaCA9IDA7XG4gICAgZWxzZSBpZiAoY21heCA9PSByKVxuICAgICAgICBoID0gKChnIC0gYikgLyBkZWx0YSkgJSA2O1xuICAgIGVsc2UgaWYgKGNtYXggPT0gZylcbiAgICAgICAgaCA9IChiIC0gcikgLyBkZWx0YSArIDI7XG4gICAgZWxzZVxuICAgICAgICBoID0gKHIgLSBnKSAvIGRlbHRhICsgNDtcbiAgICBoID0gTWF0aC5yb3VuZChoICogNjApO1xuICAgIGlmIChoIDwgMClcbiAgICAgICAgaCArPSAzNjA7XG4gICAgbCA9IChjbWF4ICsgY21pbikgLyAyO1xuICAgIHMgPSBkZWx0YSA9PSAwID8gMCA6IGRlbHRhIC8gKDEgLSBNYXRoLmFicygyICogbCAtIDEpKTtcbiAgICBzID0gKyhzICogMTAwKS50b0ZpeGVkKDEpO1xuICAgIGwgPSArKGwgKiAxMDApLnRvRml4ZWQoMSk7XG4gICAgcmV0dXJuIHsgaCwgcywgbCwgc3RyaW5nOiBcImhzbChcIiArIGggKyBcIixcIiArIHMgKyBcIiUsXCIgKyBsICsgXCIlKVwiIH07XG59XG5mdW5jdGlvbiBIU0xUb0hleChoLCBzLCBsKSB7XG4gICAgcyAvPSAxMDA7XG4gICAgbCAvPSAxMDA7XG4gICAgbGV0IGMgPSAoMSAtIE1hdGguYWJzKDIgKiBsIC0gMSkpICogcywgeCA9IGMgKiAoMSAtIE1hdGguYWJzKChoIC8gNjApICUgMiAtIDEpKSwgbSA9IGwgLSBjIC8gMiwgciA9IDAsIGcgPSAwLCBiID0gMDtcbiAgICBpZiAoMCA8PSBoICYmIGggPCA2MCkge1xuICAgICAgICByID0gYztcbiAgICAgICAgZyA9IHg7XG4gICAgICAgIGIgPSAwO1xuICAgIH1cbiAgICBlbHNlIGlmICg2MCA8PSBoICYmIGggPCAxMjApIHtcbiAgICAgICAgciA9IHg7XG4gICAgICAgIGcgPSBjO1xuICAgICAgICBiID0gMDtcbiAgICB9XG4gICAgZWxzZSBpZiAoMTIwIDw9IGggJiYgaCA8IDE4MCkge1xuICAgICAgICByID0gMDtcbiAgICAgICAgZyA9IGM7XG4gICAgICAgIGIgPSB4O1xuICAgIH1cbiAgICBlbHNlIGlmICgxODAgPD0gaCAmJiBoIDwgMjQwKSB7XG4gICAgICAgIHIgPSAwO1xuICAgICAgICBnID0geDtcbiAgICAgICAgYiA9IGM7XG4gICAgfVxuICAgIGVsc2UgaWYgKDI0MCA8PSBoICYmIGggPCAzMDApIHtcbiAgICAgICAgciA9IHg7XG4gICAgICAgIGcgPSAwO1xuICAgICAgICBiID0gYztcbiAgICB9XG4gICAgZWxzZSBpZiAoMzAwIDw9IGggJiYgaCA8IDM2MCkge1xuICAgICAgICByID0gYztcbiAgICAgICAgZyA9IDA7XG4gICAgICAgIGIgPSB4O1xuICAgIH1cbiAgICAvLyBIYXZpbmcgb2J0YWluZWQgUkdCLCBjb252ZXJ0IGNoYW5uZWxzIHRvIGhleFxuICAgIHIgPSBNYXRoLnJvdW5kKChyICsgbSkgKiAyNTUpLnRvU3RyaW5nKDE2KTtcbiAgICBnID0gTWF0aC5yb3VuZCgoZyArIG0pICogMjU1KS50b1N0cmluZygxNik7XG4gICAgYiA9IE1hdGgucm91bmQoKGIgKyBtKSAqIDI1NSkudG9TdHJpbmcoMTYpO1xuICAgIC8vIFByZXBlbmQgMHMsIGlmIG5lY2Vzc2FyeVxuICAgIGlmIChyLmxlbmd0aCA9PSAxKVxuICAgICAgICByID0gXCIwXCIgKyByO1xuICAgIGlmIChnLmxlbmd0aCA9PSAxKVxuICAgICAgICBnID0gXCIwXCIgKyBnO1xuICAgIGlmIChiLmxlbmd0aCA9PSAxKVxuICAgICAgICBiID0gXCIwXCIgKyBiO1xuICAgIHJldHVybiBcIiNcIiArIHIgKyBnICsgYjtcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=