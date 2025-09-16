<?php
/**
 * @package		Profiles
 * @subpackage	filemanger
 * @copyright	Copyright (C) 2013 - 2013 Mad4Media - Dipl. Informatiker(FH) Fahrettin Kutyol. All rights reserved.
 * @license		GNU General Public License version 2 or later; see LICENSE.txt
 * @license		Libraries can be under a different license in other environments
 * @license		Media files owned and created by Mad4Media such as 
 * @license 	Javascript / CSS / Shockwave or Images are licensed under GFML (GPL Friendly Media License). See GFML.txt.
 * @license		3rd party scripts are under the license of the copyright holder. See source header or license text file which is included in the appropriate folders
 * @version		1.0
 * @link		http://www.mad4media.de
 * Creation date 2013/02
 */

//CUSTOMPLACEHOLDER
//CUSTOMPLACEHOLDER2

defined('_JEXEC') or die;


class MSaved{
	
	public static function url(){
		MRequest::setCookie("profilesissaved", 1);
		return '&saved=1';
	}
	
	public static function _(){
		$isSaved = MRequest::getCookie("profilesissaved",0, MREQUEST_INT);
		
		if($isSaved){
			MRequest::setCookie("profilesissaved", 0);
			$css = _FM_IS_DEMO ? "rejectedAdvice" : "savedAdvice";
			$text = _FM_IS_DEMO ? "notfordemo" : "datasaved";
			echo '
				<div id="mSavedAdvice" class="'.$css.'"><div>'.MText::_($text).'</div></div>
				<script type="text/javascript">
					dojo.addOnLoad(function(){
							var node = dojo.byId("mSavedAdvice");
							dojo.style(node,{opacity: 0});
							_fx.fadeOpacity(node,300,0,1,function(){
								setTimeout(function(){
									var node = dojo.byId("mSavedAdvice");
									dojo.style(node,{opacity: 1});
									_fx.fadeOpacity(node,400,1,0,function(){
										 _removeNode(dojo.byId("mSavedAdvice"));
									});
								},2000);
							});
					});
				</script>
			';
		}
		
		
	}
		
	
}


?>