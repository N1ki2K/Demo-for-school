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

class MContainer extends MObject{
	var $br ="\n";
	var $container = "";
	public function __construct($lineBreak="\n") {
		$this->br = $lineBreak;		
	}
	
	public function add($string){
		$this->container .=$string.$this->br;
	}
	
	public function addTag($tag,$attributes='',$content=''){
		$this->container .= '<'.$tag.' '.$attributes.'>'.$content.'</'.$tag.'>'.$this->br;
	}
	
	public function addImg($href,$attributes){
		$attributes = 'href="'.$href.'" '.$attributes;
		$this->addTag('img',$attributes,'');
	}
	
	public function br(){
		$this->container .= '<br/>';
	}
	
	
	public function get(){
		return $this->container;
	}
	
	public function reset(){
		$this->container = "";
	}
}

