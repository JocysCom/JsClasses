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
//		<RootNamespace>System.IO</RootNamespace>
// <PropertyGroup>
//-----------------------------------------------------------------------------

System.IO = System.IO ? System.IO : {};
System.Type.RegisterNamespace("System.IO");

//=============================================================================

System.IO.Directory = function () { };
System.Type.RegisterClass("System.IO.Directory");

System.IO.Directory.CreateDirectory = function (path) {
	/// <summary>
	/// Creates all directories and subdirectories as specified by path.
	/// </summary>
	/// <param type="String" type="path">The directory path to create.</param>
	/// <returns type"">A folder info as specified by path.</returns>
	/// <remarks>
	/// ASP GetFolder Method
	/// http://msdn2.microsoft.com/en-us/library/f1xtf7ta.aspx
	/// http://msdn2.microsoft.com/en-us/library/bkx696eh.aspx
	/// File Object Properties:
	/// Attributes, DateCreated, DateLastAccessed, DateLastModified
	/// Drive, Name, ParentFolder, Path, ShortName, ShortPath, Size, Type
	/// </remarks>
	// Create object to manipulate folders and files.
	var folderInfo = null;
	var fso = new ActiveXObject("Scripting.FileSystemObject");
	var pathPhysical = new String(path);
	// If folder path is not physical then...
	if (pathPhysical.indexOf(":") === -1) {
		// Convert path to Physical.
		pathPhysical = Server.MapPath(path);
	}
	// Check if folder exist and create it if not.
	var arrPath = new Array;
	var regex = new RegExp("\\\\", "g");
	arrPath = pathPhysical.split(regex);
	var pathTemp = "";
	// Route thru folders of path.
	for (var i = 0; i < arrPath.length; i++) {
		// Get folder name;
		var folderName = arrPath[i];
		if (i > 0) pathTemp += "\\";
		pathTemp += folderName;
		// If this is not root folder (drive letter) then...
		if (i > 0) {
			// If this folder does not exist then...
			if (!fso.FolderExists(pathTemp)) {
				// Create this folder.
				Trace.Write("Create folder: " + pathTemp);
				try {
					fso.CreateFolder(pathTemp);
					folderInfo = fso.GetFolder(pathTemp);
				} catch (ex) {
					//Trace.Write("Failed to create folder.");
				}
			}
		}
	}
	return folderInfo;
};

System.IO.Directory.GetItems = function (path, searchPattern, typeIsFiles) {
	var fso = new ActiveXObject("Scripting.FileSystemObject");
	var f = fso.GetFolder(path);
	var fc = new Enumerator(typeIsFiles ? f.Files : f.SubFolders);
	//Trace.Write(f.Name);
	var items = [];
	var pattern = "";
	pattern = searchPattern ? searchPattern : ".*";
	var regExp = new RegExp(pattern);
	var name = "";
	for (; !fc.atEnd(); fc.moveNext()) {
		// Get name from file object;
		var item = fc.item();
		var isMatch = item.Name.match(regExp) !== null;
		if (isMatch) items.push(item);
	}
	return items;
};


System.IO.Directory.GetFiles = function (path, searchPattern) {
	/// <summary>
	/// Returns the names of files in the specified directory that match the specified
	/// search pattern.
	/// </summary>
	/// <param type="String" name="path">The directory to search.</param>
	/// <param type="String" name="path">The search string (Regular Expression) to match against the names of files in path.</param>
	/// <returns type="String[]">
	/// A String array containing the names of files in the specified directory that
	/// match the specified search pattern. File names include the full path.
	/// </returns>
	/// <remarks>
	/// http://msdn2.microsoft.com/en-us/library/hww8txat.aspx
	/// </remarks>
	return System.IO.Directory.GetItems(path, searchPattern, true);
};

System.IO.Directory.GetDirectories = function (path, searchPattern) {
	/// <summary>
	/// Returns the names of directories in the specified directory that match the specified
	/// search pattern.
	/// </summary>
	return System.IO.Directory.GetItems(path, searchPattern, false);
};

//=============================================================================
// Namespaces
//-----------------------------------------------------------------------------

System.IO.File = function () { };
System.Type.RegisterClass("System.IO.File");

System.IO.File.ReadAllText = function (path) {
	/// <summary>
	/// Opens a text file, reads all lines of the file, and then closes the file.
	/// </summary>
	/// <param name="path">The file to open for reading.</param>
	/// <returns>A string array containing all lines of the file.</returns>
	var useScripting = true;
	if (useScripting) {
		var ForReading = 1, ForWriting = 2, ForAppending = 8;
		var TristateUseDefault = -2; // Opens the file using the system default.
		var TristateTrue = -1; // Opens the file as Unicode.
		var TristateFalse = 0; // Opens the file as ASCII.
		var fdo = new ActiveXObject("Scripting.FileSystemObject");
		var textStream = fso.OpenTextFile(path, ForReading);
		var content = "";
		content = textStream.ReadAll();
		textStream.Close();
		textStream = null;
		return content;
	} else {
		// Read Binary.
		var adTypeBinary = 1, adTypeText = 2, adSaveCreateOverWrite = 2;
		// Create Stream object.
		var binaryStream = Server.CreateObject("ADODB.Stream");
		// Specify stream type - we want To get binary data.
		binaryStream.Type = adTypeBinary;
		// Open the stream.
		binaryStream.Open();
		// Load the file data from disk To stream object.
		binaryStream.LoadFromFile(path);
		// Open the stream And get binary data from the object.
		var results = binaryStream.Read();
		binaryStream = null;
		return results;
	}
};

System.IO.File.WriteAllText = function (path, contents, encoding) {
	/// <summary>
	/// Creates a new file, writes the specified string array to the file using the
	/// specified encoding, and then closes the file. If the target file already
	/// exists, it is overwritten.
	/// </summary>
	/// <param type="String" name="path">The file to write to.</param>
	/// <param type="String" name="contents">The string to write to the file.</param>
	/// <param type="String" name="encoding">An encoding (CharSet) to apply.</param>
	/// <returns>void</returns>
	// If type of contents is String then...
	if (typeof contents === "string") {
		var ForReading = 1, ForWriting = 2, ForAppending = 8;
		var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
		var textStream = fileSystem.CreateTextFile(path);
		textStream.Write(contents);
		textStream.Close();
		textStream = null;
	} else {
		var adTypeBinary = 1, adTypeText = 2, adSaveCreateOverWrite = 2;
		// Create Stream object
		var binaryStream = Server.CreateObject("ADODB.Stream");
		// Specify stream type - we want To save text/string data.
		binaryStream.Type = adTypeBinary;
		// Specify charset For the source text (unicode) data.
		if (encoding !== null) binaryStream.CharSet = encoding;
		// Open the stream.
		binaryStream.Open();
		// Write binary data To the object.
		try { binaryStream.Write(contents); } catch (ex) { /* */ }
		// Save binary data To disk.
		//Response.Write("valFilePath = "+valFilePath+"<br />");
		binaryStream.SaveToFile(path, adSaveCreateOverWrite);
		binaryStream = null;
	}
};

System.IO.File.Delete = function (path, force) {
	/// <summary>
	/// Deletes the specified file.
	/// </summary>
	/// <param type="String" name="path">The name of the file to be deleted.</param>
	/// <returns>void</returns>
	var fso = new ActiveXObject("Scripting.FileSystemObject");
	force = force === true;
	return fso.DeleteFile(path, force);
};

System.IO.File.Exists = function (path) {
	/// <summary>
	/// Determines whether the specified file exists.
	/// </summary>
	/// <param name="path">The file to check.</param>
	/// <returns>True if file exists; otherwise false.</returns>
	var fso = new ActiveXObject("Scripting.FileSystemObject");
	return fso.FileExists(path);
};

System.IO.File.Move = function (sourceFileName, destFileName) {
	/// <summary>
	/// Moves a specified file to a new location, providing the option to specify
	/// a new file name.
	/// </summary>
	/// <param type="String" name="sourceFileName">The name of the file to move.</param>
	/// <param type="String" name="destFileName">The new path for the file.</param>
	/// <returns>void</returns>
	var fso = new ActiveXObject("Scripting.FileSystemObject");
	return fso.MoveFile(sourceFileName, destFileName);
};

//=============================================================================
// Path
//-----------------------------------------------------------------------------

System.IO.Path = function () { };
System.Type.RegisterClass("System.IO.Path");

System.IO.Path = function () {
	/// <summary>
	/// Performs operations on System.String instances that contain file or directory
	/// path information. These operations are performed in a cross-platform manner.
	/// </summary>
	/// <remarks>
	/// Converted from C# System.IO.Path.
	/// </remarks>
	//---------------------------------------------------------
	// Declare public properties
	this.AltDirectorySeparatorChar = '/';
	this.DirectorySeparatorChar = '\\';
	this.ERROR_SUCCESS = 0;
	this.InternalInvalidPathChars = ['"', '<', '>', '|', '\0', '\b', '\x0010', '\x0011', '\x0012', '\x0014', '\x0015', '\x0016', '\x0017', '\x0018', '\x0019'];
	this.InvalidPathChars = ['"', '<', '>', '|', '\0', '\b', '\x0010', '\x0011', '\x0012', '\x0014', '\x0015', '\x0016', '\x0017', '\x0018', '\x0019'];
	this.MAX_DIRECTORY_PATH = 0xf8;
	this.MAX_PATH = 260;
	this.PathSeparator = ';';
	this.VolumeSeparatorChar = ':';
	//---------------------------------------------------------
	this.CheckInvalidPathChars = function (path) {
		var iipc = new RegExp("[" + this.InternalInvalidPathChars.toString().replace(",", "", "g") + "]");
		var isInvalid = path.match(iipc) ? true : false;
		return isInvalid;
	};
	//---------------------------------------------------------
	this.FixupPath = function (path) {
		//var newPath = "";
		//int errorCode = nGetFullPathHelper(path, InternalInvalidPathChars, string.WhitespaceChars, DirectorySeparatorChar, AltDirectorySeparatorChar, VolumeSeparatorChar, false, out newPath);
		//if (errorCode != 0)
		//{
		//    __Error.WinIOError(errorCode, path);
		//}
		//return newPath;
		return path;
	};
	//---------------------------------------------------------
	this.IsDirectorySeparator = function (c) {
		return c === this.AltDirectorySeparatorChar ||
			c === this.DirectorySeparatorChar;
	};
	//---------------------------------------------------------
	this.GetRootLength = function (path) {
		if (!this.CheckInvalidPathChars(path)) {
			var num = 0;
			var length = path.length;
			if (length >= 1 && this.IsDirectorySeparator(path.charAt(0))) {
				num = 1;
				if (length >= 2 && this.IsDirectorySeparator(path.charAt(1))) {
					num = 2;
					var num3 = 2;
					while (num < length && (path.charAt(num) !== this.DirectorySeparatorChar && path.charAt(num) !== this.AltDirectorySeparatorChar || --num3 > 0)) {
						num++;
					}
				}
				return num;
			}
			if (length >= 2 && path.charAt(1) === this.VolumeSeparatorChar) {
				num = 2;
				if (length >= 3 && this.IsDirectorySeparator(path.charAt(2))) {
					num++;
				}
			}
			return num;
		}
	};
	//---------------------------------------------------------
	this.GetDirectoryName = function (path) {
		/// <summary>
		/// Returns the directory information for the specified path string.
		/// </summary>
		/// <param type="String" type="path">The path of a file or directory.</param>
		/// <returns type="String">
		///  A System.String containing directory information for path, or null if path
		///  denotes a root directory, is the empty string (""), or is null
		/// </returns>
		if (path !== null) {
			var isInvalid = this.CheckInvalidPathChars(path);
			path = this.FixupPath(path);
			var rootLength = this.GetRootLength(path);
			if (path.length > rootLength) {
				var length = path.length;
				if (length === rootLength) {
					return null;
				}
				while (length > rootLength && path.charAt(--length) !== this.DirectorySeparatorChar && path.charAt(length) !== this.AltDirectorySeparatorChar) {
					/* */
				}
				return path.substr(0, length);
			}
		}
		return null;
	};
	//---------------------------------------------------------
	this.GetExtension = function (path) {
		/// <summary>
		/// Returns the extension of the specified path string.
		/// </summary>
		/// <param type="String" type="path">The path of a file or directory.</param>
		/// <returns type="String">
		/// A System.String containing the extension of the specified path (including
		/// the ".")
		/// </returns>
		if (path !== null) {
			if (!this.CheckInvalidPathChars(path)) {
				var length = path.length;
				var startIndex = length;
				while (--startIndex >= 0) {
					var ch = path.charAt(startIndex);
					if (ch === '.') {
						if (startIndex !== length - 1) {
							return path.substr(startIndex, length - startIndex);
						}
						return "";
					}
					if (ch === this.DirectorySeparatorChar || ch === this.AltDirectorySeparatorChar || ch === this.VolumeSeparatorChar) {
						break;
					}
				}
				return "";
			}
		}
	};
	//---------------------------------------------------------
	this.GetFileName = function (path) {
		/// <summary>
		/// Returns the file name and extension of the specified path string.
		/// </summary>
		/// <param type="String" type="path">The path of a file or directory.</param>
		/// <returns type="String">
		/// A System.String consisting of the characters after the last directory character
		/// in path. If the last character of path is a directory or volume separator
		/// character, this method returns System.String.Empty. If path is null, this
		/// method returns null.
		/// </returns>
		if (path !== null) {
			if (!this.CheckInvalidPathChars(path)) {
				var length = path.length;
				var num2 = length;
				while (--num2 >= 0) {
					var ch = path.charAt(num2);
					if (ch === this.DirectorySeparatorChar || ch === this.AltDirectorySeparatorChar || ch === this.VolumeSeparatorChar) {
						return path.substr(num2 + 1, length - num2 - 1);
					}
				}
			}
		}
		return path;
	};
	//---------------------------------------------------------
	this.GetFileNameWithoutExtension = function (path) {
		/// <summary>
		/// Returns the file name of the specified path string without the extension.
		/// </summary>
		/// <param type="String" type="path">The path of a file or directory.</param>
		/// <returns type="String">
		/// A System.String containing the string returned by System.IO.Path.GetFileName(System.String),
		/// minus the last period (.) and all characters following it.
		/// </returns>
		path = this.GetFileName(path);
		if (path === null) {
			return null;
		}
		var length = path.lastIndexOf('.');
		if (length === -1) {
			return path;
		}
		return path.substr(0, length);
	};
	//---------------------------------------------------------
	this.HasExtension = function (path) {
		/// <summary>
		/// Determines whether a path includes a file name extension.
		/// </summary>
		/// <param type="String" type="path">The path of a file or directory.</param>
		/// <returns type="Bool">
		/// true if the characters that follow the last directory separator (\\ or /)
		/// or volume separator (:) in the path include a period (.) followed by one
		/// or more characters; otherwise, false.
		/// </returns>
		if (path !== null) {
			if (!this.CheckInvalidPathChars(path)) {
				var length = path.length;
				while (--length >= 0) {
					var ch = path.charAt(length);
					if (ch === '.') {
						return length !== path.length - 1;
					}
					if (ch === this.DirectorySeparatorChar || ch === this.AltDirectorySeparatorChar || ch === this.VolumeSeparatorChar) {
						break;
					}
				}
			}
		}
		return false;
	};
	//---------------------------------------------------------
	this.GetPathRoot = function (path) {
		if (path === null) {
			return null;
		}
		path = this.FixupPath(path);
		return path.substr(0, this.GetRootLength(path));
	};
	//---------------------------------------------------------
	this.IsPathRooted = function (path) {
		/// <summary>
		/// Gets a value indicating whether the specified path string contains absolute
		/// or relative path information.
		/// </summary>
		/// <param type="String" type="path">The path of a file or directory.</param>
		/// <returns type="Bool">
		/// true if path contains an absolute path; otherwise, false.
		/// </returns>
		if (path !== null) {
			if (!this.CheckInvalidPathChars(path)) {
				var length = path.length;
				if (length >= 1 && (path.charAt(0) === this.DirectorySeparatorChar || path.charAt(0) === this.AltDirectorySeparatorChar) || length >= 2 && path.charAt(1) === this.VolumeSeparatorChar) {
					return true;
				}
			}
		}
		return false;
	};
	//---------------------------------------------------------
	this.Combine = function (path1, path2) {
		/// <summary>
		/// Combines two path strings.
		/// </summary>
		/// <param type="String" type="path1">The first path.</param>
		/// <param type="String" type="path2">The second path.</param>
		/// <returns type="Bool">
		/// A string containing the combined paths. If one of the specified paths is
		/// a zero-length string, this method returns the other path. If path2 contains
		/// an absolute path, this method returns path2.
		/// </returns>
		if (path1 !== null && path2 !== null) {
			if (!(this.CheckInvalidPathChars(path1) || this.CheckInvalidPathChars(path2))) {
				if (path2.length === 0) {
					return path1;
				}
				if (path1.length === 0) {
					return path2;
				}
				if (this.IsPathRooted(path2)) {
					return path2;
				}
				var ch = path1.charAt(path1.length - 1);
				if (ch !== this.DirectorySeparatorChar && ch !== this.AltDirectorySeparatorChar && ch !== this.VolumeSeparatorChar) {
					return path1 + this.DirectorySeparatorChar + path2;
				}
				return path1 + path2;
			}
		}
	};
	//---------------------------------------------------------
	this.Initialize = function () {
	};
	this.Initialize.apply(this, arguments);
};

//=============================================================================
// CLASS: System.IO.Stream
//-----------------------------------------------------------------------------

System.IO.Stream = function () {
	/// <summary>
	/// Initializes a new instance of the <see cref="T:System.IO.Stream" /> class. 
	/// </summary>
	/// <param name="buffer">The array of unsigned bytes from which to create the current stream.</param>
	/// <remarks>Created for encryption. System.IO.FileStream can be created with same functions.
	/// in order to encrypt/decrypt directry to/from file.
	/// </remarks>
	//---------------------------------------------------------
	// Public Properties
	this.Buffer = [];
	// The length of the stream in bytes
	this.Capacity = 0;
	// Number of bytes allocated for this stream.
	this.Length = 0;
	// Current position within the stream.
	this.Position = 0;
	// Gets a value indicating whether the current stream supports writing.
	this.CanWrite = true;
	this.CanRead = true;
	//---------------------------------------------------------
	// Private Properties.
	var isServerSide = false;
	var stream = null;
	var adTypeBinary = 1, adTypeText = 2, adSaveCreateOverWrite = 2;
	//---------------------------------------------------------
	this.Read = function (buffer, offset, count) {
		/// <summary>
		/// Reads a block of bytes from the current stream and writes the data to 'buffer'.
		/// <symmary>
		/// <param name="buffer">The buffer to read data to.</param>
		/// <param name="offset">The byte offset in buffer at which to begin reading.</param>
		/// <param name="count">The maximum number of bytes to read.</param>
		/// <returns> The total number of bytes read into the buffer. This can be less than the number of bytes requested if that many bytes are not currently available, or zero (0) if the end of the stream has been reached.</returns>
		if (offset + count > buffer.length) {
			throw new System.Exception("The sum of 'offset' and 'count' is larger than the 'buffer' length.");
		}
		var num = 0;
		if (isServerSide) {
			/* */
		} else {
			num = Math.min(count, this.Buffer.length - this.Position);
			for (var i = 0; i < num; i++) {
				buffer[offset + i] = this.Buffer[this.Position + i];
			}
			this.Position += num;
		}
		return num;
	};
	//---------------------------------------------------------
	this.ToArray = function () {
		/// <summary>
		/// Writes the stream contents to a byte array, regardless of the System.IO.MemoryStream.Position
		///  property.
		/// <symmary>
		/// <returns>A new byte array.</returns>
		var array = [];
		if (isServerSide) {
			/* */
		} else {
			array = this.Buffer.slice(0, this.Buffer.length);
		}
		return array;
	};
	//---------------------------------------------------------
	this.Flush = function () {
		/// <summary>
		/// Flush stream.
		/// <symmary>
		if (isServerSide) {
			/* */
		} else {
			/* */
		}
	};
	//---------------------------------------------------------
	this.Write = function (buffer, offset, count) {
		/// <summary>
		/// Writes a block of bytes to the current stream using data read from 'buffer'.
		/// <symmary>
		/// <param name="buffer">The buffer to write data from.</param>
		/// <param name="offset">The byte offset in buffer at which to begin writing from.</param>
		/// <param name="count">The maximum number of bytes to write.</param>
		if (offset + count > buffer.length) {
			throw new System.Exception("The sum of 'offset' and 'count' is greater than the 'buffer' length.");
		}
		if (isServerSide) {
			//stream.Write(contents);
		} else {

			for (var i = 0; i < count; i++) {
				this.Buffer[this.Position + i] = buffer[offset + i];
			}
			this.Position += count;
		}
	};
	//---------------------------------------------------------
	this.WriteTo = function (stream) {
		/// <summary>
		/// Writes the entire contents of this memory stream to another stream.
		/// <summary>
		/// <param name="stream">The stream to write this memory stream to.</param>
		if (isServerSide) {
			/* */
		} else {
			stream.Write(this.Buffer, 0, this.Buffer.length);
		}
	};
	//---------------------------------------------------------
	this.Close = function () {
		/// <summary>
		/// Closes the current stream and releases any resources (such as sockets and file handles) associated with the current stream.
		/// </summary>
		if (isServerSide) {
			stream.Close();
		} else {
			this.Dispose(true);
		}
	};
	//---------------------------------------------------------
	this.CopyTo = function (destination, bufferSize) {
		if (arguments.length === 1) bufferSize = 0x1000;
		var num = 0;
		var buffer = new System.Byte(bufferSize);
		while ((num = this.Read(buffer, 0, buffer.length)) !== 0) {
			destination.Write(buffer, 0, num);
		}
	};
	//---------------------------------------------------------
	this.Dispose = function () {
		//delete this.Buffer;
		//delete this.Stream;
		if (arguments.length === 0) this.Dispose_0();
		if (arguments.length === 1) this.Dispose_1(true);
	};
	this.Dispose_0 = function () {
		this.Close();
	};
	this.Dispose_1 = function (disposing) {
	};
	//---------------------------------------------------------
	this.Initialize = function () {
		// isServerSide = (typeof(Response) == "object");
		if (isServerSide) {
			// Create Stream object
			stream = Server.CreateObject("ADODB.Stream");
			// Specify stream type - we want To save text/string data.
			stream.Type = adTypeBinary;
			// Open the stream.
			stream.Open();
		} else {
			if (arguments[0]) {
				var buffer = arguments[0];
				this.Write(buffer, 0, buffer.length);
				this.Capacity = buffer.length;
				this.Length = buffer.length;
				this.Position = 0;
			}
		}
	};
	this.Initialize.apply(this, arguments);
};
System.Type.RegisterClass("System.IO.Stream");

//=============================================================================
// CLASS: System.IO.MemoryStream
//-----------------------------------------------------------------------------

System.IO.MemoryStream = function (buffer) {
	/// <summary>
	/// Initializes a new instance of the System.IO.MemoryStream class with an expandable
	/// capacity initialized to zero.
	/// </summary>
	var base = System.Type.Inherits(this, new System.IO.Stream());
	this.Initialize.apply(this, arguments);
};
System.Type.RegisterClass("System.IO.MemoryStream");

//=============================================================================
// CLASS: System.IO.MemoryStream
//-----------------------------------------------------------------------------

System.IO.InvalidDataException = function (message) {
	/// <summary>The exception that is thrown when a data stream is in an invalid format.</summary>
	/// <param name="message"" type="String" optional="true" mayBeNull="true">The error message that explains the reason for the exception.</param>
	var base = new System.Type.Inherits(this, new System.Exception());
	this.message = "";
	this.message += message ? message : "Invalid Data.";
	var err = Error.create(this.message, { name: this.GetType().FullName });
	err.popStackFrame();
	return err;
};
System.Type.RegisterClass("System.IO.InvalidDataException");

//==============================================================================
// END
//------------------------------------------------------------------------------
