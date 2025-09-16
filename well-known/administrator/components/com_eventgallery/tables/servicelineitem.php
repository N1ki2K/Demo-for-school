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


class EventgalleryTableServicelineitem extends JTable
{
    public $id;
    public $methodid;
    public $lineitemcontainerid;
    public $type;
    public $quantity;
    public $name;
    public $displayname;
    public $description;
    public $data;
    public $taxrate;
    public $price;
    public $singleprice;
    public $currency;
    public $ordering;
    public $modified;
    public $created;

    /**
     * Constructor
     * @param JDatabaseDriver $db
     */

	function __construct( &$db ) {
		parent::__construct('#__eventgallery_servicelineitem', 'id', $db);
	}
}
