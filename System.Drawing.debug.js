//=============================================================================
// Jocys.com JavaScript.NET Classes               (In C# Object Oriented Style)
// 2009-02-01 Evaldas Jocys [evaldas@jocys.com]
// 2009-11-02 Jason Ensinger [http://www.codeproject.com/Members/SlingBlade]
//     System.Drawing.Size class updated.
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
//		<RootNamespace>System.Drawing</RootNamespace>
// <PropertyGroup>
//-----------------------------------------------------------------------------
System.Type.RegisterNamespace("System.Drawing");
//=============================================================================

//=============================================================================
// CLASS: System.Drawing.Size
//-----------------------------------------------------------------------------

System.Drawing.Size = function () {
	/// <summary>
	/// Stores an ordered pair of integers, typically the width and height of a rectangle.
	/// </summary>
	//---------------------------------------------------------
	// Properties
	this._Type;
	this._Width;
	this._Height;
	//---------------------------------------------------------
	this.initialize.apply(this, arguments);
};

System.Drawing.Size.prototype = {
	initialize: function () {
		var init = this["_ctor$" + arguments.length];
		if (init) init.apply(this, arguments);
		//else throw Error.parameterCount();
		//else alert(arguments);
		// Below lines were added for compatibility until class is finished.
	},
	_ctor$0: function () {
		/// <summary>
		/// Stores an ordered pair of integers, typically the width and height of a rectangle.
		/// </summary>	
	},
	_ctor$1: function (pt) {
		/// <summary>
		/// Initializes a new instance of the System.Drawing.Size class from the specified
		/// System.Drawing.Point.
		/// </summary>
		// <param name="pt" type="System.Drawing.Point">The System.Drawing.Point from which to initialize this System.Drawing.Size.</param>
		this._Width = pt.X;
		this._Height = pt.Y;
	},
	_ctor$2: function (width, height) {
		/// <summary>
		//  Initializes a new instance of the System.Drawing.Size class from the specified
		//  dimensions.
		/// </summary>
		// <param name="width" type="int">The width component of the new System.Drawing.Size.</param>
		// <param name="height" type="int">The height component of the new System.Drawing.Size.</param>
		this._Width = width;
		this._Height = height;
		// Below lines were added for compatibility until class is finished.
		this.Width = width;
		this.Height = height;
	},
	get_IsEmpty: function () {
		/// <summary>
		/// Tests whether this System.Drawing.Size has width and height of 0.
		/// </summary>
		/// <returns>
		/// This property returns true when this System.Drawing.Size has both a width
		/// and height of 0; otherwise, false.
		/// </returns>
		return this._Width === 0 && this._Height === 0;
	},
	get_Height: function () {
		/// <summary>Gets the vertical component of this System.Drawing.Size.</summary>
		/// <returns type="Number" type="Number">The vertical component of this System.Drawing.Size, typically measured in pixels.</returns>
		return this._Height;
	},
	set_Height: function (value) {
		/// <summary>Sets the vertical component of this System.Drawing.Size.</summary>
		/// <param name="value" type="Number">The vertical component of this System.Drawing.Size, typically measured in pixels.</param>
		this._Height = value;
	},
	get_Width: function () {
		/// <summary>Gets the vertical horizontal of this System.Drawing.Size.</summary>
		/// <returns type="Number" type="Number">The horizontal component of this System.Drawing.Size, typically measured in pixels.</returns>
		return this._Height;
	},
	set_Width: function (value) {
		/// <summary>Sets the vertical horizontal of this System.Drawing.Size.</summary>
		/// <param name="value" type="Number">The horizontal component of this System.Drawing.Size, typically measured in pixels.</param>
		this._Width = value;
	},
	// methods which must be inherited from base class.
	get_Type: function () {
		/// <summary>Gets the System.Type of the current instance.</summary>
		/// <returns type="String">The System.Type instance that represents the exact runtime type of the current instance.</returns>
		return this._Type;
	},
	// Methods which must be inherited from base class.
	GetType: function () { },
	ToString: function () { return "{Width=" + this.Width + ",Height=" + this.Height + "}"; },
	toString: function () { return this.ToString.apply(this, arguments); }
};
System.Type.RegisterClass("System.Drawing.Size");

//=============================================================================
// CLASS: System.Drawing.Point
//-----------------------------------------------------------------------------

System.Drawing.Point = function (x, y) {
	/// <summary>
	/// Represents an ordered pair of integer x- and y-coordinates that defines a
	/// point in a two-dimensional plane.
	/// </summary>
	//---------------------------------------------------------
	this.X;
	this.Y;
	//---------------------------------------------------------
	this.Offset = function (pt) {
		/// <summary>
		/// Translates this System.Drawing.Point by the specified System.Drawing.Point.
		/// </summary>
		/// <param name="pt" type="System.Drawing.Point">The System.Drawing.Point used offset this System.Drawing.Point.</param>
	};
	//---------------------------------------------------------
	this.Offset = function (dx, dy) {
		/// <summary>
		/// Translates this System.Drawing.Point by the specified amount.
		/// </summary>
		/// <param name="dx" type="System.Integer">The amount to offset the x-coordinate.</param>
		/// <param name="dy" type="System.Integer">The amount to offset the y-coordinate.</param>
		// If first argument is another drawing Point.
		if (typeof arguments[0] === "object") {
			this.X += dx.X;
			this.Y += dx.Y;
		} else {
			this.X += dx;
			this.Y += dy;
		}
	};
	//---------------------------------------------------------
	this.IsEmpty = function () {
		/// <summary>
		/// Gets a value indicating whether this System.Drawing.Point is empty.
		/// </summary>
		/// <returns type="System.Boolean">
		///  true if both System.Drawing.Point.X and System.Drawing.Point.Y are 0; otherwise,
		///  false.
		/// </returns>
		if (this.x === 0) {
			return this.y === 0;
		}
		return false;
	};
	//---------------------------------------------------------
	this.ToString = function () {
		/// <summary>
		/// Converts the specified System.Drawing.PointF to a System.Drawing.Point by
		/// truncating the values of the System.Drawing.Point.
		/// </summary>
		/// <returns type="System.Drawing.Point">
		///  The System.Drawing.Point this method converts to.
		/// </returns>
		return "{X=" + this.X + ",Y=" + this.Y + "}";
	};
	//---------------------------------------------------------
	this.Equals = function (pt) {
		/// <summary>
		///  Specifies whether this System.Drawing.Point contains the same coordinates
		///  as the specified System.Drawing.Point.
		/// </summary>
		/// <param name="pt" type="System.Drawing.Point">The System.Drawing.Size to test.</param>
		/// <returns type="System.Drawing.Point">
		///  true if pt has the same coordinates as this System.Drawing.Point.
		/// </returns>
		if (pt.X === this.X) {
			return pt.Y === this.Y;
		}
		return false;
	};
	//---------------------------------------------------------
	function initialize() {
		this.X = arguments[0] ? arguments[0] : 0;
		this.Y = arguments[1] ? arguments[1] : 0;
	}
	initialize.apply(this, arguments);
};
System.Type.RegisterClass("System.Drawing.Point");

//-----------------------------------------------------------------------------

System.Drawing.Point.Round = function (pt) {
	/// <summary>
	/// Rounds the System.Drawing.Point values to the nearest integer.
	/// </summary>
	/// <param name="pt" type="System.Drawing.Point">The System.Drawing.Point to convert.</param>
	/// <returns type="System.Drawing.Point" />
	var point = new System.Drawing.Point();
	point.X = math.round(pt.X);
	point.Y = math.round(pt.Y);
	return point;
};

System.Drawing.Point.Subtract = function (pt, sz) {
	/// <summary>
	/// Returns the result of subtracting specified System.Drawing.Size from the
	/// specified System.Drawing.Point.
	/// </summary>
	/// <param name="pt" type="System.Drawing.Point">The System.Drawing.Size to subtract from the System.Drawing.Point.</param>
	/// <param name="sz" type="System.Drawing.Size">The System.Drawing.Point to be subtracted from.</param>
	/// <returns type="System.Drawing.Point" />
	var point = new System.Drawing.Point(pt.X, pt.Y);
	point.X -= sz.Width;
	point.Y -= sz.Height;
	return point;
};

System.Drawing.Point.Add = function (pt, sz) {
	/// <summary>
	/// Adds the specified System.Drawing.Size to the specified System.Drawing.Point.
	/// </summary>
	/// <param name="pt" type="System.Drawing.Point">The System.Drawing.Size to add.</param>
	/// <param name="sz" type="System.Drawing.Size">The System.Drawing.Point to add.</param>
	/// <returns type="System.Drawing.Point" />
	var point = new System.Drawing.Point(pt.X, pt.Y);
	point.X += sz.Width;
	point.Y += sz.Height;
	return point;
};

//==============================================================================
// END
//------------------------------------------------------------------------------