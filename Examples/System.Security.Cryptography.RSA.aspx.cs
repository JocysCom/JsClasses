using System;
using System.Linq;
using System.Security.Cryptography;

namespace Scripts.Classes.Examples
{
	public partial class System_Security_Cryptography_RSA : System.Web.UI.Page
	{


		protected void Page_Load(object sender, EventArgs e)
		{
			if (!IsPostBack)
			{
				KeyTextBox.Text = xmlParamsDefault;
				GenerateButton_Click(null, null);
			}
		}

		#region Log Function

		public void WriteLog(string text)
		{
			LogTextBox.Text += text + " \r\n";
		}

		public void WriteEnc(byte[] input, byte[] output)
		{
			WriteLog("Transform: " + System.BitConverter.ToString(input).Replace("-", "") +
			" -> " + System.BitConverter.ToString(output).Replace("-", ""));
		}

		public byte[] StringToByteArray(string hex)
		{
			byte[] bytes = new byte[hex.Length / 2];
			for (int i = 0; i < hex.Length; i += 2)
				bytes[i / 2] = Convert.ToByte(hex.Substring(i, 2), 16);
			return bytes;
		}

		#endregion


		// NOTE: You can encrypt data so long as it is 245 (256-11) bytes or less (if your modulus is 256 bytes in size and you use PKCS1v1.5)
		// RSA 512 bit key.
		string xmlParamsDefault =
			"<RSAKeyValue>" +
				"<Modulus>pxtmFnrGI6Sb8ziyY+NRUDuQ4b/ETw5WabQ4daFQqzsCEr/6J/LLBU/2D5mO5/Wu5U/Rya1E55aYFZeaZMNqAw==</Modulus>" +
				"<Exponent>AQAB</Exponent>" +
				"<P>2TsVXWPEvDIJv/gd2rX9k0UOyXuaYgoAchIH6vUicis=</P>" +
				"<Q>xO4+OYREQfqYRQK7y73+RaUG0IxobT0OQ0c+Ok2hc4k=</Q>" +
				"<DP>K7/xgpiIU9rECeyfnp/OjS14V+3T3vDivBaTj6eFI3c=</DP>" +
				"<DQ>K4N9ClZ4gp+tn6oP9t//XEIvtEsiE+kmyqTmUhmvMAk=</DQ>" +
				"<InverseQ>p7o4BOlKZQZ693R1ViZ66y5gTjUkNNTd2za7/1YGBCs=</InverseQ>" +
				"<D>XZqFVrYy4qhECruJgVZFp/GVuD5Y0gev88nVjl5r911QT+I8vgJSklTso7jTlpMtf2oe7UZ0WRWEtgPS3tZn4Q==</D>" +
			"</RSAKeyValue>";

		System.Security.Cryptography.RSACryptoServiceProvider GetNewRsaProvider(int dwKeySize = 512)
		{
			// Tell IIS to use Machine Key store or creation of RSA service provider will fail.
			var cspParams = new CspParameters();
			cspParams.Flags = CspProviderFlags.UseMachineKeyStore;
			// Create a new instance of RSACryptoServiceProvider.
			return new System.Security.Cryptography.RSACryptoServiceProvider(dwKeySize, cspParams);
		}

		protected RSAParameters GetRsaKey(bool includePrivateParameters)
		{
			var rsa = GetNewRsaProvider();
			var keyParams = KeyTextBox.Text;
			if (keyParams.StartsWith("<"))
			{
				// Import parameters from XML.
				rsa.FromXmlString(keyParams);
			}
			else
			{
				// Import parameters from BLOB.
				var keyBlob = System.Convert.FromBase64String(keyParams);
				rsa.ImportCspBlob(keyBlob);
			}
			// Export RSA key to RSAParameters and include:
			//    false - Only public key required for encryption.
			//    true  - Private key required for decryption.
			return rsa.ExportParameters(includePrivateParameters);
		}

		protected void EncryptButton_Click(object sender, EventArgs e)
		{
			var decryptedBytes = System.Text.Encoding.UTF8.GetBytes(DataTextBox.Text);
			var doOaepPadding = PaddingDropDownList.SelectedValue == "OAEP";
			// ------------------------------------------------
			// Encrypt
			// ------------------------------------------------
			var rsa = GetNewRsaProvider();
			// Import the RSA Key information (exclude private key).
			rsa.ImportParameters(GetRsaKey(false));
			// Encrypt the passed byte array and specify OAEP padding.
			var encryptedBytes = rsa.Encrypt(decryptedBytes, doOaepPadding);
			var encryptedString = System.Convert.ToBase64String(encryptedBytes);
			// ------------------------------------------------
			// Display the encrypted data.
			//var encryptedString = System.BitConverter.ToString(encryptedBytes).Replace("-","");
			EncryptedTextBox.Text = encryptedString;
		}

		protected void DecryptButton_Click(object sender, EventArgs e)
		{
			var encryptedBytes = System.Convert.FromBase64String(EncryptedTextBox.Text);
			var doOaepPadding = PaddingDropDownList.SelectedValue == "OAEP";
			// ------------------------------------------------
			// Decrypt
			// ------------------------------------------------
			var rsa = GetNewRsaProvider();
			// Import the RSA Key information (include private key).
			rsa.ImportParameters(GetRsaKey(true));
			// Decrypt the passed byte array and specify OAEP padding.
			var decryptedBytes = rsa.Decrypt(encryptedBytes, doOaepPadding);
			// ------------------------------------------------
			// Display the decrypted data.
			var decryptedString = System.Text.Encoding.UTF8.GetString(decryptedBytes);
			DecryptedTextBox.Text = decryptedString;
		}

		protected void SignButton_Click(object sender, EventArgs e)
		{
			var decryptedBytes = System.Text.Encoding.UTF8.GetBytes(DataTextBox.Text);
			// ------------------------------------------------
			// Sign
			// ------------------------------------------------
			var rsa = GetNewRsaProvider();
			// Import the RSA Key information (include private key).
			rsa.ImportParameters(GetRsaKey(true));
			// Sign data.
			var signatureBytes = rsa.SignData(decryptedBytes, "SHA1");
			// Encode bytes for display.
			var encodedSignature = System.Convert.ToBase64String(signatureBytes);
			// ------------------------------------------------
			// Display signature.
			EncryptedTextBox.Text = encodedSignature;
		}

		protected void VerifyButton_Click(object sender, EventArgs e)
		{
			var decryptedBytes = System.Text.Encoding.UTF8.GetBytes(DataTextBox.Text);
			var signatureBytes = System.Convert.FromBase64String(EncryptedTextBox.Text);
			// ------------------------------------------------
			// Verify
			// ------------------------------------------------
			var rsa = GetNewRsaProvider();
			// Import the RSA Key information (exclude private key).
			rsa.ImportParameters(GetRsaKey(false));
			// Verify the hash.
			var success = rsa.VerifyData(decryptedBytes, "SHA1", signatureBytes);
			// ------------------------------------------------
			// Display results.
			DecryptedTextBox.Text = success
				   ? "Digital Signature: Valid"
				   : "Digital Signature: Failed";
		}

		protected void NewKeyButton_Click(object sender, EventArgs e)
		{
			var keySize = int.Parse(KeySizeDropDownList.SelectedValue);
			var rsa = GetNewRsaProvider(keySize);
			KeyTextBox.Text = rsa.ToXmlString(true);
		}


		int maxTests = 0;

		protected void TestButton_Click(object sender, EventArgs e)
		{
			maxTests = 1000;
			DoWork(null, null);
		}

		void DoWork(object sender, EventArgs e)
		{
			var text = DataTextBox.Text;
			var decryptedBytes = System.Text.Encoding.UTF8.GetBytes(text);
			var doOaepPadding = PaddingDropDownList.SelectedValue == "OAEP";
			var rsa = GetNewRsaProvider();
			rsa.ImportParameters(GetRsaKey(true));
			var encryptedBytes = rsa.Encrypt(decryptedBytes, doOaepPadding);
			var decryptedString = "";
			try
			{
				// Decrypt the passed byte array and specify OAEP padding.
				decryptedBytes = rsa.Decrypt(encryptedBytes, doOaepPadding);
				decryptedString = System.Text.Encoding.UTF8.GetString(decryptedBytes);
			}
			catch (Exception ex)
			{
				WriteLog(ex.ToString());
				WriteEnc(encryptedBytes, encryptedBytes);
			}
			maxTests--;
			var success = (text == decryptedString);
			WriteLog(maxTests + ". bytes: " + encryptedBytes.Length + " " + success);
			if (maxTests > 0 && success) DoWork(null, null);
		}

		#region Export Key to Base64

		// https://docs.microsoft.com/en-us/windows/desktop/seccrypto/rsa-schannel-key-blobs

		protected void ConvertToBasePublicKeyButton_Click(object sender, EventArgs e)
		{
			ConvertKeyToBase64(false);
		}

		protected void ConvertToBasePrivateKeyButton_Click(object sender, EventArgs e)
		{
			ConvertKeyToBase64(true);
		}

		void ConvertKeyToBase64(bool includePrivateKey)
		{
			var rsa = GetNewRsaProvider();
			var keyParams = KeyTextBox.Text;
			if (keyParams.StartsWith("<"))
			{
				// Import parameters from XML.
				rsa.FromXmlString(keyParams);
			}
			else
			{
				// Import parameters from BLOB.
				var keyBlob = System.Convert.FromBase64String(keyParams);
				rsa.ImportCspBlob(keyBlob);
			}
			// Export RSA key to RSAParameters and include:
			//    false - Only public key required for encryption.
			//    true  - Private key required for decryption.
			var bytes = rsa.ExportCspBlob(includePrivateKey);
			var base64 = System.Convert.ToBase64String(bytes);
			Base64KeyTextBox.Text = base64;
		}

		#endregion

		#region Secure Example

		protected void GenerateButton_Click(object sender, EventArgs e)
		{
			var rsa = GetNewRsaProvider();
			// Store private key for decryption.
			ViewState["PrivateRsaKey"] = rsa.ToXmlString(true);
			// Show public key for encryption to user.
			PublicKeyTextBox.Text = rsa.ToXmlString(false);
		}

		protected void SubmitButton_Click(object sender, EventArgs e)
		{
			// Get encrypted password.
			var base64 = PasswordDataTextBox.Text;
			if (string.IsNullOrEmpty(base64))
			{
				LogLabel.Text = "Box is empty!";
				return;
			}
			var bytes = System.Convert.FromBase64String(base64);
			// Reset password box.
			PasswordDataTextBox.Text = "";
			// Get new RSA provider.
			var rsa = GetNewRsaProvider();
			// Import Private RSA key.
			var key = (string)ViewState["PrivateRsaKey"];
			rsa.FromXmlString(key);
			// Decrypt password.
			var data = rsa.Decrypt(bytes, true);
			// Convert bytes to UTF8
			var pass = System.Text.Encoding.UTF8.GetString(data);
			// Show password to user (just for debug purposes).
			LogLabel.Text = string.Format("Congratulations! You have submitted '{0}' securely!", pass);
		}

		#endregion


		protected void GenerateRandomDataButton_Click(object sender, EventArgs e)
		{
			// Generate random 10 byte array.
			var rnd = new System.Security.Cryptography.RNGCryptoServiceProvider();
			var bytes = new System.Byte[10];
			rnd.GetNonZeroBytes(bytes);
			DataTextBox.Text = string.Join("", bytes.Select(x => x.ToString("X2")));
		}
	}
}
