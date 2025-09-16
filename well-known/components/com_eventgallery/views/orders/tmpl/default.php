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

<div class="eventgallery-orders">
    <h1><?php echo JText::_('COM_EVENTGALLERY_ORDERS_HEADLINE')?></h1>
    <p>
        <?php echo JText::_('COM_EVENTGALLERY_ORDERS_DESCRIPTION')?>
    </p>
    <table class="table">
        <thead>
            <tr>
                <th><?php echo JText::_('COM_EVENTGALLERY_ORDERS_NUMBER')?></th>
                <th><?php echo JText::_('COM_EVENTGALLERY_ORDERS_ITEMS')?></th>
                <th><?php echo JText::_('COM_EVENTGALLERY_ORDERS_TOTAL')?></th>
                <th><?php echo JText::_('COM_EVENTGALLERY_ORDERS_STATUS')?></th>
            </tr>
        </thead>
        <tbody>
        <?php /**@var EventgalleryLibraryOrder $item*/FOREACH($this->items as $item):?>
            <tr>
                <td><a href="<?php echo JRoute::_('index.php?option=com_eventgallery&view=order&id='.$item->getId())?>"><?php echo $item->getDocumentNumber(); ?></a><br></td>
                <td><a href="<?php echo JRoute::_('index.php?option=com_eventgallery&view=order&id='.$item->getId())?>"><?php echo JText::sprintf('COM_EVENTGALLERY_ORDERS_ITEMSPERORDER', $item->getLineItemsTotalCount(), $item->getLineItemsCount())?></a></td>
                <td><?php echo $item->getTotal()?></td>
                <td><?php echo $item->getOrderStatus()->getDisplayName()?></td>
            </tr>

        <?php ENDFOREACH; ?>
        </tbody>
    </table>
</div>