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
using System.Reflection;
using System.CodeDom;
using System.CodeDom.Compiler;

namespace Scripts.Classes.Documents.Test
{
	public partial class TestJScript : System.Web.UI.Page
	{
		//// Some random tests here.
		//// I am trying to parse JavaScript so proper JavaScript class browser can be created.
		//protected void Page_Load(object sender, EventArgs e)
		//{
		//    Compile("public class Class1 { var System = new Object{}; System.Type = function(){}; }");
		//    //Compile("(class Sample { { str: 123, a2 : 2 } } )");
		//    //example2();
		//    //example3();
		//    //example4();
		//}

		////Microsoft.JScript.Import.JScriptImport();
		//Microsoft.JScript.Vsa.VsaEngine engine = Microsoft.JScript.Vsa.VsaEngine.CreateEngine();

		//private void example1()
		//{
		//    //Microsoft.JScript.JSParser parser = new Microsoft.JScript.JSParser();
		//    object expressionResult = Microsoft.JScript.Eval.JScriptEvaluate("function sss(){ return 1254; } ; sss();", engine);
		//    Response.Write(expressionResult.ToString());
		//}

		//private void example2()
		//{
		//    string jsStr = "( {'timeString':'Time is: ' + new Date(),'dateValue':new Date()} )";
		//    Microsoft.JScript.JSObject obj;
		//    obj = (Microsoft.JScript.JSObject)JSEvaluator.EvalToObject(jsStr);
		//    Response.Write(obj["timeString"].ToString() + "<br />");
		//    Response.Write(obj["dateValue"].ToString() + "<br />");
		//    Microsoft.JScript.DateObject tmpV;
		//    tmpV = (Microsoft.JScript.DateObject)obj["dateValue"];
		//    DateTime dt = (DateTime)Microsoft.JScript.Convert.Coerce(tmpV, typeof(DateTime));
		//    Response.Write(dt.ToString() + "<br />");
		//}

		//#region BuildHelloWorldGraphExample

		//private void BuildHelloWorldGraphExample()
		//{
		//    CodeCompileUnit compileUnit = BuildHelloWorldGraph();
		//    Response.Write(compileUnit.ToString());
		//    System.CodeDom.Compiler.CodeDomProvider provider;
		//    provider = new Microsoft.JScript.JScriptCodeProvider();
		//    //provider = new Microsoft.CSharp.CSharpCodeProvider();
		//    //provider = new Microsoft.VisualBasic.VBCodeProvider();
		//    // Create the parser for the item.
		//    CodeGeneratorOptions option = new CodeGeneratorOptions();
		//    System.Text.StringBuilder sb = new System.Text.StringBuilder();
		//    System.IO.StringWriter sw = new System.IO.StringWriter(sb);
		//    provider.GenerateCodeFromCompileUnit(compileUnit, sw, option);
		//    Response.Write("sb: <pre>" + sb.ToString() + "");
		//}

		//// http://www.nedcomp.nl/support/origdocs/dotnetsdk/cpref/frlrfsystemcodedomcompilercodedomproviderclasstopic.htm
		//// Builds a Hello World program graph using System.CodeDom types
		//private CodeCompileUnit BuildHelloWorldGraph()
		//{
		//    // Create a new CodeCompileUnit to contain the program graph
		//    CodeCompileUnit CompileUnit = new CodeCompileUnit();
		//    // Declare a new namespace called Samples.
		//    CodeNamespace Samples = new CodeNamespace("Samples");
		//    // Add the new namespace to the compile unit.
		//    CompileUnit.Namespaces.Add(Samples);
		//    // Add the new namespace import for the System namespace.
		//    Samples.Imports.Add(new CodeNamespaceImport("System"));
		//    // Declare a new type called Class1.
		//    CodeTypeDeclaration Class1 = new CodeTypeDeclaration("Class1");
		//    // Add the new type to the namespace's type collection.
		//    Samples.Types.Add(Class1);
		//    // Declare a new code entry point method
		//    CodeEntryPointMethod Start = new CodeEntryPointMethod();
		//    // Create a new method invocation expression.
		//    CodeMethodInvokeExpression cs1 = new CodeMethodInvokeExpression(
		//        // Call the System.Console.WriteLine method.
		//        new CodeTypeReferenceExpression("System.Console"), "WriteLine",
		//        // Pass a primitive string parameter to the WriteLine method
		//        new CodePrimitiveExpression("Hello World!"));
		//    // Add the new method code statement.
		//    Start.Statements.Add(new CodeExpressionStatement(cs1));
		//    // Add the code entry point method to the type's members collection
		//    Class1.Members.Add(Start);
		//    return CompileUnit;
		//}

		//#endregion

		//private void example4()
		//{
		//    Microsoft.JScript.JScriptCodeProvider provider = new Microsoft.JScript.JScriptCodeProvider();
		//    // Create the parser for the item.
		//    System.CodeDom.Compiler.ICodeParser parser = provider.CreateParser();
		//    // Parse the file as CodeDom.
		//    string path = Server.MapPath("/Scripts/Classes/Documents/Test/TestScript.js");
		//    System.IO.StringReader stringReader = new System.IO.StringReader("{'timeString':'Time is: ' + new Date(),'dateValue':new Date()}");
		//    //System.IO.FileStream fs = new System.IO.FileStream(path, System.IO.FileMode.Open);
		//    //System.IO.StreamReader sr = new System.IO.StreamReader(fs);
		//    System.CodeDom.CodeCompileUnit unit = parser.Parse(stringReader);
		//    //Play with the CodeDom!!!!
		//}

		//public System.Reflection.Assembly Compile(string sourceCode)
		//{
		//    Microsoft.JScript.JScriptCodeProvider comp = new Microsoft.JScript.JScriptCodeProvider();
		//    System.CodeDom.Compiler.CompilerParameters cp = new System.CodeDom.Compiler.CompilerParameters();
		//    System.Text.StringBuilder sb = new System.Text.StringBuilder();
		//    sb.Append(sourceCode);
		//    //cp.OutputAssembly = "MyCodeManager.dll";
		//    //cp.ReferencedAssemblies.Add("System.dll");
		//    //cp.ReferencedAssemblies.Add("Microsoft.JScript.dll");
		//    //cp.CompilerOptions = "/t:library";
		//    //cp.CompilerOptions = "/fast";
		//    //cp.MainClass = "T";
		//    cp.GenerateInMemory = true;
		//    //cp.GenerateExecutable = false;
		//    //cp.IncludeDebugInformation = false;
		//    //cp.TreatWarningsAsErrors = false;
		//    //cp.IncludeDebugInformation = true;
		//    System.CodeDom.Compiler.CompilerResults results;
		//    results = comp.CompileAssemblyFromSource(cp, sb.ToString());
		//    System.CodeDom.Compiler.CompilerErrorCollection compilerErrors;
		//    if (results.Errors.Count != 0)
		//    {
		//        compilerErrors = results.Errors;
		//        for (int i = 0; i < compilerErrors.Count; i++)
		//        {
		//            Response.Write(i.ToString() + ": " + compilerErrors[i].Line.ToString() + "; " + compilerErrors[i].ErrorText);
		//        }
		//        return null;
		//    }
		//    else
		//    {
		//        Assembly asm = results.CompiledAssembly;
		//        //asm.GetType("Script").GetMethod("Main").Invoke(null, null);
		//        return asm;

		//    }
		//}

		//public object EvalJScript(string JScript)
		//{
		//    object Result = null;
		//    try
		//    {
		//        Result = Microsoft.JScript.Eval.JScriptEvaluate(JScript, engine);
		//    }
		//    catch (Exception ex)
		//    {
		//        return ex.Message;
		//    }
		//    return Result;
		//}


		//private void example3()
		//{
		//    // *** String Value
		//    object Result = EvalJScript(@"('Hello World! ' + new Date())");
		//    Response.Write("Result: "+Result.ToString()+"<br />");
		//    Response.Write("Type: " + Result.GetType().FullName);
		//    Response.Write("<hr>");

		//    // *** Return an integer or numeric - no conversion required
		//    Result = EvalJScript(@"(11 * 12)");
		//    Response.Write("Result: " + Result.ToString() + "<br />");
		//    Response.Write("Type: " + Result.GetType().FullName);
		//    Response.Write("<hr>");

		//    // *** Date value - must be converted!
		//    Result = EvalJScript(@"(new Date())");
		//    Response.Write("Result: " + Result.ToString() + "<br />");
		//    Response.Write("Type: " + Result.GetType().FullName + "<br>");
		//    // Must convert from DateObject to DateTime by coercing
		//    DateObject dateObject = (DateObject)Result;
		//    DateTime dateTime = (DateTime)Microsoft.JScript.Convert.Coerce(Result, typeof(DateTime));
		//    Response.Write("Converted to DateTime: " + dateTime);
		//    Response.Write("<hr>");

		//    // *** Block of code (last assignment is the return value)
		//    Result = EvalJScript(@"var out = 'hello<br />';   for ( var x = 1; x < 10; x++) { out = out + 'Line ' + x  + '<br>'; }");
		//    Response.Write("Result: " + Result.ToString()+"<br />");
		//    Response.Write("Type: " + Result.GetType().FullName);
		//    Response.Write("<hr>");

		//    // *** Closure - calling a JavaScript Function with return value
		//    Result = EvalJScript(@"( function Test(inputParm) {  return 'hello world ' + inputParm; } )");

		//    // *** Invoke the function and retrieve the result
		//    Closure close = (Closure)Result;

		//    // *** This requires full trust
		//    Result = close.Invoke(close, new object[1] { "Start with this bub..." });
		//    Response.Write("Result: " + Result.ToString() + "<br />");
		//    Response.Write("Type: " + Result.GetType().FullName);
		//    Response.Write("<hr>");

		//    Response.Write("<hr />// *** JSON style object<br />");
		//    Result = EvalJScript(@"( {""timeString"":'Time is: ' + new Date(),""dateValue"":new Date()} )");
		//    //Result = EvalJScript(@"( {this.timeString ='Time is: ' + new Date(); this.dateValue = new Date(); } )");
		//    Response.Write("Result: " + Result.ToString() + "<br />");
		//    JSObject obj = (JSObject)Result;
		//    DisplayMembers(obj.GetMembers(BindingFlags.Default));

		//    // *** JavaScript style property array access can be used
		//    object val = obj["dateValue"];
		//    Response.Write(Microsoft.JScript.Convert.Coerce(val, typeof(DateTime)));
		//    val = obj["timeString"];
		//    Response.Write(val);

		//    Response.Write("<hr />// *** CLASS style object<br />");
		//    Result = EvalJScript(@"var System = {}; System.Test = function(inputParm) { var o; this.ss = 2; var s2 = 3; return 'hello world ' + inputParm; }");
		//    Response.Write("Result: " + Result.ToString() + "<br />");
		//    //JavaScript Object Notation
		//    obj = (JSObject)Result;
		//    //FunctionConstructor fc = (FunctionConstructor)Result;
		//    Response.Write("obj.engine.GetItemCount() = "+obj.engine.ToString());
		//    DisplayMembers(obj.GetMembers(BindingFlags.Public | BindingFlags.Instance | BindingFlags.Static | BindingFlags.NonPublic));
			
			
		//    // *** Closure - calling a JavaScript Function with return value
		//    Microsoft.JScript.Closure fV;
		//    fV = (Microsoft.JScript.Closure)EvalJScript(@"( function Test(inputParm) { var o; this.ss = 2; var s2 = 3; return 'hello world ' + inputParm; } )");
		//    Microsoft.JScript.JSPrototypeObject prot = (Microsoft.JScript.JSPrototypeObject)fV.prototype;
		//    //Microsoft.JScript.JSConstructor cons = (Microsoft.JScript.JSConstructor)prot.constructor;

		//    DisplayObject(fV);


		//    //Response.Write(fV.GetType().FullName);


		//}

		//private void DisplayObject(Microsoft.JScript.Closure fV)
		//{
		//    Response.Write("<hr />aa: ");
		//    //Response.Write("fV.prototype" + fV.prototype.GetType().FullName + "<br />");
		//    //Response.Write("fV.length" + fV.length.ToString() + "<br />");
		//    Response.Write("get: " + fV.GetFields(BindingFlags.Public | BindingFlags.Instance | BindingFlags.Static | BindingFlags.DeclaredOnly).Length.ToString() + "<br />");
		//    System.Reflection.FieldInfo[] fields = fV.GetFields(BindingFlags.Public | BindingFlags.Instance | BindingFlags.Static | BindingFlags.NonPublic | BindingFlags.FlattenHierarchy);
		//    Response.Write("<blockquote>");
		//    DisplayFields(fields);
		//    Response.Write("</blockquote>");
		//    System.Reflection.PropertyInfo[] props = fV.GetProperties(BindingFlags.Public | BindingFlags.Instance | BindingFlags.Static | BindingFlags.NonPublic | BindingFlags.FlattenHierarchy);
		//    Response.Write("get props: " + props.Length.ToString() + "<br />");
		//    for (int i = 0; i < props.Length; i++)
		//    {
		//        Response.Write("props[" + i + "].Name = '" + props[i].Name + "' // = " + props[i].ToString() + "<br />");
		//        //if (props[i].Name == "constructor")
		//        //{
		//        //	Microsoft.JScript.FunctionConstructor c;
		//        //c = (Microsoft.JScript.FunctionConstructor)props[i].;
		//        //DisplayFunctionConstructor(c);
		//        Response.Write("<blockquote>");
		//        DisplayMethods(props[i].GetAccessors(true));
		//        DisplayParameters(props[i].GetIndexParameters());
		//        Response.Write("</blockquote>");
		//        //}
		//    }
		//    Response.Write("GetMembers");
		//    System.Reflection.MemberInfo[] mems = fV.GetMembers(BindingFlags.Public | BindingFlags.Instance | BindingFlags.Static | BindingFlags.NonPublic | BindingFlags.FlattenHierarchy);
		//    Response.Write("<blockquote>");
		//    DisplayMembers(mems);
		//    Response.Write("</blockquote>");
		//    //Microsoft.JScript.JSPrototypeObject po = (Microsoft.JScript.JSPrototypeObject)fV.prototype;
		//    System.Reflection.PropertyInfo[] mi = fV.GetProperties(System.Reflection.BindingFlags.IgnoreCase);
		//    Response.Write("mi.Length" + mi.Length.ToString() + "<br />");
		//    Response.Write("fv.ToString() = " + fV.ToString() + "<br />");
		//}

		//private void DisplayFunctionConstructor(Microsoft.JScript.FunctionConstructor constructor)
		//{
		//    Response.Write("<hr />FUNCTION CONSTRUCTOR<hr />");
		//    Response.Write("<hr />");
		//}

		//#region Display Info

		//private void DisplayFields(FieldInfo[] info)
		//{
		//    int length = info.Length;
		//    Response.Write("<hr />FieldInfo[" + length.ToString() + "]<blockquote>");
		//    for (int i = 0; i < length; i++)
		//    {
		//        Response.Write("[" + i + "] = " + info[i].MemberType.ToString() + " " + info[i].Name + "<br />");
		//    }
		//    Response.Write("</blockquote><hr />");
		//}

		//private void DisplayMethods(MethodInfo[] info)
		//{
		//    int length = info.Length;
		//    Response.Write("<hr />MethodInfo[" + length.ToString() + "]<blockquote>");
		//    for (int i = 0; i < length; i++)
		//    {
		//        Response.Write("[" + i + "] = " + info[i].MemberType.ToString() + " " + info[i].Name + "<br />");
		//    }
		//    Response.Write("</blockquote><hr />");
		//}

		//private void DisplayMembers(MemberInfo[] info)
		//{
		//    int length = info.Length;
		//    Response.Write("<hr />MemberInfo[" + length.ToString() + "]<blockquote>");
		//    for (int i = 0; i < length; i++)
		//    {
		//        Response.Write("[" + i + "] = " + info[i].MemberType.ToString()+ " " + info[i].Name+"<br />");
		//    }
		//    Response.Write("</blockquote><hr />");
		//}

		//private void DisplayParameters(ParameterInfo[] info)
		//{
		//    int length = info.Length;
		//    Response.Write("<hr />ParameterInfo[" + length.ToString() + "]<blockquote>");
		//    for (int i = 0; i < length; i++)
		//    {
		//        Response.Write("[" + i + "] = " + info[i].ParameterType.ToString() + " " + info[i].Name + "<br />");
		//    }
		//    Response.Write("</blockquote><hr />");
		//}

		//private void DisplayProperties(PropertyInfo[] info)
		//{
		//    int length = info.Length;
		//    Response.Write("<hr />PropertyInfo[" + length.ToString() + "]<blockquote>");
		//    for (int i = 0; i < length; i++)
		//    {
		//        Response.Write("[" + i + "] = " + info[i].MemberType.ToString() + " " + info[i].Name + "<br />");
		//    }
		//    Response.Write("</blockquote><hr />");
		//}

		//#endregion

	}
}
