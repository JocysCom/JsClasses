<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ShowItem.aspx.cs" Inherits="JocysCom.WebSites.WebApp.Scripts.Classes.Documents.ShowItem" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
	<title>Jocys.com JavaScript.NET Class Library Browser</title>
	<link type="text/css" rel="stylesheet" href="../System.Web.UI.Interface.debug.css" />
	<link type="text/css" rel="stylesheet" href="SyntaxHighlighter/styles/shCoreDefault.css"/>
	<link type="text/css" rel="stylesheet" href="SyntaxHighlighter/styles/shThemeDefault.css" />

	<script type="text/javascript" src="../System.debug.js"></script>
	<script type="text/javascript" src="SyntaxHighlighter/scripts/shCore.js"></script>
	<script type="text/javascript" src="SyntaxHighlighter/scripts/shBrushJScript.js"></script>
	<script type="text/javascript" src="SyntaxHighlighter/scripts/shBrushCSharp.js"></script>
	<script type="text/javascript">SyntaxHighlighter.all();</script>
	<script type="text/javascript">
		SyntaxHighlighter.all();
		window.onload = function() {
		}
	</script>
</head>
<body class="SWUI_Scroll">
	<form id="form1" runat="server">
	<div style="padding: 8px 8px 4px 8px;">
		<b>File:</b>
		<asp:HyperLink ID="FileHyperLink" runat="server" CssClass="SWUI_PrgLink">[FileHyperLink]</asp:HyperLink><br />
		<b>Item:</b>
		<asp:Label ID="ItemLabel" runat="server"></asp:Label><br />
		<b>Link:</b>
		<asp:HyperLink ID="ItemHyperLink" runat="server" CssClass="SWUI_PrgLink">[ItemHyperLink]</asp:HyperLink>
	</div>
	<div runat="server" id="ExampleDiv" style="background-color: #cccccc; padding: 8px 8px 4px 8px;">
		<span style="font-weight: bold;">Example</span>
		<iframe runat="server" id="ExampleFrame" style="margin-top: 8px; width: 100%; background-color: #ffffff;
			height: 300px;" frameborder="0"></iframe>
	</div>
	<div style="background-color: #cccccc; padding: 8px 8px 4px 8px;">
		<span style="font-weight: bold;">JavaScript Code</span>
		<pre runat="server" id="CodePre" name="CodePre" class="brush: c-sharp;" style="margin: 0 0 0 0;"></pre>
	</div>
	</form>
</body>
</html>
