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

class MRightsHelper{
	
	public static function form($inside = null, $task= "rights", $hidden = null,$groupTab = null){
		$c = new MContainer();
		$c->add('<form id="rightsFormNode" method="post" action="'.MURL::_("rootsandrights").'">');
		$c->add('<input type="hidden" name="task" value="'.$task.'" id="mTaskNode">');
		$c->add('<input type="hidden" name="grouptab" value="'.$groupTab.'" id="mGroupTabForm">');
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
		$c->add('<script type="text/javascript">var mGroupTab = ' . (int) $groupTab . ';</script>');
		return $c->get();
	}
	
	public static function rightsWrap($name = null, $inside = null){
		$c = new MContainer();
		$c->add('<div class="mMaskHeading"><span>');
		$c->add(MText::_("rightsforroot") .": ".$name);
		$c->add('</span></div>');
		$c->add('<div class="mMaskWrap">');
		$c->add($inside);
		$c->add('</div>');
		return $c->get();
	}
	
	
	public static function rights($tree = null,$rootFolderId = null, $level = 0){
		$buffer = "";
		foreach($tree as $data){
			$buffer .= self::rightsMask($data, $rootFolderId, $level);
			if(isset($data->sub)){
				$buffer .= self::rights($data->sub,$rootFolderId,($level+1) ) ;
			}
		}
		return $buffer;
	}
	
	public static function rightsMask($data, $rootFolderId = null, $level = 0){
		$levelMark = "";
		if($level !== 0){
			for($t=0; $t< ($level-1); $t++){
				$levelMark .= '<div class="arrows"></div>';
			}
			$levelMark .='<div class="arrows on"></div>';
		}
		
		
		$buffer = '<div class="mRightsWrap mRightId'.$data->id.'">' ."\n";
		$buffer .= '<div class="mRightsHeading mNoSelect" rights_id="'.$data->id.'">' . $levelMark . ' <span>' . $data->title . '</span></div>' . "\n";
		$buffer .= '<div class="mRightsContent" id="mRightsContent'.$data->id.'">';
		$buffer .= self::rightsMaskFields($data,$rootFolderId);
		$buffer .= '</div>' . "\n";
		
		return $buffer;
	}
	
	public static function rightsMaskFields($data = null, $rootFolderId = null){
		$rightsObject = MRights::getInstance($rootFolderId);
		$rights = $rightsObject->getRightsFor($rootFolderId, $data->id);
		$calculated = $rightsObject->getCalculatedFor($rootFolderId,$data->id);
		
		$names = array("use","read","write");
		
		
		$c = new MContainer();
		$c->add('<div id="container_'.$data->id.'" style="padding: 10px;">');
		$c->add('<table class="mRightsTable"  id="table_'.$data->id.'" >');
		$c->add('<tbody>');
		$c->add('<tr id="tr_heading_'.$data->id.'" class="mNoSelect">');
		$c->add('<td class="heading">'. MText::_("action").'</td>');
		$c->add('<td class="heading">'. MText::_("selectnewsetting").'</td>');
		$c->add('<td class="heading">'. MText::_("calculatedsetting").'</td>');
		$c->add('</tr>');
		foreach($names as $name){
			$info = MText::_("rights_".$name."_desc");
			$infoIcon = ($info != "rights_".$name."_desc" ) ? '<img src="'. _FM_HOME_FOLDER.'/images/info.png" align="right" info="'.$info.'" />' : '';
			$isUse = ($name == "use") ? " is_use" : " no_use";
			$hideMe = ($name == "use") ? '' : '<div class="hideme hideme_'.$data->id.'"></div></div>';
			$c->add('<tr id="tr_'.$name.'_'.$data->id.'">');
			$c->add('<td id="td_name_'.$name.'_'.$data->id.'" class="mNoSelect">'. MText::_("rights_".$name).$infoIcon.'</td>');
			$select = MForms::select("right[".$data->id."][".$name."]",array(
					array("val"=> -1, "text"=>MText::_("inherited")),
					array("val"=> 0, "text"=>MText::_("denied")),
					array("val"=> 1, "text"=>MText::_("allowed"))
					),$rights->get($name),1,null,' id="'.$name.'_'.$data->id.'" autocomplete="off"
					class="mRightSelect'.$isUse.' '.$isUse. '_' . $data->id .'" namespace="'.$name.'" group_id="'.$data->id.'" parent_id="'.$data->parent_id.'" calc_value="'.(int) $calculated->get($name).'"');
			
			
			$c->add('<td id="td_action_'.$name.'_'.$data->id.'"> <div style="position: relative;">'.  $select . $hideMe . '</div></td>');
			$c->add('<td id="td_calc_'.$name.'_'.$data->id.'"  class="mNoSelect"> <div style="position: relative">'. ( ($calculated->get($name)) ? 
					'<span class="allowed'.$isUse.'_calc '.$isUse. '_calc_' . $data->id .'" id="calc_'.$name.'_'.$data->id.'" action_id="'.$name.'_'.$data->id.'">' . MText::_("allowed") . '</span>' :
					'<span class="notallowed'.$isUse.'_calc '.$isUse. '_calc_' . $data->id .'" id="calc_'.$name.'_'.$data->id.'" action_id="'.$name.'_'.$data->id.'">' . MText::_("notallowed") .'</span>').
					$hideMe . '</div></td>');
			$c->add('</tr>');
		}
		$c->add('</tbody>');
		$c->add('</table>');
		
		if($data->isRoot){
			$c->add('<div class="mSuperUsersAdviceDarken"></div><div class="mSuperUsersAdvice mNoSelect">'.MText::_("superusersrights").'</div>');
		}
		
		$c->add('</div>');
		return $c->get();
	}
	
	
	public static function rootsNewButton(){
		return '<div class="addNewRootFolder" onclick="window.location.href=\''.MURL::_("rootsandrights",null,null).'&id=-1'.'\';"><div><img src="'. _FM_HOME_FOLDER.'/images/plus.png" /><span>'.MText::_("addnewroot").'</span></div></div>';
	}
	
	public static function rootsMenuHeading(){
		return '<div class="rootMenuHeading"><div><span>'.MText::_("rootfolder").'</span></div></div>';
	}
	
	
	public static function rootsMenu($rootFoldersArray = null, $currId = 0, $task = null){
		if(!$rootFoldersArray) return null;
		$buffer ='<div class="rootWrap">'."\n";
		foreach ($rootFoldersArray as $id => $rootFolder){
			$extraCSS = ($currId == $id) ? " opened" : "";
			$buffer .= '<a class="rootFolder'.$extraCSS.'" href="'.MURL::_("rootsandrights",null,$task).'&id='.$id.'" onclick="window.location.href = this.href;"><span>'.$rootFolder->get("name").'</span></a>' ."\n" . '<div class="clr"></div>' ."\n";	
		}
		
// 		for($t=0; $t<100;$t++){
// 					$buffer .= '<a class="rootFolder" href="'.MURL::_("rootsandrights",null,$task).'&id='.$id.'" onclick="window.location.href = this.href;"><span>Test</span></a>' ."\n" . '<div class="clr"></div>' ."\n";	
		
// 		}
		
		$buffer .= "</div>\n";
		return $buffer;
	}
	/**
	 * 
	 * @param string $msg
	 * @return string
	 */
	public static function wrapError($msg = ""){
		return '<div style="color:red;">'.trim($msg).'</div>'."\n";
	}
	/**
	 * 
	 * @param MDO $data
	 * @param int $id
	 */
	public static function rootsMask($data = null, $id = -1){
		
		$disabled = _FM_IS_DEMO ? ' disabled="disabled"' : '';
		
		$c = new MContainer();
// 		$c->add('ID: '.$id);
		$c->add('<div class="mMaskHeading"><span>');
		if($id === null || $id <0){
			$c->add(MText::_("addnewroot"));
		}else{
			$c->add(MText::_("rootfolderconfig") .": ".$data->get("name") );
		}
		$c->add('</span></div><div style="padding:10px;">');
		
		$c->add('<label>'.MText::_("title").'</label>');
		$c->add('<div class="mSpacer"></div>');
		$c->add(MForms::field("name",$data->get("name"),80,'','class="mRootsTitle" '));
		$c->add($data->get("nameError", ""));
		$c->add('<div class="mSpacer"></div>');
		$c->add('<label>'.MText::_("path").'</label>');
		$c->add('<div class="mSpacer"></div>');
		$path = _FM_IS_DEMO ? MText::_("notfordemo") : $data->get("path");
		$c->add(MForms::field("path",$path ,null,'','class="mRootsPath"'. $disabled));
		$c->add($data->get("pathError", ""));
		$c->add('<div class="clr"></div>');
		$c->add('</div>');
		return self::form($c->get(),null,array("id"=>$id));
	}
	
	
	
	
	
}