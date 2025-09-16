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

require_once _FM_HOME_DIR .DS . 'includes'.DS.'diaghelper.php';

class information extends MTask{
	
	public function _default(){
		
		$infoTemplates = _FM_HOME_FOLDER . DS ."languages" . DS . "info";
		
		$infoPath = $infoTemplates . DS . _MY_LANGUAGE . ".php" ;
		
		if(!MFile::is($infoPath)){
			$infoPath = $infoTemplates . DS . "en-GB.php";
		}
		
		$jed = "http://extensions.joomla.org/extensions/extension/core-enhancements/file-management/profiles";
// 		$jed = null;
		$render = MTemplater::get($infoPath, array("jed"=>$jed, "version"=>  "http://info.mad4media.com/?package=profiles&lang="._MY_LANGUAGE));
		$this->view->slot("jed", $jed );
		$this->view->add2Menu("");
		$this->view->add2Content($render);
	}//EOF _default
	
	

	
	
}


	



?>