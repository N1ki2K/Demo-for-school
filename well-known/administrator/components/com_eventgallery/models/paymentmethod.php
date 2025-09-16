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

require_once('method.php');

class EventgalleryModelPaymentmethod extends EventgalleryModelMethod
{
    protected $table_type = 'paymentmethod';
    protected $table_name = '#__eventgallery_paymentmethod';
    protected $form_name = 'com_eventgallery.paymentmethod';
    protected $form_source ='paymentmethod';

    function __construct()
    {
        $this->methodFactory =  EventgalleryLibraryFactoryPaymentmethod::getInstance();
        parent::__construct();
    }

}
