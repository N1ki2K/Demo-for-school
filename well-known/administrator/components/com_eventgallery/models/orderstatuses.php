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

jimport( 'joomla.application.component.modellist' );

class EventgalleryModelOrderstatuses extends JModelList
{

    protected $context = '';

	function __construct()
	{
	    parent::__construct();
	}
	
	/**
	 * Returns the query
	 * @return string The query to be used to retrieve the rows from the database
	 */
	function getListQuery()
	{

		// Create a new query object.
		$db = $this->getDbo();
		$query = $db->getQuery(true);
		
		$query->select('*');
		$query->from('#__eventgallery_orderstatus');
		$query->order('type');
		$query->order('ordering');

		return $query;
	}


    protected function _getList($query, $limitstart = 0, $limit = 0)
    {
        /**
         * @var EventgalleryLibraryFactoryOrderstatus $orderStatusFactory
         */

        $orderStatusFactory = EventgalleryLibraryFactoryOrderstatus::getInstance();

        $this->_db->setQuery($query, $limitstart, $limit);
        $result = $this->_db->loadObjectList();

        $objects = array();
        foreach($result as $item) {
           array_push($objects, $orderStatusFactory->getOrderStatusById($item->id));
        }

        return $objects;
    }
}
