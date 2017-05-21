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

namespace JocysCom.WebSites.WebApp.Scripts.Classes.Examples
{
	public partial class Default : System.Web.UI.Page
	{
		protected void Page_Load(object sender, EventArgs e)
		{
			if (!Page.IsPostBack)
			{
				listCurrentFolder("*.htm");
			}
		}

		private void listCurrentFolder(string searchPattern)
		{
			System.IO.DirectoryInfo dirInfo = new System.IO.DirectoryInfo(Server.MapPath("."));
			System.IO.FileInfo[] fileInfos = dirInfo.GetFiles(searchPattern);
			for (int i = 0; i < fileInfos.Length; i++)
			{
				HtmlAnchor link = new HtmlAnchor();
				link.InnerHtml = System.IO.Path.GetFileNameWithoutExtension(fileInfos[i].Name);
				link.HRef = fileInfos[i].Name;
				LinksPanel.Controls.Add(link);
				LinksPanel.Controls.Add(new LiteralControl("<br />"));
			}
		}

	}
}