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
//		<RootNamespace>System.Security.Password</RootNamespace>
// <PropertyGroup>
//-----------------------------------------------------------------------------
System.Type.RegisterNamespace("System.Security.Password");
//=============================================================================

//------------------------------------------------------------------------------
//	Created by: Evaldas Jocys (http://www.jocys.com/evaldas/)
//	Updated by: Your Name...
//------------------------------------------------------------------------------
//	UPDATES:
//------------------------------------------------------------------------------
//	2005-01-31	First working version;
//------------------------------------------------------------------------------
// NOTE: If you planing to improve this script, send note to us about it, please.
//==============================================================================

// Classes:
// Password.Generator - password generator.
// Password.Presets = collection of presets.
// Password.Preset = password preset.
// Password.Calls = collection of calls.
// Password.Call = password call class.
// Password.Word  = password item class.
// Static classes:
// System.Security.Password.Templates.Charsets
// Static templates.
// System.Security.Password.Templates.Presets - used by
// System.Security.Password.Templates.Calls
// System.Security.Password.Templates.Filters

//=============================================================================
// CLASS: Interface
//-----------------------------------------------------------------------------

// Interface namespace required System.js file to be included.

System.Security.Password.Interface = System.Security.Password.Interface ? System.Security.Password.Interface : {};

System.Security.Password.Interface.PassGen = null;
System.Security.Password.Interface.PassGenWindow = null;
System.Security.Password.Interface.Controls = {};
System.Security.Password.Interface.Controls.ByGenerate = {};
System.Security.Password.Interface.Controls.ByAdvanced = {};

System.Security.Password.Interface.AddControl = function (cp, control, name) {
	if (control) {
		cp[name] = typeof control === "string" ? document.getElementById(control) : control;
	}
};

System.Security.Password.Interface.AutoIfEmpty = false;

System.Security.Password.Interface.AddControls = function (passwordTextBox, confirmTextBox, generateButton, advancedButton, showPassCheckBox, autoIfEmpty) {
	var cp = {};
	System.Security.Password.Interface.AddControl(cp, passwordTextBox, "Password");
	System.Security.Password.Interface.AddControl(cp, confirmTextBox, "Confirm");
	System.Security.Password.Interface.AddControl(cp, generateButton, "Generate");
	System.Security.Password.Interface.AddControl(cp, advancedButton, "Advanced");
	System.Security.Password.Interface.AddControl(cp, showPassCheckBox, "ShowPass");
	System.Security.Password.Interface.AutoIfEmpty = autoIfEmpty === true;
	if (cp.Generate) {
		System.Security.Password.Interface.Controls.ByGenerate[cp.Generate.id] = cp;
	}
	if (cp.Advanced) {
		System.Security.Password.Interface.Controls.ByAdvanced[cp.Advanced.id] = cp;
	}
	return cp;
};

System.Security.Password.Interface.CheckConfirmAndShow = function (cp) {
	if (cp.Confirm) {
		cp.Confirm.value = "";
		// Focus inside confirm field so user can confirm password if he wants.
		cp.Confirm.value = cp.Password.value;
		cp.Confirm.focus();
		cp.Confirm.select();
	}
	if (cp.ShowPass) {
		// Reveal password to the user.
		if (cp.ShowPass.checked === false) cp.ShowPass.click();
	}
};

System.Security.Password.Interface.TextBoxFocusHandler = function (sender, e) {
	/// <summary>
	/// Generate password and fill TextBox with it if user focus on empty password textbox.
	/// </summary>
	if (sender.value.length === 0 && System.Security.Password.Interface.AutoIfEmpty) {
		sender.value = System.Security.Password.Interface.PassGen.NewPassword().Text;
		sender.select();
		System.Security.Password.Interface.CheckConfirmAndShow(e.Controls);
	}
};

System.Security.Password.Interface.GenerateClickHandler = function (sender, e) {
	/// <summary>
	/// Generate password and fill TextBox with it.
	/// </summary>
	e.Controls.Password.value = System.Security.Password.Interface.PassGen.NewPassword().Text;
	e.Controls.Password.select();
	System.Security.Password.Interface.CheckConfirmAndShow(e.Controls);
};

System.Security.Password.Interface.AdvancedClickHandler = function (sender, e) {
	/// <summary>
	/// Open advanced window with password generator.
	/// </summary>
	var id = e.Controls.Password.id;
	var path = System.GetScriptsPath();
	var url = path + "/Examples/System.Security.Password.Frameset.htm?Field=" + id;
	// Please note thatn MSIE 7 forces the presence of the Address Bar by default
	// A missing address bar creates a chance for a fraudster to forge an address of their own.
	// To help thwart that, IE7 will show the address bar on all internet windows to help users see where they are.
	// coming from Microsoft Internet Explorer Blog, Better Website Identification
	// Mozilla.org also intends to soon force the presence of the Location Bar in Firefox 3.
	System.Security.Password.Interface.PassGenWindow = window.open(url, "PassGenWindow", "channelmode=no,directories=no,fullscreen=no,width=850,height=600,location=no,menubar=no,resizable=yes,scrollbars=no,status=yes,titlebar=no,toolbar=no");
	System.Security.Password.Interface.PassGenWindow.focus();
};

System.Security.Password.Interface.CheckPassGen = function () {
	if (!System.Security.Password.Interface.PassGen) {
		System.Security.Password.Interface.PassGen = new System.Security.Password.Generator();
	}
};

System.Security.Password.Interface.Attach = function (passwordTextBox, confirmTextBox, generateButton, advancedButton, showPassCheckBox) {
	System.Security.Password.Interface.CheckPassGen();
	var cp = System.Security.Password.Interface.AddControls(passwordTextBox, confirmTextBox, generateButton, advancedButton, showPassCheckBox);
	var e = new System.EventArgs("Focus");
	e["Controls"] = cp;
	if (cp.Password) {
		var subHandler = function () { System.Security.Password.Interface.TextBoxFocusHandler(cp.Password, e); };
		Events.Add(cp.Password, "focus", new System.EventHandler(this, subHandler), true);
	}
	if (cp.Generate) {
		var subHandler2 = function () { System.Security.Password.Interface.GenerateClickHandler(cp.Password, e); };
		Events.Add(cp.Generate, "click", new System.EventHandler(this, subHandler2), true);
	}
	if (cp.Advanced) {
		var subHandler3 = function () { System.Security.Password.Interface.AdvancedClickHandler(cp.Password, e); };
		Events.Add(cp.Advanced, "click", new System.EventHandler(this, subHandler3), true);
	}
};

//=============================================================================
// CLASS: Calls
//-----------------------------------------------------------------------------

System.Security.Password.CssPrefix = "SWUI_PG";

System.Security.Password.CharTypeEnum = {
	Numbers: 1,
	Uppercase: 2,
	Lowercase: 4,
	Extended: 8,
	Extra: 16
};

System.Security.Password.FilterTypeEnum = {
	Remember: 1,
	Keyboard: 2,
	Phone: 4,
	Ascii: 8,
	Chars: 16
};


//=============================================================================
// CLASS: Char
//-----------------------------------------------------------------------------
System.Security.Password.Char = function (code) {
	//---------------------------------------------------------
	// Public properties.
	this.Char = "";
	this.Code = 0;
	this.Case = "";
	this.Name = "";
	this.Html = "";
	this.Category = "";
	//---------------------------------------------------------
	// Private properties.
	var me = this;
	//---------------------------------------------------------
	this.ToHtml = function () {
		var cssPrefix = System.Security.Password.CssPrefix;
		var call = System.Security.Password.Templates.Calls.EN_Unicode;
		var html = "";
		html += "<span class=\"" + cssPrefix + "_Char_" + this.Category + "\">" + this.Char + "</span>";
		html += "<span class=\"" + cssPrefix + "_Char_" + this.Category + "_Name\">" + this.Name + "</span>";
		return html;
	};
	//---------------------------------------------------------
	this.InitializeClass = function () {
		// Get code from string if required.
		code = typeof code === "string" ? code.charCodeAt(0) : code;
		this.Code = typeof code === "number" ? code : 0;
		this.Char = code ? String.fromCharCode(code) : "";
		this.Case = "Unknown";
		this.Name = name ? name : "";
		// Determine category of char.
		var category = "Unknown";
		if (code >= 32 && code <= 47) { category = "Symbol"; }
		else if (code >= 48 && code <= 57) { category = "Number"; }
		else if (code >= 58 && code <= 64) { category = "Symbol"; }
		else if (code >= 65 && code <= 90) { category = "Letter"; }
		else if (code >= 91 && code <= 96) { category = "Symbol"; }
		else if (code >= 97 && code <= 122) { category = "Letter"; }
		else if (code >= 123 && code <= 126) { category = "Symbol"; }
		else if (code >= 128 && code <= 255) { category = "Extra"; }
		else if (code === 32) { category = "Special"; }
		this.Category = category;
		// Determine Case.
		var lowerCode = this.Char.toLowerCase().charCodeAt(0);
		var upperCode = this.Char.toUpperCase().charCodeAt(0);
		if (lowerCode === upperCode) this.Case = "";
		else if (this.Code === lowerCode) this.Case = "Lower";
		else if (this.Code === upperCode) this.Case = "Upper";
		// Set name. Use basic template.
		var call = System.Security.Password.Templates.Calls.EN_Unicode;
		this.Name = call[this.Code] ? call[this.Code][1] : "";
		// Create HTML.
		this.Html = this.ToHtml();
	};
	this.InitializeClass();
};

//=============================================================================
// CLASS: Calls
//-----------------------------------------------------------------------------

System.Security.Password.Calls = function (callName) {
	/// <summary>
	/// Represents a collection of password Calls.
	/// </summary>
	//---------------------------------------------------------
	// Public properties.
	this.Items;
	//---------------------------------------------------------
	// Private properties.
	var me = this;
	//---------------------------------------------------------
	// Load all call items from templates;
	this.LoadAll = function () {
		for (var property in System.Security.Password.Templates.Calls) {
			this.Load(property);
		}
	};
	//---------------------------------------------------------
	// Convert bytes to array of calls.
	this.ToArray = function (bytes) {
		var calls = [];
		for (var i = 0; i < bytes.length; i++) {
			//var call = new
		}
	};
	//---------------------------------------------------------
	// Load all items from templates;
	this.Load = function (name) {
		// If name was specified then...
		if (name) {
			// Load single call.
			this.Items[property] = new System.Security.Password.Call(property);
			this.Items[property]["Parent"] = this;
		} else {
			// Load all calls.
			for (var property in System.Security.Password.Templates.Calls) {
				this.Items[property] = new System.Security.Password.Call(property);
				this.Items[property]["Parent"] = this;
			}
		}
	};
	//---------------------------------------------------------
	this.InitializeClass = function () {
		this.Items = {};
		this.Load(callName);
	};
	this.InitializeClass();
};

//=============================================================================
// CLASS: Security.Password.Call
//-----------------------------------------------------------------------------

System.Security.Password.Call = function (name) {
	/// <summary>
	/// Password Call is collection of words related to characters.
	/// </summary>
	//---------------------------------------------------------
	// Public properties.
	this.Chars;
	this.Data;
	this.Name;
	//---------------------------------------------------------
	// Private properties.
	var me = this;
	//---------------------------------------------------------
	this.CharToHtml = function (c, type) {
		/// <summary>
		/// Convert char to HTML code.
		/// </summary>
		var cssPrefix = System.Security.Password.CssPrefix;
		var html = "";
		switch (type) {
			case "Table":
				html += "<tr>";
				html += "<td class=\"{prefix}_Index{odd}\">{index}</td>";
				html += "<td class=\"{prefix}_Code{odd}\">{code}</td>";
				html += "<td class=\"{prefix}_Char{odd} {category}_Char\">{char}</td>";
				//html += "<td class=\"{prefix}_Name {category}_Name\">{name}</td>";
				html += "<td class=\"{prefix}_Call{odd} {category}_Call{class}\">{call}</td>";
				html += "</tr>";
				break;
			default:
				html += "<div>";
				html += "<span class=\"{prefix}_Index{odd}\">{index}</span>";
				html += "<span class=\"{prefix}_Code{odd}\">{code}</span>";
				html += "<span class=\"{prefix}_Char{odd} {category}_Char\">{char}</span>";
				//html += "<span class=\"{prefix}_Name {category}_Name\">{name}</span>";
				html += "<span class=\"{prefix}_Call{odd} {category}_Call{class}\">{call}</span>";
				html += "</div>";
				break;
		}
		var ch = new System.Security.Password.Char(c);
		// Category can be: Symbol, Number, Letter, Extra, Special.
		var category = cssPrefix + "_" + ch.Category;
		html = html.replace(new RegExp("{prefix}", "g"), cssPrefix);
		html = html.replace(new RegExp("{category}", "g"), category);
		html = html.replace(new RegExp("{char}", "g"), ch.Char);
		html = html.replace(new RegExp("{name}", "g"), ch.Name);
		var code = new System.Int32(ch.Code).ToString("X4");
		html = html.replace(new RegExp("{code}", "g"), code);
		var callName = this.Data[ch.Code] ? this.Data[ch.Code][1] : "";
		html = html.replace(new RegExp("{call}", "g"), callName);
		var callClass = this.Name ? " " + cssPrefix + "_" + this.Name : "";
		html = html.replace(new RegExp("{class}", "g"), callClass);
		return html;
	};
	//---------------------------------------------------------
	this.ToHtml = function (c, type) {
		var cssPrefix = System.Security.Password.CssPrefix;
		var rxOdd = new RegExp("{odd}", "g");
		var rxIdx = new RegExp("{index}", "g");
		var html = "";
		if (type === "Table") html += "<table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" class=\"" + cssPrefix + "_Table\">";
		for (var i = 0; i < c.length; i++) {
			html += this.CharToHtml(c.charAt(i), type);
			var odd = i % 2;
			odd = "_" + new String(odd);
			html = html.replace(rxOdd, odd, "g");
			html = html.replace(rxIdx, i, "g");
		}
		if (type === "Table") html += "</table>";
		return html;
	};
	//---------------------------------------------------------
	// Load call items by name;
	this.Load = function (callName) {
		this.Data = {};
		var basicTemplate = System.Security.Password.Templates.Calls.EN_Unicode;
		var item;
		var code;
		var property;
		// Copy properties from default template.
		for (property in basicTemplate.Data) {
			item = basicTemplate.Data[property];
			code = eval(item[0]);
			this.Data[code] = [];
			this.Data[code][0] = item[1];
			this.Data[code][1] = item[2];
		}
		// Copy properties from named template.
		var template = System.Security.Password.Templates.Calls[callName];
		if (typeof template === "object") {
			// Overwrite/Append to Basic template.
			this.Name = template.CallName;
			for (property in template.Data) {
				item = template.Data[property];
				code = eval(item[0]);
				this.Data[code] = [];
				this.Data[code][0] = item[1];
				this.Data[code][1] = item[2];
			}
		}
		// Route thru combined template.
		for (code in this.Data) {
			this.Chars = {};
			// If it is proper number then...
			this.Chars[code] = new System.Security.Password.Char(code);
			this.Chars[code].Html = this.ToHtml(this.Chars[code].Char);
		}
	};
	//---------------------------------------------------------
	this.InitializeClass = function () {
		this.Load("Basic");
		if (name) this.Load(name);
	};
	this.InitializeClass();
};

//=============================================================================
// CLASS: Security.Password.Presets
//-----------------------------------------------------------------------------

System.Security.Password.Presets = function (presetName) {
	//---------------------------------------------------------
	// Public properties.
	this.Items;
	//---------------------------------------------------------
	// Private properties.
	var me = this;
	//---------------------------------------------------------
	// Load all items from templates;
	this.Load = function (name) {
		// If name was specified then...
		if (name) {
			// Load single preset.
			this.Items[property] = new System.Security.Password.Preset(property);
			this.Items[property]["Parent"] = this;
		} else {
			// Load all presets.
			for (var property in System.Security.Password.Templates.Presets) {
				this.Items[property] = new System.Security.Password.Preset(property);
				this.Items[property]["Parent"] = this;
			}
		}
	}
	//---------------------------------------------------------
	this.InitializeClass = function () {
		this.Items = {};
		this.Load(presetName);
	}
	this.InitializeClass();
}

//=============================================================================
// CLASS: Security.Password.Preset
//-----------------------------------------------------------------------------

System.Security.Password.Preset = function (presetName) {
	//---------------------------------------------------------
	// Public properties.
	this.Parent;
	this.Name;
	//---------------------------------------------------------
	// Private properties.
	var me = this;
	//---------------------------------------------------------
	// Load from template;
	this.Load = function (presetName) {
		this.Name = presetName;
		// Try to get data from cache.
		var tmp = System.Security.Password.Temp;
		if (!tmp.Charsets) {
			tmp.Charsets = new System.Security.Password.Templates.Charsets();
		}
		// Update default preset with proper chars from charsets object.
		var p = System.Security.Password.Templates.Presets;
		p.Default.CharsNumbers = tmp.Charsets.Strings.Numbers;
		p.Default.CharsUppercase = tmp.Charsets.Strings.Uppercase;
		p.Default.CharsLowercase = tmp.Charsets.Strings.Lowercase;
		p.Default.CharsExtended = tmp.Charsets.Strings.Extended;
		p.Default.CharsExtra = tmp.Charsets.Strings.Extra;
		var property;
		// Copy properties from default template.
		for (property in p.Default) {
			this[property] = p.Default[property];
		}
		// Apply properties from custom template.
		for (property in p[presetName]) {
			this[property] = p[presetName][property];
		}
	};
	//---------------------------------------------------------
	this.InitializeClass = function () {
		if (presetName) {
			this.Load(presetName);
		} else {
			// Load "Remember" preset by default;
			this.Load("Remember");
		}
	};
	this.InitializeClass();
};

//=============================================================================
// CLASS: Security.Password.Word
//-----------------------------------------------------------------------------

System.Security.Password.Word = function () {
	this.Text = "";
	this.Log = [];
	this.Strength = 0;
	this.ErrorMessage = "";
	//---------------------------------------------------------
	this.AppendLog = function (message) {
		this.Log.push(message);
	};
	//---------------------------------------------------------
	this.Reset = function () {
		this.Text = "";
		this.Strength = 0;
	};
	//---------------------------------------------------------
	this.LogToHtml = function () {
		var html = "";
		for (var i = 0; i < this.Log.length; i++) {
			html += this.Log[i] + "<br />";
		}
		return html;
	};
	//---------------------------------------------------------
	this.InitializeClass = function () {
		this.Reset();
	};
	this.InitializeClass();
};

//=============================================================================
// CLASS: Security.Password.Generator
//-----------------------------------------------------------------------------

System.Security.Password.Generator = function () {
	/// <summary>
	///
	/// </summary>
	/// <remarks>
	/// Password is generated in these steps:
	///	    a) Load array of chars accorging to presets;
	///     b) Apply filters;
	///     c) Proceed until password length is reached;
	///     d) Apply Regular Expressions;
	/// </remarks>
	//---------------------------------------------------------
	// Private properties.
	var me = this;
	//---------------------------------------------------------
	// Public properties.
	this.PhoneKeys;
	this.Keyboard;
	this.Cache = {};
	//---------------------------------------------------------
	this.PresetChanged;
	this.Error;
	//---------------------------------------------------------
	this.RiseEvent = function (e) { if (this[e.Name]) this[e.Name](this, e); };
	//---------------------------------------------------------
	this.Preset;
	this.setPreset = function (preset) {
		if (typeof preset === "string") {
			preset = new System.Security.Password.Preset(preset);
		}
		this.Preset = preset;
		this.RiseEvent("PresetChanged");
	};
	//---------------------------------------------------------
	// Convert string to array.
	this._stringToArray = function (stringText) {
		var array = [];
		var string = new String(stringText);
		for (var i = 0; i < string.length; i++) {
			array.push(string.charAt(i));
		}
		return array;
	};
	//---------------------------------------------------------
	// Convert array to string.
	this._arrayToString = function (array, splitter) {
		var string = "";
		for (var i = 0; i < array.length; i++) {
			if (i > 0) string += splitter;
			string += array[i];
		}
	};
	//---------------------------------------------------------
	this._splitString = function (string, splitter) {
		var charsFilter = this._stringToArray(string);
		var charsSplited = this._arrayToString(charsFilter, splitter);
		return charsSplited;
	};
	//---------------------------------------------------------
	this.NewPassword = function (cache) {
		/// </summary>
		/// Generate new password.
		/// </summary>
		/// <param name="cache" type="Bool">Enable cache</param>
		// Create a new password item.
		var password = new System.Security.Password.Word();
		password.AppendLog("Password log started.");
		// Maximum number of attempts to generate password.
		var maxTries = 4;
		for (var a = 1; a <= maxTries; a++) {
			password.Reset();
			password.AppendLog("Attempt " + a + " to generate password.");
			if (!(this.Cache.charsToUse && cache)) {
				this.Cache.charsToUse = this.GetChars();
			}
			var charsToUse = this.Cache.charsToUse;
			if (charsToUse.length <= 0) {
				password.AppendLog("Error: chars list is empty!");
			} else {
				password.AppendLog("Chars To Use: " + charsToUse);
				// Now we can create our password.
				for (var i = 0; i < this.Preset.PasswordLength; i++) {
					// Apply filters and get list of available chars.
					var filteredChars = this.FilterChars(password.Text, charsToUse);
					// If filters left some chars then...
					if (filteredChars.length > 0) {
						// Calclulate password strenght (10^x).
						var strength = Math.log(filteredChars.length) / Math.log(10);
						password.Strength += strength;
						// Get random char.
						var charPosition = Math.floor(Math.random() * filteredChars.length);
						var filteredChar = filteredChars.charAt(charPosition);
						password.Text += filteredChar;
						password.AppendLog(i + ". " + filteredChar + " <- [" + charPosition + "][" + filteredChars + "] - Final Strength: 10^" + password.Strength);
					} else {
						password.AppendLog("Warning: filteredChars.length == 0");
						break;
					}
				}
			}
			// If we reached required password length then...
			if (password.Text.length === this.Preset.PasswordLength) {
				// Don't try to generate another password again.
				break;
			}
		}
		// Apply regular expressions to password.
		password = this.ApplyRegex(password);
		// Apply script to password.
		password = this.ApplyScript(password);
		// If password is empty then...
		if (password.Text.length !== this.Preset.PasswordLength) {
			// Add error message.
			password.AppendLog("Error: all attempts to generate password was failed. Please relax password settings.");
		}
		return password;
	};
	//-------------------------------------------------------
	this.GetChars = function (preset) {
		/// <summary>
		/// Create chars string by preset.
		/// </summary>
		var charsToUse = "";
		for (var property in System.Security.Password.CharTypeEnum) {
			var enabled = this.Preset["Use" + property];
			var ratio = this.Preset["Ratio" + property];
			if (enabled && ratio > 0) {
				var chars = this.Preset["Chars" + property];
				for (var i = 0; i < ratio; i++) {
					charsToUse += chars;
				}
			}
		}
		return charsToUse;
	};
	//-------------------------------------------------------
	this.FilterChars = function (password, chars) {
		var charsToUse = chars;
		for (var property in System.Security.Password.FilterTypeEnum) {
			var enabled = this.Preset["Filter" + property];
			if (enabled) {
				charsToUse = System.Security.Password.Templates.Filters[property](this, password, charsToUse);
			}
		}
		return charsToUse;
	};
	//-------------------------------------------------------
	this.ApplyScript = function (password) {
		if (this.Preset.ScriptEnabled) {
			password.AppendLog("ApplyScript to '" + password.Text + "'");
			try {
				if (this.Preset.ScriptCode.length > 0) {
					var fn = new Function("password", this.Preset.ScriptCode);
					var text = fn(password);
					password.Text = text;
					password.AppendLog("password.Text = '" + password.Text + "'");
				}
			} catch (ex) {
				var msg = "Error: ApplyScript: " + ex.message;
				password.AppendLog(msg);
				password.ErrorMessage = msg;
				// Rise error here.
				var e = new System.EventArgs(Error);
				e["Message"] = msg;
				this.RiseEvent(e);
			}
		}
		return password;
	};
	//-------------------------------------------------------
	this.ApplyRegex = function (password) {
		if (this.Preset.RegexEnabled) {
			password.AppendLog("ApplyRegex to '" + password.Text + "'");
			try {
				var ic = this.Preset.RegexIgnoreCase ? "i" : "";
				var pf = new RegExp(this.Preset.RegexPatternFind, ic);
				password.Text = password.Text.replace(pf, this.Preset.RegexPatternReplace);
				password.AppendLog("password.Text = '" + password.Text + "'");
			} catch (ex) {
				password.AppendLog("Error: ApplyRegex: " + ex.message);
				password.Text = password;
				// rise error here.
			}
		}
		return password;
	};
	//---------------------------------------------------------
	this.InitializeClass = function () {
		// Preconfigure generator with default preset;
		this.setPreset("DefaultEasyToRemember");
	};
	this.InitializeClass.apply(this, arguments);
};

//=============================================================================
// NameSPACE: Security.Password.Templates
//-----------------------------------------------------------------------------

System.Security.Password.Templates = {};

//=============================================================================
// NameSPACE: Security.Password.Templates.Presets
//-----------------------------------------------------------------------------

System.Security.Password.Templates.Presets = {};

System.Security.Password.Templates.Presets.Default = {
	"PresetName": "Default",
	"PresetDescription": "",
	"PresetRemarks": "",
	"PasswordLength": 9,
	"UseNumbers": false,
	"UseUppercase": false,
	"UseLowercase": false,
	"UseExtended": false,
	"UseExtra": false,
	"RatioNumbers": 1,
	"RatioUppercase": 1,
	"RatioLowercase": 1,
	"RatioExtended": 1,
	"RatioExtra": 1,
	"CharsNumbers": "",
	"CharsUppercase": "",
	"CharsLowercase": "",
	"CharsExtended": "",
	"CharsExtra": "",
	"FilterRemember": false,
	"FilterKeyboard": false,
	"FilterPhone": false,
	"FilterAscii": false,
	"FilterChars": false,
	"FilterCharsString": "",
	"ScriptEnabled": false,
	"ScriptCode": "",
	"RegexEnabled": false,
	"RegexPatternFind": "",
	"RegexPatternReplace": "",
	"RegexIgnoreCase": false
};

System.Security.Password.Templates.Presets.DefaultCrazy = {
	"PresetName": "Default: Crazy",
	"RatioNumbers": 3,
	"RatioLowercase": 3,
	"RatioUppercase": 3,
	"RatioExtended": 1,
	"UseNumbers": true,
	"UseLowercase": true,
	"UseUppercase": true,
	"UseExtended": true,
	"PasswordLength": 10
};

/*

System.Security.Password.Templates.Presets.DefaultEasyForLeftHand = {
PresetName: "Default: Easy For Left Hand",
RatioNumbers: 1,
RatioLowercase: 2,
UseNumbers: true,
UseLowercase: true,
FilterChars: true,
FilterCharsString: "7890yuiophjklnmYUIOPHJKLNM-=[];'#,./()_+{}:@~<>\?"
}

System.Security.Password.Templates.Presets.DefaultEasyForRightHand = {
PresetName: "Default: Easy For Right Hand",
RatioNumbers: 1,
RatioLowercase: 2,
UseNumbers: true,
UseLowercase: true,
FilterChars: true,
FilterCharsString: "123456qwertasdfgzxcvbQWERTASDFGZXCVB\\`¬!\"£$%^|"
}

*/

System.Security.Password.Templates.Presets.DefaultPhone = {
	"PresetName": "Default: GSM Phone",
	"RatioLowercase": 1,
	"UseLowercase": true,
	"FilterPhone": true
};

System.Security.Password.Templates.Presets.DefaultEasyToEnter = {
	"PresetName": "Default: Easy To Enter",
	"RatioLowercase": 1,
	"UseLowercase": true,
	"FilterChars": true,
	"FilterCharsString": "qwxzQWXZ",
	"FilterKeyboard": true
};

System.Security.Password.Templates.Presets.DefaultEasyToRemember = {
	"PresetName": "Default: Easy To Remember",
	"RatioLowercase": 1,
	"FilterRemember": true,
	"UseLowercase": true,
	"FilterChars": true,
	"FilterCharsString": "qwxzQWXZ"
};

System.Security.Password.Templates.Presets.DefaultGood = {
	"PresetName": "Default: Good",
	"RatioNumbers": 1,
	"RatioLowercase": 1,
	"RatioUppercase": 1,
	"UseNumbers": true,
	"UseLowercase": true,
	"UseUppercase": true,
	"PasswordLength": 10
};

System.Security.Password.Templates.Presets.DefaultLinuxManiac = {
	"PresetName": "Default: Linux Maniac",
	"RatioNumbers": 1,
	"RatioLowercase": 1,
	"RatioUppercase": 1,
	"RatioExtended": 1,
	"RatioExtra": 16,
	"UseNumbers": true,
	"UseLowercase": true,
	"UseUppercase": true,
	"UseExtended": true,
	"UseExtra": false,
	"PasswordLength": 12
};

System.Security.Password.Templates.Presets.DefaultNormal = {
	"PresetName": "Default: Normal",
	"RatioNumbers": 1,
	"RatioLowercase": 1,
	"UseNumbers": true,
	"UseLowercase": true
};

System.Security.Password.Templates.Presets.NumBinary = {
	"PresetName": "Num: Binary",
	"CharsExtra": "01",
	"RatioExtra": 1,
	"UseExtra": true,
	"PasswordLength": 10
};

System.Security.Password.Templates.Presets.NumOctet = {
	"PresetName": "Num: Octet",
	"CharsExtra": "01234567",
	"RatioExtra": 1,
	"UseExtra": true,
	"PasswordLength": 10
};

System.Security.Password.Templates.Presets.DecCodePASS = {
	"PresetName": "Dec: Code - PASS",
	"RatioNumbers": 1,
	"UseNumbers": true,
	"PasswordLength": 8
};

System.Security.Password.Templates.Presets.DecCodePIN = {
	"PresetName": "Dec: Code - PIN",
	"RatioNumbers": 1,
	"UseNumbers": true,
	"PasswordLength": 4
};

System.Security.Password.Templates.Presets.DecDefault = {
	"PresetName": "Dec: Default",
	"RatioNumbers": 1,
	"UseNumbers": true,
	"PasswordLength": 10
};

System.Security.Password.Templates.Presets.DecIMEI = {
	"PresetName": "Dec: IMEI - Mobile ID",
	"RatioNumbers": 1,
	"UseNumbers": true,
	"PasswordLength": 15
};

System.Security.Password.Templates.Presets.GuidDefault = {
	"PresetName": "Hex: GUID - Default",
	"CharsExtra": "abcdef",
	"RatioNumbers": 1,
	"RatioExtra": 1,
	"UseNumbers": true,
	"UseExtra": true,
	"PasswordLength": 32,
	"RegexEnabled": true,
	"RegexPatternFind": "(\\S{8})(\\S{4})(\\S{4})(\\S{4})(\\S{12})",
	"RegexPatternReplace": "$1-$2-$3-$4-$5"
};

System.Security.Password.Templates.Presets.GuidAccess = {
	"PresetName": "Hex: GUID - Access",
	"CharsExtra": "abcdef",
	"RatioNumbers": 1,
	"RatioExtra": 1,
	"UseNumbers": true,
	"UseExtra": true,
	"PasswordLength": 32,
	"RegexEnabled": true,
	"RegexPatternFind": "(\\S{8})(\\S{4})(\\S{4})(\\S{4})(\\S{12})",
	"RegexPatternReplace": "{$1-$2-$3-$4-$5}"
};

System.Security.Password.Templates.Presets.GuidPlain = {
	"PresetName": "Hex: GUID - Plain",
	"CharsExtra": "abcdef",
	"RatioNumbers": 1,
	"RatioExtra": 1,
	"UseNumbers": true,
	"UseExtra": true,
	"PasswordLength": 32
};

System.Security.Password.Templates.Presets.HexHEXLowercase = {
	"PresetName": "Hex: HEX - Lowercase",
	"CharsExtra": "abcdef",
	"RatioNumbers": 1,
	"RatioExtra": 1,
	"UseNumbers": true,
	"UseExtra": true,
	"PasswordLength": 10
};

System.Security.Password.Templates.Presets.HexHEXUppercase = {
	"PresetName": "Hex: HEX - Uppercase",
	"CharsExtra": "ABCDEF",
	"RatioNumbers": 1,
	"RatioExtra": 1,
	"UseNumbers": true,
	"UseExtra": true,
	"PasswordLength": 10
};

System.Security.Password.Templates.Presets.HexMAC = {
	"PresetName": "Hex: MAC",
	"CharsExtra": "ABCDEF",
	"RatioNumbers": 1,
	"RatioExtra": 1,
	"UseNumbers": true,
	"UseExtra": true,
	"PasswordLength": 12,
	"RegexEnabled": true,
	"RegexPatternFind": "(\\S{2})(\\S{2})(\\S{2})(\\S{2})(\\S{2})(\\S{2}).*",
	"RegexPatternReplace": "$1-$2-$3-$4-$5-$6"
};

System.Security.Password.Templates.Presets.HexMD5 = {
	"PresetName": "Hex: MD5",
	"CharsExtra": "ABCDEF",
	"RatioNumbers": 1,
	"RatioExtra": 1,
	"UseNumbers": true,
	"UseExtra": true,
	"PasswordLength": 32
};

System.Security.Password.Templates.Presets.OtherDragon = {
	"PresetName": "Other: Dragon",
	"RatioNumbers": 1,
	"RatioLowercase": 2,
	"RatioUppercase": 2,
	"UseNumbers": true,
	"UseLowercase": true,
	"UseUppercase": true,
	"PasswordLength": 8,
	"RegexEnabled": true,
	"RegexPatternFind": "(\\S{4})(\\S{4}).*",
	"RegexPatternReplace": "^$1-$2^"
};

System.Security.Password.Templates.Presets.OtherAppleMacUser = {
	"PresetName": "Other: Apple Mac User",
	"PresetDescription": "Template for Apple Mac users.",
	"PresetRemarks": "Sugestedd by Emilie Lafray. :)",
	"RegexEnabled": true,
	"RegexPatternFind": ".*",
	"RegexPatternReplace": "ILUVJOBS"
};

System.Security.Password.Templates.Presets.ChildLaaLaa = {
	"PresetName": "Child: Laa-Laa",
	"CharsExtra": "",
	"RatioLowercase": 1,
	"UseLowercase": true,
	"FilterRemember": true,
	"FilterChars": true,
	"FilterCharsString": "qwxzQWXZ",
	"PasswordLength": 8,
	"RegexEnabled": true,
	"RegexPatternFind": "(\\D{1})(\\D{1}).*",
	"RegexPatternReplace": "$1$2$2-$1$2$2"
};

System.Security.Password.Templates.Presets.ChildNano = {
	"PresetName": "Child: Nano",
	"CharsExtra": "",
	"RatioLowercase": 1,
	"UseLowercase": true,
	"FilterRemember": true,
	"FilterChars": true,
	"FilterCharsString": "qwxzQWXZ",
	"PasswordLength": 4,
	"RegexEnabled": true,
	"RegexPatternFind": "(\\D{1})(\\D{1})(\\D{1})(\\D{1})",
	"RegexPatternReplace": "$1$2$1$4"
};

System.Security.Password.Templates.Presets.ChildTinkyWinky = {
	"PresetName": "Child: Tinky-Winky",
	"CharsExtra": "",
	"RatioLowercase": 1,
	"UseLowercase": true,
	"FilterRemember": true,
	"FilterChars": true,
	"FilterCharsString": "jgqwxzQWXZJG",
	"PasswordLength": 11,
	"RegexEnabled": true,
	"RegexPatternFind": "(\\D{1})(\\D{4}).(\\D{1}).*",
	"RegexPatternReplace": "$1$2-$3$2"
};

System.Security.Password.Templates.Presets.WEPWEPASCII128bit = {
	"PresetName": "WEP: WEP ASCII 128-bit",
	"RatioNumbers": 1,
	"RatioLowercase": 1,
	"RatioUppercase": 1,
	"RatioExtended": 1,
	"UseNumbers": true,
	"UseLowercase": true,
	"UseUppercase": true,
	"UseExtended": true,
	"PasswordLength": 16
};

/*
System.Security.Password.Templates.Presets.WEPWEPASCII256bit = {
"PresetName": "WEP: WEP ASCII 256-bit",
"RatioNumbers": 1,
"RatioLowercase": 1,
"RatioUppercase": 1,
"RatioExtended": 1,
"UseNumbers": true,
"UseLowercase": true,
"UseUppercase": true,
"UseExtended": true,
"PasswordLength": 32
}
*/

System.Security.Password.Templates.Presets.WEPWEPASCII64bit = {
	"PresetName": "WEP: WEP ASCII 64-bit",
	"RatioNumbers": 1,
	"RatioLowercase": 1,
	"RatioUppercase": 1,
	"RatioExtended": 1,
	"UseNumbers": true,
	"UseLowercase": true,
	"UseUppercase": true,
	"UseExtended": true,
	"PasswordLength": 8
};

System.Security.Password.Templates.Presets.WEPWEPHEX128bit = {
	"PresetName": "WEP: WEP HEX 128-bit",
	"CharsExtra": "abcdef",
	"RatioNumbers": 1,
	"RatioExtra": 1,
	"UseNumbers": true,
	"UseExtra": true,
	"PasswordLength": 32
};

/*
System.Security.Password.Templates.Presets.WEPWEPHEX256bit = {
"PresetName": "WEP: WEP HEX 256-bit",
"CharsExtra": "abcdef",
"RatioNumbers": 1,
"RatioExtra": 1,
"UseNumbers": true,
"UseExtra": true,
"PasswordLength": 64
}
*/

System.Security.Password.Templates.Presets.WEPWEPHEX64bit = {
	"PresetName": "WEP: WEP HEX 64-bit",
	"CharsExtra": "abcdef",
	"RatioNumbers": 1,
	"RatioExtra": 1,
	"UseNumbers": true,
	"UseExtra": true,
	"PasswordLength": 16
};

System.Security.Password.Templates.Presets.ScriptSimple = {
	"PresetName": "Script: Simple",
	"PasswordLength": 6,
	"UseUppercase": true,
	"RatioUppercase": 1,
	"FilterRemember": true,
	"ScriptEnabled": true,
	"ScriptCode": "var prefix = new Date().toString(\"yyMMdd_\")\r\nreturn prefix+password.Text;\r\n"
};


System.Security.Password.Templates.Presets.ScriptHMACMD5 = {
	"PresetName": "Script: HMACMD5",
	"PasswordLength": 8,
	"RegexEnabled": true,
	"RegexPatternFind": "Enter Secret Key here",
	"RegexPatternReplace": "Enter URL Address here",
	"ScriptEnabled": true,
	"ScriptCode": "// Use Regular Expression fields:\r\n// \"Find Pattern\" for HMACMD5 Key\r\n" +
	"// \"Replace Pattern\" for HMACMD5 Value\r\n" +
	"var hmac = new System.Security.Cryptography.HMACMD5();\r\n" +
	"var key = System.Text.Encoding.UTF8.GetBytes(CT.RegexPatternFind.value);\r\n" +
	"var bytes = System.Text.Encoding.UTF8.GetBytes(CT.RegexPatternReplace.value);\r\n" +
	"var guid = hmac.ComputeHashAsGuid(key,bytes).ToString(\"D\").replace(\"-\",\"\",\"g\");\r\n" +
	"return guid.substr(0,CT.PasswordLength.value);\r\n"
};

//=============================================================================
// NameSPACE: Security.Password.Templates.Charsets
//-----------------------------------------------------------------------------

System.Security.Password.Templates.Charsets = function () {
	//---------------------------------------------------------
	this.Patterns = {};
	this.RegexPos = {};
	this.RegexNeg = {};
	this.Strings = {
		Volves: "aeiouyAEIOUY",
		Consonants: "bcdfghjklmnpqrstvwxzBCDFGHJKLMNPQRSTVWXZ",
		PhoneKey0: "0",
		PhoneKey1: "1",
		PhoneKey2: "2abcABC",
		PhoneKey3: "3defDEF",
		PhoneKey4: "4ghiGHI",
		PhoneKey5: "5jklJKL",
		PhoneKey6: "6mnoMNO",
		PhoneKey7: "7pqrsPQRS",
		PhoneKey8: "8tuvTUV",
		PhoneKey9: "9wxyzWXYZ",
		PhoneKey10: "*",
		PhoneKey11: "#",
		KeyboardLeft: "123456qwertasdfgzxcvbQWERTASDFGZXCVB\`¬!\"£$%^|",
		KeyboardRight: "7890yuiophjklnmYUIOPHJKLNM-=[];'#,./()_+{}:@~<>?",
		KeyboardSymbols: "`!@#\$%\^&*()_+-=[]\;',./{}|:\"<>?",
		Numbers: "0123456789",
		Uppercase: "QWERTYUIOPASDFGHJKLZXCVBNM",
		Lowercase: "qwertyuiopasdfghjklzxcvbnm",
		Extended: "`!@#%^&*()_+-=[]\;',./{}|:\"<>?",
		// These two can by changed by user..
		Extra: "$£€",
		Chars: "qwxzQWZX"
	};
	//---------------------------------------------------------
	this.GetPatternFromString = function (s) {
		/// <summary>
		/// Get Regular expression pattern from string.
		/// </summary>
		/// <returns name="s" type="String">Regular expression pattern</returns>
		var pattern = "";
		for (var i = 0; i < s.length; i++) {
			var hex = s.charCodeAt(i).toString(16);
			pattern += "\\u" + "0000".substr(0, 4 - hex.length) + hex + "";
		}
		return pattern;
	};
	//---------------------------------------------------------
	this.InitializeClass = function () {
		// Create aditional properties. Keep same order!
		this.Strings["Letters"] = this.Strings.Uppercase + this.Strings.Lowercase;
		this.Strings["Letnums"] = this.Strings.Letters + this.Strings.Numbers;
		this.Strings["Keyboard"] = this.Strings.KeyboardLeft + this.Strings.KeyboardRight + this.Strings.KeyboardSymbols;
		this.Strings["Ascii"] = this.Strings.Letnums + this.Strings.Extended;
		// Create Regular Expressions.
		for (var property in this.Strings) {
			this.Patterns[property] = this.GetPatternFromString(this.Strings[property]);
			this.RegexPos[property] = new RegExp("[" + this.Patterns[property] + "]", "g");
			this.RegexNeg[property] = new RegExp("[^" + this.Patterns[property] + "]", "g");
		}
	};
	this.InitializeClass();
};

//=============================================================================
// NameSPACE: Security.Password.Templates.Filters
//-----------------------------------------------------------------------------

System.Security.Password.Templates.Filters = {};

System.Security.Password.Temp = {};

System.Security.Password.Templates.Filters.Remember = function (generator, password, charsList) {
	/// <summary>
	/// Analyses type of last char (volve or consonant) and removes all chars of same type.
	/// This creates <volve>,<consonant>,<volve>,<consonant>,... password.
	/// </summary>
	/// <returns type="System.Char[]">Array of chars.</returns>
	var chars = new String(charsList);
	// Prepare expressions for faster execution.
	var tmp = System.Security.Password.Temp;
	if (!tmp.Charsets) {
		tmp.Charsets = new System.Security.Password.Templates.Charsets();
	}
	// First we need to keep only proper chars.
	chars = chars.replace(tmp.Charsets.RegexNeg.Letters, "");
	// We need to limit to volves or consonant if this is second+ letter only.
	if (password.length > 0) {
		// Get last char.
		var lastChar = password.charAt(password.length - 1);
		// If Previous character is volve then...
		if (lastChar.match(tmp.Charsets.RegexPos.Volves)) {
			chars = chars.replace(tmp.Charsets.RegexPos.Volves, "");
		} else {
			chars = chars.replace(tmp.Charsets.RegexPos.Consonants, "");
		}
	}
	return chars;
};

System.Security.Password.Templates.Filters.Phone = function (generator, password, charsList) {
	/// <summary>
	/// Analyses last char of password and removes all chars which are located on same phone key.
	/// </summary>
	/// <returns type="System.Char[]">Array of chars.</returns>
	var chars = new String(charsList);
	// Prepare expressions for faster execution.
	var tmp = System.Security.Password.Temp;
	if (!tmp.Charsets) {
		tmp.Charsets = new System.Security.Password.Templates.Charsets();
	}
	// First we need to keep only letters and numbers.
	chars = chars.replace(tmp.Charsets.RegexNeg.Letnums, "");
	// We need to limit if this is second+ letter only.
	if (password.length > 0) {
		// Get last char.
		var lastChar = password.charAt(password.length - 1);
		// Route thru GSM Phone keys.
		for (var i = 0; i === 9; i++) {
			var regexOnKey = tmp.Charsets.RegexPos["PhoneKey" + i];
			// If current key contains last char of password then...
			if (lastChar.match(regexOnKey)) {
				// Remove all chars located on same key.
				chars = chars.replace(regexOnKey, "");
			}
		}
	}
	return chars;
};

System.Security.Password.Templates.Filters.Keyboard = function (generator, password, charsList) {
	/// <summary>
	/// Analyses last char of password and removes all chars which are located on same side of keyboard.
	/// </summary>
	/// <returns type="System.Char[]">Array of chars.</returns>
	var chars = new String(charsList);
	// Prepare expressions for faster execution.
	var tmp = System.Security.Password.Temp;
	if (!tmp.Charsets) {
		tmp.Charsets = new System.Security.Password.Templates.Charsets();
	}
	// First we need to keep only proper chars which exists on keyboard.
	chars = chars.replace(tmp.Charsets.RegexNeg.Keyboard, "");
	// We need to limit if this is second+ letter only.
	if (password.length > 0) {
		// Get last char.
		var lastChar = password.charAt(password.length - 1);
		// If Previous character is on the left side then...
		if (lastChar.match(tmp.Charsets.RegexNeg.KeyboardLeft)) {
			// Remove left side chars.
			chars = chars.replace(tmp.Charsets.RegexNeg.KeyboardLeft, "");
		} else {
			// Remove right side chars.
			chars = chars.replace(tmp.Charsets.RegexNeg.KeyboardRight, "");
		}
	}
	return chars;
};

System.Security.Password.Templates.Filters.Ascii = function (generator, password, charsList) {
	/// <summary>
	/// Removes all non ASCII chars from charsList.
	/// </summary>
	/// <returns type="System.Char[]">Array of chars.</returns>
	var chars = new String(charsList);
	// Prepare expressions for faster execution.
	var tmp = System.Security.Password.Temp;
	if (!tmp.Charsets) {
		tmp.Charsets = new System.Security.Password.Templates.Charsets();
	}
	// First we need to keep only proper chars.
	chars = chars.replace(tmp.Charsets.RegexNeg.Ascii, "");
	return chars;
};

System.Security.Password.Templates.Filters.Chars = function (generator, password, charsList) {
	/// <summary>
	/// Removes rare chars from charsList.
	/// </summary>
	/// <returns type="System.Char[]">Array of chars.</returns>
	var chars = new String(charsList);
	// Prepare expressions for faster execution.
	var tmp = System.Security.Password.Temp;
	if (!tmp.Charsets) {
		tmp.Charsets = new System.Security.Password.Templates.Charsets();
	}
	var pattern = tmp.Charsets.GetPatternFromString(generator.Preset.FilterCharsString);
	// Remove rare chars.
	var charsFilter = new RegExp("[" + pattern + "]", "g");
	chars = chars.replace(charsFilter, "");
	return chars;
};

//=============================================================================
// NameSPACE: Security.Password.Templates.Calls
//-----------------------------------------------------------------------------
System.Security.Password.Templates.Calls = {};

System.Security.Password.Templates.Calls.LT_Unicode = {
	"CallName": "LT: Unicode", "Data": [
		["0x0020", " ", "Tarpas"],
		["0x0021", "!", "Šauktukas"],
		["0x005C", "\"", "Kabutės"],
		["0x0023", "#", "Grotelės"],
		["0x0024", "$", "Doleris"],
		["0x0025", "%", "Procentas"],
		["0x0026", "&", "Ženklas IR"],
		["0x0027", "'", "Apostrofas"],
		["0x0028", "(", "Skliaustelis Atsidaro"],
		["0x0029", ")", "Skliaustelis Užsidaro"],
		["0x002A", "*", "Žvaigždutė"],
		["0x002B", "+", "Pliusas"],
		["0x002C", ",", "Kablelis"],
		["0x002D", "-", "Minusas"],
		["0x002E", ".", "Taškas"],
		["0x002F", "/", "Įžambus brūkšnys"],
		["0x0030", "0", "Skaitmuo Vienas"],
		["0x0031", "1", "Skaitmuo Du"],
		["0x0032", "2", "Skaitmuo Trys"],
		["0x0033", "3", "Skaitmuo Keturi"],
		["0x0034", "4", "Skaitmuo Penki"],
		["0x0035", "5", "Skaitmuo Šeši"],
		["0x0036", "6", "Skaitmuo Septyni"],
		["0x0037", "7", "Skaitmuo Aštuoni"],
		["0x0038", "8", "Skaitmuo Devyni"],
		["0x0039", "9", "Skaitmuo Nulis"],
		["0x003A", ":", "Dvitaškis"],
		["0x003B", ";", "Kabliataškis"],
		["0x003C", "<", "Mažiau"],
		["0x003D", "=", "Lygybė"],
		["0x003E", ">", "Daugiau"],
		["0x003F", "?", "Klaustukas"],
		["0x0040", "@", "Eta"],
		["0x0041", "A", "Lotyniška didžioji raidė A"],
		["0x0042", "B", "Lotyniška didžioji raidė B"],
		["0x0043", "C", "Lotyniška didžioji raidė C"],
		["0x0044", "D", "Lotyniška didžioji raidė D"],
		["0x0045", "E", "Lotyniška didžioji raidė E"],
		["0x0046", "F", "Lotyniška didžioji raidė F"],
		["0x0047", "G", "Lotyniška didžioji raidė G"],
		["0x0048", "H", "Lotyniška didžioji raidė H"],
		["0x0049", "I", "Lotyniška didžioji raidė I"],
		["0x004A", "J", "Lotyniška didžioji raidė J"],
		["0x004B", "K", "Lotyniška didžioji raidė K"],
		["0x004C", "L", "Lotyniška didžioji raidė L"],
		["0x004D", "M", "Lotyniška didžioji raidė M"],
		["0x004E", "N", "Lotyniška didžioji raidė N"],
		["0x004F", "O", "Lotyniška didžioji raidė O"],
		["0x0050", "P", "Lotyniška didžioji raidė P"],
		["0x0051", "Q", "Lotyniška didžioji raidė Q"],
		["0x0052", "R", "Lotyniška didžioji raidė R"],
		["0x0053", "S", "Lotyniška didžioji raidė S"],
		["0x0054", "T", "Lotyniška didžioji raidė T"],
		["0x0055", "U", "Lotyniška didžioji raidė U"],
		["0x0056", "V", "Lotyniška didžioji raidė V"],
		["0x0057", "W", "Lotyniška didžioji raidė W"],
		["0x0058", "X", "Lotyniška didžioji raidė X"],
		["0x0059", "Y", "Lotyniška didžioji raidė Y"],
		["0x005A", "Z", "Lotyniška didžioji raidė Z"],
		["0x005B", "[", "Laužtinis skliaustelis atsidaro"],
		["0x005C", "\\", "Atvirkščias įžambinis brūkšnys"],
		["0x005D", "]", "Laužtinis skliaustelis užsidaro"],
		["0x005E", "^", "Cirkumfleksas"],
		["0x005F", "_", "Pabraukimas"],
		["0x0060", "`", "Kairinis Kirtis"],
		["0x0061", "a", "Lotyniška mažoji raidė A"],
		["0x0062", "b", "Lotyniška mažoji raidė B"],
		["0x0063", "c", "Lotyniška mažoji raidė C"],
		["0x0064", "d", "Lotyniška mažoji raidė D"],
		["0x0065", "e", "Lotyniška mažoji raidė E"],
		["0x0066", "f", "Lotyniška mažoji raidė F"],
		["0x0067", "g", "Lotyniška mažoji raidė G"],
		["0x0068", "h", "Lotyniška mažoji raidė H"],
		["0x0069", "i", "Lotyniška mažoji raidė I"],
		["0x006A", "j", "Lotyniška mažoji raidė J"],
		["0x006B", "k", "Lotyniška mažoji raidė K"],
		["0x006C", "l", "Lotyniška mažoji raidė L"],
		["0x006D", "m", "Lotyniška mažoji raidė M"],
		["0x006E", "n", "Lotyniška mažoji raidė N"],
		["0x006F", "o", "Lotyniška mažoji raidė O"],
		["0x0070", "p", "Lotyniška mažoji raidė P"],
		["0x0071", "q", "Lotyniška mažoji raidė Q"],
		["0x0072", "r", "Lotyniška mažoji raidė R"],
		["0x0073", "s", "Lotyniška mažoji raidė S"],
		["0x0074", "t", "Lotyniška mažoji raidė T"],
		["0x0075", "u", "Lotyniška mažoji raidė U"],
		["0x0076", "v", "Lotyniška mažoji raidė V"],
		["0x0077", "w", "Lotyniška mažoji raidė W"],
		["0x0078", "x", "Lotyniška mažoji raidė X"],
		["0x0079", "y", "Lotyniška mažoji raidė Y"],
		["0x007A", "z", "Lotyniška mažoji raidė Z"],
		["0x007B", "{", "Vingiuotas skliaustelis atsidaro"],
		["0x007C", "|", "Vertikalus brūkšnelis"],
		["0x007D", "}", "Vingiuotas skliaustelis užsidaro"],
		["0x007E", "~", "Tildė"],
		["0x00A3", "£", "Svaras"],
		["0x0105", "ą", "Lietuviška mažoji raidė Ą"],
		["0x010d", "č", "Lietuviška mažoji raidė Č"],
		["0x0119", "ę", "Lietuviška mažoji raidė Ę"],
		["0x0117", "ė", "Lietuviška mažoji raidė Ė"],
		["0x012f", "į", "Lietuviška mažoji raidė Į"],
		["0x0161", "š", "Lietuviška mažoji raidė Š"],
		["0x0173", "ų", "Lietuviška mažoji raidė Ų"],
		["0x016b", "ū", "Lietuviška mažoji raidė Ū"],
		["0x017e", "ž", "Lietuviška mažoji raidė Ž"],
		["0x0104", "Ą", "Lietuviška didžioji raidė Ą"],
		["0x010c", "Č", "Lietuviška didžioji raidė Č"],
		["0x0118", "Ę", "Lietuviška didžioji raidė Ę"],
		["0x0116", "Ė", "Lietuviška didžioji raidė Ė"],
		["0x012e", "Į", "Lietuviška didžioji raidė Į"],
		["0x0160", "Š", "Lietuviška didžioji raidė Š"],
		["0x0172", "Ų", "Lietuviška didžioji raidė Ų"],
		["0x016a", "Ū", "Lietuviška didžioji raidė Ū"],
		["0x017d", "Ž", "Lietuviška didžioji raidė Ž"],
		["0x20AC", "€", "Euras"]
	]
};

System.Security.Password.Templates.Calls.EN_Unicode = {
	"CallName": "EN: Unicode", "Data": [
		["0x0020", " ", "Space"],
		["0x0021", "!", "Exclamination Mark"],
		["0x005C", "\"", "Quatation Mark"],
		["0x0023", "#", "Number Sign"],
		["0x0024", "$", "Dollar Sign"],
		["0x0025", "%", "Percent Sign"],
		["0x0026", "&", "Ampersand"],
		["0x0027", "'", "Apostrophe"],
		["0x0028", "(", "Left Parenthesis"],
		["0x0029", ")", "Right Parenthesis"],
		["0x002A", "*", "Asterisk"],
		["0x002B", "+", "Plus Sign"],
		["0x002C", ",", "Comma"],
		["0x002D", "-", "Hyphen-Minus"],
		["0x002E", ".", "Full Stop"],
		["0x002F", "/", "Solidus"],
		["0x0030", "0", "Digit Zero"],
		["0x0031", "1", "Digit One"],
		["0x0032", "2", "Digit Two"],
		["0x0033", "3", "Digit Three"],
		["0x0034", "4", "Digit Four"],
		["0x0035", "5", "Digit Five"],
		["0x0036", "6", "Digit Six"],
		["0x0037", "7", "Digit Seven"],
		["0x0038", "8", "Digit Eight"],
		["0x0039", "9", "Digit Nine"],
		["0x003A", ":", "Colon"],
		["0x003B", ";", "Semicolon"],
		["0x003C", "<", "Less-Than Sign"],
		["0x003D", "=", "Equals Sign"],
		["0x003E", ">", "Greater-Than Sign"],
		["0x003F", "?", "Question Mark"],
		["0x0040", "@", "Commercial At"],
		["0x0041", "A", "Latin Capital Letter A"],
		["0x0042", "B", "Latin Capital Letter B"],
		["0x0043", "C", "Latin Capital Letter C"],
		["0x0044", "D", "Latin Capital Letter D"],
		["0x0045", "E", "Latin Capital Letter E"],
		["0x0046", "F", "Latin Capital Letter F"],
		["0x0047", "G", "Latin Capital Letter G"],
		["0x0048", "H", "Latin Capital Letter H"],
		["0x0049", "I", "Latin Capital Letter I"],
		["0x004A", "J", "Latin Capital Letter J"],
		["0x004B", "K", "Latin Capital Letter K"],
		["0x004C", "L", "Latin Capital Letter L"],
		["0x004D", "M", "Latin Capital Letter M"],
		["0x004E", "N", "Latin Capital Letter N"],
		["0x004F", "O", "Latin Capital Letter O"],
		["0x0050", "P", "Latin Capital Letter P"],
		["0x0051", "Q", "Latin Capital Letter Q"],
		["0x0052", "R", "Latin Capital Letter R"],
		["0x0053", "S", "Latin Capital Letter S"],
		["0x0054", "T", "Latin Capital Letter T"],
		["0x0055", "U", "Latin Capital Letter U"],
		["0x0056", "V", "Latin Capital Letter V"],
		["0x0057", "W", "Latin Capital Letter W"],
		["0x0058", "X", "Latin Capital Letter X"],
		["0x0059", "Y", "Latin Capital Letter Y"],
		["0x005A", "Z", "Latin Capital Letter Z"],
		["0x005B", "[", "Left Square Bracket"],
		["0x005C", "\\", "Reverse Solidus"],
		["0x005D", "]", "Left Square Bracket"],
		["0x005E", "^", "Circumflex Accent"],
		["0x005F", "_", "Low Line"],
		["0x0060", "`", "Grave Accent"],
		["0x0061", "a", "Latin Small Letter A"],
		["0x0062", "b", "Latin Small Letter B"],
		["0x0063", "c", "Latin Small Letter C"],
		["0x0064", "d", "Latin Small Letter D"],
		["0x0065", "e", "Latin Small Letter E"],
		["0x0066", "f", "Latin Small Letter F"],
		["0x0067", "g", "Latin Small Letter G"],
		["0x0068", "h", "Latin Small Letter H"],
		["0x0069", "i", "Latin Small Letter I"],
		["0x006A", "j", "Latin Small Letter J"],
		["0x006B", "k", "Latin Small Letter K"],
		["0x006C", "l", "Latin Small Letter L"],
		["0x006D", "m", "Latin Small Letter M"],
		["0x006E", "n", "Latin Small Letter N"],
		["0x006F", "o", "Latin Small Letter O"],
		["0x0070", "p", "Latin Small Letter P"],
		["0x0071", "q", "Latin Small Letter Q"],
		["0x0072", "r", "Latin Small Letter R"],
		["0x0073", "s", "Latin Small Letter S"],
		["0x0074", "t", "Latin Small Letter T"],
		["0x0075", "u", "Latin Small Letter U"],
		["0x0076", "v", "Latin Small Letter V"],
		["0x0077", "w", "Latin Small Letter W"],
		["0x0078", "x", "Latin Small Letter X"],
		["0x0079", "y", "Latin Small Letter Y"],
		["0x007A", "z", "Latin Small Letter Z"],
		["0x007B", "{", "Left Curly Bracket"],
		["0x007C", "|", "Vertikal Line"],
		["0x007D", "}", "Right Curly Bracket"],
		["0x007E", "~", "Tilde"],
		["0x00A3", "£", "Pound Sign"],
		["0x201C", "“", "Left Double Quotation Mark"],
		["0x201D", "”", "Right Double Quotation Mark"],
		["0x20AC", "€", "Euro Sign"]
	]
};

System.Security.Password.Templates.Calls.EN_TelecomB = {
	"CallName": "EN: Telecom B", "Data": [
		["0x0030", "0", "Zero"],
		["0x0031", "1", "One"],
		["0x0032", "2", "Two"],
		["0x0033", "3", "Three"],
		["0x0034", "4", "Four"],
		["0x0035", "5", "Five"],
		["0x0036", "6", "Six"],
		["0x0037", "7", "Seven"],
		["0x0038", "8", "Eight"],
		["0x0039", "9", "Nine"],
		["0x0041", "A", "Alfred"],
		["0x0042", "B", "Benjamin"],
		["0x0043", "C", "Charles"],
		["0x0044", "D", "David"],
		["0x0045", "E", "Edward"],
		["0x0046", "F", "Frederick"],
		["0x0047", "G", "George"],
		["0x0048", "H", "Harry"],
		["0x0049", "I", "Isaac"],
		["0x004A", "J", "Jack"],
		["0x004B", "K", "King"],
		["0x004C", "L", "London"],
		["0x004D", "M", "Marry"],
		["0x004E", "N", "Nelly"],
		["0x004F", "O", "Oliver"],
		["0x0050", "P", "Peter"],
		["0x0051", "Q", "Queen"],
		["0x0052", "R", "Robert"],
		["0x0053", "S", "Samuel"],
		["0x0054", "T", "Tommy"],
		["0x0055", "U", "Uncle"],
		["0x0056", "V", "Victor"],
		["0x0057", "W", "William"],
		["0x0058", "X", "Xray"],
		["0x0059", "Y", "Yellow"],
		["0x005A", "Z", "Zebra"],
		["0x0061", "a", "alfred"],
		["0x0062", "b", "benjamin"],
		["0x0063", "c", "charles"],
		["0x0064", "d", "david"],
		["0x0065", "e", "edward"],
		["0x0066", "f", "frederick"],
		["0x0067", "g", "george"],
		["0x0068", "h", "harry"],
		["0x0069", "i", "isaac"],
		["0x006A", "j", "jack"],
		["0x006B", "k", "king"],
		["0x006C", "l", "london"],
		["0x006D", "m", "marry"],
		["0x006E", "n", "nelly"],
		["0x006F", "o", "oliver"],
		["0x0070", "p", "peter"],
		["0x0071", "q", "queen"],
		["0x0072", "r", "robert"],
		["0x0073", "s", "samuel"],
		["0x0074", "t", "tommy"],
		["0x0075", "u", "uncle"],
		["0x0076", "v", "victor"],
		["0x0077", "w", "william"],
		["0x0078", "x", "xray"],
		["0x0079", "y", "yellow"],
		["0x007A", "z", "zebra"]
	]
};

System.Security.Password.Templates.Calls.EN_NATO = {
	"CallName": "EN: NATO", "Data": [
		["0x0030", "0", "Zero"],
		["0x0031", "1", "One"],
		["0x0032", "2", "Two"],
		["0x0033", "3", "Three"],
		["0x0034", "4", "Four"],
		["0x0035", "5", "Five"],
		["0x0036", "6", "Six"],
		["0x0037", "7", "Seven"],
		["0x0038", "8", "Eight"],
		["0x0039", "9", "Nine"],
		["0x0041", "A", "Alpha"],
		["0x0042", "B", "Bravo"],
		["0x0043", "C", "Charlie"],
		["0x0044", "D", "Delta"],
		["0x0045", "E", "Echo"],
		["0x0046", "F", "Foxtrot"],
		["0x0047", "G", "Golf"],
		["0x0048", "H", "Hotel"],
		["0x0049", "I", "India"],
		["0x004A", "J", "Juliet"],
		["0x004B", "K", "Kilo"],
		["0x004C", "L", "Lima"],
		["0x004D", "M", "Mike"],
		["0x004E", "N", "November"],
		["0x004F", "O", "Oscar"],
		["0x0050", "P", "Papa"],
		["0x0051", "Q", "Quebec"],
		["0x0052", "R", "Romeo"],
		["0x0053", "S", "Sierra"],
		["0x0054", "T", "Tango"],
		["0x0055", "U", "Uniform"],
		["0x0056", "V", "Victor"],
		["0x0057", "W", "Whiskey"],
		["0x0058", "X", "Xray"],
		["0x0059", "Y", "Yankee"],
		["0x005A", "Z", "Zulu"],
		["0x0061", "a", "alpha"],
		["0x0062", "b", "bravo"],
		["0x0063", "c", "charlie"],
		["0x0064", "d", "delta"],
		["0x0065", "e", "echo"],
		["0x0066", "f", "foxtrot"],
		["0x0067", "g", "golf"],
		["0x0068", "h", "hotel"],
		["0x0069", "i", "india"],
		["0x006A", "j", "juliet"],
		["0x006B", "k", "kilo"],
		["0x006C", "l", "lima"],
		["0x006D", "m", "mike"],
		["0x006E", "n", "november"],
		["0x006F", "o", "oscar"],
		["0x0070", "p", "papa"],
		["0x0071", "q", "quebec"],
		["0x0072", "r", "romeo"],
		["0x0073", "s", "sierra"],
		["0x0074", "t", "tango"],
		["0x0075", "u", "uniform"],
		["0x0076", "v", "victor"],
		["0x0077", "w", "whiskey"],
		["0x0078", "x", "xray"],
		["0x0079", "y", "yankee"],
		["0x007A", "z", "zulu"]
	]
};

System.Security.Password.Templates.Calls.EN_Pronunciation = {
	"CallName": "EN: Pronunciation", "Data": [
		["0x0030", "0", "'zɪərəu [zero]"],
		["0x0031", "1", "wʌn [one]"],
		["0x0032", "2", "tu [two]"],
		["0x0033", "3", "ɵri [three]"],
		["0x0034", "4", "fɔ [four]"],
		["0x0035", "5", "faɪv [five]"],
		["0x0036", "6", "sɪks [six]"],
		["0x0037", "7", "'sevn [seven]"],
		["0x0038", "8", "eɪt [eigth]"],
		["0x0039", "9", "naɪn [nine]"],
		["0x0041", "A", "eɪ"],
		["0x0042", "B", "bi:"],
		["0x0043", "C", "si:"],
		["0x0044", "D", "di:"],
		["0x0045", "E", "i:"],
		["0x0046", "F", "ef"],
		["0x0047", "G", "dʒi:"],
		["0x0048", "H", "eɪtʃ"],
		["0x0049", "I", "aɪ"],
		["0x004A", "J", "dʒeɪ"],
		["0x004B", "K", "keɪ"],
		["0x004C", "L", "el"],
		["0x004D", "M", "em"],
		["0x004E", "N", "en"],
		["0x004F", "O", "ɘu"],
		["0x0050", "P", "pi:"],
		["0x0051", "Q", "qju:"],
		["0x0052", "R", "a:"],
		["0x0053", "S", "es"],
		["0x0054", "T", "ti:"],
		["0x0055", "U", "ju:"],
		["0x0056", "V", "vi:"],
		["0x0057", "W", "'dʌblju:"],
		["0x0058", "X", "eks"],
		["0x0059", "Y", "waɪ"],
		["0x005A", "Z", "zi:"],
		["0x0061", "a", "eɪ"],
		["0x0062", "b", "bi:"],
		["0x0063", "c", "si:"],
		["0x0064", "d", "di:"],
		["0x0065", "e", "i:"],
		["0x0066", "f", "ef"],
		["0x0067", "g", "dʒi:"],
		["0x0068", "h", "eɪtʃ"],
		["0x0069", "i", "aɪ"],
		["0x006A", "j", "dʒeɪ"],
		["0x006B", "k", "keɪ"],
		["0x006C", "l", "el"],
		["0x006D", "m", "em"],
		["0x006E", "n", "en"],
		["0x006F", "o", "ɘu"],
		["0x0070", "p", "pi:"],
		["0x0071", "q", "qju:"],
		["0x0072", "r", "a:"],
		["0x0073", "s", "es"],
		["0x0074", "t", "ti:"],
		["0x0075", "u", "ju:"],
		["0x0076", "v", "vi:"],
		["0x0077", "w", "'dʌblju:"],
		["0x0078", "x", "eks"],
		["0x0079", "y", "waɪ"],
		["0x007A", "z", "zi:"]
	]
};

System.Security.Password.Templates.Calls.EN_NamesAndThings = {
	"CallName": "EN: Names and Things", "Data": [
		// Uppercase (Names).
		["65", "A", "America"],
		["66", "B", "Berlin"],
		["67", "C", "Canada"],
		["68", "D", "Denmark"],
		["69", "E", "Europe"],
		["70", "F", "France"],
		["71", "G", "Germany"],
		["72", "H", "Hungary"],
		["73", "I", "India"],
		["74", "J", "Jamaica"],
		["75", "K", "Korea"],
		["76", "L", "London"],
		["77", "M", "Maljorka"],
		["78", "N", "Norway"],
		["79", "O", "Oxford"],
		["80", "P", "Panama"],
		["81", "Q", "Quebec"],
		["82", "R", "Rome"],
		["83", "S", "Spain"],
		["84", "T", "Taiwan"],
		["85", "U", "Ukraine"],
		["86", "V", "Vienna"],
		["87", "W", "Washington"],
		["88", "X", "Xiamen"],
		["89", "Y", "York"],
		["90", "Z", "Zambia"],
		// Lowercase (things).
		["97", "a", "alcohol"],
		["98", "b", "bank"],
		["99", "c", "cable"],
		["100", "d", "dream"],
		["101", "e", "echo"],
		["102", "f", "force"],
		["103", "g", "ground"],
		["104", "h", "hotel"],
		["105", "i", "ice"],
		["106", "j", "job"],
		["107", "k", "key"],
		["108", "l", "label"],
		["109", "m", "memory"],
		["110", "n", "noise"],
		["111", "o", "object"],
		["112", "p", "plant"],
		["113", "q", "queen"],
		["114", "r", "radio"],
		["115", "s", "salt"],
		["116", "t", "table"],
		["117", "u", "uniform"],
		["118", "v", "vertical"],
		["119", "w", "whiskey"],
		["120", "x", "xray"],
		["121", "y", "yellow"],
		["122", "z", "zulu"]
	]
};

System.Security.Password.Templates.Calls.SP_Morse = {
	/// <summary>
	/// Morse signal is split into small timeframes.
	/// Radio signal can be ON or OFF due one frame.
	/// By default one frame lasts 60ms (for speed of 20 WPM).
	/// International Morse code is composed of six elements:
	///	Signal ON (by default F = 60ms):
	///      1xF - Short mark, dot (·);
	///      3xF - Longer mark, dash (-);
	/// Signal OFF (Radio Silence):
	///      1xF - gap between dots and dashes;
	///      3xF - gap between letters;
	///      7xF - gap between words.
	///     10xF - gap between sentences.
	///
	/// Time for one "dit" can be computed by the formula: T = 1200 / W
	/// Where:
	///     W is the desired speed in words-per-minute, and
	///     T is one dit-time in milliseconds.
	/// Note: Default word ("Paris") = 50 dots.
	/// 
	/// Skills (Send / Read ("copy), WPM - Words Per Minute):
	///		 5/5  WPM - beginner;
	///		10/10 WPM - intermediate (amateur operator);
	///		20/20 WPM - professional (commercial operator);
	///		30/60 WPM - highly skilled professional;
	///		35/75 WPM - guru;
	///
	/// William Pierpont N0HFF notes some operators may have passed 100 WPM.
	/// By this time they are "hearing" phrases and sentences rather than words.
	///
	/// </summary>
	"CallName": "Special: Radio Morse", "Data": [
		["0x0000", "", "3 • of silence"], // Space between letters.
		["0x0020", " ", "7 • of silence"], // Space between words.
		["0x0030", "0", "— — — — —"],
		["0x0031", "1", "•  — — — —"],
		["0x0032", "2", "•  •  — — —"],
		["0x0033", "3", "•  •  •  — —"],
		["0x0034", "4", "•  •  •  •  —"],
		["0x0035", "5", "•  •  •  •  • "],
		["0x0036", "6", "— •  •  •  • "],
		["0x0037", "7", "— — •  •  • "],
		["0x0038", "8", "— — — •  • "],
		["0x0039", "9", "— — — — • "],
		["0x0041", "A", "•  —"],
		["0x0042", "B", "— •  •  • "],
		["0x0043", "C", "— •  — • "],
		["0x0044", "D", "— •  • "],
		["0x0045", "E", "• "],
		["0x0046", "F", "•  •  — • "],
		["0x0047", "G", "— — • "],
		["0x0048", "H", "•  •  •  • "],
		["0x0049", "I", "•  • "],
		["0x004A", "J", "•  — — —"],
		["0x004B", "K", "— •  —"],
		["0x004C", "L", "•  — •  • "],
		["0x004D", "M", "— —"],
		["0x004E", "N", "— • "],
		["0x004F", "O", "— — —"],
		["0x0050", "P", "•  — — • "],
		["0x0051", "Q", "— — •  —"],
		["0x0052", "R", "•  — • "],
		["0x0053", "S", "•  •  • "],
		["0x0054", "T", "—"],
		["0x0055", "U", "•  •  —"],
		["0x0056", "V", "•  •  •  —"],
		["0x0057", "W", "•  — —"],
		["0x0058", "X", "— •  •  —"],
		["0x0059", "Y", "— •  — —"],
		["0x005A", "Z", "— — •  • "],
		["0x0061", "a", "•  —"],
		["0x0062", "b", "— •  •  • "],
		["0x0063", "c", "— •  — • "],
		["0x0064", "d", "— •  • "],
		["0x0065", "e", "• "],
		["0x0066", "f", "•  •  — • "],
		["0x0067", "g", "— — • "],
		["0x0068", "h", "•  •  •  • "],
		["0x0069", "i", "•  • "],
		["0x006A", "j", "•  — — —"],
		["0x006B", "k", "— •  —"],
		["0x006C", "l", "•  — •  • "],
		["0x006D", "m", "— —"],
		["0x006E", "n", "— • "],
		["0x006F", "o", "— — —"],
		["0x0070", "p", "•  — — • "],
		["0x0071", "q", "— — •  —"],
		["0x0072", "r", "•  — • "],
		["0x0073", "s", "•  •  • "],
		["0x0074", "t", "—"],
		["0x0075", "u", "•  •  —"],
		["0x0076", "v", "•  •  •  —"],
		["0x0077", "w", "•  — —"],
		["0x0078", "x", "— •  •  —"],
		["0x0079", "y", "— •  — —"],
		["0x007A", "z", "— — •  • "],
		["0x002E", ".", "•  — •  — •  —"],
		["0x002C", ",", "— — •  •  — —"],
		["0x003A", ":", "— — — •  •  • "],
		["0x003F", "?", "•  •  — — •  • "],
		["0x0027", "'", "•  — — — — • "],
		["0x002D", "-", "— •  •  •  •  —"],
		["0x002F", "/", "— •  •  — • "],
		["0x0028", "(", "— •  — — •  —"],
		["0x0029", ")", "— •  — — •  —"],
		["0x005C", "\"", "•  — •  •  — • "],
		["0x0021", "!", "— •  — •  — —"],
		["0x003B", ";", "— •  — •  — • "],
		["0x003D", "=", "— •  •  •  —"],
		["0x005F", "_", "•  •  — — •  —"],
		["0x0040", "@", "•  — — •  — • "]
	]
};

System.Security.Password.Templates.Calls.SP_Braille = {
	/// <summary>
	/// http://unifiedbraillecode.com/
	/// Special symbols:
	///
	/// Numbering of dots on Braille button.
	///     1 4
	///     2 5
	///     3 6
	///     7 8
	///
	/// Question mark is the same as the opening quotation mark.
	/// Therefore the placement of the dots -before a word or after a word- will determine which symbol it is.
	///
	/// Opening and closing parentheses are shown with the same symbol.
	/// Therefore, the placement context will determine whether the parentheses is opening or closing.
	///
	/// Unicode "Braille Patterns" range: 0x2800–0x28FF
	/// </summary>
	"CallName": "Special: Unified Braille Code", "Data": [
		["0x0061", "a", "[●○○ ○○○ ○○] 1"],
		["0x0062", "b", "[●○○ ○●○ ○○] 15"],
		["0x0063", "c", "[●○○ ○○● ○○] 16"],
		["0x0064", "d", "[●○○ ○○○ ○●] 18"],
		["0x0065", "e", "[○●○ ○○○ ○○] 2"],
		["0x0066", "f", "[○●○ ○●○ ○○] 25"],
		["0x0067", "g", "[○●○ ○○● ○○] 26"],
		["0x0068", "h", "[○●○ ○○○ ○●] 28"],
		["0x0069", "i", "[○○● ○○○ ○○] 3"],
		["0x006a", "j", "[○○● ○●● ○○] 356"],
		["0x006b", "k", "[○○● ○○● ○●] 368"],
		["0x006c", "l", "[○○● ○●○ ○○] 35"],
		["0x006d", "m", "[○○● ○○● ○○] 36"],
		["0x006e", "n", "[○○● ○○○ ○●] 38"],
		["0x006f", "o", "[○○○ ○○○ ●○] 7"],
		["0x0070", "p", "[○○○ ○●● ●○] 567"],
		["0x0071", "q", "[○○○ ○○● ●●] 678"],
		["0x0072", "r", "[○○○ ○●○ ●○] 57"],
		["0x0073", "s", "[○○○ ○○● ●○] 67"],
		["0x0074", "t", "[○○○ ○○○ ●●] 78"],
		["0x0075", "u", "[○●● ○○○ ○○] 23"],
		["0x0076", "v", "[○●● ○●○ ○○] 235"],
		["0x0077", "w", "[○●● ○○● ○○] 236"],
		["0x0078", "x", "[○●● ○○○ ○●] 238"],
		["0x0079", "y", "[●○○ ○○○ ●○] 17"],
		["0x007a", "z", "[●○○ ○●○ ●○] 157"],
		["0x0041", "A", "[●○○ ●○○ ○○] 14"],
		["0x0042", "B", "[●○○ ●●○ ○○] 145"],
		["0x0043", "C", "[●○○ ●○● ○○] 146"],
		["0x0044", "D", "[●○○ ●○○ ○●] 148"],
		["0x0045", "E", "[○●○ ●○○ ○○] 24"],
		["0x0046", "F", "[○●○ ●●○ ○○] 245"],
		["0x0047", "G", "[○●○ ●○● ○○] 246"],
		["0x0048", "H", "[○●○ ●○○ ○●] 248"],
		["0x0049", "I", "[○○● ●○○ ○○] 34"],
		["0x004a", "J", "[○○● ●●● ○○] 3456"],
		["0x004b", "K", "[○○● ●○● ○●] 3468"],
		["0x004c", "L", "[○○● ●●○ ○○] 345"],
		["0x004d", "M", "[○○● ●○● ○○] 346"],
		["0x004e", "N", "[○○● ●○○ ○●] 348"],
		["0x004f", "O", "[○○○ ●○○ ●○] 47"],
		["0x0050", "P", "[○○○ ●●● ●○] 4567"],
		["0x0051", "Q", "[○○○ ●○● ●●] 4678"],
		["0x0052", "R", "[○○○ ●●○ ●○] 457"],
		["0x0053", "S", "[○○○ ●○● ●○] 467"],
		["0x0054", "T", "[○○○ ●○○ ●●] 478"],
		["0x0055", "U", "[○●● ●○○ ○○] 234"],
		["0x0056", "V", "[○●● ●●○ ○○] 2345"],
		["0x0057", "W", "[○●● ●○● ○○] 2346"],
		["0x0058", "X", "[○●● ●○○ ○●] 2348"],
		["0x0059", "Y", "[○●○ ●○○ ●○] 247"],
		["0x005a", "Z", "[○●○ ●●○ ●○] 2457"],
		["0x0030", "0", "[○○○ ●●● ○●] 4568"],
		["0x0031", "1", "[○○○ ●●● ●●] 45678"],
		["0x0032", "2", "[○○● ●●● ○●] 34568"],
		["0x0033", "3", "[○○● ●●● ●●] 345678"],
		["0x0034", "4", "[○●○ ●●● ○●] 24568"],
		["0x0035", "5", "[○●○ ●●● ●●] 245678"],
		["0x0036", "6", "[○●● ●●● ○●] 234568"],
		["0x0037", "7", "[○●● ●●● ●●] 2345678"],
		["0x0038", "8", "[●○○ ●●● ○●] 14568"],
		["0x0039", "9", "[●○○ ●●● ●●] 145678"],
		["0x002b", "+", "[●○● ●●● ○●] 134568"],
		["0x002d", "-", "[●○● ●●● ●●] 1345678"],
		["0x00d7", "×", "[●●○ ●●● ○●] 124568"],
		["0x00f7", "÷", "[●●○ ●●● ●●] 1245678"],
		["0x003d", "=", "[●●● ●●● ○●] 1234568"],
		["0x005f", "_", "[○●● ●○○ ●○] 2347"],
		["0x005c", "\\", "[○●● ○●○ ●○] 2357"],
		["0x007c", "|", "[○●● ○○● ●○] 2367"],
		["0x002f", "/", "[○●● ○○○ ●●] 2378"],
		["0x002e", ".", "[○○○ ○●○ ○○] 5"],
		["0x002c", ",", "[○○○ ○○○ ○●] 8"],
		["0x003b", ";", "[○○○ ○●○ ○●] 58"],
		["0x003a", ":", "[○○○ ○●● ○○] 56"],
		["0x003f", "?", "[○○○ ●●● ○○] 456"],
		["0x0021", "!", "[○○○ ○○● ○○] 6"],
		["0x0027", "'", "[○○○ ●○○ ○●] 48"],
		["0x0022", "\"", "[○○○ ●●○ ○●] 458"],
		["0x201c", "“", "[●●○ ○○○ ●○] 127"],
		["0x201d", "”", "[○○○ ●●○ ○●] 458"],
		["0x0028", "(", "[●○● ○○○ ○○] 13"],
		["0x0029", ")", "[○○○ ●○● ○○] 46"],
		["0x005b", "[", "[●○● ○○○ ●○] 137"],
		["0x005d", "]", "[○○○ ●○● ○●] 468"],
		["0x007b", "{", "[●●○ ○○○ ●●] 1278"],
		["0x007d", "}", "[○○○ ●●○ ●●] 4578"],
		["0x003c", "<", "[○●○ ○●○ ○●] 258"],
		["0x003e", ">", "[○●○ ○●○ ●○] 257"],
		["0x0024", "$", "[○○● ●○● ●○] 3467"],
		["0x00a2", "¢", "[○○● ○○● ●○] 367"],
		["0x0025", "%", "[○○● ○●● ●○] 3567"],
		["0x00a3", "£", "[○○● ●●● ●○] 34567"],
		["0x20ac", "€", "[○○● ○●○ ●○] 357"],
		["0x00a5", "¥", "[○○● ●○○ ●○] 347"],
		["0x002a", "*", "[○○● ○○○ ●●] 378"],
		["0x0023", "#", "[○○● ○○● ●●] 3678"],
		["0x0026", "&", "[○●● ●○○ ●●] 23478"],
		["0x0040", "@", "[●○○ ●●○ ○●] 1458"],
		["0x005e", "^", "[○●○ ●●○ ○●] 2458"],
		["0x0060", "`", "[○●○ ○○● ○●] 268"],
		["0x007e", "~", "[○●○ ●●○ ○●] 2458"],
		["0x00f1", "ñ", "[○○● ○●○ ○●] 358"],
		["0x00d1", "Ñ", "[○○● ●●○ ○●] 3458"],
		["0x00a1", "¡", "[○●○ ○○● ●○] 267"],
		["0x00bf", "¿", "[○●○ ●●● ●○] 24567"],
		["0x00e7", "ç", "[●○○ ○○● ○●] 168"],
		["0x00c7", "Ç", "[●○○ ●○● ○●] 1468"],
		["0x0046", "F1", "[○○○ ○●● ●●] 5678"],
		["0x0046", "F2", "[○○● ○●● ○●] 3568"],
		["0x0046", "F3", "[○○● ○●● ●●] 35678"],
		["0x0046", "F4", "[○●○ ○●● ○●] 2568"],
		["0x0046", "F5", "[○●○ ○●● ●●] 25678"],
		["0x0046", "F6", "[○●● ○●● ○●] 23568"],
		["0x0046", "F7", "[○●● ○●● ●●] 235678"],
		["0x0046", "F8", "[●○○ ○●● ○●] 1568"],
		["0x0046", "F9", "[●○○ ○●● ●●] 15678"],
		["0x0046", "F10", "[●○● ○●● ○●] 13568"],
		["0x0046", "F11", "[●○● ○●● ●●] 135678"],
		["0x0046", "F12", "[●●○ ○●● ○●] 12568"],
		["0x0046", "F13", "[●●○ ○●● ●●] 125678"],
		["0x0046", "F14", "[●●● ○●● ○●] 123568"],
		["0x0046", "F15", "[●●● ○●● ●●] 1235678"]
	]
};

//==============================================================================
// END
//------------------------------------------------------------------------------
