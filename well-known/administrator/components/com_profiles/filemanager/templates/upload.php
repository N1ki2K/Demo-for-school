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
<title>Mooj Profiles</title>
<link href="<?php echo _FM_HOME_FOLDER; ?>/css/window.css" rel="stylesheet" type="text/css" />
<link href="<?php echo _FM_HOME_FOLDER; ?>/css/environment.css" rel="stylesheet" type="text/css" />
<script language="javascript" type="text/javascript">

	String.prototype.endsWith = function(str){
		return (this.match(str+"$")==str)}

	function evalUploadFile(node,id){
		var uname = "unzip-"+id;
		var unpack = document.getElementById(uname);
		if(node.value.toLowerCase().endsWith("zip")){
			unpack.removeAttribute("disabled");
		}else {
			unpack.checked = false;
			unpack.setAttribute("disabled", "disabled");
		}
	}


	function _isXHRUpload(){
	    var xhr = new XMLHttpRequest();
	    return !! (xhr && ('upload' in xhr) && ('onprogress' in xhr.upload));	
	}
	
</script>
</head>
<body>
<div class="windowWrap windowWrapOuter" style="width:500px; float:left;">
		
		<span style="margin-left: 4px;">
			<img src="<?php echo _FM_HOME_FOLDER; ?>/images/upload.png" / align="top">
			<span class="mTitle"><?php §(MText::_("upload"));?></span>
		</span>
		<br>
		
		<span style="font-size: 14px; margin-left: 4px; font-weight: bold;">
		<?php 
		$destFolder =  trim(str_replace(_START_FOLDER, "", $dir));
		$destFolder = $destFolder ? $destFolder : "";
		§(MText::_("destfolder"));?>: <?php echo '<span style="color: green;">' . MText::_("rootfolder") . '</span>' . $destFolder;?> <br/> <span <?php if($error) echo ' style="color:red;" ' ?>>
		<?php §(MText::_("max_upload"));?>: <?php  echo MRoots::getMaxUploadSize(1);?></span>
		</span>
		<?php 
			// prompt if error
			if($error){
				echo'<span style="color:red;"><br><b>'.$error.'</b></span>';
			}
		
		?>
		<form 
			action="<?php §(MURL::_("xhrupload",MURL::safePath($dir),"upload")); ?>" 
			name="mUploads" 
			enctype="multipart/form-data" 
			method="post">
			
			<table cellpadding="0" cellspacing="2" border="0" style="margin-top:5px;"><tbody>
				
			<?php 
				$rows = (int)  MConfig::instance()->get("max_upload_fields",6);
				for($t=0;$t<$rows;$t++){			
			?>
					<tr>
						<td valign="top" align="left">
							<input
								type="file" 
								name="files[]" 
								style="margin-bottom:5px;" 
								onchange="javascript:evalUploadFile(this, '<?php echo $t; ?>');"
								id="uploadfield<?php echo $t; ?>"
								/>
						</td>
						<td>
							<input 
								id="unzip-<?php echo $t; ?>"
								disabled="disabled" 
								type="checkbox" 
								name="unzip[]" 
								value="1" 
								class="toLeft" />
								
							<span style="display:block; margin-top:1px;float:left;">
							<?php §(MText::_("unpack"));?>
							</span>
						</td>
						<td>
							<a 	onclick="javascript: var n =  document.getElementById('<?php echo "uploadfield".$t; ?>'); n.value =''; evalUploadFile(n, '<?php echo $t; ?>'); " 
								class="askButton" 
								style="cursor: pointer; width: 120px; text-align: center;"><?php echo MText::_("clearupload");?></a>
						</td>
					</tr>
				<?php }?>
				
				</tbody></table>
				
				<input 
					class="submitBox"
					style="" 
					type="submit" 
					value="<?php §(MText::_("upload"));?>">
			
		</form>
</div>

<div id="dndon" class="windowWrap windowWrapOuter"  
	 style="display:block; border: 1px solid #afa; width: 390px; background-color:#efe; min-height: 250px; float:left; margin-top: 15px;">
	<div style="padding:10px;">
		<span style="font-weight: bold; font-size: 14px; color: #282;"><?php §(MText::_("dnduploadyes"));?></span>
		<br/><br/>
		<span style="font-weight: bold; font-size: 14px; padding-top: 10px;"><?php §(MText::_("dnduploaddesc"));?></span>
	</div>
</div>

<div id="dndoff" class="windowWrap windowWrapOuter"  
	 style="display:block; border: 1px solid #faa; width: 390px; background-color:#fee; min-height: 250px; float:left; margin-top: 15px;">
	<div style="padding:10px;">
		<span style="font-weight: bold; font-size: 14px; color: #822;"><?php §(MText::_("dnduploadno"));?></span>
		<br/><br/>
		<span style="font-weight: bold; font-size: 14px; padding-top: 10px;"><?php §(MText::_("dnduploaddesc"));?></span>
	</div>
</div>

<script type="text/javascript">
	var dndon = document.getElementById("dndon").style;
	var dndoff = document.getElementById("dndoff").style;
	if(_isXHRUpload()){
		dndon.display = "block";
		dndoff.display = "none";
	}else{
		dndon.display = "none";
		dndoff.display = "block";
	}
</script>


</body>
</html>