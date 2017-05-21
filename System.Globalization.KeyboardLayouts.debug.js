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
//		<RootNamespace>System.Globalization.KeyboardLayouts</RootNamespace>
// <PropertyGroup>
//-----------------------------------------------------------------------------
System.Type.RegisterNamespace("System.Globalization.KeyboardLayouts");
//=============================================================================

//-----------------------------------------------------------------------------
// This class is used by System.Web.UI.ShortKeys for keys remapping.
//=============================================================================
// Layouts list can be found in registry:
// HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Keyboard Layouts
// Each keyboard layout is attached to culture.
// System.Globalization.CultureInfo.GetCultureInfo(N).KeyboardLayoutId
// About Imput Locales:
// http://www.microsoft.com/globaldev/getWR/steps/WRG_kybrd.mspx
// Language Identifier Constants and Strings:
//http://msdn.microsoft.com/library/en-us/intl/nls_61df.asp?frame=true
// National Language Support Reference:
// http://msdn.microsoft.com/library/default.asp?url=/library/en-us/intl/nls_9w2t.asp
// National Language Support Constants:
//     Locale Information
//     Day, Month, Year, and Era Format Pictures
//     Hour, Minute, and Second Format Pictures
//     Locale Identifier Constants and Strings
//     Language Identifier Constants and Strings
//     Table of Geographical Locations
//     Sort Order Identifiers
//     Calendar Identifiers
//     Calendar Type Information
//     Paper Sizes
// http://msdn.microsoft.com/library/default.asp?url=/library/en-us/intl/nls_8dkj.asp

/*
Input locale identifier is a 32-bit number:
ImputMethodId: 16-bit, SubLanguageId: 6 bit, PrimaryLanguageId: 10-bit
for example:
United States-International:
0x00020409 = 0000000000000010 000001 0000001001
Greek Latin:
0x00050408 = 0000000000000101 000001 0000001000
Chinese (Traditional) - Unicode:
0xE0070404 = 1110000000000111 000001 0000000100

Locale Identifier, Script Tag, ANSi code Page, Locale Locale Name:
Lithuanian: PrimaryLanguageId: 0x27 [0000100111]
0x00427, lt-LT, Latn, 1257, Lithuanian (Lithuania)
0x50427, lt-GB, Latn, 1257, Lithuanian (United Kingdom)
0x60427, lt-FR, Latn, 1257, Lithuanian (France)

0x00419, ru-RU, Cyrl, 1251, Russian (Russia)
0x30419, ru-RU-Ph, Cyrl, 1251, Russian Phonetic (United Kingdom)
Russian: PrimaryLanguageId: 0x19 [0000011001]

Reserved bytes:
0x0C00 - LOCALE_CUSTOM_DEFAULT - Default custom locale
0x1400 - LOCALE_CUSTOM_UI_DEFAULT - Default custom Multilingual User Interface (MUI) locale
0x007f - LOCALE_INVARIANT - Invariant locale
0x0000 - LOCALE_NEUTRAL - Neutral locale
0x0800 - LOCALE_SYSTEM_DEFAULT - System default language
0x1000 - LOCALE_CUSTOM_UNSPECIFIED - Unspecified custom locale
0x0400 - LOCALE_USER_DEFAULT - User (or process) default locale

Note: As you see Lithuanian and Russian has bytes 04 - LOCALE_USER_DEFAULT.

*/

//=============================================================================

// Make sure that the base namespace exists.
System.Type.RegisterNamespace("System.Globalization.KeyboardLayouts.Layout");

System.Globalization.KeyboardLayouts.Maps = {};

// Template Layout;
System.Globalization.KeyboardLayouts.Layout = function (layoutId) {
	this.LayoutName = "English";
	this.Culture = "en";
	this.Keys = {};
	//---------------------------------------------------------
	// METHOD: Load
	//---------------------------------------------------------
	this.Load = function (layoutId) {
		Trace.Write("call " + this.GetType().Name + ".Load('" + layoutId + "')");
		this.Keys = {};
		// If id was specified as string then...
		if (typeof layoutId === "string") {
			for (var idx in System.Globalization.KeyboardLayouts.Maps) {
				layoutName = System.Globalization.KeyboardLayouts.Maps[idx].LayoutName;
				//Trace.Write(layoutName);
				// If name was found then...
				if (layoutId === layoutName) {
					layoutId = idx;
					break;
				}
			}
		}
		Trace.Write("// Layout Id: " + layoutId);
		// If layout id is number then...
		if (!isNaN(layoutId)) {
			var layout = System.Globalization.KeyboardLayouts.Maps[layoutId];
			for (var code in layout.Keys) {
				this.Keys[code] = layout.Keys[code];
			}

		}
	};
	//---------------------------------------------------------
	// METHOD: InitializeClass.
	//---------------------------------------------------------
	this.AddKey = function (keys, value) {
		var code = 0;
		var j;
		var i;
		if (typeof keys === "number") {
			code = keys;
		} else if (typeof keys === "string") {
			j = keys.length;
			for (i = 0; i < j; i++) {
				// Shift number by 8 bits to left.
				if (i > 0) code = code << 8;
				code = code | keys.charCodeAt(i);
				//Trace.Write(code.toString(16));
			}
		} else {
			// Treat keys as array.
			j = keys.length;
			for (i = 0; i < j; i++) {
				// Shift number by 8 bits to left.
				if (i > 0) code = code << 8;
				code = code | keys[i].charCodeAt(0);
				//Trace.Write(code.toString(16));
			}
		}
		this.Keys[code] = value;
	};
	//---------------------------------------------------------
	// METHOD: ShowKeys
	//---------------------------------------------------------
	this.Show = function () {
		for (var code in this.Keys) {
			var value = this.Keys[code];
			value = typeof value === "string" ? "\"" + value + "\"" : value;
			Trace.Write("Keys[0x" + code.toString(16) + "] = " + value + "; // " + String.fromCharCode(code) + " - " + String.fromCharCode(value));
		}
	};
	//---------------------------------------------------------
	// INIT: Class.
	//---------------------------------------------------------
	this.InitializeClass = function () {
		this.Load(arguments[0]);
	};
	this.InitializeClass.apply(this, arguments);
};
System.Type.RegisterClass("System.Globalization.KeyboardLayouts.Layout");


// Static Data
System.Globalization.KeyboardLayouts.Maps[0x00000419] = {
	LayoutName: "United Kingdom",
	Culture: "gb",
	// Map keys.
	Keys: {
		0xdf: 0x60, // OEM_8 - `
		0x31: 0x31, // 1 - 1
		0x32: 0x32, // 2 - 2
		0x33: 0x33, // 3 - 3
		0x34: 0x34, // 4 - 4
		0x35: 0x35, // 5 - 5
		0x36: 0x36, // 6 - 6
		0x37: 0x37, // 7 - 7
		0x38: 0x38, // 8 - 8
		0x39: 0x39, // 9 - 9
		0x30: 0x30, // 0 - 0
		0x6d: 0x2d, // SUBTRACT - -
		0x3d: 0x3d, // EQUALS - =
		0x51: 0x71, // Q - q
		0x57: 0x77, // W - w
		0x45: 0x65, // E - e
		0x52: 0x72, // R - r
		0x54: 0x74, // T - t
		0x59: 0x79, // Y - y
		0x55: 0x75, // U - u
		0x49: 0x69, // I - i
		0x4f: 0x6f, // O - o
		0x50: 0x70, // P - p
		0xdb: 0x5b, // OEM_4 - [
		0xdd: 0x5d, // OEM_6 - ]
		0x41: 0x61, // A - a
		0x53: 0x73, // S - s
		0x44: 0x64, // D - d
		0x46: 0x66, // F - f
		0x47: 0x67, // G - g
		0x48: 0x68, // H - h
		0x4a: 0x6a, // J - j
		0x4b: 0x6b, // K - k
		0x4c: 0x6c, // L - l
		0x3b: 0x3b, // SEMICOLON - ;
		0xc0: 0x27, // OEM_3 - '
		0xde: 0x23, // OEM_7 - #
		0x5a: 0x7a, // Z - z
		0x58: 0x78, // X - x
		0x43: 0x63, // C - c
		0x56: 0x76, // V - v
		0x42: 0x62, // B - b
		0x4e: 0x6e, // N - n
		0x4d: 0x6d, // M - m
		0xbc: 0x2c, // OEM_COMMA - ,
		0xbe: 0x2e, // OEM_PERIOD - .
		0xbf: 0x2f, // OEM_2 - /
		0x10df: 0xac, // SHIFT+OEM_8 - ¬
		0x1031: 0x21, // SHIFT+1 - !
		0x1032: 0x22, // SHIFT+2 - "
		0x1033: 0xa3, // SHIFT+3 - £
		0x1034: 0x24, // SHIFT+4 - $
		0x1035: 0x25, // SHIFT+5 - %
		0x1036: 0x5e, // SHIFT+6 - ^
		0x1037: 0x26, // SHIFT+7 - &
		0x1038: 0x2a, // SHIFT+8 - *
		0x1039: 0x28, // SHIFT+9 - (
		0x1030: 0x29, // SHIFT+0 - )
		0x106d: 0x5f, // SUBTRACT+SHIFT - _
		0x103d: 0x2b, // SHIFT+EQUALS - +
		0x1051: 0x51, // SHIFT+Q - Q
		0x1057: 0x57, // SHIFT+W - W
		0x1045: 0x45, // SHIFT+E - E
		0x1052: 0x52, // SHIFT+R - R
		0x1054: 0x54, // SHIFT+T - T
		0x1059: 0x59, // SHIFT+Y - Y
		0x1055: 0x55, // SHIFT+U - U
		0x1049: 0x49, // SHIFT+I - I
		0x104f: 0x4f, // SHIFT+O - O
		0x1050: 0x50, // SHIFT+P - P
		0x10db: 0x7b, // SHIFT+OEM_4 - {
		0x10dd: 0x7d, // SHIFT+OEM_6 - }
		0x1041: 0x41, // SHIFT+A - A
		0x1053: 0x53, // SHIFT+S - S
		0x1044: 0x44, // SHIFT+D - D
		0x1046: 0x46, // SHIFT+F - F
		0x1047: 0x47, // SHIFT+G - G
		0x1048: 0x48, // SHIFT+H - H
		0x104a: 0x4a, // SHIFT+J - J
		0x104b: 0x4b, // SHIFT+K - K
		0x104c: 0x4c, // SHIFT+L - L
		0x103b: 0x3a, // SHIFT+SEMICOLON - :
		0x10c0: 0x40, // SHIFT+OEM_3 - @
		0x10de: 0x7e, // SHIFT+OEM_7 - ~
		0x10dc: 0x7c, // SHIFT+OEM_5 - |
		0x105a: 0x5a, // SHIFT+Z - Z
		0x1058: 0x58, // SHIFT+X - X
		0x1043: 0x43, // SHIFT+C - C
		0x1056: 0x56, // SHIFT+V - V
		0x1042: 0x42, // SHIFT+B - B
		0x104e: 0x4e, // SHIFT+N - N
		0x104d: 0x4d, // SHIFT+M - M
		0x10bc: 0x3c, // SHIFT+OEM_COMMA - <
		0x10be: 0x3e, // SHIFT+OEM_PERIOD - >
		0x10bf: 0x3f // SHIFT+OEM_2 - ?
	}
};

// Static Data
System.Globalization.KeyboardLayouts.Maps[0x00020419] = {
	LayoutName: "Russian (Phonetic UK)",
	Culture: "ru-GB",
	// Map keys.
	Keys: {
		0xc0: 0x44e, // OEM_3 - ю
		0x31: 0x31, // 1 - 1
		0x32: 0x32, // 2 - 2
		0x33: 0x33, // 3 - 3
		0x34: 0x34, // 4 - 4
		0x35: 0x35, // 5 - 5
		0x36: 0x36, // 6 - 6
		0x37: 0x37, // 7 - 7
		0x38: 0x38, // 8 - 8
		0x39: 0x39, // 9 - 9
		0x30: 0x30, // 0 - 0
		0x6d: 0x2d, // SUBTRACT - -
		0x3d: 0x3d, // EQUALS - =
		0x51: 0x44f, // Q - я
		0x57: 0x436, // W - ж
		0x45: 0x435, // E - е
		0x52: 0x440, // R - р
		0x54: 0x442, // T - т
		0x59: 0x44b, // Y - ы
		0x55: 0x443, // U - у
		0x49: 0x438, // I - и
		0x4f: 0x43e, // O - о
		0x50: 0x43f, // P - п
		0xdb: 0x448, // OEM_4 - ш
		0xdd: 0x449, // OEM_6 - щ
		0x41: 0x430, // A - а
		0x53: 0x441, // S - с
		0x44: 0x434, // D - д
		0x46: 0x444, // F - ф
		0x47: 0x433, // G - г
		0x48: 0x445, // H - х
		0x4a: 0x439, // J - й
		0x4b: 0x43a, // K - к
		0x4c: 0x43b, // L - л
		0x3b: 0x447, // SEMICOLON - ч
		0xde: 0x451, // OEM_7 - ё
		0xdc: 0x44d, // OEM_5 - э
		0xe2: 0x5c, // OEM_102 - \
		0x5a: 0x437, // Z - з
		0x58: 0x44c, // X - ь
		0x43: 0x446, // C - ц
		0x56: 0x432, // V - в
		0x42: 0x431, // B - б
		0x4e: 0x43d, // N - н
		0x4d: 0x43c, // M - м
		0xbc: 0x2c, // OEM_COMMA - ,
		0xbe: 0x2e, // OEM_PERIOD - .
		0xbf: 0x44a, // OEM_2 - ъ
		// [SHIFT]+...
		0x10c0: 0x42e, // SHIFT+OEM_3 - Ю
		0x1031: 0x21, // SHIFT+1 - !
		0x1032: 0x22, // SHIFT+2 - "
		0x1033: 0xa3, // SHIFT+3 - £
		0x1034: 0x24, // SHIFT+4 - $
		0x1035: 0x25, // SHIFT+5 - %
		0x1036: 0x5e, // SHIFT+6 - ^
		0x1037: 0x26, // SHIFT+7 - &
		0x1038: 0x2a, // SHIFT+8 - *
		0x1039: 0x28, // SHIFT+9 - (
		0x1030: 0x29, // SHIFT+0 - )
		0x6d10: 0x5f, // SUBTRACT+SHIFT - _
		0x103d: 0x2b, // SHIFT+EQUALS - +
		0x1051: 0x42f, // SHIFT+Q - Я
		0x1057: 0x416, // SHIFT+W - Ж
		0x1045: 0x415, // SHIFT+E - Е
		0x1052: 0x420, // SHIFT+R - Р
		0x1054: 0x422, // SHIFT+T - Т
		0x1059: 0x42b, // SHIFT+Y - Ы
		0x1055: 0x423, // SHIFT+U - У
		0x1049: 0x418, // SHIFT+I - И
		0x104f: 0x41e, // SHIFT+O - О
		0x1050: 0x41f, // SHIFT+P - П
		0x10db: 0x428, // SHIFT+OEM_4 - Ш
		0x10dd: 0x429, // SHIFT+OEM_6 - Щ
		0x1041: 0x410, // SHIFT+A - А
		0x1053: 0x421, // SHIFT+S - С
		0x1044: 0x414, // SHIFT+D - Д
		0x1046: 0x424, // SHIFT+F - Ф
		0x1047: 0x413, // SHIFT+G - Г
		0x1048: 0x425, // SHIFT+H - Х
		0x104a: 0x419, // SHIFT+J - Й
		0x104b: 0x41a, // SHIFT+K - К
		0x104c: 0x41b, // SHIFT+L - Л
		0x103b: 0x427, // SHIFT+SEMICOLON - Ч
		0x10de: 0x401, // SHIFT+OEM_7 - Ё
		0x10dc: 0x42d, // SHIFT+OEM_5 - Э
		0x10e2: 0x7c, // SHIFT+OEM_102 - |
		0x105a: 0x417, // SHIFT+Z - З
		0x1058: 0x42c, // SHIFT+X - Ь
		0x1043: 0x426, // SHIFT+C - Ц
		0x1056: 0x412, // SHIFT+V - В
		0x1042: 0x411, // SHIFT+B - Б
		0x104e: 0x41d, // SHIFT+N - Н
		0x104d: 0x41c, // SHIFT+M - М
		0x10bc: 0x3c, // SHIFT+OEM_COMMA - <
		0x10be: 0x3e, // SHIFT+OEM_PERIOD - >
		0x10bf: 0x42a // SHIFT+OEM_2 - Ъ
	}
};


System.Globalization.KeyboardLayouts.Maps[0x00000427] = {
	LayoutName: "Lithuanian (UK)",
	Culture: "lt-GB",
	// Map keys.
	Keys: {
		0x31: 0x105, // 1 - ą
		0x32: 0x10d, // 2 - č
		0x33: 0x119, // 3 - ę
		0x34: 0x117, // 4 - ė
		0x35: 0x12f, // 5 - į
		0x36: 0x161, // 6 - š
		0x37: 0x173, // 7 - ų
		0x38: 0x16b, // 8 - ū
		0x3d: 0x17e, // EQUALS - ž
		0x1031: 0x104, // SHIFT+1 - Ą
		0x1032: 0x10c, // SHIFT+2 - Č
		0x1033: 0x118, // SHIFT+3 - Ę
		0x1034: 0x116, // SHIFT+4 - Ė
		0x1035: 0x12e, // SHIFT+5 - Į
		0x1036: 0x160, // SHIFT+6 - Š
		0x1037: 0x172, // SHIFT+7 - Ų
		0x1038: 0x16a, // SHIFT+8 - Ū
		0x103d: 0x17d // SHIFT+EQUALS - Ž
	}
};

//==============================================================================
// END
//------------------------------------------------------------------------------