/** class IWAS 


json_validator: http://jsonformatter.curiousconcept.com/

**/ 
var IWAS = $.inherit({
		/**/
  	__constructor : function(main) {
  		this.main = main;
  		var _this = this;
  			$(this.content_selector).bind('clear', function(){ 
  				if (_this.main != null){
  					_this.main.destroy();
  				}	
  			});
			this.init();
		},
	
	init : function(){
	var _this = this;
	// retrieve application data in a first call	
	$.ajax({
    			type: "POST",
    			dataType: "json",
    			url: './data.json',
    			success: function(res){ 
    					// second call to get slide data 
    					$.ajax({
    						type: "POST",
    						dataType: "json",
    						url: './data-slides.json',
    						success: function(slides){ 
    							_this.json_data = res; 	
    							_this.json_slide_data = slides;
    							_this.startApp();
										},
										error: function(e){},
									});
					},
					error: function(e){},
				});
	},

	main : null,
	json_data : {},
	json_slide_data : {},
	dom : '#hydro1',
	current_stream : 'start',
	content_selector : '#content',
	
	/**/
	startApp : function(){
		
		var location = window.location.href.slice(window.location.href.indexOf('#') + 1); //alert(location+'  = '+this.isStream(location));
		
		this.buildHeader();
		this.buildFooter();
		this.buildNavigation();
		//this.validateLinks(); // validation
		//this.generateButter('cullmann');
		//this.json_import();
		
		if(this.isStream(location) && location.substr(0,10) != 'userguide'){
			this.current_stream = location;
			this.buildSingleVideo();
			return;
		}else if(location.substr(0,9) == 'category:'){
			this.current_stream = location.substr(0,9);
			this.getStreamsByCategory(decodeURI(location.substr(9,location.length)).replace(/\_/g, ' '));
			return;
		}else if(location.substr(0,10) == 'userguide'){
			this.current_stream = location.substr(0,10);
			this.buildSimpleVideo('userguide'); 
			return;
		}else if(location.substr(0,8) == 'lecture:'){
			this.current_stream = location.substr(0,8);
			this.getStreamsByTitle(decodeURI(location.substr(8,location.length)).replace(/\_/g, ' '));
			return;		
		}else if(location.substr(0,4) == 'tag:'){
			this.current_stream = location.substr(0,4);
			this.getStreamsByTag(decodeURI(location.substr(4,location.length)).replace(/\_/g, ' '));
			return;
		}else if(location.substr(0,7) == 'search:'){
			this.current_stream = location.substr(0,7);
			this.getStreamsBySearch(decodeURI(location.substr(7,location.length)).replace(/\_/g, ' '));
			return;
		}else if(location.substr(0,5) == 'about'){
			this.current_stream = location.substr(0,5);
			this.getTemplatePage(location.substr(0,5)+'-template');
			return;	
		}else if(location.substr(0,10) == 'sitenotice'){
			this.current_stream = location.substr(0,10);
			this.getTemplatePage(location.substr(0,10)+'-template');
			return;						
		}else{		
			this.current_stream = 'start';
			this.buildIntro();
			window.location.replace(window.location.href.split('#')[0] + '#'+this.current_stream);
			return;				
		}
	},
	
	/**/
	buildHeader : function(){
		$('#header').setTemplate($("#header-template").html()).processTemplate({});		
	},
		
	/**/
	buildFooter : function(){
		$('#footer').setTemplate($("#footer-template").html()).processTemplate({});		
	},	
		
	/**/
	buildNavigation : function(){			

		var nav = $('#navigation')
			.html('<a class="nav-s" href="#start">HOME</a>')
			.append(this.buildDropDown(this.staticCategorySort(), 'Lecture categories', 'getStreamsByCategoryUpdate'))
			.append(this.buildDropDown(this.getTagTaxonomie(), 'Keyword', 'getStreamsByTagUpdate'))
			.append(this.buildSearch());
			//.append(this.buildDropDown(this.getTitles(), ':: lectures by title ::', 'getStreamsByTitleUpdate'));
//		$('body').prepend(this.buildDropDown(this.getAuthors(), 'choose lecturer', null));		

		$('ul.getStreamsByCategoryUpdate a:eq(0)').css({'background-image': 'url(img/cat_s0.png)'});
		$('ul.getStreamsByCategoryUpdate a:eq(1)').css({'background-image': 'url(img/cat_s5.png)'});
		$('ul.getStreamsByCategoryUpdate a:eq(2)').css({'background-image': 'url(img/cat_s1.png)'});
		$('ul.getStreamsByCategoryUpdate a:eq(3)').css({'background-image': 'url(img/cat_s3.png)'});		
		$('ul.getStreamsByCategoryUpdate a:eq(4)').css({'background-image': 'url(img/cat_s2.png)'});		
		$('ul.getStreamsByCategoryUpdate a:eq(5)').css({'background-image': 'url(img/cat_s4.png)'});		
		$('ul.getStreamsByCategoryUpdate a:eq(6)').css({'background-image': 'url(img/cat_s6.png)'});	
	},
	
	//
	buildIntro : function(){
		var _this = this;
		
		var introInfo = $('<div id="intro-info"></div>').hide();
		$(this.content_selector)
			.empty()
			.trigger('clear')
			.append(introInfo);
		
		// intro
		//this.buildSingleVideo('graefe', '#content');

		var introo = {cats:[
		{title:"Water and the physical environment", link:"Water_and_the_physical_environment", icon:"cat_5.png", desc:"This cluster discusses the components and processes within the hydrologic cycle and resulting management options. It includes different methods to quantify soil erosion, water balance, sediment and contaminant transport. Issues are covered that are related to groundwater quantity and quality, surface water quality, climate change and hydrological extremes."},
		{title:"Technical measures", link:"Technical_measures", icon:"cat_1.png", desc:"This cluster deals with technical measures that are important for IWRM. It covers issues from the urban water management (centralized and decentralized wastewater treatment), as well as the important issues of reservoir management. Furthermore, flood protection measures as an integral part of flood management are shown."},
		{title:"Water governance", link:"Water_governance", icon:"cat_3.png", desc:"Issues of governance reveal to be of utmost importance for sustainable water resources management. Following an illustrated introduction into the topic of water governance, fundamentals in water law, gender issues, options for participation as well as prevailing spatial and sectoral challenges in river basin management get addressed. Particular emphasis is given to capacity development."},
		{title:"Economic instruments", link:"Economic_instruments", icon:"cat_2.png", desc:"In this part of the module, economic instruments are explained and illustrated that regulate the water demand and their interaction with hydrologic models. Furthermore, economic problems in multilateral cooperation on shared watercourses as well as the issue of water pricing are successively explained. "},
		{title:"Tools", link:"Tools", icon:"cat_4.png", desc:"Tools for understanding the natural and societal systems that facilitate decision making processes become more and more important. A wide range of tools and methods are shown, e.g. modelling, model coupling, Geographic Information Systems (GIS) and consequently their usage within decision-support-systems (DSS). The cluster further addresses issues related to vulnerability and uncertainty in decision making, e.g. showing tools like scenario planning."},
		{title:"IWRM implementation and case studies", link:"IWRM_implementation_and_case_studies", icon:"cat_6.png", desc:"The implementation of Integrated Water Resources Management (IWRM) is still in its infancy.  Thus, case studies from different hydrologically sensitive regions of the world are shown in order to discuss challenges that often occur when one tries to practically implement IWRM. Topics include such important issues like transboundary water management as well as the implementation of IWRM in Europe and in the development cooperation."}
		]};


		var item =$('<div></div>')
			.addClass('content-intro')
			.setTemplate($("#intro_template2").html())
			.processTemplate(introo) // this.getCategories()
			.appendTo($(_this.content_selector));
		
		$.fn.maphilight.defaults = {
	fill: true,
	fillColor: 'ffffff',
	fillOpacity: 0.5,
	stroke: false,
	strokeColor: '000000',
	strokeOpacity: 1,
	strokeWidth: 1,
	fade: true,
	alwaysOn: false,
	neverOn: false,
	groupBy: false,
	wrapClass: true,
	shadow: true,
	shadowX: 0,
	shadowY: 0,
	shadowRadius: 6,
	shadowColor: '000000',
	shadowOpacity: 0.8,
	shadowPosition: 'inside',
	shadowFrom: true
}
		$('.imagemap').maphilight();
		
	},
	
	//
	resetIWRM : function(){
	var x0 = -50;
		var y0 = 50;
		$('.cat1').css({top: y0, left:x0+275});
		$('.cat2').css({top: y0, left:x0+422});
		$('.cat3').css({top: y0+205, left:x0+420});		
		$('.cat4').css({top: y0+255, left:x0+272});
		$('.cat5').css({top: y0+207, left:x0+150});		
		$('.cat6').css({top: y0, left:x0+150});
	},
	
	//
	aniWRM : function(selector, x1, y1, x2, y2, i){
		var _this = this;
		var introInfo_arr = [
			{x:0,y:0},
			{x: 140, y: 20, info:'Technical measures'},
			{x: 700, y: 20, info:'Economic instruments'},
			{x: 750, y: 300, info:'Water governance'},
			{x: 650, y: 450, info:'Tools'},
			{x: 25, y: 250, info:'Water and the physical environment'},
			{x: 10, y: 10, info:'IWRM implementation and case studies'}
		];
		$(selector).click(function(){
				_this.resetIWRM();
				$('#intro-info').hide();
				$(this).animate({
    			left: x1,
    			top: y1,
    			}, 500, function() { 
    				$('#intro-info').html($('<h3></h3>').text(introInfo_arr[i].info).wrapInner('<a href="#category:'+(introInfo_arr[i].info).replace(/\ /g, '_')+'"></a>')).css({"top":introInfo_arr[i].y+"px", "left":introInfo_arr[i].x+"px"}).show();
    			});
			}
		);	
	},
	
	/**/
	listAllItems : function(){
			var template = $("#item_template").html();
			
		// list items of all categories		
		$.each(this.getCategories(), function(i, cat_name){
			// cat name
			$(_this.content_selector).append($('<h2></h2>').class('cat'+i).text(cat_name)).append('<br>');
			$.each(_this.json_data._stream, function(i, stream){
				if(stream.metadata[0].category == cat_name){
					var item =$('<div></div>')
						.setTemplate(template)
						.processTemplate(stream)
						.appendTo($(_this.content_selector));
						//$('div.hyphenate').hyphenate({remoteloading:true,});//.css('color','red');
						//$('.text').hidetext();						
				}
			});		
		});
	
	},
	
	buildDOM : function(stream){
		$(this.dom).empty();
		this.getVideoById(stream); 
		this.getTocById(stream); 
		this.getLinksById(stream); 
 		this.getSlidesById(stream);
	},
		
		
	/**/
	buildSingleVideo : function(stream, selector, update){
		if(stream == null){
			stream = this.current_stream;
		}
		if(selector == null){
			selector = '#content';
		}
		if(update == undefined){
			update = false;
		}			
		
		this.buildNavigation();
		
		var template = $("#content_template").html();
		$(selector).setTemplate(template).processTemplate({});
		// make a template out of it
		$("#accordion").accordion({autoHeight: false, collapsible: false, fillSpace: true });
		
		//$('body').prepend('<h1>'+stream+'</h1>'); return;
		
		// map json to DOM
		this.buildDOM(stream);

		// initiate player
		if(!update){
			this.main = new Main({id:stream, selector:'#screen', clockInterval:500, videoSelector:'#video1', videoWidth: 280, videoHeight:158, markupType:'html', wrapControls: '#container', theme:'simpledark', childtheme:'iwasbasicwhite'});
			main = this.main;
		}
		metadataa = new Metadata(this.getMetadataById(stream));

		seq = new Seq({selector:'#seq', vizOnTimeline: false, controls: false, path : 'slides/'});//, placeholder: 'slides/'+stream+'/'+stream+'_00001.jpg'}); 
		//new Seq({selector:'#seq', width:620, height:450, path:'videos/iwrm_'+stream+'_slides.ogv'}); 
				
		xlinkk = new XLink({target_selector:'#seq', vizOnTimeline: true, minDuration:'5'});
		
	//	var seqv = new Seqv({selector:'#seq', width:620, height:450, path:'videos/iwrm_'+stream+'_slides.ogv'}); 
		
		tocc = new TOC({selector:'#toc', vizOnTimeline: true}); 
	
		tagss = new TemporalTagging({selector:'#tags', vizOnTimeline: false, max:20, sort:'freq'}, this.getTagsById(stream)); 

		this.main.parse('#hydro1', 'html');  //		main.parse('#markup', 'wiki');
		this.main.addWidget(xlinkk);
		this.main.addWidget(seq);
		//this.main.addWidget(seqv);
		this.main.addWidget(tocc); 
		this.main.addWidget(tagss);
	},

	/**/
	buildSimpleVideo : function(stream, selector, update){
		if(stream == null){
			stream = this.current_stream;
		}
		if(selector == null){
			selector = '#content';
		}
		if(update == undefined){
			update = false;
		}			
		
		this.buildNavigation();
		var template = $("#simplecontenttemplate").html();
		$(selector).setTemplate(template).processTemplate({});
		
		metadataa = new Metadata(this.getMetadataById(stream));
		// map json to DOM
		this.buildDOM(stream);
		this.main = new Main({id:stream, selector:'#screen', clockInterval:500, videoSelector:'#video1', videoWidth: 780, videoHeight:400, markupType:'html', wrapControls: '#container', theme:'simpledark', childtheme:'iwasbasicwhite'});			
		this.main.parse('#hydro1', 'html');  //		main.parse('#markup', 'wiki');
		
	},

	
	metadata : '',
	seq :'',
	xlinkk:'',
	tocc:'',
	tagss:'',
	
	//
	buildSearch : function(){
		var _this = this;
		var dom = $('<form class="search-box"></form>');
		var input = $('<input type="text" id="search-text" value="search" />')
				.click(function() {
    		if (this.value == this.defaultValue) {
    	 	 this.value = '';
    		}
  			})
  		.blur(function() {
    		if (this.value == '') {
    	 	 this.value = this.defaultValue;
    		}
  			})
  		.keyup(function(e){
					if (e.which == 13) { 
						_this.getStreamsBySearchUpdate($('#search-text').val());
						}
			});
		
		var submitt = $('<input type="submit" value="" />')
			.click(function(e){
					e.preventDefault();
					// call update function to replace address bar before searching
					_this.getStreamsBySearchUpdate($('#search-text').val());
			});
		//
		dom
			.append(input)
			.append(submitt);

		return dom;
	},	
	
	/* handle search */
	getStreamsBySearch : function(string){
		var _this = this;
		var result = [];
		var maxResult = 1;
		// split search string into words
		$.each(string.split(" "), function(i, str){ 
			var expp = new RegExp(str, "gi");
			// parse json completly 
			$.each(_this.json_data._stream, function(i, stream){
					// add stream as potential result
					stream.id = String(stream.id);
					if(result[i] == null){ result[i] = {}; }; 
					result[i].id = stream.id;
					result[i].title = stream.metadata[0].title;
					result[i].author = stream.metadata[0].author;
					if(result[i].abstract == null){ result[i].abstract = 0; };
					if(result[i].tags == null){ result[i].tags = 0; };
					if(result[i].auth == null){ result[i].auth = 0; };
				
					// increment title-count in case it matches
					if(stream.metadata[0].title.search(expp) != -1 ){
						result[i].ti = 1;
					}else{
						result[i].ti = 0;
					}
					// increment author-count in case it matches
					if(stream.metadata[0].author.search(expp) != -1 ){
						result[i].auth = 1;
					}else{
						result[i].auth = 0;
					}
					// increment abstract-count in case it matches
					if(stream.metadata[0].abstract.search(expp) != -1 ){
						result[i].abstract += stream.metadata[0].abstract.match(expp).length;
					}
					// increment tag-count in case one or more are matching
					var t = '';
					$.each(stream.tags, function(i,val){ t += this.tagname+' '; });	
					if(t.search(expp) != -1 ){
						result[i].tags += t.match(expp).length;
						//alert(stream.id+' '+ result[stream.id].tags);
					}
					// weight results 
					result[i].total = result[i].ti * 10 + result[i].auth * 10 + result[i].abstract * 2 + result[i].tags;
				
					if (result[i].total > maxResult) { maxResult = result[i].total; }
			});
		});
		// normalize result
		$.each(result, function(i, val){ this.total = Math.ceil((100*this.total) / maxResult);});
		
		// render results, header and template
		$(_this.content_selector).trigger('clear').empty().append($('<h2></h2>').text('Search results for "'+string+'"'));
			var item =$('<div></div>')
				.setTemplate($("#search-template").html())
				.processTemplate({results:result}) // _this.json_data._stream.stream
				.appendTo($(_this.content_selector));

		// sort results
		$('div.search-results > div').tsort('.res', {order:"desc"});
		
	},
	
	//
	getTemplatePage : function(template){
		$(this.content_selector)
			.trigger('clear')
			.html($("#"+template).html());
	
	},	
	
	
	////////////////////////////////////////////////////////////////////////////////////
	// db calls ///////////////////////////////
	
	//get stream by id
	getStreamById : function(id, getSlide){
		if(getSlide == null) {getSlide = false; }
		var streama = null;
		var json = getSlide ? this.json_slide_data._slides : this.json_data._stream;
		$.each(json, function(val){
			if (this.id == id){ 
				streama = this;
			}
		});
		return streama;
	},
	
	/**/
	isStream : function(id){
		var t = false;
		$.each(this.json_data._stream, function(val){
			if (this.id == id){
				t = true;
			}
		});
		return t;
	},
		
		
	// 
	getStreamsByCategoryUpdate : function(cat_name){ 
		if(cat_name == 'Introduction'){
			window.location.replace(window.location.href.split('#')[0]+'#borchardt2');
			return;
		}
		// update address bar
		window.location.replace(window.location.href.split('#')[0] + '#category:'+cat_name.replace(/\ /g, '_'));
	},

	// 
	getStreamsBySearchUpdate : function(search_string){
		// update address bar
		window.location.replace(window.location.href.split('#')[0] + '#search:'+search_string.replace(/\ /g, '_'));
	},

	
	
	// 
	getStreamsByCategory : function(cat_name){
		var _this = this; 
			var z = []; 
			z['Technical measures'] = [1, "This cluster deals with technical measures that are important for IWRM. It covers issues from the field of urban water management (centralized and decentralized wastewater treatment) as well as important reservoir management topics. Furthermore, flood protection measures as an integral part of flood management are shown."];
			z['Economic instruments'] = [2, "In this part of the module, economic instruments regulating the water demand are explained and illustrated as well as their interaction with hydrologic models. Furthermore, economic problems in multilateral cooperation on shared watercourses as well as the issue of water pricing are successively explained."];
			z['Water governance'] = [3, "Issues of governance prove to be of utmost importance for sustainable water resources management. Following an illustrated introduction into the topic of water governance, fundamentals in water law, gender issues, options for participation as well as prevailing spatial and sectoral challenges in river basin management are addressed. Particular emphasis is given to capacity development."];
			z['Tools'] = [4, "Tools for understanding the natural and societal systems that facilitate decision-making processes are becoming increasingly important. A wide range of tools and methods is shown, e.g. modelling, model coupling, Geographic Information Systems (GIS) and consequently their usage within decision-support-systems (DSS). The cluster further addresses issues related to vulnerability and uncertainty in decision-making, e.g. showing tools such as scenario planning."];
			z['Water and the physical environment'] = [5, "This cluster discusses the components and processes within the hydrologic cycle and resulting management options. It includes different methods to quantify soil erosion, water balance, sediment and contaminant transport. Issues are covered that are related to groundwater quantity and quality, surface water quality, climate change and hydrological extremes."];
			z['IWRM implementation and case studies'] = [6, "The implementation of Integrated Water Resources Management (IWRM) is still in its infancy. Thus, case studies from different hydrologically sensitive regions of the world are shown in order to discuss challenges that often occur when one tries to practically implement IWRM. Topics include important issues such as transboundary water management as well as the implementation of IWRM in Europe and in the development cooperation."];
			var i = z[cat_name];	
				
		$(_this.content_selector)
			.empty()
			.trigger('clear')
			.setTemplate($("#cat_header").html())
			.processTemplate({title:cat_name, desc: i[1], style: 'background: no-repeat url(img/cat_s'+i[0]+'.png) white 0px 10px;'});
				
		$.each(this.json_data._stream, function(i, stream){
				if(stream.metadata[0].category == cat_name){			
					var item =$('<div></div>')
						.addClass('content-item')
						.setTemplate($("#item_template").html())
						.processTemplate(stream);
					$(_this.content_selector).append(item);
				}
		});
		
		$(_this.content_selector+' > .content-item')
			// sort by weight (expression of didactical order)
			.tsort('.weight', {order:"asc"})
			// fix two column layout
			.each(function(i, val){ 
				if(i % 2 == 1){ $(this).css('margin-right', '0');}	 
			});
		
		// enable card toggle
		$('.toggle-card').click(function(e){ if($(this).text() == 'view abstract'){ $(this).text('view metadata');}else{ $(this).text('view abstract');} $(this).parent().find('.show').toggle(); });
		
		// reset drop downs
		$('.getStreamsByTitle').val(-1);
		$('.getStreamsByTag').val(-1);
	},
	
	// 
	getStreamsByTitleUpdate : function(title_name){
		// update address bar
		window.location.replace(window.location.href.split('#')[0] + '#lecture:'+title_name.replace(/\ /g, '_')); 

	},
	
	// 
	getStreamsByTitle : function(title_name){
		var _this = this;
		var template = $("#item_template").html();
		
		$(_this.content_selector)
			.empty()
			.trigger('clear');
			//.append($('<h2></h2>').text('Lectures in category: '+title_name));

		$.each(this.json_data._stream, function(i, stream){
				if(stream.metadata[0].title == title_name){
					var item =$('<div></div>')
						.addClass('content-item')
						.setTemplate(template)
						.processTemplate(stream)
						.appendTo($(_this.content_selector));
				}
		});
		//$('.text').hidetext();
		// reset drop downs
		$('.getStreamsByTag').val(-1);
		$('.getStreamsByCategory').val(-1);
	},


	// 
	getStreamsByTagUpdate : function(tag_name){		
		// update address bar
		window.location.replace(window.location.href.split('#')[0] + '#tag:'+tag_name.replace(/\ /g, '_'));

	},

	// 
	getStreamsByTag : function(tag_name){
		var _this = this;
		var tags = tag_name.split('+');
		if(tag_name.split('+') == 0){ tags = []; tags[0] = tag_name; }
		
		var template = $("#item_template").html();
		$(_this.content_selector)
			.empty()
			.trigger('clear')
			.append($('<h2></h2>').text('Lectures with keyword: '+tags[0]));
		var j = 0;
		var all_streams = [];
		
		
		
		$.each(tags, function(i, the_tag_name){
			
		$.each(_this.json_data._stream, function(i, stream){
			$.each(stream.tags, function(i, tag){
				if(this.tagname == the_tag_name){
				 all_streams.push(stream.id);
				}
			});
		});			
		});
		
		all_streams = this.removeDuplicates(all_streams.sort());
		
		// render
		$.each(all_streams, function(i, val){
			var item =$('<div></div>')
						.addClass('content-item')
						.setTemplate(template)
						.processTemplate(_this.getStreamById(val))
						.appendTo($(_this.content_selector));
					if(j % 2 == 1){ item.css('margin-right', '0');}	
					j++;
		});
		
		// enable card toggle
		$('.toggle-card').click(function(e){ if($(this).text() == 'view abstract'){ $(this).text('view metadata');}else{ $(this).text('view abstract');} $(this).parent().find('.show').toggle(); });
		
		// reset drop downs
		$('.getStreamsByTitle').val(-1);
		$('.getStreamsByCategory').val(-1);
	},

	
	//
	getMetadataById : function(id){ 
		return this.getStreamById(id).metadata[0];
	},

	//
	getTagsById : function(id){
		return this.getStreamById(id).tags;
	},
	
	//
	getVideoById : function(id){
		var video = $('<div></div>')
			.attr('type',"video")
			.attr('starttime',0)
			.attr('duration',7)
			.attr('id', "my video")
			.text(this.getStreamById(id).video); 
		$(this.dom).append(video);
	},
	
	//<div type="toc" starttime=83 duration=1 id="">Objectives of the lecture</div>
	getTocById : function(id){
		var _this = this;
		$.each(	this.getStreamById(id).toc, function(val){
			var toc = $('<div></div>')
			.attr('type',"toc")
			.attr('starttime', this.start)
			.attr('duration', this.duration)
			.attr('id', "")
			.text(this.label); 
			$(_this.dom).append(toc);
		});
	},
	
	// <div type="xlink" starttime=297 duration=14 posx=32 posy=90 id="Using existing Videos" >bonk1</div>
	getLinksById : function(id){
		var _this = this;
		$.each(	this.getStreamById(id).links, function(val){ 
			var links = $('<div></div>')
			.attr('type', this.type) // former default: "xlink"
			.attr('starttime', _this.deci2seconds(this.start))
			.attr('duration', this.duration)
			.attr('posx', this.x)
			.attr('posy', this.y)
			.attr('seek', _this.deci2seconds(this.seek))
			.attr('duration2', _this.deci2seconds(this.duration2))
			.attr('id', this.id)
			.text('#'+this.text);
			$(_this.dom).append(links);
		});
	},
	
	// <div type="seq" starttime=1344 duration=165 id=hello>hydro_graefe-11.jpg</div>  
	getSlidesById : function(id){
		var _this = this;
		$.each(	this.getStreamById(id, true).slides, function(val){
			var slides = $('<div></div>')
			.attr('type',"seq")
			.attr('starttime', this.starttime)
			.attr('duration', this.duration)
			.attr('seek', this.seek != null ? _this.deci2seconds(this.seek) : 0)
			.attr('duration2', this.duration2 != null ? this.duration2 : 0)
			.attr('id', this.id)
			.text(id+'/'+this.img);
			$(_this.dom).append(slides);
		});
	}, 


	//get all categories
	getCategories : function(){
		var cat = [];
		$.each(this.json_data._stream, function(val){
				cat.push({first_level: this.metadata[0].category});
		});
		return this.staticCategorySort(this.removeDuplicates(cat));
	},
	
	//get all titles
	getTitles : function(){
		var titles = [];
		$.each(this.json_data._stream, function(val){
				titles.push({first_level: this.metadata[0].title});
		});
		return this.removeDuplicates(titles);
	},
	
	
	//get all authors
	getAuthors : function(){
		var authors = [];
		$.each(this.json_data._stream, function(val){
				authors.push({first_level: this.metadata[0].author});
		});
		return this.removeDuplicates(authors);
	},
	
	//get all tags
	getTagList : function(){
		var tags = [];
		$.each(this.json_data._stream, function(val){
			$.each(this.tags, function(val){
				tags.push({first_level: this.tagname});
			});
		});
		return this.removeDuplicates(tags).sort();
	},
	
	//
	getTagTaxonomie : function(){
		var tax = [];
		$.each(this.json_data._taxonomy, function(i, stream){
			tax.push({first_level: this.id, second_level: this.sub});	
		});
		return tax;
	},
	
	
	//
	removeDuplicates : function(cat){
		cat = cat.sort();
    for(var i = 1; i < cat.length; ){
    	if(cat[i-1] == cat[i]){ cat.splice(i, 1); } 
    	else { i++; }
    }
    return cat;     
	},
	
	/*
	Dirtiest hack ever, instead of adding category weight parameter
	*/
	staticCategorySort : function(arr){
		return [{first_level:'Introduction'},{first_level:'Water and the physical environment'}, {first_level:'Technical measures'}, {first_level:'Water governance'}, {first_level:'Economic instruments'}, {first_level:'Tools'}, {first_level:'IWRM implementation and case studies'}];
	},
	
	//
	deci2seconds : function(s){
		if(Number(s) < 0 || s == null){ return 0; }
		var arr = s.split(':');
		return Number(arr[0])*3600+Number(arr[1])*60+Number(arr[2]);
	},

	/**/
	buildDropDown : function(options, label, func){
		var _this = this;
		var sel = $('<div></div>')
		.attr('class','nav')
		.text(label)
		.append($('<ul></ul>').addClass('nav-list').addClass(func));
		
		$.each(options, function(i, val){
			var tugs = val.first_level; 
			$(val.second_level).each(function(i, val){ tugs = tugs+'+'+val;});	
			
			var item = $('<li></li>')
				.addClass('nav-item')
				.html(
					$('<a></a>')
						.text(val.first_level)
						.click(function(){
							eval('_this.'+func+'("'+tugs+'")');
					})
				);
				
			$(sel).find('ul').append(item);
						
			if(val.second_level == null){
				item.click(function(){ eval('_this.'+func+'("'+val.first_level+'")'); });
			}else{
				var nav = $('<div></div>').addClass('nav-list2').remove();
				$(val.second_level).each(function(i, value){ 
						var el = $('<a></a>')
							.addClass('nav-item2')
							.text(value)
							.click(function(){
									eval('_this.'+func+'("'+value+'")');
							});
						nav.append(el);
					});
				item.append(nav);
			}
		});		
		return sel;
	},
	
	//
	
	validateTags : function(){
		var tax = [];
		$.each(this.json_data._taxonomy, function(i, stream){
			$.each(stream.sub, function(i, val){
				tax.push(val);//{first_level: this.id, second_level: this.sub});	
			});
			//tax.push(stream.id);
		});
		var tags = [];
		$.each(this.json_data._stream, function(i, val){
			$.each(this.tags, function(i, tag){
				tags.push(tag.tagname)
			});
		});
		
		$.each(tax, function(i, val){
				if($.inArray(val, tags) == -1){
					$('#debug').append(val+', ');
				}
		});
		
	},


	//
	validateTags2 : function(){
	
		var tax = [];
		$.each(this.json_data._taxonomy, function(i, stream){
			$.each(stream.sub, function(i, val){
				tax.push(val);//{first_level: this.id, second_level: this.sub});	
			});
			tax.push(stream.id);
		});

		$.each(this.json_data._stream, function(i, val){
			$('#debug').append('Not found in '+val.id+': ');
			$.each(this.tags, function(i, tag){
				if($.inArray(tag.tagname, tax) == -1){
					$('#debug').append(tag.tagname+', ');
				}
			});
			$('#debug').append('<br/>');
		});

	},
	
	//
	validateLinks : function(){
		$.each(this.json_data._stream, function(i, val){
			$('#debug').append('['+val.id+'] '+val.metadata[0].title+' ('+val.metadata[0].author+'):<br/>');
			$.each(this.links, function(i, l){
					$('#debug').append('"'+l.id+'" @ '+l.start+' => '+l.text+'<br/>');
			});
			$('#debug').append('<br/>');
		});
	},
		
		
	/*

{"template":"basic","title":"New Project","guid":"E073E685-3ED6-4C5C-A210-A137894E4745","project":
{"targets":[{"id":8,"name":"Area1"},{"id":9,"name":"Area2"}],
"media":[{"id":"Media4","name":"Media41327357877524","url":"http://127.0.0.1/elearning/vi2/_attachments/videos/iwrm_cullmann.ogv","target":"main","
duration":178.378,"tracks":[

{"name":"Track1327357889581","id":"Track6","trackEvents":[

{"id":"TrackEvent128","type":"text","popcornOptions":{"start":3.5563294858342074,"end":12.915091290661069,"text":"hello","target":"Area2"},"track":"Track1327357889581","name":"Track1327357889591"}


]}]}]}}
	
	*/	
	generateButter : function(id){
		var _this = this;
		var butter = '{"template":"basic","title":"'+id+'","guid":"AA41AB3B-D145-477E-A264-3B42701F1E85", "project": {"targets":[{"id":0,"name":"Area1"},{"id":1,"name":"pop-container"}],"media":[ {"id":"Media0","name":"Media01327337635028","url":"http://127.0.0.1/elearning/vi2/_attachments/videos/iwrm_cullmann.ogv","target":"main","duration":4829.205,"tracks":[';
		var track0 = '',
		 		track1 = '',
		 		track2 = '',
		 		butter1 = '',
		 		butter2 = '', 
		 		butter3 = '';
		
		// fetch slides
		$.each(this.getStreamById(id, true).slides, function(i, val){
			//butter += '{"image":{"start": '+this.starttime+',"end":'+(this.starttime + this.duration) +',"href":"","src":"http://127.0.0.1/elearning/vi2/_attachments/slides/'+id+'/'+this.img+'", "text":"", "target":"image-container", "link":{}, "id":"'+this.img.replace(/.jpg/, '')+'"}},'
			if(i % 2 == 0 ){
				butter1 += '{"id":"TrackEvent'+i+'","type":"image","popcornOptions": {"start":'+this.starttime+',"end":'+(this.starttime + this.duration) +',"href":"","src":"http://127.0.0.1/elearning/vi2/_attachments/slides/'+id+'/'+this.img+'","text":"","target":"Area1"}, "track":"Track1327337639244","name":"Track1327337639'+Math.ceil(Math.random()*1000)+'"},';		
			}else{
				butter2 += '{"id":"TrackEvent'+i+'","type":"image","popcornOptions": {"start":'+this.starttime+',"end":'+(this.starttime + this.duration) +',"href":"","src":"http://127.0.0.1/elearning/vi2/_attachments/slides/'+id+'/'+this.img+'","text":"","target":"Area1"}, "track":"Track1327337639255","name":"Track1327337639'+Math.ceil(Math.random()*1000)+'"},';		
			}
		}); 
		
		// fetch hyperlinks 
		$.each(this.getStreamById(id).links, function(i, val){
			butter3 += '{"id":"TrackEventA'+i+'","type":"pop","popcornOptions":{"start":'+Number(_this.deci2seconds(this.start))+',"end":'+(Number(_this.deci2seconds(this.start))+Number(this.duration))+',"exit":"2.5","text":"'+this.id+'", "link":"'+this.text+'","target":"pop-container", "left":"'+this.x+'%", "top":"'+this.y+'%"},"track":"Track1327357889566","name":"Track1327357889'+Math.ceil(Math.random()*1000)+'"},';		
		});
		track0 = '{"name":"Track1327337639244","id":"Track0", "trackEvents":['+butter1.substr(0, butter1.length -1)+']},';
		track1 = '{"name":"Track1327337639255","id":"Track1", "trackEvents":['+butter2.substr(0, butter2.length -1)+']},';
		track2 = '{"name":"Track1327357889566","id":"Track2", "trackEvents":['+butter3.substr(0, butter3.length -1)+']}';
		
		butter += track0 + track1 + track2 + ']}]}}';
		
		//$('#debug').html(butter);
		//this.json_import();
		//this.test();
	},	

	//
	/*
	Imports popcorn json into vi-two data
	*/
	json_import : function(){ return;
		var lectures = '';
		var images = '';
		$.ajax({
    	type: "POST",
    	dataType: "json",
    	url: './data-pop.json',
    	success: function(lec){   
    		$.each(lec.data, function(i, val){
    			images = '';  //alert('s'+val.project.media[1].tracks.length);
    			$.each(val.project.media[1].tracks, function(i, track){    
    				$.each(track.trackEvents, function(i, img){ 
    					if(img.type === 'image')
    					images += '{ "type":"seq", "starttime":'+img.popcornOptions.start+', "duration":'+(img.popcornOptions.end-img.popcornOptions.start)+', "id":"", "img":"'+String(img.popcornOptions.src).replace("http://127.0.0.1/elearning/vi2/_attachments/slides/"+val.title+"/", "")+'" },';	
    				});
    			});
    			lectures += '{ "id": "'+val.title+'", "slides":['+ images.substr(0, images.length - 1) +']},';			
    		});
    		var jsoon = '';
				jsoon += '{ "_name": "vi2 slides", "_slides": [';
				jsoon += lectures.substr(0, lectures.length -1 );
				jsoon += ']}';
				$('#debug').html(jsoon);
    	},
			error: function(e){ alert('error at json import'); },
		});
		
		
	},
	
	test : function(){
	var dataString ='cullmann';
	if ( dataString ) { 
          		
          		var butter = '{"template":"basic","title":"'+dataString+'","guid":"AA41AB3B-D145-477E-A264-3B42701F1E85", "project": {"targets":[{"id":0,"name":"Area1"},{"id":1,"name":"pop-container"}],"media":[ {"id":"Media0","name":"Media01327337635028","url":"http://127.0.0.1/elearning/vi2/_attachments/videos/iwrm_'+dataString+'.ogv","target":"main","duration":4829.205,"tracks":[';
							var track0 = '',
		 					track1 = '',
		 					track2 = '',
		 					butter1 = '',
		 					butter2 = '', 
		 					//bam = '',
		 					butter3 = '';
							// 		
          		$.ajax({
    						type: "POST",
    						dataType: "json",
    						url: 'http://127.0.0.1/elearning/vi2/_attachments/data-slides.json',
    						success: function(data){  
    							$.each(data._slides, function(j, val){ 
    								//bam += '<option value="'+val.id+'">'+val.id+'</option>'
    								if(val.id == dataString){  
    									// fetch slides
											$.each(val.slides, function(i, val){ 
												if(i % 2 == 0 ){ 
													butter1 += '{"id":"TrackEvent'+i+'","type":"image","popcornOptions": {"start":'+this.starttime+',"end":'+(this.starttime + this.duration) +',"href":"","src":"http://127.0.0.1/elearning/vi2/_attachments/slides/'+dataString+'/'+this.img+'","text":"","target":"Area1"}, "track":"Track1327337639244","name":"Track1327337639'+Math.ceil(Math.random()*1000)+'"},';		
												}else{
													butter2 += '{"id":"TrackEvent'+i+'","type":"image","popcornOptions": {"start":'+this.starttime+',"end":'+(this.starttime + this.duration) +',"href":"","src":"http://127.0.0.1/elearning/vi2/_attachments/slides/'+dataString+'/'+this.img+'","text":"","target":"Area1"}, "track":"Track1327337639255","name":"Track1327337639'+Math.ceil(Math.random()*1000)+'"},';		
												}
											});
    								}
    							});	
    							//alert(bam);
									// fetch hyperlinks 
									/*$.each(this.getStreamById(id).links, function(i, val){
										butter3 += '{"id":"TrackEventA'+i+'","type":"pop","popcornOptions":{"start":'+Number(_this.deci2seconds(this.start))+',"end":'+(Number(_this.deci2seconds(this.start))+Number(this.duration))+',"exit":"2.5","text":"'+this.id+'", "link":"'+this.text+'","target":"pop-container", "left":"'+this.x+'%", "top":"'+this.y+'%"},"track":"Track1327357889566","name":"Track1327357889'+Math.ceil(Math.random()*1000)+'"},';		
									});*/
									track0 = '{"name":"Track1327337639244","id":"Track0", "trackEvents":['+butter1.substr(0, butter1.length -1)+']},';
									track1 = '{"name":"Track1327337639255","id":"Track1", "trackEvents":['+butter2.substr(0, butter2.length -1)+']}';
									//track2 = '{"name":"Track1327357889566","id":"Track2", "trackEvents":['+butter3.substr(0, butter3.length -1)+']}';
		
									butter += track0 + track1 + track2 + ']}]}}';
          		
          				$('#debug').html(butter);
  								//var data = JSON.parse( butter );
              		//popupManager.hidePopups();
              		//pm.importProject( data, document.getElementById( 'timeline-media-input-box' ).value );
    						},
								error: function(e){ alert('error at json import'); },
							});
          }
	
	},
	
	
	
	});// end IWAS class
	
