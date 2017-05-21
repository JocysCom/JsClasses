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
//		<RootNamespace>System.Text</RootNamespace>
// <PropertyGroup>
//-----------------------------------------------------------------------------

System.Type.RegisterNamespace("System.Text");

// HtmlDecode http://lab.msdn.microsoft.com/annotations/htmldecode.js
//   client side version of the useful Server.HtmlDecode method
//   takes one string (encoded) and returns another (decoded)

System.Text.PadZeros = function (num, totalLen) {
	/// <summary>
	/// This function returns a string padded with leading zeros
	/// </summary>
	// Initialize return value as string
	var numStr = num.toString();
	var numZeros = totalLen - numStr.length; // Calculate no. of zeros
	if (numZeros > 0) {
		for (var i = 1; i <= numZeros; i++) {
			numStr = "0" + numStr;
		}
	}
	return numStr;
};

System.Text.Trim = function (valText, valSymbols) {
	/// <summary>
	/// Trim symbols from string.
	/// </summary>
	if (valSymbols === null) valSymbols = " ";
	var trimS = new RegExp("^[" + valSymbols + "]+", "g");
	var trimE = new RegExp("[" + valSymbols + "]+$", "g");
	var newText = "";
	newText = valText.replace(trimS, "");
	newText = newText.replace(trimE, "");
	return newText;
};

System.Text.ToTitleCase = function (s) {
	/// <summary>
	/// Converts the first character of a word to uppercase in the string.
	/// </summary>
	var r1 = new RegExp("([A-Z])([A-Z]+)", "ig");
	// Declare private function ConvertCase.
	function ConvertCase(a, b, c) {
		// b = $1, c = $2.
		return b.toUpperCase() + c.toLowerCase();
	}
	var results = s.replace(r1, ConvertCase);
	return results;
};


System.Text.ToCamelCase = function (s) {
	/// <summary>
	/// Camel words of the string (firstLetterIsLowerRestCapital).
	/// </summary>
	var r1 = new RegExp("([A-Z])([A-Z]+)", "ig");
	// Declare private function ConvertCase.
	function ConvertCase(a, b, c) {
		// b = $1, c = $2.
		return b.toUpperCase() + c.toLowerCase();
	}
	var results = s.replace(r1, ConvertCase);
	return results;
};

System.Text.HtmlSymbolCodes = {
	/// <summary>
	/// 
	/// </summary>
	0x0022: "quot",
	0x0026: "amp",
	0x003c: "lt",
	0x003e: "gt",
	0x00a0: "nbsp",
	0x00a1: "iexcl",
	0x00a2: "cent",
	0x00a3: "pound",
	0x00a4: "curren",
	0x00a5: "yen",
	0x00a6: "brvbar",
	0x00a7: "sect",
	0x00a8: "uml",
	0x00a9: "copy",
	0x00aa: "ordf",
	0x00ab: "laquo",
	0x00ac: "not",
	0x00ad: "shy",
	0x00ae: "reg",
	0x00af: "macr",
	0x00b0: "deg",
	0x00b1: "plusmn",
	0x00b2: "sup2",
	0x00b3: "sup3",
	0x00b4: "acute",
	0x00b5: "micro",
	0x00b6: "para",
	0x00b7: "middot",
	0x00b8: "cedil",
	0x00b9: "sup1",
	0x00ba: "ordm",
	0x00bb: "raquo",
	0x00bc: "frac14",
	0x00bd: "frac12",
	0x00be: "frac34",
	0x00bf: "iquest",
	0x00c0: "Agrave",
	0x00c1: "Aacute",
	0x00c2: "Acirc",
	0x00c3: "Atilde",
	0x00c4: "Auml",
	0x00c5: "Aring",
	0x00c6: "AElig",
	0x00c7: "Ccedil",
	0x00c8: "Egrave",
	0x00c9: "Eacute",
	0x00ca: "Ecirc",
	0x00cb: "Euml",
	0x00cc: "Igrave",
	0x00cd: "Iacute",
	0x00ce: "Icirc",
	0x00cf: "Iuml",
	0x00d0: "ETH",
	0x00d1: "Ntilde",
	0x00d2: "Ograve",
	0x00d3: "Oacute",
	0x00d4: "Ocirc",
	0x00d5: "Otilde",
	0x00d6: "Ouml",
	0x00d7: "times",
	0x00d8: "Oslash",
	0x00d9: "Ugrave",
	0x00da: "Uacute",
	0x00db: "Ucirc",
	0x00dc: "Uuml",
	0x00dd: "Yacute",
	0x00de: "THORN",
	0x00df: "szlig",
	0x00e0: "agrave",
	0x00e1: "aacute",
	0x00e2: "acirc",
	0x00e3: "atilde",
	0x00e4: "auml",
	0x00e5: "aring",
	0x00e6: "aelig",
	0x00e7: "ccedil",
	0x00e8: "egrave",
	0x00e9: "eacute",
	0x00ea: "ecirc",
	0x00eb: "euml",
	0x00ec: "igrave",
	0x00ed: "iacute",
	0x00ee: "icirc",
	0x00ef: "iuml",
	0x00f0: "eth",
	0x00f1: "ntilde",
	0x00f2: "ograve",
	0x00f3: "oacute",
	0x00f4: "ocirc",
	0x00f5: "otilde",
	0x00f6: "ouml",
	0x00f7: "divide",
	0x00f8: "oslash",
	0x00f9: "ugrave",
	0x00fa: "uacute",
	0x00fb: "ucirc",
	0x00fc: "uuml",
	0x00fd: "yacute",
	0x00fe: "thorn",
	0x00ff: "yuml",
	0x0152: "OElig",
	0x0153: "oelig",
	0x0160: "Scaron",
	0x0161: "scaron",
	0x0178: "Yuml",
	0x0192: "fnof",
	0x02c6: "circ",
	0x02dc: "tilde",
	0x0391: "Alpha",
	0x0392: "Beta",
	0x0393: "Gamma",
	0x0394: "Delta",
	0x0395: "Epsilon",
	0x0396: "Zeta",
	0x0397: "Eta",
	0x0398: "Theta",
	0x0399: "Iota",
	0x039a: "Kappa",
	0x039b: "Lambda",
	0x039c: "Mu",
	0x039d: "Nu",
	0x039e: "Xi",
	0x039f: "Omicron",
	0x03a0: "Pi",
	0x03a1: "Rho",
	0x03a3: "Sigma",
	0x03a4: "Tau",
	0x03a5: "Upsilon",
	0x03a6: "Phi",
	0x03a7: "Chi",
	0x03a8: "Psi",
	0x03a9: "Omega",
	0x03b1: "alpha",
	0x03b2: "beta",
	0x03b3: "gamma",
	0x03b4: "delta",
	0x03b5: "epsilon",
	0x03b6: "zeta",
	0x03b7: "eta",
	0x03b8: "theta",
	0x03b9: "iota",
	0x03ba: "kappa",
	0x03bb: "lambda",
	0x03bc: "mu",
	0x03bd: "nu",
	0x03be: "xi",
	0x03bf: "omicron",
	0x03c0: "pi",
	0x03c1: "rho",
	0x03c2: "sigmaf",
	0x03c3: "sigma",
	0x03c4: "tau",
	0x03c5: "upsilon",
	0x03c6: "phi",
	0x03c7: "chi",
	0x03c8: "psi",
	0x03c9: "omega",
	0x03d1: "thetasym",
	0x03d2: "upsih",
	0x03d6: "piv",
	0x2002: "ensp",
	0x2003: "emsp",
	0x2009: "thinsp",
	0x200c: "zwnj",
	0x200d: "zwj",
	0x200e: "lrm",
	0x200f: "rlm",
	0x2013: "ndash",
	0x2014: "mdash",
	0x2018: "lsquo",
	0x2019: "rsquo",
	0x201a: "sbquo",
	0x201c: "ldquo",
	0x201d: "rdquo",
	0x201e: "bdquo",
	0x2020: "dagger",
	0x2021: "Dagger",
	0x2022: "bull",
	0x2026: "hellip",
	0x2030: "permil",
	0x2032: "prime",
	0x2033: "Prime",
	0x2039: "lsaquo",
	0x203a: "rsaquo",
	0x203e: "oline",
	0x2044: "frasl",
	0x20ac: "euro",
	0x2111: "image",
	0x2118: "weierp",
	0x211c: "real",
	0x2122: "trade",
	0x2135: "alefsym",
	0x2190: "larr",
	0x2191: "uarr",
	0x2192: "rarr",
	0x2193: "darr",
	0x2194: "harr",
	0x21b5: "crarr",
	0x21d0: "lArr",
	0x21d1: "uArr",
	0x21d2: "rArr",
	0x21d3: "dArr",
	0x21d4: "hArr",
	0x2200: "forall",
	0x2202: "part",
	0x2203: "exist",
	0x2205: "empty",
	0x2207: "nabla",
	0x2208: "isin",
	0x2209: "notin",
	0x220b: "ni",
	0x220f: "prod",
	0x2211: "sum",
	0x2212: "minus",
	0x2217: "lowast",
	0x221a: "radic",
	0x221d: "prop",
	0x221e: "infin",
	0x2220: "ang",
	0x2227: "and",
	0x2228: "or",
	0x2229: "cap",
	0x222a: "cup",
	0x222b: "int",
	0x2234: "there4",
	0x223c: "sim",
	0x2245: "cong",
	0x2248: "asymp",
	0x2260: "ne",
	0x2261: "equiv",
	0x2264: "le",
	0x2265: "ge",
	0x2282: "sub",
	0x2283: "sup",
	0x2284: "nsub",
	0x2286: "sube",
	0x2287: "supe",
	0x2295: "oplus",
	0x2297: "otimes",
	0x22a5: "perp",
	0x22c5: "sdot",
	0x2308: "lceil",
	0x2309: "rceil",
	0x230a: "lfloor",
	0x230b: "rfloor",
	0x2329: "lang",
	0x232a: "rang",
	0x25ca: "loz",
	0x2660: "spades",
	0x2663: "clubs",
	0x2665: "hearts",
	0x2666: "diams"
};

System.Text.HtmlChars = {};

for (var property in System.Text.HtmlSymbolCodes) {
	var name = System.Text.HtmlSymbolCodes[property];
	System.Text.HtmlChars[name] = String.fromCharCode(property);
}

System.Text.HtmlDecode = function (s) {
	/// <summary>
	/// 
	/// </summary>
	var out = "";
	if (s !== null) {
		var l = s.length;
		for (var i = 0; i < l; i++) {
			var ch = s.charAt(i);
			if (ch === '&') {
				var semicolonIndex = s.indexOf(';', i + 1);
				if (semicolonIndex > 0) {
					var entity = s.substring(i + 1, semicolonIndex);
					if (entity.length > 1 && entity.charAt(0) === '#') {
						if (entity.charAt(1) === 'x' || entity.charAt(1) === 'X') {
							ch = String.fromCharCode(eval('0' + entity.substring(1)));
						} else {
							ch = String.fromCharCode(eval(entity.substring(1)));
						}
					} else {
						ch = System.Text.HtmlChars[entity] ? System.Text.HtmlChars[entity] : '';
					}
					i = semicolonIndex;
				}
			}
			out += ch;
		}
	}
	return out;
};

//==============================================================================
// CLASS: System.Text.StringArray
//------------------------------------------------------------------------------

System.Text.StringArray = {};

System.Text.StringArray.ToArray = function (values) {
	/// <summary>
	/// 
	/// </summary>
};

System.Text.StringArray.AddValue = function (values, value, addValue) {
	/// <summary>
	/// 
	/// </summary>
	// Replace semicomas with comas.
	var rxSemi = new RegExp(";", "g");
	values = values.replace(rxSemi, ",");
	// Remove all non allowed chars.
	var rxNonAllowedChars = new RegExp("[^a-z0-9,\\\\]", "gi");
	// Replace line ends with comas.
	values = values.replace(new RegExp("^.*<", "g"), ",");
	values = values.replace(rxNonAllowedChars, "");
	// Make sure that one coma is at the front and at the end.
	values = "," + System.Text.Trim(values, ",") + ",";
	// Remove old value.
	var valueToAdd = System.Text.Trim(value, " ");
	values = values.replace("," + valueToAdd + ",", ",", "gi");
	// Remove last coma;
	values = System.Text.Trim(values, ",");
	//	//var rgxComas = new RegExp(",,","g");
	//	//values = values.replace(rgxComas,", ");
	if (addValue !== false) {
		// Remove text from outside '<' and '>' brackets.
		var rgxFilter1 = new RegExp("^.*<", "g");
		var rgxFilter2 = new RegExp(">.*$", "g");
		valueToAdd = valueToAdd.replace(rgxFilter1, "");
		valueToAdd = valueToAdd.replace(rgxFilter2, "");
		// Add value.
		values = values + "," + valueToAdd;
	}
	// Remove comas from both sides.
	values = System.Text.Trim(values, ",");

	// Add spaces.
	var rxComa = new RegExp(",", "gi");
	values = values.replace(rxComa, ", ");
	return values;
};

System.Text.StringArray.IsMatch = function (values, value) {
	/// <summary>
	/// 
	/// </summary>
	var rxNonAllowedChars = new RegExp("[^a-z0-9,\\\\]", "gi");
	values = values.replace(rxNonAllowedChars, "");
	var regExp = new RegExp("^" + value + ",|," + value + ",|," + value + "$|^" + value + "$", "gi");
	var match = values.match(regExp);
	var isMatch = match !== null;
	return isMatch;
};


System.Type.RegisterNamespace("System.Text.RegularExpressions.Templates");

//=============================================================================

// w[.w]@w[.w].[w]
System.Text.RegularExpressions.Templates.Email = new RegExp("^[A-Z0-9_%-]+(|([\.][A-Z0-9_%-]+)+)@[A-Z0-9_%-]+(|([\.][A-Z0-9_%-]+)+)$", "i");
System.Text.RegularExpressions.Templates.EmailStrict = new RegExp("^[A-Z0-9_%-]+(|([\.][A-Z0-9_%-]+)+)@[A-Z0-9_%-]+(|([\.][A-Z0-9_%-]+)+)[\.](([0-9]{1,3})|([A-Z]{2,3})|(aero|coop|info|museum|name))$", "i");

//System.Text.RegularExpressions.Templates.EmailStrict = new RegExp("^([a-zA-Z0-9_\-\.])+@(([0-2]?[0-5]?[0-5]\.[0-2]?[0-5]?[0-5]\.[0-2]?[0-5]?[0-5]\.[0-2]?[0-5]?[0-5])|((([a-zA-Z0-9\-])+\.)+([a-zA-Z\-])+))$","i");

System.Text.RegularExpressions.GetByTag = function (tagName, ignoreCase) {
	// Create regular expression. Replace will be global (g - replace all).
	// The non-greedy repeats are possible by appending a '?' after the repeat;
	// a non-greedy repeat is one which will match the shortest possible string.
	var regex = new RegExp("<\s*" + tagName + "[^>]*>(.*?)<\s*/" + tagName + "\s*>", "g");
	// Set ignore case (by default case sensitive).
	regex.ignoreCase = ignoreCase === true;
	// Return results.
	return regex;
};


//System.Text.RegularExpressions.GetFromTag  = function(valTagName){
//	var fragment = "(?:<"+valTagName+".*?>)((n|.)*?)(?:</"+valTagName+">)";
//	var matchRegExp = new RegExp(fragment, 'im');
//	// Retunr inline text.
//	// innerText = someText.match(matchRegExp)[1];
//	return match;
//}


System.Text.RegularExpressions.GetMatch = function (text, matchPattern, variable) {
	// Get first match;
	var results = "";
	if (variable === null) variable = "$1";
	var regex = new RegExp(matchPattern);
	if (text.match(regex) !== null) {
		var textMatch = text.match(regex)[0];
		// extract variable;
		results = textMatch.replace(regex, variable);
	}
	return results;
};


System.Text.RegularExpressions.GetEscapedPattern = function (s) {
	/// <summary>
	/// Get Regular expression pattern from string. All chars will be converted to \uNNNN form.
	/// </summary>
	/// <param name="s">String to convert</param>
	/// <returns>Regular expression pattern</returns>
	var pattern = "";
	for (var i = 0; i < s.length; i++) {
		var hex = s.charCodeAt(i).toString(16);
		pattern += "\\u" + "0000".substr(0, 4 - hex.length) + hex + "";
	}
	return pattern;
};


System.Text.RegularExpressions.Trim = function (text, symbols, escapePattern) {
	/// <summary>
	/// Trim symbols from string. Trim space by default.
	/// </summary>
	/// <returns name="s" type="String">Trimmed string.</returns>
	if (!symbols) symbols = " ";
	var pattern = symbols;
	if (escapePattern) {
		pattern = System.Text.RegularExpressions.GetEscapedPattern(symbols);
	}
	//Trace.Write("call System.Text.RegularExpressions.Trim(text, '"+pattern+"')");
	var trimLeft = new RegExp("^[" + pattern + "]+", "gm");
	var trimRight = new RegExp("[" + pattern + "]+$", "gm");
	var newText = text.replace(trimLeft, "").replace(trimRight, "");
	return newText;
};

System.Text.RegularExpressions.Replace = function (text, findPattern, replacePattern, ignoreCase) {
	text = new String(text);
	// Create regular expression. Replace will be global (g - replace all).
	var regexFind = new RegExp(findPattern, "g");
	// Create regular expression.
	var regexRepl = new RegExp(replacePattern);
	// Set ignore case (by default case sensitive).
	regexFind.ignoreCase = ignoreCase === true;
	// Return results.
	return text.replace(regexFind, replacePattern);
};

//=============================================================================
// CLASS: ControlChars
//-----------------------------------------------------------------------------

System.Text.ControlChars = {
	Tab: 0x9, 	// Tab
	Vt: 0xB, 	// Vertical Tab
	Ff: 0xC, 	// Form Feed
	Space: 0x20, // Space
	Lf: 0xA, 	// Line Feed
	Bs: 0x8, 	// Backspace
	Ht: 0x9, 	// Horizontal Tab
	Dq: 0x22, 	// Double Quote
	Sq: 0x27, 	// Single Quote
	Bh: 0x5C		// Backslash \
};

System.Text.UtfSignatures = {
	Utf16Le: 0xFFFF, // UTF-16 LE (Little Endian) - Windows
	Utf16Be: 0xFEFF, // UTF-16 BE (Big Endian) - Macintosh
	Utf8: 0xEFBBBF		// UTF-8
};


//=============================================================================
// CLASS: StringBuilder
//-----------------------------------------------------------------------------

System.Text.StringBuilder = function (value) {
	//---------------------------------------------------------
	// Private properties.
	var _parts = [];
	//---------------------------------------------------------
	this.Append = function (value, count) {
		var results = true;
		// if value is undefined.
		if (typeof value === 'undefined') {
			results = false;
		} else {
			var c = count ? count : 1;
			for (var i = 0; i < c; i++) {
				_parts.push(value);
			}
		}
		return results;
	};
	//---------------------------------------------------------
	this.AppendLine = function (value) {
		return this.Append(value + '\r\n');
	};
	//---------------------------------------------------------
	this.Clear = function () {
		if (_parts.length > 0) {
			_parts.splice(0, _parts.length);
		}
	};
	//---------------------------------------------------------
	this.IsEmpty = function () {
		return _parts.length === 0;
	};
	//---------------------------------------------------------
	this.ToString = function (delimiter) {
		return _parts.join(delimiter || '');
	};
	//---------------------------------------------------------
	this.ToArray = function (delimiter) {
		return _parts;
	};
	//---------------------------------------------------------
	this.InitializeClass = function () {
		if (value) this.Append(value);
	};
	this.InitializeClass();
};
System.Type.RegisterClass("System.Text.StringBuilder");

//=============================================================================
// CLASS: Encoding
//-----------------------------------------------------------------------------

System.Text.Encoding = function () { };

System.Type.RegisterClass("System.Text.Encoding");

//=============================================================================
// CLASS: Encoder.UTF8
//-----------------------------------------------------------------------------

// UTF-8, a transformation format of ISO 10646:
// http://www.ietf.org/rfc/rfc3629.txt
// Transformation:
// http://www.czyborra.com/utf/
//
//   The table below summarizes the format of these different octet types.
//   The letter x indicates bits available for encoding bits of the
//   character number.
//
//    Char. number range   |        UTF-8 octet sequence
//       (hexadecimal)     |              (binary)
//   ----------------------+---------------------------------------------
//   0000 0000 - 0000 007F | 0xxxxxxx
//   0000 0080 - 0000 07FF | 110xxxxx 10xxxxxx
//   0000 0800 - 0000 FFFF | 1110xxxx 10xxxxxx 10xxxxxx
//   0001 0000 - 0010 FFFF | 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx

System.Text.UTF8Encoder = function () {
	//---------------------------------------------------------
	// Private properties.
	var me = this;
	//---------------------------------------------------------
	this.GetBytes = function (s) {
		/// <summary>
		/// Get array of bytes.
		/// </summary>
		var bytes = [];
		var c = 0;
		for (var i = 0; i < s.length; i++) {
			c = s.charCodeAt(i);
			// Convert char code to bytes.
			if (c < 0x80) {
				bytes.push(c);
			} else if (c < 0x800) {
				bytes.push(0xC0 | c >> 6);
				bytes.push(0x80 | c & 0x3F);
			} else if (c < 0x10000) {
				bytes.push(0xE0 | c >> 12);
				bytes.push(0x80 | c >> 6 & 0x3F);
				bytes.push(0x80 | c & 0x3F);
			} else if (c < 0x200000) {
				bytes.push(0xF0 | c >> 18);
				bytes.push(0x80 | c >> 12 & 0x3F);
				bytes.push(0x80 | c >> 6 & 0x3F);
				bytes.push(0x80 | c & 0x3F);
			} else {
				// If char is unknown then push "?".
				bytes.push(0x3F);
			}
		}
		return bytes;
	};
	//---------------------------------------------------------
	this.GetString = function (bytes) {
		/// <summary>
		/// Get string from array of bytes.
		/// </summary>
		var s = "";
		var b = 0;
		var b1 = 0;
		var b2 = 0;
		var b3 = 0;
		var b4 = 0;
		var bE = 0;
		var ln = bytes.length;
		for (var i = 0; i < ln; i++) {
			b = bytes[i];
			if (b < 0x80) {
				// Char represended by 1 byte.
				s += b > 0 ? String.fromCharCode(b) : "";
			} else if (b < 0xC0) {
				// Byte 2,3,4 of unicode char.
			} else if (b < 0xE0) {
				// Char represended by 2 bytes.
				if (ln > i + 1) {
					b1 = b & 0x1F; i++;
					b2 = bytes[i] & 0x3F;
					bE = b1 << 6 | b2;
					s += String.fromCharCode(bE);
				}
			} else if (b < 0xF0) {
				// Char represended by 3 bytes.
				if (ln > i + 2) {
					b1 = b & 0xF; i++;
					b2 = bytes[i] & 0x3F; i++;
					b3 = bytes[i] & 0x3F;
					bE = b1 << 12 | b2 << 6 | b3;
					s += String.fromCharCode(bE);
				}
			} else if (b < 0xF8) {
				// Char represended by 4 bytes.
				if (ln > i + 3) {
					b1 = b & 0x7; i++;
					b2 = bytes[i] & 0x3F; i++;
					b3 = bytes[i] & 0x3F; i++;
					b4 = bytes[i] & 0x3F;
					bE = b1 << 18 | (b2 << 12)(b3 << 6) | b4;
					s += String.fromCharCode(bE);
				}
			} else {
				s += "?";
			}
		}
		return s;
	};
	//---------------------------------------------------------
	this.InitializeClass = function () {
	};
	this.InitializeClass();
};
System.Type.RegisterClass("System.Text.UTF8Encoder");

// Make it static.
System.Text.Encoding.UTF8 = new System.Text.UTF8Encoder();

//=============================================================================
// CLASS: Encoder.Unicode
//-----------------------------------------------------------------------------

// Unicode (UTF-16) Transformation:
// http://www.czyborra.com/utf/

System.Text.UnicodeEncoder = function () {
	//---------------------------------------------------------
	// Private properties.
	var me = this;
	//---------------------------------------------------------
	this.GetBytes = function (s) {
		/// <summary>
		/// Get array of bytes.
		/// </summary>
		var bytes = [];
		var c = 0;
		for (var i = 0; i < s.length; i++) {
			c = s.charCodeAt(i);
			// Reduce to 16 bytes.
			if (c > 0xFFFF) {
				bytes.push(0xDC00 | c & 0x3FF);
				bytes.push(0xD7C0 + (c >> 10));
			} else {
				bytes.push(c & 0xFF);
				bytes.push(c >> 8);
			}
		}
		return bytes;
	};
	//---------------------------------------------------------
	this.GetString = function (bytes) {
		/// <summary>
		/// Get string from array of bytes.
		/// </summary>
		var s = "";
		var b = 0;
		var b1 = 0;
		var b2 = 0;
		for (var i = 0; i < bytes.length; i++) {
			b1 = bytes[i]; i++;
			b2 = bytes[i];
			s += String.fromCharCode(b2 << 8 | b1);
			//x1 = (b1 <= 0xF ? "0" : "") + b1.toString(16);
			//x2 = (b2 <= 0xF ? "0" : "") + b2.toString(16);
			//s += unescape("%u"+x2+x1);
		}
		return s;
	};
	//---------------------------------------------------------
	this.InitializeClass = function () {
	};
	this.InitializeClass();
};
System.Type.RegisterClass("System.Text.UnicodeEncoder");

// Make it static.
System.Text.Encoding.Unicode = new System.Text.UnicodeEncoder();

//=============================================================================
// CLASS: Encoder.ASCII
//-----------------------------------------------------------------------------

System.Text.ASCIIEncoder = function () {
	//---------------------------------------------------------
	// Private properties.
	var me = this;
	//---------------------------------------------------------
	this.GetBytes = function (s) {
		/// <summary>
		/// Get array of bytes.
		/// </summary>
		var bytes = [];
		var c = 0;
		for (var i = 0; i < s.length; i++) {
			c = s.charCodeAt(i);
			// Reduce to 16 bytes.
			if (c > 0xFF) {
				bytes.push(0x3F);
			} else {
				bytes.push(c);
			}
		}
		return bytes;
	};
	//---------------------------------------------------------
	this.GetString = function (bytes) {
		/// <summary>
		/// Get string from array of bytes.
		/// </summary>
		var s = "";
		for (var i = 0; i < bytes.length; i++) {
			s += String.fromCharCode(bytes[i]);
		}
		return s;
	};
	//---------------------------------------------------------
	this.InitializeClass = function () {
	};
	this.InitializeClass();
};
System.Type.RegisterClass("System.Text.ASCIIEncoder");

// Make it static.
System.Text.Encoding.ASCII = new System.Text.ASCIIEncoder();

//==============================================================================
// END
//------------------------------------------------------------------------------