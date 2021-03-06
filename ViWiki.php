<?php
/*

Test page: http://localhost/ihi/mediawiki119/index.php/KZ-Au%C3%9Fenlager_G%C3%B6rlitz
Wiki account: niels   qwertz

The following functions are accomplished
- script zum header hinzufügen
- js einbinden
- html einbinden
- call vi2

*/

$wgExtensionCredits['parserhook'][] = array(
        'path' => __FILE__,    
        'name' => "Hypervideo Extension",
        'description' => "A hypervideo parser in order to play them",    
        'version' => 1, 
        'author' => "niels.seidel@nise81.com",
        'url' => "http://www.nise81.com/",
);

// set hooks 
$wgHooks['ParserFirstCallInit'][] = 'vi2HypervideoParserInit';
$wgHooks['BeforePageDisplay'][]  = 'vi2JavaScript';

// path
$wgJQueryHypervideoExtensionPath = $wgScriptPath . '/extensions/ViWiki';//'http://127.0.0.1/elearning/vi2/_attachments';// 

 

/**/ 
function vi2HypervideoParserInit( &$parser ) {	
      $parser->setHook( 'hypervideo', 'vi2HypervideoRender' );
      return true;
}


/* vi2JavaScript
extend all needed javascripts
- scripts could be combined and minmized into a single script
*/
function vi2JavaScript( $out ) {
			global $wgJQueryHypervideoExtensionPath;
		
				
    	$javascript = $wgJQueryHypervideoExtensionPath."/js";
    	$scripts = '';
    	$scripts .= "<script type='text/javascript' language='javascript' src='".$javascript."/jquery-1.5.2.js'></script>";		
    	$scripts .= "<script type='text/javascript' language='javascript' src='".$javascript."/jquery-ui-1.8.6.custom.min.js'></script>";
    	$scripts .= "<script type='text/javascript' language='javascript' src='".$javascript."/jquery.inherit-1.1.1.js'></script>";
    	$scripts .= "<script type='text/javascript' language='javascript' src='".$javascript."/jquery-jtemplates.js'></script>";
    	$scripts .= "<script type='text/javascript' language='javascript' src='".$javascript."/jquery.json-2.2.min.js'></script>";
			$scripts .= "<script type='text/javascript' language='javascript' src='".$javascript."/jquery.piemenu.js'></script>";
			$scripts .= "<script type='text/javascript' language='javascript' src='".$javascript."/vi2.main.js'></script>";
			$scripts .= "<script type='text/javascript' language='javascript' src='".$javascript."/vi2.utils.js'></script>";
			$scripts .= "<script type='text/javascript' language='javascript' src='".$javascript."/vi2.videoplayer.js'></script>";
			$scripts .= "<script type='text/javascript' language='javascript' src='".$javascript."/jquery.tinysort.js'></script>";
			$scripts .= "<script type='text/javascript' language='javascript' src='".$javascript."/jquery.tooltip.js'></script>";
			$scripts .= "<script type='text/javascript' language='javascript' src='".$javascript."/jquery.tag-it.js'></script>";
			$scripts .= "<script type='text/javascript' language='javascript' src='".$javascript."/jquery.jqupload.min.js'></script>";
			$scripts .= "<script type='text/javascript' language='javascript' src='".$javascript."/jquery.spin.js'></script>";
			$scripts .= "<script type='text/javascript' language='javascript' src='".$javascript."/vi2.parser.js'></script>";
			$scripts .= "<script type='text/javascript' language='javascript' src='".$javascript."/vi2.clock.js'></script>";
			$scripts .= "<script type='text/javascript' language='javascript' src='".$javascript."/vi2.xlink.js'></script>";
			$scripts .= "<script type='text/javascript' language='javascript' src='".$javascript."/vi2.seq.js'></script>";
			$scripts .= "<script type='text/javascript' language='javascript' src='".$javascript."/vi2.tags.js'></script>";
			$scripts .= "<script type='text/javascript' language='javascript' src='".$javascript."/vi2.toc.js'></script>";
			$scripts .= "<script type='text/javascript' language='javascript' src='".$javascript."/vi2.metadata.js'></script>";
			$scripts .= "<script type='text/javascript' language='javascript' src='".$javascript."/vi-wiki.js'></script>";

			
			// send		
     	$out->addScript( $scripts );
     	
    	$out->addStyle($wgJQueryHypervideoExtensionPath."/style/ui-lightness/jquery-ui-1.7.2.custom.css");
			$out->addStyle($wgJQueryHypervideoExtensionPath."/style/jquery.ui.autocomplete.custom.css");
  	  $out->addStyle($wgJQueryHypervideoExtensionPath."/style/vi2.main.css");
  		$out->addStyle($wgJQueryHypervideoExtensionPath."/style/vi2.videoplayer.css");


			// test call
     	$html = "<script type='text/javascript'>
     		$(document).ready(function(){
     			var t = new ViWiki();
     		});
     	</script> ";
			// send
			$out->addScript( $html );
			
			return true;
}


/* vi2HypervideoRender
substitute html container
*/ 
function vi2HypervideoRender( $input, $args, $parser) {
				//$html = '<div id="container"><div id="screen"><video id="video1" controls>Your browser does not support video.</video><div id="overlay"></div></div></div>';
        //return htmlspecialchars( $input . $args['arg1'] );
        $width = 400;
        /*
        $lines = preg_split('/\n/', $input);
        foreach($lines as $line){
        	if(substr($line, 0,8) == "[[Video:" || substr($line, 0,8) == "[[video:"){
        		$args = preg_split('/\|/', $line);
        		foreach($args as $arg){
        			if(preg_match('/px/', $arg)){
        				$width = preg_replace(array('/\[/','/\]/', '/p/', '/x/'), array('','','',''), $arg);
        			}
        			
        		}
        	} 
        }
        */
        // 
        return '<p><div id="container"><div id="screen"></div></div><div id="markup">'.$input.'</div></p>';
}



/**/
$editorBtnVideo = "/extensions/ViWiki/img/edit_btn_1.png";
$wgHooks['EditPage::showEditForm:initial'][] = 'myRedirectButton';

// Add a button to the internal editor
function myRedirectButton ($editPage) { 
  global $wgOut, $wgScriptPath, $editorBtnVideo;
  
  // Insert javascript script that hooks up to create button.
  $wgOut->addScript("<script type=\"text/javascript\">
				function myAddButton(){
//				var btn = '<img src=\"".$wgScriptPath."/extensions/ViWiki/img/edit_btn_1.png\" />;
        $('#toolbar').html('');
//        btn.bind('click', function(){ 	alert('done');});
				//	addButton('$wgScriptPath$editorBtnVideo','Redirect','#REDIRECT [[',']]','Insert text');
        }
       addOnloadHook(myAddButton);  
       </script>");
        return true;
  }



?>
