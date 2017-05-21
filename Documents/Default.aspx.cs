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
using System.Text.RegularExpressions;

namespace JocysCom.WebSites.WebApp.Scripts.Classes.Documents
{

	public partial class Default : System.Web.UI.Page
	{

		public struct Resource
		{
			public const string CodePattern = @"/// <summary>(?:(?!(\r\n\r\n)*?\r\n\r\n).)+</[a-z]+>\r\ncls\s+=\s+(function|{\r\n).*?\r\n}.*?\r\n\r\n|cls\s+=\s+(function|{\r\n).*?\r\n}.*?\r\n\r\n";
			public const string ItemsPattern = @"\r\n(System.[_0-9a-zA-Z.\[\]]+).*?\s+=\s+(function|{\r\n)";
			public const string ItemsPatternA = @"/// <summary>(?:(?!(\r\n\r\n)*?\r\n\r\n).)+</[a-z]+>\r\nItemsPatternB|ItemsPatternB";
			public const string ItemsPatternB = @"([_0-9a-zA-Z.]+)\s+=\s+(function|{\r\n).*?\r\n}.*?\r\n\r\n";
		}

		static DataTable _FilesTable;
		public static DataTable FilesTable
		{
			get { return _FilesTable = _FilesTable ?? CreateFilesTable("System"); }
			set { _FilesTable = value; }

		}

		static DataTable _ObjectsTable;
		public static DataTable ObjectsTable
		{
			get { return _ObjectsTable = _ObjectsTable ?? CreateObjectsTable(FilesTable); }
			set { _ObjectsTable = value; }

		}

		protected void Page_Load(object sender, EventArgs e)
		{
			if (Page.IsPostBack != true)
			{
				if (!string.IsNullOrEmpty(Request["reset"]))
				{
					ObjectsTable = null;
					FilesTable = null;
				}
				//ItemHyperLink.Text = "";
				//ItemLabel.Text = "";
				//FileHyperLink.Text = "";
				ItemsPatternTextBox.Text = Resource.ItemsPattern;
				FilesGridView.DataSource = FilesTable;
				FilesGridView.DataBind();
				ObjectsGridView.DataSource = ObjectsTable;
				ObjectsGridView.DataBind();
				string fileName = (Request["File"] == null) ? string.Empty : Request["File"].ToString();
				string itemName = (Request["Item"] == null) ? string.Empty : Request["Item"].ToString();
				int itemIndex = (Request["Index"] == null) ? 0 : int.Parse(Request["Index"].ToString());
				DataRow[] rows = ObjectsTable.Select("FileName='" + fileName + "' AND ItemName='" + itemName + "'");
			}
		}

		static DataTable CreateFilesTable(string prefix)
		{
			DataTable table = new DataTable();
			table.Columns.Add("FileName", typeof(string));
			table.Columns.Add("FileTitle", typeof(string));
			table.Columns.Add("RootNamespace", typeof(string));
			// Fill table.
			string sysPath = HttpContext.Current.Server.MapPath("../");
			System.IO.DirectoryInfo dirInfo = new System.IO.DirectoryInfo(sysPath);
			System.IO.FileInfo[] files = dirInfo.GetFiles(prefix + "*.debug.js");
			int length = files.Length;
			for (int i = 0; i < length; i++)
			{
				DataRow row = table.NewRow();
				row["FileName"] = files[i].Name;
				row["FileTitle"] = files[i].Name.Replace(prefix + ".", "").Replace(".debug.js", "");
				if (row["FileName"].ToString() == prefix + ".debug.js")
				{
					row["FileTitle"] = "_root";
				}
				string code = System.IO.File.ReadAllText(files[i].FullName);
				string pattern = "<RootNamespace>(.*?)</RootNamespace>";
				Regex namespaces = new Regex(pattern);
				MatchCollection mc = namespaces.Matches(code);
				if (mc.Count > 0)
				{
					if (mc[0].Groups.Count > 1)
					{
						row["RootNamespace"] = mc[0].Groups[1].Value;
					}
				}
				table.Rows.Add(row);
			}
			return table;
		}


		static DataTable CreateObjectsTable(DataTable filesTable)
		{
			// File, RootNamespace, Type, FullName, Name
			DataTable table = new DataTable("System");
			table.Columns.Add("FileName", typeof(string));
			table.Columns.Add("FileTitle", typeof(string));
			table.Columns.Add("RootNamespace", typeof(string));
			table.Columns.Add("Type", typeof(string));
			table.Columns.Add("ItemName", typeof(string));
			table.Columns.Add("ItemIndex", typeof(int));
			table.Columns.Add("ItemCaptureIndex", typeof(int));
			table.Columns.Add("ItemTitle", typeof(string));
			int length = filesTable.Rows.Count;
			for (int i = 0; i < length; i++)
			{
				string fileName = filesTable.Rows[i]["FileName"].ToString();
				string fileTitle = filesTable.Rows[i]["FileTitle"].ToString();
				string rootNamespace = filesTable.Rows[i]["RootNamespace"].ToString();
				// Add aditional info.
				string sysPath = HttpContext.Current.Server.MapPath("../");
				string code = System.IO.File.ReadAllText(sysPath + "\\" + fileName);
				// Classes inside.
				Regex namespaces = new Regex(Resource.ItemsPattern);
				MatchCollection mc = namespaces.Matches(code);
				for (int m = 0; m < mc.Count; m++)
				{
					DataRow row = table.NewRow();
					row["ItemCaptureIndex"] = mc[m].Index;
					row["FileName"] = fileName;
					row["FileTitle"] = fileTitle;
					row["RootNamespace"] = rootNamespace;
					string ns = mc[m].Groups[1].Value;
					// Determine type of object.
					string type = "Class";
					if (mc[m].Groups[2].Value == "{\r\n") type = "Enum";
					// Get code of firt item to determine type.
					string itemCode = GetItemFromCode(code, ns, 0);
					if (itemCode.IndexOf("/// <returns") > -1) type = "Method";
					if (itemCode.IndexOf("this.InitializeClass") > -1) type = "Class";
					// Set other table cell values.
					row["Type"] = type;
					row["ItemName"] = ns;
					row["ItemTitle"] = ns.Replace(rootNamespace + ".", "");
					int itemIndex = table.Select("FileName='" + fileName + "' AND ItemName='" + ns + "'").Length;
					row["ItemIndex"] = itemIndex;
					// Finaly add row to table.
					table.Rows.Add(row);
				}
			}
			return table;
		}


		public static string GetItemFromCode(string code, string itemName, int itemIndex)
		{
			string results = string.Empty;
			string pattern = Resource.CodePattern.Replace("cls", itemName).Replace("[", "\\[").Replace("]", "\\]");
			Regex namespaces = new Regex(pattern, RegexOptions.Singleline);
			MatchCollection mc = namespaces.Matches(code);
			int length = mc.Count;
			if (length > 0)
			{
				if (itemIndex > length) itemIndex = length - 1;
				results = mc[itemIndex].Value;
			}
			return results;
		}


	}
}
