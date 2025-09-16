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

class EventgalleryLibraryScaleprice
{

    /**
     * @var int
     */
    public $quantity;

    /**
     * @var EventgalleryLibraryCommonMoney
     */
    public $price;

    /**
     * @param $quantity int
     * @param $price EventgalleryLibraryCommonMoney
     */
    public function __construct($quantity, $price) {
        $this->quantity = $quantity;
        $this->price = $price;
    }

    /**
     * @return int
     */
    public function getQuantity() {
        return $this->quantity;
    }

    /**
     * @return EventgalleryLibraryCommonMoney
     */
    public function getPrice() {
        return $this->price;
    }

    /**
     * Returns the package price (singleprice * quantity)
     * @return EventgalleryLibraryCommonMoney
     */
    public function getPackagePrice() {
        return new EventgalleryLibraryCommonMoney($this->getPrice()->getAmount() * $this->getQuantity(), $this->getPrice()->getCurrency());
    }

}
