<?php

/**
 * @package     Sven.Bluege
 * @subpackage  com_eventgallery
 *
 * @copyright   Copyright (C) 2005 - 2013 Sven Bluege All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

// Check to ensure this file is included in Joomla!
defined('_JEXEC') or die('Restricted access');

jimport('joomla.form.formfield');

// The class name must always be the same as the filename (in camel case)
class JFormFieldPaymentstatustypes extends JFormFieldOrderstatustypes
{

    //The field class must know its own type through the variable $type.
    protected $type = 'paymentstatustypes';
    protected $currentOrderstatusId = EventgalleryLibraryOrderstatus::TYPE_PAYMENT;

}