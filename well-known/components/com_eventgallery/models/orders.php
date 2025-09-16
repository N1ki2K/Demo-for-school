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

class EventgalleryModelOrders extends JModelList
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

        $user = JFactory::getUser();
        
		// Create a new query object.
		$db = $this->getDbo();
		$query = $db->getQuery(true);
		
		$query->select('*');
		$query->from('#__eventgallery_order');
        $query->where('userid='.$db->quote($user->id));
        if ($user->guest) {
            $query->where('1=2');
        }
		$query->order('created desc');

		return $query;
	}

    function getItems() {
        $items = parent::getItems();
        $result=array();
        /**
         * @var EventgalleryLibraryFactoryOrder $orderFactory
         */
        $orderFactory = EventgalleryLibraryFactoryOrder::getInstance();
        foreach($items as $item) {
            $result[] = $orderFactory->getOrderById($item->id);
        }
        return $result;
    }
}
