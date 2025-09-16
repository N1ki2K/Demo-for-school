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
		<a href="" onclick="javascript: execButton(this,'up'); return false;" name="goup" id="disabled" url=""
			class="buttonBox" > <img src="<?php echo _FM_HOME_FOLDER; ?>/images/goup.png" /> <span><?php §(MText::_("up"));?></span>
		</a> 
		
		<a href="" onclick="javascript: execButton(this,'new'); return false;" name="new"
			class="buttonBox" > <img src="<?php echo _FM_HOME_FOLDER; ?>/images/folder.png" /> <span><?php §(MText::_("new"));?></span>
		</a> 
		
		<a href=""  onclick="javascript: execButton(this,'rename'); return false;" name="rename"
			class="buttonBox" > <img src="<?php echo _FM_HOME_FOLDER; ?>/images/rename.png" /> <span><?php §(MText::_("rename"));?></span>
		</a> 
		
		<a href="" onclick="javascript: execButton(this,'unpack'); return false;" name="unpack"
			class="buttonBox" > <img src="<?php echo _FM_HOME_FOLDER; ?>/images/unzip.png" /> <span><?php §(MText::_("unpack"));?></span>
		</a> 
		
		<a href="" onclick="javascript: execButton(this,'pack'); return false;" name="pack"
			class="buttonBox" > <img src="<?php echo _FM_HOME_FOLDER; ?>/images/zip.png" /> <span><?php §(MText::_("pack"));?></span>
		</a> 
		
		<a href="" onclick="javascript: execButton(this,'upload'); return false;" name="upload"
			class="buttonBox" > <img src="<?php echo _FM_HOME_FOLDER; ?>/images/upload.png" /> <span><?php §(MText::_("upload"));?></span>
		</a> 
		
		<a href="" onclick="javascript: execButton(this,'download'); return false;" name="download"
			class="buttonBox" >	<img src="<?php echo _FM_HOME_FOLDER; ?>/images/download.png" /> <span><?php §(MText::_("download"));?></span> 
		</a>
		
		<a href="" onclick="javascript: execButton(this,'chmod'); return false;" name="chmod"
			class="buttonBox" > <img src="<?php echo _FM_HOME_FOLDER; ?>/images/lock.png" /> <span><?php §(MText::_("rights"));?></span>
		</a>
		
		<a href="" onclick="javascript: execButton(this,'remove'); return false;" name="remove"
			class="buttonBox" > <img src="<?php echo _FM_HOME_FOLDER; ?>/images/trash.png" /> <span><?php §(MText::_("remove"));?></span>
		</a> 
		
		<ul id="mSearch">
			<li onclick="javascript: mSearch.setFreeze();">
				<img src="<?php echo _FM_HOME_FOLDER; ?>/images/search.png" /> 
				<span><?php §(MText::_("search"));?></span>
				
				<ul id="mDisplaySearch">
					<li>
					<input id="mSearchField"></input>
					<img src="<?php echo _FM_HOME_FOLDER; ?>/images/no.png" id="mSearchFieldClean" />
					<img src="<?php echo _FM_HOME_FOLDER; ?>/images/search_small.png" id="mSearchFire" />
					</li>
				</ul>
			</li>
		</ul>