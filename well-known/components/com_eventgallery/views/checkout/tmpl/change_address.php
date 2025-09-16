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

<div class="eventgallery-checkout-address">

    <fieldset class="userdata-fieldset">
        <?php foreach ($this->userdataform->getFieldset() as $field): ?>
            <div class="control-group">
                <?php if (!$field->hidden): ?>
                    <?php echo $field->label; ?>
                <?php endif; ?>
                <div class="controls">
                    <?php echo $field->input; ?>
                </div>
            </div>
        <?php endforeach; ?>
    </fieldset>
    <hr>


    <div id="address-input-area">
        <fieldset class="billing-address-fieldset">
            <?php foreach ($this->billingform->getFieldset() as $field): ?>
                <div class="control-group">
                    <?php if (!$field->hidden): ?>
                        <?php echo $field->label; ?>
                    <?php endif; ?>
                    <div class="controls">
                        <?php echo $field->input; ?>
                    </div>
                </div>
            <?php endforeach; ?>
        </fieldset>

        <hr>

        <fieldset class="ship-to_different-address-fieldset">
            <div class="control-group">
                <?php echo JText::_('COM_EVENTGALLERY_CART_CHECKOUT_FORM_SHIPTODIFFERENTADDRESS') ?>
                <?php
                $checkF = '';
                $checkT = '';
                if ($this->cart->getShippingAddress() == NULL
                    || $this->cart->getBillingAddress() == NULL
                    || $this->cart->getShippingAddress()->getId() == $this->cart->getBillingAddress()->getId()
                ) {
                    $checkF = ' checked="checked" ';
                } else {
                    $checkT = ' checked="checked" ';
                }
                ?>
                <div class="controls">
                    <?php echo JText::_('COM_EVENTGALLERY_CART_CHECKOUT_FORM_SHIPTODIFFERENTADDRESS_FALSE') ?>
                    <input title="<?php echo JText::_('COM_EVENTGALLERY_CART_CHECKOUT_FORM_SHIPTODIFFERENTADDRESS_FALSE')?>" autocomplete="off" type="radio" id="shiptodifferentaddress-false" name="shiptodifferentaddress"
                           value="false" <?php echo $checkF; ?>>
                    <?php echo JText::_('COM_EVENTGALLERY_CART_CHECKOUT_FORM_SHIPTODIFFERENTADDRESS_TRUE') ?>
                    <input title="<?php echo JText::_('COM_EVENTGALLERY_CART_CHECKOUT_FORM_SHIPTODIFFERENTADDRESS_TRUE')?>" autocomplete="off" type="radio" id="shiptodifferentaddress-true" class="shiptodifferentaddress"
                           name="shiptodifferentaddress" value="true" <?php echo $checkT; ?>>
                </div>
            </div>
        </fieldset>
        <hr>

        <fieldset class="shipping-address-fieldset">
            <?php foreach ($this->shippingform->getFieldset() as $field): ?>
                <div class="control-group">
                    <?php if (!$field->hidden): ?>
                        <?php echo $field->label; ?>
                    <?php endif; ?>
                    <div class="controls">
                        <?php echo $field->input; ?>
                    </div>
                </div>
            <?php endforeach; ?>
        </fieldset>
    </div>

</div>


<script type="text/javascript">
(function(jQuery){

    jQuery( document ).ready(function() {
        /**
        * fixes HTML5Fallback issue where the disabled property was not set in the right way
        */
        function refreshShippingAddressFields() {
            jQuery('.billing-address').each(function()  {
                this.isRequired = !!(jQuery(this).attr("required"));
                this.isDisabled = !!(jQuery(this).attr("disabled"));
                console.log(this);
            });

            jQuery('.shipping-address').each(function()  {
                this.isRequired = !!(jQuery(this).attr("required"));
                this.isDisabled = !!(jQuery(this).attr("disabled"));
            });
        }

        function disableRequiredForShipping() {
            jQuery('.shipping-address').attr('disabled', 'disabled');       
            jQuery('.shipping-address-fieldset .is-required').removeClass('required');
            jQuery('.shipping-address-fieldset').hide();

            refreshShippingAddressFields();            
        }

        function enableReqiredForShipping() {
            jQuery('.shipping-address').removeAttr('disabled');
            jQuery('.shipping-address-fieldset .is-required').addClass('required');
            jQuery('.shipping-address-fieldset').show();
            refreshShippingAddressFields();

        }

        function handleAddressFormVisibility(element) {

            if (element.dataset.needsAddressData === 'false') {
                hideAddressForms();
            } else {
                showAddressForms();
            }
            refreshShippingAddressFields();
        }

        function hideAddressForms() {
            jQuery('.billing-address-fieldset .is-required').removeClass('required');
            jQuery('.billing-address').attr('disabled', 'disabled');
            handleShippingAddressRequiredField();
            jQuery('#address-input-area').hide();

        }

        function showAddressForms() {
            jQuery('.billing-address-fieldset .is-required').addClass('required');
            jQuery('.billing-address').removeAttr('disabled');
            handleShippingAddressRequiredField();
            jQuery('#address-input-area').show();
        }

        function handleShippingAddressRequiredField() {
            if (jQuery('#shiptodifferentaddress-false').is(':checked')) {
                disableRequiredForShipping();
            } else {
                enableReqiredForShipping();
            }
        }

        jQuery('#shiptodifferentaddress-false').click(disableRequiredForShipping);
        jQuery('#shiptodifferentaddress-true').click(enableReqiredForShipping);

        jQuery('input[name=shippingid]').click(function() {
            handleAddressFormVisibility(this);
        });


        /*
        * Init the form state
         */

        // save the required state for restoring it if necessary
        jQuery('.billing-address-fieldset .required').addClass('is-required');
        jQuery('.shipping-address-fieldset .required').addClass('is-required');

        handleShippingAddressRequiredField();

        var checkedShippingElements = jQuery('input[name=shippingid][checked=checked]');
        if (checkedShippingElements.length>0) {
            handleAddressFormVisibility(checkedShippingElements[0]);
        }



    });

})(eventgallery.jQuery);
</script>