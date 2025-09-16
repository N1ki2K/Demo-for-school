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

class EventgalleryLibraryAddress extends EventgalleryLibraryDatabaseObject
{
    const USER_ADDRESS_BILLING_KEY = "eventgallery_address_billing";
    const USER_ADDRESS_SHIPPING_KEY = "eventgallery_address_shipping";
    const USER_ADDRESS_BASIC_EMAIL_KEY = "eventgallery_address_basic_email";
    const USER_ADDRESS_BASIC_PHONE_KEY = "eventgallery_address_basic_phone";
    const USER_ADDRESS_BASIC_MESSAGE_KEY = "eventgallery_address_basic_message";

    /**
     * @var EventgalleryTableStaticaddress
     */
    protected $_object = NULL;
    protected $_object_id = NULL;

    public function __construct($object)
    {
        if (!is_object($object)) {
            throw new InvalidArgumentException("can't create instance of Address because the given object is not an Object");
        }

        $this->_object = $object;
        $this->_object_id = $object->id;

        parent::__construct();
    }

    /**
     * @param string $prefix
     *
     * @return array
     */
    public function _getData($prefix)
    {
        $result = array();
        foreach (get_object_vars($this->_object) as $key => $value) {
            $result[$prefix . $key] = $value;
        }
        return $result;
    }

    /**
     * @return string the id
     */
    public function getId()
    {
        return $this->_object->id;
    }

    public function getFirstName()
    {
        return $this->_object->firstname;
    }

    public function getLastName()
    {
        return $this->_object->lastname;
    }

    public function getAddress1()
    {
        return $this->_object->address1;
    }

    public function getAddress2()
    {
        return $this->_object->address2;
    }

    public function getAddress3()
    {
        return $this->_object->address3;
    }

    public function getCity()
    {
        return $this->_object->city;
    }

    public function getZip()
    {
        return $this->_object->zip;
    }

    public function getCountry()
    {
        return $this->_object->country;
    }

    public function getState()
    {
        return $this->_object->state;
    }

    public function getCompanyName() {
        return $this->_object->companyname;
    }

    public function getTaxId() {
        return $this->_object->taxid;
    }

}
