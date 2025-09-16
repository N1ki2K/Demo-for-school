<?php

/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die('Restricted access');
JHtml::_('behavior.modal', 'button.modal-button');
?>

<div id="j-main-container">

    <p>

    <?php echo JText::_( 'COM_EVENTGALLERY_PICASASYNC_DESC' ); ?>

     </p>

    <form id="upload" action="<?php echo JRoute::_("index.php?option=com_eventgallery&task=picasasync.sync",false); ?>" method="POST" enctype="multipart/form-data">
        <fieldset>

            <div>
                <label for="username"><?php echo JText::_( 'COM_EVENTGALLERY_PICASASYNC_USERNAME_LABEL' ); ?>:</label>
                <input type="text" id="foldertype-1-user" name="username" />
            </div>
            <div>
                <button class="btn modal-button" title="Event Gallery" href="//static.svenbluege.de/picasa/v1.2/index.html" rel="{handler: 'iframe', size: function() { return {x: window.innerWidth-60, y: window.innerHeight-60}}() }"><?php echo JText::_( 'COM_EVENTGALLERY_PICASASYNC_SELECT_USER_BUTTON_LABEL' ); ?></button>
            </div>
            <hr>
            <p class="well"><?php echo JText::_( 'COM_EVENTGALLERY_PICASASYNC_WARNING' ); ?></p>
            <div id="submitbutton">
                <button class="btn btn-danger" type="submit"><?php echo JText::_( 'COM_EVENTGALLERY_PICASASYNC_SYNCBUTTON_LABEL' ); ?></button>
            </div>
        </fieldset>
    </form>

        <ul id="progress" class="thumbnails"></ul>


    <form action="<?php echo JRoute::_('index.php'); ?>" method="post" name="adminForm" id="adminForm">

        <input type="hidden" name="option" value="com_eventgallery" />
        <input type="hidden" name="task" value="" />
        <input type="hidden" name="task" value="" />
        <?php echo JHtml::_('form.token'); ?>

    </form>
</div>
