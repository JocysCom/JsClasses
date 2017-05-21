<%@ Page Language="C#" AutoEventWireup="true" MasterPageFile="SiteExamples.Master"
	Title="System.BitConverter"
	CodeFile="System.BitConverter.aspx.cs"
	Inherits="Scripts.Classes.Examples.System_BitConverter" %>

<asp:Content ID="HeadContent" ContentPlaceHolderID="HeadContentPlaceHolder" runat="server">
</asp:Content>
<asp:Content ID="BodyContent" ContentPlaceHolderID="BodyContentPlaceHolder" runat="server">
	<div>
		<asp:Button ID="TestButton" runat="server" Text="Test" OnClick="TestButton_Click" />
		<br />
		<asp:TextBox ID="LogTextBox" runat="server" Height="200px" TextMode="MultiLine" Width="100%"></asp:TextBox>
	</div>
</asp:Content>
