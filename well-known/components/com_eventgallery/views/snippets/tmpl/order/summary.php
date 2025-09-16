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
 * @var EventgalleryLibraryLineitemcontainer $lineitemcontainer
 */
$lineitemcontainer = $this->lineitemcontainer;

?>

<?php echo $this->loadSnippet('checkout/basic') ?>

<?php echo $this->loadSnippet('order/methodinformation') ?>

<?php IF ($lineitemcontainer->getBillingAddress() != null):?>
    <div class="review-billing-address">
        <h2><?php echo JText::_('COM_EVENTGALLERY_CART_CHECKOUT_REVIEW_BILLINGADDRESS_HEADLINE') ?></h2>
        <?php $this->set('address',$lineitemcontainer->getBillingAddress()); echo $this->loadSnippet('checkout/address') ?>
    </div>
<?php ENDIF ?>

<?php IF ($lineitemcontainer->getShippingAddress() != null):?>
    <div class="review-shipping-address">
        <h2><?php echo JText::_('COM_EVENTGALLERY_CART_CHECKOUT_REVIEW_SHIPPINGADDRESS_HEADLINE') ?></h2>
        <?php $this->set('address',$lineitemcontainer->getShippingAddress()); echo $this->loadSnippet('checkout/address') ?>
    </div>
<?php ENDIF ?>

<?php IF ($this->lineitemcontainer->getPaymentMethodServiceLineItem() != null):?>
    <div class="review-payment">
        <h2><?php echo JText::_('COM_EVENTGALLERY_CART_CHECKOUT_REVIEW_PAYMENT_HEADLINE') ?></h2>
        <strong><?php echo $this->lineitemcontainer->getPaymentMethodServiceLineItem()->getMethod()->getDisplayName(); ?></strong>
        <p><?php echo $this->lineitemcontainer->getPaymentMethodServiceLineItem()->getMethod()->getMethodConfirmContent($this->lineitemcontainer, false);?></p>
    </div>
<?php ENDIF ?>

<div style="clear:both"></div>

<?php echo $this->loadSnippet('order/lineitems') ?>

<?php echo $this->loadSnippet('order/total') ?>

