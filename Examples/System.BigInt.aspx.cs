using System;
using System.Collections.Generic;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace JocysCom.WebSites.WebApp.Common.JsClasses.Examples
{
	public partial class System_BigInt : System.Web.UI.Page
	{
		protected void Page_Load(object sender, EventArgs e)
		{

		}

		#region Log Function

		public void WriteLog(string text)
		{
			LogTextBox.Text += text + " \r\n";
		}

		private void WriteBi(string s, BigInt b)
		{
			string sb = System.BitConverter.ToString(b.Elements);
			var line = string.Format(
				"// {0,8} = hex: {1,27}, dec: {2,28}, bytes: {3}",
				s, b.ToHex(), b.ToDecimal(), sb.Replace("-", ""));
			WriteLog(line);
		}

		#endregion

		protected void TestButton_Click(object sender, EventArgs e)
		{
			// Reduce Max Bytes for demo purposes.
			BigInt.MaxBytes = 0x20;
			BigInt r;
			WriteLog("// Import from HEX and DEC strings.");
			WriteLog("var n1 = new BigInt(\"0x010203040506\");");
			WriteLog("var n2 = new BigInt(\"-280422911905295\");");
			var n1 = new BigInt("0x010203040506");
			var n2 = new BigInt("-280422911905295");
			WriteLog("//-----------");
			WriteBi("n1", n1);
			WriteBi("n2", n2);
			WriteLog("//-----------");
			// Negate.
			var nn1 = new BigInt();
			var nn2 = new BigInt();
			nn1.CopyFrom(n1);
			nn2.CopyFrom(n2);
			BigInt.Negate(nn1);
			BigInt.Negate(nn2);
			WriteBi("n1 * -1", nn1);
			WriteBi("n2 * -1", nn2);
			// Add and subtract.
			r = BigInt.Add(n1, n2);
			WriteBi("n1 + n2", r);
			WriteBi("   - n2", BigInt.Subtract(r, n2));
			WriteBi("   - n1", BigInt.Subtract(r, n1));
			// Multiply and divide.
			r = BigInt.Multiply(n2, n1);
			WriteBi("n1 * n2", r);
			WriteBi("   / n1", BigInt.Divide(r, n2)[0]);
			WriteBi("   / n2", BigInt.Divide(r, n1)[0]);
		}

	}
}
