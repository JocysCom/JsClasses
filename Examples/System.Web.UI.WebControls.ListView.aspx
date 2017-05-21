<%@ Page Language="C#" MasterPageFile="SiteExamples.Master" AutoEventWireup="true"
	Title="System.Web.UI.WebControls.ListView"
	CodeFile="System.Web.UI.WebControls.ListView.aspx.cs"
	Inherits="JocysCom.WebSites.WebApp.Scripts.Classes.Examples.System_Web_UI_WebControls_ListView" %>

<asp:Content ID="HeadContent" ContentPlaceHolderID="HeadContentPlaceHolder" runat="server">
	<link href="<%= Page.ResolveUrl("~/Includes/jquery-ui/jquery-ui.min.css") %>" rel="stylesheet" />
	<link href="<%= Page.ResolveUrl("~/Includes/datatables/css/jquery.dataTables.css") %>" rel="stylesheet" />
</asp:Content>
<asp:Content ID="BodyContent" ContentPlaceHolderID="BodyContentPlaceHolder" runat="server">
	<asp:ScriptManagerProxy runat="server" ID="ScriptManagerProxy1">
		<Scripts>
			<asp:ScriptReference Path="~/Includes/jquery-1.12.4.min.js" />
			<asp:ScriptReference Path="~/Includes/jquery-ui/jquery-ui.js" />
			<asp:ScriptReference Path="~/Includes/datatables/js/jquery.dataTables.js" />
			<asp:ScriptReference Path="../System.debug.js" />
			<asp:ScriptReference Path="../System.Web.UI.WebControls.debug.js" />
			<asp:ScriptReference Path="../System.Web.UI.WebControls.ListView.debug.js" />
			<asp:ScriptReference Path="../System.Web.UI.WebControls.DialogBox.debug.js" />
		</Scripts>
	</asp:ScriptManagerProxy>
	<table>
		<tr>
			<td>Input 1:</td>
			<td>
				<input id="DemoListViewColumn1Input" type="text" runat="server" /></td>
		</tr>
		<tr>
			<td>Input 2:</td>
			<td>
				<input id="DemoListViewColumn2Input" type="text" runat="server" />
			</td>
		</tr>
		<tr>
			<td></td>
			<td>
				<input runat="server" type="button" id="DemoListViewClientButton" value="Open Dialog..." class="ui-button-blue ui-button ui-corner-all ui-widget" onclick="InitDialog(this, { Prefix: 'DemoListView' })" /></td>
		</tr>
		<tr>
			<td></td>
			<td>
				<asp:TextBox ID="DataTextBox" runat="server" Columns="64" Rows="24" TextMode="MultiLine"></asp:TextBox>
			</td>
		</tr>
	</table>
	<div runat="server" id="DemoListViewClientStatus">
	</div>
	<div runat="server" id="DemoListViewHolderPanel"></div>
	<div runat="server" id="DemoListViewDialogPanel" title="Demo List View" style="display: none;">
		<table width="100%" style="background-color: #f0f0f0; margin-top: 4px; margin-bottom: 4px;">
			<tr>
				<td style="width: 0; white-space: nowrap;">Name:</td>
				<td style="width: 0;">
					<input runat="server" id="SearchNameTextBox" type="text" /></td>
				<td style="width: 0;"></td>
				<td style="width: 0;"></td>
				<td></td>
			</tr>
			<tr>
				<td style="white-space: nowrap;">Description:</td>
				<td>
					<input runat="server" id="SearchDescriptionTextBox" type="text" />
				</td>
				<td>
					<input runat="server" id="DemoListViewSearchButton" type="button" value="Search" class="ui-button-blue ui-button ui-corner-all ui-widget" />
				</td>
				<td>
					<input runat="server" id="DemoListViewClearButton" type="button" value="Clear" class="ui-button-blue ui-button ui-corner-all ui-widget" />
				</td>
				<td></td>
			</tr>
			<tr>
				<td style="white-space: nowrap;">Date:</td>
				<td>
					<input runat="server" id="SearchDateTextBox" type="text" /></td>
				<script type="text/javascript">
					$(function () {
						$("[id$=SearchDateTextBox]").datepicker({
							dateFormat: 'yy-mm-dd',
							beforeShow: function (input, inst) {
								$('#ui-datepicker-div').addClass("SWUI_BoxShadow");
							}
						});
					});
				</script>
				<td></td>
				<td></td>
				<td></td>
			</tr>
		</table>
		<table runat="server" width="100%" id="DemoListViewTable" class="display SWUI_GridViewTable_NoWrap SQUI_DataTables">
			<thead>
				<tr>
					<th data-datafield="column1">Column 1</th>
					<th data-datafield="column2">Column 2</th>
					<th data-datafield="column3">Column 3</th>
					<th data-datafield="column4">Column 4</th>
				</tr>
			</thead>
			<tbody>
				<tr style="display: none;">
					<td>#column1</td>
					<td>#column2</td>
					<td>#column3</td>
					<td>#column4</td>
				</tr>
			</tbody>
		</table>
	</div>
	<script type="text/javascript">
					function InitDialog(sender, e) {
						e.Search = [
							{ name: "SearchNameTextBox", data: "SearchName" },
							{ name: "SearchDescriptionTextBox", data: "SearchDescription" },
							{ name: "SearchDateTextBox", data: "SearchDate" }
						];
						e.Url = "System.Web.UI.WebControls.ListView.aspx/GetData";
						e.Columns = [
							{ data: "id" },
							{ data: "name" },
							{ data: "description" },
							{
								data: "date",
								type: "date",
								render: function (value) {
									if (value === null) return "";
									var pattern = /Date\(([^)]+)\)/;
									var results = pattern.exec(value);
									var dt = new Date(parseFloat(results[1]));
									return dt.ToString("yyyy-MM-dd");
								}
							}
						];
						e.DataTableItemCommand = function (sender, e) {
							if (e.CommandName == "Select") {
								// Store selected values.
								e.FindControl("DemoListViewColumn1Input").val(e.Item.id);
								e.FindControl("DemoListViewColumn2Input").val(e.Item.name);
							}
						}
						System.Web.UI.WebControls.InitDialog(sender, e);
					}
	</script>
</asp:Content>
