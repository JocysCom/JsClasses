//=============================================================================
// Jocys.com JavaScript.NET Classes               (In C# Object Oriented Style)
// Created by Evaldas Jocys <evaldas@jocys.com>
//-----------------------------------------------------------------------------
// You can include this script on both sides - server and client:
// Server: <!-- #INCLUDE FILE="ScriptFile.js" -->
// Client: <script type="text/javascript" src="ScriptFile.js"></script>
//-----------------------------------------------------------------------------
// Warning: Be careful about what code you include in such way. Since the  code
// will be passed to the client side as simple text, your code can be  seen  by
// anyone who wants. Never do this with  scripts  which  contain  any  kind  of
// passwords, database connection strings, or SQL queries.
//=============================================================================
/// <reference path="System.debug.js" />
//=============================================================================
// Namespaces
//-----------------------------------------------------------------------------
// <PropertyGroup>
//		<RootNamespace>System.Web.UI.WebControls</RootNamespace>
// <PropertyGroup>
//-----------------------------------------------------------------------------
System.Type.RegisterNamespace("System.Web.UI.WebControls");
//-----------------------------------------------------------------------------
// CLASS: System.Type
//-----------------------------------------------------------------------------

//$(function () {
//	GetCustomers(1);
//});
//$(".Pager .page").live("click", function () {
//	GetCustomers(parseInt($(this).attr('page')));
//});


System.Web.UI.WebControls.ListView = function () {

};

System.Web.UI.WebControls.ListView.GetCustomers = function (sender, e) {
	$.ajax({
		type: "POST",
		url: e.Url,
		//data: { carrier: '', flight: 0, date: '2017-05-10T00:00:00', departure_city: '', startRowIndex: 0, maximumRows: 20 },
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function (response) {
			System.Web.UI.WebControls.ListView.OnSuccess(response, e);
		},
		failure: function (response) {
			alert(response.d);
		},
		error: function (response) {
			alert(response.d);
		}
	});
	return false;
};

System.Web.UI.WebControls.ListView.FixTable = function (id) {
	//var items = xml.find("Results");
	var grid = $("#" + id);
	var head = $(grid).children("thead");
	// If header is missing then...
	if (!head.length) {
		var headRows = $(grid).find("tbody tr th");
		var headRow = headRows.parent();
		grid[0].createTHead();
		head = $(grid).children("thead");
		head.append(headRow);
	}
};

System.Web.UI.WebControls.ListView.OnSuccess = function (response, e) {
	var gridId = e.ListViewId;

	// XML processing.
	var xmlDoc = $.parseXML(response.d);
	var xml = $(xmlDoc);
	var xmlDataSet = xml.context.firstChild;
	// Node.ELEMENT_NODE == 1
	var xmlRows = $(xmlDataSet).contents().filter(function () { return this.nodeType === 1; });

	//var items = xml.find("Results");
	var grid = $("[id*=" + gridId + "]");
	var head = $(grid).children("thead");
	var body = $(grid).children("tbody");
	var headRow;
	// If header is missing then...
	if (!head.length) {
		var headRows = $(grid).find("tbody tr th");
		headRow = headRows.parent();
		grid[0].createTHead();
		head = $(grid).children("thead");
		head.append(headRow);
	}
	headRow = $("[id*=" + gridId + "] thead tr:first-child");
	var bodyRow = $("[id*=" + gridId + "] tbody tr:first-child");
	//var bodyRowAlt = $("[id*=" + gridId + "] tbody tr:nth-child(2)");
	var bodyRows = $("[id*=" + gridId + "] tbody tr");
	var columns = headRow.children();
	body.hide();
	bodyRow.hide();
	bodyRows.not(headRow).not(bodyRow).remove();
	$.each(xmlRows, function () {
		var xmlRow = $(this);
		// Clone last row in the table.
		var row = bodyRow.clone(true);
		var columnIndex = -1;
		$.each(columns, function () {
			var column = $(this);
			var dataField = column.attr("data-datafield");
			columnIndex++;
			if (dataField) {
				var value = xmlRow.find(dataField).text();
				$("td", row).eq(columnIndex).html(value);
			}
		});
		row.show();
		$("[id*=" + gridId + "]").append(row);
	});
	body.show();
	$("[id*=" + gridId + "]").DataTable();
	//var pager = xml.find("Pager");
	//$(".Pager").ASPSnippets_Pager({
	//	ActiveCssClass: "current",
	//	PagerCssClass: "pager",
	//	PageIndex: parseInt(pager.find("PageIndex").text()),
	//	PageSize: parseInt(pager.find("PageSize").text()),
	//	RecordCount: parseInt(pager.find("RecordCount").text())
	//});
};

//==============================================================================
// END
//------------------------------------------------------------------------------
