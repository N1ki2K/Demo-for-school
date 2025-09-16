<?php

/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die('Restricted access');
?>

  

<form id="upload" action="<?php echo JRoute::_("index.php?option=com_eventgallery&task=upload.uploadFileByAjax&folder=".htmlspecialchars($this->item->folder, ENT_QUOTES, 'UTF-8')."&format=raw&",false); ?>" method="POST" enctype="multipart/form-data">
<fieldset>  
	<legend><?php echo $this->item->folder?></legend>
	<input type="hidden" id="MAX_FILE_SIZE" name="MAX_FILE_SIZE" value="30000000" />  
	<div>  
	    <label for="fileselect"><?php echo JText::_( 'COM_EVENTGALLERY_EVENT_UPLOAD_FILES_TO_UPLOAD' ); ?>:</label>  
	    <input type="file" id="fileselect" name="fileselect[]" multiple="multiple" />  
	    
	</div>  
	<div id="submitbutton">  
	    <button type="submit"><?php echo JText::_( 'COM_EVENTGALLERY_EVENT_UPLOAD_UPLOAD_FILES' ); ?></button>  
	</div>  
</fieldset>  
</form>  


<div class="row-fluid">
    <div class="span3">

        <h2 id="pending-label" style="display:none;"><?php echo JText::_( 'COM_EVENTGALLERY_EVENT_UPLOAD_PENDING' ); ?></h2><br>
        <ul id="pending"></ul>

    </div>
    <div class="span9">

        <h2 id="progress-label" style="display:none;"><?php echo JText::_( 'COM_EVENTGALLERY_EVENT_UPLOAD_FINISHED' ); ?></h2><br>
        <div id="progress" class="row-fluid thumbnails"></div>

    </div>
</div>




<form action="<?php echo JRoute::_('index.php'); ?>" method="post" name="adminForm" id="adminForm">

<input type="hidden" name="option" value="com_eventgallery" />
<input type="hidden" name="id" value="<?php echo $this->item->id; ?>" />
<input type="hidden" name="task" value="" />
<?php echo JHtml::_('form.token'); ?>

</form>

<style type="text/css">

    #pending {
        padding-right: 20px;
    }

    #pending li{
        word-wrap: break-word;
    }

	#progress div
	{
		min-height: 170px;
		padding: 10px;
        word-wrap: break-word;
	}

	#progress .success
	{
		/*background: #0c0 none 0 0 no-repeat;*/
	}

	#progress .failed
	{
		/*background: #c00 none 0 0 no-repeat;*/
	}

	.row-fluid [class*="span"]:first-child,
	.row-fluid [class*="span"] {
		margin-left: 0 !important;
	}
</style>

<script>

(function() {

/*
based on: 

filedrag.js - HTML5 File Drag & Drop demonstration
Featured on SitePoint.com
Developed by Craig Buckler (@craigbuckler) of OptimalWorks.net

*/
	var files = [];

	// file selection
	function FileSelectHandler(e) {

		// fetch FileList object
		var newFiles = e.target.files || e.dataTransfer.files;
		for (var i = 0, f; f = newFiles[i]; i++) {
			files.push(f);
		}

		UploadFile();
	}


	// upload JPEG files. Takes one file from the files array.
	function UploadFile() {

		document.getElementById('progress-label').style.display='inline';

		var pendingContainer = document.getElementById('pending');
		pendingContainer.innerHTML = '';
		for (var i = 0, f; f = files[i]; i++) {
			var element = pendingContainer.appendChild(document.createElement("li"));
			element.appendChild(document.createTextNode(f.name));
		}

		if (files.length === 0 ) {
			document.getElementById('pending-label').style.display='none';
			return;
		} else {
			document.getElementById('pending-label').style.display='inline';

		}

		var file = files.pop();

		var xhr = new XMLHttpRequest();
		if (xhr.upload && file.size <= document.getElementById("MAX_FILE_SIZE").value) {
			
			// create progress bar
			var o = document.getElementById("progress");


			var progress = o.insertBefore(document.createElement("div"), o.childNodes[0]);
			progress.className='span3';
			progress.appendChild(document.createTextNode("upload " + file.name));
			progress.addClass("uploading");


			// file received/failed
			xhr.onreadystatechange = function(e) {
				if (xhr.readyState === 4) {
					progress.className += (xhr.status === 200 ? " success" : " failure");
					progress.innerHTML = xhr.responseText;
					progress.removeClass('uploading');
					UploadFile();
				}
			};

			// start upload
			xhr.open("POST", document.getElementById("upload").action+"file="+file.name+"&ajax=true", true);
			//xhr.setRequestHeader("X_FILENAME", file.name);
			xhr.send(file);
			//console.log('file send.')

		} else {
			console.log("invalid file, will not try to upload it");
			UploadFile();
		}

	}


	// initialize
	function Init() {

		var fileselect = document.getElementById("fileselect"),
			submitbutton = document.getElementById("submitbutton");

		// file select
		
		fileselect.addEventListener("change", FileSelectHandler, false);

		// is XHR2 available?
		var xhr = new XMLHttpRequest();

		if (xhr.upload) {

			// remove submit button
			submitbutton.style.display = "none";
		}
		//console.log('Init fileupload done.');

	}

	// call initialization file
	if (window.File && window.FileList && window.FileReader) {
		Init();
	}


})();
</script>