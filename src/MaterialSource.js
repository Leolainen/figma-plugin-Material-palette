
function hex2rgb(hex) {
	return /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  	.slice(1).map(s => parseInt(s, 16))
}
function hex2hsl(hex) {
	return rgb2hsl(hex2rgb(hex));
}
function hex2hcl(hex) {
	return rgb2hcl(hex2rgb(hex));
}
function specificLight(rgb) {
  const [r, g, b] = rgb;
  return 1 - (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}
function bestTextColor(hex, lightText = '#ffffff', darkText = '#000000', average = 0.5) {
  return specificLight(hex2rgb(hex)) > average ? lightText : darkText;
}
function lab2hcl(lab) {
  const [l, a, b] = lab;
  const c = Math.sqrt(a * a + b * b);
  const h = (Math.atan2(b, a) * (180 / Math.PI) + 360) % 360;
  return [(Math.round(c * 10000) === 0 ? 0 : h), c, l];
}
function lab2xyz(lab) {
  const y = (lab[0] + 16) / 116,
    x = lab[1] / 500 + y,
    z = y - lab[2] / 200;
  return [[x,0.95047], [y,1.00000], [z,1.08883]].map((a) => {
    const v = a[0];
    return a[1] * ((v * v * v > 0.008856) ? v * v * v : (v - 16/116) / 7.787);
  })
}
function lab2rgb(lab){
  const [x, y, z] = lab2xyz(lab);
  let r, g, b;
  r = x *  3.2406 + y * -1.5372 + z * -0.4986;
  g = x * -0.9689 + y *  1.8758 + z *  0.0415;
  b = x *  0.0557 + y * -0.2040 + z *  1.0570;
  return [r,g,b].map((v) => {
    v = (v > 0.0031308) ? (1.055 * Math.pow(v, 1/2.4) - 0.055) : 12.92 * v;
    return Math.max(0, Math.min(1, v)) * 255
  });
}
function rgb2hex(rgb) {
	const [r,g,b] = rgb;
	const _rgb = r << 16 | g << 8 | b;
	return '#' + ('000000' + _rgb.toString(16)).slice(-6);
}
function rgb2hsl(rgb) {
  rgb = rgb.map(v => v/255);
  const [r, g, b] = rgb;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch(max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [360 * h, 100 * s, 100 * l]
}

function rgb2xyz(rgb) {
	const rgbXYZ = (v) => ((v /= 255) <= 0.04045) ?
  	(v / 12.92) :
    Math.pow((v + 0.055) / 1.055, 2.4);
  const xyzLAB = (v) => (v > 0.008856452) ?
  	Math.pow(v, 1 / 3) :
    v / 0.12841855 + 0.137931034;
  const [r,g,b] = rgb.map(rgbXYZ);
  return [
  	xyzLAB((0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / 0.950470),
    xyzLAB(0.2126729 * r + 0.7151522 * g + 0.0721750 * b),
    xyzLAB((0.0193339 * r + 0.1191920 * g + 0.9503041 * b) / 1.088830)
  ];
}
function rgb2lab(rgb) {
  const [r,g,b] = rgb;
  const [x,y,z] = rgb2xyz(rgb);
  return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
}
function rgb2hcl(rgb) {
  return lab2hcl(rgb2lab(rgb));
}

function hsl2rgb(hsl) {
  let r, g, b;
  const [h, s, l] = hsl.map((v, i) => v / (!i ? 360 : 100));
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return [r, g, b].map((v) => Math.round(v*255));
}
function hsl2hex(hsl) {
	return rgb2hex(hsl2rgb(hsl));
}

function hcl2lab(hcl) {
  let [h, c, l] = hcl;
  h = h * (Math.PI / 180);
  return [l, Math.cos(h) * c, Math.sin(h) * c];
}
function hcl2rgb(hcl) {
  return lab2rgb(hcl2lab(hcl));
}
function hcl2hex(hcl) {
	return rgb2hex(hcl2rgb(hcl));
}
/**
 * Minimize the maximum possible loss
 *
 * @param      {number}             val           The input value to test
 * @return     {number}             A number between 0 and 100
 */
function minmax(v, maxi = 100, mini = 0) {
  return Math.min(maxi, Math.max(mini, v))
}
function minmaxHue(h) {
	return h < 0 ? (h + 360) : (h > 360 ? (h - 360) : h);
}

const BASECOLOR = { /* should have l*sl 15 - 35 */
  material: {
    "red": "#f44336", "deepOrange": "#ff5722", "orange": "#ff9800",
    "amber": "#ffc107", "yellow": "#ffeb3b", "lime": "#cddc39",
    "lightGreen": "#8bc34a", "green": "#4caf50", "teal": "#009688",
    "cyan": "#00bcd4", "lightBlue": "#03a9f4", "blue": "#2196f3",
    "indigo": "#3f51b5", "deepPurple": "#673ab7", "purple": "#9c27b0",
    "pink": "#e91e63", "brown": "#795548", "grey": "#9e9e9e", "blueGrey": "#607d8b"
  },
  redaktor: {
    "red": "#dc0005", "deepOrange": "#ff2800", "orange": "#ff7a00",
    "amber": "#ffaf00", "yellow": "#fadc00", "lime": "#dfdc00",
    "lightGreen": "#95cc0d", "green": "#13b20b", "teal": "#339985",
    "cyan": "#00b1cc", "lightBlue": "#6da7d1", "blue": "#0d7ecc",
    "indigo": "#3b4eb8", "deepPurple": "#663399", "purple": "#c30c70",
    "pink": "#eb2f59", "brown": "#7a5653", "grey": "#a3a3a3", "blueGrey": "#617c8f"
  }
}
const materialC = {
  "red":[[-28,-74,39],[-23,-63,31],[-13,-47,16],[-11,-33,6],[-5,-12,2],[-2,-4,-4],
    [-3,-7,-9],[-2,-9,-12],[0,-9,-16],[-5,-31,15],[-6,-6,4],[-10,7,-1],[4,10,-11]],
  "pink":[[343,-67,42],[344,-51,31],[347,-34,20],[-10,-17,10],[-6,-7,4],[-2,-4,-4],
    [-5,-10,-8],[-9,-15,-13],[343,-24,-21],[348,-24,18],[-5,-1,8],[5,7,1],[-8,-8,-8]],
  "purple":[[-2,-70,52],[-2,-55,40],[-1,-37,28],[-1,-20,16],[0,-8,7],[-2,-1,-3],
    [-5,-3,-7],[-7,-4,-11],[-12,-7,-17],[0,-6,29],[0,23,18],[-1,35,12],[-7,41,6]],
  "deepPurple":[[-3,-68,56],[-4,-55,45],[-3,-41,32],[-2,-24,19],[-1,-12,9],[-1,0,-2],
    [-1,0,-6],[-2,0,-9],[-3,0,-15],[-1,-9,29],[-2,26,11],[0,47,3],[1,43,-2]],
  "indigo":[[-11,-55,55],[-9,-44,44],[-8,-33,31],[-6,-22,19],[-3,-11,9],[1,0,-3],
    [2,-1,-7],[3,-1,-11],[6,0,-19],[-5,-7,29],[1,22,13],[3,35,8],[5,42,5]],
  "blue":[[-24,-48,34],[-18,-37,26],[-15,-25,19],[-11,-15,11],[-5,-7,5],[3,0,-5],
    [7,0,-11],[10,0,-17],[17,2,-28],[5,-11,11],[13,12,-2],[17,22,-7],[23,36,-13]],
  "lightBlue":[[-25,-40,30],[-22,-29,23],[-19,-18,15],[-14,-9,9],[-7,-4,4],[3,-1,-5],
    [7,-2,-11],[10,-4,-18],[18,-5,-29],[-19,-17,17],[-11,-6,9],[0,2,3],[12,5,-7]],
  "cyan":[[-7,-30,26],[-8,-20,20],[-7,-10,13],[-5,-3,7],[-4,0,3],[-1,-2,-6],
    [-4,-6,-13],[-6,-9,-20],[-15,-14,-33],[-20,-2,23],[-21,11,21],[-2,6,14],[4,0,-1]],
  "teal":[[11,-30,39],[7,-21,30],[6,-12,21],[4,-4,12],[2,0,6],[-1,-2,-5],
    [-3,-5,-10],[-3,-7,-16],[-8,-12,-27],[-6,-6,39],[-10,13,36],[-15,22,27],[-6,9,14]],
  "green":[[6,-55,31],[4,-44,25],[3,-32,17],[2,-18,10],[1,-9,5],[0,-3,-5],
    [0,-7,-12],[0,-10,-18],[0,-18,-29],[11,-31,28],[17,-7,22],[9,19,17],[4,18,7]],
  "lightGreen":[[3,-57,24],[2,-45,19],[2,-33,13],[1,-19,8],[0,-9,4],[1,-3,-6],
    [2,-7,-13],[4,-11,-20],[8,-17,-33],[0,-7,22],[0,19,20],[5,45,17],[5,32,6]],
  "lime":[[5,-67,14],[3,-52,11],[3,-35,8],[2,-20,5],[1,-9,2],[-1,-5,-6],
    [-3,-10,-13],[-5,-17,-21],[-11,-27,-35],[1,-15,13],[0,10,12],[8,23,9],[9,18,2]],
  "yellow":[[8,-70,7],[6,-55,5],[4,-37,3],[2,-21,2],[1,-9,1],[-6,-3,-5],
    [-14,-6,-11],[-23,-7,-17],[-38,-3,-27],[8,-25,6],[5,15,5],[0,10,0],[-7,5,-5]],
  "amber":[[13,-71,16],[10,-53,12],[8,-34,8],[6,-14,5],[3,-4,2],[-5,0,-3],
    [-12,-1,-8],[-18,0,-11],[-29,5,-18],[11,-31,10],[7,-9,6],[1,1,1],[-8,-1,-5]],
  "orange":[[17,-72,24],[13,-56,19],[10,-38,13],[7,-19,7],[4,-7,3],[-3,0,-3],
    [-8,0,-7],[-12,0,-11],[-19,2,-17],[14,-36,14],[3,-15,4],[-3,1,-2],[-14,6,-9]],
  "deepOrange":[[-16,-81,34],[-2,-65,26],[-2,-49,17],[-1,-30,10],[-1,-14,4],[0,-2,-3],
    [0,-5,-6],[0,-8,-10],[0,-13,-16],[-2,-42,14],[0,-13,4],[-1,11,-3],[-2,2,-12]],
  "brown":[[10,-17,54],[1,-14,43],[-1,-11,31],[0,-7,19],[0,-4,10],[-2,-2,-4],
    [-3,-3,-10],[-8,-5,-15],[-11,-6,-21]],
  "blueGrey":[[6,-11,44],[-5,-9,35],[-1,-7,25],[-1,-4,15],[0,-2,8],[-1,-1,-6],
    [-1,-3,-14],[1,-5,-22],[1,-7,-31]],
  "grey":[[0,0,33],[0,0,31],[0,0,29],[0,0,24],[0,0,11],[0,0,-16],[0,0,-24],[0,0,-37],[0,0,-52]]
}
const COLORKEYS = [
  '50','100','200','300','400','600','700','800','900',
  'a100','a200','a400','a700'
];
function colorData(k, palette) {
	const rgb = hex2rgb(!palette ? k : palette[k]);
  const hcl = rgb2hcl(rgb);
  const o = { rgb, hcl, sl: specificLight(rgb) }
  const SL = hcl[2] * o.sl;
  if (SL < 12) {
    console.warn(`${k} is too light: ${SL} / min. 12`);
  } else if (SL > 36) {
    console.warn(`${k} is too dark: ${SL} / max. 36`);
  }
  return o;
}
function redaktorScale(k, palette = BASECOLOR.redaktor) {
  /* corrections calculated */
  const {rgb, hcl, sl} = colorData(k, palette);
  const [h, c, l] = hcl;
  const lStep = (100 - l) / 5;
  const lcStep = (160 - l) / 4;
  const dStep = ((20/sl) * sl) / 4;
  const A = materialC[k].length < COLORKEYS.length-1 ?
    COLORKEYS.slice(0, 9) : COLORKEYS;
  const hcls = {};
  return A.reduce((r,w,i) => {
    const L = i < 5 ? 100 - (lStep * i) : l - (dStep * (i-4));
    const C = i < 5 ? minmax((lcStep * i), c, 20) : c;
    let H = h;
    if (i > 4) {
      if (k === 'yellow' || k === 'amber') {
        H = h - [8, 13, 21, (k === 'yellow' ? 34 : 24)][i-5];
      } else if (k === 'orange') {
        H = h - [5, 8, 13, 16][i-5];
      } else if (k === 'cyan') {
        H = h - [1, 2, 3, 8][i-5];
      }
    }
    hcls[w] = [H, C, L];
    if (i < 9) {
      r[w] = hcl2hex([H, C, minmax(L,98,8)]);
      if (w === '400') { r['500'] = palette[k] }
    } else {
      // Accents
      r[w] = hcl2hex(materialC[k][i].map((v,j) => hcl[j] + v));
    }

    return r;
  }, {});
}
function materialScale(k, palette = BASECOLOR.material) {
  /* corrections from `materialC` */
  const {hcl, sl} = colorData(k, palette);
  const A = materialC[k].length < COLORKEYS.length ?
    COLORKEYS.slice(0, 9) : COLORKEYS;
  return A.reduce((r,w,i) => {
    r[w] = hcl2hex(materialC[k][i].map((v,j) => hcl[j] + v));
    if (w === '400') { r['500'] = palette[k] }
    return r;
  }, {});
}
const SCALES = { material: materialScale, redaktor: redaktorScale }
const hexColorReg = /^#?([A-F0-9]{6}|[A-F0-9]{3})$/i;

function palette(hexColor, schema = 'material') {
  // BASECOLOR = { material: { "red": "#f44336"
  let [name, distance, palette] = ['', 0, BASECOLOR[schema]];
  const hex = `${hexColor}`;
  const _hex = (hex.charAt(0) === '#' ? hex : `#${hex}`);
  if (!hex || !(hexColorReg.test(hex))) { throw new TypeError('Invalid input') }
  const {rgb, hcl, sl} = colorData(hex);
  for (name in palette) {
    if (palette[name] === _hex) {
      return { name, hex, sl, distance, palette }
    }
  }
  const [h, c, l] = hcl;
  distance = {h:360, s:0, l:0};
  // Color name
  name = 'grey';
  if (sl > 0.9) {
    name = 'black';
  } else if (sl < 0.1) {
    name = 'white';
  } else if (c > 8) {
    let dist = 360;
    let k;
    for (k in BASECOLOR[schema]) {
      let [_h, _c, _l] = hex2hcl(BASECOLOR[schema][k]);
      let _dist = Math.min(Math.abs(_h - h), (360 + _h - h));
      if (_dist < dist) {
        dist = _dist;
        name = k;
        distance = [h - _h, c - _c, l - _l];
      }
    }
    const checkBrown = { orange:1, deepOrange:1 };
    const checkBlue = { indigo:1, blue:1, lightBlue:1, cyan:1, blueGrey:1 };
    if (checkBrown.hasOwnProperty(name) && c < 48) {
      name = c < 12 ? 'grey' : 'brown'
    } else if (checkBlue.hasOwnProperty(name) && c < 32 && sl > 0.32) {
      name = 'blueGrey';
    } else if (c < 16) {
      name = 'grey';
    }
  }
  // Alternating colors

  palette = Object.keys(BASECOLOR[schema]).reduce((o, k) => {
    let [_h,_c,_l] = hex2hcl(BASECOLOR[schema][k]);
    o[k] = k === '500' ? BASECOLOR[schema][k] : hcl2hex([
    	minmaxHue( _h + distance[0] ),
      minmax( _c + distance[1] ),
      minmax( _l + distance[2] )
    ]);
    return o
  }, {});

  return { name, hex, sl, distance, palette }
}


function paletteDivs(palette) {
	const P = document.getElementById('palette');
  P.innerHTML = '';
  for (var name in palette) {
    const C = palette[name];
    let DIV = document.createElement('div');
    DIV.dataset.named = name;
    DIV.setAttribute('title', name);
    DIV.setAttribute('style', `background: ${C};`);
    DIV.setAttribute('class', `${name} color`);
    document.getElementById('palette').appendChild(DIV);
  }
}
function scaleDivs(name, palette, schema = 'material') {
  const hex = palette[name];
	const scale = SCALES[schema](name, palette);
  const STYLE = document.documentElement.style;
  const NAMED = document.getElementById('namedColor');
  STYLE.setProperty('--color', hex.charAt(0) === '#' ? hex : `#${hex}`);
  STYLE.setProperty('--text', bestTextColor(hex));
  NAMED.innerHTML = name;
  //  NAMED.setAttribute('title', `spec. light ${specificLight.toFixed(2)}`);
  document.getElementById('colorScale').innerHTML = '';
  for (var w in scale) {
    const C = scale[w];
    const T = bestTextColor(C);
    let DIV = document.createElement('div');
    DIV.setAttribute('style', `background: ${C}; color: ${T};`);
    DIV.setAttribute('class', `${name} color _${w};`);
    DIV.innerHTML = `<p>${name} ${w} : ${C}</p>`;
    document.getElementById('colorScale').appendChild(DIV);
  }
}

function colorPalette(hex, schema = 'material') {
  const o = palette(hex, schema);
  if (['brown','blueGrey','grey'].indexOf(o.name) > -1) {
    document.getElementById('palette').innerHTML = '- need more saturation';
  } else if (!!o.palette) {
		localStorage.setItem('redaktor-color', JSON.stringify(o));
    paletteDivs(o.palette);
    scaleDivs(o.name, o.palette, schema);
  }
}

function colorCSS(schema = 'material') {
	const cur = JSON.parse(localStorage.getItem('redaktor-color'));
	const C = { base: [], scale: [] };
  console.log('cur', cur);
	for (var name in cur.palette) {
		C.base.push(`--${name}: ${cur.palette[name]};`);
		const scale = SCALES[schema](name, cur.palette);
		for (var w in scale) {
			w !== '500' && C.scale.push(`--${name}-${w}: ${scale[w]};`);
		}
	}
	return `:root {${C.base.concat(C.scale).reduce((_s, s) => `${_s}\n  ${s}`,'')}\n}`
}

// TODO FIXME FOR CSS o.palette[o.name] = scalesFn[schema](o.palette)
// Custom Color input
const T = document.getElementById('type');
const SelectedColor = document.getElementById('selectColor');
const P = document.getElementById('palette');
const O = document.getElementById('outCSS');
const _O = document.getElementById('out');
const calcPalette = (evt) => {
  const v = SlectedColor.value;
  if (!hexColorReg.test(v)) { return !!evt ? evt.preventDefault() : false }
  if (v.charAt(0) === '#') { SlectedColor.value = v.replace('#', '') }
  return colorPalette(v, T.value)
}
const calcScale = (evt) => {
  const n = evt.target.dataset.named;
  const cur = JSON.parse(localStorage.getItem('redaktor-color'));
  document.getElementById('selectColor').value = cur.palette[n].replace('#', '');
  scaleDivs(n, cur.palette, T.value); //scaleDivs(o.name, o.palette);
}
// Check Last Color
const last = JSON.parse(localStorage.getItem('redaktor-color'));
if (!!last && typeof last.hex === 'string') { SlectedColor.value = last.hex }
// Type Input
T.addEventListener('change', calcPalette);
// Color Input
SlectedColor.addEventListener('input', calcPalette);
SlectedColor.addEventListener('blur', (evt) => SlectedColor.value !== last.hex && calcPalette(evt));
// Palette Color click
P.addEventListener('click', calcScale);
// CSS click
O.addEventListener('click', () => { _O.value = colorCSS(T.value) })
calcPalette();
