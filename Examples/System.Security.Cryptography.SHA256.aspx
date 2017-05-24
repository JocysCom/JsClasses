<%@ Page Language="C#" MasterPageFile="SiteExamples.Master" AutoEventWireup="true"
	Title="System.Security.Cryptography.SHA256"
	CodeBehind="System.Security.Cryptography.SHA256.aspx.cs"
	Inherits="Scripts.Classes.Examples.System_Security_Cryptography_SHA256" %>

<asp:Content ID="HeadContent" ContentPlaceHolderID="HeadContentPlaceHolder" runat="server">
</asp:Content>
<asp:Content ID="BodyContent" ContentPlaceHolderID="BodyContentPlaceHolder" runat="server">
	<asp:Button ID="TestButton" runat="server" Text="Test" OnClick="TestButton_Click" />
	<br />
	<asp:TextBox ID="LogTextBox" runat="server" Height="200px" TextMode="MultiLine" Width="100%" />
</asp:Content>


