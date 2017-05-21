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
//		<RootNamespace>System</RootNamespace>
// <PropertyGroup>
//-----------------------------------------------------------------------------

//=============================================================================
// CLASS: System.TimeZoneInfo
//-----------------------------------------------------------------------------
System.TimeZoneInfo = function () {
	//---------------------------------------------------------
	// Private properties.
	var me = this;
	//---------------------------------------------------------
};

//=============================================================================
// CLASS: System.TimeZoneInfo.AdjustmentRule
//-----------------------------------------------------------------------------
System.TimeZoneInfo.AdjustmentRule = function () {
	//---------------------------------------------------------
	// Private properties.
	var me = this;
	//---------------------------------------------------------
};

//=============================================================================
// METHOD: System.TimeZoneInfo.GetSystemTimeZones
//-----------------------------------------------------------------------------

System.TimeZoneInfo.GetSystemTimeZones = function () {


};

//=============================================================================
// ENUM: System.TimeZoneInfo.WeekOfMonth
//-----------------------------------------------------------------------------

System.TimeZoneInfo.WeekOfMonth.prototype = {
	First: 1,
	Second: 2,
	Third: 3,
	Fourth: 4,
	Last: 5
};

System.Type.RegisterEnum("System.TimeZoneInfo.WeekOfMonth");

//==============================================================================
// END
//------------------------------------------------------------------------------