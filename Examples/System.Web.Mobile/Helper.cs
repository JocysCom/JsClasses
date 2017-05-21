using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace JocysCom.WebSites.WebApp.Scripts.Classes.Examples
{
	public class Helper
	{
		public static byte[] Compress(byte[] bytes)
		{
			var srcStream = new System.IO.MemoryStream(bytes);
			var dstStream = new System.IO.MemoryStream();
			srcStream.Position = 0;
			var stream = new System.IO.Compression.DeflateStream(dstStream, System.IO.Compression.CompressionMode.Compress);
			byte[] buffer = new byte[4096];
			int numRead;
			while ((numRead = srcStream.Read(buffer, 0, buffer.Length)) != 0) stream.Write(buffer, 0, numRead);
			stream.Close();
			return dstStream.ToArray();
		}

		public static byte[] Decompress(byte[] bytes)
		{
			var srcStream = new System.IO.MemoryStream(bytes);
			var dstStream = new System.IO.MemoryStream();
			srcStream.Position = 0;
			var stream = new System.IO.Compression.DeflateStream(srcStream, System.IO.Compression.CompressionMode.Decompress);
			byte[] buffer = new byte[4096];
			int numRead;
			while ((numRead = stream.Read(buffer, 0, buffer.Length)) != 0) dstStream.Write(buffer, 0, numRead);
			dstStream.Close();
			return dstStream.ToArray();
		}

		//-------------------------------------------------

		public static string Encode(object o, bool compress)
		{
			if (o == null) return null;
			var ser = new System.Web.Script.Serialization.JavaScriptSerializer();
			var text = ser.Serialize(o);
			var bytes = System.Text.Encoding.UTF8.GetBytes(text);
			if (compress == true) bytes = Compress(bytes);
			var base64 = System.Convert.ToBase64String(bytes);
			return base64;
		}

		public static T Decode<T>(string s, bool decompress)
		{
			var bytes = System.Convert.FromBase64String(s);
			if (decompress) bytes = Decompress(bytes);
			var text = System.Text.Encoding.UTF8.GetString(bytes);
			var ser = new System.Web.Script.Serialization.JavaScriptSerializer();
			var o = ser.Deserialize<T>(text);
			return o;
		}

		//-------------------------------------------------

		public static string RsaDecrypt(string s, string key)
		{
			var encryptedBytes = System.Convert.FromBase64String(s);
			var doOaepPadding = false;
			var rsa = new System.Security.Cryptography.RSACryptoServiceProvider(1024);
			// Import the RSA Key information.
			rsa.FromXmlString(key);
			// Export RSA key to RSAParameters and include:
			//    false - Only public key required for encryption.
			//    true  - Private key required for decryption.
			// Encrypt the passed byte array and specify OAEP padding.
			var decryptedBytes = rsa.Decrypt(encryptedBytes, doOaepPadding);
			var decryptedString = System.Text.Encoding.UTF8.GetString(decryptedBytes);
			return decryptedString;
		}

		//-------------------------------------------------

		public static string AesDecrypt(string password, string base64)
		{
			// Turn input string into a byte array.
			var input = System.Convert.FromBase64String(base64);
			// Create an instance of the Rijndael class.
			var cipher = new System.Security.Cryptography.RijndaelManaged();
			// Calculate salt to make it harder to guess key by using a dictionary attack.
			var passwordBytes = System.Text.Encoding.UTF8.GetBytes(password);
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
			var cryptor = cipher.CreateDecryptor(key, iv);
			// Create new Input.
			var inputBuffer = new System.Byte[input.Length];
			// Copy data bytes to input buffer.
			System.Buffer.BlockCopy(input, 0, inputBuffer, 0, inputBuffer.Length);
			// Create a MemoryStream to hold the output bytes.
			var stream = new System.IO.MemoryStream();
			// Create a CryptoStream through which we are going to be processing our data.
			var mode = System.Security.Cryptography.CryptoStreamMode.Write;
			var cryptoStream = new System.Security.Cryptography.CryptoStream(stream, cryptor, mode);
			// Start the decrypting process.
			cryptoStream.Write(inputBuffer, 0, inputBuffer.Length);
			// Finish decrypting.
			cryptoStream.FlushFinalBlock();
			// Convert data from a memoryStream into a byte array.
			var outputBuffer = stream.ToArray();
			// Close both streams.
			stream.Close();
			//cryptoStream.Close();
			// Convert encrypted data into a base64-encoded string.
			var s = System.Text.Encoding.UTF8.GetString(outputBuffer);
			return s;
		}

		public static string Serialize(object o)
		{
			var ser = new System.Web.Script.Serialization.JavaScriptSerializer();
			return ser.Serialize(o);
		}

		public static T DeSerialize<T>(string s)
		{
			var ser = new System.Web.Script.Serialization.JavaScriptSerializer();
			return ser.Deserialize<T>(s);
		}

		public static void ResponseScript(KeyValueList r, bool compress)
		{
			string e = "{}";
			try
			{
				e = Helper.Encode(r, compress);
			}
			catch (Exception ex)
			{
				r.SetValue("ErrorCode", 1);
				r.SetValue("ErrorMessage", ex.Message);
			}
			// Encode to base64 string.
			var sender = "{ Compressed: " + compress.ToString().ToLower() + " }";
			var s = "System.Web.Mobile.DataLoaded(" + sender + ", '" + e + "');";
			ResponseScript(s);
		}

		public static void ResponseScript(string s)
		{
			var response = System.Web.HttpContext.Current.Response;
			response.ClearContent();
			response.ContentType = "text/javascript";
			response.ContentEncoding = System.Text.Encoding.UTF8;
			response.Write(s);
			response.Flush();
			response.End();
		}

		public static void ResponseText(string s)
		{
			var response = System.Web.HttpContext.Current.Response;
			response.ClearContent();
			response.ContentType = "text/plain";
			response.ContentEncoding = System.Text.Encoding.UTF8;
			response.Write(s);
			response.Flush();
			response.End();
		}


	}
}