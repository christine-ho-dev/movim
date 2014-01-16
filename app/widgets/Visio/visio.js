function notifyOpener() {    
    document.querySelector('#connection').style.display = 'none';
	if(self.opener || !self.opener.Popup.win) 
        self.opener.Popup.win = self;
}

setInterval( notifyOpener, 200 );

self.focus();

/**
 * When an error occured
 */
window.onerror = function() {
	document.querySelector('#connection').style.display = 'block'; 
};

/**
 * When the popup is closed
 */
window.onunload = function() {
    //self.opener.Roster_ajaxToggleChat();
};

var Visio = {
    isVideoMuted: false,
    
    fullScreen: function() {
        var elem = document.getElementById("visio");
        var toggle = document.getElementById("toggle-screen");
        
        if(!document.fullscreenElement
        && !document.mozFullScreenElement
        && !document.webkitFullscreenElement) {  // current working methods
            toggle.className = toggle.className.replace('expand', 'contract');
            
            if (document.documentElement.requestFullscreen) {            
              document.documentElement.requestFullscreen();
            } else if (document.documentElement.mozRequestFullScreen) {
              document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
              document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else {
            toggle.className = toggle.className.replace('contract', 'expand');
            
            if (document.cancelFullScreen) {
              document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
              document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
              document.webkitCancelFullScreen();
            }
        }
    },

    log: function(content) {
        var date = new Date();
        movim_prepend([
            "log",
            "<div>["
                + date.getHours() + ":"+date.getMinutes() + ":"+date.getSeconds() + "] "
                + content +
            "</div>"]);
    },

    /*
     * @brief Call a function in the main window
     * @param Array, array[0] is the name of the function, then the params
     */
    call: function(args) {
        if( self.opener && !self.opener.closed ) {
            // The popup is open so call it
            var func = args[0];
            args.shift();
            var params = args;
            self.opener[func].apply(null, params);
        } 
    },

    toggleVideoMute: function() {
      videoTracks = localStream.getVideoTracks();
      var camera = document.getElementById("toggle-camera");

      if (videoTracks.length === 0) {
        console.log('No local video available.');
        return;
      }

      if (this.isVideoMuted) {
        for (i = 0; i < videoTracks.length; i++) {
          videoTracks[i].enabled = true;
        }
        
        camera.className = camera.className.replace('camera-off', 'camera');
        console.log('Video unmuted.');
      } else {
        for (i = 0; i < videoTracks.length; i++) {
          videoTracks[i].enabled = false;
        }

        camera.className = camera.className.replace('camera', 'camera-off');
        console.log('Video muted.');
      }

      this.isVideoMuted = !this.isVideoMuted;
    },

    toggleAudioMute: function() {
      audioTracks = localStream.getAudioTracks();
      var micro = document.getElementById("toggle-microphone");

      if (audioTracks.length === 0) {
        console.log('No local audio available.');
        return;
      }

      if (this.isAudioMuted) {
        for (i = 0; i < audioTracks.length; i++) {
          audioTracks[i].enabled = true;
        }
        
        micro.className = micro.className.replace('microphone-off', 'microphone');
        console.log('Video unmuted.');
      } else {
        for (i = 0; i < audioTracks.length; i++) {
          audioTracks[i].enabled = false;
        }

        micro.className = micro.className.replace('microphone', 'microphone-off');
        console.log('Video muted.');
      }

      this.isAudioMuted = !this.isAudioMuted;
    }

}

movim_add_onload(function()
{
    document.getElementById("call").onclick = function() { init(true); };
    document.getElementById("hang-up").onclick = function() { terminate(); };
    document.getElementById("toggle-screen").onclick = function() { Visio.fullScreen(); };
    document.getElementById("toggle-camera").onclick = function() { Visio.toggleVideoMute(); };
    document.getElementById("toggle-microphone").onclick = function() { Visio.toggleAudioMute(); };
});
