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

class MIcon{
	protected static $lookUp = null;
	
	public static function init(){
		if(! self::$lookUp){
			$name = _FM_HOME_DIR.DS."data".DS."icons.ini";
			if(MFile::is($name)){
				self::$lookUp = MFile::parseData($name, true, false);
			}else{
				self::$lookUp = new stdClass();
			}
		}
	}
	/**
	 * 
	 * @param string $ext	the extension of the file
	 * @param int|bool $isBigIcon	path is big icons or small icons
	 */
	public static function _($ext = "default", $isBigIcon = 0){
		$ext = strtolower(trim($ext));
		$path = $isBigIcon ? _FM_HOME_DIR.DS."images".DS."bigicons".DS : _FM_HOME_DIR.DS."images".DS."icons".DS;
		$uri = $isBigIcon ? _FM_HOME_FOLDER.'/images/bigicons/' : _FM_HOME_FOLDER.'/images/icons/';
		$iconName = (isset(self::$lookUp->$ext)) ? self::$lookUp->$ext : $ext;
		$iconName = MFile::is($path.$iconName . ".png") ? $iconName : "default";
		return $uri . $iconName . ".png";
	}	
	
	public static function getLookUp(){
		return self::$lookUp;
	}
	
	
}//EOF class

MIcon::init();

?>