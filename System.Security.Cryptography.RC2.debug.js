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


System.Security.Cryptography.RC2 = function () {
	/// <summary>
	/// Represents RC2 cipher algorithm class.
	/// Standard:
	/// ftp://ftp.rfc-editor.org/in-notes/rfc2268.txt
	/// </summary>
	//---------------------------------------------------------
	// Public properties.
	this.BlockSize = 8;
	this.EffectiveKeyBits = 1024;
	//---------------------------------------------------------
	// Private properties.
	var epos = [1, 2, 3, 5];
	var dpos = [11, 13, 14, 15];
	// 256-entry PI table.
	var piTable = [
		0xd9, 0x78, 0xf9, 0xc4, 0x19, 0xdd, 0xb5, 0xed,
		0x28, 0xe9, 0xfd, 0x79, 0x4a, 0xa0, 0xd8, 0x9d,
		0xc6, 0x7e, 0x37, 0x83, 0x2b, 0x76, 0x53, 0x8e,
		0x62, 0x4c, 0x64, 0x88, 0x44, 0x8b, 0xfb, 0xa2,
		0x17, 0x9a, 0x59, 0xf5, 0x87, 0xb3, 0x4f, 0x13,
		0x61, 0x45, 0x6d, 0x8d, 0x09, 0x81, 0x7d, 0x32,
		0xbd, 0x8f, 0x40, 0xeb, 0x86, 0xb7, 0x7b, 0x0b,
		0xf0, 0x95, 0x21, 0x22, 0x5c, 0x6b, 0x4e, 0x82,
		0x54, 0xd6, 0x65, 0x93, 0xce, 0x60, 0xb2, 0x1c,
		0x73, 0x56, 0xc0, 0x14, 0xa7, 0x8c, 0xf1, 0xdc,
		0x12, 0x75, 0xca, 0x1f, 0x3b, 0xbe, 0xe4, 0xd1,
		0x42, 0x3d, 0xd4, 0x30, 0xa3, 0x3c, 0xb6, 0x26,
		0x6f, 0xbf, 0x0e, 0xda, 0x46, 0x69, 0x07, 0x57,
		0x27, 0xf2, 0x1d, 0x9b, 0xbc, 0x94, 0x43, 0x03,
		0xf8, 0x11, 0xc7, 0xf6, 0x90, 0xef, 0x3e, 0xe7,
		0x06, 0xc3, 0xd5, 0x2f, 0xc8, 0x66, 0x1e, 0xd7,
		0x08, 0xe8, 0xea, 0xde, 0x80, 0x52, 0xee, 0xf7,
		0x84, 0xaa, 0x72, 0xac, 0x35, 0x4d, 0x6a, 0x2a,
		0x96, 0x1a, 0xd2, 0x71, 0x5a, 0x15, 0x49, 0x74,
		0x4b, 0x9f, 0xd0, 0x5e, 0x04, 0x18, 0xa4, 0xec,
		0xc2, 0xe0, 0x41, 0x6e, 0x0f, 0x51, 0xcb, 0xcc,
		0x24, 0x91, 0xaf, 0x50, 0xa1, 0xf4, 0x70, 0x39,
		0x99, 0x7c, 0x3a, 0x85, 0x23, 0xb8, 0xb4, 0x7a,
		0xfc, 0x02, 0x36, 0x5b, 0x25, 0x55, 0x97, 0x31,
		0x2d, 0x5d, 0xfa, 0x98, 0xe3, 0x8a, 0x92, 0xae,
		0x05, 0xdf, 0x29, 0x10, 0x67, 0x6c, 0xba, 0xc9,
		0xd3, 0x00, 0xe6, 0xcf, 0xe1, 0x9e, 0xa8, 0x2c,
		0x63, 0x16, 0x01, 0x3f, 0x58, 0xe2, 0x89, 0xa9,
		0x0d, 0x38, 0x34, 0x1b, 0xab, 0x33, 0xff, 0xb0,
		0xbb, 0x48, 0x0c, 0x5f, 0xb9, 0xb1, 0xcd, 0x2e,
		0xc5, 0xf3, 0xdb, 0x47, 0xe5, 0xa5, 0x9c, 0x77,
		0x0a, 0xa6, 0x20, 0x68, 0xfe, 0x7f, 0xc1, 0xad
	];
	//---------------------------------------------------------
	this.Test = function () {
		/// <summary>
		/// Perform a simple self-test to see if algorithm is working.
		/// </summary>
		var key = [0x6B, 0x65, 0x79];  // "key";
		var data = [0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38];  // "12345678";
		var ciph = [0xED, 0xFD, 0x61, 0xCA, 0xBC, 0x18, 0xC4, 0xFE]; // "12345678" encrypted with "key".
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
	this.ExpandKey = function (key, bits) {
		/// <summary>
		/// Expand a variable-length user key (between 1 and 128 bytes) to a
		/// 64-short working rc2 key, of at most "bits" effective key bits.
		/// The effective key bits parameter looks like an export control hack.
		/// For normal use, it should always be set to 1024.  For convenience,
		/// zero is accepted as an alias for 1024.
		/// </summary>
		/// <param name="len">Value between 1 and 128.</param>
		/// <param name="bits">Value between 1 and 1024.</param>
		var x;
		var xKey = new Array(128);
		var len = key.length;
		var i;
		// Copy key.
		for (i = 0; i < len; i++) {
			xKey[i] = key[i] & 0xff;
		}
		// JS: Replace 'undefined' values with 0.
		for (i = len; i < 128; i++) {
			xKey[i] = 0;
		}
		// Phase 1: Expand input key to 128 bytes
		if (len < 128) {
			var index = 0;
			x = xKey[len - 1];
			do {
				x = piTable[x + xKey[index++] & 0xff] & 0xff;
				xKey[len++] = x;
			} while (len < 128);
		}
		// Phase 2 - reduce effective key size to "bits"
		len = bits + 7 >> 3;
		x = piTable[xKey[128 - len] & 0xff >> (7 & -bits)] & 0xff;
		xKey[128 - len] = x;
		for (i = 128 - len - 1; i >= 0; i--) {
			x = piTable[x ^ xKey[i + len]] & 0xff;
			xKey[i] = x;
		}
		// Phase 3 - copy to newKey in little-endian order
		var newKey = new Array(64);
		for (i = 0; i !== newKey.length; i++) {
			newKey[i] = xKey[2 * i] + (xKey[2 * i + 1] << 8);
		}
		return newKey;
	};
	//---------------------------------------------------------
	this.Encrypt = function (key, input) {
		return this.Cipher(key, input, true);
	};
	//---------------------------------------------------------
	this.Decrypt = function (key, input) {
		return this.Cipher(key, input, false);
	};
	//---------------------------------------------------------
	this.Cipher = function (key, input, encrypt) {
		// Convert from string to bytes if neccessary.
		if (typeof key === "string") key = System.Text.Encoding.UTF8.GetBytes(key);
		if (typeof input === "string") input = System.Text.Encoding.UTF8.GetBytes(input);
		var expKey = this.ExpandKey(key, this.EffectiveKeyBits);
		var len = input.length;
		var output = new Array(len);
		// Calculate number of block.
		var blockCount = Math.ceil(len / this.BlockSize);
		for (var b = 0; b < blockCount; b++) {
			// Calculate length of final block:
			var blockLength = b < blockCount - 1 ? this.BlockSize : (len - 1) % this.BlockSize + 1;
			// Prepare input block.
			var inputBlock = new Array(this.BlockSize);
			var i;
			for (i = 0; i < blockLength; i++) {
				inputBlock[i] = input[i + b * this.BlockSize];
			}
			// JS: Replace 'undefined' values with 0.
			for (i = blockLength; i < this.BlockSize; i++) {
				inputBlock[i] = 0;
			}
			var cipherBlock = encrypt ? this.EncryptBlock(expKey, inputBlock) : this.DecryptBlock(expKey, inputBlock);
			// Append cipher block to output.
			for (i = 0; i < this.BlockSize; i++) {
				output[i + b * this.BlockSize] = cipherBlock[i];
			}
		}
		return output;
	};
	//---------------------------------------------------------
	this.EncryptBlock = function (expKey, input) {
		var block = new Array(4);
		block = BytesToBlock(input);
		System.Array.Reverse(block);
		emix(expKey, block, 0, 16);
		emash(expKey, block);
		emix(expKey, block, 20, 40);
		emash(expKey, block);
		emix(expKey, block, 44, 63);
		System.Array.Reverse(block);
		return BlockToBytes(block);
	};
	//---------------------------------------------------------
	this.DecryptBlock = function (expKey, input) {
		var block = new Array(4);
		block = BytesToBlock(input);
		dmix(expKey, block, 60, 44);
		dmash(expKey, block);
		dmix(expKey, block, 40, 20);
		dmash(expKey, block);
		dmix(expKey, block, 16, 0);
		return BlockToBytes(block);
	};
	//---------------------------------------------------------
	function RotateWordLeft(x, y) {
		x &= 0xffff;
		return x << y | x >> 16 - y;
	}
	//---------------------------------------------------------
	function BytesToBlock(bytes) {
		var block = new Array(4);
		for (var b = 0; b < 4; b++) {
			block[b] = ((bytes[7 - b * 2] & 0xff) << 8) + (bytes[6 - b * 2] & 0xff);
		}
		return block;
	}
	//---------------------------------------------------------
	function BlockToBytes(block) {
		var bytes = new Array(8);
		for (var b = 0; b < 4; b++) {
			bytes[b * 2] = block[3 - b] & 0xff;
			bytes[b * 2 + 1] = block[3 - b] >> 8 & 0xff;
		}
		return bytes;
	}
	//---------------------------------------------------------
	function emash(expKey, block) {
		for (var b = 0; b < 4; b++) {
			block[b] += expKey[block[(b + 3) % 4] & 63];
		}
	}
	//---------------------------------------------------------
	function dmash(expKey, block) {
		for (var b = 0; b < 4; b++) {
			block[b] -= expKey[block[(b + 1) % 4] & 63];
		}
	}
	//---------------------------------------------------------
	function emix(expKey, block, x, y) {
		for (var i = x; i <= y; i += 4) {
			for (var b = 0; b < 4; b++) {
				block[b] = RotateWordLeft(block[b]
					+ (block[(b + 1) % 4] & ~block[(b + 3) % 4])
					+ (block[(b + 2) % 4] & block[(b + 3) % 4])
					+ expKey[i + b], epos[b]);
			}
		}
	}
	//---------------------------------------------------------
	function dmix(expKey, block, x, y) {
		for (var i = x; i >= y; i -= 4) {
			for (var b = 0; b < 4; b++) {
				block[b] = RotateWordLeft(block[b], dpos[b])
					- ((block[(b + 3) % 4] & ~block[(b + 1) % 4])
						+ (block[(b + 2) % 4] & block[(b + 1) % 4])
						+ expKey[i + 3 - b]);
			}
		}
	}
	//---------------------------------------------------------
	this.Initialize = function () {
	};
	this.Initialize.apply(this, arguments);
};

//==============================================================================
// END
//------------------------------------------------------------------------------