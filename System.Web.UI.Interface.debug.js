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
//		<RootNamespace>System.Web.UI.Interface</RootNamespace>
// <PropertyGroup>
//-----------------------------------------------------------------------------
System.Type.RegisterNamespace("System.Web.UI.Interface");
//=============================================================================
// PUBLIC METHOD: System.Web.UI.Interface.NewWindow
//-----------------------------------------------------------------------------

System.Web.UI.Interface.NewWindow = function (valUrl, valId, valWidth, valHeight, strValH, strValV, useAvailable, customOptions, requestedPopUp) {
	var me = this;
	this.Window;
	var screenWidth = useAvailable === false ? screen.width : screen.availWidth;
	var screenHeight = useAvailable === false ? screen.height : screen.availHeight;
	//alert(screenWidth+";"+screenHeight);
	// Calculate Width.
	var W = new String(valWidth);
	W = W.replace("px", "");
	if (W.substr(W.length - 1, 1).toString() === "%") {
		W = W.replace("%", "");
		W = parseInt(W, 10) * screenWidth / 100;
		W = parseInt(W, 10);
	}
	// Calculate height.
	var H = new String(valHeight);
	H = H.replace("px", "");
	if (H.substr(H.length - 1, 1) === "%") {
		H = H.replace("%", "");
		H = parseInt(H, 10) * screenHeight / 100;
		H = parseInt(H, 10);
	}
	// Calculate Horizontal position.
	var intLeft = 0;
	var strLeft = new String(strValH);
	switch (strLeft.toLowerCase()) {
		case "left": intLeft = 0; break;
		case "center": intLeft = parseInt((screenWidth - W) / 2, 10); break;
		case "right": intLeft = parseInt(screenWidth - W, 10); break;
		default: intLeft = strValH; break;
	}

	// Calculate Vertical position.
	var intTop = 0;
	var strTop = new String(strValV);
	switch (strTop.toLowerCase()) {
		case "top": intTop = 0; break;
		case "middle": intTop = parseInt((screenHeight - H) / 2, 10); break;
		case "bottom": intTop = parseInt(screenHeight - H, 10); break;
		default: intTop = strValV; break;
	}
	//alert("W: "+W+", H: "+H+", T: "+intTop+", L: "+intLeft);
	// Return window object.
	// Bring new windo to Front.
	// Fix for firefox.
	if (!window.ActiveXObject) {
		// H minus taskbar height.
		H = H - (screen.height - screen.availHeight);
	}
	// Fix position.
	intLeft = intLeft > 0 ? intLeft : 0;
	intTop = intTop > 0 ? intTop : 0;
	customOptions = customOptions ? customOptions : "scrollbars=no, location=no, titlebar=no, toolbar=no, status=yes, directories=no, channelmode=no, resizable=yes";
	if (requestedPopUp) {
		// First we need to unfocus any item or it with throw exception error:
		// "'Permission denied to get property XULElement.selectedIndex' when calling method...
		// This is f^%*& old firefox bug with autocomplete.
		var launchOptions = "top=" + intTop.toString() + ", left=" + intLeft.toString() + ", width=" + W + ", height=" + H + ", " + customOptions;
		me.Window = window.open(valUrl, valId, launchOptions);
		//me.Window.focus();
		// Cancel the default link action if pop-up activated.
		if (window.event) {
			window.event.returnValue = false;
			window.event.cancelBubble = true;
			//} else if (e) {
			//	e.stopPropagation();
			//	e.preventDefault();
		}
	} else {
		// Opening pop-up thru timeout will identified as UNRequested pop-up and will be blocked by default.
		try {
			setTimeout(function () {
				// First we need to unfocus any item or it with throw exception error:
				// "'Permission denied to get property XULElement.selectedIndex' when calling method...
				// This is f^%*& old firefox bug with autocomplete.
				var launchOptions = "top=" + intTop.toString() + ", left=" + intLeft.toString() + ", width=" + W + ", height=" + H + ", " + customOptions;
				me.Window = window.open(valUrl, valId, launchOptions);
				me.Window.focus();
			}, 200);
		} catch (ex) { /* */ }
	}
	// Return window object.
	return me.Window;
};

//-----------------------------------------------------------------------------
// Main:
//-----------------------------------------------------------------------------

// Create menus (Tables, Buttons)
System.Web.UI.Interface.Main = function (valId, valTarget) {
	// Declare type of this class.
	this.Table;
	this.BannerCell;
	this.MenuCell;
	this.MenuFooterCell;
	this.ContentCell;
	this.ContentDiv;
	this.Target;
	this.Name = "Main";
	//---------------------------------------------------------
	this.CreateInterface = function (valId, valTitle) {
		// Create Table.
		var objTable = this.Target.createElement("TABLE");
		objTable.border = 0;
		objTable.cellPadding = 0;
		objTable.cellSpacing = 2;
		objTable.id = this.id;
		objTable.className = "InterfaceMainTable";
		// Create Body.
		var objBody = this.Target.createElement("TBODY");
		objBody.className = "InterfaceMainTBody";
		objTable.appendChild(objBody);
		// Create Banner.
		var objBannerRow = this.Target.createElement("TR");
		objBody.appendChild(objBannerRow);
		var objBannerCel = this.Target.createElement("TD");
		objBannerCel.className = "InterfaceMainBannerCell";
		objBannerCel.colSpan = 2;
		objBannerRow.appendChild(objBannerCel);
		// Create Basic row.
		var objBasicRow = this.Target.createElement("TR");
		objBody.appendChild(objBasicRow);
		var objMenuCell = this.Target.createElement("TD");
		objMenuCell.className = "InterfaceMainMenuCell";
		objMenuCell.vAlign = "top";
		objMenuCell.height = "100%";
		objBasicRow.appendChild(objMenuCell);
		// Create Content.
		var objContentCell = this.Target.createElement("TD");
		objContentCell.className = "InterfaceMainContentCell";
		objContentCell.vAlign = "top";
		objContentCell.height = "100%";
		objContentCell.width = "100%";
		objContentCell.rowSpan = 2;
		objBasicRow.appendChild(objContentCell);
		// Create Menu Footer.
		var objFooterRow = this.Target.createElement("TR");
		objBody.appendChild(objFooterRow);
		var objFooterCell = this.Target.createElement("TD");
		objFooterCell.className = "InterfaceMainMenuFooterCell";
		objFooterCell.vAlign = "bottom";
		objFooterRow.appendChild(objFooterCell);
		// Create Div.
		var objContentDiv = this.Target.createElement("DIV");
		objContentDiv.className = "InterfaceMainContentDiv";
		objContentDiv.width = "100%";
		objContentCell.appendChild(objContentDiv);
		// Configure Some options.
		this.Table = objTable;
		this.BannerCell = this.Table.tBodies[0].rows[0].childNodes[0];
		this.MenuCell = this.Table.tBodies[0].rows[1].childNodes[0];
		this.MenuFooterCell = this.Table.tBodies[0].rows[2].childNodes[0];
		this.ContentCell = this.Table.tBodies[0].rows[1].childNodes[1];
		this.ContentDiv = objContentDiv;
		// Return results.
		return this.Table;
	};
	//---------------------------------------------------------
	this.InitializeClass = function () {
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
// Inherit Class.
System.Class.Inherit(System.Web.UI.Interface.Main, System.Web.UI.HtmlControls.HtmlElementContructor);

//-----------------------------------------------------------------------------
// Menu:
//-----------------------------------------------------------------------------

// Create menus (Tables, Buttons)
System.Web.UI.Interface.Menu = function (valId, valTarget, valTitle, isContracted, cssType) {
	//---------------------------------------------------------
	// Public properties.
	//---------------------------------------------------------
	this.Target;
	this.Table;  // Remove this later.
	this.Node;
	this.HeadCell;
	this.BodyCell;
	this.Body;
	this.BodyDiv; // remove this. use this.Body
	this.Name = "Menu";
	this.id;
	this.IconMenu;
	this.IconClose;
	this.CssType = "";
	this.Mover = null;
	this.Sizer = null;
	this.CloseMode = "dispose"; // can be also: "hide", "moveout";
	//---------------------------------------------------------
	// Private properties.
	//---------------------------------------------------------
	var me = this;
	//---------------------------------------------------------
	// METHOD: CreateInterface.
	//---------------------------------------------------------
	this.CreateInterface = function () {
		// Create Table.
		this.Node = this.Target.createElement("div");
		this.Node.className = "SWUI_" + this.CssType;
		this.NodeHead = new System.Web.UI.Interface.Table(0, 3, valId, "SWUI_" + this.CssType + "_Table", this.Target, true, false, false).Node;
		this.Node.appendChild(this.NodeHead);
		// Create icon cell and icon image.
		this.NodeIcon = this.NodeHead.tHead.rows[0].childNodes[0]; //this.Target.createElement("span");
		this.NodeIcon.className = "SWUI_" + this.Name + "_Th_Icon";
		this.Icon = new System.Web.UI.Interface.Icon(null, this.Target, null, "SWUI_" + this.Name + "_Th_Icon_Image", null);
		this.NodeIcon.appendChild(this.Icon.Node);
		// Create title cell.
		this.NodeTitle = this.NodeHead.tHead.rows[0].childNodes[1]; //this.Target.createElement("span");
		this.NodeTitle.className = "SWUI_" + this.Name + "_Th_Title";
		// Create menu cell.
		this.NodeControl = this.NodeHead.tHead.rows[0].childNodes[2]; //this.Target.createElement("span");
		this.NodeControl.className = "SWUI_" + this.Name + "_Th_Control";
		// Create expand/contract button.
		this.IconMenu = new System.Web.UI.Interface.Icon(null, this.Target, null, "SWUI_" + this.Name + "_Th_Control_Icon", null);
		this.IconMenu.SetImage("/images/Interface/Office2003/Menu_Down_Out.16x16.gif");
		this.NodeControl.appendChild(this.IconMenu.Node);
		// Create Body Div.
		this.BodyNode = this.Target.createElement("DIV");
		this.BodyNode.className = "SWUI_" + this.Name + "_Body";
		this.Node.appendChild(this.BodyNode);
		this.SetTitle(valTitle);
		// Return results.
		return this.Table;
	};
	//---------------------------------------------------------
	// METHOD: SetTitle.
	//---------------------------------------------------------
	this.SetTitle = function (valTitle) {
		this.Title = valTitle;
		this.NodeTitle.innerHTML = valTitle;
	};
	//---------------------------------------------------------
	// METHOD: SetImage
	//---------------------------------------------------------
	this.SetImage = function (valFilePath) {
		this.Icon.SetImage(valFilePath);
	};
	//---------------------------------------------------------
	// METHOD: ClickControl
	//---------------------------------------------------------
	this.ClickControl = function (sender, e) {
		if (me.IsExpanded === true) {
			me.Contract(me);
		} else {
			me.Expand(me);
		}
	};
	//---------------------------------------------------------
	// METHOD: Contract
	//---------------------------------------------------------
	this.Contract = function (sender, e) {
		me.BodyNode.style.display = "none";
		me.Node.style.borderBottomWidth = "0";
		me.OnEvent(this, "oncontract");
		me.IsExpanded = false;
		me.IconMenu.SetImage("/Images/Interface/Office2007/Menu_Down_Out-16x16.png");
		me.IconMenu.Node.onclick = me.ClickControl;
	};
	//---------------------------------------------------------
	// METHOD: Expand
	//---------------------------------------------------------
	this.Expand = function (sender, e) {
		me.BodyNode.style.display = "block";
		me.Node.style.borderBottomWidth = "1px";
		me.OnEvent(this, "onexpand");
		me.IsExpanded = true;
		me.IconMenu.SetImage("/Images/Interface/Office2007/Menu_Up_Out-16x16.png");
		me.IconMenu.Node.onclick = me.ClickControl;
	};
	//---------------------------------------------------------
	// Property: CloseEvents
	//---------------------------------------------------------
	this._onCloseClick = function () {
		this.State = new String("unchecked");
		// Run function inherited from parent.
		me.Close();
	};
	this._onCloseMouseout = function () {
		this.IconCloseOver.Node.style.display = "none";
		this.IconCloseOut.Node.style.display = "block";
	};
	this._onCloseMouseover = function () {
		this.IconCloseOut.Node.style.display = "none";
		this.IconCloseOver.Node.style.display = "block";
	};
	//---------------------------------------------------------
	// Property: Movable
	//---------------------------------------------------------
	this.setMovable = function (enable) {
		if (enable) {
			this.Mover = new System.Web.UI.HtmlControls.Mover(this.id + "Mover", this.Target, this.NodeTitle, this.Node);
			this.Sizer = new System.Web.UI.HtmlControls.Sizer(this.id + "Sizer", this.Target, this.Node);
			this.IconCloseOut = new System.Web.UI.Interface.Icon(null, this.Target, null, "SWUI_" + this.Name + "_Th_Control_Icon_Close", null);
			this.IconCloseOut.SetImage("../images/Interface/Office2003/StripClose_Out.16x16.gif");
			this.IconCloseOut.Node.onmouseover = function () { me._onCloseMouseover(); };
			this.IconCloseOver = new System.Web.UI.Interface.Icon(null, this.Target, null, "SWUI_" + this.Name + "_Th_Control_Icon_Close", null);
			this.IconCloseOver.SetImage("../images/Interface/Office2003/StripClose_Over.16x16.gif");
			this.IconCloseOver.Node.onmouseout = function () { me._onCloseMouseout(); };
			this.IconCloseOver.Node.onclick = function () { me._onCloseClick(); };
			this._onCloseMouseout();
			// At this moment just
			this.IconMenu.Node.style.display = "none";
			this.NodeControl.appendChild(this.IconCloseOut.Node);
			this.NodeControl.appendChild(this.IconCloseOver.Node);
		}
	};
	//---------------------------------------------------------
	// DISPOSE: Initialize events.
	//---------------------------------------------------------
	this.Dispose = function () {
		this.Node.parentNode.removeChild(this.Node);
	};
	//---------------------------------------------------------
	// INIT: Events.
	//---------------------------------------------------------
	this.InitializeEvents = function (sender, e) {
		sender.IconMenu.Node.onclick = sender.ClickControl;
		// Init moving and resizing.
		if (sender.CssType === "Movable") sender.setMovable(true);
	};
	//---------------------------------------------------------
	// INIT: Class
	//---------------------------------------------------------
	this.InitializeClass = function () {
		// Set submited values or default values.
		this.CssType = cssType ? cssType : "Menu";
		this.Target = valTarget ? valTarget : document;
		this.id = valId ? valId : this.GetNextId();
		// Create HTML Object.
		this.CreateInterface();
		// Expand by default.
		if (isContracted) {
			this.Contract();
		} else {
			this.Expand();
		}
		// Init all events;
		this.InitializeEvents(this);
	};
	this.InitializeClass();
};
// Inherit Class.
System.Class.Inherit(System.Web.UI.Interface.Menu, System.Web.UI.HtmlControls.HtmlElementContructor);

//-----------------------------------------------------------------------------
// TabStrip:
//-----------------------------------------------------------------------------
System.Web.UI.Interface.TabStrip = function (valId, valTarget) {
	// Declare type of this class.
	this.Target;
	this.Node;
	this.Table;
	this.Name = "TabStrip";
	this.Items = [];
	this.SelectedIndex = -1;
	this.PagesCell;
	this.StripCell;
	this.MultiPage;
	this.id;
	this._stripSeparator;
	this.OnPropertyChange;
	var me = this;
	//---------------------------------------------------------
	// METHOD: Add
	//---------------------------------------------------------
	this.Add = function (strip, openInBackground, icon, src, selectStrip, reloadPage) {
		// if id of strip was submited.
		if (typeof strip === "string") {
			Trace.Write(this.id + "Add(id, title, icon, src, selectStrip, reloadPage) // Redirect...");
			// Some values become other values.
			var id = strip;
			var title = openInBackground;
			openInBackground = selectStrip === false;
			// Create strip.
			strip = new System.Web.UI.Interface.Strip(id);
			strip.SetImage(icon);
			strip.SetText(title);
			this.Add(strip, openInBackground);
			// If page was created then set source.
			if (strip.Page) strip.Page.Node.src = src;
		} else {
			Trace.Write(this.id + "Add(strip, openInBackground=" + openInBackground + ")");
			this.Items.push(strip);
			// Remove separator.
			this._stripSeparator.Node.parentNode.removeChild(this._stripSeparator.Node);
			// Add Strip.
			this.StripCell.appendChild(strip.Node);
			//Reaply strip separator item.
			this.StripCell.appendChild(this._stripSeparator.Node);
			// Reaply last
			strip.TabStrip = this;
			// If MultiPage objects is set then...
			if (this.MultiPage !== null) {
				// Create new Page for strip.
				var page = new System.Web.UI.Interface.Page(strip.id + "Page", this.Target);
				this.MultiPage.Add(page);
				strip.Page = page;
			}
			var e = new System.EventArgs("OnItemAdd");
			e.StripId = strip.id;
			this.OnEvent(this, e);
			if (openInBackground !== true) this.ItemSelect(strip);
		}
		return strip;
	};
	//---------------------------------------------------------
	// METHOD: Select
	//---------------------------------------------------------
	this.ItemSelect = function (strip) {
		var itemIndex = -1;
		if (typeof strip === "number") {
			itemIndex = strip;
			strip = this.Items[strip];
		} else {
			itemIndex = this.GetIndexByItem(strip);
		}
		// If this is same strip.
		if (this.SelectedIndex === itemIndex) {
			Trace.Write(this.id + " Strip[" + itemIndex + "] is already selected");
		} else {
			var i;
			//Route thru items...
			for (i = 0; i < this.Items.length; i++) {
				var item = this.Items[i];
				// If this is not same strip and checked then disable it.
				if (strip !== item && item.State === "checked") {
					item.SetState("unchecked");
				}
			}
			strip.SetState("checked");
			// Route items...
			for (i = 0; i < this.Items.length; i++) {
				if (this.Items[i].State === "checked") {
					// Update selected index.
					this.SelectedIndex = i;
				}
			}
			if (this.OnPropertyChange) {
				var e = new System.EventArgs("OnSelectedIndexChange");
				e["Strip"] = strip;
				e["SelectedIndex"] = this.SelectedIndex;
				this.OnPropertyChange(this, e);
			}
			if (this.MultiPage) this.MultiPage.ItemSelect(this.SelectedIndex);
		}
	};
	//---------------------------------------------------------
	// METHOD: GetItem
	//---------------------------------------------------------
	this.GetItem = function (id) {
		var results;
		var index = this.GetIndexById(id);
		if (index > -1) results = this.Items[index];
		return results;
	};
	//---------------------------------------------------------
	// METHOD: GetIndexByItem
	//---------------------------------------------------------
	this.GetIndexByItem = function (item) {
		var index = -1;
		for (var i = 0; i < this.Items.length; i++) {
			if (this.Items[i] === item) {
				index = i;
				break;
			}
		}
		return index;
	};
	//---------------------------------------------------------
	// METHOD: GetIndexByName
	//---------------------------------------------------------
	this.GetIndexById = function (id) {
		var index = -1;
		for (var i = 0; i < this.Items.length; i++) {
			if (this.Items[i].id === id) {
				index = i;
				break;
			}
		}
		return index;
	};
	//---------------------------------------------------------
	// METHOD: Close
	//---------------------------------------------------------
	// Close tab strips. Feature. Close all except this one.
	this.CloseStrips = function (id, isExclusive) {
		Trace.Write("call " + this.id + ".CloseStrips(" + id + ", " + isExclusive + ")");
		var success = false;
		// If Id is not specified or is exclusive then...
		if (id === null || isExclusive === true) {
			// Close all strips.
			for (var i = 0; i < this.Items.length; i++) {
				// If id not equal specified name of id then...
				var closeStrip = true;
				// This closes all except specific strip.
				if (isExclusive === true && this.Items[i].id === id) {
					closeStrip = false;
				}
				if (closeStrip) this.Items[i].ClickClose();
			}
			success = true;
		} else {
			var index = -1;
			if (typeof id === "number") {
				index = id;
			} else {
				index = this.GetIndexById(id);
			}
			// If strip was found then...
			if (index > -1) {
				this.Items[index].ClickClose();
				success = true;
			}
		}
		return success;
	};
	//---------------------------------------------------------
	// METHOD: Remove
	//---------------------------------------------------------
	this.Remove = function (valStrip) {
		for (var i = 0; i < this.Items.length; i++) {
			var strip = this.Items[i];
			var e = new System.EventArgs("OnItemRemove");
			e.StripId = strip.id;
			// If strip was found then...
			if (strip === valStrip) {
				// Remove it from array.
				this.Items.splice(i, 1);
				// If MultiPage objects is set then...
				if (this.MultiPage !== null) {
					// Remove Page.
					this.MultiPage.Remove(valStrip.Page);
				}
				this.OnEvent(this, e);
			}
		}
		this.CheckChecked();
	};
	//---------------------------------------------------------
	// METHOD: CheckChecked()
	//---------------------------------------------------------
	this.CheckChecked = function () {
		// If there are tab strips.
		if (this.Items.length > 0) {
			// Check
			var IsChecked = false;
			for (var i = 0; i < this.Items.length; i++) {
				var strip = this.Items[i];
				if (strip.State === "checked") IsChecked = true;
			}
			// If there is no checked strips then check first strip.
			if (!IsChecked) this.Items[0].Click();
		}
	};
	//---------------------------------------------------------
	// METHOD: SetMultiPage()
	//---------------------------------------------------------
	this.SetMultiPage = function (multiPage) {
		Trace.Write("call " + this.id + ".SetMultiPage(multiPage)");
		this.MultiPage = multiPage;
		this.PagesCell.appendChild(multiPage.Node);
	};
	//---------------------------------------------------------
	// METHOD: _onIeResize
	//---------------------------------------------------------
	this._onIeResize = function () {
		//this.PagesCell.style.position = "absolute";
		Trace.Write("on " + this.id + "._onIeResize()");
		//this.PointCell.style.border = "solid 1px red !important";
		var pw = this.PointCell.offsetWidth;
		var pl = this.PointCell.offsetLeft;
		this.StripCell.style.left = pl + "px";
		this.StripCell.style.width = pw + "px";
		//this.StripCell.style.top = this.PointCell.offsetTop + "px";
		var newHeight = this.Node.offsetHeight - this.StripCell.offsetHeight - 2;
		if (this.StripCell.offsetHeight > 0) this.PagesCell.style.marginTop = this.StripCell.offsetHeight + "px";
		if (newHeight > 0) this.PagesCell.style.height = newHeight + "px";
		this.PagesCell.style.left = pl + "px";
		this.PagesCell.style.width = pw + "px";
	};
	//---------------------------------------------------------
	// METHOD: CreateInterface
	//---------------------------------------------------------
	this.CreateInterface = function () {
		// Create Outer Table.
		if (window.ActiveXObject) {
			// Internet explorer can't expand height of one row to maximum.
			// So here is workaround.
			this.Node = this.Target.createElement("div");
			//this.Node.style.position = "relative";
			this.Node.className = "SWUI_TabStrip";
			this.StripCell = this.Target.createElement("div");
			this.PagesCell = this.Target.createElement("div");
			this.PointCell = this.Target.createElement("div");
			this.StripCell.style.position = "absolute";
			this.PagesCell.style.position = "absolute";
			this.PointCell.style.position = "relative";
			this.PointCell.style.overflow = "hidden";
			this.PointCell.style.width = "100%";
			this.PointCell.style.height = "0";
			//this.PointCell.style.border = "solid 1px red";
			this.Node.appendChild(this.PointCell);
			this.Node.appendChild(this.PagesCell);
			this.Node.appendChild(this.StripCell);
			this.Node.onresize = function () { setTimeout(function () { me._onIeResize(); }, 100); };
		} else {
			// Interface for firefox.
			//...Table(rows,columns,id,className,target,createHead,createBody,createFoot)
			var outerTable = new System.Web.UI.Interface.Table(2, 1, this.id, "SWUI_" + this.Name, this.Target, false, true, false);
			this.Node = outerTable.Node;
			this.Node.style.width = "100%";
			this.Node.border = 0;
			this.Node.cellPadding = 0;
			this.Node.cellSpacing = 0;
			this.StripCell = outerTable.TBody.rows[0].childNodes[0];
			this.PagesCell = outerTable.TBody.rows[1].childNodes[0];
		}
		this.StripCell.className = "SWUI_" + this.Name + "_Strips";
		this.PagesCell.className = "SWUI_" + this.Name + "_Pages";
		this._stripSeparator = new System.Web.UI.Interface.Table(1, 1, this.id + "StripSeparator", "", this.Target);
		this._stripSeparator.Node.className = "SWUI_" + "Strip" + "_Separator";
		this._stripSeparator.Node.style.height = "100%";
		// Add separator to toolbar.
		this.StripCell.appendChild(this._stripSeparator.Node);
	};
	//---------------------------------------------------------
	// INIT: Class
	//---------------------------------------------------------
	this.InitializeClass = function () {
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
// Inherit Class.
System.Class.Inherit(System.Web.UI.Interface.TabStrip, System.Web.UI.HtmlControls.HtmlElementContructor);

//-----------------------------------------------------------------------------
// Strip:
//-----------------------------------------------------------------------------
System.Web.UI.Interface.Strip = function (valId, valTarget, disableClose) {
	// Declare type of this class.
	this.Name = "Strip";
	this.Enabled = true;
	this.Target;
	this.Node;
	this.id = "";
	this.Icon;
	this.Text = "";
	this.Title = "";
	this.Image;
	this.State = new String("unchecked");
	this.Enabled;
	this.Table = null;
	this.customAction;
	this.TabStrip;
	this.Page;
	//---------------------------------------------------------
	// METHOD: OnEvent
	//---------------------------------------------------------
	this.OnEvent = function (sender, e) {
		if (this.TabStrip !== null) { /* */ }
	};
	//---------------------------------------------------------
	// METHOD: CreateInterface
	//---------------------------------------------------------
	this.CreateInterface = function (valId, valTitle) {
		// Create Table.
		var objDiv = this.Target.createElement("DIV");
		objDiv.className = "SWUI_" + this.Name + "_Off_Out";
		objDiv.id = this.id;
		var table = new System.Web.UI.Interface.Table(1, 5, this.id + "Table", "SWUI_" + this.Name + "_Table", this.Target);
		table.Node.style.cssText = "float: left;";
		objDiv.appendChild(table.Node);
		this.Icon = new System.Web.UI.Interface.Icon(null, null, null, "SWUI_" + this.Name + "_Icon", null);
		this.Image = this.Icon.Node;
		table.TBody.rows[0].childNodes[0].className = "SWUI_" + this.Name + "_Left_Off_Out";
		table.TBody.rows[0].childNodes[1].className = "SWUI_" + this.Name + "_Icon";
		table.TBody.rows[0].childNodes[1].appendChild(this.Image);
		table.TBody.rows[0].childNodes[2].noWrap = true;
		table.TBody.rows[0].childNodes[2].className = "SWUI_" + this.Name + "_Text_Off";
		table.TBody.rows[0].childNodes[2].innerHTML = "[" + this.id + "]";
		table.TBody.rows[0].childNodes[3].className = "SWUI_" + this.Name + "_Close_Off_Out";
		if (this.DisableClose) table.TBody.rows[0].childNodes[3].style.display = "none";
		table.TBody.rows[0].childNodes[4].className = "SWUI_" + this.Name + "_Right";
		// Set public values.
		this.Table = table;
		this.Node = objDiv;
		// Disable selection.
		this.Node.onselectstart = function () { return false; };
		this.Node.onselect = function () { return false; };
		this.Node.onmousedown = function () { return false; };
		this.Node.onmousedown = function () { return false; };
	};
	//---------------------------------------------------------
	// METHOD: SetText
	//---------------------------------------------------------
	this.SetText = function (valText) {
		this.Text = valText;
		this.Node.childNodes[0].tBodies[0].rows[0].childNodes[2].innerHTML = valText;
	};
	//---------------------------------------------------------
	// METHOD: SetImage
	//---------------------------------------------------------
	this.SetImage = function (filePath) {
		this.Icon.SetImage(filePath);
	};
	//---------------------------------------------------------
	// METHOD: SetTitle
	//---------------------------------------------------------
	this.SetTitle = function (title) {
		this.Title = title;
		this.Node.title = title;
	};
	//---------------------------------------------------------
	// METHOD: SetState()
	//---------------------------------------------------------
	this.SetState = function (valState) {
		this.State = valState;
		// Set mouse state always to 'Out' because it will have more chance.
		if (valState === "checked") this.SetItemStyle("Out");
		if (valState === "unchecked") this.SetItemStyle("Out");
		this.OnEvent(this, "oncheck");
	};
	//---------------------------------------------------------
	// METHOD: Click
	//---------------------------------------------------------
	this.Click = function () {
		if (this.Enabled) {
			if (this.customAction) {
				this.customAction();
			}
			if (this.State === "unchecked") this.SetState("checked");
			// Now we need to unselect other strips on same TabStrip.
			if (this.TabStrip !== null) this.TabStrip.ItemSelect(this);
		}
	};
	//---------------------------------------------------------
	// METHOD: ClickClose
	//---------------------------------------------------------
	this.ClickClose = function () {
		// Disable all events.
		this.Node.onclick = null;
		this.Node.onmouseover = null;
		this.Node.onmouseout = null;
		this.TabStrip.Remove(this);
		// Remove it from Page.
		this.Node.parentNode.removeChild(this.Node);
		this.OnEvent(this, "onclose");
	};
	//---------------------------------------------------------
	// METHOD: MouseOverClose
	//---------------------------------------------------------
	this.MouseOverClose = function () {
		if (this.Enabled) this.Node.childNodes[0].tBodies[0].rows[0].childNodes[3].className = "SWUI_" + this.Name + "_Close_Off_Over";
	};
	//---------------------------------------------------------
	// METHOD: MouseOutClose
	//---------------------------------------------------------
	this.MouseOutClose = function () {
		if (this.Enabled) this.Node.childNodes[0].tBodies[0].rows[0].childNodes[3].className = "SWUI_" + this.Name + "_Close_Off_Out";
	};
	//---------------------------------------------------------
	// METHOD: MouseOver
	//---------------------------------------------------------
	this.MouseOver = function () {
		if (this.Enabled) this.SetItemStyle("Over");
	};
	//---------------------------------------------------------
	// METHOD: MouseOut
	//---------------------------------------------------------
	this.MouseOut = function () {
		if (this.Enabled) this.SetItemStyle("Out");
	};
	//---------------------------------------------------------
	// INIT: Events
	//---------------------------------------------------------
	this.InitializeEvents = function (valObject) {
		this.Node.onclick = function () { valObject.Click(); };
		this.Node.onmouseover = function () { valObject.MouseOver(); };
		this.Node.onmouseout = function () { valObject.MouseOut(); };
		// Setup events for close button.
		this.Node.childNodes[0].tBodies[0].rows[0].childNodes[3].onmouseover = function () { valObject.MouseOverClose(); };
		this.Node.childNodes[0].tBodies[0].rows[0].childNodes[3].onmouseout = function () { valObject.MouseOutClose(); };
		this.Node.childNodes[0].tBodies[0].rows[0].childNodes[3].onclick = function () { valObject.ClickClose(); };
	};
	//---------------------------------------------------------
	// METHOD: SetItemStyle
	//---------------------------------------------------------
	this.SetItemStyle = function (mouseState) {
		if (this.Enabled) {
			var checkState = this.State === "checked" ? "On" : "Off";
			this.Node.className = "SWUI_" + this.Name + "_" + checkState + "_" + mouseState;

			this.Node.childNodes[0].tBodies[0].rows[0].childNodes[2].className = "SWUI_" + this.Name + "_Text_" + checkState;
			this.Table.TBody.rows[0].childNodes[0].className = "SWUI_" + this.Name + "_Left_" + checkState + "_" + mouseState;

			//alert(this.Node.className);
		}
	};
	//---------------------------------------------------------
	// INIT: Class
	//---------------------------------------------------------
	this.InitializeClass = function () {
		// Set submited values or default values.
		this.Target = valTarget ? valTarget : document;
		this.id = valId ? valId : this.GetNextId();
		// Create HTML Object.
		this.DisableClose = disableClose ? disableClose : false;
		this.CreateInterface();
		// Init all events;
		this.InitializeEvents(this);
	};
	this.InitializeClass();
};
// Inherit Class.
System.Class.Inherit(System.Web.UI.Interface.Strip, System.Web.UI.HtmlControls.HtmlElementContructor);

//-----------------------------------------------------------------------------
// MultiPage:
//-----------------------------------------------------------------------------
System.Web.UI.Interface.MultiPage = function (valId, valTarget) {
	// Declare type of this class.
	this.Target;
	this.Node;
	this.Table;
	this.Name = "MultiPage";
	this.Items = [];
	this.SelectedIndex = -1;
	this.id;
	//---------------------------------------------------------
	// EVENTS: Public
	//---------------------------------------------------------
	this.RiseEvent = function (e) { if (this[e.Name]) this[e.Name](this, e); };
	//---------------------------------------------------------
	this.OnPropertyChange;
	//---------------------------------------------------------
	// HANDLER: public _eventWatcher
	//---------------------------------------------------------
	// This will watch for external events.
	this._eventWatcher = function (sender, e) {
		Trace.Write(this.id + "._eventWatcher(sender[Type='" + sender.Type + "';id='" + sender.id + "'],e[Name='" + e.Name + "'])");
		switch (e.Name) {
			case "OnContentReady":
				if (this.OnPropertyChange) {
					var e2 = new System.EventArgs("OnPageContentReady");
					e2["Page"] = sender;
					this.OnPropertyChange(this, e2);
				}
				break;
			default:
				Trace.Write("Error: " + this.id + ": Unknown event e[Name='" + e.Name + "'] from sender[id='" + sender.id + "';Type='" + sender.Type + "'] ");
				break;
		}
	};
	//---------------------------------------------------------
	// METHOD: Add
	//---------------------------------------------------------
	this.Add = function (page) {
		Trace.Write(this.id + "Add(page)");
		this.Items.push(page);
		this.Node.tBodies[0].rows[0].childNodes[0].appendChild(page.Node);
		page.Parent = this;
	};
	//---------------------------------------------------------
	// METHOD: Remove
	//---------------------------------------------------------
	this.Remove = function (page) {
		for (var pdx = 0; pdx < this.Items.length; pdx++) {
			var currentPage = this.Items[pdx];
			// If page was found then...
			if (currentPage === page) {
				// Remove it from array.
				this.Items.splice(pdx, 1);
				// Remove it from HTML Page.
				page.Node.parentNode.removeChild(page.Node);
			}
		}
	};
	//---------------------------------------------------------
	// METHOD: Remove
	//---------------------------------------------------------
	this.ItemSelect = function (page) {
		if (typeof page === "number") page = this.Items[page];
		//Route thru items...
		var i;
		for (i = 0; i < this.Items.length; i++) {
			var item = this.Items[i];
			// If this is not same strip and checked then disable it.
			if (page !== item && item.State === "checked") {
				item.SetState("unchecked");
			}
		}
		page.SetState("checked");
		// Route thru items...
		for (i = 0; i < this.Items.length; i++) {
			if (this.Items[i].State === "checked") {
				// Update selected index.
				this.SelectedIndex = i;
			}
		}
		if (this.OnPropertyChange) {
			var e = new System.EventArgs("OnSelectedIndexChange");
			e["Page"] = page;
			e["SelectedIndex"] = this.SelectedIndex;
			this.OnPropertyChange(this, e);
		}
	};
	//---------------------------------------------------------
	// METHOD: GetById // outdated
	//---------------------------------------------------------
	this.GetById = function (id) {
		return this.GetItem(id);
	};
	//---------------------------------------------------------
	// METHOD: GetItem
	//---------------------------------------------------------
	this.GetItem = function (id) {
		var results;
		var index = this.GetIndexById(id);
		if (index > -1) results = this.Items[index];
		return results;
	};
	//---------------------------------------------------------
	// METHOD: GetIndexById
	//---------------------------------------------------------
	this.GetIndexById = function (id) {
		var index = -1;
		for (var i = 0; i < this.Items.length; i++) {
			if (this.Items[i].id === id) {
				index = i;
				break;
			}
		}
		return index;
	};
	//---------------------------------------------------------
	// METHOD: CreateInterface
	//---------------------------------------------------------
	this.CreateInterface = function () {
		// Create Outer Table.
		var outerTable = new System.Web.UI.Interface.Table(1, 1, this.id, "SWUI_" + this.Name, this.Target);
		this.Node = outerTable.Node;
		this.Node.border = 0;
		this.Node.cellPadding = 0;
		this.Node.cellSpacing = 0;
	};
	//---------------------------------------------------------
	// INIT: Class
	//---------------------------------------------------------
	this.InitializeClass = function () {
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
// Inherit Class.
System.Class.Inherit(System.Web.UI.Interface.MultiPage, System.Web.UI.HtmlControls.HtmlElementContructor);

//-----------------------------------------------------------------------------
// Interface.Page:
//-----------------------------------------------------------------------------
System.Web.UI.Interface.Page = function (id, target, scrolling, state, url, parentNode, hideUntilLoaded) {
	//---------------------------------------------------------
	// Public properties.
	//---------------------------------------------------------
	this.Target;
	this.Node;
	this.Table;
	this.Name = "Page";
	this.Document;
	this.State;
	this.Parent;
	this.ContentIsReady = false;
	//---------------------------------------------------------
	// Private properties.
	//---------------------------------------------------------
	var me = this;
	var _hideUntilLoaded = false;
	//---------------------------------------------------------
	// EVENTS: public
	//---------------------------------------------------------
	this.RiseEvent = function (e) { if (this[e.Name]) this[e.Name](this, e); };
	//---------------------------------------------------------
	this.OnLoaded;
	//---------------------------------------------------------
	// METHOD: Print
	//---------------------------------------------------------
	this.Print = function () {
		// Node must be IFrame object.
		//alert(this.Node.contentWindow.document.getElementById("TicketActionsTable").innerHTML);
		this.Node.contentWindow.focus();
		this.Node.contentWindow.print();
	};
	//---------------------------------------------------------
	// METHOD: SetState
	//---------------------------------------------------------
	this.SetState = function (state, quiet) {
		this.State = state;
		if (this.State === "unchecked") this.Node.style.display = "none";
		if (this.State === "checked") this.Node.style.display = "block";
		if (quiet !== true) {
			var e = new System.EventArgs("onstate");
			this.OnEvent(this, e);
		}
	};
	//---------------------------------------------------------
	// METHOD: SetLocation
	//---------------------------------------------------------
	this.SetLocation = function (url) {
		this.ContentIsReady = false;
		this.Node.src = url;
	};
	//---------------------------------------------------------
	// METHOD: OnLoad
	//---------------------------------------------------------
	this.OnLoad = function () {
		var readyState = "";
		// If this is Internet Explorer.
		if (typeof document.onreadystatechange !== "undefined") {
			readyState = this.Node.readyState;
			if (readyState === "complete") readyState = "onload";
		} else {
			readyState = "onload";
		}
		//Trace.Write(this.id+".readyState='"+readyState+"'");
		//Trace.Write(me.Node.readyState);
		// If page is loaded then..
		if (readyState === "onload") {
			if (_hideUntilLoaded && this.State === "checked") this.Node.style.display = "block";
			this.ContentIsReady = true;
			//try{
			// To prevent this error, documents that interact with each other must be
			// hosted by servers on the same domain.  You can manualy set or retrieve
			// the security domain of the document: document.domain = "microsoft.com"
			me.Document = me.Node.contentWindow.document;
			//}catch(ex){
			//	Trace.Write("Error: System.Web.UI.Interface.Page() - "+ex.message);
			//}
			// Fire event if this Page belongs to multipage.
			if (this.Parent) {
				var e = new System.EventArgs("OnContentReady");
				me.Parent._eventWatcher(me, e);
			}
			// Inform that page document was loaded.
			this.RiseEvent(new System.EventArgs("OnLoaded"));
			if (this.customAction) me.customAction();
			//if (this.Document != null) this.Document.body.innerHTML = this.id;
		}
	};
	//---------------------------------------------------------
	// INIT: Interface
	//---------------------------------------------------------
	this.InitializeInterface = function (sender, e) {
		Trace.Write("Create Page Frame");
		var iframe = this.Target.createElement("IFRAME");
		iframe.frameBorder = 0;
		iframe.id = this.id;
		iframe.name = this.id;
		iframe.scrolling = e.Scrolling;
		//iframe.scrolling = "no";
		this.Node = iframe;
		this.Node.className = "SWUI_Page_Frame";
		this.Node.src = e.Url ? e.Url : "about:blank";
		this.SetState(e.State, true);
		if (_hideUntilLoaded && this.State === "checked") this.Node.style.display = "none";
	};
	//---------------------------------------------------------
	this.InitializeEvents = function (sender, e) {
		// If this is Internet Explorer.
		if (typeof document.onreadystatechange !== "undefined") {
			this.Node.onreadystatechange = function () { me.OnLoad(); };
		} else {
			this.Node.onload = function () { me.OnLoad(); };
		}
		// If parent Node was submited then...
		if (e.ParentNode) {
			// Add page to parent node.
			if (typeof e.ParentNode === "string") {
				var parentNode = document.getElementById(e.ParentNode);
				parentNode.appendChild(this.Node);
			} else {
				e.ParentNode.appendChild(this.Node);
			}
		}
	};
	//---------------------------------------------------------
	this.InitializeClass = function () {
		// Set submited values or default values.
		this.Target = target ? target : document;
		this.id = id ? id : this.GetNextId();
		var ei = new System.EventArgs("InterfaceParameters");
		_hideUntilLoaded = hideUntilLoaded === true;
		ei["Scrolling"] = scrolling ? scrolling : "auto";
		ei["Url"] = url;
		// By default page is hidden.
		ei["State"] = state ? state : "unchecked";
		// Create HTML Object.
		this.InitializeInterface(this, ei);
		// Init all events;
		var ee = new System.EventArgs("EventsParameters");
		ee["ParentNode"] = parentNode;
		this.InitializeEvents(this, ee);
	};
	this.InitializeClass();
};
// Inherit Class.
System.Class.Inherit(System.Web.UI.Interface.Page, System.Web.UI.HtmlControls.HtmlElementContructor);

//-----------------------------------------------------------------------------
// ToolBar:
//-----------------------------------------------------------------------------

System.Web.UI.Interface.ToolBar = function (valId, valTarget) {
	// Declare type of this class.
	this.Target;
	this.Node;
	this.Items = [];
	this.Name = "ToolBar";
	//---------------------------------------------------------
	// METHOD: Add
	//---------------------------------------------------------
	this.Add = function (valBar) {
		this.Items.push(valBar);
		this.Node.tBodies[0].rows[0].childNodes[0].appendChild(valBar.Node);
	};
	//---------------------------------------------------------
	// METHOD: GetItemById
	//---------------------------------------------------------
	this.GetItemById = function (valId) {
		var results;
		for (var i = 0; i < this.Items.length; i++) {
			var item = this.Items[i];
			if (item.id === valId) {
				results = item;
				break;
			}
		}
		return results;
	};
	//---------------------------------------------------------
	// METHOD: CreateInterface
	//---------------------------------------------------------
	this.CreateInterface = function (valId, valTitle) {
		// Create Table.
		var objTable = this.Target.createElement("TABLE");
		objTable.border = 0;
		objTable.cellPadding = 0;
		objTable.cellSpacing = 2;
		objTable.id = valId;
		objTable.className = "SWUI_ToolBar_OuterTable";
		// Create Body.
		var objBody = this.Target.createElement("TBODY");
		objBody.className = "";
		objTable.appendChild(objBody);
		// Create Banner.
		var objRow = this.Target.createElement("TR");
		objBody.appendChild(objRow);
		var objCell = this.Target.createElement("TD");
		objRow.appendChild(objCell);
		this.Node = objTable;
	};
	//---------------------------------------------------------
	// INIT: Class
	//---------------------------------------------------------
	this.InitializeClass = function () {
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
// Inherit Interface.ToolBar Class.
System.Class.Inherit(System.Web.UI.Interface.ToolBar, System.Web.UI.HtmlControls.HtmlElementContructor);

//-----------------------------------------------------------------------------
// Bar:
//-----------------------------------------------------------------------------

System.Web.UI.Interface.Bar = function (valId, valTarget, name) {
	// Declare type of this class.
	this.id;
	this.Target;
	this.Node;
	this.ButtonsNode;
	this.Table;
	this.ImageGrip;
	this.Items = [];
	this.Name = "Bar";
	this.RightNode;
	this.BottomCell;
	this.Name = "";
	//---------------------------------------------------------
	// METHOD: CreateInterface
	//---------------------------------------------------------
	this.Show = function () {
		this.Node.style.display = "block";
	};
	this.Hide = function () {
		this.Node.style.display = "none";
	};
	//---------------------------------------------------------
	// METHOD: Add
	//---------------------------------------------------------
	this.Add = function (button) {
		this.Items.push(button);
		var cell = this.Target.createElement("td");
		cell.className = "SWUI_Bar_ButtonCell";
		cell.nowrap = "nowrap";
		cell.appendChild(button.Node);
		this.RightNode.parentNode.insertBefore(cell, this.RightNode);
	};
	//---------------------------------------------------------
	// METHOD: GetItemById
	//---------------------------------------------------------
	this.GetItemById = function (valId) {
		var results;
		for (var i = 0; i < this.Items.length; i++) {
			var item = this.Items[i];
			if (item.id === valId) {
				results = item;
				break;
			}
		}
		return results;
	};
	//---------------------------------------------------------
	// METHOD: CreateInterface
	//---------------------------------------------------------
	this.CreateInterface = function () {
		var barNode = this.Target.createElement("div");
		var barTable = new System.Web.UI.Interface.Table(3, 3, "", "", this.Target, false, true, false);
		barNode.appendChild(barTable.Node);
		barTable.Cells.TL.className = "SWUI_Bar_TL";
		barTable.Cells.TC.className = "SWUI_Bar_TC";
		barTable.Cells.TR.className = "SWUI_Bar_TR";
		barTable.Cells.ML.className = "SWUI_Bar_ML";
		barTable.Cells.MC.className = "SWUI_Bar_MC";
		barTable.Cells.MR.className = "SWUI_Bar_MR";
		barTable.Cells.BL.className = "SWUI_Bar_BL";
		barTable.Cells.BC.className = "SWUI_Bar_BC";
		barTable.Cells.BR.className = "SWUI_Bar_BR";
		barTable.Cells.BC.innerHTML = this.Name;

		barNode.style.cssText = "float: left; white-space: nowrap;"; // background-color: red;
		barNode.className = "SWUI_Bar_Node";
		barNode.id = this.id;
		var table = new System.Web.UI.Interface.Table(1, 2, "", "", this.Target, false, true, false);
		barTable.Cells.MC.appendChild(table.Node);
		//		// Merge cells of bottom row. 
		//		var length =  table.Node.tBodies[0].rows[1].childNodes.length;
		//		for (var i = 0; i < length-1; i++){
		//			var child = table.Node.tBodies[0].rows[1].childNodes[1];
		//			child.parentNode.removeChild(child);
		//		}
		//		this.BottomCell = table.Node.tBodies[0].rows[1].childNodes[0];
		//		this.BottomCell.colSpan = length;
		//		this.BottomCell.className = "SWUI_Bar_Node_BottomCell";
		//		this.BottomCell.innerHTML = this.Name;

		// Create Left Node.
		var leftNode = table.Node.tBodies[0].rows[0].childNodes[0];
		//this.Target.createElement("div");
		//leftNode.style.cssText = "float: left;";
		//barNode.appendChild(leftNode);
		// Create Grip Image.
		var imgL = this.Target.createElement("img");
		imgL.src = "/Images/Interface/Office2003/toolbar.horizontal.start.png";
		//leftNode.appendChild(imgL);
		// Create Buttons Node.
		//var buttonsNode = table.Node.tBodies[0].rows[0].childNodes[1];
		//barNode.appendChild(buttonsNode);
		// Create Right Node.
		this.RightNode = table.Node.tBodies[0].rows[0].childNodes[1];
		// this.Target.createElement("div");
		//rightNode.style.cssText = "float: left;";
		//barNode.appendChild(rightNode);
		// Create Image.
		var imgR = this.Target.createElement("img");
		imgR.src = "/Images/Interface/Office2003/toolbar.horizontal.end.png";
		//this.RightNode.appendChild(imgR);
		// Set public variables.
		//this.ButtonsNode = buttonsNode;
		this.Node = barNode;
		this.ImageGrip = imgL;
	};
	//---------------------------------------------------------
	// INIT: Class
	//---------------------------------------------------------
	this.InitializeClass = function () {
		// Set submited values or default values.
		this.Target = valTarget ? valTarget : document;
		this.Name = name ? name : "";
		this.id = valId ? valId : this.GetNextId();
		// Create HTML Object.
		this.CreateInterface();
		// Init all events;
		this.InitializeEvents(this);
	};
	this.InitializeClass();
};
// Inherit Interface.Bar Class.
System.Class.Inherit(System.Web.UI.Interface.Bar, System.Web.UI.HtmlControls.HtmlElementContructor);

//-----------------------------------------------------------------------------
// Button:
//-----------------------------------------------------------------------------

System.Web.UI.Interface.Button = function (valId, valTarget) {
	// Declare type of this class.
	this.Name = "Button";
	this.Enabled = true;
	this.Target;
	this.Node;
	this.id;
	this.Icon;
	this.Text;
	this.TextNode;
	this.Title = "";
	this.Image;
	this.State;
	this.Enabled;
	this.customAction;
	var me = this;
	//---------------------------------------------------------
	// METHOD: OnEvent
	//---------------------------------------------------------
	this.OnEvent = function (sender, e) {
		if (e === "InitializeClass") {
			this.id = valId;
		}
		if (e.Name === "OnDisable") {
			// Remove mouse hover effect.
			me.SetItemStyle("Out", true);
		}
		//alert(e+"; Id: "+this.id);
	};
	//---------------------------------------------------------
	// METHOD: CreateInterface
	//---------------------------------------------------------
	this.CreateInterface = function () {
		// Create Table.
		var buttonNode = this.Target.createElement("div");
		buttonNode.className = "SWUI_" + this.Name + "_Off_Out";
		buttonNode.id = this.id;
		var iconNode = this.Target.createElement("span");
		//iconNode.style.cssText = "float: left";
		buttonNode.appendChild(iconNode);
		iconNode.className = "SWUI_" + this.Name + "_Icon";
		var image = this.Target.createElement("img");
		image.height = 16;
		image.width = 16;
		image.border = 0;
		image.vspace = 2;
		image.hspace = 2;
		//image.align = "left";
		image.unselectable = "on";
		iconNode.appendChild(image);
		var textNode = this.Target.createElement("span");
		textNode.style.cssText = "white-space: nowrap;";
		buttonNode.appendChild(textNode);
		textNode.className = "SWUI_" + this.Name + "_Text";
		this.Node = buttonNode;
		this.TextNode = textNode;
		this.Image = image;
		// Disable selection.
		this.Node.onselectstart = function () { return false; };
		this.Node.onselect = function () { return false; };
		this.Node.onmousedown = function () { return false; };
		this.Node.onmousedown = function () { return false; };
	};
	//---------------------------------------------------------
	// METHOD: SetText
	//---------------------------------------------------------
	this.SetText = function (valText) {
		this.Text = valText;
		this.TextNode.innerHTML = valText;
	};
	//---------------------------------------------------------
	// METHOD: SetImage
	//---------------------------------------------------------
	this.SetImage = function (valFilePath) {
		this.Image.src = valFilePath;
		if (this.Image.runtimeStyle) {
			this.Image.src = "../../Images/Transparent.gif";
			this.Image.runtimeStyle.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + valFilePath + "',sizingMethod='scale')";
		}
	};
	//---------------------------------------------------------
	// METHOD: SetTitle
	//---------------------------------------------------------
	this.SetTitle = function (valTitle) {
		this.Title = valTitle;
		this.Node.title = this.Title;
	};
	//---------------------------------------------------------
	// METHOD: Click
	//---------------------------------------------------------
	this.Click = function () {
		if (this.Enabled) {
			if (this.customAction) {
				this.customAction(this, "click");
			}
		}
	};
	//---------------------------------------------------------
	// METHOD: MouseOver
	//---------------------------------------------------------
	this.MouseOver = function () {
		if (this.Enabled) this.SetItemStyle("Over");
	};
	//---------------------------------------------------------
	// METHOD: MouseOut
	//---------------------------------------------------------
	this.MouseOut = function () {
		if (this.Enabled) this.SetItemStyle("Out");
	};

	//---------------------------------------------------------
	// INIT: Events
	//---------------------------------------------------------
	this.InitializeEvents = function (valObject) {
		this.Node.onclick = function () { valObject.Click(); };
		this.Node.onmouseover = function () { valObject.MouseOver(); };
		this.Node.onmouseout = function () { valObject.MouseOut(); };
	};
	//---------------------------------------------------------
	// METHOD: SetItemStyle
	//---------------------------------------------------------
	this.SetItemStyle = function (mouseState, force) {
		if (this.Enabled || force === true) {
			this.Node.className = "SWUI_" + this.Name + "_" + (this.State === System.Web.UI.HtmlControls.CheckState.Checked ? "On" : "Off") + "_" + mouseState;
			//alert(this.Node.className);
		}
	};
	//---------------------------------------------------------
	// METHOD: SetItemState
	//---------------------------------------------------------
	this.SetItemState = function (buttonState, mouseState) {
		if (mouseState === null) mouseState = "Out";
		this.State = buttonState;
		this.SetItemStyle(mouseState);
	};
	//---------------------------------------------------------
	// INIT: Class
	//---------------------------------------------------------
	this.InitializeClass = function () {
		// Set submited values or default values.
		this.Target = valTarget ? valTarget : document;
		this.id = valId ? valId : this.GetNextId();
		this.State = System.Web.UI.HtmlControls.CheckState.Unchecked;
		// Create HTML Object.
		this.CreateInterface();
		// Init all events;
		this.InitializeEvents(this);
	};
	this.InitializeClass();
};
// Inherit Interface.Button Class.
System.Class.Inherit(System.Web.UI.Interface.Button, System.Web.UI.HtmlControls.HtmlElementContructor);

//-----------------------------------------------------------------------------
// CLASS: ImageButton
//-----------------------------------------------------------------------------

System.Web.UI.Interface.ImageButton = function (id, target, outOffImage, overOffImage, outOnImage, overOnImage) {
	//---------------------------------------------------------
	// Public properties.
	//---------------------------------------------------------
	// Declare type of this class.
	this.Node = null;
	this.IsOver = false;
	this.IsOn = false;
	this.Images = {};
	//---------------------------------------------------------
	// Private properties.
	//---------------------------------------------------------
	var me = this;
	//---------------------------------------------------------
	// EVENTS: public
	//---------------------------------------------------------
	this.RiseEvent = function (e) { if (this[e.Name]) this[e.Name](this, e); };
	//---------------------------------------------------------
	this.OnClick;
	//---------------------------------------------------------
	// METHOD: setImage
	//---------------------------------------------------------
	this.setImage = function (over, on, path) {
		var index = over + 2 * on;
		// 0 - out/off, 1 - over/off, 2 - out/on, 3 - over/on.
		this.Images[index] = new System.Web.UI.Interface.Icon(null, this.Target, path);
	};
	//---------------------------------------------------------
	// METHODS: Mouse Events
	//---------------------------------------------------------
	var image_click = function (sender, e) {
		this.IsOn = !this.IsOn;
		this.UpdateInterface();
		var e1 = new System.EventArgs("OnClick");
		this.RiseEvent(e1);
	};
	var image_mouseover = function (sender, e) {
		this.IsOver = true;
		this.UpdateInterface();
	};
	var image_mouseout = function (sender, e) {
		this.IsOver = false;
		this.UpdateInterface();
	};
	//---------------------------------------------------------
	// INIT: UpdateInterface;
	//---------------------------------------------------------
	this.UpdateInterface = function () {
		var index = this.IsOver + 2 * this.IsOn;
		//alert(index);
		if (this.Node.firstChild) {
			this.Node.replaceChild(this.Images[index].Node, this.Node.firstChild);
		} else {
			this.Node.appendChild(this.Images[index].Node);
		}
	};
	//---------------------------------------------------------
	// INIT: Interface
	//---------------------------------------------------------
	this.InitializeInterface = function (sender, e) {
		this.Node = this.Target.createElement("span");
		// Fill missing images.
		if (!overOffImage) overOffImage = outOffImage;
		if (!outOnImage) outOnImage = overOffImage;
		if (!overOnImage) overOnImage = overOffImage;
		// Create Images.
		if (outOffImage) this.setImage(false, false, outOffImage);
		if (overOffImage) this.setImage(true, false, overOffImage);
		if (outOnImage) this.setImage(false, true, outOnImage);
		if (overOnImage) this.setImage(true, true, overOnImage);
	};
	//---------------------------------------------------------
	// INIT: Events
	//---------------------------------------------------------
	this.InitializeEvents = function (sender, e) {
		for (var property in this.Images) {
			var image = this.Images[property].Node;
			// 0 - out/off, 1 - over/off, 2 - out/on, 3 - over/on.
			// "Click" and "out" is available only on over images.
			if (property === 1 || property === 3) {
				image.onclick = function () { image_click.apply(sender, [sender, null]); };
				image.onmouseout = function () { image_mouseout.apply(sender, [sender, null]); };
			}
			// "Over" is available only on "out" images.
			if (property === 0 || property === 2) {
				image.onmouseover = function () { image_mouseover.apply(sender, [sender, null]); };
			}
		}
		this.UpdateInterface();
	};
	//---------------------------------------------------------
	// INIT: Class
	//---------------------------------------------------------
	this.InitializeClass = function () {
		// Set target where to create objects.
		this.id = id ? id : this.GetType().Name;
		this.Target = target ? target : document;
		this.InitializeInterface(this, null);
		this.InitializeEvents(this, null);
	};
	this.InitializeClass();
};

//-----------------------------------------------------------------------------
// CLASS: Icon
//-----------------------------------------------------------------------------

// Create Icon
System.Web.UI.Interface.Icon = function (valId, valTarget, valFile, valClassName, valWidth, valHeight) {
	//---------------------------------------------------------
	// Public properties.
	//---------------------------------------------------------
	// Declare type of this class.
	this.id;
	this.Node;
	this.Target;
	this.Size;
	this.Enabled;
	this.customAction;
	//---------------------------------------------------------
	// Private properties.
	//---------------------------------------------------------
	var me = this;
	var _imageWidth = "";
	var _imageHeight = "";
	//---------------------------------------------------------
	// METHOD: CreateInterface
	//---------------------------------------------------------
	this.CreateInterface = function () {
		var image = this.Target.createElement("IMG");
		image.id = this.id;
		// Set with and hight if supplied.
		if (_imageWidth) image.width = _imageWidth;
		if (_imageHeight) image.height = _imageHeight;
		image.border = 0;
		image.unselectable = "on";
		// Configure Some options.
		this.Node = image;
		if (valFile) this.SetImage(valFile);
		if (valClassName) image.className = valClassName;
	};
	//---------------------------------------------------------
	// METHOD: SetImage
	//---------------------------------------------------------
	this.SetImage = function (valFilePath) {
		this.Node.src = new String(valFilePath);
		// Make image transparent.
		if (this.Node.src.indexOf(".png") > -1 && this.Node.runtimeStyle) {
			this.Node.runtimeStyle.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + this.Node.src + "')";
			this.Node.src = "/Images/Transparent.gif";
		}
		this.InitializeEvents(this);
	};
	//---------------------------------------------------------
	// METHOD: Click
	//---------------------------------------------------------
	this.Click = function () {
		Trace.Write(this.id + "Click() // Enabled = " + this.Enabled);
		if (this.Enabled) {
			if (this.customAction) {
				var e = new System.EventArgs("click");
				this.customAction(this, e);
			}
		}
	};
	//---------------------------------------------------------
	// INIT: Events
	//---------------------------------------------------------
	this.InitializeEvents = function () {
		me.Node.onclick = function () { me.Click(); };
		//this.Node.onmouseover = function(){valObject.MouseOver()};
		//this.Node.onmouseout = function(){valObject.MouseOut()};
	};
	//---------------------------------------------------------
	// INIT: Class
	//---------------------------------------------------------
	this.InitializeClass = function () {
		// Set target where to create objects.
		this.id = valId ? valId : this.GetType().Name;
		_imageWidth = valWidth ? valWidth : 16;
		_imageHeight = valHeight ? valHeight : _imageWidth;
		if (valWidth === "auto") _imageWidth = null;
		if (valHeight === "auto") _imageHeight = null;
		this.Target = valTarget ? valTarget : document;
		this.CreateInterface();
		this.InitializeEvents();
	};
	this.InitializeClass();
};

// Inherit Interface.Button Class.
System.Class.Inherit(System.Web.UI.Interface.Icon, System.Web.UI.HtmlControls.HtmlElementContructor);

//-----------------------------------------------------------------------------
// Control: HtmlControls.Table
//-----------------------------------------------------------------------------

// Create Table.
System.Web.UI.Interface.Table = function (valRows, valColumns, valId, valClassName, valTarget, valCreateHead, valCreateBody, valCreateFoot) {
	// Declare type of this class.
	this.id;
	this.Node;
	this.THead;
	this.TBody;
	this.TFoot;
	this.Target;
	this.ColumnsCount;
	this.DataSource;
	// Declare private variables.
	var _className = "";
	var _createHead = false;
	var _createBody = false;
	var _createFoot = false;
	//---------------------------------------------------------
	// METHOD: DataBind
	//---------------------------------------------------------
	this.DataBind = function () {
		this.FillFromArray(this.DataSource, "", false);
	};
	//---------------------------------------------------------
	// METHOD: FromArray
	//---------------------------------------------------------
	this.FillFromArray = function (array, className, invert) {
		// Calculate number of rows.
		var cols = this.ColumnsCount;
		var rows = (array.length - array.length % cols) / cols;
		if (array.length % cols > 0) rows += 1;
		// Create table.
		for (var r = 0; r < rows; r++) {
			var row = this.Target.createElement("tr");
			this.TBody.appendChild(row);
			for (var c = 0; c < cols; c++) {
				var cell = this.Target.createElement("td");
				if (c === 0) cell.className = className + "CellLeft";
				if (c > 0 && c < cols - 1) cell.className = className + "CellCenter";
				if (c === cols - 1) cell.className = className + "CellRight";
				row.appendChild(cell);
				// Calculate item index in array;
				var idx = r + c * rows;
				if (idx < array.length) {
					if (invert === true) {
						idx = array.length - 1 - idx;
					}
					cell.innerHTML = array[idx];
				}
			}
		}
		return this.Node;
	};
	//---------------------------------------------------------
	// METHOD: CreateInterface
	//---------------------------------------------------------
	this.CreateInterface = function () {
		// Create Table.
		var objTable = this.Target.createElement("table");
		objTable.border = 0;
		objTable.cellPadding = 0;
		objTable.cellSpacing = 0;
		objTable.id = this.id;
		objTable.className = _className;
		var c;
		var row;
		if (_createHead === true) {
			// Create head row.
			var thead = this.Target.createElement("thead");
			thead.className = _className + "_THead";
			objTable.appendChild(thead);
			row = this.Target.createElement("tr");
			thead.appendChild(row);
			for (c = 0; c < valColumns; c++) {
				row.appendChild(this.Target.createElement("th"));
			}
		}
		if (_createBody === true) {
			// Create body row.
			var tbody = this.Target.createElement("tbody");
			tbody.className = _className + "_TBody";
			objTable.appendChild(tbody);
			for (var r = 0; r < valRows; r++) {
				row = this.Target.createElement("tr");
				tbody.appendChild(row);
				for (c = 0; c < valColumns; c++) {
					row.appendChild(this.Target.createElement("td"));
				}
			}
		}
		if (_createFoot === true) {
			// Create foot row.
			var tfoot = this.Target.createElement("tfoot");
			tfoot.className = _className + "_TFoot";
			objTable.appendChild(tfoot);
			row = this.Target.createElement("tr");
			tfoot.appendChild(row);
			for (c = 0; c < valColumns; c++) {
				row.appendChild(this.Target.createElement("td"));
			}
		}
		// Configure Some options.
		this.Node = objTable;
		this.THead = this.Node.tHead;
		this.TBody = this.Node.tBodies[0];
		this.TFoot = this.Node.tFoot;
		this.Cells = this.GetBoxCells(this.Node);
	};
	//---------------------------------------------------------
	this.Cell = function (rowIndex, columnIndex, table) {
		var t = table ? table : this.Node;
		return t.tBodies[0].rows[rowIndex].childNodes[columnIndex];
	};
	//---------------------------------------------------------
	this.GetBoxCells = function (table) {
		if (table.tBodies.length > 0)
			if (table.tBodies[0].rows.length) {
				var r = table.tBodies[0].rows.length;
				var c = table.tBodies[0].rows[0].childNodes.length;
				if (r === 3 && c === 3) {
					// Get cells of 3x3 table;
					var cells = {};
					cells.TL = this.Cell(0, 0, table);
					cells.TC = this.Cell(0, 1, table);
					cells.TR = this.Cell(0, 2, table);
					cells.ML = this.Cell(1, 0, table);
					cells.MC = this.Cell(1, 1, table);
					cells.MR = this.Cell(1, 2, table);
					cells.BL = this.Cell(2, 0, table);
					cells.BC = this.Cell(2, 1, table);
					cells.BR = this.Cell(2, 2, table);
					return cells;
				}
			}
	};
	//---------------------------------------------------------
	// INIT: Class
	//---------------------------------------------------------
	this.InitializeClass = function () {
		// Set target where to create objects.
		this.ColumnsCount = valColumns;
		this.id = valId;
		// Set default values;
		_createHead = System.Bool.IsBoolean(valCreateHead) ? valCreateHead : false;
		_createBody = System.Bool.IsBoolean(valCreateBody) ? valCreateBody : true;
		_createFoot = System.Bool.IsBoolean(valCreateFoot) ? valCreateFoot : false;
		_className = valClassName ? valClassName : "";
		this.Target = valTarget ? valTarget : document;
		this.CreateInterface();
	};
	this.InitializeClass();
};


// Create Icon
System.Web.UI.Interface.HelpHeader = function (id, target, subject, body, imagePath) {
	// Declare type of this class.
	this.Name = "HelpHeader";
	this.id = "";
	this.Node = null;
	this.Target = null;
	this.CellLeft = null;
	this.CellRight = null;
	this.TitleNode = null;
	this.CategoryNode = null;
	this.SubjectNode = null;
	this.BodyNode = null;
	this.Icon = null;
	this.CssPrefix = "";
	//---------------------------------------------------------
	// Private properties.
	//---------------------------------------------------------
	var me = this;
	//---------------------------------------------------------
	// PROPERTY: Category
	//---------------------------------------------------------
	this.Category = "";
	this.setCategory = function (s) {
		this.Category = s;
		if (this.CategoryNode) this.CategoryNode.innerHTML = s + ":";
	};
	//---------------------------------------------------------
	// PROPERTY: Subject
	//---------------------------------------------------------
	this.Subject = "";
	this.setSubject = function (s) {
		this.Subject = s;
		if (this.SubjectNode) this.SubjectNode.innerHTML = s;
	};
	//---------------------------------------------------------
	// METHOD: SaveDefault
	//---------------------------------------------------------
	this.Default = {};
	this.Default.Category = "";
	this.Default.Subject = "";
	this.Default.Body = "";
	this.Default.IconFile = "";
	this.SaveDefault = function () {
		for (var property in this.Default) {
			this.Default[property] = this[property];
		}
	};
	//---------------------------------------------------------
	// METHOD: LoadDefault
	//---------------------------------------------------------
	this.LoadDefault = function () {
		for (var property in me.Default) {
			me["set" + property](me.Default[property]);
		}
	};
	//---------------------------------------------------------
	// METHOD: AttachDefaultEvents
	//---------------------------------------------------------
	this.AttachDefaultEvents = function () {
		var links = document.getElementsByTagName("a");
		//alert(links.length);
		for (var i = 0; i < links.length; i++) {
			if (window.ActiveXObject) {
				links[i].attachEvent("onclick", me.LoadDefault);
			} else {
				links[i].addEventListener("click", me.LoadDefault, true);
			}
		}
	};
	//---------------------------------------------------------
	this.AddEvent = function (id, helpText, shortcutText) {
		/// <summary>
		/// Function to add dynamic help.
		/// </summary>
		var shortcutHtml = "";
		if (shortcutText !== null) {
			shortcutHtml = " <span style=\"color: #808000;\">Shortcut: " + shortcutText + "</span>";
		}
		var helpHtml = "<span style=\"color: #008000;\">Help:</span> <span style=\"color: #000000;\">" + helpText + "</span>" + shortcutHtml;
		Events.Add(id, "mouseover", new System.EventHandler(this, function () { me.setBody(helpHtml); }), false);
		Events.Add(id, "mouseout", new System.EventHandler(this, function () { me.setBody(""); }), false);
		return shortcutHtml;
	};
	//---------------------------------------------------------
	// PROPERTY: Body
	//---------------------------------------------------------
	this.Body = "";
	this.setBody = function (s) {
		this.Body = s;
		if (this.BodyNode) {
			if (s.length === 0) s = this.Default.Body;
			if (s.indexOf("Help:") === 0) {
				s = s.replace("Help:", "<span style=\"color: #008000;\">Help:</span>");
			}
			if (s.indexOf("Warning:") === 0) {
				s = s.replace("Warning:", "<span style=\"color: orange;\">Warning:</span>");
			}
			this.BodyNode.innerHTML = s;
		}
	};
	//---------------------------------------------------------
	// METHOD: SetImage
	//---------------------------------------------------------
	this.IconFile = "";
	this.setIconFile = function (filePath) {
		this.IconFile = filePath;
		if (this.Icon) this.Icon.SetImage(filePath);
	};
	//---------------------------------------------------------
	// METHOD: SetImage
	//---------------------------------------------------------
	this.SetInfo = function (subject, body, imageFile) {
		if (subject) this.setSubject(subject);
		if (body) this.setBody(body);
		if (imageFile) this.setIconFile(imageFile);
	};
	//---------------------------------------------------------
	// METHOD: CreateInterface
	//---------------------------------------------------------
	this.CreateInterface = function () {
		// Create Table.
		var table = new System.Web.UI.Interface.Table(1, 2, this.id, "SWUI_" + this.Name, this.Target, false, true, false);
		this.CellLeft = table.TBody.rows[0].childNodes[0];
		this.CellRight = table.TBody.rows[0].childNodes[1];
		this.CellLeft.className = this.CssPrefix + "_CellLeft";
		this.CellRight.className = this.CssPrefix + "_CellRight";
		// Cteate Title Node
		this.TitleNode = this.Target.createElement("div");
		this.CellLeft.appendChild(this.TitleNode);
		// Create Category node.
		this.CategoryNode = this.Target.createElement("span");
		this.CategoryNode.className = this.CssPrefix + "_Category";
		this.TitleNode.appendChild(this.CategoryNode);
		// Create subject node.
		this.SubjectNode = this.Target.createElement("span");
		this.SubjectNode.className = this.CssPrefix + "_Subject";
		this.TitleNode.appendChild(this.SubjectNode);
		// Create body node.
		this.BodyNode = this.Target.createElement("div");
		this.BodyNode.className = this.CssPrefix + "_Body";
		this.CellLeft.appendChild(this.BodyNode);
		// Create Icon.
		this.Icon = new System.Web.UI.Interface.Icon(null, this.Target, null, this.CssPrefix + "_Icon", 48, 48);
		this.CellRight.appendChild(this.Icon.Node);
		this.setIconFile(imagePath);
		// Make nodes public.
		this.Node = table.Node;
		if (subject) this.setSubject(subject);
		if (body) this.setBody(body);
	};
	//---------------------------------------------------------
	// INIT: Class
	//---------------------------------------------------------
	this.InitializeClass = function () {
		// Set target where to create objects.
		this.Target = target ? target : document;
		this.id = id ? id : this.GetNextId();
		this.CssPrefix = "SWUI_" + this.Name;
		this.CreateInterface();
	};
	this.InitializeClass();
};
System.Class.Inherit(System.Web.UI.Interface.HelpHeader, System.Web.UI.HtmlControls.HtmlElementContructor);


//-----------------------------------------------------------------------------
// Control: Interface.StringArrayInput
//-----------------------------------------------------------------------------

System.Web.UI.Interface.ArrayInput = function (id, target, inputId) {
	//---------------------------------------------------------
	// Public properties.
	//---------------------------------------------------------
	this.DataSource = {};
	this.Node = null;
	this.Delimeter = ", ";
	//---------------------------------------------------------
	// Private properties.
	//---------------------------------------------------------
	var me = this;
	// Regular expressions for replacements.
	var rxComa = new RegExp(",", "g");
	var rxSemi = new RegExp(";", "g");
	//---------------------------------------------------------
	// METHOD: RemoveItem
	//---------------------------------------------------------
	this.RemoveItem = function (item, onlyOne) {
		var array = this.ToArray();
		for (var i = array.length - 1; i >= 0; i--) {
			if (item === array[i]) {
				array.splice(i, 1);
				if (onlyOne === true) break;
			}
		}
		this.DataSource.value = array.join(this.Delimeter);
	};
	//---------------------------------------------------------
	// METHOD: AddItem
	//---------------------------------------------------------
	this.AddItem = function (item, unique) {
		if (unique === true) this.RemoveItem(item);
		var array = this.ToArray();
		array.push(item);
		this.DataSource.value = array.join(this.Delimeter);
	};
	//---------------------------------------------------------
	// METHOD: ToArray
	//---------------------------------------------------------
	this.ToArray = function () {
		var values = "";
		if (typeof this.DataSource === "string") {
			values = this.DataSource;
		} else {
			values = this.DataSource.value;
		}
		values = values.replace(rxSemi, ",");
		var list = values.split(",");
		var results = [];
		for (var i = 0; i < list.length; i++) {
			var item = System.Text.Trim(list[i], " ");
			if (item.length > 0) results.push(item);
		}
		return results;
	};
	//---------------------------------------------------------
	// METHOD: DataBind
	//---------------------------------------------------------
	this.DataBind = function () {
	};
	//---------------------------------------------------------
	// INIT: Interface
	//---------------------------------------------------------
	this.InitializeInterface = function (sender, e) {
	};
	//---------------------------------------------------------
	// INIT: Events
	//---------------------------------------------------------
	this.InitializeEvents = function (sender, e) {
	};
	//---------------------------------------------------------
	// INIT: Class
	//---------------------------------------------------------
	this.InitializeClass = function () {
		this.Target = target ? target : document;
		// Set submited values or default values.
		this.id = id ? id : this.GetNextId();
		this.DataSource = inputId ? this.Target.getElementById(inputId) : null;
		if (typeof node !== "undefined") {
			this.InitializeInterface(this);
			// Init all events;
			this.InitializeEvents(this);
		}
	};
	this.InitializeClass();
};
System.Class.Inherit(System.Web.UI.Interface.ArrayInput, System.Web.UI.HtmlControls.HtmlElementContructor);

//==============================================================================
// Control: AutoText
//------------------------------------------------------------------------------

//// Create AutoText object.
//var autoText = new System.Web.UI.Interface.AutoText();
//// Add AutoText events to Input.
//autoText.Add("TextInput1", "<enter search text here>");
//// Remove AutoText events to Input.
//autoText.Remove("TextInput1");

System.Web.UI.Interface.AutoText = function () {
	var CssClassAdd = new String("AutoText");
	var SpanTextAdd = new String("AutoText");
	// Add events to TextBox
	this.Add = function (strValId, strValText) {
		var objTextBox = document.getElementById(strValId);
		if (objTextBox.value.length === 0 || objTextBox.value === strValText) {
			// Style add.
			var newClass = objTextBox.className + " " + CssClassAdd;
			objTextBox.className = newClass;
			// Add Text
			objTextBox.value = strValText;
		}
		var objSpan = document.createElement("INPUT");
		objSpan.id = strValId + SpanTextAdd;
		objSpan.value = strValText;
		objSpan.style.display = "none";
		// If browser is Internet Explorer.
		if (browser.IsIE) {
			objTextBox.insertAdjacentElement("afterEnd", objSpan);
			// Add events.
			objTextBox.attachEvent("onfocus", this.TextBoxOnfocus);
			objTextBox.attachEvent("onblur", this.TextBoxOnblur);
			objTextBox.attachEvent("onafterupdate", this.TextBoxOnchange);
		} else {
			document.body.appendChild(objSpan);
			// Add events.
			objTextBox.addEventListener("focus", this.TextBoxOnfocus, true);
			objTextBox.addEventListener("blur", this.TextBoxOnblur, true);
			objTextBox.addEventListener("change", this.TextBoxOnchange, true);
		}
	};
	// Remove events from TtextBox.
	this.Remove = function (strValId) {
		var objTextBox = document.getElementById(strValId);
		var objSpan = document.getElementById(strValId + SpanTextAdd);
		strText = objSpan.value;
		if (objTextBox.value === strText) objTextBox.value = "";
		// Style remove.
		//var regex = new RegExp(CssClassAdd,"g");
		//var rtrim = new RegExp("[ ]+$","g");
		//var newClass = objTextBox.className.replace(regex,"");
		//var newClass = newClass.replace(rtrim,"");
		//objTextBox.className = newClass;
		CheckThisBox(objTextBox);
		// If browser is Internet Explorer.
		if (browser.IsIE) {
			// Remove events.
			objTextBox.detachEvent("onfocus", this.TextBoxOnfocus);
			objTextBox.detachEvent("onblur", this.TextBoxOnblur);
			objTextBox.detachEvent("onafterupdate", this.TextBoxOnchange);
			// Remove SPAN.
			objSpan.removeNode(true);
		} else {
			// Remove events.
			objTextBox.removeEventListener("focus", this.TextBoxOnfocus, true);
			objTextBox.removeEventListener("blur", this.TextBoxOnblur, true);
			objTextBox.removeEventListener("change", this.TextBoxOnchange, true);
			// Remove SPAN.
			document.body.removeChild(objSpan);
		}
	};
	// Run this on focus.
	this.TextBoxOnfocus = function (valEvent) {
		//try{
		// Get event.
		var e = window.event ? window.event : valEvent;
		// Get source element (IE or other browsers).
		var objTextBox = e.srcElement ? e.srcElement : e.target;
		var objSpan = document.getElementById(objTextBox.id + SpanTextAdd);
		if (objTextBox.value === objSpan.value) {
			//setTimeout("document.getElementById('"+objTextBox.id+"').value = ''",1000);
			//alert(objTextBox.autocomplete);
			objTextBox.value = "";
		} else {
			// Select text inside TextBox
			objTextBox.select();
		}
		// check style.
		CheckThisBox(objTextBox);
		//}catch(e){
		//document.getElementById("Log").innerHTML = "2: "+e.message;
		//}
		//document.getElementById("Log").innerHTML = "'"+objTextBox.className+"'";
	};
	// Run this on blur.
	this.TextBoxOnblur = function (valEvent) {
		//Enable error handling (and hidde error messages).
		try {
			// Get event.
			var e = valEvent ? valEvent : window.event;
			// Get source element (IE or other browsers).
			var objTextBox = e.srcElement ? e.srcElement : e.target;
			var objSpan = document.getElementById(objTextBox.id + SpanTextAdd);
			strText = objSpan.value;
			if (objTextBox.value === "") {
				// Style add.
				CheckThisBox(objTextBox, true);
				// Change text.
				objTextBox.value = strText;
			}
		} catch (e) {
			//document.getElementById("Log").innerHTML = "2: "+e.message;
		}
		//document.getElementById("Log").innerHTML = "'"+objTextBox.className+"'";
	};
	function CheckThisBox(valTextBox, valAddStyle) {
		var objSpan = document.getElementById(valTextBox.id + SpanTextAdd);
		var newClass = "";
		// If textbox contais info text then set style.
		if (valTextBox.value === objSpan.value || valAddStyle === true) {
			// Style add.
			newClass = valTextBox.className + " " + CssClassAdd;
			valTextBox.className = newClass;
		} else {
			// Style remove.
			var regex = new RegExp(CssClassAdd, "g");
			var rtrim = new RegExp("[ ]+$", "g");
			newClass = valTextBox.className.replace(regex, "");
			newClass = newClass.replace(rtrim, "");
			valTextBox.className = newClass;
		}
	}
	// Run this on change.
	this.TextBoxOnchange = function (valEvent) {
		//Enable error handling (and hidde error messages).
		try {
			// Get event.
			var e = valEvent ? valEvent : window.event;
			// Get source element (IE or other browsers).
			var objTextBox = e.srcElement ? e.srcElement : e.target;
			// Check Style
			CheckThisBox(objTextBox);
			//alert(objTextBox.value);
		} catch (e) {
			//document.getElementById("Log").innerHTML = "2: "+e.message;
		}
		//document.getElementById("Log").innerHTML = "'"+objTextBox.className+"'";
	};
};

//==============================================================================
// END
//------------------------------------------------------------------------------
