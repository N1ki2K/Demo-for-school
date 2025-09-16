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

/**
* types: 
*   0   order
*   1   shipping
*   2   payment
*/
class EventgalleryLibraryOrderstatus extends EventgalleryLibraryDatabaseObject
{


    const TYPE_ORDER = 0;
    const TYPE_SHIPPING = 1;
    const TYPE_PAYMENT = 2;

    const TYPE_PAYMENT_PAID = 9;
    const TYPE_SHIPPING_SHIPPED = 7;

    /**
     * @var EventgalleryTableOrderstatus
     */
    protected $_object = NULL;
    protected $_object_id = NULL;
    protected $_ls_displayname = NULL;
    protected $_ls_description = NULL;


    public function __construct($object)
    {
        if (!is_object($object)) {
            throw new InvalidArgumentException("Can't initialize OrderStatus object because of a missing Data Object.");
        }

        $this->_object = $object;
        $this->_object_id = $object->id;

        if ($this->_object != null) {
            $this->_ls_displayname = new EventgalleryLibraryDatabaseLocalizablestring($this->_object->displayname);
            $this->_ls_description = new EventgalleryLibraryDatabaseLocalizablestring($this->_object->description);
        }

        parent::__construct();
    }



    /**
     * @return string the id of the image type
     */
    public function getId()
    {
        return $this->_object->id;
    }


    /**
     * @return string display name of the image type
     */
    public function getName()
    {
        return $this->_object->name;
    }

    /**
     * @return string display name of the image type
     */
    public function getDisplayName()
    {
        if ($this->_ls_displayname == null) {
            return "";
        }
        return $this->_ls_displayname->get();
    }

    /**
     * @return string display name of the image type
     */
    public function getDescription()
    {
        if ($this->_ls_description == null) {
            return "";
        }
        return $this->_ls_description->get();
    }

    /**
     * @return bool
     */
    public function isDefault()
    {
        return $this->_object->default == 1 ? true : false;
    }

    /**
     * Do change the main attributes of a system managed order status.
     *
     * @return bool
     */
    public function isSystemManaged() {
        return $this->_object->systemmanaged ==1? true: false;
    }

    public function getType(){
        return $this->_object->type;
    }

    public function getOrdering(){
        return $this->_object->ordering;
    }



}
