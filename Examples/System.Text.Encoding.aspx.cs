using System;
using System.Linq;

namespace Scripts.Classes.Examples
{
	public partial class System_Text_Encoding : System.Web.UI.Page
	{
		protected void Page_Load(object sender, EventArgs e)
		{
			if (!IsPostBack)
			{
				ConvertValue(ValueTextBox.Text);
			}
		}

		#region Log Function

		public void WriteLog(string s)
		{
			LogTextBox.Text += s + " \r\n";
		}

		private void WriteArray(string name, string input, System.Text.Encoding encoding)
		{
			var sb = new System.Text.StringBuilder();
			sb.AppendLine(name);
			sb.AppendLine();
			for (var i = 0; i < input.Length; i++)
			{
				var s = input[i].ToString();
				var code = System.Char.ConvertToUtf32(input, i);
				// If at least 2 characters available and both form UTF-16 surrogate pair then...
				if (i < input.Length - 1 && System.Char.IsHighSurrogate(input, i) && System.Char.IsLowSurrogate(input, i + 1))
				{
					// Get UTF-32 (Unicode) code point.
					s += input[i + 1];
					i++;
				}
				var bytes = encoding.GetBytes(s);
				var byteString = string.Join("-", bytes.Select(x => x.ToString("X2")));
				var bitString = "";
				for (int b = 0; b < bytes.Length; b++)
				{
					if (b > 0)
						bitString += " ";
					var bits = new System.Collections.BitArray(new byte[] { bytes[b] });
					for (int x = 0; x < bits.Length; x++)
						bitString += bits[bits.Length - x - 1] ? '1' : '0';
				}
				var s2 = encoding.GetString(bytes);
				sb.AppendFormat("\t{0,2}.   {1:X8}   {2,-11}   {3,-36}   {4}\r\n", i, code, byteString, bitString, s2);
			}
			WriteLog(sb.ToString());
		}

		#endregion

		protected void TestButton_Click(object sender, EventArgs e)
		{
			ConvertValue(ValueTextBox.Text);
		}

		protected void ClearButton_Click(object sender, EventArgs e)
		{
			LogTextBox.Text = "";
		}

		void ConvertValue(string s)
		{
			LogTextBox.Text = "";
			WriteLog("	 No   Code       Bytes         Bits                                  Char");
			WriteLog("	 --   --------   -----------   -----------------------------------   ----");
			WriteLog("");
			WriteArray("UTF-16 Bytes (JavaScript/C#)", s, System.Text.Encoding.Unicode);
			WriteArray("UTF-32 Bytes (Unicode)", s, System.Text.Encoding.UTF32);
			WriteArray("UTF-8 Bytes", s, System.Text.Encoding.UTF8);
			WriteArray("ASCII Bytes", s, System.Text.Encoding.ASCII);
		}

	}

}