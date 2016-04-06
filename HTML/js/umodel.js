/**
 * uModel
 */
var uModel = uModel || {};
var external = null;
uModel.scene = "ubuilder-0.7.810.unity3d";
uModel.loadJson = "";
uModel.param = "";
uModel.web = {};
uModel.send = function(objName, funName, param) {
	try {
		if (uModel.web.getUnity())
			uModel.web.getUnity().SendMessage(objName, funName, param);
	} catch (e) {
	}
};
// web player 调用的外部接口
uModel.externalInterface = function() {
	var param1 = arguments[0];
	if (param1 == "homepage") {
		window.location.href = 'index.html';
	} else if (param1 == "分享") {
		ubundle.share.model.init(arguments[1]);
	} else if (param1 == "教程") {
		var lang = "";
		var stype = "mmd";
		try{
			var dataObj = eval("("+uModel.param+")");
			if (dataObj["language"] && dataObj["language"] == "en") {
				lang = "en";
			}
			if ( dataObj["stype"] == "udcb" ) {
				stype = "udcb";
			}
		} catch(e){}
		if (lang != "en") {
			if (stype == "udcb") {
				window.location.href = 'tutorial.html';
			} else {
				window.location.href = 'http://www.uinnova.cn/resource.jsp#studyvideo';
			}
		}
	} else if (param1 == "数据点") {
		var ram = Math.ceil(Math.random() * 1000);
		//(数据点,sceneId,type,UserId)
//		if (arguments[2] == "信息") {
//			ubundle.dialog.win.openurl('datapoint.html?sceneId='+arguments[1]+'&type='+ encodeURI(arguments[2]) +'&id='+encodeURI(arguments[3])+"&time="+ram,{title:'模模搭接口演示页面',bodyWidth:400,bodyHeight:250});
//		} else {
//			ubundle.dialog.win.openurl('datapoint.html?sceneId='+arguments[1]+'&type='+ encodeURI(arguments[2]) +'&id='+encodeURI(arguments[3])+"&time="+ram,{title:'模模搭接口演示页面',bodyWidth:800,bodyHeight:500});
//		}
		if (arguments[2] == "监控器") {
			ubundle.dialog.win.openurl('datapoint.html?sceneId='+arguments[1]+'&type='+ encodeURI(arguments[2]) +'&id='+encodeURI(arguments[3])+"&time="+ram,{title:'',bodyWidth:800,bodyHeight:500});
		} else {
			var lang = "";
			try{
				var dataObj = eval("("+uModel.param+")");
				if (dataObj["language"] && dataObj["language"] == "en") {
					lang = "en";
					title = arguments[1] == "CustomTexture" ? "Custom texture manage" : "Base map manager";
				}
			} catch(e){}
			if (lang == "en")
				ubundle.dialog.win.openurl('http://api.3dmmd.com/more.jsp?sceneid='+arguments[1]+'&type='+ arguments[2] +'&objectid='+arguments[3]+"&time="+ram,{title:'',bodyWidth:500,bodyHeight:400});
			else
				ubundle.dialog.win.openurl('http://api.3dmomoda.com/more.jsp?sceneid='+arguments[1]+'&type='+ arguments[2] +'&objectid='+arguments[3]+"&time="+ram,{title:'',bodyWidth:500,bodyHeight:400});
		}
		//sceneid=123&type=123&objectid=123 
	} else if (param1 == "texture") {
		//(数据点,sceneId,type,UserId)
		var title = arguments[1] == "CustomTexture" ? "自定义图片管理" : "底图管理";
		var lang = "";
		try{
			var dataObj = eval("("+uModel.param+")");
			if (dataObj["language"] && dataObj["language"] == "en") {
				lang = "_en";
				title = arguments[1] == "CustomTexture" ? "Custom texture manage" : "Base map manager";
			}
		} catch(e){}
		ubundle.dialog.win.openurl('photoeditor' + lang + '.html?type='+arguments[1],{title:title,bodyWidth:460,bodyHeight:300});
	} else if (param1 == "scene") {
		if (arguments[1] != "")
			window.location.href = 'browse.html?id=' + arguments[1];
	} else if (param1 == "objectsInfo") {
		if (arguments[1] != "")
			parent.ubundle.util.showBundleInfo(arguments[1]);
	} else if (param1 == "UrlWindow") {
		// url ,title, w , h
		ubundle.dialog.win.openurl(arguments[1],{title:arguments[2],bodyWidth:arguments[3],bodyHeight:arguments[4]});
	} else if (param1 == "HtmlWindow") {
		// html ,title, w , h
		ubundle.dialog.win.openhtml(arguments[1],{title:arguments[2],bodyWidth:arguments[3],bodyHeight:arguments[4]});
	} else if (param1 == "HideWindow") {
		ubundle.dialog.win.hide();
	} else if (param1 == "download") {
		///////////////////////
		//modify by jerry
		///////////////////////
		//window.open("rest/web/application/file/down/"+arguments[1],"downloadIframe");
		//window.open(""+arguments[1],"downloadIframe");
		var link;
		console.log("export scene");
		link = document.createElement('a');
		link.download = "uDCB_export.json";
		link.target = '_blank';
		link.href =  arguments[1];
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	} else if (param1 == "OpenUrl") {
		window.open(arguments[1],"OpenUrl",arguments[2]);
	} else if (param1 == "ExecuteHtmlInterface") {
		uModel.ExecuteHtmlInterface(arguments[1]);
	}
};
// 加载 用户场景
uModel.load = function(json) {
	if (json == null) {
		json = "";
	}
	// window.setTimeout(
	// function(){
	try{
		if ( uModel.param == "" ) {
			var obj = ubundle.remote.user.getCurrent(true);
			if (obj["content"] != "请先登录") {
				uModel.param = "{\"userid\":\""+ obj["content"]["userid"] +"\"}";
				uModel.loadParam(uModel.param);
			}
		} else {
			var p = $.parseJSON(uModel.param);
			if ( p ) {
				var obj = ubundle.remote.user.getCurrent(true);
				if (obj["content"] != "请先登录") {
					p["userid"] = obj["content"]["userid"];
					uModel.param = $.toJSON(p);
				}
				uModel.loadParam(uModel.param);
			}
		}
	}catch(e){}
	uModel.send("Singleton", "EditScene", json);
	// },
	// 1000
	// );
};
uModel.loadPreview = function(json) {
	if (json == null) {
		json = "";
	}
	uModel.send("Singleton", "PreviewScene", json);
};
uModel.loadPreviewModel = function(json) {
	if (json == null)
		return;
	uModel.send("Singleton", "LoadModel", json);
};
uModel.loadParam = function(json) {
	if (json == null) {
		json = "";
	}
	uModel.send("Singleton", "SetSceneParam", json);
};
uModel.RunCommand = function(str) {
	if (str == null)
		return;
	uModel.send("Singleton", "SetCommand", str);
};
uModel.RunFunction = function(name,str) {
	if (name == null && name != "")
		return;
	if (str == null) {
		str = "";
	}
	uModel.send("Singleton", name, str);
};
uModel.ExecuteHtmlInterface = function(json) {
};
uModel.downloadImg = function(param) {
	// alert(param);
	window.open("down.jsp?file=" + param, "downloadImag");
};
uModel.login = function() {
	login_win(function() {
		try{
			if ( uModel.param == "" ) {
				var obj = ubundle.remote.user.getCurrent(true);
				if (obj["content"] != "请先登录") {
					uModel.param = "{\"userid\":\""+ obj["content"]["userid"] +"\"}";
					uModel.loadParam(uModel.param);
				}
			} else {
				var p = $.parseJSON(uModel.param);
				if ( p ) {
					var obj = ubundle.remote.user.getCurrent(true);
					if (obj["content"] != "请先登录") {
						p["userid"] = obj["content"]["userid"];
						uModel.param = $.toJSON(p);
					}
					uModel.loadParam(uModel.param);
				}
			}
		}catch(e){}
		uModel.send("Singleton", "LoginCallback", "ok");
	});
};
uModel.SendMessage = function(msg) {
	uModel.send("Singleton", "NotifyMessage", msg);
};
uModel.SetBaseMap = function(img) {
	uModel.send("Singleton", "SetBaseMap", img);
};
uModel.state = -1;
uModel.initHeight = 600;
uModel.callback;
// jQuery(function() {
uModel.start3d = function() {
	var ram = Math.ceil(Math.random() * 1000);
	var config = {
		height : function() {
			return uModel.initHeight;
		},
        autoInstall             : false,
		enableJava              : false,
        enableJVMPreloading     : false,
        enableClickOnce         : false,
        enableUnityAnalytics    : false,
        enableGoogleAnalytics   : false,
		params : {
			enableDebugging : "1",
			disableContextMenu : true,
			logoimage : "images/loading_toplogo.png?" + ram,
			progressbarimage : "images/loading_buttom_loading.png?" + ram,
			progressframeimage : "images/loading_buttombg.png?" + ram,
			//backgroundcolor : "191919",
			// bordercolor:"202020",
			// textcolor:"FFFFFF",
            autoInstall             : false,
			enableJava              : false,
            enableJVMPreloading     : false,
            enableClickOnce         : false,
            enableUnityAnalytics    : false,
            enableGoogleAnalytics   : false
//            ,
//			baseDownloadUrl : "http://wp-china.unity3d.com/download_webplayer-3.x/",
//			autoupdateURL : "http://wp-china.unity3d.com/autodownload_webplugin-3.x",
//			autoupdateURLSignature : "02a5f78b3066d7d31fb063186a2eec36fdf1205d49c6b0808eb37ef85ed9902e2e1904d87f599238a802ba0abbfe4f18aa82dd2eb5171e99ba839a5cea9e6ea9c1be9eae505937b56fe4a5fd254cffe08958d961f42d970136b5eab9e6c2cd08b81bc8a11e5ade57dc63dcfef2248d89689e4d4feed3cdfe7374c848fd57ebd4"
		}
	};
	
	try{
		var p = $.parseJSON(uModel.param);
		if (p["stype"] == "udcb") {
			config.params["logoimage"] = "images/loading_toplogo_dcb.png" + "?" + ram;
		}
		if ( p["loadinglogo"] != undefined ) {
			config.params["logoimage"] = p["loadinglogo"] + "?" + ram;
		}
	} catch(e){}
	
	uModel.web = new UnityObject2(config);

	var $missingScreen = jQuery("#missing");
	var $brokenScreen = jQuery("#unityPlayer").find(".broken");
	$missingScreen.hide();
	$brokenScreen.hide();

	uModel.web.observeProgress(function(progress) {
		switch (progress.pluginStatus) {
		case "broken":
			jQuery("#down3d").click(function(e) {
				e.stopPropagation();
				e.preventDefault();
				uModel.web.installPlugin();
				return false;
			});
			$brokenScreen.show();
			break;
		case "missing":
			jQuery("#down3d").click(function(e) {
				e.stopPropagation();
				e.preventDefault();
				uModel.web.installPlugin();
				return false;
			});
			$missingScreen.show();
			break;
		case "installed":
			$missingScreen.remove();
			if (uModel.callback)
				uModel.callback();
			break;
		case "first":
			uModel.firstFrameCallback();
			break;
		}
	});
	uModel.web.initPlugin(jQuery("#unityPlayer")[0], uModel.scene);
};
uModel.firstFrameCallback = function() {
	//debugger;
	if (uModel.state == 0) { // 编辑
		uModel.loadParam(uModel.param);
		uModel.load(uModel.loadJson);
	} else if (uModel.state == -1) {// 预览
		uModel.loadParam(uModel.param);
		uModel.loadPreview(uModel.loadJson);
	} else if (uModel.state == 1) {
		// console.info("umodel:"+uModel.loadJson);
		// debugger;
		uModel.loadPreviewModel(uModel.loadJson);// 模型预览
	}
};
uModel.resize = function(w, h) {
	try {
		var wi = w; // document.body.offsetWidth;
		var he = h; // document.documentElement.clientHeight;
		uModel.web.getUnity().style.width = wi + "px";
		uModel.web.getUnity().style.height = he + "px";
	} catch (e) {
		// alert(e);
	}
};
// 计算窗体 resize
// window.onresize = uModel.resize;
// ///////////////
// Util
// ///////////////
uModel.getParam = function(paramName) {
	paramValue = "";
	isFound = false;
	if (location.search.indexOf("?") == 0 && location.search.indexOf("=") > 1) {
		arrSource = unescape(location.search).substring(1,
				location.search.length).split("&");
		i = 0;
		while (i < arrSource.length && !isFound) {
			if (arrSource[i].indexOf("=") > 0) {
				if (arrSource[i].split("=")[0].toLowerCase() == paramName
						.toLowerCase()) {
					paramValue = arrSource[i].split("=")[1];
					isFound = true;
				}
			}
			i++;
		}
	}
	return paramValue;
};
// 获取map size
uModel.getMapSize = function(map) {
	var size = 0;
	for ( var key in map) {
		size += 1;
	}
	return size;
};

uModel.setClipboard = function(maintext) {
	if (window.clipboardData) {
		return (window.clipboardData.setData("Text", maintext));
	} else if (window.netscape) {
		netscape.security.PrivilegeManager
				.enablePrivilege('UniversalXPConnect');
		var clip = Components.classes['@mozilla.org/widget/clipboard;1']
				.createInstance(Components.interfaces.nsIClipboard);
		if (!clip)
			return;
		var trans = Components.classes['@mozilla.org/widget/transferable;1']
				.createInstance(Components.interfaces.nsITransferable);
		if (!trans)
			return;
		trans.addDataFlavor('text/unicode');
		var str = new Object();
		var len = new Object();
		var str = Components.classes["@mozilla.org/supports-string;1"]
				.createInstance(Components.interfaces.nsISupportsString);
		var copytext = maintext;
		str.data = copytext;
		trans.setTransferData("text/unicode", str, copytext.length * 2);
		var clipid = Components.interfaces.nsIClipboard;
		if (!clip)
			return false;
		clip.setData(trans, null, clipid.kGlobalClipboard);
		return true;
	}
	return false;
};
