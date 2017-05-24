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
//		<RootNamespace>System.Security.Cryptography</RootNamespace>
// <PropertyGroup>
//-----------------------------------------------------------------------------
System.Type.RegisterNamespace("System.Security.Cryptography");
//=============================================================================

System.Security.Cryptography.SHA256 = function () {
	/// <summary>
	/// Represents SHA256 hash algorithm class.
	/// </summary>
	/// <example>
	/// // Create SHA256 Algorithm (JavaScript Example);
	/// var sha256 = new System.Security.Cryptography.SHA256CryptoServiceProvider();
	/// // Test SHA256 Algorithm: If 'sha256.Test() = true' then everything works OK.
	/// alert("sha256.Test() = "+sha256.Test());
	/// // Convert string to array of bytes.
	/// var bytes = System.Text.Encoding.UTF8.GetBytes("test string");
	/// // Compute hash.
	/// alert("sha256.ComputeHashAsHex(\"test string\")"+sha256.ComputeHashAsHex(bytes);
	/// </example>
	/// <remarks>
	/// http://www.movable-type.co.uk/scripts/sha256.html
	/// Recreated as class by Evaldas Jocys [2017] - SHA256 (256bit) - System.Security.Cryptography.SHA256
	/// </remarks>
	//---------------------------------------------------------
	// Public properties.
	this.Name = "SHA256";
	// Configurable variables. You may need to tweak these to be compatible with
	// the server-side, but the defaults work in most cases.
	this.chrsz = 8;  /* bits per input character. 8 - ASCII; 16 - Unicode      */

	// Fields
	this._buffer = new System.Byte();
	this._count = 0;
	this._stateSHA256 = [];
	this._W = [];
	this._K = [
		0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
		0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
		0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
		0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
		0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
		0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
		0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
		0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
	];
	//---------------------------------------------------------
	this.ComputeHashAsHex = function (value) {
		var bytes = this.ComputeHash(value);
		return System.BitConverter.ToString(bytes, '');
	};
	//---------------------------------------------------------
	this.ComputeHashAsBase64 = function (value) {
		var bytes = this.ComputeHash(value);
		return System.Convert.ToBase64String(bytes, false);
	};
	//---------------------------------------------------------
	this._HashData = function (partIn, ibStart, cbSize) {
		var byteCount = cbSize;
		var srcOffset = ibStart;
		var dstOffset = this._count & 0x3f;
		this._count += byteCount;
		if (dstOffset > 0 && dstOffset + byteCount >= 0x40) {
			System.Buffer.BlockCopy(partIn, srcOffset, this._buffer, dstOffset, 0x40 - dstOffset);
			srcOffset += 0x40 - dstOffset;
			byteCount -= 0x40 - dstOffset;
			this.SHATransform(this._W, this._stateSHA256, this._buffer);
			dstOffset = 0;
		}
		while (byteCount >= 0x40) {
			System.Buffer.BlockCopy(partIn, srcOffset, this._buffer, 0, 0x40);
			srcOffset += 0x40;
			byteCount -= 0x40;
			this.SHATransform(this._W, this._stateSHA256, this._buffer);
		}
		if (byteCount > 0) {
			System.Buffer.BlockCopy(partIn, srcOffset, this._buffer, dstOffset, byteCount);
		}
	};
	//---------------------------------------------------------
	this.HashCore = function (rgb, ibStart, cbSize) {
		this._HashData(rgb, ibStart, cbSize);
	};
	//---------------------------------------------------------
	this._EndHash = function () {
		var block = new System.Byte(0x20);
		var num = 0x40 - this._count & 0x3f;
		if (num <= 8) num += 0x40;
		var partIn = new System.Byte(num);
		partIn[0] = 0x80;
		var num2 = this._count * 0x8;
		var n = num2;
		for (var i = 1; i <= 8; i++) {
			partIn[num - i] = n & 0xff;
			n = n >> 0x08;
		}
		this._HashData(partIn, 0, partIn.length);
		DWORDToBigEndian(block, this._stateSHA256, 8);
		this.HashValue = block;
		return block;
	};
	//---------------------------------------------------------
	this.HashFinal = function () {
		return this._EndHash();
	};

	//---------------------------------------------------------
	// block is buffer. all references
	this.SHATransform = function (expandedBuffer, state, block) {
		var a = state[0];
		var b = state[1];
		var c = state[2];
		var d = state[3];
		var e = state[4];
		var f = state[5];
		var g = state[6];
		var h = state[7];
		DWORDFromBigEndian(expandedBuffer, 0x10, block);
		this.SHA256Expand(expandedBuffer);
		for (var i = 0; i < 0x40; i++) {

			var num17 = h + Sigma_1(e) + Ch(e, f, g) + this._K[i] + expandedBuffer[i];
			var num13 = d + num17;
			var num9 = num17 + Sigma_0(a) + Maj(a, b, c);
			i++;
			num17 = g + Sigma_1(num13) + Ch(num13, e, f) + this._K[i] + expandedBuffer[i];
			var num14 = c + num17;
			var num10 = num17 + Sigma_0(num9) + Maj(num9, a, b);
			i++;
			num17 = f + Sigma_1(num14) + Ch(num14, num13, e) + this._K[i] + expandedBuffer[i];
			var num16 = b + num17;
			var num11 = num17 + Sigma_0(num10) + Maj(num10, num9, a);
			i++;
			num17 = e + Sigma_1(num16) + Ch(num16, num14, num13) + this._K[i] + expandedBuffer[i];
			var num15 = a + num17;
			var num12 = num17 + Sigma_0(num11) + Maj(num11, num10, num9);
			i++;
			num17 = num13 + Sigma_1(num15) + Ch(num15, num16, num14) + this._K[i] + expandedBuffer[i];
			h = num9 + num17;
			d = num17 + Sigma_0(num12) + Maj(num12, num11, num10);
			i++;
			num17 = num14 + Sigma_1(h) + Ch(h, num15, num16) + this._K[i] + expandedBuffer[i];
			g = num10 + num17;
			c = num17 + Sigma_0(d) + Maj(d, num12, num11);
			i++;
			num17 = num16 + Sigma_1(g) + Ch(g, h, num15) + this._K[i] + expandedBuffer[i];
			f = num11 + num17;
			b = num17 + Sigma_0(c) + Maj(c, d, num12);
			i++;
			num17 = num15 + Sigma_1(f) + Ch(f, g, h) + this._K[i] + expandedBuffer[i];
			e = num12 + num17;
			a = num17 + Sigma_0(b) + Maj(b, c, d);
		}
		// Compute the new intermediate hash value (note '>>> 0' for 'addition modulo 2^32')
		state[0] = state[0] + a >>> 0;
		state[1] = state[1] + b >>> 0;
		state[2] = state[2] + c >>> 0;
		state[3] = state[3] + d >>> 0;
		state[4] = state[4] + e >>> 0;
		state[5] = state[5] + f >>> 0;
		state[6] = state[6] + g >>> 0;
		state[7] = state[7] + h >>> 0;
	};
	//---------------------------------------------------------

	function DWORDToBigEndian(block, x, digits) {
		return System.Security.Cryptography.Utils.DWORDToBigEndian(block, x, digits);
	}

	function DWORDFromBigEndian(x, digits, block) {
		return System.Security.Cryptography.Utils.DWORDFromBigEndian(x, digits, block);
	}

	function rr(x, y) {
		return System.Security.Cryptography.Utils.RotateRight(x, y);
	}

	function Maj(x, y, z) {
		/// <summary>
		/// Majority
		/// </summary>
		return x & y ^ x & z ^ y & z;
	}

	function Ch(x, y, z) {
		/// <summary>
		/// Choice.
		/// </summary>
		return x & y ^ ~x & z;
	}

	function sigma_0(x) {
		return rr(x, 7) ^ rr(x, 18) ^ x >>> 3;
	}

	function Sigma_0(x) {
		return rr(x, 2) ^ rr(x, 13) ^ rr(x, 0x16);
	}

	function sigma_1(x) {
		return rr(x, 17) ^ rr(x, 19) ^ x >>> 10;
	}

	function Sigma_1(x) {
		return rr(x, 6) ^ rr(x, 11) ^ rr(x, 0x19);
	}

	//---------------------------------------------------------
	this.SHA256Expand = function (x) {
		for (var i = 16; i < 64; i++) {
			x[i] = sigma_1(x[i - 2]) + x[i - 7] + sigma_0(x[i - 15]) + x[i - 16] >>> 0;
		}
	};
	//---------------------------------------------------------
	this.Initialize = function () {
		this.InitializeState();
		System.Array.Clear(this._buffer, 0, this._buffer.length);
		System.Array.Clear(this._W, 0, this._W.length);
	};
	this.InitializeState = function () {
		this._count = 0;
		this._stateSHA256[0] = 0x6a09e667;
		this._stateSHA256[1] = 0xbb67ae85;
		this._stateSHA256[2] = 0x3c6ef372;
		this._stateSHA256[3] = 0xa54ff53a;
		this._stateSHA256[4] = 0x510e527f;
		this._stateSHA256[5] = 0x9b05688c;
		this._stateSHA256[6] = 0x1f83d9ab;
		this._stateSHA256[7] = 0x5be0cd19;
	};
	//---------------------------------------------------------
	this._initialize = function () {
		var base = new System.Security.Cryptography.HashAlgorithm();
		for (var property in base) {
			if (typeof this[property] === "undefined") {
				//alert(property);
				this[property] = base[property];
			}
		}
		this.HashSizeValue = 256;
		this.HashSize = 256;
		this._stateSHA256 = new System.Byte(8); // uint[]
		this._buffer = new System.Byte(64); // byte[]
		this._W = new System.Byte(64); // uint[]
		this.InitializeState();



	};
	this._initialize.apply(this, arguments);
};

System.Security.Cryptography.SHA256CryptoServiceProvider = System.Security.Cryptography.SHA256;

//==============================================================================
// END
//------------------------------------------------------------------------------