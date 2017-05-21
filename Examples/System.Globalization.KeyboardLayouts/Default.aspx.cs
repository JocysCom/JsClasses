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
using System.Runtime.InteropServices;
using Microsoft.Win32;
using System.Text;
using System.Windows.Forms;

namespace JocysCom.WebSites.WebApp.Scripts.Classes.Examples
{

	public partial class System_Globalization_KeyboardLayouts_Default : System.Web.UI.Page
	{

		public static void SetImeName(string layoutName)
		{
			var items = InputLanguage.InstalledInputLanguages;
			foreach (InputLanguage item in items)
			{
				if (item.LayoutName == layoutName)
				{
					InputLanguage.CurrentInputLanguage = item;
				}
			}
		}

		protected void Page_Load(object sender, EventArgs e)
		{
			var sb = new StringBuilder();
			sb.AppendLine("// List of installed languages.");
			// Gets the list of installed languages.
			var items = InputLanguage.InstalledInputLanguages;
			foreach (InputLanguage item in items)
			{
				sb.AppendFormat("{0} - {1}\r\n", item.Culture.KeyboardLayoutId, item.LayoutName);
			}
			LogTextBox.Text += sb.ToString();
		}
	}
}