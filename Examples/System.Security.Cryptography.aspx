<%@ Page Language="C#" AutoEventWireup="true" MasterPageFile="SiteExamples.Master"
	Title="System.Security.Cryptography"
	CodeFile="System.Security.Cryptography.aspx.cs"
	Inherits="Scripts.Classes.Examples.System_Security_Cryptography" %>

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
				<td>Salt:
				</td>
				<td>
					<asp:TextBox ID="SaltTextBox" runat="server">saltsalt</asp:TextBox>
				</td>
			</tr>
			<tr>
				<td>Password:
				</td>
				<td>
					<asp:TextBox ID="PasswordTextBox" runat="server">password</asp:TextBox>
				</td>
			</tr>
			<tr>
				<td>Cipher Mode
				</td>
				<td>
					<asp:DropDownList ID="CipherModeDropDownList" runat="server">
					</asp:DropDownList>
				</td>
			</tr>
			<tr>
				<td>Padding Mode
				</td>
				<td>
					<asp:DropDownList ID="PaddingModeDropDownList" runat="server">
					</asp:DropDownList>
				</td>
			</tr>
		</table>
		<asp:Button ID="TestBlockButton" runat="server" Text="Test Block" OnClick="TestBlockButton_Click" />
		<asp:Button ID="TestStreamButton" runat="server" Text="Test Stream" OnClick="TestStreamButton_Click" />
		<br />
		<asp:TextBox ID="LogTextBox" runat="server" Height="400px" TextMode="MultiLine" Width="100%"></asp:TextBox>
	</div>
</asp:Content>
