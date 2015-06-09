
	/*****************************************/
	/* Annotation 
		- parser
		- min. link duration 
	*/
	

	/** class Annotation **/ 
	var Annotation = $.inherit(
	{
			/**/
  		__constructor : function(selector, link_obj, player) {
  			this.selector = selector;
  			this.link_obj = link_obj;
  			this.player = player;
  			var _this = this;
  			this.clock();
		},
		
		link_obj : {},
		selector : '',
		timelineSelector : 'div.ghinda-video-seek',
		player : null,
	
		annotations : [],
	
		/* push annotation on their stack */
		addAnnotation : function(content, type, x, y, t1, t2){ 
			this.annotations.push({content: content, type: type, displayPosition: {x: x, y: y, t1: t1, t2: t2}});
		},
	
		/**/
		checkAnnotation : 	function() {
			var iTime = this.player.currentTime();

			for (var i=0; i < this.annotations.length;i++){
				var oAnn = this.annotations[i];
				if(this.parseTime(iTime) >= oAnn.displayPosition.t1 && this.parseTime(iTime) < oAnn.displayPosition.t2) {
					this.addOverlay(i, oAnn); 
				}else {
					this.removeOverlay(i);
				}
			}
		},
						
		/**/
		addOverlay : function(id, obj){},
	
		/**/
		removeOverlay : function(id){},
			
		/**/
		clock : function(){
			var _this = this;
			this.interval = setInterval(function() { _this.checkAnnotation();  }, 100);		
		},
	
		/**/
		parseTime : function (strTime) { 
			return strTime;
			var aTime = strTime.toString().split(":");
			return parseInt(aTime[0],10) * 60 + parseInt(aTime[1],10) * 1;// + parseFloat(aTime[2]);
		},
	
		/**/
		getCurrentTime : function(){
			return this.player.currentTime();//.toString()
		},
	
}); // end class Annotation 
	
	
	
	


	/*****************************************/
	/* XLink
	- viz on timeline
	- link-types: cycle, xlink
	
	*/


	/** class XLink **/ 
	var XLink = $.inherit(Annotation, {

		/**/
  	__constructor : function(selector, link_obj, player) {
	  	this.__base();
  			this.selector = selector;
  			this.link_obj = link_obj;
  			this.player = player;
  			var _this = this;
  			this.clock();
		},
		
		/**/
		checkAnnotation : 	function() {
			this.__base();
		},
		
		/**/
		addOverlay : function(id, obj){
			var _this = this;
			var pos = this.relativePos(obj.displayPosition); 
			var o = $('<p id="ov'+id+'">'+obj.content.title+'</p>')
								.attr('class', 'overlay ov-'+id)
				 				.attr('style', 'position:absolute; left:'+pos.x+'px; top:'+pos.y+'px;')
				 				.bind('mouseup', {}, function(data){
									_this.loadVideo(obj.content.target, 10);
									$(this).remove();
								});
			$('#overlay').html(o);
		},
	
		/**/
		removeOverlay : function(id){
			$('#overlay .ov-'+id).hide();
		},
		
		relativePos : function(obj){
			return {x: Math.floor((obj.x/100)*this.player.width()), y: Math.floor((obj.y/100)*this.player.height())};
		},
		
		/**/
  	loadVideo : function(url, seek){
	  	this.player.loadVideo(url, seek);  			
  	},
  	
	}); // end class XLink

	

	
	
	
	
	/****************************************/
	/* TEMPORAL TAGS
	- tag cloud: limitieren >> sort by occurences needed! algorithmix problem
	- style anpassen
	- click auf multiple-tag-indicators
	- save entered tags and 
	- append tags to the cloud
	*/
	

	/** class TemporalTagging **/ 
	var TemporalTagging = $.inherit(
	{
			/**/
  		__constructor : function(selector, tag_obj, player) {
  			this.selector = selector;
  			this.tag_obj = tag_obj;
  			this.player = player;
  			var _this = this;
  			// sort and display tags
  			this.display(this.sortTagsOccurence(tag_obj), this.limit);
		},
		
		selector : '',
		timelineSelector : 'div.ghinda-video-seek',
		tag_obj : null,
		tag_list : [],
		limit : 50, // max number of displayed tags
		player : null,
		
		/**/
		sortTagsOccurence : function(tag_list){
			
			//$.each(tag_list, function(i, val) {
			//	ul.append(ln(i, val.length, val));
			//});
			return tag_list;// $.makeArray(tag_list).sort(function(a, b) { return a.length - b.length; });
		},

		/**/
		display : function(tag_list){
			var _this = this;
			// template for displaying tags
			var ln = function(_name, _freq, _tags){ 
				return $('<li></li>')
					.append($('<a></a>')
						.attr('href', '#')
						.text(_name+'('+_freq+') ')
						.css("font-size", (_freq / 10 < 1) ? _freq / 10 + 1 + "em": (_freq / 10 > 2) ? "2em" : _freq / 10 + "em")
						.bind('click', {tags:_tags}, function(e){ _this.openTag(e.data)})
					);
			};
			// prepare list and append existing tags
			var ul = $("<ul></ul>").attr("id", "tagList");
			$.each(tag_list, function(i, val) {
				ul.append(ln(i, val.length, val));
			});
			$(this.selector).html(ul);
		},		
		
		/**/
		openTag : function(e){
			var _this= this;
			if(e.tags.length === 1){
				// jump to temporal position 
				this.player.currentTime(e.tags[0].start);
			}else{
				// display tag occurence on timeline to motivate further selection
				var f = function(_left){
					return $('<span></span>')
						.attr('class', 'timetag')
						.attr('style','left:'+_left+'px;');
				};
				//				
				$.each(e.tags, function(){
					var progress = this.start / _this.player.duration();
					progress = ((progress) * $(_this.timelineSelector).width());
  	    	if (isNaN(progress)) { progress = 0; }
	 				$(_this.timelineSelector).append(f(progress));
 				});
			}
		},
		
		/**/
		addTags : function(){
			var _this = this;
			var sc = main.openScreen();
			sc.append('<h4>Add tags @ '+this.player.currentTime().toString().substr(0,4)+'s</h4><form class="myform"><ul id="mytags"></ul></form>');
			var close = $('<h3>x</h3>').addClass('close-btn').button().width(20).bind('click', function(){
				_this.saveTags();
				//main.closeScreen();
			});
			sc.append(close);
			// bug ..its not called twice
			$("#mytags").tagit({
				availableTags: ["c++", "java", "php", "coldfusion", "javascript", "asp", "ruby", "python", "c", "scala", "groovy", "haskell", "perl"]
			});
		},
		
		/**/
		saveTags : function(){
			var arr = [];
			$.each($('ul#mytags > li'), function(i, val){
				arr.push($(val).find('input[type=hidden]').val()); 
				//alert($(val).find('input[type=hidden]').val());
			});
			// save to couchdb
			// display updated tag-list by dbload or appendance
			
		},
	
		get_tags_by_name : function(){},
		
	}); // end class

		
	/*****************************************/	
	
	/* Possibility to load subtitles with custom attributes 'hidden' and 'data-starttime' ..
	<div hidden data-starttime=3 data-endtime=7 id=hello>Hello world!</div>

	var video = document.getElementsByTagName('video')[0];
	var hello = document.getElementById('hello');
	var hellostart = hello.getAttribute('data-starttime');
	var helloend = hello.getAttribute('data-endtime');
	video.ontimeupdate = function(e) {
  	var hasHidden = hello.hasAttribute('hidden');
  	if (video.currentTime > hellostart && video.currentTime < helloend) {
  	  if (hasHidden)
  	    hello.removeAttribute('hidden');
  	} else {
    	if (!hasHidden)
    	  hello.setAttribute('hidden', '');
  	}
	};
	*/		
