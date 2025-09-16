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

class EventgalleryLibraryManagerSurcharge extends EventgalleryLibraryManagerManager
{
    /**
     * Calculates a method which can be used.
     *
     * @param $cart
     *
     * @return EventgalleryLibraryMethodsSurcharge|null
     */
    public function calculateSurcharge($cart) {

        /**
         * @var EventgalleryLibraryFactorySurcharge $surchargeFactory
         */
        $surchargeFactory = EventgalleryLibraryFactorySurcharge::getInstance();
        $methods = $surchargeFactory->getMethods(true);

        foreach($methods as $method) {
            /**
             * @var EventgalleryLibraryMethodsSurcharge $method
             */
            if ($method->isEligible($cart)) {
                return $method;
            }

        }

        return null;
    }

}
