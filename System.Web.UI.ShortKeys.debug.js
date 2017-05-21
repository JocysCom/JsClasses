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
//		<RootNamespace>System.Web.UI.ShortKeys</RootNamespace>
// <PropertyGroup>
//-----------------------------------------------------------------------------
System.Type.RegisterNamespace("System.Web.UI.ShortKeys");
//=============================================================================

//=============================================================================
// CLASS: System.Web.UI.ShortKeys.KeysManager
//-----------------------------------------------------------------------------

// Create ShortKeys class
System.Web.UI.ShortKeys.KeysManager = function (id, control, target) {
	this.Data = null;
	this.KeyboardLayout = null;
	//---------------------------------------------------------
	// Public properties.
	//---------------------------------------------------------
	this.PreviousKey = 0;
	this.PreventedKeys = {};
	this.LastDownKey = 0;
	//---------------------------------------------------------
	// Private properties.
	//---------------------------------------------------------
	var me = this;
	//---------------------------------------------------------
	// DELEGATES: Events
	//---------------------------------------------------------
	this.OnShortCutAction;
	//---------------------------------------------------------
	// METHOD: OnKeyEvent
	//---------------------------------------------------------
	this.OnKeyEvent = function (sender, e) {
		var strKeyDown = "";
		var strKeyDownLR = "";
		var objActiveElement = {};
		// Get event: 'evt' - for all browsers or 'window.event' - for IE.
		var keyCode = window.ActiveXObject ? e.Event.keyCode : e.Event.which;
		var activeElement = window.ActiveXObject ? e.Event.srcElement : e.Event.target;
		// Get key name by code.
		var enumName = System.Windows.Forms.VirtualKeys[keyCode];
		var enumDown = [];
		var enumDownFull = [];
		// Check if some keys are down. "R" and "L" prefix works only for IE.
		var singleDown = [];
		if (e.Event.shiftKey) {
			singleDown.push(0x10);
			enumDown.push("SHIFT");
			enumDownFull.push(e.Event.shiftLeft ? "LSHIFT" : "RSHIFT");
		}
		if (e.Event.ctrlKey) {
			singleDown.push(0x11);
			enumDown.push("CTRL");
			enumDownFull.push(e.Event.ctrlLeft ? "LCONTROL" : "RCONTROL");
		}
		if (e.Event.altKey) {
			singleDown.push(0x12);
			enumDown.push("ALT");
			enumDownFull.push(e.Event.shiftLeft ? "LMENU" : "RMENU");
		}
		// Lets gather pressed keys.
		var keysDown = [];
		for (var property in this.Data) {
			keysDown.push(property);
		}
		// Create String of down keys.
		var keysDownSorted = keysDown.sort();
		var keysDownString = "";
		var keysDownCode = 0;
		for (var i = 0; i < keysDownSorted.length; i++) {
			if (i > 0) {
				keysDownString += "+";
				// Shift number by 8 bits to left.
				keysDownCode = keysDownCode << 8;
			}
			keysDownCode = keysDownCode | keysDownSorted[i];
			keysDownString += System.Windows.Forms.VirtualKeys[keysDownSorted[i]];
		}
		var capsLockState = null;
		// Detect CapsLock state. Available only OnKeyPress.
		var kbdName = enumName;
		// Set Repeat value.
		if (e.Name === "OnKeyDown") {
			this.LastDownKey = keyCode;
			//Trace.Write("------------------------------------------");
			//for (var property in e.Event){
			//	Trace.Write(property+"="+e.Event[property]);
			//}
			//Trace.Write("------------------------------------------");
			if (typeof this.Data[keyCode] === "undefined") {
				this.Data[keyCode] = {};
				this.Data[keyCode]["DownCount"] = 0;
			}
			this.Data[keyCode].DownCount += 1;
		}
		var downCount = 0;
		// KeyPress is different event because this event
		// will report unicode char code mapped to keyboard key.
		// Allow to run default event;
		var layoutValue = null;
		var layoutCode = 0;
		if (e.Name === "OnKeyPress") {
			singleDown.push(this.LastDownKey);
			for (var j = 0; j < singleDown.length; j++) {
				// Shift number by 8 bits to left.
				if (j > 0) layoutCode = layoutCode << 8;
				layoutCode = layoutCode | singleDown[j];
			}
			// If upper case, check if shift is not pressed. if lower case, check if shift is pressed
			capsLockState =
				keyCode > 64 && keyCode < 91 && !e.Event.shiftKey ||
				keyCode > 96 && keyCode < 123 && e.Event.shiftKey;
			// Change KeyName.
			kbdName = String.fromCharCode(keyCode);
			if (this.KeyboardLayout) {
				// We need to prevent default if mapped key was found.
				layoutValue = this.KeyboardLayout.Keys[layoutCode];
			}
		} else {
			// Key code can be different on key press...
			if (this.Data[keyCode]) {
				downCount = this.Data[keyCode].DownCount;
			} else {
				Trace.Write("// '" + e.Name + "' event fired but there was no 'OnKeyDown' event for this Key: " + enumName + "- " + keyCode.toString(16));
			}
		}
		if (e.Name === "OnKeyUp") {
			delete this.Data[keyCode];
		}
		enumDown.push(kbdName.toUpperCase());
		enumDownFull.push(kbdName);
		var keyName = enumDown.toString().replace(",", "+", "g");
		var keyNameFull = enumDownFull.toString().replace(",", "+", "g");
		// This is not implemented properly yet.
		var sameAsPrevious = this.PreviousKey === keyCode;
		this.PreviousKey = keyCode;
		// If OnShortcutAction event of Layout function was found then...
		if (this.OnShortCutAction || layoutValue) {
			var e1 = new System.EventArgs("OnShortCutAction");
			e1["EventName"] = e.Name;
			e1["Char"] = String.fromCharCode(keyCode);
			e1["KeyCode"] = keyCode;
			e1["EnumName"] = enumName;
			e1["KeyName"] = keyName;
			e1["KeyNameFull"] = keyNameFull;
			e1["KeysDown"] = keysDown;
			e1["KeysDownCode"] = keysDownCode;
			e1["KeysDownSorted"] = keysDownSorted;
			e1["KeysDownString"] = keysDownString;
			e1["DownCount"] = downCount;
			e1["CapsState"] = capsLockState;
			e1["ActiveElement"] = activeElement;
			e1["SameAsPrevious"] = sameAsPrevious;
			e1["LayoutCode"] = layoutCode;
			e1["LayoutValue"] = layoutValue;
			var runDefaultEvent = true;
			// If layout value exist then...
			if (layoutValue) {
				// If value is not a number (means function);
				if (isNaN(layoutValue)) {
					// Asume it is function. So run it.
					runDefaultEvent = layoutValue(this, e1);
				} else {
					// Disable default function.
					runDefaultEvent = false;
					var layoutString = String.fromCharCode(layoutValue);
					// Insert layout value instead of default.
					if (window.ActiveXObject) {
						document.selection.createRange().text = layoutString;
					} else {
						var sStart = this.Control.selectionStart + 1;
						var valS = this.Control.value.substring(0, this.Control.selectionStart);
						var valE = this.Control.value.substr(this.Control.selectionEnd);
						this.Control.value = valS + layoutString + valE;
						this.Control.setSelectionRange(sStart, sStart);
					}
				}
			}
			// Run delegated function.
			if (this.OnShortCutAction) runDefaultEvent = runDefaultEvent && this.OnShortCutAction(this, e1);
			this.PreventDefault(e.Event, runDefaultEvent, keyName, keyName);
		}
		return runDefaultEvent;
	};
	//---------------------------------------------------------
	// METHOD: OnKeypress
	//---------------------------------------------------------
	this.OnKeypress = function (evt) {
		var e = new System.EventArgs("OnKeyPress");
		e["Event"] = evt ? evt : window.event;
		// if this is not char then dont call event.
		// We need this for firefox because IE fires only KeyDown and KeyUp on non letter keys.
		//var keyCode = (window.ActiveXObject) ? e.Event.keyCode : e.Event.which;
		//if (keyCode > 0)
		return me.OnKeyEvent(me, e);
	};
	//---------------------------------------------------------
	// METHOD: OnKeyup
	//---------------------------------------------------------
	this.OnKeyup = function (evt) {
		var e = new System.EventArgs("OnKeyUp");
		e["Event"] = evt ? evt : window.event;
		me.OnKeyEvent(me, e);
	};
	//---------------------------------------------------------
	// METHOD: OnKeydown
	//---------------------------------------------------------
	this.OnKeydown = function (evt) {
		var e = new System.EventArgs("OnKeyDown");
		e["Event"] = evt ? evt : window.event;
		me.OnKeyEvent(me, e);
	};
	//---------------------------------------------------------
	// METHOD: EventAdd
	//---------------------------------------------------------
	this.EventAdd = function (e, eT, eL, cap) {
		eT = eT.toLowerCase();
		var eh = 'e.on' + eT + '=eL';
		if (e.addEventListener) e.addEventListener(eT, eL, cap);
		else if (e.attachEvent) e.attachEvent('on' + eT, eL);
		else eval(eh);
	};
	//---------------------------------------------------------
	// METHOD: StopPropagation
	//---------------------------------------------------------
	this.StopPropagation = function (evt) {
		if (evt && evt.stopPropagation) evt.stopPropagation();
		else if (window.ActiveXObject) window.event.cancelBubble = true;
	};
	//---------------------------------------------------------
	// METHOD: PreventKey
	//---------------------------------------------------------
	this.PreventKeys = function (keys) {
		if (typeof keys === "string") keys = [keys];
		for (var i = 0; i < keys.length; i++) {
			this.PreventedKeys[keys[i]] = true;
		}
	};
	//---------------------------------------------------------
	// METHOD: AllowKey
	//---------------------------------------------------------
	this.AllowKeys = function (keys) {
		if (typeof keys === "string") keys = [keys];
		for (var i = 0; i < keys.length; i++) {
			if (this.PreventedKeys[keys[i]]) {
				delete this.PreventedKeys[keys[i]];
			}
		}
	};
	//---------------------------------------------------------
	// METHOD: PreventDefault
	//---------------------------------------------------------
	// This function will help tp prevent default browser action on key event.
	this.PreventDefault = function (evt, runDefaultEvent, keyName, keyNameFull) {
		// prevent event if we are not allowing to run default.
		var prevent = runDefaultEvent === false;
		// Check disabled keys.
		prevent = prevent || this.PreventedKeys[keyName] === true;
		prevent = prevent || this.PreventedKeys[keyNameFull] === true;
		if (prevent) {
			if (evt && evt.preventDefault) evt.preventDefault();
			else if (window.ActiveXObject) window.event.returnValue = false;
		}
	};
	//---------------------------------------------------------
	this.Dispose = function () {
		Events.Remove(this.Control, "keypress", this.OnKeypress, true);
		Events.Remove(this.Control, "keyup", this.OnKeyup, true);
		Events.Remove(this.Control, "keydown", this.OnKeydown, true);
	};
	//---------------------------------------------------------
	function initializeEvents() {
		Events.Add(this.Control, "keypress", this.OnKeypress, true);
		Events.Add(this.Control, "keyup", this.OnKeyup, true);
		Events.Add(this.Control, "keydown", this.OnKeydown, true);
	}
	//---------------------------------------------------------
	function initializeClass(id, control, target) {
		// Set submited values or default values.
		this.id = id ? id : null;
		this.Control = control ? control : document;
		this.Target = target ? target : document;
		this.Data = {};
		// Init all events;
		initializeEvents.call(this);
	}
	initializeClass.apply(this, arguments);
};

//=============================================================================
// CLASS: System.Web.UI.ConvertToAutoSelect
//-----------------------------------------------------------------------------

System.Type.RegisterNamespace("System.Web.UI.ShortKeys.KeyMaps");

System.Web.UI.ShortKeys.KeyMaps.Russian = {
	0x77: 0x436
};

System.Web.UI.ShortKeys.KeyNames = {

};

// STATIC METHOD:
System.Web.UI.ShortKeys.GetKeyName = function (keyCode) {
	var keyName = String.fromCharCode(keyCode);
	// Don't show SHIFT, CTRL and ALT as main Key.
	if (keyCode === 16) { keyName = "SHIFT"; }
	if (keyCode === 17) { keyName = "CTRL"; }
	if (keyCode === 18) { keyName = "ALT"; }
	// Some special keys.
	if (keyCode === 8) { keyName = "BACKSPACE"; }
	if (keyCode === 9) { keyName = "TAB"; }
	if (keyCode === 12) { keyName = "CENTER"; }
	if (keyCode === 13) { keyName = "RETURN"; }
	if (keyCode === 19) { keyName = "PAUSE"; }
	if (keyCode === 20) { keyName = "CAPSLOCK"; }
	if (keyCode === 27) { keyName = "ESCAPE"; }
	if (keyCode === 32) { keyName = "SPACEBAR"; }
	if (keyCode === 33) { keyName = "PAGEUP"; }
	if (keyCode === 34) { keyName = "PAGEDOWN"; }
	if (keyCode === 35) { keyName = "END"; }
	if (keyCode === 36) { keyName = "HOME"; }
	if (keyCode === 37) { keyName = "LEFT"; }
	if (keyCode === 38) { keyName = "UP"; }
	if (keyCode === 39) { keyName = "RIGHT"; }
	if (keyCode === 40) { keyName = "DOWN"; }
	if (keyCode === 45) { keyName = "INSERT"; }
	if (keyCode === 46) { keyName = "DELETE"; }
	// If browser is IE then...
	//if (window.ActiveXObject){
	if (keyCode === 91) { keyName = "WINDOWS"; }
	if (keyCode === 92) { keyName = "WINDOWS"; }
	if (keyCode === 93) { keyName = "MENU"; }
	// Num Lock keys.

	if (keyCode === 106) { keyName = "STAR"; }
	if (keyCode === 107) { keyName = "PLUS"; }
	if (keyCode === 109) { keyName = "MINUS"; }
	if (keyCode === 111) { keyName = "SOLIDUS"; }

	// You can to block F1-F12 keys, but you can capture them (it is available only in HTML Application).
	if (keyCode === 112) { keyName = "F1"; }
	if (keyCode === 113) { keyName = "F2"; }
	if (keyCode === 114) { keyName = "F3"; }
	if (keyCode === 115) { keyName = "F4"; }
	if (keyCode === 116) { keyName = "F5"; }
	if (keyCode === 117) { keyName = "F6"; }
	if (keyCode === 118) { keyName = "F7"; }
	if (keyCode === 119) { keyName = "F8"; }
	if (keyCode === 120) { keyName = "F9"; }
	if (keyCode === 121) { keyName = "F10"; }
	if (keyCode === 122) { keyName = "F11"; }
	if (keyCode === 123) { keyName = "F12"; }
	if (keyCode === 144) { keyName = "NUMLOCK"; }
	if (keyCode === 145) { keyName = "SCROLL_LOCK"; }
	//}
	// Tese special characters are for USA keyboard.
	//if (keyCode === 219){ keyName = "["; }
	//if (keyCode === 221){ keyName = "]"; }
	//if (keyCode === 223){ keyName = "`"; }
	return keyName;
};


System.Type.RegisterNamespace("System.Web.UI.AutoSelect");
System.Type.RegisterNamespace("System.Web.UI.AutoSelect.Data");

System.Web.UI.AutoSelect.AddTo = function (id, timeout) {
	var control = typeof id === "string" ? document.getElementById(id) : id;
	// Create Data for element.
	System.Web.UI.AutoSelect.Data[control.id] = {};
	System.Web.UI.AutoSelect.Data[control.id].Timeout = timeout ? timeout : 4000;
	System.Web.UI.AutoSelect.Data[control.id].TimerId = -1;
	if (window.ActiveXObject) { control.attachEvent("onkeyup", System.Web.UI.AutoSelect.OnEvent); }
	else { control.addEventListener("keyup", System.Web.UI.AutoSelect.OnEvent, false); }
};

System.Web.UI.AutoSelect.RemoveFrom = function (id) {
	var control = typeof id === "string" ? document.getElementById(id) : id;
	delete System.Web.UI.AutoSelect.Data[control.id];
};

System.Web.UI.AutoSelect.OnEvent = function (sender, e) {
	var control = window.event ? window.event.srcElement : sender.target;
	var type = window.event ? window.event.Name : sender.type;
	// Clear previous timeout.
	var timerId = System.Web.UI.AutoSelect.Data[control.id].TimerId;
	if (timerId > -1) window.clearTimeout(timerId);
	// Run timer again.
	var timeout = System.Web.UI.AutoSelect.Data[control.id].Timeout;
	timerId = window.setTimeout("document.getElementById(\"" + control.id + "\").select()", timeout);
	System.Web.UI.AutoSelect.Data[control.id].TimerId = timerId;
	return true;
};

//=============================================================================
// CLASS: System.Web.UI.ConvertToNumericUpDown
//-----------------------------------------------------------------------------

System.Type.RegisterNamespace("System.Web.UI.ConvertToNumericUpDown");
System.Type.RegisterNamespace("System.Web.UI.ConvertToNumericUpDown.Data");

System.Web.UI.ConvertToNumericUpDown.AddTo = function (id, value, minimum, maximum, increment) {
	var control = typeof id === "string" ? document.getElementById(id) : id;
	// Create Data for element.
	System.Web.UI.ConvertToNumericUpDown.Data[control.id] = {};
	System.Web.UI.ConvertToNumericUpDown.Data[control.id]["Value"] = value ? value : 0;
	System.Web.UI.ConvertToNumericUpDown.Data[control.id]["Minimum"] = minimum ? minimum : 0;
	System.Web.UI.ConvertToNumericUpDown.Data[control.id]["Maximum"] = maximum ? maximum : 100;
	System.Web.UI.ConvertToNumericUpDown.Data[control.id]["Increment"] = increment ? increment : 1;
	// Add events.
	//control.addEventListener("keyup",System.Web.UI.ConvertToNumericUpDown.OnEvent,true);
	if (window.ActiveXObject) { control.attachEvent("onkeydown", System.Web.UI.ConvertToNumericUpDown.OnEvent); }
	else { control.addEventListener("keydown", System.Web.UI.ConvertToNumericUpDown.OnEvent, true); }
	//var control = document.getElementById(id);
};

System.Web.UI.ConvertToNumericUpDown.OnEvent = function (sender, e) {
	var control = window.event ? window.event.srcElement : sender.target;
	var type = window.event ? window.event.Name : sender.type;
	var keyCode = window.event ? window.event.keyCode : sender.which;
	var minimum = System.Web.UI.ConvertToNumericUpDown.Data[control.id].Minimum;
	var maximum = System.Web.UI.ConvertToNumericUpDown.Data[control.id].Maximum;
	var increment = System.Web.UI.ConvertToNumericUpDown.Data[control.id].Increment;
	var regExp = new RegExp("[^0-9]", "gi");
	var keyName = System.Web.UI.ShortKeys.GetKeyName(keyCode);
	//Trace.Write(keyCode+"-"+keyName);
	//return true;
	//if (window.ActiveXObject){
	//	window.event.returnValue = false;
	//} else {
	//	sender.preventDefault();
	//}

	// Strip all non numbers.
	var value = control.value.replace(regExp, "");
	value = parseInt(value);
	var preventDefault = false;
	if (keyCode < 48 && keyCode > 58) preventDefault = true;
	// Allow ENTER.
	if (keyCode === 13) preventDefault = false;
	if (isNaN(value)) {
		value = minimum;
	}
	//alert(1);
	if (type === "keydown") {
		// If PageUp.
		if (keyCode === 33) { value = maximum; preventDefault = true; }
		// If PageDown.
		if (keyCode === 34) { value = minimum; preventDefault = true; }
		// If Up.
		if (keyCode === 38) { value += increment; preventDefault = true; }
		// If Down.
		if (keyCode === 40) { value -= increment; preventDefault = true; }
		value = value <= maximum ? value : maximum;
		value = value >= minimum ? value : minimum;
		if (preventDefault) {
			if (window.ActiveXObject) {
				window.event.returnValue = false;
			} else {
				sender.preventDefault();
			}
		}
		// Assign value.
		control.value = value;
		return !preventDefault;
	}
};

//=============================================================================
// CLASS: System.Web.UI.SuggestionTextBox
//-----------------------------------------------------------------------------

System.Web.UI.SuggestionTextBox = {};

// Function for adding suggestion functionality
// for text input fields in Microsoft CRM
// textfield: document.getElementById('address1_country')
// method: a function, that returns an array of strings
// preload: true or false
System.Web.UI.SuggestionTextBox.Add = function (textfield, method, preload) {
	// max items in the suggestion box
	var maxItems = 6;
	this.suggestionList = [];
	this.suggestionListDisplayed = [];
	var actual_textfield = textfield;
	var actual_value = '';
	var selectedNumber = 0;
	var countMatches = 0;
	if (preload) {
		// load the data via external method
		this.suggestionList = method();
	}
	// attach this function to the textfield
	textfield.attachEvent("onfocus", initTextfield);
	// init textfield and attach necessary events
	function initTextfield() {
		// when leaving the field we have to clear our site
		textfield.attachEvent("onblur", resetTextfield);
		document.attachEvent("onkeydown", keyDown);
	}
	function resetTextfield(e) {
		//when leaving the field, we have to remove all attached events
		document.detachEvent("onkeydown", keyDown);
		textfield.detachEvent("onblur", resetTextfield);
	}
	function keyDown(e) {
		keyCode = e.keyCode;
		switch (keyCode) {
			case 9: case 13:
				// enter & tab key
				if (countMatches > 0) {
					actual_textfield.value = suggestionListDisplayed[selectedNumber];
					if (document.getElementById('suggestion_table') !== null) {
						document.body.removeChild(document.getElementById('suggestion_table'));
					}
				}
				break;
			case 38:
				//pressing up key
				if (selectedNumber > 0 && countMatches > 0) {
					selectedNumber--;
					createSuggestionTable();
				}
				return false;
			case 40:
				// pressing down key
				if (selectedNumber < countMatches - 1 && countMatches > 0 && selectedNumber < maxItems) {
					selectedNumber++;
					createSuggestionTable();
				}
				return false;
			default:
				// do not call the function to often
				setTimeout(
					function () {
						executeSuggestion(keyCode);
					}, 200 /* in ms */
				);
				break;
		}
	}
	function executeSuggestion(keyCode) {
		selectedNumber = 0;
		countMatches = 0;
		actual_value = textfield.value;
		//todo add keyCode
		// get all possible values from the suggestionList
		if (!preload) {
			// load the data via external method
			// todo add some caching function
			this.suggestionList = method();
		}
		// using regular expressions to match it against the suggestion list
		var re = new RegExp(actual_value, "i");
		//if you want to search only from the beginning
		//var re = new RegExp("^" + actual_value, "i");
		countMatches = 0;
		this.suggestionListDisplayed = [];
		// test each item against the RE pattern
		for (i = 0; i < this.suggestionList.length; i++) {
			// if it matche add it to suggestionListDisplayed array
			if (re.test(this.suggestionList[i]) && actual_value !== '') {
				this.suggestionListDisplayed[countMatches] = this.suggestionList[i];
				countMatches++;

				// if there are more values than in maxItems, just break
				if (maxItems === countMatches)
					break;
			}
		}
		if (countMatches > 0) {
			createSuggestionTable();
		} else {
			if (document.getElementById('suggestion_table')) {
				document.body.removeChild(document.getElementById('suggestion_table'));
			}
		}
	}

	function createSuggestionTable() {
		if (document.getElementById('suggestion_table')) {
			document.body.removeChild(document.getElementById('suggestion_table'));
		}
		// creating a table object which holds the suggesions
		table = document.createElement('table');
		table.id = 'suggestion_table';
		table.width = actual_textfield.style.width;
		table.style.position = 'absolute';
		table.style.zIndex = '100000';
		table.cellSpacing = '1px';
		table.cellPadding = '2px';
		topValue = 0;
		objTop = actual_textfield;
		while (objTop) {
			topValue += objTop.offsetTop;
			objTop = objTop.offsetParent;
		}
		table.style.top = eval(topValue + actual_textfield.offsetHeight) + "px";
		leftValue = 0;
		objLeft = actual_textfield;
		while (objLeft) {
			leftValue += objLeft.offsetLeft;
			objLeft = objLeft.offsetParent;
		}
		table.style.left = leftValue + "px";
		table.style.backgroundColor = '#FFFFFF';
		table.style.border = "solid 1px #7F9DB9";
		table.style.borderTop = "none";
		document.body.appendChild(table);
		// iterate list to create the table rows
		for (i = 0; i < this.suggestionListDisplayed.length; i++) {
			row = table.insertRow(-1);
			row.id = 'suggestion_row' + i;
			column = row.insertCell(-1);
			column.id = 'suggestion_column' + i;
			if (selectedNumber === i) {
				column.style.color = '#ffffff';
				column.style.backgroundColor = '#316AC5';
			} else {
				column.style.color = '#000000';
				column.style.backgroundColor = '#ffffff';
			}
			column.style.fontFamily = 'Tahoma';
			column.style.fontSize = '11px';
			column.innerHTML = this.suggestionListDisplayed[i];
		}
	}
	// return object
	return this;
};

// Next, we have to call the function for every textfield where we want to add this behavior.
//var f = function ListOfCountries(){
//	return new Array('Afghanistan','Albania','Algeria','American Samoa','Andorra','Angola','Anguilla','Antigua and Barbuda','Argentina','Armenia','Aruba','Australia','Austria','Azerbaijan','Bahamas','Bahrain','Bangladesh','Barbados','Belarus','Belgium','Belize','Benin','Bermuda','Bhutan','Bolivia','Bosnia-Herzegovina','Botswana','Bouvet Island','Brazil','Brunei','Bulgaria','Burkina Faso','Burundi','Cambodia','Cameroon','Canada','Cape Verde','Cayman Islands','Central African Republic','Chad','Chile','China','Christmas Island','Cocos (Keeling) Islands','Colombia','Comoros','Conch Republic','Congo, Democratic Republic of the (Zaire)','Congo, Republic of','Cook Islands','Costa Rica','Croatia','Cuba','Cyprus','Czech Republic','Denmark','Djibouti','Dominica','Dominican Republic','Ecuador','Egypt','El Salvador','Equatorial Guinea','Eritrea','Estonia','Ethiopia','Falkland Islands','Faroe Islands','Fiji','Finland','France','French Guiana','Gabon','Gambia','Georgia','Germany','Ghana','Gibraltar','Greece','Greenland','Grenada','Guadeloupe (French)','Guam (USA)','Guatemala','Guinea','Guinea Bissau','Guyana','Haiti','Holy See','Honduras','Hong Kong','Hungary','Iceland','India','Indonesia','Iran','Iraq','Ireland','Israel','Italy','Ivory Coast (Cote D`Ivoire)','Jamaica','Japan','Jordan','Kazakhstan','Kenya','Kiribati','Kuwait','Kyrgyzstan','Laos','Latvia','Lebanon','Lesotho','Liberia','Libya','Liechtenstein','Lithuania','Luxembourg','Macau','Macedonia','Madagascar','Malawi','Malaysia','Maldives','Mali','Malta','Marshall Islands','Martinique (French)','Mauritania','Mauritius','Mayotte','Mexico','Micronesia','Moldova','Monaco','Mongolia','Montserrat','Morocco','Mozambique','Myanmar','Namibia','Nauru','Nepal','Netherlands','Netherlands Antilles','New Caledonia (French)','New Zealand','Nicaragua','Niger','Nigeria','Niue','Norfolk Island','North Korea','Northern Mariana Islands','Norway','Oman','Pakistan','Palau','Panama','Papua New Guinea','Paraguay','Peru','Philippines','Pitcairn Island','Poland','Polynesia (French)','Portugal','Puerto Rico','Qatar','Reunion','Romania','Russia','Rwanda','Saint Helena','Saint Kitts and Nevis','Saint Lucia','Saint Pierre and Miquelon','Saint Vincent and Grenadines','Samoa','San Marino','Sao Tome and Principe','Saudi Arabia','Schengen countries','Senegal','Serbia and Montenegro','Seychelles','Sierra Leone','Singapore','Slovakia','Slovenia','Solomon Islands','Somalia','South Africa','South Korea','Spain','Sri Lanka','Sudan','Suriname','Svalbard and Jan Mayen Islands','Swaziland','Sweden','Switzerland','Syria','Taiwan','Tajikistan','Tanzania','Thailand','Timor-Leste (East Timor)','Togo','Tokelau','Tonga','Trinidad and Tobago','Tunisia','Turkey','Turkmenistan','Turks and Caicos Islands','Tuvalu','Uganda','Ukraine','United Arab Emirates','United Kingdom','United States','Uruguay','Uzbekistan','Vanuatu','Venezuela','Vietnam','Virgin Islands','Wallis and Futuna Islands','Yemen','Zambia','Zimbabwe');
//}
//var obj = System.Web.UI.SuggestionTextBox.Add(document.getElementById('address1_country'), f, true);

//==============================================================================
// END
//------------------------------------------------------------------------------
