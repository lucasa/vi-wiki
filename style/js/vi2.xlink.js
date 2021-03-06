	/*****************************************/
	/* XLink
	author: niels.seidel@nise81.com
		
	- remove dirty hacks xxx
	- link-types: cycle, xlink
	- timeLineSelector
	- nice defaults: var defaults = {animLen: 350}; options = $.extend(defaults, settings); 
	- bug: offset @ o.css({left: pos.x   ... nicht im MediaWiki, aber in den showcases
	
	nth
	- viz on timeline
	- apply minimum link duration
	- delay removeOverlay on mouseover/shift-press etc.
	
	*/


	/** class XLink **/ 
	var XLink = $.inherit({

		/**/
  	__constructor : function(options) {
  		this.options = $.extend(this.options, options); 
		},
				
		name : 'xlink',
		options : {target_selector:'#seq' ,selector: '#overlay', vizOnTimeline: true, minDuration: 5},
		player : null,
		timelineSelector : 'div.vi2-video-seek', 
		link_list : {},

		/**/
		init : function(ann){
			var _this = this;
			this.link_list = this.buildLinkList(ann);	
			this.showTimelineXlink(this.link_list);
			// attach overlay to 
//			$(this.options.target_selector).parent().append($('<div></div>').attr('id', this.options.selector));
		},						
		
		
		/**/
		buildLinkList : function(ann){
			var e = {}; e.tags = []; e.tags.occ = [];
			$.each(ann, function(i, val){
				if(val.linktype == 'cycle' || val.linktype == 'standard' || val.linktype == 'xlink'){ 
					e.tags.push({name: val.title, occ:[val.t1], target:val.target});
				}
			});
			return e;
		},

		currLinkId :-1,
		/**/
		begin : function(e, id, obj){
/*			if(this.currLinkId == id){
				return false;
			}else{  */
				this.currLinkId = id;
				var _this = this;
				var pos = this.relativePos(obj.displayPosition); 
				var o = $('<a></a>')
								.text(obj.content.title)
								//.attr('href', obj.content.target)
								.attr('id', 'ov'+id)
								.addClass('overlay ov-'+id)
								.addClass('hyperlink-'+obj.linktype)
				 				.bind('click', {}, function(data){
				 					// distinguish link types
				 					switch(obj.linktype){
				 						case 'standard' : 
				 						
				 						//iwass.buildSingleVideo(obj.content.target.replace(/\#/,''), null, true); 
				 						
											var metadataa = new Metadata(iwass.getMetadataById(obj.content.target.replace(/\#/,'')));
							
												iwass.buildDOM(obj.content.target.replace(/\#/,''));
												main.clock.stopClock();
												main.clock.reset(); 
												var p = new Parser('#hydro1', 'html'); 
  											main.vid_arr = p.run();
												_this.loadVideo(main.vid_arr[0]['url'], obj.seek);
				 								//main.clock.startClock();
				 						
				 							
											// if new video inside page source 	// if other temporal or spatial position  // if other wiki page	
											
											// update tags
				 							///// bugy ?? ////  main.widget_list['tags'].tag_obj = $('body').data().tags[obj.content.target];
				 							//main.widget_list['tags'].displayTagcloud();
				 							// update metadata
				 						//	var metadataa = new Metadata(iwass.getMetadataById[obj.content.target.replace(/\#/,'')]);
						
											break;
										case 'external' :
											return true;
										case 'cycle' : 
											var return_obj = {
												title : 'return to: '+obj.content.title,
												target : String(_this.player.url).replace(/.ogv/,'').replace(/videos\/iwrm\_/,''), // dirty IWAS hack
												linktype : 'standard',
												type : 'xlink',
												x : obj.displayPosition.x,
												y : obj.displayPosition.y,
												t1 : obj.seek,
												t2 : obj.duration,
												seek : obj.displayPosition.t1,
												duration : 0
											};	
											// dirty IWAS hack to build DOM
											iwass.buildDOM(obj.content.target.replace(/\#/,''));
											main.clock.stopClock();
								  		main.clock.reset();
											var p = new Parser('#hydro1', 'html'); // parse the DOM
								  		main.vid_arr = p.run(); 
								  		main.vid_arr[0]['annotation'].push(return_obj); 
											// load video
											_this.loadVideo(main.vid_arr[0]['url'], obj.seek);
											var metadataa = new Metadata(iwass.getMetadataById(obj.content.target.replace(/\#/,'')));
							
											//	_this.loadCycleVideo(obj.content.target, 10, 15, obj.displayPosition.t1); // url, seek time, duration, return_seek
											break;
										case 'x':
											break;	
									}
									// remove link anchor after click 
									$(this).remove();
								});
				$(this.options.selector).append(o);
				// positioning object AFTER appending it to its parent // buggy
				// ($(this.options.selector).offset()).left+
				// alert($(this.options.selector).offset().left);
				o.css({left: pos.x, top: pos.y, position:'absolute'});		
		//	}	
		},
	
		/**/
		end : function(e, id){ 	 //alert('end link')
			$(this.options.selector+' .ov-'+id).hide();
		},
		
		/**/
		showTimelineXlink : function(e){
				var _this= this; 
				$(_this.timelineSelector+' .timetag').remove();
				// display tag occurence on timeline to motivate further selection
				var f = function(_left, _name, start){
					var sp = $('<span></span>');					
					sp.addClass('timetag tlink').attr('style','left:'+_left+'px;')
						.bind('mouseover', function(e){
							$(this).tooltip({delay: 0, showURL: false, bodyHandler: function() { return $('<span></span>').text(_name);} });
						})
						.bind('click', function(event){
							_this.player.currentTime(start);
						});
					return sp;
				};
				//				
				$.each(e.tags, function(){ 					
					var progress = this.occ[0] / _this.player.duration();
					progress = ((progress) * $(_this.timelineSelector).width()); 
  	    	if (isNaN(progress) || progress > $(_this.timelineSelector).width()) { return;}
	 				$(_this.timelineSelector+'link').append(f(progress, this.name, this.occ[0]));
 				});
		},
		
		/**/
		showLinkSummary : function(e){
		 var _this = this;
			var screen = main.openScreen('#seq');
			// prepare link list (remove doubles)
			var ex = [];
			$.each(_this.link_list.tags, function(i, val){
				if(ex.indexOf(val.target) == -1){
					val.name = iwass.getMetadataById(val.target.replace(/\#/, '')).title; 
					ex.push(val.target);
				}else{ 
					val.name = 0; val.target = '';
				}
				
			});
			// use template
			screen.setTemplate('<div><h3>Related Lectures:</h3><ul>{#foreach $T.tags as link}{#if $T.link.name == 0}{#else}<li><a href="{$T.link.target}">{$T.link.name}</a></li>{#/if}{#/foreach}</ul></div>');
			screen.processTemplate(_this.link_list);
			
		},
		
		/**/
		clear : function(){
			$(this.options.selector).html('');
			// xxx static, stands in relative with template of videoplayer
			$('.vi2-video-seeklink').html('');
			
		},
		
		/**/
		vizOnTimeline : function(){},
		
		/**/
		relativePos : function(obj){ 
			//var pplayer = main.widget_list['seq']; // IWRM only fix xxx // bugy
			//return {x: Math.floor((obj.x/100)*pplayer.width()), y: Math.floor((obj.y/100)*pplayer.height())};
			return {x: Math.floor((obj.x/100)*620), y: Math.floor((obj.y/100)*450)};
		},
		
		/**/
  	loadVideo : function(url, seek){
	  	this.player.loadVideo(url, seek);  			
  	},
  	
  	/**/
  	loadCycleVideo : function(url, seek, duration, return_seek){
	  	this.player.loadCycleVideo(url, seek, duration, return_seek);  			
  	},
  	
	}); // end class XLink


