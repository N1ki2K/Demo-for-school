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
 * Provides an abstract class with the base implementation for each method
 *
 * Class EventgalleryLibraryMethodsMethod
 */
abstract class EventgalleryLibraryMethodsMethod extends EventgalleryLibraryDatabaseObject implements EventgalleryLibraryInterfaceMethod
{

    protected $_object = null;
    protected $_object_id = null;
    protected $_data = null;
    protected $_ls_displayname = null;
    protected $_ls_description = null;

    /**
     * the name of the Table Class
     */
    protected $_methodtable = null;

    public function __construct($object)
    {
        if ($object instanceof stdClass) {
            $this->_object = $object;
            $this->_object_id = $object->id;
        } else {
            throw new InvalidArgumentException("Object need to be an object.");
        }

        $this->_ls_displayname = new EventgalleryLibraryDatabaseLocalizablestring($this->_object->displayname);
        $this->_ls_description = new EventgalleryLibraryDatabaseLocalizablestring($this->_object->description);

        parent::__construct();
    }


    static public  function getClassName() {
        return "Abstract Method Class. Do overwrite this method.";
    }


    /**
     * @return string the id
     */
    public function getId()
    {
        return $this->_object->id;
    }

    /**
     * Returns the price of this method. If a lineitemcontainer is
     * provided, possible dynamic prices can be calculated.
     *
     * @param EventgalleryLibraryLineitemcontainer $lineitemcontainer
     * @return EventgalleryLibraryCommonMoney the price value
     */
    public function getPrice($lineitemcontainer = null)
    {
        if ($lineitemcontainer != null && $this->_object->price_percentaged>0) {
            $moneyValue = $this->_object->price;
            $moneyValue += $lineitemcontainer->getSubTotal()->getAmount() * $this->_object->price_percentaged / 100;
            return new EventgalleryLibraryCommonMoney($moneyValue, $this->_object->currency);
        }
        return new EventgalleryLibraryCommonMoney($this->_object->price, $this->_object->currency);
    }

    /**
     * @return string display name
     */
    public function getName()
    {
        return $this->_object->name;
    }

    public function isPublished() {
        return $this->_object->published==1;
    }

    /**
     * @return string display name
     */
    public function getDisplayName()
    {
        return $this->_ls_displayname->get();
    }

    /**
     * @return string display name
     */
    public function getDescription()
    {
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
     * @return stdClass|null
     */
    public function getData()
    {
        if (null == $this->_data) {
            $this->_data = json_decode($this->_object->data);
        }

        return $this->_data;
    }

    /**
     * sets a new data object
     *
     * @param stdClass $data
     */
    public function setData(stdClass $data) {

        $this->_object->data = json_encode($data);

        $this->_storeMethod();
        $this->_data = null;
    }

    /**
     * returns the amount of tax for this item. If a lineitemcontainer is
     * provided, possible dynamic prices can be calculated.
     *
     * @param EventgalleryLibraryLineitemcontainer $lineitemcontainer
     * @return EventgalleryLibraryCommonMoney
     */
    public function getTax($lineitemcontainer = null) {
        $moneyValue = $this->getPrice($lineitemcontainer)->getAmount() / (100 + $this->getTaxrate() ) * $this->getTaxrate();
        return new EventgalleryLibraryCommonMoney($moneyValue, $this->_object->currency);
    }
    /**
     * @return float
     */
    public function getTaxrate() {
        return $this->_object->taxrate;
    }

    /**
     * returns the percentage value of the field price_percentaged. It does NOT calculate the price!
     *
     * @return float
     */
    public function getPercentagedPrice() {
        return $this->_object->price_percentaged;
    }

    public function getOrdering() {
        return $this->_object->ordering;
    }

    public function processOnOrderSubmit($lineitemcontainer) {
        return true;
    }

    public function onIncomingExternalRequest() {

    }

    /**
     * @param JForm $form
     * @return JForm
     */
    public function onPrepareAdminForm($form) {
        return $form;
    }


    public function onSaveAdminForm($validData) {
        return true;
    }

    public function getMethodReviewContent($lineitemcontainer, $isContentForMail) {
        return "";
    }


    public function getMethodConfirmContent($lineitemcontainer, $isContentForMail) {
        return "";
    }

    protected function _storeMethod()
    {
        $data = $this->_object;
        $this->store((array)$data, $this->_methodtable);
    }

    /**
     * Adjusts an url based on the components setttings
     * @param $url
     * @return mixed
     */
    protected function adjustProtocol($url) {

        /**
         * @var \Joomla\Registry\Registry $internalParams
         */
        $internalParams = JComponentHelper::getParams('com_eventgallery');

        
        $configurationValue = $internalParams->get('protocol_for_incoming_request', 'keep');
        $pattern = '/https?:\/\//';

        if ($configurationValue == 'secure') {
            $url = preg_replace($pattern, "https://", $url);    
        }

        if ($configurationValue == 'insecure') {
            $url = preg_replace($pattern, "http://", $url); 
        }


        return $url;
    }
    /**
     * Gets triggered if the order status changes.
     *
     * @param $order EventgalleryLibraryOrder
     * @return void
     */
    public function onOrderStatusChange($order) {
        #echo "order status changed: " . $order->getOrderStatus()->getName() . "\n";
    }

    /**
     * Gets triggered if the shipping status changes.
     *
     * @param $order EventgalleryLibraryOrder
     * @return void
     */
    public function onShippingStatusChange($order) {
        #echo "shipping status changed: " . $order->getShippingStatus()->getName() . "\n";
    }

    /**
     * Gets triggered if the payment status changes.
     *
     * @param $order EventgalleryLibraryOrder
     * @return void
     */
    public function onPaymentStatusChange($order) {
        #echo "payment status changed: " . $order->getPaymentStatus()->getName() . "\n";
    }

}
