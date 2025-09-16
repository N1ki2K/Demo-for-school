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
 * @var EventgalleryLibraryManagerOrder $orderMgr
 * @var EventgalleryLibraryOrder $order
 */
$orderMgr = EventgalleryLibraryManagerOrder::getInstance();
$orders = $orderMgr->getOrders();

$order = null;
foreach($orders as $myorder) {
    $order = $myorder;
    break;
}

if ($order == null) {
    return;
}

?>

<div class="eventgallery-checkout eventgallery-confirm-page">

	<h1><?php echo JText::_('COM_EVENTGALLERY_CART_CHECKOUT_CONFIRM_HEADLINE') ?></h1>
    <h2> <?php echo JText::sprintf('COM_EVENTGALLERY_CART_CHECKOUT_CONFIRM_SUCCESS_MESSAGE', $order->getDocumentNumber(), $order->getEMail() ) ?></h2>

    <?php $this->set('edit',false); $this->set('lineitemcontainer', $order); echo $this->loadSnippet('order/summary') ?>
	<div class="clearfix"></div>
</div>


<?php echo $this->loadSnippet('footer_disclaimer'); ?>
