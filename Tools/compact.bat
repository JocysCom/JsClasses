exit

@ECHO OFF
SET src=%1
IF "%src%"=="" GOTO:EOF
:: Get current directory.
for /f "tokens=*" %%a in ('cd') DO SET DIR0=%%a
set web=%src%
cd %src%\Tools

:: Compact SJ
echo Compact JS
echo.
CALL:CJS Adobe.Flash.SoundManager
CALL:CJS System.Audio
CALL:CJS System.BigInt
CALL:CJS System.BitConverter
CALL:CJS System.Collections
CALL:CJS System.Convert
CALL:CJS System.Data
CALL:CJS System.debug
CALL:CJS System.Drawing
CALL:CJS System.Extensions.Array
CALL:CJS System.Globalization.KeyboardLayouts
CALL:CJS System.IO
CALL:CJS System
CALL:CJS System.Security.Cryptography.HMACMD5
CALL:CJS System.Security.Cryptography.HMACSHA1
CALL:CJS System.Security.Cryptography
CALL:CJS System.Security.Cryptography.MD5
CALL:CJS System.Security.Cryptography.RC2
CALL:CJS System.Security.Cryptography.RC4
CALL:CJS System.Security.Cryptography.AES
CALL:CJS System.Security.Cryptography.RSA
CALL:CJS System.Security.Cryptography.SHA1
CALL:CJS System.Security.Password
CALL:CJS System.TestTools.UnitTesting
CALL:CJS System.Text.CodeColorizer
CALL:CJS System.Text
CALL:CJS System.Web
CALL:CJS System.Web.UI.HtmlControls
CALL:CJS System.Web.UI.HtmlControls.TextBox
CALL:CJS System.Web.UI.Interface
CALL:CJS System.Web.UI
CALL:CJS System.Web.UI.ShortKeys
CALL:CJS System.Web.UI.TreeView
CALL:CJS System.Windows.Forms.Keys
CALL:CJS System.Xml
echo.
:: Compact CSS
echo Compact CSS
echo.
CALL:CSS System.Web.UI.Interface
cd %src%

GOTO:EOF
::=============================================================
:CJS :: COMPACT JAVASCRIP
::-------------------------------------------------------------
echo 	%web%\%1.debug.js 
::echo 	%web%\%1.js
IF NOT EXIST "%web%\%1.debug.js" COPY "%web%\%1.js" "%web%\%1.debug.js"
:: Disable compression for compatibility for a moment.
::jsmin.exe <"%web%\%1.debug.js" >"%web%\%1.js"
COPY "%web%\%1.debug.js" "%web%\%1.js">nul
GOTO:EOF
::=============================================================
:CSS :: COMPACT CSS
::-------------------------------------------------------------
echo 	%web%\%1.debug.css
::echo 	%web%\%1.css
IF NOT EXIST "%web%\%1.debug.css" COPY "%web%\%1.css" "%web%\%1.debug.css"
SET opt=--template=highest --silent=true --remove_last_;=false --preserve_css=true
:: Disable compression for compatibility for a moment.
::csstidy.exe "%web%\%1.debug.css" %opt% "%web%\%1.css"
COPY "%web%\%1.debug.css" "%web%\%1.css">nul
GOTO:EOF
