//=============================================================================
// Jocys.com JavaScript.NET Classes               (In C# Object Oriented Style)
// Created by Evaldas Jocys <evaldas@jocys.com>
//=============================================================================
/// <reference path="System.debug.js" />
/// <reference path="System.IO.debug.js" />
/// <reference path="System.Text.debug.js" />
//=============================================================================
// Namespaces
//-----------------------------------------------------------------------------
// <PropertyGroup>
//		<RootNamespace>System.IO</RootNamespace>
// <PropertyGroup>
//-----------------------------------------------------------------------------

System.IO = System.IO ? System.IO : {};
System.Type.RegisterNamespace("System.IO");

//=============================================================================
// CLASS: BinaryReader
//-----------------------------------------------------------------------------

System.IO.BinaryReader = function (input) {
	this.Stream = new System.IO.Stream(input);
	this.Encoding = new System.Text.UTF8Encoder();
	var me = this;
	var m_buffer = [];
	//---------------------------------------------------------
	this.Close = function () {
		this.Stream.Close();
	};
	//---------------------------------------------------------
	this.Dispose = function () {
		this.Stream.Dispose();
	};
	//---------------------------------------------------------
	this.Dispose = function () {
		this.Stream.Dispose();
	};
	//---------------------------------------------------------
	this.PeekChar = function () {
		throw new System.Exception("NotImplementedException");
	};
	//---------------------------------------------------------
	this.PeekChar = function () {
		// Involves characters with encoding.
		throw new System.Exception("NotImplementedException");
	};
	//---------------------------------------------------------
	this._Read1 = function () {
		// Involves characters with encoding.
		throw new System.Exception("NotImplementedException");
	};
	//---------------------------------------------------------
	this._Read2 = function (buffer, index, count) {
		/// <summary>
		/// Reads the specified number of bytes from the stream, starting from a specified
		///  point in the byte array.
		/// </summary>
		this.Stream.Read(buffer, index, count);
	};
	//---------------------------------------------------------
	this.Read = function () {
		if (arguments.length === 1)
			return this._Read1(arguments);
		else if (arguments.length === 3)
			return this._Read2(arguments);
	};
	//---------------------------------------------------------
	this.ReadBoolean = function () {
		this.FillBuffer(1);
		return System.BitConverter.ToBoolean(m_buffer);
	};
	//---------------------------------------------------------
	this.ReadByte = function () {
		this.FillBuffer(1);
		return m_buffer[0];
	};
	//---------------------------------------------------------
	this.ReadBytes = function (count) {
		this.FillBuffer(count);
		var bytes = new Array(count);
		System.Array.Copy(m_buffer, bytes, count);
		return bytes;
	};
	//---------------------------------------------------------
	this.ReadDecimal = function () {
		this.FillBuffer(8);
		return System.BitConverter.ToDouble(m_buffer);
	};
	//---------------------------------------------------------
	this.ReadDouble = function () {
		this.FillBuffer(8);
		return System.BitConverter.ToDouble(m_buffer);
	};
	//---------------------------------------------------------
	this.ReadInt16 = function () {
		this.FillBuffer(2);
		return System.BitConverter.ToInt16(m_buffer);
	};
	//---------------------------------------------------------
	this.ReadInt32 = function () {
		this.FillBuffer(4);
		return System.BitConverter.ToInt32(m_buffer);
	};
	//---------------------------------------------------------
	this.ReadInt64 = function () {
		this.FillBuffer(8);
		return System.BitConverter.ToInt64(m_buffer);
	};
	//---------------------------------------------------------
	this.ReadSByte = function () {
		this.FillBuffer(1);
		var sbyte = System.BitConverter.GetSigned(m_buffer[0], System.TypeCode.Byte);
		return sbyte;
	};
	//---------------------------------------------------------
	this.ReadSingle = function () {
		this.FillBuffer(4);
		return System.BitConverter.ToSingle(m_buffer);
	};
	//---------------------------------------------------------
	this.ReadString = function () {
		// Length of the string in bytes, not chars.
		var stringLength = Read7BitEncodedInt();
		if (stringLength < 0)
			throw new Exception("Invalid string length (7-bit encoded integer)!");
		if (stringLength === 0)
			return "";
		this.FillBuffer(stringLength);
		return this.Encoding.GetString(m_buffer);
	};
	//---------------------------------------------------------
	this.ReadUInt16 = function () {
		this.FillBuffer(2);
		return System.BitConverter.ToUInt16(m_buffer);
	};
	//---------------------------------------------------------
	this.ReadUInt32 = function () {
		this.FillBuffer(4);
		return System.BitConverter.ToUInt32(m_buffer);
	};
	//---------------------------------------------------------
	this.ReadUInt64 = function () {
		this.FillBuffer(8);
		return System.BitConverter.ToUInt64(m_buffer);
	};
	//---------------------------------------------------------
	this.FillBuffer = function (numBytes) {
		/// <summary>Fills the internal buffer with the specified number of bytes read from the stream.</summary>
		m_buffer = new System.Byte(numBytes);
		this.Stream.Read(m_buffer, 0, numBytes);
	};
	//---------------------------------------------------------
	/// <summary>
	/// Read an Int32, 7 bits at a time.
	/// </summary>
	function Read7BitEncodedInt() {
		var value = 0;
		var b = 0;
		var i = 0;
		do {
			// Read byte.
			b = me.ReadByte();
			// if end of stream and no more bytes to read then...
			if (b === -1)
				throw new Exception("7-bit Decoder Error: Number is too large.");
			if (i === 4 && b > 0xF)
				throw new Exception("7-bit Decoder Error: Number is too large.");
			// Add 7 bit value
			v |= (b & 0x7F) << 7 * i;
			i++;
		}
		// Continue if first bit is 1.
		while (b >> 7 === 1);
		return value;
	}
	//---------------------------------------------------------
	this.Initialize = function () {
		if (typeof arguments[0] !== "undefined")
			this.Stream = arguments[0];
		if (typeof arguments[1] !== "undefined")
			this.Encoding = arguments[1];
	};
	this.Initialize.apply(this, arguments);
};
System.Type.RegisterClass("System.IO.BinaryReader");

//=============================================================================
// CLASS: BinaryReader
//-----------------------------------------------------------------------------

System.IO.BinaryWriter = function (input) {
	this.Stream = new System.IO.Stream(input);
	this.Encoding = new System.Text.UTF8Encoder();
	var me = this;
	var m_buffer = [];
	//---------------------------------------------------------
	this.Close = function () {
		this.Stream.Close();
	};
	//---------------------------------------------------------
	this.Dispose = function () {
		this.Stream.Dispose();
	};
	//---------------------------------------------------------
	this.Dispose = function () {
		this.Stream.Dispose();
	};
	//---------------------------------------------------------
	this.Write = function (value, typeCode) {
		if (typeof typeCode === "undefined") {
			switch (typeof value) {
				case "string": typeCode = System.TypeCode.String; break;
				default: throw new Exception("Unknown Type");
			}
		}
		var bytes = [];
		if (typeCode === System.TypeCode.String) {
			bytes = this.Encoding.GetBytes(value);
			// Length of the string in bytes, not chars.
			Write7BitEncodedInt(bytes.length);
		} else {
			bytes = System.BitConverter.GetBytes(i32, System.TypeCode.Int32);
		}
		this.Stream.Write(bytes, 0, bytes.length);
	};
	//---------------------------------------------------------
	this.Flush = function () {
	};
	//---------------------------------------------------------
	/// <summary>
	/// Write an Int32, 7 bits at a time.
	/// </summary>
	/// <param name="value"></param>
	function Write7BitEncodedInt(value) {
		// Support negative numbers.
		var v = value;
		var b = 0;
		do {
			// Store 7 bits.
			b = v & 0x7F;
			// Shift by 7 bits.
			v >>= 7;
			// If more bits left then...
			if (v > 0)
				// set first bit to 1.
				b |= 0x80;
			me.Stream.Write([b], 0, 1);
		}
		// Continue if more bits left.
		while (v > 0);
	}
	//---------------------------------------------------------
	this.Initialize = function () {
		if (typeof arguments[0] !== "undefined")
			this.Stream = arguments[0];
		if (typeof arguments[1] !== "undefined")
			this.Encoding = arguments[1];
	};
	this.Initialize.apply(this, arguments);
};
System.Type.RegisterClass("System.IO.BinaryWriter");

//==============================================================================
// END
//------------------------------------------------------------------------------
