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

System.Security.Cryptography.HMACMD5 = function (key) {
	/// <summary>
	/// Represents HMAC-MD5 hash algorithm class.
	/// </summary>
	/// <remarks>
	/// A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
	/// Digest Algorithm, as defined in RFC 1321.
	/// Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
	/// Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
	/// Distributed under the BSD License
	/// See http://pajhome.org.uk/crypt/md5 for more info.
	/// NOTES:
	/// Recreated as class by Evaldas Jocys [2006]:
	/// The HMAC process mixes a secret key* with the message data, hashes the
	/// result with the hash algorithm, mixes that hash value with the secret
	/// key again, and then applies the hash algorithm a second time.
	/// Note: This algorithm is recommended (against plain MD5) to store hashed
	/// passwords because additional secret key makes dictionary attacks impossible.
	/// </remarks>
	//---------------------------------------------------------
	// Public properties.
	this.Name = "HMACMD5";
	this.Algorithm;
	this.Key;
	this.HashSize = 128;
	this.HashName = "MD5";
	//---------------------------------------------------------
	this.ComputeHash = function (key, data) {
		if (!data) {
			data = key;
			key = this.Key;
		}
		// Convert input to byte[] if needed.
		if (typeof key === "string") key = System.Text.Encoding.UTF8.GetBytes(key);
		if (typeof data === "string") data = System.Text.Encoding.UTF8.GetBytes(data);
		var hash = this.ComputeHashAsBin(key, data);
		var bytes = System.BitConverter.GetBytesFromInt32ArrayLe(hash);
		return bytes;
	};
	//---------------------------------------------------------
	this.ComputeHashAsHex = function (key, data) {
		var bytes = this.ComputeHash(key, data);
		return System.BitConverter.ToString(bytes, '');
	};
	//---------------------------------------------------------
	this.ComputeHashAsBase64 = function (key, data) {
		var bytes = this.ComputeHash(key, data);
		return System.Convert.ToBase64String(bytes, false);
	};
	//---------------------------------------------------------
	this.ComputeHashAsGuid = function (key, data) {
		var bytes = this.ComputeHash(key, data);
		var guid = new System.Guid(bytes);
		return guid;
	};
	//---------------------------------------------------------
	this.ComputeHashAsBin = function (key, data) {
		/// <summary>
		/// ComputeHash of a key and some data.
		/// </summary>
		// if no data then...
		if (!data) {
			data = key;
			key = this.Key;
		}
		// If key contains more than 64 bytes then use checksum of it as a key.
		if (key.length > 64) key = this.Algorithm.ComputeHash(key);
		var bkey = System.BitConverter.ToInt32ArrayLe(key, 0);
		var ipad = Array(16), opad = Array(16);
		for (var i = 0; i < 16; i++) {
			ipad[i] = bkey[i] ^ 0x36363636;
			opad[i] = bkey[i] ^ 0x5C5C5C5C;
		}
		var bData = System.BitConverter.ToInt32ArrayLe(data, 0);
		var hash = this.Algorithm.ComputeHashAsBin(ipad.concat(bData), 512 + data.length * this.Algorithm.chrsz);
		return this.Algorithm.ComputeHashAsBin(opad.concat(hash), 512 + this.HashSize);
	};
	//---------------------------------------------------------
	this.Initialize = function () {
		this.Algorithm = new System.Security.Cryptography.MD5();
		this.Key = arguments[0];
	};
	this.Initialize.apply(this, arguments);
};

//==============================================================================
// END
//------------------------------------------------------------------------------