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

function printPre($any =null){
	echo '<pre>';
	print_r($any);
	echo'</pre>';
}



class MPeer{
	
	public static function setSessionInfo($name = null,$value = null){
		if(!$name) return false;
		$app = JFactory::getApplication();
		$app->setUserState( "profiles.".$name, $value );
		
	}
	
	public static function getSessionInfo($name = null, $default = null){
		
		$app = JFactory::getApplication();
		return $app->getUserState( "profiles.".$name, $default );
	}
	

	/**
	 * 
	 * @param MRights $rightsObject
	 * @param int $level
	 * @param int $former
	 * 
	 * @return stdClass
	 */
	public static function getUserGroups(& $rightsObject = null, $level = 0, $former = -1){
		$level = (int) $level;
		$former = (int) $former;
		if($level == $former) return null;
		$db = JFactory::getDbo();
		$query = "SELECT `id`,`parent_id`,`title` FROM `#__usergroups` WHERE `parent_id` = '$level' ";
		$db->setQuery($query);
		$rows = $db->loadObjectList();
		if($rows){
			$roots = self::getRootGroups();			
			foreach($rows as & $row){
				$row->isRoot = (in_array((int) $row->id, $roots)) ? 1 : 0;
				
				if($rightsObject && get_class($rightsObject) == "MRights"){
					$rightsObject->setLookUp( clone $row);
				}
				
				$db->setQuery("SELECT COUNT(*) AS `size` FROM `#__usergroups` WHERE `parent_id` = '$row->id' LIMIT 1");
				$subs = $db->loadObject();
				if($subs && $subs->size){
					$row->sub = self::getUserGroups($rightsObject, $row->id,$level);
				}
			}
		}
		return $rows;
	}
	/**
	 * 
	 * @return stdClass
	 */
	public static function getUser(){
		static $return;
		if(isset($return))return $return;
		$user = JFactory::getUser();
		$return = new stdClass();
		$takeOver = array("id","username","name","email");
		foreach($user as $key=>$value){
			if(in_array($key, $takeOver)){
				$return->$key = $value;
			}
		}
		$return->groups = $user->getAuthorisedGroups();
		$return->isRoot =  $user->get('isRoot');
		return $return;
	}
	
	/**
	 * 
	 * @return array:
	 */
	public static function getRootGroups(){
		static $roots;
		if(isset($roots)) return $roots;
		$roots = array();
		
		$db = JFactory::getDbo();
		$db->setQuery("SELECT `rules` FROM `#__assets` WHERE `name`= 'root.1' LIMIT 1");
		$row = $db->loadObject();
		$assets = isset($row->rules) ? json_decode($row->rules) : null;
		$admins = null;
		foreach($assets as $key=>$value){
			if($key == "core.admin") $admins = $value;
		}
				
		foreach($admins as $key=> $value){
			if($value) array_push($roots, (int) $key);
		}
		return $roots;
	}
	/**
	 * 
	 * @param string $url
	 */
	public static function redirect($url = null){
		$app = JFactory::getApplication();
		$app->redirect($url);
	}
	
	
}
