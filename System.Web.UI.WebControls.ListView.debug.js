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
//		<RootNamespace>System.Web.UI.WebControls</RootNamespace>
// <PropertyGroup>
//-----------------------------------------------------------------------------
System.Type.RegisterNamespace("System.Web.UI.WebControls");

//-----------------------------------------------------------------------------
// CLASS: System.Web.UI.WebControls.ListView
//-----------------------------------------------------------------------------

System.Web.UI.WebControls.ListView = function () {
	/* use jQuery-UI DataTables */
};
System.Type.RegisterClass("System.Web.UI.WebControls.ListView");


System.Web.UI.WebControls.ListView.FixTable = function (id) {
	/// <summary>
	/// Browsers will screw tables, by moving TH nodes under 'TBODY TR' and removing 'THEAD' node.
	/// It happnes when brower copies table under different HTML nodes (jQuery-UI DataTables).
	/// This function will fix table structure by moving TH nodes back under THEAD TR node.
	/// </summary>
	var grid = $("#" + id);
	var head = $(grid).children("thead");
	// If header is missing then...
	if (!head.length) {
		var headRows = $(grid).find("tbody tr th");
		var headRow = headRows.parent();
		grid[0].createTHead();
		head = $(grid).children("thead");
		head.append(headRow);
	}
};

//==============================================================================
// END
//------------------------------------------------------------------------------
