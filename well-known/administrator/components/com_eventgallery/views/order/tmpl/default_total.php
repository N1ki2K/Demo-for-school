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

<style type="text/css">
    .order-summary span.name {
        display: inline-block;
        width: 100px;
    }
</style>

<div class="order-summary">
    <div class="subtotal">
        <strong>
             <span class="name"><?php echo JText::_('COM_EVENTGALLERY_ORDER_SUBTOTAL') ?>	</span>
            <?php $this->lineitemcontainer->getSubTotal(); ?>
        </strong>
    </div>
    <?php IF ($this->lineitemcontainer->getSurchargeServiceLineItem() != NULL): ?>
        <div class="surcharge">
            <span class="name"><?php echo $this->lineitemcontainer->getSurchargeServiceLineItem()->getDisplayName(); ?>	</span>
            <?php echo $this->lineitemcontainer->getSurchargeServiceLineItem()->getPrice(); ?>		
        </div>
    <?php ENDIF ?>
    <?php IF ($this->lineitemcontainer->getShippingMethodServiceLineItem() != NULL): ?>
        <div class="surcharge">
             <span class="name"><?php echo $this->lineitemcontainer->getShippingMethodServiceLineItem()->getDisplayName(); ?></span>
            <?php echo $this->lineitemcontainer->getShippingMethodServiceLineItem()->getPrice(); ?>
        </div>
    <?php ENDIF ?>
    <?php IF ($this->lineitemcontainer->getPaymentMethodServiceLineItem() != NULL): ?>
         <div class="surcharge">
             <span class="name"><?php echo $this->lineitemcontainer->getPaymentMethodServiceLineItem()->getDisplayName(); ?></span>
            <?php echo $this->lineitemcontainer->getPaymentMethodServiceLineItem()->getPrice(); ?>
		
        </div>
    <?php ENDIF ?>
    <div class="total">
        <strong>
             <span class="name"><?php echo JText::_('COM_EVENTGALLERY_ORDER_TOTAL') ?> </span>
            <?php echo $this->lineitemcontainer->getTotal(); ?>
		</strong><br />
        <small>
			<?php echo JText::sprintf('COM_EVENTGALLERY_ORDER_VAT_HINT_WITH_PLACEHOLDER', $this->lineitemcontainer->getTax()) ?>
		</small>
    </div>
    
</div>