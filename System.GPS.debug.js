//=============================================================================
// Jocys.com JavaScript.NET Classes               (In C# Object Oriented Style)
// Created by Evaldas Jocys <evaldas@jocys.com>
// Original Source: www.movable-type.co.uk/scripts/latlong-os-gridref.html
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
//		<RootNamespace>System.GPS</RootNamespace>
// <PropertyGroup>
//-----------------------------------------------------------------------------

System.GPS = System.GPS ? System.GPS : {};
System.Type.RegisterNamespace("System.GPS");

//=============================================================================
// CLASS: System.GPS.LatLong
//-----------------------------------------------------------------------------

//-------------------------------------------------------------

System.GPS.LatLong = function (latitude, longitude) {
	this.Longitude = 0;
	this.Latitude = 0;
	if (arguments.length === 2) {
		this.Longitude = longitude;
		this.Latitude = latitude;
	}
	//---------------------------------------------------------
	this.GetDistance = function (p) {
		var theta = this.Longitude - p.Longitude;
		var dist = Math.sin(deg2rad(this.Latitude)) * Math.sin(deg2rad(p.Latitude)) + Math.cos(deg2rad(this.Latitude)) * Math.cos(deg2rad(p.Latitude)) * Math.cos(deg2rad(theta));
		dist = Math.acos(dist);
		dist = rad2deg(dist);
		// 60 - minutes in a degree;
		// 1.1515 - statute miles in a nautical mile;
		// 1.609344 - kilometres in a mile;
		// 1000 - metres in a kilometre;
		return dist * 60 * 1.1515 * 1.609344 * 1000;
	};
	//---------------------------------------------------------
	function deg2rad(deg) {
		/// <summary>Convert decimal degrees to radians.</summary>
		return deg * Math.PI / 180.0;
	}
	//---------------------------------------------------------
	function rad2deg(rad) {
		/// <summary>Convert radians to decimal degrees.</summary>
		return rad / Math.PI * 180.0;
	}
	//---------------------------------------------------------
	this.toString = function () {
		return "[" + this.Latitude + "," + this.Longitude + "]";
	};
};
System.Type.RegisterClass("System.GPS.LatLong");

//=============================================================================
// CLASS: System.GPS.OsGrid
//-----------------------------------------------------------------------------

// References given with OsGrid are accurate to 1m.
System.GPS.OsGrid = function (easting, northing) {
	this.Easting = easting;
	this.Northing = northing;
	this.toString = function () { return "[" + this.Easting + "," + this.Northing + "]"; };
};
System.Type.RegisterClass("System.GPS.OsGrid");

//=============================================================================
// CLASS: System.GPS.Converter
//-----------------------------------------------------------------------------

/// <summary>
/// Script Example:
/// var og = new System.GPS.OsGrid(517300, 177200);
/// document.write("OS Grid Reference: " + og.toString() + "<br />");
/// var ll1 = System.GPS.Converter.ToLatLong(og);
/// document.write("Converted to Lat/Long: " + ll1.toString() + "<br />");
/// 
/// var ll = new System.GPS.LatLong(51.481548, -0.312159);
/// document.write("Lat/Long: " + ll.toString() + "<br />");
/// var og1 = System.GPS.Converter.ToOsGrid(ll);
/// document.write("Converted to OS Grid Reference: " + og1.toString() + "<br />");
/// </summary>
System.GPS._Converter = function () {

	//-------------------------------------------
	// Airy 1830 Ellipsoid
	//-------------------------------------------
	// Semi-major axis of the local geodetic datum ellipsoid (Equatorial radius).
	//var a = 6377563.396;
	// Semi-minor axis of the local geodetic datum ellipsoid (Polar radius).
	//var b = 6356256.909;
	// Inverse flattening: f = 1/(1 - b/a) = 299.3249646
	// Semi-minor axis: b = (f - 1) * a / f = 6356256.909

	//-------------------------------------------
	// World Geodetic System 1984 (WGS 84)
	//-------------------------------------------
	// The Global Positioning System (GPS) uses the World Geodetic System 1984 (WGS 84) 
	// to determine the location of a point near the surface of the Earth.
	//
	// Semi-major axis of the local geodetic datum ellipsoid (Equatorial radius).
	var a = 6378137.000;
	// Semi-minor axis of the local geodetic datum ellipsoid (Polar radius).
	var b = 6356752.314245;
	// Inverse flattening: f = 1/(1 - b/a) = 298.257223563
	// Semi-minor axis: b = (f - 1) * a / f = 6356752.314245
	// Ellipsoidal height, H = 24700
	//-------------------------------------------
	//  National Grid
	//-------------------------------------------
	// Scale factor on central meridian.
	var F0 = 0.9996012717;
	// Northing of true origin (metres).
	var N0 = -100000.0;
	// Easting of true origin (metres).
	var E0 = 400000.0;
	//---------------------------------------------------------
	function deg2rad(deg) {
		/// <summary>Convert decimal degrees to radians.</summary>
		return deg * Math.PI / 180.0;
	}
	//---------------------------------------------------------
	function rad2deg(rad) {
		/// <summary>Convert radians to decimal degrees.</summary>
		return rad / Math.PI * 180.0;
	}
	//---------------------------------------------------------
	this.ToLatLong = function (p) {
		// <summary>
		// Convert coordinate system.
		// From: Ordnance Survey Great Britain (OSGB) Universal Transverse Mercator (UTM) grid.
		// To: "Geocentric Angular Ellipsoid" (latitude, longitude).
		// </summary>
		var E = p.Easting;
		var N = p.Northing;
		//  National Grid: true origin: 49ºN,2ºW.
		var lat0 = deg2rad(49);
		var lon0 = deg2rad(-2);
		// Eccentricity Squared
		var e2 = 1 - b * b / (a * a);
		var n = (a - b) / (a + b);
		var n2 = n * n;
		var n3 = n * n * n;
		var lat = lat0;
		var M = 0;
		do {
			lat = (N - N0 - M) / (a * F0) + lat;
			var Ma = (1 + n + 5 / 4 * n2 + 5 / 4 * n3) * (lat - lat0);
			var Mb = (n + n * n + 7 * n3 / 8) * 3 * Math.sin(lat - lat0) * Math.cos(lat + lat0);
			var Mc = (15 / 8 * n2 + 15 / 8 * n3) * Math.sin(2 * (lat - lat0)) * Math.cos(2 * (lat + lat0));
			var Md = 35 / 24 * n3 * Math.sin(3 * (lat - lat0)) * Math.cos(3 * (lat + lat0));
			M = b * F0 * (Ma - Mb + Mc - Md);                // meridional arc
		} while (N - N0 - M >= 0.00001);  // until < 0.01mm
		var cosLat = Math.cos(lat);
		var sinLat = Math.sin(lat);
		// transverse radius of curvature
		var v = a / Math.sqrt(1 - e2 * sinLat * sinLat);
		var nu = v * F0;
		// meridional radius of curvature
		var rho = a * F0 * (1 - e2) / Math.pow(1 - e2 * sinLat * sinLat, 1.5);
		var eta2 = nu / rho - 1;
		var tanLat = Math.tan(lat);
		var tan2lat = tanLat * tanLat;
		var secLat = 1 / cosLat;
		var nu3 = nu * nu * nu;
		var nu5 = nu3 * nu * nu;
		var nu7 = nu5 * nu * nu;
		var VII = tanLat / 2 / rho / nu;
		var VIII = tanLat / 24 / rho / nu3 * (5 + (3 - 9 * eta2) * tan2lat + eta2);
		var IX = tanLat / 720 / rho / nu5 * (61 + (90 + 45 * tan2lat) * tan2lat);
		var X = secLat / nu;
		var XI = secLat / 6 / nu3 * (nu / rho + 2 * tan2lat);
		var XII = secLat / 120 / nu5 * (5 + (28 + 24 * tan2lat) * tan2lat);
		var XIIA = secLat / 5040 / nu7 * (61 + (662 + (1320 + 720 * tan2lat) * tan2lat) * tan2lat);
		var dE = E - E0;
		var dE2 = dE * dE;
		lat = lat - (VII + (VIII - IX * dE2) * dE2) * dE2;
		var lon = lon0 + (X - (XI + (XII - XIIA * dE2) * dE2) * dE2) * dE;
		var latitude = rad2deg(lat);
		var longitude = rad2deg(lon);
		return new System.GPS.LatLong(latitude, longitude);
	};
	//---------------------------------------------------------
	this.ToOsGrid = function (p) {
		// <summary>
		// Convert coordinate system.
		// From: "Geocentric Angular Ellipsoid" (latitude, longitude).
		// To: Ordnance Survey Great Britain (OSGB) Universal Transverse Mercator (UTM) grid.
		// </summary>
		var lat = deg2rad(p.Latitude);
		var lon = deg2rad(p.Longitude);
		// NatGrid true origin: 49ºN,2ºW.
		var lat0 = deg2rad(49);
		var lon0 = deg2rad(-2);
		// eccentricity squared
		var e2 = 1 - b * b / (a * a);
		var n = (a - b) / (a + b);
		var n2 = n * n;
		var n3 = n * n * n;
		var cosLat = Math.cos(lat);
		var cos2Lat = cosLat * cosLat;
		var cos4Lat = cos2Lat * cos2Lat;
		var sinLat = Math.sin(lat);
		// transverse radius of curvature
		var v = a / Math.sqrt(1 - e2 * sinLat * sinLat);
		var nu = v * F0;
		// meridional radius of curvature
		var dLat = lat - lat0;
		var rho = a * F0 * (1 - e2) / Math.pow(1 - e2 * sinLat * sinLat, 1.5);
		var eta2 = nu / rho - 1;
		var Ma = (1 + (1 + (1 + n) * 5 / 4 * n) * n) * dLat;
		var Mb = (1 + (1 + 7 / 8 * n) * n) * 3 * n * Math.sin(dLat) * Math.cos(lat + lat0);
		var Mc = 15 / 8 * (n2 + n3) * Math.sin(2 * dLat) * Math.cos(2 * (lat + lat0));
		var Md = 35 / 24 * n3 * Math.sin(3 * dLat) * Math.cos(3 * (lat + lat0));
		var M = b * F0 * (Ma - Mb + Mc - Md);  // meridional arc
		var tan2lat = Math.tan(lat) * Math.tan(lat);
		var IV = nu * cosLat;
		var I = M + N0;
		var II = IV * sinLat / 2;
		var III = IV * sinLat * cos2Lat * (5 - tan2lat + 9 * eta2) / 24;
		var IIIA = IV * sinLat * cos4Lat * (61 - (58 + tan2lat) * tan2lat) / 720;
		var V = IV * cos2Lat / 6 * (nu / rho - tan2lat);
		var VI = IV * cos4Lat / 120 * (5 - 18 * (1 + tan2lat - 58 * eta2) * tan2lat + 14 * eta2);
		var dLon = lon - lon0;
		var dLon2 = dLon * dLon;
		var N = I + (II + (III + IIIA * dLon2) * dLon2) * dLon2;
		var E = E0 + (IV + (V + VI * dLon2) * dLon2) * dLon;
		northing = N;
		easting = E;
		return new System.GPS.OsGrid(easting, northing);
	};
};
System.Type.RegisterClass("System.GPS._Converter");
System.GPS.Converter = new System.GPS._Converter();

//==============================================================================
// END
//------------------------------------------------------------------------------