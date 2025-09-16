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

class EventgalleryLibraryFactoryServicelineitem extends EventgalleryLibraryFactoryLineitem
{

    /**
     * name of the sql table like #__foobar
     */
    protected $_tablename = '#__eventgallery_servicelineitem';

    /**
     * @param $id
     * @return EventgalleryLibraryServicelineitem
     */
    public function getLineItemById($id)
    {
        $db = JFactory::getDbo();
        $query = $db->getQuery(true);
        $query->select('*');
        $query->from($db->qn($this->_tablename));
        $query->where('id=' . $db->quote($id));
        $db->setQuery($query);
        $lineItem = $db->loadObject();
        $lineItem->table = $this->_tablename;

        return new EventgalleryLibraryServicelineitem($lineItem);
    }

    /**
     * @param $id
     * @return array
     */
    public function getLineItemsByLineItemContainerId($id) {
        $db = JFactory::getDbo();
        $query = $db->getQuery(true);
        $query->select('*');
        $query->from($db->qn($this->_tablename));
        $query->where('lineitemcontainerid = ' . $db->quote($id));
        $query->order('id');

        $db->setQuery($query);

        $dbLineItems = $db->loadObjectList();

        $lineitems = Array();
        foreach ($dbLineItems as $dbLineItem) {
            array_push($lineitems, new EventgalleryLibraryServicelineitem($dbLineItem));
        }

        return $lineitems;
    }

    /**
     * @param $lineitemcontainerid
     * @param EventgalleryLibraryServicelineitem $lineitem
     *
     * @return EventgalleryLibraryServicelineitem
     */
    public function copyLineItem($lineitemcontainerid, $lineitem) {

        $data = get_object_vars($lineitem->_getInternalDataObject());
        unset($data['id']);
        $data['lineitemcontainerid'] = $lineitemcontainerid;
        $item = $this->store($data, 'Servicelineitem');

        return new EventgalleryLibraryServicelineitem($item);
    }


    /**
     * @param int $lineitemcontainerid
     * @param EventgalleryLibraryMethodsMethod $method
     * @return EventgalleryLibraryServicelineitem
     */
    public function createLineitem($lineitemcontainerid, $method) {

        $quantity = 1;

        $item = array(
            'lineitemcontainerid' => $lineitemcontainerid,
            'quantity' => $quantity,
            'singleprice' => $method->getPrice()->getAmount(),
            'price' => $quantity * $method->getPrice()->getAmount(),
            'taxrate' => $method->getTaxrate(),
            'currency' => $method->getPrice()->getCurrency(),
            'methodid' => $method->getId(),
            'type' => $method->getTypeCode(),
            'name' => $method->getName()
        );

        $item = $this->store($item, 'Servicelineitem');
        return new EventgalleryLibraryServicelineitem($item);
    }

    /**
     * Deletes all service line items of a given type from the given Lineitemcontainer
     *
     * @param $id
     * @param $methodtypeid
     */
    public function deleteMethodTypeFromLineitemContainer($id, $methodtypeid)
    {
        $db = $this->db;
        $query = $db->getQuery(true);
        $query->delete('#__eventgallery_servicelineitem');
        $query->where('type=' . $db->quote($methodtypeid));
        $query->where('lineitemcontainerid=' . $db->quote($id));
        $db->setQuery($query);
        $db->execute();
    }
}
