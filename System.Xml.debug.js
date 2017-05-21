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
//		<RootNamespace>System.Xml</RootNamespace>
// <PropertyGroup>
//-----------------------------------------------------------------------------
System.Type.RegisterNamespace("System.Xml.Node");
//=============================================================================
// System.Xml
//-----------------------------------------------------------------------------

//Using XSLT to Filter and Sort Records in the Browser
//http://johnvey.com/features/deliciousdirector/xslt-filter-sort.html

System.Xml.PathToShema = "child::*[name()='DataSet']/child::*[name()='xs:shema']";
// System.Xml.PathToData = "child::*[name()='DataSet']/child::*[name()='diffgr:diffgram']";
System.Xml.PathToData = "child::*[name()='DataSet']/child::*[name()='diffgr:diffgram']";
// If DataSet was returned thru webservices use this line.
// If .AcceptChanges() on dataset was not executed then dataset also returns data difference attribute.
System.Xml.PathToDataDiff = "child::*[name()='DataSet']/child::*[name()='diffgr:diffgram']";

System.Xml.Node.parseString = function (node, name) {
	/// <summary>
	/// 
	/// </summary>
	// If name was submited then get sub node by name.
	// Note: Don't add "/text()" to name as it will crop text!!!
	if (name) node = node.selectSingleNode(name);
	var results = "";
	if (node !== null) {
		switch (typeof node.nodeValue) {
			case "object":
				// Use: var nodeValue = System.Xml.Node.parseString(items[i].selectSingleNode("Name"));
				//Mozilla has many textnodes with a size of 4096 chars each instead of one large one.
				//They all need to be concatenated.
				for (var j = 0; j < node.childNodes.length; j++) {
					results += node.childNodes.item(j).nodeValue;
				}
				break;
			// Use: var nodeValue = System.Xml.Node.parseString(items[i].selectSingleNode("Name/text()")); 
			case "string":
				results = node.nodeValue;
				break;
			case "undefined":
				break;
		}
	}
	return results;
};

System.Xml.Node.parseInt = function (node, name) {
	/// <summary>
	/// 
	/// </summary>
	// If name was submited then get sub node by name.
	//alert(node.nodeValue);
	if (name) node = node.selectSingleNode(name + "/text()");
	if (node === null) {
		return 0;
	} else {
		return parseInt(node.nodeValue);
	}
};

System.Xml.Node.parseUtcDate = function (node, name) {
	/// <summary>
	/// 
	/// </summary>
	// If name was submited then get sub node by name.
	if (name) node = node.selectSingleNode(name + "/text()");
	if (node === null) {
		return null;
	} else {
		return new Date().GetFromUtcString(node.nodeValue);
	}
};

System.Xml.Node.parseDateTime = function (node, name) {
	/// <summary>
	/// 
	/// </summary>
	// If name was submited then get sub node by name.
	if (name) node = node.selectSingleNode(name + "/text()");
	if (node === null) return null;
	if (node.nodeValue === null) return null;
	return new Date().GetFromUtcString(node.nodeValue);
};

System.Xml.Node.parseBool = function (node, name) {
	/// <summary>
	/// 
	/// </summary>
	// If name was submited then get sub node by name.
	if (name) node = node.selectSingleNode(name + "/text()");
	var results = false;
	if (node !== null) {
		results = System.Bool.Parse(node.nodeValue);
	}
	return results;
};


System.Xml.Validate = function (fileName) {
	/// <summary>
	/// 
	/// </summary>
	// Create an XML DOMDocument object.
	var x = new ActiveXObject("MSXML2.DOMDocument");
	//Load and validate the specified file into the DOM.
	x.async = false;
	x.validateOnParse = true;
	x.resolveExternals = true;
	x.load(fileName);

	// Return validation results in message to the user.
	if (x.parseError.errorCode !== 0) {
		return "Validation failed on " + strFile +
			"\n=====================" +
			"\nReason: " + x.parseError.reason +
			"\nSource: " + x.parseError.srcText +
			"\nLine: " + x.parseError.line + "\n";
	} else {
		return "Validation succeeded for " + strFile +
			"\n======================\n" +
			x.xml + "\n";
	}
};

System.Xml.XmlRequest = function (forceXml) {
	/// <summary>
	/// Create XML HTTP Request.
	/// </summary>
	if (window.ActiveXObject) {
		var xmlRequest = new ActiveXObject("Msxml2.XMLHTTP");
		return xmlRequest;
	} else {
		var xmlRequest2 = new XMLHttpRequest();
		// Helps if the response from the server doesn't have an XML mime-type header.
		if (forceXml === true) xmlRequest2.overrideMimeType('text/xml');
		return xmlRequest2;
	}
};

System.Xml.XmlDocument = function (fileName, shemaFileName) {
	/// <summary>
	/// Load XML Document file with XSD Shema file(optional).
	/// </summary>
	var xmlDocument = null;
	var isIe = typeof Response === "object" ? true : window.ActiveXObject;
	if (isIe) {
		xmlDocument = new ActiveXObject("MSXML2.DOMDocument");
		// Pattern-based selection can be based on two standards: XSLT, and XPath.
		// Let's start with the more extensive one, XPath.
		xmlDocument.setProperty("SelectionLanguage", "XPath");
		// Load XML Shema first if specified;
		if (shemaFileName) {
			var xmlShema = new System.Xml.XmlSchema(shemaFileName);
			xmlDocument.schemas = xmlShema;
		}
		// Load XML file.
		if (typeof fileName === "string") {
			xmlDocument.async = false;
			xmlDocument.load(fileName);
		}
	} else {
		xmlDocument = document.implementation.createDocument('', '', null);
		var xmlRequest = new System.Xml.XmlRequest();
		if (typeof fileName === "string") {
			xmlRequest.open("GET", fileName, false);
			xmlRequest.send(null);
			xmlDocument = xmlRequest.responseXML;
		}
	}
	return xmlDocument;
};

System.Xml.XmlNode = function (name, nodes) {
	/// <summary>
	/// 
	/// </summary>
	var topNodeName = name ? name : "Nodes";
	var xmlDocument = new System.Xml.XmlDocument();
	var topNode = xmlDocument.createElement(topNodeName);
	xmlDocument.appendChild(topNode);
	// If array of nodes was passed then add them to document.
	if (typeof nodes === "object") {
		var length = nodes.length;
		for (var i = 0; i < length; i++) {
			topNode.appendChild(nodes[i]);
		}
	}
	return topNode;
};


System.Xml.XslTemplate = function (fileName) {
	/// <summary>
	/// Load XSL Template file.
	/// </summary>
	if (window.ActiveXObject) {
		var xslDocument = new ActiveXObject('MSXML2.FreeThreadedDOMDocument');
		var xslTemplate = new ActiveXObject("Msxml2.XSLTemplate");
		if (fileName) {
			xslDocument.async = false;
			xslDocument.load(fileName);
			xslDocument.setProperty("AllowDocumentFunction", true);
			xslTemplate.stylesheet = xslDocument;
		}
		return xslTemplate;
	} else {
		var xmlRequest = new System.Xml.XmlRequest();
		// Load XML file.
		if (fileName) {
			xmlRequest.open("GET", fileName, false);
			xmlRequest.send(null);
			xslTemplate = xmlRequest.responseXML;
		}
		return xslTemplate;
	}
};

System.Xml.XmlSchema = function (fileName) {
	/// <summary>
	/// Load XSD Shema file.
	/// </summary>
	if (window.ActiveXObject) {
		var xmlSchema = new ActiveXObject("MSXML2.XMLSchemaCache");
		if (fileName) {
			xmlSchema.add("", fileName);
		}
		return xmlSchema;
	} else {
		// This is non IE  part!
		return null;
	}
};

System.Xml.XslProcessor = function (xmlObject, xslObject) {
	/// <summary>
	/// Load XSL Processor file.
	/// </summary>
	this.XmlDocument;
	this.XslTemplate;
	this.XslProcessor;
	// Declare private variables.
	var xmlDocument = xmlObject;
	var xslTemplate = xslObject;
	// Create XML objects if they was submited as file names (strings).
	if (typeof xmlObject === "string") xmlDocument = new System.Xml.XmlDocument(xmlObject);
	if (typeof xslObject === "string") xslTemplate = new System.Xml.xslTemplate(xslObject);
	var xslProcessor; // = new ActiveXObject("Msxml2.IXSLProcessor");
	if (window.ActiveXObject) {
		xslProcessor = xslTemplate.createProcessor();
		xslProcessor.input = xmlDocument;
	} else {
		xslProcessor = new XSLTProcessor();
		xslProcessor.importStylesheet(xslObject);
	}
	this.XmlDocument = xmlDocument;
	this.XslTemplate = xslTemplate;
	this.XslProcessor = xslProcessor;
	//---------------------------------------------------------
	// METHOD: TransformToXmlNode
	//---------------------------------------------------------
	this.TransformToXmlNode = function (target) {
		// Set default target.
		if (target === null) target = document;
		var xmlResults = new System.Xml.XmlDocument();
		if (window.ActiveXObject) {
			// FreeThreaded works slower because parser need to manage concurrent access among threads.
			xmlResults = new ActiveXObject("Msxml2.DOMDocument");
			xmlResults.resolveExternals = false;
			xmlResults.validateOnParse = false;
			xmlResults.async = false;
			//alert("0");
			//this.ClearParameters();
			//alert("1");
			//alert(this.XmlDocument.transformNodeToObject(this.XslTemplate.stylesheet,xmlResults));
			// NOTE!!!: It will not produce an HTML DOM object if only the toplevel element of the result is <html>
			//this.XslTemplate.stylesheet.("AllowDocumentFunction",true);
			selection = xmlResults.selectNodes("//");
			//alert("has children: "+selection.context.xml);
			//xmlResults.children[0].innerHTML = "asda";
			//alert("XML Results: "+typeof(xmlResults.documentElement));
			var tmpDocument = target.createDocumentFragment(xmlResults.xml);

			//alert("A: "+tmpDocument.getElementsByTagName("SPAN").innerHTML);
			//xmlResults.save(tmpDocument);
			//tmpDocument.close();
			//alert("done: "+tmpDocument.documentElement.innerHTML);
			return tmpDocument;
		} else {
			return this.XslProcessor.transformToFragment(this.XmlDocument, target);
		}
	};
	//---------------------------------------------------------
	// METHOD: TransformToNode
	//---------------------------------------------------------
	this.TransformToNode = function (target) {
		// Set default target.
		if (target === null) target = document;
		var xmlResults = new System.Xml.XmlDocument();
		if (window.ActiveXObject) {
			var tmpDiv = target.createElement("div");
			//alert(this.TransformToHtml(target));
			tmpDiv.insertAdjacentHTML("beforeEnd", this.TransformToHtml(target));
			return tmpDiv;
		} else {
			return this.XslProcessor.transformToFragment(this.XmlDocument, target);
		}
	};
	//---------------------------------------------------------
	// METHOD: TransformToHtml
	//---------------------------------------------------------
	this.TransformToHtml = function (target) {
		// Set default target.
		if (target === null) target = document;
		if (window.ActiveXObject) {
			this.XslProcessor.transform();
			return this.XslProcessor.output;
		} else {
			var tmpDiv = target.createElement("div");
			tmpDiv.appendChild(this.TransformToNode(target));
			return tmpDiv.innerHTML;
		}
	};
	//---------------------------------------------------------
	// METHOD: AddParameter
	//---------------------------------------------------------
	this.AddParameter = function (parameterName, parameterValue) {
		if (window.ActiveXObject) {
			this.XslProcessor.addParameter(parameterName, parameterValue, "");
		} else {
			this.XslProcessor.setParameter(null, parameterName, parameterValue);
		}
	};
	//---------------------------------------------------------
	// METHOD: ClearParameters
	//---------------------------------------------------------
	this.ClearParameters = function () {
		if (!window.ActiveXObject) {
			this.XslProcessor.clearParameters();
		}
	};
	//return this.XslProcessor;
};

//==============================================================================
// END
//------------------------------------------------------------------------------