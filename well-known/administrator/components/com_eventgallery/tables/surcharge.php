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


class EventgalleryTableSurcharge extends JTable
{

    public $id;
    public $name;
    public $displayname;
    public $description;
    public $data;
    public $classname;
    public $taxrate;
    public $price;
    public $price_percentaged;
    public $currency;
    public $published;
    public $ordering;
    public $default;
    public $rule;
    public $modified;
    public $created;

    /**
     * Constructor
     * @param JDatabaseDriver $db
     */

	function __construct( &$db ) {
		parent::__construct('#__eventgallery_surcharge', 'id', $db);
	}
}
