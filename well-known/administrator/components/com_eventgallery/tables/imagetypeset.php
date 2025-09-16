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


class EventgalleryTableImagetypeset extends JTable
{

    public $id;
    public $name;
    public $description;
    public $note;
    public $default;
    public $published;
    public $ordering;
    public $modified;
    public $created;

    /**
     * Constructor
     * @param JDatabaseDriver $db
     */

    function __construct(&$db)
    {
        parent::__construct('#__eventgallery_imagetypeset', 'id', $db);
    }
}