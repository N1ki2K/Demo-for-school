<?php

/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

// no direct access
defined('_JEXEC') or die('Restricted access');

$app = JFactory::getApplication();

?>
<?php IF ($this->file->isCommentingAllowed() && $this->use_comments == 1): ?>
    <div class="commentform" id="commentform" style="visibility: hidden;">

        <h1><?php echo JText::_('COM_EVENTGALLERY_SINGLEIMAGE_COMMENT_NEW') ?></h1>

        <div class="error">
            <?php
            foreach ($this->getErrors() as $error) {
                echo $error . '<br>';
            }
            ?>
        </div>


        <form method="post"
              action="<?php echo JRoute::_("index.php?option=com_eventgallery&task=save_comment&view=singleimage") ?>">

            <fieldset class="comment-fieldset">
                <?php foreach ($this->commentform->getFieldset() as $field): ?>
                    <div class="control-group">
                        <?php if (!$field->hidden): ?>
                            <?php echo $field->label; ?>
                        <?php endif; ?>
                        <div class="controls">
                            <?php echo $field->input; ?>
                        </div>
                    </div>
                <?php endforeach; ?>
            </fieldset>
            <fieldset>
                    <div class="form-actions">
                        <input type="submit" name="submit" class="validate btn" value="<?php echo JText::_('COM_EVENTGALLERY_SINGLEIMAGE_COMMENT_FORM_SAVE') ?>">
                    </div>
            </fieldset>
            <input type="hidden" name="folder" value="<?php echo $app->input->getString('folder') ?>">
            <input type="hidden" name="file" value="<?php echo $app->input->getString('file') ?>">
            <?php echo JHtml::_('form.token'); ?>
        </form>

    </div>
<?php ENDIF ?>