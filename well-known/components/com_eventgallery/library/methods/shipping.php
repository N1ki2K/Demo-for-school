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

abstract class EventgalleryLibraryMethodsShipping extends EventgalleryLibraryMethodsMethod
{
    protected $_methodtable = 'Shippingmethod';


    public function getTypeCode() {
        return EventgalleryLibraryServicelineitem::TYPE_SHIPINGMETHOD;
    }

    /**
     * Defines if the shipping method would like to send a mail if the shipping status has changed.
     *
     * @param $lineitemcontainer EventgalleryLibraryLineitemcontainer
     * @return bool
     * @since 3.6.6
     */
    public function sendMailOnShippingStatusChange($lineitemcontainer) {
        return true;
    }

    /**
     * determines if an order can be shipped automatically if it is paid. This is useful for download shipping methods where we actually don't need to do anything.
     *
     * @param $lineitemcontainer
     * @return bool
     * @since 3.6.6
     */
    public function isAutomaticallyShippableIfPaid($lineitemcontainer) {
        return false;
    }

    /**
     * @return boolean
     * @since 3.7.12
     */
    public function needsAddressData() {
        return $this->_object->needsaddressdata == 1;
    }
}
