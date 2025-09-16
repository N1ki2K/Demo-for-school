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

class EventgalleryLibraryFactoryOrder extends EventgalleryLibraryFactoryFactory
{


    /**
     * @param EventgalleryLibraryCart $cart
     * @return EventgalleryLibraryOrder
     */
    public function createOrder($cart) {

        $db = $this->db;
        $data = $cart->_getInternalDataObject();
        // avoid getting the creation date of the cart as the order creation date.
        unset($data['created']);

        $uuid = uniqid("", true);
        $uuid = base_convert($uuid,16,10);

        $token = uniqid("", true);

        $query = $db->getQuery(true);
        $query->insert("#__eventgallery_order");
        $query->columns($db->quoteName(array('id', 'token')));
        $query->values(implode(',', Array($db->quote($uuid), $db->quote($token))));
        $db->setQuery($query);
        $db->execute();


        $user = JFactory::getUser();

        $data['id'] = $uuid;
        $data['token'] = $token;

        if (!$user->guest) {
            $data['userid'] = $user->id;
        }

        /**
         * @var EventgalleryTableOrder $orderTable
         */
        $orderTable = $this->store($data, 'Order');
        /**
         * @var EventgalleryLibraryImagelineitem $lineitem
         * @var EventgalleryLibraryFactoryImagelineitem $imageLineItemFactory
         */

        $imageLineItemFactory = EventgalleryLibraryFactoryImagelineitem::getInstance();

        foreach ($cart->getLineItems() as $lineitem) {
            $imageLineItemFactory->copyLineItem($orderTable->id, $lineitem);
        }

        /**
         * @var EventgalleryLibraryServicelineitem $lineitem
         * @var EventgalleryLibraryFactoryServicelineitem $serviceLineItemFactory
         */
        $serviceLineItemFactory = EventgalleryLibraryFactoryServicelineitem::getInstance();

        foreach ($cart->getServiceLineItems() as $lineitem) {
            $serviceLineItemFactory->copyLineItem($orderTable->id, $lineitem);
        }


        /**
         * @var EventgalleryLibraryFactoryOrderstatus $orderstatusFactory
         */
        $orderstatusFactory = EventgalleryLibraryFactoryOrderstatus::getInstance();

        /**
         * @var EventgalleryLibraryOrder $order
         */
        $order = new EventgalleryLibraryOrder($orderTable);
        $order->setOrderStatus($orderstatusFactory->getDefaultOrderStatus(EventgalleryLibraryOrderstatus::TYPE_ORDER));
        $order->setPaymentStatus($orderstatusFactory->getDefaultOrderStatus(EventgalleryLibraryOrderstatus::TYPE_PAYMENT));
        $order->setShippingStatus($orderstatusFactory->getDefaultOrderStatus(EventgalleryLibraryOrderstatus::TYPE_SHIPPING));
        $order->setDocumentNumber(EventgalleryLibraryDatabaseSequence::generateNewId());

        return $order;
    }

    public function getOrdersByUserId($userid) {
        $db = $this->db;

        $query = $db->getQuery(true);
        $query->select('*');
        $query->from("#__eventgallery_order");
        $query->where("userid=".$db->quote($userid));
        $query->order("created desc");

        $db->setQuery($query);
        $rows = $db->loadObjectList();
        $orders = array();
        foreach ($rows as $row) {
            array_push($orders, new EventgalleryLibraryOrder($row));
        }

        return $orders;
    }

    /**
     * @param string $documentNo
     * @return EventgalleryLibraryOrder
     */
    public function getOrdersByDocumentNumber($documentNo)
    {
        if ($documentNo<0) {
            return null;
        }

        $db = $this->db;

        $query = $db->getQuery(true);
        $query->select('*');
        $query->from("#__eventgallery_order");
        $query->where("documentno=".$db->quote($documentNo));


        $db->setQuery($query);
        $row = $db->loadObject();

        if ($row == null) {
            return null;
        }

        $order = new EventgalleryLibraryOrder($row);

        return $order;
    }

    /**
     * Returns the order oject for a given ID
     *
     * @param $id
     * @return EventgalleryLibraryOrder
     */
    public function getOrderById($id) {

        $db = $this->db;
        $query = $db->getQuery(true);

        $query->select('o.*');
        $query->from('#__eventgallery_order as o');
        $query->where('o.id = ' . $db->quote($id));
        $db->setQuery($query);


        return new EventgalleryLibraryOrder($db->loadObject());
    }


}
