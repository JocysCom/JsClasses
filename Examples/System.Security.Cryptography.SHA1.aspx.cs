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
using System.Runtime.InteropServices;

namespace Scripts.Classes.Examples
{
	public partial class System_Security_Cryptography_SHA1 : System.Web.UI.Page
	{
		protected void Page_Load(object sender, EventArgs e)
		{
		}

		#region Log Function

		public void WriteLog(string text)
		{
			LogTextBox.Text += text + " \r\n";
		}

		private void WriteArray(string name, byte[] input)
		{
			System.Collections.BitArray ba = new System.Collections.BitArray(input);
			int length = ba.Length;
			System.Text.StringBuilder sb = new System.Text.StringBuilder();
			for (int i = 0; i < length; i++)
			{
				if ((i > 0) && (i % 8 == 0)) sb.Append(' ');
				sb.Append(ba[i] ? '1' : '0');
			}
			WriteLog(name + " = [" + System.BitConverter.ToString(input) + "]" +
			" // [" + sb.ToString() + "]");
		}

		#endregion


		protected void TestButton_Click(object sender, EventArgs e)
		{
			// Define key and data string.
			string k = "test key";
			string s = "Encoding-编码-암호화-表現形式";
			byte[] kb = System.Text.Encoding.UTF8.GetBytes(k);
			byte[] sb = System.Text.Encoding.UTF8.GetBytes(s);
			// Test SHA1.
			WriteLog("// Create SHA1 Algorithm");
			System.Security.Cryptography.SHA1CryptoServiceProvider sha1;
			sha1 = new System.Security.Cryptography.SHA1CryptoServiceProvider();
			string hash = System.BitConverter.ToString(sha1.ComputeHash(sb));
			WriteLog("sha1.ComputeHash('" + s + "') = " + hash);
			// Test HMACSHA1.
			Trace.Write("// Create HMAC-SHA1 Algorithm");
			System.Security.Cryptography.HMACSHA1 hmac;
			hmac = new System.Security.Cryptography.HMACSHA1(kb);
			hash = System.BitConverter.ToString(hmac.ComputeHash(sb));
			WriteLog("hmac.ComputeHash('" + k + "','" + s + "') = " + hash);
		}
	}

}