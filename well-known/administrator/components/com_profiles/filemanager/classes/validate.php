<?PHP
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

class MValidate{
	
	public static function path($path,$return=null){
		
		if(!$path) return $return;
		if(@get_magic_quotes_gpc()){
			$path = stripslashes($path);
			$path = strip_tags($path);
		}
		if(!MFile::isSubDir($path,$GLOBALS['folderAccess'])){
			return $return;
		}
		return $path;
	}//EOF static path
	
	
	public static function email($email){
		$email = trim($email);
		return (preg_match('/^([a-zA-Z0-9!#?^_`.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,6})$/', $email)) ;
	}
	
	
	public static function multiemail($email){
		if(substr_count($email,";") == 0 && substr_count($email,",") == 0) return self::email($email);
		else{
			$emails = preg_split("/[;,]+/", $email);	
			$isMail = true;
			foreach($emails as $mail){
				if($mail != "" && !self::email($mail)) $isMail = false;
			}
			return $isMail;
		}
	}
	
	
	protected static function checkRegEx($pattern,$value){
		return (preg_match($pattern,$value)) ? true : false;
	}
	
	public static function url($url){
		$regex = '/^(([\w]+:)?\/\/)?(([\d\w]|%[a-fA-f\d]{2,2})+(:([\d\w]|%[a-fA-f\d]{2,2})+)?@)?([\d\w][-\d\w]{0,253}[\d\w]\.)+[\w]{2,6}(:[\d]+)?(\/([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)*(\?(&amp;?([-+_~.\d\w]|%[a-fA-f\d]{2,2})=?)*)?(#([-+_~.\d\w]|%[a-fA-f\d]{2,2})*)?$/';
		return self::checkRegEx($regex, trim($url));
	}
	
	
	public static function alphabetic($value){
		return !self::checkRegEx('/[^A-Za-z\\s]/',$value);
	}
	
	public static function alphanumeric($value){
		return !self::checkRegEx('/[^A-Za-z0-9\\s]/',$value);
	}
	
	public static function numeric($value){
		return !self::checkRegEx('/[^0-9\.]/',$value);
	}
	
	public static function float($value){
		return self::numeric($value);
	}
	
	public static function int($value){
		return !self::checkRegEx('/[^0-9]/',$value);
	}
	
	public static function _($rule = null, $value = null){
		$rule = trim($rule);
		if(method_exists('MValidate',$rule)){
			return call_user_func('MValidate::'.$rule,$value);
		}
		return null;
	}
	
	
}// EOF class Validate
