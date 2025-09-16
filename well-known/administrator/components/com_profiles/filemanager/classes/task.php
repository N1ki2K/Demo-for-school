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

class MTask extends MObject{
	/**
	 * 
	 * @var MView
	 */
	var $view = null;

	public function __construct($viewName){
		global $view,$task;
		
		if($viewName && class_exists($viewName)){
			$this->view = new $viewName($viewName,$this);	
		}else{
			$this->view = new MView($viewName,$this);
		}
		
		$method = $task ? $task:'_default';
		$method = ($method == "default") ? '_default' : $method;
		if(method_exists($this,$method)){
				$this->$method();
			}	else{
				$this->taskNotFound($method);
			}
		
		$this->renderView();		
	}	
	
	
	public function _default(){
		$this->view->content('Default method not overwritten!');
	}
	
	protected function includeLanguage(){
		global $view;
		MText::includeScope($view);
		$this->view->slot("_scope", $view);
	}
	
	protected function text($key = null){
		global $view;
		return MText::_($key,$view);
	}
	
	
	protected function taskNotFound($taskName){
		$this->view->content(MText::_('notask').$taskName);
	}
	
	public function renderView(){
		if($this->view)	$this->view->render();
	}
	
	protected function authAndDie($rule = null){
		$rule = trim($rule);
		if(! $rule || ! MRights::can($rule)){
			$errorText = ($rule !== null) ? MText::_("rights_noauth_".$rule) : MText::_("noauth");
			$goBackUrl = MURL::_();
			ob_start();
			include (_FM_HOME_FOLDER . DS . "templates".DS."noaccess.php");
			$dieOut = ob_get_clean();
			ob_get_clean();
			die($dieOut);
		}
		
	}
	
}