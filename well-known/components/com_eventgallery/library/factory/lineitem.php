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

abstract class EventgalleryLibraryFactoryLineitem extends EventgalleryLibraryFactoryFactory
{
    /**
     * name of the sql table like #__foobar
     */
    protected $_tablename = null;

    /**
     * Determines a lineitem by ID
     *
     * @param $id
     * @return mixed
     */
    public function getLineItemById($id) {}


    /**
     * delete a line item
     *
     * @param $containerId
     * @param $id
     */
    public function deleteLineItem($containerId, $id)
    {
        $db = $this->db;
        $query = $db->getQuery(true);
        $query->delete($db->qn($this->_tablename));
        $query->where("id=" . $db->quote($id));
        $query->where("lineitemcontainerid=" . $db->quote($containerId));
        $db->setQuery($query);
        $db->execute();
    }

}