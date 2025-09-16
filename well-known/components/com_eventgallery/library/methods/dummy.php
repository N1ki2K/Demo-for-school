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

class EventgalleryLibraryMethodsDummy extends  EventgalleryLibraryMethodsMethod
{

    protected $_item = null;

    /** @noinspection PhpMissingParentConstructorInspection */
    public function __construct($item) {
        $this->_object = $item;
        $this->_object_id = $item->id;
        $this->_ls_displayname = new EventgalleryLibraryDatabaseLocalizablestring($this->_object->displayname);
        $this->_ls_description = new EventgalleryLibraryDatabaseLocalizablestring($this->_object->description);
    }

    /**
     * Returns if this method can be used with the current cart.
     *
     * @param EventgalleryLibraryLineitemcontainer $cart
     *
     * @return bool
     */
    public function isEligible($cart)
    {
        return false;
    }

    protected function _loadMethodData() {

    }

    public function getTypeCode() {

    }
}
