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

class EventgalleryLibraryManagerEmailtemplate extends  EventgalleryLibraryManagerManager
{

    /** Holds the available keys for now*/
    private $_values = array(
            // mail for new order events
            'new_order'     => 'COM_EVENTGALLERY_EMAILTEMPLATE_EMAIL_NEW_ORDER',
            // mail for paid order events.
            'paid_order'    => 'COM_EVENTGALLERY_EMAILTEMPLATE_EMAIL_PAID_ORDER',
            // mail for shipped order events.
            'shipped_order'  => 'COM_EVENTGALLERY_EMAILTEMPLATE_EMAIL_SHIPPED_ORDER'
        );

    /**
    * return a hash which contains the key and the translation key for an email template key.
    */
    public function getEmailtemplateKeys() {
        return $this->_values;
    }


    /**
     * returns the display name as a localization key for a given key.
     * @param $key
     * @return string
     */
    public function getEmailtemplateKeyDisplayName($key) {

        if (isset($this->_values[$key])) {
            return $this->_values[$key];
        }

        return "";
    }

    /**
     * Send out a mail based on aa email template. Will replace the placeholders in the template as well based on the given data.
     *
     * @param $key
     * @param $language
     * @param $publishedOnly
     * @param $data array Array which holds the data structure
     * @param $to array|string the receiver of this mail, array is email, name
     * @param $sendCopyToAdmins boolean defines if we send the same mail to the admin
     * @return mixed|string
     */
    public function sendMail($key, $language, $publishedOnly, $data, $to, $sendCopyToAdmins) {
        /**
         * @var EventgalleryLibraryFactoryEmailtemplate $emailtemplateFactory
         */
        $emailtemplateFactory = EventgalleryLibraryFactoryEmailtemplate::getInstance();
        $emailtemplate = $emailtemplateFactory->getEmailtemplateByKey($key, $language, $publishedOnly);

        if (null == $emailtemplate) {

            $subject = '';
            $body = '';
            $attachments = Array();

        } else {
            $subject = $emailtemplate->getSubject();
            $body = $emailtemplate->getBody();
            $attachments = $emailtemplate->getAttachments();
        }

        if (strlen(trim($subject))==0) {
            $subject = $this->getDefaultSubject($key);
        }

        if (strlen(trim($body))==0) {
            $body = $this->getDefaultBody($key);
        }


        return $this->sendMailBySubjectAndBody($subject, $body, $data, $attachments, $to, $sendCopyToAdmins);
    }

    /**
     * Send out a mail based on aa email template. Will replace the placeholders in the template as well based on the given data.
     *
     * @param int $id
     * @param $data array Array which holds the data structure
     * @param $to array|string the receiver of this mail, array is email, name
     * @param $sendCopyToAdmins boolean defines if we send the same mail to the admin
     * @internal param int $id ID of the email template
     * @return boolean
     */
    public function sendMailById($id, $data, $to, $sendCopyToAdmins = true)
    {
        /**
         * @var EventgalleryLibraryFactoryEmailtemplate $emailtemplateFactory
         */
        $emailtemplateFactory = EventgalleryLibraryFactoryEmailtemplate::getInstance();
        $emailtemplate = $emailtemplateFactory->getEmailtemplateById($id);

        $subject = $emailtemplate->getSubject();
        $body = $emailtemplate->getBody();
        $attachments = $emailtemplate->getAttachments();

        if (strlen(trim($subject))==0) {
            $subject = $this->getDefaultSubject($emailtemplate->getKey());
        }

        if (strlen(trim($body))==0) {
            $body = $this->getDefaultBody($emailtemplate->getKey());
        }

         return $this->sendMailBySubjectAndBody($subject, $body, $data, $attachments, $to, $sendCopyToAdmins);
    }

    /**
     * sends a mail using the given data.
     *
     * @param $subject
     * @param $body
     * @param $data
     * @param $to
     * @param $sendCopyToAdmins
     * @return mixed|string
     */
    public function sendMailBySubjectAndBody($subject, $body, $data, $attachments, $to, $sendCopyToAdmins) {
        /**
         * @var Joomla\Registry\Registry $config
         * @var Joomla\Registry\Registry $params
         */
        $config = JFactory::getConfig();
        $mailer = JFactory::getMailer();
        $params = JComponentHelper::getParams('com_eventgallery');

        $subject = $this->populate($subject, $data);
        $body = $this->populate($body, $data);

        $mailer->setSubject(
            $subject
        );

        $mailer->isHtml(true);
        $mailer->Encoding = 'base64';
        $mailer->setBody($body);

        foreach($attachments as $attachment) {
            $filepath = JPATH_ROOT . '/images/' . $attachment;
            if (file_exists($filepath)) {
                $mailer->addAttachment($filepath);
            }
        }

        // Customer Mail
        $sender = array(
            $config->get( 'mailfrom' ),
            $config->get( 'fromname' ) );

        $mailer->setSender($sender);

        if (is_array($to) && count($to)==2) {
            $mailer->addRecipient($to[0], $to[1]);
        } else {
            $mailer->addRecipient($to);
        }

        $send = $mailer->Send();

        if ($send !== true) {
            return $mailer->ErrorInfo;
        }

        // Admin Mail
        if (!$sendCopyToAdmins) {
            return true;
        }

        $mailer->clearReplyTos();
        $mailer->clearAllRecipients();
        $mailer->clearAddresses();
        $mailer->clearBCCs();
        $mailer->clearCCs();

        if (is_array($to) && count($to)==2) {
            $mailer->addReplyTo($to[0], $to[1]);
        } else {
            $mailer->addReplyTo($to);
        }

        $userids = JAccess::getUsersByGroup($params->get('admin_usergroup', 8));

        foreach ($userids as $userid) {
            $user = JUser::getInstance($userid);
            if ($user->sendEmail==1) {
                $mailadresse = JMailHelper::cleanAddress($user->email);
                $mailer->addRecipient($mailadresse);
            }
        }

        $send = $mailer->Send();

        if ($send !== true) {
            return $mailer->ErrorInfo;
        }

        return $send;

    }

    /**
     * Renders the placeholders in a string with the given data.
     *
     * @param $text string the input string
     * @param $data array an array containing the data
     * @return string
     */
    public function populate($text, $data) {
        $smarty = new Smarty();

        $smarty->debugging = false;
        $smarty->caching = false;
        $smarty->setCacheDir(JPATH_ROOT.DIRECTORY_SEPARATOR.'cache/com_eventgallery_template_cache');
        $smarty->setCompileDir(JPATH_ROOT.DIRECTORY_SEPARATOR.'cache/com_eventgallery_template_compile');

        $smarty->assign("data", $data);

        $renderedText = $smarty->fetch('string:' . $text);

        return $renderedText;
    }



    /**
     * @param $key string the mail template key
     * @returns string the subject template
     */
    public function getDefaultSubject($key) {
        return $this->getTemplateFile($key, 'subject');
    }

    /**
     * @param $key string the mail template key
     * @returns string the subject template
     */
    public function getDefaultBody($key) {
        return $this->getTemplateFile($key, 'body');
    }

    /**
     * @param $key string the mail template key
     * @return array the demo data array
     */
    public function getDemoData($key) {
        return json_decode($this->getTemplateFile($key, 'demodata'));
    }

    /**
     * @param $key string the mail template key
     * @param $type string the type of the template: subject|body
     * @return string
     */
    private function getTemplateFile($key, $type) {
        $path = JPATH_ROOT.'/components/com_eventgallery/views/mail/tmpl/'.$key.'_'.$type.'.tpl';

        if (file_exists($path)) {
            return file_get_contents($path);
        }

        return "";
    }

    /**
     * Transforms the order object into an array holding data we can use in a email template
     *
     * @param $order EventgalleryLibraryOrder
     * @return array an array containing the order data
     * @throws Exception
     */
    public function createOrderData($order) {

        /**
         * @var \Joomla\Registry\Registry $params
         */
        $params = JComponentHelper::getParams('com_eventgallery');

        $config = JFactory::getConfig();
        $sslmode = $config->get('force_ssl', 0) == 2 ? 1 : (2);

        $orderData = Array(
            "message" => $order->getMessage(),
            "phone" => $order->getPhone(),
            "email" => $order->getEMail(),
            "documentnumber" => $order->getDocumentNumber(),
            "date" => $order->getCreationDate(),
            "lineitemscount" => $order->getLineItemsCount(),
            "lineitemstotalcount" => $order->getLineItemsTotalCount(),
            "subtotal" => (string)$order->getSubTotal(),
            "total" => (string)$order->getTotal(),
        );

        if ($params->get('show_vat', 1)==1) {
            $orderData['tax'] = (string)$order->getTax();
        }

        if ($order->getBillingAddress() != null) {
            $orderData['billingaddress'] = Array(
                "firstname" => $order->getBillingAddress()->getFirstName(),
                "lastname" => $order->getBillingAddress()->getLastName(),
                "address1" => $order->getBillingAddress()->getAddress1(),
                "address2" => $order->getBillingAddress()->getAddress2(),
                "address3" => $order->getBillingAddress()->getAddress3(),
                "zip" => $order->getBillingAddress()->getZip(),
                "city" => $order->getBillingAddress()->getCity(),
                "state" => EventgalleryLibraryCommonGeoobjects::getStateName($order->getBillingAddress()->getState()),
                "country" => EventgalleryLibraryCommonGeoobjects::getCountryName($order->getBillingAddress()->getCountry())
            );
        }

        if ($order->getShippingAddress() != null) {
            $orderData['shippingaddress'] = array(
                "firstname" => $order->getShippingAddress()->getFirstName(),
                "lastname" => $order->getShippingAddress()->getLastName(),
                "address1" => $order->getShippingAddress()->getAddress1(),
                "address2" => $order->getShippingAddress()->getAddress2(),
                "address3" => $order->getShippingAddress()->getAddress3(),
                "zip" => $order->getShippingAddress()->getZip(),
                "city" => $order->getShippingAddress()->getCity(),
                "state" => EventgalleryLibraryCommonGeoobjects::getStateName($order->getShippingAddress()->getState()),
                "country" => EventgalleryLibraryCommonGeoobjects::getCountryName($order->getShippingAddress()->getCountry())
            );
        }


        if (null != $order->getSurchargeServiceLineItem()) {
            $orderData['surcharge'] = Array(
                "name" => $order->getSurchargeServiceLineItem()->getDisplayName(),
                "description" => $order->getSurchargeServiceLineItem()->getDescription(),
                "price" => (string)$order->getSurchargeServiceLineItem()->getPrice(),
                "content" => $order->getSurchargeServiceLineItem()->getMethod()->getMethodConfirmContent($order, true)
            );
        }

        if (null != $order->getShippingMethodServiceLineItem()) {
            $orderData['shipping'] = Array(
                "name" => $order->getShippingMethodServiceLineItem()->getDisplayName(),
                "description" => $order->getShippingMethodServiceLineItem()->getDescription(),
                "price" => (string)$order->getShippingMethodServiceLineItem()->getPrice(),
                "content" => $order->getShippingMethodServiceLineItem()->getMethod()->getMethodConfirmContent($order, true)
            );
        }

        if (null != $order->getPaymentMethod()) {
            $orderData['payment'] = Array(
                "name" => $order->getPaymentMethodServiceLineItem()->getDisplayName(),
                "description" => $order->getPaymentMethodServiceLineItem()->getDescription(),
                "price" => (string)$order->getPaymentMethodServiceLineItem()->getPrice(),
                "content" => $order->getPaymentMethodServiceLineItem()->getMethod()->getMethodConfirmContent($order, true)
            );
        }

        $lineitems = Array();
        /**
         * @var EventgalleryLibraryImagelineitem $lineitem
         */
        foreach($order->getLineItems() as $lineitem) {
            $lineitemData = Array(
                "quantity"  => $lineitem->getQuantity(),
                "price" => (string)$lineitem->getPrice(),
                "singleprice" => (string)$lineitem->getSinglePrice(),
                "foldername" => $lineitem->getFolderName(),
                "filename" => $lineitem->getFileName(),
                "buyernote" => $lineitem->getBuyerNote(),
                "imagetype" => Array("name"  => $lineitem->getImageType()->getDisplayName()),
                "imageurl" =>  $lineitem->getFile()->getImageUrl(NULL, NULL, true),
                "thumburl" => $lineitem->getMailThumbUrl()

        );
            array_push($lineitems, $lineitemData);
        }

        $orderData['imagelineitems'] = $lineitems;

        return $orderData;
    }

}