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

namespace Scripts.Classes.Examples
{
	public partial class System_Windows_Forms_Keys : System.Web.UI.Page
	{
		protected void Page_Load(object sender, EventArgs e)
		{
			Response.Clear();
			Response.ContentType = "text/plain";
			Response.Write(GetKeysEnum());
			Response.End();
		}

		private string GetKeysEnum()
		{
			var text = new System.Text.StringBuilder();
			text.Append("System.Windows.Forms.Keys = {\r\n");
			for (int i = 0; i < 256; i++)
			{
				if (i > 0) text.Append(",\r\n");
				text.Append("\t0x" + i.ToString("X2") + ": ");
				// '<%@ Page CodeBehind=' Must be used, or 'System.Windows.Forms' namespace won't be available.
				text.Append("\"" + ((System.Windows.Forms.Keys)i).ToString() + "\"");
			}
			text.Append("\r\n}");
			return text.ToString();
		}

	}
}