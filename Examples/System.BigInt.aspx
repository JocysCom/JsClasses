<%@ Page Language="C#" AutoEventWireup="true" MasterPageFile="SiteExamples.Master"
	Title="System.BigInt"
	CodeFile="System.BigInt.aspx.cs"
	Inherits="JocysCom.WebSites.WebApp.Common.JsClasses.Examples.System_BigInt" %>

<asp:Content ID="HeadContent" ContentPlaceHolderID="HeadContentPlaceHolder" runat="server">
</asp:Content>
<asp:Content ID="BodyContent" ContentPlaceHolderID="BodyContentPlaceHolder" runat="server">
	<div>
		<asp:Button ID="TestButton" runat="server" Text="Test Big Integer" OnClick="TestButton_Click" />
		<br />
		<asp:TextBox ID="LogTextBox" runat="server" Height="240px" TextMode="MultiLine" Width="100%"></asp:TextBox>
	</div>
</asp:Content>
