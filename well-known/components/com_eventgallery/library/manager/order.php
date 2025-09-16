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

class EventgalleryLibraryManagerOrder extends EventgalleryLibraryManagerManager
{

    function __construct()
    {

    }

    /**
     * creates a order from a cart
     *
     * @param EventgalleryLibraryCart $cart
     *
     * @return EventgalleryLibraryOrder
     */
    public function createOrder($cart)
    {

        /**
         * @var EventgalleryLibraryFactoryOrder $orderFactory
         */
        $orderFactory = EventgalleryLibraryFactoryOrder::getInstance();
        $order = $orderFactory->createOrder($cart);

        // put the cart in the cart history

        $cart->setStatus(EventgalleryLibraryCart::STATUS_HISTORY);

        return $order;
    }

    /**
     * @param EventgalleryLibraryLineitemcontainer $lineitemcontainer
     */
    public function processOnOrderSubmit($lineitemcontainer) {

        $lineitemcontainer->getShippingMethod()->processOnOrderSubmit($lineitemcontainer);
        $lineitemcontainer->getPaymentMethod()->processOnOrderSubmit($lineitemcontainer);
        if ($lineitemcontainer->getSurcharge()) {
            $lineitemcontainer->getSurcharge()->processOnOrderSubmit($lineitemcontainer);
        }

    }

    public function getOrders() {
        /* try to get the right user id for the cart. This can also be the session id */
        $session = JFactory::getSession();
        $user = JFactory::getUser();
        if ($user->guest) {
            $user_id = $session->get(EventgalleryLibraryManagerCart::EVENTGALLERY_CART_USER_ID);
        } else {
            $user_id = $user->id;
        }

        /**
         * @var EventgalleryLibraryFactoryOrder $orderFactory
         */
        $orderFactory = EventgalleryLibraryFactoryOrder::getInstance();
        $orders = $orderFactory->getOrdersByUserId($user_id);

        return $orders;

    }

    /**
     * @param string $documentNo
     * @return EventgalleryLibraryOrder|null
     */
    public function getOrderByDocumentNo($documentNo) {
        /**
         * @var EventgalleryLibraryFactoryOrder $orderFactory
         */
        $orderFactory = EventgalleryLibraryFactoryOrder::getInstance();
        $order = $orderFactory->getOrdersByDocumentNumber($documentNo);
        return $order;
    }

    /**
     * Returns the order oject for a given ID
     *
     * @param $id
     * @return EventgalleryLibraryOrder
     */
    public function getOrderById($id) {
        /**
         * @var EventgalleryLibraryFactoryOrder $orderFactory
         */
        $orderFactory = EventgalleryLibraryFactoryOrder::getInstance();
        $order = $orderFactory->getOrderById($id);
        return $order;
    }


}
