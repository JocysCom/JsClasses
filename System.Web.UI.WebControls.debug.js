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
//=============================================================================

//=============================================================================
// CLASS: 
//-----------------------------------------------------------------------------

System.Web.UI.WebControls.InitDialog = function (sender, e) {
	System.Web.UI.WebControls.DialogBox.OnClick(sender, e);
	var prefixEnd = sender.id.lastIndexOf("_") + 1 + e.Prefix.length;
	var prefix = sender.id.substring(0, prefixEnd);

	var parentEnd = sender.id.lastIndexOf("_");
	var parentId = sender.id.substring(0, parentEnd + 1);

	var tableId = prefix + "Table";

	var dialogPanelId = prefix + "DialogPanel";
	var holderPanelId = prefix + "HolderPanel";
	var searchButtonId = prefix + "SearchButton";
	var clearButtonId = prefix + "ClearButton";

	if (!$("#" + holderPanelId).length) {
		alert("#" + e.Prefix + "HolderPanel not found");
	}

	if (!$("#" + dialogPanelId).length) {
		alert("#" + e.Prefix + "DialogPanel not found");
	}

	if (!$("#" + tableId).length) {
		alert("#" + e.Prefix + "Table not found");
	}
	
	$("#" + holderPanelId).css("display", "none");

	System.Web.UI.WebControls.ListView.FixTable(tableId);

	function callCommand(sender, eFrom, eTo, commandName) {
		eTo.CommandName = commandName;
		eTo.FindControl = function (id) {
			var end = prefix.lastIndexOf("_");
			var parentId = prefix.substring(0, end + 1);
			return $("#" + parentId + id);
		};
		// Pass properties from parrent event arguments.
		for (var name in eFrom) {
			eTo[name] = eFrom[name];
		}
		// Call command.
		eFrom.DataTableItemCommand(sender, eTo);
	}

	callCommand(this, e, {}, "DialogOpen");

	// Update static function to make sure that it is using current 'e'.
	e.DialogButton = $("#" + sender.id);
	System.Web.UI.WebControls.CurrentE = e;

	var table;
	if ($.fn.dataTable.isDataTable("#" + tableId)) {
		//table = $("#" + tableId).DataTable();
		table = $("#" + tableId).DataTable();
		for (var i = 0; i < e.Columns.length; i++) {
			table.columns(i).visible(e.Columns[i].visible);
		}
		table.page(0).draw(false);
		table.ajax.reload(null, false);
	} else {
		// Create DataTable object.
		table = $("#" + tableId).DataTable({
			processing: true,
			pageLength: 100,
			scrollY: "400px",
			scrollCollapse: true,
			//paging: false
			sort: e.DataTableSort ? true : false,
			// Move dialog to the center on every draw event of the table.
			drawCallback: function (settings) {
				var e2 = { CancelDataBound: false };
				callCommand(this, e, e2, "DataBound");
				if (e2.CancelDataBound === true)
				{
					// Enable open dialog button.
					e.DialogButton.attr("disabled", null);
					// Close dialog.
					$("#" + dialogPanelId).dialog("close");
				} else {
					$("#" + holderPanelId).css("display", "block");
					$("#" + dialogPanelId).dialog({
						position: { my: "center", at: "center", of: window }
					});
				}
			},
			// Hide page size dropdown box.
			lengthChange: false,
			// Hide search box.
			filter: false,
			ajax: {
				url: e.Url,
				type: "GET",
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				beforeSend: function (jqXHR, settings) {
					var e = System.Web.UI.WebControls.CurrentE;
					callCommand(this, e, { Item: data }, "BeforeSend");
					if (typeof e.Search !== "undefined") {
						for (var i = 0; i < e.Search.length; i++) {
							var name = e.Search[i].name;
							var data = e.Search[i].data;
							var value = $("#" + parentId + name).val();
							settings.url += "&" + data + "=" + encodeURIComponent(value);
						}
					}
					return true;
				},
				dataFilter: function (data, type) {
					var json = $.parseJSON(data);
					if (json && json.hasOwnProperty("d")) json = json.d;
					return json;
				}
			},
			columns: e.Columns,
			serverSide: true,
			select: true
		});
		// Reload data when Search buton is clicked.
		$("#" + searchButtonId).on('click', function () {
			table.ajax.reload(null, false);
		});
		// Clear search and reload data when [Clear] button is pressed.
		$("#" + clearButtonId).on('click', function () {
			for (var i = 0; i < e.Search.length; i++) {
				var name = e.Search[i].name;
				$("#" + parentId + name).val("");
			}
			table.ajax.reload(null, false);
		});
		if (typeof e.Search !== "undefined") {
			// Reload table when [Enter] is pressed inside search box.
			for (var j = 0; j < e.Search.length; j++) {
				var name = e.Search[j].name;
				$("#" + parentId + name).keypress(function (e) {
					if (e.which === 13) {
						table.ajax.reload(null, false);
					}
				});
			}
		}
		$("#" + tableId + " tbody").on('click', 'tr', function () {
			var e = System.Web.UI.WebControls.CurrentE;
			var data = table.row(this).data();
			if (typeof data !== "undefined") {
				// Enable open dialog button.
				e.DialogButton.attr("disabled", null);
				// Close DialogBox.
				callCommand(this, e, { Item: data }, "Select");
				// Close dialog.
				$("#" + dialogPanelId).dialog("close");
			}
		});
	}
};

//==============================================================================
// END
//------------------------------------------------------------------------------
