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

$errorText = isset($errorText) ? $errorText : MText::_("noauth");
$goBackUrl = isset($goBackUrl) ? $goBackUrl : _CLOSE_HREF;
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Mooj Profiles - <?php echo MText::_("noauth")?></title>
<link href="<?php echo _FM_HOME_FOLDER; ?>/css/window.css" rel="stylesheet" type="text/css" />
<link href="<?php echo _FM_HOME_FOLDER; ?>/css/environment.css" rel="stylesheet" type="text/css" />
</head>
<body>

<!-- Background Cover -->
<div class="coverBackground"></div>
<!-- EOF Background Cover -->

<!-- Wallpaaper -->
<div class="wallPaper" id="mWallPaper" style="display:block; filter:alpha(opacity=100);	opacity:1;"></div>
<!-- EOF Wallpaaper -->


<!-- Environment Wrap -->
<table width="100%" height="100%" cellspacing="0" cellpadding="0" border="0" >
			<tr>
				<td align="center" valign="middle">

	<!-- Window Wrap -->
	<div class="windowWrap windowWrapOuter" id="mWindow">
	<!-- Window Header Wrap -->

	<!-- EOF Window Header Wrap --> 

	
							
		<!-- Content Wrap -->
		
		<div class="contentWrap" id="mWindowContent" style="border-top: 5px solid #c7d1e1;">
		<table width="100%" height="100%" cellspacing="0" cellpadding="0" border="0" >
			<tr>
				<td align="center" valign="middle">
					<span class="noAuth"><?php echo $errorText;?></span>
					<div class="clr"></div>
				
					<a href="<?php echo $goBackUrl; ?>" style="margin-top: 32px; cursor: pointer; width: 120px; text-align: center; float: none;" class="askButton"><?php echo MText::_("back");?></a>
				</td>
			</tr>
		</table>
			
		</div>
		<!-- EOF Content Wrap -->
	
		<div class="clr"></div>
		</div>
		<!-- EOF Window Inner Wrap -->
		
	<div class="clr"></div>
	
			</td>
			</tr>
		</table>

</body>
</html>