<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="JocysCom.WebSites.WebApp.Scripts.Classes.Documents.Default"
	ValidateRequest="false" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" style="height: 100%;">
<head runat="server">
	<title>Jocys.com JavaScript.NET Class Library Browser</title>
	<link type="text/css" rel="stylesheet" href="../System.Web.UI.Interface.debug.css" />
	<link type="text/css" rel="stylesheet" href="SyntaxHighlighter/styles/shCore.css" />
	<link type="text/css" rel="stylesheet" href="SyntaxHighlighter/styles/shThemeDefault.css" />

	<script type="text/javascript" language="javascript" src="SyntaxHighlighter/scripts/shCore.js"></script>

	<script type="text/javascript" language="javascript" src="../System.debug.js"></script>

	<script type="text/javascript" language="javascript" src="../System.Web.debug.js"></script>

	<script type="text/javascript">
		SyntaxHighlighter.config.clipboardSwf = 'scripts/clipboard.swf';
		SyntaxHighlighter.all();
	</script>

	<script type="text/javascript" language="javascript">
		window.onload = function() {
			var siFrame = document.getElementById("ShowItemFrame");
			var ihLink = document.getElementById("ItemHyperLink");
			var request = System.Web.HttpContext.Current.Request;
			var file = request.GetValue("File", true);
			var item = request.GetValue("Item", true);
			var index = request.GetValue("Index", true);
			if ((file) && (item) && (index)) {
				NavigateTo(file, item, index);
			}
		}

		function NavigateTo(file, item, index) {
			var siFrame = document.getElementById("ShowItemFrame");
			if (file == "Home Page") {
				siFrame.contentWindow.location = "ShowIntro.htm";
			} else {
				siFrame.contentWindow.location = "ShowItem.aspx?File=" + file + "&Item=" + item + "&Index=" + index;
			}

		}

	</script>

	<style type="text/css">
		img
		{
			float: left;
		}
	</style>
</head>
<body class="SWUI_Scroll" style="height: 100%;">
	<form id="form1" runat="server" style="height: 100%;">
	<table border="0" cellpadding="0" cellspacing="0" style="width: 100%; height: 100%;">
		<tr>
			<td colspan="2" class="">
				<div class="SWUI_Help_Header">
					<span class="SWUI_Help_Header_Text">Jocys.com JavaScript.NET Class Library </span>
					<br />
				</div>
			</td>
		</tr>
		<tr>
			<td style="width: 300px; height: 100%;" valign="top">
				<iframe class="" frameborder="0" id="ShowTreeFrame" height="100%" style="height: 100%;
					width: 300px;" src="ShowTree.aspx"></iframe>
			</td>
			<td style="width: 100%; height: 100%;" valign="top">
				<iframe frameborder="0" id="ShowItemFrame" style="width: 100%; height: 100%;" src="ShowIntro.htm">
				</iframe>
			</td>
		</tr>
	</table>
	<asp:PlaceHolder runat="server" ID="DebugPlaceHolder" Visible="False">
		<asp:TextBox ID="ItemsPatternTextBox" runat="server" Width="100%"></asp:TextBox><br />
		<asp:TextBox ID="RegExpTextBox" runat="server" Width="748px">/// &lt;summary&gt;(?:(?!(\r\n\r\n)*?\r\n\r\n).)+&lt;/[a-z]+&gt;\r\ncls\s+=\s+(function|{\r\n).*?\r\n}.*?\r\n\r\n|cls\s+=\s+(function|{\r\n).*?\r\n}.*?\r\n\r\n</asp:TextBox><br />
		<asp:TextBox ID="PatternTextBox" runat="server" Width="748px"></asp:TextBox><br />
		<asp:GridView ID="FilesGridView" runat="server">
		</asp:GridView>
		<br />
		<asp:GridView ID="ObjectsGridView" runat="server">
		</asp:GridView>
	</asp:PlaceHolder>
	</form>
</body>
</html>
