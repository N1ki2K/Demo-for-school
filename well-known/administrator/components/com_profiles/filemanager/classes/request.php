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

define('MREQUEST_INT',0);
define('MREQUEST_FLOAT',1);
define('MREQUEST_STRING',2);
define('MREQUEST_RAW',3);
define('MREQUEST_CMD',4);
define('MREQUEST_CLEANPATH',5);


class MRequest{
	
	public static function int($name,$return = 0){
		if(isset($_REQUEST[$name])) {
			return (int) $_REQUEST[$name];
		}else {
			return $return;
		}
	}//EOF int
	
	public static function float($name,$return = 0.0){
		if(isset($_REQUEST[$name])) {
			return (float) $_REQUEST[$name];
		}else {
			return $return;
		}
	}//EOF float
	
	public static function clean($name,$return = null){
		if(isset($_REQUEST[$name])) {
			$variable = strip_tags($_REQUEST[$name]);
			if(!get_magic_quotes_gpc()){
				$variable = addslashes($variable);
			}
			return $variable;
		}else {
			return $return;
		}
	}//EOF clean
	
	public static function raw($name,$return = null){
		if(isset($_REQUEST[$name])) {
		$variable = $_REQUEST[$name];
		if(get_magic_quotes_gpc()){
			$variable = stripslashes($variable);
		}
			return $variable;
		}else {
			return $return;
		}
	}//EOF raw
	
	public static function cmd($name,$return = null){
		if(isset($_REQUEST[$name])) {
			$variable = (string) preg_replace('/[^A-Za-z0-9_\.-]/i', '', $_REQUEST[$name]);
			$variable = ltrim($variable, '');
			return $variable;
		}else {
			return $return;
		}		
	}
	
	
	public static function bool($name,$return = false){
		if(isset($_REQUEST[$name])) {
			$variable = (bool) $_REQUEST[$name];
			return $variable;
		}else {
			return $return;
		}
	}//EOF bool
	
	public static function cleanpath($name, $return = null){
		$variable =  isset($_REQUEST[$name]) ? $_REQUEST[$name] : $return;
		return self::filter( $variable, MREQUEST_CLEANPATH);
	}
	
	public static function filter($val = null, $filter = MREQUEST_STRING ){
		switch ($filter){
			default:
			case MREQUEST_STRING:
				$val = strip_tags($val);
				if(!get_magic_quotes_gpc()){
					$val = addslashes($val);
				} 
				return $val;
				break;
		
			case MREQUEST_INT:
				return  (int) $val;
				break;
		
			case MREQUEST_FLOAT:
				return (float) $val;
				break;
					
			case MREQUEST_CMD:
				$val = (string) preg_replace('/[^A-Za-z0-9_\.-]/i', '', $val);
				$val = ltrim($val, '');
				return $val;
				break;
				
			case MREQUEST_CLEANPATH:
				$val = (string) str_replace("\\", '/', $val);
				$parts = explode('/',$val);
				$l = sizeof($parts);
				for($t=0; $t< $l; $t++){
					$parts[$t] =trim($parts[$t]);
					$check = str_replace(array(" ","\t","\r","\s","\n"), "", $parts[$t]);
					$match = array(".....","....","...","..",".");
					if(in_array($check,$match)) $parts[$t] = "";
				}
				if($l == 1) return $parts[0];
				else if($l>1){
					$val = implode("/", $parts);
					return str_replace(array("/////////","////////","///////","//////","/////","////","///","//"), "/", $val);
				}else return "";
				break;
		}
		
	}
	
	public static function getCookie($name = null,$default = null, $filter = MREQUEST_STRING ){
		if(!$name || ! isset($_COOKIE[$name])) return $default;
		
		return self::filter($_COOKIE[$name], $default, $filter);		
		
	}
	
	public static function setCookie($name = null, $value = null ){
		if(!$name) return;
		setcookie($name, $value, _FM_COOKIE_EXPIRE);
		$_COOKIE[$name] = $value;
	}
	
	public static function _($rule, $name= null, $default = null){
		$rule = trim($rule);
		$notAllowed = array("getCookie","setCookie","filter");
		if(in_array($rule, $notAllowed)) return $default;
		
		if(method_exists('MRequest',$rule)){
			return call_user_func('MRequest::'.$rule,$name,$default);
		}
		return $default;
	}
	
}//EOF class MRequest
