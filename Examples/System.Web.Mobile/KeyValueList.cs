using System.Collections.Generic;
using System.Web.Script.Serialization;
using System.Linq;

namespace JocysCom.WebSites.WebApp.Scripts.Classes.Examples
{
	public class KeyValueList : List<KeyValue>
	{
		public void Load(string value, bool decompress)
		{
			var a = Helper.Decode<KeyValue[]>(value, decompress);
			this.AddRange(a);
		}

		public void SetValue(string key, object value)
		{
			var ser = new JavaScriptSerializer();
			var v = ser.Serialize(value);
			var kv = this.FirstOrDefault(x => x.Key == key);
			if (kv == null) this.Add(new KeyValue(key, v));
			else kv.Value = v;
		}

		public T GetValue<T>(string key)
		{
			var ser = new JavaScriptSerializer();
			var s = (string)this.First(x => x.Key == key).Value;
			return ser.Deserialize<T>(s);
		}

	}
}