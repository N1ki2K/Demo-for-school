<?php 

/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */


defined('_JEXEC') or die;

$published = $this->state->get('filter.published');
?>
<div class="modal hide fade" id="collapseModal">
	<div class="modal-header">
		<button type="button" class="close" data-dismiss="modal">&#215;</button>
		<h3><?php echo JText::_('COM_EVENTGALLERY_BATCH_OPTIONS');?></h3>
	</div>
	<div class="modal-body">
        <p><?php echo JText::_('COM_EVENTGALLERY_BATCH_TIP'); ?></p>
        <div class="row-fluid">
            <div class="control-group span6">
                <div class="controls">
                    <?php echo JHtml::_('EventgalleryBatch.watermark'); ?>
                </div>
            </div>
            <div class="control-group span5">
                <div class="controls">
                    <?php echo JHtml::_('EventgalleryBatch.imagetypeset'); ?>
                </div>
            </div>
        </div>
        <div class="row-fluid">
            <div class="control-group span6">
                <div class="controls">
                    <?php echo JHtml::_('EventgalleryBatch.usergroup'); ?>
                </div>
            </div>
            <div class="control-group span5">
                <div class="controls">
                    <?php echo JHtml::_('EventgalleryBatch.password'); ?>
                </div>
            </div>
        </div>
        <div class="row-fluid">
            <div class="control-group span6">
                <div class="controls">
                    <?php echo JHtml::_('EventgalleryBatch.tags'); ?>
                </div>
            </div>
            <?php if ($published >= 0) : ?>
            <div class="control-group span5">
                <div class="controls">
                    <?php echo JHtml::_('EventgalleryBatch.categories'); ?>
                </div>
            </div>
            <?php endif; ?>
        </div>
	</div>
	<div class="modal-footer">
		<button class="btn" type="button" onclick="document.id('batch-category-id').value='';document.id('batch-access').value='';document.id('batch-language-id').value='';document.id('batch-user-id').value='';document.id('batch-tag-id)').value=''" data-dismiss="modal">
			<?php echo JText::_('JCANCEL'); ?>
		</button>
		<button class="btn btn-primary" type="submit" onclick="Joomla.submitbutton('event.batch');">
			<?php echo JText::_('JGLOBAL_BATCH_PROCESS'); ?>
		</button>
	</div>
</div>
