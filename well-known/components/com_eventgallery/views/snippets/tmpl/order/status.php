<?php // no direct access

/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die('Restricted access');

/**
 * @var EventgalleryLibraryOrder $order
 */
$order = $this->lineitemcontainer;

?>

<dl class="dl-horizontal">
    <dt><?php echo JText::_('COM_EVENTGALLERY_ORDER_ID') ?></dt>
    <dd><?php echo $order->getDocumentNumber(); ?></dd>
    <dt><?php echo JText::_('COM_EVENTGALLERY_ORDER_CREATED') ?></dt>
    <dd><?php echo $order->getCreationDate(); ?></dd>
    <dt><?php echo JText::_('COM_EVENTGALLERY_ORDER_STATUS_ORDER') ?></dt>
    <dd><?php echo $order->getOrderStatus() ? $order->getOrderStatus()->getDisplayName() :'n/a'?></dd>
    <dt><?php echo JText::_('COM_EVENTGALLERY_ORDER_STATUS_PAYMENT') ?></dt>
    <dd><?php echo $order->getPaymentStatus() ? $order->getPaymentStatus()->getDisplayName() : 'n/a'; ?></dd>
    <dt><?php echo JText::_('COM_EVENTGALLERY_ORDER_STATUS_SHIPPING') ?></dt>
    <dd><?php echo $order->getShippingStatus() ? $order->getShippingStatus()->getDisplayName() : 'n/a'; ?></dd>
</dl>
