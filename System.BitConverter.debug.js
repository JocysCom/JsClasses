//=============================================================================
// Jocys.com JavaScript.NET Classes               (In C# Object Oriented Style)
// Created by Evaldas Jocys <evaldas@jocys.com>
//-----------------------------------------------------------------------------
// You can include this script on both sides - server and client:
// Server: <!-- #INCLUDE FILE="ScriptFile.js" -->
// Client: <script type="text/javascript" src="ScriptFile.js"></script>
//-----------------------------------------------------------------------------
// Warning: Be careful about what code you include in such way. Since the  code
// will be passed to the client side as simple text, your code can be  seen  by
// anyone who wants. Never do this with  scripts  which  contain  any  kind  of
// passwords, database connection strings, or SQL queries.
//=============================================================================
/// <reference path="System.debug.js" />
//=============================================================================
// Namespaces
//-----------------------------------------------------------------------------
// <PropertyGroup>
//		<RootNamespace>System</RootNamespace>
// <PropertyGroup>
//-----------------------------------------------------------------------------
// You can't use simple: 'System = System ? System : {};' line because it
// brakes JavaScript IntelliSense.
// Uncomment these lines to see JavaScript IntelliSense.
//eval("_system = System");
//var System = {};
//eval("System = _system ? _system : {}");
//=============================================================================

//=============================================================================
// CLASS: Timers
//-----------------------------------------------------------------------------

System._bitConverter = function () {
	/// <summary>
	/// </summary>
	/// <remarks>
	/// Some parst of code were taken from:
	/// 
	/// </remarks>	
	//---------------------------------------------------------
	// Public Properties.	
	this.IsLittleEndian;
	//---------------------------------------------------------
	// Private properties.
	var me = this;
	var cMask = {};
	cMask[System.TypeCode.Boolean] = 0x1;
	cMask[System.TypeCode.Byte] = 0xFF;
	cMask[System.TypeCode.SByte] = 0x7F;
	cMask[System.TypeCode.Int16] = 0x7FFF;
	cMask[System.TypeCode.Int32] = 0x7FFFFFFF;
	cMask[System.TypeCode.UInt16] = 0xFFFF;
	cMask[System.TypeCode.UInt32] = 0xFFFFFFFF;
	var sBits = {};
	sBits[System.TypeCode.Boolean] = 1;
	sBits[System.TypeCode.Byte] = 8;
	sBits[System.TypeCode.SByte] = 8;
	sBits[System.TypeCode.Int16] = 16;
	sBits[System.TypeCode.Int32] = 32;
	sBits[System.TypeCode.UInt16] = 16;
	sBits[System.TypeCode.UInt32] = 32;
	//---------------------------------------------------------
	this.GetBytes = function (value, typeCode) {
		/// <summary>
		/// Convert number to bytes[4].
		/// </summary>
		/// <param name="value">Value to contvert</param>
		/// <param name="typeCode">Type of value</param>
		// If value is number.
		switch (typeof value) {
			case "boolean":
				return value ? [1] : [0];
			case "number":
				switch (typeCode) {
					case System.TypeCode.Single: return this.GetBytesFromNumber(value, 32);
					case System.TypeCode.Double: return this.GetBytesFromNumber(value, 64);
					case System.TypeCode.Int16:
					case System.TypeCode.UInt16: return this.GetBytesFromInt16Le(value);
					case System.TypeCode.Int32:
					case System.TypeCode.UInt32: return this.GetBytesFromInt32Le(value);
					default: return this.GetBytesFromInt32Le(value);
				}
			case "object":
				// Value is array of numbers.
				switch (typeCode) {
					case System.TypeCode.Single: return this.GetBytesFromNumber(value, 32);
					case System.TypeCode.Double: return this.GetBytesFromNumber(value, 64);
					case System.TypeCode.Int16:
					case System.TypeCode.UInt16:
					case System.TypeCode.Int32:
					case System.TypeCode.UInt32: return this.GetBytesFromInt32ArrayLe(value);
					default: return this.GetBytesFromInt32ArrayLe(value);
				}
			default:
				// Unknown type.
				break;
		}
	};
	//---------------------------------------------------------
	this.ToSingle = function (value, startIndex) {
		var bytes = value.slice(startIndex, startIndex + 4);
		return this.ToNumber(bytes);
	};
	//---------------------------------------------------------
	this.ToDouble = function (value, startIndex) {
		var bytes = value.slice(startIndex, startIndex + 8);
		return this.ToNumber(bytes);
	};
	//---------------------------------------------------------
	this.ToBoolean = function (value, startIndex) {
		/// <summary>
		/// Returns a 16-bit signed integer converted from 2 bytes at a specified
		///  position in a byte array.
		/// </summary>
		/// <param name="value">An array of bytes.</param>
		/// <param name="startIndex">The starting position within value.</param>
		return value[startIndex] & 0x1 ? true : false;
	};
	//---------------------------------------------------------
	this.ToInt16Le = function (value, startIndex) {
		/// <summary>
		/// Returns a 16-bit signed integer converted from 2 bytes at a specified
		///  position in a byte array.
		/// </summary>
		/// <param name="value">An array of bytes.</param>
		/// <param name="startIndex">The starting position within value.</param>
		return this.GetSigned(this.ToInt16ArrayLe(value, startIndex, 2)[0], System.TypeCode.Int16);
	};
	//---------------------------------------------------------
	this.ToInt16Be = function (value, startIndex) {
		/// <summary>
		/// Returns a 16-bit signed integer converted from 2 big-endian bytes at a specified
		/// position in a byte array.
		/// </summary>
		/// <param name="value">An array of bytes.</param>
		/// <param name="startIndex">The starting position within value.</param>
		return this.GetSigned(this.ToInt16ArrayBe(value, startIndex, 2)[0], System.TypeCode.Int16);
	};
	//---------------------------------------------------------	
	this.ToInt16 = this.ToInt16Le;
	//---------------------------------------------------------
	this.ToUInt16Le = function (value, startIndex) {
		/// <summary>
		/// Convert byte[] to UInt16[] with little-endian byte order.
		/// </summary>
		return this.GetUnsigned(this.ToInt16Le(value, startIndex), System.TypeCode.Int16);
	};
	//---------------------------------------------------------
	this.ToUInt16Be = function (value, startIndex) {
		/// <summary>
		/// Convert byte[] to UInt16[] with little-endian byte order.
		/// </summary>
		return this.GetUnsigned(this.ToInt16Be(value, startIndex), System.TypeCode.Int16);
	};
	//---------------------------------------------------------	
	this.ToUInt16 = this.ToUInt16Le;
	//---------------------------------------------------------
	this.ToInt32Le = function (value, startIndex) {
		/// <summary>
		/// Returns a 32-bit signed integer converted from 4 bytes at a specified
		///  position in a byte array.
		/// </summary>
		/// <param name="value">An array of bytes.</param>
		/// <param name="startIndex">The starting position within value.</param>
		return this.ToInt32ArrayLe(value, startIndex, 4)[0];
	};
	//---------------------------------------------------------
	this.ToInt32Be = function (value, startIndex) {
		/// <summary>
		/// Returns a 32-bit signed integer converted from 4 big-endian bytes at a specified
		/// position in a byte array.
		/// </summary>
		/// <param name="value">An array of bytes.</param>
		/// <param name="startIndex">The starting position within value.</param>
		return this.ToInt32ArrayBe(value, startIndex, 4)[0];
	};
	//---------------------------------------------------------	
	this.ToInt32 = this.ToInt32Le;
	//---------------------------------------------------------
	this.ToUInt32Le = function (value, startIndex) {
		/// <summary>
		/// Convert byte[] to UInt32[] with little-endian byte order.
		/// </summary>
		return this.GetUnsigned(this.ToInt32Le(value, startIndex), System.TypeCode.Int32);
	};
	//---------------------------------------------------------
	this.ToUInt32Be = function (value, startIndex) {
		/// <summary>
		/// Convert byte[] to UInt32[] with little-endian byte order.
		/// </summary>
		return this.GetUnsigned(this.ToInt32Be(value, startIndex), System.TypeCode.Int32);
	};
	//---------------------------------------------------------	
	this.ToUInt32 = this.ToUInt32Le;
	//---------------------------------------------------------
	this._GetBytesFromInt = function (value, typeCode, bigEndian) {
		var sizeBits = sBits[typeCode];
		var sizeBytes = (sizeBits ? sizeBits : 32) / 8;
		var bytes = new Array(sizeBytes);
		for (b = 0; b < sizeBytes; b++) {
			m = bigEndian
				? sizeBytes - 1 - b
				: b;
			bytes[m] = value >> b * 8 & 0xff;
		}
		return bytes;
	};
	//---------------------------------------------------------
	this.GetBytesFromInt16Le = function (value) {
		return this._GetBytesFromInt(value, System.TypeCode.Int16, false);
	};
	this.GetBytesFromInt16Be = function (value) {
		return this._GetBytesFromInt(value, System.TypeCode.Int16, true);
	};
	this.GetBytesFromInt32Le = function (value) {
		return this._GetBytesFromInt(value, System.TypeCode.Int32, false);
	};
	this.GetBytesFromInt32Be = function (value) {
		return this._GetBytesFromInt(value, System.TypeCode.Int32, true);
	};
	//---------------------------------------------------------	
	this.GetBitsLe = function (array, typeCode) {
		/// <summary>
		/// Convert bytes into little-endian bit array
		/// </summary>
		var length = array.length;
		var bpn = sBits[typeCode];
		// Treat array as Int32[].
		bpn = bpn ? bpn : 32;
		var bits = new Array(length * bpn);
		for (var i = 0; i < length; i++) {
			var value = array[i];
			for (var b = 0; b < bpn; b++) {
				bits[i * bpn + b] = value & 0x1;
				value = value >> 1;
			}
		}
		return bits;
	};
	//---------------------------------------------------------	
	this.GetBitsBe = function (array, typeCode) {
		/// <summary>
		/// Convert bytes into big-endian bit array
		/// </summary>
		var length = array.length;
		var bpn = sBits[typeCode];
		// Treat array as Int32[].
		bpn = bpn ? bpn : 32;
		var bits = new Array(length * bpn);
		for (var i = 0; i < length; i++) {
			var value = array[i];
			for (var b = 0; b < bpn; b++) {
				bits[i * bpn + bpn - 1 - b] = value & 0x1;
				value = value >> 1;
			}
		}
		return bits;
	};
	//---------------------------------------------------------	
	this.GetBits = this.GetBitsLe;
	//---------------------------------------------------------
	this.GetUnsigned = function (value, typeCode) {
		/// <summary>
		/// Convert signed integers to unsigned integers.
		/// For example: convert SBytes array [-127:127] to Bytes array [0:255].
		/// </summary>
		/// <param name="typeCode">Signed value type</param>
		var results;
		var umask = cMask[typeCode + 1];
		// If value is number.
		if (typeof value === "number") {
			results = (value & umask) << 0 >>> 0;
		} else {
			// Value is array of numbers.
			umask = cMask[typeCode + 1];
			var length = value.length;
			results = new Array(length);
			for (var i = 0; i < length; i++) {
				var n = value[i];
				results[i] = n & umask << 0 >>> 0;
			}
		}
		return results;
	};
	//---------------------------------------------------------
	this.GetSigned = function (value, typeCode) {
		/// <summary>
		/// Convert unsigned integers to signed integers.
		/// For example: Convert Bytes array [0:255] to SBytes array [-127:127].
		/// </summary>
		/// <param name="typeCode">Unsigned value type</param>
		var results;
		var umask = cMask[typeCode];
		var smask = cMask[typeCode - 1];
		// If value is number.
		if (typeof value === "number") {
			results = value > smask ? -(-value & umask) : value;
		} else {
			// Value is array of numbers.
			var length = value.length;
			results = new Array(length);
			for (var i = 0; i < length; i++) {
				var n = value[i];
				results[i] = n > smask ? -(-n & umask) : n;
			}
		}
		return results;
	};
	//---------------------------------------------------------
	function _GetBytesFromIntArray(array, startIndex, count, typeCode, bigEndian) {
		// Convert Int<Bits> array to bytes. 
		/// <summary>
		/// Convert IntN[] to byte[].
		/// </summary>
		var sizeBits = sBits[typeCode];
		var sizeBytes = (sizeBits ? sizeBits : 32) / 8;
		startIndex = startIndex ? startIndex : 0;
		count = count ? count : array.length - startIndex;
		var bytes = new Array(count * sizeBytes);
		var i, b, m;
		var length = startIndex + count;
		for (i = startIndex; i < length; i++) {
			for (b = 0; b < sizeBytes; b++) {
				m = bigEndian
					? i * sizeBytes + sizeBytes - 1 - b
					: i * sizeBytes + b;
				bytes[m] = array[i] >> b * 8 & 0xff;
			}
		}
		return bytes;
	}
	//---------------------------------------------------------
	this.GetBytesFromInt16ArrayLe = function (value, startIndex, count) {
		return _GetBytesFromIntArray(value, startIndex, count, System.TypeCode.Int16, false);
	};
	this.GetBytesFromInt16ArrayBe = function (value, startIndex, count) {
		return _GetBytesFromIntArray(value, startIndex, count, System.TypeCode.Int16, true);
	};
	this.GetBytesFromInt32ArrayLe = function (value, startIndex, count) {
		return _GetBytesFromIntArray(value, startIndex, count, System.TypeCode.Int32, false);
	};
	this.GetBytesFromInt32ArrayBe = function (value, startIndex, count) {
		return _GetBytesFromIntArray(value, startIndex, count, System.TypeCode.Int32, true);
	};
	//---------------------------------------------------------
	function _ToIntArray(bytes, startIndex, count, typeCode, bigEndian) {
		// Convert bytes to Int<Bits> array. 
		var sizeBits = sBits[typeCode];
		var sizeBytes = (sizeBits ? sizeBits : 32) / 8;
		startIndex = startIndex ? startIndex : 0;
		count = count ? count : bytes.length - startIndex;
		var mask = (1 << 8) - 1;
		var array = Array();
		var v, m;
		for (var i = 0; i < count; i++) {
			var bi = (i - i % sizeBytes) / sizeBytes;
			v = bytes[startIndex + i] & mask;
			m = i % sizeBytes * 8;
			if (bigEndian) m = sizeBits - 8 - m;
			array[bi] |= v << m;
		}
		return array;
	}
	//---------------------------------------------------------
	this.ToInt16ArrayLe = function (value, startIndex, count) {
		/// <summary>
		/// Returns a 16-bit signed integer converted from 2 bytes at a specified
		/// position in a little-endian byte array. [56, 14, ...] > [56+14*256, ...
		/// </summary>
		/// <param name="value">An array of bytes.</param>
		/// <param name="startIndex">The starting position within value.</param>
		/// <param name="count">How many bytes to read.</param>
		return _ToIntArray(value, startIndex, count, System.TypeCode.Int16, false);
	};
	//---------------------------------------------------------
	this.ToInt16ArrayBe = function (value, startIndex, count) {
		/// <summary>
		/// Returns a 16-bit signed integer converted from 2 bytes at a specified
		/// position in a big-endian byte array. [56, 14, ...] > [56*256+14, ...
		/// </summary>
		/// <param name="value">An array of bytes.</param>
		/// <param name="startIndex">The starting position within value.</param>
		/// <param name="count">How many bytes to read.</param>
		return _ToIntArray(value, startIndex, count, System.TypeCode.Int16, true);
	};
	//---------------------------------------------------------
	this.ToInt32ArrayLe = function (value, startIndex, count) {
		/// <summary>
		/// Convert byte[] to Int32[] with little-endian byte order.
		/// </summary>
		return _ToIntArray(value, startIndex, count, System.TypeCode.Int32, false);
	};
	//---------------------------------------------------------
	this.ToInt32ArrayBe = function (value, startIndex, count) {
		/// <summary>
		/// Returns a 32-bit signed integer converted from 4 bytes at a specified
		/// position in a byte array.
		/// </summary>
		/// <param name="value">An array of bytes.</param>
		/// <param name="startIndex">The starting position within value.</param>
		return _ToIntArray(value, startIndex, count, System.TypeCode.Int32, true);
	};
	//---------------------------------------------------------
	this.Int16EndianSwap = function (x) {
		x = x >> 8 |
			x << 8;
		return x;
	};
	//---------------------------------------------------------
	this.Int32EndianSwap = function (x) {
		x = x >> 24 |
			x << 8 & 0x00FF0000 |
			x >> 8 & 0x0000FF00 |
			x << 24;
		return x;
	};
	//---------------------------------------------------------
	this.Int64EndianSwap = function (x) {
		// Swap number bytes.
		x = x >> 56 |
			x << 40 & 0x00FF000000000000 |
			x << 24 & 0x0000FF0000000000 |
			x << 8 & 0x000000FF00000000 |
			x >> 8 & 0x00000000FF000000 |
			x >> 24 & 0x0000000000FF0000 |
			x >> 40 & 0x000000000000FF00 |
			x << 56;
		return x;
	};
	//---------------------------------------------------------
	this.ToString = function (bytes, separator, format) {
		/// <summary>
		/// Array of bytes to hex string.
		/// </summary>
		/// <param name="bytes">An array of 8-bit integers.</param>
		/// <param name="separator">Default separator is '-'.</param>
		/// <returns type="string">Hex string.</returns>
		var sb = [];
		var s = "";
		if (!bytes) return;
		// Formats: X[1-N];
		format = format ? format : "X2";
		var len = parseInt(format.substr(1));
		var pfx = "";
		var i;
		for (i = 0; i < len; i++) pfx += "0";
		for (i = 0; i < bytes.length; i++) {
			// If number is negative (sByte: -127; 127) makes it byte.
			var b = bytes[i] & 0xFF;
			var hex = b.toString(16).toUpperCase();
			sb.push(pfx.substr(0, len - hex.length) + hex);
		}
		var sep = typeof separator === "undefined" ? '-' : separator;
		return sb.join(sep);
	};
	//---------------------------------------------------------
	this.SemSingleToBytes = function (sign, exponent, mantissa) {
		/// <summary>
		/// Combine SEM of single number to byte[4] array.
		/// </summary>
		/// <param name="sign">Sign (1-bit).</param>
		/// <param name="exponent">Biased exponent (8-bits).</param>
		/// <param name="mantissa">mantissa fraction (23-bits).</param>
		var B = new Array(4);
		// Round.
		mantissa = Math.pow(2, 23) * mantissa + 0.5;
		B[3] = 0xFF & mantissa;
		B[2] = 0xFF & mantissa >> 8;
		B[1] = 0x7F & mantissa >> 16 | (exponent & 1) << 7;
		B[0] = sign << 7 | exponent >> 1;
		return B;
	};
	//---------------------------------------------------------
	this.SemDoubleToBytes = function (sign, exponent, mantissa) {
		/// <summary>
		/// Combine SEM of double number to byte[8] array.
		/// </summary>
		/// <param name="sign">Sign (1-bit).</param>
		/// <param name="exponent">Biased exponent (11-bits).</param>
		/// <param name="mantissa">mantissa fraction (52-bits).</param>
		var B = new Array(4);
		mantissa = Math.pow(2, 52) * mantissa;
		B[3] = 0xFFFF & mantissa;
		B[2] = 0xFFFF & mantissa >> 16;
		// Integers are only 32-bit.
		mantissa /= Math.pow(2, 32);
		B[1] = 0xFFFF & mantissa;
		B[0] = sign << 15 | exponent << 4 | 0x000F & mantissa >> 16;
		// Convert Int16[] to bytes[];
		return this.GetBytesFromInt16ArrayBe(B, 0, B.length);
	};
	//---------------------------------------------------------
	this.GetBytesFromNumber = function (Qty, NumW) {
		this.Number = Qty;
		var Bin;
		this.nb01 = "";  // , OutW = NumW/4
		var Inf = { 32: { d: 0x7F, c: 0x80, b: 0, a: 0 }, 64: { d: 0x7FF0, c: 0, b: 0, a: 0 } };
		var ExW = { 32: 8, 64: 11 }[NumW];
		var MtW = NumW - ExW - 1;
		var sign;
		var exponent;
		var mantissa;
		if (isNaN(Qty)) {
			Bin = Inf[NumW];
			Bin.a = 1;
			sign = false;
			exponent = Math.pow(2, ExW) - 1;
			mantissa = Math.pow(2, -MtW);
		}
		if (!Bin) {
			sign = Qty < 0 || 1 / Qty < 0; // OK for +-0
			if (!isFinite(Qty)) {
				Bin = Inf[NumW];
				if (this.Sign) Bin.d += 1 << NumW / 4 - 1;
				exponent = Math.pow(2, ExW) - 1;
				mantissa = 0;
			}
		}
		if (!Bin) {
			exponent = { 32: 127, 64: 1023 }[NumW];
			mantissa = Math.abs(Qty);
			while (mantissa >= 2) {
				exponent++;
				mantissa /= 2;
			}
			while (mantissa < 1 && this.Exponent > 0) {
				exponent--;
				mantissa *= 2;
			}
			if (exponent <= 0) {
				mantissa /= 2;
				// "Zero or Denormal";
			}
			if (NumW === 32 && this.Exponent > 254) {
				// "Too big for Single";
				Bin = { d: sign ? 0xFF : 0x7F, c: 0x80, b: 0, a: 0 };
				exponent = Math.pow(2, ExW) - 1;
				mantissa = 0;
			}
		}
		var array;
		if (!Bin) {
			if (NumW === 32) array = this.SemSingleToBytes(sign, exponent, mantissa);
			if (NumW === 64) array = this.SemDoubleToBytes(sign, exponent, mantissa);
		} else {
			array = [Bin.a, Bin.b, Bin.c, Bin.d];
			// Convert Int16[] to bytes[];
			if (NumW === 64) array = this.GetBytesFromInt16ArrayBe(array, 0, array.length);
		}
		// Reverse from big-endian to little-endian;
		return array.reverse();
	};
	//---------------------------------------------------------
	this.ToNumber = function (value) {
		// Reverse from little-endian to big-endian;
		var bytes = value.reverse();
		var bits = this.GetBitsBe(bytes, System.TypeCode.Byte);
		var BinStr = this.GetBitsBe(bytes, System.TypeCode.Byte).join('');
		var ExW = { 32: 8, 64: 11 }[BinStr.length];
		var M = BinStr.match(new RegExp("^(.)(.{" + ExW + "})(.*)$"));
		// M[1] sign, M[2] exponent, M[3] mantissa.
		var sign = bits[0] === 1 ? "-" : "+";
		var denorm = +M[2] === 0;
		var expo = parseInt(M[2], 2) - Math.pow(2, ExW - 1) + 1;
		var array = DecimalDigits(bits, ExW);
		// Prepend digit point.
		array.unshift(+!denorm, ".");
		if (denorm) expo++;
		while (expo < 0) {
			expo++;
			Halve(array);
		}
		while (expo > 0) {
			expo--;
			Twice(array);
		}
		var value1 = sign + array.join("").replace(/(\d)0+$/, "$1");
		return +eval(value1);
	};
	//---------------------------------------------------------
	function Add(A, P) {
		var C = 0;
		var K = P.length;
		var T;
		while (K--) {
			T = (A[K] | 0) + P[K] + C;
			A[K] = T % 10;
			C = T > 9;
		}
	}
	//---------------------------------------------------------
	function Halve(P) {
		var C = 0;
		var L = P.length;
		var T;
		for (var K = 0; K < L; K++) {
			if ((T = P[K]) !== ".") {
				T += 10 * C;
				C = T & 1;
				P[K] = T >> 1;
			}
		}
		if (C) P[K] = 5;
	}
	//---------------------------------------------------------
	function DecimalDigits(bits, ExW) {
		var A = [0];
		var P = [10];
		// Route througth mantisa bits.
		var index = ExW + 1;
		var length = bits.length;
		for (var i = index; i < length; i++) {
			Halve(P);
			if (bits[i] === 1) Add(A, P);
		}
		// A, P decimal fraction parts.
		return A;
	}
	//---------------------------------------------------------
	function Twice(A) {
		var K = A.length;
		C = 0;
		T;
		while (K--) {
			if ((T = A[K]) !== ".") {
				T = 2 * T + C;
				A[K] = T % 10;
				C = T > 9;
			}
		}
		// Prepend.
		if (C) A.unshift(1);
	}
	//---------------------------------------------------------
	this._isLittleEndian = function () {
		// 0x1234 - hex number (= 0x12 * 0x100 + 34)
		// In Little Endian little end (least significant byte, LSB) is stored first.
		// 0x1234 -> [0x34, 0x12]
		// In Big Endian big end (most significant byte, MSB) is stored first.
		// 0x1234 -> [0x12, 0x34]
		//
		// Windows NT was designed around Little Endian architecture.
		//
		// binary representations of 1.0:
		// memory/array index:     0  1  2  3  4  5  6  7
		// big endian:            3f f0 00 00 00 00 00 00
		// little endian:         00 00 00 00 00 00 f0 3f
		// arm fpa little endian: 00 00 f0 3f 00 00 00 00
		var bytes = this.GetBytes(-1.5, System.TypeCode.Double);
		return bytes[0] === 0;
	};
	//---------------------------------------------------------
	this.Initialize = function () {
		this.IsLittleEndian = this._isLittleEndian();
	};
	this.Initialize.apply(this, arguments);
};

System.BitConverter = new System._bitConverter();

System.BitConverter.ToArrayDefinition = function (bytes, cols, format) {
	var sb = [];
	var s = "<br />\r\nvar a = [<br />\r\n";
	cols = cols ? cols : 8;
	// Formats: X[1-N];
	format = format ? format : "X4";
	var len = parseInt(format.substr(1));
	var pfx = "";
	var i;
	for (i = 0; i < len; i++) pfx += "0";
	for (i = 0; i < bytes.length; i++) {
		var hex = bytes[i].toString(16).toUpperCase();
		sb.push(pfx.substr(0, len - hex.length) + hex);
		if (!((i + 1) % cols)) {
			s += "0x";
			s += sb.join(", 0x");
			if (i < bytes.length - 1) s += ",";
			s += "<br />\r\n";
			sb = [];
		}
	}
	if (sb.length > 0) {
		s += "0x";
		s += sb.join(", 0x");
		s += "<br />\r\n";
	}
	s += "];";
	return s;
};

//==============================================================================
// END
//------------------------------------------------------------------------------