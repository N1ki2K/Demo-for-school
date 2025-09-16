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
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Mad4Media File Manager</title>
<link href="<?php echo _FM_HOME_FOLDER; ?>/css/window.css" rel="stylesheet" type="text/css" />
<link href="<?php echo _FM_HOME_FOLDER; ?>/css/environment.css" rel="stylesheet" type="text/css" />
</head>
<body>
<div class="windowWrap windowWrapOuter">
	<div style="padding: 10px;">
			<?php if(!$error):?>
			<span style="font-weight:bold; font-size: 24px; color:green;">
			<?php echo MText::_("uploadsuccess");?>
			</span>
			<?php else:?>
			<span style="font-weight:bold; font-size: 24px; color:red;">
			<?php echo MText::_("uploaderror");?>
			</span>
			<?php endif;?>
			<p><?php echo MText::_("destfolder") . ": ". ( str_replace(_START_FOLDER, "", $dir) ); ?></p>
			<?php if($error):?>
			<span style="font-weight:bold; font-size: 24px; color:red;"><?php echo MText::_("error");?></span>
			<p><?php echo($error);?></p>
			<?php endif;?>
			<br/><br/>
			<a href="<?php echo MURL::_("xhrupload",MURL::safePath($dir),"iframe"); ?>" onclick="javascript: return true;" style="width:120px; text-align:center;" class="askButton" href=""><?php echo MText::_("furtheruploads"); ?></a>
	</div>		
</div>

<script>parent.filesRefresh(); //setTimeout( function(){parent.promptFadeOut()},1000);</script>
</body>
</html>