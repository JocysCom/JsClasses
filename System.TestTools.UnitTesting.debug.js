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
//		<RootNamespace>System.TestTools.UnitTesting</RootNamespace>
// <PropertyGroup>
//-----------------------------------------------------------------------------
System.Type.RegisterNamespace("System.TestTools.UnitTesting");
//=============================================================================

// http://docs.jquery.com/QUnit
// http://indomitablehef.com/?p=221

Test = QUnit.test;
Module = QUnit.module;

System.TestTools.UnitTesting.Assert = {
	_FormatMessage: function (index, args) {
		var aLen = args.length - 1;
		if (aLen < index) return;
		if (aLen === index) return args[index];
		var params = new Array(args.length - index);
		for (var i = 0; i < params.length; i++) params[i] = args[i + index];
		return String.Format.apply(String, params);
	},

	AreEqual: function (expected, actual, message, parameters) {
		/// <summary>
		/// Verifies that two specified objects are equal. The assertion fails if the objects are not equal.
		/// Displays a message if the assertion fails, and applies the specified formatting to it.
		/// </summary>
		/// <param name="expected">The first object to compare. This is the object the unit test expects.</param>
		/// <param name="actual">The second object to compare. This is the object the unit test produced.</param>
		/// <param name="message">A message to display if the assertion fails. This message can be seen in the unit test results.</param>
		/// <param name="parameters">An array of parameters to use when formatting <paramref name="message" />.</param>
		message = this._FormatMessage(2, arguments);
		equals(actual, expected, message);
	},

	AreNotEqual: function (expected, actual, message, parameters) {
		message = this._FormatMessage(2, arguments);
		ok(actual !== expected, message);
	},

	AreSame: function (expected, actual, message, parameters) {
		message = this._FormatMessage(2, arguments);
		deepEqual(actual, expected, message);
	},

	AreNotSame: function (expected, actual, message, parameters) {
		message = this._FormatMessage(2, arguments);
		notDeepEqual(actual, expected, message);
	},

	IsInstanceOfType: function (value, expectedType, message, parameters) {
		/// <summary>
		/// Verifies that the specified object is an instance of the specified type.
		/// The assertion fails if the type is not found in the inheritance hierarchy of the object.
		/// Displays a message if the assertion fails, and applies the specified formatting to it.
		/// </summary>
		/// <param name="value">The object to verify is of <paramref name="expectedType" />.</param>
		/// <param name="expectedType">The type expected to be found in the inheritance hierarchy of <paramref name="value" />.</param>
		/// <param name="message">A message to display if the assertion fails. This message can be seen in the unit test results.</param>
		/// <param name="parameters">An array of parameters to use when formatting <paramref name="message" />.</param>
		message = this._FormatMessage(2, arguments);
		var aType = "[object " + value + "]";
		var eType = "[object " + expectedType + "]";
		//if (aType == "[object Object]") aType = "[object "+value.GetType().FullName+"]";
		equal(aType, eType, message);
	},

	IsNotInstanceOfType: function (value, expectedType, message, parameters) {
		message = this._FormatMessage(2, arguments);
		var aType = "[object " + value + "]";
		var eType = "[object " + expectedType + "]";
		//if (aType == "[object Object]") aType = "[object "+value.GetType().FullName+"]";
		notEqual(aType, eType, message);
	},

	IsNull: function (value, message, parameters) {
		message = this._FormatMessage(1, arguments);
		var aType = "[object " + value + "]";
		var eType = "[object null]";
		//if (aType == "[object Object]") aType = "[object "+value.GetType().FullName+"]";
		equal(aType, eType, message);
	},

	IsNotNull: function (value, message, parameters) {
		message = this._FormatMessage(1, arguments);
		var aType = "[object " + value + "]";
		var eType = "[object null]";
		//if (aType == "[object Object]") aType = "[object "+value.GetType().FullName+"]";
		notEqual(aType, eType, message);
	},

	IsTrue: function (condition, message, parameters) {
		/// <summary>
		/// Verifies that the specified condition is true. The assertion fails if the condition is false.
		/// Displays a message if the assertion fails, and applies the specified formatting to it.
		/// </summary>
		/// <param name="condition">The condition to verify is true.</param>
		/// <param name="message">A message to display if the assertion fails. This message can be seen in the unit test results.</param>
		/// <param name="parameters">An array of parameters to use when formatting <paramref name="message" />.</param>
		message = this._FormatMessage(1, arguments);
		ok(condition, message);
	},

	IsFalse: function (condition, message, parameters) {
		/// <summary>
		/// Verifies that the specified condition is false. The assertion fails if the condition is true. Displays a message if the assertion fails, and applies the specified formatting to it.
		/// </summary>
		/// <param name="condition">The condition to verify is false.</param>
		/// <param name="message">A message to display if the assertion fails. This message can be seen in the unit test results.</param>
		/// <param name="parameters">An array of parameters to use when formatting <paramref name="message" />.</param>
		message = this._FormatMessage(1, arguments);
		ok(!bool, message);
	}

};

Assert = System.TestTools.UnitTesting.Assert;


//test( name, expected, test )	
//Add a test to run.
//asyncTest( name, expected, test )	
//Add an asynchronous test to run. The test must include a call to start().
//expect( amount )	
//Specify how many assertions are expected to run within a test.
//module( name, lifecycle )	
//Separate tests into modules.
//init( )	
//Initialize the test runner (if the runner has already run it'll be re-initialized, effectively resetting it). This method does not need to be called in the normal use of QUnit.

//==============================================================================
// END
//------------------------------------------------------------------------------