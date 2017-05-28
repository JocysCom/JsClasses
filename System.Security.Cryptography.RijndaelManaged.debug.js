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

System.Security.Cryptography.RijndaelManaged = function () {
	/// <summary>
	/// Represents Rijndael symetric cipher algorithm class.
	/// </summary>
	/// <remarks>
	/// Recreated as JavaScript class by:
	/// Evaldas Jocys, evaldas@jocys.com, www.jocys.com
	///
	/// Original Code by:
	/// Copyright 2005 Herbert Hanewinkel, www.haneWIN.de
	/// version 1.1, check www.haneWIN.de for the latest version
	///
	/// This software is provided as-is, without express or implied warranty.  
	/// Permission to use, copy, modify, distribute or sell this software, with or
	/// without fee, for any purpose and by any individual or organization, is hereby
	/// granted, provided that the above copyright notice and this paragraph appear 
	/// in all copies. Distribution as a part of an application or binary must
	/// include the above copyright notice in the documentation and/or other
	/// materials provided with the application or distribution.
	/// </remarks>
	//---------------------------------------------------------
	// Public properties.
	this.KeySize = 256;
	this.BlockSize = 128;
	this.FeedbackSize = 128;
	this.IV;
	this.Key;
	this.Mode = System.Security.Cryptography.CipherMode.CBC; // or "CBC"
	this.Padding = System.Security.Cryptography.PaddingMode.PKCS7;
	//---------------------------------------------------------
	// Private properties.
	var rng;
	// Rcon is Round Constant used for the Key Expansion [1st col is 2^(r-1) in GF(2^8)] [§5.2]
	var Rcon = [
		0x01, 0x02, 0x04, 0x08, 0x10, 0x20,
		0x40, 0x80, 0x1b, 0x36, 0x6c, 0xd8,
		0xab, 0x4d, 0x9a, 0x2f, 0x5e, 0xbc,
		0x63, 0xc6, 0x97, 0x35, 0x6a, 0xd4,
		0xb3, 0x7d, 0xfa, 0xef, 0xc5, 0x91
	];
	// var inverse SBox 
	var S5 = new Array(256);
	var T1 = new Array(256);
	var T2 = new Array(256);
	var T3 = new Array(256);
	var T4 = new Array(256);
	var T5 = new Array(256);
	var T6 = new Array(256);
	var T7 = new Array(256);
	var T8 = new Array(256);
	var U1 = new Array(256);
	var U2 = new Array(256);
	var U3 = new Array(256);
	var U4 = new Array(256);
	// Sbox is pre-computed multiplicative inverse in GF(2^8) used in SubBytes and KeyExpansion [§5.1.1]
	// Substitution box - Sbox [16 × 16] matrix.
	var S = [
		0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
		0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
		0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
		0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
		0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
		0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
		0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
		0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
		0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
		0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
		0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
		0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
		0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
		0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
		0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
		0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16
	];
	//---------------------------------------------------------
	function B0(x) { return x & 255; }
	function B1(x) { return x >> 8 & 255; }
	function B2(x) { return x >> 16 & 255; }
	function B3(x) { return x >> 24 & 255; }
	//---------------------------------------------------------
	function F1(x0, x1, x2, x3) {
		return B1(T1[x0 & 255]) | B1(T1[x1 >> 8 & 255]) << 8
			| B1(T1[x2 >> 16 & 255]) << 16 | B1(T1[x3 >>> 24]) << 24;
	}
	//---------------------------------------------------------
	function packBytes(octets) {
		var i, j;
		var len = octets.length;
		var b = [len / 4];
		if (!octets || len % 4) return;
		for (i = 0, j = 0; j < len; j += 4) {
			b[i++] = octets[j] | octets[j + 1] << 8 | octets[j + 2] << 16 | octets[j + 3] << 24;
		}
		return b;
	}
	//---------------------------------------------------------
	function unpackBytes(packed) {
		var j;
		var i = 0, l = packed.length;
		var r = [l * 4];
		for (j = 0; j < l; j++) {
			r[i++] = B0(packed[j]);
			r[i++] = B1(packed[j]);
			r[i++] = B2(packed[j]);
			r[i++] = B3(packed[j]);
		}
		return r;
	}
	//---------------------------------------------------------
	var maxkc = 8;
	var maxrk = 14;
	function keyExpansion(key) {
		var kc, i, j, r, t;
		var rounds;
		var keySched = [maxrk + 1];
		var keylen = key.length;
		var k = [maxkc];
		var tk = [maxkc];
		var rconpointer = 0;
		if (keylen === 16) {
			rounds = 10;
			kc = 4;
		} else if (keylen === 24) {
			rounds = 12;
			kc = 6;
		} else if (keylen === 32) {
			rounds = 14;
			kc = 8;
		} else {
			//alert('Invalid key length '+keylen);
			return;
		}
		for (i = 0; i < maxrk + 1; i++) keySched[i] = new Array(4);
		for (i = 0, j = 0; j < keylen; j++ , i += 4) {
			k[j] = key[i] | key[i + 1] << 8 | key[i + 2] << 16 | key[i + 3] << 24;
		}
		for (j = kc - 1; j >= 0; j--) tk[j] = k[j];
		r = 0;
		t = 0;
		for (j = 0; j < kc && r < rounds + 1;) {
			for (; j < kc && t < 4; j++ , t++) {
				keySched[r][t] = tk[j];
			}
			if (t === 4) {
				r++;
				t = 0;
			}
		}
		while (r < rounds + 1) {
			var temp = tk[kc - 1];
			tk[0] ^= S[B1(temp)] | S[B2(temp)] << 8 | S[B3(temp)] << 16 | S[B0(temp)] << 24;
			tk[0] ^= Rcon[rconpointer++];
			if (kc !== 8) {
				for (j = 1; j < kc; j++) tk[j] ^= tk[j - 1];
			} else {
				for (j = 1; j < kc / 2; j++) tk[j] ^= tk[j - 1];
				temp = tk[kc / 2 - 1];
				tk[kc / 2] ^= S[B0(temp)] | S[B1(temp)] << 8 | S[B2(temp)] << 16 | S[B3(temp)] << 24;
				for (j = kc / 2 + 1; j < kc; j++) tk[j] ^= tk[j - 1];
			}
			for (j = 0; j < kc && r < rounds + 1;) {
				for (; j < kc && t < 4; j++ , t++) {
					keySched[r][t] = tk[j];
				}
				if (t === 4) {
					r++;
					t = 0;
				}
			}
		}
		this.rounds = rounds;
		this.rk = keySched;
		return this;
	}
	//---------------------------------------------------------
	function AESencrypt(block, ctx) {
		var r;
		var t0, t1, t2, t3;
		var b = packBytes(block);
		var rounds = ctx.rounds;
		var b0 = b[0];
		var b1 = b[1];
		var b2 = b[2];
		var b3 = b[3];
		for (r = 0; r < rounds - 1; r++) {
			t0 = b0 ^ ctx.rk[r][0];
			t1 = b1 ^ ctx.rk[r][1];
			t2 = b2 ^ ctx.rk[r][2];
			t3 = b3 ^ ctx.rk[r][3];
			b0 = T1[t0 & 255] ^ T2[t1 >> 8 & 255] ^ T3[t2 >> 16 & 255] ^ T4[t3 >>> 24];
			b1 = T1[t1 & 255] ^ T2[t2 >> 8 & 255] ^ T3[t3 >> 16 & 255] ^ T4[t0 >>> 24];
			b2 = T1[t2 & 255] ^ T2[t3 >> 8 & 255] ^ T3[t0 >> 16 & 255] ^ T4[t1 >>> 24];
			b3 = T1[t3 & 255] ^ T2[t0 >> 8 & 255] ^ T3[t1 >> 16 & 255] ^ T4[t2 >>> 24];
		}
		// Last round is special.
		r = rounds - 1;
		t0 = b0 ^ ctx.rk[r][0];
		t1 = b1 ^ ctx.rk[r][1];
		t2 = b2 ^ ctx.rk[r][2];
		t3 = b3 ^ ctx.rk[r][3];
		b[0] = F1(t0, t1, t2, t3) ^ ctx.rk[rounds][0];
		b[1] = F1(t1, t2, t3, t0) ^ ctx.rk[rounds][1];
		b[2] = F1(t2, t3, t0, t1) ^ ctx.rk[rounds][2];
		b[3] = F1(t3, t0, t1, t2) ^ ctx.rk[rounds][3];
		return unpackBytes(b);
	}
	//---------------------------------------------------------
	function prepare_decryption(key) {
		var r, w;
		var rk2 = new Array(maxrk + 1);
		var ctx = new keyExpansion(key);
		var rounds = ctx.rounds;
		for (r = 0; r < maxrk + 1; r++) {
			rk2[r] = new Array(4);
			rk2[r][0] = ctx.rk[r][0];
			rk2[r][1] = ctx.rk[r][1];
			rk2[r][2] = ctx.rk[r][2];
			rk2[r][3] = ctx.rk[r][3];
		}
		for (r = 1; r < rounds; r++) {
			w = rk2[r][0]; rk2[r][0] = U1[B0(w)] ^ U2[B1(w)] ^ U3[B2(w)] ^ U4[B3(w)];
			w = rk2[r][1]; rk2[r][1] = U1[B0(w)] ^ U2[B1(w)] ^ U3[B2(w)] ^ U4[B3(w)];
			w = rk2[r][2]; rk2[r][2] = U1[B0(w)] ^ U2[B1(w)] ^ U3[B2(w)] ^ U4[B3(w)];
			w = rk2[r][3]; rk2[r][3] = U1[B0(w)] ^ U2[B1(w)] ^ U3[B2(w)] ^ U4[B3(w)];
		}
		this.rk = rk2;
		this.rounds = rounds;
		return this;
	}
	//---------------------------------------------------------
	function AESdecrypt(block, ctx) {
		var r;
		var t0, t1, t2, t3;
		var rounds = ctx.rounds;
		var b = packBytes(block);
		for (r = rounds; r > 1; r--) {
			t0 = b[0] ^ ctx.rk[r][0];
			t1 = b[1] ^ ctx.rk[r][1];
			t2 = b[2] ^ ctx.rk[r][2];
			t3 = b[3] ^ ctx.rk[r][3];
			b[0] = T5[B0(t0)] ^ T6[B1(t3)] ^ T7[B2(t2)] ^ T8[B3(t1)];
			b[1] = T5[B0(t1)] ^ T6[B1(t0)] ^ T7[B2(t3)] ^ T8[B3(t2)];
			b[2] = T5[B0(t2)] ^ T6[B1(t1)] ^ T7[B2(t0)] ^ T8[B3(t3)];
			b[3] = T5[B0(t3)] ^ T6[B1(t2)] ^ T7[B2(t1)] ^ T8[B3(t0)];
		}
		// Last round is special.
		t0 = b[0] ^ ctx.rk[1][0];
		t1 = b[1] ^ ctx.rk[1][1];
		t2 = b[2] ^ ctx.rk[1][2];
		t3 = b[3] ^ ctx.rk[1][3];
		b[0] = S5[B0(t0)] | S5[B1(t3)] << 8 | S5[B2(t2)] << 16 | S5[B3(t1)] << 24;
		b[1] = S5[B0(t1)] | S5[B1(t0)] << 8 | S5[B2(t3)] << 16 | S5[B3(t2)] << 24;
		b[2] = S5[B0(t2)] | S5[B1(t1)] << 8 | S5[B2(t0)] << 16 | S5[B3(t3)] << 24;
		b[3] = S5[B0(t3)] | S5[B1(t2)] << 8 | S5[B2(t1)] << 16 | S5[B3(t0)] << 24;
		b[0] ^= ctx.rk[0][0];
		b[1] ^= ctx.rk[0][1];
		b[2] ^= ctx.rk[0][2];
		b[3] ^= ctx.rk[0][3];
		return unpackBytes(b);
	}

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
	};
	//---------------------------------------------------------
	this.Encrypt = function (key, input, mode) {
		if (arguments.length === 2) {
			//	var oBlock = AESencrypt(block, expandedKey);
			//	return 
		}
		var aBlock;
		// Bytes per block.
		var bpb = this.BlockSize / 8;
		// Output text.         
		var output = [];
		// Check input.
		if (!key || !input) return;
		if (key.length * 8 !== this.KeySize) return;
		var expandedKey = new keyExpansion(key);
		for (var b = 0; b < input.length / bpb; b++) {
			var block = input.slice(b * bpb, (b + 1) * bpb);
			// Cipher Mode.
			switch (mode) {
				case System.Security.Cryptography.CipherMode.CBC:
					for (var i = 0; i < bpb; i++) {
						block[i] ^= this.IV[b * bpb + i];
					}
					break;
				default:
					break;
			}
			// Cipher block;
			var dBlock = AESencrypt(block, expandedKey);
			output = output.concat(dBlock);
			//Trace.Write("block: "+System.BitConverter.ToString(block));
		}
		return output;
	};
	//---------------------------------------------------------
	this.Decrypt = function (key, input, mode) {
		var bpb = this.BlockSize / 8;           // bytes per block
		var output = [];               // plaintext array
		var aBlock;                             // a decrypted block
		if (!key || !input) return;
		if (key.length * 8 !== this.KeySize) return;
		if (!mode) mode = System.Security.Cryptography.CipherMode.ECB; // assume ECB if mode omitted
		var expandedKey = new prepare_decryption(key);
		for (var b = 0; b < input.length / bpb; b++) {
			// current block number.
			var block = input.slice(b * bpb, (b + 1) * bpb);
			var dBlock = AESdecrypt(block, expandedKey);
			if (mode === System.Security.Cryptography.CipherMode.CBC) {
				for (var i = 0; i < bpb; i++) {
					dBlock[i] ^= this.IV[b * bpb + i];
				}
			}
			output = output.concat(dBlock);
		}
		return output;
	};
	//---------------------------------------------------------
	function CreateCryptor(rgbKey, rgbIV, encrypt) {
		var key = rgbKey ? rgbKey : this.Key;
		var newKey = new System.Byte(key.length);
		System.Buffer.BlockCopy(key, 0, newKey, 0, key.length);
		// Copy initialization vector.
		var iv = rgbIV ? rgbIV : this.IV;
		var newIv = new System.Byte(iv.length);
		System.Buffer.BlockCopy(iv, 0, newIv, 0, iv.length);
		// Create Copy of algorithm.
		var algorithm = new System.Security.Cryptography.RijndaelManaged();
		algorithm.Key = newKey;
		algorithm.IV = newIv;
		algorithm.Mode = this.Mode;
		algorithm.Padding = this.Padding;
		// Create ICryptoTransform.
		var cryptor = new System.Security.Cryptography.ICryptoTransform(algorithm, encrypt);
		return cryptor;
	}
	//---------------------------------------------------------
	this.CreateEncryptor = function (rgbKey, rgbIV) {
		/// <summary>:
		/// Creates a symmetric encryptor object with the specified
		/// System.Security.Cryptography.SymmetricAlgorithm.Key property and
		/// System.Security.Cryptography.SymmetricAlgorithm.IV initialization vector.
		/// </summary>
		/// <param name="rgbKey">The secret key to use for the symmetric algorithm.</param>
		/// <param name="rgbIV">The initialization vector to use for the symmetric algorithm.</param>
		// Copy secret key.
		return CreateCryptor.call(this, rgbKey, rgbIV, true);
	};
	//---------------------------------------------------------
	this.CreateDecryptor = function (rgbKey, rgbIV) {
		/// <summary>:
		/// Creates a symmetric decryptor object with the specified
		/// System.Security.Cryptography.SymmetricAlgorithm.Key property and
		/// System.Security.Cryptography.SymmetricAlgorithm.IV initialization vector.
		/// </summary>
		/// <param name="rgbIV">The initialization vector to use for the symmetric algorithm.</param>
		/// <param name="rgbKey">The secret key to use for the symmetric algorithm.</param>
		return CreateCryptor.call(this, rgbKey, rgbIV, false);
	};
	//---------------------------------------------------------
	this.GenerateIV = function () {
		/// <summary>
		/// Generate a random initialization vector.
		/// </summary>
		this.IV = new Array(16);
		rng.GetBytes(this.IV);
	};
	//---------------------------------------------------------
	this.GenerateKey = function () {
		/// <summary>
		/// Generate a random key value.
		/// </summary>
		this.Key = new Array(this.KeySize / 8);
		rng.GetBytes(this.Key);
	};
	//---------------------------------------------------------
	function InitTables() {
		var ROOT = 0x11B;
		// S-box, inverse S-box, T-boxes, U-boxes
		var s, s2, s3;
		var i2, i4, i8, i9, ib, id, ie, t;
		// Fill reverese SBox array.
		var length = S.length;
		for (var i = 0; i < length; i++) {
			s = S[i] & 0xFF;
			S5[s] = i;
			s2 = s << 1;
			if (s2 >= 0x100) s2 ^= ROOT;
			s3 = s2 ^ s;
			i2 = i << 1;
			if (i2 >= 0x100) i2 ^= ROOT;
			i4 = i2 << 1;
			if (i4 >= 0x100) i4 ^= ROOT;
			i8 = i4 << 1;
			if (i8 >= 0x100) i8 ^= ROOT;
			i9 = i8 ^ i;
			ib = i9 ^ i2;
			id = i9 ^ i4;
			ie = i8 ^ i4 ^ i2;
			T1[i] = System.BitConverter.ToInt32([s2, s, s, s3], 0);
			T2[i] = System.BitConverter.ToInt32([s3, s2, s, s], 0);
			T3[i] = System.BitConverter.ToInt32([s, s3, s2, s], 0);
			T4[i] = System.BitConverter.ToInt32([s, s, s3, s2], 0);
			t = System.BitConverter.ToInt32Be([ib, id, i9, ie], 0);
			T5[s] = t; U1[i] = t;
			t = System.BitConverter.ToInt32([ib, ie, i9, id], 0);
			T6[s] = t; U2[i] = t;
			t = System.BitConverter.ToInt32([id, ib, ie, i9], 0);
			T7[s] = t; U3[i] = t;
			t = System.BitConverter.ToInt32([i9, id, ib, ie], 0);
			T8[s] = t; U4[i] = t;
		}
	}
	//---------------------------------------------------------
	this.Initialize = function () {
		rng = new System.Security.Cryptography.RNGCryptoServiceProvider();
		InitTables();
		this.GenerateIV();
		this.GenerateKey();
	};
	this.Initialize.apply(this, arguments);
};

System.Security.Cryptography.AES = function () { }

System.Type.RegisterClass("System.Security.Cryptography.AES");

System.Security.Cryptography.AES.Transform = function (dataBytes, passwordBytes, encrypt) {
	/// <summary>Encrypt by using AES-256 algorithm.</summary>
	// Create an instance of the Rijndael class.
	var cipher = new System.Security.Cryptography.RijndaelManaged();
	// Calculate salt to make it harder to guess key by using a dictionary attack.
	var hmac = new System.Security.Cryptography.HMACSHA1(passwordBytes);
	var salt = hmac.ComputeHash(passwordBytes);
	// Generate Secret Key from the password and salt.
	// Note: Set number of iterations to 10 in order for JavaScript example to work faster.
	var secretKey = new System.Security.Cryptography.Rfc2898DeriveBytes(passwordBytes, salt, 10);
	// Create a encryptor from the existing SecretKey bytes by using
	// 32 bytes (256 bits) for the secret key and
	// 16 bytes (128 bits) for the initialization vector (IV).
	var key = secretKey.GetBytes(32);
	var iv = secretKey.GetBytes(16);
	// Get cryptor as System.Security.Cryptography.ICryptoTransform class.
	var cryptor = encrypt
		? cipher.CreateEncryptor(key, iv)
		: cipher.CreateDecryptor(key, iv);
	// Create new Input.
	var inputBuffer = new System.Byte(dataBytes.length);
	// Copy data bytes to input buffer.
	System.Buffer.BlockCopy(dataBytes, 0, inputBuffer, 0, inputBuffer.length);
	// Create a MemoryStream to hold the output bytes.
	var stream = new System.IO.MemoryStream();
	// Create a CryptoStream through which we are going to be processing our data.
	var mode = System.Security.Cryptography.CryptoStreamMode.Write;
	var cryptoStream = new System.Security.Cryptography.CryptoStream(stream, cryptor, mode);
	// Start the crypting process.
	cryptoStream.Write(inputBuffer, 0, inputBuffer.length);
	// Finish crypting.
	cryptoStream.FlushFinalBlock();
	// Convert data from a memoryStream into a byte array.
	var outputBuffer = stream.ToArray();
	// Close both streams.
	stream.Close();
	cryptoStream.Close();
	return outputBuffer;
};

System.Security.Cryptography.AES.Encrypt = function (data, password) {
	/// <summary>
	/// Encrypt string with AES-256 algorithm by using password.
	/// </summary>
	/// <param name="data">String (or bytes) to encrypt.</param>
	/// <param name="password">Password string (or bytes).</param>
	/// <returns>Encrypted Base64 string.</returns>
	// If data is string then turn string into a byte array.
	var dataBytes = typeof data === "string"
		? System.Text.Encoding.UTF8.GetBytes(data) : data;
	var passwordBytes = typeof password === "string"
		? System.Text.Encoding.UTF8.GetBytes(password) : password;
	var bytes = System.Security.Cryptography.AES.Transform(dataBytes, passwordBytes, true);
	// Convert encrypted data into a Base64 string.
	var text = System.Convert.ToBase64String(bytes);
	return text;
}

System.Security.Cryptography.AES.Decrypt = function (data, password) {
	/// <summary>
	/// Decrypt string with AES-256 algorithm by using password.
	/// </summary>
	/// <param name="data">Base64 string or bytes to encrypt.</param>
	/// <param name="password">Password string (or bytes).</param>
	/// <returns>Decrypted string.</returns>
	// If data is string then turn string into a byte array.
	var dataBytes = typeof data === "string"
		? System.Convert.FromBase64String(data) : data;
	var passwordBytes = typeof password === "string"
		? System.Text.Encoding.UTF8.GetBytes(password) : password;
	var bytes = System.Security.Cryptography.AES.Transform(dataBytes, passwordBytes, false);
	// Convert decrypted data into a string.
	var text = System.Text.Encoding.UTF8.GetString(bytes);
	return text;
}

//==============================================================================
// END
//------------------------------------------------------------------------------