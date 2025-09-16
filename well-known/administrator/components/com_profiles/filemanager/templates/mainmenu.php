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

$mainMenuItems = array(
		// Filemanger
		array(
			//Views	
			array("default","",null),
			// name 
			MText::_("filemanager"),
			// URL
			MURL::_(),
			// Roots only ?
			0
		),
		// Roots and Rights
		array(
				//Views
				array("rootsandrights"),
				// name
				MText::_("rootandrights"),
				// URL
				MURL::_("rootsandrights"),
				// Roots only ?
				1
		),
		// Config
		array(
				//Views
				array("config"),
				// name
				MText::_("config"),
				// URL
				MURL::_("config"),
				// Roots only ?
				1
		),
		// Diagnostics
		array(
				//Views
				array("diagnostics"),
				// name
				MText::_("diagnostics"),
				// URL
				MURL::_("diagnostics"),
				// Roots only ?
				1
		),
		// Info
		array(
				//Views
				array("information"),
				// name
				MText::_("information"),
				// URL
				MURL::_("information"),
				// Roots only ?
				0
		)
				
);

$user = MPeer::getUser();

foreach ($mainMenuItems as $menuItem){
	if(!$menuItem[3] || $menuItem[3] && $user->isRoot || _FM_IS_DEMO){
		if(in_array($GLOBALS['view'], $menuItem[0])){
			echo'
			<div class="toLeft"	style="position: relative; display: block; width: auto; margin-top: 2px;">
			<span class="activeTab" id="activeTab">'.$menuItem[1].'</span>
			<img src="' . _FM_HOME_FOLDER . '/images/active-tab-right.png" class="toLeft" />
			</div>
			'."\n";
		}else{
			echo '<a href="'.$menuItem[2].'" class="tabOverlay">'.$menuItem[1].'</a> '."\n";
		}
	}//EOF  allowed to see
}//EOF foreach
echo '
	<span class="tabUnderlay" id="tabUnderlay"> 
		<img src="' . _FM_HOME_FOLDER . '/images/orange-tab-right.png" class="toRight" /> 
	</span>'."\n";


?>