<?php 

/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die('Restricted access');

jimport( 'joomla.form.form' );
JForm::addFormPath(JPATH_COMPONENT . '/models/forms');
JForm::addFieldPath(JPATH_COMPONENT . '/models/fields');
$this->form = JForm::getInstance('com_eventgallery.filesorting','filesorting');

?>

<div class="modal hide fade" id="collapseModalSorting">
    <div class="modal-body">
    <?php echo $this->loadSnippet('formfields'); ?>
    </div>
    <div class="modal-footer">
        <button class="btn" type="button" data-dismiss="modal">
            <?php echo JText::_('JCANCEL'); ?>
        </button>
        <button class="btn btn-primary" type="submit" onclick="Joomla.submitbutton('files.sort');">
            <?php echo JText::_('COM_EVENTGALLERY_FILE_SORTING_APPLY'); ?>
        </button>
    </div>
</div>