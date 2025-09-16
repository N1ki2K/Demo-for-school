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

class xhrplayer extends MTask{
	
	function _default(){
		//mp3
		$this->mp3();
	}
 
	function mp3(){
		//mp3
		
		if(! MRights::can("open")){
			return $this->_noAuth("open");
		}
		
		global $dir;
		$info = MFile::info($dir);
		$songname = str_replace("_"," ",str_replace(".mp3","",$info->baseName));
		$this->view->add2Content( 
			'<embed  name = "fullsceen" align="middle" flashvars="songname='.$songname.'&songurl='.urlencode(MURL::_("xhraudio",str_replace(_START_FOLDER, "",$dir))).
			'" src="'._FM_HOME_FOLDER.'/media/mp3player.swf" width="520" height="70" type="application/x-shockwave-flash"'.
			'pluginspage="http://www.macromedia.com/go/getflashplayer"  />'
			);
	}
	
	function flv(){
		
		if(! MRights::can("open")){
			return $this->_noAuth("open");
		}
		
		global $dir;
		$info = MFile::info($dir);		

		$unique = MRequest::clean("unique",null);
		$timestamp = $unique ? $unique : uniqid();
		$this->view->add2Content(
					'<video id="profiles_video_'.$timestamp.'" class="video-js vjs-default-skin vjs-big-play-centered"
							  controls preload="auto" width="640" height="264"
							  poster="">
						 <source src="'.htmlentities( MURL::_("xhrvideo",str_replace(_START_FOLDER, "",$dir))).'" type="video/x-flv">
					</video>
					<script type="text/javascript">videojs("profiles_video_'.$timestamp.'", {}, function(){});</script>'
		);
		
		
	}
	
	function mp4(){
	
		if(! MRights::can("open")){
			return $this->_noAuth("open");
		}
	
		global $dir;
		$unique = MRequest::clean("unique",null);
		$info = MFile::info($dir);
		$timestamp = $unique ? $unique : uniqid();
		$this->view->add2Content(
					'<video id="profiles_video_'.$timestamp.'" class="video-js vjs-default-skin vjs-big-play-centered"
							  controls preload="auto" width="640" height="264"
							  poster="">
						 <source src="'.htmlentities( MURL::_("xhrvideo",str_replace(_START_FOLDER, "",$dir))).'" type="video/x-flv">
					</video>
					<script type="text/javascript">videojs("profiles_video_'.$timestamp.'", {}, function(){});</script>'
			);
	
	
		}
	
	
	
	function swf(){
		
		if(! MRights::can("open")){
			return $this->_noAuth("open");
		}
		
		//swf
		global $dir;
		$info = MFile::info($dir);
		$songname = str_replace("_"," ",str_replace(".mp3","",$info->baseName));
		$this->view->add2Content( 
			'<center><embed name = "swfVideo" align="middle" '.
			'" src="'.MURL::_("xhrvideo",urlencode(str_replace(_START_FOLDER, "",$dir))).'" width ="100%" type="application/x-shockwave-flash"'.
			'pluginspage="http://www.macromedia.com/go/getflashplayer"  /></center>'
			);
	}	
	
	
	function ogv(){
	
		if(! MRights::can("open")){
			return $this->_noAuth("open");
		}
	
		global $dir;
		$unique = MRequest::clean("unique",null);
		$info = MFile::info($dir);
		$timestamp = $unique ? $unique : uniqid();
		$this->view->add2Content(
					'<video id="profiles_video_'.$timestamp.'" class="video-js vjs-default-skin vjs-big-play-centered"
							  controls preload="auto" width="640" height="264"
							  poster="">
						 <source src="'.htmlentities( MURL::_("xhrvideo",str_replace(_START_FOLDER, "",$dir))).'" type="video/ogg">
					</video>
					<script type="text/javascript">videojs("profiles_video_'.$timestamp.'", {}, function(){});</script>'
			);
	
	
		}
	
	
	function webm(){
	
		if(! MRights::can("open")){
			return $this->_noAuth("open");
		}
	
		global $dir;
		$unique = MRequest::clean("unique",null);
		$info = MFile::info($dir);
		$timestamp = $unique ? $unique : uniqid();
		$this->view->add2Content(
					'<video id="profiles_video_'.$timestamp.'" class="video-js vjs-default-skin vjs-big-play-centered"
							  controls preload="auto" width="640" height="264"
							  poster="">
						 <source src="'.htmlentities( MURL::_("xhrvideo",str_replace(_START_FOLDER, "",$dir))).'" type="video/webm">
					</video>
					<script type="text/javascript">videojs("profiles_video_'.$timestamp.'", {}, function(){});</script>'
			);
	
	
		}
	
	
	function object(){
		
		if(! MRights::can("open")){
			return $this->_noAuth("open");
		}
		
		//video
		global $dir;
		$info = MFile::info($dir);
		$this->view->add2Content( '<center>
		        <object align="middle"  type="'.getMimeType($dir).'" data="'.MURL::_("xhrvideo",urlencode(str_replace(_START_FOLDER, "",$dir))).'" width="750px" height="450px">
				</object></center>');
	}
	
	function image(){
		
		if(! MRights::can("open")){
			return $this->_noAuth("open");
		}
		
		global $dir;
		$this->view->add2Content('
		<center>
		<img src ="'.MURL::_("xhranyfile",urlencode(str_replace(_START_FOLDER, "",$dir))).'" style="max-width: 100%;"/>
		</center>
		');
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



?>