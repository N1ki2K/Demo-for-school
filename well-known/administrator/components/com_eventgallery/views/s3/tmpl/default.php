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
    <?php echo JText::_('COM_EVENTGALLERY_S3_START2_DESC'); ?>
    <br><br>
    <label class="checkbox">
        <input id="refreshetags" type="checkbox" checked="checked">  <?php echo JText::_('COM_EVENTGALLERY_S3_REFRESHETAGS_DESC'); ?>
    </label>

</p>

<form class="form-horizontal" name="items">

    <div class="control-group">
        <div class="controls2">
            <div class="input-append btn-group sync-buttons">
                <button class="btn checkall"><?php echo JText::_('COM_EVENTGALLERY_SYNC_CHECK_ALL');?></button>
                <button class="btn uncheckall" ><?php echo JText::_('COM_EVENTGALLERY_SYNC_CHECK_NONE');?></button>
                <button class="btn btn-primary start"><?php echo JText::_('COM_EVENTGALLERY_S3_GETMISSINGTHUMBNAILS');?></button>
                <button disabled="disabled" class="btn btn-danger create"><?php echo JText::_('COM_EVENTGALLERY_S3_START_THUMBNAILCREATION');?></button>
            </div>
        </div>
    </div>
    <progress id="syncprogress" value="0" max="100"></progress>

    <div class="control-group">
        <div class="controls2">
            <?php FOREACH ($this->folders as $foldername):?>
                <label class="checkbox folder">
                    <input type="checkbox" name="images" checked="checked" value="<?php echo htmlentities($foldername, ENT_QUOTES, "UTF-8");  ?>"> <?php echo $foldername;  ?>
                    <div class="status"></div>
                </label>
            <?php ENDFOREACH; ?>
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
        display:block;
        height: 20px;
        margin: 20px 0;
        width: 100%;
    }

    .eventgallery-folder {
        float: left;
        margin: 10px;
        padding: 10px;
        border: 1px solid #DDD;
        -webkit-box-shadow: 1px 1px 1px rgba(50, 50, 50, 0.75);
        -moz-box-shadow:    1px 1px 1px rgba(50, 50, 50, 0.75);
        box-shadow:         1px 1px 1px rgba(50, 50, 50, 0.75);

        box-sizing:border-box;
        -moz-box-sizing:border-box; /* Firefox */
    }

    .done {
        -webkit-box-shadow: 0 0 0 rgba(50, 50, 50, 0.75);
        -moz-box-shadow:    0 0 0 rgba(50, 50, 50, 0.75);
        box-shadow:         0 0 0 rgba(50, 50, 50, 0.75);
    }

    .sync {
        background-color: darkseagreen;
    }

    .no-sync {
        background-color: lightblue;
    }

    .deleted {
        background-color: lightsalmon;
    }

    .file-todo {
        display: inline-block;
        padding: 5px;
    }

    .file-done {
        background-color: lightgreen;
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

        var max, refreshETags, syncProgressElement;

        max = 0;
        refreshETags = true;
        syncProgressElement = document.getElementById('syncprogress');

        function syncFolder(folderElement, callback) {

            var myElement = jQuery(folderElement);

            jQuery(myElement.children(".status")[0]).text('loading...');
            console.log('Started to get missing thumbnails for folder ' + myElement.children('input')[0].value);
            var jqxhr = jQuery.ajax( '<?php echo JRoute::_('index.php?option=com_eventgallery&format=raw&task=s3.processfolder&'.JSession::getFormToken().'=1', false);?>' ,
                {
                    data : 'folder=' + myElement.children('input')[0].value + "&refreshetags=" + refreshETags,
                    dataType  : 'json'
                })
                .done(function(data, textStatus, jqXHR) {
                    var text = "",
                        cssClass = "",
                        responseJSON = jqXHR.responseJSON;

                    myElement.addClass('done');
                    jQuery(myElement.children(".status")[0]).text('');

                    for(var i=0; i < responseJSON.length; i++) {
                        var li = jQuery('<li class="file-todo" data-folder="' + myElement.children('input')[0].value + '" data-file="' + responseJSON[i] + '">' + responseJSON[i] + '</li>');
                        myElement.after(li);
                    }

                    myElement.addClass(cssClass);

                    console.log('Finished getting missing thumbnails for folder ' + myElement.children('input')[0].value);
                })
                .fail(function(jqXHR, textStatus, errorThrown) {
                    myElement.addClass('failed');
                    console.log('Failed to get missing thumbnails for folder ' + myElement.children('input')[0].value + ".");
                    jQuery(myElement.children(".status")[0]).text('Sorry, your request failed :('+jqXHR.status+')');
                    console.error(jqXHR, textStatus, errorThrown);
                })
                .always(function() {
                    callback();
                });

        }

        function start() {

            jQuery('.sync-buttons button').attr('disabled', 'disabled');
            jQuery(".controls2 li").remove();

            refreshETags = jQuery("#refreshetags").prop("checked");

            var findMissingThumbnailsQueue = async.queue(function(folderElement, callback) {
                updateProcess(max, max - findMissingThumbnailsQueue.length() - 1);
                syncFolder(folderElement, callback);
            }, 4);

            // assign a callback
            findMissingThumbnailsQueue.drain = function() {
                done();
            };

            jQuery(".folder").each(function(index, item){
                if (jQuery(item).children('input')[0].checked) {
                    findMissingThumbnailsQueue.push(item);
                }
            });

            max = findMissingThumbnailsQueue.length();
        }

        function createThumbnails(fileElement, callback) {


            var myElement = jQuery(fileElement);
            jQuery(myElement.children(".status")[0]).text('loading...');

            console.log("Started to create thumbnails for " + myElement.attr('data-folder')+ "/" + myElement.attr('data-file'));

            var jqxhr = jQuery.ajax( '<?php echo JRoute::_('index.php?option=com_eventgallery&format=raw&task=s3.processfile&'.JSession::getFormToken().'=1', false);?>' ,
                {
                    data : 'folder=' + encodeURIComponent(myElement.attr('data-folder')) + '&file=' + encodeURIComponent(myElement.attr('data-file')),
                    dataType  : 'json'
                })
                .done(function(data, textStatus, jqXHR) {
                    var responseJSON = jqXHR.responseJSON;
                    myElement.remove();
                    console.log("Finished to create thumbnails for " + myElement.attr('data-folder')+ "/" + myElement.attr('data-file'));
                })
                .fail(function(jqXHR, textStatus, errorThrown) {
                    myElement.addClass('file-failed');
                    var li = jQuery("<li>Sorry, your request failed :("+jqXHR.status+")</li>");
                    jQuery(myElement.after(li));
                    console.error("Failed to create thumbnails for " + myElement.attr('data-folder')+ "/" + myElement.attr('data-file'));
                    console.log(jqXHR, textStatus, errorThrown);
                })
                .always(function() {
                   callback();
                });

        }

        function create() {

            jQuery('.sync-buttons button').attr('disabled', 'disabled');

            var thumbnailCreateQueue = async.queue(function(fileElement, callback) {
                updateProcess(max, max - thumbnailCreateQueue.length() - 1);
                createThumbnails(fileElement, callback);
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
            jQuery('.sync-buttons button').removeAttr('disabled');
            updateProcess(max, max);
        }

        jQuery( document ).on( "click", "button.checkall", function(e) {
            e.preventDefault();
            checkAll('items', true);
        });

        jQuery( document ).on( "click", "button.uncheckall", function(e) {
            e.preventDefault();
            checkAll('items', false);
        });

        jQuery( document ).on( "click", "button.start", function(e) {
            e.preventDefault();
            start();
        });

        jQuery( document ).on( "click", "button.create", function(e) {
            e.preventDefault();
            create();
        });

    })(eventgallery.jQuery);


</script>