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
System.Type.RegisterNamespace("System.Security");
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

// Static classes:
// System.Security.Helper

//=============================================================================
// CLASS: Interface
//-----------------------------------------------------------------------------

System.Security.Helper = {};


System.Security.Helper.securityHashSize = 16;
System.Security.Helper.unlockHashSize = 6;

/// <summary>
/// Get current time unit value.
/// </summary>
/// <param name="unit">Time unit type.</param>
/// <returns>Time unit value.</returns>
System.Security.Helper.GetTimeUnitValue = function (unit) {
	var now = System.DateTime.Now();
	var ts = new System.TimeSpan(now.Ticks());
	switch (unit) {
		case System.TimeUnitType.Seconds: return Math.floor(ts.TotalSeconds);
		case System.TimeUnitType.Minutes: return Math.floor(ts.TotalMinutes);
		case System.TimeUnitType.Hours: return Math.floor(ts.TotalHours);
		case System.TimeUnitType.Days: return Math.floor(ts.TotalDays);
	}
	return 0;
};

//#region Unlock Token (Decimal)

System.Security.Helper.DefaultHashKey = "abcdef1234";

/// <summary>Get decimal unlock code.</summary>
/// <param name="key">Hash key.</param>
/// <param name="unit">Time unit type. Can be minutes, hours or days.</param>
/// <param name="duration">Duration. Valid range 1-33.</param>
/// <returns></returns>
System.Security.Helper.GetUnlockToken = function (key, unit, hashKey) {
	var u = System.Security.Helper.GetTimeUnitValue(unit);
	return System.Security.Helper.GetUnlockTokenByValue(key, u, hashKey);
};

/// <summary>Get decimal unlock code.</summary>
/// <param name="key">Hash key.</param>
/// <param name="unitValue">Time value</param>
/// <param name="duration">Duration. Valid range: 1-99</param>
/// <returns></returns>
System.Security.Helper.GetUnlockTokenByValue = function (key, unitValue, hashKey) {
	var passString = key + "_" + unitValue;
	if (hashKey === null) hashKey = System.Security.Helper.DefaultHashKey;
	var hmac = new System.Security.Cryptography.HMACMD5(hashKey);
	var hash = hmac.ComputeHash(passString);
	var numb = System.BitConverter.ToUInt32(hash, 0).toString();
	var text = (numb + "0000000000").substr(0, System.Security.Helper.unlockHashSize);
	return text;
};

/// <summary>
/// Check if token key is valid.
/// </summary>
/// <param name="token">Token to check.</param>
/// <param name="userId">User id (Integer or GUID).</param>
/// <param name="password">Password or secure key/hash.</param>
/// <param name="unit">Time unit type.</param>
/// <param name="count">How many units in past mus be checked.</param>
/// <returns>True if token is valid, False if not valid.</returns>
System.Security.Helper.CheckUnlockToken = function (token, key, unit, count) {
	// Time which passed.
	var u = System.Security.Helper.GetTimeUnitValue(unit);
	var i;
	// Check keys for last units and return if token match.
	for (i = 0; i < count; i++) if (token === System.Security.Helper.GetUnlockTokenByValue(key, u - i)) return true;
	// -5 solves the issue when token generator time is inaccurate and is set up to 5 [seconds|minutes|hours|days] in future
	for (i = -5; i < 0; i++) if (token === System.Security.Helper.GetUnlockTokenByValue(key, u - i)) return true;
	return false;
};

//#endregion

//==============================================================================;
// END;
//------------------------------------------------------------------------------