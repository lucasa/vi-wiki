/*****************************************/
	/* MAIN 
	- handle widget options
	- parser
	- 
	- 
	*/
	var Main = $.inherit(
	{
			/**/
  		__constructor : function(options) {
  			this.options = options;//$.toJSON(options);  
  			this.init();	
  			this.testing();
  			this.parse();
  		},
  		
  		options : {},
  		widget : null,
  		widget_list : [],
  		pieList : $('<ul></ul>').attr('class', 'pieContextMenu').attr('id', 'menu'),
  		player : null,
  		videoSelector : '#video1',
  		
  		/**/
  		testing : function(){
  			// sequential videos
  			var arr = [];
				arr[0] = [];	arr[1] = []; arr[2] = [];
				arr[2]['url'] = 'http://127.0.0.1/elearning/videos/Compi.ogg';
				arr[1]['url'] = 'http://127.0.0.1/elearning/videos/bunny.ogg';
				arr[0]['url'] = 'http://127.0.0.1/elearning/videos/type.ogv';
				this.player.loadSequence(arr);
				
				this.widget_list['xlink'].addAnnotation({title: '<div>One Link</div>', target:'http://127.0.0.1/elearning/videos/bunny.ogg'}, 'link', 25, 50, 2, 15 );
				//
  		},
  		
  		/**/
  		init : function(){
  			var _this = this;
				this.player = new Video('#video1');
		  	//
		  	$("div.dropdown").each(function(){ $(this).dropdown(); });		  		
		  	// init widgets
		  	_this.initWidgets();
  		},
  		
  		/**/
  		initWidgets : function(){
				var _this = this;
  			$.each(this.options.data, function(){
  				   			
  				switch(this.name){
  					case 'tags' :
  						_this.widget = new TemporalTagging('#tags', {}, _this.player); 
  						_this.addPieItem('tag', 'img/addTag.png', 'main.widget.addTags();');
  						break;
  					case 'xlink' : 
  					  _this.widget_list[this.name] = new XLink('#tags', {}, _this.player); 
  						//	_this.addPieItem('tag', 'img/ff.png', 'alert("addLink");'); // authoring mode
  					  break;
  					case 'signal' : 
  						//_this.addPieItem('tag', 'img/ff.png', 'alert("addSignal");');
  					  break;
  				}	
  			});
  			//	
  			$('body').append(this.pieList);
  			$("video").pieMenu("ul#menu");
  		},
  		
  		/**/
  		addPieItem : function(_name, _img, _callback){
  			var item = $('<li></li>')
  				.append($('<img / >')
  					.attr('src', _img)
  					.attr('alt','')
  					.attr('href','#')
  					.bind('mouseup', {}, function(){
  						window.eval(_callback);
  					})
  				);
  			this.pieList.append(item);
  		},  
  		
  		/**/
  		openScreen : function(){
  			//this.player.pause();
  			var screen = $('<div></div>')
  				.addClass('screen')
  				.width($(this.videoSelector).width()-20)
  				.height($(this.videoSelector).height()-20);
  			$('.ghinda-video-player').append(screen);
  			return screen;
  		},
  		
  		/**/
  		closeScreen : function(){
  			//this.player.play();
  			$('.screen').hide();
  		},	
  		
  		/**/
  		parse : function(){
  			var v_id = -1;
  			var arr = [];
  			var parseVideo = function(str){
  				//arr[arr.length] = [];
  				//arr[arr.length]['url'] = 
					var url, start, duration, id = '_';
  				str = str
  					.replace(/^\[\[Video:/, '') // start delimiter
  					.replace(/\]\]/, '') // end delimiter
  					.replace(/\# /, ' #') // start-time
  					.replace(/\| /, ' |') // duration
  					.replace(/  /, ' '); // double spaces
  				var a = str.split(' ');
  				$.each(a, function(i, val){
  					if(val.substr(0,1) == '#'){ start = val.substr(0,1); }
  					else if(val.substr(0,1) == '|'){ duration = val.substr(0,1); }
  					else if(val.replace(/.ogg/,'')){ url = val; }
  					else { id = val; }
  				})
  				//alert(url +''+ start +''+ duration +''+ id);
  			};
  			
  			var parseHyperlink = function(id, str){
  				this.widget_list['xlink'].addAnnotation({title: '<div>One Link</div>', target:'http://127.0.0.1/elearning/videos/bunny.ogg'}, 'link', 25, 50, 2, 15 );
  			};
  			
  			$($('#markup').val().split('\n')).each(function(i, val){ 
  				if(this.substr(0,8) == "[[Video:"){
  					v_id = parseVideo(this);
  				}
  				if(this.substr(0,11) == "+[[Hyperlink:"){
  					//parseHyperlink(v_id, this);
  				}
  					
  			});
  			//$('div.litem-code').append('');
  			
  			/*
  			var arr = [];
				arr[0] = [];	arr[1] = []; arr[2] = [];
				arr[2]['url'] = 'http://127.0.0.1/elearning/videos/Compi.ogg';
				arr[1]['url'] = 'http://127.0.0.1/elearning/videos/bunny.ogg';
				arr[0]['url'] = 'http://127.0.0.1/elearning/videos/type.ogv';
				this.player.loadSequence(arr);
				this.player.loadVideo('http://127.0.0.1/elearning/videos/Compi.ogg');
  			*/
  			
  		},
  });
	
	
	
	
	
		
	
	
