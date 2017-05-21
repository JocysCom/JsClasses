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

namespace JocysCom.WebSites.WebApp.Scripts.Classes.Documents
{
	public partial class ShowItem : System.Web.UI.Page
	{
		protected void Page_Load(object sender, EventArgs e)
		{
			if (!Page.IsPostBack)
			{
				ItemHyperLink.Text = "";
				ItemLabel.Text = "";
				FileHyperLink.Text = "";
				string fileName = (Request["File"] == null) ? string.Empty : Request["File"].ToString();
				string itemName = (Request["Item"] == null) ? string.Empty : Request["Item"].ToString();
				int itemIndex = (Request["Index"] == null) ? 0 : int.Parse(Request["Index"].ToString());
				DataRow[] rows = Default.ObjectsTable.Select("FileName='" + fileName + "' AND ItemName='" + itemName + "'");
				if (rows.Length > 0)
				{
					LoadData(fileName, itemName, itemIndex);
				}
			}
		}

		public void LoadData(string fileName, string itemName, int itemIndex)
		{
			FileHyperLink.Text = fileName;
			FileHyperLink.NavigateUrl = "../" + fileName;
			ItemLabel.Text = itemName;
			// Now we have file and class. We need to extract this object.
			string sysPath = Server.MapPath("../");
			string itemLink = Request.FilePath.Replace("ShowItem.aspx","Default.aspx") + "?File=" + fileName + "&Item=" + itemName + "&Index=" + itemIndex.ToString();
			ItemHyperLink.NavigateUrl = itemLink;
			ItemHyperLink.Text = itemLink;
		
			// Advanced load...
			string code = string.Empty;
			CodePre.InnerHtml = string.Empty;
			if (!String.IsNullOrEmpty(fileName))
			{
				code = System.IO.File.ReadAllText(sysPath + "\\" + fileName);
				if (String.IsNullOrEmpty(itemName))
				{
					//CodePre.InnerHtml = Server.HtmlEncode(code);
				}
				else
				{
					CodePre.InnerHtml = Server.HtmlEncode(Scripts.Classes.Documents.Default.GetItemFromCode(code, itemName, itemIndex));
					// Load example if exists.
					ExampleDiv.Visible = false;
					string path = "Examples\\" + itemName + ".htm";
					if (System.IO.File.Exists(sysPath + "\\" + path))
					{
						ExampleFrame.Attributes.Add("src", "../" + path.Replace("\\", "/"));
						ExampleDiv.Visible = true;
					}
					else
					{
						path = "Examples\\" + itemName + "\\" + itemName + ".htm";
						if (System.IO.File.Exists(sysPath + "\\" + path))
						{
							ExampleFrame.Attributes.Add("src", "../" + path.Replace("\\", "/"));
							ExampleDiv.Visible = true;
						}
					}
				}
			}
			else
			{

			}
		}


	}
}
