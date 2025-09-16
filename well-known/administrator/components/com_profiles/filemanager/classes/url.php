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

class MURL extends MObject{

	public static function _($setView = null, $setDir= null, $setTask = null, $postFix= null){		
		$base = (strpos(_FM_HOME_URL,"?")===false)? _FM_HOME_URL."?":_FM_HOME_URL."&";
		$base .= ($setView)? "view=".$setView:"";
		$base .= ($setDir)? "&dir=".$setDir:""; 
		$base .= ($setTask)? "&task=".$setTask: ""; 
		$base .= ($postFix)? "&".$postFix: "";
		
		return $base;
	}

	public static function _global($setView = null, $setDir= null, $setTask = null, $postFix= null){
		global $view,$dir,$task;
		$base = (strpos(_FM_HOME_URL,"?")===false)? _FM_HOME_URL."?":"&";
		$base .= ($setView)? "view=".$setView:$view;
		$base .= ($setDir)? "&dir=".$setDir:$dir; 
		$base .= ($setTask)? "&task=".$setTask: ""; 
		$base .= ($postFix)? "&".$postFix: "";
		
		return $base;
	}
	
	public static function safePath($path = null){
		return urlencode(str_replace(_START_FOLDER, "", $path));
	}

}

