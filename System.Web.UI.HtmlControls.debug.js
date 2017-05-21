/// <reference path="System.debug.js" />
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
//		<RootNamespace>System.Web.UI.HtmlControls</RootNamespace>
// <PropertyGroup>
//-----------------------------------------------------------------------------
System.Type.RegisterNamespace("System.Web.UI");
//=============================================================================

//=============================================================================
// CLASS: System.Web.UI.HtmlControls
//-----------------------------------------------------------------------------
// Make sure that the sub namespace exists.
System.Type.RegisterNamespace("System.Web.UI.HtmlControls");

System.Web.UI.HtmlControls.FindParentElement = function (object, tagName) {
	var doSearch = true;
	var parentItem = System.Web.UI.HtmlControls.FindControl(object);
	var results;
	while (doSearch) {
		parentItem = parentItem.parentNode;
		if (typeof parentItem === "object") {
			if (typeof parentItem.tagName === "string") {
				if (tagName === "document") {
					if (parentItem.tagName === "BODY") {
						results = parentItem.ownerDocument;
						break;
					}
				} else {
					if (parentItem.tagName === tagName) {
						results = parentItem;
						break;
					}
					if (parentItem.tagName === "HTML") break;
				}
			}
		} else {
			doSearch = false;
		}
	}
	return results;
};

// Works on IE
System.Web.UI.HtmlControls.DisableSelect = function (control) {
	if (window.ActiveXObject) {
		control.attachEvent("onselect", System.Web.UI.HtmlControls.DisableSelectHandler);
		control.attachEvent("onselectstart", System.Web.UI.HtmlControls.DisableSelectHandler);
	} else {
		control.addEventListener("select", System.Web.UI.HtmlControls.DisableSelectHandler, true);
		control.addEventListener("selectstart", System.Web.UI.HtmlControls.DisableSelectHandler, true);
	}
};

System.Web.UI.HtmlControls.DisableSelectHandler = function (evt) {
	Trace.Write("System.Web.UI.HtmlControls.DisableSelectHandler" + typeof document.onselectstart);
	evt = evt || window.event;
	if (window.ActiveXObject) {
		evt.returnValue = false;
	} else {
		evt.preventDefault();
	}
	evt.returnValue = false;
	evt.cancelBubble = true;
	return false;
};

// Sample Usage:
//
//var obj1 = document.getElementById('element1');
//var obj2 = document.getElementById('element2');
//function alertElements() {
//    var elements = $('a','b','c',obj1,obj2,'d','e');
//    for (var i=0;i<elements.length;i++ ) {
//        alert(elements[i].id);
//    }
//}
//
// Extended: You can put document to change the target of rest objects.
// var elements = $('a','b','c',obj1,obj2,window.opener.document,'d','e');
// Extended: You can put array with target and id.
// var elements = $('a','b','c',obj1,obj2,[window.opener.document,'d'],'e');
System.Web.UI.HtmlControls.FindControl = function () {
	var elements = [];
	var target = document;
	for (var i = 0; i < arguments.length; i++) {
		var element = arguments[i];
		var isObject = typeof element === "object";
		var isDocument = isObject ? typeof element.body === "object" : false;
		var isArray = isObject ? typeof element.push === "function" : false;
		// If element is document then...
		if (isObject) {
			if (isDocument) {
				target = element;
			} else if (isArray) {
				// Treat element as array[target, id].
				elements.push(element[0].getElementById(element[1]));
			} else {
				elements.push(element);
			}
		} else {
			if (typeof element === 'string') element = target.getElementById(element);
			elements.push(element);
		}
	}
	// Return object or array of objects.
	var results = elements.length === 1 ? elements[0] : elements;
	return results;
};

// add advanced $(...) function.
if (typeof this.$ === "undefined") this.$ = function () {
	return System.Web.UI.HtmlControls.FindControl.apply(this, arguments);
};

//One alternative (and possibly more efficient) way I’ve seen of getting elements by class is to take advantage of XPaths:
System.Web.UI.HtmlControls.FindControlsByClass = function (className, node, tag) {
	var resultArray = [];
	if (window.ActiveXObject) {
		if (node === null) node = document;
		if (tag === null) tag = '*';
		var els = node.getElementsByTagName(tag);
		var elsLen = els.length;
		var pattern = new RegExp("(^|\s)" + className + "(\s|$)");
		var j = 0;
		for (var i = 0; i < elsLen; i++) {
			if (pattern.test(els[i].className)) {
				resultArray[j] = els[i];
				j++;
			}
		}
	} else {
		// faster for FireFox.
		var result = document.evaluate("//*[@class='" + className + "']", document, null, XPathResult.ANY_TYPE, null);
		var element = "";
		while (element === result.iterateNext()) resultArray.push(element);
	}
	return resultArray;
};

// Create function $(...) - Get objects by class name.
if (typeof this.$c === "undefined") this.$c = function () {
	return System.Web.UI.HtmlControls.FindControlsByClass.apply(this, arguments);
};

// Return "document" object of control.
System.Web.UI.HtmlControls.FindTarget = function (object) {
	return System.Web.UI.HtmlControls.FindParentElement(object, "document");
};

System.Web.UI.HtmlControls.TryToFocus = function (element) {
	if (typeof element === "string") element = document.getElementById(element);
	var success = false;
	try {
		element.focus();
		success = true;
	} catch (ex) { /* */ }
	return success;
};


// Get object by event.
System.Web.UI.HtmlControls.GetObjectBy = function (e) {
	return e.srcElement || e.target;
};

//=============================================================================
// Frame
//-----------------------------------------------------------------------------

System.Web.UI.HtmlControls.Frame = function (id, target, name, src, parentObject, scrolling) {
	this.Target;
	this.Node;
	this.Body;
	//parent.FrameMenu.Node.contentWindow.document.body.appendChild(panelLegend.Node);
	//---------------------------------------------------------
	// METHOD: CreateInterface
	//---------------------------------------------------------
	this.CreateInterface = function () {
		var iframe = this.Target.createElement("iframe");
		iframe.frameBorder = 0;
		iframe.id = id;
		iframe.name = name; // Must be same as ID!
		iframe.src = src;
		iframe.scrolling = scrolling;
		iframe.width = "100%";
		iframe.height = "100%";
		var po = null;
		if (typeof parentObject === "string") {
			if (parentObject.length > 0) {
				po = this.Target.getElementById(parentObject);
			}
		} else {
			po = parentObject;
		}
		if (po) po.appendChild(iframe);
		this.Node = iframe;
	};
	//---------------------------------------------------------
	// INIT: Class
	//---------------------------------------------------------
	this.InitializeClass = function () {
		// Set submited values or default values.
		this.Target = target ? target : document;
		// Create Interface.
		this.CreateInterface();
	};
	this.InitializeClass();
};
System.Type.RegisterClass("System.Web.UI.HtmlControls.Frame");

//-----------------------------------------------------------------------------
// METHOD: System.Web.UI.HtmlControls.AddSelectOption
//-----------------------------------------------------------------------------

// Add new <option> to <select> box.
System.Web.UI.HtmlControls.AddSelectOption = function (selectElement, text, value, id, selected, insertAt) {
	selectElement = System.Web.UI.HtmlControls.FindControl(selectElement);
	var target = System.Web.UI.HtmlControls.FindTarget(selectElement);
	var option = target.createElement("option");
	if (id) option.id = id;
	if (window.ActiveXObject) {
		if (typeof insertAt !== "number" || selectElement.childNodes.length === 0) {
			selectElement.options.add(option);
		} else {
			// Insert before.
			selectElement.options.add(option, insertAt);
		}
		option.innerText = text;
		option.value = value;
	} else {
		option.text = text;
		option.value = value;
		if (typeof insertAt !== "number" || selectElement.childNodes.length === 0) {
			selectElement.appendChild(option);
		} else {
			// Insert before.
			var atOption = selectElement.childNodes[insertAt];
			atOption.parentNode.insertBefore(option, atOption);
		}
	}
	// Select option if neccessary.
	if (selected === true) {
		option.selected = "selected";
	}
	return option;
};

//-----------------------------------------------------------------------------
// METHOD: System.Web.UI.HtmlControls.DataBinder
//-----------------------------------------------------------------------------

/// <summary>
/// Allows programmatic access to the HTML <select> element on the server.
/// </summary>
/// <param name="o">object</param>
System.Web.UI.HtmlControls.DataBinder = function () {
	//---------------------------------------------------------
	// Public properties.
	//---------------------------------------------------------
	this.id = "";
	this.Node = null;
	this.DataSource = "";
	this.DataQuery = "";
	this.DataMember = "";
	this.DataTextField = "";
	this.DataValueField = "";
	this.DefaultValue = null;
	this.DefaultText = null;
	//---------------------------------------------------------
	// Private properties.
	//---------------------------------------------------------
	var me = this;
	//---------------------------------------------------------
	// EVENTS: public
	//---------------------------------------------------------
	this.OnInit = null;
	this.OnDataBound = null;
	this.OnError = null;
	//---------------------------------------------------------
	this.RiseEvent = function (e) { if (this[e.Name]) this[e.Name](this, e); };
	//---------------------------------------------------------
	// HANDLER: public onDataReady
	//---------------------------------------------------------
	this.onDataReady = function (sender, e) {
		Trace.Write(me.id + ".OnDataReady(sender, e)");
		var data = e;
		// This must go to separate fnction.
		var nodeType = data.firstChild.nodeName;
		Trace.Write("// " + me.id + " nodeType = '" + nodeType + "'");
		if (nodeType === "string") {
			var pathInformation = "child::*[name()='string']";
			var nodes = data.selectNodes(pathInformation);
			if (nodes.length > 0) {
				var node = System.Xml.Node.parseString(nodes[0].selectSingleNode("text()"));
				me.Node.innerHTML = node;
			}
		}
		if (nodeType === "DataSet" || nodeType === "xml") {
			if (data === null) {
				Trace.Write("error: Web Service returned non dataset object.");
			} else {
				var xmlShema = data.selectNodes(System.Xml.PathToShema);
				var xmlData = data.selectNodes(System.Xml.PathToDataDiff);
				var dataSet = xmlData[0].selectNodes("child::*");
				var dataSetName = "";
				// If dataset exists...
				if (dataSet.length > 0) {
					dataSetName = dataSet[0].nodeName;
					var tables = xmlData[0].selectNodes("child::*");
					var tableName = "";
					// If table exists...
					if (tables.length > 0) {
						tableName = tables[0].nodeName;
						me.DataMember = me.DataMember ? me.DataMember : tableName;
						var pathItems = "child::*[name()='" + dataSetName + "']/child::*[name()='" + me.DataMember + "']";
						var items = xmlData[0].selectNodes(pathItems);
						Trace.Write(pathItems);
						Trace.Write("// " + me.id + " items.length:" + items.length);
						// Remove all current items.
						while (me.Node.firstChild) {
							me.Node.removeChild(me.Node.firstChild);
						}
						// Reset Style
						me.Node.style.color = "";
						// Route thru items...
						for (var i = 0; i < items.length; i++) {
							var text = System.Xml.Node.parseString(items[i].selectSingleNode(me.DataTextField + "/text()"));
							var value = System.Xml.Node.parseString(items[i].selectSingleNode(me.DataValueField + "/text()"));
							// Add them to select.
							var selectItem = false;
							if (me.DefaultText === text) selectItem = true;
							if (me.DefaultValue === value) selectItem = true;
							System.Web.UI.HtmlControls.AddSelectOption(me.Node, text, value, null, selectItem);
						}
						var e1 = new System.EventArgs("OnDataBound");
						e1["Data"] = data;
						e1["Items"] = items;
						me.RiseEvent(e1);
					} else {
						var e2 = new System.EventArgs("OnError");
						e2["Message"] = "DataSet does not contain tables";
						me.RiseEvent(e2);
					}
				} else {
					var e3 = new System.EventArgs("OnError");
					e3["Message"] = "DataSet is empty";
					me.RiseEvent(e3);
				}
			}
		}
	};
	//---------------------------------------------------------
	// METHOD: DataBind
	//---------------------------------------------------------
	this.DataBind = function () {
		// Remove all current items.
		while (this.Node.firstChild) {
			this.Node.removeChild(this.Node.firstChild);
		}
		Trace.Write("call " + this.id + ".DataBind()");
		if (typeof this.DataSource === "string") {
			// Look if this is webservice.
			var optionNode = System.Web.UI.HtmlControls.AddSelectOption(this.Node, "Loading...", "", null, false);
			this.Node.style.color = "#808080";
			var httpRequest = new System.Web.HttpRequest();
			httpRequest.UniqueId = "wsr" + this.id;
			httpRequest.OnDataReady = this.onDataReady;
			httpRequest.Send(this.DataSource, this.DataQuery);

		} else {
			// Route thru items of datasource object...
			for (property in this.DataSource) {
				var text = this.DataTextField === "Type.Name" ? property : this.DataSource[property][this.DataTextField];
				var value = this.DataValueField === "Type.Name" ? property : this.DataSource[property][this.DataValueField];
				System.Web.UI.HtmlControls.AddSelectOption(this.Node, text, value, null, false);
			}
			this.RiseEvent("OnDataBound");
		}
	};
	//---------------------------------------------------------
	// INIT: Class
	//---------------------------------------------------------
	this.InitializeClass = function () {
		var id = arguments[0];
		this.Node = System.Web.UI.HtmlControls.FindControl(arguments[1]);
		this.DataSource = arguments[2];
		this.DataTextField = arguments[3];
		this.DataValueField = arguments[4];
		// Set submited values or default values.
		this.id = id ? id : null;
		// Rise init event.
		this.RiseEvent(new System.EventArgs("OnInit"));
	};
	this.InitializeClass.apply(this, arguments);
};
System.Type.RegisterClass("System.Web.UI.HtmlControls.DataBinder");

//-----------------------------------------------------------------------------
// Enumeration: Interface.CheckState
//-----------------------------------------------------------------------------

// Make sure that the sub namespace exists.
System.Web.UI.HtmlControls._CheckState = function () {
	this.Checked = 0;
	this.Unchecked = 1;
	this.Indeterminate = 2;
};

System.Web.UI.HtmlControls.CheckState = new System.Web.UI.HtmlControls._CheckState();

//-----------------------------------------------------------------------------
// Enumeration: Interface.Events
//-----------------------------------------------------------------------------

// Make sure that the sub namespace exists.
System.Web.UI.HtmlControls.Events = System.Web.UI.HtmlControls.CheckState ? System.Web.UI.HtmlControls.CheckState : {};
System.Web.UI.HtmlControls._Events = function () {
	this.InitializeClass = 0;
	this.Show = 1;
	this.Hide = 2;
};

System.Web.UI.HtmlControls.Events = new System.Web.UI.HtmlControls._Events;

// Get nextId of object by Name.
System.Web.UI.HtmlControls.GetNextId = function (valName) {
	var IsObject = true;
	var nextId = "";
	for (var i = 1; IsObject; i++) {
		nextId = valName + i;
		var htmlObject = document.getElementById(nextId);
		if (htmlObject === null) {
			// It means that this nextId is available.
			IsObject = false;
		}
	}
	return nextId;
};

//-----------------------------------------------------------------------------
// Constructor: Interface.HtmlElementContructor
//-----------------------------------------------------------------------------

System.Web.UI.HtmlControls.HtmlElementContructor = function (valId, valTarget) {
	// Declare type of this class.
	this.Node;
	this.Target;
	this.State;
	this.Name = "HtmlElementContructor";
	this.OnPropertyChange;
	this.CloseMode = "Dispose"; // or "Hide".
	this.HideMode = "Display"; // or "Move";
	this.HideParameters = {};
	this.IsHidden = false;
	//---------------------------------------------------------
	// METHOD: _riseEvent()
	//---------------------------------------------------------
	this._riseEvent = function (name, e) {
		var e2 = new System.EventArgs(name);
		this.OnEvent(this, e2);
	};
	//---------------------------------------------------------
	// METHOD: OnEvent()
	//---------------------------------------------------------
	this.OnEvent = function (sender, e) {
		if (this.OnPropertyChange) {
			if (typeof e === "string") e = new System.EventArgs(e);
			this.OnPropertyChange(sender, e);
		}
	};
	//---------------------------------------------------------
	// PROPERY: setEnabled
	//---------------------------------------------------------
	this.setEnabled = function (isEnabled) {
		if (isEnabled) {
			this.Enable();
		} else {
			this.Disable();
		}
	};
	//---------------------------------------------------------
	// METHOD: Enable()
	//---------------------------------------------------------
	this.Enable = function () {
		this.Enabled = true;
		if (browser.IsIE) {
			this.Node.style.filter = "alpha(opacity = 100);";
		} else {
			this.Node.style.MozOpacity = 1;
		}
		this._riseEvent("OnEnable");
	};
	//---------------------------------------------------------
	// METHOD: Disable()
	//---------------------------------------------------------
	this.Disable = function () {
		this.Enabled = false;
		if (browser.IsIE) {
			this.Node.style.filter = "alpha(opacity = 25);";
		} else {
			this.Node.style.MozOpacity = 0.25;
		}
		this._riseEvent("OnDisable");
	};
	//---------------------------------------------------------
	// METHOD: Close()
	//---------------------------------------------------------
	this.Close = function () {
		// run function.
		this[this.CloseMode]();
	};
	//---------------------------------------------------------
	// METHOD: Show()
	//---------------------------------------------------------
	this.Show = function () {
		if (this.HideMode === "Display") {
			this.Node.style.display = "";
		} else {
			// restore current options.
			this.Node.style.top = this.HideParameters.Top;
			this.Node.style.left = this.HideParameters.Left;
			this.Node.style.position = this.HideParameters.Position;
		}
		this.IsHidden = false;
		this.OnEvent(this, "OnShow");
	};
	//---------------------------------------------------------
	// METHOD: Hide()
	//---------------------------------------------------------
	this.Hide = function () {
		if (this.HideMode === "Display") {
			this.Node.style.display = "none";
		} else {
			// If object is not hidden then...
			if (this.IsHidden !== true) {
				// Store current options.
				this.HideParameters["Position"] = this.Node.style.position;
				this.HideParameters["Top"] = this.Node.style.top;
				this.HideParameters["Left"] = this.Node.style.left;
			}
			// Move out.
			this.Node.style.position = "absolute";
			this.Node.style.top = "-2000px";
			this.Node.style.left = "-2000px";
		}
		this.IsHidden = true;
		this._riseEvent("OnHide");
	};
	//---------------------------------------------------------
	// METHOD: CreateInterface()
	//---------------------------------------------------------
	this.toString = function () {
		//this._riseEvent("OnToString");
		return this.GetType().Name;
	};
	//---------------------------------------------------------
	// DISPOSE: Dispose class.
	//---------------------------------------------------------
	this.Dispose = function () {
		if (this.Node) {
			this.Node.parentNode.removeChild(this.Node);
		}
	};
	//---------------------------------------------------------
	// INIT: Events
	//---------------------------------------------------------
	this.InitializeEvents = function (valObject) {
	};
	//---------------------------------------------------------
	// INIT: Interface
	//---------------------------------------------------------
	this.CreateInterface = function () {
		this._riseEvent("OnCreateInterface");
	};
	//---------------------------------------------------------
	// METHOD: GetNextId()
	//---------------------------------------------------------
	this.GetNextId = function () {
		var name = this.GetType().Name ? this.GetType().Name.replace(".", "_", "g") : this.Name;
		return System.Web.UI.HtmlControls.GetNextId(name);
	};
	//---------------------------------------------------------
	// INIT: Class
	//---------------------------------------------------------
	this.InitializeClass = function () {
		this.Enabled = true;
		// Set submited values or default values.
		this.Target = valTarget ? valTarget : document;
		this.id = valId ? valId : this.GetNextId();
		// Create HTML Object.
		this.CreateInterface();
		// Init all events;
		this.InitializeEvents(this);
	};
	this.InitializeClass();
};
System.Type.RegisterClass("System.Web.UI.HtmlControls.HtmlElementContructor");

// Create PopUp Window(Tables, Buttons)
System.Web.UI.HtmlControls.Mover = function (id, target, headNode, bodyNode) {
	this.Target;
	this.Name = "Mover";
	this.HeadNode;
	this.BodyNode;
	this.CoverFront;
	this.CoverBack;
	this.CoverBackExist = false;
	this.CoverInfo;
	this.ShowInfo = false;
	this.EffectsEnabled = false;
	this.RestoreZIndex = false;
	var me = this;
	//---------------------------------------------------------
	// SCRUCT: Settings
	//---------------------------------------------------------
	this.Settings = {
		// Store z-index of BodyNode.
		zIndex: null
	};
	//---------------------------------------------------------
	// HANDLER: public OnSelectStart
	//---------------------------------------------------------
	this.OnSelectStart = function (evt) {
		// System.Web.UI.HtmlControls.Mover.OnSelectStart
		if (window.ActiveXObject) {
			window.event.returnValue = false;
		} else {
			evt.preventDefault();
		}
		return false;
	};
	//---------------------------------------------------------
	// HANDLER: public OnMouseDown
	//---------------------------------------------------------
	this.OnMouseDown = function (evt) {
		evt = evt || window.event;
		var sender = evt.target ? evt.target : evt.srcElement;
		// If back cover does not exist then...
		if (!me.CoverBackExist) {
			me.BodyNode.parentNode.appendChild(me.CoverBack);
			me.CoverBackExist = true;
		}
		//Trace.Write("this.OnMouseDown() // sender[tagName='"+sender.tagName+"'] = "+(sender == me.HeadNode));
		if (me.RestoreZIndex) me.Settings.zIndex = me.BodyNode.style.zIndex;
		// Increase global zIndex;
		me.Target.MoverGlobalZIndex += 1;
		me.BodyNode.style.zIndex = me.Target.MoverGlobalZIndex;
		me.CoverFront.style.display = "block";
		me.CoverBack.style.display = "block";
		me.CoverInfo.style.display = me.ShowInfo ? "inline" : "none";
		// find the moving part (position:absolute or class="VEPart")
		if (me.BodyNode !== null) {
			// calculate mousepointer-object distance
			me.BodyNode.x = me.BodyNode.y = 0;
			obj = me.BodyNode;
			while (obj !== null) {
				me.BodyNode.x += obj.offsetLeft;
				me.BodyNode.y += obj.offsetTop;
				obj = obj.offsetParent;
			} // while
			me.BodyNode.x = evt.clientX - me.BodyNode.x;
			me.BodyNode.y = evt.clientY - me.BodyNode.y;
			me.CoverFront.x = me.BodyNode.x;
			me.CoverFront.y = me.BodyNode.y;
			// make the moving object globally evailable when mouse is leaving this object.
			if (window.ActiveXObject) {
				me.Target.attachEvent("onselect", me.OnSelectStart);
				me.Target.attachEvent("onselectstart", me.OnSelectStart);
				me.Target.attachEvent("onmousemove", me.OnMouseMove);
				me.Target.attachEvent("onmouseup", me.OnMouseUp);
				if (this.EffectsEnabled) { me.BodyNode.style.filter = "alpha(opacity = 80);"; }
			} else {
				me.Target.addEventListener("select", me.OnSelectStart, true);
				me.Target.addEventListener("selectstart", me.OnSelectStart, true);
				me.Target.addEventListener("mousemove", me.OnMouseMove, true);
				me.Target.addEventListener("mouseup", me.OnMouseUp, true);
				if (this.EffectsEnabled) { me.BodyNode.style.MozOpacity = 0.80; }
			}
			evt.returnValue = false;
			evt.cancelBubble = true;
		}
		return false;
	};
	//---------------------------------------------------------
	// HANDLER: public OnMouseMove
	//---------------------------------------------------------
	this.OnMouseMove = function (evt) {
		//Trace.Write("move");
		evt = evt || window.event;
		var x = evt.clientX - me.BodyNode.x + "px";
		if (x !== me.BodyNode.style.left) { me.BodyNode.style.left = x; }
		var y = evt.clientY - me.BodyNode.y + "px";
		if (y !== me.BodyNode.style.top) { me.BodyNode.style.top = y; }
		if (me.ShowInfo) { me.CoverInfo.innerHTML = "[" + x + "," + y + "]"; }
		// cancel selecting anything
		evt.cancelBubble = true;
		evt.returnValue = false;
		return false;
	};
	//---------------------------------------------------------
	// HANDLER: public OnMouseUp
	//---------------------------------------------------------
	this.OnMouseUp = function (evt) {
		evt = evt || window.event;
		var sender = evt.target ? evt.target : evt.srcElement;
		//Trace.Write("this.OnMouseUp()");
		me.CoverFront.style.display = "none";
		me.CoverBack.style.display = "none";
		if (me.RestoreZIndex) me.BodyNode.style.zIndex = me.Settings.zIndex;
		if (window.ActiveXObject) {
			me.Target.detachEvent("onselect", me.OnSelectStart);
			me.Target.detachEvent("onselectstart", me.OnSelectStart);
			me.Target.detachEvent("onmousemove", me.OnMouseMove);
			me.Target.detachEvent("onmouseup", me.OnMouseUp);
			if (this.EffectsEnabled) { me.BodyNode.style.filter = "alpha(opacity = 100);"; }
		} else {
			me.Target.removeEventListener("select", me.OnSelectStart, true);
			me.Target.removeEventListener("selectstart", me.OnSelectStart, true);
			me.Target.removeEventListener("mousemove", me.OnMouseMove, true);
			me.Target.removeEventListener("mouseup", me.OnMouseUp, true);
			if (this.EffectsEnabled) { me.BodyNode.style.MozOpacity = 1; }
		}
		return false;
	};
	//---------------------------------------------------------
	// INIT: Events
	//---------------------------------------------------------
	this.InitializeEvents = function (sender) {
		// Make the moving object globally evailable when mouse is leaving this object.
		if (window.ActiveXObject) {
			//sender.Target.attachEvent("onmousemove",sender.OnMouseMove);
			//sender.Target.attachEvent("onmouseup",sender.OnMouseUp);
			sender.HeadNode.attachEvent("onmousedown", sender.OnMouseDown);
		} else {
			//sender.Target.addEventListener("mousemove", sender.OnMouseMove, true);
			//sender.Target.addEventListener("mouseup", sender.OnMouseUp, true);
			sender.HeadNode.addEventListener("mousedown", sender.OnMouseDown, true);
		}
	};
	//---------------------------------------------------------
	// PROPERY: getCover
	//---------------------------------------------------------
	this.getCover = function () {
		var div = this.Target.createElement("div");
		div.style.backgroundColor = "transparent"; // transparent
		div.style.position = "absolute";
		div.style.margin = "0";
		div.style.padding = "0";
		div.style.overfolw = "hidden";
		div.style.display = "none";
		div.style.width = "100%";
		div.style.height = "100%";
		return div;
	};
	//---------------------------------------------------------
	// METHOD: CreateInterface
	//---------------------------------------------------------
	this.CreateInterface = function () {
		// Remove old elements if they exist;
		if (this.CoverInfo) this.CoverInfo.removeNode();
		if (this.CoverFront) this.CoverFront.removeNode();
		if (this.CoverBack) this.CoverBack.removeNode();
		// Create CoverFront
		me.CoverFront = this.getCover();
		me.CoverFront.style.zIndex = 1001;
		var child = me.BodyNode.firstChild;
		if (child === null) {
			me.BodyNode.appendChild(me.CoverFront);
		} else {
			child.parentNode.insertBefore(me.CoverFront, child);
		}
		// Create CoverInfo
		me.CoverInfo = me.Target.createElement("span");
		me.CoverInfo.style.fontFamily = "Tahoma";
		me.CoverInfo.style.fontSize = "8pt";
		me.CoverInfo.style.padding = "2pt";
		me.CoverInfo.style.position = "relative";
		me.CoverInfo.style.border = "solid 1px black";
		me.CoverInfo.style.backgroundColor = "white";
		if (window.ActiveXObject) {
			me.CoverInfo.style.whiteSpace = "nowrap";
			me.CoverInfo.style.top = "8px";
			me.CoverInfo.style.left = "4px";
			me.CoverInfo.style.filter = "alpha(opacity = 50);";
		} else {
			me.CoverInfo.style.top = "-20px";
			me.CoverInfo.style.left = "0";
			me.CoverInfo.style.MozOpacity = 0.50;
		}
		me.CoverFront.appendChild(me.CoverInfo);
		// Create CoverBack
		me.CoverBack = this.getCover();
		me.CoverBack.style.zIndex = 999;
		me.CoverBack.style.top = 0;
		me.CoverBack.style.left = 0;
		// Fix height for XML documents.
		if (window.ActiveXObject) { me.CoverBack.style.height = me.Target.documentElement.offsetHeight - 20 + "px"; }
	};
	//---------------------------------------------------------
	// INIT: Class
	//---------------------------------------------------------
	this.InitializeClass = function () {
		// Set submited values or default values.
		this.Target = target ? target : document;
		this.Target["MoverGlobalZIndex"] = this.Target.MoverGlobalZIndex ? this.Target.MoverGlobalZIndex : 1000;
		this.id = id ? id : this.GetNextId();
		this.HeadNode = headNode;
		this.BodyNode = bodyNode;
		if (typeof headNode !== "undefined" && typeof bodyNode !== "undefined") {
			this.CreateInterface();
			// Init all events;
			me.InitializeEvents(me);
		}
	};
	this.InitializeClass();

};

// Inherit Class.
System.Class.Inherit(System.Web.UI.HtmlControls.Mover, System.Web.UI.HtmlControls.HtmlElementContructor);



//-----------------------------------------------------------------------------
// CLASS: Docker
//-----------------------------------------------------------------------------
// Gets or sets which control borders are docked to its
// parent control and determines how a control is resized
// with its parent.

// Create PopUp Window(Tables, Buttons)
System.Web.UI.HtmlControls.Docker = function (id, target, bodyNode) {
	this.Target;
	this.Name = "Docker";
	//---------------------------------------------------------
	// PROPERTY: Docker
	//---------------------------------------------------------
	// dockStyle: Fill, Top, Right, Bottom, Left
	this.setDock = function (dockStyle) {
		switch (dockStyle) {
			case "Top":
				bodyNode.style.top = "0";
				bodyNode.style.left = "0";
				break;
			default:
		}
	};
	//---------------------------------------------------------
	// PROPERTY: Autohide
	//---------------------------------------------------------
	// dockStyle: Fill, Top, Right, Bottom, Left
	this.setAutoHide = function (enable) {
		// Item can dissapear to docked side.
	};
	//---------------------------------------------------------
	// INIT: Class
	//---------------------------------------------------------
	this.InitializeClass = function () {
		// Set submited values or default values.
		this.Target = target ? target : document;
		this.id = id ? id : this.GetNextId();
		this.BodyNode = bodyNode;
		if (typeof bodyNode !== "undefined") {
			this.InitializeInterface(this, null);
			// Init all events;
			this.InitializeEvents(this, null);
		}
	};
	this.InitializeClass();
};
System.Type.RegisterClass("System.Web.UI.HtmlControls.Docker");

//-----------------------------------------------------------------------------
// CLASS: Sizer
//-----------------------------------------------------------------------------

/* DISCLAIMER:
You may use this script as long as this disclaimer is remained.
200x-mm-yy Generic Resize by Erik Arvidsson http://webfx.eae.net/
2006-06-09 Recreated and extended as class by Evaldas Jocys <evaldas@jocys.com>

JavaScript Example:
// Get HTML element.
var div2 = document.getElementById("div2");
// Create Sizer class and bind html element to it;
var sizer2 = new System.Web.UI.HtmlControls.Sizer("",document,div2);
*/



System.Web.UI.HtmlControls.Sizer = function (id, target, bodyNode) {
	this.id;
	this.Target;
	this.Name = "Mover";
	this.BodyNode;
	this.CoverFront;
	this.CoverBack;
	this.CoverBackExist = false;
	this.CoverInfo;
	this.MinWidth = 8; // The smallest width possible.
	this.MinHeight = 8; // The smallest height  possible.
	this.ShowInfo = false;
	var me = this;
	//---------------------------------------------------------
	// SCRUCT: Settings
	//---------------------------------------------------------
	this.Settings = {
		// Type of current resize (n, s, e, w, ne, nw, se, sw)
		dir: "",
		//Some other useful values.
		grabx: null,
		graby: null,
		width: null,
		height: null,
		left: null,
		zIndex: null,
		top: null
	};
	//---------------------------------------------------------
	// HANDLER: public OnMouseDown
	//---------------------------------------------------------
	this.OnMouseDown = function (evt) {
		evt = evt || window.event;
		var sender = evt.target ? evt.target : evt.srcElement;
		me.Settings.dir = me.getDirection(evt);
		if (me.Settings.dir !== "") {
			// If back cover does not exist then...
			if (!me.CoverBackExist) {
				me.BodyNode.parentNode.appendChild(me.CoverBack);
				me.CoverBackExist = true;
			}
			//Trace.Write("Store Settings");
			me.Target.onselectstart = me.OnSelectStart;
			if (window.ActiveXObject) {
				//me.Target.attachEvent("onselectstart",me.OnSelectStart);
				me.Target.attachEvent("onmousemove", me.OnMouseMove);
				me.Target.attachEvent("onmouseup", me.OnMouseUp);
				if (this.EffectsEnabled) { me.BodyNode.style.filter = "alpha(opacity = 80);"; }
			} else {
				//me.Target.addEventListener("selectstart", me.OnSelectStart, true);
				me.Target.addEventListener("mousemove", me.OnMouseMove, true);
				me.Target.addEventListener("mouseup", me.OnMouseUp, true);
				if (this.EffectsEnabled) { me.BodyNode.style.MozOpacity = 0.80; }
			}
			me.Settings.zIndex = me.BodyNode.style.zIndex;
			me.BodyNode.style.zIndex = 1000;
			me.CoverFront.style.display = "block";
			me.CoverBack.style.display = "block";
			me.CoverInfo.style.display = me.ShowInfo ? "inline" : "none";
			me.Settings.grabx = evt.clientX;
			me.Settings.graby = evt.clientY;
			me.Settings.width = me.BodyNode.offsetWidth;
			me.Settings.height = me.BodyNode.offsetHeight;
			me.Settings.left = me.BodyNode.offsetLeft;
			me.Settings.top = me.BodyNode.offsetTop;
			evt.returnValue = false;
			evt.cancelBubble = true;
		}
	};
	//---------------------------------------------------------
	// HANDLER: public OnMouseMoveBody
	//---------------------------------------------------------
	this.OnMouseMoveBody = function (evt) {
		//Trace.Write("this.OnMouseMoveBody");
		evt = evt || window.event;
		str = me.getDirection(evt);
		// Fix the cursor.
		if (str === "") {
			str = "default";
		} else {
			str += "-resize";
		}
		me.BodyNode.style.cursor = str;
	};
	//---------------------------------------------------------
	// HANDLER: public OnMouseMove
	//---------------------------------------------------------
	this.OnMouseMove = function (evt) {
		evt = evt || window.event;
		var sender = evt.target ? evt.target : evt.srcElement;
		var xPos, yPos, str;
		//Trace.Write("Direction: "+me.Settings.dir);
		if (me.Settings.dir.indexOf("e") !== -1) {
			me.BodyNode.style.width = Math.max(me.MinWidth, me.Settings.width + evt.clientX - me.Settings.grabx) + "px";
		}
		if (me.Settings.dir.indexOf("s") !== -1) {
			me.BodyNode.style.height = Math.max(me.MinHeight, me.Settings.height + evt.clientY - me.Settings.graby) + "px";
		}
		if (me.Settings.dir.indexOf("w") !== -1) {
			me.BodyNode.style.left = Math.min(me.Settings.left + evt.clientX - me.Settings.grabx, me.Settings.left + me.Settings.width - me.MinWidth) + "px";
			me.BodyNode.style.width = Math.max(me.MinWidth, me.Settings.width - evt.clientX + me.Settings.grabx) + "px";
		}
		if (me.Settings.dir.indexOf("n") !== -1) {
			me.BodyNode.style.top = Math.min(me.Settings.top + evt.clientY - me.Settings.graby, me.Settings.top + me.Settings.height - me.MinHeight) + "px";
			me.BodyNode.style.height = Math.max(me.MinHeight, me.Settings.height - evt.clientY + me.Settings.graby) + "px";
		}
		if (me.ShowInfo) me.CoverInfo.innerHTML = "[" + me.BodyNode.style.top + "," + me.BodyNode.style.left + "][" + me.BodyNode.style.width + "," + me.BodyNode.style.height + "]";
		evt.returnValue = false;
		evt.cancelBubble = true;
	};
	//---------------------------------------------------------
	// HANDLER: public OnSelectStart
	//---------------------------------------------------------
	this.OnSelectStart = function () {
		return false;
	};
	//---------------------------------------------------------
	// HANDLER: public OnMouseUp
	//---------------------------------------------------------
	this.OnMouseUp = function (evt) {
		evt = evt || window.event;
		var sender = evt.target ? evt.target : evt.srcElement;
		// Enable select.
		me.Target.onselectstart = new Function("return false");
		//Trace.Write("Reset Settings");
		me.CoverFront.style.display = "none";
		me.CoverBack.style.display = "none";
		me.BodyNode.style.zIndex = me.Settings.zIndex;
		if (window.ActiveXObject) {
			me.Target.detachEvent("onmousemove", me.OnMouseMove);
			me.Target.detachEvent("onmouseup", me.OnMouseUp);
			me.Target.detachEvent("onselectstart", me.OnSelectStart);
			if (this.EffectsEnabled) { me.BodyNode.style.filter = "alpha(opacity = 100);"; }
		} else {
			me.Target.removeEventListener("mousemove", me.OnMouseMove, true);
			me.Target.removeEventListener("mouseup", me.OnMouseUp, true);
			me.Target.removeEventListener("selectstart", me.OnSelectStart, true);
			if (this.EffectsEnabled) { me.BodyNode.style.MozOpacity = 1; }
		}
	};
	//---------------------------------------------------------
	// INIT: Events
	//---------------------------------------------------------
	this.InitializeEvents = function (sender) {
		// Make the moving object globally evailable when mouse is leaving this object.
		if (window.ActiveXObject) {
			this.BodyNode.attachEvent("onmousedown", sender.OnMouseDown);
			this.BodyNode.attachEvent("onmousemove", sender.OnMouseMoveBody);
		} else {
			this.BodyNode.addEventListener("mousedown", sender.OnMouseDown, true);
			this.BodyNode.addEventListener("mousemove", sender.OnMouseMoveBody, true);
		}
	};
	//---------------------------------------------------------
	// PROPERTY: getDirection
	//---------------------------------------------------------
	//Find out what kind of resize! Return a string inlcluding the directions
	this.getDirection = function (evt) {
		evt = evt || window.event;
		var xPos, yPos, offset, dir;
		dir = "";
		//Trace.Write(evt.clientX);
		// Retrieves the coordinate of the mouse pointer's position relative to the object firing the event.
		xPos = evt.clientX - me.BodyNode.offsetLeft;
		yPos = evt.clientY - me.BodyNode.offsetTop;
		// Fixed by Evaldas Jocys <evaldas@jocys.com>
		//The distance from the edge in pixels
		offset = 8;
		if (yPos < offset) dir += "n";
		else if (yPos > me.BodyNode.offsetHeight - offset) dir += "s";
		if (xPos < offset) dir += "w";
		else if (xPos > me.BodyNode.offsetWidth - offset) dir += "e";
		//document.body.insertAdjacentHTML("afterBegin", xPos + " - " + yPos + " - " + dir + " - " + window.event.srcElement.id + " - " + el.id + ": " + el.offsetLeft + "<br>" );
		return dir;
	};
	//---------------------------------------------------------
	// PROPERY: getCover
	//---------------------------------------------------------
	this.getCover = function () {
		div = this.Target.createElement("div");
		div.style.backgroundColor = "transparent";
		div.style.position = "absolute";
		div.style.margin = "0";
		div.style.padding = "0";
		div.style.overfolw = "hidden";
		div.style.display = "none";
		div.style.width = "100%";
		div.style.height = "100%";
		return div;
	};
	//---------------------------------------------------------
	// METHOD: CreateInterface
	//---------------------------------------------------------
	this.CreateInterface = function () {
		// Remove old elements if they exist;
		if (this.CoverInfo) this.CoverInfo.removeNode();
		if (this.CoverFront) this.CoverFront.removeNode();
		if (this.CoverBack) this.CoverBack.removeNode();
		// Create CoverFront
		me.CoverFront = this.getCover();
		me.CoverFront.style.zIndex = 1001;
		var child = me.BodyNode.firstChild;
		if (child === null) {
			me.BodyNode.appendChild(me.CoverFront);
		} else {
			child.parentNode.insertBefore(me.CoverFront, child);
		}
		// Create CoverInfo
		me.CoverInfo = me.Target.createElement("span");
		me.CoverInfo.style.fontFamily = "Tahoma";
		me.CoverInfo.style.fontSize = "8pt";
		me.CoverInfo.style.padding = "2pt";
		me.CoverInfo.style.position = "relative";
		me.CoverInfo.style.border = "solid 1px black";
		me.CoverInfo.style.backgroundColor = "white";
		if (window.ActiveXObject) {
			me.CoverInfo.style.whiteSpace = "nowrap";
			me.CoverInfo.style.top = "8px";
			me.CoverInfo.style.left = "4px";
			me.CoverInfo.style.filter = "alpha(opacity = 50);";
		} else {
			me.CoverInfo.style.top = "-20px";
			me.CoverInfo.style.left = "0";
			me.CoverInfo.style.MozOpacity = 0.50;
		}
		me.CoverFront.appendChild(me.CoverInfo);
		// Create CoverBack
		me.CoverBack = this.getCover();
		me.CoverBack.style.zIndex = 999;
		me.CoverBack.style.top = 0;
		me.CoverBack.style.left = 0;
		// Fix height for XML documents on IE.
		if (window.ActiveXObject) { me.CoverBack.style.height = me.Target.documentElement.offsetHeight - 20 + "px"; }
	};
	//---------------------------------------------------------
	// INIT: Class
	//---------------------------------------------------------
	this.InitializeClass = function () {
		// Set submited values or default values.
		this.Target = target ? target : document;
		this.id = id ? id : this.GetNextId();
		this.BodyNode = bodyNode;
		if (typeof bodyNode !== "undefined") {
			this.CreateInterface();
			// Init all events;
			me.InitializeEvents(me);
		}
	};
	this.InitializeClass();
};

// Inherit Class.
System.Class.Inherit(System.Web.UI.HtmlControls.Sizer, System.Web.UI.HtmlControls.HtmlElementContructor);

System.Web.UI.HtmlControls.ResizeWindowBy = function (control, target) {
	/// <summary>
	/// Resize window by HTML control.
	/// </summary>
	/// <param type="xml" name="control">Control to get size from</param>
	var node = typeof control === "string" ? document.getElementById(control) : control;
	var doc = target ? target : document;
	var mtow = node.offsetWidth;
	var mtoh = node.offsetHeight;
	var dbow = doc.body.offsetWidth;
	var dboh = doc.body.offsetHeight;
	var dw = mtow - dbow;
	var dh = mtoh - dboh;
	var message = "control[" + mtow + ":" + mtoh + "]; body[" + dbow + ":" + dboh + "]; d=[" + dw + ":" + dh + "];";
	//alert(message);
	//Trace.Write(message);
	var win = parent ? parent : window;
	var ieCorrection = window.ActiveXObject ? -2 : 0;
	win.resizeBy(dw, dh + ieCorrection);
};

//-----------------------------------------------------------------------------
// CLASS: Aligner
//-----------------------------------------------------------------------------

// Create PopUp Window(Tables, Buttons)
System.Web.UI.HtmlControls.Aligner = function (id, object) {
	this.Target;
	this.Object;
	this.TopNode;
	var me = this;
	//---------------------------------------------------------
	// STRUCT: Settings
	//---------------------------------------------------------
	this.Settings = {
		x: 0,
		y: 0,
		w: 0,
		h: 0,
		maxW: 0,
		maxH: 0
	};
	//---------------------------------------------------------
	// PROPERTY: getType()
	//---------------------------------------------------------
	this.GetType = function () {
		var objectType = "unknown";
		if (typeof this.Object === "object") {
			if (typeof this.Object.screen === "object") objectType = "window";
			if (typeof this.Object.childNodes === "object") objectType = "node";
		}
		return objectType;
	};
	//---------------------------------------------------------
	// METHOD: SizeTo
	//---------------------------------------------------------
	this.SizeTo = function (w, h) {
		//		// Calculate Width.
		//		if (W.substr(W.length-1,1).toString() == "%"){
		//			W = W.replace("%","");
		//			W = parseInt(W) * screen.width / 100;
		//			W = parseInt(W);
		//		}
		//		// Calculate height.
		//		var H = new String(valHeight);
		//		if (H.substr(H.length-1,1) == "%"){
		//			H = H.replace("%","");
		//			H = parseInt(W) * screen.height / 100;
		//			H = parseInt(H);
		//		}
	};
	//---------------------------------------------------------
	// METHOD: MoveTo
	//---------------------------------------------------------
	this.MoveTo = function (x, y) {
		// Get Information.
		if (this.GetType() === "node") {
			this.Settings.x = this.Object.offsetLeft;
			this.Settings.y = this.Object.offsetTop;
			this.Settings.w = this.Object.offsetWidth;
			this.Settings.h = this.Object.offsetHeight;
			// Get parent.
			this.TopNode = this.Object;
			for (var i = 0; i < 20; i++) {
				if ("BODY HTML".indexOf(this.TopNode.tagName.toUpperCase()) > -1) {
					break;
				}
				this.TopNode = this.TopNode.parentNode;
			}
			Trace.Write("TopNode = " + this.TopNode.tagName);
			this.Settings.maxW = this.TopNode.offsetWidth;
			this.Settings.maxH = this.TopNode.offsetHeight;
		}
		if (this.GetType() === "window") {
			this.Settings.maxW = this.Object.screen.availWidth;
			this.Settings.maxH = this.Object.screen.availHeight;
			if (window.ActiveXObject) {
				this.Settings.x = this.Object.dialogLeft;
				this.Settings.y = this.Object.dialogTop;
				this.Settings.w = this.Object.dialogWidth;
				this.Settings.h = this.Object.dialogHeight;
			} else {
				this.Settings.x = this.Object.screenX;
				this.Settings.y = this.Object.screenY;
				this.Settings.w = this.Object.outerWidth;
				this.Settings.h = this.Object.outerHeight;
			}

		}
		Trace.Write("Type = '" + this.GetType() + "'");
		Trace.Write("X: " + this.Settings.x + "; Y; " + this.Settings.y + "");
		Trace.Write("W: " + this.Settings.w + "; H; " + this.Settings.h + "");
		Trace.Write("maxW: " + this.Settings.maxW + "; maxH; " + this.Settings.maxH + "");
		// Calculate new position
		var newX = this.GetPosition(x, this.Settings.maxW);
		var newY = this.GetPosition(y, this.Settings.maxH);
		Trace.Write("newX: " + newX + "; newY; " + newY);
		if (this.GetType() === "node") {
			this.Object.style.left = newX + "px";
			this.Object.style.top = newY + "px";
		}
		if (this.GetType() === "window") {
			var difX = newX - this.Settings.x;
			var difY = newY - this.Settings.y;
			this.Object.moveTo(0, 0);
			this.Object.moveBy(newX, newY);
		}
	};
	//---------------------------------------------------------
	// METHOD: GetPosition
	//---------------------------------------------------------
	this.GetPosition = function (value, maximum) {
		// Calculate horizontal position.
		var position = 0;
		if (typeof value === "number") {
			// Plain number.
			position = value;
		} else if (value.indexOf("px") > -1) {
			// Get by pixels.
			position = parseInt(value.replace("px"));
		} else if (value.indexOf("%") > -1) {
			// Get by percent.
			position = parseInt(value.replace("%"));
			position = parseInt(maximum * position / 100);
		} else {
			// Get by name.
			position = this.GetByName(value);
		}
		return position;
	};
	//---------------------------------------------------------
	// METHOD: GetByName
	//---------------------------------------------------------
	this.GetByName = function (name) {
		var pos = 0;
		// Calculate horizontal position.
		switch (name.toLowerCase()) {
			case "left":
				pos = 0;
				break;
			case "center":
				pos = parseInt((this.Settings.maxW - this.Settings.w) / 2);
				break;
			case "right":
				pos = parseInt(this.Settings.maxW - this.Settings.w);
				break;
			case "top":
				pos = 0;
				break;
			case "middle":
				pos = parseInt((this.Settings.maxH - this.Settings.h) / 2);
				break;
			case "bottom":
				pos = parseInt(this.Settings.maxH - this.Settings.h);
				break;
			default:
				pos = 0;
				break;
		}
		return pos;
	};
	//---------------------------------------------------------
	// INIT: Events
	//---------------------------------------------------------
	this.InitializeEvents = function () {
	};
	//---------------------------------------------------------
	// INIT: Class
	//---------------------------------------------------------
	this.InitializeClass = function () {
		// Set submited values or default values.
		this.id = id ? id : this.GetNextId();
		this.Object = object;
		if (typeof node !== "undefined") {
			this.CreateInterface();
			// Init all events;
			me.InitializeEvents();
		}
	};
	this.InitializeClass();
};
// Inherit Class.
System.Class.Inherit(System.Web.UI.HtmlControls.Aligner, System.Web.UI.HtmlControls.HtmlElementContructor);

//==============================================================================
// END
//------------------------------------------------------------------------------
