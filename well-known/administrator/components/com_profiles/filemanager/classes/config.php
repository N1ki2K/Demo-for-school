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

class MConfig{
	/**
	 * 
	 * @var MDO
	 */
	protected  $data = null;
	/**
	 * 
	 * @var string
	 */
	protected $path = null;
	/**
	 * All default values
	 * scheme: ` name, value, request method, validation `
	 * @var array
	 */
	protected $defaults = array(
				array('max_tn_size',1024000, 'clean', 'int'),
				array('max_upload_fields',5, 'clean', 'int'),
				array('is_demo',0, 'int', 'int'),	
				array('use_progressbar',1, 'int', 'int')
			);
	
	public function __construct(){
		$this->path =  _FM_HOME_DIR . DS."data".DS."config.php";
		$this->data = MDO::instance();
		$this->load();
		
	}
	public function set($name = null, $value = null){
			$this->data->set($name , $value);
	}
	
	public function get($name = null, $default = null){
			return $this->data->get($name,$default);
	}
	
	/**
	 * @return array
	 */
	public function getKeys(){
		return $this->data->getKeys();
	}
	
	public function delete($name = null){
		return $this->data->delete($name);
	}
	/**
	 * @return stdClass
	 * 
	 * Returns a stdClass object with:
	 * stdClass->error	(an error array for each config name; empty if no errors)
	 * stdClass->data   (an MDO object with the fetched data)
	 * 
	 */
	public function request(){
		$obj = MDO::instance();
		$err = array();
		foreach($this->defaults as $config){
			$name = $config[0];
			$default = $config[1];
			$request = isset($config[2]) ? $config[2] : "clean";
			$validate = isset($config[3]) ? $config[3] : null;
		
			$value = MRequest::_($request, $name, $default);
			if($validate){
				$valid = MValidate::_($validate, $value);
				if(! $valid){
					$err[$name] = MText::_("validate_".$validate);
				}
			}
			$obj->set($name,$value);	
		}//EOF foreach
		$return = new stdClass();
		$return->error = $err;
		$return->data = $obj;
		return $return;
	}
	
	/**
	 * @return array
	 */
	public function getDefaults(){
		return $this->defaults;
	}
	
	protected function createDefaults(){
		foreach($this->defaults as $default){
			$this->data->set($default[0],$default[1]);
		}
	}
	
	public function load(){
		if(file_exists($this->path)){
			if($this->data->load($this->path)) return true;
		}
		$this->createDefaults();
		$this->save();
		return false;
	}
	/**
	 * 
	 * @param MDO $request
	 */
	public function mixinAndSave(& $request = null){
		if(!$request) return false;
		$this->data->mixin($request);
		$this->save();
		return true;
	}
	
	/**
	 *
	 * @param MDO $request
	 * @return	MConfig
	 */
	public function mixin($request = null){
		if(!$request) return false;
		$this->data->mixin($request);
	}
	
	public function save(){
		return $this->data->save($this->path);
	}
	public function __toString(){
		ob_start();
		echo "<pre>\n";
		print_r($this);
		echo "\n</pre>\n";
		return ob_get_clean();
	}
	
	public static function instance(){
		static $instance;
		if(isset($instance)) return $instance;
		$instance = new MConfig();
		return $instance;		
	}	
	
}

