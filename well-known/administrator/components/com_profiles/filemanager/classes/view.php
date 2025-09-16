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

class MTemplater extends MObject{

	/**
	 * 
	 * @param string $filePath
	 * @param array|object $arg
	 */
	public static function get($filePath,$arg){
		if (!file_exists($filePath) || is_dir($filePath)){
			if($arg['content']) return $arg['content'];			
			else return null;
		} else{
			foreach($arg as $key=>$value){
				$$key = $value;
			}
			ob_start();
			include($filePath);
			return ob_get_clean();			
		}
	}//EOF get
}//EOF Class MTemplater


class MView extends MObject{
	
	var $template = null;
	var $slots = array();
	var $viewName = null;
	var $myController = null;
	var $myModel = null;
	
	function __construct($viewName = null, & $controller=null){
		global $view;
			$this->myController = $controller;
		    $this->viewName = $viewName;
		    if(file_exists(_FM_HOME_DIR.DS.'templates'.DS.$view.".php")){
		    	$this->template = _FM_HOME_DIR.DS.'templates'.DS.$view.".php";
		    }
			
	}
	
	function setModel($model){
		$this->myModel = $model;
	}
	
	function slot($slotName,$content){
		$this->slots[$slotName] = $content;
	}
	
	function content($content=null){
		$this->slots["content"] = $content;
	}
	
	function buttons($content=null){
		$this->slots["buttons"] = $content;
	}
	
	function menu($content=null){
		$this->slots["menu"] = $content;
	}
	function setTemplate($template){
		$this->template = $template;
	}	
	
	function add2Menu($content=null){
		if(!isset($this->slots["menu"])) $this->slots["menu"] = "";
		$this->slots["menu"] .= $content;
	}
	
	function add2Content($content=null){
		if(!isset($this->slots["content"])) $this->slots["content"] = "";
		$this->slots["content"] .= $content;
	}	
	
	function authError($rule = null, $raw= false, $customContent = null){
		if(!$rule) return;
		$content =  ( !$raw ? '_fmError' : '' ) . ($customContent ? $customContent : MRights::getError($rule,1));
		$this->slots["content"] = $content;
	}
		
	function render(){
			if($this->template){
				§(MTemplater::get($this->template,$this->slots));	
			}else{
				if(isset($this->slots['content'])) §($this->slots['content']);	
			}
	}
	
	function addPreToContent($obj){
			$output = "<pre>\n";
			ob_start();
			print_r($obj);
			$output .= ob_get_clean()."\n</pre>\n";
			$this->add2Content($output);
	}
	

}
?>