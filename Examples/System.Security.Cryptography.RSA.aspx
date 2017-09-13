<%@ Page Language="C#" MasterPageFile="SiteExamples.Master" AutoEventWireup="true"
	ValidateRequest="false"
	Title="System.Security.Cryptography.RSA"
	CodeFile="System.Security.Cryptography.RSA.aspx.cs"
	Inherits="Scripts.Classes.Examples.System_Security_Cryptography_RSA" %>

<asp:Content ID="HeadContent" ContentPlaceHolderID="HeadContentPlaceHolder" runat="server">
</asp:Content>
<asp:Content ID="BodyContent" ContentPlaceHolderID="BodyContentPlaceHolder" runat="server">
	<asp:ScriptManagerProxy runat="server" ID="ScriptManagerProxy1">
		<Scripts>
			<asp:ScriptReference Path="../System.debug.js" />
			<asp:ScriptReference Path="../System.IO.debug.js" />
			<asp:ScriptReference Path="../System.Text.debug.js" />
			<asp:ScriptReference Path="../System.Convert.debug.js" />
			<asp:ScriptReference Path="../System.BitConverter.debug.js" />
			<asp:ScriptReference Path="../System.BigInt.debug.js" />
			<asp:ScriptReference Path="../System.Security.Cryptography.SHA1.debug.js" />
			<asp:ScriptReference Path="../System.Security.Cryptography.debug.js" />
			<asp:ScriptReference Path="../System.Security.Cryptography.RSA.debug.js" />
		</Scripts>
	</asp:ScriptManagerProxy>
	<div>
		<table border="0" cellpadding="0" cellspacing="4">
			<tr>
				<td>Key:
				</td>
				<td>
					<asp:TextBox ID="KeyTextBox" runat="server" Width="500px" TextMode="MultiLine" Rows="10"></asp:TextBox>
				</td>
				<td>
					<asp:DropDownList ID="KeySizeDropDownList" runat="server">
						<asp:ListItem Text="512-bit" Value="512" Selected="True" />
						<asp:ListItem Text="1024-bit" Value="1024" />
						<asp:ListItem Text="2048-bit" Value="2048" />
					</asp:DropDownList>
					<br />
					<asp:Button ID="NewKey" runat="server" Text="New Key" OnClick="NewKeyButton_Click" />
				</td>
			</tr>
			<tr>
				<td></td>
				<td>Padding:
					<asp:DropDownList ID="PaddingDropDownList" runat="server">
						<asp:ListItem Text="OAEP padding (PKCS#1 v2)" Value="OAEP" Selected="True" />
						<asp:ListItem Text="Direct Encryption (PKCS#1 v1.5)" Value="PKCS" />
					</asp:DropDownList>
				</td>
			</tr>
			<tr>
				<td>Data:
				</td>
				<td>
					<asp:TextBox ID="DataTextBox" runat="server" Width="500px">ijklmn_56789</asp:TextBox>
				</td>
				<td>
					<asp:Button ID="EncryptButton" runat="server" Text="↓ - Encrypt" OnClick="EncryptButton_Click" />
					<asp:Button ID="SignButton" runat="server" Text="↓ - Sign" OnClick="SignButton_Click" />
				</td>
			</tr>
			<tr>
				<td>Encrypted:
				</td>
				<td>
					<asp:TextBox ID="EncryptedTextBox" runat="server" Width="500px" TextMode="MultiLine"></asp:TextBox>
				</td>
				<td style="vertical-align: bottom;">
					<asp:Button ID="DecryptButton" runat="server" Text="↓ - Decrypt" OnClick="DecryptButton_Click" />
					<asp:Button ID="VerifyButton" runat="server" Text="↓ - Verify" OnClick="VerifyButton_Click" />
					<asp:Button ID="TestButton" runat="server" Text="Test" OnClick="TestButton_Click" Visible="false" />
				</td>
			</tr>
			<tr>
				<td>Decrypted:
				</td>
				<td>
					<asp:TextBox ID="DecryptedTextBox" runat="server" Width="500px" TextMode="MultiLine"></asp:TextBox>
				</td>
				<td></td>
			</tr>
		</table>
		<br />
		<asp:TextBox ID="LogTextBox" runat="server" Height="100px" TextMode="MultiLine" Width="100%"></asp:TextBox>
	</div>
	<p>
		<b>How to encrypt and submit data securely without Secure Sockets Layer (SSL)</b>
	</p>
	<p>
		Step 1: Server generates RSA key and shows only public key to user.<br />
		<span class="style1">Private RSA key is stored on server side. Only server can decrypt
			submitted data.</span>
	</p>
	<asp:TextBox ID="PublicKeyTextBox" runat="server" TextMode="MultiLine" Rows="3" Columns="64"></asp:TextBox>
	<p>
		Step 2: User enters password:
	</p>
	<asp:TextBox ID="PasswordDataTextBox" runat="server" Width="160px">password123</asp:TextBox>
	<input type="button" value="< Random" id="RandomButton" onclick="return RandomButton_Click(this, null);"
		style="font: menu;" />
	<p>
		Step 3: User hits [Submit] button, JavaScript will encrypt password, replace plain
		text with encrypted Base64 code and submit form.<br />
		<span class="style1">Note: You can use strong password and AES symmetric encryption
			to submit extra data.</span>
	</p>
	<script type="text/javascript">

		function SubmitButton_Click(sender, e) {
			// Get HTML controls.
			var passControl = $("<%= PasswordDataTextBox.ClientID %>");
			var pkeyControl = $("<%= PublicKeyTextBox.ClientID %>");
			// Convert password to bytes.
			var pass = passControl.value;
			var data = System.Text.Encoding.UTF8.GetBytes(pass);
			// Get public key.
			var xmlParams = pkeyControl.value;
			// Create a new instance of RSACryptoServiceProvider.
			var rsa = new System.Security.Cryptography.RSACryptoServiceProvider();
			// Import parameters from xml.
			rsa.FromXmlString(xmlParams);
			// Encrypt data (use OAEP padding).
			var encryptedBytes = rsa.Encrypt(data, true);
			// Convert encrypted data to Base64.
			var encryptedString = System.Convert.ToBase64String(encryptedBytes)
			// Replace plain password with encrypted data.
			passControl.value = encryptedString;
			// Allow to submit.
			return true;
		}

		function RandomButton_Click(sender, e) {
			// Generate random strong password which can be used with AES symetric encryption.
			var passControl = $("<%= PasswordDataTextBox.ClientID %>");
			var rng = new System.Security.Cryptography.RNGCryptoServiceProvider();
			var pass = new Array(8);
			rng.GetBytes(pass);
			passControl.value = System.BitConverter.ToString(pass, "");
		}

	</script>
	<asp:Button runat="server" ID="SubmitButton" Text="Submit" OnClientClick="return SubmitButton_Click(this);"
		OnClick="SubmitButton_Click" />
	<asp:Label runat="server" ID="LogLabel" ForeColor="DarkGreen" />
</asp:Content>
