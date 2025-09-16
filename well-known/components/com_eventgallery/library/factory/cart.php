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

class EventgalleryLibraryFactoryCart extends EventgalleryLibraryFactoryFactory
{

    /**
     * Trys to find a cart for the given user.
     *
     * @param $userId
     * @return EventgalleryLibraryCart
     */
    public function getCartByUserId($userId) {
        $db = $this->db;
        $query = $db->getQuery(true);

        $query->select('c.*');
        $query->from('#__eventgallery_cart as c');
        $query->where('c.statusid is null');
        $query->where('c.userid = ' . $db->quote($userId));
        $db->setQuery($query);

        $object = $db->loadObject();
        if (null == $object) {
            return null;
        }
        return new EventgalleryLibraryCart($object);
    }

    /**
     * creates a cart for the given user.
     *
     * @param $userId
     * @return EventgalleryLibraryCart
     * @throws Exception
     */
    public function createCart($userId) {
        $db = $this->db;
        $uuid = uniqid("", true);
        $uuid = base_convert($uuid,16,10);

        /**
         * @var EventgalleryTableCart $data
         */

        $query = $db->getQuery(true);
        $query->insert("#__eventgallery_cart");
        $query->columns("id");
        $query->values($db->quote($uuid));
        $db->setQuery($query);
        $db->execute();

        $data = JTable::getInstance('cart', 'EventgalleryTable');
        $data->userid = $userId;
        $data->id=$uuid;

        return new EventgalleryLibraryCart($this->store((array)$data, 'Cart'));

    }


}