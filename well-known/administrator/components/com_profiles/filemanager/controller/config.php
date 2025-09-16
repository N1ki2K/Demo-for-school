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

require_once _FM_HOME_DIR .DS . 'includes'.DS.'confighelper.php';

class config extends MTask{
	
	public function _default(){
		$this->main();
	}//EOF _default
	
	
	public function main(){
		global $task;
		
		$isSend = MRequest::int("send",0);
		
		$_task = (!$task || $task == "default") ? "main" : $task;
		$this->view->add2Menu(MConfigHelper::getMenu());
		
		$config = MConfig::instance();		
		$err = array();
		
		if($isSend){
			$request = $config->request();
			if(! sizeof($request->error)){
				if(! _FM_IS_DEMO){
					$config->mixinAndSave($request->data);
				}
				MPeer::redirect(MURL::_("config",null,"main"). MSaved::url() );
			}else{
				$config->mixin($request->data);
				$err = $request->error;
			}
		}
		
		$this->view->add2Content(	MConfigHelper::generate($_task, $config, $err)	);
	}
	
	
}


	



?>