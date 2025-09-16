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


class EventgalleryLibraryLineitem extends EventgalleryLibraryDatabaseObject
{

    const TYPE_CART = 0;
    const TYPE_ORDER = 1;
    /**
     * @var EventgalleryTableImagelineitem
     */
    protected $_lineitem = null;
    /**
     * @var string
     */
    protected $_lineitem_dbtable = null;
    /**
     * @var int
     */
    protected $_lineitem_id = null;
    /**
     * @var string
     */
    protected $_lineitem_table = null;

    /**
     * creates the lineitem object. The given $lineitem can be an stdClass object or a id of a line item.
     * This is necessary since a lineitemcontainer can already preload it's line items with a single query.
     *
     * @param $lineitem
     */
    function __construct($lineitem)
    {
        if (!is_object($lineitem) ) {
            throw new InvalidArgumentException("Can't initialize object with an ID only. Use a factory instead.");
        }

        $this->_lineitem = $lineitem;
        $this->_lineitem_id = $lineitem->id;

        parent::__construct();
    }

    /**
     * @return int
     */
    public function getId()
    {
        return $this->_lineitem->id;
    }

    /**
     * @return string
     */
    public function getLineItemContainerId()
    {
        return $this->_lineitem->lineitemcontainerid;
    }

    /**
     * returns the amount of tax
     *
     * @return EventgalleryLibraryCommonMoney
     */
    public function getTax() {
        $moneyValue = $this->getPrice()->getAmount() / (100 + $this->getTaxrate() ) * $this->getTaxrate();
        return new EventgalleryLibraryCommonMoney($moneyValue, $this->_lineitem->currency);
    }

    /**
     * @return float
     */
    public function getTaxrate() {
        return $this->_lineitem->taxrate;
    }

    /**
     * @return EventgalleryLibraryCommonMoney
     */
    public function getPrice()
    {
        return new EventgalleryLibraryCommonMoney($this->_lineitem->price, $this->_lineitem->currency);
    }

    /**
     * @return int
     */
    public function getQuantity()
    {
        return $this->_lineitem->quantity;
    }

    /**
     * @return EventgalleryLibraryCommonMoney
     */
    public function getSinglePrice()
    {
        return new EventgalleryLibraryCommonMoney($this->_lineitem->singleprice, $this->_lineitem->currency);
    }

    /**
     * Sets the price of a single item. The price will be set based on the quantiy and the single price.
     *
     * @param $singlePrice EventgalleryLibraryCommonMoney
     */
    public function setSinglePrice($singlePrice) {
        $this->_lineitem->singleprice = $singlePrice->getAmount();
        $this->_lineitem->price = $this->_lineitem->singleprice * $this->_lineitem->quantity;
        $this->_store();
    }

    /**
     * Sets the price of the whole line item.
     *
     * @param $price EventgalleryLibraryCommonMoney
     */
    public function setPrice($price) {
        $this->_lineitem->price = $price->getAmount();
        $this->_store();
    }

    /**
     * @param int $quantity
     */
    public function setQuantity($quantity)
    {
        $this->_lineitem->quantity = $quantity;
        $this->_lineitem->price = $this->_lineitem->singleprice * $quantity;
        $this->_store();
    }

    /**
     *
     */
    protected function _store()
    {
        $this->store((array)$this->_lineitem, $this->_lineitem_table);
    }

    /**
     * Returns the internal data object. Do not use this method but for storing reasons
     *
     * @return EventgalleryTableImagelineitem
     */
    public function _getInternalDataObject() {
        return $this->_lineitem;
    }

}
