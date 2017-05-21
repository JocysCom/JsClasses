//=============================================================================
// Jocys.com Audio Background Effects 1.1.0.0						2008-11-26
//-----------------------------------------------------------------------------

if (typeof System === "undefined") System = {};
System.Audio = System.Audio ? System.Audio : {};
System.Drawing = System.Drawing ? System.Drawing : {};
System.Web = System.Web ? System.Web : {};

//=============================================================================
// CLASS: Uri
//-----------------------------------------------------------------------------

// If class exist then use that class.
System.Uri = System.Uri ? System.Uri : function (uriString) {
	/// <summary>
	/// Initializes a new instance of the System.Uri class with the specified URI.
	/// </summary>
	/// <param type="string" name="uriString">A URI</param>
	//---------------------------------------------------------
	// http://www.domain.com:80/default.aspx?AudioMin=0&AudioMax=100
	this.OriginalString;
	// http://www.domain.com:80/default.aspx
	this.AbsolutePath;
	// ?AudioMin=0&AudioMax=100
	this.Query;
	this.QueryParams;
	//---------------------------------------------------------
	this.GetQueryValue = function (name, ignoreCase) {
		var value = null;
		var pName;
		if (ignoreCase === true) name = name.toLowerCase();
		for (var property in this.QueryParams) {
			pName = property;
			if (ignoreCase === true) pName = property.toLowerCase();
			if (name === pName) {
				value = this.QueryParams[property];
				break;
			}
		}
		return value;
	};
	//---------------------------------------------------------
	this.GetParameters = function (uri) {
		var results = {};
		if (uri === null) return results;
		var query = uri.substring(uri.indexOf("?") + 1, uri.length);
		var arr = query.split("&");
		var item;
		var name;
		var value;
		for (var i = 0; i < arr.length; i++) {
			item = arr[i];
			name = item.substring(0, item.indexOf("="));
			value = item.substring(item.indexOf("=") + 1, item.length);
			value = unescape(value);
			results[name] = value;
		}
		return results;
	};
	//---------------------------------------------------------
	function initialize() {
		var u = arguments[0];
		this.OriginalString = u;
		this.AbsolutePath = u.indexOf("?") > -1 ? u.substring(0, u.indexOf("?") - 1) : u;
		this.Query = u.indexOf("?") > -1 ? u.substring(u.indexOf("?"), u.length) : null;
		this.QueryParams = this.GetParameters(this.Query);
	}
	initialize.apply(this, arguments);
};

//-----------------------------------------------------------------------------

// If class exist then use that class.
System.Drawing.Point = System.Drawing.Point ? System.Drawing.Point : function (x, y) {
	/// <summary>
	/// Represents an ordered pair of integer x- and y-coordinates that defines a
	/// point in a two-dimensional plane.
	/// </summary>
	//---------------------------------------------------------
	this.X;
	this.Y;
	//---------------------------------------------------------
	function initialize() {
		this.X = arguments[0] ? arguments[0] : 0;
		this.Y = arguments[1] ? arguments[1] : 0;
	}
	initialize.apply(this, arguments);
};

//-----------------------------------------------------------------------------

System.Web.GetElementPagePoint = function (el) {
	/// <summary>
	/// Get coordinates of element.
	/// </summary>
	var p = new System.Drawing.Point();
	el = typeof el === "string" ? document.getElementById(el) : el;
	var elx = el;
	var ely = el;
	p.X = elx.offsetLeft;
	while ((elx = elx.offsetParent) !== null) p.X += elx.offsetLeft;
	p.Y = ely.offsetTop;
	while ((ely = ely.offsetParent) !== null) p.Y += ely.offsetTop;
	return p;
};

System.Web.GetMousePagePoint = function (e, relative) {
	/// <summary>
	/// Get coordinates of mouse pointer.
	/// </summary>
	var p = new System.Drawing.Point();
	// FX.
	if (window.Event) {
		p.X = e.pageX;
		p.Y = e.PageY;
		if (relative) {
			p.X += de.scrollLeft ? de.scrollLeft : document.body.scrollLeft;
			p.Y += de.scrollTop ? de.scrollTop : document.body.scrollTop;
		}
	} else {
		// IE.
		var de = relative ? relative : document.documentElement;
		p.X = event.clientX;
		p.X += de.scrollLeft ? de.scrollLeft : document.body.scrollLeft;
		p.Y = event.clientY;
		p.Y += de.scrollTop ? de.scrollTop : document.body.scrollTop;
	}
	return p;
};

//-----------------------------------------------------------------------------

System.Audio.PlayerType = {
	XSPF: 1,
	WMP: 2,
	Embed: 3,
	BGSound: 4
};

System.Audio.Player = function (playerType, playerId) {
	//---------------------------------------------------------
	this.Node;
	this.PlayerType = 0;
	var me = this;
	//---------------------------------------------------------
	this.SetVolume = function (volume) {
		switch (this.PlayerType) {
			case System.Audio.PlayerType.XSPF:
				var v = Math.round(Math.pow(volume / 100, 3) * 100);
				this.Node.SetVolume(volume);
				break;
			case System.Audio.PlayerType.WMP: this.Node.Settings.volume = volume; break;
			case System.Audio.PlayerType.Embed: this.Node.SetVolume(Math.round(volume * 255 / 100)); break;
			case System.Audio.PlayerType.BGSound:
				var bv = Math.round((volume - 100) * 100);
				document.getElementById("volinfo").innerHTML = bv;
				this.Node.volume = bv;
				break;
		}
	};
	//---------------------------------------------------------
	this.Stop = function () {
		switch (this.PlayerType) {
			case System.Audio.PlayerType.XSPF: this.Node.StopTrack(); break;
			case System.Audio.PlayerType.WMP: this.Node.controls.stop(); break;
			case System.Audio.PlayerType.Embed: this.Node.Stop(); break;
			case System.Audio.PlayerType.BGSound: this.Node.controls.stop(); break;
		}
	};
	//---------------------------------------------------------
	this.Play = function () {
		switch (this.PlayerType) {
			case System.Audio.PlayerType.XSPF: this.Node.PlayTrack(); break;
			case System.Audio.PlayerType.WMP: this.Node.controls.play(); break;
			case System.Audio.PlayerType.Embed: this.Node.Play(true); break;
			case System.Audio.PlayerType.BGSound: break;
		}
	};
	//---------------------------------------------------------
	this.Rewind = function () {
		switch (this.PlayerType) {
			case System.Audio.PlayerType.XSPF: this.Node.RewindTrack(); break;
			case System.Audio.PlayerType.WMP: this.Node.controls.rewind(); break;
			case System.Audio.PlayerType.Embed: this.Node.Rewind(); break;
			case System.Audio.PlayerType.BGSound: break;
		}
	};
	//---------------------------------------------------------
	this.ChangeTrack = function (url, title) {
		if (!title) {
			title = unescape(url);
			if (title.indexOf("/") > -1) {
				var arr = title.split("/");
				title = arr[arr.length - 1];
			}
		}
		switch (this.PlayerType) {
			case System.Audio.PlayerType.XSPF:
				me.Node.StopTrack();
				me.Node.LoadSong(unescape(url), title);
				me.Node.LoadPlaylist();
				window.setTimeout(function () { me.Play(); }, 500);
				break;
			case System.Audio.PlayerType.WMP: this.Node.URL = url; break;
			case System.Audio.PlayerType.Embed: this.Node.src = url; break;
			case System.Audio.PlayerType.BGSound: this.Node.src = url; break;
		}
	};
	//---------------------------------------------------------
	function initialize() {
		var o = document.getElementById(playerId);
		this.PlayerType = playerType;
		if (o) {
			this.Node = o;
			return;
		}
		if (typeof playerType === "number") {
			this.PlayerType = playerType;
			switch (playerType) {
				case System.Audio.PlayerType.XSPF:
					// Flash palyer.
					o = document.createElement("object");
					o.setAttribute("id", playerId);
					// http://musicplayer.sourceforge.net/#documentation
					var data = "/Common/XSPF_Player/xspf_player_v3.6.swf?autoplay=1&song_url=";
					o.setAttribute("type", "application/x-shockwave-flash");
					o.setAttribute("style", "width: 100%; height: 18px;");
					o.setAttribute("data", data);
					var p1 = document.createElement("param");
					p1.setAttribute("name", "movie");
					p1.setAttribute("value", data);
					o.appendChild(p1);
					var p2 = document.createElement("param");
					p2.setAttribute("name", "allowScriptAccess");
					p2.setAttribute("value", "always");
					o.appendChild(p2);
					document.body.appendChild(o);
					break;
				case System.Audio.PlayerType.WMP:
					// Windows Media player.
					o = document.createElement("object");
					o.setAttribute("id", playerId);
					o.setAttribute("style", "width: 100%; height: 64px;");
					var agent = navigator.userAgent.toLowerCase();
					if (agent.indexOf("msie") > -1) {
						o.setAttribute("classid", "clsid:6BF52A52-394A-11d3-B153-00C04F79FAA6");
					}
					else if (agent.indexOf("firefox") > -1) {
						o.setAttribute("type", "application/x-ms-wmp");
					}
					document.body.appendChild(o);
					break;
				case System.Audio.PlayerType.Embed:
					// Embeded
					o = document.createElement("embed");
					o.setAttribute("volume", 0);
					o.setAttribute("id", playerId);
					o.setAttribute("type", "audio/x-mid");
					o.setAttribute("style", "width: 100%; height: 64px;");
					document.body.appendChild(o);
					break;
				case System.Audio.PlayerType.BGSound:
					// Windows Media player.
					o = document.createElement("object");
					o.setAttribute("id", playerId);
					o.setAttribute("style", "width: 100%; height: 64px;");
					o.setAttribute("type", "audio/midi");
					document.body.appendChild(o);
					break;
			}
		}
		this.Node = o;
	}
	initialize.apply(this, arguments);
};

//-----------------------------------------------------
// Delayed Track Switching
//-----------------------------------------------------

System.Audio.TrackSwitcher = function (player) {
	/// <summary>
	/// Controls System.Audio.Player.
	/// </summary>
	//---------------------------------------------------------
	this.Player;
	//---------------------------------------------------------
	var me = this;
	// Used by PlayTrackTimeout method.
	var currentTrack;
	var currentTimerId = 0;
	var currentDelay = 1000;
	// Used by volume control methods.
	this.VolumeStepIncrease = 10;
	this.VolumeStepDecrease = 10;
	this.VolumeStep;
	this.Volume = 0;
	this.VolumeMin = 0;
	this.VolumeMinDefault = 0;
	this.VolumeMax = 100;
	this.VolumeMaxDefault = 100;
	this.VolumenTimerAvailable = true;
	this.RescheduleWhenVolumeZero = true;
	var TrackRequested = null;
	var TrackCurrent = null;
	//---------------------------------------------------------
	this.PlayTrackTimeout = function (track) {
		/// <summary>
		/// Swich to new track only if mouse spends some time on it.
		/// In this case we will avoid track change if mouse will move
		/// out from track area for very short period of time.
		/// </summary>
		if (currentTrack !== track) {
			this.StopTrackTimeout();
			currentTrack = track;
			currentTimerId = window.setTimeout(function () {
				me.SheduleTrackChange(track && track.href ? track : null);
			}, currentDelay);
		}
	};
	//---------------------------------------------------------
	this.StopTrackTimeout = function () {
		if (currentTimerId > 0) window.clearTimeout(currentTimerId);
	};
	//---------------------------------------------------------
	this.SheduleTrackChange = function (track, increaseSound) {
		TrackRequested = track;
		// If current track is different from requested then...
		if (TrackRequested !== TrackCurrent) {
			// If volume is high then...
			if (this.Volume > 0) {
				// Decrease sound first.
				if (TrackCurrent === null) {
					this.Volume = 0;
				} else {
					this.DecreaseSound();
					return;
				}
			}
			if (this.Volume === 0) {
				TrackCurrent = track;
				if (track === null) {
					this.Player.Stop();
				} else {
					// Analyse track info.
					var uri = new System.Uri(track.href);
					this.VolumeMin = uri.QueryParams.VolumeMin ? parseInt(uri.QueryParams.VolumeMin) : this.VolumeMinDefault;
					this.VolumeMax = uri.QueryParams.VolumeMax ? parseInt(uri.QueryParams.VolumeMax) : this.VolumeMaxDefault;
					// Change track.
					this.Player.ChangeTrack(uri.AbsolutePath, track.title);
					this.Player.SetVolume(this.Volume);
					this.Player.Play();
					if (increaseSound !== false) this.IncreaseSound();
				}
			}
		} else {
			if (TrackCurrent !== null && increaseSound !== false) {
				this.IncreaseSound();
			}
		}
	};
	//---------------------------------------------------------
	// This function will start decrease of volume.
	this.DecreaseSound = function () {
		this.VolumeStep = -1 * this.VolumeStepDecrease;
		if (this.VolumenTimerAvailable) {
			this.VolumenTimerAvailable = false;
			this.StepSound();
		}
	};
	//---------------------------------------------------------
	this.IncreaseSound = function () {
		this.VolumeStep = this.VolumeStepIncrease;
		if (this.VolumenTimerAvailable) {
			this.VolumenTimerAvailable = false;
			this.StepSound();

		}
	};
	//---------------------------------------------------------
	// This function will increase || decrease background sound && restarts if(neccessary.
	this.StepSound = function () {
		var allow = false;
		if (this.VolumeStep > 0) {
			if (this.Volume < this.VolumeMax) allow = true;
		} else {
			if (this.Volume > this.VolumeMin) allow = true;
		}
		if (allow) {
			// Count new sound value.;
			var newVolume = this.Volume + this.VolumeStep;
			if (newVolume > this.VolumeMax) newVolume = this.VolumeMax;
			if (newVolume < this.VolumeMin) newVolume = this.VolumeMin;
			this.Volume = newVolume;
			// Convert value to create diferent volume fade.;
			this.Player.SetVolume(this.Volume);
			window.setTimeout(function () { me.StepSound(); }, 500);
		} else {
			this.VolumenTimerAvailable = true;
		}
		if (this.Volume === 0) {
			// Try to set requested track again. 
			if (this.RescheduleWhenVolumeZero) {
				this.SheduleTrackChange(TrackRequested);
			}
		}
	};
	//---------------------------------------------------------
	function initialize() {
		this.Player = arguments[0];
	}
	initialize.apply(this, arguments);

};

//-----------------------------------------------------------------------------
// System.Audio.Example
//-----------------------------------------------------------------------------

System.Audio.Example = {};

System.Audio.Example.Player = null;
System.Audio.Example.TrackSwitcher = null;
System.Audio.Example.PageContentDiv = null;
System.Audio.Example.Tracks = null;

System.Audio.Example.PlayerInfo = function (s) {
	document.getElementById("EyePosition").value = s;
};

System.Audio.Example.Window_Load = function (e) {
	var items = document.getElementsByTagName("a");
	System.Audio.Example.PageContentDiv = document.getElementById("PageContentScrollableDiv");
	System.Audio.Example.Tracks = [];
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		if (item.className === "Track") {
			item.Point = System.Web.GetElementPagePoint(item);
			System.Audio.Example.Tracks.push(item);
		}
	}
	if (System.Audio.Example.Tracks.length === 0) return;
	// Init Player
	System.Audio.Example.Player = new System.Audio.Player(System.Audio.PlayerType.XSPF, "PlayerObject");
	// Don't add player if already exists.
	//document.getElementById("PlayerPlaceHolder").appendChild(Player.Node);
	// Control Player through track switcher.
	System.Audio.Example.TrackSwitcher = new System.Audio.TrackSwitcher(System.Audio.Example.Player);
	// Attach events to checkbox.
	var cbx = document.getElementById("AudioEnabledCheckBox");
	if (window.attachEvent) cbx.attachEvent("onclick", System.Audio.Example.AudioEnabledCheckBox_Click);
	else cbx.addEventListener("click", System.Audio.Example.AudioEnabledCheckBox_Click, true);
	if (cbx.checked) System.Audio.Example.MouseTracking(true);
};

System.Audio.Example.AudioEnabledCheckBox_Click = function (e) {
	window.setTimeout(System.Audio.Example.AudioEnableCheckBoxControl, 200);
};

System.Audio.Example.AudioEnableCheckBoxControl = function () {
	var cbx = document.getElementById("AudioEnabledCheckBox");
	if (cbx.checked) {
		System.Audio.Example.MouseTracking(true);
	} else {
		System.Audio.Example.MouseTracking(false);
		System.Audio.Example.TrackSwitcher.StopTrackTimeout();
		System.Audio.Example.Player.Stop();
	}
};

System.Audio.Example.Window_MouseMove = function (e) {
	var y = 0;
	if (window.attachEvent) {
		y = System.Web.GetMousePagePoint(e, System.Audio.Example.PageContentDiv).Y;
	} else {
		y = e.pageY;
		if (System.Audio.Example.PageContentDiv) y += System.Audio.Example.PageContentDiv.scrollTop;
	}
	System.Audio.Example.MouseResults(y);
};

System.Audio.Example.Window_MouseWheel = function (e) {
	var y = 0;
	var delta = 0;
	if (window.attachEvent) {
		// IE case, delta is multiple of 120
		delta = event.wheelDelta / 120;
		y = System.Web.GetMousePagePoint(e, System.Audio.Example.PageContentDiv).Y;
	} else {
		// FX case, delta is multiple of 3
		delta = -e.detail / 3;
		y = e.pageY - delta * 40 - 17 * delta;
		if (System.Audio.Example.PageContentDiv) y += System.Audio.Example.PageContentDiv.scrollTop;
	}
	System.Audio.Example.MouseResults(y);
};

System.Audio.Example.MouseResults = function (y) {
	var track = null;
	for (var i = 0; i < System.Audio.Example.Tracks.length; i++) {
		var t = System.Audio.Example.Tracks[i];
		if (y >= t.Point.Y) track = t ? t : null;
		if (y < t.Point.Y) break;
	}
	var file = track ? unescape(track.href) : "";
	if (file.indexOf("/") > -1) {
		var arr = file.split("/");
		file = arr[arr.length - 1];
	}
	System.Audio.Example.PlayerInfo(" Vertical Mouse Position[" + y + "], V[" + System.Audio.Example.TrackSwitcher.Volume + "] " + System.Audio.Example.Tracks.length + "[" + i + "] " + file);
	System.Audio.Example.TrackSwitcher.PlayTrackTimeout(track);
};

System.Audio.Example.MouseTracking = function (enable) {
	/// <summary>
	/// Enable/disable mouse tracking.
	/// <summary>
	if (enable) {
		// Attach mouse events to windows.
		if (window.attachEvent) document.attachEvent("onmousemove", System.Audio.Example.Window_MouseMove);
		else document.addEventListener("mousemove", System.Audio.Example.Window_MouseMove, true);
		// Attach scroll events to windows.
		if (window.attachEvent) document.attachEvent("onmousewheel", System.Audio.Example.Window_MouseWheel);
		else document.addEventListener("DOMMouseScroll", System.Audio.Example.Window_MouseWheel, true);
	} else {
		// Detach mouse events from windows.
		if (window.detachEvent) document.detachEvent("onmousemove", System.Audio.Example.Window_MouseMove);
		else document.removeEventListener("mousemove", System.Audio.Example.Window_MouseMove, true);
		// Detach scroll events to windows.
		if (window.attachEvent) document.detachEvent("onmousewheel", System.Audio.Example.Window_MouseWheel);
		else document.removeEventListener("DOMMouseScroll", System.Audio.Example.Window_MouseWheel, true);
	}
};

// Attach mouse movement events.
if (window.attachEvent) window.attachEvent("onload", System.Audio.Example.Window_Load);
else window.addEventListener("load", System.Audio.Example.Window_Load, true);
