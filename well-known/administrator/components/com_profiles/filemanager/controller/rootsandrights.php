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

require_once _FM_HOME_DIR .DS . 'includes'.DS.'rightshelper.php';

class rootsandrights extends MTask{
	
	function _default(){
		
		$id = MRequest::int("id", null);
		$isSend = MRequest::int("send",0);
		$roots = MRoots::getInstance();
		
		$this->view->slot("beforemenu", MRightsHelper::rootsNewButton());
		$this->view->slot("rootscount", $roots->getCount());
		
		if(!$isSend){
			if($id===null){
				$dataArray = $roots->getFirst();
				if($dataArray){
					$id = $dataArray[0];
					$data = $dataArray[1];
				}else{
					$data = MDO::instance();
					$id = -1;
				}
			}else{
				if($id >= 0){
					$data = $roots->get($id);
					if($data === false) {
						$dataArray = $roots->getFirst();
						if($dataArray){
							$id = $dataArray[0];
							$data = $dataArray[1];
						}else{
							$data = MDO::instance();
							$id = -1;
						}
					}
				}else{
					$data = MDO::instance();
				}
			}
			$this->view->slot("rootfolderid", $id);
			$this->view->add2Content(MRightsHelper::rootsMask($data,$id));
// 			$this->view->addPreToContent(htmlentities(MRightsHelper::rootsMask($data,$id)));
		}else{
			// is send
			$data = $this->_fetchData();
			$error = $data->get("isError", false);
			if(!$error){
				$this->deleteErrorVars($data);
				$redId = $roots->set($id,$data);
				if(! _FM_IS_DEMO){
					$roots->save();
				}
				$newRights = MRights::getInstance($redId);
				if(! _FM_IS_DEMO){
					$newRights->save();
				}
				MPeer::redirect(MURL::_("rootsandrights",null,null)."&id=".$redId . MSaved::url() );
			}else{
				$this->view->slot("rootfolderid", $id);
				$this->view->add2Content(MRightsHelper::rootsMask($data,$id));
			}
			
		}
		$this->view->add2Menu(MRightsHelper::rootsMenu($roots->get(),$id));
	}//EOF _default

	/**
	 * 
	 * @param MDO $data
	 * @return boolean
	 */
	protected function deleteErrorVars( & $data = null){
		if(!$data || ! is_object($data) || get_class($data) !== "MDO") return false;
		$names =  $this->getVarNames();
		foreach( $names as  & $name){
			$name = strtolower($name)."Error";
		}
		array_push($names, "isError");
		$data->delete($names);
		return true;
	}
	/**
	 * @return array
	 */
	protected function getVarNames(){
		return array("name","path");
	}
	
	/**
	 * @return MDO
	 */	
	protected function _fetchData(){
		$names = $this->getVarNames();
		
		$data = new stdClass();
		$data->isError = false;
		$data->name = MRequest::clean("name",null);
		$data->nameError = "";
		$data->path = str_replace("\\","/", MRequest::clean("path",null) );
		
		$data->pathError = "";
		if(!$data->name) $data->nameError .= MRightsHelper::wrapError(MText::_("error_noname"));
		
		// Just validate if not in demo mode
		if(! _FM_IS_DEMO){
			if(!$data->path) $data->pathError .= MRightsHelper::wrapError(MText::_("error_nopath"));
			else{
					if(!MFile::isDir($data->path) ) $data->pathError .= MRightsHelper::wrapError(MText::_("error_pathnofolder"));
				
			}
		}//EOF is not demo
		
		foreach($names as $name){
			$errVar = strtolower($name) . "Error";
			$data->isError = $data->isError ||  (bool) $data->$errVar;
		}
		
		return MDO::instance(null,$data);
		
	}	
		
	function deleterootfolder(){
		
		$id = MRequest::int("id", -1);
		if($id >-1){
			$roots = MRoots::getInstance();
			$before = "ID: ".$id."<br>". $roots;
			
			if($roots->get($id) !== false){
				$roots->delete($id);
				if(! _FM_IS_DEMO){
					$roots->save();
				}
				if(MFile::is( _FM_HOME_DIR . DS."data".DS."rights".DS . "rf". $id . ".php")){
					MFile::remove(_FM_HOME_DIR . DS."data".DS."rights".DS . "rf". $id . ".php",1);
				}
			}
		}
		$demoAdvice = _FM_IS_DEMO ? MSaved::url() : '';
		MPeer::redirect(MURL::_("rootsandrights",null,null) . $demoAdvice );
	}	
	
	function rights(){
		
		$id = MRequest::int("id", null);
		$isSend = MRequest::int("send",0);
		
		if($isSend){
			return $this->_rightsSave($id);			
		}
		
		
		$this->view->slot("beforemenu", MRightsHelper::rootsMenuHeading());
		
		$roots = MRoots::getInstance();
		
		$this->view->slot("rootscount", $roots->getCount());
		
		$getFirst = 0;
		if($id === null || ! is_int($id) || $id <0) {
			$getFirst = 1;
		}else{
			$rootFolder = $roots->get($id);
			if($rootFolder === false) $getFirst = 1;
		}
		
		if($getFirst){
			$arr = $roots->getFirst();
			$id = $arr[0];
			$rootFolder = $arr[1];
		}
		
		
		$this->view->slot("rootfolderid", $id);
		$this->view->add2Menu(MRightsHelper::rootsMenu($roots->get(),$id,"rights"));
		
		$rights =  MRights::getInstance($id);
		
		$content = MRightsHelper::form( MRightsHelper::rights( $rights->getTree(), $id )  , "rights", array("id"=>$id), MRequest::int("grouptab", null)) ;
// 		$this->view->addPreToContent($rights->getTree());
		
		$this->view->add2Content( MRightsHelper::rightsWrap($rootFolder->get("name"),$content) );
	}
	
	protected function _rightsSave($id = null){
		if($id === null || $id < 0) MPeer::redirect(MURL::_("rootsandrights",null,"rights")  );
		$rights =  MRights::getInstance($id);
		$rights->fetchData();
		if(! _FM_IS_DEMO){
			$rights->save();
		}
		$groupTab = MRequest::int("grouptab", null);
		$gtab = $groupTab !== null ? '&grouptab='.$groupTab : '';
		$this->view->addPreToContent($_REQUEST);
		MPeer::redirect(MURL::_("rootsandrights",null,"rights").'&id='.$id . $gtab . MSaved::url() );
	}
	
}



?>