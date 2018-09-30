<%@ Page Language="C#" MasterPageFile="SiteExamples.Master" AutoEventWireup="true"
	Title="System.Text.Encoding"
	CodeFile="System.Text.Encoding.aspx.cs"
	Inherits="Scripts.Classes.Examples.System_Text_Encoding" %>

<asp:Content ID="HeadContent" ContentPlaceHolderID="HeadContentPlaceHolder" runat="server">
	<link type="text/css" rel="stylesheet" href="Styles/Default.css" />
</asp:Content>
<asp:Content ID="BodyContent" ContentPlaceHolderID="BodyContentPlaceHolder" runat="server">
	<table class="SQUI_DataTables">
		<tr>
			<td>
				<asp:TextBox ID="ValueTextBox" runat="server" Rows="2" TextMode="MultiLine" Text="AŁउ𐋄" Width="100%" /></td>
		</tr>
		<tr>
			<td>
				<asp:Button ID="TestButton" runat="server" Text="↓ - Test" OnClick="TestButton_Click" />
				<asp:Button ID="ClearButton" runat="server" Text="Clear" OnClick="ClearButton_Click" /></td>
		</tr>
		<tr>
			<td>
				<asp:TextBox ID="LogTextBox" runat="server" Rows="34" TextMode="MultiLine" Width="100%" /></td>
		</tr>
	</table>
</asp:Content>


