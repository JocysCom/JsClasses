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
//		<RootNamespace>System.Text.CodeColorizer</RootNamespace>
// <PropertyGroup>
//-----------------------------------------------------------------------------
System.Type.RegisterNamespace("System.Text.CodeColorizer");
//=============================================================================

//=============================================================================
// CLASS: System.Text.CodeColorizer
//-----------------------------------------------------------------------------

System.Text.CodeColorizer.Colorizer = function (target, id) {
	//---------------------------------------------------------
	// Public properties.
	//---------------------------------------------------------
	this.Node;
	//---------------------------------------------------------
	// Private properties.
	//---------------------------------------------------------
	var me = this;
	//---------------------------------------------------------
	// EVENTS: public
	//---------------------------------------------------------
	this.RiseEvent = function (e) { if (this[e.Name]) this[e.Name](this, e); };
	//---------------------------------------------------------
	this.OnInit;
	//---------------------------------------------------------
	// METHOD: GetHtml
	//---------------------------------------------------------
	this.GetHtml = function (code, language) {
		var results = new String(code);
		// Colorize.
		for (var property in System.Text.CodeColorizerLanguages[language]) {
			Trace.Write(property);
			var regex = new RegExp(System.Text.CodeColorizerLanguages[language][property][0], System.Text.CodeColorizerLanguages[language][property][1]);
			var repto = System.Text.CodeColorizerLanguages[language][property][2];
			results = results.replace(regex, repto);
		}
		return "<pre>" + results + "</pre>";
	};
	//---------------------------------------------------------
	// METHOD: InitializeInterface
	//---------------------------------------------------------
	this.InitializeInterface = function (sender, e) {
	};
	//---------------------------------------------------------
	// METHOD: InitializeEvents
	//---------------------------------------------------------
	this.InitializeEvents = function (sender, e) {
	};
	//---------------------------------------------------------
	// INIT: Class
	//---------------------------------------------------------
	this.InitializeClass = function () {
		// Set submited values or default values.
		this.Target = target ? target : document;
		this.id = id ? id : null;
		// Initialize interface.
		this.InitializeInterface(this, null);
		// Initialize events.
		this.InitializeEvents(this, null);
		// Rise init event.
		this.RiseEvent(new System.EventArgs("OnInit"));
	};
	this.InitializeClass();
};

System.Text.CodeColorizerLanguages = {};
System.Text.CodeColorizerLanguages.SQLCommands = "sysname|begin|end|declare|cursor|for";
System.Text.CodeColorizerLanguages.SQLSeparators = "[\.]";
System.Text.CodeColorizerLanguages.SQL = {};
System.Text.CodeColorizerLanguages.SQL["Fix"] = [" [(]", "ig", "("];
System.Text.CodeColorizerLanguages.SQL["Fix2"] = ["[\t]", "ig", "    "];
System.Text.CodeColorizerLanguages.SQL["Function"] = ["([A-Z]+)([(])", "ig", "<span style=\"color: #ff00ff;\">$1</span>$2"];
System.Text.CodeColorizerLanguages.SQL["Parameter1"] = ["(\[)([A-Z_]+)(\])", "ig", "<span style=\"color: #000000;\">$1$2</span>"];
System.Text.CodeColorizerLanguages.SQL["Parameter2"] = ["([@])([A-Z]+)", "ig", "<span style=\"color: #000000;\">$1$2</span>"];
System.Text.CodeColorizerLanguages.SQL["Comment"] = ["(--)(.*)", "ig", "<span style=\"color: #008000;\">$1$2</span>"];
System.Text.CodeColorizerLanguages.SQL["Value1"] = ["(')([A-Z_ ]+)(')", "ig", "<span style=\"color: #ff0000;\">$1$2$3</span>"];
System.Text.CodeColorizerLanguages.SQL["Command1"] = ["([ ]|^|)([A-Z]+)([ ]|$)", "g", "$1<span style=\"color: #0000ff;\">$2</span>$3"];
System.Text.CodeColorizerLanguages.SQL["Separator1"] = ["([ ]|)(" + System.Text.CodeColorizerLanguages.SQLSeparators + ")([ ]|$)", "g", "$1<span style=\"color: #0000ff;\">$2</span>$3"];

//System.Text.CodeColorizerLanguages.SQL["Command2"] = ["("+System.Text.CodeColorizerLanguages.SQLCommands+")([ ])","ig","$1<span style=\"color: #0000ff;\">$1</span>$3"];

//==============================================================================
// END
//------------------------------------------------------------------------------