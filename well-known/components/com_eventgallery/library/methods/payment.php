<?php

/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

// Check to ensure this file is included in Joomla!
defined('_JEXEC') or die();

abstract class EventgalleryLibraryMethodsPayment extends EventgalleryLibraryMethodsMethod
{

    protected $_methodtable = 'Paymentmethod';

    /**
     * Returns if this method can be used with the current cart.
     *
     * @param EventgalleryLibraryLineitemcontainer $cart
     *
     * @return bool
     */
    public function isEligible($cart)
    {
       $type = $cart->getType();
       $supportDigital = $this->isDoSupportDigital();


       if ($type == EventgalleryLibraryEnumBaskettype::TYPE_DIGITAL
           && ($supportDigital == EventgalleryLibraryEnumSupportsdigital::SUPPORTS_DIGITAL_YES
           || $supportDigital == EventgalleryLibraryEnumSupportsdigital::SUPPORTS_DIGITAL_ONLY)) {
           return true;
       }

       if ($type == EventgalleryLibraryEnumBaskettype::TYPE_PHYSICAL
           && ($supportDigital == EventgalleryLibraryEnumSupportsdigital::SUPPORTS_DIGITAL_NO
               || $supportDigital == EventgalleryLibraryEnumSupportsdigital::SUPPORTS_DIGITAL_YES)) {
           return true;
       }

       if ($type == EventgalleryLibraryEnumBaskettype::TYPE_MIXED
           && $supportDigital == EventgalleryLibraryEnumSupportsdigital::SUPPORTS_DIGITAL_YES) {
           return true;
       }

       return false;

    }

    /**
     * @see EventgalleryLibraryEnumSupportsdigital
     * @return int
     */
    public function isDoSupportDigital() {
        return $this->_object->supportsdigital;
    }

    public function getTypeCode() {
        return EventgalleryLibraryServicelineitem::TYPE_PAYMENTMETHOD;
    }

    /**
     * @param $lineitemcontainer EventgalleryLibraryLineitemcontainer
     * @param $input JInput
     *
     */
    public function processOnPaymentSave($lineitemcontainer, $input) {

    }

    /**
     * Makes sure the payment method is valid while creating the order.
     *
     * @param $lineitemcontainer EventgalleryLibraryLineitemcontainer
     */
    public function verfiyPaymentMethodServiceLineItem($lineitemcontainer) {
        return true;
    }

    /**
     * @param $lineitemcontainer EventgalleryLibraryLineitemcontainer
     * @return string
     */

    public function getPaymentPageContentHead($lineitemcontainer) {
        return $this->getDisplayName();
    }

    /**
     * @param $lineitemcontainer EventgalleryLibraryLineitemcontainer
     * @return string
     */
    public function getPaymentPageContentBody($lineitemcontainer) {
        return $this->getDescription();
    }

    /**
     * Defines if the payment method would like to send a mail if the payment status has changed.
     *
     * @param $lineitemcontainer EventgalleryLibraryLineitemcontainer
     * @return bool
     */
    public function sendMailOnPaymentStatusChange($lineitemcontainer) {
        if ($lineitemcontainer->getTotal()->getAmount() == 0) {
            return false;
        }
        return true;
    }

}
