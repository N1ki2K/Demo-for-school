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

class MConfigHelper{
	
	/**
	 * Config Menu Items
	 * 
	 * @var array
	 */
	static protected $menuItems = 
		array("main");
	
	static protected $form2config = 
		array(
				"max_tn_size" => array(
						"form" => 'text',
						"class" => '',
						"style" =>  '',
						"id" => '',
						"vertical" => 0
						),
				"max_upload_fields"=> array(
						"form" => 'select',
						"class" => '',
						"style" =>  'width: 80px;',
						"id" => '',
						"options"=> array(
									array("val"=>1, "text"=>1),
									array("val"=>2, "text"=>2),
									array("val"=>3, "text"=>3),
									array("val"=>4, "text"=>4),
									array("val"=>5, "text"=>5),
									array("val"=>6, "text"=>6)
								),
						"vertical" => 0
						),
				"is_demo"=> array(
						"form" => 'select',
						"class" => '',
						"style" =>  'width: 80px;',
						"id" => '',
						"options"=> array(
									array("val"=>0, "text"=>"off"),
									array("val"=>1, "text"=>"on")
								),
						"vertical" => 0
						),
				"use_progressbar"=> array(
						"form" => 'select',
						"class" => '',
						"style" =>  'width: 80px;',
						"id" => '',
						"options"=> array(
									array("val"=>0, "text"=>"off"),
									array("val"=>1, "text"=>"on")
								),
						"vertical" => 0
						)
				);
	
	public static function form($inside = null, $task= "main", $hidden = null){
		$c = new MContainer();
		$c->add('<form id="configFormNode" method="post" action="'.MURL::_("config").'">');
		$c->add('<input type="hidden" name="task" value="'.$task.'" id="mTaskNode">');
		$c->add('<input type="hidden" name="send" value="1" >');
		if($hidden && (is_object($hidden) || is_array($hidden)) ){
			foreach($hidden as $key=>$value){
				$c->add('<input type="hidden" name="'.$key.'" value="'.$value.'" id="mHidden'.ucfirst(strtolower($key) ).'">');
			}	
		}
		$c->add('<div class="rrWrap">');
		$c->add($inside);
		$c->add('</div>');
		$c->add('</form>');
		return $c->get();
	}
	
	public static function contentWrap($header = "main", $content = null){
		$header = $header ? $header : "main";
		$c = new MContainer();
		$c->add('<div class="mMaskHeading"><span>');
		$c->add(MText::_("config_menu_".$header));
		$c->add('</span></div>');
		$c->add('<div style="padding:10px;">');
		$c->add('<table class="mRightsTable"></tbody>');
		$c->add('<tr>');
		$c->add('<td class="heading" colspan="2">'. MText::_("attribute").'</td>');
		$c->add('<td class="heading">'. MText::_("description").'</td>');
		$c->add('</tr>');
		$c->add($content);
		$c->add('</tbody></table>');
		$c->add('</div>');
		return $c->get();
	}
	/**
	 * 
	 * @param string $task
	 * @param MConfig $config
	 * @param	array $error
	 */
	public static function generate($task = "main", MConfig $config = null, $error = null){
		$error = ($error !== null) ? $error : array();
		$defaults = $config->getDefaults();
		$c = new MContainer();
		foreach($defaults as $default){
			$name = $default[0];
			$value = $config->get($name,$default[1]);
			$_error = isset($error[$name]) ? self::wrapError($error[$name]) : null;
			self::wrapFormElement($c, $name, $value, $_error);
		}

		return self::form( self::contentWrap($task, $c->get() )  ,$task,array());		
	}
	/**
	 * 
	 * @param MContainer $c
	 * @param string $name
	 * @param any $value
	 * @param string $error
	 */
	public static function wrapFormElement(& $c, $name, $value, $error){
		$vertical = ( isset(self::$form2config[$name]) && isset(self::$form2config[$name]['vertical']) ) ? (int) self::$form2config[$name]['vertical'] : 0 ;
		
		$colspan = $vertical ?  ' colspan="2"' : '';
		
		$c->add('<tr>');
		$c->add('<td class="configLabelCol"'.$colspan.'>');
		
		$c->add('<label>' . MText::_("config_".$name) .'</label>'   );
		
		
		
		
		if($vertical){
			$c->add('<div class="mSpacer"></div>');
		}else{
			$c->add('</td><td class="configFormCol">');
		}
		
		$c->add(self::getFormElement($c, $name, $value));		
		$c->add('</td>');
		
		$c->add('<td class="">');
		$info = MText::_("config_".$name."_desc");
		$infoText = ($info != "config_".$name."_desc" ) ? $info : '';
		$c->add( $infoText );
		$c->add('</td>');
		
		
		$c->add('</tr>');
		
		if($error){
			$c->add('<tr><td colspan="3">');
			$c->add($error);
			$c->add('</td></tr>');
		}
		
		
	}
	
	/**
	 *
	 * @param MContainer $c
	 * @param string $name
	 * @param any $value
	 */
	public static function getFormElement(& $c, $name, $value){
		$form = isset(self::$form2config[$name]) ? self::$form2config[$name] : array(
				"form" => 'text',
				"class" => '',
				"style" =>  '',
				"id" => '',
				"vertical" => 0
				);
		
		$style =  isset($form["style"]) ? $form["style"] : '';
		$class =  isset($form["class"]) ? ' class="'. $form["class"] .'"' : '';
		$id =  isset($form["id"]) ? ' class="'. $form["id"] . '"' : '';
		
		
		$parameters = $class.$id;
		
		switch($form['form']){
			default:
			case 'text': 
				$c->add(
					MForms::field($name,$value,null, $style, $parameters )
				);
				break;
				
			case 'textarea':
				$c->add(
						MForms::textArea($name,$value, $style, $parameters )
				);
				break;
				
			case 'select':
				$parameters .= $style ? ' style="'.$style.'"' : '';
				foreach($form["options"] as & $option){
					if(isset($option["text"])){
						$option["text"] = MText::_($option["text"]);
					}
				}
				$c->add(
					MForms::select($name,$form['options'],$value,1, null, $parameters)
				);
				break;
		}//EOF switch
		
		
	}
	
	
	
	public static function getMenu(){
		$buffer = "";
		foreach (self::$menuItems as $menu){
			$buffer .= self::wrapMenuItem($menu);
		}
		return $buffer;
	}
	
	public static  function wrapMenuItem($area = "main"){
		global $task;
		$opened = ( (!$task && $area == "main") || $area == $task ||  ($area=="main" && $task == "default") ) ? ' opened' : '';
		return '
		<a onclick="window.location.href = this.href; return true;" href="'.MURL::_("config",null,$area).'" class="rootFolder'.$opened.'"><span>'.MText::_("config_menu_".$area).'</span></a>
		<div class="clr"></div>
		'."\n" ;
	}
	
	/**
	 *
	 * @param string $msg
	 * @return string
	 */
	public static function wrapError($msg = ""){
		return '<div style="color:red;">'.MText::_("error"). ': ' .trim($msg).'</div>'."\n";
	}
	
}