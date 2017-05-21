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
//		<RootNamespace>System.Windows.Forms</RootNamespace>
// <PropertyGroup>
//-----------------------------------------------------------------------------
System.Type.RegisterNamespace("System.Windows.Forms");
//=============================================================================

// Can be recreated with ASP.NET
//
//protected void Page_Load(object sender, EventArgs e)
//{
//    Response.Clear();
//    Response.ContentType = "text/plain";
//    Response.Write(GetKeysEnum());
//    Response.End();
//}

//public string GetKeysEnum()
//{
//    System.Text.StringBuilder text = new System.Text.StringBuilder();
//    text.Append("System.Windows.Forms.Keys = {\r\n");
//    for (int i = 0; i < 256; i++)
//    {
//        if (i > 0) text.Append(",\r\n");
//        text.Append("\t0x"+i.ToString("X2") + ": ");
//        text.Append("\"" + ((System.Windows.Forms.Keys)i).ToString() + "\"");
//    }
//    text.Append("\r\n}");
//    return text.ToString();
//}

//=============================================================================
// ENUM: Windows.Forms.Keys
//-----------------------------------------------------------------------------

System.Windows.Forms.Keys = {
	0x00: "None",
	0x01: "LButton",
	0x02: "RButton",
	0x03: "Cancel",
	0x04: "MButton",
	0x05: "XButton1",
	0x06: "XButton2",
	0x07: "LButton, XButton2",
	0x08: "Back",
	0x09: "Tab",
	0x0A: "LineFeed",
	0x0B: "LButton, LineFeed",
	0x0C: "Clear",
	0x0D: "Return",
	0x0E: "RButton, Clear",
	0x0F: "RButton, Return",
	0x10: "ShiftKey",
	0x11: "ControlKey",
	0x12: "Menu",
	0x13: "Pause",
	0x14: "Capital",
	0x15: "KanaMode",
	0x16: "RButton, Capital",
	0x17: "JunjaMode",
	0x18: "FinalMode",
	0x19: "HanjaMode",
	0x1A: "RButton, FinalMode",
	0x1B: "Escape",
	0x1C: "IMEConvert",
	0x1D: "IMENonconvert",
	0x1E: "IMEAceept",
	0x1F: "IMEModeChange",
	0x20: "Space",
	0x21: "PageUp",
	0x22: "Next",
	0x23: "End",
	0x24: "Home",
	0x25: "Left",
	0x26: "Up",
	0x27: "Right",
	0x28: "Down",
	0x29: "Select",
	0x2A: "Print",
	0x2B: "Execute",
	0x2C: "PrintScreen",
	0x2D: "Insert",
	0x2E: "Delete",
	0x2F: "Help",
	0x30: "D0",
	0x31: "D1",
	0x32: "D2",
	0x33: "D3",
	0x34: "D4",
	0x35: "D5",
	0x36: "D6",
	0x37: "D7",
	0x38: "D8",
	0x39: "D9",
	0x3A: "RButton, D8",
	0x3B: "RButton, D9",
	0x3C: "MButton, D8",
	0x3D: "MButton, D9",
	0x3E: "XButton2, D8",
	0x3F: "XButton2, D9",
	0x40: "64",
	0x41: "A",
	0x42: "B",
	0x43: "C",
	0x44: "D",
	0x45: "E",
	0x46: "F",
	0x47: "G",
	0x48: "H",
	0x49: "I",
	0x4A: "J",
	0x4B: "K",
	0x4C: "L",
	0x4D: "M",
	0x4E: "N",
	0x4F: "O",
	0x50: "P",
	0x51: "Q",
	0x52: "R",
	0x53: "S",
	0x54: "T",
	0x55: "U",
	0x56: "V",
	0x57: "W",
	0x58: "X",
	0x59: "Y",
	0x5A: "Z",
	0x5B: "LWin",
	0x5C: "RWin",
	0x5D: "Apps",
	0x5E: "RButton, RWin",
	0x5F: "Sleep",
	0x60: "NumPad0",
	0x61: "NumPad1",
	0x62: "NumPad2",
	0x63: "NumPad3",
	0x64: "NumPad4",
	0x65: "NumPad5",
	0x66: "NumPad6",
	0x67: "NumPad7",
	0x68: "NumPad8",
	0x69: "NumPad9",
	0x6A: "Multiply",
	0x6B: "Add",
	0x6C: "Separator",
	0x6D: "Subtract",
	0x6E: "Decimal",
	0x6F: "Divide",
	0x70: "F1",
	0x71: "F2",
	0x72: "F3",
	0x73: "F4",
	0x74: "F5",
	0x75: "F6",
	0x76: "F7",
	0x77: "F8",
	0x78: "F9",
	0x79: "F10",
	0x7A: "F11",
	0x7B: "F12",
	0x7C: "F13",
	0x7D: "F14",
	0x7E: "F15",
	0x7F: "F16",
	0x80: "F17",
	0x81: "F18",
	0x82: "F19",
	0x83: "F20",
	0x84: "F21",
	0x85: "F22",
	0x86: "F23",
	0x87: "F24",
	0x88: "Back, F17",
	0x89: "Back, F18",
	0x8A: "Back, F19",
	0x8B: "Back, F20",
	0x8C: "Back, F21",
	0x8D: "Back, F22",
	0x8E: "Back, F23",
	0x8F: "Back, F24",
	0x90: "NumLock",
	0x91: "Scroll",
	0x92: "RButton, NumLock",
	0x93: "RButton, Scroll",
	0x94: "MButton, NumLock",
	0x95: "MButton, Scroll",
	0x96: "XButton2, NumLock",
	0x97: "XButton2, Scroll",
	0x98: "Back, NumLock",
	0x99: "Back, Scroll",
	0x9A: "LineFeed, NumLock",
	0x9B: "LineFeed, Scroll",
	0x9C: "Clear, NumLock",
	0x9D: "Clear, Scroll",
	0x9E: "RButton, Clear, NumLock",
	0x9F: "RButton, Clear, Scroll",
	0xA0: "LShiftKey",
	0xA1: "RShiftKey",
	0xA2: "LControlKey",
	0xA3: "RControlKey",
	0xA4: "LMenu",
	0xA5: "RMenu",
	0xA6: "BrowserBack",
	0xA7: "BrowserForward",
	0xA8: "BrowserRefresh",
	0xA9: "BrowserStop",
	0xAA: "BrowserSearch",
	0xAB: "BrowserFavorites",
	0xAC: "BrowserHome",
	0xAD: "VolumeMute",
	0xAE: "VolumeDown",
	0xAF: "VolumeUp",
	0xB0: "MediaNextTrack",
	0xB1: "MediaPreviousTrack",
	0xB2: "MediaStop",
	0xB3: "MediaPlayPause",
	0xB4: "LaunchMail",
	0xB5: "SelectMedia",
	0xB6: "LaunchApplication1",
	0xB7: "LaunchApplication2",
	0xB8: "Back, MediaNextTrack",
	0xB9: "Back, MediaPreviousTrack",
	0xBA: "Oem1",
	0xBB: "Oemplus",
	0xBC: "Oemcomma",
	0xBD: "OemMinus",
	0xBE: "OemPeriod",
	0xBF: "OemQuestion",
	0xC0: "Oemtilde",
	0xC1: "LButton, Oemtilde",
	0xC2: "RButton, Oemtilde",
	0xC3: "Cancel, Oemtilde",
	0xC4: "MButton, Oemtilde",
	0xC5: "XButton1, Oemtilde",
	0xC6: "XButton2, Oemtilde",
	0xC7: "LButton, XButton2, Oemtilde",
	0xC8: "Back, Oemtilde",
	0xC9: "Tab, Oemtilde",
	0xCA: "LineFeed, Oemtilde",
	0xCB: "LButton, LineFeed, Oemtilde",
	0xCC: "Clear, Oemtilde",
	0xCD: "Return, Oemtilde",
	0xCE: "RButton, Clear, Oemtilde",
	0xCF: "RButton, Return, Oemtilde",
	0xD0: "ShiftKey, Oemtilde",
	0xD1: "ControlKey, Oemtilde",
	0xD2: "Menu, Oemtilde",
	0xD3: "Pause, Oemtilde",
	0xD4: "Capital, Oemtilde",
	0xD5: "KanaMode, Oemtilde",
	0xD6: "RButton, Capital, Oemtilde",
	0xD7: "JunjaMode, Oemtilde",
	0xD8: "FinalMode, Oemtilde",
	0xD9: "HanjaMode, Oemtilde",
	0xDA: "RButton, FinalMode, Oemtilde",
	0xDB: "OemOpenBrackets",
	0xDC: "Oem5",
	0xDD: "Oem6",
	0xDE: "Oem7",
	0xDF: "Oem8",
	0xE0: "Space, Oemtilde",
	0xE1: "PageUp, Oemtilde",
	0xE2: "OemBackslash",
	0xE3: "LButton, OemBackslash",
	0xE4: "Home, Oemtilde",
	0xE5: "ProcessKey",
	0xE6: "MButton, OemBackslash",
	0xE7: "Packet",
	0xE8: "Down, Oemtilde",
	0xE9: "Select, Oemtilde",
	0xEA: "Back, OemBackslash",
	0xEB: "Tab, OemBackslash",
	0xEC: "PrintScreen, Oemtilde",
	0xED: "Back, ProcessKey",
	0xEE: "Clear, OemBackslash",
	0xEF: "Back, Packet",
	0xF0: "D0, Oemtilde",
	0xF1: "D1, Oemtilde",
	0xF2: "ShiftKey, OemBackslash",
	0xF3: "ControlKey, OemBackslash",
	0xF4: "D4, Oemtilde",
	0xF5: "ShiftKey, ProcessKey",
	0xF6: "Attn",
	0xF7: "Crsel",
	0xF8: "Exsel",
	0xF9: "EraseEof",
	0xFA: "Play",
	0xFB: "Zoom",
	0xFC: "NoName",
	0xFD: "Pa1",
	0xFE: "OemClear",
	0xFF: "LButton, OemClear"
};

// List of virtual keys (VK_KeyName).
// From C:\Program Files\Microsoft Visual Studio 8\VC\PlatformSDK\Include\WinUser.h
System.Windows.Forms.VirtualKeys = {
	0x00: "",
	0x01: "LBUTTON",
	0x02: "RBUTTON",
	0x03: "CANCEL",
	0x04: "MBUTTON",
	0x05: "XBUTTON1",
	0x06: "XBUTTON2",
	0x07: "", // Unassigned
	0x08: "BACK",
	0x09: "TAB",
	0x0A: "", // Reserved
	0x0B: "", // Reserved
	0x0C: "CLEAR",
	0x0D: "RETURN",
	0x0E: "RETURN", // FireFox
	0x0F: "",
	0x10: "SHIFT",
	0x11: "CONTROL",
	0x12: "MENU",
	0x13: "PAUSE",
	0x14: "CAPITAL",
	0x15: "HANGUL",
	0x16: "",
	0x17: "JUNJA",
	0x18: "FINAL",
	0x19: "KANJI",
	0x1A: "",
	0x1B: "ESCAPE",
	0x1C: "CONVERT",
	0x1D: "NONCONVERT",
	0x1E: "ACCEPT",
	0x1F: "MODECHANGE",
	0x20: "SPACE",
	0x21: "PRIOR",
	0x22: "NEXT",
	0x23: "END",
	0x24: "HOME",
	0x25: "LEFT",
	0x26: "UP",
	0x27: "RIGHT",
	0x28: "DOWN",
	0x29: "SELECT",
	0x2A: "PRINT",
	0x2B: "EXECUTE",
	0x2C: "SNAPSHOT",
	0x2D: "INSERT",
	0x2E: "DELETE",
	0x2F: "HELP",
	0x30: "0",
	0x31: "1",
	0x32: "2",
	0x33: "3",
	0x34: "4",
	0x35: "5",
	0x36: "6",
	0x37: "7",
	0x38: "8",
	0x39: "9",
	0x3A: "",
	0x3B: "SEMICOLON", // FireFox
	0x3C: "",
	0x3D: "EQUALS", // FireFox
	0x3E: "",
	0x3F: "",
	0x40: "",
	0x41: "A",
	0x42: "B",
	0x43: "C",
	0x44: "D",
	0x45: "E",
	0x46: "F",
	0x47: "G",
	0x48: "H",
	0x49: "I",
	0x4A: "J",
	0x4B: "K",
	0x4C: "L",
	0x4D: "M",
	0x4E: "N",
	0x4F: "O",
	0x50: "P",
	0x51: "Q",
	0x52: "R",
	0x53: "S",
	0x54: "T",
	0x55: "U",
	0x56: "V",
	0x57: "W",
	0x58: "X",
	0x59: "Y",
	0x5A: "Z",
	0x5B: "LWIN",
	0x5C: "RWIN",
	0x5D: "APPS",
	0x5E: "", // Reserved
	0x5F: "SLEEP",
	0x60: "NUMPAD0",
	0x61: "NUMPAD1",
	0x62: "NUMPAD2",
	0x63: "NUMPAD3",
	0x64: "NUMPAD4",
	0x65: "NUMPAD5",
	0x66: "NUMPAD6",
	0x67: "NUMPAD7",
	0x68: "NUMPAD8",
	0x69: "NUMPAD9",
	0x6A: "MULTIPLY",
	0x6B: "ADD",
	0x6C: "SEPARATOR",
	0x6D: "SUBTRACT",
	0x6E: "DECIMAL",
	0x6F: "DIVIDE",
	0x70: "F1",
	0x71: "F2",
	0x72: "F3",
	0x73: "F4",
	0x74: "F5",
	0x75: "F6",
	0x76: "F7",
	0x77: "F8",
	0x78: "F9",
	0x79: "F10",
	0x7A: "F11",
	0x7B: "F12",
	0x7C: "F13",
	0x7D: "F14",
	0x7E: "F15",
	0x7F: "F16",
	0x80: "F17",
	0x81: "F18",
	0x82: "F19",
	0x83: "F20",
	0x84: "F21",
	0x85: "F22",
	0x86: "F23",
	0x87: "F24",
	0x88: "", // Unassigned
	0x89: "", // Unassigned
	0x8A: "", // Unassigned
	0x8B: "", // Unassigned
	0x8C: "", // Unassigned
	0x8D: "", // Unassigned
	0x8E: "", // Unassigned
	0x8F: "", // Unassigned
	0x90: "NUMLOCK",
	0x91: "SCROLL",
	0x92: "OEM_FJ_JISHO",
	0x93: "OEM_FJ_MASSHOU",
	0x94: "OEM_FJ_TOUROKU",
	0x95: "OEM_FJ_LOYA",
	0x96: "OEM_FJ_ROYA",
	0x97: "", // Unassigned
	0x98: "", // Unassigned
	0x99: "", // Unassigned
	0x9A: "", // Unassigned
	0x9B: "", // Unassigned
	0x9C: "", // Unassigned
	0x9D: "", // Unassigned
	0x9E: "", // Unassigned
	0x9F: "", // Unassigned
	0xA0: "LSHIFT",
	0xA1: "RSHIFT",
	0xA2: "LCONTROL",
	0xA3: "RCONTROL",
	0xA4: "LMENU",
	0xA5: "RMENU",
	0xA6: "BROWSER_BACK",
	0xA7: "BROWSER_FORWARD",
	0xA8: "BROWSER_REFRESH",
	0xA9: "BROWSER_STOP",
	0xAA: "BROWSER_SEARCH",
	0xAB: "BROWSER_FAVORITES",
	0xAC: "BROWSER_HOME",
	0xAD: "VOLUME_MUTE",
	0xAE: "VOLUME_DOWN",
	0xAF: "VOLUME_UP",
	0xB0: "MEDIA_NEXT_TRACK",
	0xB1: "MEDIA_PREV_TRACK",
	0xB2: "MEDIA_STOP",
	0xB3: "MEDIA_PLAY_PAUSE",
	0xB4: "LAUNCH_MAIL",
	0xB5: "LAUNCH_MEDIA_SELECT",
	0xB6: "LAUNCH_APP1",
	0xB7: "LAUNCH_APP2",
	0xB8: "", // Reserved
	0xB9: "", // Reserved
	0xBA: "OEM_1",
	0xBB: "OEM_PLUS",
	0xBC: "OEM_COMMA",
	0xBD: "OEM_MINUS",
	0xBE: "OEM_PERIOD",
	0xBF: "OEM_2",
	0xC0: "OEM_3",
	0xC1: "", // Unassigned
	0xC2: "", // Unassigned
	0xC3: "", // Unassigned
	0xC4: "", // Unassigned
	0xC5: "", // Unassigned
	0xC6: "", // Unassigned
	0xC7: "", // Unassigned
	0xC8: "", // Unassigned
	0xC9: "", // Unassigned
	0xCA: "", // Unassigned
	0xCB: "", // Unassigned
	0xCC: "", // Unassigned
	0xCD: "", // Unassigned
	0xCE: "", // Unassigned
	0xCF: "", // Unassigned
	0xD0: "", // Unassigned
	0xD1: "", // Unassigned
	0xD2: "", // Unassigned
	0xD3: "", // Unassigned
	0xD4: "", // Unassigned
	0xD5: "", // Unassigned
	0xD6: "", // Unassigned
	0xD7: "", // Unassigned
	0xD8: "", // Reserved
	0xD9: "", // Reserved
	0xDA: "", // Reserved
	0xDB: "OEM_4",
	0xDC: "OEM_5",
	0xDD: "OEM_6",
	0xDE: "OEM_7",
	0xDF: "OEM_8",
	0xE0: "META", // Reserved, FireFox
	0xE1: "OEM_AX",
	0xE2: "OEM_102",
	0xE3: "ICO_HELP",
	0xE4: "ICO_00",
	0xE5: "PROCESSKEY",
	0xE6: "ICO_CLEAR",
	0xE7: "PACKET",
	0xE8: "", // Unassigned
	0xE9: "OEM_RESET",
	0xEA: "OEM_JUMP",
	0xEB: "OEM_PA1",
	0xEC: "OEM_PA2",
	0xED: "OEM_PA3",
	0xEE: "OEM_WSCTRL",
	0xEF: "OEM_CUSEL",
	0xF0: "OEM_ATTN",
	0xF1: "OEM_FINISH",
	0xF2: "OEM_COPY",
	0xF3: "OEM_AUTO",
	0xF4: "OEM_ENLW",
	0xF5: "OEM_BACKTAB",
	0xF6: "ATTN",
	0xF7: "CRSEL",
	0xF8: "EXSEL",
	0xF9: "EREOF",
	0xFA: "PLAY",
	0xFB: "ZOOM",
	0xFC: "NOName",
	0xFD: "PA1",
	0xFE: "OEM_CLEAR",
	0xFF: "" // Reserved
};

//==============================================================================
// END
//------------------------------------------------------------------------------
