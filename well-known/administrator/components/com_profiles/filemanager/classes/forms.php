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

class MForms {
	
	/**
	 * 
	 * @param String $name
	 * @param Array $options
	 * @param Any $value
	 * @param Int $size
	 * @param Bool $multiple
	 * @param String $parameters
	 * @return NULL|string
	 */
	public static function select($name,$options=array(),$value=null,$size= 150 ,$multiple = null, $parameters = null){
		$count = count($options);
		if($count == 0 || !$name) return null;
		$multiple = $multiple? "multiple ": '';
		$out = '<select name="'.$name.'" size="'.$size.'" '.$multiple.$parameters.'>'."\n\t";
	
		foreach($options as $option){
			$selected = ($option['val'] == $value)? ' selected="selected" ' : null;
			$out .= '<option value="'. $option['val'].'"'.$selected.'>'.$option['text'].'</option>'."\n\t";
		}
		$out .= '</select>';
		return $out;
	}//EOF select
	/**
	 * 
	 * @param String $name
	 * @param Any $value
	 * @param Int $maxLength
	 * @param String $style
	 * @param String $parameters
	 * @return NULL|string
	 */
	public static function field($name=null,$value=null,$maxLength=null, $style= null, $parameters = null){
		if(!$name) return null;
		$maxLength = (!$maxLength)? 64 : $maxLength;
		$style = $style? (' style="'.$style.'" ') : null;
		return '<input type="text" name="'.$name.'" value="'.$value.'" '.$style.$parameters.'></input>'."\n";
	}
	/**
	 * 
	 * @param String $name
	 * @param Any $value
	 * @param String $style
	 * @param String $parameters
	 */
	public static function textArea($name=null,$value=null, $style= null, $parameters = null){
		if(!$name) return null;
		if($style){
			$style = ' style="'.$style.'" ';
		}
		return '<textarea name="'.$name.'" '.$style.$parameters.'>'.$value.'</textarea>'."\n";
	}
	
	
	
}