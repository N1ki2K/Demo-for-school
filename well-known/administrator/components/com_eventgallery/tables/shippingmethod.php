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


class EventgalleryTableShippingmethod extends JTable
{

    public $id;
    public $name;
    public $supportsdigital;
    public $displayname;
    public $description;
    public $data;
    public $classname;
    public $taxrate;
    public $price;
    public $price_percentaged;
    public $currency;
    public $published;
    public $default;
    public $ordering;
    public $modified;
    public $created;
    public $needsaddressdata;

    /**
     * Constructor
     * @param JDatabaseDriver $db
     */

	function __construct( &$db ) {
		parent::__construct('#__eventgallery_shippingmethod', 'id', $db);
	}
}
