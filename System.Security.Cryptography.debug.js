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

System.Security.Cryptography.CryptographicException = function (message) {
	this.message = message;
	this.toString = function () { return this.name + ": " + this.message; };
	var err = Error.create(this.message, { name: this.GetType().FullName });
	err.popStackFrame();
	return err;
};
System.Type.RegisterClass("System.Security.Cryptography.CryptographicException");


System.Security.Cryptography.Rfc2898DeriveBytes = function (password, salt, iterations) {
	/// <summary>
	/// RFC2898 (PKCS#5 v2) Key derivation for Password Based Encryption 
	/// Parameters
	/// </summary>
	/// <param name="password">The password to derive the key for.</param>
	/// <param name="salt">The key salt to use to derive the key.</param>
	/// <remarks>
	/// Recreated as class by Evaldas Jocys (http://www.jocys.com)
	///
	/// Original Author: Sebastien Pouliot (sebastien@ximian.com)
	/// (C) 2003 Motus Technologies Inc. (http://www.motus.com)
	/// Copyright (C) 2004-2005 Novell, Inc (http://www.novell.com)
	///
	/// Permission is hereby granted, free of charge, to any person obtaining
	/// a copy of this software and associated documentation files (the
	/// "Software"), to deal in the Software without restriction, including
	/// without limitation the rights to use, copy, modify, merge, publish,
	/// distribute, sublicense, and/or sell copies of the Software, and to
	/// permit persons to whom the Software is furnished to do so, subject to
	/// the following conditions:
	/// 
	/// The above copyright notice and this permission notice shall be
	/// included in all copies or substantial portions of the Software.
	/// 
	/// IMPORTANT NOTE:
	/// 
	/// It seems that original Mono RFC2898 implementation have a bug.
	/// Mono developers blame it on Microsoft but actualy Mono are wrong.
	/// You check it by getting bytes bytes: 
	/// Rfc2898DeriveBytes pdb = new Rfc2898DeriveBytes("password", "saltsalt", 100);
	/// bytes[] b48 = pdb.GetBytes(48) // Get 48 bytes.
	/// pdb.Reset(); // Reset RFC2898
	/// bytes[] b32 = pdb.GetBytes(32) // Get 32 bytes.
	/// bytes[] b16 = pdb.GetBytes(16) // Get 16 bytes.
	/// then convert them to hex string with BitConverter.ToString(bNN);
	/// and see that [b48] is not equal to [b32 + b16];
	///
	/// Workaroud for Mono. You can get correct bytes by doing:
	/// byte[] data = pdb.GetBytes(48);
	/// and then split the first 32 bytes for the key and the last 16 bytes
	/// for the IV.
	/// </remarks>
	//---------------------------------------------------------
	// Public properties.
	this.IterationCount = 1000;
	this.Password;
	this.Salt;
	this.Hmac;
	// HMACSHA1 == 160 bits == 20 bytes.
	this.HmacLength = 20;
	//---------------------------------------------------------
	// Private properties.
	var _buffer;
	var _pos = 0;
	var _f = 0;
	//---------------------------------------------------------
	this.F = function (s, c, i) {
		var data = new Array(s.length + 4);
		System.Buffer.BlockCopy(s, 0, data, 0, s.length);
		// JS: Replace 'undefined' values with 0.
		for (var b = 0; b < 4; b++) data[s.length + b] = 0;
		var int4 = System.BitConverter.GetBytes(i);
		System.Array.Reverse(int4, 0, 4);
		System.Buffer.BlockCopy(int4, 0, data, s.length, 4);
		// this is like j=0
		var u1 = this.Hmac.ComputeHash(this.Password, data);
		data = u1;
		// so we start at j=1
		for (var j = 1; j < c; j++) {
			var un = this.Hmac.ComputeHash(this.Password, data);
			// xor
			for (var k = 0; k < this.HmacLength; k++) {
				u1[k] = (u1[k] ^ un[k]) & 0xff;
			}
			data = un;
		}
		return u1;
	};
	//---------------------------------------------------------
	this.GetBytes = function (cb) {
		/// <summary>
		/// Returns pseudo-random key bytes.
		/// </summary>
		/// <param name="cb">The number of pseudo-random key bytes to generate.</param>
		/// <returns>A byte array filled with pseudo-random key bytes.</returns>
		//Trace.Write("hs:"+this.Hmac.ComputeHash(this.Password, "data"));
		var l = Math.floor(cb / this.HmacLength);
		var r = Math.floor(cb % this.HmacLength); // remainder
		if (r !== 0) l++; // rounding up
		var result = new Array(cb);
		var rpos = 0;
		var count = 0;
		if (_pos > 0) {
			count = Math.min(this.HmacLength - _pos, cb);
			System.Buffer.BlockCopy(_buffer, _pos, result, 0, count);
			if (count >= cb) return result;
			_pos = 0;
			//rpos = this.HmacLength - cb; // Mono buggy line.
			rpos = (rpos + count) % cb; // Microsoft correct line.
			r = cb - rpos;
		}
		for (var i = 1; i <= l; i++) {
			_buffer = this.F(this.Salt, this.IterationCount, ++_f);
			count = i === l ? r : this.HmacLength;
			System.Buffer.BlockCopy(_buffer, _pos, result, rpos, count);
			var bpos = rpos; // Microsoft correct line. 
			//rpos += _pos + count; // Mono buggy line//
			rpos = (rpos + _pos + count) % cb; // Microsoft correct line. 
			_pos = count === this.HmacLength ? 0 : count;
			if (bpos + count >= cb) return result;
		}
		return result;
	};
	//---------------------------------------------------------
	function Reset() {
		_buffer = null;
		_pos = 0;
		_f = 0;
	}
	//---------------------------------------------------------
	this.Initialize = function () {
		var password = arguments[0];
		var salt = arguments[1];
		var iterations = arguments[2];
		// Convert from string to bytes if neccessary.
		if (typeof password === "string") password = System.Text.Encoding.UTF8.GetBytes(password);
		if (typeof salt === "string") salt = System.Text.Encoding.UTF8.GetBytes(salt);
		this.Password = password;
		//Trace.Write("Salt: "+salt);
		this.Salt = salt;
		if (iterations) this.IterationCount = iterations;
		this.Hmac = new System.Security.Cryptography.HMACSHA1();
	};
	this.Initialize.apply(this, arguments);
};
System.Type.RegisterClass("System.Security.Cryptography.Rfc2898DeriveBytes");

System.Security.Cryptography.ICryptoTransform = function (algorithm, encryption, rgbIV) {
	/// <summary>
	/// Defines the basic operations of cryptographic transformations.
	/// </summary>
	//---------------------------------------------------------
	// Private Properties.
	var iv = [];
	var algo = null;
	var encrypt = false;
	var blockSizeByte = 0;
	var temp = [];
	var temp2 = [];
	var workBuff = [];
	var workout = [];
	var feedBackByte = 0;
	var feedBackIter = 0;
	var m_disposed = false;
	var lastBlock = false;
	var _rng;
	//---------------------------------------------------------
	// Public Properties.
	this.InputBlockSize = 0;
	this.OutputBlockSize = 0;
	this.CanTransformMultipleBlocks = true;
	this.CanReuseTransform = false;
	//---------------------------------------------------------
	this._Transform = function (input, output) {
		/// <summary>
		/// </summary>
		/// <param type="byte[]" name="input"></param>
		/// <param type="byte[]" name="output"></param>
		/// <remarks>
		/// Each block MUST be BlockSizeValue in size!!!
		/// i.e. Any padding must be done before calling this method
		/// </remarks>
		switch (algo.Mode) {
			case System.Security.Cryptography.CipherMode.ECB:
				ECB(input, output);
				break;
			case System.Security.Cryptography.CipherMode.CBC:
				CBC(input, output);
				break;
			case System.Security.Cryptography.CipherMode.CFB:
				CFB(input, output);
				break;
			case System.Security.Cryptography.CipherMode.OFB:
				OFB(input, output);
				break;
			case System.Security.Cryptography.CipherMode.CTS:
				CTS(input, output);
				break;
			default:
				var msg = "Unkown CipherMode" + algo.Mode;
				throw msg;
		}
	};
	//---------------------------------------------------------
	// Electronic Code Book (ECB)
	function ECB(input, output) {
		var outputBuffer;
		if (encrypt) {
			outputBuffer = algo.Encrypt(algo.Key, input, System.Security.Cryptography.CipherMode.ECB);
			//var outputBuffer = input;
			System.Buffer.BlockCopy(outputBuffer, 0, output, 0, blockSizeByte);
		} else {
			outputBuffer = algo.Decrypt(algo.Key, input, System.Security.Cryptography.CipherMode.ECB);
			System.Buffer.BlockCopy(outputBuffer, 0, output, 0, blockSizeByte);
		}
		//Trace.Write("call ECB(input["+input.length+"] = "+System.BitConverter.ToString(input)+", output["+output.length+"] = "+System.BitConverter.ToString(output)+")");
	}
	//---------------------------------------------------------
	// Cipher-Block-Chaining (CBC)
	function CBC(input, output) {
		var i = 0;
		if (encrypt) {
			for (i = 0; i < blockSizeByte; i++) temp[i] ^= input[i];
			ECB(temp, output);
			System.Buffer.BlockCopy(output, 0, temp, 0, blockSizeByte);
		} else {
			System.Buffer.BlockCopy(input, 0, temp2, 0, blockSizeByte);
			ECB(input, output);
			for (i = 0; i < blockSizeByte; i++) output[i] ^= temp[i];
			System.Buffer.BlockCopy(temp2, 0, temp, 0, blockSizeByte);
		}
		//Trace.Write("call CBC(input["+input.length+"] = "+System.BitConverter.ToString(input)+", output["+output.length+"] = "+System.BitConverter.ToString(output)+")");
	}
	//---------------------------------------------------------
	// Cipher-FeedBack (CFB)
	function CFB(input, output) {
		var x = 0;
		var i = 0;
		if (encrypt) {
			for (x = 0; x < feedBackIter; x++) {
				// temp is first initialized with the IV.
				ECB(temp, temp2);
				for (i = 0; i < feedBackByte; i++) {
					output[i + x] = temp2[i] ^ input[i + x];
				}
				System.Buffer.BlockCopy(temp, feedBackByte, temp, 0, blockSizeByte - feedBackByte);
				System.Buffer.BlockCopy(output, x, temp, blockSizeByte - feedBackByte, feedBackByte);
			}
		} else {
			for (x = 0; x < feedBackIter; x++) {
				// we do not really decrypt this data!
				encrypt = true;
				// temp is first initialized with the IV
				ECB(temp, temp2);
				encrypt = false;
				System.Buffer.BlockCopy(temp, feedBackByte, temp, 0, blockSizeByte - feedBackByte);
				System.Buffer.BlockCopy(input, x, temp, blockSizeByte - feedBackByte, feedBackByte);
				for (i = 0; i < feedBackByte; i++) {
					output[i + x] = temp2[i] ^ input[i + x];
				}
			}
		}
	}
	//---------------------------------------------------------
	// Output-FeedBack (OFB)
	function OFB(input, utput) {
		throw "OFB isn't supported";
	}
	//---------------------------------------------------------
	// Cipher Text Stealing (CTS)
	function CTS(input, output) {
		throw "CTS  isn't supported";
	}
	//---------------------------------------------------------
	function CheckInput(inputBuffer, inputOffset, inputCount) {
		if (!inputBuffer) throw "inputBuffer is can't be null";
		if (inputOffset < 0) throw "inputOffset is out of range";
		if (inputCount < 0) throw "inputCount is out of range";
		// ordered to avoid possible integer overflow.
		if (inputOffset > inputBuffer.length - inputCount) {
			throw "inputBuffer is out of range (overflow)";
		}
	}
	//---------------------------------------------------------
	this.TransformBlock = function (inputBuffer, inputOffset, inputCount, outputBuffer, outputOffset) {
		/// <summary>
		/// Transforms the specified region of the input byte array and copies the resulting
		/// transform to the specified region of the output byte array.
		/// </summary>
		/// <param name="inputBuffer">The input for which to compute the transform.</param>
		/// <param name="inputOffset">The offset into the input byte array from which to begin using data.</param>
		/// <param name="inputCount">The number of bytes in the input byte array to use as data.</param>
		/// <param name="outputBuffer">The output to which to write the transform.</param>
		/// <param name="outputOffset">The offset into the output byte array from which to begin writing data.</param>
		/// <returns>The number of bytes written.</returns>
		if (m_disposed)
			throw new System.ObjectDisposedException("Object is disposed.");
		//Trace.Write("call this.TransformBlock(inputBuffer["+inputBuffer.length+"], "+inputOffset+", "+inputCount+", outputBuffer["+outputBuffer.length+"], "+outputOffset+")");
		CheckInput(inputBuffer, inputOffset, inputCount);
		// check output parameters
		if (outputBuffer === null)
			throw new System.ArgumentNullException("outputBuffer");
		if (outputOffset < 0)
			throw new System.ArgumentOutOfRangeException("outputOffset", "< 0");
		// ordered to avoid possible integer overflow
		if (outputOffset > outputBuffer.length - inputCount)
			throw new System.ArgumentException("outputBuffer", "Overflow");
		return this._InternalTransformBlock(inputBuffer, inputOffset, inputCount, outputBuffer, outputOffset);
	};
	//---------------------------------------------------------
	function KeepLastBlock() {
		return !encrypt
			//&& (algo.Mode != System.Security.Cryptography.CipherMode.ECB)
			&& algo.Padding !== System.Security.Cryptography.PaddingMode.Zeros
			&& algo.Padding !== System.Security.Cryptography.PaddingMode.None;
	}
	//---------------------------------------------------------
	this._InternalTransformBlock = function (inputBuffer, inputOffset, inputCount, outputBuffer, outputOffset) {
		//Trace.Write("call _InternalTransformBlock(inputBuffer["+inputBuffer.length+"], "+inputOffset+", "+inputCount+", outputBuffer["+outputBuffer.length+"], "+outputOffset+")");
		var offs = inputOffset;
		var full = 0;
		// this way we don't do a modulo every time we're called
		// and we may save a division
		if (inputCount !== blockSizeByte) {
			if (inputCount % blockSizeByte !== 0) {
				throw new System.Security.Cryptography.CryptographicException("Invalid input block size.");
			}
			full = inputCount / blockSizeByte;
		} else {
			full = 1;
		}
		if (KeepLastBlock()) full--;
		var total = 0;
		if (lastBlock) {
			this._Transform(workBuff, workout);
			System.Buffer.BlockCopy(workout, 0, outputBuffer, outputOffset, blockSizeByte);
			outputOffset += blockSizeByte;
			total += blockSizeByte;
			lastBlock = false;
		}
		for (var i = 0; i < full; i++) {
			System.Buffer.BlockCopy(inputBuffer, offs, workBuff, 0, blockSizeByte);
			this._Transform(workBuff, workout);
			System.Buffer.BlockCopy(workout, 0, outputBuffer, outputOffset, blockSizeByte);
			offs += blockSizeByte;
			outputOffset += blockSizeByte;
			total += blockSizeByte;
		}
		if (KeepLastBlock()) {
			System.Buffer.BlockCopy(inputBuffer, offs, workBuff, 0, blockSizeByte);
			lastBlock = true;
		}
		return total;
	};
	//---------------------------------------------------------
	function Random(buffer, start, length, zeroBytes) {
		if (typeof _rng === "undefined") {
			_rng = new System.Security.Cryptography.RNGCryptoServiceProvider();
		}
		var random = new System.Byte(length);
		if (zeroBytes) {
			_rng.GetBytes(random);
		} else {
			_rng.GetNonZeroBytes(random);
		}
		System.Buffer.BlockCopy(random, 0, buffer, start, length);
	}
	//---------------------------------------------------------
	function ThrowBadPaddingException(padding, length, position) {
		var msg = "Bad " + padding + " padding.";
		if (length >= 0) msg += " Invalid length " + length + ".";
		if (position >= 0) msg += " Error found at position " + position + ".";
		throw new System.Security.Cryptography.CryptographicException(msg);
	}
	//---------------------------------------------------------
	this._Padding = function (inputBuffer, inputOffset, inputCount) {
		var rem = blockSizeByte - inputCount;
		var paddingSize = rem > 0 ? rem : blockSizeByte;
		var paddedInput = new System.Byte(paddingSize);
		var blocksCount = 1;
		var newBlock = [];
		var i = 0;
		// Fill padded Input.
		switch (algo.Padding) {
			case System.Security.Cryptography.PaddingMode.None:
				if (rem !== 0) {
					throw new System.Security.Cryptography.CryptographicException("Invalid block length");
				}
				break;
			case System.Security.Cryptography.PaddingMode.Zeros:
				// ... MM 00 00 00 00 00 00 00 (Message | Zero )
				for (i = 0; i < paddedInput.length; i++) {
					paddedInput[i] = 0;
				}
				if (rem === 0) blocksCount = 2;
				break;
			case System.Security.Cryptography.PaddingMode.ANSIX923:
				// ... MM 00 00 00 00 00 00 PL (Message | Zero | Padding Length)
				paddedInput[paddedInput.length - 1] = paddingSize;
				if (rem === 0) blocksCount = 2;
				break;
			case System.Security.Cryptography.PaddingMode.ISO10126:
				// ... MM RR RR RR RR RR RR PL (Message | Random | Padding Length)
				Random(paddedInput, 0, paddedInput.length - 1, true);
				paddedInput[paddedInput.length - 1] = paddingSize;
				if (rem === 0) blocksCount = 2;
				break;
			case System.Security.Cryptography.PaddingMode.PKCS7:
				// ... MM PL PL PL PL PL PL PL  (Message | Padding Length)
				for (i = 0; i < paddedInput.length; i++) {
					paddedInput[i] = paddingSize;
				}
				if (rem === 0) blocksCount = 2;
				break;
			case System.Security.Cryptography.PaddingMode.RsaEsPkcs:
				// ... MM 00 RR RR RR RR 02 00 (Message | 00 | Random Non Zero | 02 | 00)
				Random(paddedInput, 1, paddedInput.length - 2, false);
				paddedInput[0] = 0;
				paddedInput[paddedInput.length - 2] = 2;
				paddedInput[paddedInput.length - 1] = 0;
				if (rem === 0) blocksCount = 2;
				break;
			case System.Security.Cryptography.PaddingMode.RsaEsOaep:
				var oaep = new System.Security.Cryptography.PKCS1Padding();
				var mgf = new System.Security.Cryptography.PKCS1MaskGenerationMethod();
				var hash = new System.Security.Cryptography.SHA1CryptoServiceProvider();
				var rng = new System.Security.Cryptography.RNGCryptoServiceProvider();
				newBlock = oaep.RsaEsOaepEncrypt(algo, hash, mgf, rng, inputBuffer);
				break;
			default:
				break;
		}
		var iBuffer = new System.Byte(blockSizeByte * blocksCount);
		var oBuffer = new System.Byte(blockSizeByte * blocksCount);
		if (newBlock.length === 0) {
			// Copy data to temp input buffer.
			System.Buffer.BlockCopy(inputBuffer, inputOffset, iBuffer, 0, inputCount);
			// Copy padding to temp input buffer.
			if (rem > 0 || rem === 0 && blocksCount === 2) {
				System.Buffer.BlockCopy(paddedInput, 0, iBuffer, inputCount, paddingSize);
			}
		} else {
			System.Buffer.BlockCopy(newBlock, inputOffset, iBuffer, 0, inputCount + paddingSize);
		}
		var result = {};
		result["blocksCount"] = blocksCount;
		result["iBuffer"] = iBuffer;
		result["oBuffer"] = oBuffer;
		return result;
	};
	//---------------------------------------------------------
	function ConvertIntToByteArray(dwInput, counter) {
		var bytes = System.BitConverter.GetBytesFromInt32Be(dwInput);
		System.Buffer.BlockCopy(bytes, 0, counter, 0, bytes.length);
	}
	//---------------------------------------------------------
	this._PaddingRemove = function (res, inputOffset, inputCount) {
		// total may be 0 (e.g. PaddingMode.None)
		var total = res.length;
		var padding = 0;
		var newBlock = [];
		var i = 0;
		switch (algo.Padding) {
			case System.Security.Cryptography.PaddingMode.ANSIX923:
				padding = total > 0 ? res[total - 1] : 0;
				if (padding === 0 || padding > blockSizeByte) {
					System.Security.Cryptography.ThrowBadPaddingException(algo.Padding, padding, -1);
				}
				for (i = padding; i > 0; i--) {
					if (res[total - 1 - i] !== 0x00)
						System.Security.Cryptography.ThrowBadPaddingException(algo.Padding, -1, i);
				}
				total -= padding;
				break;
			case System.Security.Cryptography.PaddingMode.ISO10126:
				padding = total > 0 ? res[total - 1] : 0;
				if (padding === 0 || padding > blockSizeByte)
					System.Security.Cryptography.ThrowBadPaddingException(algo.Padding, padding, -1);
				total -= padding;
				break;
			case System.Security.Cryptography.PaddingMode.PKCS7:
				padding = total > 0 ? res[total - 1] : 0;
				if (padding === 0 || padding > blockSizeByte) {
					Trace.Write(padding + ", " + blockSizeByte);
					System.Security.Cryptography.ThrowBadPaddingException(algo.Padding, padding, -1);
				}
				for (i = padding - 1; i > 0; i--) {
					if (res[total - 1 - i] !== padding) {
						System.Security.Cryptography.ThrowBadPaddingException(algo.Padding, -1, i);
					}
				}
				total -= padding;
				break;
			case System.Security.Cryptography.PaddingMode.RsaEsPkcs:
				if (res[total - 1] !== 0x00)
					System.Security.Cryptography.ThrowBadPaddingException(algo.Padding, -1, total - 1);
				if (res[total - 2] !== 0x02)
					System.Security.Cryptography.ThrowBadPaddingException(algo.Padding, -1, total - 2);
				// Route trough block bytes.
				for (i = total - 1 - 2; i > 0; i--) {
					// If zero byte (message and padding separator) found then...
					if (res[i] === 0x00) {
						// Set message size.
						total = i;
						break;
					}
				}
				break;
			case System.Security.Cryptography.PaddingMode.RsaEsOaep:
				var oaep = new System.Security.Cryptography.PKCS1Padding();
				var mgf = new System.Security.Cryptography.PKCS1MaskGenerationMethod();
				var hash = new System.Security.Cryptography.SHA1CryptoServiceProvider();
				newBlock = oaep.RsaEsOaepDecrypt(algo, hash, mgf, res);
				return newBlock;
			case System.Security.Cryptography.PaddingMode.None: // nothing to do - it's a multiple of block size
			case System.Security.Cryptography.PaddingMode.Zeros: // nothing to do - user must unpad himself
				break;
		}
		// return output without padding
		if (total > 0) {
			var data = new System.Byte(total);
			System.Buffer.BlockCopy(res, 0, data, 0, total);
			// Zeroize decrypted data (copy with padding)
			System.Array.Clear(res, 0, res.length);
			return data;
		} else {
			return new System.Byte(0);
		}
	};
	//---------------------------------------------------------
	this._FinalEncrypt = function (inputBuffer, inputOffset, inputCount) {
		//Trace.Write("call FinalEncrypt(inputBuffer["+inputBuffer.length+"], inputOffset = "+inputOffset+", inputCount = "+inputCount);
		var result = this._Padding(inputBuffer, inputOffset, inputCount);
		var blocksCount = result.blocksCount;
		var iBuffer = result.iBuffer;
		var oBuffer = result.oBuffer;
		// Encrypt temp buffer.
		for (var i = 0; i < blocksCount; i++) {
			var offset = i * blockSizeByte;
			this._InternalTransformBlock(iBuffer, offset, blockSizeByte, oBuffer, offset);
		}
		return oBuffer;
	};
	//---------------------------------------------------------
	this._FinalDecrypt = function (inputBuffer, inputOffset, inputCount) {
		if (inputCount % blockSizeByte > 0) {
			throw new System.Security.Cryptography.CryptographicException("Invalid input block size.");
		}
		var total = inputCount;
		if (lastBlock) total += blockSizeByte;
		var res = new System.Byte(total);
		var outputOffset = 0;
		while (inputCount > 0) {
			var len = this._InternalTransformBlock(inputBuffer, inputOffset, blockSizeByte, res, outputOffset);
			inputOffset += blockSizeByte;
			outputOffset += len;
			inputCount -= blockSizeByte;
		}
		if (lastBlock) {
			this._Transform(workBuff, workout);
			System.Buffer.BlockCopy(workout, 0, res, outputOffset, blockSizeByte);
			outputOffset += blockSizeByte;
			lastBlock = false;
		}
		return this._PaddingRemove(res, inputOffset, inputCount);
	};
	//---------------------------------------------------------
	this.TransformFinalBlock = function (inputBuffer, inputOffset, inputCount) {
		/// <summary>
		/// Transforms the specified region of the specified byte array.
		/// </summary>
		/// <param name="inputBuffer">The input for which to compute the transform.</param>
		/// <param name="inputOffset">The offset into the byte array from which to begin using data.</param>
		/// <param name="inputCount">The number of bytes in the byte array to use as data.</param>
		/// <returns>The computed transform.</returns>		Trace.Write("call this.TransformFinalBlock(inputBuffer["+inputBuffer.length+"], "+inputOffset+", "+inputCount+")");
		if (m_disposed) throw new ObjectDisposedException("Object is disposed");
		CheckInput(inputBuffer, inputOffset, inputCount);
		if (encrypt) {
			return this._FinalEncrypt(inputBuffer, inputOffset, inputCount);
		} else {
			return this._FinalDecrypt(inputBuffer, inputOffset, inputCount);
		}
	};
	//---------------------------------------------------------
	this.Initialize = function (algorithm, encryption) {
		algo = algorithm;
		encrypt = encryption;
		if (algo) {
			blockSizeByte = algo.BlockSize >> 3;
			this.InputBlockSize = blockSizeByte;
			this.OutputBlockSize = blockSizeByte;
			// Mode buffers
			temp = new System.Byte(blockSizeByte);
			System.Buffer.BlockCopy(algo.IV, 0, temp, 0, Math.min(blockSizeByte, algo.IV.length));
			temp2 = new System.Byte(blockSizeByte);
			feedBackByte = algo.FeedbackSize >> 3;
			if (feedBackByte !== 0)
				feedBackIter = blockSizeByte / feedBackByte;
			// Transform buffers
			workBuff = new System.Byte(blockSizeByte);
			workout = new System.Byte(blockSizeByte);
		}
	};
	this.Initialize.apply(this, arguments);
};
System.Type.RegisterClass("System.Security.Cryptography.ICryptoTransform");

System.Security.Cryptography.RNGCryptoServiceProvider = function () {
	//---------------------------------------------------------
	// Private Properties.
	var rnd;
	//---------------------------------------------------------
	this.GetBytes = function (data) {
		/// <summary>
		/// Fills an array of bytes with a sequence of random values.
		/// </summary>
		/// <param name="inputBuffer">The array to fill with a sequence of random values.</param>
		var length = data.length;
		for (var i = 0; i < length; i++) {
			data[i] = rnd.Next(0, 256);
		}
	};
	//---------------------------------------------------------
	this.GetNonZeroBytes = function (data) {
		/// <summary>
		/// Fills an array of bytes with a sequence of random nonzero values.
		/// </summary>
		/// <param name="inputBuffer">The array to fill with a sequence of random nonzero values.</param>
		var length = data.length;
		for (var i = 0; i < length; i++) {
			data[i] = rnd.Next(1, 256);
		}
	};
	//---------------------------------------------------------
	this.Dispose = function () {
		m_disposed = true;
	};
	//---------------------------------------------------------
	this.Initialize = function () {
		rnd = new System.Random();
	};
	this.Initialize.apply(this, arguments);
};
System.Type.RegisterClass("System.Security.Cryptography.RNGCryptoServiceProvider");

//-----------------------------------------------------------------------------
// CryptoStream
//-----------------------------------------------------------------------------

System.Security.Cryptography.CryptoStream = function (stream, transform, mode) {
	/// <summary>
	/// Initializes a new instance of the System.Security.Cryptography.CryptoStream
	/// class with a target data stream, the transformation to use, and the mode
	/// of the stream.
	/// </summary>
	/// <param name="stream">The stream on which to perform the cryptographic transformation.</param>
	/// <param name="transform">The cryptographic transformation that is to be performed on the stream.</param>
	/// <param name="mode">One of the System.Security.Cryptography.CryptoStreamMode values.</param>
	/// <remarks>
	/// Ported to JavaScript Class:
	///	Evaldas Jocys (evaldas@jocys.com)
	/// Original code:
	/// http://www.koders.com/csharp/fid5A0E65C1F90484C7C61C3D7A0A9A1B6FA80F3691.aspx?s=CryptoStream
	///
	/// Authors:
	///	Thomas Neidhart (tome@sbox.tugraz.at)
	///	Sebastien Pouliot (sebastien@ximian.com)
	///
	/// Portions (C) 2002, 2003 Motus Technologies Inc. (http://www.motus.com)
	/// Copyright (C) 2004-2005 Novell, Inc (http://www.novell.com)
	///
	/// Permission is hereby granted, free of charge, to any person obtaining
	/// a copy of this software and associated documentation files (the
	/// "Software"), to deal in the Software without restriction, including
	/// without limitation the rights to use, copy, modify, merge, publish,
	/// distribute, sublicense, and/or sell copies of the Software, and to
	/// permit persons to whom the Software is furnished to do so, subject to
	/// the following conditions:
	/// 
	/// The above copyright notice and this permission notice shall be
	/// included in all copies or substantial portions of the Software.
	/// 
	/// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	/// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	/// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	/// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
	/// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
	/// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
	/// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	/// </remarks>
	//---------------------------------------------------------
	// Private Properties.
	var _stream;
	var _transform;
	var _mode;
	var _currentBlock = [];
	var _disposed = false;
	var _flushedFinalBlock = false;
	var _partialCount = 0;
	var _endOfStream = false;
	var _waitingBlock = [];
	var _waitingCount = 0;
	var _transformedBlock = [];
	var _transformedPos = 0;
	var _transformedCount = 0;
	var _workingBlock = [];
	var _workingCount = 0;
	//---------------------------------------------------------
	this.Read = function (buffer, offset, count) {
		var result = 0;
		if (count === 0 || _transformedPos === _transformedCount && _endOfStream) {
			return result;
		}
		if (_waitingBlock === null) {
			_transformedBlock = new System.Byte(_transform.OutputBlockSize << 2);
			_transformedPos = 0;
			_transformedCount = 0;
			_waitingBlock = new System.Byte(_transform.InputBlockSize);
			_waitingCount = _stream.Read(_waitingBlock, 0, _waitingBlock.length);
		}
		while (count > 0) {
			// transformed but not yet returned
			var length = _transformedCount - _transformedPos;
			// need more data - at least one full block must be available if we haven't reach the end of the stream
			if (length < _transform.InputBlockSize) {
				var transformed = 0;
				// load a new block
				_workingCount = _stream.Read(_workingBlock, 0, _workingBlock.length);
				_endOfStream = _workingCount < _transform.InputBlockSize;
				if (!_endOfStream) {
					// transform the waiting block
					transformed = _transform.TransformBlock(_waitingBlock, 0, _waitingBlock.length, _transformedBlock, _transformedCount);
					// transfer temporary to waiting
					System.Buffer.BlockCopy(_workingBlock, 0, _waitingBlock, 0, _workingCount);
					_waitingCount = _workingCount;
				} else {
					if (_workingCount > 0) {
						// transform the waiting block
						transformed = _transform.TransformBlock(_waitingBlock, 0, _waitingBlock.length, _transformedBlock, _transformedCount);
						// transfer temporary to waiting
						System.Buffer.BlockCopy(_workingBlock, 0, _waitingBlock, 0, _workingCount);
						_waitingCount = _workingCount;
						length += transformed;
						_transformedCount += transformed;
					}
					var input = _transform.TransformFinalBlock(_waitingBlock, 0, _waitingCount);
					transformed = input.length;
					System.Buffer.BlockCopy(input, 0, _transformedBlock, _transformedCount, input.length);
					// zeroize this last block
					System.Array.Clear(input, 0, input.length);
				}
				length += transformed;
				_transformedCount += transformed;
			}
			// compaction
			if (_transformedPos > _transform.InputBlockSize) {
				System.Buffer.BlockCopy(_transformedBlock, _transformedPos, _transformedBlock, 0, length);
				_transformedCount -= _transformedPos;
				_transformedPos = 0;
			}
			length = count < length ? count : length;
			if (length > 0) {
				System.Buffer.BlockCopy(_transformedBlock, _transformedPos, buffer, offset, length);
				_transformedPos += length;
				result += length;
				offset += length;
				count -= length;
			}
			// there may not be enough data in the stream for a 
			// complete block
			if (length !== _transform.InputBlockSize && _waitingCount !== _transform.InputBlockSize || _endOfStream) {
				count = 0; // no more data can be read
			}
		}
		return result;
	};
	//---------------------------------------------------------
	this.Write = function (buffer, offset, count) {
		//Trace.Write("call this.Write(bufer, "+offset+", "+count+")");
		// Partial block (in progress)
		if (_partialCount > 0 && _partialCount !== _transform.InputBlockSize) {
			//Trace.Write("Partial block (in progress)");
			var remainder = _transform.InputBlockSize - _partialCount;
			remainder = count < remainder ? count : remainder;
			System.Buffer.BlockCopy(buffer, offset, _workingBlock, _partialCount, remainder);
			_partialCount += remainder;
			offset += remainder;
			count -= remainder;
		}
		var bufferPos = offset;
		//Trace.Write("call bufferPos = "+bufferPos);
		//Trace.Write("aaa: "+System.BitConverter.ToString(buffer));
		var len = 0;
		while (count > 0) {
			if (_partialCount === _transform.InputBlockSize) {
				// use partial block to avoid (re)allocation
				//Trace.Write("_workingBlock: "+System.BitConverter.ToString(_workingBlock));
				//Trace.Write("_currentBlock: "+System.BitConverter.ToString(_currentBlock));
				//Trace.Write("_partialCount = "+_partialCount);
				len = _transform.TransformBlock(_workingBlock, 0, _partialCount, _currentBlock, 0);
				_stream.Write(_currentBlock, 0, len);
				// reset
				_partialCount = 0;
			}
			//Trace.Write("_partialCount = "+_partialCount+"; _transform.CanTransformMultipleBlocks = "+_transform.CanTransformMultipleBlocks);
			if (_transform.CanTransformMultipleBlocks) {
				// Transform all except the last block (which may be the last block
				// of the stream and require TransformFinalBlock.
				var numBlock = Math.floor((_partialCount + count) / _transform.InputBlockSize);
				var multiSize = numBlock * _transform.InputBlockSize;
				//Trace.Write("numBlock = "+numBlock+"; multiSize = "+multiSize);
				if (numBlock > 0) {
					var multiBlocks = new System.Byte(multiSize);
					len = _transform.TransformBlock(buffer, offset, multiSize, multiBlocks, 0);
					_stream.Write(multiBlocks, 0, len);
					// copy last block into _currentBlock
					_partialCount = count - multiSize;
					System.Buffer.BlockCopy(buffer, offset + multiSize, _workingBlock, 0, _partialCount);
				} else {
					System.Buffer.BlockCopy(buffer, offset, _workingBlock, _partialCount, count);
					_partialCount += count;
				}
				count = 0; // the last block, if any, is in _workingBlock
			} else {
				len = Math.min(_transform.InputBlockSize - _partialCount, count);
				System.Buffer.BlockCopy(buffer, bufferPos, _workingBlock, _partialCount, len);
				bufferPos += len;
				_partialCount += len;
				count -= len;
				// here block may be full, but we wont TransformBlock it until next iteration
				// so that the last block will be called in FlushFinalBlock using TransformFinalBlock
			}
		}
	};
	//---------------------------------------------------------
	this.Flush = function () {
		if (_stream !== null) _stream.Flush();
	};
	//---------------------------------------------------------
	this.FlushFinalBlock = function () {
		_flushedFinalBlock = true;
		var finalBuffer = _transform.TransformFinalBlock(_workingBlock, 0, _partialCount);
		if (_stream !== null) {
			_stream.Write(finalBuffer, 0, finalBuffer.length);
			if (_stream.GetType().FullName === "System.Security.Cryptography.CryptoStream") {
				// for cascading crypto streams.
				_stream.FlushFinalBlock();
			}
			_stream.Flush();
		}
		// Zeroize.
		System.Array.Clear(finalBuffer, 0, finalBuffer.length);
	};
	//---------------------------------------------------------
	this.ToArray = function () {
		return stream.ToArray();
	};
	//---------------------------------------------------------
	this.Close = function () {
		// only flush in write mode (bugzilla 46143)
		if (!_flushedFinalBlock && _mode === System.Security.Cryptography.CryptoStreamMode.Write) {
			this.FlushFinalBlock();
		}
		if (_stream !== null) _stream.Close();
	};
	//---------------------------------------------------------
	this.Dispose = function () {
		if (!_disposed) {
			_disposed = true;
			// always cleared for security reason
			if (_workingBlock !== null)
				System.Array.Clear(_workingBlock, 0, _workingBlock.length);
			if (_currentBlock !== null)
				System.Array.Clear(_currentBlock, 0, _currentBlock.length);
			if (disposing) {
				_stream = null;
				_workingBlock = null;
				_currentBlock = null;
			}
		}
	};
	//---------------------------------------------------------
	this.Initialize = function () {
		_stream = arguments[0];
		_transform = arguments[1];
		_mode = arguments[2];
		_disposed = false;
		if (_transform) {
			_workingBlock = new System.Byte(_transform.InputBlockSize);
			if (_mode === System.Security.Cryptography.CryptoStreamMode.Read) {
				_currentBlock = new System.Byte(_transform.InputBlockSize);
			} else if (_mode === System.Security.Cryptography.CryptoStreamMode.Write) {
				_currentBlock = new System.Byte(_transform.OutputBlockSize);
			}
		}
	};
	this.Initialize.apply(this, arguments);
};
System.Type.RegisterClass("System.Security.Cryptography.CryptoStream");


System.Security.Cryptography.HashAlgorithm = function () {
	// Properties
	this.CanReuseTransform = true;
	this.CanTransformMultipleBlocks = true;
	this.InputBlockSize = 1;
	this.OutputBlockSize = 1;

	this.HashSizeValue = 0;
	this.HashValue = new System.Byte();
	this.State = 0;
	this.HashSize = this.HashSizeValue;

	this._ComputeHash1 = function (buffer) {
		return this._ComputeHash2(buffer, 0, buffer.length);
	};

	this._ComputeHash2 = function (buffer, offset, count) {
		this.HashCore(buffer, offset, count);
		this.HashValue = this.HashFinal();
		var buffer2 = this.Hash();
		this.Initialize();
		return buffer2;
	};

	this.ComputeHash = function () {
		if (arguments.length === 1) {
			var value = arguments[0];
			if (typeof value === "string") value = System.Text.Encoding.UTF8.GetBytes(value);
			var args = new Array(0);
			args[0] = value;
			return this._ComputeHash1.apply(this, args);
		}
		if (arguments.length === 3) return this._ComputeHash2.apply(this, arguments);
	};

	this.HashCore = function (array, ibStart, cbSize) { };
	this.HashFinal = function () { };
	this.Initialize = function () { };

	this.TransformBlock = function (inputBuffer, inputOffset, inputCount, outputBuffer, outputOffset) {
		this.State = 1;
		this.HashCore(inputBuffer, inputOffset, inputCount);
		if (outputBuffer !== null && (inputBuffer !== outputBuffer || inputOffset !== outputOffset)) {
			System.Buffer.BlockCopy(inputBuffer, inputOffset, outputBuffer, outputOffset, inputCount);
		}
		return inputCount;
	};

	this.TransformFinalBlock = function (inputBuffer, inputOffset, inputCount) {
		this.HashCore(inputBuffer, inputOffset, inputCount);
		this.HashValue = this.HashFinal();
		var dst = new System.Byte(inputCount);
		if (inputCount !== 0) {
			System.Buffer.BlockCopy(inputBuffer, inputOffset, dst, 0, inputCount);
		}
		this.State = 0;
		return dst;
	};

	this.Hash = function () {
		return this.HashValue.Clone();
	};

};
System.Type.RegisterClass("System.Security.Cryptography.HashAlgorithm");

// Add some static methods
System.Security.Cryptography.HashAlgorithm.Create = function (hashName) {
	return new System.Security.Cryptography[hashName]();
};

System.Security.Cryptography.PKCS1MaskGenerationMethod = function () {
	function ConvertIntToByteArray(dwInput, counter) {
		var bytes = System.BitConverter.GetBytesFromInt32Be(dwInput);
		System.Buffer.BlockCopy(bytes, 0, counter, 0, bytes.length);
	}
	this.GenerateMask = function (rgbSeed, cbReturn) {
		var algorithm = new System.Security.Cryptography.SHA1CryptoServiceProvider();
		var counter = new System.Byte(4);
		var dst = new System.Byte(cbReturn);
		var num = 0;
		var hLen = 20; // SHA-1
		for (var i = 0; i < dst.length; i += hLen) {
			ConvertIntToByteArray(num++, counter);
			algorithm.TransformBlock(rgbSeed, 0, rgbSeed.length, rgbSeed, 0);
			algorithm.TransformFinalBlock(counter, 0, 4);
			var hash = algorithm.HashValue;
			algorithm.Initialize();
			if (dst.Length - i > hash.length) {
				System.Buffer.BlockCopy(hash, 0, dst, i, hash.length);
			} else {
				System.Buffer.BlockCopy(hash, 0, dst, i, dst.length - i);
			}
		}
		return dst;
	};
};
System.Type.RegisterClass("System.Security.Cryptography.PKCS1MaskGenerationMethod");

System.Security.Cryptography.PKCS1Padding = function () {

	this.RsaEsOaepEncrypt = function (rsa, hash, mgf, rng, encryptedData) {
		/// <summary>
		/// PKCS #1 v2.1 OAEP padding encryption.
		/// </summary>
		/// <param name="key" type="byte[]">RSA public key.</param>
		/// <param name="message" type="byte[]">Message bytes to be encrypted.</param>
		/// <param name="label" type="string">Optional label to be associated with the message; the default value is the empty string</param>
		/// <returns type="byte[]">Padded message.</returns>
		/// <remarks>ftp://ftp.rsasecurity.com/pub/pkcs/pkcs-1/pkcs-1v2-1.pdf</remnarks>
		var key = rsa.ExportParameters(false);
		var message = encryptedData.Clone();
		// Reverse for Microsoft compatibility.
		System.Array.Reverse(message);
		var label = "";
		var lBytes = System.Text.Encoding.UTF8.GetBytes(label);
		var hLen = hash.HashSize / 8;
		var mLen = message.length;
		var kLen = key.Modulus.length;
		var lHash = hash.ComputeHash(lBytes);
		var pLen = kLen - mLen - 2 * hLen - 2;
		var PS = new Array(pLen);
		var i = 0;
		for (i = 0; i < PS.length; i++) PS[i] = 0x00;
		var DB = new Array(hLen + PS.length + 1 + mLen);
		// DB = lHash || PS || 0x01 || M
		System.Buffer.BlockCopy(lHash, 0, DB, 0, hLen);
		System.Buffer.BlockCopy(PS, 0, DB, hLen, PS.length);
		DB[hLen + PS.length] = 0x01;
		System.Buffer.BlockCopy(message, 0, DB, hLen + PS.length + 1, mLen);
		var seed = new Array(hLen);
		rng.GetBytes(seed);
		// Use Microsoft's method to generate mask.
		var dbMask = mgf.GenerateMask(seed, kLen - hLen - 1);
		var maskedDB = new Array(DB.length);
		for (i = 0; i < DB.length; i++) maskedDB[i] = DB[i] ^ dbMask[i];
		// Use Microsoft's method to generate mask.
		var seedMask = mgf.GenerateMask(maskedDB, hLen);
		var maskedSeed = new Array(seed.length);
		for (i = 0; i < seed.length; i++) maskedSeed[i] = seed[i] ^ seedMask[i];
		var EM = new Array(1 + maskedSeed.length + maskedDB.length);
		// EM = 0x00 || maskedSeed || maskedDB
		EM[0] = 0x00;
		System.Buffer.BlockCopy(maskedSeed, 0, EM, 1, maskedSeed.length);
		System.Buffer.BlockCopy(maskedDB, 0, EM, 1 + maskedSeed.length, maskedDB.length);
		// Reverse for Microsoft compatibility.
		System.Array.Reverse(EM);
		return EM;
	};
	//---------------------------------------------------------
	this.RsaEsOaepDecrypt = function (rsa, hash, mgf, data) {
		/// <summary>
		/// PKCS #1 v2.1 OAEP padding decryption.
		/// </summary>
		/// <param name="key" type="byte[]">RSA private key.</param>
		/// <param name="message" type="byte[]">Padded message bytes.</param>
		/// <param name="label" type="string">Optional label to be associated with the message; the default value is the empty string</param>
		/// <returns type="byte[]">Unpadded message.</returns>
		/// <remarks>ftp://ftp.rsasecurity.com/pub/pkcs/pkcs-1/pkcs-1v2-1.pdf</remnarks>
		var key = rsa.ExportParameters(true);
		var pMessage = data;
		var label = "";
		var EM = new Array(pMessage.length);
		System.Buffer.BlockCopy(pMessage, 0, EM, 0, pMessage.length);
		// Reverse for Microsoft compatibility.
		System.Array.Reverse(EM);
		var hLen = hash.HashSize / 8;
		var kLen = key.Modulus.length;
		var maskedSeed = EM.slice(1, hLen + 1);
		var maskedDB = EM.slice(hLen + 1, kLen);
		// Use Microsoft's method to generate mask.
		var seedMask = mgf.GenerateMask(maskedDB, hLen);
		var seed = new Array(hLen);
		var i = 0;
		for (i = 0; i < hLen; i++) seed[i] = maskedSeed[i] ^ seedMask[i];
		// Use Microsoft's method to generate mask.
		var dbMask = mgf.GenerateMask(seed, kLen - hLen - 1);
		var DB = new Array(dbMask.length);
		for (i = 0; i < DB.length; i++) DB[i] = maskedDB[i] ^ dbMask[i];
		// DB = lHash || PS || 0x01 || M
		// Get message.
		var message = [];
		for (i = hLen; i < kLen; i++) {
			if (DB[i] === 0x01) {
				message = DB.slice(i + 1, DB.length);
				break;
			}
		}
		// Reverse for Microsoft compatibility.
		System.Array.Reverse(message);
		return message;
	};

};
System.Type.RegisterClass("System.Security.Cryptography.PKCS1Padding");

System.Security.Cryptography.Utils = function () { };

System.Type.RegisterClass("System.Security.Cryptography.Utils");

System.Security.Cryptography.Utils.RsaOaepDecrypt = function (rsa, hash, mgf, encryptedData) { };

System.Security.Cryptography.Utils.PKCS1Padding = System.Security.Cryptography.PKCS1Padding.prototype.RsaPkcs1Padding;

System.Security.Cryptography.Utils.RotateLeft = function (num, cnt) {
	/// <summary>
	/// Bitwise rotate a 32-bit number to the left.
	/// </summary>
	return num << cnt | num >>> 32 - cnt;
};

System.Security.Cryptography.Utils.RotateRight = function (num, cnt) {
	/// <summary>
	/// Bitwise rotate a 32-bit number to the right.
	/// </summary>
	return num >>> cnt | num << 32 - cnt;
};

System.Security.Cryptography.Utils.DWORDToBigEndian = function (block, x, digits) {
	var index = 0;
	for (var i = 0; index < digits; i += 4) {
		block[i] = x[index] >> 0x18 & 0xff;
		block[i + 1] = x[index] >> 0x10 & 0xff;
		block[i + 2] = x[index] >> 8 & 0xff;
		block[i + 3] = x[index] & 0xff;
		index++;
	}
};

System.Security.Cryptography.Utils.DWORDFromBigEndian = function (x, digits, block) {
	var index = 0;
	for (var i = 0; index < digits; i += 4) {
		var n = block[i] << 24 | block[i + 1] << 16 | block[i + 2] << 8 | block[i + 3];
		x[index] = n >>> 0;
		index++;
	}
};

//-----------------------------------------------------------------------------
// CipherMode
//-----------------------------------------------------------------------------

System.Security.Cryptography.CipherMode = function () {
	/// <summary>Specifies the block cipher mode to use for encryption.</summary>
	/// <field name="CBC" type="Number">The Cipher Block Chaining (CBC) mode introduces feedback. Before each plain text block is encrypted, it is combined with the cipher text of the previous block by a bitwise exclusive OR operation. This ensures that even if the plain text contains many identical blocks, they will each encrypt to a different cipher text block. The initialization vector is combined with the first plain text block by a bitwise exclusive OR operation before the block is encrypted. If a single bit of the cipher text block is mangled, the corresponding plain text block will also be mangled. In addition, a bit in the subsequent block, in the same position as the original mangled bit, will be mangled.</field>
	/// <field name="ECB" type="Number">The Cipher Feedback (CFB) mode processes small increments of plain text into cipher text, instead of processing an entire block at a time. This mode uses a shift register that is one block in length and is divided into sections. For example, if the block size is eight bytes, with one byte processed at a time, the shift register is divided into eight sections. If a bit in the cipher text is mangled, one plain text bit is mangled and the shift register is corrupted. This results in the next several plain text increments being mangled until the bad bit is shifted out of the shift register.</field>
	/// <field name="OFB" type="Number">The Cipher Text Stealing (CTS) mode handles any length of plain text and produces cipher text whose length matches the plain text length. This mode behaves like the CBC mode for all but the last two blocks of the plain text.</field>
	/// <field name="CFB" type="Number">The Electronic Codebook (ECB) mode encrypts each block individually. This means that any blocks of plain text that are identical and are in the same message, or in a different message encrypted with the same key, will be transformed into identical cipher text blocks. If the plain text to be encrypted contains substantial repetition, it is feasible for the cipher text to be broken one block at a time. Also, it is possible for an active adversary to substitute and exchange individual blocks without detection. If a single bit of the cipher text block is mangled, the entire corresponding plain text block will also be mangled.</field>
	/// <field name="CTS" type="Number">The Output Feedback (OFB) mode processes small increments of plain text into cipher text instead of processing an entire block at a time. This mode is similar to CFB; the only difference between the two modes is the way that the shift register is filled. If a bit in the cipher text is mangled, the corresponding bit of plain text will be mangled. However, if there are extra or missing bits from the cipher text, the plain text will be mangled from that point on.</field>
};
System.Security.Cryptography.CipherMode.prototype = {
	CBC: 1,
	ECB: 2,
	OFB: 3,
	CFB: 4,
	CTS: 5
};
System.Type.RegisterEnum("System.Security.Cryptography.CipherMode");

//-----------------------------------------------------------------------------
// PaddingMode
//-----------------------------------------------------------------------------

System.Security.Cryptography.PaddingMode = function () {
	/// <summary>Specifies the type of padding to apply when the message data block is shorter than the full number of bytes needed for a cryptographic operation.</summary>
	/// <field name="ANSIX923" type="Number">The ANSIX923 padding string consists of a sequence of bytes filled with zeros before the length.</field>
	/// <field name="ISO10126" type="Number">The ISO10126 padding string consists of random data before the length.</field>
	/// <field name="None" type="Number">No padding is done.</field>
	/// <field name="PKCS7" type="Number">The PKCS #7 padding string consists of a sequence of bytes, each of which is equal to the total number of padding bytes added.</field>
	/// <field name="Zeros" type="Number">The padding string consists of bytes set to zero.</field>
	/// <field name="RsaEsPkcs" type="Number">PKCS#1 v1.5 padding - Old encryption/decryption scheme as first standardized in version 1.5 of PKCS#1.</field>
	/// <field name="RsaEsOaep" type="Number">Improved encryption/decryption scheme; based on the Optimal Asymmetric Encryption Padding scheme proposed by Mihir Bellare and Phillip Rogaway.</field>
};

System.Security.Cryptography.PaddingMode.prototype = {
	None: 1,
	PKCS7: 2,
	Zeros: 3,
	ANSIX923: 4,
	ISO10126: 5,
	RsaEsPkcs: 6,
	RsaEsOaep: 7
};
System.Type.RegisterEnum("System.Security.Cryptography.PaddingMode");

//-----------------------------------------------------------------------------
// CryptoStreamMode
//-----------------------------------------------------------------------------

System.Security.Cryptography.CryptoStreamMode = function () {
	/// <summary>Specifies the mode of a cryptographic stream.</summary>
	/// <field name="Read" type="Number">Read access to a cryptographic stream.</field>
	/// <field name="Write" type="Number">Write access to a cryptographic stream.</field>
};

System.Security.Cryptography.CryptoStreamMode.prototype = {
	Read: 0,
	Write: 1
};
System.Type.RegisterEnum("System.Security.Cryptography.CryptoStreamMode");

//==============================================================================
// END
//------------------------------------------------------------------------------
