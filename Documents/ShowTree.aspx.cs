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
	public partial class ShowTree : System.Web.UI.Page
	{
		protected void Page_Load(object sender, EventArgs e)
		{
			if (!Page.IsPostBack)
			{
				AddFileNodes();
			}
		}


		public void AddFileNodes()
		{
			DataRow[] fRows = Default.FilesTable.Select("", "FileTitle");

			TreeNode homeNode = TreeView1.Nodes[0];
			homeNode.Text = "<a class=\"SWUI_PrgLink FileNode\" href=\"javascript://\" onclick=\"GoToItem('Home Page',''); return false;\">" + homeNode.Text + "</a>";
			TreeNode sysNode = TreeView1.Nodes[1];
			sysNode.SelectAction = TreeNodeSelectAction.Expand;
			sysNode.ImageUrl = "../Documents/Images/VSObjects/Namespace.png";

			for (int f = 0; f < fRows.Length; f++)
			{
				DataRow fr = fRows[f];
				string fName = fr["FileTitle"].ToString();
				string fValue = fr["FileName"].ToString();
				TreeNode fNode = new TreeNode(fName, fValue);
				sysNode.ChildNodes.Add(fNode);
				fNode.ImageUrl = "../Documents/Images/VSObjects/Namespace.png";
				fNode.SelectAction = TreeNodeSelectAction.None;
				// Add subnodes here.
				DataRow[] oRows = Default.ObjectsTable.Select("FileName='" + fValue + "'", "ItemName");
				for (int o = 0; o < oRows.Length; o++)
				{
					DataRow or = oRows[o];
					string oName = or["ItemTitle"].ToString();
					string oValue = or["ItemName"].ToString() + "&" + or["ItemIndex"].ToString();
					fNode.SelectAction = TreeNodeSelectAction.Expand;
					string fv = "'" + fValue + "'";
					string i = ", '" + or["ItemName"].ToString() + "'";
					string x = ", '" + or["ItemIndex"].ToString() + "'";
					//TreeNode oNode = new TreeNode(oName, oValue);
					string text = "<a class=\"SWUI_PrgLink ItemNode\" href=\"javascript://\" onclick=\"GoToItem(" + fv + i + x + ");return false;\">" + oName + "</a>";
					TreeNode oNode = new TreeNode(text, oValue);
					oNode.ImageUrl = "../Documents/Images/VSObjects/" + or["Type"].ToString() + ".png";
					oNode.SelectAction = TreeNodeSelectAction.None;
					fNode.ChildNodes.Add(oNode);
				}
			}
		}

		protected void TreeView1_SelectedNodeChanged(object sender, EventArgs e)
		{
			string path = TreeView1.SelectedNode.ValuePath;
			// Separate file and class
			string fileName = string.Empty;
			string itemName = string.Empty;
			int itemIndex = 0;
			string[] parts = path.Split('/');
			if (parts.Length > 1) fileName = parts[1];
			if (parts.Length > 2)
			{
				itemName = parts[2].Split('&')[0];
				itemIndex = int.Parse(parts[2].Split('&')[1]);
			}
			//LoadData(fileName, itemName, itemIndex);
		}


	}
}
