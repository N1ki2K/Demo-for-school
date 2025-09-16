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

class EventgalleryModelWatermarks extends JModelList
{

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
		$query->from('#__eventgallery_watermark');
		
		$query->order('ordering');
		
		
		return $query;
	}

	protected function _getList($query, $limitstart = 0, $limit = 0)
    {
        /**
         * @var EventgalleryLibraryFactoryWatermark $watermarkFactory
         */

        $watermarkFactory = EventgalleryLibraryFactoryWatermark::getInstance();


        $this->_db->setQuery($query, $limitstart, $limit);
        $result = $this->_db->loadObjectList();

        $objects = array();
        foreach($result as $item) {
           array_push($objects, $watermarkFactory->getWatermarkById($item->id));
        }

        return $objects;
    }
	
}
