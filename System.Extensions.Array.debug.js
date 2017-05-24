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
//		<RootNamespace>System.Extensions.Array</RootNamespace>
// <PropertyGroup>
//-----------------------------------------------------------------------------
System.Type.RegisterNamespace("System.Extensions.Array");
//=============================================================================

System.Extensions.Array.Enable = function () {
	//
	// Original Source:
	// http://erik.eae.net/archives/2005/06/05/17.53.19/
	//
	//=============================================================================

	// Mozilla 1.8 has support for indexOf, lastIndexOf, forEach, filter, map, some, every
	// http://developer-test.mozilla.org/docs/Core_JavaScript_1.5_Reference:Objects:Array:lastIndexOf
	// Extend array with 'indexOf' method.

	if (!Array.prototype.push) {
		Array.prototype.push = function () {
			for (var i = 0; i < arguments.length; i++) {
				this[this.length] = arguments[i];
			}
			return this.length;
		};
	}

	if (!Array.prototype.indexOf) {
		Array.prototype.indexOf = function (obj, fromIndex) {
			var index = -1;
			if (fromIndex === null) {
				fromIndex = 0;
			} else if (fromIndex < 0) {
				fromIndex = Math.max(0, this.length + fromIndex);
			}
			for (var i = fromIndex; i < this.length; i++) {
				if (this[i] === obj) {
					index = i;
					break;
				}
			}
			return index;
		};
	}

	// http://developer-test.mozilla.org/docs/Core_JavaScript_1.5_Reference:Objects:Array:lastIndexOf
	if (!Array.prototype.lastIndexOf) {
		Array.prototype.lastIndexOf = function (obj, fromIndex) {
			if (fromIndex === null) {
				fromIndex = this.length - 1;
			} else if (fromIndex < 0) {
				fromIndex = Math.max(0, this.length + fromIndex);
			}
			for (var i = fromIndex; i >= 0; i--) {
				if (this[i] === obj)
					return i;
			}
			return -1;
		};
	}


	// http://developer-test.mozilla.org/docs/Core_JavaScript_1.5_Reference:Objects:Array:forEach
	if (!Array.prototype.forEach) {
		Array.prototype.forEach = function (f, obj) {
			var l = this.length; // must be fixed during loop... see docs
			for (var i = 0; i < l; i++) {
				f.call(obj, this[i], i, this);
			}
		};
	}

	// http://developer-test.mozilla.org/docs/Core_JavaScript_1.5_Reference:Objects:Array:filter
	if (!Array.prototype.filter) {
		Array.prototype.filter = function (f, obj) {
			var l = this.length; // must be fixed during loop... see docs
			var res = [];
			for (var i = 0; i < l; i++) {
				if (f.call(obj, this[i], i, this)) {
					res.push(this[i]);
				}
			}
			return res;
		};
	}

	// http://developer-test.mozilla.org/docs/Core_JavaScript_1.5_Reference:Objects:Array:map
	if (!Array.prototype.map) {
		Array.prototype.map = function (f, obj) {
			var l = this.length; // must be fixed during loop... see docs
			var res = [];
			for (var i = 0; i < l; i++) {
				res.push(f.call(obj, this[i], i, this));
			}
			return res;
		};
	}

	// http://developer-test.mozilla.org/docs/Core_JavaScript_1.5_Reference:Objects:Array:some
	if (!Array.prototype.some) {
		Array.prototype.some = function (f, obj) {
			var l = this.length; // must be fixed during loop... see docs
			for (var i = 0; i < l; i++) {
				if (f.call(obj, this[i], i, this)) {
					return true;
				}
			}
			return false;
		};
	}

	// http://developer-test.mozilla.org/docs/Core_JavaScript_1.5_Reference:Objects:Array:every
	if (!Array.prototype.every) {
		Array.prototype.every = function (f, obj) {
			var l = this.length; // must be fixed during loop... see docs
			for (var i = 0; i < l; i++) {
				if (!f.call(obj, this[i], i, this)) {
					return false;
				}
			}
			return true;
		};
	}

	Array.prototype.contains = function (obj) {
		return this.indexOf(obj) !== -1;
	};

	Array.prototype.copy = function (obj) {
		return this.concat();
	};

	Array.prototype.insertAt = function (obj, i) {
		this.splice(i, 0, obj);
	};

	Array.prototype.insertBefore = function (obj, obj2) {
		var i = this.indexOf(obj2);
		if (i === -1)
			this.push(obj);
		else
			this.splice(i, 0, obj);
	};

	Array.prototype.removeAt = function (i) {
		this.splice(i, 1);
	};

	Array.prototype.remove = function (obj) {
		var i = this.indexOf(obj);
		if (i !== -1)
			this.splice(i, 1);
	};

	//==============================================================================
	// Other extensions
	//------------------------------------------------------------------------------

	// Extend 'toString' method of array with format.
	// For example toString("And") output will be string:
	// "value1", "value2", "value3" and "value3"
	if (Array.prototype.ToString) {
		Array.prototype.ToString = function (format) {
			var results = "";
			if (format) {
				var quote = format === "Or" || format === "And" ? "\"" : "'";
				var j = this.length;
				for (var i = 0; i < j; i++) {
					switch (format) {
						case "or":
						case "Or":
						case "and":
						case "And":
							if (i > 0) {
								results += i === j - 1 ? " " + format + " " : ", ";
							}
							results += quote + this[i] + quote;
							break;
						default:
					}
				}
			} else {
				// Use old method;
				results = this.toString();
			}
			return results;
		};
	}
};
// Apply all extensions by default.
System.Extensions.Array.Enable();

//==============================================================================
// END
//------------------------------------------------------------------------------