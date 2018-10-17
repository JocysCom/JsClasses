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
	public partial class System_BitConverter : System.Web.UI.Page
	{
		protected void Page_Load(object sender, EventArgs e)
		{
		}

		#region Log Function

		private void WriteLog(string text)
		{
			LogTextBox.Text += text + " \r\n";
		}

		#endregion

		protected void TestButton_Click(object sender, EventArgs e)
		{
			WriteLog("// Start 'System.BitConverter' Demo");
			WriteLog("BitConverter.IsLittleEndian = " + System.BitConverter.IsLittleEndian);
			byte[] bytes;
			string str;
			// ================================================
			WriteLog("// === Test Double:");
			double n64 = -1.5d;
			WriteLog("var n64 = " + n64 + ";");
			bytes = System.BitConverter.GetBytes(n64);
			str = System.BitConverter.ToString(bytes);
			n64 = System.BitConverter.ToDouble(bytes, 0);
			WriteLog("bytes = System.BitConverter.GetBytes(n64);");
			WriteLog("str = System.BitConverter.ToString(bytes); // str = " + str + "");
			WriteLog("n64 = System.BitConverter.ToDouble(bytes, 0); // n64 = " + n64);
			// ================================================
			WriteLog("// === Test Single:");
			float n32 = -1.5f;
			WriteLog("var n32 = " + n32 + ";");
			bytes = System.BitConverter.GetBytes(n32);
			str = System.BitConverter.ToString(bytes);
			n32 = System.BitConverter.ToSingle(bytes, 0);
			WriteLog("bytes = System.BitConverter.GetBytes(n32);");
			WriteLog("str = System.BitConverter.ToString(bytes); // str = " + str + "");
			WriteLog("n32 = System.BitConverter.ToSingle(bytes, 0); // n32 = " + n32);
			// ================================================
			WriteLog("// === Test Boolean:");
			Boolean bl1 = true;
			WriteLog("var bl1 = " + bl1 + ";");
			bytes = System.BitConverter.GetBytes(bl1);
			str = System.BitConverter.ToString(bytes);
			bl1 = System.BitConverter.ToBoolean(bytes, 0);
			WriteLog("bytes = System.BitConverter.GetBytes(bl1);");
			WriteLog("str = System.BitConverter.ToString(bytes); // str = " + str + "");
			WriteLog("bl1 = System.BitConverter.ToBoolean(bytes, 0); // bl1 = " + bl1);
			// ================================================
			WriteLog("// === Test Int16:");
			Int16 i16 = -13312;
			WriteLog("var i16 = " + i16 + ";");
			bytes = System.BitConverter.GetBytes(i16);
			str = System.BitConverter.ToString(bytes);
			i16 = System.BitConverter.ToInt16(bytes, 0);
			WriteLog("bytes = System.BitConverter.GetBytes(i16);");
			WriteLog("str = System.BitConverter.ToString(bytes); // str = " + str + "");
			WriteLog("i16 = System.BitConverter.ToInt16(bytes, 0); // i16 = " + i16);
			// ================================================
			WriteLog("// === Test UInt16:");
			UInt16 u16 = 52224;
			WriteLog("var u16 = " + u16 + ";");
			bytes = System.BitConverter.GetBytes(u16);
			str = System.BitConverter.ToString(bytes);
			u16 = System.BitConverter.ToUInt16(bytes, 0);
			WriteLog("bytes = System.BitConverter.GetBytes(u16);");
			WriteLog("str = System.BitConverter.ToString(bytes); // str = " + str + "");
			WriteLog("u16 = System.BitConverter.ToUInt16(bytes, 0); // u16 = " + u16);
			// ================================================
			WriteLog("// === Test Int32:");
			Int32 i32 = -859045888;
			WriteLog("var i32 = " + i32 + ";");
			bytes = System.BitConverter.GetBytes(i32);
			str = System.BitConverter.ToString(bytes);
			i32 = System.BitConverter.ToInt32(bytes, 0);
			WriteLog("bytes = System.BitConverter.GetBytes(i32);");
			WriteLog("str = System.BitConverter.ToString(bytes); // str = " + str + "");
			WriteLog("i32 = System.BitConverter.ToInt32(bytes, 0); // i32 = " + i32);
			// ================================================
			WriteLog("// === Test UInt32:");
			UInt32 u32 = 3435921408;
			WriteLog("var u32 = " + u32 + ";");
			bytes = System.BitConverter.GetBytes(u32);
			str = System.BitConverter.ToString(bytes);
			u32 = System.BitConverter.ToUInt32(bytes, 0);
			WriteLog("bytes = System.BitConverter.GetBytes(u32);");
			WriteLog("str = System.BitConverter.ToString(bytes); // str = " + str + "");
			WriteLog("u32 = System.BitConverter.ToUInt32(bytes, 0); // u32 = " + u32);
			// Test bit converter.
			TestBitConverter();
		}

		#region Test Bit Converter

		void WriteArray(string name, byte[] input)
		{
			var ba = new System.Collections.BitArray(input);
			var length = ba.Length;
			var sb = new System.Text.StringBuilder();
			for (var i = 0; i < length; i++)
			{
				if ((i > 0) && (i % 8 == 0)) sb.Append(' ');
				sb.Append(ba[i] ? '1' : '0');
			}
			WriteLog(name + " = [" + System.BitConverter.ToString(input) + "]" +
			" // [" + sb.ToString() + "]");
		}

		void TestBitConverter()
		{
			WriteLog("// === TestBitConverter()");
			var s = "a𐋄b";
			var b1 = System.Text.Encoding.UTF8.GetBytes(s);
			WriteArray("Bytes", b1);
			var b2 = WriteString(s);
			WriteArray("Write", b2);
			var s2 = ReadString(b2);
			WriteLog("s2 = " + s2);

		}

		byte[] WriteString(string s)
		{
			var ms = new System.IO.MemoryStream();
			var bw = new System.IO.BinaryWriter(ms);
			bw.Write(s);
			bw.Flush();
			var bytes = ms.ToArray();
			return bytes;
		}

		string ReadString(byte[] bytes)
		{
			var ms = new System.IO.MemoryStream(bytes);
			var bw = new System.IO.BinaryReader(ms);
			var s = bw.ReadString();
			return s;
		}

		#endregion

	}

}