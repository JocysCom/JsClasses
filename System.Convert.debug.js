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
//		<RootNamespace>System.Convert</RootNamespace>
// <PropertyGroup>
//-----------------------------------------------------------------------------

/// <reference path="System.debug.js" />
System.Convert = System.Convert ? System.Convert : {};
System.Type.RegisterNamespace("System.Convert");
//=============================================================================

System.Convert.Base64Array = function () {
	/// <summary>
	/// Array which makes base64 encoding and decoding faster.
	/// </ summary>
	// Declare string of available chars inside base64.
	this.S = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	this.CA = [];
	this.IA = [];
	//---------------------------------------------------------
	// INIT: Class
	//---------------------------------------------------------
	this.InitializeClass = function () {
		var c = "";
		for (var i = 0; i < this.S.length; i++) {
			c = this.S.charAt(i);
			this.CA[i] = c;
			this.IA[c] = i;
		}
	};
	this.InitializeClass();
};

System.Convert.ToBase64String = function (b, wrap) {
	/// <summary>
	/// Converts the value of an array of 8-bit unsigned integers to its equivalent
	/// System.String representation encoded with base 64 digits.
	/// </summary>
	/// <param type="byte[]" name="b">An array of 8-bit unsigned integers.</param>
	/// <param type="bool" name="wrap">Wrap base64 string with '\r\n' separator.</param>
	/// <returns type="string">
	/// The System.String representation, in base 64, of the contents of inArray.
	/// </returns>
	/// <remarks>
	/// A very fast and memory efficient class to encode and decode to and from BASE64
	/// in full accordance with RFC 2045. Based on http://migbase64.sourceforge.net/
	/// Converted to JavaScript by Evaldas Jocys [evaldas@jocys.com], http://www.jocys.com
	/// </remarks>
	var B64 = new System.Convert.Base64Array();
	// Check special case
	var bLen = b ? b.length : 0;
	if (bLen === 0) return new Array(0);
	// Length of even 24-bits.
	var eLen = Math.floor(bLen / 3) * 3;
	// Returned character count.
	var cCnt = (bLen - 1) / 3 + 1 << 2;
	var dLen = cCnt + (wrap ? (cCnt - 1) / 76 << 1 : 0); // Length of returned array
	var dArr = new Array(dLen);
	// Encode even 24-bits.
	for (var s = 0, d = 0, cc = 0; s < eLen;) {
		// Copy next three bytes into lower 24 bits of int, paying attension to sign.
		var i = (b[s++] & 0xff) << 16 | (b[s++] & 0xff) << 8 | b[s++] & 0xff;
		// Encode the int into four chars.
		dArr[d++] = B64.CA[i >>> 18 & 0x3f];
		dArr[d++] = B64.CA[i >>> 12 & 0x3f];
		dArr[d++] = B64.CA[i >>> 6 & 0x3f];
		dArr[d++] = B64.CA[i & 0x3f];
		// Add optional line separator as specified in RFC 2045.
		if (wrap && ++cc === 19 && d < dLen - 2) {
			dArr[d++] = '\r';
			dArr[d++] = '\n';
			cc = 0;
		}
	}
	// Pad and encode last bits if source isn't even 24 bits.
	var left = bLen - eLen; // 0 - 2.
	if (left > 0) {
		// Prepare the int.
		var j = (b[eLen] & 0xff) << 10 | (left === 2 ? (b[bLen - 1] & 0xff) << 2 : 0);
		// Set last four chars.
		dArr[dLen - 4] = B64.CA[j >> 12];
		dArr[dLen - 3] = B64.CA[j >>> 6 & 0x3f];
		dArr[dLen - 2] = left === 2 ? B64.CA[j & 0x3f] : '=';
		dArr[dLen - 1] = '=';
	}
	return dArr.join("");
};

System.Convert.FromBase64String = function (s, fix) {
	/// <summary>
	/// Converts the specified System.String, which encodes binary data as base 64
	/// digits, to an equivalent 8-bit unsigned integer array.
	/// </summary>
	/// <param type="string" name="s">A string.</param>
	/// <param type="bool" name="fix">Fix base64 string by removing all ilegal chars.</param>
	/// <returns type="byte[]">
	/// An array of 8-bit unsigned integers equivalent to s.
	/// </returns>
	/// <remarks>
	/// A very fast and memory efficient class to encode and decode to and from BASE64
	/// in full accordance with RFC 2045. Based on http://migbase64.sourceforge.net/
	/// Converted to JavaScript by Evaldas Jocys [evaldas@jocys.com], http://www.jocys.com
	/// </remarks>
	var B64 = new System.Convert.Base64Array();
	// Check special case
	if (fix) {
		// Remove illegal chars
		var regex = new RegExp("[^" + B64.S + "]", "g");
		s = s.replace(regex, "");
	}
	var sLen = s.length;
	if (sLen === 0) return new Array(0);
	// Start and end index after trimming.
	var sIx = 0, eIx = sLen - 1;
	// Get the padding count (=) (0, 1 or 2).
	var pad = s.charAt(eIx) === '=' ? s.charAt(eIx - 1) === '=' ? 2 : 1 : 0;  // Count '=' at end.
	// Content count including possible separators.
	var cCnt = eIx - sIx + 1;
	var sepLn = s.charAt(76) === '\r' ? cCnt / 78 : 0;
	var sepCnt = sLen > 76 ? sepLn << 1 : 0;
	// The number of decoded bytes.
	var len = ((cCnt - sepCnt) * 6 >> 3) - pad;
	// Preallocate byte[] of exact length.
	var bytes = new Array(len);
	// Decode all but the last 0 - 2 bytes.
	var d = 0;
	var eLen = Math.floor(len / 3) * 3;
	var i;
	for (var cc = 0; d < eLen;) {
		// Assemble three bytes into an var from four "valid" characters.
		i = B64.IA[s.charAt(sIx++)] << 18 |
			B64.IA[s.charAt(sIx++)] << 12 |
			B64.IA[s.charAt(sIx++)] << 6 |
			B64.IA[s.charAt(sIx++)];
		// Add the bytes
		bytes[d++] = i >> 16;
		bytes[d++] = (i & 0xFFFF) >> 8;
		bytes[d++] = i & 0xFF;
		// If line separator, jump over it.
		if (sepCnt > 0 && ++cc === 19) {
			sIx += 2;
			cc = 0;
		}
	}
	if (d < len) {
		// Decode last 1-3 bytes (incl '=') into 1-3 bytes.
		i = 0;
		for (var j = 0; sIx <= eIx - pad; j++) {
			i |= B64.IA[s.charAt(sIx++)] << 18 - j * 6;
		}
		for (var r = 16; d < len; r -= 8) {
			var cropBits = Math.pow(2, r + 8) - 1;
			bytes[d++] = (i & cropBits) >> r;
		}
	}
	return bytes;
};

System.Convert.ToBase64UrlString = function (b, wrap) {
	/// <summary>
	/// Converts the value of an array of 8-bit unsigned integers to its equivalent
	/// System.String representation encoded with Base64URL digits.
	/// </summary>
	/// <param type="byte[]" name="b">An array of 8-bit unsigned integers.</param>
	/// <param type="bool" name="wrap">Wrap base64 string with '\r\n' separator.</param>
	/// <returns type="string">
	/// The System.String representation, in Base64URL, of the contents of inArray.
	/// </returns>
	//
	// Use standard base64 encoder.
	var string = System.Convert.ToBase64String(b, wrap);
	// Remove trailing '='.
	s = s.replace(new RegExp("[=]+$", "g"), "");
	// Replace base64 characters to be URL compatible.
	s = s.replace(new RegExp("[+]", "g"), "-");
	s = s.replace(new RegExp("[/]", "g"), "_");
	return s;
};

System.Convert.FromBase64UrlString = function (s, fix) {
	/// <summary>
	/// Converts the specified System.String, which encodes binary data as Base64URL
	/// digits, to an equivalent 8-bit unsigned integer array.
	/// </summary>
	/// <param type="string" name="s">A string.</param>
	/// <param type="bool" name="fix">Fix base64 string by removing all ilegal chars.</param>
	/// <returns type="byte[]">
	//
	// Restore base64 characters.
	s = s.replace(new RegExp("[-]", "g"), "+");
	s = s.replace(new RegExp("[_]", "g"), "/");
	// Restore trailing '='.
	var len = s.length % 4;
	if (len === 2)
		s += "==";
	if (len === 3)
		s += "=";
	// Use standard base64 encoder.
	var b = System.Convert.FromBase64String(s);
	return b;
};


System.Convert.HexStringToBytes = function (s) {
	/// <summary>
	/// Convert hex string to array of bytes.
	/// </summary>
	/// <param type="string" name="s">Hex string.</param>
	/// <returns type="byte[]">
	/// An array of 8-bit integers.
	/// </returns>
	// If hex prefix exists then...
	if (s.indexOf("0x") === 0 || s.indexOf("0X") === 0) {
		// Remove hex prefix.
		s = s.substring(2);
	}
	// if not even length. Then add leading zero.
	if (s.length % 2 === 1) s = "0" + s;
	var bytes = [];
	for (var i = 0; i < s.length; i += 2) {
		bytes[i / 2] = parseInt(s.slice(i, i + 2), 16);
	}
	return bytes;
};

System.Convert.BytesToHexString = function (bytes, separator) {
	/// <summary>
	/// Array of bytes to hex string.
	/// </summary>
	/// <param type="byte[]" name="bytes">An array of 8-bit integers.</param>
	/// <returns type="string">
	/// Hex string.
	/// </returns>
	var sb = [];
	var s = "";
	if (!bytes) return;
	for (var i = 0; i < bytes.length; i++) {
		var b = bytes[i];
		if (b <= 0xF) sb.push('0' + b.toString(16));
		else sb.push(b.toString(16));
	}
	var sep = separator ? separator : "";
	return sb.join(sep);
};

//==============================================================================
// END
//------------------------------------------------------------------------------