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
// CLASS: System.Web.UI.WebControls.DialogBox
//-----------------------------------------------------------------------------

System.Web.UI.WebControls.DialogBox = function (prefix, waitMessage, autoOpen) {
	/* use jQuery-UI DialogBox */
};
System.Type.RegisterClass("System.Web.UI.WebControls.DialogBox");

System.Web.UI.WebControls.DialogBox.OnClick = function (sender, e) {
	var prefixEnd = sender.id.lastIndexOf("_") + 1 + e.Prefix.length;
	var prefix = sender.id.substring(0, prefixEnd);
	// Dialog status panel.
	var statusPanelId = prefix + "StatusPanel";
	// Dialog container panel.
	var dialogPanelId = prefix + "DialogPanel";
	// Dialog holder panel.
	var holderPanelId = prefix + "HolderPanel";
	// Server buttons.
	var acceptButtonId = prefix + "AcceptButton";
	var cancelButtonId = prefix + "CancelButton";

	// Get DOM objects.
	var dialogButton = $('#' + sender.id);
	var statusPanel = $('#' + statusPanelId);
	var dialogPanel = $('#' + dialogPanelId);
	var holderPanel = $('#' + holderPanelId);
	var acceptButton = $('#' + acceptButtonId);
	var cancelButton = $('#' + cancelButtonId);

	// Adjust holder to make sure that DialogBox can be moved all over the page.
	holderPanel.css("position", "absolute");
	holderPanel.css("top", "0");
	holderPanel.css("left", "0");

	dialogPanel.dialog({
		// Make sure that dialog will be created inside the form.
		appendTo: '#' + holderPanelId,
		// Disable interaction with parent page while Dialog is open.
		modal: true,
		autoOpen: false,
		closeOnEscape: true,
		dialogClass: 'SWUI_BoxShadow',
		position: { my: "center", at: "center", of: window },
		title: e.title,
		width: 'auto',
		height: 'auto',
		resizable: false,
		create: function (event, ui) {
			$(".ui-dialog-content").addClass("SWUI_ListViewDialog");
		},
		//modal: true,
		open: function () {
			// Hide [x] button.
			//$(".ui-dialog-titlebar-close").hide();
		},
		close: function (event, ui) {
			// If triggered by clicking on [x] button or pressing ESC key then...
			if (event.originalEvent) {
				dialogButton.attr("disabled", null);
			}
		},
		buttons: [
			/*{
				text: "OK",
				class: 'ui-button-blue',
				click: function () {
					dialogButton.attr("disabled", "disabled");
					if (statusPanel.length) {
						statusPanel.css("display", "block");
						if (typeof waitMessage !== "undefined") {
							statusPanel.text(waitMessage);
						}
					}
					if (acceptButton.length) {
						acceptButton.click();
					} else {
						dialogButton.attr("disabled", null);
					}
					$(this).dialog("close");
				}
			},*/
			{
				text: "Close",
				class: 'ui-button-blue',
				click: function () {
					if (cancelButton.length) {
						cancelButton.click();
					} else {
						dialogButton.attr("disabled", null);
					}
					$(this).dialog("close");
				}
			}
		]
	});
	dialogButton.attr("disabled", "disabled");
	dialogPanel.dialog('open');
	event.preventDefault();
};

//==============================================================================
// END
//------------------------------------------------------------------------------
