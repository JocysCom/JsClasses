using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Security.Cryptography;
using System.Web.Script.Serialization;
using System.Text;

namespace JocysCom.WebSites.WebApp.Scripts.Classes.Examples
{
	/// <summary>
	/// Summary description for System.Web.Mobile
	/// </summary>
	[WebService(Namespace = "http://tempuri.org/")]
	[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
	[System.ComponentModel.ToolboxItem(false)]
	// To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
	[System.Web.Script.Services.ScriptService]
	public class System_Web_Mobile : System.Web.Services.WebService
	{

		// 1024-bit RSA Key.
		private string xmlParams = "" +
			"<RSAKeyValue>" +
			"<Modulus>n6Wg+SgQaBnxo1Sjsik41B3KD0Bxad8uSbVQBWQK0PXoMKS48aJKLeeYfKs4sVkgXlbLIBt5Tj6t5HHd6eSyKKEjmPScvVkEaBQMEqdi/nBgkZ8bpQ+g2dkK/+PN+CC9YAhUB2RGiPCe+PfVOtqdZ4LlPBzVD6zEw9g4oWSaDTc=</Modulus>" +
			"<Exponent>AQAB</Exponent>" +
			"<P>32mwLycaSn2cS/Lx/VLKNfRQ0r0DdlfCxp9+91pBBvR30O08WySGcGPDxxaB8vXVEF6VevyWlZEz2YFThafQqQ==</P>" +
			"<Q>tu7m2G8a8ofRPhaKkhB9K/zXZLP4Pe8G4XcXP0vHto6Qa9FkwyPFp9+eLOI5YZiRa0ETe1zdGv/4oKhZNx063w==</Q>" +
			"<DP>rpU7bY2D+QPxeFQwEAJ7K/BwnE3B/9+SwH3wzMBFona1jplkmeCQAhGj8ta+06qRRgpzizkJP3XJa8WpC//YiQ==</DP>" +
			"<DQ>ElG8VmJR/YWyY5hYSiZSkqwgWdpX+sPMGZoWfuU028hNGC8A+zXC3nvbWD1TZ72imm4K6Gi1T7XgjR4uyQEpWw==</DQ>" +
			"<InverseQ>ZS5bfzDzq+qsDq78sPJn0qPbmH3JcFjpU2lQySwRBkJaH+2WUm7jI4eWcHiwmmU3/niyO3A5KX1jaW5NlIo0Zg==</InverseQ>" +
			"<D>RRHhnSpqPr/KvYFm+TPAdHUW8JZO+yEl45ngLxTjYRijBjieE1zFfyrN3FIvyvrmeCpQ42k/iEyx6z4gZosdUKrovcKQqt6B6F9BUzK63bYPGalSOsddJdgoRng16OojWcyorIDnx+dLaQCwqzOS1j0RKuLhY9EvePOmwM7D52E=</D>" +
			"</RSAKeyValue>";

		[WebMethod(EnableSession = true, Description = "Post Data to Server")]
		public void PostData(DataType key, string value)
		{
			var r = new KeyValueList();
			r.SetValue("ErrorCode", 0);
			r.SetValue("ErrorMessage", "");
			r.SetValue("DataType", Convert.ToInt32(key));
			switch (key)
			{
				case DataType.GetRsaKey:
					// Tell IIS to use Machine Key store or creation of RSA service provider will fail.
					var cspParams = new CspParameters();
					cspParams.Flags = CspProviderFlags.UseMachineKeyStore;
					// Create a new instance of RSACryptoServiceProvider.
					var rsa = new System.Security.Cryptography.RSACryptoServiceProvider(1024, cspParams);
					// Import parameters from xml.
					rsa.FromXmlString(xmlParams);
					// Export RSA key to RSAParameters and include:
					//    false - Only public key required for encryption.
					//    true  - Private key required for decryption.
					var rsaPublicKey = rsa.ToXmlString(false);
					r.SetValue("RsaPublicKey", rsaPublicKey);
					break;
				case DataType.SendProfile:
					r.Load(value, true);
					var profile = r.GetValue<UserProfile>("UserProfile");
					var card = r.GetValue<Card>("Card");
					// Get password from RSA encrypted data.
					var password = Helper.RsaDecrypt(card.EncryptedPass, xmlParams);
					var s = Helper.AesDecrypt(password, card.EncryptedData);
					card = Helper.DeSerialize<Card>(s);
					r.SetValue("Message", string.Format("Server decrypted '{0}' card with number: {1}", card.Name, card.Number));
					break;
				default:
					break;
			}
			Helper.ResponseScript(r, true);
		}

		[WebMethod(EnableSession = true, Description = "Returns all the time zones about which information is available.")]
		public void GetSystemTimeZones()
		{
			var text = "System.TimeZoneInfo._Data = [\r\n";
			var zones = TimeZoneInfo.GetSystemTimeZones().OrderBy(x => x.BaseUtcOffset.TotalMinutes).ToArray();
			for (int i = 0; i < zones.Length; i++)
			{
				var zone = zones[i];
				var item = new List<object>();
				item.Add(zone.DisplayName);
				item.Add(zone.Id);
				item.Add(zone.BaseUtcOffset.TotalMinutes);
				item.Add(zone.SupportsDaylightSavingTime);
				item.Add(zone.StandardName);
				item.Add(zone.DaylightName);
				if (i > 0) text += ",\r\n";
				text += "\t" + Helper.Serialize(item.ToArray());
			}
			text += "\r\n];\r\n";
			Helper.ResponseText(text);
		}

		[WebMethod(EnableSession = true, Description = "Retrieves all the time zone adjustment rules available.")]
		public void GetSystemAdjustmentRules()
		{
			var text = "System.TimeZoneInfo.AdjustmentRule._Data = [\r\n";
			var zones = TimeZoneInfo.GetSystemTimeZones().OrderBy(x => x.BaseUtcOffset.TotalMinutes).ToArray();
			var line = 0;
			for (int i = 0; i < zones.Length; i++)
			{
				var zone = zones[i];
				var rules = zone.GetAdjustmentRules();
				for (int r = 0; r < rules.Length; r++)
				{
					var rule = rules[r];
					var item = new List<object>();
					if (line > 0) text += ",\r\n";
					var format = "\t[\"{0:yyyy-MM-dd}\",\"{1:yyyy-MM-dd}\",{2,3},{3},{4},{5},{6,2},\"{7:HH:mm:ss}\",{8},{9},{10},{11},{12,2},\"{13:HH:mm:ss}\",{14},{15}]";
					text +=
					string.Format(format,
						rule.DateStart.ToUniversalTime(), // 0
						rule.DateEnd.ToUniversalTime(), // 1
						rule.DaylightDelta.TotalMinutes, // 2
						rule.DaylightTransitionStart.Day, // 3
						(int)rule.DaylightTransitionStart.DayOfWeek, // 4
						rule.DaylightTransitionStart.IsFixedDateRule ? "1" : "0", // 5
						rule.DaylightTransitionStart.Month, // 6
						rule.DaylightTransitionStart.TimeOfDay, // 7
						rule.DaylightTransitionStart.Week, // 8
						rule.DaylightTransitionEnd.Day, // 9
						(int)rule.DaylightTransitionEnd.DayOfWeek, // 10
						rule.DaylightTransitionEnd.IsFixedDateRule ? "1" : "0", //11
						rule.DaylightTransitionEnd.Month, // 12
						rule.DaylightTransitionEnd.TimeOfDay, // 13
						rule.DaylightTransitionEnd.Week, // 14
						Helper.Serialize(zone.Id) // 15
					);
					line++;
				}
			}
			text += "\r\n];\r\n";
			Helper.ResponseText(text);
		}


	}

}
