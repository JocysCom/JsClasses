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

System.Security.Cryptography.MD5 = function () {
	/// <summary>
	/// Represents MD5 hash algorithm class.
	/// </summary>
	/// <example>
	/// // Create MD5 Algorithm (JavaScript Example);
	/// var md5 = new System.Security.Cryptography.MD5();
	/// // Test MD5 Algorithm: If 'md5.Test() = true' then everything works OK.
	/// alert("md5.Test() = "+md5.Test());
	/// // Convert string to array of bytes.
	/// var bytes = System.Text.Encoding.UTF8.GetBytes("test string");
	/// // Compute hash.
	/// alert("md5.ComputeHashAsHex(\"test string\")"+md5.ComputeHashAsHex(bytes);
	/// </example>
	/// <remarks>
	/// A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
	/// Digest Algorithm, as defined in RFC 1321.
	/// Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
	/// Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
	/// Distributed under the BSD License
	/// See http://pajhome.org.uk/crypt/md5 for more info.
	/// NOTES:
	/// Recreated as class by Evaldas Jocys [2006] - MD5 (128bit) - System.Security.Cryptography.MD5
	/// Please use this algorithm only for non secure information where speed is top priority. MD5 have two major advantages:
	/// a) It is world wide de facto standard to generate checksums (hashes) for files and objects;
	/// b) Hash can be stored as GUID (Global Unique IDentifier) which also has full native support inside databases ('uniqueidentifier' type for SQL Servers and 'Number -> Replication ID' type for Microsoft Access).
	/// Some people also prefer to use "HMAC with MD5" algorithm to hash passwords and store them inside database as GUIDs.
	/// </remarks>
	//---------------------------------------------------------
	// Public properties.
	this.Name = "MD5";
	// Configurable variables. You may need to tweak these to be compatible with
	// the server-side, but the defaults work in most cases.
	this.chrsz = 8;  /* bits per input character. 8 - ASCII; 16 - Unicode      */
	//---------------------------------------------------------
	// Private properties.
	var hexcase = 0;  /* hex output format. 0 - lowercase; 1 - uppercase        */
	var b64pad = "="; /* base-64 pad character. "=" for strict RFC compliance   */
	//---------------------------------------------------------
	this.ComputeHash = function (value) {
		if (typeof value === "string") value = System.Text.Encoding.UTF8.GetBytes(value);
		var bin = System.BitConverter.ToInt32ArrayLe(value, 0);
		var hash = this.ComputeHashAsBin(bin, value.length * this.chrsz);
		var bytes = System.BitConverter.GetBytesFromInt32ArrayLe(hash);
		return bytes;
	};
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
	this.ComputeHashAsGuid = function (value) {
		var bytes = this.ComputeHash(value);
		var guid = new System.Guid(bytes);
		return guid;
	};
	//---------------------------------------------------------
	this.ComputeHashAsBin = function (x, len) {
		/// <summary>
		/// ComputeHash the MD5 of an array of little-endian words, and a bit length
		/// </summary>
		// Append padding.
		x[len >> 5] |= 0x80 << len % 32;
		x[(len + 64 >>> 9 << 4) + 14] = len;
		// Set some values.
		var a = 1732584193;
		var b = -271733879;
		var c = -1732584194;
		var d = 271733878;
		// Route thru array...
		for (var i = 0; i < x.length; i += 16) {
			var olda = a;
			var oldb = b;
			var oldc = c;
			var oldd = d;
			// Round 1.
			a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
			d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
			c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
			b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
			a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
			d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
			c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
			b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
			a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
			d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
			c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
			b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
			a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
			d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
			c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
			b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
			// Round 2.
			a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
			d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
			c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
			b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
			a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
			d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
			c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
			b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
			a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
			d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
			c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
			b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
			a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
			d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
			c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
			b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
			// Round 3.
			a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
			d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
			c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
			b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
			a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
			d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
			c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
			b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
			a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
			d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
			c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
			b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
			a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
			d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
			c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
			b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
			// Round 4.
			a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
			d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
			c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
			b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
			a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
			d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
			c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
			b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
			a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
			d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
			c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
			b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
			a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
			d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
			c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
			b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
			// AddSafe.
			a = addSafe(a, olda);
			b = addSafe(b, oldb);
			c = addSafe(c, oldc);
			d = addSafe(d, oldd);
		}
		return Array(a, b, c, d);
	};
	//---------------------------------------------------------
	// These functions implement the four basic operations the algorithm uses.
	function md5_cmn(q, a, b, x, s, t) {
		return addSafe(rotateBitwise(addSafe(addSafe(a, q), addSafe(x, t)), s), b);
	}
	function md5_ff(a, b, c, d, x, s, t) {
		return md5_cmn(b & c | ~b & d, a, b, x, s, t);
	}
	function md5_gg(a, b, c, d, x, s, t) {
		return md5_cmn(b & d | c & ~d, a, b, x, s, t);
	}
	function md5_hh(a, b, c, d, x, s, t) {
		return md5_cmn(b ^ c ^ d, a, b, x, s, t);
	}
	function md5_ii(a, b, c, d, x, s, t) {
		return md5_cmn(c ^ (b | ~d), a, b, x, s, t);
	}
	//---------------------------------------------------------
	function addSafe(x, y) {
		/// <summary>
		/// Add integers, wrapping at 2^32. This uses 16-bit operations internally
		/// to work around bugs in some JS interpreters.
		/// </summary>
		var lsw = (x & 0xFFFF) + (y & 0xFFFF);
		var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
		return msw << 16 | lsw & 0xFFFF;
	}
	//---------------------------------------------------------
	/// <summary>
	/// Bitwise rotate a 32-bit number to the left.
	/// </summary>
	function rotateBitwise(num, cnt) {
		return num << cnt | num >>> 32 - cnt;
	}
	//---------------------------------------------------------
	this.Initialize = function () {
	};
	this.Initialize.apply(this, arguments);
};

System.Security.Cryptography.MD5CryptoServiceProvider = System.Security.Cryptography.MD5;

//==============================================================================
// END
//------------------------------------------------------------------------------