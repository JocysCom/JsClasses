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
			// Prime must not be congruent to 1 modulo e: p mod e != 1
			if (!bi.EqualsInt(bi.Mod(p, e), 1)) break;
		}
		// Generate a modulus of the required length.
		for (; ;) {
			for (; ;) {
				q = truePrime ? bi.NewPrime(qLen) : bi.NewProbPrime(qLen);
				// Primes must be distinct and not congruent to 1 modulo e:
				// (p != q) and ((q mod e) != 1)
				if (!bi.Equals(p, q) && !bi.EqualsInt(bi.Mod(q, e), 1)) break;
			}
			// Modulus: n = p*q
			n = bi.Multiply(p, q);
			if (bi.BitCount(n) === this.KeySize) break;
			// if we get here our primes aren't big enough, make the largest
			// of the two p and try again
			if (bi.MoreThan(q, p)) p = q;
		}
		var t;
		if (bi.MoreThan(q, p)) {
			t = p; p = q; q = t;
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

//==============================================================================
// END
//------------------------------------------------------------------------------