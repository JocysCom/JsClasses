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
//		<RootNamespace>System.Web.UI</RootNamespace>
// <PropertyGroup>
//-----------------------------------------------------------------------------
System.Type.RegisterNamespace("System.Web.UI");
//=============================================================================

/***************************************************************
*  (c) 2003-2004 Jean-Michel Garnier (garnierjm@yahoo.fr)
*  (c) 2005-2006 Evaldas Jocys (evaldas@jocys.com)
*  All rights reserved
*
*  This script is part of the phpXplorer project. The phpXplorer project is
*  free software; you can redistribute it and/or modify
*  it under the terms of the GNU General Public License as published by
*  the Free Software Foundation; either version 2 of the License, or
*  (at your option) any later version.
*
*  The GNU General Public License can be found at
*  http://www.gnu.org/copyleft/gpl.html.
*  A copy is found in the textfile GPL.txt distributed with these scripts.
*
*  This script is distributed in the hope that it will be useful,
*  but WITHOUT ANY WARRANTY; without even the implied warranty of
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*  GNU General Public License for more details.
*
*  This copyright notice MUST APPEAR in all copies of the script!
***************************************************************/

// ---------------------------------------------------------------------------
// --- Name:    Easy DHTML Treeview                                         --
// --- Original idea by : D.D. de Kerf	                                    --
// --- Updated by Jean-Michel Garnier, garnierjm@yahoo.fr                   --
// --- Updated by Evaldas Jocys, evaldas@jocys.com                          --
// ---------------------------------------------------------------------------

//=============================================================================
// CLASS: System.Web.UI.TreeView
//-----------------------------------------------------------------------------

// XHTML = XML + (XSLT + CSS + JS)

System.Web.UI.TreeView = function (target, id, pathToScripts) {
	//---------------------------------------------------------
	// Public properties.
	//---------------------------------------------------------
	this.DataSource = "";
	this.Node;
	this.Processor;
	this.Xsl = null;
	this.Xml = null;
	//---------------------------------------------------------
	// Private properties.
	//---------------------------------------------------------
	var me = this;
	//---------------------------------------------------------
	// EVENTS: public
	//---------------------------------------------------------
	this.RiseEvent = function (e) { if (this[e.Name]) this[e.Name](this, e); };
	//---------------------------------------------------------
	this.OnInit;
	this.OnDataBound;
	//---------------------------------------------------------
	// METHOD: DataBind
	//---------------------------------------------------------
	this.DataBind = function () {
		this.Node = this.Processor.TransformToNode();
	};
	//---------------------------------------------------------
	// METHOD: GetParam
	//---------------------------------------------------------
	this.GetParam = function (key) {
		var path = "child::*//xsl:param[@name='" + key + "']/@select";
		var s = this.Xsl.selectSingleNode(path);
		return s.value;
	};
	//---------------------------------------------------------
	// METHOD: SetParam
	//---------------------------------------------------------
	this.SetParam = function (key, value) {
		var path = "child::*//xsl:param[@name='" + key + "']/@select";
		var s = this.Xsl.selectSingleNode(path);
		s.value = value;
	};
	//---------------------------------------------------------
	// METHOD: InitializeInterface
	//---------------------------------------------------------
	this.InitializeInterface = function (sender, e) {
		var path = pathToScripts ? pathToScripts : "../../Scripts/Classes/System.Web.UI.TreeView";
		var pathToXsl = path + "/System.Web.UI.TreeView.xsl";
		var pathToXml = path + "/System.Web.UI.TreeView.xml";
		this.Xsl = new System.Xml.XslTemplate(pathToXsl);
		this.Xml = new System.Xml.XmlDocument(pathToXml);
		this.Processor = new System.Xml.XslProcessor(this.Xml, this.Xsl);
		this.Node = this.Processor.TransformToNode();
	};
	//---------------------------------------------------------
	// METHOD: InitializeEvents
	//---------------------------------------------------------
	this.InitializeEvents = function (sender, e) {
	};
	//---------------------------------------------------------
	// INIT: Class
	//---------------------------------------------------------
	this.InitializeClass = function () {
		// Set submited values or default values.
		this.Target = target ? target : document;
		this.id = id ? id : null;
		// Initialize interface.
		this.InitializeInterface(this, null);
		// Initialize events.
		this.InitializeEvents(this, null);
		// Rise init event.
		this.RiseEvent(new System.EventArgs("OnInit"));
	};
	this.InitializeClass();
};

System.Web.UI.TreeView.Toggle = function (node) {
	// Get the next tag (read the HTML source)
	var nextDIV = node.nextSibling;
	// find the next DIV
	while (nextDIV.nodeName !== "DIV") {
		nextDIV = nextDIV.nextSibling;
	}
	// Unfold the branch if it isn't visible
	if (nextDIV.style.display === 'none') {
		// Change the image (if there is an image)
		if (node.childNodes.length > 0) {
			if (node.childNodes.item(0).nodeName === "IMG") {
				node.childNodes.item(0).src = System.Web.UI.TreeView.getImagesDirectory(node.childNodes.item(0).src) + "minus.gif";
			}
		}
		nextDIV.style.display = 'block';
	}
	// Collapse the branch if it IS visible
	else {
		// Change the image (if there is an image)
		if (node.childNodes.length > 0) {
			if (node.childNodes.item(0).nodeName === "IMG") {
				node.childNodes.item(0).src = System.Web.UI.TreeView.getImagesDirectory(node.childNodes.item(0).src) + "plus.gif";
			}
		}
		nextDIV.style.display = 'none';
	}
};


System.Web.UI.TreeView.getImagesDirectory = function (source) {
	return source.substring(0, source.lastIndexOf('/') + 1);
};

System.Web.UI.TreeView.Item = function (id, target, type, icon, name, value) {
	//---------------------------------------------------------
	// Public properties.
	//---------------------------------------------------------
	this.Node;
	this.ContainerNode;
	this.Item;
	this.ItemType = ""; // "Folder" of "File"
	//---------------------------------------------------------
	// Private properties.
	//---------------------------------------------------------
	var me = this;
	var pfx = "TW_";
	//---------------------------------------------------------
	// INIT: Interface
	//---------------------------------------------------------
	this.InitializeInterface = function (sender, e) {
		this.Node = this.Target.createElement("div");
		this.Node.className = pfx + this.ItemType;
		this.Item = new System.Web.UI.TreeView.ItemTable(id, this.Target);
		this.Item.SetName(name);
		this.Item.SetValue(value);
		this.Node.appendChild(this.Item.Node);
		switch (this.ItemType) {
			case "File":
				this.Item.SetIcon("/Images/Icons/Favorites.16x16.png");
				break;
			case "Folder":
				this.Item.SetIcon("/Scripts/Classes/System.Web.UI.TreeView/Images/Icons/Folder_false-16x16.png");
				// Add children node;
				this.ContainerNode = this.Target.createElement("div");
				this.ContainerNode.className = pfx + "Container";
				this.Node.appendChild(this.ContainerNode);
				break;
			default:
		}
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
		// Set submited values or default values.
		this.id = id ? id : null;
		this.Target = target ? target : document;
		this.ItemType = type ? type : "file";
		this.InitializeInterface(this, null);
		//this.InitializeEvents(this,null);
	};
	this.InitializeClass();
};

System.Web.UI.TreeView.ItemTable = function (id, target, icon, name, value) {
	//---------------------------------------------------------
	// Public properties.
	//---------------------------------------------------------
	this.Node;
	this.Table;
	this.IdentCell;
	this.IdentImage;
	this.IconCell;
	this.IconImage;
	this.NameCell;
	this.NameLabel;
	this.ValueCell;
	this.ValueLabel;
	//---------------------------------------------------------
	// Private properties.
	//---------------------------------------------------------
	var me = this;
	var pfx = "TW_";
	//---------------------------------------------------------
	// METHOD: SetName
	//---------------------------------------------------------
	this.SetName = function (name) {
		this.NameLabel.innerHTML = name;
	};
	//---------------------------------------------------------
	// METHOD: SetIcon
	//---------------------------------------------------------
	this.SetIcon = function (path) {
		this.IconImage.src = path;
	};
	//---------------------------------------------------------
	// METHOD: SetValue
	//---------------------------------------------------------
	this.SetValue = function (value) {
		var vs = new String(value.length);
		if (vs.length > 0) {
			this.ValueLabel.innerHTML = "[" + value + "]";
		} else {
			this.ValueLabel.innerHTML = "";
		}
	};
	//---------------------------------------------------------
	// INIT: Interface
	//---------------------------------------------------------
	this.InitializeInterface = function (sender, e) {
		this.Table = this.Target.createElement("table");
		this.Node = this.Table;
		this.IdentCell = this.Target.createElement("td");
		this.IdentImage = this.Target.createElement("img");
		this.IconCell = this.Target.createElement("td");
		this.IconImage = this.Target.createElement("img");
		this.NameCell = this.Target.createElement("td");
		this.NameLabel = this.Target.createElement("div");
		this.ValueCell = this.Target.createElement("td");
		this.ValueLabel = this.Target.createElement("div");
		var tbody = this.Target.createElement("tbody");
		var row = this.Target.createElement("tr");
		// Append nodes.
		this.Table.appendChild(tbody);
		tbody.appendChild(row);
		row.appendChild(this.IdentCell);
		row.appendChild(this.IconCell);
		row.appendChild(this.NameCell);
		row.appendChild(this.ValueCell);
		this.IdentCell.appendChild(this.IdentImage);
		this.IconCell.appendChild(this.IconImage);
		this.NameCell.appendChild(this.NameLabel);
		this.ValueCell.appendChild(this.ValueLabel);
		this.IdentImage.src = "http://css/WebResource.axd?d=wZvkaPHHbK_MFQNJMEK-ikdzGXF7hA8ZnzSegLIvkd01&t=632805362451875000";
		// Set styles.
		this.IdentCell.className = pfx + "Cell_Ident";
		this.IconCell.className = pfx + "Cell_Icon";
		this.NameCell.className = pfx + "Cell_Name";
		this.ValueCell.className = pfx + "Cell_Value";
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
		// Set submited values or default values.
		this.id = id ? id : null;
		this.Target = target ? target : document;
		this.InitializeInterface(this, null);
		this.InitializeEvents(this, null);
	};
	this.InitializeClass();

};

//==============================================================================
// END
//------------------------------------------------------------------------------
