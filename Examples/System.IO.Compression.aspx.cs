using System;
using System.Collections.Generic;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.IO.Compression;

namespace Scripts.Classes.Examples
{
	public partial class System_IO_Compression : System.Web.UI.Page
	{
		protected void Page_Load(object sender, EventArgs e)
		{
			if (!IsPostBack)
			{
				var text = String.Empty;
				for (var i = 0; i < 100; i++)
				{
					if (i > 0) text += " ";
					text += "Demo text.";
				}
				DecompressedTextBox.Text = text;
			}
		}

		protected void CompressButton_Click(object sender, EventArgs e)
		{
			var text = DecompressedTextBox.Text;
			var bytes = System.Text.Encoding.UTF8.GetBytes(text);
			var srcStream = new System.IO.MemoryStream(bytes);
			var dstStream = new System.IO.MemoryStream();
			srcStream.Position = 0;
			var stream = new DeflateStream2(dstStream, System.IO.Compression.CompressionMode.Compress);
			// Copy the source file into the compression stream.
			//-------------------------------------------------
			//srcStream.WriteTo(stream);
			//-------------------------------------------------
			byte[] buffer = new byte[4096];
			int numRead;
			while ((numRead = srcStream.Read(buffer, 0, buffer.Length)) != 0)
			{
				stream.Write(buffer, 0, numRead);
			}
			//-------------------------------------------------
			stream.Close();
			var base64 = System.Convert.ToBase64String(dstStream.ToArray());
			CompressedTextBox.Text = base64;
			LogTextBox.Text += string.Format("Compress: srcStream.length = {0}, dstStream.Length = {1}\r\n", srcStream.Length, dstStream.ToArray().Length);

		}

		protected void DecompressButton_Click(object sender, EventArgs e)
		{
			var bytes = System.Convert.FromBase64String(CompressedTextBox.Text);
			var srcStream = new System.IO.MemoryStream(bytes);
			var dstStream = new System.IO.MemoryStream();
			srcStream.Position = 0;
			var stream = new DeflateStream2(srcStream, System.IO.Compression.CompressionMode.Decompress);
			//Copy the decompression stream into the output file.
			//-------------------------------------------------
			byte[] buffer = new byte[4096];
			int numRead;
			while ((numRead = stream.Read(buffer, 0, buffer.Length)) != 0)
			{
				dstStream.Write(buffer, 0, numRead);
			}
			//-------------------------------------------------
			//stream.CopyTo(dstStream);
			//-------------------------------------------------
			dstStream.Close();
			var text = System.Text.Encoding.UTF8.GetString(dstStream.ToArray());
			DecompressedTextBox.Text = text;
			LogTextBox.Text += string.Format("Decompress: srcStream.length = {0}, dstStream.Length = {1}\r\n", srcStream.Length, dstStream.ToArray().Length);
		}

	}
}