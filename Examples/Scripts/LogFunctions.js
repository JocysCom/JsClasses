//#region Log Function

function WriteLog(text){
	Trace.Write("<code>"+text+"</code>");
}

function WriteEnc(input, output){
	WriteLog("Transform: " + System.BitConverter.ToString(input, '') +
	" -> " + System.BitConverter.ToString(output, ''));
}

function WriteBi(s, b){
	// Acepts byte[] and sbyte[].
	var sb = System.BitConverter.ToString(b.toByteArray(), "");
	WriteLog(s + " = ["+b.signum()+"]" + sb+"; bitCount = " + b.bitCount() + "; bitLength = " + b.bitLength()
	+"; Decimal = "+b.toString(10));
}

function WriteBiGs(v, n) {
	var l = n - v.length;
	var r = "";
	for (var i = 0; i <= l; i++) r = r + " ";
	return r + v;
}

function WriteBi2(s, b) {
	var sb = System.BitConverter.ToString(b.ToByteArray());
	var line = WriteBiGs(s, 8) + " = hex: " + WriteBiGs(b.ToHex(), 27) + ", dec: " + WriteBiGs(b.ToDecimal(), 28) + ", bytes: " + sb;
	WriteLog(line.replace(" ", "&nbsp;", "g"));
}

		
function WriteArray(name, input)
{
	var ba = new System.Collections.BitArray(input);
	var length = ba.length;
	var sb = new System.Text.StringBuilder();
	for (var i = 0; i < length; i++){
		if ((i > 0) && (i % 8 == 0)) sb.Append(' ');
		sb.Append(ba[i] ? '1' : '0');
	}
	WriteLog(name + " = [" + System.BitConverter.ToString(input) + "]" +
	// Bits of bytes will be stored and dispalyed in
	// Little-endian format - lowest order (little) numbers coming first.
	" // [" + sb.ToString() + "]");
}
		
//#endregion