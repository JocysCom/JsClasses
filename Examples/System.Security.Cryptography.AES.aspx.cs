using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Security.Cryptography;

namespace Scripts.Classes.Examples
{
	public partial class System_Security_Cryptography_AES : System.Web.UI.Page
	{
		protected void Page_Load(object sender, EventArgs e)
		{
		}

		#region AES-256 Encryption

		byte[] Transform(byte[] dataBytes, byte[] passwordBytes, bool encrypt)
		{
			/// <summary>Encrypt by using AES-256 algorithm.</summary>
			// Create an instance of the Rijndael class.
			var cipher = new System.Security.Cryptography.RijndaelManaged();
			// Calculate salt to make it harder to guess key by using a dictionary attack.
			var hmac = new System.Security.Cryptography.HMACSHA1(passwordBytes);
			var salt = hmac.ComputeHash(passwordBytes);
			// Generate Secret Key from the password and salt.
			// Note: Set number of iterations to 10 in order for JavaScript example to work faster.
			var secretKey = new System.Security.Cryptography.Rfc2898DeriveBytes(passwordBytes, salt, 10);
			// Create a encryptor from the existing SecretKey bytes by using
			// 32 bytes (256 bits) for the secret key and
			// 16 bytes (128 bits) for the initialization vector (IV).
			var key = secretKey.GetBytes(32);
			var iv = secretKey.GetBytes(16);
			// Get cryptor as System.Security.Cryptography.ICryptoTransform class.
			var cryptor = encrypt
				? cipher.CreateEncryptor(key, iv)
				: cipher.CreateDecryptor(key, iv);
			// Create new Input.
			var inputBuffer = new byte[dataBytes.Length];
			// Copy data bytes to input buffer.
			System.Buffer.BlockCopy(dataBytes, 0, inputBuffer, 0, inputBuffer.Length);
			// Create a MemoryStream to hold the output bytes.
			var stream = new System.IO.MemoryStream();
			// Create a CryptoStream through which we are going to be processing our data.
			var mode = System.Security.Cryptography.CryptoStreamMode.Write;
			var cryptoStream = new System.Security.Cryptography.CryptoStream(stream, cryptor, mode);
			// Start the crypting process.
			cryptoStream.Write(inputBuffer, 0, inputBuffer.Length);
			// Finish crypting.
			cryptoStream.FlushFinalBlock();
			// Convert data from a memoryStream into a byte array.
			var outputBuffer = stream.ToArray();
			// Close both streams.
			stream.Close();
			cryptoStream.Close();
			return outputBuffer;
		}

		/// <summary>
		/// Encrypt string with AES-256 by using password.
		/// </summary>
		/// <param name="data">String (or bytes) to encrypt.</param>
		/// <param name="password">Password string (or bytes).</param>
		/// <returns>Encrypted Base64 string.</returns>
		string Encrypt(string data, string password)
		{
			var dataBytes = System.Text.Encoding.UTF8.GetBytes(data);
			var passwordBytes = System.Text.Encoding.UTF8.GetBytes(password);
			var bytes = Transform(dataBytes, passwordBytes, true);
			// Convert encrypted data into a Base64 string.
			var text = System.Convert.ToBase64String(bytes);
			return text;
		}

		/// <summary>
		/// Decrypt string with AES-256 by using password.
		/// </summary>
		/// <param name="data">Base64 string or bytes to encrypt.</param>
		/// <param name="password">Password string (or bytes).</param>
		/// <returns>Decrypted string.</returns>
		string Decrypt(string data, string password)
		{
			// If data is string then turn string into a byte array.
			var dataBytes = System.Convert.FromBase64String(data);
			var passwordBytes = System.Text.Encoding.UTF8.GetBytes(password);
			var bytes = Transform(dataBytes, passwordBytes, false);
			// Convert decrypted data into a string.
			var text = System.Text.Encoding.UTF8.GetString(bytes);
			return text;
		}

		#endregion

		protected void EncryptButton_Click(object sender, EventArgs e)
		{
			EncryptedTextBox.Text = "";
			LogTextBox.Text = "";
			var text = DecryptedTextBox.Text;
			var password = PasswordTextBox.Text;
			var base64 = "";
			try
			{
				base64 = Encrypt(text, password);
			}
			catch (Exception ex)
			{
				LogTextBox.Text = ex.ToString();
			}
			EncryptedTextBox.Text = base64;
		}

		protected void DecryptButton_Click(object sender, EventArgs e)
		{
			DecryptedTextBox.Text = "";
			LogTextBox.Text = "";
			var base64 = EncryptedTextBox.Text;
			var password = PasswordTextBox.Text;
			var text = "";
			try
			{
				text = Decrypt(base64, password);
			}
			catch (Exception ex)
			{
				LogTextBox.Text = ex.ToString();
			}
			DecryptedTextBox.Text = text;
		}

	}
}

