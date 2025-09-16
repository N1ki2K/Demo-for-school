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
		<a href="<?PHP echo MURL::_("rootsandrights"). (isset($rootfolderid) ? '&id='. $rootfolderid : '') ; ?>" name="rootfolder"
			class="buttonBox <?php if(! $GLOBALS["task"]) echo 'active'; ?>" onclick="window.location.href= this.href;" > <img src="<?php echo _FM_HOME_FOLDER; ?>/images/rootfolder.png" /> <span><?php §(MText::_("rootfolder"));?></span>
		</a> 
		
		<a href="<?PHP echo MURL::_("rootsandrights",null,"rights"). (isset($rootfolderid) ? '&id='. $rootfolderid : ''); ?>"  name="rights"
			class="buttonBox <?php if($GLOBALS["task"]== "rights") echo 'active'; ?>" onclick="window.location.href= this.href;"> <img src="<?php echo _FM_HOME_FOLDER; ?>/images/rights.png" /> <span><?php §(MText::_("rights"));?></span>
		</a> 

		
		<div class="toRight">
		<?php 
			$_id = MRequest::int("id", 1); 
			$isDisabled = ' id="disabled"';
			$cursor = "default";
			if(!$GLOBALS["task"] && $_id > -1){
				$isDisabled = '';
				$cursor= "pointer";
			}
			
		?>
		<a name="delete" <?php echo $isDisabled; ?> style="cursor: <?php echo $cursor;?>;"
			class="buttonBox " onclick="javascript: if(this.id == 'disabled') return false; askRemove();" > 
			<img src="<?php echo _FM_HOME_FOLDER; ?>/images/trash.png" /> 
			<span><?php §(MText::_("delete"));?></span>
		</a> 
		
		<a name="save" style="cursor: pointer;"
			class="buttonBox " onclick="javascript: _('rightsFormNode').submit();"> 
			<img src="<?php echo _FM_HOME_FOLDER; ?>/images/accept.png" /> 
			<span><?php §(MText::_("save"));?></span>
		</a>
		</div>