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

<p class="well">
    <?php echo JText::_('COM_EVENTGALLERY_SYNC_START2_DESC'); ?>
</p>

<p id="loading-folders"><img src="<?php echo JUri::root()?>/media/com_eventgallery/frontend/images/loading.gif"></p>

<p class="alert" id="warnings"></p>

<form class="form-horizontal" id="items" name="items">

    <div class="control-group">
        <div class="controls2">    
            <div class="btn-group sync-buttons">
                <button class="btn checkall"><?php echo JText::_('COM_EVENTGALLERY_SYNC_CHECK_ALL');?></button>
                <button class="btn uncheckall" ><?php echo JText::_('COM_EVENTGALLERY_SYNC_CHECK_NONE');?></button>
                <button class="btn btn-danger sync-folders"><?php echo JText::_('COM_EVENTGALLERY_SYNC_FOLDERS');?></button>
                <button class="btn btn-primary sync-files" disabled="disabled"><?php echo JText::_('COM_EVENTGALLERY_SYNC_FILES');?></button>
            </div>
        </div>
    </div>
    <div class="file-sync-hint" style="display:none"><?php echo JText::_('COM_EVENTGALLERY_SYNC_FILE_SYNC_HINT_DESC'); ?></div>
    <progress id="syncprogress" value="0" max="100"></progress>

    <div class="control-group">
        <div class="controls2" id="folders">

        </div>
    </div>

    <div class="control-group">
        <div class="controls2">
            <div class="btn-group sync-buttons">
                <button class="btn checkall"><?php echo JText::_('COM_EVENTGALLERY_SYNC_CHECK_ALL');?></button>
                <button class="btn uncheckall" ><?php echo JText::_('COM_EVENTGALLERY_SYNC_CHECK_NONE');?></button>
                <button class="btn btn-danger sync-folders"><?php echo JText::_('COM_EVENTGALLERY_SYNC_FOLDERS');?></button>
                <button class="btn btn-primary sync-files" disabled="disabled"><?php echo JText::_('COM_EVENTGALLERY_SYNC_FILES');?></button>
            </div>
        </div>
    </div>

</form>

<form action="<?php echo JRoute::_('index.php'); ?>" method="post" name="adminForm" id="adminForm">
    <input type="hidden" name="option" value="com_eventgallery" />
    <input type="hidden" name="task" value="" />
    <?php echo JHtml::_('form.token'); ?>
</form>


<style type="text/css">
    #syncprogress {
        height: 20px;
        margin: 20px 0;
        width: 100%;
        display: block;
    }

    #items {
        display:none;
    }

    #warnings {
        display:none;
    }

    .sync label{
        background-color: darkseagreen;
    }

    .no-sync label{
        background-color: lightblue;
    }

    .deleted label{
        background-color: lightsalmon;
    }

    .file-todo {
        display: inline-block;
        padding: 5px;
    }
    .file-todo>span {
        margin-right: 5px;
    }

    .folder label {
        padding: 5px;
        margin: 2px;
        border: 1px solid #e0e0e0;
    }

    .file-sync-hint {
        font-size: 1.4em;
        margin: 10px 0;
        padding: 10px;
        border: 1px solid lightgrey;
        background-color: orange;
    }
</style>

<script type="text/javascript">

(function(jQuery) {

    function checkAll(formname, checktoggle)
    {
        var checkboxes = [];
        checkboxes = document.forms[formname].getElementsByTagName('input');

        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].type === 'checkbox') {
                checkboxes[i].checked = checktoggle;
            }
        }

        return true;
    }

    var max = 0,
        syncProgressElement = document.getElementById('syncprogress');

    function syncFolder(folderElement, callback) {

        var myElement = jQuery(folderElement);
        var $fileList = myElement.find(".files");
        console.log($fileList);
        jQuery(myElement.find(".status")[0]).text('loading...');

        var jqxhr = jQuery.ajax( '<?php echo JRoute::_('index.php?option=com_eventgallery&format=raw&task=sync.processFolder&'.JSession::getFormToken().'=1', false);?>' ,
            {
                data : 'folder=' + myElement.find('input')[0].value + "&foldertype=" + jQuery(myElement.find('input')[0]).attr('data-foldertype'),
                dataType  : 'json'
            })
            .done(function(data, textStatus, jqXHR) {
                var text = "",
                    cssClass = "",
                    responseJSON = jqXHR.responseJSON;

                myElement.addClass('done');
                jQuery(myElement.find(".status")[0]).text('');

                if (responseJSON.status == 'sync') {
                    text = responseJSON.folder + " synced";
                    cssClass = "sync";
                }

                if (responseJSON.status == 'deleted') {
                    text = responseJSON.folder + " deleted";
                    cssClass = "deleted";
                }

                if (responseJSON.status == 'nosync') {
                    text = responseJSON.folder + " not synced";
                    cssClass = "no-sync";
                }


                for(var i=0; i < responseJSON.files.length; i++) {
                    var li = jQuery('<li class="file-todo" data-folder="' + myElement.find('input')[0].value + '" data-file="' + responseJSON.files[i] + '">' + '<span class="icon-picture"></span>' + responseJSON.files[i] + '</li>');
                    $fileList.append(li);
                }

                console.log('Finished getting images to sync for folder ' + myElement.find('input')[0].value + ': ' + responseJSON.files.length);
                myElement.addClass(cssClass);

            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                myElement.addClass('failed');
                jQuery(myElement.find(".status")[0]).text('Sorry, your request failed :('+jqXHR.status+')');
                console.error('Failed getting images to sync for folder ' + myElement.find('input')[0].value);
                console.log(jqXHR, textStatus, errorThrown);
            })
            .always(function() {
                callback();
            });

    }

    function syncFile(fileElement, callback) {

        var myElement = jQuery(fileElement);
        jQuery(myElement.find(".status")[0]).text('loading...');

        console.log("Started to update " + myElement.attr('data-folder')+ "/" + myElement.attr('data-file'));

        var jqxhr = jQuery.ajax( '<?php echo JRoute::_('index.php?option=com_eventgallery&format=raw&task=sync.processfile&'.JSession::getFormToken().'=1', false);?>' ,
            {
                data : 'folder=' + encodeURIComponent(myElement.attr('data-folder')) + '&file=' + encodeURIComponent(myElement.attr('data-file')),
                dataType  : 'json'
            })
            .done(function(data, textStatus, jqXHR) {
                var responseJSON = jqXHR.responseJSON;
                myElement.remove();
                console.log("Finished to syncing file for " + myElement.attr('data-folder')+ "/" + myElement.attr('data-file'));
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                myElement.addClass('file-failed');
                var li = jQuery("<li>Sorry, your request failed :("+jqXHR.status+")</li>");
                jQuery(myElement.after(li));
                console.error("Failed to sync file " + myElement.attr('data-folder')+ "/" + myElement.attr('data-file'));
                console.log(jqXHR, textStatus, errorThrown);
            })
            .always(function() {
               callback();
            });
    }

    function syncFolders() {

        jQuery('.sync-buttons button').attr('disabled', 'disabled');
        jQuery(".controls2 .files li").remove();
        jQuery(".sync").removeClass('sync');
        jQuery(".no-sync").removeClass('no-sync');
        jQuery(".deleted").removeClass('deleted');

        refreshETags = jQuery("#refreshetags").prop("checked");

        var findFilesToSyncQueue = async.queue(function(folderElement, callback) {
            updateProcess(max, max - findFilesToSyncQueue.length() - 1);
            syncFolder(folderElement, callback);
        }, 4);

        // assign a callback
        findFilesToSyncQueue.drain = function() {
            done();
        };

        jQuery(".folder").each(function(index, item){
            if (jQuery(item).find('input')[0].checked) {
                findFilesToSyncQueue.push(item);
            }
        });

        max = findFilesToSyncQueue.length();
    }

    function syncFiles() {

        jQuery('.sync-buttons button').attr('disabled', 'disabled');

        var thumbnailCreateQueue = async.queue(function(fileElement, callback) {
            updateProcess(max, max - thumbnailCreateQueue.length() - 1);
            syncFile(fileElement, callback);
        }, 4);

        // assign a callback
        thumbnailCreateQueue.drain = function() {
            done();
        };

        jQuery(".file-todo").each(function(index, item){
            thumbnailCreateQueue.push(item);
        });

        max = thumbnailCreateQueue.length();
    }

    function updateProcess(max, currentPos) {
        syncProgressElement.setAttribute('max', max);
        console.log(currentPos + " of " + max + " items done.");
        syncProgressElement.setAttribute('value', currentPos);
    }

    function done() {
        if (jQuery("ul.files li").length>0) {
            jQuery(".file-sync-hint").show();
        } else {
            jQuery(".file-sync-hint").hide();
        }
        jQuery('.sync-buttons button').removeAttr('disabled');
        updateProcess(max, max);

    }

    function renderFolderHTMLElement(foldername, foldertype) {
        return '<div class="folder">'
            +'<label class="checkbox">'
            +'<input data-foldertype="' + encodeURI(foldertype) + '" type="checkbox" id="checkbox_' + encodeURI(foldername) + '" name="images" checked="checked" value="' + encodeURI(foldername) + '"> '+ encodeURI(foldername) +''
            +'<div class="status"></div>'
            +'</label>'
            +'<ul class="files"></ul>'
            +'</div>';
    }

    jQuery( document ).on( "click", "button.checkall", function(e) {
        e.preventDefault();
        checkAll('items', true);
    });

    jQuery( document ).on( "click", "button.uncheckall", function(e) {
        e.preventDefault();
        checkAll('items', false);
    });

    jQuery( document ).on( "click", "button.sync-folders", function(e) {
        e.preventDefault();
        syncFolders();
    });

    jQuery( document ).on( "click", "button.sync-files", function(e) {
        e.preventDefault();
        syncFiles();
    });

    /**
     * Load the folders from the server. Include the newly added folders and possible warnings.
     */
    jQuery(document).ready(function() {
        var jqxhr = jQuery.ajax('<?php echo JRoute::_('index.php?option=com_eventgallery&format=raw&task=sync.init&' . JSession::getFormToken() . '=1', false);?>',
            {
                dataType: 'json'
            })
            .done(function (data, textStatus, jqXHR) {
                var $folders = jQuery('#folders'),
                    $addWarnings = jQuery('#warnings');

                data.folders.each(function(foldername) {
                    $folders.append(jQuery(renderFolderHTMLElement(foldername)));
                    console.log(renderFolderHTMLElement(foldername))
                });

                if (data.newfolders.length>0) {
                    jQuery('input[type=checkbox]').prop('checked', false);

                    data.newfolders.each(function(addresult) {
                        if (addresult.error != null) {
                            $addWarnings.append("<p>" + addresult.error + "</p>");
                            $addWarnings.show();
                        }
                        $folders.prepend(jQuery(renderFolderHTMLElement(addresult.foldername, addresult.foldertype)));
                        jQuery('#checkbox_' + addresult.foldername).prop('checked', true);
                        console.log(addresult);
                    });
                }

                jQuery('#loading-folders').hide();
                jQuery('#items').show();
            })
            .fail(function(jqXHR, textStatus, errorThrown){
                console.log(errorThrown);
                jQuery('#loading-folders').html("<stong>" + textStatus + "</strong><br>" + errorThrown);
            });
    });

})(eventgallery.jQuery);


</script>