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

require_once('methods.php');

class EventgalleryModelPaymentmethods extends EventgalleryModelMethods
{

    protected $table_name = '#__eventgallery_paymentmethod';

    function __construct()
    {
        $this->methodFactory =  EventgalleryLibraryFactoryPaymentmethod::getInstance();
        parent::__construct();
    }
}
