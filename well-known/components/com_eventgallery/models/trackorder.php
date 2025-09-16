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

jimport('joomla.application.component.modelform');

class EventgalleryModelTrackorder extends JModelForm
{
    /**
     * Method to get the login form.
     *
     * The base form is loaded from XML and then an event is fired
     * for users plugins to extend the form with extra fields.
     *
     * @param   array  $data        An optional array of data for the form to interogate.
     * @param   boolean $loadData   True if the form is to load its own data (default case), false if not.
     * @return  JForm   A JForm object on success, false on failure
     * @since   1.6
     */
    public function getForm($data = array(), $loadData = true)
    {
        // Get the form.
        $form = $this->loadForm('com_eventgallery.trackorder', 'trackorder', array('load_data' => $loadData));
        if (empty($form))
        {
            return false;
        }

        return $form;
    }

    public function getItem($orderid = null, $email = null) {
        /**
         * @var EventgalleryLibraryManagerOrder $orderMgr

         */
        $app = JFactory::getApplication();

        if ($orderid == null) {
            $orderid = $app->input->getString('orderid', '-1');
        }

        if ($email == null) {
            $email = $app->input->getString('email', '-1');
        }

        $orderMgr = EventgalleryLibraryManagerOrder::getInstance();
        $order = $orderMgr->getOrderByDocumentNo($orderid);
        if (null == $order || $order->getEMail()!=$email) {
            return null;
        }

        return $order;
    }

    /**
     * Method to validate the form data.
     *
     * @param   JForm   $form   The form to validate against.
     * @param   array   $data   The data to validate.
     * @param   string  $group  The name of the field group to validate.
     *
     * @return  mixed  Array of filtered data if valid, false otherwise.
     *
     * @see     JFormRule
     * @see     JFilterInput
     * @since   12.2
     */
    public function validate($form, $data, $group = null)
    {

        if (strlen($data['orderid'])==0 || strlen($data['email'])==0) {
            return false;
        }

        /**
         * @var EventgalleryLibraryOrder $order
         */
        $order = $this->getItem($data['orderid'], $data['email']);
        if ($order==null) {
            return false;
        }

        return $data;
    }

}
