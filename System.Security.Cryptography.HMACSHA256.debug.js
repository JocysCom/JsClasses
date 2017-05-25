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

System.Security.Cryptography.HMACSHA256 = function (key) {
	/// <summary>
	/// Represents HMAC-SHA256 hash algorithm class.
	/// </summary>
	/// <remarks>
	/// NOTES:
	/// Recreated as class by Evaldas Jocys [2017]
	/// </remarks>
	//---------------------------------------------------------
	// Public properties.
	this.Name = "HMACSHA256";
	this.Algorithm;
	this.Key;
	this.HashSize = 256;
	this.HashName = "SHA256";
	//---------------------------------------------------------
	this.ComputeHash = function (key, data) {
		if (!data) {
			data = key;
			key = this.Key;
		}
		// Convert input to byte[] if needed.
		if (typeof key === "string") key = System.Text.Encoding.UTF8.GetBytes(key);
		if (typeof data === "string") data = System.Text.Encoding.UTF8.GetBytes(data);
		return this._ComputeHash(key, data);
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
	this._ComputeHash = function (key, data) {
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
		var ipad = new Array(64), opad = new Array(64);
		for (var i = 0; i < 64; i++) {
			ipad[i] = key[i] ^ 0x36;
			opad[i] = key[i] ^ 0x5C;
		}
		var hash = this.Algorithm.ComputeHash(ipad.concat(data));
		return this.Algorithm.ComputeHash(opad.concat(hash));
	};
	//---------------------------------------------------------
	this.Initialize = function () {
		this.Algorithm = new System.Security.Cryptography.SHA256();
		this.Key = arguments[0];
	};
	this.Initialize.apply(this, arguments);
};

//==============================================================================
// END
//------------------------------------------------------------------------------