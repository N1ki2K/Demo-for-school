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
global $filesView;
if (! isset($_COOKIE['tooltip'])) {
	setcookie("tooltip",0);
	$_COOKIE['tooltip'] = 0;
}

$imagePath = _FM_HOME_FOLDER . "/images/";
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Mooj Profiles - <?php echo MText::_("information"); ?></title>
<link href="<?php echo _FM_HOME_FOLDER; ?>/css/window.css" rel="stylesheet" type="text/css" />
<link href="<?php echo _FM_HOME_FOLDER; ?>/css/environment.css" rel="stylesheet" type="text/css" />



<script language="javascript" type="text/javascript">
var isSplit = false;
var mTextURL = "<?php echo MURL::_("xhrtext"); ?>";
var mSuffixURL = "<?php echo MURL::_("xhrsuffix"); ?>";
var mainJSRootUri = "<?php echo _FM_HOME_FOLDER; ?>/js/";
var mainImageUri = "<?php echo _FM_HOME_FOLDER; ?>/images/";
var mainRootUri = "<?php echo MURL::_(); ?>";
var defaultWindowWidth = 950;
var defaultEnvironmentTop = 0;
var filesViewState = <?php echo $filesView?>;
var maxUploadSize = <?php  echo evalBytes(ini_get('upload_max_filesize'));?>;
var noGeneralKeyDown = 1;
</script>

<script type="text/javascript" src="<?php echo _FM_HOME_FOLDER; ?>/js/dojo.js"
	djConfig="parseOnLoad: true"></script>
<script type="text/javascript" src="<?php echo _FM_HOME_FOLDER; ?>/js/loaderdummy.js"></script>
<script type="text/javascript" src="<?php echo _FM_HOME_FOLDER; ?>/js/text.js"></script>
<script type="text/javascript" src="<?php echo _FM_HOME_FOLDER; ?>/js/underline.js"></script>
<script type="text/javascript" src="<?php echo _FM_HOME_FOLDER; ?>/js/mooj.js"></script>
<script type="text/javascript" src="<?php echo _FM_HOME_FOLDER; ?>/js/waiting.js"></script>
<script type="text/javascript" src="<?php echo _FM_HOME_FOLDER; ?>/js/info.js"></script>
</head>
<body>

<!-- Background Cover -->
<div class="coverBackground"></div>
<!-- EOF Background Cover -->

<!-- Wallpaaper -->
<div class="wallPaper" id="mWallPaper"></div>
<!-- EOF Wallpaaper -->


<!-- Environment Wrap -->
<div class="environmentWrap" id="mEnvironment">
<center>

	<!-- Window Wrap -->
	<div class="windowWrap windowWrapOuter" id="mWindow" style="-o-user-select: none; -moz-user-select: none; -webkit-user-select: none; user-select: none; " ><!-- Window Header Wrap -->
	<div class="headerWrap" id="mWindowHeader">
	<table border="0" cellpadding="0" cellspacing="0" class="headerTable"
		id="mHeaderTable">
		<tbody>
			<tr>
				<td width="10px"><img src="<?php echo _FM_HOME_FOLDER; ?>/images/corner-top-left.png"
					class="noBorder toLeft" /></td>
				<td class="headerBackground" style="width: 116px;"><img
					src="<?php echo _FM_HOME_FOLDER; ?>/images/logo.png" class="noBorder toLeft" /></td>
				<td class="headerBackground" align="left">
					<span class="filePathHeader">
					- <?php echo MText::_("information"); ?>
						<span id="mHeaderPath">
						<?php $headerPath = str_replace( _START_FOLDER, "", $GLOBALS["dir"]);
						echo $headerPath;
						?>
						</span>
					</span>
				</td>
				<td width="31px" class="headerBackground" style="width: 31px;">
					<div style="width: 31px;">
						<a  href="<?php echo _CLOSE_HREF; ?>"
							class="buttonWindowClose" 
							onclick="javascript: window.location = this.href; return true;" 
							info="<?php echo MText::_('exit');?>">
							<img src="<?php echo _FM_HOME_FOLDER; ?>/images/spacer.png" /> 
						</a>
					</div>
			</td>
				<td width="10px"><img src="<?php echo _FM_HOME_FOLDER; ?>/images/corner-top-right.png"
					class="noBorder toLeft" /></td>
			</tr>
		</tbody>
	</table>
	</div>
	<!-- EOF Window Header Wrap --> 
	
	<!-- Window Inner Wrap -->
	<div class="innerWrap" id="mInnerWrap">
		<!-- Tab Wrap -->
		<div class="tabWrap" id="mWindowTab">
			<!-- Tab Inner Wrap -->
			<div class="tabInnerWrap" id="mWindowTabInner">				
				<?php 
				// Including the main menu
				include_once _FM_HOME_DIR.DS."templates".DS."mainmenu.php"; 
				?>
			</div>
			<!-- EOF Tab Inner Wrap -->
		</div>
		<!-- EOF Tab Wrap --> 
	
		<!-- Button Wrap -->
		<div class="buttonWrap" id="mWindowButton">
		
		<?php 
		// Including the main buttons
	//	include_once _FM_HOME_DIR.DS."templates".DS."configbuttons.php"; 
		?>
		</div>
		
		<!-- EOF Button Wrap --> 
	
		<!-- Info Prompt -->
		<div
			style="position: absolute; display: none; width: 950px; background-color: transparent; opacity: 0; z-index: 49;"
			align="center" id="mInfoWrap">
		<table class="infoPrompt" id="mInfo" cellpadding="0" cellspacing="0"
			border="0" width="100%">
			<tr>
				<td bgcolor="transparent" id="mInfoTableLeft"><img
					src="<?php echo _FM_HOME_FOLDER; ?>/images/info-left-round.png"
					style="border-right: 5px solid #c7d1e1;" width="100%" height="100%"
					id="mInfoLeft" /></td>
				<td bgcolor="#c7d1e1" id="mInfoMiddle"></td>
				<td bgcolor="transparent" id="mInfoTableRight"><img
					src="<?php echo _FM_HOME_FOLDER; ?>/images/info-right-round.png"
					style="border-left: 5px solid #c7d1e1;" width="100%" height="100%"
					id="mInfoRight" /></td>
			</tr>
		</table>
		</div>
		<!-- EOF Info Prompt --> 
		
					
		<script language="javascript" type="text/javascript">							
			<?php  if( (int) $_COOKIE['tooltip'] == 1) echo 'toolTipState = 1;'."\n"; ?>
		</script> 
							
		<!-- Content Wrap -->
		
		<div class="contentWrap" id="mWindowContent" style="background-color: #E5EEFB;">
		<div id="mContentInner"  style="background-color: white; min-height: 100%;">
		<!--Test for inner -->
		
					<div id="splitInnerRight" rel="wrapper" >
						
						<div style="padding: 10px;" >
							<?php echo $content; ?>

						</div>
					</div>
		</div>
		</div>
		<!-- EOF Content Wrap -->
	
		<div class="clr"></div>
		</div>
		<!-- EOF Window Inner Wrap -->
		
	<div class="clr"></div>
	</div>
	<!-- EOF Window Wrap -->
	
</center>
<div class="clr"></div>
</div>
<!-- EOF Environment Wrap -->

<!-- Action Panes -->

<div class="mDarken" id="mDarken"></div>
<div class="mLoadingPane" id="mLoadingPane" rel="wrapper" use="flyout"></div>
<div
	style="position: absolute; display: block; width: 32px; left: -9999em; z-index: 51"
	id="mClosePrompt"><a href=""
	onclick="javascript: promptFadeOut(); return false;"
	class="buttonPromptClose" title="<?php echo MText::_('cancel');?>" > <img
	src="<?php echo _FM_HOME_FOLDER; ?>/images/spacer.png" border="0" /> </a></div>
<div id="mContainer"
	style="position: absolute; display: block; margin: 0; padding: 0; left: -99999em"></div>
	
<?php 
// Including the right click template
include_once _FM_HOME_DIR.DS."templates".DS."rightclick.php"; 
?>


<div id="mTableColWidth"></div>

<!-- EOF Action Panes -->


<div id="darkenBack" style="position: fixed; display:block; top:0; width: 100%; height: 100%; background-color: black; z-index: 99999; left: -9999em;"></div>

<div id="iFrameContainer" style="position: fixed; display:block; top:0; width: 100%; height: 100%; background-color: transparent; z-index: 100000; left: -9999em;">

	<div style="display:block; padding: 32px; position: relative; height: 100%;">
		<div style="display:block; position: absolute; top: 0; right:0; z-index: 100001; cursor:pointer;"
			onclick="javascript: hideFrame();"><img src="<?php echo $imagePath; ?>trash.png" /></div>
		<div style="display:block; width: 100%; height: 95%; margin-top: -20px; border: 10px solid black;">
		<?php if(isset($jed) && $jed):?>
		<iframe frameborder="0" style="display:block; width: 100%; height: 100%;" src="<?php echo $jed; ?>"></iframe>
		<?php endif;?>
		</div>
	</div>
</div>
</body>

<script type="text/javascript">
var mEnvironment = _("mEnvironment");
var mWindow = _("mWindow");
var mWindowContent = _("mWindowContent");
var mContentInner = _("mContentInner");
var mWallPaper = _("mWallPaper");
var mWallPaperStyle = mWallPaper.style;
var mInfoWrap = _("mInfoWrap");
var mInfoMiddle = _("mInfoMiddle");
var mLoadingPane = _("mLoadingPane");
var mContainer = _("mContainer");
var mDarken = _("mDarken");
var mResizingInfo = _("sizeButtonWrapper");
rememberSize();

var contentBounds = _ViewportOffset(mWindowContent);

var currentContentTop = contentBounds.t; 
var contentPaneNormal = currentContentTop;
var contentPaneFull = currentContentTop-defaultEnvironmentTop;
if(currentWindowSize >1){
	contentPaneFull = currentContentTop;
	contentPaneNormal = currentContentTop+defaultEnvironmentTop;
}
var newContentPaneHeight = 0;

if(isSplit){
	// Style Object of the ffSplitHack
	var ffSplitStyle = _S("ffSplitSizeHack");
}

function setRightClick(){}


dojo.addOnLoad(function(){
	// InfoTip parser
	if(funcExists("parseInfoTips")){
		parseInfoTips(document);
	}
});

dojo.style("darkenBack",{opacity: 0.7});
function hideFrame(){

	_fx.fadeOpacity(dojo.byId("darkenBack"),500,0.8,0, function(){dojo.style("darkenBack",{left:"-9999em"});} );
	_fx.fadeOpacity(dojo.byId("iFrameContainer"),500,1,0, function(){dojo.style("iFrameContainer",{left:"-9999em"});});
	
}

function showFrame(){
	dojo.style("darkenBack",{left:"0"});
	dojo.style("iFrameContainer",{left:"0"});
	_fx.fadeOpacity(dojo.byId("darkenBack"),500,0,0.8);
	_fx.fadeOpacity(dojo.byId("iFrameContainer"),500,0,1);
}


</script>
<!-- Footer JS Includes -->
<script type="text/javascript" src="<?php echo _FM_HOME_FOLDER; ?>/js/popup.js"></script>



<!-- EOF Footer JS Includes -->
</html>