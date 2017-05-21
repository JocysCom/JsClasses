using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;
using System.IO.Compression;
using System.Globalization;
using System.Resources;
using System.Threading;
using System.Security.Permissions;
using System.Runtime.InteropServices;
using System.Diagnostics;

namespace Scripts.Classes.Examples
{


	/// <summary>
	/// Provides methods and properties for compressing and decompressing streams using the Deflate algorithm.
	/// </summary>
	public class DeflateStream2 : Stream
	{
		private bool _leaveOpen;
		private CompressionMode _mode;
		private Stream _stream;
		private byte[] buffer;
		private const int bufferSize = 0x1000;
		internal const int DefaultBufferSize = 0x1000;
		private Deflater deflater;
		private IFileFormatWriter formatWriter;
		private Inflater inflater;
		private bool wroteHeader;

		/// <summary>
		/// Initializes a new instance of the <see cref="T:System.IO.Compression.DeflateStream" /> class using the specified stream and <see cref="T:System.IO.Compression.CompressionMode" /> value.
		/// </summary>
		/// <param name="stream">
		/// The stream to compress or decompress.
		/// </param>
		/// <param name="mode">
		/// One of the <see cref="T:System.IO.Compression.CompressionMode" /> values that indicates the action to take.
		/// </param>
		/// <exception cref="T:System.ArgumentNullException">
		/// <paramref name="stream" /> is null.
		/// </exception>
		/// <exception cref="T:System.InvalidOperationException">
		/// <paramref name="stream" /> access right is ReadOnly and <paramref name="mode" /> value is Compress. 
		/// </exception>
		/// <exception cref="T:System.ArgumentException">
		/// <paramref name="mode" /> is not a valid <see cref="T:System.IO.Compression.CompressionMode" /> value.
		/// 
		/// -or-
		/// <see cref="T:System.IO.Compression.CompressionMode" /> is <see cref="F:System.IO.Compression.CompressionMode.Compress" />  and <see cref="P:System.IO.Stream.CanWrite" /> is false.
		/// 
		/// -or-
		/// <see cref="T:System.IO.Compression.CompressionMode" /> is <see cref="F:System.IO.Compression.CompressionMode.Decompress" />  and <see cref="P:System.IO.Stream.CanRead" /> is false.
		/// </exception>
		public DeflateStream2(Stream stream, CompressionMode mode)
			: this(stream, mode, false)
		{
		}

		/// <summary>
		/// Initializes a new instance of the <see cref="T:System.IO.Compression.DeflateStream" /> class using the specified stream and <see cref="T:System.IO.Compression.CompressionMode" /> value, and a value that specifies whether to leave the stream open.
		/// </summary>
		/// <param name="stream">
		/// The stream to compress or decompress.
		/// </param>
		/// <param name="mode">
		/// One of the <see cref="T:System.IO.Compression.CompressionMode" /> values that indicates the action to take.
		/// </param>
		/// <param name="leaveOpen">true to leave the stream open; otherwise, false.
		/// </param>
		/// <exception cref="T:System.ArgumentNullException">
		/// <paramref name="stream" /> is null.
		/// </exception>
		/// <exception cref="T:System.InvalidOperationException">
		/// <paramref name="stream" /> access right is ReadOnly and <paramref name="mode" /> value is Compress. 
		/// </exception>
		/// <exception cref="T:System.ArgumentException">
		/// <paramref name="mode" /> is not a valid <see cref="T:System.IO.Compression.CompressionMode" /> value.
		/// 
		/// -or-
		/// <see cref="T:System.IO.Compression.CompressionMode" /> is <see cref="F:System.IO.Compression.CompressionMode.Compress" />  and <see cref="P:System.IO.Stream.CanWrite" /> is false.
		/// 
		/// -or-
		/// <see cref="T:System.IO.Compression.CompressionMode" /> is <see cref="F:System.IO.Compression.CompressionMode.Decompress" />  and <see cref="P:System.IO.Stream.CanRead" /> is false.
		/// </exception>
		public DeflateStream2(Stream stream, CompressionMode mode, bool leaveOpen)
		{
			this._stream = stream;
			this._mode = mode;
			this._leaveOpen = leaveOpen;
			if (this._stream == null)
			{
				throw new ArgumentNullException("stream");
			}
			switch (this._mode)
			{
				case CompressionMode.Decompress:
					if (!this._stream.CanRead)
					{
						throw new ArgumentException(SR.GetString("NotReadableStream"), "stream");
					}
					this.inflater = new Inflater();
					break;

				case CompressionMode.Compress:
					if (!this._stream.CanWrite)
					{
						throw new ArgumentException(SR.GetString("NotWriteableStream"), "stream");
					}
					this.deflater = new Deflater();
					break;

				default:
					throw new ArgumentException(SR.GetString("ArgumentOutOfRange_Enum"), "mode");
			}
			this.buffer = new byte[0x1000];
		}


		/// <summary>
		/// Releases the unmanaged resources used by the <see cref="T:System.IO.Compression.DeflateStream" /> and optionally releases the managed resources.
		/// </summary>
		/// <param name="disposing">true to release both managed and unmanaged resources; false to release only unmanaged resources.
		/// </param>
		protected override void Dispose(bool disposing)
		{
			try
			{
				if (disposing && (this._stream != null))
				{
					this.Flush();
					if ((this._mode == CompressionMode.Compress) && (this._stream != null))
					{
						int deflateOutput;
						while (!this.deflater.NeedsInput())
						{
							deflateOutput = this.deflater.GetDeflateOutput(this.buffer);
							if (deflateOutput != 0)
							{
								this._stream.Write(this.buffer, 0, deflateOutput);
							}
						}
						deflateOutput = this.deflater.Finish(this.buffer);
						if (deflateOutput > 0)
						{
							this.DoWrite(this.buffer, 0, deflateOutput);
						}
						if ((this.formatWriter != null) && this.wroteHeader)
						{
							byte[] footer = this.formatWriter.GetFooter();
							this._stream.Write(footer, 0, footer.Length);
						}
					}
				}
			}
			finally
			{
				try
				{
					if ((disposing && !this._leaveOpen) && (this._stream != null))
					{
						this._stream.Close();
					}
				}
				finally
				{
					this._stream = null;
					base.Dispose(disposing);
				}
			}
		}

		private void DoMaintenance(byte[] array, int offset, int count)
		{
			if (this.formatWriter != null)
			{
				if (!this.wroteHeader && (count > 0))
				{
					byte[] header = this.formatWriter.GetHeader();
					this._stream.Write(header, 0, header.Length);
					this.wroteHeader = true;
				}
				if (count > 0)
				{
					this.formatWriter.UpdateWithBytesRead(array, offset, count);
				}
			}
		}

		private void DoWrite(byte[] array, int offset, int count)
		{
			this._stream.Write(array, offset, count);
		}

		private void EnsureCompressionMode()
		{
			if (this._mode != CompressionMode.Compress)
			{
				throw new InvalidOperationException(SR.GetString("CannotWriteToDeflateStream"));
			}
		}

		private void EnsureDecompressionMode()
		{
			if (this._mode != CompressionMode.Decompress)
			{
				throw new InvalidOperationException(SR.GetString("CannotReadFromDeflateStream"));
			}
		}

		/// <summary>
		/// Flushes the contents of the internal buffer of the current stream object to the underlying stream.
		/// </summary>
		/// <exception cref="T:System.ObjectDisposedException">
		/// The stream is closed.
		/// </exception>
		/// <PermissionSet>
		/// <IPermission class="System.Security.Permissions.SecurityPermission, mscorlib, Version=2.0.3600.0, Culture=neutral, PublicKeyToken=b77a5c561934e089" version="1" Flags="UnmanagedCode, ControlEvidence" />
		/// </PermissionSet>
		public override void Flush()
		{
			if (this._stream == null)
			{
				throw new ObjectDisposedException(null, SR.GetString("ObjectDisposed_StreamClosed"));
			}
		}

		internal void InternalWrite(byte[] array, int offset, int count)
		{
			int deflateOutput;
			this.DoMaintenance(array, offset, count);
			while (!this.deflater.NeedsInput())
			{
				deflateOutput = this.deflater.GetDeflateOutput(this.buffer);
				if (deflateOutput != 0)
				{
					this.DoWrite(this.buffer, 0, deflateOutput);
				}
			}
			this.deflater.SetInput(array, offset, count);
			while (!this.deflater.NeedsInput())
			{
				deflateOutput = this.deflater.GetDeflateOutput(this.buffer);
				if (deflateOutput != 0)
				{
					this.DoWrite(this.buffer, 0, deflateOutput);
				}
			}
		}

		/// <summary>
		/// Reads a number of decompressed bytes into the specified byte array.
		/// </summary>
		/// <returns>
		/// The number of bytes that were decompressed into the byte array.
		/// </returns>
		/// <param name="array">
		/// The array used to store decompressed bytes.
		/// </param>
		/// <param name="offset">
		/// The location in the array to begin reading.
		/// </param>
		/// <param name="count">
		/// The number of decompressed bytes to read.
		/// </param>
		/// <exception cref="T:System.ArgumentNullException">
		/// <paramref name="array" /> is null.
		/// </exception>
		/// <exception cref="T:System.InvalidOperationException">
		/// The <see cref="T:System.IO.Compression.CompressionMode" /> value was Compress when the object was created.
		/// 
		/// - or - 
		/// 
		/// The underlying stream does not support reading.
		/// </exception>
		/// <exception cref="T:System.ArgumentOutOfRangeException">
		/// <paramref name="offset" /> or <paramref name="count" /> is less than zero.
		/// 
		/// -or-
		/// <paramref name="array" /> length minus the index starting point is less than <paramref name="count" />.
		/// </exception>
		/// <exception cref="T:System.IO.InvalidDataException">
		/// The data is in an invalid format.
		/// </exception>
		/// <exception cref="T:System.ObjectDisposedException">
		/// The stream is closed.
		/// </exception>
		public override int Read(byte[] array, int offset, int count)
		{
			this.EnsureDecompressionMode();
			this.ValidateParameters(array, offset, count);
			int num2 = offset;
			int length = count;
			while (true)
			{
				int num = this.inflater.Inflate(array, num2, length);
				num2 += num;
				length -= num;
				if ((length == 0) || this.inflater.Finished())
				{
					break;
				}
				int num4 = this._stream.Read(this.buffer, 0, this.buffer.Length);
				if (num4 == 0)
				{
					break;
				}
				this.inflater.SetInput(this.buffer, 0, num4);
			}
			return (count - length);
		}

		/// <summary>
		/// This operation is not supported and always throws a <see cref="T:System.NotSupportedException" />.
		/// </summary>
		/// <returns>
		/// A long value.
		/// </returns>
		/// <param name="offset">
		/// The location in the stream.
		/// </param>
		/// <param name="origin">
		/// One of the <see cref="T:System.IO.SeekOrigin" /> values.
		/// </param>
		/// <exception cref="T:System.NotSupportedException">
		/// This property is not supported on this stream.
		/// </exception>
		public override long Seek(long offset, SeekOrigin origin)
		{
			throw new NotSupportedException(SR.GetString("NotSupported"));
		}

		internal void SetFileFormatReader(IFileFormatReader reader)
		{
			if (reader != null)
			{
				this.inflater.SetFileFormatReader(reader);
			}
		}

		internal void SetFileFormatWriter(IFileFormatWriter writer)
		{
			if (writer != null)
			{
				this.formatWriter = writer;
			}
		}

		/// <summary>
		/// This operation is not supported and always throws a <see cref="T:System.NotSupportedException" />.
		/// </summary>
		/// <param name="value">
		/// The length of the stream.
		/// </param>
		/// <exception cref="T:System.NotSupportedException">
		/// This property is not supported on this stream.
		/// </exception>
		public override void SetLength(long value)
		{
			throw new NotSupportedException(SR.GetString("NotSupported"));
		}

		private void ValidateParameters(byte[] array, int offset, int count)
		{
			if (array == null)
			{
				throw new ArgumentNullException("array");
			}
			if (offset < 0)
			{
				throw new ArgumentOutOfRangeException("offset");
			}
			if (count < 0)
			{
				throw new ArgumentOutOfRangeException("count");
			}
			if ((array.Length - offset) < count)
			{
				throw new ArgumentException(SR.GetString("InvalidArgumentOffsetCount"));
			}
			if (this._stream == null)
			{
				throw new ObjectDisposedException(null, SR.GetString("ObjectDisposed_StreamClosed"));
			}
		}

		/// <summary>
		/// Writes compressed bytes to the underlying stream from the specified byte array.
		/// </summary>
		/// <param name="array">
		/// The array used to store compressed bytes.
		/// </param>
		/// <param name="offset">
		/// The location in the array to begin reading.
		/// </param>
		/// <param name="count">
		/// The number of bytes to compress.
		/// </param>
		public override void Write(byte[] array, int offset, int count)
		{
			this.EnsureCompressionMode();
			this.ValidateParameters(array, offset, count);
			this.InternalWrite(array, offset, count);
		}

		/// <summary>
		/// Gets a reference to the underlying stream.
		/// </summary>
		/// <returns>
		/// A stream object that represents the underlying stream.
		/// </returns>
		/// <exception cref="T:System.ObjectDisposedException">
		/// The underlying stream is closed.
		/// </exception>
		public Stream BaseStream
		{
			get
			{
				return this._stream;
			}
		}

		/// <summary>
		/// Gets a value indicating whether the stream supports reading while decompressing a file.
		/// </summary>
		/// <returns>true if the <see cref="T:System.IO.Compression.CompressionMode" /> value is Decompress, and the underlying stream is opened and supports reading; otherwise, false.
		/// </returns>
		public override bool CanRead
		{
			get
			{
				if (this._stream == null)
				{
					return false;
				}
				return ((this._mode == CompressionMode.Decompress) && this._stream.CanRead);
			}
		}

		/// <summary>
		/// Gets a value indicating whether the stream supports seeking.
		/// </summary>
		/// <returns>false in all cases.
		/// </returns>
		public override bool CanSeek
		{
			get
			{
				return false;
			}
		}

		/// <summary>
		/// Gets a value indicating whether the stream supports writing.
		/// </summary>
		/// <returns>true if the <see cref="T:System.IO.Compression.CompressionMode" /> value is Compress, and the underlying stream supports writing and is not closed; otherwise, false.
		/// </returns>
		public override bool CanWrite
		{
			get
			{
				if (this._stream == null)
				{
					return false;
				}
				return ((this._mode == CompressionMode.Compress) && this._stream.CanWrite);
			}
		}

		/// <summary>
		/// This property is not supported and always throws a <see cref="T:System.NotSupportedException" />.
		/// </summary>
		/// <returns>
		/// A long value.
		/// </returns>
		/// <exception cref="T:System.NotSupportedException">
		/// This property is not supported on this stream.
		/// </exception>
		/// <PermissionSet>
		/// <IPermission class="System.Security.Permissions.SecurityPermission, mscorlib, Version=2.0.3600.0, Culture=neutral, PublicKeyToken=b77a5c561934e089" version="1" Flags="UnmanagedCode, ControlEvidence" />
		/// </PermissionSet>
		public override long Length
		{
			get
			{
				throw new NotSupportedException(SR.GetString("NotSupported"));
			}
		}

		/// <summary>
		/// This property is not supported and always throws a <see cref="T:System.NotSupportedException" />.
		/// </summary>
		/// <returns>
		/// A long value.
		/// </returns>
		/// <exception cref="T:System.NotSupportedException">
		/// This property is not supported on this stream.
		/// </exception>
		/// <PermissionSet>
		/// <IPermission class="System.Security.Permissions.SecurityPermission, mscorlib, Version=2.0.3600.0, Culture=neutral, PublicKeyToken=b77a5c561934e089" version="1" Flags="UnmanagedCode, ControlEvidence" />
		/// </PermissionSet>
		public override long Position
		{
			get
			{
				throw new NotSupportedException(SR.GetString("NotSupported"));
			}
			set
			{
				throw new NotSupportedException(SR.GetString("NotSupported"));
			}
		}
	}


	internal class Deflater
	{
		private const double BadCompressionThreshold = 1.0;
		private const int CleanCopySize = 0xf88;
		private CopyEncoder copyEncoder = new CopyEncoder();
		private FastEncoder deflateEncoder = new FastEncoder();
		private DeflateInput input = new DeflateInput();
		private DeflateInput inputFromHistory;
		private const int MaxHeaderFooterGoo = 120;
		private const int MinBlockSize = 0x100;
		private OutputBuffer output = new OutputBuffer();
		private DeflaterState processingState = DeflaterState.NotStarted;

		public int Finish(byte[] outputBuffer)
		{
			if (this.processingState == DeflaterState.NotStarted)
			{
				return 0;
			}
			this.output.UpdateBuffer(outputBuffer);
			if (((this.processingState == DeflaterState.CompressThenCheck) || (this.processingState == DeflaterState.HandlingSmallData)) || (this.processingState == DeflaterState.SlowDownForIncompressible1))
			{
				this.deflateEncoder.GetBlockFooter(this.output);
			}
			this.WriteFinal();
			return this.output.BytesWritten;
		}

		private void FlushInputWindows()
		{
			this.deflateEncoder.FlushInput();
		}

		public int GetDeflateOutput(byte[] outputBuffer)
		{
			this.output.UpdateBuffer(outputBuffer);
			switch (this.processingState)
			{
				case DeflaterState.NotStarted:
					{
						DeflateInput.InputState state = this.input.DumpState();
						OutputBuffer.BufferState state2 = this.output.DumpState();
						this.deflateEncoder.GetBlockHeader(this.output);
						this.deflateEncoder.GetCompressedData(this.input, this.output);
						if (this.UseCompressed(this.deflateEncoder.LastCompressionRatio))
						{
							this.processingState = DeflaterState.CompressThenCheck;
						}
						else
						{
							this.input.RestoreState(state);
							this.output.RestoreState(state2);
							this.copyEncoder.GetBlock(this.input, this.output, false);
							this.FlushInputWindows();
							this.processingState = DeflaterState.CheckingForIncompressible;
						}
						goto Label_023A;
					}
				case DeflaterState.SlowDownForIncompressible1:
					this.deflateEncoder.GetBlockFooter(this.output);
					this.processingState = DeflaterState.SlowDownForIncompressible2;
					break;

				case DeflaterState.SlowDownForIncompressible2:
					break;

				case DeflaterState.StartingSmallData:
					this.deflateEncoder.GetBlockHeader(this.output);
					this.processingState = DeflaterState.HandlingSmallData;
					goto Label_0223;

				case DeflaterState.CompressThenCheck:
					this.deflateEncoder.GetCompressedData(this.input, this.output);
					if (!this.UseCompressed(this.deflateEncoder.LastCompressionRatio))
					{
						this.processingState = DeflaterState.SlowDownForIncompressible1;
						this.inputFromHistory = this.deflateEncoder.UnprocessedInput;
					}
					goto Label_023A;

				case DeflaterState.CheckingForIncompressible:
					{
						DeflateInput.InputState state3 = this.input.DumpState();
						OutputBuffer.BufferState state4 = this.output.DumpState();
						this.deflateEncoder.GetBlock(this.input, this.output, 0xf88);
						if (!this.UseCompressed(this.deflateEncoder.LastCompressionRatio))
						{
							this.input.RestoreState(state3);
							this.output.RestoreState(state4);
							this.copyEncoder.GetBlock(this.input, this.output, false);
							this.FlushInputWindows();
						}
						goto Label_023A;
					}
				case DeflaterState.HandlingSmallData:
					goto Label_0223;

				default:
					goto Label_023A;
			}
			if (this.inputFromHistory.Count > 0)
			{
				this.copyEncoder.GetBlock(this.inputFromHistory, this.output, false);
			}
			if (this.inputFromHistory.Count == 0)
			{
				this.deflateEncoder.FlushInput();
				this.processingState = DeflaterState.CheckingForIncompressible;
			}
			goto Label_023A;
		Label_0223:
			this.deflateEncoder.GetCompressedData(this.input, this.output);
		Label_023A:
			return this.output.BytesWritten;
		}

		public bool NeedsInput()
		{
			return ((this.input.Count == 0) && (this.deflateEncoder.BytesInHistory == 0));
		}

		public void SetInput(byte[] inputBuffer, int startIndex, int count)
		{
			this.input.Buffer = inputBuffer;
			this.input.Count = count;
			this.input.StartIndex = startIndex;
			if ((count > 0) && (count < 0x100))
			{
				switch (this.processingState)
				{
					case DeflaterState.CompressThenCheck:
						this.processingState = DeflaterState.HandlingSmallData;
						return;

					case DeflaterState.CheckingForIncompressible:
					case DeflaterState.NotStarted:
						this.processingState = DeflaterState.StartingSmallData;
						return;

					default:
						return;
				}
			}
		}

		private bool UseCompressed(double ratio)
		{
			return (ratio <= 1.0);
		}

		private void WriteFinal()
		{
			this.copyEncoder.GetBlock(null, this.output, true);
		}

		internal enum DeflaterState
		{
			NotStarted,
			SlowDownForIncompressible1,
			SlowDownForIncompressible2,
			StartingSmallData,
			CompressThenCheck,
			CheckingForIncompressible,
			HandlingSmallData
		}
	}

	internal interface IFileFormatWriter
	{
		byte[] GetFooter();
		byte[] GetHeader();
		void UpdateWithBytesRead(byte[] buffer, int offset, int bytesToCopy);
	}

	internal class Inflater
	{
		private int bfinal;
		private int blockLength;
		private byte[] blockLengthBuffer = new byte[4];
		private BlockType blockType;
		private int codeArraySize;
		private int codeLengthCodeCount;
		private HuffmanTree codeLengthTree;
		private byte[] codeLengthTreeCodeLength = new byte[0x13];
		private byte[] codeList = new byte[320];
		private static readonly byte[] codeOrder = new byte[] { 
        0x10, 0x11, 0x12, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 
        14, 1, 15
     };
		private static readonly int[] distanceBasePosition = new int[] { 
        1, 2, 3, 4, 5, 7, 9, 13, 0x11, 0x19, 0x21, 0x31, 0x41, 0x61, 0x81, 0xc1, 
        0x101, 0x181, 0x201, 0x301, 0x401, 0x601, 0x801, 0xc01, 0x1001, 0x1801, 0x2001, 0x3001, 0x4001, 0x6001, 0, 0
     };
		private int distanceCode;
		private int distanceCodeCount;
		private HuffmanTree distanceTree;
		private int extraBits;
		private static readonly byte[] extraLengthBits = new byte[] { 
        0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 
        3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0
     };
		private IFileFormatReader formatReader;
		private bool hasFormatReader;
		private InputBuffer input = new InputBuffer();
		private int length;
		private static readonly int[] lengthBase = new int[] { 
        3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 0x11, 0x13, 0x17, 0x1b, 0x1f, 
        0x23, 0x2b, 0x33, 0x3b, 0x43, 0x53, 0x63, 0x73, 0x83, 0xa3, 0xc3, 0xe3, 0x102
     };
		private int lengthCode;
		private int literalLengthCodeCount;
		private HuffmanTree literalLengthTree;
		private int loopCounter;
		private OutputWindow output = new OutputWindow();
		private InflaterState state;
		private static readonly byte[] staticDistanceTreeTable = new byte[] { 
        0, 0x10, 8, 0x18, 4, 20, 12, 0x1c, 2, 0x12, 10, 0x1a, 6, 0x16, 14, 30, 
        1, 0x11, 9, 0x19, 5, 0x15, 13, 0x1d, 3, 0x13, 11, 0x1b, 7, 0x17, 15, 0x1f
     };

		public Inflater()
		{
			this.Reset();
		}

		private bool Decode()
		{
			bool flag = false;
			bool flag2 = false;
			if (this.Finished())
			{
				return true;
			}
			if (this.hasFormatReader)
			{
				if (this.state == InflaterState.ReadingHeader)
				{
					if (!this.formatReader.ReadHeader(this.input))
					{
						return false;
					}
					this.state = InflaterState.ReadingBFinal;
				}
				else if ((this.state == InflaterState.StartReadingFooter) || (this.state == InflaterState.ReadingFooter))
				{
					if (!this.formatReader.ReadFooter(this.input))
					{
						return false;
					}
					this.state = InflaterState.VerifyingFooter;
					return true;
				}
			}
			if (this.state == InflaterState.ReadingBFinal)
			{
				if (!this.input.EnsureBitsAvailable(1))
				{
					return false;
				}
				this.bfinal = this.input.GetBits(1);
				this.state = InflaterState.ReadingBType;
			}
			if (this.state == InflaterState.ReadingBType)
			{
				if (!this.input.EnsureBitsAvailable(2))
				{
					this.state = InflaterState.ReadingBType;
					return false;
				}
				this.blockType = (BlockType)this.input.GetBits(2);
				if (this.blockType != BlockType.Dynamic)
				{
					if (this.blockType != BlockType.Static)
					{
						if (this.blockType != BlockType.Uncompressed)
						{
							throw new InvalidDataException(SR.GetString("UnknownBlockType"));
						}
						this.state = InflaterState.UncompressedAligning;
					}
					else
					{
						this.literalLengthTree = HuffmanTree.StaticLiteralLengthTree;
						this.distanceTree = HuffmanTree.StaticDistanceTree;
						this.state = InflaterState.DecodeTop;
					}
				}
				else
				{
					this.state = InflaterState.ReadingNumLitCodes;
				}
			}
			if (this.blockType == BlockType.Dynamic)
			{
				if (this.state < InflaterState.DecodeTop)
				{
					flag2 = this.DecodeDynamicBlockHeader();
				}
				else
				{
					flag2 = this.DecodeBlock(out flag);
				}
			}
			else if (this.blockType == BlockType.Static)
			{
				flag2 = this.DecodeBlock(out flag);
			}
			else
			{
				if (this.blockType != BlockType.Uncompressed)
				{
					throw new InvalidDataException(SR.GetString("UnknownBlockType"));
				}
				flag2 = this.DecodeUncompressedBlock(out flag);
			}
			if (flag && (this.bfinal != 0))
			{
				if (this.hasFormatReader)
				{
					this.state = InflaterState.StartReadingFooter;
					return flag2;
				}
				this.state = InflaterState.Done;
			}
			return flag2;
		}

		private bool DecodeBlock(out bool end_of_block_code_seen)
		{
			end_of_block_code_seen = false;
			int freeBytes = this.output.FreeBytes;
			while (freeBytes > 0x102)
			{
				int nextSymbol;
				int num4;
				switch (this.state)
				{
					case InflaterState.DecodeTop:
						nextSymbol = this.literalLengthTree.GetNextSymbol(this.input);
						if (nextSymbol >= 0)
						{
							break;
						}
						return false;

					case InflaterState.HaveInitialLength:
						goto Label_00E4;

					case InflaterState.HaveFullLength:
						goto Label_0151;

					case InflaterState.HaveDistCode:
						goto Label_01B3;

					default:
						throw new InvalidDataException(SR.GetString("UnknownState"));
				}
				if (nextSymbol < 0x100)
				{
					this.output.Write((byte)nextSymbol);
					freeBytes--;
					continue;
				}
				if (nextSymbol == 0x100)
				{
					end_of_block_code_seen = true;
					this.state = InflaterState.ReadingBFinal;
					return true;
				}
				nextSymbol -= 0x101;
				if (nextSymbol < 8)
				{
					nextSymbol += 3;
					this.extraBits = 0;
				}
				else if (nextSymbol == 0x1c)
				{
					nextSymbol = 0x102;
					this.extraBits = 0;
				}
				else
				{
					if ((nextSymbol < 0) || (nextSymbol >= extraLengthBits.Length))
					{
						throw new InvalidDataException(SR.GetString("GenericInvalidData"));
					}
					this.extraBits = extraLengthBits[nextSymbol];
				}
				this.length = nextSymbol;
			Label_00E4:
				if (this.extraBits > 0)
				{
					this.state = InflaterState.HaveInitialLength;
					int bits = this.input.GetBits(this.extraBits);
					if (bits < 0)
					{
						return false;
					}
					if ((this.length < 0) || (this.length >= lengthBase.Length))
					{
						throw new InvalidDataException(SR.GetString("GenericInvalidData"));
					}
					this.length = lengthBase[this.length] + bits;
				}
				this.state = InflaterState.HaveFullLength;
			Label_0151:
				if (this.blockType == BlockType.Dynamic)
				{
					this.distanceCode = this.distanceTree.GetNextSymbol(this.input);
				}
				else
				{
					this.distanceCode = this.input.GetBits(5);
					if (this.distanceCode >= 0)
					{
						this.distanceCode = staticDistanceTreeTable[this.distanceCode];
					}
				}
				if (this.distanceCode < 0)
				{
					return false;
				}
				this.state = InflaterState.HaveDistCode;
			Label_01B3:
				if (this.distanceCode > 3)
				{
					this.extraBits = (this.distanceCode - 2) >> 1;
					int num5 = this.input.GetBits(this.extraBits);
					if (num5 < 0)
					{
						return false;
					}
					num4 = distanceBasePosition[this.distanceCode] + num5;
				}
				else
				{
					num4 = this.distanceCode + 1;
				}
				this.output.WriteLengthDistance(this.length, num4);
				freeBytes -= this.length;
				this.state = InflaterState.DecodeTop;
			}
			return true;
		}

		private bool DecodeDynamicBlockHeader()
		{
			switch (this.state)
			{
				case InflaterState.ReadingNumLitCodes:
					this.literalLengthCodeCount = this.input.GetBits(5);
					if (this.literalLengthCodeCount >= 0)
					{
						this.literalLengthCodeCount += 0x101;
						this.state = InflaterState.ReadingNumDistCodes;
						break;
					}
					return false;

				case InflaterState.ReadingNumDistCodes:
					break;

				case InflaterState.ReadingNumCodeLengthCodes:
					goto Label_0096;

				case InflaterState.ReadingCodeLengthCodes:
					goto Label_0107;

				case InflaterState.ReadingTreeCodesBefore:
				case InflaterState.ReadingTreeCodesAfter:
					goto Label_0315;

				default:
					throw new InvalidDataException(SR.GetString("UnknownState"));
			}
			this.distanceCodeCount = this.input.GetBits(5);
			if (this.distanceCodeCount < 0)
			{
				return false;
			}
			this.distanceCodeCount++;
			this.state = InflaterState.ReadingNumCodeLengthCodes;
		Label_0096:
			this.codeLengthCodeCount = this.input.GetBits(4);
			if (this.codeLengthCodeCount < 0)
			{
				return false;
			}
			this.codeLengthCodeCount += 4;
			this.loopCounter = 0;
			this.state = InflaterState.ReadingCodeLengthCodes;
		Label_0107:
			while (this.loopCounter < this.codeLengthCodeCount)
			{
				int bits = this.input.GetBits(3);
				if (bits < 0)
				{
					return false;
				}
				this.codeLengthTreeCodeLength[codeOrder[this.loopCounter]] = (byte)bits;
				this.loopCounter++;
			}
			for (int i = this.codeLengthCodeCount; i < codeOrder.Length; i++)
			{
				this.codeLengthTreeCodeLength[codeOrder[i]] = 0;
			}
			this.codeLengthTree = new HuffmanTree(this.codeLengthTreeCodeLength);
			this.codeArraySize = this.literalLengthCodeCount + this.distanceCodeCount;
			this.loopCounter = 0;
			this.state = InflaterState.ReadingTreeCodesBefore;
		Label_0315:
			while (this.loopCounter < this.codeArraySize)
			{
				if ((this.state == InflaterState.ReadingTreeCodesBefore) && ((this.lengthCode = this.codeLengthTree.GetNextSymbol(this.input)) < 0))
				{
					return false;
				}
				if (this.lengthCode <= 15)
				{
					this.codeList[this.loopCounter++] = (byte)this.lengthCode;
				}
				else
				{
					int num3;
					if (!this.input.EnsureBitsAvailable(7))
					{
						this.state = InflaterState.ReadingTreeCodesAfter;
						return false;
					}
					if (this.lengthCode == 0x10)
					{
						if (this.loopCounter == 0)
						{
							throw new InvalidDataException();
						}
						byte num4 = this.codeList[this.loopCounter - 1];
						num3 = this.input.GetBits(2) + 3;
						if ((this.loopCounter + num3) > this.codeArraySize)
						{
							throw new InvalidDataException();
						}
						for (int j = 0; j < num3; j++)
						{
							this.codeList[this.loopCounter++] = num4;
						}
					}
					else if (this.lengthCode == 0x11)
					{
						num3 = this.input.GetBits(3) + 3;
						if ((this.loopCounter + num3) > this.codeArraySize)
						{
							throw new InvalidDataException();
						}
						for (int k = 0; k < num3; k++)
						{
							this.codeList[this.loopCounter++] = 0;
						}
					}
					else
					{
						num3 = this.input.GetBits(7) + 11;
						if ((this.loopCounter + num3) > this.codeArraySize)
						{
							throw new InvalidDataException();
						}
						for (int m = 0; m < num3; m++)
						{
							this.codeList[this.loopCounter++] = 0;
						}
					}
				}
				this.state = InflaterState.ReadingTreeCodesBefore;
			}
			byte[] destinationArray = new byte[0x120];
			byte[] buffer2 = new byte[0x20];
			Array.Copy(this.codeList, destinationArray, this.literalLengthCodeCount);
			Array.Copy(this.codeList, this.literalLengthCodeCount, buffer2, 0, this.distanceCodeCount);
			if (destinationArray[0x100] == 0)
			{
				throw new InvalidDataException();
			}
			this.literalLengthTree = new HuffmanTree(destinationArray);
			this.distanceTree = new HuffmanTree(buffer2);
			this.state = InflaterState.DecodeTop;
			return true;
		}

		private bool DecodeUncompressedBlock(out bool end_of_block)
		{
			end_of_block = false;
			while (true)
			{
				switch (this.state)
				{
					case InflaterState.UncompressedAligning:
						this.input.SkipToByteBoundary();
						this.state = InflaterState.UncompressedByte1;
						break;

					case InflaterState.UncompressedByte1:
					case InflaterState.UncompressedByte2:
					case InflaterState.UncompressedByte3:
					case InflaterState.UncompressedByte4:
						break;

					case InflaterState.DecodingUncompressed:
						{
							int num3 = this.output.CopyFrom(this.input, this.blockLength);
							this.blockLength -= num3;
							if (this.blockLength != 0)
							{
								return (this.output.FreeBytes == 0);
							}
							this.state = InflaterState.ReadingBFinal;
							end_of_block = true;
							return true;
						}
					default:
						throw new InvalidDataException(SR.GetString("UnknownState"));
				}
				int bits = this.input.GetBits(8);
				if (bits < 0)
				{
					return false;
				}
				this.blockLengthBuffer[((int)this.state) - 0x10] = (byte)bits;
				if (this.state == InflaterState.UncompressedByte4)
				{
					this.blockLength = this.blockLengthBuffer[0] + (this.blockLengthBuffer[1] * 0x100);
					int num2 = this.blockLengthBuffer[2] + (this.blockLengthBuffer[3] * 0x100);
					if (((ushort)this.blockLength) != ((ushort)~num2))
					{
						throw new InvalidDataException(SR.GetString("InvalidBlockLength"));
					}
				}
				this.state += 1;
			}
		}

		public bool Finished()
		{
			if (this.state != InflaterState.Done)
			{
				return (this.state == InflaterState.VerifyingFooter);
			}
			return true;
		}

		public int Inflate(byte[] bytes, int offset, int length)
		{
			int num = 0;
			do
			{
				int bytesToCopy = this.output.CopyTo(bytes, offset, length);
				if (bytesToCopy > 0)
				{
					if (this.hasFormatReader)
					{
						this.formatReader.UpdateWithBytesRead(bytes, offset, bytesToCopy);
					}
					offset += bytesToCopy;
					num += bytesToCopy;
					length -= bytesToCopy;
				}
			}
			while (((length != 0) && !this.Finished()) && this.Decode());
			if ((this.state == InflaterState.VerifyingFooter) && (this.output.AvailableBytes == 0))
			{
				this.formatReader.Validate();
			}
			return num;
		}

		public bool NeedsInput()
		{
			return this.input.NeedsInput();
		}

		private void Reset()
		{
			if (this.hasFormatReader)
			{
				this.state = InflaterState.ReadingHeader;
			}
			else
			{
				this.state = InflaterState.ReadingBFinal;
			}
		}

		internal void SetFileFormatReader(IFileFormatReader reader)
		{
			this.formatReader = reader;
			this.hasFormatReader = true;
			this.Reset();
		}

		public void SetInput(byte[] inputBytes, int offset, int length)
		{
			this.input.SetInput(inputBytes, offset, length);
		}

		public int AvailableOutput
		{
			get
			{
				return this.output.AvailableBytes;
			}
		}
	}


	internal sealed class SR
	{
		internal const string Arg_ArrayPlusOffTooSmall = "Arg_ArrayPlusOffTooSmall";
		internal const string Arg_HSCapacityOverflow = "Arg_HSCapacityOverflow";
		internal const string Argument_EmptyFile = "Argument_EmptyFile";
		internal const string Argument_EmptyServerName = "Argument_EmptyServerName";
		internal const string Argument_InvalidHandle = "Argument_InvalidHandle";
		internal const string Argument_InvalidOffLen = "Argument_InvalidOffLen";
		internal const string Argument_MapNameEmptyString = "Argument_MapNameEmptyString";
		internal const string Argument_NeedNonemptyDelimiter = "Argument_NeedNonemptyDelimiter";
		internal const string Argument_NeedNonemptyPipeName = "Argument_NeedNonemptyPipeName";
		internal const string Argument_NewMMFAppendModeNotAllowed = "Argument_NewMMFAppendModeNotAllowed";
		internal const string Argument_NewMMFWriteAccessNotAllowed = "Argument_NewMMFWriteAccessNotAllowed";
		internal const string Argument_NonContainerInvalidAnyFlag = "Argument_NonContainerInvalidAnyFlag";
		internal const string Argument_ReadAccessWithLargeCapacity = "Argument_ReadAccessWithLargeCapacity";
		internal const string Argument_WrongAsyncResult = "Argument_WrongAsyncResult";
		internal const string ArgumentException_CountMaxLengthSmallerThanMinLength = "ArgumentException_CountMaxLengthSmallerThanMinLength";
		internal const string ArgumentException_DuplicateName = "ArgumentException_DuplicateName";
		internal const string ArgumentException_DuplicateParameterAttribute = "ArgumentException_DuplicateParameterAttribute";
		internal const string ArgumentException_DuplicatePosition = "ArgumentException_DuplicatePosition";
		internal const string ArgumentException_DuplicateRemainingArgumets = "ArgumentException_DuplicateRemainingArgumets";
		internal const string ArgumentException_HelpMessageBaseNameNullOrEmpty = "ArgumentException_HelpMessageBaseNameNullOrEmpty";
		internal const string ArgumentException_HelpMessageNullOrEmpty = "ArgumentException_HelpMessageNullOrEmpty";
		internal const string ArgumentException_HelpMessageResourceIdNullOrEmpty = "ArgumentException_HelpMessageResourceIdNullOrEmpty";
		internal const string ArgumentException_InvalidParameterName = "ArgumentException_InvalidParameterName";
		internal const string ArgumentException_LengthMaxLengthSmallerThanMinLength = "ArgumentException_LengthMaxLengthSmallerThanMinLength";
		internal const string ArgumentException_MissingBaseNameOrResourceId = "ArgumentException_MissingBaseNameOrResourceId";
		internal const string ArgumentException_NoParametersFound = "ArgumentException_NoParametersFound";
		internal const string ArgumentException_ParserBuiltWithValueType = "ArgumentException_ParserBuiltWithValueType";
		internal const string ArgumentException_RangeMaxRangeSmallerThanMinRange = "ArgumentException_RangeMaxRangeSmallerThanMinRange";
		internal const string ArgumentException_RangeMinRangeMaxRangeType = "ArgumentException_RangeMinRangeMaxRangeType";
		internal const string ArgumentException_RangeNotIComparable = "ArgumentException_RangeNotIComparable";
		internal const string ArgumentException_RegexPatternNullOrEmpty = "ArgumentException_RegexPatternNullOrEmpty";
		internal const string ArgumentException_RequiredPositionalAfterOptionalPositional = "ArgumentException_RequiredPositionalAfterOptionalPositional";
		internal const string ArgumentException_TypeMismatchForRemainingArguments = "ArgumentException_TypeMismatchForRemainingArguments";
		internal const string ArgumentException_UnregisteredParameterName = "ArgumentException_UnregisteredParameterName";
		internal const string ArgumentException_ValidationParameterTypeMismatch = "ArgumentException_ValidationParameterTypeMismatch";
		internal const string ArgumentNull_Buffer = "ArgumentNull_Buffer";
		internal const string ArgumentNull_FileStream = "ArgumentNull_FileStream";
		internal const string ArgumentNull_MapName = "ArgumentNull_MapName";
		internal const string ArgumentNull_ServerName = "ArgumentNull_ServerName";
		internal const string ArgumentOutOfRange_AdditionalAccessLimited = "ArgumentOutOfRange_AdditionalAccessLimited";
		internal const string ArgumentOutOfRange_AnonymousReserved = "ArgumentOutOfRange_AnonymousReserved";
		internal const string ArgumentOutOfRange_CapacityGEFileSizeRequired = "ArgumentOutOfRange_CapacityGEFileSizeRequired";
		internal const string ArgumentOutOfRange_CapacityLargerThanLogicalAddressSpaceNotAllowed = "ArgumentOutOfRange_CapacityLargerThanLogicalAddressSpaceNotAllowed";
		internal const string ArgumentOutOfRange_DirectionModeInOrOut = "ArgumentOutOfRange_DirectionModeInOrOut";
		internal const string ArgumentOutOfRange_DirectionModeInOutOrInOut = "ArgumentOutOfRange_DirectionModeInOutOrInOut";
		internal const string ArgumentOutOfRange_HandleInheritabilityNoneOrInheritable = "ArgumentOutOfRange_HandleInheritabilityNoneOrInheritable";
		internal const string ArgumentOutOfRange_ImpersonationInvalid = "ArgumentOutOfRange_ImpersonationInvalid";
		internal const string ArgumentOutOfRange_ImpersonationOptionsInvalid = "ArgumentOutOfRange_ImpersonationOptionsInvalid";
		internal const string ArgumentOutOfRange_InvalidPipeAccessRights = "ArgumentOutOfRange_InvalidPipeAccessRights";
		internal const string ArgumentOutOfRange_InvalidTimeout = "ArgumentOutOfRange_InvalidTimeout";
		internal const string ArgumentOutOfRange_MaxArgExceeded = "ArgumentOutOfRange_MaxArgExceeded";
		internal const string ArgumentOutOfRange_MaxNumServerInstances = "ArgumentOutOfRange_MaxNumServerInstances";
		internal const string ArgumentOutOfRange_MaxStringsExceeded = "ArgumentOutOfRange_MaxStringsExceeded";
		internal const string ArgumentOutOfRange_NeedMaxFileSizeGEBufferSize = "ArgumentOutOfRange_NeedMaxFileSizeGEBufferSize";
		internal const string ArgumentOutOfRange_NeedNonNegNum = "ArgumentOutOfRange_NeedNonNegNum";
		internal const string ArgumentOutOfRange_NeedPositiveNumber = "ArgumentOutOfRange_NeedPositiveNumber";
		internal const string ArgumentOutOfRange_NeedValidId = "ArgumentOutOfRange_NeedValidId";
		internal const string ArgumentOutOfRange_NeedValidLogRetention = "ArgumentOutOfRange_NeedValidLogRetention";
		internal const string ArgumentOutOfRange_NeedValidMaxNumFiles = "ArgumentOutOfRange_NeedValidMaxNumFiles";
		internal const string ArgumentOutOfRange_NeedValidPipeAccessRights = "ArgumentOutOfRange_NeedValidPipeAccessRights";
		internal const string ArgumentOutOfRange_OptionsInvalid = "ArgumentOutOfRange_OptionsInvalid";
		internal const string ArgumentOutOfRange_PositionLessThanCapacityRequired = "ArgumentOutOfRange_PositionLessThanCapacityRequired";
		internal const string ArgumentOutOfRange_PositiveOrDefaultCapacityRequired = "ArgumentOutOfRange_PositiveOrDefaultCapacityRequired";
		internal const string ArgumentOutOfRange_PositiveOrDefaultSizeRequired = "ArgumentOutOfRange_PositiveOrDefaultSizeRequired";
		internal const string ArgumentOutOfRange_TransmissionModeByteOrMsg = "ArgumentOutOfRange_TransmissionModeByteOrMsg";
		internal const string CommandLineParser_Aliases = "CommandLineParser_Aliases";
		internal const string CommandLineParser_ErrorMessagePrefix = "CommandLineParser_ErrorMessagePrefix";
		internal const string CommandLineParser_HelpMessagePrefix = "CommandLineParser_HelpMessagePrefix";
		internal const string Cryptography_ArgECDHKeySizeMismatch = "Cryptography_ArgECDHKeySizeMismatch";
		internal const string Cryptography_ArgECDHRequiresECDHKey = "Cryptography_ArgECDHRequiresECDHKey";
		internal const string Cryptography_ArgECDsaRequiresECDsaKey = "Cryptography_ArgECDsaRequiresECDsaKey";
		internal const string Cryptography_ArgExpectedECDiffieHellmanCngPublicKey = "Cryptography_ArgExpectedECDiffieHellmanCngPublicKey";
		internal const string Cryptography_ArgMustBeCngAlgorithm = "Cryptography_ArgMustBeCngAlgorithm";
		internal const string Cryptography_ArgMustBeCngAlgorithmGroup = "Cryptography_ArgMustBeCngAlgorithmGroup";
		internal const string Cryptography_ArgMustBeCngKeyBlobFormat = "Cryptography_ArgMustBeCngKeyBlobFormat";
		internal const string Cryptography_ArgMustBeCngProvider = "Cryptography_ArgMustBeCngProvider";
		internal const string Cryptography_DecryptWithNoKey = "Cryptography_DecryptWithNoKey";
		internal const string Cryptography_ECXmlSerializationFormatRequired = "Cryptography_ECXmlSerializationFormatRequired";
		internal const string Cryptography_InvalidAlgorithmGroup = "Cryptography_InvalidAlgorithmGroup";
		internal const string Cryptography_InvalidAlgorithmName = "Cryptography_InvalidAlgorithmName";
		internal const string Cryptography_InvalidCipherMode = "Cryptography_InvalidCipherMode";
		internal const string Cryptography_InvalidIVSize = "Cryptography_InvalidIVSize";
		internal const string Cryptography_InvalidKeyBlobFormat = "Cryptography_InvalidKeyBlobFormat";
		internal const string Cryptography_InvalidKeySize = "Cryptography_InvalidKeySize";
		internal const string Cryptography_InvalidPadding = "Cryptography_InvalidPadding";
		internal const string Cryptography_InvalidProviderName = "Cryptography_InvalidProviderName";
		internal const string Cryptography_MissingDomainParameters = "Cryptography_MissingDomainParameters";
		internal const string Cryptography_MissingIV = "Cryptography_MissingIV";
		internal const string Cryptography_MissingPublicKey = "Cryptography_MissingPublicKey";
		internal const string Cryptography_MustTransformWholeBlock = "Cryptography_MustTransformWholeBlock";
		internal const string Cryptography_NonCompliantFIPSAlgorithm = "Cryptography_NonCompliantFIPSAlgorithm";
		internal const string Cryptography_OpenEphemeralKeyHandleWithoutEphemeralFlag = "Cryptography_OpenEphemeralKeyHandleWithoutEphemeralFlag";
		internal const string Cryptography_OpenInvalidHandle = "Cryptography_OpenInvalidHandle";
		internal const string Cryptography_PartialBlock = "Cryptography_PartialBlock";
		internal const string Cryptography_PlatformNotSupported = "Cryptography_PlatformNotSupported";
		internal const string Cryptography_TlsRequiresLabelAndSeed = "Cryptography_TlsRequiresLabelAndSeed";
		internal const string Cryptography_TransformBeyondEndOfBuffer = "Cryptography_TransformBeyondEndOfBuffer";
		internal const string Cryptography_UnexpectedXmlNamespace = "Cryptography_UnexpectedXmlNamespace";
		internal const string Cryptography_UnknownEllipticCurve = "Cryptography_UnknownEllipticCurve";
		internal const string Cryptography_UnknownEllipticCurveAlgorithm = "Cryptography_UnknownEllipticCurveAlgorithm";
		internal const string Cryptography_UnknownPaddingMode = "Cryptography_UnknownPaddingMode";
		internal const string IndexOutOfRange_IORaceCondition = "IndexOutOfRange_IORaceCondition";
		internal const string InvalidOperation_CalledTwice = "InvalidOperation_CalledTwice";
		internal const string InvalidOperation_CantCreateFileMapping = "InvalidOperation_CantCreateFileMapping";
		internal const string InvalidOperation_EndReadCalledMultiple = "InvalidOperation_EndReadCalledMultiple";
		internal const string InvalidOperation_EndWaitForConnectionCalledMultiple = "InvalidOperation_EndWaitForConnectionCalledMultiple";
		internal const string InvalidOperation_EndWriteCalledMultiple = "InvalidOperation_EndWriteCalledMultiple";
		internal const string InvalidOperation_EnumFailedVersion = "InvalidOperation_EnumFailedVersion";
		internal const string InvalidOperation_EnumOpCantHappen = "InvalidOperation_EnumOpCantHappen";
		internal const string InvalidOperation_PipeAlreadyConnected = "InvalidOperation_PipeAlreadyConnected";
		internal const string InvalidOperation_PipeAlreadyDisconnected = "InvalidOperation_PipeAlreadyDisconnected";
		internal const string InvalidOperation_PipeClosed = "InvalidOperation_PipeClosed";
		internal const string InvalidOperation_PipeDisconnected = "InvalidOperation_PipeDisconnected";
		internal const string InvalidOperation_PipeHandleNotSet = "InvalidOperation_PipeHandleNotSet";
		internal const string InvalidOperation_PipeMessageTypeNotSupported = "InvalidOperation_PipeMessageTypeNotSupported";
		internal const string InvalidOperation_PipeNotAsync = "InvalidOperation_PipeNotAsync";
		internal const string InvalidOperation_PipeNotYetConnected = "InvalidOperation_PipeNotYetConnected";
		internal const string InvalidOperation_PipeReadModeNotMessage = "InvalidOperation_PipeReadModeNotMessage";
		internal const string InvalidOperationException_AddParameterAfterParse = "InvalidOperationException_AddParameterAfterParse";
		internal const string InvalidOperationException_BindAfterBind = "InvalidOperationException_BindAfterBind";
		internal const string InvalidOperationException_GetParameterTypeMismatch = "InvalidOperationException_GetParameterTypeMismatch";
		internal const string InvalidOperationException_GetParameterValueBeforeParse = "InvalidOperationException_GetParameterValueBeforeParse";
		internal const string InvalidOperationException_GetRemainingArgumentsNotAllowed = "InvalidOperationException_GetRemainingArgumentsNotAllowed";
		internal const string InvalidOperationException_ParameterSetBeforeParse = "InvalidOperationException_ParameterSetBeforeParse";
		internal const string InvalidOperationException_SetRemainingArgumentsParameterAfterParse = "InvalidOperationException_SetRemainingArgumentsParameterAfterParse";
		internal const string IO_DriveNotFound_Drive = "IO_DriveNotFound_Drive";
		internal const string IO_EOF_ReadBeyondEOF = "IO_EOF_ReadBeyondEOF";
		internal const string IO_FileNotFound = "IO_FileNotFound";
		internal const string IO_FileNotFound_FileName = "IO_FileNotFound_FileName";
		internal const string IO_FileTooLongOrHandleNotSync = "IO_FileTooLongOrHandleNotSync";
		internal const string IO_IO_AlreadyExists_Name = "IO_IO_AlreadyExists_Name";
		internal const string IO_IO_BindHandleFailed = "IO_IO_BindHandleFailed";
		internal const string IO_IO_FileExists_Name = "IO_IO_FileExists_Name";
		internal const string IO_IO_InvalidPipeHandle = "IO_IO_InvalidPipeHandle";
		internal const string IO_IO_NoPermissionToDirectoryName = "IO_IO_NoPermissionToDirectoryName";
		internal const string IO_IO_PipeBroken = "IO_IO_PipeBroken";
		internal const string IO_IO_SharingViolation_File = "IO_IO_SharingViolation_File";
		internal const string IO_IO_SharingViolation_NoFileName = "IO_IO_SharingViolation_NoFileName";
		internal const string IO_NotEnoughMemory = "IO_NotEnoughMemory";
		internal const string IO_PathNotFound_NoPathName = "IO_PathNotFound_NoPathName";
		internal const string IO_PathNotFound_Path = "IO_PathNotFound_Path";
		internal const string IO_PathTooLong = "IO_PathTooLong";
		private static SR loader;
		internal const string LockRecursionException_ReadAfterWriteNotAllowed = "LockRecursionException_ReadAfterWriteNotAllowed";
		internal const string LockRecursionException_RecursiveReadNotAllowed = "LockRecursionException_RecursiveReadNotAllowed";
		internal const string LockRecursionException_RecursiveUpgradeNotAllowed = "LockRecursionException_RecursiveUpgradeNotAllowed";
		internal const string LockRecursionException_RecursiveWriteNotAllowed = "LockRecursionException_RecursiveWriteNotAllowed";
		internal const string LockRecursionException_UpgradeAfterReadNotAllowed = "LockRecursionException_UpgradeAfterReadNotAllowed";
		internal const string LockRecursionException_UpgradeAfterWriteNotAllowed = "LockRecursionException_UpgradeAfterWriteNotAllowed";
		internal const string LockRecursionException_WriteAfterReadNotAllowed = "LockRecursionException_WriteAfterReadNotAllowed";
		internal const string NotSupported_AnonymousPipeMessagesNotSupported = "NotSupported_AnonymousPipeMessagesNotSupported";
		internal const string NotSupported_AnonymousPipeUnidirectional = "NotSupported_AnonymousPipeUnidirectional";
		internal const string NotSupported_DelayAllocateFileBackedNotAllowed = "NotSupported_DelayAllocateFileBackedNotAllowed";
		internal const string NotSupported_DownLevelVista = "NotSupported_DownLevelVista";
		internal const string NotSupported_IONonFileDevices = "NotSupported_IONonFileDevices";
		internal const string NotSupported_MemStreamNotExpandable = "NotSupported_MemStreamNotExpandable";
		internal const string NotSupported_MMViewStreamsFixedLength = "NotSupported_MMViewStreamsFixedLength";
		internal const string NotSupported_SetTextWriter = "NotSupported_SetTextWriter";
		internal const string NotSupported_UnreadableStream = "NotSupported_UnreadableStream";
		internal const string NotSupported_UnseekableStream = "NotSupported_UnseekableStream";
		internal const string NotSupported_UnwritableStream = "NotSupported_UnwritableStream";
		internal const string ObjectDisposed_FileClosed = "ObjectDisposed_FileClosed";
		internal const string ObjectDisposed_PipeClosed = "ObjectDisposed_PipeClosed";
		internal const string ObjectDisposed_ReaderClosed = "ObjectDisposed_ReaderClosed";
		internal const string ObjectDisposed_StreamClosed = "ObjectDisposed_StreamClosed";
		internal const string ObjectDisposed_StreamIsClosed = "ObjectDisposed_StreamIsClosed";
		internal const string ObjectDisposed_ViewAccessorClosed = "ObjectDisposed_ViewAccessorClosed";
		internal const string ObjectDisposed_WriterClosed = "ObjectDisposed_WriterClosed";
		internal const string ParameterBindingException_AmbiguousParameterName = "ParameterBindingException_AmbiguousParameterName";
		internal const string ParameterBindingException_AmbiguousParameterSet = "ParameterBindingException_AmbiguousParameterSet";
		internal const string ParameterBindingException_NestedResponseFiles = "ParameterBindingException_NestedResponseFiles";
		internal const string ParameterBindingException_ParameterValueAlreadySpecified = "ParameterBindingException_ParameterValueAlreadySpecified";
		internal const string ParameterBindingException_RequiredParameterMissingCommandLineValue = "ParameterBindingException_RequiredParameterMissingCommandLineValue";
		internal const string ParameterBindingException_ResponseFileException = "ParameterBindingException_ResponseFileException";
		internal const string ParameterBindingException_TransformationError = "ParameterBindingException_TransformationError";
		internal const string ParameterBindingException_UnboundCommandLineArguments = "ParameterBindingException_UnboundCommandLineArguments";
		internal const string ParameterBindingException_UnboundMandatoryParameter = "ParameterBindingException_UnboundMandatoryParameter";
		internal const string ParameterBindingException_UnknownParameteName = "ParameterBindingException_UnknownParameteName";
		internal const string ParameterBindingException_UnknownParameterSet = "ParameterBindingException_UnknownParameterSet";
		internal const string ParameterBindingException_ValididationError = "ParameterBindingException_ValididationError";
		internal const string Perflib_Argument_CounterAlreadyExists = "Perflib_Argument_CounterAlreadyExists";
		internal const string Perflib_Argument_CounterNameAlreadyExists = "Perflib_Argument_CounterNameAlreadyExists";
		internal const string Perflib_Argument_CounterSetAlreadyRegister = "Perflib_Argument_CounterSetAlreadyRegister";
		internal const string Perflib_Argument_EmptyCounterName = "Perflib_Argument_EmptyCounterName";
		internal const string Perflib_Argument_EmptyInstanceName = "Perflib_Argument_EmptyInstanceName";
		internal const string Perflib_Argument_InstanceAlreadyExists = "Perflib_Argument_InstanceAlreadyExists";
		internal const string Perflib_Argument_InvalidCounterSetInstanceType = "Perflib_Argument_InvalidCounterSetInstanceType";
		internal const string Perflib_Argument_InvalidCounterType = "Perflib_Argument_InvalidCounterType";
		internal const string Perflib_Argument_InvalidInstance = "Perflib_Argument_InvalidInstance";
		internal const string Perflib_Argument_ProviderNotFound = "Perflib_Argument_ProviderNotFound";
		internal const string Perflib_InsufficientMemory_CounterSetTemplate = "Perflib_InsufficientMemory_CounterSetTemplate";
		internal const string Perflib_InsufficientMemory_InstanceCounterBlock = "Perflib_InsufficientMemory_InstanceCounterBlock";
		internal const string Perflib_InvalidOperation_AddCounterAfterInstance = "Perflib_InvalidOperation_AddCounterAfterInstance";
		internal const string Perflib_InvalidOperation_CounterRefValue = "Perflib_InvalidOperation_CounterRefValue";
		internal const string Perflib_InvalidOperation_CounterSetContainsNoCounter = "Perflib_InvalidOperation_CounterSetContainsNoCounter";
		internal const string Perflib_InvalidOperation_CounterSetNotInstalled = "Perflib_InvalidOperation_CounterSetNotInstalled";
		internal const string Perflib_InvalidOperation_InstanceNotFound = "Perflib_InvalidOperation_InstanceNotFound";
		internal const string Perflib_InvalidOperation_NoActiveProvider = "Perflib_InvalidOperation_NoActiveProvider";
		internal const string Perflib_PlatformNotSupported = "Perflib_PlatformNotSupported";
		internal const string PlatformNotSupported_NamedPipeServers = "PlatformNotSupported_NamedPipeServers";
		private ResourceManager resources;
		internal const string Serialization_MissingKeys = "Serialization_MissingKeys";
		internal const string SynchronizationLockException_IncorrectDispose = "SynchronizationLockException_IncorrectDispose";
		internal const string SynchronizationLockException_MisMatchedRead = "SynchronizationLockException_MisMatchedRead";
		internal const string SynchronizationLockException_MisMatchedUpgrade = "SynchronizationLockException_MisMatchedUpgrade";
		internal const string SynchronizationLockException_MisMatchedWrite = "SynchronizationLockException_MisMatchedWrite";
		internal const string TraceAsTraceSource = "TraceAsTraceSource";
		internal const string UnauthorizedAccess_IODenied_NoPathName = "UnauthorizedAccess_IODenied_NoPathName";
		internal const string UnauthorizedAccess_IODenied_Path = "UnauthorizedAccess_IODenied_Path";
		internal const string ValidateMetadataException_CountMaxLengthFailure = "ValidateMetadataException_CountMaxLengthFailure";
		internal const string ValidateMetadataException_CountMinLengthFailure = "ValidateMetadataException_CountMinLengthFailure";
		internal const string ValidateMetadataException_LengthMaxLengthFailure = "ValidateMetadataException_LengthMaxLengthFailure";
		internal const string ValidateMetadataException_LengthMinLengthFailure = "ValidateMetadataException_LengthMinLengthFailure";
		internal const string ValidateMetadataException_PatternFailure = "ValidateMetadataException_PatternFailure";
		internal const string ValidateMetadataException_RangeGreaterThanMaxRangeFailure = "ValidateMetadataException_RangeGreaterThanMaxRangeFailure";
		internal const string ValidateMetadataException_RangeSmallerThanMinRangeFailure = "ValidateMetadataException_RangeSmallerThanMinRangeFailure";

		internal SR()
		{
			this.resources = new ResourceManager("System.Core", base.GetType().Assembly);
		}

		private static SR GetLoader()
		{
			if (loader == null)
			{
				SR sr = new SR();
				Interlocked.CompareExchange<SR>(ref loader, sr, null);
			}
			return loader;
		}

		public static object GetObject(string name)
		{
			SR loader = GetLoader();
			if (loader == null)
			{
				return null;
			}
			return loader.resources.GetObject(name, Culture);
		}

		public static string GetString(string name)
		{
			SR loader = GetLoader();
			if (loader == null)
			{
				return null;
			}
			return loader.resources.GetString(name, Culture);
		}

		public static string GetString(string name, out bool usedFallback)
		{
			usedFallback = false;
			return GetString(name);
		}

		public static string GetString(string name, params object[] args)
		{
			SR loader = GetLoader();
			if (loader == null)
			{
				return null;
			}
			string format = loader.resources.GetString(name, Culture);
			if ((args == null) || (args.Length <= 0))
			{
				return format;
			}
			for (int i = 0; i < args.Length; i++)
			{
				string str2 = args[i] as string;
				if ((str2 != null) && (str2.Length > 0x400))
				{
					args[i] = str2.Substring(0, 0x3fd) + "...";
				}
			}
			return string.Format(CultureInfo.CurrentCulture, format, args);
		}

		private static CultureInfo Culture
		{
			get
			{
				return null;
			}
		}

		public static ResourceManager Resources
		{
			get
			{
				return GetLoader().resources;
			}
		}
	}

	internal interface IFileFormatReader
	{
		bool ReadFooter(InputBuffer input);
		bool ReadHeader(InputBuffer input);
		void UpdateWithBytesRead(byte[] buffer, int offset, int bytesToCopy);
		void Validate();
	}


	internal class CopyEncoder
	{
		private const int MaxUncompressedBlockSize = 0x10000;
		private const int PaddingSize = 5;

		public void GetBlock(DeflateInput input, OutputBuffer output, bool isFinal)
		{
			int count = 0;
			if (input != null)
			{
				count = Math.Min(input.Count, (output.FreeBytes - 5) - output.BitsInBuffer);
				if (count > 0xfffb)
				{
					count = 0xfffb;
				}
			}
			if (isFinal)
			{
				output.WriteBits(3, 1);
			}
			else
			{
				output.WriteBits(3, 0);
			}
			output.FlushBits();
			this.WriteLenNLen((ushort)count, output);
			if ((input != null) && (count > 0))
			{
				output.WriteBytes(input.Buffer, input.StartIndex, count);
				input.ConsumeBytes(count);
			}
		}

		private void WriteLenNLen(ushort len, OutputBuffer output)
		{
			output.WriteUInt16(len);
			ushort num = (ushort)~len;
			output.WriteUInt16(num);
		}
	}

	internal class FastEncoder
	{
		private Match currentMatch = new Match();
		private FastEncoderWindow inputWindow = new FastEncoderWindow();
		private double lastCompressionRatio;

		internal void FlushInput()
		{
			this.inputWindow.FlushWindow();
		}

		internal void GetBlock(DeflateInput input, OutputBuffer output, int maxBytesToCopy)
		{
			WriteDeflatePreamble(output);
			this.GetCompressedOutput(input, output, maxBytesToCopy);
			this.WriteEndOfBlock(output);
		}

		internal void GetBlockFooter(OutputBuffer output)
		{
			this.WriteEndOfBlock(output);
		}

		internal void GetBlockHeader(OutputBuffer output)
		{
			WriteDeflatePreamble(output);
		}

		internal void GetCompressedData(DeflateInput input, OutputBuffer output)
		{
			this.GetCompressedOutput(input, output, -1);
		}

		private void GetCompressedOutput(OutputBuffer output)
		{
			while ((inputWindow.BytesAvailable > 0) && this.SafeToWriteTo(output))
			{
				if (inputWindow.BytesAvailable == 1088)
				{
					var a = currentMatch.Symbol;
				}
				Trace.Write(string.Format("{0} - {1}\r\n", inputWindow.BytesAvailable, currentMatch.Position));
				this.inputWindow.GetNextSymbolOrMatch(this.currentMatch);
				if (this.currentMatch.State == MatchState.HasSymbol)
				{
					WriteChar(this.currentMatch.Symbol, output);
				}
				else
				{
					if (this.currentMatch.State == MatchState.HasMatch)
					{
						WriteMatch(this.currentMatch.Length, this.currentMatch.Position, output);
						continue;
					}
					WriteChar(this.currentMatch.Symbol, output);
					WriteMatch(this.currentMatch.Length, this.currentMatch.Position, output);
				}
			}
		}

		private void GetCompressedOutput(DeflateInput input, OutputBuffer output, int maxBytesToCopy)
		{
			int bytesWritten = output.BytesWritten;
			int num2 = 0;
			int num3 = this.BytesInHistory + input.Count;
			do
			{
				int num4 = (input.Count < this.inputWindow.FreeWindowSpace) ? input.Count : this.inputWindow.FreeWindowSpace;
				if (maxBytesToCopy >= 1)
				{
					num4 = Math.Min(num4, maxBytesToCopy - num2);
				}
				if (num4 > 0)
				{
					this.inputWindow.CopyBytes(input.Buffer, input.StartIndex, num4);
					input.ConsumeBytes(num4);
					num2 += num4;
				}
				this.GetCompressedOutput(output);
			}
			while ((this.SafeToWriteTo(output) && this.InputAvailable(input)) && ((maxBytesToCopy < 1) || (num2 < maxBytesToCopy)));
			int num6 = output.BytesWritten - bytesWritten;
			int num7 = this.BytesInHistory + input.Count;
			int num8 = num3 - num7;
			if (num6 != 0)
			{
				this.lastCompressionRatio = ((double)num6) / ((double)num8);
			}
		}

		private bool InputAvailable(DeflateInput input)
		{
			if (input.Count <= 0)
			{
				return (this.BytesInHistory > 0);
			}
			return true;
		}

		private bool SafeToWriteTo(OutputBuffer output)
		{
			return (output.FreeBytes > 0x10);
		}

		internal static void WriteChar(byte b, OutputBuffer output)
		{
			uint num = FastEncoderStatics.FastEncoderLiteralCodeInfo[b];
			output.WriteBits(((int)num) & 0x1f, num >> 5);
		}

		internal static void WriteDeflatePreamble(OutputBuffer output)
		{
			output.WriteBytes(FastEncoderStatics.FastEncoderTreeStructureData, 0, FastEncoderStatics.FastEncoderTreeStructureData.Length);
			output.WriteBits(9, 0x22);
		}

		private void WriteEndOfBlock(OutputBuffer output)
		{
			uint num = FastEncoderStatics.FastEncoderLiteralCodeInfo[0x100];
			int n = ((int)num) & 0x1f;
			output.WriteBits(n, num >> 5);
		}

		internal static void WriteMatch(int matchLen, int matchPos, OutputBuffer output)
		{
			uint num = FastEncoderStatics.FastEncoderLiteralCodeInfo[0xfe + matchLen];
			int n = ((int)num) & 0x1f;
			if (n <= 0x10)
			{
				output.WriteBits(n, num >> 5);
			}
			else
			{
				output.WriteBits(0x10, (num >> 5) & 0xffff);
				output.WriteBits(n - 0x10, num >> 0x15);
			}
			num = FastEncoderStatics.FastEncoderDistanceCodeInfo[FastEncoderStatics.GetSlot(matchPos)];
			output.WriteBits(((int)num) & 15, num >> 8);
			int num3 = ((int)(num >> 4)) & 15;
			if (num3 != 0)
			{
				output.WriteBits(num3, ((uint)matchPos) & FastEncoderStatics.BitMask[num3]);
			}
		}

		internal int BytesInHistory
		{
			get
			{
				return this.inputWindow.BytesAvailable;
			}
		}

		internal double LastCompressionRatio
		{
			get
			{
				return this.lastCompressionRatio;
			}
		}

		internal DeflateInput UnprocessedInput
		{
			get
			{
				return this.inputWindow.UnprocessedInput;
			}
		}
	}


	internal class DeflateInput
	{
		private byte[] buffer;
		private int count;
		private int startIndex;

		internal void ConsumeBytes(int n)
		{
			this.startIndex += n;
			this.count -= n;
		}

		internal InputState DumpState()
		{
			InputState state;
			state.count = this.count;
			state.startIndex = this.startIndex;
			return state;
		}

		internal void RestoreState(InputState state)
		{
			this.count = state.count;
			this.startIndex = state.startIndex;
		}

		internal byte[] Buffer
		{
			get
			{
				return this.buffer;
			}
			set
			{
				this.buffer = value;
			}
		}

		internal int Count
		{
			get
			{
				return this.count;
			}
			set
			{
				this.count = value;
			}
		}

		internal int StartIndex
		{
			get
			{
				return this.startIndex;
			}
			set
			{
				this.startIndex = value;
			}
		}

		[StructLayout(LayoutKind.Sequential)]
		internal struct InputState
		{
			internal int count;
			internal int startIndex;
		}
	}

	internal class OutputBuffer
	{
		private uint bitBuf;
		private int bitCount;
		private byte[] byteBuffer;
		private int pos;

		internal BufferState DumpState()
		{
			BufferState state;
			state.pos = this.pos;
			state.bitBuf = this.bitBuf;
			state.bitCount = this.bitCount;
			return state;
		}

		internal void FlushBits()
		{
			while (this.bitCount >= 8)
			{
				this.byteBuffer[this.pos++] = (byte)this.bitBuf;
				this.bitCount -= 8;
				this.bitBuf = this.bitBuf >> 8;
			}
			if (this.bitCount > 0)
			{
				this.byteBuffer[this.pos++] = (byte)this.bitBuf;
				this.bitBuf = 0;
				this.bitCount = 0;
			}
		}

		internal void RestoreState(BufferState state)
		{
			this.pos = state.pos;
			this.bitBuf = state.bitBuf;
			this.bitCount = state.bitCount;
		}

		internal void UpdateBuffer(byte[] output)
		{
			this.byteBuffer = output;
			this.pos = 0;
		}

		internal void WriteBits(int n, uint bits)
		{
			this.bitBuf |= bits << this.bitCount;
			this.bitCount += n;
			if (this.bitCount >= 0x10)
			{
				this.byteBuffer[this.pos++] = (byte)this.bitBuf;
				this.byteBuffer[this.pos++] = (byte)(this.bitBuf >> 8);
				this.bitCount -= 0x10;
				this.bitBuf = this.bitBuf >> 0x10;
			}
		}

		internal void WriteBytes(byte[] byteArray, int offset, int count)
		{
			if (this.bitCount == 0)
			{
				Array.Copy(byteArray, offset, this.byteBuffer, this.pos, count);
				this.pos += count;
			}
			else
			{
				this.WriteBytesUnaligned(byteArray, offset, count);
			}
		}

		private void WriteBytesUnaligned(byte[] byteArray, int offset, int count)
		{
			for (int i = 0; i < count; i++)
			{
				byte b = byteArray[offset + i];
				this.WriteByteUnaligned(b);
			}
		}

		private void WriteByteUnaligned(byte b)
		{
			this.WriteBits(8, b);
		}

		internal void WriteUInt16(ushort value)
		{
			this.byteBuffer[this.pos++] = (byte)value;
			this.byteBuffer[this.pos++] = (byte)(value >> 8);
		}

		internal int BitsInBuffer
		{
			get
			{
				return ((this.bitCount / 8) + 1);
			}
		}

		internal int BytesWritten
		{
			get
			{
				return this.pos;
			}
		}

		internal int FreeBytes
		{
			get
			{
				return (this.byteBuffer.Length - this.pos);
			}
		}

		[StructLayout(LayoutKind.Sequential)]
		internal struct BufferState
		{
			internal int pos;
			internal uint bitBuf;
			internal int bitCount;
		}
	}

	internal enum BlockType
	{
		Uncompressed,
		Static,
		Dynamic
	}



	internal class HuffmanTree
	{
		internal const int MaxLiteralTreeElements = 288;
		internal const int MaxDistTreeElements = 32;
		internal const int EndOfBlockCode = 256;
		internal const int NumberOfCodeLengthTreeElements = 19;

		int tableBits;
		short[] table;
		short[] left;
		short[] right;
		byte[] codeLengthArray;
		int tableMask;

		static HuffmanTree staticLiteralLengthTree;
		static HuffmanTree staticDistanceTree;

		static HuffmanTree()
		{
			staticLiteralLengthTree = new HuffmanTree(GetStaticLiteralTreeLength());
			staticDistanceTree = new HuffmanTree(GetStaticDistanceTreeLength());
		}

		static public HuffmanTree StaticLiteralLengthTree
		{
			get
			{
				return staticLiteralLengthTree;
			}
		}

		static public HuffmanTree StaticDistanceTree
		{
			get
			{
				return staticDistanceTree;
			}
		}

		public HuffmanTree(byte[] codeLengths)
		{
			codeLengthArray = codeLengths;
			if (codeLengthArray.Length == MaxLiteralTreeElements)
			{
				tableBits = 9;
			}
			else
			{
				tableBits = 7;
			}
			tableMask = (1 << tableBits) - 1;
			CreateTable();
		}

		static byte[] GetStaticLiteralTreeLength()
		{
			var buffer = new System.Byte[MaxLiteralTreeElements];
			for (var i = 0; i <= 0x8f; i++)buffer[i] = 8;
			for (var j = 0x90; j <= 0xff; j++)buffer[j] = 9;
			for (var k = 0x100; k <= 0x117; k++)buffer[k] = 7;
			for (var m = 280; m <= 0x11f; m++)buffer[m] = 8;
			return buffer;
		}

		static byte[] GetStaticDistanceTreeLength()
		{
			var buffer = new System.Byte[MaxDistTreeElements];
			for (var i = 0; i < 0x20; i++) buffer[i] = 5;
			return buffer;
		}

		uint[] CalculateHuffmanCode()
		{
			uint[] bitLengthCount = new uint[17];
			for (int i = 0; i < codeLengthArray.Length; i++)
			{
				int index = codeLengthArray[i];
				bitLengthCount[index]++;
			}
			bitLengthCount[0] = 0;
			uint[] nextCode = new uint[17];
			uint tempCode = 0;
			for (int bits = 1; bits <= 16; bits++)
			{
				tempCode = (tempCode + bitLengthCount[bits - 1]) << 1;
				nextCode[bits] = tempCode;
			}
			uint[] code = new uint[MaxLiteralTreeElements];
			for (int i = 0; i < codeLengthArray.Length; i++)
			{
				int len = codeLengthArray[i];
				if (len > 0)
				{
					code[i] = BitReverse(nextCode[len], len);
					nextCode[len]++;
				}
			}
			return code;
		}

		public static uint BitReverse(uint code, int length)
		{
			uint new_code = 0;
			do
			{
				new_code |= (code & 1);
				new_code <<= 1;
				code >>= 1;
			} while (--length > 0);

			return new_code >> 1;
		}


		private void CreateTable()
		{
			uint[] codeArray = CalculateHuffmanCode();
			table = new short[1 << tableBits];
			left = new short[2 * codeLengthArray.Length];
			right = new short[2 * codeLengthArray.Length];
			short avail = (short)codeLengthArray.Length;
			for (int ch = 0; ch < codeLengthArray.Length; ch++)
			{
				int len = codeLengthArray[ch];
				if (len > 0)
				{
					int start = (int)codeArray[ch];
					if (len <= tableBits)
					{
						int increment = 1 << len;
						if (start >= increment) throw new InvalidDataException(SR.GetString("InvalidHuffmanData"));
						int locs = 1 << (tableBits - len);
						for (int j = 0; j < locs; j++)
						{
							table[start] = (short)ch;
							start += increment;
						}
					}
					else
					{
						int overflowBits = len - tableBits;
						int codeBitMask = 1 << tableBits;
						int index = start & ((1 << tableBits) - 1);
						short[] array = table;
						do
						{
							short value = array[index];
							if (value == 0)
							{
								array[index] = (short)-avail;
								value = (short)-avail;
								avail++;
							}
							if ((start & codeBitMask) == 0) array = left;
							else array = right;
							index = -value;
							codeBitMask <<= 1;
							overflowBits--;
						} while (overflowBits != 0);
						array[index] = (short)ch;
					}
				}
			}
		}

		public int GetNextSymbol(InputBuffer input)
		{
			uint bitBuffer = input.TryLoad16Bits();
			if (input.AvailableBits == 0) return -1;
			int symbol = table[bitBuffer & tableMask];
			if (symbol < 0)
			{
				uint mask = (uint)1 << tableBits;
				do
				{
					symbol = -symbol;
					if ((bitBuffer & mask) == 0) symbol = left[symbol];
					else symbol = right[symbol];
					mask <<= 1;
				} while (symbol < 0);
			}
			if (codeLengthArray[symbol] > input.AvailableBits) return -1;
			input.SkipBits(codeLengthArray[symbol]);
			return symbol;
		}

	}





	internal class InputBuffer
	{
		private uint bitBuffer;
		private int bitsInBuffer;
		private byte[] buffer;
		private int end;
		private int start;

		public int CopyTo(byte[] output, int offset, int length)
		{
			int num = 0;
			while ((this.bitsInBuffer > 0) && (length > 0))
			{
				output[offset++] = (byte)this.bitBuffer;
				this.bitBuffer = this.bitBuffer >> 8;
				this.bitsInBuffer -= 8;
				length--;
				num++;
			}
			if (length == 0)
			{
				return num;
			}
			int num2 = this.end - this.start;
			if (length > num2)
			{
				length = num2;
			}
			Array.Copy(this.buffer, this.start, output, offset, length);
			this.start += length;
			return (num + length);
		}

		public bool EnsureBitsAvailable(int count)
		{
			if (this.bitsInBuffer < count)
			{
				if (this.NeedsInput())
				{
					return false;
				}
				this.bitBuffer |= (uint)(this.buffer[this.start++] << this.bitsInBuffer);
				this.bitsInBuffer += 8;
				if (this.bitsInBuffer < count)
				{
					if (this.NeedsInput())
					{
						return false;
					}
					this.bitBuffer |= (uint)(this.buffer[this.start++] << this.bitsInBuffer);
					this.bitsInBuffer += 8;
				}
			}
			return true;
		}

		private uint GetBitMask(int count)
		{
			return (uint)((((int)1) << count) - 1);
		}

		public int GetBits(int count)
		{
			if (!this.EnsureBitsAvailable(count))
			{
				return -1;
			}
			int num = (int)(this.bitBuffer & this.GetBitMask(count));
			this.bitBuffer = this.bitBuffer >> count;
			this.bitsInBuffer -= count;
			return num;
		}

		public bool NeedsInput()
		{
			return (this.start == this.end);
		}

		public void SetInput(byte[] buffer, int offset, int length)
		{
			this.buffer = buffer;
			this.start = offset;
			this.end = offset + length;
		}

		public void SkipBits(int n)
		{
			this.bitBuffer = this.bitBuffer >> n;
			this.bitsInBuffer -= n;
		}

		public void SkipToByteBoundary()
		{
			this.bitBuffer = this.bitBuffer >> (this.bitsInBuffer % 8);
			this.bitsInBuffer -= this.bitsInBuffer % 8;
		}

		public uint TryLoad16Bits()
		{
			if (this.bitsInBuffer < 8)
			{
				if (this.start < this.end)
				{
					this.bitBuffer |= (uint)(this.buffer[this.start++] << this.bitsInBuffer);
					this.bitsInBuffer += 8;
				}
				if (this.start < this.end)
				{
					this.bitBuffer |= (uint)(this.buffer[this.start++] << this.bitsInBuffer);
					this.bitsInBuffer += 8;
				}
			}
			else if ((this.bitsInBuffer < 0x10) && (this.start < this.end))
			{
				this.bitBuffer |= (uint)(this.buffer[this.start++] << this.bitsInBuffer);
				this.bitsInBuffer += 8;
			}
			return this.bitBuffer;
		}

		public int AvailableBits
		{
			get
			{
				return this.bitsInBuffer;
			}
		}

		public int AvailableBytes
		{
			get
			{
				return ((this.end - this.start) + (this.bitsInBuffer / 8));
			}
		}
	}

	internal class OutputWindow
	{
		private int bytesUsed;
		private int end;
		private byte[] window = new byte[0x8000];
		private const int WindowMask = 0x7fff;
		private const int WindowSize = 0x8000;

		public int CopyFrom(InputBuffer input, int length)
		{
			int num;
			length = Math.Min(Math.Min(length, 0x8000 - this.bytesUsed), input.AvailableBytes);
			int num2 = 0x8000 - this.end;
			if (length > num2)
			{
				num = input.CopyTo(this.window, this.end, num2);
				if (num == num2)
				{
					num += input.CopyTo(this.window, 0, length - num2);
				}
			}
			else
			{
				num = input.CopyTo(this.window, this.end, length);
			}
			this.end = (this.end + num) & 0x7fff;
			this.bytesUsed += num;
			return num;
		}

		public int CopyTo(byte[] output, int offset, int length)
		{
			int end;
			if (length > this.bytesUsed)
			{
				end = this.end;
				length = this.bytesUsed;
			}
			else
			{
				end = ((this.end - this.bytesUsed) + length) & 0x7fff;
			}
			int num2 = length;
			int num3 = length - end;
			if (num3 > 0)
			{
				Array.Copy(this.window, 0x8000 - num3, output, offset, num3);
				offset += num3;
				length = end;
			}
			Array.Copy(this.window, end - length, output, offset, length);
			this.bytesUsed -= num2;
			return num2;
		}

		public void Write(byte b)
		{
			this.window[this.end++] = b;
			this.end &= 0x7fff;
			this.bytesUsed++;
		}

		public void WriteLengthDistance(int length, int distance)
		{
			this.bytesUsed += length;
			int sourceIndex = (this.end - distance) & 0x7fff;
			int num2 = 0x8000 - length;
			if ((sourceIndex <= num2) && (this.end < num2))
			{
				if (length > distance)
				{
					while (length-- > 0)
					{
						this.window[this.end++] = this.window[sourceIndex++];
					}
				}
				else
				{
					Array.Copy(this.window, sourceIndex, this.window, this.end, length);
					this.end += length;
				}
			}
			else
			{
				while (length-- > 0)
				{
					this.window[this.end++] = this.window[sourceIndex++];
					this.end &= 0x7fff;
					sourceIndex &= 0x7fff;
				}
			}
		}

		public int AvailableBytes
		{
			get
			{
				return this.bytesUsed;
			}
		}

		public int FreeBytes
		{
			get
			{
				return (0x8000 - this.bytesUsed);
			}
		}
	}

	internal enum InflaterState
	{
		DecodeTop = 10,
		DecodingUncompressed = 20,
		Done = 0x18,
		HaveDistCode = 13,
		HaveFullLength = 12,
		HaveInitialLength = 11,
		ReadingBFinal = 2,
		ReadingBType = 3,
		ReadingCodeLengthCodes = 7,
		ReadingFooter = 0x16,
		ReadingHeader = 0,
		ReadingNumCodeLengthCodes = 6,
		ReadingNumDistCodes = 5,
		ReadingNumLitCodes = 4,
		ReadingTreeCodesAfter = 9,
		ReadingTreeCodesBefore = 8,
		StartReadingFooter = 0x15,
		UncompressedAligning = 15,
		UncompressedByte1 = 0x10,
		UncompressedByte2 = 0x11,
		UncompressedByte3 = 0x12,
		UncompressedByte4 = 0x13,
		VerifyingFooter = 0x17
	}

	internal class Match
	{
		private int len;
		private int pos;
		private MatchState state;
		private byte symbol;

		internal int Length
		{
			get
			{
				return this.len;
			}
			set
			{
				this.len = value;
			}
		}

		internal int Position
		{
			get
			{
				return this.pos;
			}
			set
			{
				this.pos = value;
			}
		}

		internal MatchState State
		{
			get
			{
				return this.state;
			}
			set
			{
				this.state = value;
			}
		}

		internal byte Symbol
		{
			get
			{
				return this.symbol;
			}
			set
			{
				this.symbol = value;
			}
		}
	}

	internal class FastEncoderWindow
	{
		private int bufEnd;
		private int bufPos;
		private const int FastEncoderHashMask = 0x7ff;
		private const int FastEncoderHashShift = 4;
		private const int FastEncoderHashtableSize = 0x800;
		private const int FastEncoderMatch3DistThreshold = 0x4000;
		private const int FastEncoderWindowMask = 0x1fff;
		private const int FastEncoderWindowSize = 0x2000;
		private const int GoodLength = 4;
		private const int LazyMatchThreshold = 6;
		private ushort[] lookup;
		internal const int MaxMatch = 0x102;
		internal const int MinMatch = 3;
		private const int NiceLength = 0x20;
		private ushort[] prev;
		private const int SearchDepth = 0x20;
		private byte[] window;

		public FastEncoderWindow()
		{
			this.ResetWindow();
		}

		public void CopyBytes(byte[] inputBuffer, int startIndex, int count)
		{
			Array.Copy(inputBuffer, startIndex, this.window, this.bufEnd, count);
			this.bufEnd += count;
		}

		private int FindMatch(int search, out int matchPos, int searchDepth, int niceLength)
		{
			int num = 0;
			int num2 = 0;
			int num3 = this.bufPos - 0x2000;
			byte num4 = this.window[this.bufPos];
			while (search > num3)
			{
				if (this.window[search + num] == num4)
				{
					int num5 = 0;
					while (num5 < 0x102)
					{
						if (this.window[this.bufPos + num5] != this.window[search + num5])
						{
							break;
						}
						num5++;
					}
					if (num5 > num)
					{
						num = num5;
						num2 = search;
						if (num5 > 0x20)
						{
							break;
						}
						num4 = this.window[this.bufPos + num5];
					}
				}
				if (--searchDepth == 0)
				{
					break;
				}
				search = this.prev[search & 0x1fff];
			}
			matchPos = (this.bufPos - num2) - 1;
			if ((num == 3) && (matchPos >= 0x4000))
			{
				return 0;
			}
			return num;
		}

		public void FlushWindow()
		{
			this.ResetWindow();
		}

		internal bool GetNextSymbolOrMatch(Match match)
		{
			int num2;
			uint hash = this.HashValue(0, this.window[this.bufPos]);
			hash = this.HashValue(hash, this.window[this.bufPos + 1]);
			int matchPos = 0;
			if ((this.bufEnd - this.bufPos) <= 3)
			{
				num2 = 0;
			}
			else
			{
				int search = (int)this.InsertString(ref hash);
				if (search != 0)
				{
					num2 = this.FindMatch(search, out matchPos, 0x20, 0x20);
					if ((this.bufPos + num2) > this.bufEnd)
					{
						num2 = this.bufEnd - this.bufPos;
					}
				}
				else
				{
					num2 = 0;
				}
			}
			if (num2 < 3)
			{
				match.State = MatchState.HasSymbol;
				match.Symbol = this.window[this.bufPos];
				this.bufPos++;
			}
			else
			{
				this.bufPos++;
				if (num2 <= 6)
				{
					int num5;
					int num6 = 0;
					int num7 = (int)this.InsertString(ref hash);
					if (num7 != 0)
					{
						num5 = this.FindMatch(num7, out num6, (num2 < 4) ? 0x20 : 8, 0x20);
						if ((this.bufPos + num5) > this.bufEnd)
						{
							num5 = this.bufEnd - this.bufPos;
						}
					}
					else
					{
						num5 = 0;
					}
					if (num5 > num2)
					{
						match.State = MatchState.HasSymbolAndMatch;
						match.Symbol = this.window[this.bufPos - 1];
						match.Position = num6;
						match.Length = num5;
						this.bufPos++;
						num2 = num5;
						this.InsertStrings(ref hash, num2);
					}
					else
					{
						match.State = MatchState.HasMatch;
						match.Position = matchPos;
						match.Length = num2;
						num2--;
						this.bufPos++;
						this.InsertStrings(ref hash, num2);
					}
				}
				else
				{
					match.State = MatchState.HasMatch;
					match.Position = matchPos;
					match.Length = num2;
					this.InsertStrings(ref hash, num2);
				}
			}
			if (this.bufPos == 0x4000)
			{
				this.MoveWindows();
			}
			return true;
		}

		private uint HashValue(uint hash, byte b)
		{
			return ((hash << 4) ^ b);
		}

		private uint InsertString(ref uint hash)
		{
			hash = this.HashValue(hash, this.window[this.bufPos + 2]);
			uint num = this.lookup[hash & 0x7ff];
			this.lookup[hash & 0x7ff] = (ushort)this.bufPos;
			this.prev[this.bufPos & 0x1fff] = (ushort)num;
			return num;
		}

		private void InsertStrings(ref uint hash, int matchLen)
		{
			if ((this.bufEnd - this.bufPos) <= matchLen)
			{
				this.bufPos += matchLen - 1;
			}
			else
			{
				while (--matchLen > 0)
				{
					this.InsertString(ref hash);
					this.bufPos++;
				}
			}
		}

		public void MoveWindows()
		{
			int num;
			Array.Copy(this.window, this.bufPos - 0x2000, this.window, 0, 0x2000);
			for (num = 0; num < 0x800; num++)
			{
				int num2 = this.lookup[num] - 0x2000;
				if (num2 <= 0)
				{
					this.lookup[num] = 0;
				}
				else
				{
					this.lookup[num] = (ushort)num2;
				}
			}
			for (num = 0; num < 0x2000; num++)
			{
				long num3 = this.prev[num] - 0x2000L;
				if (num3 <= 0L)
				{
					this.prev[num] = 0;
				}
				else
				{
					this.prev[num] = (ushort)num3;
				}
			}
			this.bufPos = 0x2000;
			this.bufEnd = this.bufPos;
		}

		private uint RecalculateHash(int position)
		{
			return (uint)((((this.window[position] << 8) ^ (this.window[position + 1] << 4)) ^ this.window[position + 2]) & 0x7ff);
		}

		private void ResetWindow()
		{
			this.window = new byte[0x4106];
			this.prev = new ushort[0x2102];
			this.lookup = new ushort[0x800];
			this.bufPos = 0x2000;
			this.bufEnd = this.bufPos;
		}

		[Conditional("DEBUG")]
		private void VerifyHashes()
		{
			for (int i = 0; i < 0x800; i++)
			{
				ushort num3;
				for (ushort j = this.lookup[i]; (j != 0) && ((this.bufPos - j) < 0x2000); j = num3)
				{
					num3 = this.prev[j & 0x1fff];
					if ((this.bufPos - num3) >= 0x2000)
					{
						break;
					}
				}
			}
		}

		public int BytesAvailable
		{
			get
			{
				return (this.bufEnd - this.bufPos);
			}
		}

		public int FreeWindowSpace
		{
			get
			{
				return (0x4000 - this.bufEnd);
			}
		}

		public DeflateInput UnprocessedInput
		{
			get
			{

				return new DeflateInput { Buffer = this.window, StartIndex = this.bufPos, Count = this.bufEnd - this.bufPos };
			}
		}
	}



	internal enum MatchState
	{
		HasMatch = 2,
		HasSymbol = 1,
		HasSymbolAndMatch = 3
	}



	internal static class FastEncoderStatics
	{
		internal static readonly byte[] BFinalFastEncoderTreeStructureData = new byte[] { 
        0xed, 0xbd, 7, 0x60, 0x1c, 0x49, 150, 0x25, 0x26, 0x2f, 0x6d, 0xca, 0x7b, 0x7f, 0x4a, 0xf5, 
        0x4a, 0xd7, 0xe0, 0x74, 0xa1, 8, 0x80, 0x60, 0x13, 0x24, 0xd8, 0x90, 0x40, 0x10, 0xec, 0xc1, 
        0x88, 0xcd, 230, 0x92, 0xec, 0x1d, 0x69, 0x47, 0x23, 0x29, 0xab, 0x2a, 0x81, 0xca, 0x65, 0x56, 
        0x65, 0x5d, 0x66, 0x16, 0x40, 0xcc, 0xed, 0x9d, 0xbc, 0xf7, 0xde, 0x7b, 0xef, 0xbd, 0xf7, 0xde, 
        0x7b, 0xef, 0xbd, 0xf7, 0xba, 0x3b, 0x9d, 0x4e, 0x27, 0xf7, 0xdf, 0xff, 0x3f, 0x5c, 0x66, 100, 
        1, 0x6c, 0xf6, 0xce, 0x4a, 0xda, 0xc9, 0x9e, 0x21, 0x80, 170, 200, 0x1f, 0x3f, 0x7e, 0x7c, 
        0x1f, 0x3f
     };
		internal const uint BFinalNoCompressionHeader = 1;
		internal const int BFinalNoCompressionHeaderBitCount = 3;
		internal static readonly uint[] BitMask = new uint[] { 0, 1, 3, 7, 15, 0x1f, 0x3f, 0x7f, 0xff, 0x1ff, 0x3ff, 0x7ff, 0xfff, 0x1fff, 0x3fff, 0x7fff };
		private static byte[] distLookup = new byte[0x200];
		internal static readonly byte[] ExtraDistanceBits = new byte[] { 
        0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 
        7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 0, 0
     };
		internal static readonly byte[] ExtraLengthBits = new byte[] { 
        0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 
        3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0
     };
		internal static readonly uint[] FastEncoderDistanceCodeInfo = new uint[] { 
        0xf06, 0x1ff0a, 0x3ff0b, 0x7ff0b, 0xff19, 0x3f18, 0xbf28, 0x7f28, 0x1f37, 0x5f37, 0xd45, 0x2f46, 0x54, 0x1d55, 0x864, 0x365, 
        0x474, 0x1375, 0xc84, 0x284, 0xa94, 0x694, 0xea4, 420, 0x9b4, 0xbb5, 0x5c4, 0x1bc5, 0x7d5, 0x17d5, 0, 0x100
     };
		internal static readonly uint[] FastEncoderLiteralCodeInfo = new uint[] { 
        0xd7ee, 0x4d7ee, 0x2d7ee, 0x6d7ee, 0x1d7ee, 0x5d7ee, 0x3d7ee, 0x7d7ee, 0x37ee, 0xc7ec, 0x126, 0x437ee, 0x237ee, 0x637ee, 0x137ee, 0x537ee, 
        0x337ee, 0x737ee, 0xb7ee, 0x4b7ee, 0x2b7ee, 0x6b7ee, 0x1b7ee, 0x5b7ee, 0x3b7ee, 0x7b7ee, 0x77ee, 0x477ee, 0x277ee, 0x677ee, 0x17ed, 0x177ee, 
        0x526, 0x577ee, 0x23ea, 0x1c7ec, 0x377ee, 0x777ee, 0x217ed, 0x63ea, 0xb68, 0xee9, 0x5beb, 0x13ea, 0x467, 0x1b68, 0xc67, 0x2ee9, 
        0x768, 0x1768, 0xf68, 0x1ee9, 0x1f68, 0x3ee9, 0x53ea, 0x1e9, 0xe8, 0x21e9, 0x11e9, 0x10e8, 0x31e9, 0x33ea, 0x8e8, 0xf7ee, 
        0x4f7ee, 0x18e8, 0x9e9, 0x4e8, 0x29e9, 0x14e8, 0x19e9, 0x73ea, 0xdbeb, 0xce8, 0x3beb, 0x2f7ee, 0x39e9, 0xbea, 0x5e9, 0x4bea, 
        0x25e9, 0x27ec, 0x15e9, 0x35e9, 0xde9, 0x2bea, 0x127ec, 0xbbeb, 0x6f7ee, 0x1f7ee, 0xa7ec, 0x7beb, 0x5f7ee, 0xfbeb, 0x3f7ee, 0x7f7ee, 
        0xfee, 0x326, 0x267, 0xa67, 0x667, 0x726, 0x1ce8, 0x2e8, 0xe67, 0xa6, 0x1a7ec, 0x2de9, 0x4a6, 0x167, 0x967, 0x2a6, 
        0x567, 0x117ed, 0x6a6, 0x1a6, 0x5a6, 0xd67, 0x12e8, 0xae8, 0x1de9, 0x1ae8, 0x7eb, 0x317ed, 0x67ec, 0x97ed, 0x297ed, 0x40fee, 
        0x20fee, 0x60fee, 0x10fee, 0x50fee, 0x30fee, 0x70fee, 0x8fee, 0x48fee, 0x28fee, 0x68fee, 0x18fee, 0x58fee, 0x38fee, 0x78fee, 0x4fee, 0x44fee, 
        0x24fee, 0x64fee, 0x14fee, 0x54fee, 0x34fee, 0x74fee, 0xcfee, 0x4cfee, 0x2cfee, 0x6cfee, 0x1cfee, 0x5cfee, 0x3cfee, 0x7cfee, 0x2fee, 0x42fee, 
        0x22fee, 0x62fee, 0x12fee, 0x52fee, 0x32fee, 0x72fee, 0xafee, 0x4afee, 0x2afee, 0x6afee, 0x1afee, 0x5afee, 0x3afee, 0x7afee, 0x6fee, 0x46fee, 
        0x26fee, 0x66fee, 0x16fee, 0x56fee, 0x36fee, 0x76fee, 0xefee, 0x4efee, 0x2efee, 0x6efee, 0x1efee, 0x5efee, 0x3efee, 0x7efee, 0x1fee, 0x41fee, 
        0x21fee, 0x61fee, 0x11fee, 0x51fee, 0x31fee, 0x71fee, 0x9fee, 0x49fee, 0x29fee, 0x69fee, 0x19fee, 0x59fee, 0x39fee, 0x79fee, 0x5fee, 0x45fee, 
        0x25fee, 0x65fee, 0x15fee, 0x55fee, 0x35fee, 0x75fee, 0xdfee, 0x4dfee, 0x2dfee, 0x6dfee, 0x1dfee, 0x5dfee, 0x3dfee, 0x7dfee, 0x3fee, 0x43fee, 
        0x23fee, 0x63fee, 0x13fee, 0x53fee, 0x33fee, 0x73fee, 0xbfee, 0x4bfee, 0x2bfee, 0x6bfee, 0x1bfee, 0x5bfee, 0x3bfee, 0x7bfee, 0x7fee, 0x47fee, 
        0x27fee, 0x67fee, 0x17fee, 0x197ed, 0x397ed, 0x57ed, 0x57fee, 0x257ed, 0x37fee, 0x157ed, 0x77fee, 0x357ed, 0xffee, 0x4ffee, 0x2ffee, 0x6ffee, 
        0x1ffee, 0x84, 3, 0x184, 0x44, 0x144, 0xc5, 0x2c5, 0x1c5, 0x3c6, 0x7c6, 0x26, 0x426, 0x3a7, 0xba7, 0x7a7, 
        0xfa7, 0x227, 0x627, 0xa27, 0xe27, 0x68, 0x868, 0x1068, 0x1868, 0x369, 0x1369, 0x2369, 0x3369, 0x6ea, 0x26ea, 0x46ea, 
        0x66ea, 0x16eb, 0x36eb, 0x56eb, 0x76eb, 0x96eb, 0xb6eb, 0xd6eb, 0xf6eb, 0x3dec, 0x7dec, 0xbdec, 0xfdec, 0x13dec, 0x17dec, 0x1bdec, 
        0x1fdec, 0x6bed, 0xebed, 0x16bed, 0x1ebed, 0x26bed, 0x2ebed, 0x36bed, 0x3ebed, 0x3ec, 0x43ec, 0x83ec, 0xc3ec, 0x103ec, 0x143ec, 0x183ec, 
        0x1c3ec, 0x1bee, 0x9bee, 0x11bee, 0x19bee, 0x21bee, 0x29bee, 0x31bee, 0x39bee, 0x41bee, 0x49bee, 0x51bee, 0x59bee, 0x61bee, 0x69bee, 0x71bee, 
        0x79bee, 0x167f0, 0x367f0, 0x567f0, 0x767f0, 0x967f0, 0xb67f0, 0xd67f0, 0xf67f0, 0x1167f0, 0x1367f0, 0x1567f0, 0x1767f0, 0x1967f0, 0x1b67f0, 0x1d67f0, 
        0x1f67f0, 0x87ef, 0x187ef, 0x287ef, 0x387ef, 0x487ef, 0x587ef, 0x687ef, 0x787ef, 0x887ef, 0x987ef, 0xa87ef, 0xb87ef, 0xc87ef, 0xd87ef, 0xe87ef, 
        0xf87ef, 0xe7f0, 0x2e7f0, 0x4e7f0, 0x6e7f0, 0x8e7f0, 0xae7f0, 0xce7f0, 0xee7f0, 0x10e7f0, 0x12e7f0, 0x14e7f0, 0x16e7f0, 0x18e7f0, 0x1ae7f0, 0x1ce7f0, 
        0x1ee7f0, 0x5fff3, 0xdfff3, 0x15fff3, 0x1dfff3, 0x25fff3, 0x2dfff3, 0x35fff3, 0x3dfff3, 0x45fff3, 0x4dfff3, 0x55fff3, 0x5dfff3, 0x65fff3, 0x6dfff3, 0x75fff3, 
        0x7dfff3, 0x85fff3, 0x8dfff3, 0x95fff3, 0x9dfff3, 0xa5fff3, 0xadfff3, 0xb5fff3, 0xbdfff3, 0xc5fff3, 0xcdfff3, 0xd5fff3, 0xddfff3, 0xe5fff3, 0xedfff3, 0xf5fff3, 
        0xfdfff3, 0x3fff3, 0xbfff3, 0x13fff3, 0x1bfff3, 0x23fff3, 0x2bfff3, 0x33fff3, 0x3bfff3, 0x43fff3, 0x4bfff3, 0x53fff3, 0x5bfff3, 0x63fff3, 0x6bfff3, 0x73fff3, 
        0x7bfff3, 0x83fff3, 0x8bfff3, 0x93fff3, 0x9bfff3, 0xa3fff3, 0xabfff3, 0xb3fff3, 0xbbfff3, 0xc3fff3, 0xcbfff3, 0xd3fff3, 0xdbfff3, 0xe3fff3, 0xebfff3, 0xf3fff3, 
        0xfbfff3, 0x7fff3, 0xffff3, 0x17fff3, 0x1ffff3, 0x27fff3, 0x2ffff3, 0x37fff3, 0x3ffff3, 0x47fff3, 0x4ffff3, 0x57fff3, 0x5ffff3, 0x67fff3, 0x6ffff3, 0x77fff3, 
        0x7ffff3, 0x87fff3, 0x8ffff3, 0x97fff3, 0x9ffff3, 0xa7fff3, 0xaffff3, 0xb7fff3, 0xbffff3, 0xc7fff3, 0xcffff3, 0xd7fff3, 0xdffff3, 0xe7fff3, 0xeffff3, 0xf7fff3, 
        0xfffff3, 0x1e7f1, 0x3e7f1, 0x5e7f1, 0x7e7f1, 0x9e7f1, 0xbe7f1, 0xde7f1, 0xfe7f1, 0x11e7f1, 0x13e7f1, 0x15e7f1, 0x17e7f1, 0x19e7f1, 0x1be7f1, 0x1de7f1, 
        0x1fe7f1, 0x21e7f1, 0x23e7f1, 0x25e7f1, 0x27e7f1, 0x29e7f1, 0x2be7f1, 0x2de7f1, 0x2fe7f1, 0x31e7f1, 0x33e7f1, 0x35e7f1, 0x37e7f1, 0x39e7f1, 0x3be7f1, 0x3de7f1, 
        0x47eb
     };
		internal const uint FastEncoderPostTreeBitBuf = 0x22;
		internal const int FastEncoderPostTreeBitCount = 9;
		internal static readonly byte[] FastEncoderTreeStructureData = new byte[] { 
        0xec, 0xbd, 7, 0x60, 0x1c, 0x49, 150, 0x25, 0x26, 0x2f, 0x6d, 0xca, 0x7b, 0x7f, 0x4a, 0xf5, 
        0x4a, 0xd7, 0xe0, 0x74, 0xa1, 8, 0x80, 0x60, 0x13, 0x24, 0xd8, 0x90, 0x40, 0x10, 0xec, 0xc1, 
        0x88, 0xcd, 230, 0x92, 0xec, 0x1d, 0x69, 0x47, 0x23, 0x29, 0xab, 0x2a, 0x81, 0xca, 0x65, 0x56, 
        0x65, 0x5d, 0x66, 0x16, 0x40, 0xcc, 0xed, 0x9d, 0xbc, 0xf7, 0xde, 0x7b, 0xef, 0xbd, 0xf7, 0xde, 
        0x7b, 0xef, 0xbd, 0xf7, 0xba, 0x3b, 0x9d, 0x4e, 0x27, 0xf7, 0xdf, 0xff, 0x3f, 0x5c, 0x66, 100, 
        1, 0x6c, 0xf6, 0xce, 0x4a, 0xda, 0xc9, 0x9e, 0x21, 0x80, 170, 200, 0x1f, 0x3f, 0x7e, 0x7c, 
        0x1f, 0x3f
     };
		internal const int MaxCodeLen = 0x10;
		internal const uint NoCompressionHeader = 0;
		internal const int NoCompressionHeaderBitCount = 3;
		internal const int NumChars = 0x100;
		internal const int NumDistBaseCodes = 30;
		internal const int NumLengthBaseCodes = 0x1d;

		static FastEncoderStatics()
		{
			GenerateSlotTables();
		}

		public static uint BitReverse(uint code, int length)
		{
			uint num = 0;
			do
			{
				num |= code & 1;
				num = num << 1;
				code = code >> 1;
			}
			while (--length > 0);
			return (num >> 1);
		}

		internal static void GenerateSlotTables()
		{
			int num = 0;
			int index = 0;
			while (index < 0x10)
			{
				for (int i = 0; i < (((int)1) << ExtraDistanceBits[index]); i++)
				{
					distLookup[num++] = (byte)index;
				}
				index++;
			}
			num = num >> 7;
			while (index < 30)
			{
				for (int j = 0; j < (((int)1) << (ExtraDistanceBits[index] - 7)); j++)
				{
					distLookup[0x100 + num++] = (byte)index;
				}
				index++;
			}
		}

		internal static int GetSlot(int pos)
		{
			return distLookup[(pos < 0x100) ? pos : (0x100 + (pos >> 7))];
		}
	}

}