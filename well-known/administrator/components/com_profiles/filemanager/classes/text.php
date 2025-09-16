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

class MText{
	protected static $textArray = array();
	protected static $scope = array();
	public static function load($path=null){
		$path = ($path)?$path: _FM_LANGUAGE_DIR;
		$tag = _MY_LANGUAGE;
		// Tag security
		$tag = (string) preg_replace('/[^A-Za-z-]/i', '', $tag);
		
		if(! file_exists($path.DS.$tag.".ini")) $tag = "en-GB";
		
		if($tag=="en-GB" || $tag== "en-US" || $tag=="en-AU" || $tag== "en-NZ"  || $tag=="en-ZA" || $tag== "en-TT"){
			self::add(MFile::parseData($path.DS."en-GB.ini"));
			return true;	
		}
		
		$englishTextArray = MFile::parseData($path.DS."en-GB.ini");
		$currentTextArray = MFile::parseData($path.DS.$tag.".ini");
		if($currentTextArray){
			
			$newTextArray = array_merge($englishTextArray,$currentTextArray);
			self::add($newTextArray);
			return true;	
		} else{
			self::add($englishTextArray);
			return false;	
		}
	}
	
	public static function add($array){
		if($array){
			self::$textArray = array_merge(self::$textArray ,$array);	
		}
			
	}	
	
	public static function _($key, $scope = null){
		$_key = strtolower(trim($key));
		$scope = strtolower(trim($scope));
		if(!$scope || $scope == "global"){
			if(isset( self::$textArray[$_key]) && self::$textArray[$_key]) return self::$textArray[$_key];
		}else if(isset(self::$scope[$scope])){
			if(isset(self::$scope[$scope][$_key]) && trim(self::$scope[$scope][$_key]) ) return self::$scope[$scope][$_key];	
		}		
		return $key;
	}
	
	public static function includeScope($scopeName = null){
		$scopeName = strtolower(trim($scopeName));
		if(!$scopeName) return false;
		$tag = _MY_LANGUAGE;
		// Tag security
		$tag = (string) preg_replace('/[^A-Za-z-]/i', '', $tag);
		$path = _FM_LANGUAGE_DIR;
		
		if(! file_exists($path.DS.strtolower($scopeName).".".$tag.".ini")) $tag = "en-GB";
		
		
		$englishTextArray = MFile::parseData($path.DS.strtolower($scopeName).".en-GB.ini");
		$currentTextArray = MFile::parseData($path.DS.strtolower($scopeName).".".$tag.".ini");
		if($currentTextArray){
			$newTextArray = array_merge($englishTextArray,$currentTextArray);
			self::$scope[$scopeName] = $newTextArray;
			return true;	
		} else{
			self::$scope[$scopeName] = $englishTextArray;
			return false;	
		}		
	}
	
	
	public static function more($sentence){
		$peaces = explode(" ",$sentence);
		$return = array();
		foreach ($peaces as $textItem){
			$return[] = self::_($textItem);
		}
		return implode(" ",$return);
	}
	
	public static function toJSON(){
		$json = '{'."\n";
		foreach(self::$textArray as $key => $value){
			$value = strip_tags( str_replace('"', '“', $value) );				
			$json .= '"'.$key.'":"'.$value.'",'."\n";	
		}
		$json .= '}';
		return str_replace(",\n}","\n}",$json);
	}
	
	
}//EOF class MText

MText::load();