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
//		<RootNamespace>System.Collections</RootNamespace>
// <PropertyGroup>
//-----------------------------------------------------------------------------
System.Type.RegisterNamespace("System.Collections");
//=============================================================================


System.Collections.BitArray = function (length, defaultValue) {
	/// <summary>
	/// Initializes a new instance of the System.Collections.BitArray class that
	/// can hold the specified number of bit values, which are initially set to the
	/// specified value.
	/// </summary>
	/// <param type="int" name="length"> The number of bit values in the new System.Collections.BitArray.</param>
	/// <param type="bool" name="defaultValue">The Boolean value to assign to each bit.</param>
	/// <remarks>This object is here for xml comments only</remarks>
};

System.Collections.BitArray = function (numbers, bpn) {
	/// <summary>
	/// Initializes a new instance of the System.Collections.BitArray class that
	/// contains bit values copied from the specified array of bytes.
	/// </summary>
	/// <param type="array[]" name="numbers">An array of numbers</param>
	/// <param type="int" name="bpn">
	/// Optional. Bits per number: 8 byte (default), 16 - Int16, 32 - Int32.
	/// </param>
	//---------------------------------------------------------
	function NumberToBits(value, buffer, offset, count) {
		/// <summary>
		/// Write value as bits into array.
		/// </summary>
		/// <param name="value">Number value.<param>
		/// <param name="buffer">The destination buffer.</param>
		/// <param name="offset">The byte offset into buffer.</param>
		/// <param name="count">The number of bits to copy.</param>
		// Bits of numbers will be stored in
		// Little-endian format - lowest order (little) numbers coming first.
		for (var b = 0; b < count; b++) {
			buffer[offset + b] = value & 0x1 ? true : false;
			value = value >> 1;
		}
	}
	//---------------------------------------------------------
	this.Initialize = function () {
		var a0 = arguments[0];
		var a1 = arguments[1];
		var data = null;
		// Bits per number.
		if (typeof a0 === "number") {
			// -------------------------
			// System.Collections.BitArray(length, defaultValue);
			data = new Array(a0);
			// Make sure that default value is true or false;
			a1 = a1 ? true : false;
			// Route througth bitArray...
			for (var i = 0; i < length; i++) {
				data[i] = a1;
			}
		} else {
			// -------------------------
			// System.Collections.BitArray(numbers, bpn);
			var bpn = a1 ? a1 : 8;
			var length = a0.length;
			data = new Array(length * bpn);
			// Route througth numbers...
			for (var x = 0; x < length; x++) {
				var n = a0[x];
				// Fill array with number bits.
				NumberToBits(n, data, x * bpn, bpn);
			}
		}
		return data;
	};
	return this.Initialize.apply(this, arguments);
};

System.Collections.BitArray.ToString = function (array, bpn) {
	/// <summary>
	/// Function for converting bit array into string representation.
	/// </summary>
	/// <param name="array">Bits array</param>
	/// <param name="bpn">Bits per number. Used to split string representation.</param>
	/// <returns>String representation of bits array</returns>
	/// <remarks>
	/// There is no static function System.Collections.BitArray.ToString(array, bpn) in .NET.
	/// </remarks>
	var length = array.length;
	bpn = arguments[1] ? arguments[1] : 8;
	var sb = new System.Text.StringBuilder();
	for (var i = 0; i < length; i++) {
		if (i > 0 && i % bpn === 0) sb.Append(' ');
		sb.Append(array[i] ? '1' : '0');
	}
	return "[" + sb.ToString() + "]";
};

//=============================================================================
// CLASS: System.Collections.DictionaryEntry
//-----------------------------------------------------------------------------

System.Collections.DictionaryEntry = function (key, value) {
	/// <summary>
	/// 
	/// </summary>
	this.Key;
	this.Value;
	//---------------------------------------------------------
	// METHOD: Equals
	//---------------------------------------------------------
	// Determines whether two instances are equal.
	this.Equals = function (item) {
		var equal = true;
		equal = equal && this.Key === item.Key;
		equal = equal && this.Value === item.Value;
		return equal;
	};
	//---------------------------------------------------------
	// METHOD: ToString
	//---------------------------------------------------------
	// Returns a String that represents the current Object.
	this.ToString = function () {
		return "HashtableItem[Key='" + this.Key + "';Value='" + this.Value + "']";
	};
	//---------------------------------------------------------
	// INIT: Class
	//---------------------------------------------------------
	this.InitializeClass = function () {
		this.Key = key;
		this.Value = value;
	};
	this.InitializeClass();
};

//=============================================================================
// CLASS: System.Collections.Hashtable
//-----------------------------------------------------------------------------

System.Collections.Hashtable = function () {
	/// <summary>
	/// 
	/// </summary>
	//---------------------------------------------------------
	// PROPERTY: Items
	//---------------------------------------------------------
	this.Items;
	this.Count;
	//---------------------------------------------------------
	// METHOD: GetKeys
	//---------------------------------------------------------
	// Get array of keys from the Hashtable.
	this.GetKeys = function (key) {
		var keys = [];
		for (var property in this.Items) {
			keys.push(property);
		}
		return keys;
	};
	//---------------------------------------------------------
	// METHOD: GetValues
	//---------------------------------------------------------
	// Get array of values from the Hashtable.
	this.GetValues = function (value) {
		var values = [];
		for (var property in this.Items) {
			values.push(this.Items[property]);
		}
		return values;
	};
	//---------------------------------------------------------
	// METHOD: GetValue
	//---------------------------------------------------------
	// Get value by key.
	this.GetValue = function (key) {
		return this.Items[key];
	};
	//---------------------------------------------------------
	// METHOD: GetKey
	//---------------------------------------------------------
	// Get first key by value;
	this.GetKey = function (value) {
		var key;
		for (var property in this.Items) {
			if (this.Items[property] === value) {
				key = property;
				break;
			}
		}
		return key;
	};
	//---------------------------------------------------------
	// METHOD: Add
	//---------------------------------------------------------
	// Adds an element with the specified key and value into the Hashtable.
	this.Add = function (key, value) {
		var containsKey = this.ContainsKey(key);
		if (!containsKey) this.Count++;
		this.Items[key] = value;
		return !containsKey;
	};
	//---------------------------------------------------------
	// METHOD: Remove
	//---------------------------------------------------------
	// Removes the element with the specified key from the Hashtable.
	this.Remove = function (key) {
		var containsKey = this.ContainsKey(key);
		if (containsKey) {
			this.Count--;
			delete this.Items[key];
		}
		return !containsKey;
	};
	//---------------------------------------------------------
	// METHOD: Clear
	//---------------------------------------------------------
	// Removes all items.
	this.Clear = function () {
		this.Items = {};
	};
	//---------------------------------------------------------
	// METHOD: ContainsKey
	//---------------------------------------------------------
	// Determines whether the Hashtable contains a specific key.
	this.ContainsKey = function (key) {
		return typeof this.Items[key] !== "undefined";
	};
	//---------------------------------------------------------
	// METHOD: ContainsValue
	//---------------------------------------------------------
	// Determines whether the Hashtable contains a specific value.
	this.ContainsValue = function (value) {
		return typeof this.GetKey(value) !== "undefined";
	};
	//---------------------------------------------------------
	// METHOD: ToString
	//---------------------------------------------------------
	// Returns a String that represents the current Object.
	this.ToString = function () {
		return this.GetType().Name + "[Count=" + Count + "]";
	};
	//---------------------------------------------------------
	// INIT: Class
	//---------------------------------------------------------
	this.InitializeClass = function () {
		// Use array to store items (slower).
		this.Items = {};
		this.Count = 0;
	};
	this.InitializeClass();
};

//=============================================================================
// CLASS: System.Collections.List
//-----------------------------------------------------------------------------

System.Collections.List = function () {
	/// <summary>
	/// 
	/// </summary>
	this.KeyIsUnique;
	this.ValueIsUnique;
	//---------------------------------------------------------
	// PROPERTY: Items
	//---------------------------------------------------------
	this.Items;
	//---------------------------------------------------------
	// METHOD: _indexOf
	//---------------------------------------------------------
	this._indexOf = function (property, value) {
		var index = -1;
		for (var i = 0; i < this.Items.length; i++) {
			if (this.Items[i][property] === value) {
				index = i;
				break;
			}
		}
		return;
	};
	//---------------------------------------------------------
	// METHOD: _getItems
	//---------------------------------------------------------
	// Returns: System.Collections.DictionaryEntry[]
	this._getItemsBy = function (property, value, single) {
		var items = [];
		var i;
		// Get all objects.
		if (typeof value === "undefined") {
			for (i = 0; i < this.Items.length; i++) {
				items.push(this.Items[i]);
			}
		} else {
			// Get objects by value.
			for (i = 0; i < this.Items.length; i++) {
				if (this.Items[i][property] === value) {
					items.push(this.Items[i]);
					if (single) break;
				}
			}
		}
		return items;
	};
	//---------------------------------------------------------
	// METHOD: _getObjectsBy
	//---------------------------------------------------------
	// Returns: object[]
	this._getObjectsBy = function (property, value, single) {
		var objects = [];
		var i;
		// Get all objects.
		if (typeof value === "undefined") {
			for (i = 0; i < this.Items.length; i++) {
				objects.push(this.Items[i][property]);
			}
		} else {
			// Get objects by value.
			for (i = 0; i < this.Items.length; i++) {
				if (this.Items[i][property] === value) {
					objects.push(this.Items[i][property]);
					if (single) break;
				}
			}
		}
		return objects;
	};
	//---------------------------------------------------------
	// METHOD: IndexOfKey
	//---------------------------------------------------------
	// Get index of key (only if not unique).
	this.IndexOfKey = function (key) {
		return this._indexOf("Key", key);
	};
	//---------------------------------------------------------
	// METHOD: GetIndexByValue
	//---------------------------------------------------------
	// Get index of value (only if not unique).
	this.IndexOfValue = function (value) {
		return this._indexOf("Value", value);
	};
	//---------------------------------------------------------
	// METHOD: GetKeys
	//---------------------------------------------------------
	// Get array of keys from the Hashtable.
	this.GetKeys = function () {
		return this._getObjectsBy("Key", key, this.KeyIsUnique);
	};
	//---------------------------------------------------------
	// METHOD: GetValues
	//---------------------------------------------------------
	// Get array of values from the Hashtable.
	this.GetValues = function () {
		return this._getObjectsBy("Value", value, this.ValueIsUnique);
	};
	//---------------------------------------------------------
	// METHOD: GetValue
	//---------------------------------------------------------
	// Get first value by key.
	this.GetValue = function (key) {
		var value;
		var items = this._getItemsBy("Key", key, true);
		if (items.length > 0) value = items[0].Value;
		return value;
	};
	//---------------------------------------------------------
	// METHOD: GetKey
	//---------------------------------------------------------
	// Get first key by value;
	this.GetKey = function (value) {
		var key;
		var items = this._getItemsBy("Value", value, true);
		if (items.length > 0) key = items[0].Key;
		return key;
	};
	//---------------------------------------------------------
	// METHOD: Add
	//---------------------------------------------------------
	// Adds an element with the specified key and value into the Hashtable.
	this.Add = function (key, value) {
		var allow = true;
		if (this.KeyIsUnique) allow = allow && this.IndexOfKey === -1;
		if (this.ValueIsUnique) allow = allow && this.IndexOfValue === -1;
		if (allow) {
			var item = new System.Collections.DictionaryEntry(key, value);
			this.Items.push(item);
		}
		return allow;
	};
	//---------------------------------------------------------
	// METHOD: Remove
	//---------------------------------------------------------
	// Removes the element with the specified key from the Hashtable.
	this.Remove = function (key) {
		var index;
		var removed = false;
		while (index !== -1) {
			index = this._indexOf("Key", key);
			if (index > -1) {
				this.Items.splice(index, 1);
				removed = true;
			}
		}
		return removed;
	};
	//---------------------------------------------------------
	// METHOD: Clear
	//---------------------------------------------------------
	// Removes all items.
	this.Clear = function () {
		this.Items = [];
	};
	//---------------------------------------------------------
	// METHOD: ContainsKey
	//---------------------------------------------------------
	// Determines whether the Hashtable contains a specific key.
	this.ContainsKey = function (key) {
		return this._indexOf("Key", key) > -1;
	};
	//---------------------------------------------------------
	// METHOD: ContainsValue
	//---------------------------------------------------------
	// Determines whether the Hashtable contains a specific value.
	this.ContainsValue = function (value) {
		return this._indexOf("Value", value) > -1;
	};
	//---------------------------------------------------------
	// METHOD: ToString
	//---------------------------------------------------------
	// Returns a String that represents the current Object.
	this.ToString = function () {
		return this.GetType().Name + "[Items.length=" + this.Items.length + "]";
	};
	//---------------------------------------------------------
	// INIT: Class
	//---------------------------------------------------------
	this.InitializeClass = function () {
		// Use array to store items (slower).
		this.Items = [];
		this.KeyIsUnique = false;
		this.ValueIsUnique = false;
	};
	this.InitializeClass();
};

//=============================================================================
// CLASS: System.Collections.SortedList
//-----------------------------------------------------------------------------

System.Collections.SortedList = function () {
	/// <summary>
	/// 
	/// </summary>
	this.Items = [];
	//var aa = new ActiveXObject("Scripting.Dictionary");
	//---------------------------------------------------------
	// INIT: Class
	//---------------------------------------------------------
	this.Add = function (key, value) {
		// If user submited number then just set value.
		if (new String(parseInt(key)) === key) {
			this.Items[key] = value;
		} else {
			if (this.Items[key] === null) this.Items.push(value);
			this.Items[key] = value;
		}
	};
	this.push = function (value) {
		this.Add(this.length, value);
	};

	this.ContainsKey = function (key) {
		this._keys.push(key);
		this._values.push(value);
	};
};

//=============================================================================
// CLASS: System.Collections.ArrayUniqueValueAdd
//-----------------------------------------------------------------------------

System.Collections.ArrayUniqueValueAdd = function (array, value, propertyName) {
	/// <summary>
	/// 
	/// </summary>
	if (typeof array === "object") {
		var itemExist = false;
		var i;
		if (property === null) {
			for (i = 0; i < array.length; i++) {
				if (array[i] === value) {
					itemExist = true;
					break;
				}
			}
		} else {
			for (i = 0; i < array.length; i++) {
				//Trace.Write(propertyName+" "+array[f][propertyName]+" "+value.ticketId);
				if (array[i][propertyName] === value[propertyName]) {
					itemExist = true;
					break;
				}
			}
		}
		// If value does not exist then...
		if (itemExist === false) {
			// Add value to array.
			//Trace.Write("Push value");
			array.push(value);
		}
	}
};

//=============================================================================
// CLASS: System.Collections.ArrayUniqueValueRemove
//-----------------------------------------------------------------------------

System.Collections.ArrayUniqueValueRemove = function (array, value, propertyName) {
	/// <summary>
	/// This will remove one value by key from array. It works faster than ArrayValueRemove.
	/// </summary>
	if (typeof array === "object") {
		var i;
		if (property === null) {
			for (i = 0; i < array.length; i++) {
				if (array[i] === value) {
					array.splice(i, 1);
					break;
				}
			}
		} else {
			for (i = 0; i < array.length; i++) {
				if (array[i][propertyName] === value[propertyName]) {
					array.splice(i, 1);
					break;
				}
			}
		}
	}
};

//=============================================================================
// CLASS: System.Collections.ArrayValueRemove
//-----------------------------------------------------------------------------

System.Collections.ArrayValueRemove = function (array, value, propertyName) {
	/// <summary>
	/// This will remove all values by key from array. It works slower than ArrayUniqueValueRemove.
	/// </summary>
	if (typeof array === "object") {
		var i;
		if (property === null) {
			for (i = 0; i < array.length; i++) {
				if (array[i] === value) {
					array.splice(i, 1);
				}
			}
		} else {
			for (i = 0; i < array.length; i++) {
				if (array[i][propertyName] === value[propertyName]) {
					array.splice(i, 1);
				}
			}
		}
	}
};

//==============================================================================
// END
//------------------------------------------------------------------------------