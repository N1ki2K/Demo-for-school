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

class MDO{
	protected static $counter = 0;
	protected static $namespace;
	var $_id = null;
	var $data = null;

	public function __construct($data = null){
		if($data){
			if( is_object($data) ){
				if(get_class($data) == "MDO"){
					$this->data = $data->data;
				}elseif(get_class($data) == "stdClass"){
					$this->data = $data;
				}else{
					$this->data = new stdClass();
					foreach($data as $key=>$value){
						$this->data->$key = $value;
					}
				}
			}else{
				$this->unserialize($data);
			}
		}else{
			$this->data = new stdClass();
		}
	}

	public function set($name = null, $value = null){
		if($name){
			$this->data->$name = $value;
		}
	}
	
	public function get($name = null, $default = null){
		if($name && isset($this->data->$name)){
			return $this->data->$name;
		}
		return $default;		
	}
	
	/**
	 * 
	 * @return array:
	 */
	public function getKeys(){
		$arr = array();
		foreach($this->data as $key=>$value){
			array_push($arr, $key);
		}	
		return $arr;
	}
	
	public function id($id=null){
		$this->_id = $id !== null ? $id : self::$counter++;
	}
	
	public function add($name = null, $value = null){
		if($name && isset($this->data->$name)){
			
			
			if(is_int($this->data->$name) || is_float($this->data->$name)){
				$this->data->$name += (int) $value;
			}elseif(is_string($this->data->$name)){
				$this->data->$name .= $value;
			}elseif(is_array($this->data->$name) && is_array($value)){
				$this->data->$name = array_merge($this->data->$name, $value); 
			}
			return $this->data->$name;	
		}
	}
	
	public function delete($name = null){
		if(! $name ) return false;
		$arr = array();
		if(is_array($name)){
			$arr = $name;
		}else if(is_object($name)){
			foreach($name as $n){
				array_push($arr, (string) $n  );
			}
		}else{
				array_push($arr, (string) $name  );
		}
		
		foreach($arr as $_name){
			if(isset($this->data->$_name)) {
				unset($this->data->$_name);
			}
		}
		return true;
		
	}
	
	public function has($name = null){
		if(!$name) return false;
		return isset($this->data->$name) ? true : false;
		
	}
	
	public function mixin(MDO $mdo = null){
		if($mdo && is_object($mdo) && get_class($mdo) == "MDO" && isset($mdo->data) && get_class($mdo->data) == "stdClass"){
			foreach($mdo->data as $key=>$value){
				if(! isset($this->data->$key)){
					$this->data->$key = $value;
				}else{
					if(is_object($this->data->$key) && get_class($this->data->$key) == "MDO" && is_object($value) && get_class($value) == "MDO"){
						$this->data->$key->mixin($value);
					}elseif (is_array($this->data->$key) && is_array($value)){
						
						foreach($value as $_key=>$_value){
							if(is_object($this->data->$key[$_key]) && get_class($this->data->$key[$_key]) == "MDO" && is_object($_value) && get_class($_value) == "MDO"){
								$this->data->$key[$_key]->mixin($value);
							}else{
								$this->data->$key[$_key] = $value;
							}//EOF else no MDO match
						}//EOF foreach array 	
					}else{
						$this->data->$key = $value;
					}//EOF no array
				}//EOF key exists in current data
			}//EOF foreach $data
		}// mixin allowed
	}
	
	
	public function serialize(){
		return b64_encode( serialize($this->data) );
	}
	
	public function unserialize($data = null){
		$_data = null;
		if($data){
			try {
				$_data = @unserialize( b64_decode($data));
			} catch (Exception $e) {
				return;
			}
			if(get_class($_data) == "stdClass"){
				$this->data = $_data;
			}
		}
	}
	
	public function endsWith($H, $N){
		return substr($H, strlen($N)*-1) == $N;
	}
	
	public function save($fileName = null){
		if($fileName && $this->endsWith($fileName,".php")){
			MFile::writeData($fileName, "<?PHP die();\n/*SPLIT\n"  . wordwrap( $this->serialize(),75,"\n" ,true ));
		}
		return "FileName: ". $fileName. "<br>" . $this;
	}
	
	
	public function load($fileName = null){
		if($fileName && $this->endsWith($fileName,".php") && MFile::isFile($fileName)){
			
			try {
				$fetch = @file_get_contents($fileName);
				if($fetch){
					$split = explode("/*SPLIT", $fetch);
					if( sizeof($split) == 2 ){
						$data = str_replace("\n", "",  trim($split[1]) );
						@$this->unserialize($data);
					}
				}
			} catch (Exception $e) {
				return false;
			}		
			return true;	
		}else return false;
	}
	public function toArray(){
		$arr = array();
		foreach($this->data as $key=>$value){
			$arr[$key] = $value;	
		}	
		return $arr;
	}
	
	public function truncate(){
		$this->data = new stdClass();
	}
	
	public static function instance($nameOrData = null, $data = null){
		if(! self::$namespace){
			self::$namespace = array();
		}
		$obj = null;
		if(is_string($nameOrData) && trim($nameOrData)){
			self::$namespace[trim($nameOrData)] = new self($data);
			self::$namespace[trim($nameOrData)]->id($nameOrData);
			return self::$namespace[trim($nameOrData)];
		} elseif($nameOrData === null){
			$obj = new self($data);
		}else{
			$obj =  new self($nameOrData);
		}
		$obj->id();
		return $obj;
	}
	
	function __toString(){
		ob_start();
		$buffer = "<pre>\n";
		print_r($this);
		$buffer .= ob_get_clean();
		$buffer .= "\n</pre>\n";
		return $buffer;
	}
	
	public static function getObjectCount(){
		return self::$counter;
	}
	
	public static function showNamespace(){
		ob_start();
		$buffer = "<pre>\n";
		print_r(self::$namespace);
		$buffer .= ob_get_clean();
		$buffer .= "\n</pre>\n";
		return $buffer;
	}
	
	
}

