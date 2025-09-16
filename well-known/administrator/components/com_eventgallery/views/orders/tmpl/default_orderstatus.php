<?php 

/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die('Restricted access');

$item = $this->item;

?>

<div class="ordercontent">
    <?php echo JText::_('COM_EVENTGALLERY_ORDERSTATUS_TYPE_ORDER'); ?>:
    <strong><?php if ($item->getOrderStatus()) echo $item->getOrderStatus()->getDisplayName() ?></strong><br>
    <?php echo JText::_('COM_EVENTGALLERY_ORDERSTATUS_TYPE_PAYMENT'); ?>:
    <strong><?php if ($item->getPaymentStatus()) echo $item->getPaymentStatus()->getDisplayName() ?></strong><br>
    <?php echo JText::_('COM_EVENTGALLERY_ORDERSTATUS_TYPE_SHIPPING'); ?>:
    <strong><?php if ($item->getShippingStatus()) echo $item->getShippingStatus()->getDisplayName() ?></strong><br>
    <small><?php echo $item->getCreationDate(); ?></small>
</div>

