<?php
/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */
// no direct access
defined('_JEXEC') or die('Restricted access');

require_once JPATH_ROOT.'/components/com_eventgallery/library/common/logger.php';

class EventgalleryTableOrder extends JTable
{

    /** @var EventgalleryTableOrder Caches the row data on load for future reference */
    private $_selfCache = null;

    public $id;
    public $documentno;
    public $userid;
    public $email;
    public $phone;
    public $statusid;
    public $subtotal;
    public $subtotalcurrency;
    public $total;
    public $totalcurrency;
    public $surchargeid;
    public $paymentmethodid;
    public $shippingmethodid;
    public $billingaddressid;
    public $shippingaddressid;
    public $message;
    public $modified;
    public $created;
    public $version;
    public $token;

    public $orderstatusid;
    public $paymentstatusid;
    public $shippingstatusid;

    public $surchargetotal;
    public $surchargetotalcurrency;

    public $paymenttotal;
    public $paymenttotalcurrency;

    public $shippingtotal;
    public $shippingtotalcurrency;


    /**
     * Constructor
     * @param JDatabaseDriver $db
     */

	function __construct( &$db ) {
		parent::__construct('#__eventgallery_order', 'id', $db);
        JLog::addLogger(
            array(
                'text_file' => 'com_eventgallery_order.log.php',
                'logger' => 'Eventgalleryformattedtext'
            ),
            JLog::ALL,
            'com_eventgallery_order'
        );

    }

    public function store( $updateNulls=false )
	{
        $this->modified = date("Y-m-d H:i:s");
		if(!$this->onBeforeStore($updateNulls)) return false;
		$result = parent::store($updateNulls);
		if($result) {
			$result = $this->onAfterStore();
		}
		return $result;
	}

	public function load( $keys=null, $reset=true )
	{
		$result = parent::load($keys, $reset);
		$this->onAfterLoad($result);
		return $result;
	}

	/**
	 * Method to reset class properties to the defaults set in the class
	 * definition. It will ignore the primary key as well as any private class
	 * properties.
	 */
	public function reset()
	{
		parent::reset();
		
		if(!$this->onAfterReset()) return false;

        return true;
	}


    /**
     * Caches the loaded data so that we can check them for modifications upon
     * saving the row.
     * @param $result
     * @return bool
     */
    public function onAfterLoad(&$result)
    {
        $this->_selfCache = $result ? clone $this : null;
        return true;
    }

    /**
     * Resets the cache when the table is reset
     * @return bool
     */
    public function onAfterReset()
    {
        $this->_selfCache = null;
        return true;
    }

    /**
     * @param bool $updateNulls
     * @throws Exception
     * @returns bool
     */
    protected function onBeforeStore(/** @noinspection PhpUnusedParameterInspection */$updateNulls = false) {

        if (!isset($this->_selfCache)) {
            return true;
        }
        // check the version flags to make sure we don't overwrite newer rows with older data.

        if (($this->_selfCache->version > $this->version)) {
            throw new Exception(JText::sprintf('COM_EVENTGALLERY_ORDER_SAVE_FAILED_VERSIONCONFLICT', $this->_selfCache->version, $this->version));
        } else {
            $this->version++;
        }


        return true;
    }

    /**
     * Automatically run some actions after a subscription row is saved
     */
    protected function onAfterStore()
    {

         /**
         * @var EventgalleryLibraryManagerOrder $orderMgr
         */
        $orderMgr = EventgalleryLibraryManagerOrder::getInstance();
        $order = $orderMgr->getOrderById($this->id);

        if ($order == null) {
            return true;
        }

        if ($this->_selfCache == null) {
            return true;
        }

        // trigger the method functions if a status changed
        if ($this->_selfCache->paymentstatusid != $this->paymentstatusid) {
            if (null!=$order->getPaymentMethod())   {$order->getPaymentMethod()->onPaymentStatusChange($order);}
            if (null!=$order->getShippingMethod())  {$order->getShippingMethod()->onPaymentStatusChange($order);}
            if (null!=$order->getSurcharge())       {$order->getSurcharge()->onPaymentStatusChange($order);}
        }

        if ($this->_selfCache->shippingstatusid != $this->shippingstatusid) {
            if (null!=$order->getPaymentMethod())   {$order->getPaymentMethod()->onShippingStatusChange($order);}
            if (null!=$order->getShippingMethod())  {$order->getShippingMethod()->onShippingStatusChange($order);}
            if (null!=$order->getSurcharge())       {$order->getSurcharge()->onShippingStatusChange($order);}
        }

        if ($this->_selfCache->orderstatusid != $this->orderstatusid) {
            if (null!=$order->getPaymentMethod())   {$order->getPaymentMethod()->onOrderStatusChange($order);}
            if (null!=$order->getShippingMethod())  {$order->getShippingMethod()->onOrderStatusChange($order);}
            if (null!=$order->getSurcharge())       {$order->getSurcharge()->onOrderStatusChange($order);}
        }


        $result = true;

        // trigger things if the payment status changed to paid
        if ($order->getPaymentMethod() != null
            && $this->_selfCache->paymentstatusid != $this->paymentstatusid
            && $this->paymentstatusid==EventgalleryLibraryOrderstatus::TYPE_PAYMENT_PAID) {

            // trigger payment mail if allowed
            if ($order->getPaymentMethod()->sendMailOnPaymentStatusChange($order))
            {
                $result = $this->_sendMail('paid_order', $order);
            }

            // set shipping status
            /**
             * @var EventgalleryLibraryFactoryOrderstatus $orderStatusFactory
             */
            $orderStatusFactory = EventgalleryLibraryFactoryOrderstatus::getInstance();
            if ($order->getShippingMethod() != null && $order->getShippingMethod()->isAutomaticallyShippableIfPaid($order)) {
                $order->setShippingStatus($orderStatusFactory->getOrderStatusById(EventgalleryLibraryOrderstatus::TYPE_SHIPPING_SHIPPED));
            }
        }

        // trigger email if the order status changed to send.
        if ($order->getShippingMethod() != null
            && $order->getShippingMethod()->sendMailOnShippingStatusChange($order)
            && $this->_selfCache->shippingstatusid != $this->shippingstatusid
            && $this->shippingstatusid==EventgalleryLibraryOrderstatus::TYPE_SHIPPING_SHIPPED) {

            $result = $this->_sendMail('shipped_order', $order);
        }

        return $result;
    }

    /**
     * @param String $mailtype
     * @param EventgalleryLibraryOrder $order
     * @return mixed|string
     */
    private function _sendMail($mailtype, $order) {
        // Load the front end language
        $language = JFactory::getLanguage();
        $language->load('com_eventgallery' , JPATH_SITE.DIRECTORY_SEPARATOR.'components/com_eventgallery', $language->getTag(), true);
        $language->load('com_eventgallery' , JPATH_SITE.DIRECTORY_SEPARATOR.'language'.DIRECTORY_SEPARATOR.'overrides', $language->getTag(), true, false);
        /**
         * @var EventgalleryLibraryManagerEmailtemplate $emailtemplateMgr
         */
        $emailtemplateMgr = EventgalleryLibraryManagerEmailtemplate::getInstance();

        $data = Array();

        $data['order'] = $emailtemplateMgr->createOrderData($order);

        $data = json_decode(json_encode($data), FALSE);

        $language = JFactory::getLanguage();
        $to = Array($order->getEMail(), $order->getBillingAddress()==null? "": $order->getBillingAddress()->getFirstName().' '.$order->getBillingAddress()->getLastName());
        return $emailtemplateMgr->sendMail($mailtype, $language->getTag(), true, $data, $to, true);
    }

}
