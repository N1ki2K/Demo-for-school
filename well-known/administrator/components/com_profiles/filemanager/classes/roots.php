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

class MRoots {
	/**
	 * 
	 * @var MDO
	 */
	var $data = null;
	/**
	 * 
	 * @var String
	 */
	var $path = null;
	
	public function __construct(){
		$this->path = _FM_HOME_DIR . DS."data".DS."roots.php";
		$data = MDO::instance();
		if(MFile::isFile($this->path)){
			$data->load($this->path);
		}else{
			$data->set("counter",0);
			$data->set("folders",array());
		}
		$this->data = $data;
	}
	
	public function save(){
		$this->data->save($this->path);
	}
	
	public function set($id = null, $infos = null){
		$counter = (int) $this->data->get("counter",0);
		$o = $this->data->get("folders",array());
		
		if($id === null || $id < 0){
			$o[$counter] = 1;
			$id = (int) $counter++;
		}else{
			$id = (int) $id;
		}
		
		if(isset($o[$id]) && $infos && is_object($infos)){
			$o[$id] = $infos;
		}
		
		$this->data->set("folders",$o);
		$this->data->set("counter",$counter);
		return $id;
	}
	/**
	 * 
	 * @param int|null $id
	 * @return MDO
	 */
	public function get($id = null){
		$o = $this->data->get("folders",array());
		if($id === null) return $o;
		if(isset($o[(int) $id])) return $o[(int) $id];
		return false;
	}
	
	public function getCount(){
		
		$o = $this->data->get("folders",array());
		return sizeof($o);
	}
	
	public function delete($id=null){
		if($id === null || $id < 0) return false;
		$o = $this->data->get("folders",array());
		if(isset($o[(int) $id])) {
			unset($o[(int) $id]);
			$this->data->set("folders",$o);
			return true;
		}
		return false;
		
	}
	/**
	 *  @return array|null
	 */
	public function getFirst(){
		$o = $this->data->get("folders",array());
		foreach($o as $key=>$value){
			return array($key,$value);
		}
		return null;
	}
	
	public function getKeys(){
		$o = $this->data->get("folders",array());
		return array_keys($o);		
	}
	
	public function getCounter(){
		return (int) $this->data->get("counter",0);
	}
	
	public function getFolderAccess(){
		$obj = new stdClass();
		$obj->count = 0;
		$obj->names = array();
		$obj->paths = array();
		
		$o = $this->data->get("folders",array());
		foreach ($o as $key => $mdo){
			if(MRights::can("use",(int) $key)){
				$obj->count++;
				$path = $mdo->get("path",null);
				$name = $mdo->get("name",null);
				if(!$name) $name = basename($path);
				$obj->names[$key] = $name;
				$obj->paths[$key] = $path;
			}
		}
		return $obj;		
	}
	/**
	 * 
	 * @param bool|int $formated
	 * @return int|string
	 */
	public static function getMaxUploadSize($formated = 0){
		static $size;
		if(isset($size)) return  $formated ?  MFile::bytesToFormat($size)  : $size;
		$maxUpload = MFile::toBytes(ini_get("upload_max_filesize"));
		$postMax = MFile::toBytes(ini_get("post_max_size"));
		$realMaxUpload = ( $postMax < $maxUpload ) ? $postMax : $maxUpload;
		
		//Apply the final value to the static variable
		$size= $realMaxUpload;
		
		return  $formated ?  MFile::bytesToFormat($size)  : $size;
		
	}
	
	
	public static function getInstance(){
		static $instance;
		if($instance instanceof MRoots) return $instance;
		$instance = new MRoots();
		return $instance;
	}
	
	
	public function __toString(){
		ob_start();
		$buffer = "<pre>\n";
		print_r($this);
		$buffer .= ob_get_clean();
		$buffer .= "\n</pre>\n";
		return $buffer;
	}
	
	
}

