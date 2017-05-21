<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ShowTree.aspx.cs" Inherits="JocysCom.WebSites.WebApp.Scripts.Classes.Documents.ShowTree" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
	<title>Jocys.com JavaScript.NET Class Library Browser</title>
	<link type="text/css" rel="stylesheet" href="../System.Web.UI.Interface.debug.css" />
	<script type="text/javascript" language="javascript" src="../System.debug.js"></script>
	<style type="text/css">
		head {height: 100%; }
		img {float: left; }
		.FileNode {margin-left: 2px; }
		.ItemNode {margin-left: 3px; }
	</style>
	<script type="text/javascript" language="javascript">
		function GoToItem(file, item, index){
			//alert(file+"\\"+item+"\\"+index);
			parent.NavigateTo(file, item, index);
		}
	</script>
</head>
<body class="SWUI_Scroll" style="background-color: White;">
	<form id="form1" runat="server">
		<asp:TreeView ID="TreeView1" runat="server" ExpandDepth="1" ShowLines="True" OnSelectedNodeChanged="TreeView1_SelectedNodeChanged">
			<Nodes>
				<asp:TreeNode Text="Home Page" Value="" ImageUrl="Images/Icons/Home-16x16.png"></asp:TreeNode>
				<asp:TreeNode Text="System" Value="System"></asp:TreeNode>
			</Nodes>
		</asp:TreeView>
	</form>
</body>
</html>
