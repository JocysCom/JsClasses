namespace JocysCom.WebSites.WebApp.Scripts.Classes.Examples
{
	public class KeyValue
	{

		public KeyValue()
		{
		}

		public KeyValue(string key, string value)
		{
			_key = key;
			_value = value;
		}

		private string _key;
		public string Key
		{
			get { return _key; }
			set { _key = value; }
		}

		private object _value;
		public object Value
		{
			get { return _value; }
			set { _value = value; }
		}

	}
}