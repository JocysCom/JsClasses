using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Script.Services;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace JocysCom.WebSites.WebApp.Scripts.Classes.Examples
{

	public partial class System_Web_UI_WebControls_ListView : System.Web.UI.Page
	{
		protected void Page_Load(object sender, EventArgs e)
		{
		}
		/// <summary>
		/// https://datatables.net/manual/server-side
		/// </summary>
		[WebMethod]
		[ScriptMethod(UseHttpGet = true, ResponseFormat = ResponseFormat.Json)]
		public static string GetData()
		{
			var request = GetFromQueryString<DataTablesRequest>();
			var sParams = GetFromQueryString<SearchParams>();

			// Parameters:
			// https://datatables.net/manual/server-side
			var searchValue = HttpContext.Current.Request.QueryString["search[value]"];
			var searchRegex = HttpContext.Current.Request.QueryString["search[regex]"];

			var dataSet = new DataSet("DataSet1");
			var dataTable = dataSet.Tables.Add("Table1");
			dataTable.Columns.Add("id", typeof(int));
			dataTable.Columns.Add("name", typeof(string));
			dataTable.Columns.Add("description", typeof(string));
			dataTable.Columns.Add("date", typeof(DateTime));
			for (int i = 0; i < 250; i++)
			{
				dataTable.Rows.Add(i + 1, "Name " + (i + 1).ToString() + "a", "Description " + i.ToString() + "b", DateTime.Now.Date.AddDays(-i));
			}
			// https://datatables.net/examples/data_sources/server_side.html
			var serializer = new System.Web.Script.Serialization.JavaScriptSerializer();
			var rows = new List<Dictionary<string, object>>();
			Dictionary<string, object> row;
			for (int i = 0; i < dataTable.Rows.Count; i++)
			{
				var dataRow = dataTable.Rows[i];
				if (!string.IsNullOrEmpty(sParams.SearchName))
				{
					var found2 = ((string)dataRow["name"]).Contains(sParams.SearchName);
					if (!found2) continue;
				}
				if (!string.IsNullOrEmpty(sParams.SearchDescription))
				{
					var found3 = ((string)dataRow["description"]).Contains(sParams.SearchDescription);
					if (!found3) continue;
				}
				if (sParams.SearchDate.HasValue)
				{
					var found4 = (DateTime)dataRow["date"] == sParams.SearchDate.Value;
					if (!found4) continue;
				}
				row = new Dictionary<string, object>();
				foreach (DataColumn col in dataTable.Columns)
				{
					row.Add(col.ColumnName, dataRow[col]);
				}
				rows.Add(row);
			}
			var results = new DataTablesResults();
			results.recordsTotal = dataTable.Rows.Count;
			results.recordsFiltered = rows.Count;
			results.data = rows.Skip(request.start).Take(request.length).ToList();
			return serializer.Serialize(results);
		}

		#region Helper Methods

		public static T GetFromQueryString<T>() where T : new()
		{
			var obj = new T();
			// Get all object properties.
			var properties = typeof(T).GetProperties();
			foreach (var property in properties)
			{
				var stringValue = HttpContext.Current.Request.QueryString[property.Name];
				var converter = System.ComponentModel.TypeDescriptor.GetConverter(property.PropertyType);
				var value = converter.ConvertFromString(null, System.Globalization.CultureInfo.InvariantCulture, stringValue);
				if (value == null)
					continue;
				// Set property value. 
				property.SetValue(obj, value, null);
			}
			return obj;
		}

		public static System.Collections.Specialized.NameValueCollection GetQueryFromObject<T>(T obj)
		{
			// Get all object properties.
			var query = HttpUtility.ParseQueryString("");
			var properties = typeof(T).GetProperties();
			foreach (var property in properties)
			{
				var converter = System.ComponentModel.TypeDescriptor.GetConverter(property.PropertyType);
				// Get property value. 
				var value = property.GetValue(obj, null);
				if (value == null)
					continue;
				var stringValue = converter.ConvertToString(null, System.Globalization.CultureInfo.InvariantCulture, value);
				query.Add(property.Name, stringValue);
			}
			return query;
		}

		#endregion

		#region Helper Classes

		public class DataTablesRequest
		{
			public int draw { get; set; }
			public int start { get; set; }
			public int length { get; set; }
		}

		public class SearchParams
		{
			public string SearchName { get; set; }
			public string SearchDescription { get; set; }
			public DateTime? SearchDate { get; set; }

		}

		public class DataTablesResults
		{
			public DataTablesResults()
			{
				data = new List<Dictionary<string, object>>();
			}

			public int draw { set; get; }
			public int recordsTotal { set; get; }
			public int recordsFiltered { set; get; }
			public string error { set; get; }
			public List<Dictionary<string, object>> data { set; get; }
		}

		#endregion


	}
}