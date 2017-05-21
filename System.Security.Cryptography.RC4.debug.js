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

System.Security.Cryptography.RC4 = function () {
	/// <summary>
	/// Represents RC4 symmetric cipher algorithm class.
	/// Original Source:
	/// http://farhadi.ir/downloads/rc4.js
	/// RC4 symmetric cipher encryption/decryption
	/// Copyright (c) 2006 by Ali Farhadi.
	/// released under the terms of the Gnu Public License.
	/// see the GPL for details.
	/// Email: ali[at]farhadi[dot]ir
	/// Website: http://farhadi.ir/
	/// </summary>
	//---------------------------------------------------------
	// Public properties.
	this.Name = "RC4";
	//---------------------------------------------------------
	this.Encrypt = function (key, data) {
		return this.Cipher(key, data);
	};
	//---------------------------------------------------------
	this.EncryptAsHex = function (key, data) {
		return System.Convert.BytesToHexString(this.Cipher(key, data));
	};
	//---------------------------------------------------------
	this.EncryptAsBase64 = function (key, data) {
		var hash = this.ComputeHashAsBin(key, data);
		return System.Convert.ToBase64String(this.Cipher(key, data), false);
	};
	//---------------------------------------------------------
	this.Decrypt = function (key, data) {
		return this.Cipher(key, data);
	};
	//---------------------------------------------------------
	this.DecryptFromHex = function (key, hexData) {
		var data = System.Convert.HexStringToBytes(hexData);
		return this.Cipher(key, data);
	};
	//---------------------------------------------------------
	this.DecryptFromBase64 = function (key, base64Data) {
		var data = System.Convert.FromBase64String(base64Data, true);
		return this.Cipher(key, data);
	};
	//---------------------------------------------------------
	this.Test = function () {
		/// <summary>
		/// Perform a simple self-test to see if algorithm is working.
		/// </summary>
		var key = [0x6B, 0x65, 0x79];  // "key";
		var data = [0x61, 0x62, 0x63];  // "abc";
		var ciph = [0x6A, 0x0E, 0x57]; // "abc" encrypted with "key".
		// Perform encryption decryption.
		var encrypted = this.Encrypt(key, data);
		var decrypted = this.Decrypt(key, encrypted);
		isSuccess = true;
		// Check values.
		for (var i = 0; i < data.length; i++) {
			if (ciph[i] !== encrypted[i] || data[i] !== decrypted[i]) {
				isSuccess = false;
				break;
			}
		}
		return isSuccess;
	};
	//---------------------------------------------------------
	this.Cipher = function (key, data) {
		/// <summary>
		/// Encrypt given plain text using the key with RC4 algorithm.
		/// All parameters and return value are in binary format.
		/// </summary>
		/// <param name="key">Secret key bytes for encryption/decryption.</param>
		/// <param name="data">Data bytes to be encrypted/decrypted.</param>
		/// <returns>Encrypted/decrypted bytes.</returns>
		// Convert string to bytes if neccessarty.
		if (typeof key === "string") key = System.Text.Encoding.UTF8.GetBytes(key);
		if (typeof data === "string") data = System.Text.Encoding.UTF8.GetBytes(data);
		// Begin encryption/decrypion.
		var s = [];
		var kl = key.length;
		var dl = data.length;
		for (var i = 0; i < 256; i++) {
			s[i] = i;
		}
		var j = 0;
		var x;
		for (i = 0; i < 256; i++) {
			j = (j + s[i] + key[i % kl]) % 256;
			x = s[i];
			s[i] = s[j];
			s[j] = x;
		}
		i = 0;
		j = 0;
		var cipher = new Array(dl);
		for (var y = 0; y < dl; y++) {
			i = (i + 1) % 256;
			j = (j + s[i]) % 256;
			x = s[i];
			s[i] = s[j];
			s[j] = x;
			cipher[y] = data[y] ^ s[(s[i] + s[j]) % 256];
		}
		return cipher;
	};
	//---------------------------------------------------------
	this.Initialize = function () {
	};
	this.Initialize.apply(this, arguments);
};

//==============================================================================
// END
//------------------------------------------------------------------------------