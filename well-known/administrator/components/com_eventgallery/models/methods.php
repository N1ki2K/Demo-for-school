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

abstract class EventgalleryModelMethods extends JModelList
{

    /**
     * @var EventgalleryLibraryFactoryMethod
     */
    protected $methodFactory = null;
    protected $context = '';
    protected $table_name = null;

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
		$query->from($db->qn($this->table_name));
		$query->order('ordering');

		return $query;
	}


    protected function _getList($query, $limitstart = 0, $limit = 0)
    {
        $this->_db->setQuery($query, $limitstart, $limit);
        $result = $this->_db->loadObjectList();

        $objects = array();
        foreach($result as $item) {
           if(class_exists($item->classname)) {
                array_push($objects, $this->methodFactory->getMethodById($item->id, false));
           } else {
               array_push($objects, new EventgalleryLibraryMethodsDummy($item));
               $app = JFactory::getApplication();
               $app->enqueueMessage(JText::sprintf('COM_EVENTGALLERY_METHOD_CLASSNAME_INVALID',$item->id, $item->name, $item->classname), 'error');
           }
        }

        return $objects;
    }
}
