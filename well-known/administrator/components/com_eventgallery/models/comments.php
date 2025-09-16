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

class EventgalleryModelComments extends JModelList
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
		$query->from('#__eventgallery_comment');
		$query->where($this->_buildQueryWhere());
		
		$query->order('date desc');
		/*
		$query = ' SELECT *
			       FROM #__eventgallery_comment '
	            .$this->_buildQueryWhere().' '
	            .$this->_buildQueryOrderBy()
		;
	    */
		
		return $query;
	}
	
	
	function _buildQueryWhere()
	{
	    $db		 = $this->getDbo();
	    $filter = $this->getState('com_eventgallery.comments.filter');

        if (is_array($filter)) {
            $filter = implode(";",$filter);
        }

	    $where= null;
	    if (strlen($filter)>0)
	    {
	        $where = preg_split('/;/',$filter);
    	    $newWhere = Array();
    	    foreach ($where as $line)
    	    {	        
    	        if (strpos($line,'=')>0)
    	        {    	            
    	            $temp = preg_split('/=/',$line,2);
    	            $line = $db->qn($temp[0])."=". $db->q($temp[1]);
    	        }
    	        if (strlen($line)>0)
    	        {
                    array_push($newWhere, $line);
    	        }
    	    }
    	    $where = $newWhere;
	    }
	     
	    return (count($where)) ? implode(' AND ', $where) : '1=1';
	}

	
	
	
	
}
