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
/// <reference path="System.IO.debug.js" />
//=============================================================================
// Namespaces
//-----------------------------------------------------------------------------
// <PropertyGroup>
//		<RootNamespace>System.IO.Compression</RootNamespace>
// <PropertyGroup>
//-----------------------------------------------------------------------------

// RFC 1951 raw deflate/inflate for JavaScript
// https://github.com/dankogai/js-deflate

// UNFINISHED! UNFINISHED! UNFINISHED!     UNFINISHED! UNFINISHED! UNFINISHED!
// NOTE: System.IO.Compression classes are UNFINISHED! UNFINISHED! UNFINISHED!
// UNFINISHED! UNFINISHED! UNFINISHED!     UNFINISHED! UNFINISHED! UNFINISHED!

System.Type.RegisterNamespace("System.IO.Compression");

//=============================================================================
// ENUM: System.IO.Compression.CompressionMode
//-----------------------------------------------------------------------------

System.IO.Compression.CompressionMode = function () {
	/// <summary>Specifies whether to compress or decompress the underlying stream.</summary>
	/// <field name="Decompress" type="Number">Decompresses the underlying stream</field>
	/// <field name="Compress" type="Number">Compresses the underlying stream.</field>
};

System.IO.Compression.CompressionMode.prototype = {
	Decompress: 0,
	Compress: 1
};

System.Type.RegisterEnum("System.IO.Compression.CompressionMode");

//=============================================================================
// ENUM: System.IO.Compression.DeflaterState
//-----------------------------------------------------------------------------

System.IO.Compression.DeflaterState = function () {
	/// <summary></summary>
	/// <field name="NotStarted" type="Number"></field>
	/// <field name="SlowDownForIncompressible1" type="Number"></field>
	/// <field name="SlowDownForIncompressible2" type="Number"></field>
	/// <field name="StartingSmallData" type="Number"></field>
	/// <field name="CompressThenCheck" type="Number"></field>
	/// <field name="CheckingForIncompressible" type="Number"></field>
	/// <field name="HandlingSmallData" type="Number"></field>
};

System.IO.Compression.DeflaterState.prototype = {
	NotStarted: 0,
	SlowDownForIncompressible1: 1,
	SlowDownForIncompressible2: 2,
	StartingSmallData: 3,
	CompressThenCheck: 4,
	CheckingForIncompressible: 5,
	HandlingSmallData: 6
};
System.Type.RegisterEnum("System.IO.Compression.DeflaterState");


//=============================================================================
// ENUM: System.IO.Compression.MatchState
//-----------------------------------------------------------------------------

System.IO.Compression.MatchState = function () {
	/// <summary></summary>
	/// <field name="HasMatch" type="Number"></field>
	/// <field name="HasSymbol" type="Number"></field>
	/// <field name="HasSymbolAndMatch" type="Number"></field>
};

System.IO.Compression.MatchState.prototype = {
	HasMatch: 2,
	HasSymbol: 1,
	HasSymbolAndMatch: 3
};
System.Type.RegisterEnum("System.IO.Compression.MatchState");

//=============================================================================
// ENUM: System.IO.Compression.BlockType
//-----------------------------------------------------------------------------

System.IO.Compression.BlockType = function () {
	/// <summary></summary>
	/// <field name="Uncompressed" type="Number"></field>
	/// <field name="Static" type="Number"></field>
	/// <field name="Dynamic" type="Number"></field>
};

System.IO.Compression.BlockType.prototype = {
	Uncompressed: 0,
	Static: 1,
	Dynamic: 2
};
System.Type.RegisterEnum("System.IO.Compression.BlockType");

//=============================================================================
// ENUM: System.IO.Compression.InflaterState
//-----------------------------------------------------------------------------

System.IO.Compression.InflaterState = function () {
	/// <summary></summary>
	//<field name="DecodeTop" type="Number"></field>
	//<field name="DecodingUncompressed" type="Number"></field>
	//<field name="Done" type="Number"></field>
	//<field name="HaveDistCode" type="Number"></field>
	//<field name="HaveFullLength" type="Number"></field>
	//<field name="HaveInitialLength" type="Number"></field>
	//<field name="ReadingBFinal" type="Number"></field>
	//<field name="ReadingBType" type="Number"></field>
	//<field name="ReadingCodeLengthCodes" type="Number"></field>
	//<field name="ReadingFooter" type="Number"></field>
	//<field name="ReadingHeader" type="Number"></field>
	//<field name="ReadingNumCodeLengthCodes" type="Number"></field>
	//<field name="ReadingNumDistCodes" type="Number"></field>
	//<field name="ReadingNumLitCodes" type="Number"></field>
	//<field name="ReadingTreeCodesAfter" type="Number"></field>
	//<field name="ReadingTreeCodesBefore" type="Number"></field>
	//<field name="StartReadingFooter" type="Number"></field>
	//<field name="UncompressedAligning" type="Number"></field>
	//<field name="UncompressedByte1" type="Number"></field>
	//<field name="UncompressedByte2" type="Number"></field>
	//<field name="UncompressedByte3" type="Number"></field>
	//<field name="UncompressedByte4" type="Number"></field>
	//<field name="VerifyingFooter" type="Number"></field>
};

System.IO.Compression.InflaterState.prototype = {
	DecodeTop: 10,
	DecodingUncompressed: 20,
	Done: 0x18,
	HaveDistCode: 13,
	HaveFullLength: 12,
	HaveInitialLength: 11,
	ReadingBFinal: 2,
	ReadingBType: 3,
	ReadingCodeLengthCodes: 7,
	ReadingFooter: 0x16,
	ReadingHeader: 0,
	ReadingNumCodeLengthCodes: 6,
	ReadingNumDistCodes: 5,
	ReadingNumLitCodes: 4,
	ReadingTreeCodesAfter: 9,
	ReadingTreeCodesBefore: 8,
	StartReadingFooter: 0x15,
	UncompressedAligning: 15,
	UncompressedByte1: 0x10,
	UncompressedByte2: 0x11,
	UncompressedByte3: 0x12,
	UncompressedByte4: 0x13,
	VerifyingFooter: 0x17
};
System.Type.RegisterEnum("System.IO.Compression.InflaterState");

//=============================================================================
// Class: System.IO.Compression.InputState
//-----------------------------------------------------------------------------

System.IO.Compression.InputState = function () {
	this.count = 0;
	this.startIndex = 0;
};

//=============================================================================
// CLASS: System.IO.Compression.Match
//-----------------------------------------------------------------------------

System.IO.Compression.Match = function () {
	this.Length = 0;
	this.Position = 0;
	this.State = 0; //System.IO.Compression.MatchState
	this.Symbol = 0x00;
};

//=============================================================================
// CLASS: System.IO.Compression.DeflateInput
//-----------------------------------------------------------------------------

System.IO.Compression.DeflateInput = function () {
	this.Buffer = null;
	this.Count = 0;
	this.StartIndex = 0;
	//---------------------------------------------------------
	this.ConsumeBytes = function (n) {
		this.StartIndex += n;
		this.Count -= n;
	};
	//---------------------------------------------------------
	this.DumpState = function () {
		var state = new System.IO.Compression.InputState();
		state.count = this.Count;
		state.startIndex = this.StartIndex;
		return state;
	};
	//---------------------------------------------------------
	this.RestoreState = function (state) {
		this.Count = state.count;
		this.StartIndex = state.startIndex;
	};
};

//=============================================================================
// INTERFACE: System.IO.Compression.IFileFormatWriter
//=============================================================================
System.IO.Compression.IFileFormatWriter = {
	GetFooter: function () { }, // byte[]
	GetHeader: function () { }, // byte[]
	UpdateWithBytesRead: function (buffer, offset, bytesToCopy) { } //byte[] buffer, int offset, int bytesToCopy
};
System.Type.RegisterInterface("System.IO.Compression.IFileFormatWriter");

//=============================================================================

System.IO.Compression.Crc32Helper = function () { };
System.Type.RegisterInterface("System.IO.Compression.Crc32Helper");

System.IO.Compression.Crc32Helper.crcTable = [
	0x00000000, 0x77073096, 0xee0e612c, 0x990951ba, 0x076dc419, 0x706af48f, 0xe963a535, 0x9e6495a3, 0x0edb8832, 0x79dcb8a4, 0xe0d5e91e, 0x97d2d988, 0x09b64c2b, 0x7eb17cbd, 0xe7b82d07, 0x90bf1d91,
	0x1db71064, 0x6ab020f2, 0xf3b97148, 0x84be41de, 0x1adad47d, 0x6ddde4eb, 0xf4d4b551, 0x83d385c7, 0x136c9856, 0x646ba8c0, 0xfd62f97a, 0x8a65c9ec, 0x14015c4f, 0x63066cd9, 0xfa0f3d63, 0x8d080df5,
	0x3b6e20c8, 0x4c69105e, 0xd56041e4, 0xa2677172, 0x3c03e4d1, 0x4b04d447, 0xd20d85fd, 0xa50ab56b, 0x35b5a8fa, 0x42b2986c, 0xdbbbc9d6, 0xacbcf940, 0x32d86ce3, 0x45df5c75, 0xdcd60dcf, 0xabd13d59,
	0x26d930ac, 0x51de003a, 0xc8d75180, 0xbfd06116, 0x21b4f4b5, 0x56b3c423, 0xcfba9599, 0xb8bda50f, 0x2802b89e, 0x5f058808, 0xc60cd9b2, 0xb10be924, 0x2f6f7c87, 0x58684c11, 0xc1611dab, 0xb6662d3d,
	0x76dc4190, 0x01db7106, 0x98d220bc, 0xefd5102a, 0x71b18589, 0x06b6b51f, 0x9fbfe4a5, 0xe8b8d433, 0x7807c9a2, 0x0f00f934, 0x9609a88e, 0xe10e9818, 0x7f6a0dbb, 0x086d3d2d, 0x91646c97, 0xe6635c01,
	0x6b6b51f4, 0x1c6c6162, 0x856530d8, 0xf262004e, 0x6c0695ed, 0x1b01a57b, 0x8208f4c1, 0xf50fc457, 0x65b0d9c6, 0x12b7e950, 0x8bbeb8ea, 0xfcb9887c, 0x62dd1ddf, 0x15da2d49, 0x8cd37cf3, 0xfbd44c65,
	0x4db26158, 0x3ab551ce, 0xa3bc0074, 0xd4bb30e2, 0x4adfa541, 0x3dd895d7, 0xa4d1c46d, 0xd3d6f4fb, 0x4369e96a, 0x346ed9fc, 0xad678846, 0xda60b8d0, 0x44042d73, 0x33031de5, 0xaa0a4c5f, 0xdd0d7cc9,
	0x5005713c, 0x270241aa, 0xbe0b1010, 0xc90c2086, 0x5768b525, 0x206f85b3, 0xb966d409, 0xce61e49f, 0x5edef90e, 0x29d9c998, 0xb0d09822, 0xc7d7a8b4, 0x59b33d17, 0x2eb40d81, 0xb7bd5c3b, 0xc0ba6cad,
	0xedb88320, 0x9abfb3b6, 0x03b6e20c, 0x74b1d29a, 0xead54739, 0x9dd277af, 0x04db2615, 0x73dc1683, 0xe3630b12, 0x94643b84, 0x0d6d6a3e, 0x7a6a5aa8, 0xe40ecf0b, 0x9309ff9d, 0x0a00ae27, 0x7d079eb1,
	0xf00f9344, 0x8708a3d2, 0x1e01f268, 0x6906c2fe, 0xf762575d, 0x806567cb, 0x196c3671, 0x6e6b06e7, 0xfed41b76, 0x89d32be0, 0x10da7a5a, 0x67dd4acc, 0xf9b9df6f, 0x8ebeeff9, 0x17b7be43, 0x60b08ed5,
	0xd6d6a3e8, 0xa1d1937e, 0x38d8c2c4, 0x4fdff252, 0xd1bb67f1, 0xa6bc5767, 0x3fb506dd, 0x48b2364b, 0xd80d2bda, 0xaf0a1b4c, 0x36034af6, 0x41047a60, 0xdf60efc3, 0xa867df55, 0x316e8eef, 0x4669be79,
	0xcb61b38c, 0xbc66831a, 0x256fd2a0, 0x5268e236, 0xcc0c7795, 0xbb0b4703, 0x220216b9, 0x5505262f, 0xc5ba3bbe, 0xb2bd0b28, 0x2bb45a92, 0x5cb36a04, 0xc2d7ffa7, 0xb5d0cf31, 0x2cd99e8b, 0x5bdeae1d,
	0x9b64c2b0, 0xec63f226, 0x756aa39c, 0x026d930a, 0x9c0906a9, 0xeb0e363f, 0x72076785, 0x05005713, 0x95bf4a82, 0xe2b87a14, 0x7bb12bae, 0x0cb61b38, 0x92d28e9b, 0xe5d5be0d, 0x7cdcefb7, 0x0bdbdf21,
	0x86d3d2d4, 0xf1d4e242, 0x68ddb3f8, 0x1fda836e, 0x81be16cd, 0xf6b9265b, 0x6fb077e1, 0x18b74777, 0x88085ae6, 0xff0f6a70, 0x66063bca, 0x11010b5c, 0x8f659eff, 0xf862ae69, 0x616bffd3, 0x166ccf45,
	0xa00ae278, 0xd70dd2ee, 0x4e048354, 0x3903b3c2, 0xa7672661, 0xd06016f7, 0x4969474d, 0x3e6e77db, 0xaed16a4a, 0xd9d65adc, 0x40df0b66, 0x37d83bf0, 0xa9bcae53, 0xdebb9ec5, 0x47b2cf7f, 0x30b5ffe9,
	0xbdbdf21c, 0xcabac28a, 0x53b39330, 0x24b4a3a6, 0xbad03605, 0xcdd70693, 0x54de5729, 0x23d967bf, 0xb3667a2e, 0xc4614ab8, 0x5d681b02, 0x2a6f2b94, 0xb40bbe37, 0xc30c8ea1, 0x5a05df1b, 0x2d02ef8d
];


System.IO.Compression.Crc32Helper.UpdateCrc32 = function (crc32, buffer, offset, length) // uint crc32, byte[] buffer, int offset, int length
{
	crc32 ^= 0xFFFFFFFF; // uint.MaxValue;
	while (--length >= 0) {
		crc32 = System.IO.Compression.Crc32Helper.crcTable[(crc32 ^ buffer[offset++]) & 0xff] ^ crc32 >> 8;
	}
	crc32 ^= 0xFFFFFFFF; //uint.MaxValue;
	return crc32;
};

//=============================================================================
// INTERFACE: System.IO.Compression.GZipFormatter
//=============================================================================

// Inherits from System.IO.Compression.IFileFormatWriter
System.IO.Compression.GZipFormatter = function () {
	var _crc32 = 0; //uint
	var _inputStreamSize = 0; //long
	var headerBytes = []; //byte[]
	//---------------------------------------------------------
	function GZipFormatter(compressionLevel) // int 
	{
		this.headerBytes = [0x1f, 0x8b, 8, 0, 0, 0, 0, 0, 4, 0];
		if (compressionLevel === 10) {
			this.headerBytes[8] = 2;
		}
	}
	//---------------------------------------------------------
	function GetFooter() {
		var b = new System.Byte(8);
		this.WriteUInt32(b, this._crc32, 0);
		this.WriteUInt32(b, this._inputStreamSize, 4); // (uint)this._inputStreamSize
		return b;
	}
	//---------------------------------------------------------
	function GetHeader() {
		return this.headerBytes;
	}
	//---------------------------------------------------------
	function UpdateWithBytesRead(buffer, offset, bytesToCopy) // byte[] buffer, int offset, int bytesToCopy
	{
		this._crc32 = System.IO.Compression.Crc32Helper.UpdateCrc32(this._crc32, buffer, offset, bytesToCopy);
		var a = this._inputStreamSize + bytesToCopy; // (long) bytesToCopy
		if (a > 0x100000000) // Long
		{
			//Math.DivRem(a, 0x100000000, out a); // Long
			a = a % b;
		}
		this._inputStreamSize = a;
	}
	//---------------------------------------------------------
	function WriteUInt32(b, value, startIndex) //byte[] b, uint value, int startIndex
	{
		b[startIndex] = value & 0xff; //(byte)
		b[startIndex + 1] = value >> 8 & 0xff; //(byte)
		b[startIndex + 2] = value >> 0x10 & 0xff; //(byte)
		b[startIndex + 3] = value >> 0x18 & 0xff; //(byte)
	}
	//---------------------------------------------------------
	GZipFormatter.apply(this, attributes);
};

//=============================================================================
// Class: System.IO.Compression.HuffmanTree
//=============================================================================


System.IO.Compression.HuffmanTree = function () {
	var codeLengthArray = new System.Byte(); // byte[]
	var left = new System.Int16(); // short[]
	var MaxDistTreeElements = 32;
	var MaxLiteralTreeElements = 288;
	var NumberOfCodeLengthTreeElements = 19;
	var EndOfBlockCode = 256;
	var right = new System.Int16(); //short[]
	var table = new System.Int16(); // short[]
	var tableBits = 0;
	var tableMask = 0;
	var SR = System.SR;
	//---------------------------------------------------------
	function HuffmanTree(codeLengths) // byte[] 
	{
		codeLengthArray = codeLengths;
		if (codeLengthArray.Length === MaxLiteralTreeElements) {
			tableBits = 9;
		}
		else {
			tableBits = 7;
		}
		tableMask = (1 << tableBits) - 1;
		CreateTable.apply(this);
	}
	//---------------------------------------------------------
	function CalculateHuffmanCode() {
		var bitLengthCount = new System.UInt32(17);
		var i;
		for (i = 0; i < codeLengthArray.length; i++) {
			var index = codeLengthArray[i];
			bitLengthCount[index]++;
		}
		bitLengthCount[0] = 0;
		var nextCode = new System.UInt32(17);
		var tempCode = 0;
		for (var bits = 1; bits <= 16; bits++) {
			tempCode = tempCode + bitLengthCount[bits - 1] << 1;
			nextCode[bits] = tempCode;
		}
		var code = new System.UInt32(MaxLiteralTreeElements);
		for (i = 0; i < codeLengthArray.length; i++) {
			var len = codeLengthArray[i];
			if (len > 0) {
				code[i] = BitReverse.apply(this, [nextCode[len], len]);
				nextCode[len]++;
			}
		}
		return code;
	}
	//---------------------------------------------------------
	function BitReverse(code, length) //uint code, int length
	{
		var new_code = 0;
		do {
			new_code |= code & 1;
			new_code <<= 1;
			code >>= 1;
		} while (--length > 0);
		return new_code >> 1;
	}
	//---------------------------------------------------------
	function CreateTable() {
		var codeArray = CalculateHuffmanCode.apply(this);
		table = new System.Int16(1 << tableBits);
		left = new System.Int16(2 * codeLengthArray.length);
		right = new System.Int16(2 * codeLengthArray.length);
		var avail = codeLengthArray.length;
		for (var ch = 0; ch < codeLengthArray.length; ch++) {
			var len = codeLengthArray[ch];
			if (len > 0) {
				var start = codeArray[ch];
				if (len <= tableBits) {
					var increment = 1 << len;
					if (start >= increment) throw new InvalidDataException(SR.GetString("InvalidHuffmanData"));
					var locs = 1 << tableBits - len;
					for (var j = 0; j < locs; j++) {
						table[start] = ch;
						start += increment;
					}
				}
				else {
					var overflowBits = len - tableBits;
					var codeBitMask = 1 << tableBits;
					var index = start & (1 << tableBits) - 1;
					var array = table;
					do {
						var value = array[index];
						if (value === 0) {
							array[index] = -avail;
							value = -avail;
							avail++;
						}
						if ((start & codeBitMask) === 0) array = left;
						else array = right;
						index = -value;
						codeBitMask <<= 1;
						overflowBits--;
					} while (overflowBits !== 0);
					array[index] = ch;
				}
			}
		}
	}
	//---------------------------------------------------------
	this.GetNextSymbol = function (input) //InputBuffer input
	{
		var bitBuffer = input.TryLoad16Bits();
		if (input.AvailableBits === 0) return -1;
		var symbol = table[bitBuffer & tableMask];
		if (symbol < 0) {
			var mask = 1 << tableBits; //(uint)
			do {
				symbol = -symbol;
				if ((bitBuffer & mask) === 0) symbol = left[symbol];
				else symbol = right[symbol];
				mask <<= 1;
			} while (symbol < 0);
		}
		if (codeLengthArray[symbol] > input.AvailableBits) return -1;
		input.SkipBits(codeLengthArray[symbol]);
		return symbol;
	};
	//---------------------------------------------------------
	HuffmanTree.apply(this, arguments);
};

//---------------------------------------------------------
System.IO.Compression.HuffmanTree.GetStaticDistanceTreeLength = function () {
	var buffer = new System.Byte(0x20); // MaxDistTreeElements = 32;
	for (var i = 0; i < 0x20; i++) buffer[i] = 5;
	return buffer;
};
//---------------------------------------------------------
System.IO.Compression.HuffmanTree.GetStaticLiteralTreeLength = function () {
	var buffer = new System.Byte(0x120); // MaxLiteralTreeElements = 288;
	for (var i = 0; i <= 0x8f; i++) buffer[i] = 8;
	for (var j = 0x90; j <= 0xff; j++) buffer[j] = 9;
	for (var k = 0x100; k <= 0x117; k++) buffer[k] = 7;
	for (var m = 280; m <= 0x11f; m++) buffer[m] = 8;
	return buffer;
};

System.IO.Compression.HuffmanTree._StaticDistanceTree = null;
System.IO.Compression.HuffmanTree.StaticDistanceTree = function () {
	if (System.IO.Compression.HuffmanTree._StaticDistanceTree) return System.IO.Compression.HuffmanTree._StaticDistanceTree;
	System.IO.Compression.HuffmanTree._StaticDistanceTree = new System.IO.Compression.HuffmanTree(System.IO.Compression.HuffmanTree.GetStaticDistanceTreeLength());
	return System.IO.Compression.HuffmanTree._StaticDistanceTree;
};

System.IO.Compression.HuffmanTree._StaticLiteralLengthTree = null;
System.IO.Compression.HuffmanTree.StaticLiteralLengthTree = function () {
	if (System.IO.Compression.HuffmanTree._StaticLiteralLengthTree) return System.IO.Compression.HuffmanTree._StaticLiteralLengthTree;
	System.IO.Compression.HuffmanTree._StaticLiteralLengthTree = new System.IO.Compression.HuffmanTree(System.IO.Compression.HuffmanTree.GetStaticLiteralTreeLength());
	return System.IO.Compression.HuffmanTree._StaticLiteralLengthTree;
};

//=============================================================================
// CLASS: System.IO.Compression.FastEncoderWindow
//-----------------------------------------------------------------------------

System.IO.Compression.FastEncoderWindow = function () {
	var bufEnd = 0;
	var bufPos = 0;
	var FastEncoderHashMask = 0x7ff;
	var FastEncoderHashShift = 4;
	var FastEncoderHashtableSize = 0x800;
	var FastEncoderMatch3DistThreshold = 0x4000;
	var FastEncoderWindowMask = 0x1fff;
	var FastEncoderWindowSize = 0x2000;
	var GoodLength = 4;
	var LazyMatchThreshold = 6;
	var lookup = [];
	var MaxMatch = 0x102;
	var MinMatch = 3;
	var NiceLength = 0x20;
	var prev = [];
	var SearchDepth = 0x20;
	var window = [];
	//---------------------------------------------------------
	this.CopyBytes = function (inputBuffer, startIndex, count) {
		System.Array.Copy(inputBuffer, startIndex, window, bufEnd, count);
		bufEnd += count;
	};
	//---------------------------------------------------------
	function FindMatch(search, matchPosRef, searchDepth, niceLength) {
		var matchPos = matchPosRef.Value;
		var num = 0;
		var num2 = 0;
		var num3 = bufPos - 0x2000;
		var num4 = window[bufPos];
		while (search > num3) {
			if (window[search + num] === num4) {
				var num5 = 0;
				while (num5 < 0x102) {
					if (window[bufPos + num5] !== window[search + num5]) {
						break;
					}
					num5++;
				}
				if (num5 > num) {
					num = num5;
					num2 = search;
					if (num5 > 0x20) {
						break;
					}
					num4 = window[bufPos + num5];
				}
			}
			if (--searchDepth === 0) {
				break;
			}
			search = prev[search & 0x1fff];
		}
		matchPos = bufPos - num2 - 1;
		if (num === 3 && matchPos >= 0x4000) {
			return 0;
		}
		matchPosRef.Value = matchPos;
		return num;
	}
	//---------------------------------------------------------
	this.FlushWindow = function () {
		this.ResetWindow();
	};
	//---------------------------------------------------------
	this.GetNextSymbolOrMatch = function (match) {
		var num2 = 0;
		var hash = HashValue(0, window[bufPos]);
		hash = HashValue(hash, window[bufPos + 1]);
		var matchPos = 0;
		var hashRef;
		if (bufEnd - bufPos <= 3) {
			num2 = 0;
		}
		else {
			hashRef = { Value: hash };
			var search = InsertString(hashRef);
			hash = hashRef.Value;
			if (search !== 0) {
				var matchPosRef = { Value: matchPos };
				num2 = FindMatch(search, matchPosRef, 0x20, 0x20);
				matchPos = matchPosRef.Value;
				if (bufPos + num2 > bufEnd) {
					num2 = bufEnd - bufPos;
				}
			}
			else {
				num2 = 0;
			}
		}
		if (num2 < 3) {
			match.State = System.IO.Compression.MatchState.HasSymbol;
			match.Symbol = window[bufPos];
			bufPos++;
		}
		else {
			bufPos++;
			if (num2 <= 6) {
				var num5 = 0;
				var num6 = 0;
				hashRef = { Value: hash };
				var num7 = InsertString(hashRef);
				hash = hashRef.Value;
				if (num7 !== 0) {
					var num6Ref = { Value: num6 };
					num5 = FindMatch(num7, num6Ref, num2 < 4 ? 0x20 : 8, 0x20);
					num6 = num6Ref.Value;
					if (bufPos + num5 > bufEnd) {
						num5 = bufEnd - bufPos;
					}
				}
				else {
					num5 = 0;
				}
				if (num5 > num2) {
					match.State = System.IO.Compression.MatchState.HasSymbolAndMatch;
					match.Symbol = window[bufPos - 1];
					match.Position = num6;
					match.Length = num5;
					bufPos++;
					num2 = num5;
					hashRef = { Value: hash };
					InsertStrings(hashRef, num2);
					hash = hashRef.Value;
				}
				else {
					match.State = System.IO.Compression.MatchState.HasMatch;
					match.Position = matchPos;
					match.Length = num2;
					num2--;
					bufPos++;
					hashRef = { Value: hash };
					InsertStrings(hashRef, num2);
					hash = hashRef.Value;
				}
			}
			else {
				match.State = System.IO.Compression.MatchState.HasMatch;
				match.Position = matchPos;
				match.Length = num2;
				hashRef = { Value: hash };
				InsertStrings(hashRef, num2);
				hash = hashRef.Value;
			}
		}
		if (this.bufPos === 0x4000) {
			this.MoveWindows();
		}
		return true;
	};
	//---------------------------------------------------------
	function HashValue(hash, b) {
		return hash << 4 ^ b;
	}
	//---------------------------------------------------------
	function InsertString(hashRef) // ref hash
	{
		var hash = hashRef.Value;
		hash = HashValue(hash, window[bufPos + 2]);
		var num = lookup[hash & 0x7ff];
		lookup[hash & 0x7ff] = bufPos;
		prev[bufPos & 0x1fff] = num;
		hashRef.Value = hash;
		return num;
	}
	//---------------------------------------------------------
	function InsertStrings(hashRef, matchLen) // ref hash
	{
		if (bufEnd - bufPos <= matchLen) {
			bufPos += matchLen - 1;
		}
		else {
			while (--matchLen > 0) {
				InsertString(hashRef);
				bufPos++;
			}
		}
	}
	//---------------------------------------------------------
	this.MoveWindows = function () {
		var num;
		Array.Copy(window, bufPos - 0x2000, window, 0, 0x2000);
		for (num = 0; num < 0x800; num++) {
			var num2 = lookup[num] - 0x2000;
			if (num2 <= 0) {
				lookup[num] = 0;
			}
			else {
				lookup[num] = num2;
			}
		}
		for (num = 0; num < 0x2000; num++) {
			var num3 = prev[num] - 0x2000;
			if (num3 <= 0) {
				prev[num] = 0;
			}
			else {
				prev[num] = num3;
			}
		}
		bufPos = 0x2000;
		bufEnd = bufPos;
	};
	//---------------------------------------------------------
	function RecalculateHash(position) {
		return (window[position] << 8 ^ window[position + 1] << 4 ^ window[position + 2]) & 0x7ff;
	}
	//---------------------------------------------------------
	this.ResetWindow = function () {
		window = new System.Byte(0x4106);
		prev = new System.UInt32(0x2102);
		lookup = new System.Byte(0x800);
		bufPos = 0x2000;
		bufEnd = bufPos;
	};
	//---------------------------------------------------------
	//[Conditional("DEBUG")]
	function VerifyHashes() {
		for (var i = 0; i < 0x800; i++) {
			var num3 = 0;
			for (var j = lookup[i]; j !== 0 && bufPos - j < 0x2000; j = num3) {
				num3 = prev[j & 0x1fff];
				if (bufPos - num3 >= 0x2000) {
					break;
				}
			}
		}
	}
	//---------------------------------------------------------
	this.BytesAvailable = function () {
		return bufEnd - bufPos;
	};
	//---------------------------------------------------------
	this.FreeWindowSpace = function () {
		return 0x4000 - bufEnd;
	};
	//---------------------------------------------------------
	this.UnprocessedInput = function () {
		var di = new System.IO.Compression.DeflateInput();
		di.Buffer = window;
		di.StartIndex = bufPos;
		di.Count = bufEnd - bufPos;
		return di;
	};
	this.ResetWindow();
};

//=============================================================================
// CLASS: System.IO.Compression.FastEncoder
//-----------------------------------------------------------------------------

System.IO.Compression.FastEncoder = function () {
	var currentMatch = new System.IO.Compression.Match();
	var inputWindow = new System.IO.Compression.FastEncoderWindow();
	var lastCompressionRatio = 0.0;
	//---------------------------------------------------------
	this.FlushInput = function () {
		inputWindow.FlushWindow();
	};
	//---------------------------------------------------------
	this.GetBlock = function (input, output, maxBytesToCopy) {
		WriteDeflatePreamble.apply(this, [output]);
		this.GetCompressedOutput(input, output, maxBytesToCopy);
		this.WriteEndOfBlock(output);
	};
	//---------------------------------------------------------
	this.GetBlockFooter = function (output) {
		this.WriteEndOfBlock(output);
	};
	//---------------------------------------------------------
	this.GetBlockHeader = function (output) {
		WriteDeflatePreamble.apply(this, [output]);
	};
	//---------------------------------------------------------
	this.GetCompressedData = function (input, output) {
		this.GetCompressedOutput(input, output, -1);
	};
	//---------------------------------------------------------
	function GetCompressedOutput_1(output) {
		while (inputWindow.BytesAvailable() > 0 && this.SafeToWriteTo(output)) {
			inputWindow.GetNextSymbolOrMatch(currentMatch);
			if (currentMatch.State === System.IO.Compression.MatchState.HasSymbol) {
				WriteChar.apply(this, [currentMatch.Symbol, output]);
			}
			else {
				if (currentMatch.State === System.IO.Compression.MatchState.HasMatch) {
					WriteMatch.apply(this, [currentMatch.Length, currentMatch.Position, output]);
					continue;
				}
				WriteChar.apply(this, [currentMatch.Symbol, output]);
				WriteMatch.apply(this, [currentMatch.Length, currentMatch.Position, output]);
			}
		}
	}
	//---------------------------------------------------------
	function GetCompressedOutput_3(input, output, maxBytesToCopy) {
		var bytesWritten = output.BytesWritten();
		var num2 = 0;
		var num3 = this.BytesInHistory() + input.Count;
		do {
			var num4 = input.Count < inputWindow.FreeWindowSpace() ? input.Count : inputWindow.FreeWindowSpace();
			if (maxBytesToCopy >= 1) {
				num4 = Math.min(num4, maxBytesToCopy - num2);
			}
			if (num4 > 0) {
				inputWindow.CopyBytes(input.Buffer, input.StartIndex, num4);
				input.ConsumeBytes(num4);
				num2 += num4;
			}
			this.GetCompressedOutput(output);
		}
		while (this.SafeToWriteTo(output) && this.InputAvailable(input) && (maxBytesToCopy < 1 || num2 < maxBytesToCopy));
		var num6 = output.BytesWritten() - bytesWritten;
		var num7 = this.BytesInHistory() + input.Count;
		var num8 = num3 - num7;
		if (num6 !== 0) {
			lastCompressionRatio = num6 / num8; // double
		}
	}
	//---------------------------------------------------------
	this.GetCompressedOutput = function () {
		if (arguments.length === 1) GetCompressedOutput_1.apply(this, arguments);
		if (arguments.length === 3) GetCompressedOutput_3.apply(this, arguments);
	};
	//---------------------------------------------------------
	this.InputAvailable = function (input) {
		if (input.Count <= 0) return this.BytesInHistory() > 0;
		return true;
	};
	//---------------------------------------------------------
	this.SafeToWriteTo = function (output) {
		return output.FreeBytes() > 0x10;
	};
	//---------------------------------------------------------
	function WriteChar(b, output) {
		var num = System.IO.Compression.FastEncoderStatics.FastEncoderLiteralCodeInfo[b];
		output.WriteBits(num & 0x1f, num >> 5);
	}
	//---------------------------------------------------------
	function WriteDeflatePreamble(output) {
		output.WriteBytes(System.IO.Compression.FastEncoderStatics.FastEncoderTreeStructureData, 0, System.IO.Compression.FastEncoderStatics.FastEncoderTreeStructureData.length);
		output.WriteBits(9, 0x22);
	}
	//---------------------------------------------------------
	this.WriteEndOfBlock = function (output) {
		var num = System.IO.Compression.FastEncoderStatics.FastEncoderLiteralCodeInfo[0x100];
		var n = num & 0x1f;
		output.WriteBits(n, num >> 5);
	};
	//---------------------------------------------------------
	function WriteMatch(matchLen, matchPos, output) {
		var num = System.IO.Compression.FastEncoderStatics.FastEncoderLiteralCodeInfo[0xfe + matchLen];
		var n = num & 0x1f;
		if (n <= 0x10) {
			output.WriteBits(n, num >> 5);
		}
		else {
			output.WriteBits(0x10, num >> 5 & 0xffff);
			output.WriteBits(n - 0x10, num >> 0x15);
		}
		num = System.IO.Compression.FastEncoderStatics.FastEncoderDistanceCodeInfo[System.IO.Compression.FastEncoderStatics.GetSlot(matchPos)];
		output.WriteBits(num & 15, num >> 8);
		var num3 = num >> 4 & 15;
		if (num3 !== 0) {
			output.WriteBits(num3, matchPos & System.IO.Compression.FastEncoderStatics.BitMask[num3]);
		}
	}
	//---------------------------------------------------------
	this.BytesInHistory = function () {
		return inputWindow.BytesAvailable();
	};
	//---------------------------------------------------------
	this.LastCompressionRatio = function () {
		return lastCompressionRatio;
	};
	//---------------------------------------------------------
	this.UnprocessedInput = function () {
		return inputWindow.UnprocessedInput();
	};
	// Initialize static values.
	System.IO.Compression.FastEncoderStatics.FastEncoderStatics();
};


//=============================================================================
// CLASS: System.IO.Compression.CopyEncoder
//-----------------------------------------------------------------------------

System.IO.Compression.CopyEncoder = function () {
	var MaxUncompressedBlockSize = 0x10000;
	var PaddingSize = 5;
	//---------------------------------------------------------
	this.GetBlock = function (input, output, isFinal) {
		var count = 0;
		if (input !== null) {
			count = Math.min(input.Count, output.FreeBytes() - 5 - output.BitsInBuffer());
			if (count > 0xfffb) {
				count = 0xfffb;
			}
		}
		if (isFinal) {
			output.WriteBits(3, 1);
		}
		else {
			output.WriteBits(3, 0);
		}
		output.FlushBits();
		this.WriteLenNLen(count & 0xffff, output); // convert count to ushort
		if (input !== null && count > 0) {
			output.WriteBytes(input.Buffer, input.StartIndex, count);
			input.ConsumeBytes(count);
		}
	};
	//---------------------------------------------------------
	this.WriteLenNLen = function (len, output) {
		output.WriteUInt16(len);
		var num = ~len & 0xffff; //ushort
		output.WriteUInt16(num);
	};
};

//=============================================================================
// CLASS: System.IO.Compression.Deflater
//-----------------------------------------------------------------------------

System.IO.Compression.Deflater = function () {
	var BadCompressionThreshold = 1.0;
	var CleanCopySize = 0xf88;
	var copyEncoder = new System.IO.Compression.CopyEncoder();
	var deflateEncoder = new System.IO.Compression.FastEncoder();
	var input = new System.IO.Compression.DeflateInput();
	var inputFromHistory; //DeflateInput
	var MaxHeaderFooterGoo = 120;
	var MinBlockSize = 0x100;
	var output = new System.IO.Compression.OutputBuffer();
	var processingState = System.IO.Compression.DeflaterState.NotStarted;
	//---------------------------------------------------------
	this.Finish = function (outputBuffer) {
		if (processingState === System.IO.Compression.DeflaterState.NotStarted) {
			return 0;
		}
		output.UpdateBuffer(outputBuffer);
		if (processingState === System.IO.Compression.DeflaterState.CompressThenCheck || processingState === System.IO.Compression.DeflaterState.HandlingSmallData || processingState === System.IO.Compression.DeflaterState.SlowDownForIncompressible1) {
			deflateEncoder.GetBlockFooter(output);
		}
		WriteFinal.apply(this);
		return output.BytesWritten();
	};
	//---------------------------------------------------------
	function FlushInputWindows() {
		deflateEncoder.FlushInput();
	}
	//---------------------------------------------------------
	this.GetDeflateOutput = function (outputBuffer) {
		output.UpdateBuffer(outputBuffer);
		switch (processingState) {
			case System.IO.Compression.DeflaterState.NotStarted:
				{
					var state = input.DumpState();
					var state2 = output.DumpState();
					deflateEncoder.GetBlockHeader(output);
					deflateEncoder.GetCompressedData(input, output);
					if (UseCompressed(deflateEncoder.LastCompressionRatio())) {
						processingState = System.IO.Compression.DeflaterState.CompressThenCheck;
					}
					else {
						input.RestoreState(state);
						output.RestoreState(state2);
						copyEncoder.GetBlock(input, output, false);
						FlushInputWindows();
						processingState = System.IO.Compression.DeflaterState.CheckingForIncompressible;
					}
					return output.BytesWritten();
				}
			case System.IO.Compression.DeflaterState.SlowDownForIncompressible1:
				deflateEncoder.GetBlockFooter(output);
				processingState = System.IO.Compression.DeflaterState.SlowDownForIncompressible2;
				break;
			case System.IO.Compression.DeflaterState.SlowDownForIncompressible2:
				break;
			case System.IO.Compression.DeflaterState.StartingSmallData:
				deflateEncoder.GetBlockHeader(output);
				processingState = System.IO.Compression.DeflaterState.HandlingSmallData;
				deflateEncoder.GetCompressedData(input, output);
				return output.BytesWritten();
			case System.IO.Compression.DeflaterState.CompressThenCheck:
				deflateEncoder.GetCompressedData(input, output);
				if (!UseCompressed(deflateEncoder.LastCompressionRatio())) {
					processingState = System.IO.Compression.DeflaterState.SlowDownForIncompressible1;
					inputFromHistory = deflateEncoder.UnprocessedInput();
				}
				return output.BytesWritten();
			case System.IO.Compression.DeflaterState.CheckingForIncompressible:
				{
					var state3 = input.DumpState();
					var state4 = output.DumpState();
					deflateEncoder.GetBlock(input, output, 0xf88);
					if (!UseCompressed(deflateEncoder.LastCompressionRatio())) {
						input.RestoreState(state3);
						output.RestoreState(state4);
						copyEncoder.GetBlock(input, output, false);
						FlushInputWindows();
					}
					return output.BytesWritten();
				}
			case System.IO.Compression.DeflaterState.HandlingSmallData:
				return output.BytesWritten();
			default:
				return output.BytesWritten();
		}
		if (inputFromHistory.Count > 0) {
			copyEncoder.GetBlock(inputFromHistory, output, false);
		}
		if (inputFromHistory.Count === 0) {
			deflateEncoder.FlushInput();
			processingState = System.IO.Compression.DeflaterState.CheckingForIncompressible;
		}
		return output.BytesWritten();
	};
	//---------------------------------------------------------
	this.NeedsInput = function () {
		return input.Count === 0 && deflateEncoder.BytesInHistory() === 0;
	};
	//---------------------------------------------------------
	this.SetInput = function (inputBuffer, startIndex, count) {
		input.Buffer = inputBuffer;
		input.Count = count;
		input.StartIndex = startIndex;
		if (count > 0 && count < 0x100) {
			switch (processingState) {
				case System.IO.Compression.DeflaterState.CompressThenCheck:
					processingState = System.IO.Compression.DeflaterState.HandlingSmallData;
					return;
				case System.IO.Compression.DeflaterState.CheckingForIncompressible:
				case System.IO.Compression.DeflaterState.NotStarted:
					processingState = System.IO.Compression.DeflaterState.StartingSmallData;
					return;
				default:
					return;
			}
		}
	};
	//---------------------------------------------------------
	function UseCompressed(ratio) {
		return ratio <= 1.0;
	}
	//---------------------------------------------------------
	function WriteFinal() {
		copyEncoder.GetBlock(null, output, true);
	}
	//---------------------------------------------------------
};
System.Type.RegisterClass("System.IO.Compression.Deflater");

//=============================================================================
// CLASS: System.IO.Compression.Inflater
//-----------------------------------------------------------------------------

System.IO.Compression.Inflater = function () {
	var bfinal = 0;
	var blockLength = 0;
	var blockLengthBuffer = new System.Byte(4);
	var blockType; // BlockType
	var codeArraySize = 0;
	var codeLengthCodeCount = 0;
	var codeLengthTree; // HuffmanTree
	var codeLengthTreeCodeLength = new System.Byte(0x13);
	var codeList = new System.Byte(320);
	var codeOrder = [0x10, 0x11, 0x12, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
	var distanceBasePosition = [
		1, 2, 3, 4, 5, 7, 9, 13, 0x11, 0x19, 0x21, 0x31, 0x41, 0x61, 0x81, 0xc1,
		0x101, 0x181, 0x201, 0x301, 0x401, 0x601, 0x801, 0xc01, 0x1001, 0x1801, 0x2001, 0x3001, 0x4001, 0x6001, 0, 0];
	var distanceCode = 0;
	var distanceCodeCount = 0;
	var distanceTree; // HuffmanTree
	var extraBits = 0;
	var extraLengthBits = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2,
		3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0];
	var formatReader; // IFileFormatReader
	var hasFormatReader = false;
	var input = new System.IO.Compression.InputBuffer(); // InputBuffer 
	var length = 0;
	var lengthBase = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 0x11, 0x13, 0x17, 0x1b, 0x1f,
		0x23, 0x2b, 0x33, 0x3b, 0x43, 0x53, 0x63, 0x73, 0x83, 0xa3, 0xc3, 0xe3, 0x102];
	var lengthCode = 0;
	var literalLengthCodeCount = 0;
	var literalLengthTree; // HuffmanTree
	var loopCounter = 0;
	var output = new System.IO.Compression.OutputWindow();
	var state = System.IO.Compression.InflaterState.ReadingHeader;
	var staticDistanceTreeTable = [0, 0x10, 8, 0x18, 4, 20, 12, 0x1c, 2, 0x12, 10, 0x1a, 6, 0x16, 14, 30,
		1, 0x11, 9, 0x19, 5, 0x15, 13, 0x1d, 3, 0x13, 11, 0x1b, 7, 0x17, 15, 0x1f];
	//---------------------------------------------------------
	function Inflater() {
		Reset.apply(this);
	}
	//---------------------------------------------------------
	function Decode() {
		var flag = false;
		var flag2 = false;
		if (this.Finished()) return true;
		if (hasFormatReader) {
			if (state === System.IO.Compression.InflaterState.ReadingHeader) {
				if (!formatReader.ReadHeader(input)) return false;
				state = System.IO.Compression.InflaterState.ReadingBFinal;
			}
			else if (state === System.IO.Compression.InflaterState.StartReadingFooter || state === System.IO.Compression.InflaterState.ReadingFooter) {
				if (!formatReader.ReadFooter(input)) return false;
				state = System.IO.Compression.InflaterState.VerifyingFooter;
				return true;
			}
		}
		if (state === System.IO.Compression.InflaterState.ReadingBFinal) {
			if (!input.EnsureBitsAvailable(1)) return false;
			bfinal = input.GetBits(1);
			state = System.IO.Compression.InflaterState.ReadingBType;
		}
		if (state === System.IO.Compression.InflaterState.ReadingBType) {
			if (!input.EnsureBitsAvailable(2)) {
				state = System.IO.Compression.InflaterState.ReadingBType;
				return false;
			}
			blockType = input.GetBits(2); // (BlockType)
			if (blockType !== System.IO.Compression.BlockType.Dynamic) {
				if (blockType !== System.IO.Compression.BlockType.Static) {
					if (blockType !== System.IO.Compression.BlockType.Uncompressed) {
						throw new System.IO.InvalidDataException(SR.GetString("UnknownBlockType"));
					}
					state = System.IO.Compression.InflaterState.UncompressedAligning;
				}
				else {
					literalLengthTree = System.IO.Compression.HuffmanTree.StaticLiteralLengthTree();
					distanceTree = System.IO.Compression.HuffmanTree.StaticDistanceTree();
					state = System.IO.Compression.InflaterState.DecodeTop;
				}
			}
			else {
				state = System.IO.Compression.InflaterState.ReadingNumLitCodes;
			}
		}
		if (blockType === System.IO.Compression.BlockType.Dynamic) {
			if (state < System.IO.Compression.InflaterState.DecodeTop) {
				flag2 = DecodeDynamicBlockHeader.apply(this);
			}
			else {
				var flagRef = { Value: flag };
				flag2 = DecodeBlock.apply(this, [flagRef]);
				flag = flagRef.Value;
			}
		}
		else if (blockType === System.IO.Compression.BlockType.Static) {
			var flagRef2 = { Value: flag };
			flag2 = DecodeBlock.apply(this, [flag]);
			flag = flagRef2.Value;
		}
		else {
			if (blockType !== System.IO.Compression.BlockType.Uncompressed) {
				throw new System.IO.InvalidDataException(SR.GetString("UnknownBlockType"));
			}
			var flagRef3 = { Value: flag };
			flag2 = DecodeUncompressedBlock.apply(this, [flagRef3]);
			flag = flagRef3.Value;
		}
		if (flag && bfinal !== 0) {
			if (hasFormatReader) {
				state = System.IO.Compression.InflaterState.StartReadingFooter;
				return flag2;
			}
			state = System.IO.Compression.InflaterState.Done;
		}
		return flag2;
	}
	//---------------------------------------------------------
	function DecodeBlock(end_of_block_code_seenRef) {
		end_of_block_code_seenRef.Value = false;
		var freeBytes = output.FreeBytes;
		while (freeBytes > 0x102) {
			var nextSymbol = 0;
			var num4 = 0;
			var gotoLabel = true;
			var gotoLabel_00E4 = true;
			var gotoLabel_0151 = true;
			var gotoLabel_01B3 = true;
			switch (state) {
				case System.IO.Compression.InflaterState.DecodeTop:
					nextSymbol = literalLengthTree.GetNextSymbol(input);
					if (nextSymbol >= 0) {
						break;
					}
					return false;

				case System.IO.Compression.InflaterState.HaveInitialLength:
					gotoLabel = false;
					//goto Label_00E4;
					break;
				case System.IO.Compression.InflaterState.HaveFullLength:
					gotoLabel = false;
					gotoLabel_00E4 = false;
					//goto Label_0151;
					break;
				case System.IO.Compression.InflaterState.HaveDistCode:
					gotoLabel = false;
					gotoLabel_00E4 = false;
					gotoLabel_0151 = false;
					//goto Label_01B3;
					break;
				default:
					throw new System.IO.InvalidDataException(SR.GetString("UnknownState"));
			}
			if (gotoLabel) {
				if (nextSymbol < 0x100) {
					output.Write(nextSymbol & 0xff); //(byte)
					freeBytes--;
					continue;
				}
				if (nextSymbol === 0x100) {
					end_of_block_code_seenRef.Value = true;
					state = System.IO.Compression.InflaterState.ReadingBFinal;
					return true;
				}
				nextSymbol -= 0x101;
				if (nextSymbol < 8) {
					nextSymbol += 3;
					extraBits = 0;
				}
				else if (nextSymbol === 0x1c) {
					nextSymbol = 0x102;
					extraBits = 0;
				}
				else {
					if (nextSymbol < 0 || nextSymbol >= extraLengthBits.length) {
						throw new System.IO.InvalidDataException(SR.GetString("GenericInvalidData"));
					}
					extraBits = extraLengthBits[nextSymbol];
				}
				length = nextSymbol;
			}
			if (gotoLabel_00E4) {
				if (extraBits > 0) {
					state = System.IO.Compression.InflaterState.HaveInitialLength;
					var bits = input.GetBits(extraBits);
					if (bits < 0) {
						return false;
					}
					if (length < 0 || length >= lengthBase.length) {
						throw new System.IO.InvalidDataException(SR.GetString("GenericInvalidData"));
					}
					length = lengthBase[length] + bits;
				}
				state = System.IO.Compression.InflaterState.HaveFullLength;
			}
			if (gotoLabel_0151) {
				if (blockType === System.IO.Compression.BlockType.Dynamic) {
					distanceCode = distanceTree.GetNextSymbol(input);
				}
				else {
					distanceCode = input.GetBits(5);
					if (distanceCode >= 0) {
						distanceCode = staticDistanceTreeTable[distanceCode];
					}
				}
				if (distanceCode < 0) {
					return false;
				}
				state = System.IO.Compression.InflaterState.HaveDistCode;
			}
			if (distanceCode > 3) {
				extraBits = distanceCode - 2 >> 1;
				var num5 = input.GetBits(extraBits);
				if (num5 < 0) {
					return false;
				}
				num4 = distanceBasePosition[distanceCode] + num5;
			}
			else {
				num4 = distanceCode + 1;
			}
			output.WriteLengthDistance(length, num4);
			freeBytes -= length;
			state = System.IO.Compression.InflaterState.DecodeTop;
		}
		return true;
	}
	//---------------------------------------------------------
	function DecodeDynamicBlockHeader() {
		var gotoLabel = true;
		var gotoLabel_0096 = true;
		var gotoLabel_0107 = true;
		var gotoLabel_0315 = true;
		switch (state) {
			case System.IO.Compression.InflaterState.ReadingNumLitCodes:
				literalLengthCodeCount = input.GetBits(5);
				if (literalLengthCodeCount >= 0) {
					literalLengthCodeCount += 0x101;
					state = System.IO.Compression.InflaterState.ReadingNumDistCodes;
					break;
				}
				return false;
			case System.IO.Compression.InflaterState.ReadingNumDistCodes:
				break;
			case System.IO.Compression.InflaterState.ReadingNumCodeLengthCodes:
				gotoLabel = false;
				//goto Label_0096;
				break;
			case System.IO.Compression.InflaterState.ReadingCodeLengthCodes:
				gotoLabel = false;
				gotoLabel_0096 = false;
				//goto Label_0107;
				break;
			case System.IO.Compression.InflaterState.ReadingTreeCodesBefore:
			case System.IO.Compression.InflaterState.ReadingTreeCodesAfter:
				gotoLabel = false;
				gotoLabel_0096 = false;
				gotoLabel_0107 = false;
				//goto Label_0315;
				break;
			default:
				throw new System.IO.InvalidDataException(SR.GetString("UnknownState"));
		}
		if (gotoLabel) {
			distanceCodeCount = input.GetBits(5);
			if (distanceCodeCount < 0) {
				return false;
			}
			distanceCodeCount++;
			state = System.IO.Compression.InflaterState.ReadingNumCodeLengthCodes;
		}
		if (gotoLabel_0096) {
			codeLengthCodeCount = input.GetBits(4);
			if (codeLengthCodeCount < 0) {
				return false;
			}
			codeLengthCodeCount += 4;
			loopCounter = 0;
			state = System.IO.Compression.InflaterState.ReadingCodeLengthCodes;
		}
		if (gotoLabel_0107) {
			while (loopCounter < codeLengthCodeCount) {
				var bits = input.GetBits(3);
				if (bits < 0) {
					return false;
				}
				codeLengthTreeCodeLength[codeOrder[loopCounter]] = bits & 0xff;
				loopCounter++;
			}
			for (var i = codeLengthCodeCount; i < codeOrder.length; i++) {
				codeLengthTreeCodeLength[codeOrder[i]] = 0;
			}
			codeLengthTree = new System.IO.Compression.HuffmanTree(codeLengthTreeCodeLength);
			codeArraySize = literalLengthCodeCount + distanceCodeCount;
			loopCounter = 0;
			state = System.IO.Compression.InflaterState.ReadingTreeCodesBefore;
		}
		while (loopCounter < codeArraySize) {
			if (state === System.IO.Compression.InflaterState.ReadingTreeCodesBefore && (lengthCode = codeLengthTree.GetNextSymbol(input)) < 0) {
				return false;
			}
			if (lengthCode <= 15) {
				codeList[loopCounter++] = lengthCode & 0xff;
			}
			else {
				var num3 = 0;
				if (!input.EnsureBitsAvailable(7)) {
					state = System.IO.Compression.InflaterState.ReadingTreeCodesAfter;
					return false;
				}
				if (lengthCode === 0x10) {
					if (loopCounter === 0) {
						throw new System.IO.InvalidDataException();
					}
					var num4 = codeList[loopCounter - 1];
					num3 = input.GetBits(2) + 3;
					if (loopCounter + num3 > codeArraySize) {
						throw new System.IO.InvalidDataException();
					}
					for (var j = 0; j < num3; j++) {
						codeList[loopCounter++] = num4;
					}
				}
				else if (lengthCode === 0x11) {
					num3 = input.GetBits(3) + 3;
					if (loopCounter + num3 > codeArraySize) {
						throw new System.IO.InvalidDataException();
					}
					for (var k = 0; k < num3; k++) {
						codeList[loopCounter++] = 0;
					}
				}
				else {
					num3 = input.GetBits(7) + 11;
					if (loopCounter + num3 > codeArraySize) {
						throw new System.IO.InvalidDataException();
					}
					for (var m = 0; m < num3; m++) {
						codeList[loopCounter++] = 0;
					}
				}
			}
			state = System.IO.Compression.InflaterState.ReadingTreeCodesBefore;
		}
		var destinationArray = new System.Byte(0x120);
		var buffer2 = new System.Byte(0x20);
		System.Array.Copy(codeList, destinationArray, literalLengthCodeCount);
		System.Array.Copy(codeList, literalLengthCodeCount, buffer2, 0, distanceCodeCount);
		if (destinationArray[0x100] === 0) {
			throw new System.IO.InvalidDataException();
		}
		literalLengthTree = new System.IO.Compression.HuffmanTree(destinationArray);
		distanceTree = new System.IO.Compression.HuffmanTree(buffer2);
		state = System.IO.Compression.InflaterState.DecodeTop;
		return true;
	}
	//---------------------------------------------------------
	function DecodeUncompressedBlock(end_of_blockRef) // out bool end_of_block
	{
		end_of_blockRef.Value = false;
		for (; ;) {
			switch (state) {
				case System.IO.Compression.InflaterState.UncompressedAligning:
					input.SkipToByteBoundary();
					state = System.IO.Compression.InflaterState.UncompressedByte1;
					break;

				case System.IO.Compression.InflaterState.UncompressedByte1:
				case System.IO.Compression.InflaterState.UncompressedByte2:
				case System.IO.Compression.InflaterState.UncompressedByte3:
				case System.IO.Compression.InflaterState.UncompressedByte4:
					break;

				case System.IO.Compression.InflaterState.DecodingUncompressed:
					{
						var num3 = output.CopyFrom(input, blockLength);
						blockLength -= num3;
						if (blockLength !== 0) {
							return output.FreeBytes === 0;
						}
						state = System.IO.Compression.InflaterState.ReadingBFinal;
						end_of_blockRef.Value = true;
						return true;
					}
				default:
					throw new System.IO.InvalidDataException(SR.GetString("UnknownState"));
			}
			var bits = input.GetBits(8);
			if (bits < 0) {
				return false;
			}
			blockLengthBuffer[state - 0x10] = bits & 0xff; // (int)state
			if (state === System.IO.Compression.InflaterState.UncompressedByte4) {
				blockLength = blockLengthBuffer[0] + blockLengthBuffer[1] * 0x100;
				var num2 = blockLengthBuffer[2] + blockLengthBuffer[3] * 0x100;
				if ((blockLength & 0xffff) !== (~num2 & 0xffff)) // (ushort) 
				{
					throw new System.IO.InvalidDataException(SR.GetString("InvalidBlockLength"));
				}
			}
			state += 1;
		}
	}
	//---------------------------------------------------------
	this.Finished = function () {
		if (state !== System.IO.Compression.InflaterState.Done) {
			return state === System.IO.Compression.InflaterState.VerifyingFooter;
		}
		return true;
	};
	//---------------------------------------------------------
	this.Inflate = function (bytes, offset, length) // byte[] bytes, int offset, int length
	{
		var num = 0;
		do {
			var bytesToCopy = output.CopyTo(bytes, offset, length);
			if (bytesToCopy > 0) {
				if (hasFormatReader) {
					formatReader.UpdateWithBytesRead(bytes, offset, bytesToCopy);
				}
				offset += bytesToCopy;
				num += bytesToCopy;
				length -= bytesToCopy;
			}
		}
		while (length !== 0 && !this.Finished() && Decode.apply(this));
		if (state === System.IO.Compression.InflaterState.VerifyingFooter && output.AvailableBytes === 0) {
			formatReader.Validate();
		}
		return num;
	};
	//---------------------------------------------------------
	this.NeedsInput = function () {
		return input.NeedsInput();
	};
	//---------------------------------------------------------
	function Reset() {
		if (hasFormatReader) {
			state = System.IO.Compression.InflaterState.ReadingHeader;
		}
		else {
			state = System.IO.Compression.InflaterState.ReadingBFinal;
		}
	}
	//---------------------------------------------------------
	function SetFileFormatReader(reader) // IFileFormatReader 
	{
		formatReader = reader;
		hasFormatReader = true;
		Reset.apply(this);
	}
	//---------------------------------------------------------
	this.SetInput = function (inputBytes, offset, length) // byte[] inputBytes, int offset, int length
	{
		input.SetInput(inputBytes, offset, length);
	};
	//---------------------------------------------------------
	this.AvailableOutput = function () {
		return output.AvailableBytes;
	};
	//---------------------------------------------------------
	Inflater.apply(this);
};
System.Type.RegisterClass("System.IO.Compression.Inflater");

//=============================================================================
// CLASS: System.IO.Compression.DeflateStream
//-----------------------------------------------------------------------------

System.IO.Compression.DeflateStream = function (stream, mode, leaveOpen) {
	var base = System.Type.Inherits(this, new System.IO.Stream());
	/// <summary>
	/// Provides methods and properties for compressing and decompressing streams using the Deflate algorithm.
	/// </summary>
	this._leaveOpen = false;
	this._mode = System.IO.Compression.CompressionMode.Decompress;
	this._stream = null;
	var buffer = new System.Array();
	var bufferSize = 0x1000;
	var DefaultBufferSize = 0x1000;
	var deflater = null;
	var inflater = null;
	var wroteHeader = false;
	this.formatWriter = null;
	//---------------------------------------------------------
	function EnsureCompressionMode() {
		if (this._mode !== System.IO.Compression.CompressionMode.Compress) {
			throw new System.Exception("Cannot Write To DeflateStream");
		}
	}
	//---------------------------------------------------------
	function EnsureDecompressionMode() {
		if (this._mode !== System.IO.Compression.CompressionMode.Decompress) {
			throw new System.Exception("Cannot Read From DeflateStream");
		}
	}
	//---------------------------------------------------------
	function ValidateParameters(array, offset, count) {
		if (array === null) throw new System.ArgumentNullException("array");
		if (offset < 0) throw new System.ArgumentOutOfRangeException("offset");
		if (count < 0) throw new System.ArgumentOutOfRangeException("count");
		if (array.length - offset < count) throw new System.ArgumentException(SR.GetString("InvalidArgumentOffsetCount"));
		if (this._stream === null) throw new System.ObjectDisposedException(null, "Object Disposed Stream Closed");
	}
	//---------------------------------------------------------
	this.Dispose_1 = function (disposing) {
		/// <summary>
		/// Releases the unmanaged resources used by the <see cref="T:System.IO.Compression.DeflateStream" /> and optionally releases the managed resources.
		/// </summary>
		/// <param name="disposing">true to release both managed and unmanaged resources; false to release only unmanaged resources.
		/// </param>
		try {
			if (disposing && this._stream !== null) {
				this.Flush();
				if (this._mode === System.IO.Compression.CompressionMode.Compress && this._stream !== null) {
					var deflateOutput = 0;
					while (!deflater.NeedsInput()) {
						deflateOutput = deflater.GetDeflateOutput(buffer);
						if (deflateOutput !== 0) {
							this._stream.Write(buffer, 0, deflateOutput);
						}
					}
					deflateOutput = deflater.Finish(buffer);
					if (deflateOutput > 0) {
						DoWrite.apply(this, [buffer, 0, deflateOutput]);
					}
					if (this.formatWriter !== null && wroteHeader) {
						var footer = this.formatWriter.GetFooter();
						this._stream.Write(footer, 0, footer.length);
					}
				}
			}
		}
		finally {
			try {
				if (disposing && !this._leaveOpen && this._stream !== null) {
					this._stream.Close();
				}
			}
			finally {
				this._stream = null;
				base.Dispose(disposing);
			}
		}
	};
	//---------------------------------------------------------
	function DoMaintenance(array, offset, count) // byte[] array, int offset, int count
	{
		if (this.formatWriter !== null) {
			if (!this.wroteHeader && count > 0) {
				var header = this.formatWriter.GetHeader();
				this._stream.Write(header, 0, header.length);
				this.wroteHeader = true;
			}
			if (count > 0) {
				this.formatWriter.UpdateWithBytesRead(array, offset, count);
			}
		}
	}
	//---------------------------------------------------------
	function SetFileFormatReader(reader) // IFileFormatReader 
	{
		if (reader !== null) inflater.SetFileFormatReader(reader);
	}
	//---------------------------------------------------------
	function SetFileFormatWriter(writer) // IFileFormatWriter 
	{
		if (writer !== null) this.formatWriter = writer;
	}
	//---------------------------------------------------------
	// Override Read
	//---------------------------------------------------------
	this.Read = function (array, offset, count) {
		/// <summary>Reads a number of decompressed bytes into the specified byte array.</summary>
		/// <param name="array">The array used to store decompressed bytes.</param>
		/// <param name="offset">The location in the array to begin reading.</param>
		/// <param name="count">The number of decompressed bytes to read.</param>
		/// <returns>The number of bytes that were decompressed into the byte array.</returns>
		EnsureDecompressionMode.apply(this);
		ValidateParameters.apply(this, [array, offset, count]);
		var num2 = offset;
		var length = count;
		for (; ;) {
			var num = inflater.Inflate(array, num2, length);
			num2 += num;
			length -= num;
			if (length === 0 || inflater.Finished()) {
				break;
			}
			var num4 = this._stream.Read(buffer, 0, buffer.length);
			if (num4 === 0) {
				break;
			}
			inflater.SetInput(buffer, 0, num4);
		}
		return count - length;
	};
	//---------------------------------------------------------
	function DoWrite(array, offset, count) //byte[] array, int offset, int count, bool isAsync
	{
		this._stream.Write(array, offset, count);
	}
	//---------------------------------------------------------
	// Override Write
	//---------------------------------------------------------
	this.Write = function (array, offset, count) {
		/// <summary>Writes compressed bytes to the underlying stream from the specified byte array.</summary>
		/// <param name="array">The array used to store compressed bytes.</param>
		/// <param name="offset">The location in the array to begin reading.</param>
		/// <param name="count">The number of bytes to compress.</param>
		EnsureCompressionMode.apply(this);
		ValidateParameters.apply(this, [array, offset, count]);
		InternalWrite.apply(this, [array, offset, count, false]);
	};
	//---------------------------------------------------------
	function InternalWrite(array, offset, count) {
		var deflateOutput = 0;
		DoMaintenance.apply(this, [array, offset, count]);
		while (!deflater.NeedsInput()) {
			deflateOutput = deflater.GetDeflateOutput(buffer);
			if (deflateOutput !== 0) {
				DoWrite.apply(this, [buffer, 0, deflateOutput]);
			}
		}
		deflater.SetInput(array, offset, count);
		while (!deflater.NeedsInput()) {
			deflateOutput = deflater.GetDeflateOutput(buffer);
			if (deflateOutput !== 0) {
				DoWrite.apply(this, [buffer, 0, deflateOutput]);
			}
		}
	}
	//---------------------------------------------------------
	this.Initialize = function (stream, mode, leaveOpen) {
		/// <summary>
		/// Initializes a new instance of the DeflateStream class using the specified stream and CompressionMode value, and a value that specifies whether to leave the stream open.
		/// </summary>
		/// <param name="stream">The stream to compress or decompress.</param>
		/// <param name="mode">One of the CompressionMode values that indicates the action to take.</param>
		/// <param name="leaveOpen">true to leave the stream open; otherwise, false.</param>
		this._stream = stream;
		this._mode = mode;
		this._leaveOpen = leaveOpen;
		var SR = System.SR;
		if (this._stream === null) {
			throw new System.ArgumentNullException("stream");
		}
		switch (this._mode) {
			case System.IO.Compression.CompressionMode.Decompress:
				if (!this._stream.CanRead) {
					throw new System.ArgumentException(SR.GetString("NotReadableStream"), "stream");
				}
				inflater = new System.IO.Compression.Inflater();
				break;
			case System.IO.Compression.CompressionMode.Compress:
				if (!this._stream.CanWrite) {
					throw new System.ArgumentException(SR.GetString("NotWriteableStream"), "stream");
				}
				deflater = new System.IO.Compression.Deflater();
				break;

			default:
				throw new System.ArgumentException(SR.GetString("ArgumentOutOfRange_Enum"), "mode");
		}
		buffer = new System.Byte(0x1000);
	};
	this.Initialize.apply(this, arguments);
};
System.Type.RegisterClass("System.IO.Compression.DeflateStream");

//=============================================================================
// CLASS: System.IO.Compression.InputBuffer
//-----------------------------------------------------------------------------

System.IO.Compression.InputBuffer = function () {
	/// <summary>UNTESTED!</summary>
	//---------------------------------------------------------
	var bitBuffer = 0; //uint
	var bitsInBuffer = 0; //int
	this.buffer = new System.Byte(); // byte[]
	var end = 0; //int
	var start = 0; //int
	this.AvailableBits = 0;
	this.AvailableBytes = 0;
	//---------------------------------------------------------
	this.CopyTo = function (output, offset, length) {
		var num = 0;
		while (bitsInBuffer > 0 && length > 0) {
			output[offset++] = bitBuffer & 0xff; // (byte)
			bitBuffer = bitBuffer >> 8;
			bitsInBuffer -= 8;
			length--;
			num++;
		}
		if (length === 0) {
			setAvailable.apply(this);
			return num;
		}
		var num2 = end - start;
		if (length > num2) {
			length = num2;
		}
		Array.Copy(this.buffer, start, output, offset, length);
		start += length;
		setAvailable.apply(this);
		return num + length;
	};
	//---------------------------------------------------------
	this.EnsureBitsAvailable = function (count) {
		if (bitsInBuffer < count) {
			if (this.NeedsInput()) {
				setAvailable.apply(this);
				return false;
			}
			bitBuffer |= this.buffer[start++] << bitsInBuffer; //(uint)
			bitsInBuffer += 8;
			if (bitsInBuffer < count) {
				if (this.NeedsInput()) {
					setAvailable.apply(this);
					return false;
				}
				bitBuffer |= this.buffer[start++] << bitsInBuffer; //(uint)
				bitsInBuffer += 8;
			}
		}
		setAvailable.apply(this);
		return true;
	};
	//---------------------------------------------------------
	this.GetBitMask = function (count) {
		return (1 << count) - 1; // (uint)
	};
	//---------------------------------------------------------
	this.GetBits = function (count) {
		if (!this.EnsureBitsAvailable(count)) {
			return -1;
		}
		var num = bitBuffer & this.GetBitMask(count); // (int)
		bitBuffer = bitBuffer >> count;
		bitsInBuffer -= count;
		setAvailable.apply(this);
		return num;
	};
	//---------------------------------------------------------
	this.NeedsInput = function () {
		return start === end;
	};
	//---------------------------------------------------------
	this.SetInput = function (buff, offset, length) {
		this.buffer = buff;
		start = offset;
		end = offset + length;
		setAvailable.apply(this);
	};
	//---------------------------------------------------------
	this.SkipBits = function (n) {
		bitBuffer = bitBuffer >> n;
		bitsInBuffer -= n;
		setAvailable.apply(this);
	};
	//---------------------------------------------------------
	this.SkipToByteBoundary = function () {
		bitBuffer = bitBuffer >> bitsInBuffer % 8;
		bitsInBuffer -= bitsInBuffer % 8;
		setAvailable.apply(this);
	};
	//---------------------------------------------------------
	this.TryLoad16Bits = function () {
		if (bitsInBuffer < 8) {
			if (start < end) {
				bitBuffer |= this.buffer[start++] << bitsInBuffer; //(uint)
				bitsInBuffer += 8;
			}
			if (start < end) {
				bitBuffer |= this.buffer[start++] << bitsInBuffer; // (uint)
				bitsInBuffer += 8;
			}
		}
		else if (bitsInBuffer < 0x10 && start < end) {
			bitBuffer |= this.buffer[start++] << bitsInBuffer; //(uint)
			bitsInBuffer += 8;
		}
		setAvailable.apply(this);
		return bitBuffer;
	};
	//---------------------------------------------------------
	function setAvailable() {
		this.AvailableBits = bitsInBuffer;
		this.AvailableBytes = end - start + bitsInBuffer / 8;
	}
};
System.Type.RegisterClass("System.IO.Compression.InputBuffer");

//=============================================================================
// CLASS: System.IO.Compression.OutputBuffer
//-----------------------------------------------------------------------------

System.IO.Compression.OutputBuffer = function OutputBuffer() {
	var bitBuf = 0; // uint
	var bitCount = 0; //int
	this.byteBuffer = new System.Byte(); //byte()
	var pos = 0; // int
	//---------------------------------------------------------
	this.DumpState = function () // BufferState
	{
		var state = new System.IO.Compression.BufferState();
		state.pos = pos;
		state.bitBuf = bitBuf;
		state.bitCount = bitCount;
		return state;
	};
	//---------------------------------------------------------
	this.FlushBits = function () {
		while (bitCount >= 8) {
			this.byteBuffer[pos++] = bitBuf & 0xff; // (byte) 
			bitCount -= 8;
			bitBuf = bitBuf >> 8;
		}
		if (bitCount > 0) {
			this.byteBuffer[pos++] = bitBuf & 0xff; // (byte)
			bitBuf = 0;
			bitCount = 0;
		}
	};
	//---------------------------------------------------------
	this.RestoreState = function (state) // BufferState 
	{
		pos = state.pos;
		bitBuf = state.bitBuf;
		bitCount = state.bitCount;
	};
	//---------------------------------------------------------
	this.UpdateBuffer = function (output) // byte[] 
	{
		this.byteBuffer = output;
		pos = 0;
	};
	//---------------------------------------------------------
	this.WriteBits = function (n, bits) //int n, uint bits
	{
		bitBuf |= bits << bitCount;
		bitCount += n;
		if (bitCount >= 0x10) {
			this.byteBuffer[pos++] = bitBuf & 0xff; // (byte)
			this.byteBuffer[pos++] = bitBuf >> 8 & 0xff; // (byte)
			bitCount -= 0x10;
			bitBuf = bitBuf >> 0x10;
		}
	};
	//---------------------------------------------------------
	this.WriteBytes = function (byteArray, offset, count) // byte[] byteArray, int offset, int count
	{
		if (bitCount === 0) {
			System.Array.Copy(byteArray, offset, this.byteBuffer, pos, count);
			pos += count;
		}
		else {
			this.WriteBytesUnaligned(byteArray, offset, count);
		}
	};
	//---------------------------------------------------------
	this.WriteBytesUnaligned = function (byteArray, offset, count) // byte[] byteArray, int offset, int count
	{
		for (var i = 0; i < count; i++) {
			var b = byteArray[offset + i];
			this.WriteByteUnaligned(b);
		}
	};
	//---------------------------------------------------------
	this.WriteByteUnaligned = function (b) // byte 
	{
		this.WriteBits(8, b);
	};
	//---------------------------------------------------------
	this.WriteUInt16 = function (value) // ushort value
	{
		this.byteBuffer[pos++] = value & 0xff; //(byte)
		this.byteBuffer[pos++] = value >> 8 & 0xff; //(byte)
	};
	//---------------------------------------------------------
	this.BitsInBuffer = function () {
		return bitCount / 8 + 1;
	};
	//---------------------------------------------------------
	this.BytesWritten = function () {
		return pos;
	};
	//---------------------------------------------------------
	this.FreeBytes = function () {
		return this.byteBuffer.length - pos;
	};

};
System.Type.RegisterClass("System.IO.Compression.OutputBuffer");


System.IO.Compression.BufferState = function () {
	this.pos = 0; //int
	this.bitBuf = 0; //uint
	this.bitCount = 0; //int
};
System.Type.RegisterClass("System.IO.Compression.OutputBuffer");

//=============================================================================
// CLASS: System.IO.Compression.OutputBuffer
//-----------------------------------------------------------------------------


System.IO.Compression.FastEncoderStatics = function () { };
System.Type.RegisterClass("System.IO.Compression.FastEncoderStatics");

System.IO.Compression.FastEncoderStatics.Initialized = false;
System.IO.Compression.FastEncoderStatics.FastEncoderStatics = function () {
	if (System.IO.Compression.FastEncoderStatics.Initialized) return;
	System.IO.Compression.FastEncoderStatics.GenerateSlotTables();
	System.IO.Compression.FastEncoderStatics.Initialized = true;
};


System.IO.Compression.FastEncoderStatics.BFinalFastEncoderTreeStructureData = [
	0xed, 0xbd, 7, 0x60, 0x1c, 0x49, 150, 0x25, 0x26, 0x2f, 0x6d, 0xca, 0x7b, 0x7f, 0x4a, 0xf5,
	0x4a, 0xd7, 0xe0, 0x74, 0xa1, 8, 0x80, 0x60, 0x13, 0x24, 0xd8, 0x90, 0x40, 0x10, 0xec, 0xc1,
	0x88, 0xcd, 230, 0x92, 0xec, 0x1d, 0x69, 0x47, 0x23, 0x29, 0xab, 0x2a, 0x81, 0xca, 0x65, 0x56,
	0x65, 0x5d, 0x66, 0x16, 0x40, 0xcc, 0xed, 0x9d, 0xbc, 0xf7, 0xde, 0x7b, 0xef, 0xbd, 0xf7, 0xde,
	0x7b, 0xef, 0xbd, 0xf7, 0xba, 0x3b, 0x9d, 0x4e, 0x27, 0xf7, 0xdf, 0xff, 0x3f, 0x5c, 0x66, 100,
	1, 0x6c, 0xf6, 0xce, 0x4a, 0xda, 0xc9, 0x9e, 0x21, 0x80, 170, 200, 0x1f, 0x3f, 0x7e, 0x7c,
	0x1f, 0x3f
];

System.IO.Compression.FastEncoderStatics.BFinalNoCompressionHeader = 1;
System.IO.Compression.FastEncoderStatics.BFinalNoCompressionHeaderBitCount = 3;

System.IO.Compression.FastEncoderStatics.BitMask = [0, 1, 3, 7, 15, 0x1f, 0x3f, 0x7f, 0xff, 0x1ff, 0x3ff, 0x7ff, 0xfff, 0x1fff, 0x3fff, 0x7fff];

System.IO.Compression.FastEncoderStatics.distLookup = new System.Byte(0x200);

System.IO.Compression.FastEncoderStatics.ExtraDistanceBits = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 0, 0];
System.IO.Compression.FastEncoderStatics.ExtraLengthBits = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0];

System.IO.Compression.FastEncoderStatics.FastEncoderDistanceCodeInfo = [
	0xf06, 0x1ff0a, 0x3ff0b, 0x7ff0b, 0xff19, 0x3f18, 0xbf28, 0x7f28, 0x1f37, 0x5f37, 0xd45, 0x2f46, 0x54, 0x1d55, 0x864, 0x365,
	0x474, 0x1375, 0xc84, 0x284, 0xa94, 0x694, 0xea4, 420, 0x9b4, 0xbb5, 0x5c4, 0x1bc5, 0x7d5, 0x17d5, 0, 0x100
];

System.IO.Compression.FastEncoderStatics.FastEncoderLiteralCodeInfo = [
	0xd7ee, 0x4d7ee, 0x2d7ee, 0x6d7ee, 0x1d7ee, 0x5d7ee, 0x3d7ee, 0x7d7ee, 0x37ee, 0xc7ec, 0x126, 0x437ee, 0x237ee, 0x637ee, 0x137ee, 0x537ee,
	0x337ee, 0x737ee, 0xb7ee, 0x4b7ee, 0x2b7ee, 0x6b7ee, 0x1b7ee, 0x5b7ee, 0x3b7ee, 0x7b7ee, 0x77ee, 0x477ee, 0x277ee, 0x677ee, 0x17ed, 0x177ee,
	0x526, 0x577ee, 0x23ea, 0x1c7ec, 0x377ee, 0x777ee, 0x217ed, 0x63ea, 0xb68, 0xee9, 0x5beb, 0x13ea, 0x467, 0x1b68, 0xc67, 0x2ee9,
	0x768, 0x1768, 0xf68, 0x1ee9, 0x1f68, 0x3ee9, 0x53ea, 0x1e9, 0xe8, 0x21e9, 0x11e9, 0x10e8, 0x31e9, 0x33ea, 0x8e8, 0xf7ee,
	0x4f7ee, 0x18e8, 0x9e9, 0x4e8, 0x29e9, 0x14e8, 0x19e9, 0x73ea, 0xdbeb, 0xce8, 0x3beb, 0x2f7ee, 0x39e9, 0xbea, 0x5e9, 0x4bea,
	0x25e9, 0x27ec, 0x15e9, 0x35e9, 0xde9, 0x2bea, 0x127ec, 0xbbeb, 0x6f7ee, 0x1f7ee, 0xa7ec, 0x7beb, 0x5f7ee, 0xfbeb, 0x3f7ee, 0x7f7ee,
	0xfee, 0x326, 0x267, 0xa67, 0x667, 0x726, 0x1ce8, 0x2e8, 0xe67, 0xa6, 0x1a7ec, 0x2de9, 0x4a6, 0x167, 0x967, 0x2a6,
	0x567, 0x117ed, 0x6a6, 0x1a6, 0x5a6, 0xd67, 0x12e8, 0xae8, 0x1de9, 0x1ae8, 0x7eb, 0x317ed, 0x67ec, 0x97ed, 0x297ed, 0x40fee,
	0x20fee, 0x60fee, 0x10fee, 0x50fee, 0x30fee, 0x70fee, 0x8fee, 0x48fee, 0x28fee, 0x68fee, 0x18fee, 0x58fee, 0x38fee, 0x78fee, 0x4fee, 0x44fee,
	0x24fee, 0x64fee, 0x14fee, 0x54fee, 0x34fee, 0x74fee, 0xcfee, 0x4cfee, 0x2cfee, 0x6cfee, 0x1cfee, 0x5cfee, 0x3cfee, 0x7cfee, 0x2fee, 0x42fee,
	0x22fee, 0x62fee, 0x12fee, 0x52fee, 0x32fee, 0x72fee, 0xafee, 0x4afee, 0x2afee, 0x6afee, 0x1afee, 0x5afee, 0x3afee, 0x7afee, 0x6fee, 0x46fee,
	0x26fee, 0x66fee, 0x16fee, 0x56fee, 0x36fee, 0x76fee, 0xefee, 0x4efee, 0x2efee, 0x6efee, 0x1efee, 0x5efee, 0x3efee, 0x7efee, 0x1fee, 0x41fee,
	0x21fee, 0x61fee, 0x11fee, 0x51fee, 0x31fee, 0x71fee, 0x9fee, 0x49fee, 0x29fee, 0x69fee, 0x19fee, 0x59fee, 0x39fee, 0x79fee, 0x5fee, 0x45fee,
	0x25fee, 0x65fee, 0x15fee, 0x55fee, 0x35fee, 0x75fee, 0xdfee, 0x4dfee, 0x2dfee, 0x6dfee, 0x1dfee, 0x5dfee, 0x3dfee, 0x7dfee, 0x3fee, 0x43fee,
	0x23fee, 0x63fee, 0x13fee, 0x53fee, 0x33fee, 0x73fee, 0xbfee, 0x4bfee, 0x2bfee, 0x6bfee, 0x1bfee, 0x5bfee, 0x3bfee, 0x7bfee, 0x7fee, 0x47fee,
	0x27fee, 0x67fee, 0x17fee, 0x197ed, 0x397ed, 0x57ed, 0x57fee, 0x257ed, 0x37fee, 0x157ed, 0x77fee, 0x357ed, 0xffee, 0x4ffee, 0x2ffee, 0x6ffee,
	0x1ffee, 0x84, 3, 0x184, 0x44, 0x144, 0xc5, 0x2c5, 0x1c5, 0x3c6, 0x7c6, 0x26, 0x426, 0x3a7, 0xba7, 0x7a7,
	0xfa7, 0x227, 0x627, 0xa27, 0xe27, 0x68, 0x868, 0x1068, 0x1868, 0x369, 0x1369, 0x2369, 0x3369, 0x6ea, 0x26ea, 0x46ea,
	0x66ea, 0x16eb, 0x36eb, 0x56eb, 0x76eb, 0x96eb, 0xb6eb, 0xd6eb, 0xf6eb, 0x3dec, 0x7dec, 0xbdec, 0xfdec, 0x13dec, 0x17dec, 0x1bdec,
	0x1fdec, 0x6bed, 0xebed, 0x16bed, 0x1ebed, 0x26bed, 0x2ebed, 0x36bed, 0x3ebed, 0x3ec, 0x43ec, 0x83ec, 0xc3ec, 0x103ec, 0x143ec, 0x183ec,
	0x1c3ec, 0x1bee, 0x9bee, 0x11bee, 0x19bee, 0x21bee, 0x29bee, 0x31bee, 0x39bee, 0x41bee, 0x49bee, 0x51bee, 0x59bee, 0x61bee, 0x69bee, 0x71bee,
	0x79bee, 0x167f0, 0x367f0, 0x567f0, 0x767f0, 0x967f0, 0xb67f0, 0xd67f0, 0xf67f0, 0x1167f0, 0x1367f0, 0x1567f0, 0x1767f0, 0x1967f0, 0x1b67f0, 0x1d67f0,
	0x1f67f0, 0x87ef, 0x187ef, 0x287ef, 0x387ef, 0x487ef, 0x587ef, 0x687ef, 0x787ef, 0x887ef, 0x987ef, 0xa87ef, 0xb87ef, 0xc87ef, 0xd87ef, 0xe87ef,
	0xf87ef, 0xe7f0, 0x2e7f0, 0x4e7f0, 0x6e7f0, 0x8e7f0, 0xae7f0, 0xce7f0, 0xee7f0, 0x10e7f0, 0x12e7f0, 0x14e7f0, 0x16e7f0, 0x18e7f0, 0x1ae7f0, 0x1ce7f0,
	0x1ee7f0, 0x5fff3, 0xdfff3, 0x15fff3, 0x1dfff3, 0x25fff3, 0x2dfff3, 0x35fff3, 0x3dfff3, 0x45fff3, 0x4dfff3, 0x55fff3, 0x5dfff3, 0x65fff3, 0x6dfff3, 0x75fff3,
	0x7dfff3, 0x85fff3, 0x8dfff3, 0x95fff3, 0x9dfff3, 0xa5fff3, 0xadfff3, 0xb5fff3, 0xbdfff3, 0xc5fff3, 0xcdfff3, 0xd5fff3, 0xddfff3, 0xe5fff3, 0xedfff3, 0xf5fff3,
	0xfdfff3, 0x3fff3, 0xbfff3, 0x13fff3, 0x1bfff3, 0x23fff3, 0x2bfff3, 0x33fff3, 0x3bfff3, 0x43fff3, 0x4bfff3, 0x53fff3, 0x5bfff3, 0x63fff3, 0x6bfff3, 0x73fff3,
	0x7bfff3, 0x83fff3, 0x8bfff3, 0x93fff3, 0x9bfff3, 0xa3fff3, 0xabfff3, 0xb3fff3, 0xbbfff3, 0xc3fff3, 0xcbfff3, 0xd3fff3, 0xdbfff3, 0xe3fff3, 0xebfff3, 0xf3fff3,
	0xfbfff3, 0x7fff3, 0xffff3, 0x17fff3, 0x1ffff3, 0x27fff3, 0x2ffff3, 0x37fff3, 0x3ffff3, 0x47fff3, 0x4ffff3, 0x57fff3, 0x5ffff3, 0x67fff3, 0x6ffff3, 0x77fff3,
	0x7ffff3, 0x87fff3, 0x8ffff3, 0x97fff3, 0x9ffff3, 0xa7fff3, 0xaffff3, 0xb7fff3, 0xbffff3, 0xc7fff3, 0xcffff3, 0xd7fff3, 0xdffff3, 0xe7fff3, 0xeffff3, 0xf7fff3,
	0xfffff3, 0x1e7f1, 0x3e7f1, 0x5e7f1, 0x7e7f1, 0x9e7f1, 0xbe7f1, 0xde7f1, 0xfe7f1, 0x11e7f1, 0x13e7f1, 0x15e7f1, 0x17e7f1, 0x19e7f1, 0x1be7f1, 0x1de7f1,
	0x1fe7f1, 0x21e7f1, 0x23e7f1, 0x25e7f1, 0x27e7f1, 0x29e7f1, 0x2be7f1, 0x2de7f1, 0x2fe7f1, 0x31e7f1, 0x33e7f1, 0x35e7f1, 0x37e7f1, 0x39e7f1, 0x3be7f1, 0x3de7f1,
	0x47eb
];
System.IO.Compression.FastEncoderStatics.FastEncoderPostTreeBitBuf = 0x22;
System.IO.Compression.FastEncoderStatics.FastEncoderPostTreeBitCount = 9;
System.IO.Compression.FastEncoderStatics.FastEncoderTreeStructureData = [
	0xec, 0xbd, 7, 0x60, 0x1c, 0x49, 150, 0x25, 0x26, 0x2f, 0x6d, 0xca, 0x7b, 0x7f, 0x4a, 0xf5,
	0x4a, 0xd7, 0xe0, 0x74, 0xa1, 8, 0x80, 0x60, 0x13, 0x24, 0xd8, 0x90, 0x40, 0x10, 0xec, 0xc1,
	0x88, 0xcd, 230, 0x92, 0xec, 0x1d, 0x69, 0x47, 0x23, 0x29, 0xab, 0x2a, 0x81, 0xca, 0x65, 0x56,
	0x65, 0x5d, 0x66, 0x16, 0x40, 0xcc, 0xed, 0x9d, 0xbc, 0xf7, 0xde, 0x7b, 0xef, 0xbd, 0xf7, 0xde,
	0x7b, 0xef, 0xbd, 0xf7, 0xba, 0x3b, 0x9d, 0x4e, 0x27, 0xf7, 0xdf, 0xff, 0x3f, 0x5c, 0x66, 100,
	1, 0x6c, 0xf6, 0xce, 0x4a, 0xda, 0xc9, 0x9e, 0x21, 0x80, 170, 200, 0x1f, 0x3f, 0x7e, 0x7c,
	0x1f, 0x3f
];
System.IO.Compression.FastEncoderStatics.MaxCodeLen = 0x10;
System.IO.Compression.FastEncoderStatics.NoCompressionHeader = 0;
System.IO.Compression.FastEncoderStatics.NoCompressionHeaderBitCount = 3;
System.IO.Compression.FastEncoderStatics.NumChars = 0x100;
System.IO.Compression.FastEncoderStatics.NumDistBaseCodes = 30;
System.IO.Compression.FastEncoderStatics.NumLengthBaseCodes = 0x1d;

System.IO.Compression.FastEncoderStatics.BitReverse = function (code, length) //uint code, int length
{
	var num = 0;
	do {
		num |= code & 1;
		num = num << 1;
		code = code >> 1;
	}
	while (--length > 0);
	return num >> 1;
};

System.IO.Compression.FastEncoderStatics.GenerateSlotTables = function () {
	var num = 0;
	var index = 0;
	while (index < 0x10) {
		for (var i = 0; i < 1 << System.IO.Compression.FastEncoderStatics.ExtraDistanceBits[index]; i++) {
			System.IO.Compression.FastEncoderStatics.distLookup[num++] = index;
		}
		index++;
	}
	num = num >> 7;
	while (index < 30) {
		for (var j = 0; j < 1 << System.IO.Compression.FastEncoderStatics.ExtraDistanceBits[index] - 7; j++) {
			System.IO.Compression.FastEncoderStatics.distLookup[0x100 + num++] = index;
		}
		index++;
	}
};

System.IO.Compression.FastEncoderStatics.GetSlot = function (pos) {
	return System.IO.Compression.FastEncoderStatics.distLookup[pos < 0x100 ? pos : 0x100 + (pos >> 7)];
};
//=============================================================================
// CLASS: System.IO.Compression.OutputWindow
//-----------------------------------------------------------------------------

System.IO.Compression.OutputWindow = function () {
	this.AvailableBytes = 0;
	this.FreeBytes = 0x8000;
	var bytesUsed = 0;
	var end = 0;
	this.window = new System.Byte(0x8000);
	var WindowMask = 0x7fff;
	var WindowSize = 0x8000;
	//---------------------------------------------------------
	function OutputWindow() {
		setBytesUsed.apply(this);
	}
	//---------------------------------------------------------
	this.CopyFrom = function (input, length) // InputBuffer input, int length
	{
		var num = 0;
		length = Math.min(Math.min(length, 0x8000 - bytesUsed), input.AvailableBytes);
		var num2 = 0x8000 - end;
		if (length > num2) {
			num = input.CopyTo(this.window, end, num2);
			if (num === num2) {
				num += input.CopyTo(this.window, 0, length - num2);
			}
		}
		else {
			num = input.CopyTo(this.window, end, length);
		}
		end = end + num & 0x7fff;
		bytesUsed += num;
		setBytesUsed.apply(this);
		return num;
	};
	//---------------------------------------------------------
	this.CopyTo = function (output, offset, length) // byte[] output, int offset, int length
	{
		var end2 = 0;
		if (length > bytesUsed) {
			end2 = end;
			length = bytesUsed;
		}
		else {
			end2 = end - bytesUsed + length & 0x7fff;
		}
		var num2 = length;
		var num3 = length - end2;
		if (num3 > 0) {
			System.Array.Copy(this.window, 0x8000 - num3, output, offset, num3);
			offset += num3;
			length = end2;
		}
		System.Array.Copy(this.window, end2 - length, output, offset, length);
		bytesUsed -= num2;
		setBytesUsed.apply(this);
		return num2;
	};
	//---------------------------------------------------------
	this.Write = function (b) //byte b
	{
		this.window[end++] = b;
		end &= 0x7fff;
		bytesUsed++;
		setBytesUsed.apply(this);
	};
	//---------------------------------------------------------
	this.WriteLengthDistance = function (length, distance) //int length, int distance
	{
		bytesUsed += length;
		setBytesUsed.apply(this);
		var sourceIndex = end - distance & 0x7fff;
		var num2 = 0x8000 - length;
		if (sourceIndex <= num2 && end < num2) {
			if (length > distance) {
				while (length-- > 0) {
					this.window[end++] = this.window[sourceIndex++];
				}
			}
			else {
				System.Array.Copy(this.window, sourceIndex, this.window, end, length);
				end += length;
			}
		}
		else {
			while (length-- > 0) {
				this.window[end++] = this.window[sourceIndex++];
				end &= 0x7fff;
				sourceIndex &= 0x7fff;
			}
		}
	};
	//---------------------------------------------------------
	function setBytesUsed() {
		this.AvailableBytes = bytesUsed;
		this.FreeBytes = 0x8000 - bytesUsed;
	}
	//---------------------------------------------------------
	OutputWindow.apply(this, arguments);
};

//==============================================================================
// END
//------------------------------------------------------------------------------
