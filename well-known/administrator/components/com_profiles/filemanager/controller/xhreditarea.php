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

class xhreditarea extends MTask{
	
	function _default(){
		$this->authAndDie("open");
		
		$syntax = MRequest::clean("syntax");
		$sid = MRequest::int("sid",null);
		$height = MRequest::int("height",550);
		$syntax = ($syntax=="text")? "robotstxt":$syntax;
		header('Content-type: text/javascript'); 
		
		echo '
		var mCodeMirror'.$sid.' = CodeMirror.fromTextArea(
				_("mEditArea-'.$sid.'"), 
				{  lineNumbers: true,
				   theme: "eclipse",
				   matchBrackets: true,
				   mode: "'.$syntax.'",
				   indentUnit: 4,
				   indentWithTabs: true,
				   enterMode: "keep",
				   tabMode: "shift"
  				});
  				
  		mCodeMirror'.$sid.'.setSize("100%","'.$height.'px");	
		';
		exit;
	}

}


