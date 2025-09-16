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

<h1>
    <?php echo JText::_('COM_EVENTGALLERY_IMPEX_LABEL'); ?>
</h1>
<p><?php echo JText::_('COM_EVENTGALLERY_IMPEX_DESC'); ?></p>

<form action="<?php echo JRoute::_('index.php'); ?>" method="post" name="adminForm" id="adminForm">

	<input type="hidden" name="option" value="com_eventgallery" />
	<input type="hidden" name="task" value="impex.export" />

	<fieldset>  
		<legend><?php echo JText::_('COM_EVENTGALLERY_IMPEX_EXPORT_LABEL'); ?></legend>	

		<div class="control-group">
			<div class="controls">			
				<button type="submit"><?php echo JText::_( 'COM_EVENTGALLERY_IMPEX_EXPORT_START' ); ?></button>  
			</div>
		</div>

	</fieldset>  
	<?php echo JHtml::_('form.token'); ?>
</form>

<form action="<?php echo JRoute::_('index.php'); ?>" method="post" name="adminFormImport" id="adminFormImport" enctype="multipart/form-data">

	<input type="hidden" name="option" value="com_eventgallery" />
	<input type="hidden" name="task" value="impex.import" />

	<fieldset>  
		<legend><?php echo JText::_('COM_EVENTGALLERY_IMPEX_IMPORT_LABEL'); ?></legend>	

		<div class="control-group">
			<label class="control-label" for="importfile"><?php echo JText::_( 'COM_EVENTGALLERY_IMPEX_FILE_TO_UPLOAD_LABEL' ); ?></label>
			<div class="controls">
				<input type="file" name="importfile" id="importfile">
			</div>
		</div>

		<div class="control-group">
			<div class="controls">
			<label class="checkbox">
                <input type="checkbox" name="dryrun" value="true" checked="checked"><?php echo JText::_('COM_EVENTGALLERY_IMPEX_IMPORT_DRYRUN'); ?>
			</label>

			<button type="submit" name="task" value="impex.import"><?php echo JText::_( 'COM_EVENTGALLERY_IMPEX_IMPORT_START' ); ?></button>  
			</div>
		</div>

	</fieldset>  

	<?php echo JHtml::_('form.token'); ?>
</form>
