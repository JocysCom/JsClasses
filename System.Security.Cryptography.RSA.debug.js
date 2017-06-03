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

// Maximum Message Size for OAEP Padding Scheme:
//
// OAEP SHA1 160-bit:
// 214 bytes = 256 (2048-bit RSA) - 1 prefix - 20 seed - 20 label - 1 separator
// OAEP SHA256 256-bit
// 190 bytes = 256 (2048-bit RSA) - 1 prefix - 32 seed - 32 label - 1 separator
//
// https://www.codeproject.com/Articles/421656/RSA-Library-with-Private-Key-Encryption-in-Csharp
//
//                     +----------+---------+-------+
//                DB = |  pHash   |    PS   |   M   |
//                     +----------+---------+-------+
//                                    |
//          +----------+              V
//          |   Seed   |--> MGF ---> XOR
//          +----------+              |
//                |                   |
//       +--+     V                   |
//       |00|    XOR <----- MGF <-----|
//       +--+     |                   |
//         |      |                   |
//         V      V                   V
//       +--+----------+----------------------------+
// EM =  |00|maskedSeed|          maskedDB          |
//       +--+----------+----------------------------+
//
// DB - Data block to be encrypted, consists of pHash, PS and M.
//
// pHash - Hash of a predefined parameter list in the form of a byte array. It is used to make sure that the parameters at the encryption side and decryption side are the same, but, in most implementations its ignored and is optional. In that case, the Hash of an empty byte array is used instead.
//
// PS - A string of '0's followed by a 1. Used to fill the unused space in case, the message is shorter than the maximum allowed message length.
//
// M - Actual message to be encrypted.
//
// Seed - A random array of bytes, the length being equal to the length of hash function being used.
//
// MGF - Mask Generation Function, it is used to generate a variable length hash from a given input random input.
//
// XOR - Bit-wise Ex-OR operation.
//
// maskedSeed - The masked seed, which is part of the padded text. It is later (while decoding) used to get the Seed in conjunction with the MGF output of the maskedDB.
//
// maskedDB - The masked Data Block. It is later (while decoding) used to feed the MGF function which is used to obtain the Seed. It is also used to obtain the DB, by using the MGF output of the Seed.
//

System.Security.Cryptography.RSAManaged = function () {
	/// <summary>
	/// Initializes a new instance of the System.Security.Cryptography.RSAManaged
	/// class.
	/// </summary>	
	/// <remarks>
	/// Evaldas Jocys, evaldas@jocys.com, www.jocys.com
	/// </remarks>
	//---------------------------------------------------------
	// Public Properties
	//---------------------------------------------------------
	// Private Properties
	//---------------------------------------------------------
};
System.Type.RegisterClass("System.Security.Cryptography.RSAManaged");

System.Security.Cryptography.RSAParameters = function () {
	/// <summary>
	/// Initializes a new instance of the System.Security.Cryptography.RSACryptoServiceProvider
	/// class using the default key.
	/// </summary>	
	/// <remarks>
	/// Recreated as JavaScript class by:
	/// Evaldas Jocys, evaldas@jocys.com, www.jocys.com
	/// http://www.koders.com/csharp/fidE8DED43C8555D56BAB880F8E5AA4CEC09C62A847.aspx
	/// </remarks>
	//---------------------------------------------------------
	// Public Properties
	this.Exponent = [];
	this.Modulus = [];
	// Non serialized parameters.
	this.D = [];
	this.DP = [];
	this.DQ = [];
	this.InverseQ = [];
	this.P = [];
	this.Q = [];
	//---------------------------------------------------------
	this.Clone = function (includePrivateParameters) {
		var parameters = new System.Security.Cryptography.RSAParameters();
		System.Array.Copy(this.Exponent, parameters.Exponent, this.Exponent.length);
		System.Array.Copy(this.Modulus, parameters.Modulus, this.Modulus.length);
		if (includePrivateParameters) {
			if (this.D) System.Array.Copy(this.D, parameters.D, this.D.length);
			if (this.DP) System.Array.Copy(this.DP, parameters.DP, this.DP.length);
			if (this.DQ) System.Array.Copy(this.DQ, parameters.DQ, this.DQ.length);
			if (this.InverseQ) System.Array.Copy(this.InverseQ, parameters.InverseQ, this.InverseQ.length);
			if (this.P) System.Array.Copy(this.P, parameters.P, this.P.length);
			if (this.Q) System.Array.Copy(this.Q, parameters.Q, this.Q.length);
		}
		return parameters;
	};
	//---------------------------------------------------------
	this.Initialize = function () {
	};
	this.Initialize.apply(this, arguments);
};
System.Type.RegisterClass("System.Security.Cryptography.RSAParameters");

System.Security.Cryptography.RSACryptoServiceProvider = function () {
	/// <summary>
	/// Initializes a new instance of the System.Security.Cryptography.RSACryptoServiceProvider
	/// class using the default key.
	/// </summary>	
	/// <remarks>
	/// Recreated as JavaScript class by:
	/// Evaldas Jocys, evaldas@jocys.com, www.jocys.com
	/// </remarks>
	//---------------------------------------------------------
	// Public Properties
	// Default key in .NET is 1024.
	// Set default key size to 512-bit for slow JavaScript.
	this.KeySize = 512;
	this.BlockSize = 512;
	this.FeedbackSize = 512;
	this.IV = [];
	this.HashSize = 20 * 8; // SHA-1
	//---------------------------------------------------------
	// Private Properties
	var rsaParams = null;
	var rsaParamsBi = null;
	var bi = System.BigInt.Utils;
	//---------------------------------------------------------
	function GetKeyPair() {
		if (rsaParams === null) rsaParams = NewKeyPair.call(this, true);
		return rsaParams;
	}
	//---------------------------------------------------------
	function NewKeyPair(truePrime) {
		// Generate RSA parameters.
		// Note on math:  x^(-1) == 1/x
		var p; // p / Primary 1
		var q; // q / Primary 2
		var n; // n / Modulus.
		var e; // e / Exponent / public exponent / encryption exponent.
		var d; // d / D / secret exponent / decryption exponent.
		// Create public exponent first.
		e = bi.FromString("10001", 16, 0);
		// p and q values should have a length of half the strength in bits.
		var pLen = this.KeySize + 1 >> 1;
		var qLen = this.KeySize - pLen;
		// Generate random primary number 'p'.
		for (; ;) {
			p = truePrime ? bi.NewPrime(pLen) : bi.NewProbPrime(pLen);
			// Prime must not be congruent to 1 modulo e: (p mod e) != 1.
			if (!bi.EqualsInt(bi.Mod(p, e), 1)) break;
		}
		// Generate a modulus of the required length.
		for (; ;) {
			for (; ;) {
				q = truePrime ? bi.NewPrime(qLen) : bi.NewProbPrime(qLen);
				// Prime must be and distinct and not congruent to 1 modulo e: (q mod e) != 1.
				if (!bi.Equals(p, q) && !bi.EqualsInt(bi.Mod(q, e), 1)) break;
			}
			// Modulus: n = p*q
			n = bi.Multiply(p, q);
			if (bi.BitCount(n) === this.KeySize) break;
			// if we get here our primes aren't big enough, make the largest
			// of the two p and try again
			if (bi.MoreThan(q, p)) p = q;
		}
		if (bi.MoreThan(q, p)) {
			// Swap numbers.
			var t = p; p = q; q = t;
		}
		// phi: phi = (p-1)*(q-1)
		var p1 = bi.AddInt(p, -1);
		var q1 = bi.AddInt(q, -1);
		var phi = bi.Multiply(p1, q1);
		// Decryption exponent: (1/e) mod phi
		d = bi.InverseMod(e, phi);
		if (!d) Trace.Write('ERROR: e isn\'t invertible. Try a different prime e. ****');
		// -------------------------
		// Calculate alternative method of representing the private key.
		// Uses the Chinese Remainder Theorem (CRT).
		// The private key is represented as a quintuple (P, Q, dP, dQ, and InvQ), where
		// P and Q are prime factors of n,
		// dP and dQ are known as the CRT exponents,
		// and qInv is the CRT coefficient.
		// The CRT method of decryption is four times faster overall than calculating m = c^d mod n
		//
		// qInv = (1/q) mod p  where p > q
		var qInv = bi.InverseMod(q, p);
		// CRT Exponent: dP = (1/e) mod (p-1)
		var dP = bi.InverseMod(e, p1);
		// CRT Exponent: dQ = (1/e) mod (q-1)
		var dQ = bi.InverseMod(e, q1);
		// Save key.
		var parameters = new System.Security.Cryptography.RSAParameters();
		parameters.Exponent = bi.ToBytes(e);
		parameters.Modulus = bi.ToBytes(n);
		parameters.D = bi.ToBytes(d);
		// Primary Numbers
		parameters.P = bi.ToBytes(p);
		parameters.Q = bi.ToBytes(q);
		// CRT
		parameters.DP = bi.ToBytes(dP);
		parameters.DQ = bi.ToBytes(dQ);
		parameters.InverseQ = bi.ToBytes(qInv);
		// Inverse byte arrays.
		System.Array.Reverse(parameters.Exponent);
		System.Array.Reverse(parameters.Modulus);
		System.Array.Reverse(parameters.D);
		System.Array.Reverse(parameters.P);
		System.Array.Reverse(parameters.Q);
		System.Array.Reverse(parameters.DP);
		System.Array.Reverse(parameters.DQ);
		System.Array.Reverse(parameters.InverseQ);
		return parameters;
	}
	//---------------------------------------------------------
	function getXmlValue(xmlString, tag) {
		var rx = new RegExp("<" + tag + ">(.*?)</" + tag + ">", "gi");
		var tagMatch = xmlString.match(rx);
		if (!tagMatch) return null;
		var base64 = tagMatch[0].replace(rx, "$1");
		var bytes = System.Convert.FromBase64String(base64);
		return bytes;
	}
	//---------------------------------------------------------
	this.ImportParameters = function (parameters) {
		rsaParams = parameters.Clone(true);
		rsaParamsBi = null;
		this.KeySize = rsaParams.Modulus.length * 8;
		this.BlockSize = this.KeySize;
		this.FeedbackSize = this.KeySize;
	};
	//---------------------------------------------------------
	this.ExportParameters = function (includePrivateParameters) {
		var key = GetKeyPair.call(this);
		return key.Clone(includePrivateParameters);
	};
	//---------------------------------------------------------
	this.FromXmlString = function (xmlString) {
		var parameters = new System.Security.Cryptography.RSAParameters();
		var tagSpace = new RegExp("\\s", "gi");
		xmlString = xmlString.replace(tagSpace, "");
		parameters.Exponent = getXmlValue(xmlString, "Exponent");
		parameters.Modulus = getXmlValue(xmlString, "Modulus");
		parameters.D = getXmlValue(xmlString, "D");
		parameters.DP = getXmlValue(xmlString, "DP");
		parameters.DQ = getXmlValue(xmlString, "DQ");
		parameters.InverseQ = getXmlValue(xmlString, "InverseQ");
		parameters.P = getXmlValue(xmlString, "P");
		parameters.Q = getXmlValue(xmlString, "Q");
		this.ImportParameters(parameters);
	};
	//---------------------------------------------------------
	this.ToXmlString = function (includePrivateParameters) {
		var parameters = this.ExportParameters(includePrivateParameters);
		var builder = new System.Text.StringBuilder();
		builder.Append("<RSAKeyValue>");
		builder.Append("<Modulus>" + System.Convert.ToBase64String(parameters.Modulus) + "</Modulus>");
		builder.Append("<Exponent>" + System.Convert.ToBase64String(parameters.Exponent) + "</Exponent>");
		if (includePrivateParameters) {
			builder.Append("<P>" + System.Convert.ToBase64String(parameters.P) + "</P>");
			builder.Append("<Q>" + System.Convert.ToBase64String(parameters.Q) + "</Q>");
			builder.Append("<DP>" + System.Convert.ToBase64String(parameters.DP) + "</DP>");
			builder.Append("<DQ>" + System.Convert.ToBase64String(parameters.DQ) + "</DQ>");
			builder.Append("<InverseQ>" + System.Convert.ToBase64String(parameters.InverseQ) + "</InverseQ>");
			builder.Append("<D>" + System.Convert.ToBase64String(parameters.D) + "</D>");
		}
		builder.Append("</RSAKeyValue>");
		return builder.ToString();
	};
	//---------------------------------------------------------
	function Padding(input, fOAEP, encrypt) {
		this.Padding = fOAEP
			? System.Security.Cryptography.PaddingMode.RsaEsOaep
			: System.Security.Cryptography.PaddingMode.RsaEsPkcs;
		this.Mode = System.Security.Cryptography.CipherMode.ECB;
		var crypto = new System.Security.Cryptography.ICryptoTransform(this, true);
		var output = encrypt
			? crypto._Padding(input, 0, input.length).iBuffer
			: crypto._PaddingRemove(input, 0, input.length);
		return output;
	}
	//---------------------------------------------------------
	function RsaEncryptBlock(block, key) {
		var mBytes = block.Clone();
		System.Array.Reverse(mBytes);
		var e = bi.FromBytes(key.Exponent);
		var n = bi.FromBytes(key.Modulus);
		var d = bi.FromBytes(key.D);
		var m = bi.FromBytes(mBytes);
		// Encrypt: c = m^e mod n
		var c = bi.PowMod(m, e, n);
		var cBytes = bi.ToBytes(c);
		// Expand to block size with empty bytes.
		var bpb = this.KeySize / 8; 			// bytes per block
		for (var i = cBytes.length; i < bpb; i++) cBytes.push(0x00);
		System.Array.Reverse(cBytes);
		return cBytes;
	}
	//---------------------------------------------------------
	function EncryptBytes(key, input, fOAEP) {
		var bpb = this.KeySize / 8 - (fOAEP ? 41 : 11); // bytes per block
		var output = [];               // plaintext array
		var block;                              // current block number
		for (var b = 0; b < input.length / bpb; b++) {
			block = input.slice(b * bpb, (b + 1) * bpb);
			// Reverse bytes for compatibility with RSACryptoServiceProvider.
			System.Array.Reverse(block);
			// Add padding.
			var padded = Padding.call(this, block, fOAEP, true);
			// RSA Encrypt.
			var cBytes = RsaEncryptBlock.call(this, padded, key);
			// Add result to output.
			output = output.concat(cBytes);
		}
		return output;
	}
	//---------------------------------------------------------
	this.Encrypt = function (rgb, fOAEP) {
		/// <summary>
		/// Encrypts data with the System.Security.Cryptography.RSA algorithm.
		/// </summary>
		/// <param name="rgb">The data to be encrypted.</param>
		/// <param name="fOAEP">true to perform direct System.Security.Cryptography.RSA encryption using
		/// OAEP padding (only available on a computer running Microsoft Windows XP or
		/// later); otherwise, false to use PKCS#1 v1.5 padding.
		/// </param>
		/// <returns>The encrypted data.</returns>
		var msg;
		var key = GetKeyPair.call(this);
		var digitSize = key.Modulus.length;
		if (!fOAEP && rgb.length > digitSize - 11) {
			msg = "The data to be encrypted exceeds the maximum for this modulus of " + key.digitSize + " bytes. Maximum data size is " + (key.digitSize - 11) + " bytes.";
			Trace.Write(msg);
			throw new System.Security.Cryptography.CryptographicException(msg);
		}
		if (fOAEP && rgb.length > digitSize - 42) {
			// 41 = 1 (0x00) prefix + 20 seed + 20 label + 1 (0x01) separator.
			msg = "The data to be encrypted exceeds the maximum for this modulus of " + key.digitSize + " bytes. Maximum data size is " + (key.digitSize - 42) + " bytes.";
			Trace.Write(msg);
			throw new System.Security.Cryptography.CryptographicException(msg);
		}
		return EncryptBytes.call(this, key, rgb, fOAEP);
	};
	//---------------------------------------------------------
	this.Decrypt = function (rgb, fOAEP) {
		/// <summary>
		/// Decrypts data with the System.Security.Cryptography.RSA algorithm.
		/// </summary>
		/// <param name="rgb">The data to be decrypted.</param>
		/// <param name="fOAEP">true to perform direct System.Security.Cryptography.RSA decryption using
		/// OAEP padding (only available on a computer running Microsoft Windows XP or
		/// later); otherwise, false to use PKCS#1 v1.5 padding.
		/// </param>
		/// <returns>The decrypted data, which is the original plain text before encryption.</returns>
		var key = GetKeyPair.call(this);
		return DecryptBytes.call(this, key, rgb, fOAEP);
	};
	//---------------------------------------------------------
	function RsaDecryptBlock(block, key) {
		var e = bi.FromBytes(key.Exponent);
		var n = bi.FromBytes(key.Modulus);
		var d = bi.FromBytes(key.D);
		var c = bi.FromBytes(block);
		var m;
		// The CRT method of decryption is four times faster overall than calculating c^d mod n.
		// Even though there are more steps in this procedure,
		// the modular exponentation to be carried out uses much shorter exponents and
		// so it is less expensive overall. 
		var CRT = true;
		if (CRT) {
			var dP = bi.FromBytes(key.DP);
			var dQ = bi.FromBytes(key.DQ);
			var qInv = bi.FromBytes(key.InverseQ);
			var p = bi.FromBytes(key.P);
			var q = bi.FromBytes(key.Q);
			// m1 = (c^dP) mod p
			var m1 = bi.PowMod(c, dP, p);
			// m2 = (c^dQ) mod q
			var m2 = bi.PowMod(c, dQ, q);
			// h = (qInv * (m1 + p - m2)) mod p
			var h = bi.MultiplyMod(qInv, bi.Subtract(bi.Add(m1, p), m2), p);
			// m = m2 + (h*q)
			m = bi.Add(m2, bi.Multiply(h, q));
		} else {
			// Decrypt: m = c^d mod n
			m = bi.PowMod(c, d, n);
		}
		if (!bi.MoreThan(n, m)) Trace.Write('ERROR: The message m must be less than p*q');
		var mBytes = bi.ToBytes(m);
		// Expand to block size with empty bytes.
		var bpb = this.KeySize / 8; 			// bytes per block
		for (var i = mBytes.length; i < bpb; i++) mBytes.push(0x00);
		return mBytes;
	}
	//---------------------------------------------------------
	function DecryptBytes(key, input, fOAEP) {
		var bpb = this.KeySize / 8; 			// bytes per block
		var output = [];       // plaintext array
		var block;                      // current block number
		for (var b = 0; b < input.length / bpb; b++) {
			block = input.slice(b * bpb, (b + 1) * bpb);
			// RSA Decrypt.
			block = RsaDecryptBlock.call(this, block, key);
			// Remove padding.
			var unpadded = Padding.call(this, block, fOAEP, false);
			// Reverse bytes for compatibility with RSACryptoServiceProvider.
			System.Array.Reverse(unpadded);
			// Add result to output.
			output = output.concat(unpadded);
		}
		return output;
	}
	//---------------------------------------------------------
	this.Initialize = function () {
		if (arguments.length === 1) {
			if (typeof arguments[0] === "number") {
				this.KeySize = arguments[0];
				this.BlockSize = this.KeySize;
				this.FeedbackSize = this.KeySize;
			}
		}
	};
	this.Initialize.apply(this, arguments);
};
System.Type.RegisterClass("System.Security.Cryptography.RSACryptoServiceProvider");

System.Security.Cryptography.RsaCreateEventArgs = function () {
	this.UserState = null;
	this.PublicKey = null;
	this.PrivateKey = null;
	this.Error = null;
};
System.Type.RegisterClass("System.Security.Cryptography.RsaCreateEventArgs");

System.Security.Cryptography.RSA = function () { };
System.Type.RegisterClass("System.Security.Cryptography.RSA");

System.Security.Cryptography.RSA.CreateKeyCompleted = function (sender, e) {
	/// <summary>fires when new key is generated</summary>
	/// <param name="sender">RSA class</param>
	/// <param name="e" type="GenerateKeyEventArgs">Results</param>
};

System.Security.Cryptography.RSA.CreateKeyAsync = function (keySize, userState) {
	/// <summary>Create new RSA provider.</summary>
	//---------------------------------------------------------
	function raiseException(message) {
		var e = new System.Security.Cryptography.RsaCreateEventArgs();
		e.UserState = userState;
		e.Error = new System.Exception(message);
		var ev = System.Security.Cryptography.RSA.CreateKeyCompleted;
		if (typeof ev === "function") {
			ev(this, e);
		}
	}
	//---------------------------------------------------------
	function raiseComplete() {
		var e = new System.Security.Cryptography.RsaCreateEventArgs();
		e.UserState = userState;
		e.PublicKey = _publicKey;
		e.PrivateKey = _privateKey;
		var ev = System.Security.Cryptography.RSA.CreateKeyCompleted;
		if (typeof ev === "function") {
			ev(this, e);
		}
	}
	//---------------------------------------------------------
	function ExecPromiseAsync(promise, onComplete, onError) {
		/// <summary>Helper function to execute JavaScript PromiseLive object</summary>
		if (window.crypto) {
			promise.then(onComplete).catch(onError);
		}
		else if (window.msCrypto) {
			promise.oncomplete = onComplete;
			promise.onerror = onError;
		}
	}
	//---------------------------------------------------------
	function convertKey(key, includePrivateParameters) {
		var parameters = new System.Security.Cryptography.RSAParameters();
		var e = System.Convert.FromBase64UrlString(key.e);
		var n = System.Convert.FromBase64UrlString(key.n);
		parameters.Exponent = e;
		parameters.Modulus = n;
		if (includePrivateParameters) {
			var d = System.Convert.FromBase64UrlString(key.d);
			var dp = System.Convert.FromBase64UrlString(key.dp);
			var dq = System.Convert.FromBase64UrlString(key.dq);
			var qi = System.Convert.FromBase64UrlString(key.qi);
			var p = System.Convert.FromBase64UrlString(key.p);
			var q = System.Convert.FromBase64UrlString(key.q);
			// Private parameters.
			parameters.D = d;
			parameters.DP = dp;
			parameters.DQ = dq;
			parameters.InverseQ = qi;
			parameters.P = p;
			parameters.Q = q;
		}
		return parameters;
	}
	//---------------------------------------------------------
	var subtle = null;

	// If Microsoft Internet Explorer then...
	if (window.msCrypto) {
		subtle = window.msCrypto.subtle;
	}
	// If other browsers then...
	else if (window.crypto) {
		subtle = window.crypto.subtle || window.crypto.webkitSubtle;
	}
	else {
		raiseException("Web Cryptography API not found.");
		return;
	}
	if (subtle === null) {
		raiseException("Web Cryptography API Subtle not found.");
		return;
	}

	//=================================================
	// STEP 1: Generate key pair.
	//-------------------------------------------------

	// Set key options.
	var rsaHashedKeyGenParams = {
		// Microsoft use RSA-OAEP (SHA1) for RSA.
		name: "RSA-OAEP", // "RSAES-PKCS1-v1_5"
		// Can be: 512, 1024, 2048, 4096.
		modulusLength: keySize,
		publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
		// Can be: SHA-1, SHA-256, SHA-384, SHA-512.
		hash: { name: "SHA-1" }
	};

	// Mark key as exportable.
	var generatePromise = subtle.generateKey(rsaHashedKeyGenParams, true, ["encrypt", "decrypt"]);

	// Begin generation of the key pair.
	ExecPromiseAsync(generatePromise, generateKey_OnComplete, generateKey_OnError);

	function generateKey_OnError(e) {
		raiseException("generateKey error:" + e);
	}

	var _publicJwk = null;
	var _privateJwk = null;

	function generateKey_OnComplete(e) {
		if (window.crypto) {
			_publicJwk = e.privateKey;
			_privateJwk = e.privateKey;
		} else if (window.msCrypto) {
			_publicJwk = e.target.result.publicKey;
			_privateJwk = e.target.result.privateKey;
		}
		// Continue to STEP 2.
		ExportPrivateKey(_privateJwk);
	}

	//=================================================
	// STEP 2: Export private key.
	//-------------------------------------------------

	var _privateKey;

	function ExportPrivateKey(key) {
		var exportPromise = subtle.exportKey('jwk', key);
		ExecPromiseAsync(exportPromise, exportPrivateKey_OnComplete, exportPrivateKey_OnError);
	}

	function exportPrivateKey_OnError(e) {
		raiseException("exportKey error (private):" + e);
	}

	function exportPrivateKey_OnComplete(e) {
		var key;
		if (window.crypto) {
			key = e;
		}
		else if (window.msCrypto) {
			var bytes = new Uint8Array(e.target.result);
			var json = System.Text.Encoding.ASCII.GetString(bytes);
			key = JSON.parse(json);
		}
		_privateKey = convertKey(key, true);
		_publicKey = _privateKey;
		// Complete
		raiseComplete();
	}

	//=================================================
	// COMPLETE
	//-------------------------------------------------

};



//==============================================================================
// END
//------------------------------------------------------------------------------