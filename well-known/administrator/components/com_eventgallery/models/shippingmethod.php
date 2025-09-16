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

class EventgalleryModelShippingmethod extends EventgalleryModelMethod
{
    protected $table_type = 'shippingmethod';
    protected $table_name = '#__eventgallery_shippingmethod';
    protected $form_name = 'com_eventgallery.shippingmethod';
    protected $form_source ='shippingmethod';

    function __construct()
    {
        $this->methodFactory =  EventgalleryLibraryFactoryShippingmethod::getInstance();
        parent::__construct();
    }

}
