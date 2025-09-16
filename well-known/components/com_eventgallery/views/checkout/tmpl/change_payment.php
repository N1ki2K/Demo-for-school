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
 * @var EventgalleryLibraryFactoryPaymentmethod $paymentMethodFactory
 */

$paymentMethodFactory = EventgalleryLibraryFactoryPaymentmethod::getInstance();
$methods = $paymentMethodFactory->getMethods(true);
$currentMethod
    = $this->cart->getPaymentMethod() == NULL ? $paymentMethodFactory->getDefaultMethod()
    : $this->cart->getPaymentMethod();


?>

<style>

    .payment-container,
    .shipping-container{
       margin-bottom: 10px;
    }

    .payment-head,
    .shipping-head{
        background-color: #EEE;
        padding: 10px;
    }

    .payment-body,
    .shipping-body {
        border: 1px solid #EEE;
        padding: 10px;
        display: none;
    }

    .payment-body-selected,
    .shipping-body-selected{
        display: block;
    }

</style>

<div class="control-group">
    <label for="paymentid"><?php echo JText::_('COM_EVENTGALLERY_CART_CHECKOUT_FORM_PAYMENTMETHOD_LABEL') ?></label>
    <div class="controls">



            <?php FOREACH ($methods as $method): ?>
                <?php

                /**
                 * @var EventgalleryLibraryMethodsPayment $method
                 */
                $selected = "";
                $cssSelected = "";

                if ($method->getId() == $currentMethod->getId()) {
                    $selected = 'checked = "checked"';
                    $cssSelected = 'payment-body-selected';
                }

                $disabled = "";

                if ($method->isEligible($this->cart)==false ) {
                    continue;
                }

                $paymentBodyContent = $method->getPaymentPageContentBody($this->cart);

                ?>
                <div class="payment-container">
                    <div class="payment-head">
                        <label class="radio">
                            <input  <?php echo $selected; ?> <?php echo $disabled; ?> type="radio" class="" name="paymentid" id="paymentid<?php echo $method->getId(); ?>" value="<?php echo $method->getId(); ?>">
                            <?php echo $method->getPaymentPageContentHead($this->cart); ?>
                            <?php $price = $method->getPrice($this->cart); if ($price->getAmount()>0) { echo "(" . $price . ")"; } ?>
                        </label>
                    </div>
                    <?php IF(strlen($paymentBodyContent)>0): ?>
                        <div class="payment-body <?php echo $cssSelected?>">
                            <?php echo $paymentBodyContent ?>
                        </div>
                    <?php ENDIF;  ?>
                </div>
            <?php ENDFOREACH ?>

    </div>
</div>

<script>

    (function(jQuery) {
        jQuery(function(){

            var $paymentInputFields = jQuery('input[name=paymentid]');

            $paymentInputFields.change(function(e) {
                $paymentInputFields.each(function(index,item){
                    if (item.checked) {
                        jQuery(item).trigger('eventgallery.selected');
                    } else {
                        jQuery(item).trigger('eventgallery.unselected');
                    }
                });

            });

            $paymentInputFields.filter(':checked').trigger('eventgallery.selected');

            $paymentInputFields.click(function(e) {
                $input = jQuery(e.target);
                console.log($input);

                jQuery('.payment-body').slideUp();
                console.log($input.parents('.payment-container'));
                $input.parents('.payment-container').find('.payment-body').slideDown();
            });

            jQuery('input[name=shippingid]').click(function(e) {

                $input = jQuery(e.target);
                console.log($input);

                jQuery('.shipping-body').slideUp();
                console.log($input.parents('.shipping-container'));
                $input.parents('.shipping-container').find('.shipping-body').slideDown();
            });

        });
    })(Eventgallery.jQuery)
</script>



