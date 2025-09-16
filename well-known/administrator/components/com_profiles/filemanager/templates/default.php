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
$config = MConfig::instance();
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Mooj Profiles</title>
<link href="<?php echo _FM_HOME_FOLDER; ?>/css/window.css" rel="stylesheet" type="text/css" />
<link href="<?php echo _FM_HOME_FOLDER; ?>/css/environment.css" rel="stylesheet" type="text/css" />
<link href="<?php echo _FM_HOME_FOLDER; ?>/js/videojs/video-js.css" rel="stylesheet" type="text/css" />

<style type="text/css" id="mHeaderStyles">
.mListingName{width: 220px;}.mListingSize{width: 100px;}.mListingType{width: 100px;}.mListingChanged{width: 100px;}.mListingRights{width: 120px;}.mListingOwner{width: 80px;}
</style>

<style type="text/css" id="mToggleFoldersStyle"><?php 
	$toggleFolderState = isset( $_COOKIE["mtogglefolders"] ) ? (int) $_COOKIE["mtogglefolders"] : 1 ;
	echo $toggleFolderState ? '' : '.mSelectFolder{display:none;}';
?></style>


<script language="javascript" type="text/javascript">
var isSplit = true;
var mTextURL = "<?php echo MURL::_("xhrtext"); ?>";
var mSuffixURL = "<?php echo MURL::_("xhrsuffix"); ?>";
var mainJSRootUri = "<?php echo _FM_HOME_FOLDER; ?>/js/";
var mainImageUri = "<?php echo _FM_HOME_FOLDER; ?>/images/";
var mainRootUri = "<?php echo MURL::_(); ?>";
var defaultWindowWidth = 950;
var defaultEnvironmentTop = 0;
var filesViewState = <?php echo $filesView?>;
var maxUploadSize = <?php  echo MRoots::getMaxUploadSize();?>;
</script>

<script type="text/javascript" src="<?php echo _FM_HOME_FOLDER; ?>/js/dojo.js"
	djConfig="parseOnLoad: true"></script>

<script type="text/javascript" src="<?php echo _FM_HOME_FOLDER; ?>/js/loader.js"></script>	
<script type="text/javascript" src="<?php echo _FM_HOME_FOLDER; ?>/js/text.js"></script>
<script type="text/javascript" src="<?php echo _FM_HOME_FOLDER; ?>/js/rights.js"></script>
<script type="text/javascript" src="<?php echo _FM_HOME_FOLDER; ?>/js/underline.js"></script>
<script type="text/javascript" src="<?php echo _FM_HOME_FOLDER; ?>/js/mooj.js"></script>
<script type="text/javascript" src="<?php echo _FM_HOME_FOLDER; ?>/js/waiting.js"></script>
<script type="text/javascript" src="<?php echo _FM_HOME_FOLDER; ?>/js/info.js"></script>
<script type="text/javascript" src="<?php echo _FM_HOME_FOLDER; ?>/js/xhrupload.js"></script>
<script type="text/javascript" src="<?php echo _FM_HOME_FOLDER; ?>/js/parse.js"></script>
<script type="text/javascript" src="<?php echo _FM_HOME_FOLDER; ?>/js/videojs/video.js"></script>
<script>
  videojs.options.flash.swf = "<?php echo _FM_HOME_FOLDER; ?>/js/videojs/video-js.swf";
</script>


<script src="<?php echo _FM_HOME_FOLDER; ?>/js/codemirror/lib/codemirror.js"></script>
<link rel="stylesheet" href="<?php echo _FM_HOME_FOLDER; ?>/js/codemirror/lib/codemirror.css">
<link rel="stylesheet" href="<?php echo _FM_HOME_FOLDER; ?>/js/codemirror/theme/eclipse.css">
<script src="<?php echo _FM_HOME_FOLDER; ?>/js/codemirror/mode/javascript/javascript.js"></script>
<script src="<?php echo _FM_HOME_FOLDER; ?>/js/codemirror/mode/xml/xml.js"></script>
<script src="<?php echo _FM_HOME_FOLDER; ?>/js/codemirror/mode/htmlmixed/htmlmixed.js"></script>
<script src="<?php echo _FM_HOME_FOLDER; ?>/js/codemirror/mode/php/php.js"></script>
<script src="<?php echo _FM_HOME_FOLDER; ?>/js/codemirror/mode/clike/clike.js"></script>
<script src="<?php echo _FM_HOME_FOLDER; ?>/js/codemirror/mode/css/css.js"></script>
<script src="<?php echo _FM_HOME_FOLDER; ?>/js/codemirror/mode/mysql/mysql.js"></script>
<script src="<?php echo _FM_HOME_FOLDER; ?>/js/codemirror/mode/perl/perl.js"></script>
<script src="<?php echo _FM_HOME_FOLDER; ?>/js/codemirror/mode/vb/vb.js"></script>
<script src="<?php echo _FM_HOME_FOLDER; ?>/js/codemirror/mode/pascal/pascal.js"></script>
<script src="<?php echo _FM_HOME_FOLDER; ?>/js/codemirror/mode/python/python.js"></script>

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
	<div class="windowWrap windowWrapOuter" id="mWindow"  style="-o-user-select: none; -moz-user-select: none; -webkit-user-select: none; user-select: none; " onselectstart="return false;"><!-- Window Header Wrap -->
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
					- <?php echo MText::_("rootfolder"); ?>
						<span id="mHeaderPath">
						<?php $headerPath = str_replace( _START_FOLDER, "", $GLOBALS["dir"]);
						echo $headerPath;
						?>
						</span>
					</span>
				</td>
				<td width="31px" class="headerBackground" style="width: 67px;">
					<div style="width: 67px;">
					
					<a href=""
					id="mCloseFullScreen"
					onclick="javascript: closeFullscreen(this); return false;"
					class="buttonSizeNormal" title="<?php echo MText::_("reduce");?>" style="float:left; display:none;"> <img
					src="<?php echo _FM_HOME_FOLDER; ?>/images/spacer.png" /> </a>
					
					
					
							<a href=""
					id="mFullScreen"
					onclick="javascript: requestFullScreen(document.body,this); return false;"
					class="buttonSizeFullscreen" title="<?php echo MText::_("maximize");?>" style="float:left;"> <img
					src="<?php echo _FM_HOME_FOLDER; ?>/images/spacer.png" /> </a>
					
					
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
		include_once _FM_HOME_DIR.DS."templates".DS."mainbuttons.php"; 
		?>
		
		
		<!-- Select Listing -->
		
		<div class="toRight" style="width:242px;">
			<div <?php 
				if( (int) $_COOKIE['tooltip'] == 1){
					echo 'id="off"';
					
				}else {
					echo 'id=""';
				} 
				
			?> class="toggleTip toLeft" onclick="javascript: toggleTip(this); return false;" info="<?php echo MText::_("toggletooltip");?>"></div> 
			
			<?php 
			$toggleFolderStyle = $toggleFolderState ? 'style="background-position: 0px 0px;"' : 'style="background-position: 0px -48px;"';
	
			$toggleImageViewState = isset( $_COOKIE["mtoggleimageview"] ) ? (int) $_COOKIE["mtoggleimageview"] : 0 ;
			$toggleImageViewStyle = $toggleImageViewState ? 'style="background-position: 0px 0px;"' : 'style="background-position: 0px -48px;"';

			?>
			
			<div class="toggleImageViewWrapper toLeft">
				<div id="toggleImageView" 
					 state="<?php echo $toggleImageViewState; ?>"
					 onclick="javascript: mToggleImageView(this);"
					 <?php echo $toggleImageViewStyle; ?> 
					 info="<?php echo MText::_("toggleimageview");?>"
				></div>
				<div id="toggleImageViewOverlay" info="<?php echo MText::_("onlyintilesmode");?>" <?php echo ($filesView==2)? 'style="left: -9999em;"':""; ?>></div>
			</div>
		
			<div id="toggleFolder" 
				 class="toLeft"
				 state="<?php echo $toggleFolderState; ?>"
				 onclick="javascript: mToggleFolders(this);"
				 <?php echo $toggleFolderStyle; ?> 
				 info="<?php echo MText::_("togglefolders");?>"
			></div>
			
			<div class="toLeft" style="width:74px;">
			<a href="" id="" class="mListingDropDown<?php echo ($filesView==2)?"2":""; ?>" onclick="javascript: openSelectDropDown(this); return false;"></a>
			<a href="" id="boxOrList" class="mListingSelectBox<?php echo ($filesView==2)?"2":""; ?>" onclick="javascript: selectDropDownToggle(); return false;"></a>
			</div>
		</div>
		
		<!-- EOF Select Listing --> 
		
		</div>
		<?php if( (int) $_COOKIE['tooltip'] == 0){echo '<script language="javascript" type="text/javascript">toolTipState = 0;</script>';} ?>
		
		<!-- EOF Button Wrap --> 
	
		<!-- Info Prompt -->
		<div
			style="position: absolute; display: none; width: 950px; background-color: transparent; opacity: 0; z-index: 55;"
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
		
		<div class="contentWrap" id="mWindowContent">
		<div id="mContentInner">
		<!--Test for inner -->
		<table width="100%" height="100%" cellspacing="0" cellpadding="0"
			border="0" style="float: left; overflow: hidden;" id="mSplitTable">
			<tbody>
			
			<tr>
				<td bgcolor="#e5eefb" valign="top">
				<div class="mSelectHeading" id="mFolderHeading" style="width:219px;">
					<a href="" onclick="javascript: refreshRoot(); return false;" class="refreshButton" title="<?php echo MText::_("refresh");?>"></a>
						<select onchange="javascript: mSelectRootFolder(this.value);" 
								class="folderSelectBox"
								info="<?php echo MText::_("rootfolderselect");?>" >
						<?php 
						$count = 0;
						foreach($GLOBALS['folderAccess'] as $count=>$myFolder){
							$selectIt = ($GLOBALS['currentMainFolder']==$count)?' selected="selected" ':"";
						?>
						<option value="<?php echo $count; ?>" <?php echo $selectIt; ?>><?php echo $GLOBALS['folderAccessNames'][$count++];?></option>	
						<?php }	?>
						</select>
					</div>
				</td>
				<td bgcolor="#c7d1e1" ></td>
				<td bgcolor="#e5eefb" valign="top" height="26px" id="mSelectHeadingWrap">
				<div class="mSelectHeadingInnerWrap">
				<?php 
				echo'<div class="mSelectHeading" id ="mSelectHeading" align="left" >
					<a href="" class="refreshButton" onclick="javascript: filesRefresh(); return false;" title="'.MText::_("refresh").'"></a>
					<div id="mSelectHeadingInner">
						<div id="mListingNameNode" class="mListingName" style="margin-top: -6px;"><span>'.MText::_('name').'<span id="mListingNameOrder" class="mSelectHeadingOrder"></span></span></div> <div class="mListingValve" data="mListingName"></div>
						<div id="mListingSizeNode" class="mListingSize"><span>'.MText::_('size').'<span id="mListingSizeOrder" class="mSelectHeadingOrder"></span></span></div> <div class="mListingValve" data="mListingSize"></div>
						<div id="mListingTypeNode" class="mListingType"><span>'.MText::_('type').'<span id="mListingTypeOrder" class="mSelectHeadingOrder"></span></span></div> <div class="mListingValve" data="mListingType"></div>
						<div id="mListingChangedNode" class="mListingChanged"><span>'.MText::_('changed').'<span id="mListingChangedOrder" class="mSelectHeadingOrder"></span></span></div> <div class="mListingValve" data="mListingChanged"></div>
						<div id="mListingRightsNode" class="mListingRights"><span>'.MText::_('rights').'<span id="mListingRightsOrder" class="mSelectHeadingOrder"></span></span></div> <div class="mListingValve" data="mListingRights"></div>
						<div id="mListingOwnerNode" class="mListingOwner"><span>'.MText::_('owner').'<span id="mListingOwnerOrder" class="mSelectHeadingOrder"></span></span></div> <div class="mListingValve" data="mListingOwner"></div>
					</div>
					</div>
				';				
				?>
					<div id="mSelectHeadingInnerFolders" style="display:none;">
						<a href="" class="refreshButton" onclick="javascript: filesRefresh(); return false;" title="<?php echo MText::_("refresh") ?>"></a>
						<a id="mFolderViewSort">
							<span id="mSelectedSort" onclick="javascript: mTableHeader.folderViewSort(); return false;"><?php echo MText::_("sorting");?></span>
						</a>
					</div>
				</div>
				</td>
			</tr>
				<tr>
				
					<!-- Left Split -->
					<td id="mSplitLeft" bgcolor="#e5eefb" width="250px" height="100%" valign="top" style="overflow: hidden; white-space: nowrap;">
					<div id="splitInnerLeft">					
						<span class="mFolder" namespace="folders" remove="" move="" copy="" click="folderSelect" create="" rename="renameFolder" dragable="folders" droppable="folders" ordering="" dropfunc="folderDrop">
						<?php echo $menu; ?>
						<!-- EOF rootWrap -->
						</span>
					<!-- EOF Fodler List -->
					</div>
					</td>
					<!-- EOF Left Split -->
					
					<!--  Split resizing -->
					<td bgcolor="#c7d1e1" width="3px" valign="top"
						style="height: inherit; overflow: hidden;"
						onmouseover="javascript: document.body.style.cursor = 'col-resize';"
						onmouseout="javascript: document.body.style.cursor = 'auto';">
					<p id="ffSplitSizeHack"
						style="width: 3px; background-color: #c7d1e1; height: 200px; display: block; position: relative; top: 0px; left: 0px; color: #c7d1e1; font-size: 0; opacity: 1;"
						onmousedown="javascript: dragSplitScreen = true;"
						onselectstart="return false;">'</p>
					</td>
					<!--  EOF Split resizing -->
					
					<!--  Right Spit -->
					<td bgcolor="#ffffff" valign="top" rel="wrapper" style="position: relative;" id="splitRight">
					
					<div id="splitInnerRight" rel="wrapper" >
						<?php echo $content; ?>
					</div>
					
					<div id="doNothin"></div>
					</td>
					<!--  EOF Right Spit -->
					
				</tr>
			</tbody>
		</table>
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

<div id="mNoMatchContainer" style="display:none"></div>
<!-- Loading Pane -->
<div class="mLoadingPaneGeneral"></div>
<div class="mLoadingPrompt">
	<table border="0" width="100%" height="100%"><tbody>
		<tr>
			<td align="center" valign="middle">
				<div id="mLoadingBox" class="">
					<span style="display:inline-block; padding:10px; font-size: 28px; font-weight:bold; margin-top: 20px; color: #074991; text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25); "><?php echo MText::_("loadingprofiles");?></span>
					<br/>
					<div class="mProgressBar">
						<div id="mProgress"></div>
					</div>
				</div>
			</td>
		</tr>
	</tbody></table>
</div>

</body>

<script language="javascript" type="text/javascript">

<?php if( !(bool) $config->get("use_progressbar") ):?>
dojo.query(".mLoadingPaneGeneral,.mLoadingPrompt").style({display:"none"});
<?php endif;?>

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
var boxOrList = _("boxOrList");
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

</script>
<!-- Footer JS Includes -->
<script type="text/javascript" src="<?php echo _FM_HOME_FOLDER; ?>/js/popup.js"></script>
<script type="text/javascript" src="<?php echo _FM_HOME_FOLDER; ?>/js/links.js"></script>
<script type="text/javascript" src="<?php echo _FM_HOME_FOLDER; ?>/js/forms.js"></script>
<script type="text/javascript" src="<?php echo _FM_HOME_FOLDER; ?>/js/select.js"></script>
<script type="text/javascript" src="<?php echo _FM_HOME_FOLDER; ?>/js/folderaction.js"></script>
<script type="text/javascript" src="<?php echo _FM_HOME_FOLDER; ?>/js/tree.js"></script>
<script type="text/javascript" src="<?php echo _FM_HOME_FOLDER; ?>/js/dragndrop.js"></script>
<script type="text/javascript" src="<?php echo _FM_HOME_FOLDER; ?>/js/chmod.js"></script>
<script type="text/javascript" src="<?php echo _FM_HOME_FOLDER; ?>/js/rightclick.js"></script>
<script type="text/javascript" src="<?php echo _FM_HOME_FOLDER; ?>/js/button.js"></script>
<script type="text/javascript" src="<?php echo _FM_HOME_FOLDER; ?>/js/filedrop.js"></script>
<script type="text/javascript" src="<?php echo _FM_HOME_FOLDER; ?>/js/tableheader.js"></script>
<script type="text/javascript" src="<?php echo _FM_HOME_FOLDER; ?>/js/search.js"></script>



<script type="text/javascript">
dojo.addOnLoad(function(){ mLoader.add("Darken generarted"); document.body.appendChild(_("mDarken"));});
	
</script>
<!-- EOF Footer JS Includes -->
</html>