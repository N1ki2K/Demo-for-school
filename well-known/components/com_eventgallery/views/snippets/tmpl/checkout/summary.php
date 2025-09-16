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

<?php echo $this->loadSnippet('checkout/basic') ?>

<?php echo $this->loadSnippet('checkout/methodinformation') ?>

<?php IF ($this->lineitemcontainer->getBillingAddress() != null):?>
    <div class="review-billing-address">
        <h2><?php echo JText::_('COM_EVENTGALLERY_CART_CHECKOUT_REVIEW_BILLINGADDRESS_HEADLINE') ?></h2>
        <?php $this->set('address',$this->lineitemcontainer->getBillingAddress()); echo $this->loadSnippet('checkout/address') ?>
    </div>
<?php ENDIF ?>

<?php IF ($this->lineitemcontainer->getShippingAddress() != null):?>
    <div class="review-shipping-address">
        <h2><?php echo JText::_('COM_EVENTGALLERY_CART_CHECKOUT_REVIEW_SHIPPINGADDRESS_HEADLINE') ?></h2>
        <?php $this->set('address',$this->lineitemcontainer->getShippingAddress()); echo $this->loadSnippet('checkout/address') ?>
    </div>
<?php ENDIF ?>

<?php IF ($this->lineitemcontainer->getPaymentMethodServiceLineItem() != null):?>
    <div class="review-payment">
        <h2><?php echo JText::_('COM_EVENTGALLERY_CART_CHECKOUT_REVIEW_PAYMENT_HEADLINE') ?></h2>
        <strong><?php echo $this->lineitemcontainer->getPaymentMethodServiceLineItem()->getMethod()->getDisplayName(); ?></strong>
        <p><?php echo $this->lineitemcontainer->getPaymentMethodServiceLineItem()->getMethod()->getMethodReviewContent($this->lineitemcontainer, false);?></p>
        <?php IF (isset($this->edit) && $this->edit == true) :?>
            <br/>
            <a href="<?php echo JRoute::_(
                "index.php?option=com_eventgallery&view=checkout&task=change"
            ) ?>">(<?php echo JText::_('COM_EVENTGALLERY_CART_CHECKOUT_REVIEW_FORM_CHANGE') ?>)</a>
        <?php ENDIF ?>
    </div>
<?php ENDIF ?>

<div class="clearfix"></div>

<?php echo $this->loadSnippet('checkout/lineitems') ?>

<?php echo $this->loadSnippet('checkout/total') ?>
