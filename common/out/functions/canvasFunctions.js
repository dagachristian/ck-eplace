"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updBMPb8 = exports.b8ToBMP = exports.updPNGb8 = exports.b8ToPNG = exports.b8ToRaw = exports.bToABGR = exports.bToRGBA = void 0;
const pngjs_1 = require("pngjs");
const bmp_js_1 = __importDefault(require("bmp-js"));
const bToRGBA = (color, rgbaBuf, idx) => {
    rgbaBuf[idx] = (color >> 5) * 255 / 7;
    rgbaBuf[idx + 1] = ((color >> 2) & 0x07) * 255 / 7;
    rgbaBuf[idx + 2] = (color & 0x03) * 255 / 3;
    rgbaBuf[idx + 3] = 255;
};
exports.bToRGBA = bToRGBA;
const bToABGR = (color, abgrBuf, idx) => {
    abgrBuf[idx + 3] = (color >> 5) * 255 / 7;
    abgrBuf[idx + 2] = ((color >> 2) & 0x07) * 255 / 7;
    abgrBuf[idx + 1] = (color & 0x03) * 255 / 3;
    abgrBuf[idx] = 255;
};
exports.bToABGR = bToABGR;
const b8ToRaw = (buffer) => {
    const dim = Math.floor(Math.sqrt(buffer.length));
    const raw = Buffer.from(new ArrayBuffer((buffer.length) << 2));
    for (let y = 0; y < dim; y++) {
        for (let x = 0; x < dim; x++) {
            const idx = (dim * y + x) << 2;
            const color = buffer[dim * y + x];
            (0, exports.bToRGBA)(color, raw, idx);
        }
    }
    return raw;
};
exports.b8ToRaw = b8ToRaw;
const b8ToPNG = (buffer) => {
    const dim = Math.floor(Math.sqrt(buffer.length));
    const png = new pngjs_1.PNG({
        width: dim,
        height: dim,
    });
    for (let y = 0; y < png.height; y++) {
        for (let x = 0; x < png.width; x++) {
            const idx = (png.width * y + x) << 2;
            const color = buffer[png.width * y + x];
            (0, exports.bToRGBA)(color, png.data, idx);
        }
    }
    return pngjs_1.PNG.sync.write(png);
};
exports.b8ToPNG = b8ToPNG;
const updPNGb8 = (pngBuf, x, y, color) => {
    const png = pngjs_1.PNG.sync.read(pngBuf);
    const idx = (png.width * y + x) << 2;
    (0, exports.bToRGBA)(color, png.data, idx);
    return pngjs_1.PNG.sync.write(png);
};
exports.updPNGb8 = updPNGb8;
const b8ToBMP = (buffer) => {
    const dim = Math.floor(Math.sqrt(buffer.length));
    const data = Buffer.from(new ArrayBuffer((dim * dim) << 2));
    for (let y = 0; y < dim; y++) {
        for (let x = 0; x < dim; x++) {
            const idx = (dim * y + x) << 2;
            const color = buffer[dim * y + x];
            (0, exports.bToABGR)(color, data, idx);
        }
    }
    const bmpData = {
        width: dim,
        height: dim,
        data
    };
    const bmpImg = bmp_js_1.default.encode(bmpData, 8).data;
    bmpImg[6] = dim;
    return bmpImg;
};
exports.b8ToBMP = b8ToBMP;
const updBMPb8 = (bmpBuf, x, y, color) => {
    const dim = bmpBuf[6];
    const offset = bmpBuf[10] - 1;
    const idx = ((dim * y + x) << 2) + offset;
    (0, exports.bToABGR)(color, bmpBuf, idx);
    return bmpBuf;
};
exports.updBMPb8 = updBMPb8;
//# sourceMappingURL=canvasFunctions.js.map