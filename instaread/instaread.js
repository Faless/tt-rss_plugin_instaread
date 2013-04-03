$(document).observe('keydown', function (e) {
  switch (e.keyCode) {
    case Event.KEY_LEFT:
      e.stop(); // prevent the default action, like horizontal scroll 
      viewArticleinInstapaper(); 
      break;
    case Event.KEY_RIGHT:
      e.stop();
      viewArticleinInstapaper();
    break;
  }
}); 
var INSTAPAPER_ID = false;

function getHeight(id) {
	var tot = $("content-insert").getDimensions().height;
	var hdr = $("POSTHDR-" + id).getDimensions().height;
	return tot - hdr;
}

var INSTARED = INSTARED ? INSTARED : new Array();
	function viewArticleinInstapaper(id) {
        if( !id ) {
          id = INSTAPAPER_ID;
        }
	if( !id ) {
	  return;
	}
	try {
		var query = "?op=pluginhandler&plugin=instaread&method=getInfo&id=" + param_escape(id);

		var d = new Date();
      var ts = d.getTime();

//		var w = window.open('backend.php?op=backend&method=loading', 'ttrss_instaread',
//			"status=0,toolbar=0,location=0,width=600,height=600,scrollbars=1,menubar=0");
		if(INSTARED[id] != true) {
		INSTARED[id] = true;
		new Ajax.Request("backend.php",	{
			parameters: query,
			onComplete: function(transport) {
				var ti = JSON.parse(transport.responseText);

				var share_url = "http://www.instapaper.com/text?" + "u=" + param_escape(ti.link);

				//w.location.href = share_url;
				var div = $("INSTARED-" + id);
				if(div == null) {
					$$("div.postContent")[0]
					.parentNode
					.appendChild(
						document.createElement("div"));
					div = $$("div.postContent")[0]
						.nextSibling;
					div.setAttribute("id", 
							"INSTARED-" + id);
				}
				$$("div.postContent")[0].hide();
				div.innerHTML = "";
				var iframe = document.createElement("iframe");
				iframe.setAttribute("src", share_url);
				iframe.setAttribute("height", getHeight(id));
				iframe.setAttribute("width", "90%");
				div.appendChild(iframe);
				div.show();
			} });

		} else {
			INSTARED[id] = false;
			if( $("INSTARED-" + id ) != null ) {
				$("INSTARED-" + id ).hide();
			}
                        $$("div.postContent")[0].show();
		}
	} catch (e) {
		exception_error("InstaRead", e);
	}
	}

