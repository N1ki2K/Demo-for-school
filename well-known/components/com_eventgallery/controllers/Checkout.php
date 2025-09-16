<?php
/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */
defined('_JEXEC') or die;

class EventgalleryControllerCheckout extends JControllerLegacy
{
    public function display($cachable = false, $urlparams = array())
    {
        /**
         * @var \Joomla\Registry\Registry $params
         */
        $params = JComponentHelper::getParams('com_eventgallery');
        $useAddressDataFromUser = $params->get('use_address_data_from_user', 1) == 1;

        $user = JFactory::getUser();

        /* @var EventgalleryLibraryManagerCart $cartMgr */
        $cartMgr = EventgalleryLibraryManagerCart::getInstance();
        $cart = $cartMgr->getCart();
        if ($useAddressDataFromUser) {
        	$cartMgr->setAddressFromUser($cart, $user, false);
        }

        parent::display(false, $urlparams);
    }

    /**
     * @param EventgalleryLibraryOrder $order
     *
     * @return mixed|string
     */
    protected  function _sendOrderConfirmationMail($order) {
        $params = JComponentHelper::getParams('com_eventgallery');

        /**
         * @var EventgalleryLibraryManagerEmailtemplate $emailtemplateMgr
         */
        $emailtemplateMgr = EventgalleryLibraryManagerEmailtemplate::getInstance();

        $data = Array();

        $disclaimerObject = new EventgalleryLibraryDatabaseLocalizablestring($params->get('checkout_disclaimer',''));
        $disclaimer = strlen($disclaimerObject->get())>0?$disclaimerObject->get():JText::_('COM_EVENTGALLERY_CART_CHECKOUT_ORDER_MAIL_CONFIRMATION_DISCLAIMER');

        $data['disclaimer'] = $disclaimer;
        $data['order'] = $emailtemplateMgr->createOrderData($order);

        $data = json_decode(json_encode($data), FALSE);

        $language = JFactory::getLanguage();
        $to = Array($order->getEMail(), $order->getBillingAddress()==null? "": $order->getBillingAddress()->getFirstName().' '.$order->getBillingAddress()->getLastName());
        return $emailtemplateMgr->sendMail('new_order', $language->getTag(), true, $data, $to, true);

    }

    /**
     * just sets the layout for the confirm page
     *
     * @param bool  $cachable
     * @param array $urlparams
     */
    public function confirm($cachable = false, $urlparams = array())
    {
        $this->input->set('layout', 'confirm');
        $this->display($cachable, $urlparams);
    }

    /**
     * Just sets the layout for the change page
     *
     * @param bool  $cachable
     * @param array $urlparams
     */
    public function change($cachable = false, $urlparams = array())
    {
        $this->input->set('layout', 'change');

        $this->display($cachable, $urlparams);
    }

    public function saveChanges($cachable = false, $urlparams = array())
    {
        /* @var EventgalleryLibraryManagerCart $cartMgr */
        $cartMgr = EventgalleryLibraryManagerCart::getInstance();

        JSession::checkToken();
        $errors = array();
        $errors = array_merge($errors, $cartMgr->updateShippingMethod());
        $errors = array_merge($errors, $cartMgr->updatePaymentMethod());

        // if we have a shipping method which does not need an address, we can skip the address form processing. Still we need
        // to handle name, phone and message.
        if ($cartMgr->getCart()->getShippingMethod() != null && !$cartMgr->getCart()->getShippingMethod()->needsAddressData()) {
            $errors = array_merge($errors, $cartMgr->updateAddresses(null, true));
        } else {
            $errors = array_merge($errors, $cartMgr->updateAddresses(null, false));
        }
        $cartMgr->calculateCart();

        if (count($errors) > 0) {
            $msg = "";
            $app = JFactory::getApplication();

            /**
             * @var Exception $error
             */
            foreach ($errors as $error) {
                $this->setMessage($msg);
                $app->enqueueMessage($error->getMessage(), 'error');
            }

            $this->change($cachable, $urlparams);
        } else {
            $continue = $this->input->getString('continue', null);

            $msg = JText::_('COM_EVENTGALLERY_CART_CHECKOUT_CHANGES_STORED');
            if ($continue == null) {
                $this->setRedirect(
                    JRoute::_("index.php?option=com_eventgallery&view=checkout&task=change"), $msg, 'info'
                );
            } else {
                $this->setRedirect(JRoute::_("index.php?option=com_eventgallery&view=checkout"));
            }
        }
    }


    public function createOrder()
    {
        $app = JFactory::getApplication();

        // switch to the change page.
        $continue = $this->input->getString('continue', null);

        if ($continue == null) {
            $this->setRedirect(JRoute::_("index.php?option=com_eventgallery&view=checkout&task=change"));
            return;
        }


        // Check for request forgeries.
        JSession::checkToken();

        /* @var EventgalleryLibraryManagerCart $cartMgr */
        $cartMgr = EventgalleryLibraryManagerCart::getInstance();

        $cartMgr->calculateCart();

        $cart = $cartMgr->getCart();

        // if the cart is empty
        if ($cart->getLineItemsCount()==0) {
            $this->setRedirect(JRoute::_("index.php?option=com_eventgallery&view=cart"));
            return;
        }

        /** create order
        * @var EventgalleryLibraryManagerOrder $orderMgr
        */
        $orderMgr = EventgalleryLibraryManagerOrder::getInstance();

        if (!$cart->getPaymentMethod()->verfiyPaymentMethodServiceLineItem($cart)) {
            $app->enqueueMessage(JText::_('COM_EVENTGALLERY_PAYMENT_VERIFICATION_FAILED'), 'error');
            $this->setRedirect(JRoute::_("index.php?option=com_eventgallery&view=checkout"));
            return;
        }

        #$order = $cart;
        $order = $orderMgr->createOrder($cart);

        /* send mail */
        $send = $this->_sendOrderConfirmationMail($order);

        $orderMgr->processOnOrderSubmit($order);

        if ($order->getTotal()->getAmount()<=0) {
            /**
             * @var EventgalleryLibraryFactoryOrderstatus $orderstatusFactory
             */
            $orderstatusFactory = EventgalleryLibraryFactoryOrderstatus::getInstance();
            $order->setPaymentStatus($orderstatusFactory->getOrderStatusById(EventgalleryLibraryOrderstatus::TYPE_PAYMENT_PAID));
        }

        if ($send !== true) {
            $msg = JText::_('COM_EVENTGALLERY_CART_CHECKOUT_ORDER_FAILED') . ' (' . $send . ')';
        } else {
            $msg = NULL; 
        }

        $this->setRedirect(JRoute::_("index.php?option=com_eventgallery&view=checkout&task=confirm"), $msg, 'info');

    }

    public function processPayment() {
       $methodid = $this->input->getString("paymentmethodid",null);
        /**
         * @var EventgalleryLibraryFactoryPaymentmethod $methodFactory
         */

        $methodFactory = EventgalleryLibraryFactoryPaymentmethod::getInstance();
        $method = $methodFactory->getMethodById($methodid, false);
        if ($method != null) {
            $method->onIncomingExternalRequest();
        }


    }



}
