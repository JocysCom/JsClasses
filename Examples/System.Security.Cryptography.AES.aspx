<%@ Page Language="C#" AutoEventWireup="true" MasterPageFile="SiteExamples.Master"
	Title="System.Security.Cryptography.AES"
	CodeBehind="System.Security.Cryptography.AES.aspx.cs"
	Inherits="Scripts.Classes.Examples.System_Security_Cryptography_AES" %>

<asp:Content ID="HeadContent" ContentPlaceHolderID="HeadContentPlaceHolder" runat="server">
</asp:Content>
<asp:Content ID="BodyContent" ContentPlaceHolderID="BodyContentPlaceHolder" runat="server">
	<asp:UpdatePanel runat="server" ID="MainUpdatePanel">
		<ContentTemplate>
			<table class="SQUI_DataTables">
				<tbody>
					<tr>
						<td>Password:
						</td>
						<td style="width: 100%;">
							<asp:TextBox Text="password" ID="PasswordTextBox" runat="server" />
						</td>
					</tr>
					<tr>
						<td>Decrypted:</td>
						<td>
							<asp:TextBox TextMode="MultiLine" ID="DecryptedTextBox" Columns="64" Rows="5" runat="server" Text="abcdexyzABCDEXYZ0123456789-新闻网" />
						</td>
					</tr>
					<tr>
						<td></td>
						<td>
							<asp:Button ID="EncryptButton" Text="↓ - Encrypt" runat="server" OnClick="EncryptButton_Click" />
							<asp:Button ID="DecryptButton" Text="↑ - Decrypt" runat="server" OnClick="DecryptButton_Click" />
						</td>
					</tr>
					<tr>
						<td>Encrypted:</td>
						<td>
							<asp:TextBox TextMode="MultiLine" ID="EncryptedTextBox" Columns="64" Rows="5" runat="server" />
						</td>
					</tr>
					<tr>
						<td colspan="2">
								<asp:TextBox ID="LogTextBox" runat="server" Height="200px" TextMode="MultiLine" Width="100%" class="SWUI_LogTextBox" />
						</td>
					</tr>
				</tbody>
			</table>
		</ContentTemplate>
	</asp:UpdatePanel>
</asp:Content>


