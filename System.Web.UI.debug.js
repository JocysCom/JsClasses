//=============================================================================
// Jocys.com JavaScript.NET Classes               (In C# Object Oriented Style)
// Created by Evaldas Jocys <evaldas@jocys.com>
//=============================================================================
/// <reference path="System.debug.js" />
//=============================================================================
// Namespaces
//-----------------------------------------------------------------------------
// <PropertyGroup>
//		<RootNamespace>System.Web.UI</RootNamespace>
// <PropertyGroup>
//-----------------------------------------------------------------------------
System.Type.RegisterNamespace("System.Web.UI.Css");
//=============================================================================


System.Web.UI.Css.GetRules = function (context) {
	/// <summary>
	/// Get CSS rules from all style sheets.
	/// </summary>
	/// <returns>void</returns>
	var doc = context ? context : document;
	for (var s = 0; s < doc.styleSheets.length; s++) {
		var styleSheet = doc.styleSheets.item(s);
		for (var r = 0; r < styleSheet.rules.length; r++) {
			var rule = styleSheet.rules.item(r);
			doc[rule.selectorText] = rule.style.cssText;
		}
	}
	return {};
};

System.Web.UI.Css.GetCssText = function (selectorText, context) {
	/// <summary>
	/// Get CSS Text by Selector Text (className).
	/// </summary>
	/// <returns>void</returns>
	var text = "";
	var doc = context ? context : document;
	for (var s = 0; s < doc.styleSheets.length; s++) {
		var styleSheet = doc.styleSheets.item(s);
		for (var r = 0; r < styleSheet.rules.length; r++) {
			var rule = styleSheet.rules.item(r);
			if (rule.selectorText === selectorText) {
				text = rule.style.cssText;
				break;
			}
		}
	}
	return text;
};

System.Web.UI.Css.AddStyleSheet = function (href, context) {
	/// <summary>
	/// Dynamically add CSS StyleSheet.
	/// </summary>
	/// <returns>void</returns>
	var doc = context ? context : document;
	if (doc.createStyleSheet) {
		doc.createStyleSheet(href);
	} else {
		var el = doc.createElement('link');
		//var styles = "@import url('"+href+"');";
		//el.href='data:text/css,'+escape(styles);
		el.href = href;
		el.rel = "stylesheet";
		el.type = "text/css";
		document.getElementsByTagName("head")[0].appendChild(el);
	}
};

//==============================================================================
// END
//------------------------------------------------------------------------------