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
<div class="eventgallery-order">
    <div class="btn-toolbar">
        <a class="btn back-to-list" href="<?php echo JRoute::_('index.php?option=com_eventgallery&view=orders')?>"><?php echo JText::_('COM_EVENTGALLERY_ORDER_BACK')?></a>
    </div>
    <div class="eventgallery-checkout">
        <legend><?php echo JText::_('COM_EVENTGALLERY_ORDER_LABEL') ?></legend>
        <div>
            <?php $this->set('lineitemcontainer', $this->item); echo $this->loadSnippet('order/status') ?>
        </div>
        <hr>
        <?php $this->set('lineitemcontainer', $this->item); echo $this->loadSnippet('order/summary') ?>
        <div class="clearfix"></div>
    </div>
    <div class="btn-toolbar">
    <a class="btn back-to-list" href="<?php echo JRoute::_('index.php?option=com_eventgallery&view=orders')?>"><?php echo JText::_('COM_EVENTGALLERY_ORDER_BACK')?></a>
    </div>
</div>