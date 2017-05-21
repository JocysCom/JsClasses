using System;
using System.Collections.Generic;
using System.Web;

namespace JocysCom.WebSites.WebApp.Common.JsClasses
{
	public class BigInt
	{
		// TODO: check how it behaves with max and min values.
		// GetMaxValue(int bytes) is  hexadecimal 0x7FFF...FF.
		// GetMinValue(int bytes) is  hexadecimal 0x80FF...FF.

		//-----------------------------------------------------------------------------------------------

		public static int MaxBytes = 0x80;
		//private int m_base = 0x100;
		private int m_maxbytes;
		private int m_size;
		public byte[] Elements;

		public BigInt()
		{
			m_maxbytes = BigInt.MaxBytes;
			this.Elements = new byte[m_maxbytes];
		}

		public BigInt(string s)
		{
			m_maxbytes = BigInt.MaxBytes;
			this.Elements = new byte[m_maxbytes];
			if (s.Contains("x")) this.FromHex(s);
			else this.FromDecimal(s);
		}

		public BigInt(byte b)
		{
			m_maxbytes = BigInt.MaxBytes;
			this.Elements = new byte[m_maxbytes];
			this.SetDigit(0, b);
		}

		public void Clear()
		{
			for (var i = 0; i < m_maxbytes; i++) this.Elements[i] = 0;
			this.m_size = 0;
		}

		public void CopyFrom(BigInt a)
		{
			Array.Copy(a.Elements, this.Elements, m_maxbytes);
			this.m_size = a.m_size;
		}

		private void Divide(int b)
		{
			var num = 0;
			var num2 = 0;
			var size = this.Size;
			var num4 = 0;
			while (size-- > 0)
			{
				num2 = (0x100 * num) + this.GetDigit(size);
				num = num2 % b;
				this.SetDigit(size, (byte)(num2 / b), ref num4);
			}
			this.Size = num4;
		}

		private void Multiply(int b)
		{
			Multiply(this, b, this);
		}


		public override bool Equals(object obj)
		{
			return ((obj is BigInt) && Equals(this, (BigInt)obj));
		}

		public void SetDigit(int index, byte digit)
		{
			if ((index >= 0) && (index < m_maxbytes))
			{
				this.Elements[index] = digit;
				if ((index >= this.m_size) && (digit != 0))
				{
					this.m_size = index + 1;
				}
				if ((index == (this.m_size - 1)) && (digit == 0))
				{
					this.m_size--;
				}
			}
		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="index"></param>
		/// <param name="digit"></param>
		/// <param name="size">ref</param>
		public void SetDigit(int index, byte digit, ref int size)
		{
			if ((index >= 0) && (index < m_maxbytes))
			{
				this.Elements[index] = digit;
				if ((index >= size) && (digit != 0))
				{
					size = index + 1;
				}
				if ((index == (size - 1)) && (digit == 0))
				{
					size--;
				}
			}
		}

		public byte GetDigit(int index)
		{
			if ((index >= 0) && (index < this.m_size))
			{
				return this.Elements[index];
			}
			return 0;
		}

		public override int GetHashCode()
		{
			var num = 0;
			for (var i = 0; i < this.m_size; i++)
			{
				num += this.GetDigit(i);
			}
			return num;
		}

		public int Size
		{
			get { return this.m_size; }
			set
			{
				if (value > m_maxbytes) this.m_size = m_maxbytes;
				if (value < 0) this.m_size = 0;
				this.m_size = value;
			}
		}

		public bool IsNegative()
		{
			return (this.Elements[m_maxbytes - 1] & 0x80) != 0;
		}

		public bool IsZero()
		{
			for (var i = 0; i < this.m_size; i++)
			{
				if (this.Elements[i] != 0)
				{
					return false;
				}
			}
			return true;
		}

		#region Operators

		/// <summary>
		/// Compares two numbers and returns an integer that indicates their relationship to one another.
		/// </summary>
		/// <param name="a"></param>
		/// <param name="b"></param>
		/// <returns>
		/// -1 (a) is less than (b).
		///  0 (a) is equals (b).
		///  1 (a) is greater than (b). 
		/// </returns>
		public static int Compare(BigInt a, BigInt b)
		{
			if (a == null && b == null) return 0;
			if (a == null) return -1;
			if (b == null) return 1;
			var size = a.Size;
			var num2 = b.Size;
			if (size == num2)
			{
				while (size-- > 0)
				{
					if (a.Elements[size] != b.Elements[size])
					{
						return (a.Elements[size] < b.Elements[size]) ? -1 : 1;
					}
				}
				return 0;
			}
			else
			{
				return (size < num2) ? -1 : 1;
			}
		}

		public static bool Equals(BigInt a, BigInt b)
		{
			return Compare(a, b) == 0;
		}

		private static bool NotEqual(BigInt a, BigInt b)
		{
			return Compare(a, b) != 0;
		}

		public static bool MoreThan(BigInt a, BigInt b)
		{
			return Compare(a, b) == 1;
		}

		public static bool LessThan(BigInt a, BigInt b)
		{
			return Compare(a, b) == -1;
		}

		#endregion

		#region Helper Methods

		byte[] HexStringToBytes(string s)
		{
			/// <summary>
			/// Convert hex string to array of bytes.
			/// </summary>
			/// <param type="string" name="s">Hex string.</param>
			/// <returns type="byte[]">
			/// An array of 8-bit integers.
			/// </returns>
			// If hex prefix exists then...
			if (s.IndexOf("0x") == 0 || s.IndexOf("0X") == 0)
			{
				// Remove hex prefix.
				s = s.Substring(2);
			}
			// if not even length. Then add leading zero.
			if (s.Length % 2 == 1) s = "0" + s;
			var bytes = new byte[s.Length / 2];
			for (var i = 0; i < s.Length; i += 2)
			{
				bytes[i / 2] = byte.Parse(s.Substring(i, 2), System.Globalization.NumberStyles.HexNumber);
			}
			return bytes;
		}

		public static int GetHexArraySize(byte[] hex)
		{
			var length = hex.Length;
			while (length-- > 0)
			{
				if (hex[length] != 0) break;
			}
			return (length + 1);
		}

		#endregion

		#region Convert

		public void FromHex(string hex)
		{
			var bytes = HexStringToBytes(hex);
			Array.Reverse(bytes);
			var size = GetHexArraySize(bytes);
			Array.Copy(bytes, this.Elements, size);
			if (hex.StartsWith("-")) Negate(this);
			this.Size = size;
		}


		public void FromDecimal(string dec)
		{
			var a = new BigInt();
			var c = new BigInt();
			var length = dec.Length;
			for (var i = 0; i < length; i++)
			{
				if ((dec[i] <= '9') && (dec[i] >= '0'))
				{
					Multiply(a, 10, c);
					Add(c, (byte)(dec[i] - '0'), ref a);
				}
			}
			if (dec.StartsWith("-")) Negate(a);
			this.CopyFrom(a);
		}

		public string ToHex()
		{
			var b = this;
			if (this.IsNegative())
			{
				b = new BigInt();
				b.CopyFrom(this);
				Negate(b);
			}
			var bytes = b.ToByteArray();
			Array.Reverse(bytes);
			return (this.IsNegative() ? "-0x" : "0x") + System.BitConverter.ToString(bytes).Replace("-", "");
		}

		public string ToDecimal()
		{
			if (this.IsZero()) return "0";
			var denominator = new BigInt(10);
			var numerator = new BigInt();
			var quotient = new BigInt();
			var remainder = new BigInt();
			numerator.CopyFrom(this);
			if (numerator.IsNegative()) Negate(numerator);
			char[] array = new char[(int)Math.Ceiling((double)((this.m_size * 2) * 1.21))];
			var length = 0;
			do
			{
				Divide(numerator, denominator, ref quotient, ref remainder);
				array[length++] = decValues[remainder.IsZero() ? 0 : remainder.Elements[0]];
				numerator.CopyFrom(quotient);
			}
			while (!quotient.IsZero());
			Array.Reverse(array, 0, length);
			return (this.IsNegative() ? "-" : "") + new string(array, 0, length);
		}

		public byte[] ToByteArray()
		{
			var destinationArray = new byte[this.Size];
			Array.Copy(this.Elements, destinationArray, this.Size);
			return destinationArray;
		}

		#endregion

		#region Static Methods

		private static readonly char[] decValues = new char[] { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' };

		/// <summary>
		/// 
		/// </summary>
		/// <param name="a"></param>
		/// <param name="b"></param>
		/// <param name="c">ref</param>
		public static void Add(BigInt a, byte b, ref BigInt c)
		{
			byte digit = b;
			var num2 = 0;
			var size = a.Size;
			var num4 = 0;
			for (var i = 0; i < size; i++)
			{
				num2 = a.GetDigit(i) + digit;
				c.SetDigit(i, (byte)(num2 & 0xff), ref num4);
				digit = (byte)((num2 >> 8) & 0xff);
			}
			if (digit != 0)
			{
				c.SetDigit(a.Size, digit, ref num4);
			}
			c.Size = num4;
		}

		public static BigInt Add(BigInt a, BigInt b)
		{
			var r = new BigInt();
			var z = new BigInt();
			var o = new BigInt(0);
			var n = new BigInt();
			z.CopyFrom(b);
			Subtract(o, z, ref n);
			Subtract(a, n, ref r);
			return r;
		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="a"></param>
		/// <param name="b"></param>
		/// <param name="c">ref</param>
		public static void Subtract(BigInt a, BigInt b, ref BigInt c)
		{
			byte num = 0;
			var num2 = 0;
			if (LessThan(a, b))
			{
				Subtract(b, a, ref c);
				Negate(c);
			}
			else
			{
				var size = a.Size;
				var num5 = 0;
				for (var i = 0; i < size; i++)
				{
					num2 = (a.GetDigit(i) - b.GetDigit(i)) - num;
					num = 0;
					if (num2 < 0)
					{
						num2 += 0x100;
						num = 1;
					}
					c.SetDigit(i, (byte)(num2 & 0xff), ref num5);
				}
				c.Size = num5;
			}
		}

		public static BigInt Subtract(BigInt a, BigInt b)
		{
			var c = new BigInt();
			Subtract(a, b, ref c);
			return c;
		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="numerator"></param>
		/// <param name="denominator"></param>
		/// <param name="quotient">ref</param>
		/// <param name="remainder">ref</param>
		public static void Divide(BigInt numerator, BigInt denominator, ref BigInt quotient, ref BigInt remainder)
		{
			if (LessThan(numerator, denominator))
			{
				quotient.Clear();
				remainder.CopyFrom(numerator);
			}
			else if (numerator == denominator)
			{
				quotient.Clear();
				quotient.SetDigit(0, 1);
				remainder.Clear();
			}
			else
			{
				var a = new BigInt();
				a.CopyFrom(numerator);
				var num2 = new BigInt();
				num2.CopyFrom(denominator);
				uint num3 = 0;
				while (num2.Size < a.Size)
				{
					num2.Multiply(0x100);
					num3++;
				}
				if (MoreThan(num2, a))
				{
					num2.Divide(0x100);
					num3--;
				}
				var num4 = 0;
				var digit = 0;
				var b = 0;
				var c = new BigInt();
				quotient.Clear();
				for (var i = 0; i <= num3; i++)
				{
					num4 = (a.Size == num2.Size) ? a.GetDigit(a.Size - 1) : ((0x100 * a.GetDigit(a.Size - 1)) + a.GetDigit(a.Size - 2));
					digit = num2.GetDigit(num2.Size - 1);
					b = num4 / digit;
					if (b >= 0x100)
					{
						b = 0xff;
					}
					Multiply(num2, b, c);
					while (MoreThan(c, a))
					{
						b--;
						Multiply(num2, b, c);
					}
					quotient.Multiply(0x100);
					Add(quotient, (byte)b, ref quotient);
					Subtract(a, c, ref a);
					num2.Divide(0x100);
				}
				remainder.CopyFrom(a);
			}
		}

		public static BigInt[] Divide(BigInt a, BigInt b)
		{
			var q = new BigInt();
			var r = new BigInt();
			var x1 = new BigInt();
			var y1 = new BigInt();
			x1.CopyFrom(a);
			y1.CopyFrom(b);
			// Make both numbers positive.
			if (x1.IsNegative()) Negate(x1);
			if (y1.IsNegative()) Negate(y1);
			Divide(x1, y1, ref q, ref r);
			if ((a.IsNegative() && !b.IsNegative()) ||
				(!a.IsNegative() && b.IsNegative()))
			{
				Negate(q);
				Negate(r);
			}
			return new BigInt[] { q, r };
		}

		/// <summary>
		/// unfinished
		/// </summary>
		/// <param name="x"></param>
		/// <param name="y"></param>
		/// <returns></returns>
		public static BigInt Multiply(BigInt a, BigInt b)
		{
			var z = new BigInt();
			var r = new BigInt();
			var n = new BigInt();
			var x1 = new BigInt();
			var y1 = new BigInt();
			x1.CopyFrom(a);
			y1.CopyFrom(b);
			// Make both numbers positive.
			if (x1.IsNegative()) Negate(x1);
			if (y1.IsNegative()) Negate(y1);
			byte digit;
			for (var i = 0; i < y1.Size; i++)
			{
				digit = y1.GetDigit(i);
				if (i > 0) x1.Multiply(0x100);
				n = new BigInt();
				n.CopyFrom(x1);
				n.Multiply(digit);
				Negate(n);
				z = new BigInt();
				z.CopyFrom(r);
				Subtract(z, n, ref r);
			}
			if ((a.IsNegative() && !b.IsNegative()) ||
				(!a.IsNegative() && b.IsNegative())) Negate(r);
			return r;
		}

		/// <summary>
		/// 
		/// </summary>
		/// <param name="a"></param>
		/// <param name="b"></param>
		/// <param name="c">ref</param>
		private static void Multiply(BigInt a, int b, BigInt c)
		{
			if (b == 0)
			{
				c.Clear();
			}
			else
			{
				var num = 0;
				var num2 = 0;
				var size = a.Size;
				var num4 = 0;
				for (var i = 0; i < size; i++)
				{
					num2 = (b * a.GetDigit(i)) + num;
					num = num2 / 0x100;
					c.SetDigit(i, (byte)(num2 % 0x100), ref num4);
				}
				if (num != 0)
				{
					var bytes = BitConverter.GetBytes(num);
					for (var j = 0; j < bytes.Length; j++)
					{
						c.SetDigit(size + j, bytes[j], ref num4);
					}
				}
				c.Size = num4;
			}
		}

		/// <summary>
		/// Swich between positive and negative.
		/// </summary>
		/// <param name="a"></param>
		public static void Negate(BigInt a)
		{
			var size = 0;
			for (var i = 0; i < a.m_maxbytes; i++)
			{
				a.SetDigit(i, (byte)(~a.GetDigit(i) & 0xff), ref size);
			}
			for (var j = 0; j < a.m_maxbytes; j++)
			{
				a.SetDigit(j, (byte)(a.GetDigit(j) + 1), ref size);
				if ((a.GetDigit(j) & 0xff) != 0)
				{
					break;
				}
				a.SetDigit(j, (byte)(a.GetDigit(j) & 0xff), ref size);
			}
			a.Size = size;
		}

		#endregion

	}

}
