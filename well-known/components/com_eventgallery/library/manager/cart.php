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

class EventgalleryLibraryManagerCart extends EventgalleryLibraryManagerManager
{

    protected $_carts = array();

    const EVENTGALLERY_CART_USER_ID = "EVENTGALLERY_CART_USER_ID";

    function __construct()
    {

    }


    /**
     * Updates line item quantities and types.
     *
     * Syntax:
     *  - quantity_[lineitemid]=[quantity}
     *  - type_[lineitemid]=[imagetypeid]
     *
     *
     * @param EventgalleryLibraryCart $cart
     *
     * @return array Errors
     */
    public function updateLineItems(EventgalleryLibraryCart $cart = NULL)
    {
        $app = JFactory::getApplication();

        $errors = array();

        if ($cart == NULL) {
            $cart = $this->getCart();
        }

        /**
         * LINEITEM UPDATES
         */

        /* @var EventgalleryLibraryImagelineitem $lineitem */
        foreach ($cart->getLineItems() as $lineitem) {

            /* Quantity Update*/
            $quantity = $app->input->getString('quantity_' . $lineitem->getId(), NULL);
            $buyernote = $app->input->getSring('comment_' . $lineitem->getId(), "");
            if ($quantity != NULL) {

                if ($quantity > 0) {
                    $lineitem->setQuantity($quantity);
                } else {
                    $cart->deleteLineItem($lineitem->getId());
                }
            }

            $lineitem->setBuyerNote($buyernote);

            /* type update */

            $imagetypeid = $app->input->getString('type_' . $lineitem->getId(), NULL);

            if (NULL != $imagetypeid) {
                $lineitem->setImageType($imagetypeid);
            }

        }

        $cart->_updateLineItemContainer();

        return $errors;
    }

    /**
     * get the cart from the database.
     *
     * @return EventgalleryLibraryCart
     */
    public function getCart()
    {
        /**
         * @var EventgalleryLibraryFactoryCart $cartFactory
         */

        $cartFactory = EventgalleryLibraryFactoryCart::getInstance();
        /* try to get the right user id for the cart. This can also be the session id */
        $session = JFactory::getSession();
        $user_id = $session->get(self::EVENTGALLERY_CART_USER_ID);
        if ($user_id == null) {
            $user_id = uniqid(null, true);
            $session->set(self::EVENTGALLERY_CART_USER_ID, $user_id);
        }
        /** @noinspection PhpUndefinedMethodInspection */
        if (!isset($this->_carts[$user_id]) || $this->_carts[$user_id]->getStatus()!=0) {
            $cart = $cartFactory->getCartByUserId($user_id);
            if (null == $cart) {
                $cart = $cartFactory->createCart($user_id);
            }
            $this->_carts[$user_id] = $cart;
        }
        return $this->_carts[$user_id];
    }

    /**
     *
     * @param EventgalleryLibraryCart $cart
     *
     * @return array Errors
     */
    public function updateShippingMethod(EventgalleryLibraryCart $cart = NULL)
    {
        $app = JFactory::getApplication();

        $errors = array();

        if ($cart == NULL) {
            $cart = $this->getCart();
        }

        /**
         * SHIPPING UPDATE
         */

        $shippingmethodid = $app->input->getString('shippingid', NULL);

        if ($shippingmethodid != NULL || $cart->getShippingMethodServiceLineItem() == NULL) {
            /**
             * @var EventgalleryLibraryFactoryShippingmethod $shippingMethodFactory
             * @var EventgalleryLibraryMethodsShipping $method
             */
            $shippingMethodFactory = EventgalleryLibraryFactoryShippingmethod::getInstance();
            $method = $shippingMethodFactory->getMethodById($shippingmethodid, true);
            if ($method == NULL || $method->isEligible($cart)==false ) {
                if ($shippingMethodFactory->getDefaultMethod()->isEligible($cart)) {
                    $method = $shippingMethodFactory->getDefaultMethod();
                }  else {
                    $method = null;
                }
            }
            $cart->setShippingMethod($method);
        }

        if ($cart->getShippingMethodServiceLineItem() == null) {

            $errors[] = new Exception(JText::_('COM_EVENTGALLERY_CART_CHECKOUT_FORM_SHIPPINGMETHOD_INVALID'));
        }

        return $errors;
    }

    /**
     *
     * @param EventgalleryLibraryCart $cart
     *
     * @return array Errors
     */
    public function updatePaymentMethod(EventgalleryLibraryCart $cart = NULL)
    {
        $app = JFactory::getApplication();

        $errors = array();

        if ($cart == NULL) {
            $cart = $this->getCart();
        }

        /**
         * PAYMENT UPDATES
         */

        $paymentmethodid = $app->input->getString('paymentid', NULL);


        if ($paymentmethodid != NULL || $cart->getPaymentMethod() == NULL) {
            /**
             * @var EventgalleryLibraryFactoryPaymentmethod $paymentMethodFactory
             * @var EventgalleryLibraryMethodsPayment $method
             */
            $paymentMethodFactory = EventgalleryLibraryFactoryPaymentmethod::getInstance();
            $method = $paymentMethodFactory->getMethodById($paymentmethodid, true);
            if ($method == NULL || $method->isEligible($cart)==false) {
                if ($paymentMethodFactory->getDefaultMethod()->isEligible($cart)) {
                    $method = $paymentMethodFactory->getDefaultMethod();
                } else {
                    $method = null;
                }
            }

            $cart->setPaymentMethod($method);
            $method->processOnPaymentSave($cart, $app->input);
        }

        if ($cart->getPaymentMethodServiceLineItem() == null) {

            $errors[] = new Exception(JText::_('COM_EVENTGALLERY_CART_CHECKOUT_FORM_PAYMENTMETHOD_INVALID'));
        }


        return $errors;
    }

    /**
     * this method grabs the address data from a registered user and attachs it to the cart.
     *
     * @param EventgalleryLibraryCart $cart
     * @param JUser $user
     * @param bool $skipAddressForms
     */
    public function setAddressFromUser(EventgalleryLibraryCart $cart, JUser $user, $skipAddressForms = false) {

        if ($user == null || $user->guest == true) {
            return;
        }

        if ($cart->getEMail() == null) {
            $cart->setEMail($user->getParam(EventgalleryLibraryAddress::USER_ADDRESS_BASIC_EMAIL_KEY, null));
            $cart->setPhone($user->getParam(EventgalleryLibraryAddress::USER_ADDRESS_BASIC_PHONE_KEY, null));
            //$cart->setMessage($user->getParam(EventgalleryLibraryAddress::USER_ADDRESS_BASIC_MESSAGE_KEY, null));
        }
        if (!$skipAddressForms) {

            /**
             * ADDRESS UPDATE
             * @var EventgalleryLibraryFactoryAddress $addressFactory
             */
            $addressFactory = EventgalleryLibraryFactoryAddress::getInstance();

            $billingAddressID = null;

            if ($cart->getBillingAddress() == null) {
                $jsonData = $user->getParam(EventgalleryLibraryAddress::USER_ADDRESS_BILLING_KEY, "[]");
                $data = json_decode($jsonData);
                if (is_object($data)) {
                    if (isset($data->id)) {
                        $billingAddressID = $data->id;
                    }
                    // we need to reset the id to prevent assigning an existing database address object
                    unset($data->id);
                    $address = $addressFactory->createStaticAddress($data, 'billing_');
                    $cart->setBillingAddress($address);
                }
            }

            if ($cart->getShippingAddress() == null) {
                $jsonData = $user->getParam(EventgalleryLibraryAddress::USER_ADDRESS_SHIPPING_KEY, "[] ");
                $data = json_decode($jsonData);
                if (is_object($data)) {
                    if (!isset($data->id) || $billingAddressID != $data->id) {
                        unset($data->id);
                        $address = $addressFactory->createStaticAddress($data, 'shipping_');
                        $cart->setShippingAddress($address);
                    } else {
                        $cart->setShippingAddress($cart->getBillingAddress());
                    }
                }
            }
        }
    }

    /**
     * Updates the addresses of the cart
     *
     * validate billing address first. If this address is okay,
     * continue with the shipping address. This works for the customer
     * since there is also client side validation available
     *
     * @param EventgalleryLibraryCart $cart
     * @param boolean $skipAddressForms
     * @return array Errors
     */
    public function updateAddresses(EventgalleryLibraryCart $cart = NULL, $skipAddressForms = false)
    {
        $app = JFactory::getApplication();

        $user = JFactory::getUser();

        $errors = array();

        if ($cart == NULL) {
            $cart = $this->getCart();
        }


        $xmlPath = JPATH_SITE . DIRECTORY_SEPARATOR . 'components' . DIRECTORY_SEPARATOR . 'com_eventgallery'
            . DIRECTORY_SEPARATOR . 'models' . DIRECTORY_SEPARATOR . 'forms' . DIRECTORY_SEPARATOR;

        /**
         * USERDATA UPDATES
         */

        $userdataform = JForm::getInstance('userdata', $xmlPath . 'userdata.xml');
        $userdataform->bind($app->input->get('post'));
        $userdatavalidation = $userdataform->validate($app->input->post->getArray());

        $saveuser = false;

        if ($userdatavalidation !== true) {
            $errors = array_merge($errors, $userdataform->getErrors());
        } else {

            $phone = $app->input->getString('phone', NULL);
            if ($phone != NULL) {
                $cart->setPhone($phone);
            }

            $email = $app->input->getString('email', NULL);
            if ($email != NULL) {
                $cart->setEMail($email);
            }

            $message = $app->input->getString('message', NULL);
            if ($message != NULL) {
                $cart->setMessage($message);
            }

            $user->setParam(EventgalleryLibraryAddress::USER_ADDRESS_BASIC_EMAIL_KEY, $cart->getEMail());
            $user->setParam(EventgalleryLibraryAddress::USER_ADDRESS_BASIC_PHONE_KEY, $cart->getPhone());
            //$user->setParam(EventgalleryLibraryAddress::USER_ADDRESS_BASIC_MESSAGE_KEY, $cart->getMessage());
            $saveuser = true;
        }

        if ($skipAddressForms) {
            $cart->setBillingAddress(null);
            $cart->setShippingAddress(null);
        } else {

            /**
             * ADDRESS UPDATE
             * @var EventgalleryLibraryFactoryAddress $addressFactory
             */
            $addressFactory = EventgalleryLibraryFactoryAddress::getInstance();

            /**
             * @var JForm $billingform
             */
            $billingform = JForm::getInstance('billing', $xmlPath . 'billingaddress.xml');
            $billingform->bind($app->input->post->getArray());
            $billingvalidation = $billingform->validate($app->input->post->getArray());
            if ($billingvalidation !== true) {
                $errors = array_merge($errors, $billingform->getErrors());
            } else {

                $billingdata = array();
                foreach ($billingform->getFieldset() as $field) {
                    $billingdata[$field->name] = $field->value;
                }

                /**
                 * @var EventgalleryLibraryAddress $billingAddress
                 */
                $billingAddress = $cart->getBillingAddress();
                if ($billingAddress != NULL) {
                    $billingdata['id'] = $billingAddress->getId();
                }

                $billingAddress = $addressFactory->createStaticAddress($billingdata, 'billing_');

                $cart->setBillingAddress($billingAddress);
                $user->setParam(EventgalleryLibraryAddress::USER_ADDRESS_BILLING_KEY, json_encode($billingdata));

                $shiptodifferentaddress = $app->input->getString('shiptodifferentaddress', NULL);
                if ($shiptodifferentaddress == 'true') {
                    /**
                     * @var JForm $shippingform
                     */
                    $shippingform = JForm::getInstance('shipping', $xmlPath . 'shippingaddress.xml');
                    $shippingform->bind($app->input->post->getArray());
                    $shippingvalidation = $shippingform->validate($app->input->post->getArray());
                    if ($shippingvalidation !== true) {
                        $errors = array_merge($errors, $shippingform->getErrors());
                    } else {
                        $shippingdata = array();
                        foreach ($shippingform->getFieldset() as $field) {
                            $shippingdata[$field->name] = $field->value;
                        }

                        $shippingAddress = $cart->getShippingAddress();
                        if ($shippingAddress != NULL && $shippingAddress->getId() != $billingAddress->getId()) {
                            $shippingdata['id'] = $shippingAddress->getId();
                        }

                        /**
                         * @var EventgalleryLibraryAddress $shippingAddress
                         */
                        $shippingAddress = $addressFactory->createStaticAddress($shippingdata, 'shipping_');

                        $cart->setShippingAddress($shippingAddress);
                        $user->setParam(EventgalleryLibraryAddress::USER_ADDRESS_SHIPPING_KEY, json_encode($shippingdata));
                        $saveuser = true;
                    }
                } elseif ($shiptodifferentaddress == 'false') {
                    $cart->setShippingAddress($billingAddress);
                    $user->setParam(EventgalleryLibraryAddress::USER_ADDRESS_SHIPPING_KEY, json_encode($billingdata));
                    $saveuser = true;
                }
            }
        }

        if ($saveuser) {
            $user->save(true);
        }
        return $errors;
    }

    /**
     * Calculates the current cart,
     * removes invalue shipping/payment methods
     */
    public function calculateCart()
    {
        $cart = $this->getCart();

        // check shipping and payment methods and remove them if they are invalid.
        if ($cart->getShippingMethod() && $cart->getShippingMethod()->isEligible($cart)==false) {
            $cart->setShippingMethod(null);
        }

        if ($cart->getPaymentMethod() && $cart->getPaymentMethod()->isEligible($cart)==false) {
            $cart->setPaymentMethod(null);
        }


        /**
         * @var  EventgalleryLibraryCommonMoney $subtotal
         */
        $subtotal = $this->_calculateSubTotal($cart);
        $cart->setSubTotal($subtotal);

        // update the price and tax for the shipping/payment/surcharge
        /**
         * @var EventgalleryLibraryServicelineitem $servicelineitem
         */
        foreach ($cart->getServiceLineItems() as $servicelineitem) {
            $servicelineitem->recalculate($cart);
        }

        /**
         * @var EventgalleryLibraryManagerSurcharge $surchargeMgr
         */
        $surchargeMgr = EventgalleryLibraryManagerSurcharge::getInstance();
        $cart->setSurcharge($surchargeMgr->calculateSurcharge($cart));

        /**
         * @var  float $total
         */
        $total = $subtotal->getAmount();
        if ($cart->getSurcharge() != NULL) {
            $total += $cart->getSurchargeServiceLineItem()->getPrice()->getAmount();
        }
        if ($cart->getShippingMethod() != NULL) {
            $total += $cart->getShippingMethodServiceLineItem()->getPrice()->getAmount();
        }
        if ($cart->getPaymentMethod() != NULL) {
            $total += $cart->getPaymentMethodServiceLineItem()->getPrice()->getAmount();
        }

        $cart->setTotal(new EventgalleryLibraryCommonMoney($total, $subtotal->getCurrency()));

    }

    /**
     * @param $cart EventgalleryLibraryCart
     * @return EventgalleryLibraryCommonMoney
     */
    private function _calculateSubTotal($cart) {

        /**
         * Update quantities if necessary
         */

        $lineitems = $cart->getLineItems();
        foreach($lineitems as $lineitem) {
            /**
             * @var EventgalleryLibraryImagelineitem $lineitem
             */
            if ($lineitem->getImageType() != null) {
                $maxOrderQuantity = $lineitem->getImageType()->getMaxOrderQuantity();
                if ($maxOrderQuantity != 0 && $maxOrderQuantity < $lineitem->getQuantity()) {
                    $lineitem->setQuantity($lineitem->getImageType()->getMaxOrderQuantity());
                }
            }
        }

        /**
         * @var  float $subtotal
         */
        $subtotal = 0;
        /**
         * @var EventgalleryLibraryImagelineitem $lineitem
         * @var EventgalleryLibraryImagetype $imagetype
         */
        $imagetypes = $cart->getUsedImageTypes();

        foreach($imagetypes as $imagetype) {

            if ($imagetype->getScalePriceScope() == EventgalleryLibraryImagetype::SCALEPRICE_SCOPE_IMAGETYPE
             && $imagetype->getScalePriceType()  == EventgalleryLibraryImagetype::SCALEPRICE_TYPE_DISCOUNT) {

                $lineitems = $cart->getLineItemsByImageType($imagetype);
                $quantity = 0;
                foreach ($lineitems as $lineitem) {
                    $quantity += $lineitem->getQuantity();
                }

                $price = $imagetype->getPrice($quantity);

                foreach ($lineitems as $lineitem) {
                    $lineitem->setSinglePrice($price);
                }

            } elseif ($imagetype->getScalePriceScope() == EventgalleryLibraryImagetype::SCALEPRICE_SCOPE_LINEITEM
                && $imagetype->getScalePriceType()  == EventgalleryLibraryImagetype::SCALEPRICE_TYPE_DISCOUNT) {

                $lineitems = $cart->getLineItemsByImageType($imagetype);

                foreach ($lineitems as $lineitem) {
                    $price = $imagetype->getPrice($lineitem->getQuantity());
                    $lineitem->setSinglePrice($price);
                }

            } elseif ($imagetype->getScalePriceScope() == EventgalleryLibraryImagetype::SCALEPRICE_SCOPE_IMAGETYPE
                && $imagetype->getScalePriceType()  == EventgalleryLibraryImagetype::SCALEPRICE_TYPE_SINGLEPACKAGE) {

                $lineitems = $cart->getLineItemsByImageType($imagetype);
                $quantity = 0;
                foreach ($lineitems as $lineitem) {
                    $quantity += $lineitem->getQuantity();
                }

                $price = $imagetype->getSinglePackagePrice($quantity);
                $zeroPrice = new EventgalleryLibraryCommonMoney(0, $price->getCurrencyCode());

                foreach ($lineitems as $lineitem) {
                    $lineitem->setPrice($zeroPrice);
                }

                $lineitems[0]->setPrice($price);

            } elseif ($imagetype->getScalePriceScope() == EventgalleryLibraryImagetype::SCALEPRICE_SCOPE_LINEITEM
                && $imagetype->getScalePriceType()  == EventgalleryLibraryImagetype::SCALEPRICE_TYPE_SINGLEPACKAGE) {

                $lineitems = $cart->getLineItemsByImageType($imagetype);

                foreach ($lineitems as $lineitem) {
                    $price = $imagetype->getSinglePackagePrice($lineitem->getQuantity());
                    $lineitem->setPrice($price);
                }

            } elseif ($imagetype->getScalePriceScope() == EventgalleryLibraryImagetype::SCALEPRICE_SCOPE_IMAGETYPE
                && $imagetype->getScalePriceType()  == EventgalleryLibraryImagetype::SCALEPRICE_TYPE_PACKAGE) {

                $lineitems = $cart->getLineItemsByImageType($imagetype);
                $quantity = 0;
                foreach ($lineitems as $lineitem) {
                    $quantity += $lineitem->getQuantity();
                }

                $price = $imagetype->getPackagePrice($quantity);
                $zeroPrice = new EventgalleryLibraryCommonMoney(0, $price->getCurrencyCode());

                foreach ($lineitems as $lineitem) {
                    $lineitem->setPrice($zeroPrice);
                }

                $lineitems[0]->setPrice($price);

            }
            // this is our default behavior. 
            //elseif ($imagetype->getScalePriceScope() == EventgalleryLibraryImagetype::SCALEPRICE_SCOPE_LINEITEM
            //    && $imagetype->getScalePriceType()  == EventgalleryLibraryImagetype::SCALEPRICE_TYPE_PACKAGE) {
            else {
                $lineitems = $cart->getLineItemsByImageType($imagetype);

                foreach ($lineitems as $lineitem) {
                    $price = $imagetype->getPackagePrice($lineitem->getQuantity());
                    $lineitem->setPrice($price);
                }

            }
        }

        // now apply flat prices if configure
        foreach ($imagetypes as $imagetype) {
            $flatprice = $imagetype->getFlatPrice();
            if ($flatprice->getAmount()>0) {

                $lineitems = $cart->getLineItemsByImageType($imagetype);
                $total = 0;

                foreach ($lineitems as $lineitem) {
                    $total += $lineitem->getPrice()->getAmount();
                }

                if ($total > $flatprice->getAmount()) {

                    $zeroPrice = new EventgalleryLibraryCommonMoney(0, $price->getCurrencyCode());

                    foreach ($lineitems as $lineitem) {
                        $lineitem->setPrice($zeroPrice);
                    }

                    $lineitems[0]->setPrice($flatprice);
                }
            }
        }


        $subtotalCurrency = "";

        foreach ($cart->getLineItems() as $lineitem) {
            $subtotal += $lineitem->getPrice()->getAmount();
            $subtotalCurrency = $lineitem->getPrice()->getCurrency();
        }

        return new EventgalleryLibraryCommonMoney($subtotal, $subtotalCurrency);
    }

}
