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

class xhredit extends MTask{
	
	function _default(){
		global $dir;
		if(! MRights::can("open")){
			return $this->_noAuth("open");
		}
		
		
		$syntax = MRequest::clean("syntax");
		$uniq = getUnique();
		$height = MRequest::int("height",550);
		$sid = MRequest::int("sid",null);
		//$content = implode('', file($dir));
		
		$content = ""; $encoding = MText::_("nofile");
		
		if(MFile::is($dir) && MFile::isFile($dir)){
			$content = MFile::readData($dir);
		
			$padding = ($syntax=="text")?"0px":"0px";
			
			$this->view->content( 
				'<form id="saveeditfile" method="post" action="'.MURL::_("xhredit",MURL::safePath($dir),"save","sid=".$sid).'">
				<input type="hidden" name="close" id="is_close" value="0"></input>	
				<input type="hidden" name="syntax" value="'.htmlentities($syntax).'"></input>	
				<input type="hidden" name="height" value="'.htmlentities($height).'"></input>	
				<textarea id="mEditArea-'.$sid.'" name="content" style="width:100%; height:'.$height.'px;margin:-4px;padding:'.$padding.';">'.htmlentities($content).'</textarea>
			
				<div class="toRight" style="margin-top:5px;">
				<a href="" class="askButton" style="width:120px; text-align:center;" onclick="javascript: mCodeMirrorSubmit(\''.$sid.'\'); mFormSubmit(_(\'saveeditfile\'));">'.MText::_("save").'</a>
				<a href="" class="askButton" style="width:200px; text-align:center;" onclick="javascript: _(\'is_close\').value = 1;  mCodeMirrorSubmit(\''.$sid.'\'); mFormSubmit(_(\'saveeditfile\'));">'.MText::_("saveandclose").'</a>
				<a href="" class="askButton" style="width:120px; text-align:center;" onclick="javascript: closePopup(\'Edit'.$sid.'\'); ">'.MText::_("cancel").'</a>
				</div>
				</form>
				<span style="display:none;" class="mCodeMirrorData" syntax="'.$syntax.'" sid="'.$sid.'" height="'.$height.'"></span>
			'		
			
					
					
			);	
//<script language="javascript" type="text/javascript" src="'.MURL::_("xhreditarea",null,null,"syntax=".$syntax."&sid=".$sid."&height=".urlencode($height) ).'" noCache="1"></script>
		
		}// File exists
		else{
			$this->view->content('<h2 style="color:red">'. $encoding . '</h2>');
		}
	}
	
	function save(){
		if(! MRights::can("edit")){
			return $this->_noAuth("edit");
		}
		
		global $dir;
		$is_close = MRequest::int("close",0);
		$info = MFile::info($dir);
		$content =  MRequest::raw("content");
		$sid = MRequest::int("sid",null);
		MFile::writeData($dir,$content);
		
		if($is_close){
			$this->view->content('<script noCache="1">
					_Delayed500(function(){
					_LoadTo("'.MURL::_("xhrfiles",MURL::safePath($info->dirName)).'", "splitInnerRight", function() {
					parseAll(_("splitInnerRight")); evalButtons();});  });
					closePopup("Edit'.$sid.'");</script>');
		}else{
			$this->_default();
			$this->view->add2Content('
				<div id="mSavedAdvice" class="savedAdvice"><div>'.MText::_("saved").'</div></div>
				<script noCache="1" type="text/javascript">
					dojo.addOnLoad(function(){
							var node = dojo.byId("mSavedAdvice");
							dojo.style(node,{opacity: 0});
							_fx.fadeOpacity(node,300,0,1,function(){
								setTimeout(function(){
									var node = dojo.byId("mSavedAdvice");
									dojo.style(node,{opacity: 1});
									_fx.fadeOpacity(node,400,1,0,function(){
										 _removeNode(dojo.byId("mSavedAdvice"));
									});
								},2000);
							});
					});
				</script>
			');
		}
								
				 
	}
	
	protected function _noAuth($rule=null){
		$this->view->content('
				<table width="100%" height="100%" cellspacing="0" cellpadding="0" border="0"><tbody>
					<tr>
						<td align="center" valign="middle"><span class="noAuth">'.MRights::getError($rule,1).'</span></td>
					</tr>
				</tbody></table>
				');
	}
	
	
}


