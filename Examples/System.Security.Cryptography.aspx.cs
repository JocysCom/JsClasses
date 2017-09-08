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
	public partial class System_Security_Cryptography : System.Web.UI.Page
	{
		#region Init Example

		protected void Page_Load(object sender, EventArgs e)
		{
			if (!Page.IsPostBack)
			{
				EnumToInput(typeof(System.Security.Cryptography.CipherMode), CipherModeDropDownList, System.Security.Cryptography.CipherMode.CBC);
				EnumToInput(typeof(System.Security.Cryptography.PaddingMode), PaddingModeDropDownList, System.Security.Cryptography.PaddingMode.PKCS7);
			}
		}
		
		public void EnumToInput(Type e, DropDownList list, object defaultValue)
		{
			string[] names = System.Enum.GetNames(e);
			Array values = System.Enum.GetValues(e);
			for (int i = 0; i < names.Length; i++)
			{
				int value = (int)values.GetValue(i);
				ListItem item = new ListItem(names[i], value.ToString());
				item.Selected = (value == (int)defaultValue);
				list.Items.Add(item);
			}
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

		#region Shared Objects

		System.Security.Cryptography.SymmetricAlgorithm Cipher;
		byte[] DataBytes;
		byte[] SaltBytes;
		byte[] PassBytes;
		byte[] Key;
		byte[] IV; 

		/// <summary>
		/// Create an instance of the symetric algorithm class.
		/// </summary>
		private void CreateCipher()
		{
			Cipher = new System.Security.Cryptography.AesCryptoServiceProvider();
			//Cipher = new System.Security.Cryptography.RC2CryptoServiceProvider();
			//Cipher = new System.Security.Cryptography.RC4CryptoServiceProvider();
			Cipher.Mode = (System.Security.Cryptography.CipherMode)int.Parse(CipherModeDropDownList.SelectedValue);
			Cipher.Padding = (System.Security.Cryptography.PaddingMode)int.Parse(PaddingModeDropDownList.SelectedValue);
			WriteLog("cipher.KeySize: " + Cipher.KeySize.ToString() + " bits");
			WriteLog("cipher.BlockSize: " + Cipher.BlockSize.ToString() + " bits");
			WriteLog("cipher.Key[" + Cipher.Key.Length.ToString() + "]: " + System.BitConverter.ToString(Cipher.Key).Replace("-", ""));
			WriteLog("cipher.IV[" + Cipher.IV.Length.ToString() + "]: " + System.BitConverter.ToString(Cipher.IV).Replace("-", ""));
			WriteLog("cipher.Mode: " + Cipher.Mode.ToString());
			WriteLog("cipher.Padding: " + Cipher.Padding.ToString());
			// Prepare Data;
			DataBytes = System.Text.Encoding.UTF8.GetBytes(DataTextBox.Text);
		}

		/// <summary>
		/// Use salt and password to create Key and IV.
		/// </summary>
		private void CreateKeyAndIv()
		{
			// Convert salt and passsword to bytes.
			SaltBytes = System.Text.Encoding.UTF8.GetBytes(SaltTextBox.Text);
			PassBytes = System.Text.Encoding.UTF8.GetBytes(PasswordTextBox.Text);
			// Generate Secret Key from the password and salt.
			System.Security.Cryptography.Rfc2898DeriveBytes secretKey;
			secretKey = new System.Security.Cryptography.Rfc2898DeriveBytes(PassBytes, SaltBytes, 5);
			// 32 bytes (256 bits) for the secret key and
			// 16 bytes (128 bits) for the initialization vector (IV).
			Key = secretKey.GetBytes(Cipher.KeySize / 8);
			IV = secretKey.GetBytes(Cipher.IV.Length);
			Cipher.Key = Key;
			Cipher.IV = IV;
			WriteLog("// Update Key and IV.");
			WriteLog("Key[" + Key.Length.ToString() + "]: " + System.BitConverter.ToString(Key).Replace("-", ""));
			WriteLog("IV[" + IV.Length.ToString() + "]: " + System.BitConverter.ToString(IV).Replace("-", ""));
		}

		#endregion

		#region Test Block

		private byte[] CipherBlock(System.Security.Cryptography.ICryptoTransform cryptor, byte[] input)
		{
			WriteLog("--- Cipher Block:");
			WriteLog("InputBlockSize: " + cryptor.InputBlockSize.ToString());
			WriteLog("OutputBlockSize: " + cryptor.OutputBlockSize.ToString());
			int finalSize = input.Length % cryptor.InputBlockSize;
			int blockCount = (input.Length - finalSize) / cryptor.InputBlockSize;
			if (finalSize > 0) blockCount += 1;
			WriteLog("InputLength: " + input.Length.ToString());
			WriteLog("BlockCount: " + blockCount.ToString());
			WriteLog("FinalSize: " + finalSize.ToString());
			int len = input.Length;
			System.IO.MemoryStream stream = new System.IO.MemoryStream();
			for (int b = 0; b < blockCount; b++)
			{
				byte[] inputBuffer = new byte[cryptor.InputBlockSize];
				byte[] outputBuffer = new byte[cryptor.OutputBlockSize];
				// Calculate length of current block:
				int blockLength = b < blockCount - 1 ? cryptor.InputBlockSize : (len - 1) % cryptor.InputBlockSize + 1;
				int iPos = b * cryptor.InputBlockSize;
				// Copy data bytes to input buffers.
				System.Buffer.BlockCopy(input, iPos, inputBuffer, 0, blockLength);
				if (b < blockCount-1)
				{
					cryptor.TransformBlock(input, iPos, cryptor.InputBlockSize, outputBuffer, 0);
				}
				else
				{
					WriteLog("Transform final block["+blockLength.ToString()+"]...");
					outputBuffer = cryptor.TransformFinalBlock(input, iPos, blockLength);
				}
				WriteEnc(inputBuffer, outputBuffer);
				stream.Write(outputBuffer, 0, outputBuffer.Length);
			}
			return stream.ToArray();
		}

		private void TestBlock()
		{
			System.Security.Cryptography.ICryptoTransform cryptor;
			WriteLog("DataBytes String: " + System.Text.Encoding.UTF8.GetString(DataBytes));
			// -----------------------------------------------------
			cryptor = Cipher.CreateEncryptor();
			WriteLog("Cipher.FeedbackSize: "+ Cipher.FeedbackSize.ToString()); 
			byte[] encrypted = CipherBlock(cryptor, DataBytes);
			WriteLog("Encrypted Bytes: " + System.BitConverter.ToString(encrypted).Replace("-",""));
			// -----------------------------------------------------
			//Cipher.Padding = System.Security.Cryptography.PaddingMode.None;
			cryptor = Cipher.CreateDecryptor();
			byte[] decrypted = CipherBlock(cryptor, encrypted);
			// -----------------------------------------------------
			WriteLog("Decrypted String: " + System.Text.Encoding.UTF8.GetString(decrypted));
		}

		/// <summary>
		/// Begin block test.
		/// </summary>
		/// <param name="sender">Sender.</param>
		/// <param name="e">Event arguments.</param>
		protected void TestBlockButton_Click(object sender, EventArgs e)
		{
			WriteLog("===========================================================");
			WriteLog("Test Block");
			WriteLog("===========================================================");
			CreateCipher();
			CreateKeyAndIv();
			TestBlock();
		}

		#endregion

		#region Test Stream

		/// <summary>
		/// Encrypt/Decrypt with Write method.
		/// </summary>
		/// <param name="cryptor"></param>
		/// <param name="input"></param>
		/// <returns></returns>
		private byte[] CipherStreamWrite(System.Security.Cryptography.ICryptoTransform cryptor, byte[] input)
		{
			WriteLog("--- Cipher Stream:");
			WriteLog("InputBlockSize: " + cryptor.InputBlockSize.ToString());
			WriteLog("OutputBlockSize: " + cryptor.OutputBlockSize.ToString());
			byte[] inputBuffer = new byte[input.Length];
			byte[] outputBuffer;
			// Copy data bytes to input buffer.
			System.Buffer.BlockCopy(input, 0, inputBuffer, 0, inputBuffer.Length);
			// Create a MemoryStream to hold the output bytes.
			var stream = new System.IO.MemoryStream();
			// Create a CryptoStream through which we are going to be processing our data.
			var cryptoStream = new System.Security.Cryptography.CryptoStream(stream, cryptor, System.Security.Cryptography.CryptoStreamMode.Write);
			// Start the crypting process.
			cryptoStream.Write(inputBuffer, 0, inputBuffer.Length);
			// Finish crypting.
			cryptoStream.FlushFinalBlock();
			// Convert data from a memoryStream into a byte array.
			outputBuffer = stream.ToArray();
			// Close both streams.
			stream.Close();
			//cryptoStream.Close();
			WriteEnc(inputBuffer, outputBuffer);
			return outputBuffer;
		}

		/// <summary>
		/// Encrypt/Decrypt with Read method. Recommended for decrypting only.
		/// </summary>
		/// <param name="cryptor"></param>
		/// <param name="input"></param>
		/// <returns></returns>
		private byte[] CipherStreamRead(System.Security.Cryptography.ICryptoTransform cryptor, byte[] input)
		{
			WriteLog("--- Cipher Stream:");
			WriteLog("InputBlockSize: " + cryptor.InputBlockSize.ToString());
			WriteLog("OutputBlockSize: " + cryptor.OutputBlockSize.ToString());
			byte[] inputBuffer = new byte[input.Length];
			byte[] outputBuffer = new byte[input.Length];
			// Copy data bytes to input buffer.
			System.Buffer.BlockCopy(input, 0, inputBuffer, 0, inputBuffer.Length);
			// Create a MemoryStream to hold the input bytes.
			var stream = new System.IO.MemoryStream(inputBuffer);
			// Create a CryptoStream through which we are going to be processing our data.
			var cryptoStream = new System.Security.Cryptography.CryptoStream(stream, cryptor, System.Security.Cryptography.CryptoStreamMode.Read);
			// Start the crypting process.
			int length = cryptoStream.Read(outputBuffer, 0, outputBuffer.Length);
			// Finish crypting.
			cryptoStream.FlushFinalBlock();
			// Convert data from a memoryStream into a byte array.
			System.Array.Resize(ref outputBuffer, length);
			// Close both streams.
			stream.Close();
			// cryptoStream.Close();
			WriteEnc(inputBuffer, outputBuffer);
			return outputBuffer;
		}
		

		private void TestStream()
		{
			System.Security.Cryptography.ICryptoTransform cryptor;
			WriteLog("DataBytes String: " + System.Text.Encoding.UTF8.GetString(DataBytes));
			// -----------------------------------------------------
			cryptor = Cipher.CreateEncryptor();
			byte[] encrypted = CipherStreamWrite(cryptor, DataBytes);
			// -----------------------------------------------------
			cryptor = Cipher.CreateDecryptor();
			byte[] decrypted = CipherStreamWrite(cryptor, encrypted);
			// -----------------------------------------------------
			WriteLog("Decrypted String: " + System.Text.Encoding.UTF8.GetString(decrypted));
		}
		
		/// <summary>
		/// Begin stream test.
		/// </summary>
		/// <param name="sender">Sender.</param>
		/// <param name="e">Event arguments.</param>
		protected void TestStreamButton_Click(object sender, EventArgs e)
		{
			WriteLog("===========================================================");
			WriteLog("Test Stream");
			WriteLog("===========================================================");
			CreateCipher();
			CreateKeyAndIv();	
			TestStream();
		}

		#endregion

	}
}
