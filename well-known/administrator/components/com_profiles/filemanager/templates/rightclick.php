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

<div class="rightClick" id="rightClick">
<table cellpadding="0" cellspacing="0" border="0" width="100%" height="100%"><tbody>
<tr>
	<td rowspan="2" class="rightClickContent" id="rcContent" >
	<div id="noRcTransfer">
	<ul id="rcNew">
		<?php makeRC("newfolderfile","rcNew()","new.png","rcNewFolderFile");?>
	</ul>
	
	
	<ul id="rcGeneral">
		<?php makeRC("open_edit","rcOpen()","open.png","rcOpenFile");?>
		<?php makeRC("download","rcDownload()","download.png","rcDownload"); ?>
		<?php makeRC("rename","rcRename()","rename.png","rcRename");?>
		<?php makeRC("remove","askRemove()","trash.png","rcDelete");?>
		<?php makeRC("changemode","rcChangeMode()","lock.png","rcChmod");?>
	</ul>
	<hr>
	<ul id="rcPacking">	
		<?php makeRC("pack","rcPack()","pack.png","rcPack");?>
		<?php makeRC("unpack","rcUnpack()","unpack.png","rcUnPack");?>
	</ul>
	</div>
	<ul id="rcTransfer">
		<?php makeRC("move","rcTransferTask('move')","move.png","rcMove");?>
		<?php makeRC("copy","rcTransferTask('copy')","copy.png","rcCopy");?>
	</ul>
	
	<hr>
	<ul id="rcCancelWrap">
		<?php makeRC("cancel","setRightClick()","cancel.png","rcCancel");?>
	</ul>
	
	</td>
	<td class="rightClickCorner" height="5px" width ="5px" id="rcCorner"><img src="<?php echo _FM_HOME_FOLDER; ?>/images/spacer.png" width="5px" height="5px" /></td>
</tr>
<tr>
	<td class="rightClickShadow" id="rcShadow" valign="top"><img id="rcShadowImg" src="<?php echo _FM_HOME_FOLDER; ?>/images/right-click-shadow-back.png" width="5"  /></td>
</tr>

<tr>
	<td colspan="2" class="rightClickBottom" id="rcBottom" ></td>
</tr>

</tbody></table>
</div>


<div class="rightClick simpleShadow" id="rightClickPopup">
<table cellpadding="0" cellspacing="0" border="0" width="100%" height="100%"><tbody>
<tr>
	<td class="rightClickContent"  >
		<div>
			<ul>
				<?php makeRC("maximize","maximizePopup(_('rightClickPopup').popupName)","maximize.png","maxPop"); ?>
				<?php makeRC("reduce","reducePopup(_('rightClickPopup').popupName);","reduce.png","redPop");?>
				<?php makeRC("close","closePopup(_('rightClickPopup').popupName)","close.png","closePop"); ?>
			</ul>
			<hr>
			<ul>
				<?php makeRC("cancel","_S('rightClickPopup').left = '-9999em'","cancel.png","rcCancel");?>
			</ul>
		</div>
	</td>
</tr>


</tbody></table>
</div>




















