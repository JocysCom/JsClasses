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
using System.Security.Cryptography;
using System.Runtime.InteropServices;
using System.Security;
using System.Text;
using System.Linq;

namespace Scripts.Classes.Examples
{
	public partial class System_Security_Cryptography_SHA256 : System.Web.UI.Page
	{
		protected void Page_Load(object sender, EventArgs e)
		{
		}

		#region Log Function

		public void WriteLog(string text)
		{
			LogTextBox.Text += text + " \r\n";
		}

		private void WriteArray(string name, byte[] input)
		{
			System.Collections.BitArray ba = new System.Collections.BitArray(input);
			int length = ba.Length;
			System.Text.StringBuilder sb = new System.Text.StringBuilder();
			for (int i = 0; i < length; i++)
			{
				if ((i > 0) && (i % 8 == 0)) sb.Append(' ');
				sb.Append(ba[i] ? '1' : '0');
			}
			WriteLog(name + " = [" + System.BitConverter.ToString(input) + "]" +
			" // [" + sb.ToString() + "]");
		}

		#endregion


		protected void TestButton_Click(object sender, EventArgs e)
		{
			// Define key and data string.
			var k = "test key";
			var s = "abc新闻网efg新闻网";
			var kb = System.Text.Encoding.UTF8.GetBytes(k);
			var sb = System.Text.Encoding.UTF8.GetBytes(s);
			
			// Test SHA256.
			WriteLog("// Create SHA256 Algorithm");
			var sha256 = new System.Security.Cryptography.SHA256CryptoServiceProvider();
			var hash = System.BitConverter.ToString(sha256.ComputeHash(sb));
			WriteLog("sha256.ComputeHash('" + s + "') = " + hash);

			//WriteLog("// Create SHA256 Algorithm");
			//var sha2 = new SHA256Managed();
			//hash = System.BitConverter.ToString(sha2.ComputeHash(sb));
			//WriteLog("sha2.ComputeHash('" + s + "') = " + hash);
			//WriteLog(sha2.Log.ToString());

			// Test HMACSHA256.
			Trace.Write("// Create HMAC-SHA256 Algorithm");
			var hmac = new System.Security.Cryptography.HMACSHA256(kb);
			hash = System.BitConverter.ToString(hmac.ComputeHash(sb));
			WriteLog("hmac.ComputeHash('" + k + "','" + s + "') = " + hash);
		}
	}

	#region Decompiled

	[ComVisible(true)]
	public class SHA256Managed : SHA256
	{
		// Fields
		private byte[] _buffer;
		private long _count;
		uint[] _K = new uint[] {
		1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580,
		3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895,
		666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344,
		430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298
	};
		private uint[] _stateSHA256;
		private uint[] _W;
		public StringBuilder Log;


		// Methods
		public SHA256Managed()
		{
			this._stateSHA256 = new uint[8];
			this._buffer = new byte[64];
			this._W = new uint[64];
			Log = new StringBuilder();
			this.InitializeState();
		}

		private byte[] _EndHash()
		{
			byte[] block = new byte[32];
			int num = 64 - ((int)(this._count & 63L));
			if (num <= 8)
			{
				num += 64;
			}
			byte[] partIn = new byte[num];
			partIn[0] = 128;
			long num2 = this._count * 8L;
			partIn[num - 8] = (byte)((num2 >> 56) & 255L);
			partIn[num - 7] = (byte)((num2 >> 48) & 255L);
			partIn[num - 6] = (byte)((num2 >> 40) & 255L);
			partIn[num - 5] = (byte)((num2 >> 32) & 255L);
			partIn[num - 4] = (byte)((num2 >> 24) & 255L);
			partIn[num - 3] = (byte)((num2 >> 16) & 255L);
			partIn[num - 2] = (byte)((num2 >> 8) & 255L);
			partIn[num - 1] = (byte)(num2 & 255L);
			this._HashData(partIn, 0, partIn.Length);
			DWORDToBigEndian(block, this._stateSHA256, 8);
			base.HashValue = block;
			return block;
		}

		internal void DWORDToBigEndian(byte[] block, uint[] x, int digits)
		{
			int index = 0;
			for (int i = 0; index < digits; i += 4)
			{
				block[i] = (byte)((x[index] >> 24) & 255);
				block[i + 1] = (byte)((x[index] >> 16) & 255);
				block[i + 2] = (byte)((x[index] >> 8) & 255);
				block[i + 3] = (byte)(x[index] & 255);
				index++;
			}
		}


		[SecurityCritical]
		internal void DWORDFromBigEndian(uint[] x, int digits, byte[] block)
		{
			int index = 0;
			for (int i = 0; index < digits; i += 4)
			{
				x[index] = (uint)((((block[i] << 24) | (block[i + 1] << 16)) | (block[i + 2] << 8)) | block[i + 3]);
				index++;
			}
		}


		[SecuritySafeCritical]
		private void _HashData(byte[] partIn, int ibStart, int cbSize)
		{
			int byteCount = cbSize;
			int srcOffsetBytes = ibStart;
			int dstOffsetBytes = (int)(this._count & 63L);
			this._count += byteCount;

			if ((dstOffsetBytes > 0) && ((dstOffsetBytes + byteCount) >= 64))
			{
				Buffer.BlockCopy(partIn, srcOffsetBytes, this._buffer, dstOffsetBytes, 64 - dstOffsetBytes);
				srcOffsetBytes += 64 - dstOffsetBytes;
				byteCount -= 64 - dstOffsetBytes;
				SHATransform(_W, _stateSHA256, _buffer);
				dstOffsetBytes = 0;
			}
			while (byteCount >= 64)
			{
				Buffer.BlockCopy(partIn, srcOffsetBytes, this._buffer, 0, 64);
				srcOffsetBytes += 64;
				byteCount -= 64;
				SHATransform(_W, _stateSHA256, _buffer);
			}
			if (byteCount > 0)
			{
				Buffer.BlockCopy(partIn, srcOffsetBytes, this._buffer, dstOffsetBytes, byteCount);
			}

		}

		private uint Ch(uint x, uint y, uint z)
		{
			return ((x & y) ^ ((x ^ uint.MaxValue) & z));
		}

		protected override void HashCore(byte[] rgb, int ibStart, int cbSize)
		{
			this._HashData(rgb, ibStart, cbSize);
		}

		protected override byte[] HashFinal()
		{
			return this._EndHash();
		}

		public override void Initialize()
		{
			this.InitializeState();
			Array.Clear(this._buffer, 0, this._buffer.Length);
			Array.Clear(this._W, 0, this._W.Length);
		}

		private void InitializeState()
		{
			this._count = 0L;
			this._stateSHA256[0] = 1779033703;
			this._stateSHA256[1] = 3144134277;
			this._stateSHA256[2] = 1013904242;
			this._stateSHA256[3] = 2773480762;
			this._stateSHA256[4] = 1359893119;
			this._stateSHA256[5] = 2600822924;
			this._stateSHA256[6] = 528734635;
			this._stateSHA256[7] = 1541459225;
		}

		private uint Maj(uint x, uint y, uint z)
		{
			return (((x & y) ^ (x & z)) ^ (y & z));
		}

		private uint RotateRight(uint x, int n)
		{
			return ((x >> n) | (x << (32 - n)));
		}

		[SecurityCritical]
		private void SHA256Expand(uint[] x)
		{
			for (int i = 16; i < 64; i++)
			{
				x[i] = ((sigma_1(x[i - 2]) + x[i - 7]) + sigma_0(x[i - 15])) + x[i - 16];
			}
		}

		[SecurityCritical]
		private void SHATransform(uint[] expandedBuffer, uint[] state, byte[] block)
		{
			Log.AppendFormat("In:  {0}\r\n", string.Join("-", state.Select(x => x.ToString("X8"))));
			uint a = state[0];
			uint b = state[1];
			uint c = state[2];
			uint d = state[3];
			uint e = state[4];
			uint f = state[5];
			uint g = state[6];
			uint h = state[7];
			Log.AppendFormat("Blo: {0}\r\n", string.Join("-", block.Select(x => x.ToString("X8"))));
			DWORDFromBigEndian(expandedBuffer, 16, block);
			Log.AppendFormat("FBE: {0}\r\n", string.Join("-", expandedBuffer.Select(x => x.ToString("X8"))));
			SHA256Expand(expandedBuffer);
			Log.AppendFormat("Exp: {0}\r\n", string.Join("-", expandedBuffer.Select(x => x.ToString("X8"))));
			for (int i = 0; i < 64; i++)
			{

				var num17 = h + Sigma_1(e) + Ch(e, f, g) + this._K[i] + expandedBuffer[i];
				var num13 = d + num17;
				var num9 = num17 + Sigma_0(a) + Maj(a, b, c);
				i++;
				num17 = g + Sigma_1(num13) + Ch(num13, e, f) + this._K[i] + expandedBuffer[i];
				var num14 = c + num17;
				var num10 = num17 + Sigma_0(num9) + Maj(num9, a, b);
				i++;
				num17 = f + Sigma_1(num14) + Ch(num14, num13, e) + this._K[i] + expandedBuffer[i];
				var num16 = b + num17;
				var num11 = num17 + Sigma_0(num10) + Maj(num10, num9, a);
				i++;
				num17 = e + Sigma_1(num16) + Ch(num16, num14, num13) + this._K[i] + expandedBuffer[i];
				var num15 = a + num17;
				var num12 = num17 + Sigma_0(num11) + Maj(num11, num10, num9);
				i++;
				num17 = num13 + Sigma_1(num15) + Ch(num15, num16, num14) + this._K[i] + expandedBuffer[i];
				h = num9 + num17;
				d = (num17 + Sigma_0(num12)) + Maj(num12, num11, num10);
				i++;
				num17 = num14 + Sigma_1(h) + Ch(h, num15, num16) + this._K[i] + expandedBuffer[i];
				g = num10 + num17;
				c = num17 + Sigma_0(d) + Maj(d, num12, num11);
				i++;
				num17 = num16 + Sigma_1(g) + Ch(g, h, num15) + this._K[i] + expandedBuffer[i];
				f = num11 + num17;
				b = num17 + Sigma_0(c) + Maj(c, d, num12);
				i++;
				num17 = num15 + Sigma_1(f) + Ch(f, g, h) + this._K[i] + expandedBuffer[i];
				e = num12 + num17;
				a = num17 + Sigma_0(b) + Maj(b, c, d);
				Log.AppendFormat("{0,3}: {0:X8}-{1:X8}-{2:X8}-{3:X8}-{4:X8}-{5:X8}-{6:X8}-{7:X8}\r\n", i, a, b, c, d, e, f, g, h);
			}
			state[0] += a;
			state[1] += b;
			state[2] += c;
			state[3] += d;
			state[4] += e;
			state[5] += f;
			state[6] += g;
			state[7] += h;
			Log.AppendFormat("Out: {0}", string.Join("-", state.Select(x => x.ToString("X8"))));
		}

		private uint sigma_0(uint x)
		{
			return ((RotateRight(x, 7) ^ RotateRight(x, 18)) ^ (x >> 3));
		}

		private uint Sigma_0(uint x)
		{
			return ((RotateRight(x, 2) ^ RotateRight(x, 13)) ^ RotateRight(x, 22));
		}

		private uint sigma_1(uint x)
		{
			return ((RotateRight(x, 17) ^ RotateRight(x, 19)) ^ (x >> 10));
		}

		private uint Sigma_1(uint x)
		{
			return ((RotateRight(x, 6) ^ RotateRight(x, 11)) ^ RotateRight(x, 25));
		}
	}




	#endregion
}