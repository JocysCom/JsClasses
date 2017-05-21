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
//		<RootNamespace>System.Web.UI.HtmlControls.TextBox</RootNamespace>
// <PropertyGroup>
//-----------------------------------------------------------------------------
System.Type.RegisterNamespace("System.Web.UI.HtmlControls.TextBox");
//=============================================================================

//-------------------------------------------------------------------------
// Converted from:
// * Javascript Lib V1.2
// * CONTACT: jerry.wang@clochase.com
//-------------------------------------------------------------------------

System.Web.UI.HtmlControls.TextBox.GetCursorStartPos = function (obj) {
	var nPosition = parseInt(obj.getAttribute("position"), 10);
	if (nPosition >= 0) return nPosition;
	// IE
	if (document.selection) {
		var cur = document.selection.createRange();
		var pos = 0;
		if (obj && cur) {
			var tr = obj.createTextRange();
			if (tr) {
				while (cur.compareEndPoints("StartToStart", tr) > 0) {
					tr.moveStart("character", 1);
					pos++;
				}
				return pos;
			}
		}
		return -1;
	} else if (obj.selectionStart !== null) { // FF
		return obj.selectionStart;
	} else {
		return -1;
	}
};

//-----------------------------------------------------------------------------
System.Web.UI.HtmlControls.TextBox.GetCursorEndPos = function (obj) {
	var nPosition = parseInt(obj.getAttribute("position"), 10);
	if (nPosition >= 0) return nPosition;
	// IE
	if (document.selection) {
		var cur = document.selection.createRange();
		var pos = 0;
		if (obj && cur) {
			var tr = obj.createTextRange();
			if (tr) {
				while (cur.compareEndPoints("EndToStart", tr) > 0) {
					tr.moveStart("character", 1);
					pos++;
				}
				return pos;
			}
		}
		return -1;
	}
	else if (obj.selectionStart !== null) { // FF
		return obj.selectionEnd;
	} else {
		return -1;
	}
};

//-------------------------------------------------------------------------
System.Web.UI.HtmlControls.TextBox.SetCursorPosition = function (obj, pos) {
	if (obj.setSelectionRange) {
		obj.focus();
		obj.setSelectionRange(pos, pos);
	} else if (obj.createTextRange) {
		var range = obj.createTextRange();
		range.collapse(true);
		range.moveEnd('character', pos);
		range.moveStart('character', pos);
		range.select();
	}
};

//-------------------------------------------------------------------------
System.Web.UI.HtmlControls.TextBox.ReplaceText = function (obj, strText, nStart, nEnd) {
	// IE
	if (document.all) {
		var tr = obj.createTextRange();
		tr.moveEnd("character", nEnd - obj.value.length);
		tr.moveStart("character", nStart);
		tr.text = strText;
		tr.select();
	} else {
		// FF
		var strBefore = obj.value.substr(0, nStart);
		var strSelected = obj.value.substr(nStart, nEnd - nStart);
		var strAfter = obj.value.substr(nEnd, obj.value.length - nEnd);
		obj.value = strBefore + strText + strAfter;
	}
};


// ===================================================================
// Original author: Matt Kruse <matt@mattkruse.com>
// WWW: http://www.mattkruse.com/
// -------------------------------------------------------------------
// autoComplete (text_input, select_input, ["text"|"value"], [true|false])
//   Use this function when you have a SELECT box of values and a text
//   input box with a fill-in value. Often, onChange of the SELECT box
//   will fill in the selected value into the text input (working like
//   a Windows combo box). Using this function, typing into the text
//   box will auto-select the best match in the SELECT box and do
//   auto-complete in supported browsers.
//   Arguments:
//      field = text input field object
//      select = select list object containing valid values
//      property = either "text" or "value". This chooses which of the
//                 SELECT properties gets filled into the text box -
//                 the 'value' or 'text' of the selected option
//      forcematch = true or false. Set to 'true' to not allow any text
//                 in the text box that does not match an option. Only
//                 supported in IE (possible future Netscape).
// -------------------------------------------------------------------
System.Web.UI.HtmlControls.TextBox.AutoComplete = function (field, select, property, forcematch) {
	var found = false;
	for (var i = 0; i < select.options.length; i++) {
		if (select.options[i][property].toUpperCase().indexOf(field.value.toUpperCase()) === 0) {
			found = true; break;
		}
	}
	if (found) { select.selectedIndex = i; }
	else { select.selectedIndex = -1; }
	if (field.createTextRange) {
		if (forcematch && !found) {
			field.value = field.value.substring(0, field.value.length - 1);
			return;
		}
		var cursorKeys = "8;46;37;38;39;40;33;34;35;36;45;";
		if (cursorKeys.indexOf(event.keyCode + ";") === -1) {
			var r1 = field.createTextRange();
			var oldValue = r1.text;
			var newValue = found ? select.options[i][property] : oldValue;
			if (newValue !== field.value) {
				field.value = newValue;
				var rNew = field.createTextRange();
				rNew.moveStart('character', oldValue.length);
				rNew.select();
			}
		}
	}
};

//=============================================================================
// CLASS: System.Web.UI.HtmlControls.TextBox.CommandLine
//-----------------------------------------------------------------------------

System.Web.UI.HtmlControls.TextBox.CommandLine = function (input, context) {
	/// <summary>
	/// Convert TextBox to Comand Line.
	/// </summary>
	//---------------------------------------------------------
	// Public properties.
	this.Context;
	this.LineNode;
	this.MemoNode;
	// Capture on Command event;
	this.Command;
	//---------------------------------------------------------
	// Private properties.
	//---------------------------------------------------------
	function createInterface(input) {
		// Set objects.
		this.LineNode = input;
		this.MemoNode = this.Context.getElementById(input.id + "Memo");
		// If memo for TextBox does not exist, then...
		if (this.MemoNode === null) {
			// ...create one.
			this.MemoNode = this.Context.createElement("select");
			this.MemoNode.id = input.id + "Memo";
			this.MemoNode.style.display = "none";
		}
		// Append <select></select> after TextBox.
		input.parentNode.appendChild(this.MemoNode);
	}
	//---------------------------------------------------------
	this.AddToHistory = function (commandText) {
		/// <summary>
		/// Add one command to history select box.
		/// </summary>
		var addCommand = true;
		// Don't add command to History if it is empty.
		if (commandText.replace(" ", "") === "") addCommand = false;
		// Don't add command to History if it is same as previous.
		var commandsCount = this.MemoNode.options.length;
		if (commandsCount > 0) {
			var previousCommand = this.MemoNode.item(commandsCount - 1).text;
			if (previousCommand === commandText) addCommand = false;
		}
		// Add command.
		if (addCommand) {
			var item = this.Context.createElement("option");
			this.MemoNode.options.add(item);
			item.text = commandText;
			item.selected = true;
		}
	};
	//---------------------------------------------------------
	function LineNode_KeyDown(sender, e) {
		// Get code of pressssed key.
		var keyCode = window.ActiveXObject ? e.keyCode : e.which;
		//Trace.Write("keyCode: "+keyCode);
		var commandHistory = "";
		var keyIsArrow = false;
		switch (keyCode) {
			case 13: // [Enter]
				this.AddToHistory(this.LineNode.value);
				// Rise on command event.
				var e1 = new System.EventArgs("Command");
				e1["Command"] = this.LineNode.value;
				this.LineNode.value = "";
				this.RiseEvent(e1);
				break;
			case 38: // [KeyUp]
				keyIsArrow = true;
				break;
			case 40: // [KeyDown]
				keyIsArrow = true;
				break;
			case 27: // [Escape]
				//alert("0");
				this.LineNode.value = "";
				//alert("1");
				//Trace.Write("Clean Line");
				//alert("1a");
				break;
		}
		//alert("2");
		if (keyIsArrow) {
			var commandsCount = this.MemoNode.options.length;
			// Get index of current selected command in history.
			var memoSelectedIndex = this.MemoNode.selectedIndex;
			//Trace.Write("memoSelectedIndex: "+memoSelectedIndex);
			// If CommandHisory is Empty Then just exit this function.
			if (commandsCount === 0) return;
			if (commandsCount === 1) {
				//Trace.Write("commandsCount == 1");
				if (this.LineNode.value === "") {
					this.LineNode.value = this.MemoNode.item(memoSelectedIndex).text;
				} else {
					this.LineNode.value = "";
				}
			}
			if (commandsCount > 1) {
				// If command line is empty Then just paste from CommandHitory.
				if (this.LineNode.value === "") {
					this.LineNode.value = this.MemoNode.value;
				} else {
					switch (keyCode) {
						case 38: // [KeyUp]
							// If it is not the top of CommandHistory then...
							if (memoSelectedIndex > 0) {
								// Select next command.
								this.MemoNode.selectedIndex = memoSelectedIndex - 1;
								this.LineNode.value = this.MemoNode.value;
							} else {
								this.LineNode.value = "";
							}
							break;
						case 40: // [KeyDown]
							// If it is not the bottom of CommandHistory then...
							if (memoSelectedIndex < commandsCount - 1) {
								// Select next command.
								this.MemoNode.selectedIndex = memoSelectedIndex + 1;
								this.LineNode.value = this.MemoNode.value;
							} else {
								this.LineNode.value = "";
							}
							break;
						default:
							break;
					}
				}
				memoSelectedIndex = this.MemoNode.selectedIndex;
				//Trace.Write("memoSelectedIndex2: "+memoSelectedIndex);
			}
		}
	}
	//---------------------------------------------------------
	function MemoNode_Change(sender, e) {
		// Get index of current selected command in history.
		memoSelectedIndex = this.MemoNode.selectedIndex;
		//objCommandLine.value = this.MemoNode.item(memoSelectedIndex).innerHtml;
	}
	//---------------------------------------------------------
	function attachEvents() {
		// Attach event to ChatCommand to capture key presses.
		Events.Add(this.LineNode, "keyup", new System.EventHandler(this, LineNode_KeyDown), false);
		//Events.Add(this.MemoNode, "change", new System.EventHandler(this, MemoNode_Change), true);
	}
	//---------------------------------------------------------
	this.RiseEvent = function (e) { if (this[e.Name]) this[e.Name](this, e); };
	//---------------------------------------------------------
	function initialize(input, context) {
		// Set submited values or default values.
		this.Context = context ? context : document;
		// Create Interface.
		//this.CreateInterface();
		createInterface.call(this, input);
		attachEvents.call(this, input);
	}
	initialize.apply(this, arguments);
};

//==============================================================================
// END
//------------------------------------------------------------------------------