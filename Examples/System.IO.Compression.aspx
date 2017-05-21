<%@ Page Language="C#" AutoEventWireup="true" MasterPageFile="SiteExamples.Master"
	Title="System.IO.Compression"
	CodeFile="System.IO.Compression.aspx.cs"
	Inherits="Scripts.Classes.Examples.System_IO_Compression" %>

<asp:Content ID="HeadContent" ContentPlaceHolderID="HeadContentPlaceHolder" runat="server">
</asp:Content>
<asp:Content ID="BodyContent" ContentPlaceHolderID="BodyContentPlaceHolder" runat="server">
	<table border="0" cellpadding="0" cellspacing="4" class="DebugTable">
		<tr>
			<td>Decompressed:<br />
				<asp:TextBox ID="DecompressedTextBox" Columns="64" Rows="6" runat="server" TextMode="MultiLine" />
			</td>
		</tr>
		<tr>
			<td>
				<asp:Button ID="CompressButton" Text="Compress" CssClass="SWUI_Prg" runat="server"
					OnClick="CompressButton_Click" />
				<asp:Button ID="DecompressButton" Text="Decompress" CssClass="SWUI_Prg" runat="server"
					OnClick="DecompressButton_Click" />
			</td>
		</tr>
		<tr>
			<td>Compressed:<br />
				<asp:TextBox ID="CompressedTextBox" Columns="64" Rows="6" runat="server" TextMode="MultiLine" />
			</td>
		</tr>
	</table>
	<asp:TextBox ID="LogTextBox" runat="server" Height="200px" TextMode="MultiLine" Width="100%" /></div>
</asp:Content>
