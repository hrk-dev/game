/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 603:
/***/ ((module) => {

(function () {
  'use strict';

  /*
   * Wrap the numbers 0 to 256 in their foreground or background terminal escape code
   */
  var fgcodes = Array.apply(null, new Array(256)).map(function (_, i) { return '\x1b[38;5;' + i + 'm'; });
  var bgcodes = Array.apply(null, new Array(256)).map(function (_, i) { return '\x1b[48;5;' + i + 'm'; });

  /*
   * Slice the foreground and background codes in their respective sections
   */
  var fg = module.exports.fg = {
    codes: fgcodes,
    standard: fgcodes.slice(0, 8),
    bright: fgcodes.slice(8, 16),
    rgb: fgcodes.slice(16, 232),
    grayscale: fgcodes.slice(232, 256),
    // get a red-green-blue value by index, in the ranged 0 to 6
    getRgb: function (r, g, b) { return fg.rgb[36*r + 6*g + b]; }
  };

  var bg = module.exports.bg = {
    codes: bgcodes,
    standard: bgcodes.slice(0, 8),
    bright: bgcodes.slice(8, 16),
    rgb: bgcodes.slice(16, 232),
    grayscale: bgcodes.slice(232, 256),
    // get a red-green-blue value by index, in the ranged 0 to 6
    getRgb: function (r, g, b) { return bg.rgb[36*r + 6*g + b]; }
  };

  var reset = module.exports.reset = '\x1b[0m';

}());


/***/ }),

/***/ 467:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var PNGReader = __nccwpck_require__(41)
var colors = __nccwpck_require__(603)

var CHAR_HALF_BLOCK = String.fromCharCode(9604)

function printDouble (buffer, done) {
  var reader = new PNGReader(buffer)
  reader.parse(function (err, png) {
    if (err) return done(err)
    var s = ''
    for (var y = 0; y < png.getHeight() - 1; y += 2) {
      if (s) s += colors.reset + '\n'
      for (var x = 0; x < png.getWidth(); x++) {
        var p1 = png.getPixel(x, y)
        var p2 = png.getPixel(x, y + 1)
        var r1 = Math.round(p1[0] / 255 * 5)
        var g1 = Math.round(p1[1] / 255 * 5)
        var b1 = Math.round(p1[2] / 255 * 5)
        var r2 = Math.round(p2[0] / 255 * 5)
        var g2 = Math.round(p2[1] / 255 * 5)
        var b2 = Math.round(p2[2] / 255 * 5)
        if (p1[3] === 0) {
          s += colors.reset + ' ';
        } else {
          s += colors.bg.getRgb(r1, g1, b1) + colors.fg.getRgb(r2, g2, b2) + CHAR_HALF_BLOCK;
        }
      }
    }
    s += colors.reset
    done(null, s)
  })
}

var exports = module.exports = printDouble

exports.attachTo = function (console) {
  var fs = __nccwpck_require__(747)
  function printBuffer (buffer) {
    printDouble(buffer, function (err2, string) {
      if (err2) throw err2
      console.log(string)
    })
  }
  console.png = function (filename) {
    if (typeof filename === 'string') {
      fs.readFile(filename, function (err1, buffer) {
        if (err1) throw err1
        printBuffer(buffer)
      })
    } else {
      printBuffer(filename)
    }
  }
}


/***/ }),

/***/ 746:
/***/ ((module) => {

"use strict";


var PNG = function(){

	// initialize all members to keep the same hidden class
	this.width = 0;
	this.height = 0;
	this.bitDepth = 0;
	this.colorType = 0;
	this.compressionMethod = 0;
	this.filterMethod = 0;
	this.interlaceMethod = 0;

	this.colors = 0;
	this.alpha = false;
	this.pixelBits = 0;

	this.palette = null;
	this.pixels = null;

};

PNG.prototype.getWidth = function(){
	return this.width;
};

PNG.prototype.setWidth = function(width){
	this.width = width;
};

PNG.prototype.getHeight = function(){
	return this.height;
};

PNG.prototype.setHeight = function(height){
	this.height = height;
};

PNG.prototype.getBitDepth = function(){
	return this.bitDepth;
};

PNG.prototype.setBitDepth = function(bitDepth){
	if ([2, 4, 8, 16].indexOf(bitDepth) === -1){
		throw new Error("invalid bith depth " + bitDepth);
	}
	this.bitDepth = bitDepth;
};

PNG.prototype.getColorType = function(){
	return this.colorType;
};

PNG.prototype.setColorType = function(colorType){

	//   Color    Allowed    Interpretation
	//   Type    Bit Depths
	//
	//   0       1,2,4,8,16  Each pixel is a grayscale sample.
	//
	//   2       8,16        Each pixel is an R,G,B triple.
	//
	//   3       1,2,4,8     Each pixel is a palette index;
	//                       a PLTE chunk must appear.
	//
	//   4       8,16        Each pixel is a grayscale sample,
	//                       followed by an alpha sample.
	//
	//   6       8,16        Each pixel is an R,G,B triple,
	//                       followed by an alpha sample.

	var colors = 0, alpha = false;

	switch (colorType){
		case 0: colors = 1; break;
		case 2: colors = 3; break;
		case 3: colors = 1; break;
		case 4: colors = 2; alpha = true; break;
		case 6: colors = 4; alpha = true; break;
		default: throw new Error("invalid color type");
	}

	this.colors = colors;
	this.alpha = alpha;
	this.colorType = colorType;
};

PNG.prototype.getCompressionMethod = function(){
	return this.compressionMethod;
};

PNG.prototype.setCompressionMethod = function(compressionMethod){
	if (compressionMethod !== 0){
		throw new Error("invalid compression method " + compressionMethod);
	}
	this.compressionMethod = compressionMethod;
};

PNG.prototype.getFilterMethod = function(){
	return this.filterMethod;
};

PNG.prototype.setFilterMethod = function(filterMethod){
	if (filterMethod !== 0){
		throw new Error("invalid filter method " + filterMethod);
	}
	this.filterMethod = filterMethod;
};

PNG.prototype.getInterlaceMethod = function(){
	return this.interlaceMethod;
};

PNG.prototype.setInterlaceMethod = function(interlaceMethod){
	if (interlaceMethod !== 0 && interlaceMethod !== 1){
		throw new Error("invalid interlace method " + interlaceMethod);
	}
	this.interlaceMethod = interlaceMethod;
};

PNG.prototype.setPalette = function(palette){
	if (palette.length % 3 !== 0){
		throw new Error("incorrect PLTE chunk length");
	}
	if (palette.length > (Math.pow(2, this.bitDepth) * 3)){
		throw new Error("palette has more colors than 2^bitdepth");
	}
	this.palette = palette;
};

PNG.prototype.getPalette = function(){
	return this.palette;
};

/**
 * get the pixel color on a certain location in a normalized way
 * result is an array: [red, green, blue, alpha]
 */
PNG.prototype.getPixel = function(x, y){
	if (!this.pixels) throw new Error("pixel data is empty");
	if (x >= this.width || y >= this.height){
		throw new Error("x,y position out of bound");
	}
	var i = this.colors * this.bitDepth / 8 * (y * this.width + x);
	var pixels = this.pixels;

	switch (this.colorType){
		case 0: return [pixels[i], pixels[i], pixels[i], 255];
		case 2: return [pixels[i], pixels[i + 1], pixels[i + 2], 255];
		case 3: return [
			this.palette[pixels[i] * 3 + 0],
			this.palette[pixels[i] * 3 + 1],
			this.palette[pixels[i] * 3 + 2],
			255];
		case 4: return [pixels[i], pixels[i], pixels[i], pixels[i + 1]];
		case 6: return [pixels[i], pixels[i + 1], pixels[i + 2], pixels[i + 3]];
	}
};

module.exports = PNG;


/***/ }),

/***/ 41:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";
/*global Uint8Array:true ArrayBuffer:true */


var PNG = __nccwpck_require__(746);

var isNode = typeof process !== 'undefined' && !process.browser;

var inflate = (function(){
	if (isNode){
		var zlib = __nccwpck_require__(761);
		return function(data, callback){
			return zlib.inflate(Buffer.from(data), callback);
		};
	} else {
		var stream = __nccwpck_require__(77);
		return function(data, callback){
			data = new stream.FlateStream(new stream.Stream(data));
			callback(null, data.getBytes());
		};
	}
})();

var slice = Array.prototype.slice;
var toString = Object.prototype.toString;

function equalBytes(a, b){
	if (a.length != b.length) return false;
	for (var l = a.length; l--;) if (a[l] != b[l]) return false;
	return true;
}

function readUInt32(buffer, offset){
	return (buffer[offset] << 24) +
		(buffer[offset + 1] << 16) +
		(buffer[offset + 2] << 8) +
		(buffer[offset + 3] << 0);
}

function readUInt16(buffer, offset){
	return (buffer[offset + 1] << 8) + (buffer[offset] << 0);
}

function readUInt8(buffer, offset){
	return buffer[offset] << 0;
}

function bufferToString(buffer){
	var str = '';
	for (var i = 0; i < buffer.length; i++){
		str += String.fromCharCode(buffer[i]);
	}
	return str;
}

var PNGReader = function(bytes){

	if (typeof bytes == 'string'){
		var bts = bytes;
		bytes = new Array(bts.length);
		for (var i = 0, l = bts.length; i < l; i++){
			bytes[i] = bts[i].charCodeAt(0);
		}
	} else {
		var type = toString.call(bytes).slice(8, -1);
		if (type == 'ArrayBuffer') bytes = new Uint8Array(bytes);
	}

	// current pointer
	this.i = 0;
	// bytes buffer
	this.bytes = bytes;
	// Output object
	this.png = new PNG();

	this.dataChunks = [];

};

PNGReader.prototype.readBytes = function(length){
	var end = this.i + length;
	if (end > this.bytes.length){
		throw new Error('Unexpectedly reached end of file');
	}
	var bytes = slice.call(this.bytes, this.i, end);
	this.i = end;
	return bytes;
};

/**
 * http://www.w3.org/TR/2003/REC-PNG-20031110/#5PNG-file-signature
 */
PNGReader.prototype.decodeHeader = function(){

	if (this.i !== 0){
		throw new Error('file pointer should be at 0 to read the header');
	}

	var header = this.readBytes(8);

	if (!equalBytes(header, [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])){
		throw new Error('invalid PNGReader file (bad signature)');
	}

	this.header = header;

};

/**
 * http://www.w3.org/TR/2003/REC-PNG-20031110/#5Chunk-layout
 *
 * length =  4      bytes
 * type   =  4      bytes (IHDR, PLTE, IDAT, IEND or others)
 * chunk  =  length bytes
 * crc    =  4      bytes
 */
PNGReader.prototype.decodeChunk = function(){

	var length = readUInt32(this.readBytes(4), 0);

	if (length < 0){
		throw new Error('Bad chunk length ' + (0xFFFFFFFF & length));
	}

	var type = bufferToString(this.readBytes(4));
	var chunk = this.readBytes(length);
	var crc = this.readBytes(4);

	switch (type){
		case 'IHDR': this.decodeIHDR(chunk); break;
		case 'PLTE': this.decodePLTE(chunk); break;
		case 'IDAT': this.decodeIDAT(chunk); break;
		case 'IEND': this.decodeIEND(chunk); break;
	}

	return type;

};

/**
 * http://www.w3.org/TR/2003/REC-PNG-20031110/#11IHDR
 * http://www.libpng.org/pub/png/spec/1.2/png-1.2-pdg.html#C.IHDR
 *
 * Width               4 bytes
 * Height              4 bytes
 * Bit depth           1 byte
 * Colour type         1 byte
 * Compression method  1 byte
 * Filter method       1 byte
 * Interlace method    1 byte
 */
PNGReader.prototype.decodeIHDR = function(chunk){
	var png = this.png;

	png.setWidth(             readUInt32(chunk, 0));
	png.setHeight(            readUInt32(chunk, 4));
	png.setBitDepth(          readUInt8(chunk,  8));
	png.setColorType(         readUInt8(chunk,  9));
	png.setCompressionMethod( readUInt8(chunk, 10));
	png.setFilterMethod(      readUInt8(chunk, 11));
	png.setInterlaceMethod(   readUInt8(chunk, 12));

};

/**
 *
 * http://www.w3.org/TR/PNG/#11PLTE
 */
PNGReader.prototype.decodePLTE = function(chunk){
	this.png.setPalette(chunk);
};

/**
 * http://www.w3.org/TR/2003/REC-PNG-20031110/#11IDAT
 */
PNGReader.prototype.decodeIDAT = function(chunk){
	// multiple IDAT chunks will concatenated
	this.dataChunks.push(chunk);
};

/**
 * http://www.w3.org/TR/2003/REC-PNG-20031110/#11IEND
 */
PNGReader.prototype.decodeIEND = function(){
};

/**
 * Uncompress IDAT chunks
 */
PNGReader.prototype.decodePixels = function(callback){
	var png = this.png;
	var reader = this;
	var length = 0;
	var i, j, k, l;
	for (l = this.dataChunks.length; l--;) length += this.dataChunks[l].length;
	var data = Buffer.alloc(length);
	for (i = 0, k = 0, l = this.dataChunks.length; i < l; i++){
		var chunk = this.dataChunks[i];
		for (j = 0; j < chunk.length; j++) data[k++] = chunk[j];
	}
	inflate(data, function(err, data){
		if (err) return callback(err);

		try {
			if (png.getInterlaceMethod() === 0){
				reader.interlaceNone(data);
			} else {
				reader.interlaceAdam7(data);
			}
		} catch (e){
			return callback(e);
		}

		callback();
	});
};

// Different interlace methods

PNGReader.prototype.interlaceNone = function(data){

	var png = this.png;

	// bytes per pixel
	var bpp = Math.max(1, png.colors * png.bitDepth / 8);

	// color bytes per row
	var cpr = bpp * png.width;

	var pixels = Buffer.alloc(bpp * png.width * png.height);
	var scanline;
	var offset = 0;

	for (var i = 0; i < data.length; i += cpr + 1){

		scanline = slice.call(data, i + 1, i + cpr + 1);

		switch (readUInt8(data, i)){
			case 0: this.unFilterNone(   scanline, pixels, bpp, offset, cpr); break;
			case 1: this.unFilterSub(    scanline, pixels, bpp, offset, cpr); break;
			case 2: this.unFilterUp(     scanline, pixels, bpp, offset, cpr); break;
			case 3: this.unFilterAverage(scanline, pixels, bpp, offset, cpr); break;
			case 4: this.unFilterPaeth(  scanline, pixels, bpp, offset, cpr); break;
			default: throw new Error("unkown filtered scanline");
		}

		offset += cpr;

	}

	png.pixels = pixels;

};

PNGReader.prototype.interlaceAdam7 = function(data){
	throw new Error("Adam7 interlacing is not implemented yet");
};

// Unfiltering

/**
 * No filtering, direct copy
 */
PNGReader.prototype.unFilterNone = function(scanline, pixels, bpp, of, length){
	for (var i = 0, to = length; i < to; i++){
		pixels[of + i] = scanline[i];
	}
};

/**
 * The Sub() filter transmits the difference between each byte and the value
 * of the corresponding byte of the prior pixel.
 * Sub(x) = Raw(x) + Raw(x - bpp)
 */
PNGReader.prototype.unFilterSub = function(scanline, pixels, bpp, of, length){
	var i = 0;
	for (; i < bpp; i++) pixels[of + i] = scanline[i];
	for (; i < length; i++){
		// Raw(x) + Raw(x - bpp)
		pixels[of + i] = (scanline[i] + pixels[of + i - bpp]) & 0xFF;
	}
};

/**
 * The Up() filter is just like the Sub() filter except that the pixel
 * immediately above the current pixel, rather than just to its left, is used
 * as the predictor.
 * Up(x) = Raw(x) + Prior(x)
 */
PNGReader.prototype.unFilterUp = function(scanline, pixels, bpp, of, length){
	var i = 0, byte, prev;
	// Prior(x) is 0 for all x on the first scanline
	if ((of - length) < 0) for (; i < length; i++){
		pixels[of + i] = scanline[i];
	} else for (; i < length; i++){
		// Raw(x)
		byte = scanline[i];
		// Prior(x)
		prev = pixels[of + i - length];
		pixels[of + i] = (byte + prev) & 0xFF;
	}
};

/**
 * The Average() filter uses the average of the two neighboring pixels (left
 * and above) to predict the value of a pixel.
 * Average(x) = Raw(x) + floor((Raw(x-bpp)+Prior(x))/2)
 */
PNGReader.prototype.unFilterAverage = function(scanline, pixels, bpp, of, length){
	var i = 0, byte, prev, prior;
	if ((of - length) < 0){
		// Prior(x) == 0 && Raw(x - bpp) == 0
		for (; i < bpp; i++){
			pixels[of + i] = scanline[i];
		}
		// Prior(x) == 0 && Raw(x - bpp) != 0 (right shift, prevent doubles)
		for (; i < length; i++){
			pixels[of + i] = (scanline[i] + (pixels[of + i - bpp] >> 1)) & 0xFF;
		}
	} else {
		// Prior(x) != 0 && Raw(x - bpp) == 0
		for (; i < bpp; i++){
			pixels[of + i] = (scanline[i] + (pixels[of - length + i] >> 1)) & 0xFF;
		}
		// Prior(x) != 0 && Raw(x - bpp) != 0
		for (; i < length; i++){
			byte = scanline[i];
			prev = pixels[of + i - bpp];
			prior = pixels[of + i - length];
			pixels[of + i] = (byte + (prev + prior >> 1)) & 0xFF;
		}
	}
};

/**
 * The Paeth() filter computes a simple linear function of the three
 * neighboring pixels (left, above, upper left), then chooses as predictor
 * the neighboring pixel closest to the computed value. This technique is due
 * to Alan W. Paeth.
 * Paeth(x) = Raw(x) +
 *            PaethPredictor(Raw(x-bpp), Prior(x), Prior(x-bpp))
 *  function PaethPredictor (a, b, c)
 *  begin
 *       ; a = left, b = above, c = upper left
 *       p := a + b - c        ; initial estimate
 *       pa := abs(p - a)      ; distances to a, b, c
 *       pb := abs(p - b)
 *       pc := abs(p - c)
 *       ; return nearest of a,b,c,
 *       ; breaking ties in order a,b,c.
 *       if pa <= pb AND pa <= pc then return a
 *       else if pb <= pc then return b
 *       else return c
 *  end
 */
PNGReader.prototype.unFilterPaeth = function(scanline, pixels, bpp, of, length){
	var i = 0, raw, a, b, c, p, pa, pb, pc, pr;
	if ((of - length) < 0){
		// Prior(x) == 0 && Raw(x - bpp) == 0
		for (; i < bpp; i++){
			pixels[of + i] = scanline[i];
		}
		// Prior(x) == 0 && Raw(x - bpp) != 0
		// paethPredictor(x, 0, 0) is always x
		for (; i < length; i++){
			pixels[of + i] = (scanline[i] + pixels[of + i - bpp]) & 0xFF;
		}
	} else {
		// Prior(x) != 0 && Raw(x - bpp) == 0
		// paethPredictor(x, 0, 0) is always x
		for (; i < bpp; i++){
			pixels[of + i] = (scanline[i] + pixels[of + i - length]) & 0xFF;
		}
		// Prior(x) != 0 && Raw(x - bpp) != 0
		for (; i < length; i++){
			raw = scanline[i];
			a = pixels[of + i - bpp];
			b = pixels[of + i - length];
			c = pixels[of + i - length - bpp];
			p = a + b - c;
			pa = Math.abs(p - a);
			pb = Math.abs(p - b);
			pc = Math.abs(p - c);
			if (pa <= pb && pa <= pc) pr = a;
			else if (pb <= pc) pr = b;
			else pr = c;
			pixels[of + i] = (raw + pr) & 0xFF;
		}
	}
};

/**
 * Parse the PNG file
 *
 * reader.parse(options, callback)
 * OR
 * reader.parse(callback)
 *
 * OPTIONS:
 *    option  | type     | default
 *    ----------------------------
 *    data      boolean    true    should it read the pixel data
 */
PNGReader.prototype.parse = function(options, callback){

	if (typeof options == 'function') callback = options;
	if (typeof options != 'object') options = {};

	try {

		this.decodeHeader();

		while (this.i < this.bytes.length){
			var type = this.decodeChunk();
			// stop after IHDR chunk, or after IEND
			if (type == 'IHDR' && options.data === false || type == 'IEND') break;
		}

		var png = this.png;

		this.decodePixels(function(err){
			callback(err, png);
		});

	} catch (e){
		callback(e);
	}

};

module.exports = PNGReader;


/***/ }),

/***/ 77:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
/**
 * Extract from pdf.js
 * https://github.com/mozilla/pdf.js
 *
 *
 *    Copyright (c) 2011 Mozilla Foundation
 *
 *    Contributors: Andreas Gal <gal@mozilla.com>
 *                  Chris G Jones <cjones@mozilla.com>
 *                  Shaon Barman <shaon.barman@gmail.com>
 *                  Vivien Nicolas <21@vingtetun.org>
 *                  Justin D'Arcangelo <justindarc@gmail.com>
 *                  Yury Delendik
 *                  Kalervo Kujala
 *                  Adil Allawi <@ironymark>
 *                  Jakob Miland <saebekassebil@gmail.com>
 *                  Artur Adib <aadib@mozilla.com>
 *                  Brendan Dahl <bdahl@mozilla.com>
 *                  David Quintana <gigaherz@gmail.com>
 *
 *    Permission is hereby granted, free of charge, to any person obtaining a
 *    copy of this software and associated documentation files (the "Software"),
 *    to deal in the Software without restriction, including without limitation
 *    the rights to use, copy, modify, merge, publish, distribute, sublicense,
 *    and/or sell copies of the Software, and to permit persons to whom the
 *    Software is furnished to do so, subject to the following conditions:
 *
 *    The above copyright notice and this permission notice shall be included in
 *    all copies or substantial portions of the Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 *    THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 *    DEALINGS IN THE SOFTWARE.
 */

/* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */



var Stream = (function StreamClosure() {
  function Stream(arrayBuffer, start, length, dict) {
    this.bytes = new Uint8Array(arrayBuffer);
    this.start = start || 0;
    this.pos = this.start;
    this.end = (start + length) || this.bytes.length;
    this.dict = dict;
  }

  // required methods for a stream. if a particular stream does not
  // implement these, an error should be thrown
  Stream.prototype = {
    get length() {
      return this.end - this.start;
    },
    getByte: function Stream_getByte() {
      if (this.pos >= this.end)
        return null;
      return this.bytes[this.pos++];
    },
    // returns subarray of original buffer
    // should only be read
    getBytes: function Stream_getBytes(length) {
      var bytes = this.bytes;
      var pos = this.pos;
      var strEnd = this.end;

      if (!length)
        return bytes.subarray(pos, strEnd);

      var end = pos + length;
      if (end > strEnd)
        end = strEnd;

      this.pos = end;
      return bytes.subarray(pos, end);
    },
    lookChar: function Stream_lookChar() {
      if (this.pos >= this.end)
        return null;
      return String.fromCharCode(this.bytes[this.pos]);
    },
    getChar: function Stream_getChar() {
      if (this.pos >= this.end)
        return null;
      return String.fromCharCode(this.bytes[this.pos++]);
    },
    skip: function Stream_skip(n) {
      if (!n)
        n = 1;
      this.pos += n;
    },
    reset: function Stream_reset() {
      this.pos = this.start;
    },
    moveStart: function Stream_moveStart() {
      this.start = this.pos;
    },
    makeSubStream: function Stream_makeSubStream(start, length, dict) {
      return new Stream(this.bytes.buffer, start, length, dict);
    },
    isStream: true
  };

  return Stream;
})();

// super class for the decoding streams
var DecodeStream = (function DecodeStreamClosure() {
  function DecodeStream() {
    this.pos = 0;
    this.bufferLength = 0;
    this.eof = false;
    this.buffer = null;
  }

  DecodeStream.prototype = {
    ensureBuffer: function DecodeStream_ensureBuffer(requested) {
      var buffer = this.buffer;
      var current = buffer ? buffer.byteLength : 0;
      if (requested < current)
        return buffer;
      var size = 512;
      while (size < requested)
        size <<= 1;
      var buffer2 = new Uint8Array(size);
      for (var i = 0; i < current; ++i)
        buffer2[i] = buffer[i];
      return (this.buffer = buffer2);
    },
    getByte: function DecodeStream_getByte() {
      var pos = this.pos;
      while (this.bufferLength <= pos) {
        if (this.eof)
          return null;
        this.readBlock();
      }
      return this.buffer[this.pos++];
    },
    getBytes: function DecodeStream_getBytes(length) {
      var end, pos = this.pos;

      if (length) {
        this.ensureBuffer(pos + length);
        end = pos + length;

        while (!this.eof && this.bufferLength < end)
          this.readBlock();

        var bufEnd = this.bufferLength;
        if (end > bufEnd)
          end = bufEnd;
      } else {
        while (!this.eof)
          this.readBlock();

        end = this.bufferLength;

        // checking if bufferLength is still 0 then
        // the buffer has to be initialized
        if (!end)
          this.buffer = new Uint8Array(0);
      }

      this.pos = end;
      return this.buffer.subarray(pos, end);
    },
    lookChar: function DecodeStream_lookChar() {
      var pos = this.pos;
      while (this.bufferLength <= pos) {
        if (this.eof)
          return null;
        this.readBlock();
      }
      return String.fromCharCode(this.buffer[this.pos]);
    },
    getChar: function DecodeStream_getChar() {
      var pos = this.pos;
      while (this.bufferLength <= pos) {
        if (this.eof)
          return null;
        this.readBlock();
      }
      return String.fromCharCode(this.buffer[this.pos++]);
    },
    makeSubStream: function DecodeStream_makeSubStream(start, length, dict) {
      var end = start + length;
      while (this.bufferLength <= end && !this.eof)
        this.readBlock();
      return new Stream(this.buffer, start, length, dict);
    },
    skip: function DecodeStream_skip(n) {
      if (!n)
        n = 1;
      this.pos += n;
    },
    reset: function DecodeStream_reset() {
      this.pos = 0;
    }
  };

  return DecodeStream;
})();

var FlateStream = (function FlateStreamClosure() {
  var codeLenCodeMap = new Uint32Array([
    16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15
  ]);

  var lengthDecode = new Uint32Array([
    0x00003, 0x00004, 0x00005, 0x00006, 0x00007, 0x00008, 0x00009, 0x0000a,
    0x1000b, 0x1000d, 0x1000f, 0x10011, 0x20013, 0x20017, 0x2001b, 0x2001f,
    0x30023, 0x3002b, 0x30033, 0x3003b, 0x40043, 0x40053, 0x40063, 0x40073,
    0x50083, 0x500a3, 0x500c3, 0x500e3, 0x00102, 0x00102, 0x00102
  ]);

  var distDecode = new Uint32Array([
    0x00001, 0x00002, 0x00003, 0x00004, 0x10005, 0x10007, 0x20009, 0x2000d,
    0x30011, 0x30019, 0x40021, 0x40031, 0x50041, 0x50061, 0x60081, 0x600c1,
    0x70101, 0x70181, 0x80201, 0x80301, 0x90401, 0x90601, 0xa0801, 0xa0c01,
    0xb1001, 0xb1801, 0xc2001, 0xc3001, 0xd4001, 0xd6001
  ]);

  var fixedLitCodeTab = [new Uint32Array([
    0x70100, 0x80050, 0x80010, 0x80118, 0x70110, 0x80070, 0x80030, 0x900c0,
    0x70108, 0x80060, 0x80020, 0x900a0, 0x80000, 0x80080, 0x80040, 0x900e0,
    0x70104, 0x80058, 0x80018, 0x90090, 0x70114, 0x80078, 0x80038, 0x900d0,
    0x7010c, 0x80068, 0x80028, 0x900b0, 0x80008, 0x80088, 0x80048, 0x900f0,
    0x70102, 0x80054, 0x80014, 0x8011c, 0x70112, 0x80074, 0x80034, 0x900c8,
    0x7010a, 0x80064, 0x80024, 0x900a8, 0x80004, 0x80084, 0x80044, 0x900e8,
    0x70106, 0x8005c, 0x8001c, 0x90098, 0x70116, 0x8007c, 0x8003c, 0x900d8,
    0x7010e, 0x8006c, 0x8002c, 0x900b8, 0x8000c, 0x8008c, 0x8004c, 0x900f8,
    0x70101, 0x80052, 0x80012, 0x8011a, 0x70111, 0x80072, 0x80032, 0x900c4,
    0x70109, 0x80062, 0x80022, 0x900a4, 0x80002, 0x80082, 0x80042, 0x900e4,
    0x70105, 0x8005a, 0x8001a, 0x90094, 0x70115, 0x8007a, 0x8003a, 0x900d4,
    0x7010d, 0x8006a, 0x8002a, 0x900b4, 0x8000a, 0x8008a, 0x8004a, 0x900f4,
    0x70103, 0x80056, 0x80016, 0x8011e, 0x70113, 0x80076, 0x80036, 0x900cc,
    0x7010b, 0x80066, 0x80026, 0x900ac, 0x80006, 0x80086, 0x80046, 0x900ec,
    0x70107, 0x8005e, 0x8001e, 0x9009c, 0x70117, 0x8007e, 0x8003e, 0x900dc,
    0x7010f, 0x8006e, 0x8002e, 0x900bc, 0x8000e, 0x8008e, 0x8004e, 0x900fc,
    0x70100, 0x80051, 0x80011, 0x80119, 0x70110, 0x80071, 0x80031, 0x900c2,
    0x70108, 0x80061, 0x80021, 0x900a2, 0x80001, 0x80081, 0x80041, 0x900e2,
    0x70104, 0x80059, 0x80019, 0x90092, 0x70114, 0x80079, 0x80039, 0x900d2,
    0x7010c, 0x80069, 0x80029, 0x900b2, 0x80009, 0x80089, 0x80049, 0x900f2,
    0x70102, 0x80055, 0x80015, 0x8011d, 0x70112, 0x80075, 0x80035, 0x900ca,
    0x7010a, 0x80065, 0x80025, 0x900aa, 0x80005, 0x80085, 0x80045, 0x900ea,
    0x70106, 0x8005d, 0x8001d, 0x9009a, 0x70116, 0x8007d, 0x8003d, 0x900da,
    0x7010e, 0x8006d, 0x8002d, 0x900ba, 0x8000d, 0x8008d, 0x8004d, 0x900fa,
    0x70101, 0x80053, 0x80013, 0x8011b, 0x70111, 0x80073, 0x80033, 0x900c6,
    0x70109, 0x80063, 0x80023, 0x900a6, 0x80003, 0x80083, 0x80043, 0x900e6,
    0x70105, 0x8005b, 0x8001b, 0x90096, 0x70115, 0x8007b, 0x8003b, 0x900d6,
    0x7010d, 0x8006b, 0x8002b, 0x900b6, 0x8000b, 0x8008b, 0x8004b, 0x900f6,
    0x70103, 0x80057, 0x80017, 0x8011f, 0x70113, 0x80077, 0x80037, 0x900ce,
    0x7010b, 0x80067, 0x80027, 0x900ae, 0x80007, 0x80087, 0x80047, 0x900ee,
    0x70107, 0x8005f, 0x8001f, 0x9009e, 0x70117, 0x8007f, 0x8003f, 0x900de,
    0x7010f, 0x8006f, 0x8002f, 0x900be, 0x8000f, 0x8008f, 0x8004f, 0x900fe,
    0x70100, 0x80050, 0x80010, 0x80118, 0x70110, 0x80070, 0x80030, 0x900c1,
    0x70108, 0x80060, 0x80020, 0x900a1, 0x80000, 0x80080, 0x80040, 0x900e1,
    0x70104, 0x80058, 0x80018, 0x90091, 0x70114, 0x80078, 0x80038, 0x900d1,
    0x7010c, 0x80068, 0x80028, 0x900b1, 0x80008, 0x80088, 0x80048, 0x900f1,
    0x70102, 0x80054, 0x80014, 0x8011c, 0x70112, 0x80074, 0x80034, 0x900c9,
    0x7010a, 0x80064, 0x80024, 0x900a9, 0x80004, 0x80084, 0x80044, 0x900e9,
    0x70106, 0x8005c, 0x8001c, 0x90099, 0x70116, 0x8007c, 0x8003c, 0x900d9,
    0x7010e, 0x8006c, 0x8002c, 0x900b9, 0x8000c, 0x8008c, 0x8004c, 0x900f9,
    0x70101, 0x80052, 0x80012, 0x8011a, 0x70111, 0x80072, 0x80032, 0x900c5,
    0x70109, 0x80062, 0x80022, 0x900a5, 0x80002, 0x80082, 0x80042, 0x900e5,
    0x70105, 0x8005a, 0x8001a, 0x90095, 0x70115, 0x8007a, 0x8003a, 0x900d5,
    0x7010d, 0x8006a, 0x8002a, 0x900b5, 0x8000a, 0x8008a, 0x8004a, 0x900f5,
    0x70103, 0x80056, 0x80016, 0x8011e, 0x70113, 0x80076, 0x80036, 0x900cd,
    0x7010b, 0x80066, 0x80026, 0x900ad, 0x80006, 0x80086, 0x80046, 0x900ed,
    0x70107, 0x8005e, 0x8001e, 0x9009d, 0x70117, 0x8007e, 0x8003e, 0x900dd,
    0x7010f, 0x8006e, 0x8002e, 0x900bd, 0x8000e, 0x8008e, 0x8004e, 0x900fd,
    0x70100, 0x80051, 0x80011, 0x80119, 0x70110, 0x80071, 0x80031, 0x900c3,
    0x70108, 0x80061, 0x80021, 0x900a3, 0x80001, 0x80081, 0x80041, 0x900e3,
    0x70104, 0x80059, 0x80019, 0x90093, 0x70114, 0x80079, 0x80039, 0x900d3,
    0x7010c, 0x80069, 0x80029, 0x900b3, 0x80009, 0x80089, 0x80049, 0x900f3,
    0x70102, 0x80055, 0x80015, 0x8011d, 0x70112, 0x80075, 0x80035, 0x900cb,
    0x7010a, 0x80065, 0x80025, 0x900ab, 0x80005, 0x80085, 0x80045, 0x900eb,
    0x70106, 0x8005d, 0x8001d, 0x9009b, 0x70116, 0x8007d, 0x8003d, 0x900db,
    0x7010e, 0x8006d, 0x8002d, 0x900bb, 0x8000d, 0x8008d, 0x8004d, 0x900fb,
    0x70101, 0x80053, 0x80013, 0x8011b, 0x70111, 0x80073, 0x80033, 0x900c7,
    0x70109, 0x80063, 0x80023, 0x900a7, 0x80003, 0x80083, 0x80043, 0x900e7,
    0x70105, 0x8005b, 0x8001b, 0x90097, 0x70115, 0x8007b, 0x8003b, 0x900d7,
    0x7010d, 0x8006b, 0x8002b, 0x900b7, 0x8000b, 0x8008b, 0x8004b, 0x900f7,
    0x70103, 0x80057, 0x80017, 0x8011f, 0x70113, 0x80077, 0x80037, 0x900cf,
    0x7010b, 0x80067, 0x80027, 0x900af, 0x80007, 0x80087, 0x80047, 0x900ef,
    0x70107, 0x8005f, 0x8001f, 0x9009f, 0x70117, 0x8007f, 0x8003f, 0x900df,
    0x7010f, 0x8006f, 0x8002f, 0x900bf, 0x8000f, 0x8008f, 0x8004f, 0x900ff
  ]), 9];

  var fixedDistCodeTab = [new Uint32Array([
    0x50000, 0x50010, 0x50008, 0x50018, 0x50004, 0x50014, 0x5000c, 0x5001c,
    0x50002, 0x50012, 0x5000a, 0x5001a, 0x50006, 0x50016, 0x5000e, 0x00000,
    0x50001, 0x50011, 0x50009, 0x50019, 0x50005, 0x50015, 0x5000d, 0x5001d,
    0x50003, 0x50013, 0x5000b, 0x5001b, 0x50007, 0x50017, 0x5000f, 0x00000
  ]), 5];

  function FlateStream(stream) {
    var bytes = stream.getBytes();
    var bytesPos = 0;

    this.dict = stream.dict;
    var cmf = bytes[bytesPos++];
    var flg = bytes[bytesPos++];
    if (cmf == -1 || flg == -1)
      error('Invalid header in flate stream: ' + cmf + ', ' + flg);
    if ((cmf & 0x0f) != 0x08)
      error('Unknown compression method in flate stream: ' + cmf + ', ' + flg);
    if ((((cmf << 8) + flg) % 31) != 0)
      error('Bad FCHECK in flate stream: ' + cmf + ', ' + flg);
    if (flg & 0x20)
      error('FDICT bit set in flate stream: ' + cmf + ', ' + flg);

    this.bytes = bytes;
    this.bytesPos = bytesPos;

    this.codeSize = 0;
    this.codeBuf = 0;

    DecodeStream.call(this);
  }

  FlateStream.prototype = Object.create(DecodeStream.prototype);

  FlateStream.prototype.getBits = function FlateStream_getBits(bits) {
    var codeSize = this.codeSize;
    var codeBuf = this.codeBuf;
    var bytes = this.bytes;
    var bytesPos = this.bytesPos;

    var b;
    while (codeSize < bits) {
      if (typeof (b = bytes[bytesPos++]) == 'undefined')
        error('Bad encoding in flate stream');
      codeBuf |= b << codeSize;
      codeSize += 8;
    }
    b = codeBuf & ((1 << bits) - 1);
    this.codeBuf = codeBuf >> bits;
    this.codeSize = codeSize -= bits;
    this.bytesPos = bytesPos;
    return b;
  };

  FlateStream.prototype.getCode = function FlateStream_getCode(table) {
    var codes = table[0];
    var maxLen = table[1];
    var codeSize = this.codeSize;
    var codeBuf = this.codeBuf;
    var bytes = this.bytes;
    var bytesPos = this.bytesPos;

    while (codeSize < maxLen) {
      var b;
      if (typeof (b = bytes[bytesPos++]) == 'undefined')
        error('Bad encoding in flate stream');
      codeBuf |= (b << codeSize);
      codeSize += 8;
    }
    var code = codes[codeBuf & ((1 << maxLen) - 1)];
    var codeLen = code >> 16;
    var codeVal = code & 0xffff;
    if (codeSize == 0 || codeSize < codeLen || codeLen == 0)
      error('Bad encoding in flate stream');
    this.codeBuf = (codeBuf >> codeLen);
    this.codeSize = (codeSize - codeLen);
    this.bytesPos = bytesPos;
    return codeVal;
  };

  FlateStream.prototype.generateHuffmanTable =
    function flateStreamGenerateHuffmanTable(lengths) {
    var n = lengths.length;

    // find max code length
    var maxLen = 0;
    for (var i = 0; i < n; ++i) {
      if (lengths[i] > maxLen)
        maxLen = lengths[i];
    }

    // build the table
    var size = 1 << maxLen;
    var codes = new Uint32Array(size);
    for (var len = 1, code = 0, skip = 2;
         len <= maxLen;
         ++len, code <<= 1, skip <<= 1) {
      for (var val = 0; val < n; ++val) {
        if (lengths[val] == len) {
          // bit-reverse the code
          var code2 = 0;
          var t = code;
          for (var i = 0; i < len; ++i) {
            code2 = (code2 << 1) | (t & 1);
            t >>= 1;
          }

          // fill the table entries
          for (var i = code2; i < size; i += skip)
            codes[i] = (len << 16) | val;

          ++code;
        }
      }
    }

    return [codes, maxLen];
  };

  FlateStream.prototype.readBlock = function FlateStream_readBlock() {
    // read block header
    var hdr = this.getBits(3);
    if (hdr & 1)
      this.eof = true;
    hdr >>= 1;

    if (hdr == 0) { // uncompressed block
      var bytes = this.bytes;
      var bytesPos = this.bytesPos;
      var b;

      if (typeof (b = bytes[bytesPos++]) == 'undefined')
        error('Bad block header in flate stream');
      var blockLen = b;
      if (typeof (b = bytes[bytesPos++]) == 'undefined')
        error('Bad block header in flate stream');
      blockLen |= (b << 8);
      if (typeof (b = bytes[bytesPos++]) == 'undefined')
        error('Bad block header in flate stream');
      var check = b;
      if (typeof (b = bytes[bytesPos++]) == 'undefined')
        error('Bad block header in flate stream');
      check |= (b << 8);
      if (check != (~blockLen & 0xffff))
        error('Bad uncompressed block length in flate stream');

      this.codeBuf = 0;
      this.codeSize = 0;

      var bufferLength = this.bufferLength;
      var buffer = this.ensureBuffer(bufferLength + blockLen);
      var end = bufferLength + blockLen;
      this.bufferLength = end;
      for (var n = bufferLength; n < end; ++n) {
        if (typeof (b = bytes[bytesPos++]) == 'undefined') {
          this.eof = true;
          break;
        }
        buffer[n] = b;
      }
      this.bytesPos = bytesPos;
      return;
    }

    var litCodeTable;
    var distCodeTable;
    if (hdr == 1) { // compressed block, fixed codes
      litCodeTable = fixedLitCodeTab;
      distCodeTable = fixedDistCodeTab;
    } else if (hdr == 2) { // compressed block, dynamic codes
      var numLitCodes = this.getBits(5) + 257;
      var numDistCodes = this.getBits(5) + 1;
      var numCodeLenCodes = this.getBits(4) + 4;

      // build the code lengths code table
      var codeLenCodeLengths = new Uint8Array(codeLenCodeMap.length);

      for (var i = 0; i < numCodeLenCodes; ++i)
        codeLenCodeLengths[codeLenCodeMap[i]] = this.getBits(3);
      var codeLenCodeTab = this.generateHuffmanTable(codeLenCodeLengths);

      // build the literal and distance code tables
      var len = 0;
      var i = 0;
      var codes = numLitCodes + numDistCodes;
      var codeLengths = new Uint8Array(codes);
      while (i < codes) {
        var code = this.getCode(codeLenCodeTab);
        if (code == 16) {
          var bitsLength = 2, bitsOffset = 3, what = len;
        } else if (code == 17) {
          var bitsLength = 3, bitsOffset = 3, what = (len = 0);
        } else if (code == 18) {
          var bitsLength = 7, bitsOffset = 11, what = (len = 0);
        } else {
          codeLengths[i++] = len = code;
          continue;
        }

        var repeatLength = this.getBits(bitsLength) + bitsOffset;
        while (repeatLength-- > 0)
          codeLengths[i++] = what;
      }

      litCodeTable =
        this.generateHuffmanTable(codeLengths.subarray(0, numLitCodes));
      distCodeTable =
        this.generateHuffmanTable(codeLengths.subarray(numLitCodes, codes));
    } else {
      error('Unknown block type in flate stream');
    }

    var buffer = this.buffer;
    var limit = buffer ? buffer.length : 0;
    var pos = this.bufferLength;
    while (true) {
      var code1 = this.getCode(litCodeTable);
      if (code1 < 256) {
        if (pos + 1 >= limit) {
          buffer = this.ensureBuffer(pos + 1);
          limit = buffer.length;
        }
        buffer[pos++] = code1;
        continue;
      }
      if (code1 == 256) {
        this.bufferLength = pos;
        return;
      }
      code1 -= 257;
      code1 = lengthDecode[code1];
      var code2 = code1 >> 16;
      if (code2 > 0)
        code2 = this.getBits(code2);
      var len = (code1 & 0xffff) + code2;
      code1 = this.getCode(distCodeTable);
      code1 = distDecode[code1];
      code2 = code1 >> 16;
      if (code2 > 0)
        code2 = this.getBits(code2);
      var dist = (code1 & 0xffff) + code2;
      if (pos + len >= limit) {
        buffer = this.ensureBuffer(pos + len);
        limit = buffer.length;
      }
      for (var k = 0; k < len; ++k, ++pos)
        buffer[pos] = buffer[pos - dist];
    }
  };

  return FlateStream;
})();

exports.Stream = Stream;
exports.FlateStream = FlateStream;


/***/ }),

/***/ 747:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 761:
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
__nccwpck_require__(467).attachTo(console)

})();

module.exports = __webpack_exports__;
/******/ })()
;

const hiiro = `iVBORw0KGgoAAAANSUhEUgAAADIAAAAzCAIAAABaAcxDAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF7GlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIyLTAxLTAyVDA4OjI1OjM5KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMi0wMS0wMlQwODo0MTowNSswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMi0wMS0wMlQwODo0MTowNSswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo0NDRjNTUwZS1hZDM1LTIwNGQtOTI2ZC1jYzk4YzM0OWE3NWEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Y2U5MjM3ZGUtODBhMS1iMjQ5LTg0ZGItMGEwMDUxYjBhZjM1IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6Y2U5MjM3ZGUtODBhMS1iMjQ5LTg0ZGItMGEwMDUxYjBhZjM1Ij4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpjZTkyMzdkZS04MGExLWIyNDktODRkYi0wYTAwNTFiMGFmMzUiIHN0RXZ0OndoZW49IjIwMjItMDEtMDJUMDg6MjU6MzkrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NDQ0YzU1MGUtYWQzNS0yMDRkLTkyNmQtY2M5OGMzNDlhNzVhIiBzdEV2dDp3aGVuPSIyMDIyLTAxLTAyVDA4OjQxOjA1KzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+ajtRywAAE4RJREFUWIW9mWlgFNWygOucnp59yWxJJmSDQAiQjSWQjSXsYAQBF1BUcAGfoE+uKKAXBUSE68ML6EVxF68IBAVBJewEAjGBBMJkIfs6mclkMvve033ej3BBBXxP3lK/+kydqvN1VZ+a7jqIEAL3KgUFBQ0NDQaDAQBiY2NZls3Pz09NTb1nhzcF3RvWiRMnDh8+HBcXN3hIUmZ2NoRYvV5/7tw5s9kMAKtXr46Njf0fcZE/LxcuXMjJySkpKbmj9uOPP540adLly5fvwfNN+dNYXq938uTJ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`

console.png(Buffer.from(hiiro, 'base64'))
