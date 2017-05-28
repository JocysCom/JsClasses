//=============================================================================
// Jocys.com JavaScript.NET Classes               (In C# Object Oriented Style)
// Created by Evaldas Jocys <evaldas@jocys.com>
//=============================================================================
/// <reference path="System.debug.js" />
//=============================================================================
// Namespaces
//-----------------------------------------------------------------------------
// <PropertyGroup>
//		<RootNamespace>System.Configuration</RootNamespace>
// <PropertyGroup>
//-----------------------------------------------------------------------------

// Make sure that the sub namespace exists.
System.Configuration = System.Configuration ? System.Configuration : {};
System.Type.RegisterNamespace("System.Configuration");

System.Configuration.ConfigurationManager = function () {
	/// <summary>
	/// 
	/// </summary>
	// Declare type of this class.
	this.IsServerSide = new Boolean;
	this.XmlConfig = null;
	this.ObjConfig = null;
	this.FilePath = "";
	//---------------------------------------------------------
	// METHOD: ReadConfig
	//---------------------------------------------------------
	this.ReadConfig = function () {
		var results = false;
		if (this.IsServerSide) {
			// Get Web configuration XML file. NOTE!!!! Web.config is in subfolder.
			this.FilePath = Request.ServerVariables("APPL_PHYSICAL_PATH") + "Web.config";
			//Response.Write(filePath+"<br>");
			// Try to use ActiveX Object first (supports encryption).
			try {
				this.ObjConfig = Server.CreateObject("ActiveX.Charset");
				results = true;
			} catch (ex) {
				// Instantiate the MSXML 3.0 Object that will hold the XML file.
				this.XmlConfig = new ActiveXObject("Msxml2.DOMDocument");
				// Turn off asyncronous file loading.
				this.XmlConfig.async = false;
				// Load the XML document.
				this.XmlConfig.load(this.FilePath);
				if (this.XmlConfig.parseError.errorCode !== 0) {
					// Write out if an error occured.
					Trace.Write("Error: " + this.XmlConfig.parseError.errorCode + ": " + this.XmlConfig.parseError.reason);
				} else {
					results = true;
				}
			}
		}
		return results;
	};
	//---------------------------------------------------------
	// METHOD: ConnectionStrings
	//---------------------------------------------------------
	this.ConnectionStrings = function (key) {
		var results = "";
		var IsSuccess = this.ReadConfig();
		if (IsSuccess) {
			// If we are using object onfig
			if (this.ObjConfig) {
				results = "Provider=MSDASQL; Driver={SQL Server};" + this.ObjConfig.GetConnectionStrings(this.FilePath, key);
			} else {
				var selectNodes = "/configuration/connectionStrings/add[@name='" + key + "']";
				//Trace.Write("Select Nodes: "+selectNodes);
				var objNodes = this.XmlConfig.selectNodes(selectNodes);
				//Trace.Write("Found Nodes: "+objNodes.length);
				for (var i = 0; i < objNodes.length; i++) {
					// Add additional info to convert dotNET connection string to ASP.
					//Provider=MSDASQL; Driver={SQL Native Client} SQL Server
					results = "Provider=MSDASQL; Driver={SQL Server};" + objNodes[i].attributes.getNamedItem("connectionString").text;
					//Trace.Write(results.replace("yM65tro0p$12","&lt;password&gt;"));
				}
			}
		}
		// Replace some .NET keys to ASP keys
		results = results.replace("Data Source", "SERVER");
		results = results.replace("Initial Catalog", "DATABASE");
		results = results.replace("User ID", "UID");
		results = results.replace("Password", "PWD");
		return results;
	};
	//---------------------------------------------------------
	// METHOD: AppSettings
	//---------------------------------------------------------
	// This is server side script to get values from server.
	this.AppSettings = function (key) {
		var results = "";
		var IsSuccess = this.ReadConfig();
		if (IsSuccess) {
			// If we are using object onfig
			if (this.ObjConfig) {
				results = this.ObjConfig.GetAppSettings(this.FilePath, key);
			} else {
				var selectNodes = "/configuration/appSettings/add[@key='" + key + "']";
				//Trace.Write("Select Nodes: "+selectNodes);
				var objNodes = this.XmlConfig.selectNodes(selectNodes);
				//Trace.Write("Found Nodes: "+objNodes.length);
				for (var i = 0; i < objNodes.length; i++) {
					results = objNodes[i].attributes.getNamedItem("value").text;
					//Trace.Write(results.replace("yM65tro0p$12","&lt;password&gt;"));
				}
			}
		}
		return results;
	};
	//---------------------------------------------------------
	// INIT: Class
	//---------------------------------------------------------
	this.InitializeClass = function () {
		//this.CaseName = "CaseNumber";
		this.IsServerSide = false;
		if (typeof Response === "object") this.IsServerSide = true;
		if (this.IsServerSide) { /* */ }
	};
	this.InitializeClass();
};
System.Type.RegisterClass("System.Configuration.ConfigurationManager");

System.ConfigurationManager = new System.Configuration.ConfigurationManager();

//==============================================================================
// END
//------------------------------------------------------------------------------