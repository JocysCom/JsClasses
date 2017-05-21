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
	public partial class System_Security : System.Web.UI.Page
	{
		#region Init Example

		protected void Page_Load(object sender, EventArgs e)
		{
			//var d = System.DateTime.MinValue;
			//WriteLog(System.DateTime.MinValue.ToString("yyyy-MM-dd HH:mm:ss"));
			//WriteLog(d.Ticks.ToString());
			//WriteLog(new DateTime(1970, 1, 1).Subtract(new DateTime(0)).TotalMilliseconds.ToString());

			//var y1970 = new System.DateTime(1970, 1, 1).Ticks;
			//WriteLog(y1970.ToString()); // 621355968000000000 

			//var y2013 = new System.DateTime(2013, 9, 25).Ticks;
			//WriteLog(y2013.ToString()); // 635156640000000000 
			//WriteLog("");
			//y1970 = new System.DateTime(1970, 1, 1).ToUniversalTime().Ticks;
			//WriteLog(y1970.ToString()); // 621355968000000000 
			//y2013 = new System.DateTime(2053, 9, 25).ToUniversalTime().Ticks;
			//WriteLog(y2013.ToString()); // 635156604000000000

			// "K" outputs "±HH:mm" or "Z" if time is UTC.
			// "K" is used instead of "zzz", because "zzz" is not allowed to format UTC time.
			var format = "yyyy-MM-dd HH:mm:ss.fffK";
			WriteLog("");
			WriteLog("Now:");
			var d = System.DateTime.Now;
			WriteLog(d.ToString(format));
			WriteLog(d.Ticks.ToString());
			//WriteLog(d.getTimezoneOffset());
			WriteLog("UtcNow.ToUniversalTime:");
			d = d.ToUniversalTime();
			WriteLog(d.ToString(format));
			WriteLog(d.Ticks.ToString());
			//WriteLog(d.getTimezoneOffset());
			WriteLog("UtcNow:");
			d = System.DateTime.UtcNow;
			WriteLog(d.ToString(format));
			WriteLog(d.Ticks.ToString());
			// WriteLog(d.getTimezoneOffset());
			WriteLog("UtcNow.ToUniversalTime:");
			d = d.ToUniversalTime();
			WriteLog(d.ToString(format));
			WriteLog(d.Ticks.ToString());
			//WriteLog(d.getTimezoneOffset());
		}

		#endregion

		#region Log Function

		public void WriteLog(string text)
		{
			LogTextBox.Text += text + " \r\n";
		}

		#endregion

	}
}
