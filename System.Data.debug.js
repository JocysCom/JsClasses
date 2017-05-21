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
//		<RootNamespace>System.Data</RootNamespace>
// <PropertyGroup>
//-----------------------------------------------------------------------------
System.Type.RegisterNamespace("System.Data.Ado");
//=============================================================================

//=============================================================================
// Include Constants: System.Data.Ado
//--------------------------------------------------------------------
// Microsoft ADO
// Copyright (c) 1996-1998 Microsoft Corporation.
// ADO constants include file for JavaScript
//--------------------------------------------------------------------

// http://msdn.microsoft.com/library/en-us/ado270/htm/mdmscadoapireference.asp
// http://msdn.microsoft.com/library/en-us/ado270/htm/mdmscadoenumerations.asp

System.Data.Ado.EnumeratedConstants = function () {
	//---------------------------------------------------------
	// METHOD: GetNameByValue
	//---------------------------------------------------------
	this.GetNameByValue = function (category, value) {
		var name = "";
		for (var property in this[category]) {
			if (this[category][property] == value) {
				name = "AdoEnums." + category + "." + property;
				break;
			}
		}
		return name;
	}
	//---------------------------------------------------------
	// PARAMETERS:
	//---------------------------------------------------------
	//---- ADCPROP_ASYNCTHREADPRIORITY_ENUM Values ----
	this.AdcPropAsyncThreadPriority = {
		_prefix: "adPriority",
		Lowest: 1,
		BelowNormal: 2,
		Normal: 3,
		AboveNormal: 4,
		Highest: 5
	}
	//---- ADCPROP_AUTORECALC_ENUM Values ----
	this.AdcPropAutoRecalc = {
		_prefix: "adRecalc",
		UpFront: 0,
		Always: 1
	}
	//---- ADCPROP_UPDATECRITERIA_ENUM Values ----
	this.AdcPropUpdateCriteria = {
		_prefix: "adCriteria",
		Key: 0,
		AllCols: 1,
		UpdCols: 2,
		TimeStamp: 3
	}
	//---- ADCPROP_UPDATERESYNC_ENUM Values ----
	this.AdcPropUpdateResync = {
		_prefix: "adResync",
		None: 0,
		AutoIncrement: 1,
		Conflicts: 2,
		Updates: 4,
		Inserts: 8,
		All: 15
	}
	//---- AffectEnum Values ----
	this.Affect = {
		_prefix: "adAffect",
		Current: 1,
		Group: 2,
		All: 3,
		AllChapters: 4
	}
	//---- BookmarkEnum Values ----
	this.Bookmark = {
		_prefix: "adBookmark",
		Current: 0,
		First: 1,
		Last: 2
	}
	//---- CommandTypeEnum Values ----
	this.CommandType = {
		_prefix: "adCmd",
		Unspecified: -1,
		Text: 1,
		Table: 2,
		StoredProc: 4,
		Unknown: 8,
		File: 256,
		TableDirect: 512
	}
	//---- CompareEnum Values ----
	this.Compare = {
		_prefix: "adCompare",
		LessThan: 0,
		Equal: 1,
		GreaterThan: 2,
		NotEqual: 3,
		NotComparable: 4
	}
	//---- ConnectModeEnum Values ----
	this.ConnectMode = {
		_prefix: "adMode",
		Unknown: 0,
		Read: 1,
		Write: 2,
		ReadWrite: 3,
		ShareDenyRead: 4,
		ShareDenyWrite: 8,
		ShareExclusive: 0xc,
		ShareDenyNone: 0x10,
		Recursive: 0x400000
	}
	//---- ConnectOptionEnum Values ----
	this.ConnectOption = {
		_prefix: "ad",
		ConnectUnspecified: -1,
		AsyncConnect: 16
	}
	//---- ConnectPromptEnum Values ----
	this.ConnectPrompt = {
		_prefix: "adPrompt",
		PromptAlways: 1,
		PromptComplete: 2,
		PromptCompleteRequired: 3,
		PromptNever: 4
	}
	//---- CopyRecordOptionsEnum Values ----
	this.CopyRecordOptions = {
		_prefix: "adCopy",
		Unspecified: -1,
		OverWrite: 1,
		AllowEmulation: 4,
		NonRecursive: 2
	}
	//---- CursorLocationEnum Values ----
	this.CursorLocation = {
		_prefix: "adUse",
		None: 1,
		Server: 2,
		Client: 3
	}
	//---- CursorOptionEnum Values ----
	this.CursorOption = {
		_prefix: "ad",
		HoldRecords: 0x00000100,
		MovePrevious: 0x00000200,
		AddNew: 0x01000400,
		Delete: 0x01000800,
		Update: 0x01008000,
		Bookmark: 0x00002000,
		ApproxPosition: 0x00004000,
		UpdateBatch: 0x00010000,
		Resync: 0x00020000,
		Notify: 0x00040000,
		Find: 0x00080000,
		Seek: 0x00400000,
		Index: 0x00800000
	}
	// ---- CursorTypeEnum Values ----
	this.CursorType = {
		_prefix: "adOpen",
		ForwardOnly: 0,
		Keyset: 1,
		Dynamic: 2,
		Static: 3,
		Unspecified: -1
	}
	//---- DataTypeEnum Values ----
	this.DataType = {
		_prefix: "ad",
		Empty: 0,
		TinyInt: 16,
		SmallInt: 2,
		Integer: 3,
		BigInt: 20,
		UnsignedTinyInt: 17,
		UnsignedSmallInt: 18,
		UnsignedInt: 19,
		UnsignedBigInt: 21,
		Single: 4,
		Double: 5,
		Currency: 6,
		Decimal: 14,
		Numeric: 131,
		Boolean: 11,
		Error: 10,
		UserDefined: 132,
		Variant: 12,
		IDispatch: 9,
		IUnknown: 13,
		Guid: 72,
		Date: 7,
		DBDate: 133,
		DBTime: 134,
		DBTimeStamp: 135,
		BSTR: 8,
		Char: 129,
		VarChar: 200,
		LongVarChar: 201,
		WChar: 130,
		VarWChar: 202,
		LongVarWChar: 203,
		Binary: 128,
		VarBinary: 204,
		LongVarBinary: 205,
		Chapter: 136,
		FileTime: 64,
		PropVariant: 138,
		VarNumeric: 139,
		Array: 0x2000
	}
	//---- EditModeEnum Values ----
	this.EditMode = {
		_prefix: "adEdit",
		None: 0x0000,
		InProgress: 0x0001,
		Add: 0x0002,
		Delete: 0x0004
	}
	//---- ErrorValueEnum Values ----
	this.ErrorValue = {
		_prefix: "adErr",
		ProviderFailed: 0xbb8,
		InvalidArgument: 0xbb9,
		OpeningFile: 0xbba,
		ReadFile: 0xbbb,
		WriteFile: 0xbbc,
		NoCurrentRecord: 0xbcd,
		IllegalOperation: 0xc93,
		CantChangeProvider: 0xc94,
		InTransaction: 0xcae,
		FeatureNotAvailable: 0xcb3,
		ItemNotFound: 0xcc1,
		ObjectInCollection: 0xd27,
		ObjectNotSet: 0xd5c,
		DataConversion: 0xd5d,
		ObjectClosed: 0xe78,
		ObjectOpen: 0xe79,
		ProviderNotFound: 0xe7a,
		BoundToCommand: 0xe7b,
		InvalidParamInfo: 0xe7c,
		InvalidConnection: 0xe7d,
		NotReentrant: 0xe7e,
		StillExecuting: 0xe7f,
		OperationCancelled: 0xe80,
		StillConnecting: 0xe81,
		InvalidTransaction: 0xe82,
		UnsafeOperation: 0xe84,
		IntegrityViolation: 0xe87,
		PermissionDenied: 0xe88,
		DataOverflow: 0xe89,
		SchemaViolation: 0xe8a,
		SignMismatch: 0xe8b,
		CantConvertvalue: 0xe8c,
		CantCreate: 0xe8d,
		ColumnNotOnThisRow: 0xe8e,
		URLIntegrViolSetColumns: 0xe8f,
		URLDoesNotExist: 0xe8f,
		TreePermissionDenied: 0xe90,
		InvalidURL: 0xe91,
		ResourceLocked: 0xe92,
		ResourceExists: 0xe93,
		CannotComplete: 0xe94,
		VolumeNotFound: 0xe95,
		OutOfSpace: 0xe96,
		ResourceOutOfScope: 0xe97,
		Unavailable: 0xe98,
		URLNamedRowDoesNotExist: 0xe99,
		DelResOutOfScope: 0xe9a,
		PropInvalidColumn: 0xe9b,
		PropInvalidOption: 0xe9c,
		PropInvalidValue: 0xe9d,
		PropConflicting: 0xe9e,
		PropNotAllSettable: 0xe9f,
		PropNotSet: 0xea0,
		PropNotSettable: 0xea1,
		PropNotSupported: 0xea2,
		CatalogNotSet: 0xea3,
		CantChangeConnection: 0xea4,
		FieldsUpdateFailed: 0xea5,
		DenyNotSupported: 0xea6,
		DenyTypeNotSupported: 0xea7,
		ProviderNotSpecified: 0xea9,
		ConnectionStringTooLong: 0xeaa
		//For internal use only. Don't use.
		//wrnSecurityDialog : 0xe85,
		//wrnSecurityDialogHeader : 0xe86,

	}
	//---- EventReasonEnum Values ----
	this.EventReason = {
		_prefix: "adRsn",
		AddNew: 1,
		Delete: 2,
		Update: 3,
		UndoUpdate: 4,
		UndoAddNew: 5,
		UndoDelete: 6,
		Requery: 7,
		Resynch: 8,
		Close: 9,
		Move: 10,
		FirstChange: 11,
		MoveFirst: 12,
		MoveNext: 13,
		MovePrevious: 14,
		MoveLast: 15
	}
	//---- EventStatusEnum Values ----
	this.EventStatus = {
		_prefix: "adStatus",
		OK: 0x0000001,
		ErrorsOccurred: 0x0000002,
		CantDeny: 0x0000003,
		Cancel: 0x0000004,
		UnwantedEvent: 0x0000005
	}
	//---- ExecuteOptionEnum Values ----
	this.ExecuteOption = {
		_prefix: "ad",
		AsyncExecute: 0x00000010,
		AsyncFetch: 0x00000020,
		AsyncFetchNonBlocking: 0x00000040,
		ExecuteNoRecords: 0x00000080,
		ExecuteStream: 0x00000400,
		ExecuteRecord: 512,
		OptionUnspecified: -1
	}
	//---- FieldEnum Values ----
	this.Field = {
		_prefix: "ad",
		DefaultStream: -1,
		RecordURL: -2
	}
	//---- FieldAttributeEnum Values ----
	this.FieldAttribute = {
		_prefix: "adFld",
		MayDefer: 0x00000002,
		Updatable: 0x00000004,
		UnknownUpdatable: 0x00000008,
		Fixed: 0x00000010,
		IsNullable: 0x00000020,
		MayBeNull: 0x00000040,
		Long: 0x00000080,
		RowID: 0x00000100,
		RowVersion: 0x00000200,
		CacheDeferred: 0x00001000,
		IsChapter: 0x00002000,
		NegativeScale: 0x00004000,
		KeyColumn: 0x00008000,
		IsRowURL: 0x00010000,
		IsDefaultStream: 0x00020000,
		IsCollection: 0x00040000
	}
	//---- FieldStatusEnum Values ----
	this.FieldStatus = {
		_prefix: "adField",
		OK: 0,
		CantConvertValue: 2,
		IsNull: 3,
		Truncated: 4,
		SignMismatch: 5,
		DataOverflow: 6,
		CantCreate: 7,
		Unavailable: 8,
		PermissionDenied: 9,
		IntegrityViolation: 10,
		SchemaViolation: 11,
		BadStatus: 12,
		Default: 13,
		Ignore: 15,
		DoesNotExist: 16,
		InvalidURL: 17,
		ResourceLocked: 18,
		ResourceExists: 19,
		CannotComplete: 20,
		VolumeNotFound: 21,
		OutOfSpace: 22,
		CannotDeleteSource: 23,
		ReadOnly: 24,
		ResourceOutOfScope: 25,
		AlreadyExists: 26,
		PendingInsert: 0x10000,
		PendingDelete: 0x20000,
		PendingChange: 0x40000,
		PendingUnknown: 0x80000,
		PendingUnknownDelete: 0x100000
	}
	//---- FilterGroupEnum Values ----
	this.FilterGroup = {
		_prefix: "adFilter",
		None: 0,
		PendingRecords: 1,
		AffectedRecords: 2,
		FetchedRecords: 3,
		ConflictingRecords: 5
	}
	//---- GetRowsOptionEnum Values ----
	this.GetRowsOption = {
		_prefix: "adGetRows",
		Rest: -1
	}
	//---- IsolationLevelEnum Values ----
	this.IsolationLevel = {
		_prefix: "adXact",
		Unspecified: 0xffffffff,
		Chaos: 0x00000010,
		ReadUncommitted: 0x00000100,
		Browse: 0x00000100,
		CursorStability: 0x00001000,
		ReadCommitted: 0x00001000,
		RepeatableRead: 0x00010000,
		Serializable: 0x00100000,
		Isolated: 0x00100000
	}
	//---- LineSeparatorsEnum Values ----
	this.LineSeparators = {
		_prefix: "ad",
		CRLF: -1,
		LF: 10,
		CR: 13
	}
	//---- LockTypeEnum Values ----
	this.LockType = {
		_prefix: "adLock",
		Unspecified: -1,
		ReadOnly: 1,
		Pessimistic: 2,
		Optimistic: 3,
		BatchOptimistic: 4
	}
	//---- MarshalOptionsEnum Values ----
	this.MarshalOptions = {
		_prefix: "adMarshal",
		All: 0,
		ModifiedOnly: 1
	}
	//---- MoveRecordOptionsEnum Values ----
	this.MoveRecordOption = {
		_prefix: "adMove",
		Unspecified: -1,
		OverWrite: 1,
		DontUpdateLinks: 2,
		AllowEmulation: 4
	}
	//---- ObjectStateEnum Values ----
	this.ObjectState = {
		_prefix: "adState",
		Closed: 0,
		Open: 1,
		Connecting: 2,
		Executing: 4,
		Fetching: 8
	}
	//---- ParameterAttributesEnum Values ----
	this.ParameterAttributes = {
		_prefix: "adParam",
		Signed: 0x0010,
		Nullable: 0x0040,
		Long: 0x0080
	}
	//---- ParameterDirectionEnum Values ----
	this.ParameterDirection = {
		_prefix: "adParam",
		Unknown: 0,
		Input: 1,
		Output: 2,
		InputOutput: 3,
		ReturnValue: 4
	}
	//---- PersistFormatEnum Values ----
	this.PersistFormat = {
		_prefix: "adPersist",
		ADTG: 0,
		ADO: 1,
		XML: 1,
		ProviderSpecific: 2
	}
	//---- PositionEnum Values ----
	this.Position = {
		_prefix: "adPos",
		Unknown: -1,
		BOF: -2,
		EOF: -3
	}
	//---- PropertyAttributesEnum Values ----
	this.PropertyAttributes = {
		_prefix: "adProp",
		NotSupported: 0x0000,
		Required: 0x0001,
		Optional: 0x0002,
		Read: 0x0200,
		Write: 0x0400
	}
	//---- RecordCreateOptionsEnum Values ----
	this.RecordCreateOptions = {
		_prefix: "ad",
		FailIfNotExists: -1,
		CreateNonCollection: 0,
		CreateCollection: 0x00002000,
		OpenIfExists: 0x02000000,
		CreateOverwrite: 0x04000000,
		CreateStructDoc: 0x80000000
	}
	//---- RecordOpenOptionsEnum Values ----
	this.RecordOpenOptions = {
		_prefix: "ad",
		OpenRecordUnspecified: -1,
		OpenAsync: 0x00001000,
		DelayFetchStream: 0x00004000,
		OpenExecuteCommand: 0x00010000,
		DelayFetchFields: 0x00008000,
		OpenOutput: 0x00800000
	}
	//---- RecordStatusEnum Values ----
	this.RecordStatus = {
		_prefix: "adRec",
		OK: 0x0000000,
		New: 0x0000001,
		Modified: 0x0000002,
		Deleted: 0x0000004,
		Unmodified: 0x0000008,
		Invalid: 0x0000010,
		MultipleChanges: 0x0000040,
		PendingChanges: 0x0000080,
		Canceled: 0x0000100,
		CantRelease: 0x0000400,
		ConcurrencyViolation: 0x0000800,
		IntegrityViolation: 0x0001000,
		MaxChangesExceeded: 0x0002000,
		ObjectOpen: 0x0004000,
		OutOfMemory: 0x0008000,
		PermissionDenied: 0x0010000,
		SchemaViolation: 0x0020000,
		DBDeleted: 0x0040000
	}
	//---- RecordTypeEnum Values ----
	this.RecordType = {
		_prefix: "ad",
		RecordUnknown: -1,
		SimpleRecord: 0,
		CollectionRecord: 1,
		StructDoc: 2
	}
	//---- ResyncEnum Values ----
	this.Resync = {
		_prefix: "adResync",
		UnderlyingValues: 1,
		AllValues: 2
	}
	//---- SaveOptionsEnum Values ----
	this.SaveOptions = {
		_prefix: "adSaveCreate",
		NotExist: 1,
		OverWrite: 2
	}
	//---- SchemaEnum Values ----
	this.Schema = {
		_prefix: "adShema",
		ProviderSpecific: -1,
		Asserts: 0,
		Catalogs: 1,
		CharacterSets: 2,
		Collations: 3,
		Columns: 4,
		CheckConstraints: 5,
		ConstraintColumnUsage: 6,
		ConstraintTableUsage: 7,
		KeyColumnUsage: 8,
		ReferentialConstraints: 9,
		TableConstraints: 10,
		ColumnsDomainUsage: 11,
		Indexes: 12,
		ColumnPrivileges: 13,
		TablePrivileges: 14,
		UsagePrivileges: 15,
		Procedures: 16,
		Schemata: 17,
		SQLLanguages: 18,
		Statistics: 19,
		Tables: 20,
		Translations: 21,
		ProviderTypes: 22,
		Views: 23,
		ViewColumnUsage: 24,
		ViewTableUsage: 25,
		ProcedureParameters: 26,
		ForeignKeys: 27,
		PrimaryKeys: 28,
		ProcedureColumns: 29,
		DBInfoKeywords: 30,
		DBInfoLiterals: 31,
		Cubes: 32,
		Dimensions: 33,
		Hierarchies: 34,
		Levels: 35,
		Measures: 36,
		Properties: 37,
		Members: 38,
		Trustees: 39,
		Functions: 40,
		Actions: 41,
		Commands: 42,
		Sets: 43
	}
	//---- SearchDirectionEnum Values ----
	this.SearchDirection = {
		_prefix: "adSearch",
		Forward: 1,
		Backward: -1
	}
	//---- SeekEnum Values ----
	this.Seek = {
		_prefix: "adSeek",
		FirstEQ: 0x1,
		LastEQ: 0x2,
		AfterEQ: 0x4,
		After: 0x8,
		BeforeEQ: 0x10,
		Before: 0x20
	}
	//---- StreamOpenOptionsEnum Values ----
	this.StreamOpenOptions = {
		_prefix: "adOpenStream",
		Unspecified: -1,
		Async: 1,
		FromRecord: 4
	}
	//---- StreamReadEnum Values ----
	this.StreamRead = {
		_prefix: "adRead",
		All: -1,
		Line: -2
	}
	//---- StreamTypeEnum Values ----
	this.StreamType = {
		_prefix: "adType",
		Binary: 1,
		Text: 2
	}
	//---- StreamWriteEnum Values ----
	this.StreamWrite = {
		_prefix: "adWrite",
		Char: 0,
		Line: 1
	}
	//---- StringFormatEnum Values ----
	this.StringFormat = {
		_prefix: "ad",
		ClipString: 2
	}
	//---- XactAttributeEnum Values ----
	this.XactAttribute = {
		_prefix: "adXact",
		CommitRetaining: 0x00020000,
		AbortRetaining: 0x00040000
	}
}
// Make this class static.
System.Data.Ado.EnumeratedConstants = new System.Data.Ado.EnumeratedConstants();
AdoEnums = System.Data.Ado.EnumeratedConstants;

//=============================================================================
// System.Data.DataSet
//-----------------------------------------------------------------------------


System.Data.DataSet = function () {
}
System.Type.RegisterClass("System.Data.DataSet");

System.Data.DataTable = function (name) {
	this.Name = "";
	this.Rows = new Array;
	this.Cols = new Array;
	//---------------------------------------------------------
	// INIT: Class
	//---------------------------------------------------------
	this.InitializeClass = function () {
		this.Name = name;
		this.Rows = this.Items;
		this.Columns = new System.Collections.SortedList();
	}
	this.InitializeClass();
}
System.Type.RegisterClass("System.Data.DataTable");

System.Class.Inherit(System.Data.DataTable, System.Collections.SortedList);

System.Data.DataColumn = function () {
}
System.Type.RegisterClass("System.Data.DataColumn");

System.Data.DataRow = function () {
	this.Name = "";
	this.Cels = new Array;
	var me = this;
	//---------------------------------------------------------
	// INIT: Class
	//---------------------------------------------------------
	this.InitializeClass = function () {
		this.Name = name;
		this.Cells = this.Items;
	}
	this.InitializeClass();
}
System.Type.RegisterClass("System.Data.DataRow");


System.Data.DataCell = function () {
}
System.Type.RegisterClass("System.Data.DataCell");


//=============================================================================
// System.Data.Client
//-----------------------------------------------------------------------------

//var adoConnection = new ActiveXObject("ADODB.Connection");
//var adoRecordset = new ActiveXObject("ADODB.Recordset");
//var adoCommand = new ActiveXObject("ADODB.Command");
//var adoError = new ActiveXObject("ADODB.Error");
//var adoParameter = new ActiveXObject("ADODB.Parameter");
//var adoRecord = new ActiveXObject("ADODB.Record");
//var adoStream = new ActiveXObject("ADODB.Stream");

// Internat SQL Stored Procedure
//sp_reset_connection resets the following aspects of a connection:
//    * It resets all error states and numbers (like @@error)
//    * It stops all EC's (execution contexts) that are child threads of a parent EC executing a parallel query
//    * It will wait for any outstanding I/O operations that is outstanding
//    * It will free any held buffers on the server by the connection
//    * It will unlock any buffer resources that are used by the connection
//    * It will release all memory allocated owned by the connection
//    * It will clear any work or temporary tables that are created by the connection
//    * It will kill all global cursors owned by the connection
//    * It will close any open SQL-XML handles that are open
//    * It will delete any open SQL-XML related work tables
//    * It will close all system tables
//    * It will close all user tables
//    * It will drop all temporary objects
//    * It will abort open transactions
//    * It will defect from a distributed transaction when enlisted
//    * It will decrement the reference count for users in current database; which release shared database lock
//    * It will free acquired locks
//    * It will releases any handles that may have been acquired
//    * It will reset all SET options to the default values
//    * It will reset the @@rowcount value
//    * It will reset the @@identity value
//    * It will reset any session level trace options using dbcc traceon()
//sp_reset_connection will NOT reset:
//    * Security context, which is why connection pooling matches connections based on the exact connection string
//    * If you entered an application role using sp_setapprole, since application roles can not be reverted

// NoteL Wrap guid into brackets: \"{...}\" when passing as value.

// Declare default connection string.
//System.Data.DefaultConnectionString;

// Create a class and define its constructor.
System.Data.Client = function (connectionString) {
	// Declare public variables.
	this.Connection = new ActiveXObject("ADODB.Connection");
	this.Recordset = new ActiveXObject("ADODB.Recordset");
	this.Command = new ActiveXObject("ADODB.Command");
	this.Error = new ActiveXObject("ADODB.Error");
	this.selectCommand = new ActiveXObject("ADODB.Command");
	this.insertCommand = new ActiveXObject("ADODB.Command");
	this.deleteCommand = new ActiveXObject("ADODB.Command");
	this.cresetCommand = new ActiveXObject("ADODB.Command");
	// Variables for Results.
	this.recordsAffected = 0;
	this.ColumnsCount = 0;
	this.RowsCount = 0;
	this.ErrorMessage = "";
	this.ParameterOutputName = "";
	this.ConnectionMode;
	//---------------------------------------------------------
	// METHOD: Connect
	//---------------------------------------------------------
	// Connect to database.
	this.Connect = function () {
		// If recordset is open then
		if (this.Recordset.State == AdoEnums.ObjectState.Open) {
			//Trace.Write("call this.Recordset.Close()");
			// We need to close it before new connection.
			this.Recordset.Close();
		}
		// Open Connection.
		if (this.Connection.State == AdoEnums.ObjectState.Closed) {
			//Trace.Write("call this.Connection.Open()");
			this.Connection.Open();
			// Set active connection of command.
			this.Command.ActiveConnection = this.Connection;
			// Configure recordset.
		} else {
			// If this is SQL Server then...
			var isSqlServer = (this.Connection.ConnectionString.indexOf("SQL Server") > -1);
			// Connection was opened so we need just reset it.
			if (isSqlServer) {
				this.cresetCommand.CommandType = AdoEnums.CommandType.StoredProc;
				this.cresetCommand.CommandTimeout = 600;
				this.cresetCommand.CommandText = "sp_reset_connection";
				this.cresetCommand.Prepared = false;
				this.cresetCommand.ActiveConnection = this.Connection;
				this.cresetCommand.Execute();
			}
		}
	}
	//---------------------------------------------------------
	// METHOD: Disconnect
	//---------------------------------------------------------
	// Disconnect from database.
	this.Disconnect = function () {
		if (this.Recordset.State == AdoEnums.ObjectState.Open) {
			//Trace.Write("call this.Recordset.Close()");
			this.Recordset.Close();
		}
		if (this.Connection.State == AdoEnums.ObjectState.Open) {
			//Trace.Write("call this.Connection.Close()");
			this.Connection.Close();
		}
	}
	//---------------------------------------------------------
	// METHOD: ConfigureConnection
	//---------------------------------------------------------
	this.ConfigureConnection = function (allowWrite, force) {
		var allowWrite = (allowWrite == true);
		//Trace.Write("call this.ConfigureConnection("+allowWrite+")");
		// If current mode is ReadWrite.
		var setToWrite = false;
		var setToRead = false;
		// If current mode is readOnly then...
		if (this.Connection.Mode == AdoEnums.ConnectMode.Read) {
			// ... and we want to write then reconfigure.
			if (allowWrite) setToWrite = true;
		} else {
			// ... and we don't want to write then reconfigure.
			if (!allowWrite) setToRead = true;
		}
		if (setToWrite || setToRead || force) {
			// We can configure only with closed connections.
			this.Disconnect();
			// Configure connection.
			this.Connection.CursorLocation = AdoEnums.CursorLocation.Client;
			// Query with clientside cursor.
			this.Recordset.CursorLocation = AdoEnums.CursorLocation.Client;
		}
		if (setToWrite || (allowWrite && force)) {
			//Trace.Write("setToWrite");
			this.ConnectionMode = AdoEnums.ConnectMode.ReadWrite;
			// Allow read and write records back to database.
			this.Connection.Mode = AdoEnums.ConnectMode.ReadWrite;
			// Configure recordset.
			this.Recordset.CursorType = AdoEnums.CursorType.Static;
			// Lock records only when you call the Update method.
			this.Recordset.LockType = AdoEnums.LockType.BatchOptimistic;
		}
		if (setToRead || (!allowWrite && force)) {
			//Trace.Write("setToRead");
			this.ConnectionMode = AdoEnums.ConnectMode.Read;
			// Allow read and write records back to database.
			this.Connection.Mode = AdoEnums.ConnectMode.Read;
			// Redefine recordset options.
			this.Recordset.CursorType = AdoEnums.CursorType.ForwardOnly;
			// Set to read only because we suspect that this is only read action.
			this.Recordset.LockType = AdoEnums.LockType.ReadOnly;
		}
	}
	//---------------------------------------------------------
	// METHOD: GetArray
	//---------------------------------------------------------
	// Get array from current dataset.
	this.GetArray = function (keepConnectionOpen) {
		keepConnectionOpen = (keepConnectionOpen == true);
		//http://www.adopenstatic.com/faq/recordcountalternatives.asp
		// The benefit of this method over .RecordCount is that the Recordset's resources
		// can be released immediately after .GetRows() is invoked and that a fast
		// adOpenForwardOnly cursor can be used.
		// If we have data then...
		var results = [];
		// Route thru rows.
		for (var r = 0; r < this.RowsCount; r++) {
			var row = {};
			for (var c = 0; c < this.ColumnsCount; c++) {
				//row["length"] = this.ColumnsCount;
				var name = this.Recordset(c).Name;
				var value = this.Recordset(c).Value;
				row[name] = {};
				row[name].Value = value;
				// Response.Write("["+r+":"+c+"'"+name+"'='"+value+"']");
			}
			//Response.Write("<br/>");
			results.push(row);
			this.Recordset.MoveNext();
		}
		if (keepConnectionOpen == true) {
			//this.Recordset.MoveFirst();
		} else {
			// Disconnect from database.
			this.Disconnect();
		}
		return results;
	}
	//---------------------------------------------------------
	// METHOD: GetData
	//---------------------------------------------------------
	// Function to execute command.
	this.GetData = function (keepConnectionOpen) {
		keepConnectionOpen = (keepConnectionOpen == true);
		//Trace.Write("call this.Execute("+keepConnectionOpen+")");
		this.ConfigureConnection(keepConnectionOpen)
		// Reset values.
		var output;
		this.ColumnsCount = 0;
		this.RowsCount = 0;
		// Connect to database if neccesary.
		this.Connect();
		// Execute Command.
		//Trace.Write(""+this.Command.CommandType+": "+this.Command.CommandText);
		try {
			this.Recordset = this.Command.Execute(this.recordsAffected);
		} catch (e) {
			this.ErrorMessage = e.message;
		}
		if (this.ParameterOutputName.length > 0) {
			output = this.Command.Parameters.Item(this.ParameterOutputName).Value;
		} else {
			output = this.Recordset;
		}
		// If data available because it was select command then...
		if (this.Recordset.Fields != null) {
			this.ColumnsCount = this.Recordset.Fields.Count;
			// Count records if table was retrieved.
			if (this.ColumnsCount > 0) this.RowsCount = this.Recordset.RecordCount;
		}
		// Disconnect from database. Return data as array[] with objects
		// Use output[rowIndex]["ColumnName"].Value to get value.
		if (keepConnectionOpen != true) {
			output = this.GetArray(true);
			this.Disconnect();
		}
		// Return results.
		return output;
	}
	//---------------------------------------------------------
	// METHOD: AddParameter
	//---------------------------------------------------------
	// Method ot add parameter to default commad.
	this.AddParameter = function (valName, valType, valDirection, valSize) {
		if (valSize == null || valSize == 0) {
			this.Command.Parameters.Append(this.Command.CreateParameter(valName, valType, valDirection));
		} else {
			this.Command.Parameters.Append(this.Command.CreateParameter(valName, valType, valDirection, valSize));
		}
	}
	//---------------------------------------------------------
	// METHOD: GetParametersList
	//---------------------------------------------------------
	this.GetParametersList = function () {
		return this.GetParameters(this.Command);
	}
	//---------------------------------------------------------
	// METHOD: GetParameters
	//---------------------------------------------------------
	this.GetParameters = function (valCommand) {
		var htmlText = "";
		htmlText += "<TABLE Border=\"1\" style=\"border-collapse: collapse; border-color: #B0B0B0; font: menu;\">";
		htmlText += "<TR>";
		htmlText += "<TD colspan=\"5\" style=\"color: gray;\">" + valCommand.CommandText + "</TD>";
		htmlText += "</TR>";
		htmlText += "<TR>";
		htmlText += "<TD align=\"center\"><B>PARAMETER Name</B></TD>";
		htmlText += "<TD align=\"center\"><B>DATA-TYPE</B></TD>";
		htmlText += "<TD align=\"center\"><B>DIRECTION</B></TD>";
		htmlText += "<TD align=\"center\"><B>DATA-SIZE</B></TD>";
		htmlText += "<TD align=\"center\"><B>VALUE</B></TD>";
		htmlText += "</TR>";
		var param = new ActiveXObject("ADODB.Parameter");
		for (var i = 0; i < valCommand.Parameters.Count; i++) {
			param = valCommand.Parameters(i);
			// Get name of output parameter;
			var paramNote = new String("");
			if (param.Direction == AdoEnums.ParameterDirection.InputOutput) {
				this.ParameterOutputName = param.Name;
				paramNote = " (output)";
			}
			htmlText += "<TR>";
			htmlText += "<TD>" + param.Name + "</TD>";
			htmlText += "<TD align=\"center\">" + param.Type + "</TD>";
			htmlText += "<TD align=\"center\">" + param.Direction + paramNote + "</TD>";
			htmlText += "<TD align=\"center\">" + param.Size + "</TD>";
			htmlText += "<TD align=\"left\">" + param.Value + "</TD>";
			htmlText += "</TR>";
		}
		htmlText += "</TABLE>";
		this.ParametersList = htmlText;
		return htmlText;
	}
	//---------------------------------------------------------
	// METHOD: GetParameters
	//---------------------------------------------------------
	this.GetParametersListForCode = function (valIncludeOld, classNamespace, useNumbers, connectionStringInside) {
		if (this.Command.Parameters.Count == 0) {
			return "// Looks like " + this.Command.CommandText + " stored procedure does not exist."
		} else {
			if (!classNamespace) {
				classNamespace = "System.Data";
			}
			if (!connectionStringInside) connectionStringInside = "";
			if (classNamespace) classNamespace += ".";
			var tabs = new String("\t");
			if (valIncludeOld) tabs = new String("\t\t")
			var htmlText = "";
			var param = new ActiveXObject("ADODB.Parameter");
			var parameterValues = "";
			var parameterValuesDebug = "";
			var parametersSet = "";
			// We will generate 5 parts of code.
			var stringFunctionParam = "";
			var stringTraceMessages = "";
			var arrayAddParameters = new Array;
			var arraySetParameters = new Array;
			var arraySqlExecString = new Array;
			var tempString = "";
			var IsFirstParameter = true;
			// Route thru paramaters;
			for (var i = 0; i < this.Command.Parameters.Count; i++) {
				var param = this.Command.Parameters(i);
				var paramName = new String(param.Name);
				var paramIsChar = (AdoEnums.GetNameByValue("DataType", param.Type).indexOf("Char") > -1);
				var paramIsTime = (AdoEnums.GetNameByValue("DataType", param.Type).indexOf("Time") > -1);
				var paramTypeName = AdoEnums.GetNameByValue("DataType", param.Type);
				var paramDirection = AdoEnums.GetNameByValue("ParameterDirection", param.Direction);
				//useNumbers = true;
				if (useNumbers == true) {
					paramTypeName = param.Type;
					paramDirection = param.Direction;
				}
				// If parameter type is nvarchar but size is more than 1 MB then...
				if (param.Type == 202 && param.Size > 1048576) {
					// then parameter is ntext (long nvarchar).
					paramTypeName = AdoEnums.GetNameByValue("DataType", 203);
					if (useNumbers == true) paramTypeName = 203;
				} 			// Declare some other variables.
				var separator = IsFirstParameter ? "" : ", ";
				var escapeStart = paramIsChar ? "escape(" : "";
				var escapeEnd = paramIsChar ? ")" : "";
				var singleBracket = paramIsChar ? "'" : "";
				var timeBracket = paramIsTime ? "#" : "";
				var timeStart = paramIsTime ? "dataClient.GetDbTime(" : "";
				var timeEnd = paramIsTime ? ")" : "";
				// If this is return value;
				if (paramName == "\@RETURN_VALUE") {
				} else {
					paramName = paramName.replace("\@", "");
					// Capitalize parameter.
					paramNameS = paramName.substr(0, 1).toUpperCase();
					paramNameL = paramName.substr(0, 1).toLowerCase();
					paramNameE = paramName.substr(1);
					// Convert name to support C# coding standards.
					paramName = paramNameL + paramNameE;
					// Update function parameters string.
					stringFunctionParam += separator + paramName;
					// Update debug message string.
					if (paramIsChar && param.Size > 128) {
						// Parameter is large string so we are not planning to show it on trace.
						stringTraceMessages += separator + paramName;
					} else {
						stringTraceMessages += separator + timeBracket + singleBracket + "\"+" + paramName + "+\"" + singleBracket + timeBracket;
					}
					// Set parameters lines.
					tempString = "adoCommand.Parameters(\"" + param.Name + "\").Value = " + timeStart + paramName + timeEnd + ";";
					arraySetParameters.push(tempString);
					// Add sql execute string.
					var sqlSeparator = IsFirstParameter ? "\"  \"+" : "\", \"+";
					var sqlBracketStart = paramIsChar ? "\"'\"+" : "";
					var sqlBracketEnd = paramIsChar ? "+\"'\"" : "";

					tempString = "sqlString += " + sqlSeparator + sqlBracketStart + escapeStart + paramName + escapeEnd + sqlBracketEnd + ";";
					arraySqlExecString.push(tempString);
					// Next parameter will be not first.
					IsFirstParameter = false;
				}
				// Add parametrs lines.
				tempString = "dataClient.AddParameter(";
				tempString += "\"" + param.Name + "\", " + paramTypeName + ", " + paramDirection;
				if (param.Size > 0) tempString += ", " + param.Size;
				tempString += ");";
				if (useNumbers == true) {
					//tempString += " // "+AdoEnums.GetNameByValue("DataType",param.Type).replace("AdoEnums.DataType.","");
					//tempString += " "+AdoEnums.GetNameByValue("ParameterDirection",param.Direction).replace("AdoEnums.ParameterDirection.","");
				}
				arrayAddParameters.push(tempString);
			}
			// Get command Name.
			var commandName = new String(this.Command.CommandText);
			var indexStart = commandName.indexOf("=") + 9;
			var indexEnd = commandName.indexOf("(");
			// If indexEnd = -1 then...
			if (indexEnd == -1) {
				// There is no parameters and we need to adjust indexEnd.
				indexEnd = commandName.length - 2;
			}
			commandName = commandName.substring(indexStart, indexEnd);

			//htmlText += "//---------------------------------------------------------\n";
			htmlText += "// METHOD-PROCEDURE: " + commandName.replace("_", ".", "g") + "\n";
			//htmlText += "//---------------------------------------------------------\n";
			htmlText += classNamespace + commandName.replace("_", ".", "g") + " = function(" + stringFunctionParam + "){\n";
			htmlText += "\tTrace.Write(\"exec " + classNamespace + commandName.replace("_", ".", "g") + "(" + stringTraceMessages + ")\");\n";
			htmlText += "\tvar databaseResults;\n";
			if (valIncludeOld) {
				htmlText += "\tvar UseNew = false;\n";
				htmlText += "\tif (UseNew == true){\n";
			}
			htmlText += tabs + "var dataClient = new System.Data.Client(" + connectionStringInside + ");\n";
			htmlText += tabs + "var adoCommand = new ActiveXObject(\"ADODB.Command\");\n";
			htmlText += tabs + "var getParametersAutomaticaly = false;\n";
			htmlText += tabs + "// Create command and get reference to it.\n";
			htmlText += tabs + "adoCommand = dataClient.CreateCommand(\"sp" + commandName + "\", getParametersAutomaticaly);\n";
			htmlText += tabs + "// Add parameters to command.\n";
			for (var i = 0; i < arrayAddParameters.length; i++) {
				htmlText += tabs + arrayAddParameters[i] + "\n";
			}
			htmlText += tabs + "// Set command parameter values.\n";
			for (var i = 0; i < arraySetParameters.length; i++) {
				htmlText += tabs + arraySetParameters[i] + "\n";
			}
			htmlText += tabs + "// Execute stored procedure.\n";
			htmlText += tabs + "databaseResults = dataClient.GetData();\n";
			//htmlText += "\t\tTrace.Write(\"}\",-2);\n";
			if (valIncludeOld) {
				htmlText += "\t}else{\n";
				// Script for old version.
				htmlText += tabs + "// Generate SQL Command.\n";
				htmlText += tabs + "var sqlString = \"sp" + commandName + "\";\n";
				for (var i = 0; i < arraySqlExecString.length; i++) {
					htmlText += tabs + arraySqlExecString[i] + "\n";
				}
				htmlText += tabs + "// Execute stored procedure.\n";
				htmlText += tabs + "databaseResults = dbcon.Execute(sqlString);\n";
				htmlText += "\t}\n";
			}
			htmlText += "\t// Return results.\n";
			htmlText += "\treturn databaseResults;\n";
			htmlText += "}\n";
			this.ParametersList = htmlText;
			return htmlText;
		}
	}
	//---------------------------------------------------------
	// METHOD: SetParameters
	//---------------------------------------------------------
	// Set default parameters if found.
	this.SetParameters = function (valCommand) {
		for (var i = 0; i < valCommand.Parameters.Count; i++) {
			param = valCommand.Parameters(i);
			// Set some default values if found.
			if (param.Name == "@RecordEnabled") param.Value = 1;
			if (param.Name == "@RecordDateCreated") param.Value = this.GetDbTimeNow();
			if (param.Name == "@RecordDateModified") param.Value = null;
		}
	}
	//---------------------------------------------------------
	// METHOD: GetDbTimeNow
	//---------------------------------------------------------
	this.GetDbTimeNow = function () {
		var date = new Date;
		return this.GetDbTime(date);
	}
	//---------------------------------------------------------
	// METHOD: GetDbTime
	//---------------------------------------------------------
	this.GetDbTime = function (valDate) {
		//if ( eval( dc[3] ) < 1970 ) dc[3] = eval( dc[3] ) +100 // Correct any date purporting to be before 1970
		// Database offset time.
		var intPointUtc = 0;
		intPointUtc = Date.UTC(1970, 0, 1, 0, 0, 0, 0) / 1000 / 60 / 60 / 24;
		var intPointDtb = 0;
		intPointDtb = Date.UTC(1900, 0, -1, 0, 0, 0, 0) / 1000 / 60 / 60 / 24;
		// Get current datetime.
		var intDtm = 0;
		intDtm = valDate.getTime() / 1000 / 60 / 60 / 24 - valDate.getTimezoneOffset() / 60 / 24 - intPointDtb;
		return intDtm;
	}
	//---------------------------------------------------------
	// METHOD: Dispose
	//---------------------------------------------------------
	this.Dispose = function () {
		// Close connections.
		this.Disconnect();
		// Cleanup.
		this.Recordset = null;
		this.Connection = null;
		this.Command = null;
	}
	//---------------------------------------------------------
	// METHOD: CreateCommand
	//---------------------------------------------------------
	// Create command and attach to connection.
	this.CreateCommand = function (commandText, refreshParameters) {
		//Trace.Write("-------------"+commandText+"'");
		// Detect command type.
		var commandType = AdoEnums.CommandType.Text;
		if (commandText.toUpperCase().indexOf("SP") == 0) commandType = AdoEnums.CommandType.StoredProc;
		if (commandText.toUpperCase().indexOf("UP") == 0) commandType = AdoEnums.CommandType.StoredProc;
		// Specify command type (SQL text or stored procedure).
		this.Command.CommandType = commandType;
		// How long to wait in seconds for a command to execute.
		this.Command.CommandTimeout = 600;
		// Set command text.
		this.Command.CommandText = commandText;
		// Prepare command since we will be executing it more than once.
		this.Command.Prepared = true;
		// if If user wants to refresh parameters then...
		if (refreshParameters) {
			// Connect to database.
			this.Connect();
			// Query the server for what the parameters are.
			this.Command.Parameters.Refresh();
			// Set default parameters if found.
			this.SetParameters(this.Command);
			// Disconnect from database (don't diconnect here or you will lose parameters).
			//this.Disconnect();
		}
		// Return command.
		return this.Command;
	}
	//---------------------------------------------------------
	// INIT: Class
	//---------------------------------------------------------
	this.InitializeClass = function () {
		// Create Connection.
		this.Connection.ConnectionString = connectionString
		if (connectionString == null && typeof (System.Data.DefaultConnectionString) == "string") {
			this.Connection.ConnectionString = System.Data.DefaultConnectionString;
		}
		// Make writable by default.
		this.ConfigureConnection(true, true);
	}
	this.InitializeClass();

}
System.Type.RegisterClass("System.Data.Client");

//==============================================================================
// END
//------------------------------------------------------------------------------