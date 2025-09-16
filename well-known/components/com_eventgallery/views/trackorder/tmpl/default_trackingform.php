<?php // no direct access

/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die('Restricted access');


?>

<legend><?php echo JText::_('COM_EVENTGALLERY_TRACKORDER_FORM_LABEL');?></legend>
<form action="<?php echo JRoute::_('index.php?option=com_eventgallery&view=trackorder&task=order'); ?>" method="GET" class="form-vertical">
    <input type="hidden" name="task" value="order">
    <fieldset class="well">
        <div class="desc">
            <small><?php echo JText::_('COM_EVENTGALLERY_TRACKORDER_FORM_DESC');?></small>
        </div>
        <?php foreach ($this->form->getFieldset('credentials') as $field) : ?>
            <?php if (!$field->hidden) : ?>
                <div class="control-group">
                    <div class="control-label">
                        <?php echo $field->label; ?>
                    </div>
                    <div class="controls">
                        <?php echo $field->input; ?>
                    </div>
                </div>
            <?php endif; ?>
        <?php endforeach; ?>

        <div class="control-group">
            <div class="controls">
            <input class="btn btn-primary" type="submit" name="submit"
                   value="<?php echo JText::_('COM_EVENTGALLERY_TRACKORDER_FORM_SUBMIT_LABEL') ?>">
            </div>
        </div>
    </fieldset>
    <?php //echo JHtml::_('form.token'); ?>
</form>