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


class MVersion{
	
	public static $major = 1;
	public static $minor = 5;
	public static $patch = 0;
	public static $stage = "";
	
	public static $build = 118;
	
	public static function get(){
		return self:: $major . "." . self::$minor . "." .  self::$patch . ( self::$stage ? ' '.self::$stage : '');
	}
	
	public static function getFull(){
		return self:: $major . "." . self::$minor . "." .  self::$patch . ( self::$stage ? ' '.self::$stage : '') . " | Build ".self::$build;
	}
		
	public static function thisReleaseDate(){
		return '2015-02-18';
	}
	
	public static function getAuthor(){
		return 'Dipl. Informatiker(FH) Fahrettin Kutyol';
	}
	
	public static function getCopyright(){
		return '&copy; 2013 - '.date("Y") . " Mad4Media Inh. Fahrettin Kutyol. " . MText::_("allrightsreserved");
	}
	
	public static function getFirstRelease(){
		return '2013-03';
	}
	
}


?>