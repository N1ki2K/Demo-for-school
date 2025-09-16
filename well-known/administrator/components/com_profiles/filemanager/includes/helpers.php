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

function §($element=null,$isBR=false){

	$br = ($isBR)?'<br/>':'';
	$type = gettype($element);
	switch ($type){
		case "string":
		default:
			echo $element.$br."\n";
			break;
		case "array":
		case "object":
			$output = "<pre>\n";
			ob_start();
			print_r($element);
			$output .= ob_get_clean()."\n</pre>\n";
			echo $output;
			break;
	}
}//EOF Paragraph

function getPRE($element){
		$output = "<pre>\n";
			ob_start();
			print_r($element);
			$output .= ob_get_clean()."\n</pre>\n";
			return $output;
}



class DataObject{

	public function add($key,$value){
		if($key){
			$this->$key = $value;
			return $value;
		}else {
			return null;
		}
	}

	public function fromArray($array){
		foreach($array as $key=>$value){
			$this->$key = $value;
		}
	}

	public static function instance($array=null){
		if($array){
			$return = new DataObject();
			$return->fromArray($array);
			return $return;
		}else {
			return new DataObject();
		}
	}

	public function toArray(){
		return (array) $this;
	}

}//EOF DataObject

// unique
function getUnique($additionalInfo=null){
	return uniqid(md5($additionalInfo+microtime(false)));
}

// Returns True if Haystack ends with Needle
function endsWith($needle,$haystack){ return strrpos($haystack, $needle) === strlen($haystack)-strlen($needle); }

// Strips needle string from the end of a haystack string if needle exists on the end of haystack.
function stripEnd($needle,$haystack,$returnIfNull = true){
	$r =(endsWith($needle,$haystack))?substr($haystack,0,strlen($haystack)-strlen($needle)):null;
	if($r) return $r; else return ($returnIfNull)?$haystack:null;
}
// Strips all linebreaks
function stripLineBreak($expression=null){
	return str_replace("\n","",$expression);
}

function fitString2Box($string=null, $charbreak= 10, $break ="<br>"){
	if(!$string) return null;
	return wordwrap($string,$charbreak,$break);
	
}

function fitImage2Box($x=null,$y=null,$w=null,$h=null){
	$returnSize = array("w"=>"","h"=>"");
	$factorX = $w/$x;
	$factorY = $h/$y;
	if($factorX>=1 || $factorY>=1){
		if($factorX >= $factorY){
			$returnSize["w"] = $w/$factorX;
			$returnSize["h"] = $h/$factorX;
		}else{
			$returnSize["w"] = $w/$factorY;
			$returnSize["h"] = $h/$factorY;
		}
	}else{
		$returnSize["w"] = $w;
		$returnSize["h"] = $h;
	}
	
	return $returnSize;
}

function makeRC($name=null,$action=null,$icon=null,$id=null){
	
	echo '<li id="'.$id.'"><a href="" onclick="javascript:'.$action.'; return false;">'.
		'<img src ="'._FM_HOME_FOLDER.'/images/icons/'.$icon.'" border="0" /> <span>'.MText::_($name).'</span></a></li>';
	
}
	
function getMimeType($file){
		global $mimeTypes;
		$info = MFile::info($file);
		$ext = $info->extension;
		$mime = $mimeTypes->$ext;
		return $mime;
	}//EOF getType

function evalBytes($val) {
    $val = trim($val);
    $last = strtolower($val[strlen($val)-1]);
    switch($last) {
        case 'g':
            $val *= 1024;
        case 'm':
            $val *= 1024;
        case 'k':
            $val *= 1024;
    }
    return $val;
}
	
function pommesRitter($str){
	$l=strlen($str);
    $out="";
    FOR ($p = 0;$p<$l;$p++){
        // long code of the function to explain the algoritm
        //this function can be tailored by the programmer modifyng the formula
        //to calculate the key to use for every character in the string.
//        $Key_To_Use = (($l+$p)+1); // (+5 or *3 or ^2)
//        //after that we need a module division because can´t be greater than 255
//        $Key_To_Use = (255+$Key_To_Use) % 255;
//        $Byte_To_Be_Encrypted = SUBSTR($str, $p, 1);
//        $Ascii_Num_Byte_To_Encrypt = ORD($Byte_To_Be_Encrypted);
//        $Xored_Byte = $Ascii_Num_Byte_To_Encrypt ^ $Key_To_Use;  //xor operation
//        $Encrypted_Byte = CHR($Xored_Byte);
//        $out .= $Encrypted_Byte;
//       
        //short code of  the function once explained
        $out .= chr((ord(substr($str, $p, 1))) ^ ((255+(($l+$p)+1)) % 255));
    }
    return $out;
}

function myStripSlashes($str){
	if(get_magic_quotes_gpc()) return stripslashes($str);
	else return $str;
}


?>