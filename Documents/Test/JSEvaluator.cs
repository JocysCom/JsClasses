//using System;  
//using System.CodeDom.Compiler;  
//using System.Reflection;  
//using Microsoft.JScript;

//namespace Scripts.Classes.Documents.Test
//{
//    public class JSEvaluator
//    {
//        public static int EvalToInteger(string statement)
//        {
//            string s = EvalToString(statement);
//            return int.Parse(s.ToString());
//        }

//        public static double EvalToDouble(string statement)
//        {
//            string s = EvalToString(statement);
//            return double.Parse(s);
//        }

//        public static string EvalToString(string statement)
//        {
//            object o = EvalToObject(statement);
//            return o.ToString();
//        }


//        // current version with JScriptCodeProvider BEGIN  
//        ///*  

//        public static object EvalToObject(string statement)
//        {
//            return _evaluatorType.InvokeMember(
//                  "Eval",
//                  BindingFlags.InvokeMethod,
//                  null,
//                  _evaluator,
//                  new object[] { statement }
//                 );
//        }

//        static JSEvaluator()
//        {
//            JScriptCodeProvider compiler = new JScriptCodeProvider();

//            CompilerParameters parameters;
//            parameters = new CompilerParameters();
//            parameters.GenerateInMemory = true;

//            CompilerResults results;
//            results = compiler.CompileAssemblyFromSource(
//                                            parameters, _jscriptSource);

//            Assembly assembly = results.CompiledAssembly;
//            _evaluatorType = assembly.GetType("JSEvaluator.JSEvaluator");

//            _evaluator = Activator.CreateInstance(_evaluatorType);
//        }

//        private static object _evaluator = null;
//        private static Type _evaluatorType = null;
//        private static readonly string _jscriptSource =
//          @"package JSEvaluator 
//       { 
//          class JSEvaluator 
//          { 
//           public function Eval(expr : String) : Object 
//           { 
//            return eval(expr); 
//           } 
//          } 
//       }";

//        //*/  
//        // current version with JScriptCodeProvider END  


//        // deprecated version with Vsa BEGIN  
//        /* 
  
//        public static Microsoft.JScript.Vsa.VsaEngine Engine = 
//                      Microsoft.JScript.Vsa.VsaEngine.CreateEngine(); 
  
//        public static object EvalToObject(string JScript) 
//        { 
//          object Result = null; 
//          try 
//          { 
//            Result = Microsoft.JScript.Eval.JScriptEvaluate( 
//                                                    JScript, Engine); 
//          } 
//          catch (Exception ex) 
//          { 
//            return ex.Message; 
//          } 
//          return Result; 
//        } 
  
//        */
//        // deprecated version with Vsa END  
//    }
//}
