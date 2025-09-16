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

    protected $context = 'orders';

    /**
     * Constructor.
     *
     * @param   array $config An optional associative array of configuration settings.
     * @see     JController
     * @since   1.6
     */
    public function __construct($config = array())
    {
        if (empty($config['filter_fields']))
        {
            $config['filter_fields'] = array(
                'id',
                'documentno',
                'total',
                'orderstatusid',
                'paymentstatusid',
                'shippingstatusid'
            );
        }
        parent::__construct($config);
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
		$query->from('#__eventgallery_order');

        // Filter by order status.
        $orderstatusid = $this->getState('filter.orderstatus');
        if ($orderstatusid && $orderstatusid!='*')
        {
            $query->where('orderstatusid = '.(int) $orderstatusid);
        }

        // Filter by payment status.
        $paymentstatusid = $this->getState('filter.paymentstatus');
        if ($paymentstatusid && $paymentstatusid!='*')
        {
            $query->where('paymentstatusid = '.(int) $paymentstatusid);
        }

        // Filter by shipping status.
        $shippingstatusid = $this->getState('filter.shippingstatus');
        if ($shippingstatusid && $shippingstatusid!='*')
        {
            $query->where('shippingstatusid = '.(int) $shippingstatusid);
        }

        // Filter by search in title
        $search = $this->getState('filter.search');
        if (!empty($search))
        {
            if (stripos($search, 'id:') === 0)
            {
                $query->where('id = '. $db->escape(substr($search, 3)));
            } else {
                $search = $db->quote('%'.$db->escape($search, true).'%');
                $query->where('(documentno LIKE '.$search.' OR email LIKE '.$search.' OR message LIKE '.$search.')');
            }
        }


        // Add the list ordering clause.
        $orderCol	= $this->state->get('list.ordering');
        $orderDirn	= $this->state->get('list.direction');

        if ($orderCol == 'documentno') {
	        $query->order('cast('.$db->escape($orderCol).' as unsigned) '.$db->escape($orderDirn));
	    } else {
	        $query->order($db->escape($orderCol.' '.$orderDirn));
	    }



		return $query;
	}


    protected function _getList($query, $limitstart = 0, $limit = 0)
    {
        /**
         * @var EventgalleryLibraryFactoryOrder $orderFactory
         */
        $orderFactory = EventgalleryLibraryFactoryOrder::getInstance();

        $this->_db->setQuery($query, $limitstart, $limit);
        $result = $this->_db->loadObjectList();

        $objects = array();
        foreach($result as $item) {
           array_push($objects, $orderFactory->getOrderById($item->id));
        }

        return $objects;
    }

    /**
     * Method to auto-populate the model state.
     *
     * Note. Calling getState in this method will result in recursion.
     *
     * @since   1.6
     * @param null $ordering
     * @param null $direction
     */
    protected function populateState($ordering = null, $direction = null)
    {
        // set the search state
        $search = $this->getUserStateFromRequest($this->context.'.filter.search', 'filter_search');
        $this->setState('filter.search', $search);
        // Load the filter state.
        $search = $this->getUserStateFromRequest($this->context.'.filter.orderstatus', 'filter_orderstatus');
        $this->setState('filter.orderstatus', $search);
        $search = $this->getUserStateFromRequest($this->context.'.filter.paymentstatus', 'filter_paymentstatus');
        $this->setState('filter.paymentstatus', $search);
        $search = $this->getUserStateFromRequest($this->context.'.filter.shippingstatus', 'filter_shippingstatus');
        $this->setState('filter.shippingstatus', $search);


        // List state information.
        parent::populateState('documentno', 'desc');
    }

    /**
     * Method to get a store id based on model configuration state.
     *
     * This is necessary because the model is used by the component and
     * different modules that might need different sets of data or different
     * ordering requirements.
     *
     * @param   string  $id	A prefix for the store id.
     * @return  string  A store id.
     * @since   1.6
     */
    protected function getStoreId($id = '')
    {
        // Compile the store id.
        $id .= ':' . $this->getState('filter.search');
        $id .= ':' . $this->getState('filter.orderstatus');
        $id .= ':' . $this->getState('filter.paymentstatus');
        $id .= ':' . $this->getState('filter.shippingstatus');

        return parent::getStoreId($id);
    }
}
