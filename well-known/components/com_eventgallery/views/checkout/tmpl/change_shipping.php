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
 * @var EventgalleryLibraryFactoryShippingmethod $shippingMethodFactory
 */

$shippingMethodFactory = EventgalleryLibraryFactoryShippingmethod::getInstance();

$methods = $shippingMethodFactory->getMethods(true);
$currentMethod
    = $this->cart->getShippingMethod() == NULL ? $shippingMethodFactory->getDefaultMethod()
    : $this->cart->getShippingMethod();
?>

<div class="control-group">
    <label for="shippingid"><?php echo JText::_('COM_EVENTGALLERY_CART_CHECKOUT_FORM_SHIPPINGMETHOD_LABEL') ?></label>
    <div class="controls">

        <?php FOREACH ($methods as $method): ?>


        <?php

        /**
        * @var EventgalleryLibraryMethodsShipping $method
        */
        $selected = "";
        $cssSelected = "";

        if ($method->getId() == $currentMethod->getId()) {
            $selected = 'checked = "checked"';
            $cssSelected = 'shipping-body-selected';
        }

        $disabled = "";

        if ($method->isEligible($this->cart)==false ) {
            continue;
        }

        $shippingBodyContent = $method->getDescription();

        ?>
        <div class="shipping-container">
            <div class="shipping-head">
                <label class="radio">
                    <input  <?php echo $selected; ?> <?php echo $disabled; ?> type="radio" class="" id="shippingid<?php echo $method->getId(); ?>" name="shippingid" value="<?php echo $method->getId(); ?>" data-needs-address-data="<?php echo $method->needsAddressData()?'true':'false'?>">
                    <?php echo $method->getDisplayName(); ?>
                    <?php $price = $method->getPrice($this->cart); if ($price->getAmount()>0) { echo "(" . $price . ")"; } ?>
                </label>
            </div>
            <?php IF(strlen($shippingBodyContent)>0): ?>
                <div class="shipping-body <?php echo $cssSelected?>">
                    <?php echo $shippingBodyContent ?>
                </div>
            <?php ENDIF; ?>
        </div>

        <?php ENDFOREACH ?>
    </div>
</div>

