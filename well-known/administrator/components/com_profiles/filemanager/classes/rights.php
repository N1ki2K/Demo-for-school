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

define("MRIGHTS_INHERIT", -1);
define("MRIGHTS_DISALLOW", 0);
define("MRIGHTS_ALLOW", 1);

class MRightsObject {
	var $read = MRIGHTS_INHERIT;
	var $write = MRIGHTS_INHERIT;
	
	var $use = MRIGHTS_INHERIT;
	var $zip = MRIGHTS_INHERIT;
	var $unzip = MRIGHTS_INHERIT;
	var $upload = MRIGHTS_INHERIT;
	var $deletefile = MRIGHTS_INHERIT;
	var $deletefolder = MRIGHTS_INHERIT;
	var $new = MRIGHTS_INHERIT;
	var $edit = MRIGHTS_INHERIT;
	var $open = MRIGHTS_INHERIT;
	var $download = MRIGHTS_INHERIT;
	var $rename = MRIGHTS_INHERIT;
	var $chmod = MRIGHTS_INHERIT;
	var $overwrite = MRIGHTS_INHERIT;
	var $move=  MRIGHTS_INHERIT;
	
	public function __construct($default = null){
		if($default !== null && $default != MRIGHTS_INHERIT){
			foreach($this as $key=>$value){
				$this->$key = $default;
			}
		}
	}
		
	public static function getRightNames(){
		static $arr;
		if(isset($arr)) return $arr;
		
		$dummy = new MRightsObject();
		$arr = array();
		foreach($dummy as $key=>$value){
			array_push($arr, $key);
		}
		return $arr;
	}
	
	public static function getReadNames(){
		return array("open","download");	
	}
	
	public static function getWriteNames(){
		return array("upload","edit","deletefile","deletefolder","new","move","copy","rename","chmod","overwrite","unzip","zip");
	}
		
	public static function instance($default = null){
		return MDO::instance(new MRightsObject($default));
	}
	
}


class MRights{
	
	var $rootFolderId= null;
	var $path = null;
	
	public static $folderCount = 0;
	
	protected static $user = null;
	
	protected static $lookUpById = array();
	
	protected static $tree;
	
	/**
	 * 
	 * @var array
	 */
	protected static $rights;
	/**
	 * 
	 * @var array
	 */
	protected static $calcultedRights;
	
	
	public function __construct($id = null){
		$this->path =  _FM_HOME_DIR . DS."data".DS."rights".DS;
		if(! isset(self::$tree)){
			self::$tree = MPeer::getUserGroups($this);
			self::$user = MPeer::getUser();
		}	
		
		if($id !== null && MFile::isFile($this->path."rf".$id.".php")){
			$this->load($id);
		}else{
			$this->createClean($id);
		}
		
		if($id !== null && $id > -1){
			$this->rootFolderId = (int) $id;
		}
		
		$this->calculate($id);
		
	}
	
	public function setLookUp($data = null){
		if($data && isset($data->id)){
			self::$lookUpById[ (int) $data->id] = MDO::instance($data);
		}
	}
	
	public function calculate($rootFolderId=null){
		if($rootFolderId=== null) return false;
		if(! isset(self::$calcultedRights)) self::$calcultedRights = array();
		self::$calcultedRights[$rootFolderId] = MDO::instance();
		
		 if(!$this->isRights($rootFolderId)){
		 	$this->createClean($rootFolderId);
		 }
		 foreach (self::$lookUpById as $group){
		 	
		 	$group_id = (int) $group->get("id");
		 	$group_parent_id = (int) $group->get("parent_id");
		 	$group_is_root = $group->get("isRoot");
		 	if(! self::$rights[(int) $rootFolderId]->has("_".$group_id ) ){
		 		$default = MRIGHTS_INHERIT;
		 		if($group_parent_id === 0) $default = MRIGHTS_DISALLOW;
		 		if($group_is_root) $default = MRIGHTS_ALLOW;
		 		self::$rights[(int) $rootFolderId]->set("_".$group_id , MRightsObject::instance($default) );
		 	}
		 	$group_rights = self::$rights[(int) $rootFolderId]->get("_".$group_id );
		 	$calc = $group_is_root ? MRightsObject::instance(MRIGHTS_ALLOW) : MDO::instance();
		 	if(!$group_is_root){
		 		
		 		$isUse = $this->checkRule("use",$group_id,$group_parent_id,$group_rights, $rootFolderId);
		 		$calc->set("use",$isUse);
		 		
		 		foreach(MRightsObject::getRightNames() as $name){
		 			if($name != "use"){
		 				if($isUse){
		 					$rightAttribute = $this->checkRule($name,$group_id,$group_parent_id,$group_rights, $rootFolderId);
		 				}else{
		 					$rightAttribute = MRIGHTS_DISALLOW;
		 				}
			 			$calc->set($name,$rightAttribute);
		 			}//EOF if $name equals not use
		 		}//EOF foreach right attribute
		 	}//EOF group is not super user
		 	self::$calcultedRights[(int) $rootFolderId]->set("_".$group_id,$calc);		 	
		 }//EOF foreach group
	}//EOF function calculate
	
	/**
	 * 
	 * @param string $name
	 * @param int $group_id
	 * @param int $_group_parent_id
	 * @param MDO $group_rights
	 * @param int $rootFolderId
	 * @return int
	 */
	protected function checkRule($name = "use", $group_id = null, $_group_parent_id = 0, & $group_rights = null, $rootFolderId = null){
		if(!$group_id || !$group_rights || $rootFolderId === null) return MRIGHTS_DISALLOW;
		$rightAttribute = (int) $group_rights->get($name, MRIGHTS_DISALLOW);
		while ($rightAttribute === MRIGHTS_INHERIT) {
				
			if($_group_parent_id === 0){
				$rightAttribute = MRIGHTS_DISALLOW;
		
			}else{
		
				$parentGroup = self::$lookUpById[$_group_parent_id];
				$parentGroupId = (int) $parentGroup->get("id");
				if(self::$calcultedRights[(int) $rootFolderId]->has("_".$parentGroupId)){
					$rightAttribute = self::$calcultedRights[(int) $rootFolderId]->get("_".$parentGroupId)->get($name);
				}else{
					$parentRights = self::$rights[(int) $rootFolderId]->get("_".$parentGroupId);
					$rightAttribute = $parentRights->get($name);
					$_group_parent_id = (int) $parentGroup->get("parent_id",0);
				}//EOF no calculate rights available
			}//EOF else parent_id is not 0
		}//EOF while inherit
		return (int) $rightAttribute;		
	}
	
	public function createClean($id= null){
		self::$rights[$id] = MDO::instance();
		
		foreach(self::$lookUpById as $group){
			$default = MRIGHTS_INHERIT;
			$parent = (int) $group->get("parent_id",0);
			if($parent === 0){
				$default = MRIGHTS_DISALLOW;
			}elseif($group->get("isRoot",0)){
				$default = MRIGHTS_ALLOW;
			}
			self::$rights[$id]->set("_".$group->get("id"), MRightsObject::instance($default));
		}	
	}
	
	public function isRights($id=null){
		if($id === null) return false;
		return isset(self::$rights[(int) $id]) ? true : false;
	}
	
	public function getTree(){
		return self::$tree;
	}
	
	public function getRightsFor($rootFolderId = null,$groupId= null){
		$rootFolderId = ($rootFolderId !== null) ? $rootFolderId : $this->rootFolderId;
		return self::$rights[(int) $rootFolderId]->get("_". $groupId);
	}
	
	public function getCalculatedFor($rootFolderId = null,$groupId= null){
		return self::$calcultedRights[(int) $rootFolderId]->get("_". $groupId);
	}
	
	public function getGroupIds(){
		static $arr;
		if( isset($arr)) return $arr;
		$arr = array();
		foreach(self::$lookUpById as $group){
			$id = $group->get("id",-1);
			if($id > -1) array_push($arr, (int) $id );
		}
		return $arr;
	}
	
	public function validateFetch($value = null){
		if($value === null) return MRIGHTS_INHERIT;
		$value = (int) $value;
		if($value === MRIGHTS_INHERIT || $value === MRIGHTS_DISALLOW | $value === MRIGHTS_ALLOW) return $value;
		else MRIGHTS_INHERIT;
	}
	
	public function fetchData(){
		$readNames = MRightsObject::getReadNames();
		$writeNames = MRightsObject::getWriteNames();
		
		$rightsArray = $_REQUEST["right"];
		if(is_array($rightsArray)){
			$groupIds = $this->getGroupIds();
			// ToDo 
			//$rightNames = MRightsObject::getRightNames();
			
			foreach($groupIds as $gid){
				if(isset($rightsArray[$gid]) && is_array($rightsArray[$gid])){
					$rights = $rightsArray[$gid];
// ToDo 
// 					foreach($rightNames as $rname){
// 						if(isset($rights[$rname])){
// 							// processing
// 						}
// 					}
					$use = $this->validateFetch($rights["use"]);
					$read = $this->validateFetch($rights["read"]);
					$write = $this->validateFetch($rights["write"]);
					
					$ro = MDO::instance();
					$ro->set("use",$use);
					$ro->set("read",$read);
					$ro->set("write",$write);
					foreach($readNames as $name){
						$ro->set($name,$read);						
					}
					
					foreach($writeNames as $name){
						$ro->set($name,$write);
					}
					
					if($this->isRights($this->rootFolderId)){
						self::$rights[$this->rootFolderId]->get("_".$gid)->mixin($ro);
					}else{
						self::$rights[$this->rootFolderId]->set("_".$gid, $ro);
					}					
				}//EOF Group rights are set
			}//EOF foreach group ids
		}// requested server var is array
	}// EOF function fetchData
	
	public function load($rootFolderId = null){
		$rootFolderId = ($rootFolderId === null || $rootFolderId < 0) ? $this->rootFolderId : (int) $rootFolderId;
		if(! $this->isRights($rootFolderId)){
			self::$rights[$rootFolderId] = MDO::instance();
		}
		self::$rights[$rootFolderId]->load($this->path."rf".$rootFolderId . ".php");
		return true;
	}
	
	public function save($rootFolderId = null){
		$rootFolderId = ($rootFolderId === null || $rootFolderId < 0) ? $this->rootFolderId : (int) $rootFolderId;
		if($this->isRights($rootFolderId)){
			self::$rights[$rootFolderId]->save($this->path."rf".$rootFolderId . ".php");
			return true;
		}
		return false;
	}
		
	
	public static function loadAll(){
		static $loaded;
		if(isset($loaded)) return true;
		$loaded =1;
		$roots = MRoots::getInstance();
		$rootIds = $roots->getKeys();
		foreach($rootIds as $id){
			self::getInstance($id);
		}
		return true;
	}
	
	/**
	 * 
	 * @param string $rule
	 * @param int $rootFolderId
	 */
	public static function can($rule = null, $rootFolderId = null){
		if(self::$user->isRoot) return true;
		
		if($rootFolderId === null && defined('_ROOTFOLDERID')) $rootFolderId = _ROOTFOLDERID;
		
		if( ! $rule || 
			! in_array(trim($rule), MRightsObject::getRightNames()) || 
			$rootFolderId === null || 
			! isset(self::$calcultedRights[(int) $rootFolderId])
		) return false;
		
		$rule = trim($rule);
		$userGroups = self::$user->groups;
		/*
		 * @var MDO $rooFolderRights
		 */
		$rooFolderRights = self::$calcultedRights[(int) $rootFolderId];		
		$can = false;
		
		foreach($userGroups as & $group){
			if($rooFolderRights->has("_". $group)){
				$can = $can || (bool) $rooFolderRights->get("_" . $group)->get($rule, false);
			}
		}
		return $can;
	}
	
	public static function getError($rule = null, $rawReturn = false){
		$errorMessage = ($rule !== null) ? MText::_("rights_noauth_".trim($rule)) : MText::_("noauth");
		return $rawReturn ? $errorMessage : "_fmError".$errorMessage ;
	}
	
	
	public static function userIsRoot(){
		return (bool) self::$user->isRoot;
	}
	
	public static function getInstance($id = null){
		static $instances;
		if(! isset(self::$rights)){
			self::$rights = array();
			self::$calcultedRights = array();
		}
		
		if(! isset($instances) ){
			$instances = array();
		}
		if($id !== null && isset($instances[$id])) return $instances[$id];
		else if($id !== null){
			$instances[$id] = new MRights($id);
			self::$folderCount++;
			return $instances[$id];
		}
		return new MRights($id);
	}
	
	public static function printUser(){
		ob_start();
		echo "<pre>\n";
		echo("Current User:\n");
		print_r(self::$user);
		echo "\n</pre>\n";
		return ob_get_clean();
	}
	
	public static function toJSON(){
		$names = MRightsObject::getRightNames();
		$isRoot = self::userIsRoot();
		$arr = array();
		foreach($names as $name){
			array_push($arr, '"'.$name.'": ' .  ( $isRoot ? 1 : (int) self::can($name)  ) );
		}
		return '{' . implode(", ", $arr) . '}';
	}
	
	public function __toString(){
		ob_start();
		echo "<pre>\n";
		echo("Rights Object with ID: ".$this->rootFolderId."\n");
		print_r($this);
		echo "Total root folder count: ";
		echo self::$folderCount . "\n";
		echo("Rights:\n");
		print_r(self::$rights);
		echo("Calculated Rights:\n");
		print_r(self::$calcultedRights);
		echo("lookUpById:\n");
		print_r(self::$lookUpById);
		echo("Current User:\n");
		print_r(self::$user);
		echo "\n</pre>\n";
		return ob_get_clean();
	}
	
}
