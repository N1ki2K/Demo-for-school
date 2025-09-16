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

class EventgalleryLibraryImagetype extends EventgalleryLibraryDatabaseObject
{
    /**
     * @var EventgalleryTableImagetype
     */
    protected $_imagetype = NULL;
    protected $_imagetype_id = NULL;
    protected $_ls_displayname = NULL;
    protected $_ls_description = NULL;
    protected $_scaleprice = NULL;

    const SCALEPRICE_SCOPE_LINEITEM = "lineitem";
    const SCALEPRICE_SCOPE_IMAGETYPE = "imagetype";
    const SCALEPRICE_TYPE_PACKAGE = "package";
    const SCALEPRICE_TYPE_SINGLEPACKAGE = "singlepackage";
    const SCALEPRICE_TYPE_DISCOUNT = "discount";

    public function __construct($object)
    {
        if (!is_object($object)) {
            throw new InvalidArgumentException("Can't initialize Imagetype without a Data Object");
        }

        $this->_imagetype = $object;
        $this->_imagetype_id = $object->id;

        $this->_ls_displayname = new EventgalleryLibraryDatabaseLocalizablestring($this->_imagetype->displayname);
        $this->_ls_description = new EventgalleryLibraryDatabaseLocalizablestring($this->_imagetype->description);

        $scaleprices = json_decode($this->_imagetype->scaleprice);
        $this->_scaleprice = array();

        if (null !== $scaleprices ) {
            foreach($scaleprices as $scaleprice) {
                array_push($this->_scaleprice, new EventgalleryLibraryScaleprice($scaleprice->quantity, new EventgalleryLibraryCommonMoney($scaleprice->price, $this->_imagetype->currency)));
            }
        }



        //sort the scale prices by quantity
        usort($this->_scaleprice,function($a, $b)
        {
            if ( ($a instanceof EventgalleryLibraryScaleprice) && ($b instanceof EventgalleryLibraryScaleprice)) {
                return $a->getQuantity() > $b->getQuantity();
            }
            return 0;
        });


        parent::__construct();
    }

    /**
     * @return string the id of the image type
     */
    public function getId()
    {
        return $this->_imagetype->id;
    }

	/**
	* @return float
	*/
    public function getTaxrate() {
        return $this->_imagetype->taxrate;
    }

    /**
     * Returns the single price for the given quantity
     *
     * @param $quantity
     * @return EventgalleryLibraryCommonMoney the price value of the image type
     */
    public function getPrice($quantity = 1)
    {
        $price = new EventgalleryLibraryCommonMoney($this->_imagetype->price, $this->_imagetype->currency);

        $scalePrices = $this->getScalePrices();

        if (count($scalePrices) == 0) {
            return $price;
        }


        /**
         * @var EventgalleryLibraryScaleprice $scalePrice
         */

        foreach ($scalePrices as $scalePrice) {
            if ($scalePrice->getQuantity()<=$quantity) {
                $price = $scalePrice->getPrice();
            }
        }

        return $price;
    }

    public function getPackagePrice($quantity) {

        $price = new EventgalleryLibraryCommonMoney($this->_imagetype->price * $quantity, $this->_imagetype->currency);

        $scalePrices = $this->getScalePrices();

        if (count($scalePrices) == 0) {
            return $price;
        }

        /**
         * @var EventgalleryLibraryScaleprice $scalePrice
         */

        $priceAmount = 0;
        while ($quantity > 0) {
            $winnerQuanity = 1;
            $winnerPrice = $this->_imagetype->price;

            foreach ($scalePrices as $scalePrice) {
                if ($scalePrice->getQuantity() <= $quantity) {
                    $winnerQuanity = $scalePrice->getQuantity();
                    $winnerPrice = $scalePrice->getPrice()->getAmount() * $winnerQuanity;
                }
            }

            $priceAmount += $winnerPrice;
            $quantity -= $winnerQuanity;
        }

        return new EventgalleryLibraryCommonMoney($priceAmount, $this->_imagetype->currency);
    }

    /**
     * Applies the largest package once and uses single prices on top
     *
     * The minimum price will be the price of the smallest bundle.
     * @param $quantity
     * @return EventgalleryLibraryCommonMoney
     */
    public function getSinglePackagePrice($quantity) {

        $price = new EventgalleryLibraryCommonMoney($this->_imagetype->price * $quantity, $this->_imagetype->currency);

        $scalePrices = $this->getScalePrices();

        if (count($scalePrices) == 0) {
            return $price;
        }

        /**
         * @var EventgalleryLibraryScaleprice $scalePrice
         */

        $priceAmount = 0;

        $winnerQuanity = 1;
        $winnerPrice = $this->_imagetype->price;

        foreach ($scalePrices as $scalePrice) {
            // grab the smallest package >1 or the next fitting package size
            if (($winnerQuanity == 1 && $scalePrice->getQuantity() > $quantity) || $scalePrice->getQuantity() <= $quantity) {
                $winnerQuanity = $scalePrice->getQuantity();
                $winnerPrice = $scalePrice->getPrice()->getAmount() * $winnerQuanity;
            }
        }

        $priceAmount += $winnerPrice;
        $quantity -= $winnerQuanity;

        if ($quantity>0) {
            $priceAmount += $quantity * $this->getPrice(1)->getAmount();
        }

        return new EventgalleryLibraryCommonMoney($priceAmount, $this->_imagetype->currency);
    }

    /**
     * returns an array containing the scale price objects
     *
     * return EventgalleryLibraryScaleprice[]
     */
    public function getScalePrices() {
        return $this->_scaleprice;
    }


    /**
     * returns the type of the scale price
     *
     * @return string
     */
    public function getScalePriceType() {
        return $this->_imagetype->scalepricetype;
    }

    /**
     * returns the scope of the scale price
     *
     * @return string
     */
    public function getScalePriceScope() {
        return $this->_imagetype->scalepricescope;
    }

    /**
     * @return string display name of the image type
     */
    public function getName()
    {
        return $this->_imagetype->name;
    }

    /**
     * @return string display name of the image type
     */
    public function getDisplayName()
    {
        return $this->_ls_displayname->get();
    }

    /**
     * @return string description name of the image type
     */
    public function getDescription()
    {
        return $this->_ls_description->get();
    }

    /**
     * @return string
     */
    public function getNote() {
        return $this->_imagetype->note;
    }

    /**
     * Defines if this image type is a digital one. The oposite is a format which has to be shipped physically.
     *
     * @return bool
     */
    public function isDigital() {
        return $this->_imagetype->isdigital==1;
    }

    /**
     * @return bool
     */
    public function isPublished() {
        return $this->_imagetype->published==1;
    }

    /**
     * @return string
     */
    public function getSize() {
        return $this->_imagetype->size;
    }

    /**
     * @return float
     */
    public function getWidth() {
        return $this->_imagetype->width;
    }

    /**
     * @return float
     */
    public function getHeight() {
        return $this->_imagetype->height;
    }

    /**
     * @return float
     */
    public function getDepth() {
        return $this->_imagetype->depth;
    }

    /**
     * @return float
     */
    public function getWeight() {
        return $this->_imagetype->weight;
    }

    /**
     * @return int
     */
    public function getMaxOrderQuantity() {
        return $this->_imagetype->maxorderquantity;
    }

    /**
     * @return EventgalleryLibraryCommonMoney
     */
    public function getFlatPrice() {
        return new EventgalleryLibraryCommonMoney($this->_imagetype->flatprice, $this->_imagetype->currency);
    }


}
