<?php

/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die('Restricted access');

JHtml::addIncludePath(JPATH_COMPONENT . '/helpers/html');

/**
 * @var EventgalleryLibraryFile $file
 */
$file = $this->file;


?>

<style>
    #modalfileeditform legend {
        display: none;
    }

    #modalfileeditform fieldset>div:nth-of-type(1) {
        display: none;
    }

    #modalfileeditform fieldset>hr:nth-of-type(1) {
        display: none;
    }

</style>

<?php

echo $this->renderMessages();

?>
<form action="<?php echo JRoute::_('index.php?format=raw&option=com_eventgallery&layout=edit&id='.(int) $this->item->id); ?>" method="POST" name="modalfileeditform" id="modalfileeditform">

    <div class="btn-group">
        <input type="submit"
               class="saveFileContent btn btn-success"
               data-task="file.apply"
               data-id="<?php echo $this->item->id; ?>"
               value="<?php echo JText::_('COM_EVENTGALLERY_FILE_SAVE'); ?>">
        <input type="submit"
               class="saveFileContent btn"
               data-task="file.save"
               data-id="<?php echo $this->item->id; ?>"
               value="<?php echo JText::_('COM_EVENTGALLERY_FILE_SAVE_CLOSE'); ?>">
        <input type="submit"
               class="closeFileContent btn"
               data-id="<?php echo $this->item->id; ?>"
               data-href="<?php echo JRoute::_('index.php?option=com_eventgallery&view=file&layout=content&tmpl=component&format=raw&id='.(int) $this->item->id); ?>"
               value="<?php echo JText::_('COM_EVENTGALLERY_FILE_CLOSE'); ?>">
    </div>
    <input type="hidden" name="tmpl" value="component">


    <div id="j-main-container">
        <?php echo $this->loadSnippet('formfields'); ?>
    </div>

    <?php echo JHtml::_('form.token'); ?>
    <input type="hidden" name="option" value="com_eventgallery" />
    <input type="hidden" name="folderid" value="<?php echo $this->file->getFolder()->getId(); ?>" />
    <input type="hidden" name="id" value="<?php echo $this->file->getId(); ?>" />
    <input type="hidden" name="task" value="file.apply" />
</form>
