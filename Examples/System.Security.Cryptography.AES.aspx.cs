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

		#region Example Script

		public void ExampleScript()
		{
			// Turn input string into a byte array.
			var input = System.Text.Encoding.Unicode.GetBytes("Plain Text");
			// Create an instance of the Rijndael class.
			System.Security.Cryptography.RijndaelManaged cipher;
			cipher = new System.Security.Cryptography.RijndaelManaged();
			// Calculate salt bytes to make it harder to guess key by using a dictionary attack.
			var password = System.Text.Encoding.UTF8.GetBytes("password");
			var hmac = new System.Security.Cryptography.HMACSHA1(password);
			var salt = hmac.ComputeHash(password);
			// Generate Secret Key from the password and salt.
			// Note: Set number of iterations to 10 in order for JavaScript example to work faster.
			var secretKey = new System.Security.Cryptography.Rfc2898DeriveBytes(password, salt, 10);
			// Create a encryptor from the existing SecretKey bytes by using
			// 32 bytes (256 bits) for the secret key and
			// 16 bytes (128 bits) for the initialization vector (IV).
			var key = secretKey.GetBytes(32);
			var iv = secretKey.GetBytes(16);
			var cryptor = cipher.CreateEncryptor(key, iv);
			// Create new Input.
			var inputBuffer = new System.Byte[input.Length];
			// Copy data bytes to input buffer.
			System.Buffer.BlockCopy(input, 0, inputBuffer, 0, inputBuffer.Length);
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
			//cryptoStream.Close();
			// Convert encrypted data into a base64-encoded string.
			var base64String = System.Convert.ToBase64String(outputBuffer);
			// base64String = laFf3eKu9tzB2XksJjd8EVM3PA9O30wz0Y+X3nyelW4=
		}

		#endregion

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

		#endregion

		#region Shared Functions

		/// <summary>
		/// Generate salt from password.
		/// </summary>
		/// <param name="password">Password string.</param>
		/// <returns>Salt bytes.</returns>
		private byte[] SaltFromPassword(string password)
		{
			byte[] passwordBytes = System.Text.Encoding.UTF8.GetBytes(password);
			System.Security.Cryptography.HMACSHA1 hmac;
			hmac = new System.Security.Cryptography.HMACSHA1(passwordBytes);
			byte[] salt = hmac.ComputeHash(passwordBytes);
			return salt;
		}

		private ICryptoTransform GetTransform(string password, bool encrypt)
		{
			// Create an instance of the Rihndael class. 
			RijndaelManaged cipher = new System.Security.Cryptography.RijndaelManaged();
			// Calculate salt to make it harder to guess key by using a dictionary attack.
			byte[] salt = SaltFromPassword(password);
			WriteLog("// salt = "+System.BitConverter.ToString(salt).Replace("-",""));
			// Generate Secret Key from the password and salt.
			// Note: Set number of iterations to 10 in order for JavaScript example to work faster.
			Rfc2898DeriveBytes secretKey = new System.Security.Cryptography.Rfc2898DeriveBytes(password, salt, 10);
			// Create a encryptor from the existing SecretKey bytes by using
			// 32 bytes (256 bits) for the secret key and
			// 16 bytes (128 bits) for the initialization vector (IV).
			byte[] key = secretKey.GetBytes(32);
			byte[] iv = secretKey.GetBytes(16);
			WriteLog("// key = " + System.BitConverter.ToString(key).Replace("-", ""));
			WriteLog("// iv = " + System.BitConverter.ToString(iv).Replace("-", ""));
			ICryptoTransform cryptor = null;
			if (encrypt)
			{
				cryptor = cipher.CreateEncryptor(key, iv);
			}
			else
			{
				cryptor = cipher.CreateDecryptor(key, iv);
			}
			return cryptor;
		}

		/// <summary>
		/// Encrypt/Decrypt with Write method.
		/// </summary>
		/// <param name="cryptor"></param>
		/// <param name="input"></param>
		/// <returns></returns>
		private byte[] CipherStreamWrite(System.Security.Cryptography.ICryptoTransform cryptor, byte[] input)
		{
			var inputBuffer = new byte[input.Length];
			// Copy data bytes to input buffer.
			System.Buffer.BlockCopy(input, 0, inputBuffer, 0, inputBuffer.Length);
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
			//cryptoStream.Close();
			return outputBuffer;
		}

		#endregion

		#region AES-256 Encryption

		/// <summary>
		/// Encrypt string with AES-256 by using password.
		/// </summary>
		/// <param name="password">Password string.</param>
		/// <param name="s">String to encrypt.</param>
		/// <returns>Encrypted Base64 string.</returns>
		public string EncryptToBase64(string password, string s)
		{
			// Turn input strings into a byte array.
			byte[] bytes = System.Text.Encoding.Unicode.GetBytes(s);
			// Get encrypted bytes.
			byte[] encryptedBytes = Encrypt(password, bytes);
			// Convert encrypted data into a base64-encoded string.
			string base64String = System.Convert.ToBase64String(encryptedBytes);
			// Return encrypted string.
			return base64String;
		}

		/// <summary>
		/// Encrypt string with AES-256 by using password.
		/// </summary>
		/// <param name="password">String password.</param>
		/// <param name="bytes">Bytes to encrypt.</param>
		/// <returns>Encrypted bytes.</returns>
		public byte[] Encrypt(string password, byte[] bytes)
		{
			// Create a encryptor.
			ICryptoTransform encryptor = GetTransform(password, true);
			// Return encrypted bytes.
			return CipherStreamWrite(encryptor, bytes);
		}

		#endregion

		#region AES-256 Decryption

		/// <summary>
		/// Decrypt string with AES-256 by using password key.
		/// </summary>
		/// <param name="password">String password.</param>
		/// <param name="base64String">Encrypted Base64 string.</param>
		/// <returns>Decrypted string.</returns>
		public string DecryptFromBase64(string password, string base64String)
		{
			// Convert Base64 string into a byte array. 
			byte[] encryptedBytes = System.Convert.FromBase64String(base64String);
			byte[] bytes = Decrypt(password, encryptedBytes);
			// Convert decrypted data into a string. 
			string s = System.Text.Encoding.Unicode.GetString(bytes, 0, bytes.Length);
			// Return decrypted string.   
			return s;
		}

		/// <summary>
		/// Decrypt string with AES-256 by using password key.
		/// </summary>
		/// <param name="password">String password.</param>
		/// <param name="encryptedBytes">Encrypted bytes.</param>
		/// <returns>Decrypted bytes.</returns>
		public byte[] Decrypt(string password, byte[] bytes)
		{
			// Create a encryptor.
			ICryptoTransform decryptor = GetTransform(password, false);
			// Return encrypted bytes.
			return CipherStreamWrite(decryptor, bytes);
		}

		#endregion

		protected void TestAesButton_Click(object sender, EventArgs e)
		{
			var p = new System.Security.Cryptography.PKCS1MaskGenerationMethod();
			string encrypted = EncryptToBase64(PasswordTextBox.Text, DataTextBox.Text);
			WriteLog("Encrypded = "+encrypted);
			string decrypted = DecryptFromBase64(PasswordTextBox.Text, encrypted);
			WriteLog("Decrypded = " + decrypted);
		}

	}
}
