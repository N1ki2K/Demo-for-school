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
 * @property mixed cart
 */
class EventgalleryLibraryOrder extends EventgalleryLibraryLineitemcontainer
{

    protected $_lineitemstatus = EventgalleryLibraryLineitem::TYPE_CART;
    /**
     * @var EventgalleryTableOrder
     */
    protected $_lineitemcontainer = NULL;
    /**
     * @var string
     */
    protected $_lineitemcontainer_table = "Order";

    protected $_orderstatus = NULL;
    protected $_shippingstatus = NULL;
    protected $_paymentstatus = NULL;

    public function __construct($object)
    {
        if (!is_object($object)) {
            throw new InvalidArgumentException("Can't initialize Order Object because of missing Data Object.");
        }

        $this->_lineitemcontainer = $object;
        $this->_lineitemcontainer_id = $object->id;

        $this->_loadLineItems();
        $this->_loadServiceLineItems();

        parent::__construct();
    }

    /**
     * @param EventgalleryLibraryOrderStatus $orderStatus
     */
    public function setOrderStatus($orderStatus)
    {
        if ($orderStatus == NULL) {
            return;
        }
        $this->_lineitemcontainer->orderstatusid = $orderStatus->getId();
        $this->_storeLineItemContainer();
        $this->_orderstatus = null;
    }

    /**
     * @return EventgalleryLibraryOrderstatus
     */
    public function getOrderStatus() {
        if (null==$this->_orderstatus) {
            /**
             * @var EventgalleryLibraryFactoryOrderstatus $orderstatusFactory
             */
            $orderstatusFactory = EventgalleryLibraryFactoryOrderstatus::getInstance();
            $this->_orderstatus = $orderstatusFactory->getOrderStatusById($this->_lineitemcontainer->orderstatusid);
        }
        return $this->_orderstatus;
    }

    /**
     * @return EventgalleryLibraryOrderstatus
     */
    public function getPaymentStatus() {
        if (null == $this->_paymentstatus) {
            /**
             * @var EventgalleryLibraryFactoryOrderstatus $orderstatusFactory
             */
            $orderstatusFactory = EventgalleryLibraryFactoryOrderstatus::getInstance();
            $this->_paymentstatus = $orderstatusFactory->getOrderStatusById($this->_lineitemcontainer->paymentstatusid);
        }
        return $this->_paymentstatus;
    }

    /**
     * @param EventgalleryLibraryOrderstatus $paymentstatus
     */
    public function setPaymentStatus($paymentstatus) {
        $this->_lineitemcontainer->paymentstatusid = $paymentstatus->getId();
        $this->_storeLineItemContainer();
        $this->_paymentstatus = null;
    }

    /**
     * @return EventgalleryLibraryOrderstatus
     */
    public function getShippingStatus() {
        if (null==$this->_shippingstatus) {
            /**
             * @var EventgalleryLibraryFactoryOrderstatus $orderstatusFactory
             */
            $orderstatusFactory = EventgalleryLibraryFactoryOrderstatus::getInstance();
            $this->_shippingstatus = $orderstatusFactory->getOrderStatusById($this->_lineitemcontainer->shippingstatusid);
        }
        return $this->_shippingstatus;
    }

    /**
     * @param EventgalleryLibraryOrderstatus $shippingstatus
     */
    public function setShippingStatus($shippingstatus) {
        $this->_lineitemcontainer->shippingstatusid = $shippingstatus->getId();
        $this->_storeLineItemContainer();
        $this->_shippingstatus = null;
    }

    /**
     * returns a token which is necessary to perform downloads for this order
     *
     * @return string
     */
    public function getToken() {
        return $this->_lineitemcontainer->token;
    }

    /**
     * returns the version of this database entry
     *
     * @return int
     */
    public function getVersion() {
        return $this->_lineitemcontainer->version;
    }

}
