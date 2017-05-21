<%@ Page Language="C#" AutoEventWireup="true" MasterPageFile="SiteExamples.Master"
	Title="System.Security.Cryptography.AES"
	CodeFile="System.Security.Cryptography.AES.aspx.cs"
	Inherits="Scripts.Classes.Examples.System_Security_Cryptography_AES" %>

<asp:Content ID="HeadContent" ContentPlaceHolderID="HeadContentPlaceHolder" runat="server">
</asp:Content>
<asp:Content ID="BodyContent" ContentPlaceHolderID="BodyContentPlaceHolder" runat="server">
	<div>
		<table border="0" cellpadding="0" cellspacing="4">
			<tr>
				<td>Data:
				</td>
				<td>
					<asp:TextBox ID="DataTextBox" runat="server" Width="500px">abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789</asp:TextBox>
				</td>
			</tr>
			<tr>
				<td>Password:
				</td>
				<td>
					<asp:TextBox ID="PasswordTextBox" runat="server">password</asp:TextBox>
				</td>
			</tr>
		</table>
		<asp:Button ID="TestAesButton" runat="server" Text="Test AES" OnClick="TestAesButton_Click" />
		<br />
		<asp:TextBox ID="LogTextBox" runat="server" Height="200px" TextMode="MultiLine" Width="100%" />
	</div>
</asp:Content>


