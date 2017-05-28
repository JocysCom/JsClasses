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
/// <reference path="System.IO.debug.js" />
//=============================================================================
// Namespaces
//-----------------------------------------------------------------------------
// <PropertyGroup>
//		<RootNamespace>System.Web.Mobile</RootNamespace>
// <PropertyGroup>
//-----------------------------------------------------------------------------

System.Web.Mobile = System.Web.Mobile ? System.Web.Mobile : {};
System.Type.RegisterNamespace("System.Web.Mobile");
//=============================================================================

System.Web.Mobile.Url = "http://www.jocys.com/Common/JsClasses/Examples/System.Web.Mobile.asmx";

//=============================================================
// Basic classes
//-------------------------------------------------------------

System.Web.Mobile.KeyValue = function () {
	///<summary>Key Value</summary>
	///<field name="Key" type="String">Key</field>
	///<field name="Value" type="Object">Value</field>
};

System.Web.Mobile.KeyValue = function (key, value) {
	///<summary>Key Value</summary>
	///<field name="Key" type="String">Key</field>
	///<field name="Value" type="Object">Value</field>
	if (arguments.length === 2) {
		this.Key = key;
		this.Value = value;
	}
};

System.Web.Mobile.KeyValue.prototype = {
	Key: null,
	Value: null
};
System.Type.RegisterClass("System.Web.Mobile.KeyValue");

//-------------------------------------------------------------

System.Web.Mobile.KeyValueList = function () {
	this.Load = function (value, decompress) { };
	this.SetValue = function (key, value) { };
	this.GetValue = function (key) { };
	var o = arguments.length === 1 ? arguments[0] : [];
	o.Load = function (value, decompress) {
		var a = System.Web.Mobile.Helper.Decode(value, decompress);
		for (var i = 0; i < a.length; i++) o.push(new System.Web.Mobile.KeyValue(a[i].Key, a[i].Value));
	};
	o.GetKeys = function () {
		var keys = [];
		for (var i = 0; i < o.length; i++) {
			keys.push(o[i].Key);
		}
		return keys;
	};
	o.SetValue = function (key, value) {
		var ser = new System.Web.Script.Serialization.JavaScriptSerializer();
		value = ser.Serialize(value);
		for (var i = 0; i < o.length; i++) {
			if (o[i].Key === key) {
				o[i].Value = value;
				return;
			}
		}
		o.push(new System.Web.Mobile.KeyValue(key, value));
	};
	o.GetValue = function (key) {
		for (var i = 0; i < o.length; i++) {
			if (o[i].Key === key) {
				var value = o[i].Value;
				var ser = new System.Web.Script.Serialization.JavaScriptSerializer();
				value = ser.Deserialize(value);
				return value;
			}
		}
		return null;
	};
	return o;
};
System.Type.RegisterClass("System.Web.Mobile.KeyValueList");

//-------------------------------------------------------------

System.Web.Mobile.DataType = {
	None: 0,
	GetRsaKey: 1,
	SendProfile: 2
};

//-------------------------------------------------------------

System.Web.Mobile.UserProfile = function () {
	///<summary>User profile</summary>
	if (arguments.length === 1) return arguments[0];
	this.Username = "";
	this.Password = "";
	this.FirstName = "";
	this.LastName = "";
	this.Email = "";
	this.Phone = "";
	this.Notes = "";
	this.EncryptedData = "";
	this.EncryptedPass = "";
};
System.Type.RegisterClass("System.Web.Mobile.UserProfile");

//-------------------------------------------------------------

System.Web.Mobile.Card = function () {
	///<summary>Credit/Debit card details.</summary>
	if (arguments.length === 1) return arguments[0];
	this.Type = "";
	this.Name = "";
	this.Number = "";
	this.ValidFrom = "";
	this.ExpiresEnd = "";
	this.EncryptedData = "";
	this.EncryptedPass = "";
};
System.Type.RegisterClass("System.Web.Mobile.Card");

//-------------------------------------------------------------

System.Web.Mobile.Data = {};
// Local Data
System.Web.Mobile.Data.Local = {};
System.Web.Mobile.Data.Local.RsaPublicKey = null;
System.Web.Mobile.Data.Local.Profile = null;
System.Web.Mobile.Data.Local.Card = null;
System.Web.Mobile.Data.Local.Temp = {};
System.Web.Mobile.Data.StorageKey = "System.Web.Mobile.Data.Local";

System.Web.Mobile.Data.Save = function () {
	var data = System.Web.Mobile.Helper.Encode(System.Web.Mobile.Data.Local, true);
	if (typeof localStorage === "function") {
		localStorage.setItem(System.Web.Mobile.Data.StorageKey, data);
	} else {
		System.Web.Cookies.Set(System.Web.Mobile.Data.StorageKey, data, 3650);
	}
	Trace.Write("Local Data Saved");
};

System.Web.Mobile.Data.Load = function () {
	//localStorage.clear();
	//sessionStorage.clear();
	var data;
	try {
		if (typeof localStorage === "function") {
			data = System.Web.Mobile.Helper.Decode(localStorage.getItem(System.Web.Mobile.Data.StorageKey), true);
		} else {
			data = System.Web.Mobile.Helper.Decode(System.Web.Cookies.Get(System.Web.Mobile.Data.StorageKey), true);
		}
	} catch (ex) {
		alert("Failed to Load Local Data: " + ex);
		System.Web.Mobile.Data.Save();
		return false;
	}
	if (data) {
		System.Web.Mobile.Data.Local = data;
		if (System.Web.Mobile.Helper.IsEmpty(System.Web.Mobile.Data.Local.Profile)) System.Web.Mobile.Data.Local.Profile = new System.Web.Mobile.UserProfile();
		if (System.Web.Mobile.Helper.IsEmpty(System.Web.Mobile.Data.Local.Card)) System.Web.Mobile.Data.Local.Card = new System.Web.Mobile.Card();
		if (System.Web.Mobile.Helper.IsEmpty(System.Web.Mobile.Data.Local.Temp)) System.Web.Mobile.Data.Local.Temp = {};
		//Trace.Write("Local Data Loaded");
		return true;
	} else {
		//Trace.Write("Local Data is Empty");
		return false;
	}
};

System.Web.Mobile.DataLoaded = function (sender, e) {
	var compressed = sender === null || sender.Compressed !== false;
	Trace.Write("Got value from Server.");
	var r = new System.Web.Mobile.KeyValueList();
	r.Load(e, compressed);
	if (r.GetValue("ErrorCode") > 0) {
		Trace.Write(r.GetValue("ErrorMessage"));
	} else {
		//var a = System.Class.Properties.ToString(e);
		//alert(r.GetValue("DataType"));
		throw new Exception("Not Implemented. Pleaase override 'System.Web.Mobile.DataLoaded' function in your javascript with your own.");
	}
};

//-------------------------------------------------------------

System.Web.Mobile.Helper = function () { };
System.Type.RegisterClass("System.Web.Mobile.Helper");

//-------------------------------------------------------------

System.Web.Mobile.Helper.IsPhone = function () {
	var deviceAgent = navigator.userAgent.toLowerCase();
	var agentID = deviceAgent.match(/(iphone|ipod|ipad|android|blackberry)/);
	return agentID !== null;
};

//-------------------------------------------------------------

System.Web.Mobile.Helper.IsIphone = function () {
	var deviceAgent = navigator.userAgent.toLowerCase();
	var agentID = deviceAgent.match(/(iphone|ipod|ipad)/);
	return agentID !== null;
};

//-------------------------------------------------------------

System.Web.Mobile.Helper.IsEmpty = function (o) {
	if (typeof o === "undefined") return true;
	return o === null;
};

//-------------------------------------------------------------

System.Web.Mobile.Helper.EmptyGzip = [80, 75, 5, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

System.Web.Mobile.Helper.Compress = function (bytes) {
	Trace.Write("Compress data with DeflateStream class.", 1);
	var len = bytes.length;
	var srcStream = new System.IO.MemoryStream(bytes);
	var dstStream = new System.IO.MemoryStream();
	srcStream.Position = 0;
	var stream = new System.IO.Compression.DeflateStream(dstStream, System.IO.Compression.CompressionMode.Compress);
	srcStream.CopyTo(stream);
	stream.Close();
	bytes = dstStream.ToArray();
	Trace.Write("Ratio: " + Math.round(bytes.length / len * 100, 2) + "%", -1);
	return bytes;
};

System.Web.Mobile.Helper.Decompress = function (bytes) {
	Trace.Write("Decompress data with DeflateStream class.", 1);
	var len = bytes.length;
	var srcStream = new System.IO.MemoryStream(bytes);
	var dstStream = new System.IO.MemoryStream();
	srcStream.Position = 0;
	var stream = new System.IO.Compression.DeflateStream(srcStream, System.IO.Compression.CompressionMode.Decompress);
	stream.CopyTo(dstStream);
	dstStream.Close();
	bytes = dstStream.ToArray();
	Trace.Write("Ratio: " + Math.round(len / bytes.length * 100, 2) + "%", -1);
	return bytes;
};

//-------------------------------------------------------------

System.Web.Mobile.Helper.Encode = function (o, compress) {
	if (typeof o === "undefined") return o;
	var ser = new System.Web.Script.Serialization.JavaScriptSerializer();
	var text = ser.Serialize(o);
	var bytes = System.Text.Encoding.UTF8.GetBytes(text);
	if (compress === true) bytes = System.Web.Mobile.Helper.Compress(bytes);
	var base64 = System.Convert.ToBase64String(bytes);
	return base64;
};

System.Web.Mobile.Helper.Decode = function (s, decompress) {
	if (typeof s === "undefined") return s;
	var bytes = System.Convert.FromBase64String(s);
	if (decompress) bytes = System.Web.Mobile.Helper.Decompress(bytes);
	var text = System.Text.Encoding.UTF8.GetString(bytes);
	var ser = new System.Web.Script.Serialization.JavaScriptSerializer();
	var o = ser.Deserialize(text);
	return o;
};

//-------------------------------------------------------------

System.Web.Mobile.Helper.PostData = function (key, value, compress) {
	value = System.Web.Mobile.Helper.Encode(value, compress);
	var href;
	var partSize = 700;
	if (value === null || typeof value === "undefined") {
		// Just post URL
		href = System.Web.Mobile.Url + "/PostData";
		href += "?key=" + key;
		href += "&value=";
		System.Web.Mobile.Helper.AddScript(href);
	} else {
		// Split value into parts.
		var list = [];
		var remainder = value.length % partSize;
		var parts = (value.length - remainder) / partSize;
		var i;
		for (i = 0; i < parts; i++) {
			list.push(value.substr(i * partSize, partSize));
		}
		if (remainder > 0) list.push(value.substr(value.length - remainder, remainder));
		// Start posting data.
		var state = System.Guid.NewGuid().ToString("N");
		System.Web.Mobile.Helper.CleanMobileScripts();
		if (list.length === 1) {
			href = System.Web.Mobile.Url + "/PostData";
			href += "?key=" + key;
			href += "&value=" + encodeURIComponent(list[0]);
			System.Web.Mobile.Helper.AppendScript(href);
		} else {
			for (i = 0; i < list.length; i++) {
				href = System.Web.Mobile.Url + "/PostDataParts";
				href += "?key=" + key;
				href += "&value=" + encodeURIComponent(list[i]);
				href += "&state=" + state;
				href += "&index=" + i;
				href += "&total=" + list.length;
				System.Web.Mobile.Helper.AppendScript(href);
			}
		}
	}
};

System.Web.Mobile.Helper.PostLogin = function (username, password) {
	var v = new System.Web.Mobile.KeyValue();
	v.Key = username;
	v.Value = password;
	System.Web.Mobile.Helper.PostData(System.Web.Mobile.DataType.SetLogin, v);
};

System.Web.Mobile.Helper.CleanMobileScripts = function () {
	var id = "MobileScript";
	var elements = document.getElementsByTagName("head")[0].getElementsByTagName("script");
	for (var i = 0; i < elements.length; i++) {
		var el = elements[i];
		if (el.id.length >= id.length) el.parentNode.removeChild(el);
	}
};

System.Web.Mobile.Helper.AddScript = function (href) {
	/// <summary>
	/// Dynamically add JavaScript.
	/// </summary>
	/// <returns>void</returns>
	System.Web.Mobile.Helper.CleanMobileScripts();
	System.Web.Mobile.Helper.AppendScript(href);
};

System.Web.Mobile.Helper.AppendScript = function (href) {
	/// <summary>
	/// Dynamically add JavaScript.
	/// </summary>
	/// <returns>void</returns>
	var elements = document.getElementsByTagName("head")[0].getElementsByTagName("script");
	el = document.createElement('script');
	el.id = "MobileScript_" + elements.length;
	el.src = href + "&N=" + System.Guid.NewGuid().ToString("N");
	el.type = "text/javascript";
	document.getElementsByTagName("head")[0].appendChild(el);
};

System.Web.Mobile.Helper.RsaEncrypt = function (s, key) {
	var decryptedBytes = System.Text.Encoding.UTF8.GetBytes(s);
	var doOaepPadding = false;
	var rsa = new System.Security.Cryptography.RSACryptoServiceProvider();
	// Import the RSA Key information.
	rsa.FromXmlString(key);
	// Export RSA key to RSAParameters and include:
	//    false - Only public key required for encryption.
	//    true  - Private key required for decryption.
	// Encrypt the passed byte array and specify OAEP padding.
	var encryptedBytes = rsa.Encrypt(decryptedBytes, doOaepPadding);
	var encryptedString = System.Convert.ToBase64String(encryptedBytes);
	return encryptedString;
};

System.Web.Mobile.Helper.AesEncrypt = function (data, password) {
	return System.Security.Cryptography.AES.Encrypt(data, password);
};

System.Web.Mobile.Helper.AesDecrypt = function (data, password) {
	return System.Security.Cryptography.AES.Decrypt(data, password);
};

System.Web.Mobile.Helper.GetMasked = function (number) {
	if (!number) return "";
	var s = number.replace(new RegExp("[^0-9]", "g"), "");
	if (s.length < 4 + 6) return "";
	var sb = new System.Text.StringBuilder();
	sb.Append(s.substr(0, 6));
	//sb.Append("*", 6);
	sb.Append("*", s.length - 4 - 6);
	sb.Append(s.substr(s.length - 4, 4));
	return sb.ToString();
};

System.Web.Mobile.IsLoaded = true;

//==============================================================================
// END
//------------------------------------------------------------------------------
