/*	VideoPlayer
 		author: niels.seidel@nise81.com

 - simultanous playback of two clips
 - refine cycle including event bindings
 - change all 'bind's inside loadUI into extra functions
 - visualize loaded bytes
 - audio only?
 - seek?
 - manage to play parts of a video: http://www.xiph.org/oggz/doc/group__seek__api.html
- options: supported codecs / mime types
 - ui control for playbackrate
 - further: API calls: http://code.google.com/apis/youtube/js_api_reference.html
 - good fullscreen example: http://demo.paranoidr.de/jVideo/
 - loading video 2 time seem strange



 */


var Video = $.inherit(
{
	/* constructor */
  __constructor: function(options, main) {
		this.options = $.extend(this.options, options);
		this.main = main;
		this.spinner = new Spinner(this.spinner_options);
  	this.loadVideo('./', 0); // load nil video to build player interface
  	this.loadUI();
  },

	name: 'video player',
	// defaults
	options: {main: null, selector: '#video1', width: 500, height: 375, wrapControls: '', childtheme: ''},
	video: null,
	main: null,
	url: '',
	video_controls: null,
	video_volume: 0,
  video_container: null,
	video_wrap: null,
	play_btn: $(''),
	add_btn: $(''),
	video_seek: null,
	video_timer: null,
	volume: null,
	muted: false,
	volume_btn: null,
	seeksliding: null,
	interval: 0,
	isSequence: false,
	seqList: [],
	seqNum: null,
	seqLoop: false,
	spinner : false,
	spinner_options : {
  	lines: 6, // The number of lines to draw
  	length: 0, // The length of each line
  	width: 20, // The line thickness
  	radius: 20, // The radius of the inner circle
  	color: '#003366', // #rgb or #rrggbb
  	speed: 1, // Rounds per second
  	trail: 89, // Afterglow percentage
  	shadow: false, // Whether to render a shadow
  	hwaccel: false, // Whether to use hardware acceleration
  	className: 'spinner', // The CSS class to assign to the spinner
  	zIndex: 2e9, // The z-index (defaults to 2000000000)
  	top: 'auto', // Top position relative to parent in px
  	left: 'auto' // Left position relative to parent in px
	},
	buffclick: 0,

	/* load video */
	// param: url= url of video; seek = time seek within video in seconds
	loadVideo: function(url, seek) { 
		//this.startSpinning();
		
		var supportedCodec = this.detectVideoSupport();
		if (supportedCodec == '') {
			
  					var flashvars = {};
				flashvars.mediaURL = "videos/iwrm_cullmann.mp4";
				flashvars.teaserURL = "media/nice-flowers.jpg";
				flashvars.allowSmoothing = "true";
				flashvars.autoPlay = "true";
				flashvars.buffer = "6";
				flashvars.showTimecode = "true";
				flashvars.loop = "false";
				flashvars.controlColor = "0x3fd2a3";
				flashvars.controlBackColor = "0x000000";
				flashvars.scaleIfFullScreen = "true";
				flashvars.showScalingButton = "true";
				flashvars.defaultVolume = "100";
				flashvars.crop = "false";
				//flashvars.onClick = "toggleFullScreen";
		
			var params = {};
				params.menu = "false";
				params.allowFullScreen = "true";
				params.allowScriptAccess = "always"
		
			var attributes = {};
				attributes.id = "nonverblaster";
				attributes.bgcolor = "#000000"
		
			//swfobject.embedSWF("NonverBlaster.swf", this.options.selector, "300", "288", "9", "js/expressinstall.swf", flashvars, params, attributes);
			
		}
		var _this = this;
		
		this.url = url;
	  this.video = document.getElementsByTagName('video')[0];
	  this.video.pause();
		this.video = $.extend(this.video, {
			loop: false,
	  	preload: 'metadata', // 'metadata' | true ??
	  	autoplay: false,
	  	controls: false,
	  	poster: 'http://localhost/ihi/mediawiki119/extensions/ViWiki/img/placeholder.jpg',
	//  	width: this.options.width,
	//  	height: this.options.height,
	  	onerror: function(e) { _this.errorHandling(e); }
		});

		// event binding: on can play
		this.video.addEventListener('readystate', function(e) { _this.readyStateHandler(e); });

		// event binding: on can play
		this.video.addEventListener('loadedmetadata', function(e) {});

		// event binding: on can play
		this.video.addEventListener('canplay', function(e) { _this.canPlayHandler(e); });

		// event binding: on duration change; trigger when duration is known
		this.video.addEventListener('durationchange', function(e, seek) { _this.durationChangeHandler(e, seek); });

		// event binding: on time update
		this.video.addEventListener('timeupdate', function(e) { _this.timeUpdateHandler(e); });

		// event binding: on ended
		$(this.video).bind('ended', function(e) { _this.endedHandler(e); }, false);

		/*
		if(Number(seek) > 0){
			this.video.addEventListener("timeupdate", function() { //alert(_this.video.seekable.end(_this.buffclick));
		}, false);
		*/

	 	// get sources and load video
		$(this.video).html(this.createSource(url, supportedCodec), this.video.firstChild);
		this.video.load(); // not needed ?!
	},


	/* HTML5 playback detection */
	// 		returns: mime type of supported video or empty string if there is no support
	//		called-by: loadVideo()
	// 		toDo: check support for video element
	detectVideoSupport: function() {
		var canPlay = '';
		var dummy_video = document.createElement('video');

		// prefer webm even if ogv or mp4 is available
		if (dummy_video.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"') != '') {
			canPlay = 'video/mp4';
		}/*else if(dummy_video.canPlayType('video/ogg; codecs="theora, vorbis"') != ''){
			canPlay = 'video/ogv';
		}*/else if (dummy_video.canPlayType('video/webm; codecs="vp8, vorbis"') != '') {
			canPlay = 'video/webm';
		}

		//
		if (canPlay == '') {
			$('#content').html('<h3>We apologize that IWRM-education is currently not supported by your browser.</h3>The provided video material can be played on Mozilla Firefox, Google Chrome and Opera. If you prefer Internet Explorer 9 you need to install a <a href="https://tools.google.com/dlpage/webmmf">webm video extension</a> provided by Google. In the near future we are going to server further video formats which will be supported by all major browsers.<br /><br /> Thank you for your understanding.');
		}

		return canPlay;
	},

	/* load sequence */
	loadSequence: function(sources, num) { 
		this.seqList = sources;
		this.isSequence = true;
		if (num == null) {
			this.seqNum = 0;
		}else {
			this.seqNum = num % this.seqList.length;
		}
		this.loadVideo(this.seqList[this.seqNum]['url'], 0);

	},

	/* build video source element
			param: src = video url; mime_type = mime_type of video
			returns: video source element including src and type attribute
	*/
	createSource: function(src, mime_type) {
  	var source = document.createElement('source');
  	// extract file type out of mime type
  	source.src = src.replace('.webm', '.' + mime_type.replace('video/', ''));
  	// set mime type
  	source.type = mime_type;
  	return source;
	},

	/* load UI */
	loadUI: function() {
		var _this = this;
		var options = {theme: this.options.theme, childtheme: this.options.childtheme};
		var video_wrap = $('<div></div>').addClass('vi2-video-player').addClass(options.theme).addClass(options.childtheme);
		this.video_controls = $('<div class="vi2-video-controls"><a class="vi2-video-play" title="Play/Pause"></a><div class="timelines"><div class="vi2-video-seeklink"></div><div class="vi2-video-seek"></div></div><div class="vi2-btn-box"></div><div class="vi2-video-timer"></div><div class="vi2-volume-box"><div class="vi2-volume-slider"></div><a class="vi2-volume-button" title="Mute/Unmute"></a></div></div>');

		$(this.options.wrapControls)
			.wrap(video_wrap)
			.after(this.video_controls);
		this.video_container = $(this.options.wrapControls).parent('.vi2-video-player');

		this.play_btn = $('.vi2-video-play', this.video_container);
		this.video_seek = $('.vi2-video-seek', this.video_container);
		this.video_timer = $('.vi2-video-timer', this.video_container);
		this.volume = $('.vi2-volume-slider', this.video_container);
		this.volume_btn = $('.vi2-volume-button', this.video_container);
		this.add_btn = $('.vi2-btn-box', this.video_container);


		// keep the controls hidden
		$(this.video).removeAttr('controls');

		//
		$(this.volume).slider({
			value: _this.video_volume,
			orientation: 'vertical',
			range: 'min',
			max: 1,
			step: 0.05,
			animate: true,
			slide: function(e,ui) {
				_this.muted = false;
				$('video').attr('volume', ui.value);
				_this.video_volume = ui.value;
			}
		});

		// event bindings
//		$(this.video).parent().bind('mouseover', function(e) { _this.video_controls.show();			});

//		$(this.video).parent().bind('mouseout', function(e) { _this.video_controls.hide();					});


		this.play_btn.bind('click', function() {
			_this.play();
		});

		$(this.video).bind('play', function(e) {
			_this.play_btn.addClass('vi2-paused-button');
			_this.main.play();
			$('.screen').remove();
		});

		$(this.video).bind('pause', function(e) {
			_this.play_btn.removeClass('vi2-paused-button');
			_this.main.pause();
		});


		// keyboard
		$('body').unbind('keydown').bind('keydown', function(e) {
			if (e.which == 32) {
				//_this.play(); // disabled for wiki purpose
			}
		});


		this.volume_btn.bind('click', function(e) {
			_this.muteVolume();
		});

		//this.add_btn.text('add tag').click(function(e){  _this.main.widget_list['tags'].addTags(); });


	},



	/* create seek slider */
	createSeek: function(range, data) {
		var _this = this;
		if (this.video.readyState) {
			clearInterval(this.interval);
			clearInterval(this.interval);

			var video_duration = $(this.options.selector).attr('duration');
			
			var options = {
				step: 0.01,
				orientation: 'horizontal',
				range: range,
				//value: 0,
				max: video_duration,
				animate: false,
				//slide: function(event, ui) { _this.seeksliding = true; },
				stop : function(e,ui) {
						_this.seeksliding = false;
						$(_this.video).trigger('play');
						$(_this.options.selector).attr('currentTime', Math.ceil(ui.value)); // XXX bugy / webkit fix
				},
				start : function(event, ui) {
						_this.buffclick++;
						_this.seeksliding = true;
				}
			};
			
			if(range){ 
				options.range = true; 
				options.values = [ this.currentTime(), this.currentTime() + 15, this.currentTime() + 20];
				this.video_seek.bind(	'slidechange',  function( event, ui ){
					_this.range_min = _this.video_seek.slider('option','values')[0];
					_this.range_max = _this.video_seek.slider( 'option','values')[2];
				});
			}else{
				options.value = this.currentTime();
			}
			this.video_seek.slider( "destroy" )
			this.video_seek.slider(options);
			this.video_seek.find('.ui-slider-range').mousedown(function() {
      		return false;
			});
			//if(range){}
			
			this.video_controls.show();
		} else {
			// try reinitiate the slider as long th e
			this.interval = setInterval(function() { _this.createSeek(); }, 150);
		}
	},
	
	range_min : 0,
	range_max: 0,
	mode : 'play',
	
	/* -- */
	switchToMode : function(mode, data){
		switch(mode){
			case 'edit' :
				this.mode = 'edit'; 
				this.createSeek(true);
				break;
			case 'play' :
				this.mode = 'play';
				this.createSeek(false);
				
							//$('div.vi2-video-seek').find('.ui-slider-range').first().css('left', '0%');
				/*			
							$('div.vi2-video-seek').find('.ui-slider-handle').last().css('left', '0%');
							$('div.ui-slider-range').css('left', '0%');
							$('div.ui-slider-range').css('width', '50%');
				*/
				break;
				
		}
	},


/** EVENT HANDLER *************************/

	/* updates after seeking*/
	seekUpdate: function() {
		var currenttime = $(this.options.selector).attr('currentTime');
		if (!this.seeksliding && this.mode == 'edit' ) {
			//this.video_seek.slider('values', [this.range_min, currenttime, this.range_max ]);
		}else if( !this.seeksliding && this.mode == 'play'){
				this.video_seek.slider('value', currenttime); 
		}
		this.timeUpdate();
	},

	/* time update */
	timeUpdate: function() {
		this.video_timer.text(this.timeFormat($(this.options.selector).attr('currentTime')));// + ' / ' + this.timeFormat($(this.options.selector).attr('duration')));
	},

	/* mute volume */
	muteVolume: function() {
		if (this.muted) {
			this.volume.slider('value', this.video_volume);
			this.volume_btn.removeClass('vi2-volume-mute');
		} else {
			this.volume.slider('value', 0);
			this.volume_btn.addClass('vi2-volume-mute');
		}
		$('video').attr('volume', this.video_volume);
		this.muted = ! this.muted;
	},


	// event handler: on can play
	readyStateHandler: function(e) {
		// notify observer about new video
		main.updateVideo(this.seqList[this.seqNum]['id'], this.seqNum);
	},


	// event handler: on can play
	canPlayHandler: function(e) {
		// play_btn playpause.disabled = false;
		//	main.updateVideo(_this.seqList[_this.seqNum]['id'], _this.seqNum);
	},


	// event handler: on duration change; trigger when duration is known
	durationChangeHandler: function(e, seek) {
		this.createSeek();
		//alert(_this.video.seekable.start(0)+' - '+_this.video.seekable.end(0));
		if (Number(seek) > 0) {
			this.currentTime(seek); // bugy in production use or on remote sites
		}
		$(main).trigger('player.ready', [this.seqList[this.seqNum]['id'], this.seqNum]);
	},


	// event handler: on time update
	timeUpdateHandler: function(e) {
		if(this.mode == 'edit'){
			if(this.currentTime() < this.range_min){
				this.currentTime(this.range_min);
			}
			if(this.currentTime() > this.range_max){
				this.currentTime(this.range_max);
			}	
		}
		this.seekUpdate();
		//var lastBuffered = this.video.buffered.end(this.video.buffered.length-1);
		if (this.video.readyState == 2) {
			// load spinner
			this.startSpinning();
			$('#debug').html('loading');
		}else if (this.video.readyState == 4) {
			this.stopSpinning();
			$('#debug').html('');
		}
/*
		return;
				$('#debug').html(this.video.readyState+' seekabel '+this.video.seekable.end(0)+'    -  start:'+this.video.buffered.start(this.buffclick)+' end: '+this.video.buffered.end(this.buffclick)+'\n');
				if (seek < this.video.seekable.end(this.buffclick) && seek > 0 ) {
						this.currentTime(seek);
				}
				*/
	},


	// event handler: on ended
	endedHandler: function(e) {
		this.main.ended();
		this.video.removeEventListener('ended', arguments.callee, false);
		this.play_btn.removeClass('vi2-paused-button');
		// load next video clip if its a sequence
		if (this.isSequence && ((this.seqNum + 1) < this.seqList.length || this.seqLoop)) {
			this.seqNum = (this.seqNum + 1) % this.seqList.length;
			this.loadVideo(this.seqList[this.seqNum]['url']);
		}else {
			$(main.player).trigger('video.end', null);
		}
	},






/** UTILS *************************/

	/* formate second to decimal view*/
	timeFormat: function(seconds) {
		var m = Math.floor(seconds / 60) < 10 ? '0' + Math.floor(seconds / 60) : Math.floor(seconds / 60);
		var s = Math.floor(seconds - (m * 60)) < 10 ? '0' + Math.floor(seconds - (m * 60)) : Math.floor(seconds - (m * 60));
		return m + ':' + s;
	},
	
	// starts spinner, called if video data is loading
	startSpinning : function(){
		//this.spinner.spin(document.getElementById('overlay'));
	},
	
	// stops spinne
	stopSpinning : function(){
		//this.spinner.stop();
	},

	/* prints errors */
	errorHandling: function(e) {
	 $('#debug').append('Error - Media Source not supported: ' + this.video.error.code == this.video.error.MEDIA_ERR_SRC_NOT_SUPPORTED); // true
	 $('#debug').append('Error - Network No Source: ' + this.video.networkState == this.video.NETWORK_NO_SOURCE); // true
	},






	/** INTERFACES *************************/

	/* just play */
	play: function() {
		if ($(this.options.selector).attr('paused') == false) {
			this.video.pause();
			$(main.player).trigger('player.pause');
		} else {
			this.video.play();
			$(main.player).trigger('player.play');
		}
	},

	/* just pause */
	pause: function() {
		this.video.pause();
		$(main.player).bind('player.pause');
	},

	/* returns duration of video */
	duration: function() {
		return $(this.options.selector).attr('duration');
	},

	/* return current playback time or set the time */
	currentTime: function(x) {
		if (x == null) {
			return $(this.options.selector).attr('currentTime');
		}else {
			$(this.video).trigger('play');
			$(this.options.selector).attr('currentTime', x);
		}
	},

	/* sets or returns video width */
	width: function(x) {
		if (x == null) {
			return this.video.width;
		}else {
			this.video.width = x;
		}
	},

	/* sets or return video width */
	height: function(x) {
		if (x == null) {
			return this.video.height;
		}else {
			this.video.height = x;
		}
	},

	/* sets or returns playback rate */
	playbackRate: function(x) {
		if (x == null) {
			return this.video.playbackRate;
		}else {
			this.video.playbackRate = x;
		}
	}

}); // end video class















/*
	playorpause : function() {
		if(this.video.ended || this.video.paused) {
			this.video.play();
		} else {
			this.video.pause();
		}
	},
*/





/********************************************************/
// Fallback & Media format detection


/*
https://developer.mozilla.org/en/Configuring_servers_for_Ogg_media
#1 determine duration
$ oggz-info /g/media/bruce_vs_ironman.ogv

#2 hard code duration for apache2 in the .htaccess-file of the media folder
<Files "elephant.ogv">
Header set X-Content-Duration "653.791"
</Files>


http://dev.opera.com/articles/view/everything-you-need-to-know-about-html5-video-and-audio/
*/




	/*
	- dirty hack without considering custom events
	- without seeking yet
	- !! such a automatisation is only need if you want to force the user to return to the source video

	loadCycleVideo : function(url, seek, duration, return_seek){

		stop/freez orig. video
		load new video in window/frame
		attach annotation to terminate after time is over
		reload orig. video
		seek to previouse temporal position
		play

		var _this = this;
		this.cycledata = {url: this.main.parseSelector, return_seek: return_seek};

		this.main.vid_arr = []; 		this.main.vid_arr[0] = []; this.main.vid_arr[0]['annotations'] = [];
		this.main.vid_arr[0]['annotations'].push({title:'', target:this.url, linktype:'cycle', type:'xlink', x:0, y:0, t1:seek, t2:duration});
		 $(this).bind('annotation.begin.cycle', function(e, a, b){ _this.begin(e, a, b);});
		 $(this).bind('annotation.end.cycle', function(e, a, b){ _this.end(e, a);});

		//this.main.updateVideo(0,0);

		this.loadVideo(url, seek);
		setTimeout(function(){ $(_this).trigger('annotation.end.cycle'); return '';}, 1000);

	},

		cycledata : {},
	begin : function(e, a, b){},
	end : function(e, a){ this.main.parse(this.cycledata.url, 'html');//loadVideo(this.cycledata.url, this.cycledata.return_seek);
	},


	terminateCycleVideo : function(){
		$(this.options.selector).parent().find('#subvideo').remove();
	},


	*/




















