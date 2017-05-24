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

System.Security.Cryptography.SHA1 = function () {
	/// <summary>
	/// Represents SHA1 hash algorithm class.
	/// </summary>
	/// <example>
	/// // Create SHA1 Algorithm (JavaScript Example);
	/// var sha1 = new System.Security.Cryptography.SHA1CryptoServiceProvider();
	/// // Test SHA1 Algorithm: If 'sha1.Test() = true' then everything works OK.
	/// alert("sha1.Test() = "+sha1.Test());
	/// // Convert string to array of bytes.
	/// var bytes = System.Text.Encoding.UTF8.GetBytes("test string");
	/// // Compute hash.
	/// alert("sha1.ComputeHashAsHex(\"test string\")"+sha1.ComputeHashAsHex(bytes);
	/// </example>
	/// <remarks>
	/// A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
	/// in FIPS PUB 180-1
	/// Version 2.1a Copyright Paul Johnston 2000 - 2002.
	/// Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
	/// Distributed under the BSD License
	/// See http://pajhome.org.uk/crypt/md5 for details.
	/// NOTES:
	/// Recreated as class by Evaldas Jocys [2006] - SHA1 (160bit) - System.Security.Cryptography.SHA1
	/// </remarks>
	//---------------------------------------------------------
	// Public properties.
	this.Name = "SHA1";
	// Configurable variables. You may need to tweak these to be compatible with
	// the server-side, but the defaults work in most cases.
	this.chrsz = 8;  /* bits per input character. 8 - ASCII; 16 - Unicode      */

	// Fields
	this._buffer = new System.Byte();
	this._count = 0;
	this._expandedBuffer = [];
	this._stateSHA1 = [];
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
		var count = cbSize;
		var srcOffset = ibStart;
		var dstOffset = this._count & 0x3f;
		this._count += count;
		if (dstOffset > 0 && dstOffset + count >= 0x40) {
			System.Buffer.BlockCopy(partIn, srcOffset, this._buffer, dstOffset, 0x40 - dstOffset);
			srcOffset += 0x40 - dstOffset;
			count -= 0x40 - dstOffset;
			this.SHATransform(this._expandedBuffer, this._stateSHA1, this._buffer);
			dstOffset = 0;
		}
		while (count >= 0x40) {
			System.Buffer.BlockCopy(partIn, srcOffset, this._buffer, 0, 0x40);
			srcOffset += 0x40;
			count -= 0x40;
			this.SHATransform(this._expandedBuffer, this._stateSHA1, this._buffer);
		}
		if (count > 0) {
			System.Buffer.BlockCopy(partIn, srcOffset, this._buffer, dstOffset, count);
		}
	};
	//---------------------------------------------------------
	this.HashCore = function (rgb, ibStart, cbSize) {
		this._HashData(rgb, ibStart, cbSize);
	};
	//---------------------------------------------------------
	this._EndHash = function () {
		var block = new System.Byte(20);
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
		DWORDToBigEndian(block, this._stateSHA1, 5);
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
		DWORDFromBigEndian(expandedBuffer, 0x10, block);
		this.SHAExpand(expandedBuffer);
		var v = new Array(5);
		var i = 0;
		for (i = 0; i < 5; i++) v[4 - i] = state[i];
		for (i = 0; i < 80; i += 5) {
			for (var j = 0; j < 5; j++) {
				var x0 = _tf(i, v[(j + 3) % 5], v[(j + 2) % 5], v[(j + 1) % 5]);
				var x1 = as(rl(v[(j + 4) % 5], 5), x0);
				var x2 = expandedBuffer[i + (j + 0) % 5];
				var x3 = as(x1, x2);
				var x4 = as(x3, _ac(i));
				var x5 = v[(j + 0) % 5];
				var x6 = as(x4, x5);
				v[(j + 0) % 5] = x6;
				v[(j + 3) % 5] = rl(v[(j + 3) % 5], 30);
			}
		}
		for (i = 0; i < 5; i++) state[i] = as(state[i], v[4 - i]);
	};
	//---------------------------------------------------------

	function DWORDToBigEndian(block, x, digits) {
		return System.Security.Cryptography.Utils.DWORDToBigEndian(block, x, digits);
	}

	function DWORDFromBigEndian(x, digits, block) {
		return System.Security.Cryptography.Utils.DWORDFromBigEndian(x, digits, block);
	}

	function rl(x, y) {
		return System.Security.Cryptography.Utils.RotateLeft(x, y);
	}

	function as(x, y) {
		/// <summary>
		/// Add integers, wrapping at 2^32. This uses 16-bit operations internally
		/// to work around bugs in some JS interpreters.
		/// </summary>
		var lsw = (x & 0xFFFF) + (y & 0xFFFF);
		var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
		return msw << 16 | lsw & 0xFFFF;
	}

	function _tf(i, b, c, d) {
		/// <summary>
		/// Perform the appropriate triplet combination function for the current
		/// iteration.
		/// </summary>
		return i < 20 ? d ^ b & (c ^ d)
			: i < 40 ? b ^ c ^ d
				: i < 60 ? b & c | d & (b | c)
					: b ^ c ^ d;
	}
	function _ac(i) {
		/// <summary>
		/// Determine the appropriate additive constant for the current iteration
		/// </summary>
		return i < 20 ? 0x5A827999
			: i < 40 ? 0x6ED9EBA1
				: i < 60 ? 0x8F1BBCDC
					: 0xCA62C1D6;
	}
	this.SHAExpand = function (x) {
		for (var i = 0x10; i < 80; i++) {
			x[i] = rl(x[i - 3] ^ x[i - 8] ^ x[i - 14] ^ x[i - 16], 1);
		}
	};
	//---------------------------------------------------------
	this.DWORDFromBigEndian = function (x, digits, block) {
		var index = 0;
		for (var i = 0; index < digits; i += 4) {
			var n = block[i] << 0x18 | block[i + 1] << 0x10 | block[i + 2] << 8 | block[i + 3];
			x[index] = n >>> 0;
			index++;
		}
	};
	//---------------------------------------------------------
	this.Initialize = function () {
		this.InitializeState();
		System.Array.Clear(this._buffer, 0, this._buffer.length);
		System.Array.Clear(this._expandedBuffer, 0, this._expandedBuffer.length);
	};
	this.InitializeState = function () {
		this._count = 0;
		this._stateSHA1[0] = 0x67452301;
		this._stateSHA1[1] = 0xefcdab89;
		this._stateSHA1[2] = 0x98badcfe;
		this._stateSHA1[3] = 0x10325476;
		this._stateSHA1[4] = 0xc3d2e1f0;
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
		this.HashSizeValue = 160;
		this.HashSize = 160;
		this._stateSHA1 = new System.Byte(5); // uint[]
		this._buffer = new System.Byte(0x40); // byte[]
		this._expandedBuffer = new System.Byte(80); // uint[]
		this.InitializeState();



	};
	this._initialize.apply(this, arguments);
};

System.Security.Cryptography.SHA1CryptoServiceProvider = System.Security.Cryptography.SHA1;

//==============================================================================
// END
//------------------------------------------------------------------------------